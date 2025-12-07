// src/screens/ChatScreen.jsx

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback, // Long press ke liye
  Alert, // Reaction choice ke liye
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/theme'; 

// --- CUSTOM COLORS FOR WHATSAPP BLUE THEME ---
const CUSTOM_COLORS = {
    primaryBlue: '#007AFF',
    secondaryBlue: '#4A90E2',
    otherBubble: '#E5E5EA',
    chatBackground: '#F0F4F7',
    textDark: '#1C1C1E',
    textLight: '#8A8A8E',
    replyBar: '#D0D0D5',
    replyAccent: '#0055AA',
    reactionBadge: '#FFFFFF',
};
// --- END CUSTOM COLORS ---


// Dummy Message Data (reactions field ke saath)
const initialMessages = [
    { 
        id: 'm5', 
        text: 'I confirmed. Friday at 4 PM works best for the viewing.', 
        sender: 'other', 
        time: '11:15 AM',
        reactions: { '👍': ['u1', 'u2'] } // u1 = me, u2 = other
    },
    { 
        id: 'm4', 
        text: 'That sounds promising! Can we meet at the site this Saturday around 11 AM?', 
        sender: 'me', 
        time: '11:05 AM', 
        repliedTo: 'm3',
        reactions: { '😂': ['u1'] }
    },
    { 
        id: 'm3', 
        text: 'The viewing is scheduled for Friday afternoon. Let me confirm the exact time for you.', 
        sender: 'other', 
        time: '10:30 AM',
        reactions: {} 
    },
    { id: 'm2', text: 'Yes, it is! When are you planning to move?', sender: 'other', time: '10:30 AM', reactions: {} },
    { id: 'm1', text: 'Hi Priya! I saw your listing for the 2BHK. Is it still available?', sender: 'me', time: '10:28 AM', reactions: { '❤️': ['u2'] } },
];

// कॉम्पोनेंट: व्यक्तिगत मैसेज बबल (MODIFIED: onMessageReact ab long press par trigger hoga)
const MessageBubble = ({ 
    message, 
    onLongPressMessageForReaction, // New prop for Long Press
    onPressReplyButton, // New prop for Reply Button
    repliedMessageText, 
    chatName 
}) => {
    const isMyMessage = message.sender === 'me';
    
    // Bubble colors based on sender
    const bubbleColor = isMyMessage ? CUSTOM_COLORS.primaryBlue : CUSTOM_COLORS.otherBubble;
    const textColor = isMyMessage ? '#FFFFFF' : CUSTOM_COLORS.textDark;
    const timeColor = isMyMessage ? '#FFFFFF99' : CUSTOM_COLORS.textLight;
    const replyAccentColor = message.repliedTo ? CUSTOM_COLORS.replyAccent : CUSTOM_COLORS.secondaryBlue;
    const repliedTextColor = isMyMessage ? '#FFFFFF' : CUSTOM_COLORS.textDark;
    
    // --- Reaction logic inside Bubble ---
    const renderReactions = () => {
        if (!message.reactions || Object.keys(message.reactions).length === 0) return null;
        
        const reactionElements = [];
        
        Object.entries(message.reactions)
            .sort(([, usersA], [, usersB]) => usersB.length - usersA.length)
            .slice(0, 3) 
            .forEach(([emoji, users]) => {
                reactionElements.push(
                    <View key={emoji} style={styles.reactionPill}>
                        <Text style={styles.reactionEmoji}>{emoji}</Text>
                        {users.length > 1 && <Text style={styles.reactionCount}>{users.length}</Text>}
                    </View>
                );
            });
        
        return (
            <View style={[styles.reactionsBadge, isMyMessage ? styles.myReactionsBadge : styles.otherReactionsBadge]}>
                {reactionElements}
            </View>
        );
    };
    // --- End Reaction logic ---

    return (
        <View style={[
            styles.messageContainer,
            isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
        ]}>
            {/* The main chat bubble component */}
            {/* Long Press ab Reaction Trigger karega */}
            <TouchableWithoutFeedback onLongPress={() => onLongPressMessageForReaction(message)}>
                <View style={[
                    styles.messageBubble,
                    { 
                        backgroundColor: bubbleColor,
                    },
                    isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble
                ]}>
                    
                    {/* --- Reply Preview Card --- */}
                    {message.repliedTo && repliedMessageText && (
                        <View style={[styles.replyCard, { backgroundColor: isMyMessage ? '#FFFFFF30' : CUSTOM_COLORS.replyBar }]}>
                            <View style={[styles.replyAccentLine, { backgroundColor: replyAccentColor }]} />
                            <View style={styles.replyContent}>
                                <Text style={[styles.replySender, { color: replyAccentColor }]} numberOfLines={1}>
                                    {message.repliedToSender === 'me' ? 'You' : chatName}
                                </Text>
                                <Text style={[styles.replyText, { color: repliedTextColor }]} numberOfLines={2}>
                                    {repliedMessageText}
                                </Text>
                            </View>
                        </View>
                    )}
                    {/* --- End Reply Preview Card --- */}

                    <Text style={{ color: textColor, fontSize: 15, marginTop: message.repliedTo ? 5 : 0 }}>
                        {message.text}
                    </Text>
                    <Text style={[styles.time, { color: timeColor }]}>
                        {message.time}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
            
            {/* --- Reply Button (Quick access) --- */}
            <TouchableOpacity 
                style={[styles.replyButton, isMyMessage ? styles.myReplyButton : styles.otherReplyButton]}
                onPress={() => onPressReplyButton(message)} // Pressing this triggers Reply
            >
                <Icon name="arrow-undo-outline" size={18} color={CUSTOM_COLORS.textLight} />
            </TouchableOpacity>
            
            {/* Reactions Badge */}
            {renderReactions()}
        </View>
    );
};

// मुख्य चैट स्क्रीन (MODIFIED)
const ChatScreen = ({ route, navigation }) => {
    const { chatName, listing } = route.params; 
    const { colors } = useTheme(); 
    
    const [messages, setMessages] = useState(initialMessages);
    const [inputText, setInputText] = useState('');
    const [repliedMessage, setRepliedMessage] = useState(null);

    // Helper function to find message text by ID
    const getMessageDetailsById = (id) => {
        const msg = messages.find(m => m.id === id);
        if (!msg) return { text: '[Message Not Found]', sender: 'other', time: '' };
        
        const senderName = msg.sender === 'me' ? 'You' : chatName;
        
        return {
            text: msg.text, 
            sender: msg.sender, 
            chatName: senderName,
            time: msg.time,
        };
    };
    
    // --- Handler: Toggle Reaction ---
    const handleToggleReaction = (messageId, emoji) => {
        const currentUserId = 'u1'; // Current user ID ('me')

        setMessages(prevMessages => 
            prevMessages.map(msg => {
                if (msg.id !== messageId) return msg;

                const newReactions = { ...msg.reactions };
                
                if (!newReactions[emoji]) {
                    newReactions[emoji] = [];
                }
                
                const userIndex = newReactions[emoji].indexOf(currentUserId);
                
                if (userIndex > -1) {
                    // Remove reaction (toggle off)
                    newReactions[emoji].splice(userIndex, 1);
                    if (newReactions[emoji].length === 0) {
                        delete newReactions[emoji];
                    }
                } else {
                    // Add reaction (toggle on)
                    newReactions[emoji].push(currentUserId);
                }
                
                return { ...msg, reactions: newReactions };
            })
        );
    };
    
    // --- NEW Handler: Long Press for Reaction Picker ---
    const handleLongPressForReaction = (message) => {
        const availableReactions = ['👍', '❤️', '😂', '🔥', '😢', '🙏'];
        
        // Convert available reactions to Alert button format
        const reactionButtons = availableReactions.map(emoji => ({
            text: emoji,
            onPress: () => handleToggleReaction(message.id, emoji),
        }));
        
        // Add a Cancel button
        reactionButtons.push({
            text: 'Cancel',
            style: 'cancel',
        });
        
        // Show an Alert (Simulating an Action Sheet/Picker)
        Alert.alert(
            'React to Message',
            'Choose an emoji reaction:',
            reactionButtons,
            { cancelable: true }
        );
    };
    
    // --- Handler: Press Reply Button ---
    const handlePressReplyButton = (message) => {
        setRepliedMessage({
            id: message.id,
            text: message.text,
            sender: message.sender,
            chatName: message.sender === 'me' ? 'You' : chatName,
        });
    };
    
    // --- Handler: Clear Reply ---
    const handleClearReply = () => {
        setRepliedMessage(null);
    };

    // --- Modified Handler: Send Message ---
    const handleSend = () => {
        if (inputText.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                text: inputText.trim(),
                sender: 'me',
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                repliedTo: repliedMessage ? repliedMessage.id : undefined,
                repliedToSender: repliedMessage ? repliedMessage.sender : undefined,
                repliedToChatName: repliedMessage ? repliedMessage.chatName : undefined,
                reactions: {},
            };
            setMessages(prev => [newMessage, ...prev]); 
            setInputText('');
            handleClearReply();
        }
    };
    
    const renderHeader = () => (
        <View style={[styles.header, { backgroundColor: CUSTOM_COLORS.primaryBlue }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {chatName}
                </Text>
                {listing && (
                    <Text style={styles.headerSubtitle} numberOfLines={1}>
                        Listing: {listing}
                    </Text>
                )}
            </View>
            
            <TouchableOpacity style={styles.headerButton}>
                <Icon name="call-outline" size={24} color="#FFFFFF" style={{ marginRight: 15 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
                <Icon name="ellipsis-vertical" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );

    // --- Reply Preview Bar ---
    const ReplyPreview = () => {
        if (!repliedMessage) return null;
        
        const sender = repliedMessage.chatName; 

        return (
            <View style={[styles.replyPreviewContainer, { backgroundColor: CUSTOM_COLORS.chatBackground, borderTopColor: CUSTOM_COLORS.otherBubble }]}>
                <View style={styles.replyPreviewContent}>
                    <View style={[styles.replyAccentLine, { backgroundColor: CUSTOM_COLORS.replyAccent }]} />
                    <View style={styles.replyContent}>
                        <Text style={[styles.replySender, { color: CUSTOM_COLORS.replyAccent }]} numberOfLines={1}>
                            {sender}
                        </Text>
                        <Text style={[styles.replyText, { color: CUSTOM_COLORS.textDark }]} numberOfLines={1}>
                            {repliedMessage.text}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity onPress={handleClearReply} style={styles.replyClearButton}>
                    <Icon name="close-circle" size={24} color={CUSTOM_COLORS.textLight} />
                </TouchableOpacity>
            </View>
        );
    };


    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: CUSTOM_COLORS.primaryBlue }]}>
             {renderHeader()}

            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View style={{ flex: 1, backgroundColor: CUSTOM_COLORS.chatBackground }}>
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            const repliedMessageDetails = item.repliedTo ? getMessageDetailsById(item.repliedTo) : null;
                            return (
                                <MessageBubble 
                                    message={item} 
                                    onLongPressMessageForReaction={handleLongPressForReaction} // LONG PRESS = REACTION
                                    onPressReplyButton={handlePressReplyButton}             // ICON PRESS = REPLY
                                    repliedMessageText={repliedMessageDetails ? repliedMessageDetails.text : null}
                                    chatName={chatName}
                                />
                            );
                        }}
                        contentContainerStyle={styles.messageListContainer}
                        inverted
                    />
                </View>
                
                <ReplyPreview />

                {/* Input Bar */}
                <View style={[styles.inputContainer, { backgroundColor: CUSTOM_COLORS.chatBackground }]}>
                    <TouchableOpacity style={styles.attachButton}>
                         <Icon name="attach" size={24} color={CUSTOM_COLORS.secondaryBlue} />
                    </TouchableOpacity>

                    <TextInput
                        style={[styles.input, { backgroundColor: '#FFFFFF', color: CUSTOM_COLORS.textDark, borderColor: CUSTOM_COLORS.otherBubble }]}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        placeholderTextColor={CUSTOM_COLORS.textLight}
                        multiline
                    />
                    <TouchableOpacity 
                        style={[styles.sendButton, { backgroundColor: CUSTOM_COLORS.primaryBlue }]} 
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <Icon name="send" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// --- Stylesheet for Chat Screen ---
const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    keyboardAvoidingView: { flex: 1 },
    
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        height: 60,
    },
    headerButton: {
        padding: 5,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#FFFFFF99',
        textAlign: 'center',
    },

    // Message List
    messageListContainer: {
        paddingHorizontal: 8,
        paddingVertical: 10,
    },
    messageContainer: {
        marginVertical: 4,
        maxWidth: '85%',
        position: 'relative', 
    },
    myMessageContainer: {
        alignSelf: 'flex-end',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
    },
    messageBubble: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 2,
    },
    myMessageBubble: {
        borderBottomRightRadius: 2, 
    },
    otherMessageBubble: {
        borderBottomLeftRadius: 2, 
    },
    time: {
        fontSize: 10,
        alignSelf: 'flex-end',
        marginTop: 3,
        marginLeft: 8,
    },
    
    // --- REPLY CARD INSIDE BUBBLE ---
    replyCard: {
        flexDirection: 'row',
        padding: 8,
        marginBottom: 5,
        borderRadius: 8,
        overflow: 'hidden',
    },
    replyAccentLine: {
        width: 4,
        borderRadius: 2,
        marginRight: 8,
    },
    replyContent: {
        flex: 1,
    },
    replySender: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    replyText: {
        fontSize: 12,
    },
    
    // --- REPLY PREVIEW BAR (Above Input) ---
    replyPreviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
    },
    replyPreviewContent: {
        flex: 1,
        flexDirection: 'row',
        paddingRight: 10,
    },
    replyClearButton: {
        padding: 5,
    },
    
    // --- NEW: REPLY BUTTON STYLES (Previously Reaction Button) ---
    replyButton: { // Ab yeh Reply ka icon hai
        position: 'absolute',
        top: 0,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
        zIndex: 1,
    },
    myReplyButton: {
        right: '100%',
        marginRight: 5,
    },
    otherReplyButton: {
        left: '100%',
        marginLeft: 5,
    },

    // --- REACTION BADGE STYLES ---
    reactionsBadge: {
        position: 'absolute',
        bottom: -10,
        flexDirection: 'row',
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 12,
        backgroundColor: CUSTOM_COLORS.reactionBadge,
        borderWidth: 1,
        borderColor: CUSTOM_COLORS.chatBackground,
        elevation: 3,
        zIndex: 2,
    },
    myReactionsBadge: {
        right: 0,
    },
    otherReactionsBadge: {
        left: 0,
    },
    reactionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 1,
    },
    reactionEmoji: {
        fontSize: 12,
    },
    reactionCount: {
        fontSize: 10,
        marginLeft: 2,
        color: CUSTOM_COLORS.textDark,
        fontWeight: 'bold',
    },
    // --- END REACTION STYLES ---

    // Input Bar
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    attachButton: {
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    input: {
        flex: 1,
        maxHeight: 100,
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 16,
        marginHorizontal: 5,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Platform.OS === 'ios' ? 0 : 2, 
        marginLeft: 5,
    },
});

export default ChatScreen;