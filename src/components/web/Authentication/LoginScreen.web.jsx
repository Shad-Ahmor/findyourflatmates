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
import { useAuth } from '../../../context/AuthContext.js';
// 💡 FIX: Destructure required styles from the theme for easy access
import { useTheme } from '../../../theme/theme.js'; 
import { API_BASE_URL } from '@env'; 
// Recaptcha कंपोनेंट अब इस्तेमाल नहीं हो रहा

// 🚀 NEW: Import the extracted SSO Buttons
import SSOButtons from './sso.web.jsx'; 
// 💡 NEW: Import reCAPTCHA hook and container component
import useRecaptcha, { RecaptchaContainer } from './captcha.web.jsx'; 


const { width } = Dimensions.get('window');
const BREAKPOINT = 768; 
const LOGIN_URL = `${API_BASE_URL}/flatmate/login`; 


// 🛡️ SECURITY HELPER 1: Client-Side Sanitization
const sanitizeString = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim(); 
};

// 🛡️ SECURITY HELPER 2: Basic Email Format Validation
const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};


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
        // Web/Tablet: 50% width, more padding. Mobile: 100% width, appropriate padding.
        isWebOrTablet 
          ? { width: '50%', padding: 50 } 
          : { paddingHorizontal: 30, width: '100%', paddingVertical: 40 } // Mobile width and padding
    ]}>
        <Text style={[styles.authHeader, { color: colors.text }]}>Welcome Back</Text>
        
        {/* Email Input */}
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
        {/* Password Input */}
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
              // 💡 FIX: Access GENEROUS_RADIUS via styles object
              { backgroundColor: colors.primary, borderRadius: styles.GENEROUS_RADIUS }, 
              SUBTLE_SHADOW,
              (isLoading || !isRecaptchaReady) && styles.disabledButton
            ]}
            disabled={isLoading || !isRecaptchaReady} 
        >
           {/* Show appropriate indicator/text based on readiness and loading */}
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
  // 💡 FIX: Destructure all required theme properties
  const { colors, GENEROUS_RADIUS, DEEP_SOFT_SHADOW, SUBTLE_SHADOW } = useTheme(); 
  
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  
  // --- Login Form States ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  
  // --- 💡 RECAPTCHA HOOK USAGE ---
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

    // 💡 Geolocation logic re-added
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
            password: password, 
            captchaToken: captchaToken, // 🛡️ SEND THE DYNAMICALLY GENERATED TOKEN
            latitude: userLocation.latitude,   
            longitude: userLocation.longitude, 
        }),
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok) {
        await login(data.user);
        // DIRECT NAVIGATION
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

  // 💡 FIX: Pass theme properties as a single object to getStyles
  const dynamicStyles = getStyles({ colors, GENEROUS_RADIUS, DEEP_SOFT_SHADOW, SUBTLE_SHADOW, BREAKPOINT, width });


  return (
  <View style={[dynamicStyles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={dynamicStyles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Centered Scroll View for Web */}
        <ScrollView contentContainerStyle={dynamicStyles.scrollContent}>

          {/* Hero + Form Shadow Card - Applying DEEP_SOFT_SHADOW for the floating 3D effect */}
          <View style={[
            dynamicStyles.webContainer, 
            DEEP_SOFT_SHADOW, 
            { backgroundColor: colors.card, borderRadius: GENEROUS_RADIUS } 
          ]}>

                {/* Hero Section (Left Panel) - Visible for web/tablet view */}
                {isWebOrTablet && (
                  <View style={[
                      dynamicStyles.heroSection, 
                      // Using a mix of primary and card colors for the vibrant look
                      { backgroundColor: colors.primary, borderRadius: GENEROUS_RADIUS }
                  ]}>
                      {/* Using the card color for contrast on the primary background */}
                      <Icon name="home-outline" size={90} color={colors.card} /> 
                      <Text style={dynamicStyles.logoText}>FlatMates Hub</Text> 
                      <Text style={dynamicStyles.tagline}>
                          India's Safest Platform to Find Verified Flatmates and Rent-Free Spaces.
                      </Text>
                  </View>
                )}

                {/* Login Form (Right Panel) */}
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
                    SUBTLE_SHADOW={SUBTLE_SHADOW} // Pass the shadow style
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
const getStyles = (theme) => {
    // Destructure properties from the theme object passed to getStyles
    const { colors, GENEROUS_RADIUS, DEEP_SOFT_SHADOW, SUBTLE_SHADOW, BREAKPOINT, width } = theme;

    // 🌟 HOVER EFFECT MIXIN (To match LandingScreen's 3D feel on buttons)
    const hoverScaleEffect = {
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        ':hover': {
            transform: [{ scale: 1.03 }], // Slightly lifts the button
            // Use a slight shadow based on the text color for depth
            boxShadow: `0 10px 20px 0px ${colors.text}25`, 
        },
    };

    return StyleSheet.create({
        // ... (Existing Global/Container Styles) ...
        safeArea: { flex: 1, backgroundColor: colors.background },
        keyboardView: { flex: 1 },
        // Ensure content is centered for the large web view
        scrollContent: { 
            flexGrow: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            margin:'10px',
            paddingVertical: 40,
            paddingHorizontal: width > BREAKPOINT ? 20 : 0, // Add horizontal padding for mobile view safety
        },

        webContainer: { 
            flexDirection: 'row', 
            width: '100%', 
            // Max width set to 1000px for a contained, centered web experience
            maxWidth: width > BREAKPOINT ? 1000 : '100%', 
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
            // Ensure the Hero has the rounded corner treatment
            borderTopLeftRadius: GENEROUS_RADIUS,
            borderBottomLeftRadius: GENEROUS_RADIUS,
        },
        logoText: { 
            fontSize: 40, 
            fontWeight: '900', // BOLDNESS INCREASED
            color: colors.card, 
            textAlign: 'center', 
            marginTop: 20, 
            letterSpacing: 1, // Increased spacing for prominence
        },
        tagline: { 
            fontSize: 18, 
            color: colors.background, 
            textAlign: 'center', 
            marginTop: 20,
            lineHeight: 25,
            fontWeight: '600', // Increased weight
        },

   
        authContainerBase: { 
            paddingTop: 20, 
            justifyContent: 'center', 
            width: '100%' 
        },
        authHeader: { 
            fontSize: width > BREAKPOINT ? 36 : 28, // 💡 FIX: Responsive font size
            fontWeight: '900', // Increased to max bold for the 'magical' look
            color: colors.text, 
            marginBottom: 40, 
            textAlign: 'left',
            letterSpacing: 0.5,
        },

        inputGroup: { marginBottom: 25 }, 
        label: { 
            fontSize: width > BREAKPOINT ? 16 : 15, // Slightly responsive label
            marginBottom: 8, 
            fontWeight: '700' // Bolder label
        },
        input: { 
            borderRadius: 15, // More rounded corners
            height: 60, // Taller input field
            paddingHorizontal: 20, // More internal padding
            fontSize: 18, // Larger text input
            borderWidth: 2, // Thicker border for prominence
            // 💡 Hover/Focus Effect (Web-only)
            transition: 'border-color 0.2s',
            ':focus': {
                borderColor: colors.primary, // Primary color highlight on focus
                outline: 'none', // Remove default browser outline
            }
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
            fontSize: 15, 
            fontWeight: '800' // Bolder
        },
        actionButton: { 
            paddingVertical: 18, 
            alignItems: 'center', 
            borderRadius:'20px',
            marginTop: 10,
            ...hoverScaleEffect, // Applying the 3D hover effect
        },
        actionButtonText: { 
            color: colors.card, 
            fontSize: 18, 
            fontWeight: '900',
            letterSpacing: 1.5, // Increased letter spacing
        },
        disabledButton: { opacity: 0.6 },
  
        switchButton: { marginTop: 20, padding: 5 },
        switchButtonText: { 
            textAlign: 'center', 
            fontSize: 15, 
            fontWeight: '600' // Bolder
        },
        switchButtonHighlight: {
            fontWeight: '900', 
        },

        // ... (SSO Styles) ...
        mobileAuthButtons: { marginTop: 30, marginBottom: 10 },
        orSeparator: { 
            textAlign: 'center', 
            marginVertical: 25,
            fontSize: 13, // Slightly larger
            fontWeight: '900', // Max bold
            letterSpacing: 2, // Increased spacing
        },
        socialButton: { 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center', 
            borderRadius: 15, // More rounded
            paddingVertical: 14, 
            marginTop: 15, // More margin
            borderWidth: 1.5, // Slightly thicker border
            ...hoverScaleEffect, // Applying the 3D hover effect
        },
        socialButtonText: { 
            fontSize: 16, 
            fontWeight: '700', // Bolder
            marginLeft: 10 
        },
    });
};

export default LoginScreen;