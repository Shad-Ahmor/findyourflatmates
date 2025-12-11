// src/App.web.jsx
import * as React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '../../../src/theme/theme.js';
import { useAuth, AuthProvider } from '../../../src/context/AuthContext'; 

// Screens (Web में उपयोग होने वाले)
import ForgotPasswordScreen from '../../../src/screens/ForgotPasswordScreen.jsx';
import FlatmateProfileSetupScreen from '../../../src/screens/FlatmateProfileSetupScreen.jsx';
import LogoutScreen from '../../../src/screens/LogoutScreen.jsx';  
import PrivacyPolicyScreen from '../../../src/screens/PrivacyPolicyScreen.jsx'; 
import TermsScreen from '../../../src/screens/TermsScreen.jsx';

// Web Navigation/Header
import WebMainScreen, { WebAppHeader } from './navigation/WebHeader'; 

// Web Screen Components (Require Logic)
const LoginScreenComponent = require('./LoginScreen.web.jsx').default; 
const SignupScreenComponent = require('./SignupScreen.web.jsx').default;
const BasicDetailForm = require('./BasicDetailForm.web.jsx').default;
const LandingScreenComponent = require('./LandingScreen.web.jsx').default; 
const ListingFormScreenComponent = require('./ListingFormScreen.web.jsx').default; 
const MyListingsScreenComponent = require('./MyListingsScreen.web.jsx').default;
const PropertyDetailScreen = require('./PropertyDetailScreen.web.jsx').default; 
const MessagingScreen = require('./MessagingScreen.web.jsx').default;
const ChatScreen = require('./ChatScreen.web.jsx').default; 


// ======================================================
// 📌 Linking Configuration for Web URLs
// ======================================================
const linking = {
  prefixes: ['/'], 
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
// 🚨 Web RootStack Function
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
            component={WebMainScreen} 
            options={{ headerShown: false }}
          />
        <Stack.Screen 
            name="Privacy" 
            component={PrivacyPolicyScreen} 
            options={{ header: WebAppHeader, headerShown: false, title: 'Privacy Policy' }}
          />
          <Stack.Screen 
            name="Terms" 
            component={TermsScreen} 
            options={{ header: WebAppHeader, headerShown: false, title: 'Terms of Service' }}
          />
        
          
          <Stack.Screen
            name="FlatmateSetup"
            component={FlatmateProfileSetupScreen}
            options={{ header: WebAppHeader, headerShown: false, title: '' }}
          />

          <Stack.Screen 
            name="MessagingList" 
            component={MessagingScreen} 
            options={{ header: WebAppHeader, headerShown: false, title: '' }}
          /> 

          <Stack.Screen name="FlatmateChat" component={ChatScreen} options={{ headerShown: false }} /> 

          <Stack.Screen
            name="CreateListing"
            component={ListingFormScreenComponent}
            options={{ header: WebAppHeader, headerShown: false, title: 'List Your Space' }}
          />

          <Stack.Screen
            name="MyListings"
            component={MyListingsScreenComponent}
            options={{ header: WebAppHeader, headerShown: false, title: 'My Properies' }}
          />

          <Stack.Screen 
            name="PropertyDetail" 
            component={PropertyDetailScreen} 
            options={{ header: WebAppHeader, headerShown: false, title: '' }}
          /> 

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