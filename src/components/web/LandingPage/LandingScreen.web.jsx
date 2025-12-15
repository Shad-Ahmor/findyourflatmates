// src/screens/LandingScreen.web.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    SafeAreaView, ScrollView, View, Text, Dimensions, TouchableOpacity, StyleSheet, Platform, Image
} from 'react-native';
import { useTheme } from '../../../theme/theme.js';
import Icon from 'react-native-vector-icons/Ionicons';
// 🌟 NEW IMPORT: LandingScreenFooter
import LandingScreenFooter from './LandingScreenFooter.web.jsx'; 
// 🛑 NEW IMPORT: HeroSection Component (मान लें कि यह ../components/web में है)
import HeroSection from './HeroSection.web.jsx'; 
// 🛑 NEW IMPORT: HeroHeader Component (Now holds the entire sticky header bar)
import HeroHeader from './ HeroHeader.web.jsx'; // <--- UPDATED IMPORT

// NOTE: Ensure this image path is correct, or use a placeholder URL
import heroImage from '../../../../assets/hero_slide1.png';;
// 🌟 NEW LOGO IMPORT
import appLogo  from '../../../../assets/findyourflatmates.png';

const { width, height } = Dimensions.get('window'); // Keeping this for static styles that reference width (e.g. hero, header)
const BREAKPOINT = 768;
const MAX_WEB_WIDTH = '98vw'; // Fixed maximum width for better centering control
const HORIZONTAL_MARGIN = 15; // Margin to keep it off the edge

// -----------------------------------------------------------------
// 🎨 ENHANCED MAGICAL 3D STYLES & CONSTANTS 
// NOTE: Global constants को यहीं रखा जाता है क्योंकि उनका उपयोग पूरे कंपोनेंट में होता है।
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

// --- ALL DATA ARRAYS RESTORED (Used in sections 2-10) ---
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
const whyChooseUsData = [
    { 
        icon: "cash-outline", 
        title: "Zero Commission Model", 
        subtitle: "Unlike high-cost competitors, we charge no brokerage fee. Save money and move freely!" 
    },
    { 
        icon: "heart-circle-outline", 
        title: "Community-First Focus", 
        subtitle: "We prioritize finding the *right* flatmate match based on vibe, not just the property." 
    },
    { 
        icon: "ribbon-outline", 
        title: "Rewarded Engagement (Points)", 
        subtitle: "Earn exclusive points for activity, which unlocks premium features and direct connections." 
    },
    { 
        icon: "people-outline", 
        title: "Direct Owner/Flatmate Chat", 
        subtitle: "Connect directly with owners and flatmates without intrusive intermediaries or agents." 
    },
];
// -----------------------------------------------------------------


const LandingScreen = ({ navigation }) => {
    const { colors } = useTheme();

    // 🌟 DYNAMIC WIDTH IMPLEMENTATION
    const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
    const dynamicWidth = windowDimensions.width;
    const dynamicHeight = windowDimensions.height;
    const isMobile = dynamicWidth <= BREAKPOINT;
    
    useEffect(() => {
        const updateDimensions = ({ window }) => {
            setWindowDimensions(window);
        };

        const subscription = Dimensions.addEventListener('change', updateDimensions);

        return () => subscription?.remove();
    }, []);

    // ----------------------------------------------------
    // 🪄 DYNAMIC CARD WIDTH LOGIC FUNCTION
    // ----------------------------------------------------
    const getCardWidth = useCallback((webCards) => {
        const mobileCards = 2;

        if (dynamicWidth > BREAKPOINT) {
            return `${(100 / webCards) - 2}%`; 
        } else {
            return `${(100 / mobileCards) - 4}%`;
        }
    }, [dynamicWidth]);

    // ----------------------------------------------------
    // 🪄 DYNAMIC SIZE HELPER FUNCTION
    // ----------------------------------------------------
    const getDynamicSize = useCallback((webSize, mobileSize) => {
        return isMobile ? mobileSize : webSize;
    }, [isMobile]);


    const [propertyType, setPropertyType] = useState('Flat');
    const [scrollY, setScrollY] = useState(0);
    const sectionRefs = useRef({});
    const [inView, setInView] = useState({});

    // --- REFS FOR ALL SECTIONS RESTORED ---
    const categoryRef = useRef(null);
    const featureRef = useRef(null);
    const howItWorksRef = useRef(null);
    const whyChooseUsRef = useRef(null); 
    const valueRef = useRef(null);
    const testimonialRef = useRef(null);
    const neighborhoodsRef = useRef(null);
    const communityRef = useRef(null);
    const previewRef = useRef(null);
    const ctaRef = useRef(null);

    // 🌟 TYPING ANIMATION STATE
    const [typedQuote, setTypedQuote] = useState('');
    const firstQuote = initialTestimonials[0].quote;

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
        const viewportHeight = dynamicHeight; 

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
    }, [inView, dynamicHeight]);

    const heroImageParallax = {
        transform: [
            { scale: 1.1 },
            { translateY: scrollY * 0.3 },
        ],
        transition: 'transform 0s linear',
    };

    // ----------------------------------------------------
    // 🪄 RENDER HELPER FOR ANIMATED CARDS
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
            measureSection('whyChooseUs', whyChooseUsRef); 
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

            {/* 👑 ENHANCED STICKY HEADER BAR (CENTERED FIX) - USING NEW COMPONENT */}
            <HeroHeader 
                appLogo={appLogo} 
                PRIMARY_COLOR={PRIMARY_COLOR} 
                VIBRANT_ACCENT={VIBRANT_ACCENT}
                DEEP_3D_SHADOW={DEEP_3D_SHADOW}
                SUBTLE_SHADOW={SUBTLE_SHADOW}
                FLOATING_HEADER_STYLE={FLOATING_HEADER_STYLE}
                getDynamicSize={getDynamicSize} 
                handleLogin={handleLogin}
                colors={colors} // Pass colors for background
            />

            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                // NOTE: Using static width here as it's outside the scrolling content area
                contentContainerStyle={[styles.scrollContentWeb, { maxWidth: MAX_WEB_WIDTH + HORIZONTAL_MARGIN * 2, backgroundColor: colors.background }]} 
            >
                {/* 🏰 SECTION 1: HERO - CALLING THE NEW COMPONENT */}
                {/* 🛑 MODIFIED: HeroSection कंपोनेंट को सभी आवश्यक props पास किए गए */}
                <HeroSection 
                    colors={colors}
                    isMobile={isMobile}
                    getDynamicSize={getDynamicSize}
                    handleLogin={handleLogin}
                    heroImageParallax={heroImageParallax}
                    heroImage={heroImage}
                    PRIMARY_COLOR={PRIMARY_COLOR}
                    VIBRANT_ACCENT={VIBRANT_ACCENT}
                    DEEP_3D_SHADOW={DEEP_3D_SHADOW}
                    GENEROUS_RADIUS={GENEROUS_RADIUS}
                    MAX_WEB_WIDTH={MAX_WEB_WIDTH}
                    BUTTON_RADIUS={BUTTON_RADIUS}
                />


                {/* --- SECTION 2: EXPLORE CATEGORIES --- */}
                <View
                    style={[styles.sectionContainer, { marginTop: 80, paddingTop: 20 }]}
                    ref={categoryRef}
                    onLayout={() => measureSection('category', categoryRef)}
                >
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR, fontSize: getDynamicSize(42, 18) }]}>🏰 Explore Property Categories</Text>
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80', fontSize: getDynamicSize(20, 10) }]}>Find your perfect living space: Flats, PGs, Hostels, and Houses.</Text>

                    <View style={styles.categoryGrid}>
                        {propertyTypes.map((type, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setPropertyType(type)}
                                style={[
                                    styles.categoryCard,
                                    {
                                        width: getCardWidth(4),
                                        backgroundColor: propertyType === type ? PRIMARY_COLOR : colors.card,
                                        borderWidth: 1, 
                                        borderColor: propertyType === type ? PRIMARY_COLOR : colors.border,
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('category', index),
                                        ...styles.hoverScaleEffect,
                                    }
                                ]}
                            >
                                {/* DYNAMIC ICON SIZE & PADDING */}
                                <View style={[styles.iconWrapper, { 
                                    backgroundColor: propertyType === type ? VIBRANT_ACCENT : PRIMARY_COLOR + '10',
                                    padding: getDynamicSize(18, 10), // Dynamic Padding
                                    }]}>
                                    <Icon
                                        name={type === 'Flat' ? 'business-outline' : type === 'PG' ? 'bed-outline' : type === 'Hostel' ? 'school-outline' : 'home-outline'}
                                        size={getDynamicSize(35, 20)} // Dynamic Icon Size
                                        color={propertyType === type ? PRIMARY_COLOR : PRIMARY_COLOR}
                                    />
                                </View>
                                {/* DYNAMIC FONT SIZE */}
                                <Text style={[styles.categoryTitle, { 
                                    color: propertyType === type ? VIBRANT_ACCENT : colors.text, 
                                    marginTop: 15,
                                    fontSize: getDynamicSize(20, 10) // Dynamic Font Size
                                    }]}>{type}</Text>
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
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR, fontSize: getDynamicSize(42, 18) }]}>⭐ Quick Actions</Text>
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80', fontSize: getDynamicSize(20, 10) }]}>Your immediate path to finding or listing your perfect space.</Text>

                    <View style={styles.featureGrid}>
                        {featureCards.map((card, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.featureCard,
                                    {
                                        width: getCardWidth(3),
                                        backgroundColor: colors.card,
                                        ...DEEP_3D_SHADOW,
                                        ...getAnimatedCardStyle('feature', index),
                                        ...styles.hoverScaleEffect,
                                    }
                                ]}
                            >
                                {/* DYNAMIC ICON SIZE & PADDING */}
                                <View style={[styles.iconWrapper, { 
                                    backgroundColor: card.color + '15',
                                    padding: getDynamicSize(18, 10),
                                }]}>
                                    <Icon name={card.icon} size={getDynamicSize(35, 20)} color={card.color} />
                                </View>
                                {/* DYNAMIC FONT SIZE */}
                                <Text style={[styles.cardTitle, { 
                                    color: colors.text, 
                                    marginTop: 15,
                                    fontSize: getDynamicSize(24, 12)
                                    }]}>{card.title}</Text>
                                {/* DYNAMIC FONT SIZE */}
                                <Text style={[styles.cardSubtitle, { 
                                    color: colors.text + '80',
                                    fontSize: getDynamicSize(16, 10)
                                    }]}>
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
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR, fontSize: getDynamicSize(42, 18) }]}>🪄 How It Works: Your Fairy Tale Journey</Text>
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80', fontSize: getDynamicSize(20, 10) }]}>Find your perfect home in four simple steps.</Text>

                    <View style={styles.howItWorksGrid}>
                        {steps.map((step, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.howItWorksCard,
                                    {
                                        width: getCardWidth(4),
                                        backgroundColor: colors.card,
                                        borderBottomColor: PRIMARY_COLOR,
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('howItWorks', index),
                                        ...styles.hoverScaleEffect,
                                    }
                                ]}
                            >
                                {/* DYNAMIC CIRCLE SIZE/FONT */}
                                <View style={[styles.stepNumberCircle, { 
                                    backgroundColor: PRIMARY_COLOR, 
                                    ...SUBTLE_SHADOW,
                                    width: getDynamicSize(50, 20),
                                    height: getDynamicSize(50, 20),
                                    borderRadius: getDynamicSize(25, 10),
                                    top: getDynamicSize(-25, -10),
                                    marginLeft: getDynamicSize(-25, -10),
                                    }]}>
                                    <Text style={[styles.stepNumberText, { fontSize: getDynamicSize(20, 12) }]}>{index + 1}</Text>
                                </View>

                                {/* DYNAMIC ICON SIZE */}
                                <Icon name={step.icon} size={getDynamicSize(30, 10)} color={VIBRANT_ACCENT} style={[styles.stepIconAccent, { right: getDynamicSize(20, 10), top: getDynamicSize(20, 10) }]} />

                                {/* DYNAMIC FONT SIZE */}
                                <Text style={[styles.stepTitle, { color: colors.text, fontSize: getDynamicSize(20, 12) }]}>{step.title}</Text>
                                {/* DYNAMIC FONT SIZE */}
                                <Text style={[styles.stepSubtitle, { color: colors.text + '80', fontSize: getDynamicSize(16, 10) }]}>{step.subtitle}</Text>

                            </View>
                        ))}
                    </View>
                </View>

                {/* 🏆 SECTION 5: WHY CHOOSE US - THE FLATMATES DIFFERENCE */}
                <View
                    style={[styles.sectionContainer, { marginTop: 100, backgroundColor: VIBRANT_ACCENT + '05', paddingVertical: 60, borderRadius: GENEROUS_RADIUS * 2 }]}
                    ref={whyChooseUsRef}
                    onLayout={() => measureSection('whyChooseUs', whyChooseUsRef)}
                >
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR, fontSize: getDynamicSize(42, 18) }]}>🏆 Why Choose Us? The FlatMates Difference</Text>
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80', fontSize: getDynamicSize(20, 10) }]}>Skip the high brokerage fees and the agent-heavy marketplaces. This is your home, your way.</Text>

                    <View style={styles.whyChooseUsGrid}>
                        {whyChooseUsData.map((data, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.whyChooseUsCard,
                                    {
                                        width: getCardWidth(4),
                                        backgroundColor: colors.card,
                                        borderBottomColor: VIBRANT_ACCENT,
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('whyChooseUs', index),
                                        ...styles.hoverScaleEffect,
                                    }
                                ]}
                            >
                                {/* DYNAMIC ICON SIZE & PADDING */}
                                <View style={[styles.iconWrapper, { 
                                    backgroundColor: PRIMARY_COLOR + '10',
                                    padding: getDynamicSize(18, 10),
                                }]}>
                                    <Icon name={data.icon} size={getDynamicSize(35, 15)} color={PRIMARY_COLOR} />
                                </View>
                                {/* DYNAMIC FONT SIZE */}
                                <Text style={[styles.whyChooseUsTitle, { color: colors.text, fontSize: getDynamicSize(20, 12) }]}>{data.title}</Text>
                                {/* DYNAMIC FONT SIZE */}
                                <Text style={[styles.whyChooseUsSubtitle, { color: colors.text + '80', fontSize: getDynamicSize(16, 10) }]}>{data.subtitle}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                {/* 🏆 END NEW SECTION */}

                {/* --- SECTION 6: VALUE PROPOSITIONS (Original Section 5) --- */}
                <View
                    style={[styles.sectionContainer, { marginTop: 100 }]}
                    ref={valueRef}
                    onLayout={() => measureSection('value', valueRef)}
                >
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR, fontSize: getDynamicSize(42, 18) }]}>🌟 The FlatMates Advantage</Text>
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80', fontSize: getDynamicSize(20, 10) }]}>Where technology meets comfort and magic is just around the corner.</Text>

                    <View style={styles.valuePropsGrid}>
                        {valueProps.map((prop, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.valuePropCard,
                                    {
                                        width: getCardWidth(4),
                                        backgroundColor: colors.card,
                                        borderLeftColor: PRIMARY_COLOR,
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('value', index),
                                        ...styles.hoverScaleEffect,
                                    }
                                ]}
                            >
                                {/* DYNAMIC ICON SIZE & PADDING */}
                                <View style={[styles.iconWrapper, { 
                                    backgroundColor: PRIMARY_COLOR + '10',
                                    padding: getDynamicSize(18, 10),
                                }]}>
                                    <Icon name={prop.icon} size={getDynamicSize(35, 15)} color={PRIMARY_COLOR} />
                                </View>
                                {/* DYNAMIC FONT SIZE */}
                                <Text style={[styles.valuePropTitle, { color: colors.text, fontSize: getDynamicSize(20, 12) }]}>{prop.title}</Text>
                                {/* DYNAMIC FONT SIZE */}
                                <Text style={[styles.valuePropSubtitle, { color: colors.text + '80', fontSize: getDynamicSize(16, 10) }]}>{prop.subtitle}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 🏡 SECTION 7: COMMUNITY VIBE (Original Section 6) */}
                <View
                    style={[styles.sectionContainer, { marginTop: 100, backgroundColor: PRIMARY_COLOR + '05', paddingVertical: 60, borderRadius: GENEROUS_RADIUS * 2 }]}
                    ref={communityRef}
                    onLayout={() => measureSection('community', communityRef)}
                >
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR, fontSize: getDynamicSize(42, 18) }]}>💖 Our Community Vibe</Text>
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80', fontSize: getDynamicSize(20, 10) }]}>More than just a place to live, it's a supportive community.</Text>

                    <View style={styles.communityGrid}>
                        {communityVibes.map((vibe, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.communityCard,
                                    {
                                        width: getCardWidth(4),
                                        backgroundColor: colors.card,
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('community', index),
                                        ...styles.hoverScaleEffect,
                                    }
                                ]}
                            >
                                {/* DYNAMIC ICON SIZE & PADDING */}
                                <View style={[styles.iconWrapper, { 
                                    backgroundColor: VIBRANT_ACCENT + '15',
                                    padding: getDynamicSize(18, 10),
                                }]}>
                                    <Icon name={vibe.icon} size={getDynamicSize(35, 15)} color={VIBRANT_ACCENT} />
                                </View>
                                {/* DYNAMIC FONT SIZE */}
                                <Text style={[styles.communityTitle, { color: colors.text, fontSize: getDynamicSize(22, 12) }]}>{vibe.title}</Text>
                                {/* DYNAMIC FONT SIZE */}
                                <Text style={[styles.communitySubtitle, { color: colors.text + '80', fontSize: getDynamicSize(16, 10) }]}>{vibe.subtitle}</Text>
                            </View>
                        ))}
                    </View>
                </View>


                {/* 💬 SECTION 8: USER TESTIMONIALS (Original Section 7) */}
                <View
                    style={[styles.sectionContainer, { marginTop: 100, backgroundColor: colors.background }]}
                    ref={testimonialRef}
                    onLayout={() => measureSection('testimonial', testimonialRef)}
                >
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR, fontSize: getDynamicSize(42, 18) }]}>💬 Hear From Our Happy Renters</Text>
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80', marginBottom: 40, fontSize: getDynamicSize(20, 10) }]}>Real stories from the community in a chat view.</Text>

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
                                            ...SUBTLE_SHADOW,
                                            ...getAnimatedCardStyle('testimonial', index),
                                        },
                                        // Static styles that don't need dynamic width checks, but need to be applied here
                                        {
                                            borderBottomRightRadius: isLeft ? 5 : 20,
                                            borderTopLeftRadius: isLeft ? 20 : 5,
                                            borderTopRightRadius: isLeft ? 20 : 20,
                                            borderBottomLeftRadius: isLeft ? 20 : 5,
                                        }
                                    ]}
                                >
                                    {/* 🌟 CHAT BUBBLE TAIL (Left) */}
                                    {isLeft && (
                                        <View style={[styles.chatTail, styles.chatTailLeft, { borderRightColor: tailColor }]} />
                                    )}

                                    {/* 🌟 TYPING INDICATOR / QUOTE */}
                                    {isTyping ? (
                                        // DYNAMIC FONT SIZE
                                        <Text style={[styles.typingText, { color: colors.text + '90', fontSize: getDynamicSize(18, 10) }]}>
                                            {quoteContent}
                                            <Text style={styles.blinkingCursor}>|</Text>
                                        </Text>
                                    ) : (
                                        // DYNAMIC FONT SIZE
                                        <Text style={[styles.testimonialQuote, { color: colors.text, fontSize: getDynamicSize(18, 10) }]}>
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
                                        {/* DYNAMIC FONT SIZE */}
                                        <Text style={[styles.testimonialName, { color: nameColor, fontSize: getDynamicSize(18, 12) }]}>{testimonial.name}</Text>
                                        {/* DYNAMIC FONT SIZE & ICON */}
                                        <Text style={[styles.testimonialLocation, { color: colors.text + '80', fontSize: getDynamicSize(14, 10) }]}>
                                            <Icon name="location" size={getDynamicSize(12, 10)} /> {testimonial.location}
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

                {/* 🏘️ SECTION 9: FEATURED NEIGHBORHOODS (Original Section 8) */}
                <View
                    style={[styles.sectionContainer, { marginTop: 100, backgroundColor: colors.background }]}
                    ref={neighborhoodsRef}
                    onLayout={() => measureSection('neighborhoods', neighborhoodsRef)}
                >
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR, fontSize: getDynamicSize(42, 18) }]}>🗺️ Featured Neighborhoods</Text>
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80', marginBottom: 40, fontSize: getDynamicSize(20, 10) }]}>Discover the most magical and sought-after localities.</Text>

                    <View style={styles.neighborhoodGrid}>
                        {neighborhoods.map((n, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.neighborhoodCard,
                                    {
                                        width: getCardWidth(4),
                                        backgroundColor: colors.card,
                                        borderRightColor: PRIMARY_COLOR,
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('neighborhoods', index),
                                        ...styles.hoverScaleEffect,
                                    }
                                ]}
                            >
                                {/* DYNAMIC ICON SIZE & PADDING */}
                                <View style={[styles.iconWrapper, { 
                                    backgroundColor: SECONDARY_ACCENT + '15', 
                                    marginBottom: 15,
                                    padding: getDynamicSize(18, 10),
                                }]}>
                                    <Icon name={n.icon} size={getDynamicSize(35, 15)} color={SECONDARY_ACCENT} />
                                </View>
                                {/* DYNAMIC FONT SIZE */}
                                <Text style={[styles.neighborhoodTitle, { color: colors.text, fontSize: getDynamicSize(22, 12) }]}>{n.name}</Text>
                                {/* DYNAMIC FONT SIZE */}
                                <Text style={[styles.neighborhoodSubtitle, { color: VIBRANT_ACCENT, fontSize: getDynamicSize(16, 10) }]}>{n.vibe}</Text>
                                <View style={styles.ratingRow}>
                                    {/* DYNAMIC ICON SIZE */}
                                    <Icon name="star" size={getDynamicSize(16, 11)} color={VIBRANT_ACCENT} />
                                    {/* DYNAMIC FONT SIZE */}
                                    <Text style={[styles.ratingText, { color: colors.text + '90', fontSize: getDynamicSize(18, 11) }]}>{n.rating}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>


                {/* 🚀 SECTION 10: FUTURE PREVIEWS (Original Section 9) */}
                <View
                    style={[styles.sectionContainer, { marginTop: 100, marginBottom: 40, backgroundColor: colors.background }]}
                    ref={previewRef}
                    onLayout={() => measureSection('preview', previewRef)}
                >
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionTitle, { color: PRIMARY_COLOR, fontSize: getDynamicSize(42, 18) }]}>🔮 Sneak Peek: Future Features</Text>
                    {/* DYNAMIC FONT SIZE */}
                    <Text style={[styles.sectionSubtitle, { color: colors.text + '80', fontSize: getDynamicSize(20, 10) }]}>Building the future of shared living, one magical feature at a time.</Text>

                    <View style={styles.previewGrid}>
                        {featurePreviews.map((preview, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.previewCard,
                                    {
                                        width: getCardWidth(3),
                                        backgroundColor: colors.card,
                                        borderBottomColor: PRIMARY_COLOR,
                                        ...SUBTLE_SHADOW,
                                        ...getAnimatedCardStyle('preview', index),
                                        ...styles.hoverScaleEffect,
                                    }
                                ]}
                            >
                                {/* DYNAMIC ICON SIZE & PADDING */}
                                <View style={[styles.iconWrapper, { 
                                    backgroundColor: VIBRANT_ACCENT + '15',
                                    padding: getDynamicSize(18, 10),
                                }]}>
                                    <Icon name={preview.icon} size={getDynamicSize(35, 15)} color={VIBRANT_ACCENT} />
                                </View>
                                {/* DYNAMIC FONT SIZE */}
                                <Text style={[styles.previewTitle, { color: colors.text, fontSize: getDynamicSize(22, 12) }]}>{preview.title}</Text>
                                {/* DYNAMIC FONT SIZE */}
                                <Text style={[styles.previewSubtitle, { color: colors.text + '80', fontSize: getDynamicSize(16, 10) }]}>{preview.subtitle}</Text>
                            </View>
                        ))}
                    </View>
                </View>


                {/* 🦶 BEAUTIFUL FOOTER SECTION (USING NEW COMPONENT) */}
                <LandingScreenFooter 
                    colors={colors} 
                    dynamicWidth={dynamicWidth} 
                    MAX_WEB_WIDTH={MAX_WEB_WIDTH} 
                    VIBRANT_ACCENT={VIBRANT_ACCENT} 
                    PRIMARY_COLOR={PRIMARY_COLOR} 
                    navigation={navigation}
                />


            </ScrollView>
        </SafeAreaView>
    );
};


// --- WEB-SPECIFIC STYLES (Header-specific styles हटा दिए गए हैं) ---
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
    // Font sizes are now dynamic/inline in JSX, but keeping base styles here
    sectionTitle: {
        fontWeight: '900', 
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.5, 
    },
    sectionSubtitle: {
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 40,
    },
    
    // 🌟 REUSABLE ICON WRAPPER STYLE (Padding dynamic in JSX)
    iconWrapper: {
        borderRadius: 15, 
        marginBottom: 5,
        ...SUBTLE_SHADOW,
    },


    // --- Card Grid Styles (Keep Flexbox here) ---
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    categoryCard: {
        padding: 20,
        borderRadius: GENEROUS_RADIUS,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
    },
    categoryTitle: {
        fontWeight: '900', 
    },

    featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    featureCard: {
        padding: 30,
        borderRadius: GENEROUS_RADIUS,
        alignItems: 'center',
        marginBottom: 30,
    },
    cardTitle: {
        fontWeight: '900', 
        marginBottom: 8,
        textAlign: 'center',
    },
    cardSubtitle: {
        textAlign: 'center',
        lineHeight: 24,
    },

    howItWorksGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    howItWorksCard: {
        padding: 25,
        paddingTop: 45,
        borderRadius: BUTTON_RADIUS,
        marginBottom: 30, 
        borderBottomWidth: 4,
        alignItems: 'flex-start',
        position: 'relative',
        borderBottomColor: PRIMARY_COLOR, 
    },
    stepNumberCircle: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    stepNumberText: {
        color: '#fff',
        fontWeight: '900',
    },
    stepIconAccent: {
        position: 'absolute',
    },
    stepTitle: {
        fontWeight: '900', 
        marginBottom: 5,
        marginTop: 15,
    },
    stepSubtitle: {
        textAlign: 'left',
    },

    // 🏆 NEW SECTION STYLES: WHY CHOOSE US
    whyChooseUsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    whyChooseUsCard: {
        padding: 25,
        borderRadius: BUTTON_RADIUS,
        marginBottom: 20,
        borderBottomWidth: 4,
        alignItems: 'flex-start',
    },
    whyChooseUsTitle: {
        fontWeight: '900', 
        marginBottom: 5,
        marginTop: 15,
    },
    whyChooseUsSubtitle: {
        textAlign: 'left',
    },
    // 🏆 END NEW SECTION STYLES


    valuePropsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    valuePropCard: {
        padding: 20,
        borderRadius: BUTTON_RADIUS,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: PRIMARY_COLOR,
        alignItems: 'flex-start',
    },
    valuePropTitle: {
        fontWeight: '900', 
        marginBottom: 5,
        marginTop: 15,
    },
    valuePropSubtitle: {
        textAlign: 'left',
    },

    communityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    communityCard: {
        padding: 25,
        borderRadius: GENEROUS_RADIUS,
        alignItems: 'center',
        marginBottom: 20,
    },
    communityTitle: {
        fontWeight: '900', 
        marginBottom: 5,
        textAlign: 'center',
        marginTop: 15,
    },
    communitySubtitle: {
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
        maxWidth: 600, 
        width: width > BREAKPOINT ? '50%' : '90%',
        padding: 30, 
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
        fontStyle: 'italic',
        lineHeight: 28,
        marginBottom: 15,
        width: '100%',
    },
    testimonialFooter: {
        width: '100%',
    },
    testimonialName: {
        fontWeight: '900',
        marginBottom: 3,
        letterSpacing: 0.5,
    },
    testimonialLocation: {
    },

    // 🌟 TYPING ANIMATION STYLES
    typingText: {
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
        padding: 25,
        borderRadius: BUTTON_RADIUS,
        marginBottom: 25,
        borderRightWidth: 4,
        borderRightColor: PRIMARY_COLOR,
        alignItems: 'center',
        textAlign: 'center',
    },
    neighborhoodTitle: {
        fontWeight: '900', 
        marginBottom: 3,
        textAlign: 'center',
    },
    neighborhoodSubtitle: {
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
        padding: 25,
        borderRadius: BUTTON_RADIUS,
        marginBottom: 25,
        borderBottomWidth: 5,
        borderBottomColor: VIBRANT_ACCENT, 
        alignItems: 'center',
        textAlign: 'center',
    },
    previewTitle: {
        fontWeight: '900', 
        marginBottom: 5,
        textAlign: 'center',
        marginTop: 15,
    },
    previewSubtitle: {
        textAlign: 'center',
    },
});

export default LandingScreen;