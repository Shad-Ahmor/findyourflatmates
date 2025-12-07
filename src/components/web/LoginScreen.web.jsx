// src/screens/LoginScreen.web.jsx

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  Dimensions, 
  ScrollView, 
  Alert,
  ActivityIndicator, 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/theme'; 

// 🎯 FIXED IMPORT PATH: Using the actual uploaded component file name
import BasicDetailForm from './BasicDetailForm.web.jsx'; 

const { width } = Dimensions.get('window');
const BREAKPOINT = 768; 
const API_BASE_URL = 'http://localhost:5000'; 
const LOGIN_URL = `${API_BASE_URL}/flatmate/login`; 
// 🎯 NEW: Profile Completion API URL
const PROFILE_COMPLETE_URL = `${API_BASE_URL}/flatmate/complete-profile`; 

// --- Constants used by BasicDetailForm and Styles ---
const PRIMARY_COLOR = '#007AFF'; // Blue
const ACCENT_COLOR = '#FF9500'; // Orange
const BASE_SHADOW_COLOR = '#102A43'; 

const PRIMARY_INTENTS = ['Rent', 'Buy', 'Invest'];
const SECONDARY_INTENTS_MAP = {
    'Rent': ['Looking for Flatmate', 'Looking for Property'],
    'Buy': ['Primary Residence', 'Investment'],
    'Invest': ['Commercial', 'Residential'],
};


// Reusable Login Form
const LoginForm = ({
    email,
    setEmail,
    password,
    setPassword,
    handleForgotPassword,
    handleLogin,
    handleSignupNavigate,
    isWebOrTablet,
    isLoading,
    styles,
    colors, // Pass colors from theme
    SUBTLE_SHADOW, // Pass shadow from theme
}) => (
    <View style={[
        styles.authContainerBase,
        { backgroundColor: colors.card },
        isWebOrTablet 
          ? { width: '50%', padding: 50 } 
          : { paddingHorizontal: 30, width: '100%', paddingVertical: 40 } 
    ]}>
        <Text style={[styles.authHeader, { color: colors.text }]}>Welcome Back</Text>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address</Text>
          <TextInput
            style={[styles.input, { 
                backgroundColor: colors.background, 
                borderColor: colors.border,
                color: colors.text,
            }]}
            placeholder="enter your email here"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>
        {/* ... (Password Input and other Login form fields) ... */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
          <TextInput
            style={[styles.input, { 
                backgroundColor: colors.background, 
                borderColor: colors.border,
                color: colors.text,
            }]}
            placeholder="••••••••"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
        </View>
        
        <TouchableOpacity 
            onPress={handleForgotPassword} 
            style={styles.forgotPasswordContainer} 
            disabled={isLoading}
        >
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                Forgot Password?
            </Text>
        </TouchableOpacity>

        <TouchableOpacity 
            onPress={handleLogin} 
            style={[
              styles.actionButton, 
              { backgroundColor: colors.primary, borderRadius: styles.GENEROUS_RADIUS },
              SUBTLE_SHADOW,
              isLoading && styles.disabledButton
            ]}
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator color={colors.card} size="small" />
            ) : (
                <Text style={styles.actionButtonText}>LOG IN</Text>
            )}
        </TouchableOpacity>
        
        <TouchableOpacity 
            onPress={handleSignupNavigate} 
            style={styles.switchButton}
            disabled={isLoading}
        >
            <Text style={[styles.switchButtonText, { color: colors.textSecondary }]}>
                Don't have an account? <Text style={[styles.switchButtonHighlight, { color: colors.primary }]}>Sign Up</Text>
            </Text>
        </TouchableOpacity>

        {/* Social Buttons */}
        <View style={styles.mobileAuthButtons}>
            <Text style={[styles.orSeparator, { color: colors.textSecondary }]}>
                — OR CONTINUE WITH —
            </Text>
            {/* ... (Social Buttons) ... */}
            <TouchableOpacity 
                style={[
                    styles.socialButton, 
                    { backgroundColor: colors.backgroundLight, borderColor: colors.border },
                    SUBTLE_SHADOW,
                ]}
                onPress={() => Alert.alert("Coming Soon", "Google Login")}
                disabled={isLoading}
            >
                <Icon name="logo-google" size={20} color={colors.error} />
                <Text style={[styles.socialButtonText, { color: colors.text }]}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[
                    styles.socialButton, 
                    { backgroundColor: colors.backgroundLight, borderColor: colors.border },
                    SUBTLE_SHADOW,
                ]}
                onPress={() => Alert.alert("Coming Soon", "Apple Login")}
                disabled={isLoading}
            >
                <Icon name="logo-apple" size={20} color={colors.text} />
                <Text style={[styles.socialButtonText, { color: colors.text }]}>Apple</Text>
            </TouchableOpacity>
        </View>
    </View>
);


// Login Screen Web
const LoginScreen = ({ navigation }) => {
  const { colors, GENEROUS_RADIUS, DEEP_SOFT_SHADOW, SUBTLE_SHADOW } = useTheme(); 
  
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  
  // --- Login Form States ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  // --- 🎯 Profile Setup States (NEW) ---
  const [isProfileSetupMode, setIsProfileSetupMode] = useState(false); 
  const [city, setCity] = useState('');
  const [countryCode, setCountryCode] = useState('+91'); 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [primaryIntent, setPrimaryIntent] = useState(PRIMARY_INTENTS[0]);
  const [secondaryIntent, setSecondaryIntent] = useState(SECONDARY_INTENTS_MAP[PRIMARY_INTENTS[0]][0]);
  const [isLocating, setIsLocating] = useState(false); // Used by BasicDetailForm
  // ------------------------------------

  const isWebOrTablet = width > BREAKPOINT; 

// 🎯 ISSUE FIX APPLIED HERE: Using .trim().length > 0 for robust check
const navigateAfterLogin = (userData) => {
    // 1. Check for profile completion status
    const cityString = String(userData.city || '').trim();
    const phoneString = String(userData.phoneNumber || '').trim();

    // Check if both fields contain non-whitespace characters
    const isProfileComplete = cityString.length > 0 && phoneString.length > 0;
    
    if (isProfileComplete) {
      // 2. Profile Complete: Go directly to Home
      console.log('User profile is complete. Navigating to Home.');
      navigation.replace('Home'); 
    } else {
      // 3. Profile Incomplete: Enter Profile Setup Mode
      console.log('User needs to complete profile. Entering setup mode.');
      
      // Initialize states from existing user data (if any)
      setCity(userData.city || '');
      setPhoneNumber(userData.phoneNumber ? userData.phoneNumber.replace('+91', '') : '');
      setPrimaryIntent(userData.role || PRIMARY_INTENTS[0]); 
      setSecondaryIntent(userData.planName || (userData.role === 'Buy' ? 'Primary Residence' : SECONDARY_INTENTS_MAP['Rent'][0])); 
      
      setIsProfileSetupMode(true);
    }
  };


  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please enter both email and password.');

    setIsLoading(true);
    try {
      const res = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok) {
        await login(data.user);
        navigateAfterLogin(data.user);
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials or login failed.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network error or unable to reach the server.');
    } finally {
      setIsLoading(false);
    }
  };


// 🎯 NEW: Profile Completion Handler
  const handleCompleteProfile = async () => {
    if (!city || !phoneNumber || !primaryIntent || !secondaryIntent) {
      return Alert.alert('Error', 'City, Phone Number, and Intents are required.');
    }
    
    setIsLoading(true);
    
    const profileData = {
        city,
        phoneNumber: countryCode + phoneNumber,
        // Assuming API expects 'role' for primaryIntent and 'planName' for secondaryIntent
        role: primaryIntent, 
        planName: secondaryIntent,
    };

    try {
        const response = await fetch(PROFILE_COMPLETE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData),
            credentials: 'include', 
        });
        
        const data = await response.json();

        if (response.ok) {
            Alert.alert('Success', data.message);
            // Update Auth Context with the new, complete user data
            await login(data.user); 
            navigation.replace('Home'); 

        } else {
            Alert.alert('Profile Setup Failed', data.message || 'An unknown error occurred.');
        }
    } catch (error) {
        console.error('Profile completion error:', error);
        Alert.alert('Network Error', 'Could not connect to the server.');
    } finally {
        setIsLoading(false);
    }
  };


  const dynamicStyles = getStyles(colors, GENEROUS_RADIUS, DEEP_SOFT_SHADOW);


  return (
  <View style={[dynamicStyles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={dynamicStyles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={dynamicStyles.scrollContent}>

          {/* Hero + Form Shadow Card */}
          <View style={[
            dynamicStyles.webContainer, 
            DEEP_SOFT_SHADOW, 
            { backgroundColor: colors.card, borderRadius: GENEROUS_RADIUS } 
          ]}>

                {/* Hero Section (Left Panel) */}
                {/* Hero Section always visible for web/tablet view */}
                {isWebOrTablet && (
                  <View style={[
                      dynamicStyles.heroSection, 
                      { backgroundColor: colors.primary, borderRadius: GENEROUS_RADIUS }
                  ]}>
                      <Icon name="home-outline" size={90} color={colors.card} /> 
                      <Text style={dynamicStyles.logoText}>FlatMates Hub</Text> 
                      <Text style={dynamicStyles.tagline}>
                          India's Safest Platform to Find Verified Flatmates and Rent-Free Spaces.
                      </Text>
                  </View>
                )}

                {/* 🎯 CONDITIONAL RENDERING BLOCK */}
                {isProfileSetupMode ? (
                    // Render Profile Setup Form
                    <View style={[
                        dynamicStyles.authContainerBase,
                        { backgroundColor: colors.card },
                        isWebOrTablet 
                            ? { width: '50%', padding: 50 } 
                            : { paddingHorizontal: 30, width: '100%', paddingVertical: 40 } 
                    ]}>
                        <Text style={[dynamicStyles.authHeader, { color: colors.text, marginBottom: 20 }]}>
                            Complete Your Profile 🚀
                        </Text>
                        <Text style={dynamicStyles.profileSubHeader}>
                            Tell us a little about yourself to get started.
                        </Text>
                        <BasicDetailForm 
                            city={city} setCity={setCity}
                            countryCode={countryCode} setCountryCode={setCountryCode}
                            phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
                            primaryIntent={primaryIntent} setPrimaryIntent={setPrimaryIntent}
                            secondaryIntent={secondaryIntent} setSecondaryIntent={setSecondaryIntent}
                            isLoading={isLoading}
                            isLocating={isLocating}
                            styles={dynamicStyles} 
                            handleCompleteProfile={handleCompleteProfile} 
                            PRIMARY_INTENTS={PRIMARY_INTENTS}
                            SECONDARY_INTENTS_MAP={SECONDARY_INTENTS_MAP}
                        />
                    </View>
                ) : (
                    // Render Default Login Form
                    <LoginForm 
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        handleForgotPassword={() => navigation.navigate('ForgotPassword')}
                        handleLogin={handleLogin}
                        handleSignupNavigate={() => navigation.navigate('Signup')}
                        isWebOrTablet={isWebOrTablet}
                        isLoading={isLoading}
                        styles={dynamicStyles} 
                        colors={colors}
                        SUBTLE_SHADOW={SUBTLE_SHADOW} 
                    />
                )}
            </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};


// 🎨 Theme-based Dynamic Stylesheet
const getStyles = (colors, GENEROUS_RADIUS, DEEP_SOFT_SHADOW) => StyleSheet.create({
  // ... (Existing Global/Container Styles) ...
  safeArea: { flex: 1, backgroundColor: colors.background },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },

  webContainer: { 
    flexDirection: 'row', 
    width: '100%', 
    maxWidth:'1000px',
    backgroundColor: colors.card, 
    borderRadius: GENEROUS_RADIUS, 
    overflow: 'hidden',
  },
  
  // ... (Existing Hero Section Styles) ...
  heroSection: { 
    width: '50%', 
    backgroundColor: colors.primary, 
    padding: 50, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  logoText: { 
    fontSize: 40, 
    fontWeight: '800', 
    color: colors.card, 
    textAlign: 'center', 
    marginTop: 20, 
    letterSpacing: 0.5 
  },
  tagline: { 
    fontSize: 18, 
    color: colors.background, 
    textAlign: 'center', 
    marginTop: 20,
    lineHeight: 25,
  },

  // ... (Existing Form Styles) ...
  authContainerBase: { 
    paddingTop: 20, 
    justifyContent: 'center', 
    width: '100%' 
  },
  authHeader: { 
    fontSize: 34, 
    fontWeight: '800', 
    color: colors.text, 
    marginBottom: 40, 
    textAlign: 'left'
  },
  // 🎯 NEW: Sub-header for Profile Setup Mode
  profileSubHeader: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  inputGroup: { marginBottom: 25 }, 
  label: { 
    fontSize: 15, 
    marginBottom: 8, 
    fontWeight: '600'
  },
  input: { 
    borderRadius: 12, 
    height: 55, 
    paddingHorizontal: 15, 
    fontSize: 16, 
    borderWidth: 1.5, 
  },

  // ... (Existing Button Styles) ...
  forgotPasswordContainer: {
    marginBottom: 25,
    marginTop: -10,
  },
  forgotPasswordText: { 
    textAlign: 'right', 
    fontSize: 14, 
    fontWeight: '700' 
  },
  actionButton: { 
    paddingVertical: 18, 
    alignItems: 'center', 
    marginTop: 10,
  },
  actionButtonText: { 
    color: colors.card, 
    fontSize: 18, 
    fontWeight: '900',
    letterSpacing: 1.2, 
  },
  disabledButton: { opacity: 0.6 },
  
  switchButton: { marginTop: 20, padding: 5 },
  switchButtonText: { 
    textAlign: 'center', 
    fontSize: 15, 
    fontWeight: '500' 
  },
  switchButtonHighlight: {
    fontWeight: '900', 
  },

  // ... (Existing Social Login Styles) ...
  mobileAuthButtons: { marginTop: 30, marginBottom: 10 },
  orSeparator: { 
    textAlign: 'center', 
    marginVertical: 25,
    fontSize: 12,
    fontWeight: '700', 
    letterSpacing: 1.5,
  },
  socialButton: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 12, 
    paddingVertical: 14, 
    marginTop: 12, 
    borderWidth: 1, 
  },
  socialButtonText: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginLeft: 10 
  },

  // --- 🎯 NEW Styles for BasicDetailForm ---
  // Note: colors.primary will use PRIMARY_COLOR if mapped correctly in useTheme()
  phoneInputContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  countryCodeInput: { width: '25%' },
  phoneNumberInput: { width: '70%' },
  intentSelectorContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginBottom: 15 },
  intentButton: { 
      paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, 
      borderColor: colors.border, marginRight: 10, marginBottom: 10 
  },
  intentButtonActive: { borderColor: PRIMARY_COLOR, backgroundColor: PRIMARY_COLOR + '10' }, // Use defined PRIMARY_COLOR
  intentButtonText: { color: colors.textSecondary, fontWeight: '600' },
  intentButtonTextActive: { color: PRIMARY_COLOR, fontWeight: '700' }, // Use defined PRIMARY_COLOR
  // We reuse actionButton for simplicity, but BasicDetailForm called it 'signupButton' 
  // with ACCENT_COLOR background (Orange). 
  // Let's create specific style for clarity for the CTA button in setup form.
  signupButton: { 
      paddingVertical: 15, 
      borderRadius: 8, 
      alignItems: 'center', 
      marginTop: 30,
      backgroundColor: ACCENT_COLOR, // Use defined ACCENT_COLOR (Orange)
      // Inherits shadow/hover from the component's base logic (BASE_ACTION_BUTTON_WEB_STYLES)
  }, 
  signupButtonText: { 
      color: '#FFF', 
      fontSize: 18, 
      fontWeight: '900' 
  },
  locationIndicator: { position: 'absolute', right: 15, top: 18 },
});

export default LoginScreen;