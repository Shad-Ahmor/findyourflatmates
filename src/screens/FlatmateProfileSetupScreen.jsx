// src/screens/FlatmateProfileSetupScreen.jsx

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

// डमी डेटा: विकल्पों के लिए
const habits = {
    sleep: [
        { key: 'early', label: 'Early Bird (before 11 PM)' },
        { key: 'night', label: 'Night Owl (after 1 AM)' },
        { key: 'flexible', label: 'Flexible' },
    ],
    cleanliness: [
        { key: 'sparkling', label: 'Sparkling Clean (Must)' },
        { key: 'tidy', label: 'Tidy (Weekly Cleaning)' },
        { key: 'flexible', label: 'Flexible/Messy' },
    ],
    social: [
        { key: 'social', label: 'Very Social/Parties' },
        { key: 'occasional', label: 'Occasional Hangouts' },
        { key: 'private', label: 'Private/Keep to Myself' },
    ],
};

const FlatmateProfileSetupScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    profession: '',
    sleep: '',
    cleanliness: '',
    social: '',
  });

  const handleSelectOption = (category, value) => {
    setProfileData({ ...profileData, [category]: value });
  };
  
  const handleNextStep = () => {
    // यहाँ वैलिडेट करें कि वर्तमान स्टेप के फ़ील्ड भरे गए हैं या नहीं
    if (step === 1 && (!profileData.name || !profileData.age || !profileData.profession)) {
        Alert.alert("Missing Info", "Please fill in your Name, Age, and Profession.");
        return;
    }
    if (step === 2 && (!profileData.sleep || !profileData.cleanliness || !profileData.social)) {
        Alert.alert("Missing Info", "Please select all lifestyle options.");
        return;
    }

    if (step < 2) {
      setStep(step + 1);
    } else {
      handleSubmit(); // अंतिम स्टेप पर सबमिट करें
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
        // अगर यह पहला स्टेप है, तो पिछले स्क्रीन पर जाएं (यानी Main Tabs)
        navigation.goBack(); 
    }
  };

  const handleSubmit = () => {
    // 💡 Note: यहां API कॉल लॉजिक जाएगा।
    console.log('Submitting Flatmate Profile:', profileData);
    Alert.alert("Success", "Your profile is set! Ready for matching.");
    
    // सबमिट के बाद मुख्य ऐप पर वापस जाएं
    navigation.replace('Main'); 
  };
  
  // कॉम्पोनेंट: रेडियो बटन/टैब चयन
  const OptionSelector = ({ title, category, options }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.optionPill,
              profileData[category] === option.key && styles.optionPillActive
            ]}
            onPress={() => handleSelectOption(category, option.key)}
          >
            <Text style={[
                styles.optionText, 
                profileData[category] === option.key && styles.optionTextActive
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.headerContainer}>
            <Text style={styles.header}>Setup Your Flatmate Profile</Text>
            <Text style={styles.stepIndicator}>Step {step} of 2</Text>
        </View>

        {/* --- Step 1: Basic Info --- */}
        {step === 1 && (
          <View style={styles.stepSection}>
            <Text style={styles.sectionTitle}>1. Personal & Professional Details</Text>
            
            <View style={styles.row}>
                <View style={styles.halfInput}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Your Name"
                        value={profileData.name}
                        onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                    />
                </View>
                <View style={styles.halfInput}>
                    <Text style={styles.label}>Age</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="25"
                        keyboardType="numeric"
                        value={profileData.age}
                        onChangeText={(text) => setProfileData({ ...profileData, age: text })}
                    />
                </View>
            </View>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Profession/Study</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Software Engineer, Student"
                    value={profileData.profession}
                    onChangeText={(text) => setProfileData({ ...profileData, profession: text })}
                />
            </View>
          </View>
        )}

        {/* --- Step 2: Lifestyle Habits --- */}
        {step === 2 && (
          <View style={styles.stepSection}>
            <Text style={styles.sectionTitle}>2. Lifestyle & Habits (For Matching)</Text>
            
            <OptionSelector 
                title="Your Sleeping Habits" 
                category="sleep" 
                options={habits.sleep} 
            />
            <OptionSelector 
                title="Your Cleanliness Preference" 
                category="cleanliness" 
                options={habits.cleanliness} 
            />
            <OptionSelector 
                title="Your Social Preference" 
                category="social" 
                options={habits.social} 
            />
          </View>
        )}

        {/* --- Navigation Buttons --- */}
        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity 
                style={[styles.navButton, styles.backButton]} 
                onPress={handlePrevStep}
            >
              <Text style={styles.navButtonText}>← Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.navButton, styles.nextButton, step === 1 && { width: '100%' }]} 
            onPress={handleNextStep}
          >
            <Text style={styles.navButtonText}>
              {step < 2 ? 'Next: Habits →' : 'Submit Profile ✅'}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// स्टाइलशीट
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { paddingHorizontal: 20, paddingVertical: 20, },
  headerContainer: { marginBottom: 25, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  stepIndicator: {
    fontSize: 16,
    color: '#FF9500',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 20,
  },
  stepSection: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8, color: '#333', fontWeight: '500' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfInput: {
    width: '48%',
  },
  // --- Options Selector (Pills) ---
  optionsContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    // alignItems: 'flex-start', // Vertical alignment
  },
  optionPill: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    backgroundColor: '#fff',
    elevation: 1, // Android shadow
    width: '100%',
  },
  optionPillActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
    elevation: 3,
  },
  optionText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  // --- Navigation Buttons ---
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    width: '48%', // 48% width for side-by-side buttons
    elevation: 4,
  },
  backButton: {
    backgroundColor: '#6c757d', // Gray color
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  navButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FlatmateProfileSetupScreen;