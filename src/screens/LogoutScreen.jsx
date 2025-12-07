import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function LogoutScreen({ navigation }) {
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // 🔥 1) Call backend logout API
        await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/api/flatmate/logout`,
          {},
          { withCredentials: true }
        );

        // 🔥 2) Clear frontend session (AuthContext)
        await logout();

        // 🔥 3) Redirect to Landing page
        navigation.replace('Landing');

      } catch (error) {
        console.log("Logout error:", error);

        // फिर भी logout कर देंगे ताकि user stuck न हो
        await logout();
        navigation.replace('Landing');
      }
    };

    performLogout();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>Logging out...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
});
