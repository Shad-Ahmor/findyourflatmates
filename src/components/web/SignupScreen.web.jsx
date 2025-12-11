// src/screens/SignupScreen.web.jsx

import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, 
  Platform, Alert, Dimensions, ScrollView, ActivityIndicator, 
  Modal, TextInput, 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
// Shadow-2 is often tricky with dynamic styles, using standard RN styles now
import { Shadow } from 'react-native-shadow-2'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { API_BASE_URL } from '@env'; 
// ✅ THEME IMPORT
import { useTheme } from '../../theme/theme'; 

const { width } = Dimensions.get('window'); 
const BREAKPOINT = 768; 

// SIMULATED CONFIG
const SIGNUP_URL = `${API_BASE_URL}/flatmate/signup`;
const SEND_OTP_URL = `${API_BASE_URL}/flatmate/send-otp`; 
const VERIFY_OTP_URL = `${API_BASE_URL}/flatmate/verify-otp`; 

const ANIMATION_DURATION = '0.3s'; // Global transition speed
const TOTAL_STEPS = 3; // New constant for total steps

// --- Helper Functions (Password Validation) ---
const generateStrongPassword = (length = 12) => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    const all = uppercase + lowercase + numbers + symbols;

    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    for (let i = password.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * all.length);
        password += all[randomIndex];
    }
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    return password;
};

const validatePasswordStrength = (p) => {
    if (p.length < 8) return "Must be at least 8 characters long.";
    if (!/[A-Z]/.test(p)) return "Must contain at least one uppercase letter.";
    if (!/[a-z]/.test(p)) return "Must contain at least one lowercase letter.";
    if (!/[0-9]/.test(p)) return "Must contain at least one number.";
    if (!/[!@#$%^&*()]/.test(p)) return "Must contain at least one special character.";
    return null; 
};


// --- Helper Components (Modal) ---
const GeneratedPasswordModal = ({ isVisible, onClose, password, styles, colors, SUBTLE_SHADOW }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        if (password) {
            // Web copy logic
            const tempInput = document.createElement('textarea');
            tempInput.value = password;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
                onClose(); 
            }, 1000);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalCenteredView}>
                <View style={[styles.modalView, { backgroundColor: colors.card }, SUBTLE_SHADOW]}>
                    <Text style={[styles.modalTitle, { color: colors.primary }]}>🔐 Password Generated!</Text>
                    <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                        This is a strong, unique password. **Please copy and save it securely** before proceeding.
                    </Text>

                    <View style={styles.modalInputGroup}>
                        <TextInput
                            style={[styles.modalPasswordInput, { 
                                borderColor: colors.border, 
                                backgroundColor: colors.background, 
                                color: colors.text 
                            }]}
                            value={password}
                            editable={false}
                            secureTextEntry={false}
                        />
                        <TouchableOpacity onPress={handleCopy} style={[styles.modalCopyButton, { backgroundColor: colors.secondary }, SUBTLE_SHADOW]}>
                             <Icon name={copied ? "checkmark-circle" : "copy-outline"} size={20} color={colors.card} />
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity
                        style={[styles.modalButton, { backgroundColor: colors.primary, marginTop: 15 }, SUBTLE_SHADOW]}
                        onPress={handleCopy}
                        disabled={copied}
                    >
                        <Text style={[styles.modalButtonText, { color: colors.card }]}>{copied ? "✅ Copied!" : "Copy and Proceed"}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.modalButton, styles.modalCloseButton, { backgroundColor: colors.background }]}
                        onPress={onClose}
                        disabled={copied}
                    >
                        <Text style={[styles.modalButtonText, { color: colors.textSecondary }]}>Close</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};


// -----------------------------------------------------------------
// 🎯 MAIN SCREEN COMPONENT: SignupScreen (Refactored to Stepper)
// -----------------------------------------------------------------
const SignupScreen = ({ navigation }) => {
    // ✅ Use Theme Hook
    const { colors, GENEROUS_RADIUS, DEEP_SOFT_SHADOW, SUBTLE_SHADOW } = useTheme();
    
    const insets = useSafeAreaInsets(); 
    
    // --- STATE ---
    const [currentStep, setCurrentStep] = useState(1); // NEW: Stepper state
    
    const [username, setUsername] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false); // Global loading
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [passwordStrengthError, setPasswordStrengthError] = useState(null);
    const [isGenerateModalVisible, setIsGenerateModalVisible] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [toastMessage, setToastMessage] = useState(null); 
    
    // ✅ Email Verification States
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);

    const isWebOrTablet = width > BREAKPOINT; 

    // --- Effects ---
    useEffect(() => {
        if (password.length > 0) {
            const error = validatePasswordStrength(password);
            setPasswordStrengthError(error);
        } else {
            setPasswordStrengthError(null);
        }
    }, [password]);
    
    useEffect(() => {
        let interval;
        if (isOtpSent && otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer(prevTime => prevTime - 1);
            }, 1000);
        } else if (otpTimer === 0 && isOtpSent) {
             showToast("OTP expired. Please resend the OTP.", 'error');
             setIsOtpSent(false); // Reset OTP sending state
        }
        return () => clearInterval(interval);
    }, [isOtpSent, otpTimer]);


    const showToast = (message, type = 'info') => {
        setToastMessage({ message, type });
        setTimeout(() => setToastMessage(null), 3000);
    }

    const togglePasswordVisibility = () => { setIsPasswordVisible(prev => !prev); };

    const handleLoginNavigation = () => {
        if (navigation && navigation.navigate) {
            navigation.navigate("Login"); 
        }
    };

    const handleGeneratePassword = () => {
        const strongP = generateStrongPassword(12);
        setPassword(strongP);
        setConfirmPassword(strongP);
        setIsPasswordVisible(true);
        setGeneratedPassword(strongP);
        setIsGenerateModalVisible(true);
    };
    
    // ------------------------------------------------------------
    // Handle OTP Sending (Step 1 CTA)
    // ------------------------------------------------------------
    const handleSendOtp = async () => {
        if (!email) {
            showToast("Please enter a valid email address.", 'error');
            return;
        }
        setOtpLoading(true);
        
        try {
            const response = await fetch(SEND_OTP_URL, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok && response.status === 200) {
                showToast("OTP sent to your email. Check your inbox.", 'success');
                setIsOtpSent(true);
                setOtpTimer(60); // 60-second timer
                setCurrentStep(2); // ✅ NEXT STEP
            } else {
                showToast(data.message || "Failed to send OTP. Try again.", 'error');
            }
        } catch (error) {
            showToast("Network error while sending OTP.", 'error');
        } finally {
            setOtpLoading(false);
        }
    };
    
    // ------------------------------------------------------------
    // Handle OTP Verification (Step 2 CTA)
    // ------------------------------------------------------------
    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            showToast("Please enter a 6-digit OTP.", 'error');
            return;
        }
        setOtpLoading(true);

        try {
            const response = await fetch(VERIFY_OTP_URL, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (response.ok && response.status === 200) {
                showToast("Email verified successfully! Proceed to account setup.", 'success');
                setIsEmailVerified(true);
                setIsOtpSent(false); // Stop timer
                setOtpTimer(0);
                setCurrentStep(3); // ✅ NEXT STEP
            } else {
                showToast(data.message || "OTP verification failed. Check the code.", 'error');
            }
        } catch (error) {
            showToast("Network error while verifying OTP.", 'error');
        } finally {
            setOtpLoading(false);
        }
    };


    // ------------------------------------------------------------
    // Step 3: handleSignup (Final Submission)
    // ------------------------------------------------------------
    const handleSignup = async () => {
        const requiredFields = { Username: username, Password: password, 'Confirm Password': confirmPassword, };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                showToast(`Missing Field: ${key} cannot be empty.`, 'error');
                return;
            }
        }
        if (password !== confirmPassword) {
            showToast("Password and Confirm Password must match.", 'error');
            return;
        }
        const strengthError = validatePasswordStrength(password);
        if (strengthError) {
            showToast(`Password Error: ${strengthError}`, 'error');
            return;
        }
        // Email verification check is implicit, but good to keep a fallback check
        if (!isEmailVerified) {
            showToast("Error: Email verification status lost. Please restart the process.", 'error');
            setCurrentStep(1);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(SIGNUP_URL, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, username, password, isEmailVerified: true }),
            });

            const data = await response.json();

            if (response.ok && response.status === 201) {
                showToast("Account created successfully! Redirecting to Login...", 'success');
                
                setTimeout(() => {
                    if (navigation && navigation.navigate) {
                        navigation.navigate('Login'); 
                    }
                }, 1500); 

            } else {
                let errorMessage = data.message || "Signup failed. Please try again.";
                showToast(`Signup Failed: ${errorMessage}`, 'error');
            }
        } catch (error) {
            showToast("Could not connect to the server for signup. Check backend status.", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // ------------------------------------------------------------
    // 🎨 DYNAMIC STYLESHEET DEFINITION
    // ------------------------------------------------------------
    const styles = getStyles(colors, GENEROUS_RADIUS, DEEP_SOFT_SHADOW, SUBTLE_SHADOW);

    // ------------------------------------------------------------
    // 🧱 STEP 1: Email Entry & Send OTP
    // ------------------------------------------------------------
    const renderStep1 = () => (
        <View>
            <Text style={[styles.authHeader, { textAlign: isWebOrTablet ? 'left' : 'center', color: colors.text }]}>
                Step 1: Verify Email
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Enter your email address to receive a one-time password (OTP).
            </Text>
            
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
                
                <TextInput
                    style={[
                        styles.input,
                        { 
                            backgroundColor: colors.backgroundLight, 
                            borderColor: colors.border,
                            color: colors.text
                        }
                    ]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoading && !otpLoading && !isOtpSent} // Prevent editing after sending until step change
                />
            </View>
            
            <TouchableOpacity
                style={[
                    styles.signupButton, 
                    (isLoading || otpLoading || !email) && styles.disabledButton,
                    { backgroundColor: colors.accent, borderRadius: GENEROUS_RADIUS }, // Accent color for Step 1 CTA
                    SUBTLE_SHADOW,
                ]}
                onPress={handleSendOtp}
                disabled={isLoading || otpLoading || !email}
            >
                {otpLoading && !isOtpSent ? (
                    <ActivityIndicator color={colors.card} size="small" />
                ) : (
                    <Text style={[styles.signupButtonText, { color: colors.card }]}>
                        Send Verification Code
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchButton} onPress={handleLoginNavigation} disabled={isLoading}>
                <Text style={[styles.switchButtonText, { color: colors.textSecondary }]}>
                    Already have an account? <Text style={[styles.loginLink, { color: colors.primary }]}>Log In</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );

    // ------------------------------------------------------------
    // 🧱 STEP 2: OTP Verification
    // ------------------------------------------------------------
    const renderStep2 = () => (
        <View>
            <Text style={[styles.authHeader, { textAlign: isWebOrTablet ? 'left' : 'center', color: colors.text }]}>
                Step 2: OTP Verification
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Enter the 6-digit code sent to <Text style={{fontWeight: '700', color: colors.primary}}>{email}</Text>.
            </Text>
            
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Verification Code</Text>
                
                <TextInput
                    style={[
                        styles.input, 
                        { 
                            backgroundColor: colors.backgroundLight, 
                            borderColor: colors.border, 
                            color: colors.text 
                        }
                    ]}
                    placeholder="Enter 6-digit OTP"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                    editable={!(isLoading || otpLoading)}
                />
                
                {otpTimer > 0 && (
                    <Text style={[styles.timerText, { color: colors.textSecondary }]}>
                        Code expires in: <Text style={{ color: colors.error, fontWeight: '700' }}>{otpTimer}s</Text>
                    </Text>
                )}
            </View>
            
            {/* Verify Button */}
            <TouchableOpacity
                style={[
                    styles.signupButton, 
                    (isLoading || otpLoading || otp.length !== 6) && styles.disabledButton,
                    { backgroundColor: colors.secondary, borderRadius: GENEROUS_RADIUS }, // Secondary color for Step 2 CTA
                    SUBTLE_SHADOW
                ]}
                onPress={handleVerifyOtp}
                disabled={isLoading || otpLoading || otp.length !== 6}
            >
                 {otpLoading ? (
                     <ActivityIndicator color={colors.card} size="small" />
                 ) : (
                     <Text style={[styles.signupButtonText, { color: colors.card }]}>Verify & Continue</Text>
                 )}
            </TouchableOpacity>
            
            {/* Resend Link */}
            <TouchableOpacity style={styles.switchButton} onPress={handleSendOtp} disabled={isLoading || otpLoading || otpTimer > 0}>
                <Text style={[styles.switchButtonText, { color: colors.textSecondary }]}>
                    Didn't receive code? <Text style={[styles.loginLink, { color: colors.primary, opacity: otpTimer > 0 ? 0.5 : 1 }]}>
                        {otpTimer > 0 ? `Resend available in ${otpTimer}s` : "Resend OTP"}
                    </Text>
                </Text>
            </TouchableOpacity>

            {/* Go Back Link */}
            <TouchableOpacity style={[styles.switchButton, {marginTop: 15}]} onPress={() => setCurrentStep(1)} disabled={isLoading || otpLoading}>
                <Text style={[styles.switchButtonText, { color: colors.textSecondary }]}>
                    <Icon name="arrow-back-outline" size={14} color={colors.textSecondary} /> Change Email
                </Text>
            </TouchableOpacity>
        </View>
    );

    // ------------------------------------------------------------
    // 🧱 STEP 3: Username & Password Setup (Final Submission)
    // ------------------------------------------------------------
    const renderStep3 = () => (
        <View>
            <Text style={[styles.authHeader, { textAlign: isWebOrTablet ? 'left' : 'center', color: colors.text }]}>
                Step 3: Account Setup
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Almost done! Choose a username and a strong password.
            </Text>
            
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Username</Text>
                <TextInput
                    style={[styles.input, { 
                        backgroundColor: colors.backgroundLight, 
                        borderColor: colors.border,
                        color: colors.text
                    }]}
                    placeholder="Choose a username"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                    editable={!isLoading}
                />
            </View>
            
            {/* Password Input */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                <View style={styles.passwordInputWrapper}> 
                    <TextInput
                        style={[styles.input, styles.passwordTextInput, { 
                            backgroundColor: colors.backgroundLight, 
                            borderColor: colors.border, 
                            color: colors.text
                        }]} 
                        placeholder="Create a strong password"
                        placeholderTextColor={colors.textSecondary}
                        secureTextEntry={!isPasswordVisible}
                        value={password}
                        onChangeText={setPassword}
                        editable={!isLoading}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordToggle} disabled={isLoading}>
                        <Icon name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} /> 
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleGeneratePassword} style={styles.generateButton} disabled={isLoading}>
                         <Icon name='key-outline' size={20} color={colors.secondary} /> {/* Use secondary color for Key icon */}
                    </TouchableOpacity>
                </View>
                {passwordStrengthError && <Text style={[styles.errorText, {color: colors.error}]}><Icon name="alert-circle-outline" size={12} color={colors.error} /> {passwordStrengthError}</Text>}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
                <TextInput
                    style={[styles.input, { 
                        backgroundColor: colors.backgroundLight, 
                        borderColor: colors.border, 
                        color: colors.text
                    }]}
                    placeholder="Confirm your password"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!isPasswordVisible}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    editable={!isLoading}
                />
            </View>
            
            {/* Submit Button (Final Signup) */}
            <TouchableOpacity 
                style={[
                    styles.signupButton, 
                    isLoading && styles.disabledButton, 
                    { backgroundColor: colors.primary, borderRadius: GENEROUS_RADIUS }, // Primary CTA Color
                    SUBTLE_SHADOW // Use SUBTLE_SHADOW for buttons
                ]} 
                onPress={handleSignup} 
                disabled={isLoading || !isEmailVerified} 
            >
                {isLoading ? (
                    <ActivityIndicator color={colors.card} size="small" />
                ) : (
                    <Text style={[styles.signupButtonText, { color: colors.card }]}>Sign Up & Get Started</Text>
                )}
            </TouchableOpacity>

            {/* Log In Link */}
            <TouchableOpacity style={styles.switchButton} onPress={handleLoginNavigation} disabled={isLoading}>
                <Text style={[styles.switchButtonText, { color: colors.textSecondary }]}>
                    Already have an account? <Text style={[styles.loginLink, { color: colors.primary }]}>Log In</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
    
    // ------------------------------------------------------------
    // 🧱 Main Render Function
    // ------------------------------------------------------------
    const renderFormContent = () => {
        switch (currentStep) {
            case 1:
                return renderStep1();
            case 2:
                return renderStep2();
            case 3:
                return renderStep3();
            default:
                return renderStep1(); // Fallback
        }
    };

    const renderStepperIndicator = () => (
        <View style={styles.stepperContainer}>
            {[1, 2, 3].map(step => (
                <View key={step} style={styles.stepItem}>
                    <View style={[
                        styles.stepCircle,
                        { 
                            backgroundColor: step <= currentStep ? colors.primary : colors.border,
                            borderColor: step <= currentStep ? colors.primary : colors.border,
                        }
                    ]}>
                        <Text style={[styles.stepText, { color: step <= currentStep ? colors.card : colors.textSecondary }]}>{step}</Text>
                    </View>
                    <Text style={[styles.stepLabel, { color: step === currentStep ? colors.primary : colors.textSecondary }]}>
                        {step === 1 ? 'Email' : step === 2 ? 'Verify' : 'Password'}
                    </Text>
                    {step < TOTAL_STEPS && (
                        <View style={[styles.stepLine, { backgroundColor: step < currentStep ? colors.primary : colors.border }]} />
                    )}
                </View>
            ))}
        </View>
    );

    
    return (
        <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: colors.background }]}>
            <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={isWebOrTablet ? styles.scrollContent : styles.mobileScrollContent}> 
                    
                    {/* Main Card Container */}
                    {isWebOrTablet ? (
                        <View style={[
                            styles.mainContainer, 
                            { 
                                flexDirection: 'row', 
                                backgroundColor: colors.card,
                                borderRadius: GENEROUS_RADIUS,
                            }, 
                            DEEP_SOFT_SHADOW // Apply DEEP_SOFT_SHADOW to the card
                        ]}>
                            {/* Hero Section (50%) */}
                            <View style={[styles.heroSection, { 
                                width: '50%', 
                                backgroundColor: colors.primary, // Primary Color (Striking Red-Pink)
                                padding: 50, 
                                justifyContent: 'center',
                                borderRadius: GENEROUS_RADIUS, // Ensure rounded corners are consistent
                            }]}>
                                <Icon name="home-outline" size={90} color={colors.accent} style={{ marginBottom: 15 }} />
                                <Text style={[styles.logoText, { color: colors.card, fontSize: 40 }]}>FlatMate Finder</Text>
                                <Text style={[styles.tagline, { color: colors.backgroundLight, fontSize: 18, marginTop: 15 }]}>
                                    Quick, Secure, and Verified Sign-up. Your home search starts now.
                                </Text>
                            </View>
                            
                            {/* Auth/Form Section (50%) */}
                            <View style={[styles.authContainerBase, { 
                                width: '50%', 
                                padding: 50, 
                                paddingTop: 40,
                                paddingBottom: 60,
                            }]}>
                                {renderStepperIndicator()}
                                {renderFormContent()}
                            </View>
                        </View>
                    ) : (
                        // Mobile View (Full Screen)
                        <View style={styles.mobileFullScreenContainer}>
                            <View style={styles.mobileHeroSection}>
                                <Icon name="home-outline" size={60} color={colors.primary} style={{ marginBottom: 10 }} />
                                <Text style={[styles.logoText, { color: colors.text }]}>FlatMate Finder</Text>
                            </View>
                            
                            <View style={[styles.mobileFormContainer, SUBTLE_SHADOW, { padding: 25, borderRadius: GENEROUS_RADIUS, backgroundColor: colors.card }]}>
                                {renderStepperIndicator()}
                                {renderFormContent()}
                            </View>
                        </View>
                    )}
                    
                </ScrollView>
            </KeyboardAvoidingView>
            
            {/* Success/Error Toast Message UI */}
            {toastMessage && ( 
                <View style={[
                    styles.toastContainer, 
                    toastMessage.type === 'error' ? { backgroundColor: colors.error } : { backgroundColor: colors.success },
                    SUBTLE_SHADOW
                ]}> 
                    <Text style={[styles.toastText, { color: colors.card }]}>{toastMessage.message}</Text> 
                </View> 
            )}

            <GeneratedPasswordModal 
                isVisible={isGenerateModalVisible}
                onClose={() => setIsGenerateModalVisible(false)}
                password={generatedPassword}
                styles={styles}
                colors={colors}
                SUBTLE_SHADOW={SUBTLE_SHADOW}
            />
        </View>
    );
};

// -----------------------------------------------------------------
// 🎨 ACTION BUTTON BASE STYLES
// -----------------------------------------------------------------
const BASE_ACTION_BUTTON_WEB_STYLES = Platform.select({
     web: { transition: `all ${ANIMATION_DURATION} cubic-bezier(.25,.8,.25,1)`, cursor: 'pointer', ':hover': { transform: 'translateY(-3px) scale(1.01)' } }
});

// -----------------------------------------------------------------
// 🎨 DYNAMIC STYLESHEET DEFINITION
// -----------------------------------------------------------------
const getStyles = (colors, GENEROUS_RADIUS, DEEP_SOFT_SHADOW, SUBTLE_SHADOW) => StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: colors.background,
    },
    mobileScrollContent: {
        flexGrow: 1,
        backgroundColor: colors.background,
    },
    mainContainer: {
        width: 1000, 
        minHeight: 650,
        overflow: 'hidden',
    },
    mobileFullScreenContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    mobileHeroSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    mobileFormContainer: {
        flex: 1,
    },
    heroSection: {
        borderTopLeftRadius: GENEROUS_RADIUS,
        borderBottomLeftRadius: GENEROUS_RADIUS,
    },
    authContainerBase: {
    },
    logoText: {
        fontSize: 32,
        fontWeight: '900',
    },
    tagline: {
        fontWeight: '500',
    },
    authHeader: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 15, // Adjusted for Stepper
    },
    stepSubtitle: {
        fontSize: 15,
        marginBottom: 30,
        textAlign: 'center', // Added for better mobile UX
    },
    
    // --- Stepper Styles ---
    stepperContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        paddingHorizontal: 15,
        width: '100%',
    },
    stepItem: {
        alignItems: 'center',
        position: 'relative',
        flex: 1,
    },
    stepCircle: {
        width: 35,
        height: 35,
        borderRadius: 18,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    stepText: {
        fontSize: 16,
        fontWeight: '900',
    },
    stepLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 5,
        textAlign: 'center',
    },
    stepLine: {
        position: 'absolute',
        height: 3,
        width: '100%',
        top: 16,
        left: '50%',
        zIndex: 1,
    },
    // --- Form Elements ---
    inputGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    timerText: {
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        fontSize: 16,
        ...Platform.select({
            web: {
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                ':focus': {
                    borderColor: colors.primary,
                    boxShadow: `0 0 0 3px ${colors.secondary}50`, // Focus Glow with secondary color
                }
            }
        })
    },
    passwordInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    passwordTextInput: {
        flex: 1,
        paddingRight: 90, 
    },
    passwordToggle: {
        position: 'absolute',
        right: 50,
        padding: 8,
    },
    generateButton: {
        position: 'absolute',
        right: 5,
        padding: 8,
    },
    errorText: {
        marginTop: 5,
        fontSize: 12,
        fontWeight: '600',
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    // --- Buttons ---
    signupButton: {
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 20,
        ...BASE_ACTION_BUTTON_WEB_STYLES, 
    },
    signupButtonText: {
        fontSize: 18,
        fontWeight: '900',
    },
    disabledButton: {
        opacity: 0.5,
        ...Platform.select({ web: { cursor: 'not-allowed' } }),
        transform: [{ translateY: 0 }], // Prevent hover effect on disabled
    },
    switchButton: {
        marginTop: 25,
        alignItems: 'center',
    },
    switchButtonText: {
        fontSize: 15,
    },
    loginLink: {
        fontWeight: '700',
    },
    
    // --- Modal Styles --- (Kept as is, only styles used in the modal)
    modalCenteredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        width: width * 0.9 > 400 ? 400 : width * 0.9,
        padding: 30,
        alignItems: 'center',
        borderRadius: GENEROUS_RADIUS,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalInputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    modalPasswordInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
    },
    modalCopyButton: {
        marginLeft: 10,
        padding: 10,
        borderRadius: 12,
        ...BASE_ACTION_BUTTON_WEB_STYLES, 
    },
    modalButton: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalCloseButton: {
        marginTop: 10,
    },
    
    // --- Toast Styles ---
    toastContainer: { 
        position: 'absolute', 
        bottom: 50, 
        alignSelf: 'center', 
        paddingHorizontal: 20, 
        paddingVertical: 12, 
        borderRadius: 10, 
        zIndex: 9999,
        minWidth: 250,
        maxWidth: width * 0.9,
    }, 
    toastText: { 
        fontSize: 15, 
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default SignupScreen;