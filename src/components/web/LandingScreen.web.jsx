// src/screens/LandingScreen.web.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    SafeAreaView, ScrollView, View, Text, Dimensions, TouchableOpacity, StyleSheet, Platform, Image
} from 'react-native'; 
import { useTheme } from '../../theme/theme.js'; 
import Icon from 'react-native-vector-icons/Ionicons'; 

// NOTE: Ensure this image path is correct, or use a placeholder URL
const heroImage = require('../../../assets/hero_slide1.png'); 

const { width, height } = Dimensions.get('window');
const BREAKPOINT = 768;
const MAX_WEB_WIDTH = '98vw'; // Fixed maximum width for better centering control
const HORIZONTAL_MARGIN = 15; // Margin to keep it off the edge

// -----------------------------------------------------------------
// 🎨 ENHANCED MAGICAL 3D STYLES & CONSTANTS
// -----------------------------------------------------------------
const BASE_SHADOW_COLOR = '#606264ff'; 
const VIBRANT_ACCENT = '#e9e5ffff'; // Gold/Yellow
const PRIMARY_COLOR = '#4682B4'; 

const DEEP_3D_SHADOW = {
    boxShadow: `0 40px 80px 0px rgba(16, 42, 67, 0.1), 0 0 25px 0px ${VIBRANT_ACCENT}40`, 
    shadowColor: BASE_SHADOW_COLOR, 
    shadowOffset: { width: 0, height: 40 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 80, 
    elevation: 40,
};

const SUBTLE_SHADOW = { 
    boxShadow: `0 8px 15px 0px rgba(16, 42, 67, 0.25)`, 
    shadowColor: BASE_SHADOW_COLOR, 
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
}
const GENEROUS_RADIUS = 30;
const BUTTON_RADIUS = 20; 

const FLOATING_HEADER_STYLE = {
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
    { title: "Post Property", icon: "home", color: "#FF6347" },
    { title: "Find Flatmate", icon: "people", color: "#4682B4" },
    { title: "Browse Listings", icon: "search", color: "#3CB371" },
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
    // 🪄 CHAT TYPING EFFECT
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
    // 🪄 CUSTOM SCROLL & PARALLAX LOGIC
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
    // 🎨 RENDER HELPER FOR ANIMATED CARDS
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
        <View style={[styles.footerContainer, { backgroundColor: colors.background + 'e0', borderTopColor: colors.border }]}>
            <View style={styles.footerContent}>
                
                {/* 1. Branding and Social */}
                <View style={styles.footerSection}>
                    <Text style={[styles.footerTitle, { color: colors.primary }]}>Find Your FlatMates</Text>
                    <Text style={[styles.footerSubtitle, { color: colors.text + '80' }]}>
                        Find your next home and companion. Where magic meets matching.
                    </Text>
                    <View style={styles.socialIcons}>
                        <Icon name="logo-facebook" size={24} color={PRIMARY_COLOR} style={styles.socialIcon} />
                        <Icon name="logo-instagram" size={24} color={PRIMARY_COLOR} style={styles.socialIcon} />
                        <Icon name="logo-linkedin" size={24} color={PRIMARY_COLOR} style={styles.socialIcon} />
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
                        ...DEEP_3D_SHADOW, 
                        ...FLOATING_HEADER_STYLE,
                    }
                ]}
            >
                <Text style={[styles.headerTitle, { color: colors.primary }]}>Find Your FlatMates</Text>
                <TouchableOpacity
                    style={[styles.loginButton, { backgroundColor: colors.primary , ...SUBTLE_SHADOW }]}
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
                <View style={[styles.heroContainer, { backgroundColor: colors.primary + '15', ...DEEP_3D_SHADOW }]}> 
                    <Image 
                        source={heroImage} 
                        style={[styles.heroImage, heroImageParallax]} 
                        resizeMode="cover" 
                    />
                    
                    {/* 🌟 3D Layered Content */}
                    <View style={[styles.heroContent, { transform: [{ translateZ: 50 }] }]}>
                        <Text style={[styles.heroTextTitle, { color: colors.primary }]}>Find Your Flatmate</Text>
                        <Text style={[styles.heroTextSubtitle, { color: colors.card }]}>Verified homes and magic matches await you.</Text>
                     
                    </View>
                </View>
          

                {/* --- SECTION 2: EXPLORE CATEGORIES --- (RESTORED) */}
                <View 
                    style={[styles.sectionContainer, { marginTop: 40, paddingTop: 20 }]}
                    ref={categoryRef} 
                    onLayout={() => measureSection('category', categoryRef)}
                > 
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>🏰 Explore Property Categories</Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80' }]}>Find your perfect living space: Flats, PGs, Hostels, and Houses.</Text>
                    
                    <View style={styles.categoryGrid}> 
                        {propertyTypes.map((type, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setPropertyType(type)}
                                style={[
                                    styles.categoryCard,
                                    { 
                                        backgroundColor: colors.card,
                                        borderWidth: propertyType === type ? 3 : 1, 
                                        borderColor: propertyType === type ? VIBRANT_ACCENT : colors.border,
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('category', index), 
                                        ...styles.hoverScaleEffect, 
                                    }
                                ]}
                            >
                                <Icon 
                                    name={type === 'Flat' ? 'apartment' : type === 'PG' ? 'bed' : type === 'Hostel' ? 'business' : 'home'} 
                                    size={40} 
                                    color={propertyType === type ? VIBRANT_ACCENT : colors.primary} 
                                    style={{ marginBottom: 10 }}
                                />
                                <Text style={[styles.categoryTitle, { color: colors.text }]}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 🚀 SECTION 3: QUICK ACTIONS (RESTORED) */}
                <View 
                    style={[styles.sectionContainer, { marginTop: 60 }]}
                    ref={featureRef} 
                    onLayout={() => measureSection('feature', featureRef)}
                >
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>⭐ Quick Actions</Text>
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
                                <Icon name={card.icon} size={48} color={card.color} style={styles.cardIcon} />
                                <Text style={[styles.cardTitle, { color: colors.text }]}>{card.title}</Text>
                                <Text style={[styles.cardSubtitle, { color: colors.text + '80' }]}>
                                    {card.title === "Post Property" ? "List your space in 2 magical steps!" : card.title === "Find Flatmate" ? "Discover your ideal living companion." : "See our featured, high-rated homes."}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* --- SECTION 4: HOW IT WORKS (RESTORED) --- */}
                <View 
                    style={[styles.sectionContainer, { marginTop: 80 }]}
                    ref={howItWorksRef} 
                    onLayout={() => measureSection('howItWorks', howItWorksRef)}
                >
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>🪄 How It Works: Your Fairy Tale Journey</Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80' }]}>Find your perfect home in four simple steps.</Text>
                    
                    <View style={styles.howItWorksGrid}> 
                        {steps.map((step, index) => (
                            <View 
                                key={index} 
                                style={[
                                    styles.howItWorksCard, 
                                    { 
                                        backgroundColor: colors.card, 
                                        borderColor: VIBRANT_ACCENT, 
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('howItWorks', index),
                                        ...styles.hoverScaleEffect, 
                                    }
                                ]}
                            >
                                <View style={[styles.stepNumberCircle, { backgroundColor: colors.primary }]}>
                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                </View>
                                <Text style={[styles.stepTitle, { color: colors.text }]}>{step.title}</Text>
                                <Text style={[styles.stepSubtitle, { color: colors.text + '80' }]}>{step.subtitle}</Text>
                                <Icon name={step.icon} size={30} color={VIBRANT_ACCENT} style={{ position: 'absolute', top: 20, right: 20 }} />
                            </View>
                        ))}
                    </View>
                </View>
                
                {/* --- SECTION 5: VALUE PROPOSITIONS (RESTORED) --- */}
                <View 
                    style={[styles.sectionContainer, { marginTop: 80 }]}
                    ref={valueRef} 
                    onLayout={() => measureSection('value', valueRef)}
                >
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>🌟 Find Your FlatMates</Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80' }]}>Where technology meets comfort and magic is just around the corner.</Text>
                    
                    <View style={styles.valuePropsGrid}> 
                        {valueProps.map((prop, index) => (
                            <View 
                                key={index} 
                                style={[
                                    styles.valuePropCard, 
                                    { 
                                        backgroundColor: colors.background, 
                                        borderColor: colors.border, 
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('value', index),
                                        ...styles.hoverScaleEffect, 
                                    }
                                ]}
                            >
                                <Icon name={prop.icon} size={35} color={VIBRANT_ACCENT} style={{ marginBottom: 10 }} />
                                <Text style={[styles.valuePropTitle, { color: colors.text }]}>{prop.title}</Text>
                                <Text style={[styles.valuePropSubtitle, { color: colors.text + '80' }]}>{prop.subtitle}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                
                {/* 🏡 SECTION 6: COMMUNITY VIBE (RESTORED) */}
                <View 
                    style={[styles.sectionContainer, { marginTop: 80, backgroundColor: colors.primary + '05', paddingVertical: 40, borderRadius: GENEROUS_RADIUS }]}
                    ref={communityRef} 
                    onLayout={() => measureSection('community', communityRef)}
                >
                    <Text style={[styles.sectionTitle, { color: colors.primary}]}>💖 Our Community Vibe</Text>
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
                                <Icon name={vibe.icon} size={40} color={VIBRANT_ACCENT} style={{ marginBottom: 10 }} />
                                <Text style={[styles.communityTitle, { color: colors.text }]}>{vibe.title}</Text>
                                <Text style={[styles.communitySubtitle, { color: colors.text + '80' }]}>{vibe.subtitle}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                
                {/* 💬 SECTION 7: USER TESTIMONIALS (ENHANCED CHAT BUBBLES + TYPING ANIMATION) */}
                <View 
                    style={[styles.sectionContainer, { marginTop: 80, backgroundColor: colors.background }]}
                    ref={testimonialRef} 
                    onLayout={() => measureSection('testimonial', testimonialRef)}
                >
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>💬 Hear From Our Happy Renters</Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80', marginBottom: 40 }]}>Real stories from the community in a chat view.</Text>
                    
                    <View style={styles.testimonialGrid}> 
                        {initialTestimonials.map((testimonial, index) => {
                            const isLeft = index % 2 === 0;
                            const bubbleColor = isLeft ? colors.card : colors.primary + '08';
                            const tailColor = isLeft ? colors.card : colors.primary + '08';
                            const topBorderColor = isLeft ? colors.primary : VIBRANT_ACCENT;
                            
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
                                        <Text style={[styles.testimonialName, { color: colors.primary }]}>{testimonial.name}</Text>
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
                
                {/* 🏘️ SECTION 8: FEATURED NEIGHBORHOODS (RESTORED) */}
                <View 
                    style={[styles.sectionContainer, { marginTop: 80, backgroundColor: colors.background }]}
                    ref={neighborhoodsRef} 
                    onLayout={() => measureSection('neighborhoods', neighborhoodsRef)}
                >
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>🗺️ Featured Neighborhoods</Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80', marginBottom: 40 }]}>Discover the most magical and sought-after localities.</Text>
                    
                    <View style={styles.neighborhoodGrid}> 
                        {neighborhoods.map((n, index) => (
                            <View 
                                key={index} 
                                style={[
                                    styles.neighborhoodCard, 
                                    { 
                                        backgroundColor: colors.card, 
                                        borderColor: VIBRANT_ACCENT, 
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('neighborhoods', index),
                                        ...styles.hoverScaleEffect, 
                                    }
                                ]}
                            >
                                <Icon name={n.icon} size={30} color={colors.primary} style={{ marginBottom: 10 }} />
                                <Text style={[styles.neighborhoodTitle, { color: colors.text }]}>{n.name}</Text>
                                <Text style={[styles.neighborhoodSubtitle, { color: VIBRANT_ACCENT }]}>{n.vibe}</Text>
                                <View style={styles.ratingRow}>
                                    <Icon name="star" size={14} color={VIBRANT_ACCENT} />
                                    <Text style={[styles.ratingText, { color: colors.text + '90' }]}>{n.rating}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>


                {/* 🚀 SECTION 9: FUTURE PREVIEWS (RESTORED) */}
                <View 
                    style={[styles.sectionContainer, { marginTop: 80, marginBottom: 40, backgroundColor: colors.background }]}
                    ref={previewRef} 
                    onLayout={() => measureSection('preview', previewRef)}
                >
                    <Text style={[styles.sectionTitle, { color: colors.primary}]}>🔮 Sneak Peek: Future Features</Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80' }]}>Building the future of shared living, one magical feature at a time.</Text>
                    
                    <View style={styles.previewGrid}> 
                        {featurePreviews.map((preview, index) => (
                            <View 
                                key={index} 
                                style={[
                                    styles.previewCard, 
                                    { 
                                        backgroundColor: colors.background, 
                                        borderColor: VIBRANT_ACCENT, 
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('preview', index),
                                        ...styles.hoverScaleEffect, 
                                    }
                                ]}
                            >
                                <Icon name={preview.icon} size={35} color={colors.primary} style={{ marginBottom: 10 }} />
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
        fontSize: width > BREAKPOINT ? 38 : 28,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: width > BREAKPOINT ? 20 : 16,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 30,
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
    
    // 👑 HEADER TITLE STYLE
    headerTitle: {
        fontSize: width > BREAKPOINT ? 28 : 22,
        fontWeight: '900',
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
        height: width > BREAKPOINT ? '60vh' : '55vh',
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
        opacity: 0.3, 
    },
    heroContent: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: 'rgba(0,0,0,0.4)', 
    },
    heroTextTitle: {
        fontSize: width > BREAKPOINT ? 60 : 40,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 15,
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
    },
    heroTextSubtitle: {
        fontSize: width > BREAKPOINT ? 24 : 18,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 30,
        textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
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
        fontSize: 18,
        fontWeight: '700',
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
    cardIcon: {
        marginBottom: 15,
        textShadowColor: 'rgba(0,0,0,0.15)',
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 6,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
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
        marginBottom: 20,
        borderBottomWidth: 4,
        alignItems: 'flex-start',
        position: 'relative',
    },
    stepNumberCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -20,
        left: '50%',
        marginLeft: -20, 
    },
    stepNumberText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 18,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 5,
        marginTop: 10,
    },
    stepSubtitle: {
        fontSize: 14,
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
        borderLeftColor: VIBRANT_ACCENT,
        alignItems: 'flex-start',
    },
    valuePropTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 5,
    },
    valuePropSubtitle: {
        fontSize: 14,
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
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 5,
        textAlign: 'center',
    },
    communitySubtitle: {
        fontSize: 14,
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
        maxWidth: 550, 
        width: width > BREAKPOINT ? '40%' : '90%',
        padding: 25, 
        borderRadius: 20, 
        marginBottom: 25,
        borderTopWidth: 5, 
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
        fontSize: 16,
        fontStyle: 'italic',
        lineHeight: 24,
        marginBottom: 15,
        width: '100%', 
    },
    testimonialFooter: {
        width: '100%', 
    },
    testimonialName: {
        fontSize: 16, 
        fontWeight: '900',
        marginBottom: 3,
    },
    testimonialLocation: {
        fontSize: 12, 
    },
    
    // 🌟 TYPING ANIMATION STYLES
    typingText: {
        fontSize: 16,
        fontStyle: 'italic',
        lineHeight: 24,
        marginBottom: 15,
        minHeight: 24, // Prevent layout shift
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
        borderRightColor: VIBRANT_ACCENT,
        alignItems: 'center',
        textAlign: 'center',
    },
    neighborhoodTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 3,
        textAlign: 'center',
    },
    neighborhoodSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
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
        borderBottomColor: VIBRANT_ACCENT,
        alignItems: 'center',
        textAlign: 'center',
    },
    previewTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 5,
        textAlign: 'center',
    },
    previewSubtitle: {
        fontSize: 14,
        textAlign: 'center',
    },



    
    // 🦶 BEAUTIFUL FOOTER STYLES
    footerContainer: {
        paddingVertical: 50,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        marginTop: 40,
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
    footerTitle: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 10,
    },
    footerSubtitle: {
        fontSize: 14,
        marginBottom: 20,
        lineHeight: 22,
    },
    footerHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: VIBRANT_ACCENT + '60',
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