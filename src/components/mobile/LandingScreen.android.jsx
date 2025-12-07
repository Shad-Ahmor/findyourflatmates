// src/screens/LandingScreen.android.jsx

import React, { useState, useEffect } from 'react';
import {
 SafeAreaView, ScrollView, View, Text, Dimensions, TouchableOpacity, StyleSheet, Image, TextInput
} from 'react-native'; 
import { useTheme } from '../../theme/theme.js'; 
import Icon from 'react-native-vector-icons/Ionicons'; 
const heroImage = require('../../../assets/hero_slide_1.jpg'); 

const { width } = Dimensions.get('window');

// -----------------------------------------------------------------
// 🎨 ANDROID/MOBILE-SPECIFIC DISNEY-ESQUE STYLES & CONSTANTS
// (Focus on elevation for 3D effect)
// -----------------------------------------------------------------
const BASE_SHADOW_COLOR = '#102A43'; 
const VIBRANT_ACCENT = '#FFD700'; 

// Deep, soft shadow using RN standard properties
const DEEP_SOFT_SHADOW = {
    // Note: boxShadow is ignored on native, elevation/shadow* are used
    shadowColor: BASE_SHADOW_COLOR, 
    shadowOffset: { width: 0, height: 12 }, 
    shadowOpacity: 0.35, 
    shadowRadius: 20, 
    elevation: 20, // Increased elevation for a floating mobile look
};

// Subtle shadow for lift and interaction
const SUBTLE_SHADOW = { 
    shadowColor: BASE_SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
}
const GENEROUS_RADIUS = 30;
const BUTTON_RADIUS = 20; 
// -----------------------------------------------------------------


const searchGoals = ['Property', 'Flatmate'];
const propertyTypes = ['Flat', 'PG', 'Hostel', 'House'];
const featureCards = [
    { title: "Post Property", icon: "home", color: "#FF6347" },
    { title: "Find Flatmate", icon: "people", color: "#4682B4" },
    { title: "Browse Listings", icon: "search", color: "#3CB371" },
];

const LandingScreen = ({ navigation }) => {
    const { colors } = useTheme();
    
    const [selectedGoal, setSelectedGoal] = useState('Property');
    const [city, setCity] = useState('');
    const [propertyType, setPropertyType] = useState('Flat'); 

    const handleSearch = () => {
        const type = selectedGoal === 'Property' ? propertyType : 'Flatmate';
        alert(`ANDROID SEARCH: Searching for ${type} in ${city || 'All India'}...`);
    };

    const handleCardAction = (title) => {
        if (title === "Post Property") {
             alert("ANDROID: Navigating to Post Property form (ListingFormScreen).");
        } else if (title === "Find Flatmate") {
            setSelectedGoal('Flatmate');
            // No window.scrollTo needed on native
        } else if (title === "Browse Listings") {
             alert("ANDROID: Navigating to Browse Listings (HomeScreen).");
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={styles.scrollContentAndroid}>
                
                {/* 🏰 SECTION 1: HERO (Mobile Optimized) */}
                <View style={[styles.heroContainer, { backgroundColor: colors.primary + '15' }]}>
                    <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
                    
                    {/* Floating Title Card */}
                    <View style={[styles.heroTitleCard, { backgroundColor: colors.card, ...DEEP_SOFT_SHADOW }]}>
                        <Text style={[styles.heroTitle, { color: colors.primary }]}>🏡 FlatMate Kingdom</Text>
                        <Text style={[styles.heroSubtitle, { color: colors.text }]}>
                            Your magical search for the perfect flat, PG, hostel, or flatmate ends here!
                        </Text>
                    </View>
                </View>
                
                {/* 🔍 SECTION 2: MAIN SEARCH BAR (Flows immediately below Hero) */}
                <View style={[styles.searchPanelContainer, { backgroundColor: colors.card, ...DEEP_SOFT_SHADOW, marginTop: -60 }]}>
                    
                    {/* Tabs for Property / Flatmate */}
                    <View style={styles.searchTabs}>
                        {/* ... (Tabs logic remains the same) ... */}
                        {searchGoals.map(goal => (
                            <TouchableOpacity
                                key={goal}
                                onPress={() => setSelectedGoal(goal)}
                                style={[
                                    styles.searchTabButton,
                                    { 
                                        backgroundColor: selectedGoal === goal ? colors.primary : colors.card,
                                        borderBottomColor: selectedGoal === goal ? colors.primary : colors.border,
                                    }
                                ]}
                            >
                                <Icon 
                                    name={goal === 'Property' ? 'key' : 'people-circle'} 
                                    size={20} 
                                    color={selectedGoal === goal ? colors.white : colors.text}
                                    style={{marginRight: 8}}
                                />
                                <Text style={{ color: selectedGoal === goal ? colors.white : colors.text, fontWeight: '700' }}>
                                    {goal} Search
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    
                    {/* Search Inputs */}
                    <View style={styles.searchInputs}>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={[styles.textInput, {backgroundColor: colors.background, borderColor: colors.border, color: colors.text}]}
                                placeholder={selectedGoal === 'Property' ? "City (Mumbai, Delhi, etc.)" : "Flatmate Gender/Preference"}
                                placeholderTextColor={colors.text + '80'}
                                value={city}
                                onChangeText={setCity}
                            />
                            
                            <TouchableOpacity 
                                style={[styles.searchButton, {backgroundColor: colors.primary, ...SUBTLE_SHADOW}]}
                                onPress={handleSearch}
                            >
                                <Icon name="search" size={24} color={colors.white} />
                            </TouchableOpacity>
                        </View>

                        {/* Property Type Selection for 'Property' goal */}
                        {selectedGoal === 'Property' && (
                            <View style={styles.propertyTypeRow}>
                                {propertyTypes.map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        onPress={() => setPropertyType(type)}
                                        style={[
                                            styles.propertyTypeButton,
                                            { 
                                                backgroundColor: propertyType === type ? VIBRANT_ACCENT + 'CC' : colors.background,
                                                borderColor: propertyType === type ? VIBRANT_ACCENT : colors.border,
                                                ...SUBTLE_SHADOW,
                                                shadowColor: propertyType === type ? VIBRANT_ACCENT : BASE_SHADOW_COLOR,
                                            }
                                        ]}
                                    >
                                        <Text style={{ color: colors.text, fontWeight: '600' }}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
                
                {/* 🚀 SECTION 3: FEATURE CARDS */}
                <View style={styles.featureGrid}>
                    {featureCards.map((card, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.featureCard, 
                                { 
                                    backgroundColor: colors.card, 
                                    ...DEEP_SOFT_SHADOW,
                                    // Native transition is simple
                                }
                            ]}
                            onPress={() => handleCardAction(card.title)}
                        >
                            <Icon name={card.icon} size={48} color={card.color} style={styles.cardIcon} />
                            <Text style={[styles.cardTitle, { color: colors.text }]}>{card.title}</Text>
                            <Text style={[styles.cardSubtitle, { color: colors.text + '80' }]}>
                                {card.title === "Post Property" ? "List your space in 2 magical steps!" : card.title === "Find Flatmate" ? "Discover your ideal living companion." : "See our featured, high-rated homes."}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ✨ SECTION 4: CALL TO ACTION FOOTER */}
                <View style={[styles.ctaFooter, { backgroundColor: colors.primary + '10' }]}>
                    <Text style={[styles.ctaText, { color: colors.text }]}>Ready to find your fairytale home?</Text>
                    <TouchableOpacity 
                        style={[styles.ctaButton, { backgroundColor: VIBRANT_ACCENT, ...DEEP_SOFT_SHADOW }]}
                        onPress={() => alert('ANDROID: Navigating to HomeScreen')}
                    >
                        <Text style={[styles.ctaButtonText, { color: BASE_SHADOW_COLOR }]}>
                            Explore Now <Icon name="arrow-forward-circle" size={24} color={BASE_SHADOW_COLOR} />
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};


// --- ANDROID-SPECIFIC STYLES ---
const styles = StyleSheet.create({
    scrollContentAndroid: {
        flexGrow: 1, 
        alignSelf: 'stretch', // Mobile should take full width
        paddingHorizontal: 0, 
        paddingTop: 0, 
        paddingBottom: 50, 
    },
    
    heroContainer: {
        position: 'relative',
        width: '100%',
        height: 350, // Fixed height for mobile
        marginBottom: 20, // Reduced margin
        overflow: 'hidden',
        borderBottomLeftRadius: GENEROUS_RADIUS * 2,
        borderBottomRightRadius: GENEROUS_RADIUS * 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.5, 
    },
    heroTitleCard: {
        padding: 30, // Reduced padding for mobile
        borderRadius: GENEROUS_RADIUS,
        alignItems: 'center',
        zIndex: 10,
    },
    heroTitle: {
        fontSize: 40,
        fontWeight: '900',
        marginBottom: 8,
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
    },
    
    // Search Panel Styles (Flows below Hero)
    searchPanelContainer: {
        alignSelf: 'center',
        width: '90%', // Takes most of the mobile width
        borderRadius: GENEROUS_RADIUS,
        padding: 20,
        zIndex: 20,
        // Removed absolute positioning
    },
    searchTabs: {
        flexDirection: 'row',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: BASE_SHADOW_COLOR + '20',
    },
    searchTabButton: {
        flexDirection: 'row',
        flex: 1, // Full width tabs on mobile
        justifyContent: 'center',
        paddingVertical: 15,
        borderTopLeftRadius: BUTTON_RADIUS,
        borderTopRightRadius: BUTTON_RADIUS,
        marginRight: 5,
        borderBottomWidth: 3,
    },
    searchInputs: {
        paddingVertical: 10,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    textInput: {
        flex: 3,
        padding: 15,
        borderRadius: BUTTON_RADIUS,
        fontSize: 16,
        marginRight: 10,
        borderWidth: 1,
    },
    searchButton: {
        padding: 15,
        borderRadius: BUTTON_RADIUS,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
    },
    propertyTypeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    propertyTypeButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: BUTTON_RADIUS,
        marginBottom: 10,
        borderWidth: 1,
    },

    // Feature Grid Styles
    featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 40, 
        width: '100%',
    },
    featureCard: {
        width: '48%', // Two cards per row on mobile
        padding: 20,
        borderRadius: GENEROUS_RADIUS,
        alignItems: 'center',
        marginBottom: 20,
    },
    cardIcon: {
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 5,
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    
    // CTA Footer Styles
    ctaFooter: {
        padding: 40,
        alignItems: 'center',
        marginTop: 40,
        borderRadius: GENEROUS_RADIUS,
        marginHorizontal: 20,
    },
    ctaText: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 20,
        textAlign: 'center',
    },
    ctaButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: BUTTON_RADIUS,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ctaButtonText: {
        fontSize: 18,
        fontWeight: '900',
        marginRight: 10,
    }
});

export default LandingScreen;