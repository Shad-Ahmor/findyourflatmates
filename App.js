import * as React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from './src/theme/theme';
import { useAuth, AuthProvider } from './src/context/AuthContext'; 

// Screens
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen.jsx';
import FlatmateProfileSetupScreen from './src/screens/FlatmateProfileSetupScreen.jsx';

// --- NEW IMPORT FOR LOGOUT SCREEN ---
import LogoutScreen from './src/screens/LogoutScreen.jsx';  // ✅ NEW

// --- NEW IMPORTS FOR NAVIGATION STRUCTURE ---
import MainTabs from './src/components/mobile/navigation/MobileHeader.js';

// FIX: WebHeaderWrapper/WebHeader को WebMainScreen (कंटेंट) और WebAppHeader (रीयूजेबल हेडर) के रूप में इम्पोर्ट करें
import WebMainScreen, { WebAppHeader } from './src/components/web/navigation/WebHeader'; 
// --- END NEW IMPORTS ---

let SignupScreenComponent;
let LoginScreenComponent; 
let LandingScreenComponent; 
let ListingFormScreenComponent;
let MyListingsScreenComponent;
let PropertyDetailScreen;
let MessagingScreen;
let ChatScreen;
let BasicDetailForm;


if (Platform.OS === 'web') {
  LoginScreenComponent = require('./src/components/web/LoginScreen.web.jsx').default; 
  SignupScreenComponent = require('./src/components/web/SignupScreen.web.jsx').default;
  BasicDetailForm = require('./src/components/web/BasicDetailForm.web.jsx').default;

  LandingScreenComponent = require('./src/components/web/LandingScreen.web.jsx').default; 
  
  ListingFormScreenComponent = require('./src/components/web/ListingFormScreen.web.jsx').default; 
  MyListingsScreenComponent = require('./src/components/web/MyListingsScreen.web.jsx').default;
  PropertyDetailScreen = require('./src/components/web/PropertyDetailScreen.web.jsx').default; 
  MessagingScreen = require('./src/components/web/MessagingScreen.web.jsx').default;
  ChatScreen = require('./src/components/web/ChatScreen.web.jsx').default; 

} else {
  LoginScreenComponent = require('./src/components/mobile/LoginScreen.android.jsx').default; 
  SignupScreenComponent = require('./src/components/mobile/SignupScreen.android.jsx').default;

  LandingScreenComponent = require('./src/components/mobile/LandingScreen.android.jsx').default; 

  ListingFormScreenComponent = require('./src/components/mobile/ListingFormScreen.android.jsx').default;
}

const Stack = createNativeStackNavigator();

// ======================================================
// 📌 App Component
// ======================================================
export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider> 
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

// ------------------------------------------------------
// 🚨 Authentication Guard Logic (FIXED for Web Headers)
// ------------------------------------------------------
function RootStack() {
  const { colors } = useTheme();
  const { isAuthenticated, isLoading } = useAuth(); 

  if (isLoading) {
    return (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
            <ActivityIndicator size="large" color={colors.primary || '#FF9500'} />
            <Text style={[styles.loadingText, { color: colors.text }]}>Loading session...</Text>
        </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen 
            name="Main" 
            component={Platform.OS === 'web' ? WebMainScreen : MainTabs} 
            options={{ headerShown: false }}
          />
          
          <Stack.Screen
            name="FlatmateSetup"
            component={FlatmateProfileSetupScreen}
            options={
              Platform.OS === 'web' 
                ? { header: WebAppHeader, headerShown: true, title: '' }
                : { title: 'Setup Profile', headerTitleStyle: styles.headerTitle }
            }
          />

          <Stack.Screen 
            name="MessagingList" 
            component={MessagingScreen} 
            options={
              Platform.OS === 'web' 
                ? { header: WebAppHeader, headerShown: true, title: '' }
                : { headerShown: false }
            }
          /> 

          <Stack.Screen name="FlatmateChat" component={ChatScreen} options={{ headerShown: false }} /> 

          <Stack.Screen
            name="CreateListing"
            component={ListingFormScreenComponent}
            options={
              Platform.OS === 'web' 
                ? { header: WebAppHeader, headerShown: true, title: 'List Your Space' }
                : { title: 'List Your Space', headerTitleStyle: styles.headerTitle }
            }
          />

          <Stack.Screen
            name="MyListings"
            component={MyListingsScreenComponent}
            options={
              Platform.OS === 'web' 
                ? { header: WebAppHeader, headerShown: true, title: 'My Properies' }
                : { title: 'My Listings', headerTitleStyle: styles.headerTitle }
            }
          />

          <Stack.Screen 
            name="PropertyDetail" 
            component={PropertyDetailScreen} 
            options={
              Platform.OS === 'web' 
                ? { header: WebAppHeader, headerShown: true, title: '' }
                : { headerShown: false }
            }
          /> 

          {/* ✅ NEW: LOGOUT ROUTE */}
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
  }
});
