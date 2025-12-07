// src/screens/LoginScreen.android.jsx

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
  ActivityIndicator, // ✅ Added ActivityIndicator for consistency
} from 'react-native';
import AppConfig from "../../config/index.android";
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as Network from 'expo-network';
import { useAuth } from '../../context/AuthContext'; // ✅ Added useAuth import

const { width, height } = Dimensions.get("window");

// RESPONSIVE SIZES
const isSmall = width < 380;
const isTablet = width > 768;

// MAIN URL
const API_BASE_URL = AppConfig.API_BASE_URL;
const LOGIN_URL = `${API_BASE_URL}/flatmate/login`;

// ======================================================
// REUSABLE LOGIN FORM
const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleForgotPassword,
  handleLogin,
  handleSignupNavigate,
  isLoading,
  styles
}) => (
  <View style={styles.formWrapper}>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
      />
    </View>

    <TouchableOpacity
      onPress={handleForgotPassword}
      style={{ marginBottom: 15 }}
      disabled={isLoading}
    >
      <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={handleLogin}
      style={[styles.actionButton, isLoading && styles.disabledButton]}
      disabled={isLoading}
    >
      {/* 💡 FIX: Using ActivityIndicator inside the button for better UX */}
      {isLoading ? (
        <ActivityIndicator color="#FFF" size="small" />
      ) : (
        <Text style={styles.actionButtonText}>Login</Text>
      )}
    </TouchableOpacity>

    <TouchableOpacity
      onPress={handleSignupNavigate}
      style={styles.switchButton}
      disabled={isLoading}
    >
      <Text style={styles.switchButtonText}>
        Don't have an account? <Text style={{ fontWeight: 'bold' }}>Sign Up</Text>
      </Text>
    </TouchableOpacity>
  </View>
);

// ======================================================
// LOGIN SCREEN
// ======================================================
const LoginScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { login } = useAuth(); // ✅ useAuth हुक का उपयोग करें

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // LOCATION + IP FETCHER
  const getLocationAndIP = async () => {
    let latitude = null;
    let longitude = null;
    let ip = null;

    try {
      ip = await Network.getIpAddressAsync();
    } catch (e) { console.warn('Error fetching local IP:', e); }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });
        latitude = loc.coords.latitude;
        longitude = loc.coords.longitude;
      }
    } catch (e) { console.warn('Error fetching location:', e); }

    // Public IP fetch (Using the reliable external service from your original web code)
    let publicIp = null;
    try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        publicIp = ipData.ip;
    } catch (e) { console.warn('Error fetching public IP:', e); }


    return { latitude, longitude, ip: publicIp || ip }; // Send public IP if available, otherwise local
  };


const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Please enter credentials.");
    return;
  }

  setIsLoading(true);

  let locationData = { latitude: null, longitude: null, ip: null };

  try {
    // 1️⃣ Get geolocation and IP
    locationData = await getLocationAndIP();

  } catch (e) {
    console.warn('Error getting location or IP:', e);
  }

  try {
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        ip: locationData.ip, // ✅ send IP
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const apiToken = data.idToken;
      const sessionData = data.user;

      if (apiToken && sessionData) {
          // 🎯 FIX: AuthContext को अपडेट करें। यह RootStack को Home पर स्विच कर देगा।
          await login(apiToken, sessionData);

          // ❌ REMOVED: navigation.replace('Home') या navigateToMain()
          // ❌ REMOVED: Alert.alert("Login Successful", ...)
      } else {
        Alert.alert("Login Failed", "Authentication data missing from server response.");
      }

    } else {
      Alert.alert("Login Failed", data.message || 'Unknown error occurred.');
    }

  } catch (e) {
    console.error('Login network error:', e);
    Alert.alert("Error", "Could not connect to server. Check your network.");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >

        <ScrollView contentContainerStyle={styles.scrollContent}>

          <View style={{ width: "100%", backgroundColor: "#fff" }}>

            {/* HERO SECTION (No Lottie) */}
            <View style={styles.heroSection}>
              <Text style={styles.logoText}>FlatMates</Text>
              <Text style={styles.tagline}>Find Your Perfect Flatmate.</Text>
            </View>

            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleForgotPassword={() => navigation.navigate("ForgotPassword")}
              handleLogin={handleLogin}
              handleSignupNavigate={() => navigation.navigate("Signup")}
              isLoading={isLoading}
              styles={styles}
            />

            {/* SOCIAL LOGIN */}
            <View style={styles.mobileAuthButtons}>
              <Text style={styles.orSeparator}>— OR —</Text>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => Alert.alert("Coming Soon", "Google Login")}
                disabled={isLoading}
              >
                <Icon name="logo-google" size={20} color="#db4437" />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => Alert.alert("Coming Soon", "Apple Login")}
                disabled={isLoading}
              >
                <Icon name="logo-apple" size={20} color="#000" />
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </TouchableOpacity>

            </View>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>
    </View>
  );
};

// ======================================================
// RESPONSIVE STYLES
// ======================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0"
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: isSmall ? 10 : 20,
  },

  heroSection: {
    paddingVertical: isSmall ? 20 : 35,
    alignItems: "center",
  },
  logoText: {
    fontSize: isTablet ? 36 : isSmall ? 18 : 24,
    fontWeight: "900",
    marginTop: 5,
  },
  tagline: {
    fontSize: isTablet ? 20 : isSmall ? 12 : 14,
    color: "#555",
    textAlign: "center",
    marginTop: 5,
  },

  formWrapper: {
    paddingHorizontal: isTablet ? 80 : 25,
    paddingTop: 10,
  },

  inputGroup: { marginBottom: 15 },
  label: {
    fontSize: isTablet ? 20 : 15,
    marginBottom: 8,
    fontWeight: "500"
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    height: isTablet ? 70 : 52,
    paddingHorizontal: 15,
    fontSize: isTablet ? 20 : 16,
    borderWidth: 1,
    borderColor: "#ddd"
  },

  forgotPasswordText: {
    textAlign: "right",
    color: "#007AFF",
    fontSize: isSmall ? 12 : 14,
    fontWeight: "500"
  },

  actionButton: {
    backgroundColor: "#FF9500",
    borderRadius: 12,
    paddingVertical: isTablet ? 20 : 16,
    marginTop: 15,
    alignItems: "center",
    elevation: 6,
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: isTablet ? 22 : 18,
    fontWeight: "900",
  },
  disabledButton: { opacity: 0.7 },

  switchButton: { marginTop: 15 },
  switchButtonText: {
    textAlign: "center",
    color: "#007AFF",
    fontSize: isSmall ? 13 : 15,
    fontWeight: "500",
  },

  mobileAuthButtons: {
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: isTablet ? 80 : 25,
  },
  socialButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: isTablet ? 18 : 14,
    marginTop: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd"
  },
  socialButtonText: {
    fontSize: isSmall ? 14 : 16,
    fontWeight: "600",
    marginLeft: 10,
    color: "#000"
  },

  orSeparator: {
    textAlign: "center",
    color: "#aaa",
    marginVertical: 15,
    fontSize: isSmall ? 12 : 14,
  }
});

export default LoginScreen;