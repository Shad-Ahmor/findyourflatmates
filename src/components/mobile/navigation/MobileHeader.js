import React, { useState, useEffect, useRef } from 'react'; 
import { 
    Dimensions, 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Platform, 
    Modal, 
    Animated, 
    Easing,   
    Alert,    
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context'; 

// ✅ New Import: useAuth for logout functionality
import { useAuth } from '../../../context/AuthContext'; 

// Screens & Components
import WebHeader from '../../web/navigation/WebHeader.js'; 
import SearchScreen from '../HomeScreen.mobile.jsx';
import ListingFormScreen from '../ListingFormScreen.mobile.jsx';
import MessagingScreen from '../../../screens/MessagingScreen.jsx';
import ProfileScreen from '../../../screens/ProfileScreen.jsx'; 

// Import the new ChatScreen (MUST BE CREATED SEPARATELY)
import ChatScreen from '../../../screens/ChatScreen.jsx'; 

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const BREAKPOINT = 768;


// ======================================================
// 📌 DISNEY-ESQUE UI CONSTANTS (Vibrant, 3D, High-Impact)
// NOTE: Ideally these should be imported from src/theme/theme.js
// But since this file doesn't use useTheme(), we define the values here
// to ensure the visual style is applied correctly.
// ======================================================
const GENEROUS_RADIUS = 30; 
const BUTTON_RADIUS = 18; 
const VIBRANT_PRIMARY = '#FF3366'; // Striking Red-Pink
const ACCENT_COLOR_GOLD = '#FFD700'; // Gold for Coins

const DEEP_SOFT_SHADOW = {
    shadowColor: '#102A43', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.35, 
    shadowRadius: 15, 
    elevation: 12,
};
const SUBTLE_SHADOW = { 
    shadowColor: '#102A43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
}

// ======================================================
// 📌 MainTabs Component
// ======================================================

export default function MainTabs() { // Renamed from MobileHeader for clarity
  const { logout } = useAuth(); // ✅ useAuth hook to get logout function
  const [width, setWidth] = useState(Dimensions.get('window').width);
  const [coins, setCoins] = useState(100); 
  const [isDark, setIsDark] = useState(false); 
  
  // --- NEW STATE & ANIMATION FOR COIN MODAL ---
  const [isCoinModalVisible, setIsCoinModalVisible] = useState(false);
  const coinAnimation = useRef(new Animated.Value(0)).current;

  const startCoinAnimation = () => {
    setIsCoinModalVisible(true);
    Animated.timing(coinAnimation, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
    }).start();
  };

  const closeCoinModal = () => {
      Animated.timing(coinAnimation, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
      }).start(() => setIsCoinModalVisible(false));
  };

  const modalScale = coinAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
  });
  const modalOpacity = coinAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.5, 1],
  });
  // --- END NEW STATE & ANIMATION ---

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window: { width } }) => {
      setWidth(width);
    });
    return () => subscription?.remove();
  }, []);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Dynamic Theme Colors (Updated to match the Disney-esque theme from theme.js)
  const colors = {
    mode: isDark ? 'dark' : 'light',
    // Using the vibrant palette
    primary: VIBRANT_PRIMARY, 
    secondary: isDark ? '#00E5FF' : '#00C4CC',
    // Backgrounds for 3D effect
    background: isDark ? '#121212' : '#F8F8FF', // Main Screen Background
    card: isDark ? '#2D2D30' : '#FFFFFF',      // Floating Card/Header Background
    text: isDark ? '#fff' : '#121212',
    textSecondary: isDark ? '#B0B0B0' : '#6A6A6A', 
    white: '#fff',
  };

  const isMobile = width <= BREAKPOINT;

  // --- NESTED STACK FOR MESSAGING TAB (Allows ChatScreen to open with header) ---
  const MessagingStack = () => (
    <Stack.Navigator 
        initialRouteName="Conversations"
        screenOptions={{ 
            headerShown: false, 
        }}
    >
        <Stack.Screen name="Conversations" component={MessagingScreen} /> 
        
        <Stack.Screen 
            name="Chat" 
            component={ChatScreen} 
            options={{ headerShown: false }}
        /> 
    </Stack.Navigator>
  );

  // --- MOBILE HEADER COMPONENT (High-Impact 3D Floating Bar) ---
  const MobileHeader = () => {
      const themeIcon = colors.mode === 'dark' ? 'moon-sharp' : 'sunny-sharp';

      return (
        <SafeAreaView
          edges={['top']} 
          style={{ 
            backgroundColor: colors.background, 
            zIndex: 10,
            paddingBottom: 5, // Space for the shadow
          }}
        >
          <View 
            style={[
              styles.mobileHeader, 
              { 
                backgroundColor: colors.card,
                // 🌟 Floating 3D Card Effect
                ...DEEP_SOFT_SHADOW,
                borderRadius: GENEROUS_RADIUS, // Ultra-rounded corners
                marginHorizontal: 16, // To allow shadow to show
                marginTop: 5,
              }
            ]}
          >
            
            {/* 1. Logo (Vibrant) */}
            <Text 
              style={[
                styles.logo, 
                { 
                  color: VIBRANT_PRIMARY, 
                  textShadowColor: 'rgba(0, 0, 0, 0.2)', // Text shadow for depth
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }
              ]}
            >
              FlatMates
            </Text>

            {/* 2. Right Container: Theme Toggle, Coins, and Logout (3D Buttons) */}
            <View style={styles.rightActionsContainer}>
              
              {/* Day/Night Toggle (3D Circle) */}
              <TouchableOpacity 
                  onPress={toggleTheme} 
                  style={[
                    styles.headerButton, 
                    { 
                      backgroundColor: colors.background, 
                      borderRadius: BUTTON_RADIUS,
                      ...SUBTLE_SHADOW // Small button 3D lift
                    }
                  ]}
              >
                <Icon 
                    name={themeIcon} 
                    size={20} 
                    color={colors.mode === 'dark' ? ACCENT_COLOR_GOLD : VIBRANT_PRIMARY} 
                />
              </TouchableOpacity>

              {/* Coins/Points (Vibrant Gold Pill with 3D) */}
              <TouchableOpacity 
                style={[
                  styles.coinsContainer, 
                  { 
                    backgroundColor: ACCENT_COLOR_GOLD, 
                    borderRadius: BUTTON_RADIUS, 
                    ...SUBTLE_SHADOW // Small button 3D lift
                  }
                ]}
                onPress={startCoinAnimation} 
              >
                  {/* Wallet/Coin Icon */}
                  <Icon name="star" size={16} color={colors.white} style={{ marginRight: 2 }} />
                  <Text style={[styles.coinsText, { color: colors.white }]}>{coins}</Text>
              </TouchableOpacity>
              
              {/* ✅ LOGOUT BUTTON (3D Circle) */}
              <TouchableOpacity 
                  onPress={logout} 
                  style={[
                    styles.headerButton, 
                    { 
                      backgroundColor: colors.background, 
                      borderRadius: BUTTON_RADIUS,
                      ...SUBTLE_SHADOW // Small button 3D lift
                    }
                  ]}
              >
                <Icon name="log-out-outline" size={20} color={colors.primary} />
              </TouchableOpacity>

            </View>

          </View>
        </SafeAreaView>
      );
  };

  // --- COIN MODAL RENDERER (Playful Popup) ---
  const renderCoinModal = () => (
      <Modal
          visible={isCoinModalVisible}
          transparent={true}
          animationType="none" 
          onRequestClose={closeCoinModal}
      >
          <TouchableOpacity 
              style={styles.modalOverlay} 
              activeOpacity={1} 
              onPress={closeCoinModal} 
          >
              <Animated.View style={[
                  styles.coinModalContent, 
                  { 
                      backgroundColor: colors.card,
                      transform: [{ scale: modalScale }],
                      opacity: modalOpacity,
                      borderColor: VIBRANT_PRIMARY, // Primary border
                      borderRadius: GENEROUS_RADIUS - 5, // Ultra-rounded modal
                      ...DEEP_SOFT_SHADOW // 3D lift for the modal
                  }
              ]}>
                  
                  {/* Animation Simulation */}
                  <View style={styles.animationPlaceholder}>
                      <Icon name="sparkles" size={50} color={ACCENT_COLOR_GOLD} />
                      <Text style={[styles.animationText, { color: VIBRANT_PRIMARY, marginTop: 5 }]}>
                          *Magical Sparkle Animation*
                      </Text>
                  </View>
                  
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                      Unlock More Flats! 🎉
                  </Text>
                  
                  <Text style={[styles.modalBody, { color: colors.textSecondary }]}>
                      Hey! We never charge flatmate fees or sell your data. We rely on smart, non-intrusive ads to keep things running.
                  </Text>
                  
                  {/* Key Benefit (Vibrant Pill) */}
                  <View style={[styles.keyBenefit, { backgroundColor: VIBRANT_PRIMARY, borderRadius: BUTTON_RADIUS, ...SUBTLE_SHADOW }]}>
                      <Icon name="home-outline" size={22} color={colors.card} style={{ marginRight: 8 }} />
                      <Text style={[styles.keyBenefitText, { color: colors.card }]}>
                          1 Ad = 1 New Flat to Explore!
                      </Text>
                  </View>
                  
                  {/* Button to watch Ad (3D Effect) */}
                  <TouchableOpacity 
                      style={[
                        styles.watchAdButton, 
                        { 
                          backgroundColor: VIBRANT_PRIMARY, 
                          borderRadius: BUTTON_RADIUS, 
                          ...DEEP_SOFT_SHADOW, 
                          shadowRadius: 10,
                        }
                      ]}
                      onPress={() => {
                          Alert.alert("Ad Status", "Simulating ad playback... You've earned 100 Coins!");
                          setCoins(c => c + 100); 
                          closeCoinModal();
                      }}
                  >
                      <Icon name="videocam-outline" size={20} color={colors.white} style={{ marginRight: 8 }} />
                      <Text style={styles.watchAdButtonText}>
                          Watch Ad & Earn Coins
                      </Text>
                  </TouchableOpacity>

              </Animated.View>
          </TouchableOpacity>
      </Modal>
  );
  // --- END COIN MODAL RENDERER ---


  // --- WEB NAVIGATION (Stack Navigator with WebHeader) ---
  if (!isMobile) {
    // NOTE: WebHeader is used here for non-mobile views
    return (
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{
          header: props => <WebHeader {...props} colors={colors} />, 
          headerShown: true,
        }}
      >
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
        <Stack.Screen name="List" component={ListingFormScreen} options={{ title: 'List Property' }} />
        <Stack.Screen name="Messages" component={MessagingScreen} options={{ title: 'Messages' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      </Stack.Navigator>
    );
  }

  // --- MOBILE NAVIGATION (Bottom Tabs - 3D Dock Style) ---
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <MobileHeader />
      {renderCoinModal()} 
      <Tab.Navigator
        initialRouteName="Search"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
            else if (route.name === 'List') iconName = focused ? 'add-circle' : 'add-circle-outline';
            else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
            else if (route.name === 'Messages') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            // 🌟 Use a slightly larger size for better visual impact
            return <Icon name={iconName} size={size + 2} color={color} />;
          },
          tabBarActiveTintColor: colors.primary, // Vibrant active color
          tabBarInactiveTintColor: colors.textSecondary, 
          tabBarStyle: {
            backgroundColor: colors.card, // Floating tab background
            borderTopWidth: 0, // Remove default top line
            paddingBottom: Platform.OS === 'ios' ? 5 : 0, 
            height: Platform.OS === 'ios' ? 80 : 60,
            
            // 🌟 3D Dock Effect
            ...SUBTLE_SHADOW,
            shadowOffset: { width: 0, height: -5 }, // Shadow upwards
            borderTopLeftRadius: GENEROUS_RADIUS - 10, 
            borderTopRightRadius: GENEROUS_RADIUS - 10,
          },
          tabBarLabelStyle: {
              fontWeight: 'bold', // Bolder labels
              fontSize: 12
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="List" component={ListingFormScreen} />
        
        {/* Messaging Tab uses the Nested Stack */}
        <Tab.Screen 
            name="Messages" 
            component={MessagingStack} 
            options={{
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    return <Icon name={iconName} size={size + 2} color={color} />;
                },
            }}
        />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </View>
  );
}

// --- STYLES (Updated for 3D and Vibrancy) ---
const styles = StyleSheet.create({
  // --- MOBILE HEADER STYLES ---
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingHorizontal: 20, // Increased padding
    paddingVertical: 15, // Increased padding
    borderBottomWidth: 0, // Removed default border
  },
  logo: { 
    fontSize: 26, 
    fontWeight: '900', 
  },
  rightActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Increased gap
  },
  headerButton: { 
    padding: 6, 
    width: 40, // Increased size
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinsContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 12, // Pill shape horizontal padding
    paddingVertical: 8, // Pill shape vertical padding
    // Shadow and Color applied inline
  },
  coinsText: { 
    fontSize: 16, 
    fontWeight: '900', // Bolder font
  },
  
  // --- MODAL STYLES (Updated for 3D and Vibrancy) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinModalContent: {
    width: '85%',
    padding: 30, // Increased padding
    borderWidth: 4, // Thicker border
    alignItems: 'center',
  },
  animationPlaceholder: {
    marginBottom: 25,
    alignItems: 'center',
  },
  animationText: {
    fontSize: 16,
    fontWeight: '900',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  keyBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 25,
    marginTop: 10,
    marginBottom: 30,
  },
  keyBenefitText: {
    fontSize: 17,
    fontWeight: '800',
  },
  watchAdButton: {
    flexDirection: 'row',
    paddingVertical: 18, // Bigger button
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  watchAdButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});