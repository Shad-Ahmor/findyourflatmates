// src/screens/sso.web.jsx

import React ,{useEffect} from 'react';

import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '@env'; 

// 💡 CONFIGURATION: Replace these with your actual values
// ये मान Google Cloud Console से प्राप्त किए जाते हैं।
const GOOGLE_CLIENT_ID = '552140941028-lkca62ailmg589thr8u8kniis6fmiglt.apps.googleusercontent.com';
const GOOGLE_REDIRECT_URI=`${API_BASE_URL}/flatmate/google/callback`
const BACKEND_ORIGIN = `${API_BASE_URL}`; // सिक्योरिटी चेक के लिए बैकएंड URL

const SSOButtons = ({ isLoading, styles, colors, SUBTLE_SHADOW, navigation }) => {
    
    // Auth Context का उपयोग login फ़ंक्शन तक पहुँचने के लिए करें
    const { login } = useAuth();
    
    // ----------------------------------------------------
    // 1. SSO Response Listener (लॉगिन पूरा करने वाला लॉजिक)
    // ----------------------------------------------------
    useEffect(() => {
        
        const handleSSOMessage = (event) => {
            
            // ⚠️ सुरक्षा जांच: सुनिश्चित करें कि संदेश आपके बैकएंड URL से आया है
            if (event.origin !== BACKEND_ORIGIN) { 
                console.warn(`Message received from unknown origin: ${event.origin}`);
                return; 
            }
            
            const messageData = event.data;

            if (messageData && messageData.ssoSuccess && messageData.user) {
                console.log("Google SSO Successful. Received user data.");
                
                // 1. AuthContext में उपयोगकर्ता को प्रमाणित करें। 
                // (सेशन कुकी बैकएंड द्वारा सेट की गई है, हमें केवल फ्रंटएंड स्टेट अपडेट करना है)
                login(messageData.user); 

                // 2. होम स्क्रीन पर नेविगेट करें।
                navigation.replace("Home"); 
                
            } else if (messageData && messageData.error) {
                // SSO विफलता को हैंडल करें
                Alert.alert("Google SSO Failed", messageData.error);
            }
        };

        if (Platform.OS === 'web') {
             // 'message' इवेंट लिसनर जोड़ें
             window.addEventListener('message', handleSSOMessage);
        }

        return () => {
             if (Platform.OS === 'web') {
                 // क्लीनअप: कंपोनेंट अनमाउंट होने पर लिसनर हटाएँ
                 window.removeEventListener('message', handleSSOMessage);
             }
        };
    }, [login, navigation]); // login और navigation dependencies में होने चाहिए

    // ----------------------------------------------------
    // 2. SSO Initiator (पॉपअप खोलने वाला लॉजिक)
    // ----------------------------------------------------
    const handleGoogleLogin = () => {
        if (isLoading) return;

        // Google OAuth URL का निर्माण करें
        const scope = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' ');

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${GOOGLE_CLIENT_ID}&` +
            // 🎯 UPDATED REDIRECT URI का उपयोग करें
            `redirect_uri=${GOOGLE_REDIRECT_URI}&` + 
            `response_type=code&` +
            `scope=${scope}&` +
            `access_type=offline&` + 
            `prompt=consent`;       

        // एक नई विंडो (पॉपअप) में URL खोलें
        if (Platform.OS === 'web') {
            const width = 500;
            const height = 600;
            const left = (window.screen.width / 2) - (width / 2);
            const top = (window.screen.height / 2) - (height / 2);
            
            window.open(
                authUrl,
                'GoogleSSOLogin',
                `width=${width},height=${height},top=${top},left=${left}`
            );
        } else {
            Alert.alert("Error", "Google SSO only supported on web for this implementation.");
        }
    };


    return (
        <View style={styles.mobileAuthButtons}>
            <Text style={[styles.orSeparator, { color: colors.textSecondary }]}>
                — OR CONTINUE WITH —
            </Text>
            
            {/* Google Login Button */}
            <TouchableOpacity 
                style={[
                    styles.socialButton, 
                    { backgroundColor: colors.backgroundLight, borderColor: colors.border },
                    SUBTLE_SHADOW,
                ]}
                onPress={handleGoogleLogin} 
                disabled={isLoading}
            >
                <Icon name="logo-google" size={20} color={colors.error} />
                <Text style={[styles.socialButtonText, { color: colors.text }]}>Google</Text>
            </TouchableOpacity>

            {/* Apple Login Button */}
            <TouchableOpacity 
                style={[
                    styles.socialButton, 
                    { backgroundColor: colors.backgroundLight, borderColor: colors.border },
                    SUBTLE_SHADOW,
                ]}
                onPress={() => Alert.alert("Coming Soon", "Apple Login")}
                disabled={isLoading}
            >
                <Icon name="logo-apple" size={20} color={colors.text} />
                <Text style={[styles.socialButtonText, { color: colors.text }]}>Apple</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SSOButtons;