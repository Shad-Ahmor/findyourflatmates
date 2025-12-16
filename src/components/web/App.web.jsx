// src/components/web/App.web.jsx
import * as React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '../../../src/theme/theme.js';
import { useAuth, AuthProvider } from '../../../src/context/AuthContext'; 

// Screens (Web)
import ForgotPasswordScreen from './Authentication/ForgotPasswordScreen.jsx';
import FlatmateProfileSetupScreen from '../../../src/screens/FlatmateProfileSetupScreen.jsx';
import LogoutScreen from '../../../src/screens/LogoutScreen.jsx';  
import PrivacyPolicyScreen from '../../../src/screens/PrivacyPolicyScreen.jsx'; 
import TermsScreen from '../../../src/screens/TermsScreen.jsx';

import WebMainScreen, { WebAppHeader } from './navigation/WebHeader'; 

// Web Screen Components
const LoginScreenComponent = require('./Authentication/LoginScreen.web.jsx').default; 
const SignupScreenComponent = require('./Authentication/SignupScreen.web.jsx').default;
const BasicDetailForm = require('./Authentication/BasicDetailForm.web.jsx').default;
const LandingScreenComponent = require('./LandingPage/LandingScreen.web.jsx').default; 
const HomeScreen = require('./HomeScreen.web.jsx').default; 

const ListingFormScreenComponent = require('./Properties/PublicProperties/PropertyListing/PropertyCreate.web.jsx').default; 
const MyListingsScreenComponent = require('./Properties/MyProperties/MyListingsScreen.web.jsx').default;
const PropertyDetailScreen = require('./Properties/PublicProperties/PropertyDetail/PropertyDetailScreen.web.jsx').default; 
const MessagingScreen = require('./Communication/MessagingScreen.web.jsx').default;
const ChatScreen = require('./Communication/ChatScreen.web.jsx').default; 

// ======================================================
// ALL AUTHENTICATED SCREEN MAP
// ======================================================
const ALL_AUTH_SCREENS = {
  Main: HomeScreen,
  MessagingList: MessagingScreen,
  CreateListing: ListingFormScreenComponent,
  MyListings: MyListingsScreenComponent,
};

// ======================================================
// ROLE ACCESS CONTROL MAP
// ======================================================
const ROLE_ACCESS_MAP = {
    Admin: ['Main', 'MessagingList', 'CreateListing', 'MyListings'],
    Tenant: ['Main'], 
    Buyer: ['Main'],
    Seller: ['Main', 'MyListings', 'CreateListing'],
    Owner: ['Main', 'MyListings', 'CreateListing'],
    DEFAULT: ['Main'],
};

// Helper: filter screens by role
const getRoleBasedScreens = (role) => {
    const allowedScreenNames = ROLE_ACCESS_MAP[role] || ROLE_ACCESS_MAP.DEFAULT;
    const filteredScreens = {};
    allowedScreenNames.forEach(screenName => {
        if (ALL_AUTH_SCREENS[screenName]) {
            filteredScreens[screenName] = ALL_AUTH_SCREENS[screenName];
        }
    });
    return filteredScreens;
};

// ======================================================
// LINKING CONFIGURATION FOR WEB
// ======================================================
const linking = Platform.OS === 'web'
  ? {
      prefixes: [''],
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

      getInitialURL() {
        if (typeof window !== 'undefined') {
          const hash = window.location.hash; // "#/Property"
          return hash ? hash.replace('#', '') : '/';
        }
        return '/';
      },

      subscribe(listener) {
        const onHashChange = () => {
          const hash = window.location.hash;
          listener(hash ? hash.replace('#', '') : '/');
        };

        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
      },
    }
  : undefined;

// ======================================================
const Stack = createNativeStackNavigator();

// ------------------------------------------------------
// ROOT STACK (RBAC APPLIED)
// ------------------------------------------------------
function RootStack() {
  const { colors } = useTheme();
  const { isAuthenticated, isLoading, user } = useAuth(); 

  if (isLoading) {
    return (
       <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
            <ActivityIndicator size="large" color={colors.primary || '#FF9500'} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
                Checking session...
            </Text>
        </View>
    );
  }

  const userRole = user?.role || 'DEFAULT';
  const roleBasedScreensMap = getRoleBasedScreens(userRole);
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
          <Stack.Screen 
            name="Main" 
            component={(props) => <WebMainScreen {...props} screensMap={roleBasedScreensMap} />}
            options={{ headerShown: false }}
          />

          <Stack.Screen 
            name="PropertyDetail" 
            component={PropertyDetailScreen} 
            options={{ 
              header: (props) => <WebAppHeader {...props} allowedScreenNames={allowedInternalScreenNames} activeScreenName="Main" />,
              headerShown: true, 
              headerTitle: '',
            }}
          />

          <Stack.Screen 
            name="Privacy" 
            component={PrivacyPolicyScreen} 
            options={{ 
                header: (props) => <WebAppHeader {...props} allowedScreenNames={allowedInternalScreenNames} activeScreenName="Main" />, 
                headerShown: true, 
                headerTitle: '',
            }}
          />
          <Stack.Screen 
            name="Terms" 
            component={TermsScreen} 
            options={{ 
                header: (props) => <WebAppHeader {...props} allowedScreenNames={allowedInternalScreenNames} activeScreenName="Main" />, 
                headerShown: true, 
                headerTitle: '',
            }}
          />
          <Stack.Screen
            name="FlatmateSetup"
            component={FlatmateProfileSetupScreen}
            options={{ 
                header: (props) => <WebAppHeader {...props} allowedScreenNames={allowedInternalScreenNames} activeScreenName="Main" />, 
                headerShown: true, 
                headerTitle: '',
            }}
          />

          <Stack.Screen name="FlatmateChat" component={ChatScreen} options={{ headerShown: false }} /> 
          <Stack.Screen name="Logout" component={LogoutScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <>
         <Stack.Screen name="Landing" component={LandingScreenComponent} options={{ headerShown: false }} />
         <Stack.Screen name="Privacy" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
         <Stack.Screen name="Terms" component={TermsScreen} options={{ headerShown: false }} />
         <Stack.Screen name="Login" component={LoginScreenComponent} options={{ headerShown: false }} />
         <Stack.Screen name="Signup" component={SignupScreenComponent} options={{ headerShown: false }} />
         <Stack.Screen name="BasicDetails" component={BasicDetailForm} options={{ headerShown: false }} />
         <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}

// ======================================================
// WEB APP COMPONENT
// ======================================================
export default function WebApp() {
  if (Platform.OS === 'web') {
    const { pathname, hash } = window.location;

    if (!hash && pathname !== '/' && pathname !== '') {
      window.location.replace(`/#${pathname}`);
      return null;
    }
  }

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
