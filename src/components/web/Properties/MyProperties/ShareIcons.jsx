// src/components/ShareIcons.jsx

import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Linking, 
    Modal, 
    TextInput, 
    Alert,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// ✅ IMPORTED: Templates from separate utility file
import { getTemplates } from './ShareTemplates'; 

const { width } = Dimensions.get('window');

// ------------------------------------
// 🎨 BRAND COLORS & CONSTANTS (Only colors remain here)
// ------------------------------------
const PRIMARY_COLOR = '#4BCFFA'; // Sky Blue
const CARD_COLOR = '#FFFFFF';
const WA_COLOR = '#25D366';
const FB_COLOR = '#1877F2';
const X_COLOR = '#000000'; // Black for X (Twitter)
const THREADS_COLOR = '#000000'; // Black for Threads
const IG_COLOR = '#E4405F';
const TG_COLOR = '#0088CC';
const ACCENT_COLOR = '#FF9500'; // Warm Orange
const GENEROUS_RADIUS = 15;
// ------------------------------------


// =========================================================
// 🎯 MAIN COMPONENT: ShareIcons
// =========================================================
const ShareIcons = ({ listingId, location }) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(null); // 'english' or 'hindi'
    const [editedTemplate, setEditedTemplate] = useState('');
    const [activePlatform, setActivePlatform] = useState(null);
    
    const listingURL = `https://findyourflatmates.onrender.com/PropertyDetail?propertyId=${listingId}`;
    // ✅ Use imported templates function
    const allTemplates = getTemplates(location, listingURL); 

    // Social Media Platforms Configuration (Type maps to the key in ShareTemplates.js)
    const socialShares = [
        { name: 'WhatsApp', icon: 'logo-whatsapp', color: WA_COLOR, type: 'whatsapp' },
        { name: 'Facebook', icon: 'logo-facebook', color: FB_COLOR, type: 'generic' },
        { name: 'Twitter/X', icon: 'logo-twitter', color: X_COLOR, type: 'twitter' },
        { name: 'Telegram', icon: 'send-sharp', color: TG_COLOR, type: 'whatsapp' },
        { name: 'Threads', icon: 'at', color: THREADS_COLOR, type: 'threads' }, // 'at' symbol icon for threads
        { name: 'Instagram', icon: 'logo-instagram', color: IG_COLOR, isNonStandard: true },
    ];


    // Step 1: Open modal and set active platform
    const handleShareClick = (platform) => {
        if (platform.isNonStandard) {
             Alert.alert(
                "Instagram Share Note",
                "Instagram web does not allow direct link sharing with pre-filled content. Please use the mobile app or manually copy the URL.",
                [{ text: "OK" }]
            );
            Linking.openURL('https://www.instagram.com/');
            return;
        }
        
        // Reset state before opening
        setActivePlatform(platform);
        setSelectedLanguage(null); 
        setEditedTemplate(''); 
        setIsModalVisible(true);
    };

    // Step 2: Language selected, set template
    useEffect(() => {
        if (selectedLanguage && activePlatform) {
            const templateKey = activePlatform.type;
            // Fallback to 'generic' if type is not specifically defined for safety
            const template = allTemplates[selectedLanguage][templateKey] || allTemplates[selectedLanguage]['generic'];
            setEditedTemplate(template);
        }
    }, [selectedLanguage, activePlatform]);


    // Step 3: Final share action (after editing)
    const finalShareAction = () => {
        if (!activePlatform || !editedTemplate) return;

        const text = editedTemplate;
        let shareUrl = '';

        try {
            switch (activePlatform.name) {
                case 'WhatsApp':
                    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
                    break;
                case 'Telegram':
                    // Telegram requires both URL and text
                    shareUrl = `https://t.me/share/url?url=${encodeURIComponent(listingURL)}&text=${encodeURIComponent(text)}`;
                    break;
                case 'Facebook':
                    // Facebook uses 'quote' and 'u' (URL)
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(listingURL)}&quote=${encodeURIComponent(text)}`;
                    break;
                case 'Twitter/X':
                case 'Threads': // Threads uses Twitter intent syntax for web sharing
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                    break;
                default:
                    Alert.alert("Error", "Unsupported sharing platform.");
                    return;
            }
            
            Linking.openURL(shareUrl);
            setIsModalVisible(false); // Close modal on successful share
        } catch (error) {
            console.error("Sharing failed:", error);
            Alert.alert("Error", "Could not open sharing link.");
        }
    };


    // ----------------------------------------------------
    // 🖼️ MODAL RENDERING
    // ----------------------------------------------------
    const ShareModal = () => {
        // If language is not selected, show language buttons
        if (!selectedLanguage) {
            return (
                <View style={styles.modalContent}>
                    <Text style={styles.modalHeader}>भाषा चुनें / Select Language</Text>
                    <Text style={styles.modalSubHeader}>Select the language for your share template on {activePlatform?.name}</Text>
                    
                    <View style={styles.languageSelection}>
                        <TouchableOpacity style={styles.langButton} onPress={() => setSelectedLanguage('hindi')}>
                            <Text style={styles.langButtonText}>हिन्दी (Hindi)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.langButton} onPress={() => setSelectedLanguage('english')}>
                            <Text style={styles.langButtonText}>English</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        // If language is selected, show template editor
        return (
            <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>Edit Post Template ({selectedLanguage.toUpperCase()})</Text>
                <Text style={styles.modalSubHeader}>You can edit the message before sharing on {activePlatform?.name}.</Text>
                
                <TextInput
                    style={styles.templateInput}
                    multiline
                    numberOfLines={10}
                    value={editedTemplate}
                    onChangeText={setEditedTemplate}
                />

                <TouchableOpacity 
                    style={[styles.shareFinalButton, { backgroundColor: activePlatform?.color || PRIMARY_COLOR }]}
                    onPress={finalShareAction}
                >
                    <Icon name={activePlatform?.icon || 'share-social'} size={20} color={CARD_COLOR} />
                    <Text style={styles.shareFinalButtonText}>Share on {activePlatform?.name}</Text>
                </TouchableOpacity>
                
                {/* Back button to language selection */}
                <TouchableOpacity 
                    style={styles.modalBackButton} 
                    onPress={() => setSelectedLanguage(null)}
                >
                    <Icon name="arrow-back" size={16} color="#777" />
                    <Text style={styles.modalBackButtonText}>Change Language</Text>
                </TouchableOpacity>
            </View>
        );
    };
    // ----------------------------------------------------


    return (
        <View style={styles.shareContainer}>
            <View style={styles.shareIconsWrapper}>
                {socialShares.map((platform) => (
                    <TouchableOpacity
                        key={platform.name}
                        style={styles.socialIconTouchable}
                        onPress={(e) => { 
                            if (e && e.stopPropagation) e.stopPropagation(); 
                            handleShareClick(platform);
                        }}
                        activeOpacity={0.7}
                    >
                        <Icon name={platform.icon} size={22} color={platform.color} />
                    </TouchableOpacity>
                ))}
            </View>
            
            {/* Modal for Language Selection and Editing */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        
                        {ShareModal()}

                        {/* Close Button */}
                        <TouchableOpacity 
                            style={styles.modalCloseButton} 
                            onPress={() => setIsModalVisible(false)}
                        >
                             <Icon name="close-circle" size={30} color="#999" />
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

// =========================================================
// 🎨 STYLES (Keep styles here as they are visual properties)
// =========================================================
const styles = StyleSheet.create({
    shareContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    shareTitleText: {
        marginRight: 15, 
        fontSize: 16, 
        fontWeight: '800', 
        color: PRIMARY_COLOR
    },
    shareIconsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    socialIconTouchable: {
        padding: 2,
        borderRadius: 5,
        transition: 'transform 0.2s',
        ':hover': {
            transform: [{ scale: 1.1 }],
        },
    },
    
    // --- MODAL STYLES ---
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dim background
    },
    modalBox: {
        width: width > 600 ? 500 : '90%', // Responsive width
        backgroundColor: CARD_COLOR,
        borderRadius: GENEROUS_RADIUS,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
    },
    modalCloseButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
    },
    modalContent: {
        width: '100%',
        alignItems: 'center',
    },
    modalHeader: {
        fontSize: 24,
        fontWeight: '900',
        color: PRIMARY_COLOR,
        marginBottom: 5,
        textAlign: 'center',
    },
    modalSubHeader: {
        fontSize: 14,
        color: '#777',
        marginBottom: 25,
        textAlign: 'center',
    },
    
    // Language Selection Styles
    languageSelection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    langButton: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: ACCENT_COLOR,
        borderRadius: 10,
        alignItems: 'center',
    },
    langButtonText: {
        color: CARD_COLOR,
        fontSize: 18,
        fontWeight: 'bold',
    },

    // Template Editor Styles
    templateInput: {
        width: '100%',
        height: 200,
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        fontSize: 14,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    shareFinalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        width: '100%',
        marginTop: 10,
    },
    shareFinalButtonText: {
        color: CARD_COLOR,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    modalBackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        padding: 5,
    },
    modalBackButtonText: {
        fontSize: 14,
        color: '#777',
        marginLeft: 5,
    }
});

export default ShareIcons;