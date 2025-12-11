// src/screens/LandingScreen.web.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    SafeAreaView, ScrollView, View, Text, Dimensions, TouchableOpacity, StyleSheet, Platform, Image
} from 'react-native';
import { useTheme } from '../../theme/theme.js';
import Icon from 'react-native-vector-icons/Ionicons';

// NOTE: Ensure this image path is correct, or use a placeholder URL
const heroImage = require('../../../assets/hero_slide1.png');
// 🌟 NEW LOGO IMPORT
const appLogo = require('../../../assets/findyourflatmates.png');

const { width, height } = Dimensions.get('window');
const BREAKPOINT = 768;
const MAX_WEB_WIDTH = '98vw'; // Fixed maximum width for better centering control
const HORIZONTAL_MARGIN = 15; // Margin to keep it off the edge

// -----------------------------------------------------------------
// 🎨 ENHANCED MAGICAL 3D STYLES & CONSTANTS (Matching PropertyListing.web.jsx Aesthetic)
// -----------------------------------------------------------------
const BASE_SHADOW_COLOR = '#102A43'; // Deep Blue for better contrast
const VIBRANT_ACCENT = '#FFC700'; // Gold/Yellow accent
const PRIMARY_COLOR = '#FF3366'; // Vibrant Primary (Used often for icons/text)
const SECONDARY_ACCENT = '#4682B4'; // Steel Blue for complementary details (New)

// Enhanced Shadow for Main Card Lift (Grand Floating Effect - Stronger 3D Look)
const DEEP_3D_SHADOW = {
    // Web (boxShadow) equivalent: Deeper, wider shadow for floating effect + accent glow
    boxShadow: `0 20px 50px 0px rgba(16, 42, 67, 0.6), 0 0 15px 0px ${VIBRANT_ACCENT}30`,
    // RN (shadow/elevation) fallback
    shadowColor: BASE_SHADOW_COLOR,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.45, // Increased
    shadowRadius: 30, // Increased
    elevation: 20, // Increased elevation
};

// Subtle Shadow for internal elements (Pills, Rating Box - More pronounced)
const SUBTLE_SHADOW = {
    // Web (boxShadow) equivalent
    boxShadow: `0 8px 16px 0px rgba(16, 42, 67, 0.2)`,
    // RN (shadow/elevation) fallback
    shadowColor: BASE_SHADOW_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, // Increased
    shadowRadius: 12,
    elevation: 8,
}
const GENEROUS_RADIUS = 30; // Ultra-Rounded corners
const BUTTON_RADIUS = 20;

const FLOATING_HEADER_STYLE = {
    // Keeping this for the sticky header effect
    transformPerspective: 1000,
    transform: [
        { translateZ: 100 },
        { translateY: 0 },
    ],
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

// -----------------------------------------------------------------

// --- ALL DATA ARRAYS RESTORED ---
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
    { name: "Sneha T.", location: "Pune", quote: "Moved across the country and felt instantly at home thanks to FlatMate support.", rating: 5 },
    { name: "Gaurav R.", location: "Chennai", quote: "Great UI and easy navigation. Managed to schedule viewings efficiently.", rating: 4 },
];
const featurePreviews = [
    { icon: "map-outline", title: "Interactive 3D Tours", subtitle: "Explore homes remotely with stunning virtual reality tours." },
    { icon: "calculator-outline", title: "Smart Rent Calculator", subtitle: "Analyze local market rates and neighborhood affordability instantly." },
    { icon: "calendar-outline", title: "Automated Viewings", subtitle: "Schedule property visits directly with landlords through the app." },
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
    { name: "DLF Phase 4, Gurgaon", rating: 4.9, vibe: "Luxury & Exclusive", icon: "diamond-outline" },
    { name: "Vile Parle, Mumbai", rating: 4.5, vibe: "Suburban & Family", icon: "people-outline" },
];
const communityVibes = [
    { icon: "sparkles-outline", title: "Magical Events", subtitle: "Exclusive community gatherings and parties." },
    { icon: "book-outline", title: "Knowledge Base", subtitle: "Tips for moving, living, and local guides." },
    { icon: "leaf-outline", title: "Eco-Friendly Homes", subtitle: "Listings focused on sustainable living." },
    { icon: "game-controller-outline", title: "Gaming Zones", subtitle: "Find flatmates who share your passion for gaming." },
];
// -----------------------------------------------------------------


const LandingScreen = ({ navigation }) => {
    const { colors } = useTheme();

    const [propertyType, setPropertyType] = useState('Flat');
    const [scrollY, setScrollY] = useState(0);
    const sectionRefs = useRef({});
    const [inView, setInView] = useState({});

    // 🌟 TYPING ANIMATION STATE
    const [typedQuote, setTypedQuote] = useState('');
    const firstQuote = initialTestimonials[0].quote;

    // --- REFS FOR ALL SECTIONS RESTORED ---
    const categoryRef = useRef(null);
    const featureRef = useRef(null);
    const howItWorksRef = useRef(null);
    const valueRef = useRef(null);
    const testimonialRef = useRef(null);
    const neighborhoodsRef = useRef(null);
    const communityRef = useRef(null);
    const previewRef = useRef(null);
    const ctaRef = useRef(null);

    // ----------------------------------------------------
    // 🪄 CHAT TYPING EFFECT (Logic Retained)
    // ----------------------------------------------------
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
            }, 50); // Typing speed in ms
        };

        const startDelay = setTimeout(startTyping, 1000);

        return () => {
            clearInterval(typingInterval);
            clearTimeout(startDelay);
        };
    }, []);


    // ----------------------------------------------------
    // 🪄 CUSTOM SCROLL & PARALLAX LOGIC (Logic Retained)
    // ----------------------------------------------------

    const measureSection = useCallback((sectionName, viewRef) => {
        if (viewRef && viewRef.current) {
            viewRef.current.measure((x, y, width, height, pageX, pageY) => {
                sectionRefs.current[sectionName] = {
                    y: pageY,
                    height: height,
                    triggered: false
                };
            });
        }
    }, []);

    const handleScroll = useCallback((event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        setScrollY(currentScrollY);
        const viewportHeight = height;

        const newInView = { ...inView };
        let updated = false;

        for (const name in sectionRefs.current) {
            const section = sectionRefs.current[name];
            const triggerPoint = section.y + section.height * 0.1;

            if (currentScrollY + viewportHeight * 0.8 > triggerPoint && !section.triggered) {
                newInView[name] = true;
                section.triggered = true;
                updated = true;
            }
        }
        if (updated) {
            setInView(newInView);
        }
    }, [inView]);

    const heroImageParallax = {
        transform: [
            { scale: 1.1 },
            { translateY: scrollY * 0.3 },
        ],
        transition: 'transform 0s linear',
    };

    // ----------------------------------------------------
    // 🎨 RENDER HELPER FOR ANIMATED CARDS (Logic Retained)
    // ----------------------------------------------------
    const getAnimatedCardStyle = (sectionName, index) => {
        const isTriggered = inView[sectionName];

        return {
            opacity: isTriggered ? 1 : 0,
            transform: [
                { translateY: isTriggered ? 0 : 70 },
                { rotate: isTriggered ? '0deg' : '-5deg' }
            ],
            transitionProperty: 'opacity, transform',
            transitionDuration: '1.2s',
            transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: `${index * 0.15}s`,
        };
    };

    // 🌟 RESTORED: All measureSection calls
    useEffect(() => {
        setInView({ hero: true });

        const timer = setTimeout(() => {
            measureSection('category', categoryRef);
            measureSection('feature', featureRef);
            measureSection('howItWorks', howItWorksRef);
            measureSection('value', valueRef);
            measureSection('testimonial', testimonialRef);
            measureSection('neighborhoods', neighborhoodsRef);
            measureSection('community', communityRef);
            measureSection('preview', previewRef);
            measureSection('cta', ctaRef);
        }, 500);

        return () => clearTimeout(timer);
    }, [measureSection]);



    const handleLogin = () => {
        navigation.navigate('Login');
    };

    // ----------------------------------------------------
    // ⬇️ RENDERED COMPONENTS ⬇️
    // ----------------------------------------------------

    const Footer = () => (
        <View style={[styles.footerContainer, { backgroundColor: colors.card + 'e0', borderTopColor: colors.border }]}>
            <View style={styles.footerContent}>

                {/* 1. Branding and Social */}
                <View style={styles.footerSection}>
                    {/* 🌟 LOGO IMAGE REPLACEMENT FOR FOOTER */}
                    <Image
                        source={appLogo}
                        style={styles.footerLogo}
                        resizeMode="contain"
                    />
                    <Text style={[styles.footerSubtitle, { color: colors.text + '80' }]}>
                        Find your next home and companion. Where magic meets matching.
                    </Text>
                    <View style={styles.socialIcons}>
                        <Icon name="logo-facebook" size={24} color={VIBRANT_ACCENT} style={styles.socialIcon} />
                        <Icon name="logo-instagram" size={24} color={VIBRANT_ACCENT} style={styles.socialIcon} />
                        <Icon name="logo-linkedin" size={24} color={VIBRANT_ACCENT} style={styles.socialIcon} />
                    </View>
                </View>

                {/* 2. Quick Links */}
                <View style={styles.footerSection}>
                    <Text style={[styles.footerHeading, { color: colors.text }]}>Quick Links</Text>
                    {['Browse Listings', 'Post Property', 'Find Flatmate', 'Neighborhoods'].map((item, index) => (
                        <Text key={index} style={[styles.footerLink, { color: colors.text + 'a0' }]}>{item}</Text>
                    ))}
                </View>

                {/* 3. Company */}
                <View style={styles.footerSection}>
                    <Text style={[styles.footerHeading, { color: colors.text }]}>Company</Text>
                    {['About Us', 'Careers', 'Blog', 'Contact Support'].map((item, index) => (
                        <Text key={index} style={[styles.footerLink, { color: colors.text + 'a0' }]}>{item}</Text>
                    ))}
                </View>

                {/* 4. Legal */}
                <View style={styles.footerSection}>
                    <Text style={[styles.footerHeading, { color: colors.text }]}>Legal</Text>
                    {['Terms of Service', 'Privacy Policy', 'Sitemap', 'FAQ'].map((item, index) => (
                        <Text key={index} style={[styles.footerLink, { color: colors.text + 'a0' }]}>{item}</Text>
                    ))}
                </View>
            </View>

            <View style={[styles.footerDivider, { backgroundColor: colors.border }]} />

            <Text style={[styles.footerCopyright, { color: colors.text + '60' }]}>
                © {new Date().getFullYear()} GDLSofts. All rights reserved. Built with magic.
            </Text>
        </View>
    );


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

            {/* 👑 ENHANCED STICKY HEADER BAR (CENTERED FIX) */}
            <View
                style={[
                    styles.headerBar,
                    {
                        backgroundColor: colors.card,
                        ...DEEP_3D_SHADOW, // Deep Shadow for floating effect
                        ...FLOATING_HEADER_STYLE,
                    }
                ]}
            >
                {/* 🌟 LOGO IMAGE REPLACEMENT FOR HEADER */}
                   <View style={styles.headerLogoContainer}> 
                    <Image
                        source={appLogo}
                        style={styles.headerLogo}
                        resizeMode="contain"
                    />
                    <Text style={[styles.headerTitle, { color: PRIMARY_COLOR }]}>FlatMates</Text>
                </View>
                <TouchableOpacity
                    style={[styles.loginButton, { backgroundColor: PRIMARY_COLOR, ...SUBTLE_SHADOW }]}
                    onPress={handleLogin}
                >
                    <Icon name="log-in-outline" size={24} color={VIBRANT_ACCENT} />
                </TouchableOpacity>
            </View>

            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={[styles.scrollContentWeb, { maxWidth: MAX_WEB_WIDTH + HORIZONTAL_MARGIN * 2, backgroundColor: colors.background }]}
            >
                {/* 🏰 SECTION 1: HERO (3D LAYERED WITH PARALLAX) */}
                <View style={[styles.heroContainer, { backgroundColor: PRIMARY_COLOR + '15', ...DEEP_3D_SHADOW }]}>
                    <Image
                        source={heroImage}
                        style={[styles.heroImage, heroImageParallax]}
                        resizeMode="cover"
                    />

                    {/* 🌟 3D Layered Content */}
                    <View style={[styles.heroContent, { transform: [{ translateZ: 50 }] }]}>
                        <Text style={[styles.heroTextTitle, { color: VIBRANT_ACCENT }]}>Find Your <Text style={{ color: PRIMARY_COLOR }}>Magical</Text> Flatmates</Text>
                        <Text style={[styles.heroTextSubtitle, { color: colors.card }]}>Verified homes and magic matches await you on your grand adventure.</Text>
                        <TouchableOpacity
                            style={[styles.heroCTA, { backgroundColor: PRIMARY_COLOR, ...SUBTLE_SHADOW }]}
                            onPress={() => navigation.navigate('Signup')}
                        >
                            <Text style={[styles.heroCTAText, { color: VIBRANT_ACCENT }]}>Join the Kingdom</Text>
                        </TouchableOpacity>

                    </View>
                </View>


                {/* --- SECTION 2: EXPLORE CATEGORIES --- */}
                <View
                    style={[styles.sectionContainer, { marginTop: 80, paddingTop: 20 }]}
                    ref={categoryRef}
                    onLayout={() => measureSection('category', categoryRef)}
                >
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR }]}>🏰 Explore Property Categories</Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80' }]}>Find your perfect living space: Flats, PGs, Hostels, and Houses.</Text>

                    <View style={styles.categoryGrid}>
                        {propertyTypes.map((type, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setPropertyType(type)}
                                style={[
                                    styles.categoryCard,
                                    {
                                        // Active card gets the full vibrant background
                                        backgroundColor: propertyType === type ? PRIMARY_COLOR : colors.card,
                                        borderWidth: 1, // Retain border but hide on active for clean fill
                                        borderColor: propertyType === type ? PRIMARY_COLOR : colors.border,
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('category', index),
                                        ...styles.hoverScaleEffect,
                                    }
                                ]}
                            >
                                {/* Icon wrapper added for 3D look */}
                                <View style={[styles.iconWrapper, { backgroundColor: propertyType === type ? VIBRANT_ACCENT : PRIMARY_COLOR + '10' }]}>
                                    <Icon
                                        name={type === 'Flat' ? 'business-outline' : type === 'PG' ? 'bed-outline' : type === 'Hostel' ? 'school-outline' : 'home-outline'}
                                        size={30}
                                        color={propertyType === type ? PRIMARY_COLOR : PRIMARY_COLOR}
                                    />
                                </View>
                                <Text style={[styles.categoryTitle, { color: propertyType === type ? VIBRANT_ACCENT : colors.text, marginTop: 15 }]}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 🚀 SECTION 3: QUICK ACTIONS */}
                <View
                    style={[styles.sectionContainer, { marginTop: 80 }]}
                    ref={featureRef}
                    onLayout={() => measureSection('feature', featureRef)}
                >
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR }]}>⭐ Quick Actions</Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80' }]}>Your immediate path to finding or listing your perfect space.</Text>

                    <View style={styles.featureGrid}>
                        {featureCards.map((card, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.featureCard,
                                    {
                                        backgroundColor: colors.card,
                                        ...DEEP_3D_SHADOW,
                                        ...getAnimatedCardStyle('feature', index),
                                        ...styles.hoverScaleEffect,
                                    }
                                ]}
                            >
                                {/* Icon wrapper added */}
                                <View style={[styles.iconWrapper, { backgroundColor: card.color + '15' }]}>
                                    <Icon name={card.icon} size={30} color={card.color} />
                                </View>
                                <Text style={[styles.cardTitle, { color: colors.text, marginTop: 15 }]}>{card.title}</Text>
                                <Text style={[styles.cardSubtitle, { color: colors.text + '80' }]}>
                                    {card.title === "Post Property" ? "List your space in 2 magical steps!" : card.title === "Find Flatmate" ? "Discover your ideal living companion." : "See our featured, high-rated homes."}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* --- SECTION 4: HOW IT WORKS --- */}
                <View
                    style={[styles.sectionContainer, { marginTop: 100 }]}
                    ref={howItWorksRef}
                    onLayout={() => measureSection('howItWorks', howItWorksRef)}
                >
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR }]}>🪄 How It Works: Your Fairy Tale Journey</Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80' }]}>Find your perfect home in four simple steps.</Text>

                    <View style={styles.howItWorksGrid}>
                        {steps.map((step, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.howItWorksCard,
                                    {
                                        backgroundColor: colors.card,
                                        borderBottomColor: PRIMARY_COLOR,
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('howItWorks', index),
                                        ...styles.hoverScaleEffect,
                                    }
                                ]}
                            >
                                {/* Step Circle is now more of a Badge */}
                                <View style={[styles.stepNumberCircle, { backgroundColor: PRIMARY_COLOR, ...SUBTLE_SHADOW }]}>
                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                </View>

                                {/* Icon is used as an accent element */}
                                <Icon name={step.icon} size={30} color={VIBRANT_ACCENT} style={styles.stepIconAccent} />

                                <Text style={[styles.stepTitle, { color: colors.text }]}>{step.title}</Text>
                                <Text style={[styles.stepSubtitle, { color: colors.text + '80' }]}>{step.subtitle}</Text>

                            </View>
                        ))}
                    </View>
                </View>

                {/* --- SECTION 5: VALUE PROPOSITIONS --- */}
                <View
                    style={[styles.sectionContainer, { marginTop: 100 }]}
                    ref={valueRef}
                    onLayout={() => measureSection('value', valueRef)}
                >
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR }]}>🌟 The FlatMates Advantage</Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80' }]}>Where technology meets comfort and magic is just around the corner.</Text>

                    <View style={styles.valuePropsGrid}>
                        {valueProps.map((prop, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.valuePropCard,
                                    {
                                        backgroundColor: colors.card,
                                        borderLeftColor: PRIMARY_COLOR,
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('value', index),
                                        ...styles.hoverScaleEffect,
                                    }
                                ]}
                            >
                                <View style={[styles.iconWrapper, { backgroundColor: PRIMARY_COLOR + '10' }]}>
                                    <Icon name={prop.icon} size={30} color={PRIMARY_COLOR} />
                                </View>
                                <Text style={[styles.valuePropTitle, { color: colors.text }]}>{prop.title}</Text>
                                <Text style={[styles.valuePropSubtitle, { color: colors.text + '80' }]}>{prop.subtitle}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 🏡 SECTION 6: COMMUNITY VIBE */}
                <View
                    style={[styles.sectionContainer, { marginTop: 100, backgroundColor: PRIMARY_COLOR + '05', paddingVertical: 60, borderRadius: GENEROUS_RADIUS * 2 }]}
                    ref={communityRef}
                    onLayout={() => measureSection('community', communityRef)}
                >
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR }]}>💖 Our Community Vibe</Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80' }]}>More than just a place to live, it's a supportive community.</Text>

                    <View style={styles.communityGrid}>
                        {communityVibes.map((vibe, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.communityCard,
                                    {
                                        backgroundColor: colors.card,
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('community', index),
                                        ...styles.hoverScaleEffect,
                                    }
                                ]}
                            >
                                <View style={[styles.iconWrapper, { backgroundColor: VIBRANT_ACCENT + '15' }]}>
                                    <Icon name={vibe.icon} size={30} color={VIBRANT_ACCENT} />
                                </View>
                                <Text style={[styles.communityTitle, { color: colors.text }]}>{vibe.title}</Text>
                                <Text style={[styles.communitySubtitle, { color: colors.text + '80' }]}>{vibe.subtitle}</Text>
                            </View>
                        ))}
                    </View>
                </View>


                {/* 💬 SECTION 7: USER TESTIMONIALS (ENHANCED CHAT BUBBLES + TYPING ANIMATION) */}
                <View
                    style={[styles.sectionContainer, { marginTop: 100, backgroundColor: colors.background }]}
                    ref={testimonialRef}
                    onLayout={() => measureSection('testimonial', testimonialRef)}
                >
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR }]}>💬 Hear From Our Happy Renters</Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80', marginBottom: 40 }]}>Real stories from the community in a chat view.</Text>

                    <View style={styles.testimonialGrid}>
                        {initialTestimonials.map((testimonial, index) => {
                            const isLeft = index % 2 === 0;
                            const bubbleColor = isLeft ? colors.card : PRIMARY_COLOR + '08'; // Slightly primary background for right bubble
                            const tailColor = isLeft ? colors.card : PRIMARY_COLOR + '08';
                            const topBorderColor = isLeft ? PRIMARY_COLOR : VIBRANT_ACCENT; // Different border for sent/received
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
                                            borderTopColor: topBorderColor,
                                            alignSelf: isLeft ? 'flex-start' : 'flex-end',
                                            borderBottomRightRadius: isLeft ? 5 : 20,
                                            borderTopLeftRadius: isLeft ? 20 : 5,
                                            borderTopRightRadius: isLeft ? 20 : 20,
                                            borderBottomLeftRadius: isLeft ? 20 : 5,
                                            ...SUBTLE_SHADOW,
                                            ...getAnimatedCardStyle('testimonial', index),
                                        }
                                    ]}
                                >
                                    {/* 🌟 CHAT BUBBLE TAIL (Left) */}
                                    {isLeft && (
                                        <View style={[styles.chatTail, styles.chatTailLeft, { borderRightColor: tailColor }]} />
                                    )}

                                    {/* 🌟 TYPING INDICATOR / QUOTE */}
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

                                    <View style={[
                                        styles.testimonialFooter,
                                        {
                                            alignItems: isLeft ? 'flex-start' : 'flex-end',
                                            opacity: isTyping ? 0 : 1,
                                            transition: 'opacity 0.3s ease',
                                        }
                                    ]}>
                                        <Text style={[styles.testimonialName, { color: nameColor }]}>{testimonial.name}</Text>
                                        <Text style={[styles.testimonialLocation, { color: colors.text + '80' }]}>
                                            <Icon name="location" size={12} /> {testimonial.location}
                                        </Text>
                                    </View>

                                    {/* 🌟 CHAT BUBBLE TAIL (Right) */}
                                    {!isLeft && (
                                        <View style={[styles.chatTail, styles.chatTailRight, { borderLeftColor: tailColor }]} />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* 🏘️ SECTION 8: FEATURED NEIGHBORHOODS */}
                <View
                    style={[styles.sectionContainer, { marginTop: 100, backgroundColor: colors.background }]}
                    ref={neighborhoodsRef}
                    onLayout={() => measureSection('neighborhoods', neighborhoodsRef)}
                >
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR }]}>🗺️ Featured Neighborhoods</Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80', marginBottom: 40 }]}>Discover the most magical and sought-after localities.</Text>

                    <View style={styles.neighborhoodGrid}>
                        {neighborhoods.map((n, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.neighborhoodCard,
                                    {
                                        backgroundColor: colors.card,
                                        borderRightColor: PRIMARY_COLOR,
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('neighborhoods', index),
                                        ...styles.hoverScaleEffect,
                                    }
                                ]}
                            >
                                <View style={[styles.iconWrapper, { backgroundColor: SECONDARY_ACCENT + '15', marginBottom: 15 }]}>
                                    <Icon name={n.icon} size={30} color={SECONDARY_ACCENT} />
                                </View>
                                <Text style={[styles.neighborhoodTitle, { color: colors.text }]}>{n.name}</Text>
                                <Text style={[styles.neighborhoodSubtitle, { color: VIBRANT_ACCENT }]}>{n.vibe}</Text>
                                <View style={styles.ratingRow}>
                                    <Icon name="star" size={16} color={VIBRANT_ACCENT} />
                                    <Text style={[styles.ratingText, { color: colors.text + '90' }]}>{n.rating}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>


                {/* 🚀 SECTION 9: FUTURE PREVIEWS */}
                <View
                    style={[styles.sectionContainer, { marginTop: 100, marginBottom: 40, backgroundColor: colors.background }]}
                    ref={previewRef}
                    onLayout={() => measureSection('preview', previewRef)}
                >
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR }]}>🔮 Sneak Peek: Future Features</Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80' }]}>Building the future of shared living, one magical feature at a time.</Text>

                    <View style={styles.previewGrid}>
                        {featurePreviews.map((preview, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.previewCard,
                                    {
                                        backgroundColor: colors.card,
                                        borderBottomColor: PRIMARY_COLOR,
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('preview', index),
                                        ...styles.hoverScaleEffect,
                                    }
                                ]}
                            >
                                <View style={[styles.iconWrapper, { backgroundColor: VIBRANT_ACCENT + '15' }]}>
                                    <Icon name={preview.icon} size={30} color={VIBRANT_ACCENT} />
                                </View>
                                <Text style={[styles.previewTitle, { color: colors.text }]}>{preview.title}</Text>
                                <Text style={[styles.previewSubtitle, { color: colors.text + '80' }]}>{preview.subtitle}</Text>
                            </View>
                        ))}
                    </View>
                </View>


                {/* 🦶 BEAUTIFUL FOOTER SECTION */}
                <Footer />


            </ScrollView>
        </SafeAreaView>
    );
};


// --- WEB-SPECIFIC STYLES ---
const styles = StyleSheet.create({
    scrollContentWeb: {
        flexGrow: 0,
        alignSelf: 'center',
        paddingHorizontal: HORIZONTAL_MARGIN,
        paddingTop: 0,
        paddingBottom: 0,
        width: '100%',
        transformPerspective: 1000,
    },

    // 🌟 HOVER EFFECT MIXIN (For all interactive cards)
    hoverScaleEffect: {
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        ':hover': {
            transform: [{ scale: 1.05 }, { rotate: '0deg' }],
            boxShadow: `0 20px 40px 0px rgba(16, 42, 67, 0.45)`,
        },
    },

    // Global Section Styles
    sectionContainer: {
        width: '100%',
        maxWidth: MAX_WEB_WIDTH,
        alignSelf: 'center',
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: width > BREAKPOINT ? 42 : 32, // Larger Font
        fontWeight: '900', // Extremely bold
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.5, // Added for hero look
    },
    sectionSubtitle: {
        fontSize: width > BREAKPOINT ? 20 : 16,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 40, // Increased margin
    },

    // 👑 HEADER BAR STYLE (CENTERED FIX)
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: width > BREAKPOINT ? 20 : 15,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: GENEROUS_RADIUS,
        marginHorizontal: '1%',
        marginTop: 15,
        marginBottom: 15,
        zIndex: 10,
        alignSelf: 'center',
        width: MAX_WEB_WIDTH,
    },

headerLogoContainer: { // Added: Container for icon and title
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLogo: { // Added: Icon image style
        height: 40,
        width: 40, 
        marginRight: 10,
    },
    
    // 👑 ENHANCED HEADER TITLE STYLE
    headerTitle: {
        fontSize: width > BREAKPOINT ? 28 : 22,
        fontWeight: '900', // Made extra bold
        letterSpacing: 0.5, // Added spacing
    },
    loginButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        ':hover': {
            transform: [{ scale: 1.2 }, { rotate: '5deg' }],
            boxShadow: `0 0 15px ${VIBRANT_ACCENT}`,
        },
    },

    // 🏰 --- HERO SECTION STYLES (Parallax) ---
    heroContainer: {
        position: 'relative',
        width: '100%',
        height: width > BREAKPOINT ? '65vh' : '55vh', // Increased height
        marginTop: width > BREAKPOINT ? 10 + 5 : 5 + 5,
        overflow: 'hidden',
        borderRadius: GENEROUS_RADIUS * 2,
        zIndex: 5,
        alignSelf: 'center',
        maxWidth: MAX_WEB_WIDTH,
    },
    heroImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.2, // Reduced opacity for better text readability
    },
    heroContent: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: 'rgba(0,0,0,0.7)', // Darker overlay for contrast
    },
    heroTextTitle: {
        fontSize: width > BREAKPOINT ? 68 : 45, // Much larger
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 15,
        textShadow: '3px 3px 10px rgba(0,0,0,1)', // Stronger shadow
        letterSpacing: 1.5, // Added
    },
    heroTextSubtitle: {
        fontSize: width > BREAKPOINT ? 24 : 18,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 40, // Increased margin
        textShadow: '1px 1px 4px rgba(0,0,0,1)',
    },
    heroCTA: {
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 50,
        transition: 'all 0.3s ease',
        ':hover': {
            transform: [{ scale: 1.05 }],
        },
    },
    heroCTAText: {
        fontSize: 22,
        fontWeight: '900',
    },

    // 🌟 REUSABLE ICON WRAPPER STYLE
    iconWrapper: {
        padding: 15,
        borderRadius: 15, // Square/Rounded box for icons
        marginBottom: 5,
        ...SUBTLE_SHADOW,
    },


    // --- Explore Categories Styles ---
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    categoryCard: {
        width: width > BREAKPOINT ? '23%' : '48%',
        padding: 25,
        borderRadius: GENEROUS_RADIUS,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
    },
    categoryTitle: {
        fontSize: 20, // Slightly larger
        fontWeight: '900', // Very bold
    },

    // --- Feature Grid Styles ---
    featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: width > BREAKPOINT ? 'space-between' : 'center',
        paddingVertical: 10,
    },
    featureCard: {
        width: width > BREAKPOINT ? '30%' : '90%',
        padding: 30,
        borderRadius: GENEROUS_RADIUS,
        alignItems: 'center',
        marginBottom: 30,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '900', // Very bold
        marginBottom: 8,
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },

    // --- How It Works Styles ---
    howItWorksGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    howItWorksCard: {
        width: width > BREAKPOINT ? '23%' : '48%',
        padding: 25,
        paddingTop: 45,
        borderRadius: BUTTON_RADIUS,
        marginBottom: 30, // Increased spacing
        borderBottomWidth: 4,
        alignItems: 'flex-start',
        position: 'relative',
        borderBottomColor: PRIMARY_COLOR, // Border color set to Primary
    },
    stepNumberCircle: {
        width: 50, // Larger circle
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -25, // Centered vertically on the border
        left: '50%',
        marginLeft: -25,
    },
    stepNumberText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 20, // Larger number
    },
    stepIconAccent: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    stepTitle: {
        fontSize: 20, // Larger
        fontWeight: '900', // Very bold
        marginBottom: 5,
        marginTop: 15,
    },
    stepSubtitle: {
        fontSize: 16, // Larger subtitle
        textAlign: 'left',
    },

    // --- Value Proposition Styles ---
    valuePropsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    valuePropCard: {
        width: width > BREAKPOINT ? '23%' : '48%',
        padding: 20,
        borderRadius: BUTTON_RADIUS,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: PRIMARY_COLOR,
        alignItems: 'flex-start',
    },
    valuePropTitle: {
        fontSize: 20, // Larger
        fontWeight: '900', // Very bold
        marginBottom: 5,
        marginTop: 15,
    },
    valuePropSubtitle: {
        fontSize: 16, // Larger subtitle
        textAlign: 'left',
    },

    // --- Community Vibe Styles ---
    communityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    communityCard: {
        width: width > BREAKPOINT ? '23%' : '48%',
        padding: 25,
        borderRadius: GENEROUS_RADIUS,
        alignItems: 'center',
        marginBottom: 20,
    },
    communityTitle: {
        fontSize: 22, // Larger
        fontWeight: '900', // Very bold
        marginBottom: 5,
        textAlign: 'center',
        marginTop: 15,
    },
    communitySubtitle: {
        fontSize: 16,
        textAlign: 'center',
    },

    // 💬 --- TESTIMONIAL STYLES (Chat Bubbles + Typing) ---
    testimonialGrid: {
        flexDirection: 'column',
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    testimonialCard: {
        maxWidth: 600, // Wider card
        width: width > BREAKPOINT ? '50%' : '90%',
        padding: 30, // Increased padding
        borderRadius: 20,
        marginBottom: 25,
        borderTopWidth: 5, // Top border for highlight
        position: 'relative',
    },
    chatTail: {
        position: 'absolute',
        top: 25,
        width: 0,
        height: 0,
        borderTopWidth: 10,
        borderBottomWidth: 10,
        borderStyle: 'solid',
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    chatTailLeft: {
        left: -20,
        borderRightWidth: 20,
        borderLeftWidth: 0,
    },
    chatTailRight: {
        right: -20,
        borderLeftWidth: 20,
        borderRightWidth: 0,
    },
    testimonialQuote: {
        fontSize: 18, // Larger quote font
        fontStyle: 'italic',
        lineHeight: 28,
        marginBottom: 15,
        width: '100%',
    },
    testimonialFooter: {
        width: '100%',
    },
    testimonialName: {
        fontSize: 18, // Larger
        fontWeight: '900',
        marginBottom: 3,
        letterSpacing: 0.5,
    },
    testimonialLocation: {
        fontSize: 14,
    },

    // 🌟 TYPING ANIMATION STYLES
    typingText: {
        fontSize: 18,
        fontStyle: 'italic',
        lineHeight: 28,
        marginBottom: 15,
        minHeight: 28,
        width: '100%',
    },
    blinkingCursor: {
        fontWeight: 'bold',
        marginLeft: 2,
        animationKeyframes: {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0 },
        },
        animationDuration: '0.8s',
        animationIterationCount: 'infinite',
    },
    // 💬 --- END CHAT BUBBLES ---

    // --- Neighborhood Styles ---
    neighborhoodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingVertical: 20,
    },
    neighborhoodCard: {
        width: width > BREAKPOINT ? '23%' : '48%',
        padding: 25,
        borderRadius: BUTTON_RADIUS,
        marginBottom: 25,
        borderRightWidth: 4,
        borderRightColor: PRIMARY_COLOR,
        alignItems: 'center',
        textAlign: 'center',
    },
    neighborhoodTitle: {
        fontSize: 22, // Larger
        fontWeight: '900', // Very bold
        marginBottom: 3,
        textAlign: 'center',
    },
    neighborhoodSubtitle: {
        fontSize: 16, // Larger
        fontWeight: '600',
        marginBottom: 10,
        textAlign: 'center',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    ratingText: {
        marginLeft: 8,
        fontSize: 18, // Larger
        fontWeight: '900',
    },

    // --- Feature Preview Styles ---
    previewGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingVertical: 20,
    },
    previewCard: {
        width: width > BREAKPOINT ? '30%' : '90%',
        padding: 25,
        borderRadius: BUTTON_RADIUS,
        marginBottom: 25,
        borderBottomWidth: 5,
        borderBottomColor: VIBRANT_ACCENT, // Changed border color for contrast
        alignItems: 'center',
        textAlign: 'center',
    },
    previewTitle: {
        fontSize: 22, // Larger
        fontWeight: '900', // Very bold
        marginBottom: 5,
        textAlign: 'center',
        marginTop: 15,
    },
    previewSubtitle: {
        fontSize: 16,
        textAlign: 'center',
    },


    // 🦶 BEAUTIFUL FOOTER STYLES
    footerContainer: {
        paddingVertical: 50,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        marginTop: 60, // More space before footer
        alignSelf: 'stretch',
    },
    footerContent: {
        flexDirection: width > BREAKPOINT ? 'row' : 'column',
        justifyContent: 'space-between',
        maxWidth: MAX_WEB_WIDTH,
        alignSelf: 'center',
        width: '100%',
        marginBottom: 40,
    },
    footerSection: {
        width: width > BREAKPOINT ? '22%' : '100%',
        marginBottom: width > BREAKPOINT ? 0 : 30,
    },

    // 👑 FOOTER LOGO STYLES
    footerLogo: {
        height: 50,
        width: 250, // Adjusted width for better fit in the section
        marginBottom: 10,
        resizeMode: 'contain',
    },

    footerSubtitle: {
        fontSize: 16,
        marginBottom: 20,
        lineHeight: 24,
    },
    footerHeading: {
        fontSize: 20,
        fontWeight: '900', // Very bold
        marginBottom: 15,
        borderBottomWidth: 3, // Thicker underline
        borderBottomColor: VIBRANT_ACCENT, // Accent underline
        paddingBottom: 5,
        width: 'fit-content',
    },
    footerLink: {
        fontSize: 16,
        marginBottom: 8,
        transition: 'color 0.2s',
        ':hover': {
            color: PRIMARY_COLOR,
            textDecorationLine: 'underline',
            cursor: 'pointer',
        },
    },
    socialIcons: {
        flexDirection: 'row',
        marginTop: 10,
    },
    socialIcon: {
        marginRight: 15,
        transition: 'transform 0.2s',
        ':hover': {
            transform: [{ scale: 1.2 }],
        },
    },
    footerDivider: {
        height: 1,
        maxWidth: MAX_WEB_WIDTH,
        alignSelf: 'center',
        width: '100%',
        marginBottom: 20,
    },
    footerCopyright: {
        fontSize: 14,
        textAlign: 'center',
    },
});

export default LandingScreen;