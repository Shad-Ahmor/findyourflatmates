// src/screens/MessagingScreen.jsx

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList,
  TouchableOpacity,
  Platform,
  TextInput, 
  Alert, // NEW: Alert for simulating Action Sheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

// --- WHATSAPP-STYLE COLORS (BLUE) ---
const COLORS = {
    primaryBlue: '#007AFF',      // Vibrant Blue (Main Theme/Accent)
    secondaryBlue: '#4A90E2',    // Lighter Accent Blue (FAB)
    lightAvatarBg: '#EAF3FF',    // Very Light Blue for Read Avatars
    background: '#FFFFFF',
    textDark: '#1C1C1E',         // Dark text
    textLight: '#707070',        // Message grey
    timeText: '#8A8A8E',         // Time/Secondary text
    separator: '#EDEDED',
};
// --- END COLORS ---


// डमी चैट डेटा 
const initialChatConversations = [
  { 
    id: 'c1', 
    name: 'Priya Sharma', 
    listing: '2BHK Flat - Andheri', 
    lastMessage: 'Sure, when can we schedule a viewing?', 
    time: '10:30 AM', 
    unread: 2 
  },
  { 
    id: 'c2', 
    name: 'Rohit Verma', 
    listing: 'Flatmate - Bandra', 
    lastMessage: 'My current lease ends next month.', 
    time: 'Yesterday', 
    unread: 0 
  },
  { 
    id: 'c3', 
    name: 'Suresh Housing Agency', 
    listing: 'PG - Dadar', 
    lastMessage: 'We have updated photos for the room.', 
    time: '2 days ago', 
    unread: 5 
  },
  { 
    id: 'c4', 
    name: 'Deepak T.', 
    listing: 'Luxury Villa - Lonavala', 
    lastMessage: 'Received your offer. Let me check with the owner.', 
    time: '1/11/2025', 
    unread: 1 
  },
  { 
    id: 'c5', 
    name: 'The Property Owner', 
    listing: 'Studio - Navi Mumbai', 
    lastMessage: 'The deposit is negotiable. Call me.', 
    time: '31/10/2025', 
    unread: 0 
  },
  { 
    id: 'c6', 
    name: 'Pooja K.', 
    listing: '1BHK - Malad', 
    lastMessage: 'Can we finalize the rental agreement tomorrow?', 
    time: '5:00 PM', 
    unread: 0 
  },
  { 
    id: 'c7', 
    name: 'Anjali & Team', 
    listing: 'Commercial Office - BKC', 
    lastMessage: 'Your inquiry regarding space C-40 has been noted.', 
    time: '4 days ago', 
    unread: 3 
  },
  { 
    id: 'c8', 
    name: 'Rahul S.', 
    listing: 'Land Parcel - Karjat', 
    lastMessage: 'The papers are clear, waiting for your confirmation.', 
    time: '1 week ago', 
    unread: 0 
  },
  { 
    id: 'c9', 
    name: 'Housing Society Mgmt', 
    listing: 'Maintenance Fees', 
    lastMessage: 'Please submit the pending documents ASAP.', 
    time: '7:00 AM', 
    unread: 1 
  },
  { 
    id: 'c10', 
    name: 'Mr. D\'Souza', 
    listing: '3BHK Penthouse - Worli', 
    lastMessage: 'I will be out of town until next week.', 
    time: 'Yesterday', 
    unread: 0 
  },
  { 
    id: 'c11', 
    name: 'Customer Support', 
    listing: 'Account Verification', 
    lastMessage: 'Your profile is under review.', 
    time: '1/11/2025', 
    unread: 0 
  },
  { 
    id: 'c12', 
    name: 'Broker Connect', 
    listing: 'New Leads', 
    lastMessage: 'We have 3 new leads matching your listing.', 
    time: '2:00 PM', 
    unread: 4 
  },
];


// कॉम्पोनेंट: व्यक्तिगत चैट रो (Row)
const ChatListItem = ({ chat, navigation, markAsRead }) => {

  const handlePress = () => {
    markAsRead(chat.id); 
    navigation.navigate('Chat', { chatId: chat.id, chatName: chat.name, listing: chat.listing });
  };
    
  const isUnread = chat.unread > 0;
    
  const avatarBg = isUnread ? COLORS.primaryBlue : COLORS.lightAvatarBg;
  const avatarTextColor = isUnread ? COLORS.background : COLORS.primaryBlue;

  return (
    <TouchableOpacity style={styles.chatRow} onPress={handlePress} activeOpacity={0.7}>
      
      {/* 1. Profile Picture Placeholder */}
      <View style={[styles.avatarPlaceholder, { backgroundColor: avatarBg }]}>
        <Text style={[styles.avatarText, { color: avatarTextColor }]}>{chat.name[0]}</Text>
      </View>
      
      {/* 2. Chat Details */}
      <View style={styles.chatDetails}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <Text style={[styles.chatTime, isUnread && { color: COLORS.primaryBlue }]}>{chat.time}</Text>
        </View>
        <Text style={styles.chatListing}>{chat.listing}</Text>

        <View style={styles.chatFooter}>
            <Text 
                style={[
                    styles.lastMessage, 
                    isUnread && styles.lastMessageUnread
                ]} 
                numberOfLines={1}
            >
                {chat.lastMessage}
            </Text>
            
            {/* WhatsApp style Unread Badge (Blue circle) */}
            {isUnread && (
                <View style={[styles.unreadBadge, { backgroundColor: COLORS.primaryBlue }]}>
                    <Text style={styles.unreadText}>{chat.unread}</Text>
                </View>
            )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// मुख्य स्क्रीन कॉम्पोनेंट
const MessagingScreen = ({ navigation }) => {
    
  const [chatConversations, setChatConversations] = useState(initialChatConversations);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Filtering Logic
  const filteredConversations = chatConversations.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.listing.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Toggle Search Bar visibility
  const handleSearchToggle = () => {
      if (isSearching) { 
          setSearchQuery('');
      }
      setIsSearching(prev => !prev);
  };
    
  // Function: Chat ko 'Read' mark karne ke liye
  const markChatAsRead = (chatId) => {
    setChatConversations(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  };
    
  // NEW: Mark All Chats as Read function
  const markAllAsRead = () => {
    setChatConversations(prevChats => 
      prevChats.map(chat => 
        ({ ...chat, unread: 0 }) 
      )
    );
    Alert.alert("Success", "All messages marked as read.");
  };

  // NEW: Three-dot Menu Handler
  const handleMenuPress = () => {
    Alert.alert(
      "Menu Options",
      "Choose an action:",
      [
        {
          text: "Mark all as read",
          onPress: markAllAsRead,
        },
        {
          text: "Settings",
          onPress: () => Alert.alert("Settings", "Settings screen would open here."),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };
  // END NEW HANDLERS

  // Active Chats count
  const unreadCount = chatConversations.reduce((acc, chat) => acc + chat.unread, 0);

  // --- Dynamic Header Renderer ---
  const renderHeader = () => {
    if (isSearching) {
        return (
            <View style={[styles.searchHeader, { backgroundColor: COLORS.background }]}>
                {/* Back Arrow to close search */}
                <TouchableOpacity onPress={handleSearchToggle} style={styles.searchButton}>
                    <Icon name="arrow-back" size={24} color={COLORS.primaryBlue} />
                </TouchableOpacity>
                
                {/* Search Input Field */}
                <TextInput
                    style={[styles.searchInput, { color: COLORS.textDark }]}
                    placeholder="Search messages..."
                    placeholderTextColor={COLORS.textLight}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus={true} 
                />
            </View>
        );
    }

    // Default Header
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>
                Messages 
                {unreadCount > 0 && 
                    <Text style={styles.unreadHeaderCount}> ({unreadCount})</Text>
                }
            </Text>
            <View style={styles.newChatButton}>
                {/* Search Icon triggers the toggle */}
                <TouchableOpacity onPress={handleSearchToggle} style={styles.searchButton}>
                    <Icon name="search-outline" size={24} color={COLORS.primaryBlue} />
                </TouchableOpacity>
                {/* Ellipsis Icon triggers the menu */}
                <TouchableOpacity onPress={handleMenuPress} style={styles.searchButton}> 
                    <Icon name="ellipsis-vertical" size={24} color={COLORS.primaryBlue} style={{ marginLeft: 15 }} />
                </TouchableOpacity>
            </View>
        </View>
    );
  };
  // --- END: Dynamic Header Renderer ---


  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Header (Now rendered dynamically) */}
      {renderHeader()}

      {/* Chat List */}
      <FlatList
        data={filteredConversations} 
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatListItem 
            chat={item} 
            navigation={navigation} 
            markAsRead={markChatAsRead}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
            <View style={styles.emptySearchContainer}>
                <Text style={styles.emptySearchText}>
                    {searchQuery ? `No results found for "${searchQuery}"` : 'Start a new chat!'}
                </Text>
            </View>
        )}
      />
      
      {/* Floating Action Button (FAB) for New Chat - Hide FAB during search */}
      {!isSearching && (
        <TouchableOpacity style={[styles.fab, { backgroundColor: COLORS.secondaryBlue }]} onPress={() => alert('New Chat/Search functionality')}>
            <Icon name="chatbubble-ellipses-outline" size={26} color={COLORS.background} />
        </TouchableOpacity>
      )}
      
    </SafeAreaView>
  );
};

// स्टाइलशीट
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  
  // --- Default Header ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    paddingBottom: 10,
    backgroundColor: COLORS.background, 
  },
  headerTitle: {
    fontSize: 28, 
    fontWeight: '900', 
    color: COLORS.textDark,
  },
  unreadHeaderCount: {
    fontSize: 18,
    color: COLORS.primaryBlue, 
    fontWeight: '600',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
      padding: 5,
  },
  
  // --- Search Header Styles ---
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 17,
    marginLeft: 10,
    marginRight: 10,
  },
  
  // --- Chat List Item ---
  chatRow: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  avatarPlaceholder: {
    width: 55, 
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24, 
    fontWeight: 'bold',
  },
  chatDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '700', 
    color: COLORS.textDark,
  },
  chatTime: {
    fontSize: 12,
    color: COLORS.timeText, 
  },
  chatListing: {
    fontSize: 13,
    color: COLORS.primaryBlue, 
    marginBottom: 4,
    fontWeight: '600',
  },
  chatFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.textLight, 
    flex: 1,
    paddingRight: 10,
  },
  lastMessageUnread: {
    color: COLORS.textDark,
    fontWeight: '700',
  },
  unreadBadge: {
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginLeft: 10,
    minWidth: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: COLORS.background,
    fontSize: 11,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.separator,
    marginLeft: 85, 
  },
  emptySearchContainer: {
      padding: 20,
      alignItems: 'center',
  },
  emptySearchText: {
      fontSize: 16,
      color: COLORS.textLight,
      textAlign: 'center',
  },
  
  // --- Floating Action Button (FAB) ---
  fab: {
      position: 'absolute',
      width: 55,
      height: 55,
      alignItems: 'center',
      justifyContent: 'center',
      right: 20,
      bottom: 20,
      borderRadius: 30,
      elevation: 6, 

  }
});

export default MessagingScreen;