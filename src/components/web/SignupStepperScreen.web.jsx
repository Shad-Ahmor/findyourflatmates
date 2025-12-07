// src/components/SignupStepperScreen.web.jsx

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

// -----------------------------------------------------------------
// 🎨 THEME CONSTANTS (ListingFormScreen Theme: Classic Blue & Orange)
// -----------------------------------------------------------------
const PRIMARY_COLOR = '#007AFF'; // Blue
const ACCENT_COLOR = '#FF9500'; // Orange
const ERROR_COLOR = '#FF3B30'; // Red
const ANIMATION_DURATION = '0.3s';

// Simplified web style for hover (Matching general web UI approach)
const BASE_ACTION_BUTTON_WEB_STYLES = Platform.select({
     web: { transition: `opacity ${ANIMATION_DURATION} ease-out`, cursor: 'pointer', ':hover': { opacity: 0.85 } }
});

/**
 * Step 1: Account Setup Form (Signup)
 * This component collects Email, Username, and Password.
 * Submission calls the handleSignup API handler passed from the parent.
 */
const SignupStepperScreen = ({ 
    username, setUsername, email, setEmail, password, setPassword, 
    confirmPassword, setConfirmPassword, isPasswordVisible, 
    togglePasswordVisibility, passwordStrengthError, styles, 
    handleSignup, isLoading, handleGeneratePassword, handleLoginNavigation
}) => {
    
    return (
        <View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoading}
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Choose a username"
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                    editable={!isLoading}
                />
            </View>
            
            {/* Password Input (Updated colors) */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordInputWrapper}> 
                    <TextInput
                        style={[styles.input, styles.passwordTextInput]} 
                        placeholder="Create a strong password"
                        secureTextEntry={!isPasswordVisible}
                        value={password}
                        onChangeText={setPassword}
                        editable={!isLoading}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordToggle} disabled={isLoading}>
                        <Icon name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={20} color="#777" /> 
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleGeneratePassword} style={styles.generateButton} disabled={isLoading}>
                         {/* Icon color set to ACCENT_COLOR (Orange) */}
                         <Icon name='key-outline' size={20} color={ACCENT_COLOR} /> 
                    </TouchableOpacity>
                </View>
                {/* Error text color set to ERROR_COLOR (Red) */}
                {passwordStrengthError && <Text style={[styles.errorText, {color: ERROR_COLOR}]}><Icon name="alert-circle-outline" size={12} color={ERROR_COLOR} /> {passwordStrengthError}</Text>}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    secureTextEntry={!isPasswordVisible}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    editable={!isLoading}
                />
            </View>
            
            {/* Submit Button (Updated background color and hover effect) */}
            <TouchableOpacity 
                style={[
                    styles.signupButton, 
                    isLoading && styles.disabledButton, 
                    {backgroundColor: ACCENT_COLOR}, // ACCENT_COLOR for CTA button
                    BASE_ACTION_BUTTON_WEB_STYLES
                ]} 
                onPress={handleSignup} 
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#FFF" size="small" />
                ) : (
                    <Text style={styles.signupButtonText}>Continue to Profile</Text>
                )}
            </TouchableOpacity>

            {/* Log In Link (Updated color) */}
            <TouchableOpacity style={styles.switchButton} onPress={handleLoginNavigation} disabled={isLoading}>
                <Text style={styles.switchButtonText}>
                    Already have an account? <Text style={[styles.loginLink, {color: PRIMARY_COLOR}]}>Log In</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignupStepperScreen;