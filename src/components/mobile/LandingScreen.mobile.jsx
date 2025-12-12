// src/screens/LandingScreen.mobile.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    SafeAreaView, ScrollView, View, Text, Dimensions, TouchableOpacity, StyleSheet, Platform, Image
} from 'react-native';
import { useTheme } from '../../theme/theme.js';
import Icon from 'react-native-vector-icons/Ionicons';

// ✅ F I X E D: Changed require() to static import for assets 
// NOTE: Ensure this image path is correct, or use a placeholder URL
import heroImage from '../../../assets/hero_slide1.png';
// 🌟 LOGO IMPORT
import appLogo from '../../../assets/findyourflatmates.png';

const { width, height } = Dimensions.get('window');
// Mobile screens typically rely on vertical layout and less breakpoints

// -----------------------------------------------------------------
// 🎨 MOBILE-OPTIMIZED 3D STYLES & CONSTANTS (Matching Web Aesthetic)
// -----------------------------------------------------------------
const BASE_SHADOW_COLOR = '#102A43'; // Deep Blue
const VIBRANT_ACCENT = '#FFC700'; // Gold/Yellow accent
const PRIMARY_COLOR = '#FF3366'; // Vibrant Primary (Pink/Red)
const SECONDARY_ACCENT = '#4682B4'; // Steel Blue

// Enhanced Shadow for Main Card Lift (Optimized for Mobile Performance)
const MOBILE_DEEP_SHADOW = {
    shadowColor: BASE_SHADOW_COLOR,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 10,
};

// Subtle Shadow for internal elements
const MOBILE_SUBTLE_SHADOW = {
    shadowColor: BASE_SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
}
const GENEROUS_RADIUS = 20;
const BUTTON_RADIUS = 15;

// --- ALL DATA ARRAYS RETAINED FROM WEB ---
const propertyTypes = ['Flat', 'PG', 'Hostel', 'House'];
const featureCards = [
    { title: "Post Property", icon: "home", color: PRIMARY_COLOR },
    { title: "Find Flatmate", icon: "people", color: SECONDARY_ACCENT },
    { title: "Browse Listings", icon: "search", color: VIBRANT_ACCENT },
];
const valueProps = [
    { icon: "shield-checkmark", title: "100% Verified Listings", subtitle: "Every home is checked for accuracy and safety, guaranteeing peace of mind." },
    { icon: "chatbubbles-outline", title: "Instant Flatmate Chat", subtitle: "Connect immediately with potential flatmates through our in-app messaging." },
    { icon: "star-half-outline", title: "Smart Matching Algorithm", subtitle: "We match you with properties and flatmates based on your lifestyle, not just location." },
    { icon: "layers-outline", title: "Transparent Pricing", subtitle: "No hidden fees or magical surprises. What you see is what you pay." },
];
const initialTestimonials = [
    { name: "Anjali K.", location: "Bangalore", quote: "Finding a flatmate was effortless! The matching algorithm is truly magical. Highly recommended!", rating: 5 },
    { name: "Rajat S.", location: "Mumbai", quote: "The property listings are high quality and verified. I found my perfect PG in just three days.", rating: 5 },
    { name: "Priya V.", location: "Delhi", quote: "The in-app chat made connecting with potential roommates safe and quick. Excellent experience.", rating: 4 },
    { name: "Vishal M.", location: "Hyderabad", quote: "The verification process is seamless. Finally found a trustworthy place and flatmates!", rating: 5 },
];
const steps = [
    { icon: "search-outline", title: "1. Discover", subtitle: "Browse verified listings or filter for your ideal flatmate." },
    { icon: "chatbubbles-outline", title: "2. Connect", subtitle: "Use our in-app chat to talk securely with landlords or flatmates." },
    { icon: "home-outline", title: "3. Visit & Verify", subtitle: "Schedule a viewing, confirm details, and sign your digital lease." },
    { icon: "key-outline", title: "4. Move In", subtitle: "Unlock your new home and start your magical flatmate journey!" },
];
const neighborhoods = [
    { name: "Whitefield, Bangalore", rating: 4.8, vibe: "Tech & Modern", icon: "laptop-outline" },
    { name: "Koregaon Park, Pune", rating: 4.6, vibe: "Trendy & Artsy", icon: "wine-outline" },
];
const communityVibes = [
    { icon: "sparkles-outline", title: "Magical Events", subtitle: "Exclusive community gatherings and parties." },
    { icon: "book-outline", title: "Knowledge Base", subtitle: "Tips for moving, living, and local guides." },
];
// -----------------------------------------------------------------


const LandingScreen = ({ navigation }) => {
    const { colors } = useTheme();

    const [propertyType, setPropertyType] = useState('Flat');
    const [typedQuote, setTypedQuote] = useState('');
    const firstQuote = initialTestimonials[0].quote;
    
    // --- SCROLL / IN-VIEW LOGIC SIMPLIFIED FOR MOBILE (No parallax) ---
    // Only keeping the typing animation logic for a clean implementation.
    useEffect(() => {
        let index = 0;
        let typingInterval;

        const startTyping = () => {
            typingInterval = setInterval(() => {
                if (index < firstQuote.length) {
                    setTypedQuote(prev => prev + firstQuote.charAt(index));
                    index++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 50);
        };

        const startDelay = setTimeout(startTyping, 1000);

        return () => {
            clearInterval(typingInterval);
            clearTimeout(startDelay);
        };
    }, []);

    const handleLogin = () => {
        navigation.navigate('Login');
    };
    
    // --- Helper to render star rating ---
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Icon
                    key={i}
                    name={i < fullStars ? "star" : "star-outline"}
                    size={14}
                    color={VIBRANT_ACCENT}
                    style={{ marginRight: 2 }}
                />
            );
        }
        return <View style={{ flexDirection: 'row' }}>{stars}</View>;
    };

    // ----------------------------------------------------
    // ⬇️ RENDERED COMPONENTS ⬇️
    // ----------------------------------------------------

    const Footer = () => (
        <View style={[styles.footerContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <View style={styles.footerSection}>
                <Image
                    source={appLogo}
                    style={styles.footerLogo}
                    resizeMode="contain"
                />
                <Text style={[styles.footerSubtitle, { color: colors.text + '80' }]}>
                    Find your next home and companion. Where magic meets matching.
                </Text>
            </View>
            <View style={[styles.footerDivider, { backgroundColor: colors.border }]} />
            <Text style={[styles.footerCopyright, { color: colors.text + '60' }]}>
                © {new Date().getFullYear()} GDLSofts. All rights reserved.
            </Text>
        </View>
    );


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

            {/* 👑 HEADER BAR */}
            <View
                style={[
                    styles.headerBar,
                    {
                        backgroundColor: colors.card,
                        ...MOBILE_SUBTLE_SHADOW,
                    }
                ]}
            >
                {/* 🌟 LOGO AND TITLE CONTAINER */}
                <View style={styles.headerLogoContainer}>
                    {/* Circular Logo Icon for App Look */}
                    <Image
                        source={appLogo}
                        style={styles.headerLogo}
                        resizeMode="contain"
                    />
                    <Text style={[styles.headerTitle, { color: PRIMARY_COLOR }]}>FlatMates</Text>
                </View>

                <TouchableOpacity
                    style={[styles.loginButton, { backgroundColor: PRIMARY_COLOR, ...MOBILE_SUBTLE_SHADOW }]}
                    onPress={handleLogin}
                >
                    <Icon name="log-in-outline" size={24} color={VIBRANT_ACCENT} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContentMobile}>

                {/* 🏰 SECTION 1: HERO */}
                <View style={[styles.heroContainer, { backgroundColor: PRIMARY_COLOR + '10' }]}>
                    <Image
                        source={heroImage}
                        style={styles.heroImage}
                        resizeMode="cover"
                        // Added transparent overlay for text contrast on mobile
                        />
                    <View style={styles.heroOverlay}>
                        <Text style={[styles.heroTextTitle, { color: VIBRANT_ACCENT }]}>Find Your <Text style={{ color: PRIMARY_COLOR }}>Magical</Text> Flatmates</Text>
                        <Text style={[styles.heroTextSubtitle, { color: colors.card }]}>Verified homes and magic matches await you on your grand adventure.</Text>
                    </View>
                </View>


                {/* --- SECTION 2: EXPLORE CATEGORIES --- */}
                <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR }]}>🏰 Property Categories</Text>
                    <View style={styles.categoryGrid}>
                        {propertyTypes.map((type, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setPropertyType(type)}
                                style={[
                                    styles.categoryCard,
                                    {
                                        backgroundColor: propertyType === type ? PRIMARY_COLOR : colors.card,
                                        borderColor: propertyType === type ? PRIMARY_COLOR : colors.border,
                                        ...MOBILE_SUBTLE_SHADOW,
                                    }
                                ]}
                            >
                                <View style={[styles.iconWrapper, { backgroundColor: propertyType === type ? VIBRANT_ACCENT : PRIMARY_COLOR + '10' }]}>
                                    <Icon
                                        name={type === 'Flat' ? 'business-outline' : type === 'PG' ? 'bed-outline' : type === 'Hostel' ? 'school-outline' : 'home-outline'}
                                        size={25}
                                        color={propertyType === type ? PRIMARY_COLOR : PRIMARY_COLOR}
                                    />
                                </View>
                                <Text style={[styles.categoryTitle, { color: propertyType === type ? VIBRANT_ACCENT : colors.text, marginTop: 10 }]}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 🚀 SECTION 3: QUICK ACTIONS */}
                <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR }]}>⭐ Quick Actions</Text>
                    <View style={styles.featureGrid}>
                        {featureCards.map((card, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.featureCard,
                                    {
                                        backgroundColor: colors.card,
                                        ...MOBILE_DEEP_SHADOW,
                                    }
                                ]}
                            >
                                <View style={[styles.iconWrapper, { backgroundColor: card.color + '15' }]}>
                                    <Icon name={card.icon} size={25} color={card.color} />
                                </View>
                                <Text style={[styles.cardTitle, { color: colors.text, marginTop: 10 }]}>{card.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* --- SECTION 4: HOW IT WORKS --- */}
                <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR }]}>🪄 How It Works</Text>
                    <View style={styles.howItWorksGrid}>
                        {steps.map((step, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.howItWorksCard,
                                    {
                                        backgroundColor: colors.card,
                                        borderLeftColor: PRIMARY_COLOR,
                                        ...MOBILE_SUBTLE_SHADOW,
                                    }
                                ]}
                            >
                                <View style={[styles.stepNumberCircle, { backgroundColor: PRIMARY_COLOR }]}>
                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                </View>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={[styles.stepTitle, { color: colors.text }]}>{step.title}</Text>
                                    <Text style={[styles.stepSubtitle, { color: colors.text + '80' }]}>{step.subtitle}</Text>
                                </View>
                                <Icon name={step.icon} size={25} color={VIBRANT_ACCENT} />
                            </View>
                        ))}
                    </View>
                </View>

                {/* --- SECTION 5: VALUE PROPOSITIONS --- */}
                <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR }]}>🌟 Our Advantage</Text>
                    <View style={styles.valuePropsGrid}>
                        {valueProps.map((prop, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.valuePropCard,
                                    {
                                        backgroundColor: colors.card,
                                        borderLeftColor: VIBRANT_ACCENT,
                                        ...MOBILE_SUBTLE_SHADOW,
                                    }
                                ]}
                            >
                                <Icon name={prop.icon} size={25} color={PRIMARY_COLOR} style={{ marginBottom: 5 }} />
                                <Text style={[styles.valuePropTitle, { color: colors.text }]}>{prop.title}</Text>
                                <Text style={[styles.valuePropSubtitle, { color: colors.text + '80' }]}>{prop.subtitle}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 💬 SECTION 7: USER TESTIMONIALS */}
                <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR }]}>💬 Happy Renters</Text>
                    {initialTestimonials.map((testimonial, index) => {
                        const isLeft = index % 2 === 0;
                        const bubbleColor = isLeft ? colors.card : PRIMARY_COLOR + '08';
                        const nameColor = isLeft ? PRIMARY_COLOR : VIBRANT_ACCENT;

                        const quoteContent = index === 0 ? typedQuote : testimonial.quote;
                        const isTyping = index === 0 && typedQuote.length < firstQuote.length;

                        return (
                            <View
                                key={index}
                                style={[
                                    styles.testimonialCard,
                                    {
                                        backgroundColor: bubbleColor,
                                        alignSelf: isLeft ? 'flex-start' : 'flex-end',
                                        borderTopLeftRadius: isLeft ? 15 : 5,
                                        borderBottomRightRadius: isLeft ? 5 : 15,
                                        ...MOBILE_SUBTLE_SHADOW,
                                    }
                                ]}
                            >
                                {isTyping ? (
                                    <Text style={[styles.typingText, { color: colors.text + '90' }]}>
                                        {quoteContent}
                                        <Text style={styles.blinkingCursor}>|</Text>
                                    </Text>
                                ) : (
                                    <Text style={[styles.testimonialQuote, { color: colors.text }]}>
                                        {quoteContent}
                                    </Text>
                                )}
                                <Text style={[styles.testimonialName, { color: nameColor, alignSelf: isLeft ? 'flex-start' : 'flex-end' }]}>- {testimonial.name}</Text>
                            </View>
                        );
                    })}
                </View>
                
                {/* 🏡 SECTION 8: FEATURED NEIGHBORHOODS */}
                 <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR }]}>🗺️ Neighborhoods</Text>
                    <View style={styles.neighborhoodGrid}>
                        {neighborhoods.map((n, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.neighborhoodCard,
                                    {
                                        backgroundColor: colors.card,
                                        borderLeftColor: SECONDARY_ACCENT,
                                        ...MOBILE_SUBTLE_SHADOW,
                                    }
                                ]}
                            >
                                <Icon name={n.icon} size={25} color={SECONDARY_ACCENT} style={{ marginBottom: 5 }} />
                                <Text style={[styles.neighborhoodTitle, { color: colors.text }]}>{n.name}</Text>
                                <Text style={[styles.neighborhoodSubtitle, { color: VIBRANT_ACCENT }]}>{n.vibe}</Text>
                                <View style={styles.ratingRow}>
                                    {renderStars(n.rating)}
                                    <Text style={[styles.ratingText, { color: colors.text + '90' }]}>{n.rating}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 🦶 FOOTER SECTION */}
                <Footer />


            </ScrollView>
            
            {/* 🌟 STICKY FLOATING CTA BUTTON (Mobile must-have) */}
            <View style={styles.stickyCTAContainer}>
                <TouchableOpacity
                    style={[styles.heroCTA, { backgroundColor: PRIMARY_COLOR, ...MOBILE_DEEP_SHADOW }]}
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text style={[styles.heroCTAText, { color: VIBRANT_ACCENT }]}>Join the Kingdom</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};


// --- MOBILE-SPECIFIC STYLES ---
const styles = StyleSheet.create({
    scrollContentMobile: {
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 100, // Space for sticky CTA
    },

    // Global Section Styles
    sectionContainer: {
        width: '100%',
        paddingVertical: 25,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: 0.3,
    },

    // 👑 HEADER BAR STYLE
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        zIndex: 10,
    },
    headerLogoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLogo: { 
        height: 35,
        width: 35,
        marginRight: 8,
        // Logo is already circular/squarish in the uploaded image,
        // but we ensure it fits cleanly.
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
    },
    loginButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // 🏰 --- HERO SECTION STYLES ---
    heroContainer: {
        width: '100%',
        height: 300,
        borderRadius: GENEROUS_RADIUS,
        overflow: 'hidden',
        marginBottom: 20,
    },
    heroImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.3,
    },
    heroOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.6)', // Dark overlay for text
    },
    heroTextTitle: {
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    heroTextSubtitle: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    
    // 🌟 STICKY CTA BUTTON (Reused styles)
    stickyCTAContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // Semi-transparent background
        zIndex: 5,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    heroCTA: {
        paddingVertical: 12,
        borderRadius: 50,
        alignItems: 'center',
    },
    heroCTAText: {
        fontSize: 18,
        fontWeight: '900',
    },

    // 🌟 REUSABLE ICON WRAPPER STYLE
    iconWrapper: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
        ...MOBILE_SUBTLE_SHADOW,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // --- Explore Categories Styles ---
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryCard: {
        width: '48%',
        padding: 15,
        borderRadius: GENEROUS_RADIUS,
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: '900',
    },

    // --- Feature Grid Styles ---
    featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featureCard: {
        width: '48%', // 2 columns
        padding: 20,
        borderRadius: GENEROUS_RADIUS,
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '900',
        textAlign: 'center',
    },

    // --- How It Works Styles (Vertical List) ---
    howItWorksGrid: {
        flexDirection: 'column',
    },
    howItWorksCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: BUTTON_RADIUS,
        marginBottom: 15,
        borderLeftWidth: 5,
    },
    stepNumberCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    stepNumberText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 16,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '900',
        marginBottom: 2,
    },
    stepSubtitle: {
        fontSize: 14,
    },

    // --- Value Proposition Styles (1 column for better readability) ---
    valuePropsGrid: {
        flexDirection: 'column',
    },
    valuePropCard: {
        flexDirection: 'column', // Stacked
        padding: 15,
        borderRadius: BUTTON_RADIUS,
        marginBottom: 15,
        borderLeftWidth: 4,
    },
    valuePropTitle: {
        fontSize: 18,
        fontWeight: '900',
        marginTop: 5,
        marginBottom: 2,
    },
    valuePropSubtitle: {
        fontSize: 14,
    },
    
    // --- Testimonial Styles ---
    testimonialCard: {
        maxWidth: '85%',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        borderTopWidth: 3, // Highlight border
        borderTopColor: PRIMARY_COLOR,
    },
    testimonialQuote: {
        fontSize: 16,
        fontStyle: 'italic',
        lineHeight: 22,
        marginBottom: 5,
    },
    typingText: {
        fontSize: 16,
        fontStyle: 'italic',
        lineHeight: 22,
        minHeight: 22,
        marginBottom: 5,
    },
    blinkingCursor: {
        fontWeight: 'bold',
        marginLeft: 2,
    },
    testimonialName: {
        fontSize: 14,
        fontWeight: '700',
    },
    
    // --- Neighborhood Styles (2 columns) ---
    neighborhoodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    neighborhoodCard: {
        width: '48%',
        padding: 15,
        borderRadius: BUTTON_RADIUS,
        marginBottom: 15,
        borderLeftWidth: 4,
        alignItems: 'center',
    },
    neighborhoodTitle: {
        fontSize: 18,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 2,
    },
    neighborhoodSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
        textAlign: 'center',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 5,
        fontSize: 16,
        fontWeight: '800',
    },

    // 🦶 FOOTER STYLES (Simplified)
    footerContainer: {
        paddingVertical: 30,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        marginTop: 30,
    },
    footerSection: {
        marginBottom: 20,
        alignItems: 'center',
    },
    footerLogo: {
        height: 40,
        width: 150,
        marginBottom: 10,
    },
    footerSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    footerDivider: {
        height: 1,
        width: '100%',
        marginBottom: 15,
    },
    footerCopyright: {
        fontSize: 12,
        textAlign: 'center',
    },
});

export default LandingScreen;