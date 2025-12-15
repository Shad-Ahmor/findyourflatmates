// src/screens/ChatScreen.web.jsx

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  Alert, 
  Dimensions, 
} from 'react-native';
import { G } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
// import { useTheme } from '../theme/theme'; // Removed for standalone file, replaced with constant colors

// -----------------------------------------------------------------
// 🎨 ENHANCED DISNEY-ESQUE STYLES & CONSTANTS (Game/Animated UI Look)
// -----------------------------------------------------------------
const BASE_SHADOW_COLOR = '#102A43'; 
const CONTENT_HORIZONTAL_PADDING = 25; // Standard padding for content inside full-width bars

const DEEP_SOFT_SHADOW = {
    // Web (boxShadow) equivalent: For main floating containers (Header, Input Bar)
    boxShadow: `0 15px 35px 0px rgba(16, 42, 67, 0.45)`, 
    // RN (shadow/elevation) fallback
    shadowColor: BASE_SHADOW_COLOR, 
    shadowOffset: { width: 0, height: 15 }, 
    shadowOpacity: 0.35, 
    shadowRadius: 25, 
    elevation: 12,
};
const SUBTLE_SHADOW = { 
    // Web (boxShadow) equivalent: For message bubbles (Soft Lift)
    boxShadow: `0 3px 8px 0px rgba(16, 42, 67, 0.1)`,
    // RN (shadow/elevation) fallback
    shadowColor: BASE_SHADOW_COLOR,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
}
const INPUT_SHADOW_INSET = {
    // Neomorphic inset look for input field
    boxShadow: `inset 0 2px 4px rgba(0,0,0,0.1), inset 0 -2px 4px rgba(255,255,255,0.7)`,
}
const GENEROUS_RADIUS = 25; // Ultra-Rounded corners
const BUBBLE_RADIUS = 20; // Radius for message bubbles

// --- VIBRANT COLORS (Enhanced Gamer Blue Scheme) ---
const COLORS = {
    primaryBlue: '#1E90FF',      // Dodger Blue (My Message Bubble, Send Button)
    secondaryBlue: '#00BFFF',    // Deep Sky Blue (Header, Accent)
    otherBubble: '#E0FFFF',      // Azure (Other Bubble BG)
    chatBackground: '#F0F8FF',   // Alice Blue (Soft Chat BG)
    textDark: '#191970',         // Midnight Blue (Dark text)
    textLight: '#4682B4',        // Steel Blue (Time/Secondary text)
    replyBar: '#ADD8E6',         // Light Blue (Reply Preview BG)
    replyAccent: '#FF4500',      // Orange Red (Vibrant Accent for Reply Line)
    reactionBadge: '#FFFFFF',    // White (Reaction Badge BG)
    card: '#FFFFFF',             // Pure White
};
// --- END CUSTOM COLORS ---


// Dummy Message Data (reactions field ke saath)
const initialMessages = [
    { 
        id: 'm5', 
        text: 'I confirmed. Friday at 4 PM works best for the viewing.', 
        sender: 'other', 
        time: '11:15 AM',
        reactions: { '👍': ['u1', 'u2'] } 
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

// कॉम्पोनेंट: व्यक्तिगत मैसेज बबल 
const MessageBubble = ({ 
    message, 
    onLongPressMessageForReaction, 
    onPressReplyButton, 
    repliedMessageText, 
    chatName 
}) => {
    const isMyMessage = message.sender === 'me';
    
    // Bubble colors based on sender
    const bubbleColor = isMyMessage ? COLORS.primaryBlue : COLORS.otherBubble;
    const textColor = isMyMessage ? COLORS.card : COLORS.textDark;
    const timeColor = isMyMessage ? '#FFFFFF99' : COLORS.textLight;
    const replyAccentColor = message.repliedTo ? COLORS.replyAccent : COLORS.secondaryBlue;
    const repliedTextColor = isMyMessage ? COLORS.card : COLORS.textDark;
    
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
            // Added subtle shadow to the reaction badge for a 3D effect
            <View style={[
                styles.reactionsBadge, 
                isMyMessage ? styles.myReactionsBadge : styles.otherReactionsBadge,
                { ...SUBTLE_SHADOW, boxShadow: SUBTLE_SHADOW.boxShadow + ', 0 0 10px rgba(255, 255, 255, 0.5)' } // Enhanced subtle shadow
            ]}>
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
            <TouchableWithoutFeedback onLongPress={() => onLongPressMessageForReaction(message)}>
                <View style={[
                    styles.messageBubble,
                    { 
                        backgroundColor: bubbleColor,
                        ...SUBTLE_SHADOW // Apply soft shadow to the bubble
                    },
                    isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble
                ]}>
                    
                    {/* --- Reply Preview Card --- */}
                    {message.repliedTo && repliedMessageText && (
                        <View style={[styles.replyCard, { backgroundColor: isMyMessage ? COLORS.primaryBlue + '30' : COLORS.replyBar  , maxWidth:'90%'}]}>
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

                    <Text style={{ color: textColor, fontSize: 16, marginTop: message.repliedTo ? 5 : 0 }}>
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
                onPress={() => onPressReplyButton(message)} 
            >
                {/* Use a slightly different color for the icon */}
                <Icon name="arrow-undo-outline" size={18} color={COLORS.textLight} /> 
            </TouchableOpacity>
            
            {/* Reactions Badge */}
            {renderReactions()}
        </View>
    );
};

// मुख्य चैट स्क्रीन (MODIFIED)
const ChatScreen = ({ route, navigation }) => {
    const { chatName, listing } = route.params; 
    
    const [messages, setMessages] = useState(initialMessages);
    const [inputText, setInputText] = useState('');
    const [repliedMessage, setRepliedMessage] = useState(null);
    const [isWeb] = useState(Dimensions.get('window').width > 768 || Platform.OS === 'web');

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
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            
            const newMessage = {
                id: Date.now().toString(),
                text: inputText.trim(),
                sender: 'me',
                time: timeString,
                repliedTo: repliedMessage ? repliedMessage.id : undefined,
                // Include sender of replied message to show 'You' or 'Other' in reply preview
                repliedToSender: repliedMessage ? repliedMessage.sender : undefined, 
                reactions: {},
            };
            setMessages(prev => [newMessage, ...prev]); 
            setInputText('');
            handleClearReply();
        }
    };
    
    // --- Dynamic Header Renderer (Floating Card) ---
    const renderHeader = () => (
        <View style={[styles.header, { backgroundColor: COLORS.card, ...DEEP_SOFT_SHADOW }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                <Icon name="arrow-back" size={24} color="#4f4e4eff" />
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
                <Icon name="call-outline" size={24} color="#535151ff" style={{ marginRight: 15 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
                <Icon name="ellipsis-vertical" size={24} color="#504e4eff" />
            </TouchableOpacity>
        </View>
    );

    // --- Reply Preview Bar (Full Width, Content Constrained) ---
    const ReplyPreview = () => {
        if (!repliedMessage) return null;
        
        const sender = repliedMessage.chatName; 

        return (
            <View style={[styles.replyPreviewContainerFullWidth, { backgroundColor: COLORS.chatBackground }]}>
                {/* Constraint applied inside the full-width bar for content centering */}
                <View style={[styles.replyPreviewContentConstrained, innerWebContainerStyle]}>
                    <View style={styles.replyPreviewContent}>
                        <View style={[styles.replyAccentLine, { backgroundColor: COLORS.replyAccent }]} />
                        <View style={styles.replyContent}>
                            <Text style={[styles.replySender, { color: COLORS.replyAccent }]} numberOfLines={1}>
                                {sender}
                            </Text>
                            <Text style={[styles.replyText, { color: COLORS.textDark }]} numberOfLines={1}>
                                {repliedMessage.text}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleClearReply} style={styles.replyClearButton}>
                        <Icon name="close-circle" size={24} color={COLORS.textLight} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // Apply max width wrapper for web centering
    const innerWebContainerStyle = isWeb ? styles.constrainedWebArea : {};

    return (
        <SafeAreaView style={[styles.safeArea]}>
             {renderHeader()}

            {/* 1. Content Wrapper: Takes full width below header, holds everything */}
            <View style={styles.contentWrapper}>
                
                {/* 2. Scrollable Chat Content (Constrained Width) */}
                <View style={styles.chatScrollContainer}>
                    {/* The content inside the scroll area is constrained/centered */}
                    <View style={[{ flex: 1 }, innerWebContainerStyle]}> 
                        <FlatList
                            data={messages}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                const repliedMessageDetails = item.repliedTo ? getMessageDetailsById(item.repliedTo) : null;
                                return (
                                    <MessageBubble 
                                        message={item} 
                                        onLongPressMessageForReaction={handleLongPressForReaction} 
                                        onPressReplyButton={handlePressReplyButton}             
                                        repliedMessageText={repliedMessageDetails ? repliedMessageDetails.text : null}
                                        chatName={chatName}
                                    />
                                );
                            }}
                            contentContainerStyle={styles.messageListContainer}
                            inverted
                        />
                    </View>
                </View>
                
                {/* 3. Full-Width Reply Bar (Above Input) */}
                <ReplyPreview />

                {/* 4. Full-Width Input Bar (Fixed at bottom) */}
                <View style={[styles.inputContainerFullWidth, { backgroundColor: COLORS.card, ...DEEP_SOFT_SHADOW }]}>
                    {/* Input content is constrained/centered inside the full-width bar */}
                    <View style={[styles.inputContentConstrained, innerWebContainerStyle]}>
                        <TouchableOpacity style={styles.attachButton}>
                             <Icon name="attach" size={24} color={COLORS.secondaryBlue} />
                        </TouchableOpacity>

                        <TextInput
                            style={[
                                styles.input, 
                                { 
                                    backgroundColor: COLORS.chatBackground, 
                                    color: COLORS.textDark, 
                                    borderColor: COLORS.otherBubble,
                                    ...INPUT_SHADOW_INSET,
                                    outlineStyle: 'none',
                                }
                            ]}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Type a message..."
                            placeholderTextColor={COLORS.textLight}
                            multiline
                        />
                        <TouchableOpacity 
                            style={[styles.sendButton, { backgroundColor: COLORS.primaryBlue }]} 
                            onPress={handleSend}
                            disabled={!inputText.trim()}
                        >
                            <Icon name="send" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </SafeAreaView>
    );
};

// --- Stylesheet for Chat Screen ---
const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    
    // 1. Full-width wrapper below header
    contentWrapper: {
        flex: 1, // Takes all remaining vertical space
        backgroundColor: COLORS.chatBackground,
        
        // The header margin/top offset creates a gap between header and this contentWrapper
    },
    
    // 2. Full-width scroll container for chat bubbles
    chatScrollContainer: {
        flex: 1, 
        
    },
    
    // 3. Web specific constraint/centering applied to content inside full-width bars
    constrainedWebArea: {
        width: '100%',
        maxWidth: 700, // Max width for a readable chat list on web
        alignSelf: 'center', // Centers the content container
                maxWidth:'90%'

    },

    // Header (Floating Card Look - All corners rounded, moved from top edge)
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15, // Inner content padding
        paddingVertical: 12,
        height: 70, 
        // --- NEW Floating Card Styles ---
        borderRadius: GENEROUS_RADIUS, 
        marginHorizontal: 15, // Margin from sides
        marginTop: 15, // Margin from top edge
        position: 'sticky',
        top: 8, // Sticky position adjusted to match marginTop
        // --- END NEW Styles ---
        zIndex: 10,
        
    },
    headerButton: {
        padding: 5,
        color: '#535151cc',
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'flex-start', // Align title to left
        marginHorizontal: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: COLORS.textDark,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#535151cc',
        fontWeight: '500',
    },

    // Message List
    messageListContainer: {
        paddingVertical: 15, 
                maxWidth:'90%',
                            marginLeft: '40px'


    },
    messageContainer: {
        marginVertical: 6, 
        maxWidth: '95%',
        position: 'relative', 
        
    },
    myMessageContainer: {
        alignSelf: 'flex-end',
        marginRight: 10, 
        
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
        marginLeft: 10, 
    },
    messageBubble: {
        paddingHorizontal: 15, 
        paddingVertical: 10,
        borderRadius: BUBBLE_RADIUS,
        
    },
    myMessageBubble: {
        borderBottomRightRadius: 8, 
        
    },
    otherMessageBubble: {
        borderBottomLeftRadius: 8, 
    },
    time: {
        fontSize: 11,
        alignSelf: 'flex-end',
        marginTop: 3,
        marginLeft: 8,
        fontWeight: '500',
    },
    
    // --- REPLY CARD INSIDE BUBBLE ---
    replyCard: {
        flexDirection: 'row',
        padding: 10,
        marginBottom: 8,
        borderRadius: BUBBLE_RADIUS - 5,
        overflow: 'hidden',
        
    },
    replyAccentLine: {
        width: 5,
        borderRadius: 3,
        marginRight: 10,
    },
    replyContent: {
        flex: 1,
    },
    replySender: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
        
    },
    replyText: {
        fontSize: 13,
    },
    
    // --- FULL WIDTH BARS ---

    // Reply Preview Bar (The full background bar)
    replyPreviewContainerFullWidth: {
        width: '100%',
        borderTopWidth: 0,
        
    },
    // The content inside the full width bar (constrains and centers)
    replyPreviewContentConstrained: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: CONTENT_HORIZONTAL_PADDING, // Consistent padding
        paddingVertical: 12,
        
    },
    replyPreviewContent: {
        flex: 1,
        flexDirection: 'row',
        paddingRight: 10,
    },
    replyClearButton: {
        padding: 5,
        paddingHorizontal: 10,
        
    },
    
    // --- REPLY BUTTON STYLES (Floating Icon) ---
    replyButton: { 
        position: 'absolute',
        top: 0,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
        zIndex: 1,
        // Removed background color for cleaner look
        backgroundColor: 'transparent', 
        borderRadius: 15,
    },
    myReplyButton: {
        right: -30, 
    },
    otherReplyButton: {
        left: -30, 
    },

    // --- REACTION BADGE STYLES (Popping) ---
    reactionsBadge: {
        position: 'absolute',
        bottom: -10,
        flexDirection: 'row',
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 15,
        backgroundColor: COLORS.reactionBadge,
        borderWidth: 2,
        borderColor: COLORS.chatBackground,
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
        fontSize: 14, 
    },
    reactionCount: {
        fontSize: 11,
        marginLeft: 2,
        color: COLORS.textDark,
        fontWeight: '900', 
    },
    // --- END REACTION STYLES ---

    // Input Bar (The full background bar)
    inputContainerFullWidth: {
        width: '98%',
        paddingVertical: 12, 
        borderTopLeftRadius: GENEROUS_RADIUS,
        borderTopRightRadius: GENEROUS_RADIUS,
        borderBottomLeftRadius: GENEROUS_RADIUS,
        borderBottomRightRadius: GENEROUS_RADIUS,
        marginLeft:'1%',
        marginRight:'1%',
        zIndex: 10,
        marginBottom:10,
        paddingBottom:10
    },
    // The content inside the full width input bar (constrains and centers)
    inputContentConstrained: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: CONTENT_HORIZONTAL_PADDING, // Consistent padding
    },
    attachButton: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
        borderRadius: 22.5,
        marginRight: 5,
    },
    input: {
        flex: 1,
        maxHeight: 100,
        borderRadius: GENEROUS_RADIUS,
        borderWidth: 0, 
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 12,
        fontSize: 16,
        marginHorizontal: 5,
    },
    sendButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2, 
        marginLeft: 5,
    },
});

export default ChatScreen;