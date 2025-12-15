// src/components/Step6Images.jsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Platform } from 'react-native'; 
import Icon from 'react-native-vector-icons/Ionicons'; 
import { SUBTLE_SHADOW, COLORS } from './PropertyCreate.web';

// Utility function for robust, basic URL validation (Frontend Security Layer 1)
const isValidUrl = (url) => {
    // This regex validates the basic structure, protocol (http/https), domain, and file path.
    const urlPattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol (http or https, optional)
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)*[a-z]{2,}|' + // domain name (e.g., google.com)
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%@_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%@_.,~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i' // fragment locator
    );
    // यह फ़ॉर्मेट जाँच URL को सैनिटाइज करने और खतरनाक स्क्रिप्ट को सीधे जोड़ने से रोकने में मदद करती है।
    return !!urlPattern.test(url);
};

/**
 * Step 6: Property Images
 * 🚨 UPDATED: Now includes robust URL validation, image loading check, and live preview.
 */
const Step6Images = ({ currentImageLink, setCurrentImageLink, imageLinks, handleAddImage, handleRemoveImage, isLoading, styles, showToast }) => {
    
    // लोकल स्टेट, जो यह ट्रैक करता है कि वर्तमान में इमेज सत्यापित हो रही है या नहीं
    const [isImageValidating, setIsImageValidating] = useState(false); 
    // सत्यापन के दौरान तात्कालिक प्रीव्यू के लिए URL
    const [previewUrl, setPreviewUrl] = useState(''); 

    // 🚨 NEW FUNCTION: Handles URL Validation and Load Check
    const handleAddImageWithValidation = () => {
        const url = currentImageLink.trim();
        
        // 1. URL Format Validation
        if (!isValidUrl(url)) {
            showToast("Invalid URL format. Please use a full, valid URL starting with http(s)://", 'error');
            return;
        }

        // 2. Maximum Image Check
        if (imageLinks.length >= 5) {
             showToast("Maximum 5 images allowed.", 'error');
             return;
        }

        setIsImageValidating(true);
        setPreviewUrl(url); 

        // 3. Image Loading/Content Validation (Web Environment Only)
        // हम React Native for Web में लोड चेक के लिए ब्राउज़र के नेटिव Image ऑब्जेक्ट का उपयोग करते हैं।
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            const img = new window.Image(); 
            
            img.onload = () => {
                setIsImageValidating(false);
                // अगर इमेज सफलतापूर्वक लोड हो जाती है, तो पैरेंट के handler को कॉल करें
                handleAddImage(); 
                setPreviewUrl(''); // लोकल प्रीव्यू स्टेट को साफ़ करें
            };
            
            img.onerror = () => {
                setIsImageValidating(false);
                setPreviewUrl(''); // लोकल प्रीव्यू स्टेट को साफ़ करें
                showToast("Invalid image URL or unable to load image for preview. Please check the URL.", 'error');
            };
            
            // इमेज लोड चेक शुरू करने के लिए src सेट करें
            img.src = url; 
        } else {
            // Non-web fallback: skip image load check, rely on URL format check
            setIsImageValidating(false);
            handleAddImage();
            setPreviewUrl('');
        }
    };

    const renderImages = () => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Property Images</Text>
            <Text style={styles.uploadHelperText}>
                 Add image URLs (up to 5). URL को मान्य (validated) किया जाएगा और जोड़ने से पहले उसका प्रीव्यू लोड होना ज़रूरी है। (Minimum 3 required) 
            </Text>
            <View style={styles.imageInputContainer}>
                <TextInput 
                    style={styles.imageLinkInput} 
                    placeholder="Paste Image URL here (e.g., imgur.com/xyz.jpg)"
                    value={currentImageLink}
                    onChangeText={setCurrentImageLink}
                    editable={!isLoading && !isImageValidating && imageLinks.length < 5} 
                />
                <TouchableOpacity 
                    style={[styles.addButton, SUBTLE_SHADOW]} 
                    // 🚨 CHANGED: अब सत्यापन रैपर फ़ंक्शन को कॉल करता है
                    onPress={handleAddImageWithValidation}
                    disabled={isLoading || isImageValidating || imageLinks.length >= 5 || !currentImageLink.trim()}
                >
                    {isImageValidating ? (
                        <Text style={{ color: COLORS.cardBackground, fontWeight: '700', fontSize: 10, textAlign: 'center' }}>Checking...</Text>
                    ) : (
                        // बटन के रंग के साथ कंट्रास्ट के लिए आइकन का रंग बदला
                        <Icon name="add" size={24} color={COLORS.cardBackground} /> 
                    )}
                </TouchableOpacity>
            </View>
            
            {/* 🚨 NEW: Immediate Preview Section while validating */}
            {isImageValidating && previewUrl && (
                <View style={{ marginVertical: 15, alignItems: 'center' }}>
                    <Text style={styles.helperText}>Validating Image...</Text>
                    <Image
                        style={{ width: 150, height: 100, borderRadius: 10, margin: 10, borderWidth: 2, borderColor: COLORS.secondaryTeal }}
                        source={{ uri: previewUrl }}
                    />
                </View>
            )}

            <View style={styles.imagePreviewContainer}>
                {imageLinks.map((url, index) => (
                    // इमेज टेक्स्ट के बजाय इमेज थंबनेल प्रदर्शित करें (बेहतर UX)
                    <View key={index} style={[styles.imagePill, SUBTLE_SHADOW, { padding: 5, backgroundColor: COLORS.backgroundSoft }]}>
                        <Image
                            style={{ width: 40, height: 40, borderRadius: 5, marginRight: 8 }}
                            source={{ uri: url }}
                        />
                        <Text style={styles.imageText} numberOfLines={1}>
                            Image {index + 1}
                        </Text>
                        <TouchableOpacity onPress={() => handleRemoveImage(url)}>
                            <Icon name="close-circle" size={20} color={COLORS.errorRed} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <>
            <Text style={styles.sectionTitle}>6. Property Images</Text>
            {renderImages()}
            {imageLinks.length < 3 && (
                <Text style={styles.errorText}>
                    🚨 Minimum 3 successfully validated images are required for submission. Currently: {imageLinks.length}
                </Text>
            )}
        </>
    );
};

export default Step6Images;