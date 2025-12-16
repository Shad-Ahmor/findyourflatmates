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
import { useTheme } from '../../../theme/theme.js'; 
// 🛑 REMOVED: import { API_BASE_URL } from '@env'; 

// 🚀 NEW: Import the extracted SSO Buttons
import SSOButtons from './sso.web.jsx'; 
// 🛑 REMOVED: Import reCAPTCHA hook and container component (Not needed with Client Sign-in)
// import useRecaptcha, { RecaptchaContainer } from './captcha.web.jsx'; 

// 🚀 NEW: Import the centralized authentication service
import { loginUser } from '../../../services/authService'; // 💡 सुनिश्चित करें कि यह path सही है


const { width } = Dimensions.get('window');
const BREAKPOINT = 768; 
// 🛑 REMOVED: const LOGIN_URL = `${API_BASE_URL}/flatmate/login`; 


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
    // 🛑 REMOVED: recaptchaContainerRef, isRecaptchaReady 
}) => (
      <View style={[
        styles.authContainerBase,
        { backgroundColor: colors.card },
        isWebOrTablet 
          ? { width: '50%', padding: 50 } 
          : { paddingHorizontal: 30, width: '100%', paddingVertical: 40 }
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

        {/* 🛑 REMOVED: RECAPTCHA Component */}

        <TouchableOpacity 
            onPress={handleLogin} 
            style={[
              styles.actionButton, 
              { backgroundColor: colors.primary, borderRadius: styles.GENEROUS_RADIUS }, 
              SUBTLE_SHADOW,
              isLoading && styles.disabledButton
            ]}
            // 🛑 CHANGED: Disabled only by isLoading now
            disabled={isLoading} 
        >
           {isLoading ? ( 
            <Text style={styles.actionButtonText}>LOGGING IN...</Text>
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
  
  // 🛑 REMOVED: RECAPTCHA HOOK USAGE

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
    if (password.length < 6) { 
        return Alert.alert('Error', 'Password must be at least 6 characters long.');
    }

    setIsLoading(true);

    // 💡 Geolocation logic for RTDB update
    let userLocation = { latitude: null, longitude: null };
    if (navigator.geolocation) {
        try {
            const position = await new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => reject(new Error('Geolocation timed out.')), 5000);
                navigator.geolocation.getCurrentPosition(
                    (pos) => { 
                        clearTimeout(timeoutId);
                        resolve(pos);
                    },
                    (err) => { 
                        clearTimeout(timeoutId);
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
        }
    }
    
    // 🛑 REMOVED: INVISIBLE RECAPTCHA EXECUTION


    try {
      // 🚀 FUNDAMENTAL CHANGE: Call the centralized service
      const user = await loginUser(
        sanitizedEmail, 
        password, 
        userLocation.latitude, 
        userLocation.longitude
      );

      // 3. AuthContext को अपडेट करें
      await login(user); 
      
      // DIRECT NAVIGATION
      navigation.replace("Main"); 
      
    } catch (e) {
      console.error('Login Failed:', e);
      let errorMessage = 'Login failed. Please check your credentials.';

      // Firebase Error Code Handling (Matches previous backend response)
      if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (e.code === 'auth/invalid-email') {
        errorMessage = 'The email address is not valid.';
      } else if (e.code === 'auth/too-many-requests') {
        errorMessage = 'Access temporarily blocked due to too many failed attempts.';
      } else if (e.code === 'auth/network-request-failed') {
         errorMessage = 'Network error. Please check your connection.';
      }

      Alert.alert('Login Failed', errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  const dynamicStyles = getStyles({ colors, GENEROUS_RADIUS, DEEP_SOFT_SHADOW, SUBTLE_SHADOW, BREAKPOINT, width });


  return (
  <View style={[dynamicStyles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={dynamicStyles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={dynamicStyles.scrollContent}>

          <View style={[
            dynamicStyles.webContainer, 
            DEEP_SOFT_SHADOW, 
            { backgroundColor: colors.card, borderRadius: GENEROUS_RADIUS } 
          ]}>

                {/* Hero Section (Left Panel) */}
                {isWebOrTablet && (
                  <View style={[
                      dynamicStyles.heroSection, 
                      { backgroundColor: colors.primary, borderRadius: GENEROUS_RADIUS }
                  ]}>
                      <Icon name="home-outline" size={90} color={colors.card} /> 
                      <Text style={dynamicStyles.logoText}>FYF</Text> 
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
                    SUBTLE_SHADOW={SUBTLE_SHADOW} 
                />
            </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};


// 🎨 Theme-based Dynamic Stylesheet (No changes to logic here)
const getStyles = (theme) => {
    // ... (Styles logic remains the same) ...
    const { colors, GENEROUS_RADIUS, DEEP_SOFT_SHADOW, SUBTLE_SHADOW, BREAKPOINT, width } = theme;

    const hoverScaleEffect = {
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        ':hover': {
            transform: [{ scale: 1.03 }], 
            boxShadow: `0 10px 20px 0px ${colors.text}25`, 
        },
    };

    return StyleSheet.create({
        // ... (Styles remain the same, including cleanup of unused recaptcha styles if desired) ...
        safeArea: { flex: 1, backgroundColor: colors.background },
        keyboardView: { flex: 1 },
        scrollContent: { 
            flexGrow: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            margin:'10px',
            paddingVertical: 40,
            paddingHorizontal: width > BREAKPOINT ? 20 : 0, 
        },

        webContainer: { 
            flexDirection: 'row', 
            width: '100%', 
            maxWidth: width > BREAKPOINT ? 1000 : '100%', 
            backgroundColor: colors.card, 
            borderRadius: GENEROUS_RADIUS, 
            overflow: 'hidden',
        },
  
        heroSection: { 
            width: '50%', 
            backgroundColor: colors.primary, 
            padding: 50, 
            justifyContent: 'center', 
            alignItems: 'center',
            borderTopLeftRadius: GENEROUS_RADIUS,
            borderBottomLeftRadius: GENEROUS_RADIUS,
        },
        logoText: { 
            fontSize: 40, 
            fontWeight: '900', 
            color: colors.card, 
            textAlign: 'center', 
            marginTop: 20, 
            letterSpacing: 1, 
        },
        tagline: { 
            fontSize: 18, 
            color: colors.background, 
            textAlign: 'center', 
            marginTop: 20,
            lineHeight: 25,
            fontWeight: '600', 
        },
   
        authContainerBase: { 
            paddingTop: 20, 
            justifyContent: 'center', 
            width: '100%' 
        },
        authHeader: { 
            fontSize: width > BREAKPOINT ? 36 : 28, 
            fontWeight: '900', 
            color: colors.text, 
            marginBottom: 40, 
            textAlign: 'left',
            letterSpacing: 0.5,
        },

        inputGroup: { marginBottom: 25 }, 
        label: { 
            fontSize: width > BREAKPOINT ? 16 : 15, 
            marginBottom: 8, 
            fontWeight: '700' 
        },
        input: { 
            borderRadius: 15, 
            height: 60, 
            paddingHorizontal: 20, 
            fontSize: 18, 
            borderWidth: 2, 
            transition: 'border-color 0.2s',
            ':focus': {
                borderColor: colors.primary, 
                outline: 'none', 
            }
        },

        // 🛑 CLEANUP: RECAPTCHA Styles removed
        // recaptchaContainer: { ... }
        // recaptchaBadgeText: { ... }

        forgotPasswordContainer: {
            marginBottom: 25,
            marginTop: -10,
        },
        forgotPasswordText: { 
            textAlign: 'right', 
            fontSize: 15, 
            fontWeight: '800' 
        },
        actionButton: { 
            paddingVertical: 18, 
            alignItems: 'center', 
            borderRadius:'20px',
            marginTop: 10,
            ...hoverScaleEffect, 
        },
        actionButtonText: { 
            color: colors.card, 
            fontSize: 18, 
            fontWeight: '900',
            letterSpacing: 1.5, 
        },
        disabledButton: { opacity: 0.6 },
  
        switchButton: { marginTop: 20, padding: 5 },
        switchButtonText: { 
            textAlign: 'center', 
            fontSize: 15, 
            fontWeight: '600' 
        },
        switchButtonHighlight: {
            fontWeight: '900', 
        },

        mobileAuthButtons: { marginTop: 30, marginBottom: 10 },
        orSeparator: { 
            textAlign: 'center', 
            marginVertical: 25,
            fontSize: 13, 
            fontWeight: '900', 
            letterSpacing: 2, 
        },
        socialButton: { 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center', 
            borderRadius: 15, 
            paddingVertical: 14, 
            marginTop: 15, 
            borderWidth: 1.5, 
            ...hoverScaleEffect, 
        },
        socialButtonText: { 
            fontSize: 16, 
            fontWeight: '700', 
            marginLeft: 10 
        },
    });
};

export default LoginScreen;