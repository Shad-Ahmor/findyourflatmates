// src/App.web.jsx
import * as React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '../../../src/theme/theme.js';
// 🛑 KEY CHANGE 1: useAuth से user, isAuthenticated, और isLoading को प्राप्त करेंगे
import { useAuth, AuthProvider } from '../../../src/context/AuthContext'; 

// Screens (Web में उपयोग होने वाले)
import ForgotPasswordScreen from './Authentication/ForgotPasswordScreen.jsx';
import FlatmateProfileSetupScreen from '../../../src/screens/FlatmateProfileSetupScreen.jsx';
import LogoutScreen from '../../../src/screens/LogoutScreen.jsx';  
import PrivacyPolicyScreen from '../../../src/screens/PrivacyPolicyScreen.jsx'; 
import TermsScreen from '../../../src/screens/TermsScreen.jsx';

// Web Navigation/Header
// WebAppHeader अब WebHeader.web.jsx से ठीक से आयात होगा
import WebMainScreen, { WebAppHeader } from './navigation/WebHeader'; 

// Web Screen Components (Require Logic)
const LoginScreenComponent = require('./Authentication/LoginScreen.web.jsx').default; 
const SignupScreenComponent = require('./Authentication/SignupScreen.web.jsx').default;
const BasicDetailForm = require('./Authentication/BasicDetailForm.web.jsx').default;
const LandingScreenComponent = require('./LandingPage/LandingScreen.web.jsx').default; 
const HomeScreen = require('./HomeScreen.web.jsx').default; 

// Main App Screens (These will be rendered inside WebMainScreen)
const ListingFormScreenComponent = require('./Properties/PublicProperties/PropertyListing/PropertyCreate.web.jsx').default; 
const MyListingsScreenComponent = require('./Properties/MyProperties/MyListingsScreen.web.jsx').default;
const PropertyDetailScreen = require('./Properties/PublicProperties/PropertyDetail/PropertyDetailScreen.web.jsx').default; 
const MessagingScreen = require('./Communication/MessagingScreen.web.jsx').default;
const ChatScreen = require('./Communication/ChatScreen.web.jsx').default; 


// ======================================================
// 📌 ALL AUTHENTICATED SCREEN MAP (Internal Routing)
// ======================================================
// यह अब सभी संभावित इंटरनल स्क्रीन की मास्टर सूची है।
const ALL_AUTH_SCREENS = {
  Main: HomeScreen, // Home स्क्रीन (डिफ़ॉल्ट)
  MessagingList: MessagingScreen,
  CreateListing: ListingFormScreenComponent,
  MyListings: MyListingsScreenComponent,
  // Note: PropertyDetail एक Stack.Screen है, यहाँ नहीं।
};


// ======================================================
// 🛑 KEY RBAC CONFIG: ROLE ACCESS CONTROL MAP
// ======================================================
// परिभाषित करता है कि प्रत्येक भूमिका (Role) को किन इंटरनल स्क्रीन (स्क्रीन नाम) तक पहुंच है।
const ROLE_ACCESS_MAP = {
    // Admin : Complete Access (Internal Screens)
    Admin: ['Main', 'MessagingList', 'CreateListing', 'MyListings'],
    
    // Tenanat/Buyer: Detailview, Main
    Tenant: ['Main'], 
    Buyer: ['Main'],
    
    // Seller/Owner: Detailview, MyListings, CreateListing
    Seller: ['Main', 'MyListings', 'CreateListing'],
    Owner: ['Main', 'MyListings', 'CreateListing'],
    
    // यदि कोई भूमिका अपरिभाषित है, तो केवल होम एक्सेस करें (Fallback)
    DEFAULT: ['Main'],
};


// 💡 HELPER: भूमिका के आधार पर स्क्रीन मैप को फ़िल्टर करता है
const getRoleBasedScreens = (role) => {
    // भूमिका (Role) के आधार पर अनुमत स्क्रीन नामों की सूची प्राप्त करें
    const allowedScreenNames = ROLE_ACCESS_MAP[role] || ROLE_ACCESS_MAP.DEFAULT;
    const filteredScreens = {};

    // अनुमत स्क्रीन नामों के आधार पर कॉम्पोनेंट्स को ALL_AUTH_SCREENS से फ़िल्टर करें
    allowedScreenNames.forEach(screenName => {
        if (ALL_AUTH_SCREENS[screenName]) {
            filteredScreens[screenName] = ALL_AUTH_SCREENS[screenName];
        }
    });

    return filteredScreens;
};

// ======================================================
// 📌 Linking Configuration for Web URLs
// ... (कोई बदलाव नहीं)
// ======================================================
const linking = {
  prefixes: ['http://localhost:8081', '/'], 
  config: {
    screens: {
      Landing: '',
      Login: 'Login',
      Signup: 'Signup',
      ForgotPassword: 'ForgotPassword',
      BasicDetails: 'BasicDetails',
      Privacy: 'Privacy', 
      Terms: 'Terms',
      Main: 'Property',

      FlatmateSetup: 'FlatmateSetup',
      MessagingList: 'MessagingList',
      FlatmateChat: 'FlatmateChat',
      CreateListing: 'CreateListing',
      MyListings: 'MyListings',
      PropertyDetail: 'PropertyDetail', 
      Logout: 'Logout',
    },
  },
};
// ======================================================


const Stack = createNativeStackNavigator();

// ------------------------------------------------------
// 🚨 Web RootStack Function (RBAC लागू)
// ------------------------------------------------------
function RootStack() {
  const { colors } = useTheme();
  // 🛑 KEY CHANGE 2: useAuth से user को डिस्ट्रक्चर करें
  const { isAuthenticated, isLoading, user } = useAuth(); 

  if (isLoading) {
    return (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
            <ActivityIndicator size="large" color={colors.primary || '#FF9500'} />
            <Text style={[styles.loadingText, { color: colors.text }]}>Loading session...</Text>
        </View>
    );
  }

  // 🛑 KEY CHANGE 3: उपयोगकर्ता की भूमिका के आधार पर स्क्रीन मैप प्राप्त करें
  const userRole = user?.role || 'DEFAULT';
  const roleBasedScreensMap = getRoleBasedScreens(userRole);
  
  // WebAppHeader को केवल अनुमत स्क्रीन नेम्स की सूची भेजें
  const allowedInternalScreenNames = Object.keys(roleBasedScreensMap); 


  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}
    >
      {isAuthenticated ? (
        <>
          {/* Main screen uses WebMainScreen as its wrapper */}
          <Stack.Screen 
            name="Main" 
            // 🛑 KEY CHANGE 4: फ़िल्टर किए गए roleBasedScreensMap को पास करें
            component={(props) => <WebMainScreen {...props} screensMap={roleBasedScreensMap} />}
            options={{ headerShown: false }}
          />

          {/* PropertyDetail Screen with Custom Header */}
          {/* PropertyDetail सभी के लिए उपलब्ध है, लेकिन Header को फ़िल्टर किए गए मेनू की आवश्यकता है */}
          <Stack.Screen 
            name="PropertyDetail" 
            component={PropertyDetailScreen} 
            options={{ 
              // 🛑 KEY CHANGE 5: WebAppHeader को अनुमत स्क्रीन नाम (allowedInternalScreenNames) पास करें
              header: (props) => <WebAppHeader {...props} allowedScreenNames={allowedInternalScreenNames} activeScreenName="Main" />,
              headerShown: true, 
              headerTitle: '',
            }}
          />
          
          {/* Custom Header for Privacy, Terms, and FlatmateSetup */}
          <Stack.Screen 
            name="Privacy" 
            component={PrivacyPolicyScreen} 
            options={{ 
                // 🛑 KEY CHANGE 5: WebAppHeader को अनुमत स्क्रीन नाम (allowedInternalScreenNames) पास करें
                header: (props) => <WebAppHeader {...props} allowedScreenNames={allowedInternalScreenNames} activeScreenName="Main" />, 
                headerShown: true, 
                headerTitle: '',
            }}
          />
          <Stack.Screen 
            name="Terms" 
            component={TermsScreen} 
            options={{ 
                // 🛑 KEY CHANGE 5: WebAppHeader को अनुमत स्क्रीन नाम (allowedInternalScreenNames) पास करें
                header: (props) => <WebAppHeader {...props} allowedScreenNames={allowedInternalScreenNames} activeScreenName="Main" />, 
                headerShown: true, 
                headerTitle: '',
            }}
          />
          <Stack.Screen
            name="FlatmateSetup"
            component={FlatmateProfileSetupScreen}
            options={{ 
                // 🛑 KEY CHANGE 5: WebAppHeader को अनुमत स्क्रीन नाम (allowedInternalScreenNames) पास करें
                header: (props) => <WebAppHeader {...props} allowedScreenNames={allowedInternalScreenNames} activeScreenName="Main" />, 
                headerShown: true, 
                headerTitle: '',
            }}
          />

          {/* FlatmateChat और Logout को रोल के आधार पर नियंत्रित करने की आवश्यकता नहीं है, 
              लेकिन वे WebMainScreen द्वारा प्रबंधित नहीं हैं */}
          <Stack.Screen name="FlatmateChat" component={ChatScreen} options={{ headerShown: false }} /> 

          <Stack.Screen 
            name="Logout" 
            component={LogoutScreen} 
            options={{ headerShown: false }} 
          />
        </>
      ) : (
        <>
         <Stack.Screen 
            name="Landing" 
            component={LandingScreenComponent} 
            options={{ headerShown: false }} 
          />
        <Stack.Screen 
            name="Privacy" 
            component={PrivacyPolicyScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Terms" 
            component={TermsScreen} 
            options={{ headerShown: false }} 
          />
         
          <Stack.Screen 
            name="Login" 
            component={LoginScreenComponent} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Signup" 
            component={SignupScreenComponent} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="BasicDetails"
            component={BasicDetailForm}
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="ForgotPassword" 
            component={ForgotPasswordScreen} 
            options={{ headerShown: false }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
}

// ======================================================
// 📌 Web App Component
// ======================================================
export default function WebApp() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider> 
          <NavigationContainer linking={linking}> 
            <RootStack />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}


const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});