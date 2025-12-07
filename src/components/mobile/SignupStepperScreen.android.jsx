import React from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

// CONSTANTS (Required for style and button color)
const PRIMARY_COLOR = '#007AFF'; // Blue
const ACCENT_COLOR = '#FF9500'; // Orange
const ERROR_COLOR = '#FF3B30'; // Red

// --- STUB COMPONENT 1: SignupStepperScreen (Step 1 Form) ---
const SignupStepperScreen = ({ 
    username, setUsername, email, setEmail, password, setPassword, 
    confirmPassword, setConfirmPassword, isPasswordVisible, 
    togglePasswordVisibility, passwordStrengthError, styles, 
    handleSignup, isLoading, handleGeneratePassword 
    // navigation prop अब यहाँ ज़रूरी नहीं है
}) => {
    
    // handleLoginNavigation फ़ंक्शन यहाँ से हटा दिया गया है।

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
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={[styles.passwordContainer, styles.input]}>
                    <TextInput
                        style={styles.passwordInput}
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
                         <Icon name='key-outline' size={20} color={ACCENT_COLOR} />
                    </TouchableOpacity>
                </View>
                {passwordStrengthError && <Text style={styles.errorText}><Icon name="alert-circle-outline" size={12} color={ERROR_COLOR} /> {passwordStrengthError}</Text>}
            </View>
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
            
            <TouchableOpacity 
                style={[styles.signupButton, isLoading && styles.disabledButton]} 
                onPress={handleSignup} 
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#FFF" size="small" />
                ) : (
                    <Text style={styles.signupButtonText}>Continue to Profile</Text>
                )}
            </TouchableOpacity>
            
            {/* ❌ Log In Link यहाँ से हटा दिया गया है */}
        </View>
    );
};

export default SignupStepperScreen;