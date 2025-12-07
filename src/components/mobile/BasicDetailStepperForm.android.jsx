import React, { useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ActivityIndicator 
} from 'react-native';

// CONSTANTS (Required for button color)
const PRIMARY_COLOR = '#007AFF'; // Blue
const ACCENT_COLOR = '#FF9500'; // Orange

// --- STUB COMPONENT 2: BasicDetailStepperForm (Step 2 Form) ---
const BasicDetailStepperForm = ({
    city, setCity, countryCode, setCountryCode, phoneNumber, setPhoneNumber,
    primaryIntent, setPrimaryIntent, secondaryIntent, setSecondaryIntent,
    isLocating, isLoading, styles, handleCompleteProfile,
    SECONDARY_INTENTS_MAP, PRIMARY_INTENTS
}) => {
    
    // Automatically set secondary intent when primary intent changes
    useEffect(() => {
        if (SECONDARY_INTENTS_MAP[primaryIntent]) {
            setSecondaryIntent(SECONDARY_INTENTS_MAP[primaryIntent][0]);
        }
    }, [primaryIntent]);

    const secondaryIntents = SECONDARY_INTENTS_MAP[primaryIntent] || [];

    return (
        <View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>City/Location</Text>
                <View style={{ position: 'relative' }}>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Mumbai, New Delhi"
                        value={city}
                        onChangeText={setCity}
                        editable={!isLoading && !isLocating}
                    />
                    {isLocating && (
                        <ActivityIndicator 
                            size="small" 
                            color={PRIMARY_COLOR} 
                            style={styles.locationIndicator}
                        />
                    )}
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.phoneInputContainer}>
                    <TextInput
                        style={[styles.input, styles.countryCodeInput]}
                        placeholder="+91"
                        value={countryCode}
                        onChangeText={setCountryCode}
                        editable={!isLoading}
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        style={[styles.input, styles.phoneNumberInput]}
                        placeholder="Enter 10-digit number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        editable={!isLoading}
                        keyboardType="phone-pad"
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Primary Intent (What are you looking for?)</Text>
                <View style={styles.intentSelectorContainer}>
                    {PRIMARY_INTENTS.map(intent => (
                        <TouchableOpacity
                            key={intent}
                            style={[
                                styles.intentButton,
                                primaryIntent === intent && styles.intentButtonActive
                            ]}
                            onPress={() => setPrimaryIntent(intent)}
                            disabled={isLoading}
                        >
                            <Text style={[
                                styles.intentButtonText,
                                primaryIntent === intent && styles.intentButtonTextActive
                            ]}>
                                {intent}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Secondary Intent (Specific Goal)</Text>
                <View style={styles.intentSelectorContainer}>
                    {secondaryIntents.map(intent => (
                        <TouchableOpacity
                            key={intent}
                            style={[
                                styles.intentButton,
                                secondaryIntent === intent && styles.intentButtonActive
                            ]}
                            onPress={() => setSecondaryIntent(intent)}
                            disabled={isLoading}
                        >
                            <Text style={[
                                styles.intentButtonText,
                                secondaryIntent === intent && styles.intentButtonTextActive
                            ]}>
                                {intent}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity 
                style={[styles.signupButton, isLoading && styles.disabledButton]} 
                onPress={handleCompleteProfile} 
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#FFF" size="small" />
                ) : (
                    <Text style={styles.signupButtonText}>Complete Profile</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default BasicDetailStepperForm;