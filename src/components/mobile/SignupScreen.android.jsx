import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, 
  Platform, Alert, Dimensions, ScrollView, ActivityIndicator, 
  Modal, TextInput 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { Shadow } from 'react-native-shadow-2'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

// --- Import Split Components ---
import SignupStepperScreen from './SignupStepperScreen.android.jsx'; 
import BasicDetailStepperForm from './BasicDetailStepperForm.android.jsx'; 

// SIMULATED CONFIG
const API_BASE_URL = 'http://localhost:5000'; 
const SIGNUP_URL = `${API_BASE_URL}/flatmate/signup`;
const COMPLETE_PROFILE_URL = `${API_BASE_URL}/flatmate/complete-profile`; 

const { width } = Dimensions.get('window'); 
const BREAKPOINT = 768; 

// CONSTANTS (Keep them here for single source of truth)
const PRIMARY_INTENTS = ['Tenant', 'Owner', 'Buyer', 'Seller'];
const SECONDARY_INTENTS_MAP = {
    Tenant: ['Find Flatmate', 'Find Roommate', 'Find Room', 'Find Flat', 'Find House', 'Find PG'],
    Owner: ['List PG', 'List Flat', 'List Hostel', 'List House'], 
    Buyer: ['Buy Flat', 'Buy House', 'Buy Plot'],
    Seller: ['Sell Flat', 'Sell House', 'Sell Room', 'Sell PG'],
};
const DEFAULT_PLAN_NAME = 'basic'; 
const PRIMARY_COLOR = '#007AFF'; // Blue
const ACCENT_COLOR = '#FF9500'; // Orange
const SUCCESS_COLOR = '#00C853'; // Green
const ERROR_COLOR = '#FF3B30'; // Red

// --- Helper Functions ---
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

// --- GeneratedPasswordModal Component (Keep small components here) ---
const GeneratedPasswordModal = ({ isVisible, onClose, password, styles }) => {
    const handleCopy = () => {
        // Using execCommand for better compatibility in iFrame environments
        const tempInput = document.createElement('textarea');
        tempInput.value = password;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        // Replace Alert.alert with console log/message box logic if this were a full application.
        console.log("Password copied to clipboard.");
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalCenteredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>🔐 Password Generated!</Text>
                    <Text style={styles.modalSubtitle}>
                        This is a strong, unique password. Please copy and save it securely before proceeding.
                    </Text>

                    <View style={styles.modalInputGroup}>
                        <TextInput
                            style={styles.modalPasswordInput}
                            value={password}
                            editable={false}
                            secureTextEntry={false}
                        />
                        <TouchableOpacity onPress={handleCopy} style={styles.modalCopyButton}>
                             <Icon name="copy-outline" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity
                        style={[styles.modalButton, { backgroundColor: ACCENT_COLOR, marginTop: 15 }]}
                        onPress={handleCopy}
                    >
                        <Text style={styles.modalButtonText}>Copy and Proceed</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.modalButton, styles.modalCloseButton]}
                        onPress={onClose}
                    >
                        <Text style={[styles.modalButtonText, { color: '#555' }]}>Close</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};

// --- Step Indicator Component (Keep small components here) ---
const StepIndicator = ({ step, setStep, isWebOrTablet, styles, isLoading, isLocating }) => {
    const steps = [
        { id: 1, title: 'Account Setup', icon: 'person-add-outline' },
        { id: 2, title: 'Profile Details', icon: 'location-outline' },
    ];

    const progressWidth = step === 1 ? '0%' : '100%';

    return (
        <View style={styles.stepperContainer}>
            <View style={styles.stepperBarBackground}>
                {/* Animated Progress Bar */}
                <View style={[
                    styles.stepperProgress,
                    { width: progressWidth, transitionDuration: '0.4s' } 
                ]} />
            </View>
            <View style={styles.stepItemsContainer}>
                {steps.map((item) => {
                    const isActive = item.id === step;
                    const isCompleted = item.id < step;
                    const isClickable = item.id < step && !isLoading && !isLocating; 

                    return (
                        <TouchableOpacity 
                            key={item.id}
                            style={styles.stepItem}
                            onPress={() => isClickable && setStep(item.id)}
                            disabled={!isClickable}
                        >
                            <Shadow distance={5} startColor={'rgba(0, 0, 0, 0.1)'} offset={[-1, 2]}>
                                <View style={[
                                    styles.stepIconCircle,
                                    isActive && styles.stepIconActive,
                                    isCompleted && styles.stepIconComplete,
                                    !isClickable && !isActive && !isCompleted && styles.stepIconInactive,
                                    isClickable && styles.stepIconClickable,
                                ]}>
                                    <Icon 
                                        name={isCompleted ? 'checkmark-outline' : item.icon} 
                                        size={isWebOrTablet ? 20 : 16} 
                                        color={isActive || isCompleted ? '#FFF' : PRIMARY_COLOR} 
                                    />
                                </View>
                            </Shadow>
                            <Text style={[
                                styles.stepTitle,
                                isActive && styles.stepTitleActive,
                                isCompleted && styles.stepTitleComplete
                            ]}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

// =======================================================================
// 🎯 MAIN SCREEN COMPONENT: SignupScreen (Wrapper)
// =======================================================================
const SignupScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets(); 
    
    // --- STATE ---
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [city, setCity] = useState(''); 
    const [countryCode, setCountryCode] = useState('+91'); 
    const [phoneNumber, setPhoneNumber] = useState('');
    const [primaryIntent, setPrimaryIntent] = useState(PRIMARY_INTENTS[0]);
    const [secondaryIntent, setSecondaryIntent] = useState(SECONDARY_INTENTS_MAP[PRIMARY_INTENTS[0]][0]); 
    
    const [isLoading, setIsLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [ipAddress, setIpAddress] = useState(null); 
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [passwordStrengthError, setPasswordStrengthError] = useState(null);
    const [isGenerateModalVisible, setIsGenerateModalVisible] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [copySuccessMessage, setCopySuccessMessage] = useState(null); 
    
    const isWebOrTablet = width > BREAKPOINT; 

    // --- Utility Functions ---
    const togglePasswordVisibility = () => { setIsPasswordVisible(prev => !prev); };
    
    const reverseGeocode = async (lat, lon) => {
        // SIMULATED REVERSE GEOCODE LOGIC
        return new Promise(resolve => {
            setTimeout(() => {
                if (lat > 19 && lon < 73) {
                    resolve("Mumbai");
                } else {
                    resolve("New Delhi");
                }
            }, 500); 
        });
    };

    const getLocationAndIP = async () => {
        setIsLocating(true);
        try {
            // SIMULATED data fetch
            const fetchIp = new Promise((resolve) => { setTimeout(() => resolve("103.210.123.45"), 500); });
            const fetchCoords = new Promise((resolve) => { setTimeout(() => resolve({ lat: 19.0760, lon: 72.8777 }), 1500); });

            const [ip, coords] = await Promise.all([fetchIp, fetchCoords]);
            
            setIpAddress(ip);
            setLatitude(coords.lat);
            setLongitude(coords.lon);

            const fetchedCity = await reverseGeocode(coords.lat, coords.lon);
            setCity(fetchedCity); 
        } catch (error) {
            console.error('Location/IP/Geocoding error:', error);
        } finally {
            setIsLocating(false);
        }
    };

    useEffect(() => {
        getLocationAndIP();
    }, []); 

    useEffect(() => {
        if (password.length > 0) {
            const error = validatePasswordStrength(password);
            setPasswordStrengthError(error);
        } else {
            setPasswordStrengthError(null);
        }
    }, [password]);

    // 🟢 STEP 1: handleSignup (Basic Registration)
    const handleSignup = async () => {
        // 1. Validation 
        const requiredFields = { Email: email, Username: username, Password: password, 'Confirm Password': confirmPassword, };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                // Using console.error instead of Alert.alert as per instructions (using custom Modal/Toast is preferred)
                console.error(`Missing Field: ${key}`);
                setCopySuccessMessage(`Missing Field: ${key} cannot be empty.`);
                setTimeout(() => setCopySuccessMessage(null), 3000);
                return;
            }
        }
        if (password !== confirmPassword) {
            console.error("Password mismatch");
            setCopySuccessMessage("Password and Confirm Password must match.");
            setTimeout(() => setCopySuccessMessage(null), 3000);
            return;
        }
        const strengthError = validatePasswordStrength(password);
        if (strengthError) {
            console.error("Password strength error");
            setCopySuccessMessage(`Password Error: ${strengthError}`);
            setTimeout(() => setCopySuccessMessage(null), 3000);
            return;
        }

        setIsLoading(true);

        try {
            // SIMULATED API CALL
            const response = await new Promise((resolve) => setTimeout(() => {
                // Simulate success
                if (email.includes('fail')) {
                    resolve({ ok: false, status: 400, json: () => Promise.resolve({ message: "Email already exists." }) });
                } else {
                    resolve({ ok: true, status: 200, json: () => Promise.resolve({ message: "Success" }) });
                }
            }, 1000));
            // const response = await fetch(SIGNUP_URL, { 
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     credentials: 'include',
            //     body: JSON.stringify({ email, username, password }),
            // });

            const data = await response.json();

            if (response.ok) {
                console.log("Signup Success");
                setCopySuccessMessage("Account created. Now complete your profile details.");
                setTimeout(() => setCopySuccessMessage(null), 3000);
                setStep(2); // ✅ Move to Step 2
            } else {
                const errorMessage = data.message || "Signup failed. Please try again.";
                console.error("Signup Failed:", errorMessage);
                setCopySuccessMessage(`Signup Failed: ${errorMessage}`);
                setTimeout(() => setCopySuccessMessage(null), 3000);
            }
        } catch (error) {
            console.error("Network or Fetch Error (Step 1):", error);
            setCopySuccessMessage("Could not connect to the server for signup.");
            setTimeout(() => setCopySuccessMessage(null), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    // 🟢 STEP 2: handleCompleteProfile (Profile Details)
    const handleCompleteProfile = async () => {
        // 1. Validation for Step 2 fields
        const requiredFields = { City: city, 'Phone Number': phoneNumber, 'Country Code': countryCode, };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                console.error(`Missing Field: ${key}`);
                setCopySuccessMessage(`Missing Field: ${key} cannot be empty.`);
                setTimeout(() => setCopySuccessMessage(null), 3000);
                return;
            }
        }
        if (!primaryIntent || !secondaryIntent) {
            console.error("Missing Intent");
            setCopySuccessMessage("Please select your intent.");
            setTimeout(() => setCopySuccessMessage(null), 3000);
            return;
        }

        setIsLoading(true);

        try {
             // SIMULATED API CALL
            const response = await new Promise((resolve) => setTimeout(() => {
                // Simulate success
                resolve({ ok: true, status: 200, json: () => Promise.resolve({ message: "Profile completed" }) });
            }, 1000));
            // const response = await fetch(COMPLETE_PROFILE_URL, { 
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     credentials: 'include', 
            //     body: JSON.stringify({
            //         city, countryCode, phoneNumber, primaryIntent, secondaryIntent,
            //         planname: DEFAULT_PLAN_NAME, latitude, longitude, ipAddress,
            //     }),
            // });

            const data = await response.json();

            if (response.ok) {
                console.log("Profile Completion Success");
                setCopySuccessMessage("Profile completed successfully. Welcome!");
                setTimeout(() => setCopySuccessMessage(null), 3000);
                // navigation.navigate('Dashboard'); 
            } else if (response.status === 401) {
                console.error("Session Error");
                setCopySuccessMessage("Session expired. Please log in.");
                setTimeout(() => setCopySuccessMessage(null), 3000);
            } else {
                const errorMessage = data.message || "Profile completion failed. Please try again.";
                console.error("Profile Completion Failed:", errorMessage);
                setCopySuccessMessage(`Profile Completion Failed: ${errorMessage}`);
                setTimeout(() => setCopySuccessMessage(null), 3000);
            }
        } catch (error) {
            console.error("Network or Fetch Error (Step 2):", error);
            setCopySuccessMessage("Could not connect to the server for profile completion.");
            setTimeout(() => setCopySuccessMessage(null), 3000);
        } finally {
            setIsLoading(false);
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
    
    // 🟢 Log In पर नेविगेट करने का फ़ंक्शन (LOGGING ADDED)
    const handleLoginNavigation = () => {
        if (navigation) {
            console.log("Navigating to Login screen..."); // 💡 Debug Log
            // Stack.Screen name="Login" है (जैसा कि App.js में दिखाया गया है)
            navigation.navigate("Login"); 
        } else {
            console.warn("Navigation prop not passed to SignupScreen. Cannot navigate.");
        }
    };


    // --- Props object for child components ---
    const sharedProps = {
        username, setUsername, email, setEmail, password, setPassword, 
        confirmPassword, setConfirmPassword, city, setCity, countryCode, 
        setCountryCode, phoneNumber, setPhoneNumber, primaryIntent, 
        setPrimaryIntent, secondaryIntent, setSecondaryIntent, 
        isWebOrTablet, isLoading, isLocating, styles, setStep, 
        isPasswordVisible, togglePasswordVisibility, passwordStrengthError, 
        handleGeneratePassword,
        
        // Pass handlers to steps
        handleSignup, handleCompleteProfile,
        
        // Constants
        SECONDARY_INTENTS_MAP, PRIMARY_INTENTS,

        // 💡 Navigation prop यहाँ जोड़ा गया है
        navigation, 
    };
    
    return (
        <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={isWebOrTablet ? styles.scrollContent : styles.mobileScrollContent}> 
                    
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => {
                            if (step === 2 && !isLoading && !isLocating) {
                                setStep(1);
                            } else {
                                /* navigation.goBack() */
                            }
                        }} 
                        disabled={isLoading || isLocating}
                    >
                        <Icon name="arrow-back" size={24} color="#555" />
                    </TouchableOpacity>

                    {isWebOrTablet ? (
                        <Shadow distance={20} startColor={'rgba(0, 0, 0, 0.1)'} endColor={'rgba(0, 0, 0, 0)'} containerStyle={{ borderRadius: 20, width: '90%', maxWidth: 1000, alignSelf: 'center' }}>
                            <View style={[styles.mainContainer, { flexDirection: 'row' }]}>
                                {/* Hero Section (45%) */}
                                <View style={[styles.heroSection, { width: '45%', backgroundColor: '#1A53A0', padding: 40, justifyContent: 'center' }]}>
                                    <Icon name="home-outline" size={80} color={ACCENT_COLOR} style={{ marginBottom: 15 }} />
                                    <Text style={[styles.logoText, { color: '#FFF', fontSize: 40 }]}>FlatMate Finder</Text>
                                    <Text style={[styles.tagline, { color: '#E0E0FF', fontSize: 18, marginTop: 15 }]}>
                                        {step === 1 ? "Start your journey. Quick, Secure, and Easy Sign-up." : "We're almost there! Help us tailor your perfect property experience."}
                                    </Text>
                                </View>
                                
                                {/* Auth/Form Section (55%) */}
                                <View style={[styles.authContainerBase, { width: '55%', padding: 40, paddingTop: 30 }]}>
                                    <StepIndicator 
                                        step={step} 
                                        setStep={setStep} 
                                        isWebOrTablet={isWebOrTablet} 
                                        styles={styles}
                                        isLoading={isLoading}
                                        isLocating={isLocating}
                                    />
                                    
                                    <Text style={[styles.authHeader, { textAlign: 'left', marginTop: 30 }]}>
                                        {step === 1 ? "Create Your Account" : "Tell Us Your Goals"}
                                    </Text>

                                    {step === 1 ? (
                                        <SignupStepperScreen {...sharedProps} />
                                    ) : (
                                        <BasicDetailStepperForm {...sharedProps} />
                                    )}
                                    
                                    {/* 💡 Log In Link (Web/Tablet View) - DISABLED REMOVED FOR TESTING */}
                                    <TouchableOpacity 
                                        style={styles.switchButton} 
                                        onPress={handleLoginNavigation} 
                                        // disabled={isLoading} ⬅️ TEMPORARILY REMOVED FOR DEBUGGING
                                    >
                                        <Text style={styles.switchButtonText}>
                                            Already have an account? <Text style={styles.loginLink}>Log In</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Shadow>
                    ) : (
                        <View style={styles.mobileFullScreenContainer}> 
                            <View style={styles.mobileHeroSection}>
                                <Icon name="home-outline" size={50} color={PRIMARY_COLOR} />
                                <Text style={styles.logoText}>FlatMate Finder</Text>
                            </View>
                            
                            {/* Mobile Stepper Component */}
                            <StepIndicator 
                                step={step} 
                                setStep={setStep} 
                                isWebOrTablet={isWebOrTablet} 
                                styles={styles}
                                isLoading={isLoading}
                                isLocating={isLocating}
                            />

                            <View style={styles.mobileFormContainer}>
                                <Text style={[styles.authHeader, { fontSize: 28, marginTop: 20 }]}>
                                    {step === 1 ? "Create Account" : "Profile Details"}
                                </Text>
                                {step === 1 ? (
                                    <SignupStepperScreen {...sharedProps} />
                                ) : (
                                    <BasicDetailStepperForm {...sharedProps} />
                                )}
                            </View>
                            
                            {/* 💡 Log In Link (Mobile View) - DISABLED REMOVED FOR TESTING */}
                            <TouchableOpacity 
                                style={styles.switchButton} 
                                onPress={handleLoginNavigation} 
                                // disabled={isLoading} ⬅️ TEMPORARILY REMOVED FOR DEBUGGING
                            >
                                <Text style={styles.switchButtonText}>
                                    Already have an account? <Text style={styles.loginLink}>Log In</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
            
            {copySuccessMessage && ( <View style={styles.toastContainer}> <Text style={styles.toastText}>{copySuccessMessage}</Text> </View> )}

            <GeneratedPasswordModal 
                isVisible={isGenerateModalVisible}
                onClose={() => setIsGenerateModalVisible(false)}
                password={generatedPassword}
                styles={styles}
            />
        </View>
    );
};

// --- STYLESHEET (No changes to styles) ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F0F4F8' }, // Light gray/blue background
    keyboardView: { flex: 1 },
    scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    mobileScrollContent: { flexGrow: 1, paddingVertical: 20 },
    backButton: { position: 'absolute', top: 20, left: 20, zIndex: 10, padding: 5, backgroundColor: '#FFF', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, elevation: 3 },
    mainContainer: { backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden' }, // More rounded
    heroSection: { 
        borderTopLeftRadius: 20, 
        borderBottomLeftRadius: 20,
        // Added subtle gradient simulation with a richer background color
        backgroundColor: '#1A53A0', // Darker Blue for depth
    },
    logoText: { fontSize: 32, fontWeight: '900', color: PRIMARY_COLOR, marginBottom: 5 },
    tagline: { fontSize: 16, color: '#666' },
    mobileFullScreenContainer: { flex: 1, paddingHorizontal: 20 },
    mobileHeroSection: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
    mobileFormContainer: { paddingHorizontal: 0 },
    authContainerBase: {},
    authHeader: { fontSize: 32, fontWeight: '800', marginBottom: 20, color: '#333', textAlign: 'center' },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 8 }, // Bolder labels
    
    // STEPPER STYLES
    stepperContainer: { marginBottom: 30, paddingHorizontal: 10 },
    stepperBarBackground: {
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        position: 'absolute',
        top: 25, 
        left: '15%', // Adjusted for 45/55 split visibility
        right: '15%',
        zIndex: 1,
    },
    stepperProgress: {
        height: '100%',
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 2,
    },
    stepItemsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 2,
    },
    stepItem: {
        alignItems: 'center',
        flex: 1,
    },
    stepIconCircle: {
        width: 40, // Slightly larger
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 3,
        borderColor: '#E0E0E0',
    },
    stepIconActive: {
        backgroundColor: PRIMARY_COLOR,
        borderColor: ACCENT_COLOR, // Highlight active border
    },
    stepIconComplete: {
        backgroundColor: SUCCESS_COLOR,
        borderColor: SUCCESS_COLOR,
    },
    stepIconInactive: {
        backgroundColor: '#FFF',
        borderColor: '#C0C0C0',
    },
    stepIconClickable: {
        cursor: 'pointer',
        opacity: 0.9,
    },
    stepTitle: {
        fontSize: 14,
        color: '#A0A0A0',
        textAlign: 'center',
        fontWeight: '600',
    },
    stepTitleActive: {
        color: PRIMARY_COLOR,
    },
    stepTitleComplete: {
        color: SUCCESS_COLOR,
    },
    // END STEPPER STYLES

    // PASSWORD UX
    passwordContainer: { flexDirection: 'row', alignItems: 'center', position: 'relative', height: 50 },
    passwordInput: { flex: 1, paddingRight: 80, paddingLeft: 0, height: '100%' }, // Removed left padding as input already has it
    passwordToggle: { position: 'absolute', right: 50, padding: 10 },
    generateButton: { position: 'absolute', right: 0, padding: 10, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: ERROR_COLOR, fontSize: 12, marginTop: 5, fontWeight: '500' },
    
    // MODAL STYLES
    modalCenteredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
    modalView: { margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, width: Platform.OS === 'web' ? '40%' : '85%', maxWidth: 450 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#1A53A0' },
    modalSubtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 25 },
    modalInputGroup: { flexDirection: 'row', width: '100%', alignItems: 'center', marginBottom: 10 },
    modalPasswordInput: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 12, height: 50, paddingHorizontal: 15, fontSize: 16, borderWidth: 1, borderColor: '#ddd', color: '#000', fontWeight: 'bold' },
    modalCopyButton: { marginLeft: 10, backgroundColor: PRIMARY_COLOR, borderRadius: 12, padding: 15 },
    modalButton: { borderRadius: 12, padding: 15, elevation: 2, width: '100%', marginTop: 10, alignItems: 'center' },
    modalButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    modalCloseButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#DDD', marginTop: 10 },

    // TOAST STYLES
    toastContainer: { position: 'absolute', bottom: 50, left: 20, right: 20, backgroundColor: 'rgba(0, 122, 255, 0.95)', borderRadius: 10, padding: 15, zIndex: 9999, alignItems: 'center', elevation: 5 },
    toastText: { color: '#FFF', fontWeight: '600', fontSize: 15 },
    
    // COMMON INPUT STYLES
    input: { backgroundColor: '#FFF', borderRadius: 12, height: 50, paddingHorizontal: 15, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0', transitionDuration: '0.2s', },
    inputFocus: { borderColor: PRIMARY_COLOR, borderWidth: 2 },
    locationIndicator: { position: 'absolute', right: 15, top: 15 },

    // PHONE INPUT
    phoneInputContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    countryCodeInput: { width: '30%', textAlign: 'center', marginRight: 10 },
    phoneNumberInput: { flex: 1 },
    
    // INTENT SELECTOR STYLES
    intentSelectorContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginTop: 5 },
    intentButton: { 
        paddingVertical: 10, 
        paddingHorizontal: 18, 
        borderRadius: 25, 
        backgroundColor: '#f0f0f0', 
        marginRight: 10, 
        marginBottom: 10, 
        borderWidth: 1, 
        borderColor: '#ddd' 
    },
    intentButtonActive: { 
        backgroundColor: PRIMARY_COLOR, 
        borderColor: PRIMARY_COLOR,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 5,
    },
    intentButtonText: { color: '#555', fontSize: 14, fontWeight: '600' },
    intentButtonTextActive: { color: '#FFF' },
    disabledButton: { opacity: 0.6 },
    
    // BUTTON STYLES
    signupButton: { 
        backgroundColor: ACCENT_COLOR, 
        padding: 18, 
        borderRadius: 12, 
        alignItems: 'center', 
        marginTop: 25, // Increased margin for separation
        marginBottom: 20,
        shadowColor: ACCENT_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 8,
    },
    signupButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    switchButton: { alignItems: 'center', marginBottom: 10, marginTop: 10 },
    switchButtonText: { fontSize: 15, color: '#666' },
    loginLink: { color: PRIMARY_COLOR, fontWeight: 'bold' },
});

export default SignupScreen;