// src/components/BasicDetailForm.web.jsx

import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

// -----------------------------------------------------------------
// 🎨 THEME CONSTANTS (ListingFormScreen Theme: Classic Blue & Orange)
// -----------------------------------------------------------------
const PRIMARY_COLOR = '#007AFF'; // Blue
const ACCENT_COLOR = '#FF9500'; // Orange
const ANIMATION_DURATION = '0.3s';

// Simplified web style for hover (Matching general web UI approach)
const BASE_ACTION_BUTTON_WEB_STYLES = Platform.select({
     web: { transition: `opacity ${ANIMATION_DURATION} ease-out`, cursor: 'pointer', ':hover': { opacity: 0.85 } }
});

/**
 * Step 2: Basic Detail Stepper Form (Profile Completion)
 * This component collects City, Phone Number, and User Intent (Primary/Secondary).
 * Submission calls the handleCompleteProfile API handler passed from the parent.
 */
const BasicDetailForm = (props) => {
    const { 
        city, setCity, countryCode, setCountryCode, phoneNumber, setPhoneNumber,
        primaryIntent, setPrimaryIntent, secondaryIntent, setSecondaryIntent,
        isLoading, isLocating, styles, handleCompleteProfile, setStep,
        PRIMARY_INTENTS, SECONDARY_INTENTS_MAP 
    } = props;
    
    // Automatically set secondary intent when primary intent changes
    useEffect(() => {
        if (SECONDARY_INTENTS_MAP[primaryIntent]) {
            setSecondaryIntent(SECONDARY_INTENTS_MAP[primaryIntent][0]);
        }
    }, [primaryIntent]);

    // --- Handlers ---
    const handlePrimaryIntentSelect = (intent) => {
        setPrimaryIntent(intent);
        // Reset secondary intent to the first option of the newly selected primary intent
        if(SECONDARY_INTENTS_MAP[intent]) {
            setSecondaryIntent(SECONDARY_INTENTS_MAP[intent][0]);
        }
    };

    const handleBackToStep1 = () => {
        if (!isLoading) {
            setStep(1);
        }
    };
    
    // Get secondary intents based on the currently selected primary intent
    const currentSecondaryIntents = SECONDARY_INTENTS_MAP[primaryIntent] || [];

    return (
        <View>
            {/* Back Button (Updated color) */}
            <TouchableOpacity 
                style={[
                    { marginBottom: 20, flexDirection: 'row', alignItems: 'center' }, 
                    !isLoading && BASE_ACTION_BUTTON_WEB_STYLES,
                    isLoading && styles.disabledButton,
                ]} 
                onPress={handleBackToStep1} 
                disabled={isLoading || isLocating}
            >
                {/* Icon and Text color set to PRIMARY_COLOR (Blue) */}
                <Icon name="arrow-back-outline" size={20} color={PRIMARY_COLOR} />
                <Text style={{ marginLeft: 5, fontSize: 16, color: PRIMARY_COLOR, fontWeight: '600' }}>Back to Account Info</Text>
            </TouchableOpacity>

            {/* City Input */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>City/Location</Text>
                <View style={{ position: 'relative' }}>
                    <TextInput
                        style={styles.input}
                        placeholder={isLocating ? "Detecting location..." : "e.g. Mumbai, New Delhi"}
                        value={city}
                        onChangeText={setCity}
                        autoCapitalize="words"
                        editable={!isLoading && !isLocating}
                    />
                    {isLocating && (
                        // Activity Indicator color updated
                        <ActivityIndicator 
                            size="small" 
                            color={PRIMARY_COLOR} 
                            style={styles.locationIndicator}
                        />
                    )}
                </View>
            </View>

            {/* Phone Number Input */}
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
            
            {/* Primary Intent Selection (Relies on styles from parent) */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Primary Intent (What are you looking for?)</Text>
                <View style={styles.intentSelectorContainer}>
                    {PRIMARY_INTENTS.map(intent => (
                        <TouchableOpacity
                            key={intent}
                            // intentButtonActive uses PRIMARY_COLOR in the parent style sheet
                            style={[
                                styles.intentButton,
                                primaryIntent === intent && styles.intentButtonActive,
                                isLoading && styles.disabledButton,
                                !isLoading && BASE_ACTION_BUTTON_WEB_STYLES // Hover effect
                            ]}
                            onPress={() => handlePrimaryIntentSelect(intent)}
                            disabled={isLoading}
                        >
                            <Text style={primaryIntent === intent ? styles.intentButtonTextActive : styles.intentButtonText}>
                                {intent}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Secondary Intent Selection (Relies on styles from parent) */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Secondary Intent (Specific Goal)</Text>
                <View style={styles.intentSelectorContainer}>
                    {currentSecondaryIntents.map(intent => (
                        <TouchableOpacity
                            key={intent}
                            // intentButtonActive uses PRIMARY_COLOR in the parent style sheet
                            style={[
                                styles.intentButton,
                                secondaryIntent === intent && styles.intentButtonActive,
                                isLoading && styles.disabledButton,
                                !isLoading && BASE_ACTION_BUTTON_WEB_STYLES // Hover effect
                            ]}
                            onPress={() => setSecondaryIntent(intent)}
                            disabled={isLoading}
                        >
                            <Text style={secondaryIntent === intent ? styles.intentButtonTextActive : styles.intentButtonText}>
                                {intent}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Submit Button (Updated background color and hover effect) */}
            <TouchableOpacity 
                style={[
                    styles.signupButton, 
                    isLoading && styles.disabledButton, 
                    {backgroundColor: ACCENT_COLOR}, // ACCENT_COLOR for CTA button
                    BASE_ACTION_BUTTON_WEB_STYLES
                ]} 
                onPress={handleCompleteProfile} 
                disabled={isLoading || isLocating}
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

export default BasicDetailForm;