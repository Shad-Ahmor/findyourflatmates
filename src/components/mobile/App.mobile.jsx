import * as React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// ❌ सभी स्क्रीन इम्पोर्ट्स हटा दिए गए हैं
// import PrivacyPolicyScreen from '../../screens/PrivacyPolicyScreen.jsx'; 
// import TermsScreen from '../../screens/TermsScreen.jsx';


const Stack = createNativeStackNavigator();

// ------------------------------------------------------
// 🎯 D E M O S C R E E N (सबसे सरल कॉम्पोनेंट)
// ------------------------------------------------------
const DemoScreen = () => {
    const colors = { background: '#F8F8FF', text: '#101010', primary: '#FF3366' };
    return (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
            <Text style={[styles.loadingText, { color: colors.primary, fontSize: 24 }]}>
                ✅ Success! App Loaded!
            </Text>
            <Text style={[styles.loadingText, { color: colors.text }]}>
                (Native/Network issues are fixed)
            </Text>
        </View>
    );
};


// ------------------------------------------------------
// 🚨 Mobile RootStack Function (Extremely Minimal)
// ------------------------------------------------------
function RootStack() {
  const colors = { background: '#F8F8FF', text: '#101010', primary: '#FF3366' }; 

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShown: false, // हेडर को भी हटा दें
      }}
      initialRouteName="Demo" 
    >
      <Stack.Screen 
        name="Demo" 
        component={DemoScreen} 
      />
    </Stack.Navigator>
  );
}


// ======================================================
// 📌 Mobile App Component (UNCHANGED)
// ======================================================
export default function MobileApp() {
  return (
    <SafeAreaProvider>
      <NavigationContainer> 
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
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