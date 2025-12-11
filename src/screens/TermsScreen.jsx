// src/screens/TermsScreen.jsx
import * as React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../theme/theme'; // सुनिश्चित करें कि path सही है

const TermsScreen = () => {
  const { colors } = useTheme();

  // App.js से स्टाइल को यहाँ दोहराया गया है।
  const styles = StyleSheet.create({
    staticScreenContainer: { 
        flex: 1,
        padding: 20,
        maxWidth: 800, 
        alignSelf: Platform.OS === 'web' ? 'center' : 'stretch',
    },
    staticTitle: { 
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    staticText: { 
        fontSize: 16,
        lineHeight: 24,
    }
  });

  return (
    <View style={[styles.staticScreenContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.staticTitle, { color: colors.text }]}>Terms and Conditions</Text>
      <Text style={[styles.staticText, { color: colors.text }]}>
        This is a placeholder for your Terms and Conditions content.
        Please replace this with your actual legal document soon.
      </Text>
    </View>
  );
};

export default TermsScreen;