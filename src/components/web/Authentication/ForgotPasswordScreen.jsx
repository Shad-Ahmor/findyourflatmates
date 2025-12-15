// src/screens/ForgotPasswordScreen.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import { API_BASE_URL } from '@env'; 

const { width } = Dimensions.get("window");
const BREAKPOINT = 768;

const ForgotPasswordScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // success | error
  const [shake, setShake] = useState(false);

  const isWebOrTablet = width > BREAKPOINT;

  // Simple Email Validation
  const validateEmail = (mail) => {
    return /\S+@\S+\.\S+/.test(mail);
  };

  const handleResetPassword = async () => {
    if (!email || !validateEmail(email)) {
      setShake(true);
      setTimeout(() => setShake(false), 600);

      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/flatmate/forgot-password`,
        { email }
      );

      setStatus("success");
      setEmail(""); // clear input

    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={
            isWebOrTablet ? styles.scrollContent : styles.mobileScrollContent
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Animatable.View animation="bounceIn">
              <Icon name="lock-closed-outline" size={60} color="#FF9500" />
            </Animatable.View>

            <Text style={styles.logoText}>Reset Password</Text>
            <Text style={styles.tagline}>
              Enter your registered email to receive a reset link.
            </Text>
          </View>

          {/* Form Section */}
          <Animatable.View
            animation="fadeInUp"
            duration={600}
            style={styles.authContainer}
          >
            <Text style={styles.label}>Email Address</Text>

            <Animatable.View animation={shake ? "shake" : undefined}>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Animatable.View>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.resetButtonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>

            {/* Status Animation */}
            {status === "success" && (
              <Animatable.Text
                animation="fadeIn"
                duration={800}
                style={styles.successText}
              >
                ✔ Password reset link sent! Check your inbox.
              </Animatable.Text>
            )}

            {status === "error" && (
              <Animatable.Text
                animation="fadeIn"
                duration={800}
                style={styles.errorText}
              >
                ❌ Error sending email. Try again later.
              </Animatable.Text>
            )}
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f0f0" },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },

  mobileScrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
  },

  backButton: {
    position: "absolute",
    top: 20,
    left: 25,
    zIndex: 10,
    padding: 5,
  },

  heroSection: {
    alignItems: "center",
    marginBottom: 25,
    marginTop: 20,
  },

  logoText: {
    fontSize: 30,
    fontWeight: "900",
    marginTop: 10,
    color: "#333",
  },

  tagline: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
    paddingHorizontal: 30,
  },

  authContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 6,
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },

  resetButton: {
    backgroundColor: "#FF9500",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 15,
  },

  resetButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  successText: {
    color: "green",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },

  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },
});

export default ForgotPasswordScreen;
