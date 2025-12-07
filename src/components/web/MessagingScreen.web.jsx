// src/screens/MessagingScreen.web.jsx

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
  Alert, 
  Dimensions, // Add Dimensions for web responsiveness
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
// import { useTheme } from '../../theme/theme'; // For full app context

// -----------------------------------------------------------------
// 🎨 ENHANCED DISNEY-ESQUE STYLES & CONSTANTS (Game/Animated UI Look)
// -----------------------------------------------------------------
const BASE_SHADOW_COLOR = '#102A43'; 
const DEEP_SOFT_SHADOW = {
    // Web (boxShadow) equivalent: For main floating containers (Header, FAB)
    boxShadow: `0 15px 35px 0px rgba(16, 42, 67, 0.45)`, 
    // RN (shadow/elevation) fallback
    shadowColor: BASE_SHADOW_COLOR, 
    shadowOffset: { width: 0, height: 15 }, 
    shadowOpacity: 0.35, 
    shadowRadius: 25, 
    elevation: 12,
};
const SUBTLE_SHADOW = { 
    // Web (boxShadow) equivalent: For list items/badges (Soft Lift)
    boxShadow: `0 5px 12px 0px rgba(16, 42, 67, 0.15)`,
    // RN (shadow/elevation) fallback
    shadowColor: BASE_SHADOW_COLOR,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
}
const GENEROUS_RADIUS = 25; // Ultra-Rounded corners
const ITEM_RADIUS = 15; // Radius for list items

// --- VIBRANT COLORS (Enhanced Gamer Blue Scheme) ---
const COLORS = {
    primaryBlue: '#00BFFF',      // Deep Sky Blue (Vibrant Accent)
    secondaryBlue: '#1E90FF',    // Dodger Blue (FAB/Badge)
    lightAvatarBg: '#E0FFFF',    // Azure (Light BG for Read Avatars)
    background: '#F8F8FF',       // Ghost White (Soft Background)
    card: '#FFFFFF',             // Pure White for Cards
    textDark: '#191970',         // Midnight Blue (Dark text)
    textLight: '#4682B4',        // Steel Blue (Message grey)
    timeText: '#87CEEB',         // Sky Blue (Time/Secondary text)
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
    // 🛑 FIX: 'Chat' को 'FlatmateChat' में बदला गया ताकि यह App.js में परिभाषित रूट नाम से मेल खाए
    navigation.navigate('FlatmateChat', { chatId: chat.id, chatName: chat.name, listing: chat.listing });
  };
    
  const isUnread = chat.unread > 0;
    
  const avatarBg = isUnread ? COLORS.primaryBlue : COLORS.lightAvatarBg;
  const avatarTextColor = isUnread ? COLORS.card : COLORS.textDark; 

  return (
    <TouchableOpacity 
        style={[styles.chatRow, { backgroundColor: COLORS.card, ...SUBTLE_SHADOW }]} 
        onPress={handlePress} 
        activeOpacity={0.7}
    >
      
      {/* 1. Profile Picture Placeholder */}
      <View style={[styles.avatarPlaceholder, { backgroundColor: avatarBg }]}>
        <Text style={[styles.avatarText, { color: avatarTextColor }]}>{chat.name[0]}</Text>
      </View>
      
      {/* 2. Chat Details */}
      <View style={styles.chatDetails}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <Text style={[styles.chatTime, isUnread && { color: COLORS.primaryBlue, fontWeight: '700' }]}>{chat.time}</Text>
        </View>
        
        {/* Listing is highlighted with an icon */}
        <Text style={[styles.chatListing, { color: COLORS.primaryBlue }]}>
            <Icon name="home-outline" size={14} color={COLORS.primaryBlue} /> {chat.listing}
        </Text>

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
            
            {/* Unread Badge - Floating Token Look */}
            {isUnread && (
                <View style={[styles.unreadBadge, { backgroundColor: COLORS.secondaryBlue, ...SUBTLE_SHADOW }]}>
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
  const [isWeb] = useState(Dimensions.get('window').width > 768 || Platform.OS === 'web'); // Web check

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
    
  // Function: Mark All Chats as Read
  const markAllAsRead = () => {
    setChatConversations(prevChats => 
      prevChats.map(chat => 
        ({ ...chat, unread: 0 }) 
      )
    );
    Alert.alert("Success", "All messages marked as read.");
  };

  // Function: Three-dot Menu Handler
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
  
  // Active Chats count
  const unreadCount = chatConversations.reduce((acc, chat) => acc + chat.unread, 0);

  // --- Dynamic Header Renderer ---
  const renderHeader = () => {
    if (isSearching) {
        return (
            // Floating Search Bar with Deep Shadow
            <View style={[styles.searchHeader, { backgroundColor: COLORS.card, ...DEEP_SOFT_SHADOW }]}>
                {/* Back Arrow to close search */}
                <TouchableOpacity onPress={handleSearchToggle} style={styles.searchButton}>
                    <Icon name="arrow-back" size={24} color={COLORS.primaryBlue} />
                </TouchableOpacity>
                
                {/* Search Input Field - Neomorphic Inset Look */}
                <TextInput
                    style={[
                        styles.searchInput, 
                        { 
                            color: COLORS.textDark, 
                            backgroundColor: COLORS.background,
                            // Neomorphic inset box shadow
                            boxShadow: `inset 0 2px 4px rgba(0,0,0,0.1), inset 0 -2px 4px rgba(255,255,255,0.7)`, 
                            borderRadius: ITEM_RADIUS,
                            paddingHorizontal: 15,
                        }
                    ]}
                    placeholder="Search messages..."
                    placeholderTextColor={COLORS.textLight}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus={true} 
                />
            </View>
        );
    }

    // Default Header - Floating Header
    return (
        <View style={[styles.header, { backgroundColor: COLORS.card, ...DEEP_SOFT_SHADOW }]}>
            <Text style={styles.headerTitle}>
                Messages 
                {unreadCount > 0 && 
                    <Text style={styles.unreadHeaderCount}> ({unreadCount})</Text>
                }
            </Text>
            <View style={styles.newChatButton}>
                {/* Search Icon triggers the toggle */}
                <TouchableOpacity onPress={handleSearchToggle} style={[styles.searchButton, styles.iconButton]}>
                    <Icon name="search-outline" size={24} color={COLORS.primaryBlue} />
                </TouchableOpacity>
                {/* Ellipsis Icon triggers the menu */}
                <TouchableOpacity onPress={handleMenuPress} style={[styles.searchButton, styles.iconButton]}> 
                    <Icon name="ellipsis-vertical" size={24} color={COLORS.primaryBlue} style={{ marginLeft: 15 }} />
                </TouchableOpacity>
            </View>
        </View>
    );
  };
  // --- END: Dynamic Header Renderer ---
  
  // Set max width for web view
  const webContentStyle = isWeb ? styles.webContainer : {};

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Header */}
      {renderHeader()}

      {/* Chat List Wrapper (For Web Centering) */}
      <View style={[styles.listWrapper, webContentStyle]}>
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
        
            ListEmptyComponent={() => (
                <View style={styles.emptySearchContainer}>
                    <Text style={styles.emptySearchText}>
                        {searchQuery ? `No results found for "${searchQuery}"` : 'Start a new chat!'}
                    </Text>
                </View>
            )}
        />
      </View>
      
      {/* Floating Action Button (FAB) - Game UI Action Button */}
      {!isSearching && (
        <TouchableOpacity 
            style={[
                styles.fab, 
                { 
                    backgroundColor: COLORS.secondaryBlue, 
                    // FAB gets the deepest shadow, color adjusted for vibrant lift
                    ...DEEP_SOFT_SHADOW, 
                    boxShadow: `0 15px 35px 0px ${COLORS.secondaryBlue + 'AA'}`
                }
            ]} 
            onPress={() => alert('New Chat/Search functionality')}
        >
            <Icon name="chatbubble-ellipses-outline" size={26} color={COLORS.card} />
        </TouchableOpacity>
      )}
      
    </SafeAreaView>
  );
};

// स्टाइलशीट
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  
  // Web specific container to center content
  webContainer: {
    width: '100%',
    maxWidth: '98%', // Max width for a readable chat list on web
    alignSelf: 'center',
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20, // Add space below the floating header
  },
  listWrapper: {
      flex: 1,
  },
  
  // --- Floating Header ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderTopLeftRadius: GENEROUS_RADIUS,
    borderTopRightRadius: GENEROUS_RADIUS,
    borderBottomLeftRadius: GENEROUS_RADIUS,
    borderBottomRightRadius: GENEROUS_RADIUS,
    maxWidth:'94%',
    marginLeft:'3%',
    marginTop:'0.5vh',
    position: 'sticky', 
    top: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 30, 
    fontWeight: '900', 
    color: COLORS.textDark,
  },
  unreadHeaderCount: {
    fontSize: 20,
    color: COLORS.primaryBlue, 
    fontWeight: '700',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
      padding: 5,
  },
  iconButton: {
    padding: 10,
    borderRadius: 15, // Soft button look
  },
  
  // --- Search Header Styles ---
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomLeftRadius: GENEROUS_RADIUS,
    borderBottomRightRadius: GENEROUS_RADIUS,
    position: 'sticky', 
    top: 0,
    zIndex: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 18, 
    marginLeft: 15,
    marginRight: 10,
    outlineStyle: 'none', // ✅ FIX: For cleaner web input focus
  },
  
  // --- Chat List Item (Floating Card) ---
  chatRow: {
    flexDirection: 'row',
    padding: 20, 
    marginRight:20,
    marginLeft:20,
    alignItems: 'center',
    marginBottom: 10, 
    borderRadius: ITEM_RADIUS,
    borderWidth: 0, 
  },
  avatarPlaceholder: {
    width: 60, 
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    borderWidth: 2, 
    borderColor: COLORS.primaryBlue + '50', 
  },
  avatarText: {
    fontSize: 28, 
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
    marginBottom: 4,
  },
  chatName: {
    fontSize: 18, 
    fontWeight: '800', 
    color: COLORS.textDark,
  },
  chatTime: {
    fontSize: 14, 
    color: COLORS.timeText, 
    fontStyle: 'italic', 
  },
  chatListing: {
    fontSize: 14,
    color: COLORS.primaryBlue, 
    marginBottom: 6,
    fontWeight: '700',
  },
  chatFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 2,
  },
  lastMessage: {
    fontSize: 15, 
    color: COLORS.textLight, 
    flex: 1,
    paddingRight: 15,
  },
  lastMessageUnread: {
    color: COLORS.textDark,
    fontWeight: '800', 
  },
  unreadBadge: {
    borderRadius: 15, 
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 15,
    minWidth: 30, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: COLORS.card,
    fontSize: 13, 
    fontWeight: '900',
  },

  emptySearchContainer: {
      padding: 40,
      alignItems: 'center',
  },
  emptySearchText: {
      fontSize: 18,
      color: COLORS.textLight,
      textAlign: 'center',
  },
  
  // --- Floating Action Button (FAB) ---
  fab: {
      position: 'absolute',
      width: 60, 
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      right: 40, 
      bottom: 40, 
      borderRadius: 30,
      elevation: 6, 
  }
});

export default MessagingScreen;