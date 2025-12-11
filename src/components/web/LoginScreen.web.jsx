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
import { API_BASE_URL } from '@env'; 
// Recaptcha कंपोनेंट अब इस्तेमाल नहीं हो रहा

// 🎯 OLD IMPORT REMOVED: import BasicDetailForm from './BasicDetailForm.web.jsx'; 
// 🚀 NEW: Import the extracted SSO Buttons
import SSOButtons from './sso.web.jsx'; 
// 💡 NEW: Import reCAPTCHA hook and container component
import useRecaptcha, { RecaptchaContainer } from './captcha.web.jsx'; 


const { width } = Dimensions.get('window');
const BREAKPOINT = 768; 
const LOGIN_URL = `${API_BASE_URL}/flatmate/login`; 
// 🎯 PROFILE_COMPLETE_URL REMOVED


// 🛡️ SECURITY HELPER 1: Client-Side Sanitization
const sanitizeString = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim(); 
};

// 🛡️ SECURITY HELPER 2: Basic Email Format Validation
const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};


// 🎯 BasicDetailForm Component REMOVED


// Reusable Login Form (Step 1)
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
    recaptchaContainerRef, 
    isRecaptchaReady, // 💡 Prop added to accept readiness state
}) => (
    <View style={[
        styles.authContainerBase,
        { backgroundColor: colors.card },
        isWebOrTablet 
          ? { width: '50%', padding: 50 } 
          : { paddingHorizontal: 30, width: '100%', paddingVertical: 40 } 
    ]}>
        {/* 💡 STEPPER UI ADDITION REMOVED */}
        {/* <Text style={[styles.stepIndicator, { color: colors.textSecondary }]}>Step 1 of 2: Login</Text> */}
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
        {/* ... (Password Input) ... */}
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

        {/* 🤖 RECAPTCHA Component */}
        <RecaptchaContainer 
            recaptchaContainerRef={recaptchaContainerRef}
            styles={styles}
            colors={colors}
        />
        {/* END RECAPTCHA */}

        <TouchableOpacity 
            onPress={handleLogin} 
            style={[
              styles.actionButton, 
              { backgroundColor: colors.primary, borderRadius: styles.GENEROUS_RADIUS },
              SUBTLE_SHADOW,
              (isLoading || !isRecaptchaReady) && styles.disabledButton // 💡 FIX: Disable if loading OR not ready
            ]}
            disabled={isLoading || !isRecaptchaReady} // 💡 FIX: Disable if loading OR not ready
        >
           {/* 💡 FIX: Show appropriate indicator/text based on readiness and loading */}
           {(isLoading || !isRecaptchaReady) ? ( 
            <Text style={styles.actionButtonText}>
                {isRecaptchaReady ? 'LOGGING IN...' : 'SECURITY CHECK...'}
            </Text>
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

        {/* 🚀 SSO Buttons Component */}
        <SSOButtons 
            isLoading={isLoading} 
            styles={styles} 
            colors={colors} 
            SUBTLE_SHADOW={SUBTLE_SHADOW} 
            navigation={navigation}
        />
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
  
  // --- 💡 RECAPTCHA HOOK USAGE FIX ---
  // FIX: isRecaptchaReady को डीस्ट्रक्चर करें
  const { recaptchaContainerRef, executeRecaptcha, isRecaptchaReady } = useRecaptcha(); 

  const isWebOrTablet = width > BREAKPOINT; 




  const handleLogin = async () => {
    // 1. Client-Side Sanitization
    const sanitizedEmail = sanitizeString(email);
    
    // 2. Client-Side Validation
    if (!sanitizedEmail || !password) { 
        return Alert.alert('Error', 'Please enter both email and password.');
    }
    if (!isValidEmail(sanitizedEmail)) {
        return Alert.alert('Error', 'Please enter a valid email address.');
    }
    // Optional: Password length check
    if (password.length < 6) { 
        return Alert.alert('Error', 'Password must be at least 6 characters long.');
    }

    setIsLoading(true);

    // 💡 FIX: Geolocation logic re-added
    let userLocation = { latitude: null, longitude: null };
    if (navigator.geolocation) {
        try {
            // Geolocation को प्रॉमिस में लपेटें और 5 सेकंड का टाइमआउट दें
            const position = await new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => reject(new Error('Geolocation timed out.')), 5000);
                navigator.geolocation.getCurrentPosition(
                    (pos) => { 
                        clearTimeout(timeoutId);
                        resolve(pos);
                    },
                    (err) => { 
                        clearTimeout(timeoutId);
                        // यदि अनुमति नहीं दी गई है, तो Null मानों के साथ आगे बढ़ें
                        console.warn("Geolocation denied or failed:", err.message);
                        resolve(null); 
                    },
                    { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 }
                );
            });

            if (position) {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
            }
        } catch (e) {
            console.warn('Geolocation Error:', e.message);
            // यदि Geolocation विफल हो जाता है, तो null मानों के साथ आगे बढ़ें
        }
    }
    
    // 🛡️ -------------------- INVISIBLE RECAPTCHA EXECUTION START -------------------- 🛡️
    let captchaToken = null;
    try {
        // 💡 NEW: Call the execution function from the hook
        captchaToken = await executeRecaptcha();

        if (!captchaToken) {
             throw new Error("reCAPTCHA token generation failed (empty token).");
        }

    } catch (e) {
        // This catches script loading errors, execution failures, or timeouts
        setIsLoading(false);
        console.error('reCAPTCHA Execution Error:', e);
        
        // 💡 UPDATED: Time out error handling
        const errorMessage = e.message.includes('timed out') 
            ? 'Security check timed out. Please wait a moment and try again.'
            : e.message.includes('not ready')
            ? 'Security check not loaded. Please wait and try again.'
            : 'Could not complete verification. Please refresh and try again.';
            
        return Alert.alert('Security Check Failed', errorMessage);
    }
    // 🛡️ -------------------- INVISIBLE RECAPTCHA EXECUTION END -------------------- 🛡️


    try {
      const res = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email: sanitizedEmail, 
            password: password, // 💡 FIX: Send sanitized password
            captchaToken: captchaToken, // 🛡️ SEND THE DYNAMICALLY GENERATED TOKEN
            latitude: userLocation.latitude,   // 💡 FIX: Send Location
            longitude: userLocation.longitude, // 💡 FIX: Send Location
        }),
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok) {
        await login(data.user);
        // 🎯 DIRECT NAVIGATION: navigateAfterLogin removed
        navigation.replace("Home"); 
      } else {
        // अगर टोकन वेरिफिकेशन सर्वर पर विफल हो जाता है, तो यह यहाँ विफल हो जाएगा
        Alert.alert('Login Failed', data.message || 'Invalid credentials or login failed.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Network error or unable to reach the server.');
    } finally {
      setIsLoading(false);
    }
  };

  // 💡 FIX: Pass theme properties as a single object to getStyles to avoid TypeError
  const dynamicStyles = getStyles({ colors, GENEROUS_RADIUS, DEEP_SOFT_SHADOW });


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
                      {/* FIX: Confirmed 'home-outline' usage for icon error fix */}
                      <Icon name="home-outline" size={90} color={colors.card} /> 
                      <Text style={dynamicStyles.logoText}>FlatMates Hub</Text> 
                      <Text style={dynamicStyles.tagline}>
                          India's Safest Platform to Find Verified Flatmates and Rent-Free Spaces.
                      </Text>
                  </View>
                )}

                {/* 🎯 CONDITIONAL RENDERING BLOCK REMOVED */}
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
                    recaptchaContainerRef={recaptchaContainerRef} 
                    isRecaptchaReady={isRecaptchaReady} 
                />
            </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};


// 🎨 Theme-based Dynamic Stylesheet
// 💡 FIX: Accept a single 'theme' object to match the call site
const getStyles = (theme) => {
    // Destructure properties from the theme object passed to getStyles
    const { colors, GENEROUS_RADIUS, DEEP_SOFT_SHADOW } = theme;

    return StyleSheet.create({
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

        // 🤖 RECAPTCHA Styles
        recaptchaContainer: {
            marginVertical: 15,
            alignItems: 'center', 
        },
        recaptchaBadgeText: {
            fontSize: 12,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 18,
            marginTop: 10, 
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

        // ... (SSO Styles) ...
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


    });
};

export default LoginScreen;