// src/App.mobile.jsx
import * as React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '../../../src/theme/theme.js';
import { useAuth, AuthProvider } from '../../../src/context/AuthContext'; 

// Screens (Mobile में उपयोग होने वाले)
import ForgotPasswordScreen from '../../../src/screens/ForgotPasswordScreen.jsx';
import FlatmateProfileSetupScreen from '../../../src/screens/FlatmateProfileSetupScreen.jsx';
import LogoutScreen from '../../../src/screens/LogoutScreen.jsx';  
import PrivacyPolicyScreen from '../../../src/screens/PrivacyPolicyScreen.jsx'; 
import TermsScreen from '../../../src/screens/TermsScreen.jsx';

// Mobile Navigation/Header
import MainTabs from './navigation/MobileHeader.js';

// Mobile Screen Components (Require Logic)
const LoginScreenComponent = require('./LoginScreen.android.jsx').default; 
const SignupScreenComponent = require('./SignupScreen.android.jsx').default;
const LandingScreenComponent = require('./LandingScreen.android.jsx').default; 
const ListingFormScreenComponent = require('./ListingFormScreen.android.jsx').default;
// Note: Mobile पर Chat, MessagingList, PropertyDetail, MyListings को MainTabs के अंदर होना चाहिए
// यदि वे सीधे Stack में नहीं हैं, तो उन्हें यहाँ से हटा दें, लेकिन मैं उन्हें सुरक्षा के लिए रख रहा हूँ।

const Stack = createNativeStackNavigator();


// ------------------------------------------------------
// 🚨 Mobile RootStack Function
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
            component={MainTabs} 
            options={{ headerShown: false }}
          />
        <Stack.Screen 
            name="Privacy" 
            component={PrivacyPolicyScreen} 
            options={{ title: 'Privacy Policy', headerTitleStyle: styles.headerTitle }}
          />
          <Stack.Screen 
            name="Terms" 
            component={TermsScreen} 
            options={{ title: 'Terms of Service', headerTitleStyle: styles.headerTitle }}
          />
        
          
          <Stack.Screen
            name="FlatmateSetup"
            component={FlatmateProfileSetupScreen}
            options={{ title: 'Setup Profile', headerTitleStyle: styles.headerTitle }}
          />
          
          {/* Note: ये screens शायद MainTabs के अंदर nested हों, 
             यदि वे नहीं हैं, तो आपको उन्हें परिभाषित करना होगा। 
             Mobile में Web-specific components को हटा दिया गया है। */}
          {/* <Stack.Screen name="MessagingList" component={MessagingScreen} options={{ headerShown: false }} /> 
          <Stack.Screen name="FlatmateChat" component={ChatScreen} options={{ headerShown: false }} /> 
          <Stack.Screen name="CreateListing" component={ListingFormScreenComponent} options={{ title: 'List Your Space', headerTitleStyle: styles.headerTitle }} />
          <Stack.Screen name="MyListings" component={MyListingsScreenComponent} options={{ title: 'My Listings', headerTitleStyle: styles.headerTitle }} />
          <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} options={{ headerShown: false }} /> */}

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
            options={{ title: 'Privacy Policy', headerTitleStyle: styles.headerTitle }}
          />
          <Stack.Screen 
            name="Terms" 
            component={TermsScreen} 
            options={{ title: 'Terms of Service', headerTitleStyle: styles.headerTitle }} 
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
          {/* Note: BasicDetailForm केवल Web के लिए imported था, Mobile के लिए हटा दिया गया है */}
          {/* <Stack.Screen name="BasicDetails" component={BasicDetailForm} options={{ headerShown: false }} /> */}
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
// 📌 Mobile App Component
// ======================================================
export default function MobileApp() {
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