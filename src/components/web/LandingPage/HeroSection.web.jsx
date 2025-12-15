// src/components/web/HeroSection.web.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// 🛑 DUMMY DATA for the card
const dummyFilters = ['Flatmates', 'PG', 'Hostels', 'Hotels','House','Shop'];

// HeroSection Component (LandingScreen से Props प्राप्त करता है)
const HeroSection = ({
    colors, 
    isMobile, 
    getDynamicSize, 
    handleLogin, 
    heroImageParallax, 
    heroImage,
    PRIMARY_COLOR, 
    VIBRANT_ACCENT, 
    DEEP_3D_SHADOW, 
    GENEROUS_RADIUS,
    MAX_WEB_WIDTH,
    BUTTON_RADIUS
}) => {
    
    // 🛑 STATE: Initial Load State for Animation
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Trigger animation after a short delay
        const timer = setTimeout(() => setIsLoaded(true), 200); // Slight delay for better effect
        return () => clearTimeout(timer);
    }, []);
    
    // 🛑 HELPER: Get Animated Style (Slower, smoother animation for initial entrance)
    const getAnimatedStyle = (delay) => ({
        opacity: isLoaded ? 1 : 0,
        // Only translateY and opacity for entrance, rotation/float is on the wrapper
        transform: [ { translateY: isLoaded ? 0 : 50 } ],
        transitionProperty: 'opacity, transform',
        transitionDuration: '1.2s', 
        transitionTimingFunction: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)', 
        transitionDelay: `${delay}s`,
    });


    // स्थानीय स्टाइल को Props और स्थिति के आधार पर उत्पन्न करें
    const localStyles = getStyles({
        PRIMARY_COLOR, 
        VIBRANT_ACCENT, 
        DEEP_3D_SHADOW, 
        GENEROUS_RADIUS, 
        MAX_WEB_WIDTH, 
        BUTTON_RADIUS,
        colors
    }, isMobile);
    
    // 🛑 REFINED Background Style (Radial Gradient for Depth)
    const heroBackgroundStyle = Platform.select({
        web: {
            background: `radial-gradient(circle at 50% 50%, ${PRIMARY_COLOR}25 0%, ${VIBRANT_ACCENT}10 80%, ${PRIMARY_COLOR}10 100%)`,
        },
        default: {
            backgroundColor: PRIMARY_COLOR + '10', // Non-web fallback
        }
    });

    return (
        <View 
            style={[
                localStyles.heroContainer, 
                heroBackgroundStyle,
                DEEP_3D_SHADOW,
                // Adjusted height to accommodate the taller card/wrapper
                { height: getDynamicSize('65vh', '60vh') } 
            ]}
        >
            {/* Parallax Image as an overlay for a better effect. */}
            <Image
                source={heroImage}
                style={[localStyles.heroImageParallaxOverlay, heroImageParallax, { opacity: isMobile ? 0.2 : 0.4 }]} 
                resizeMode="cover"
            />

            {/* 🌟 3D Layered Content - FLEX container for 2 Columns on Web */}
            <View style={[localStyles.heroContentEnhanced, { 
                transform: [{ translateZ: 100 }], 
                flexDirection: isMobile ? 'column' : 'row',
                paddingHorizontal: getDynamicSize(80, 20), 
                paddingVertical: getDynamicSize(40, 40),
                }]}>

                {/* Column 1: Text & CTA */}
                <View style={[
                    localStyles.heroTextColumn, 
                    isMobile && { alignItems: 'center' } 
                ]}>
                    <Text style={[
                        localStyles.heroTextTitle, 
                        { 
                            color: VIBRANT_ACCENT, 
                            fontSize: getDynamicSize(68, 30), 
                            textAlign: isMobile ? 'center' : 'left',
                        },
                        getAnimatedStyle(0.2)
                    ]}>
                        <Text style={{ color: PRIMARY_COLOR ,   textShadow: `0 0 5px ${colors.card}, 0 0 15px ${colors.card}, 0 0 30px ${PRIMARY_COLOR}90`, }}>Why</Text> FInd Your <Text style={{ color: PRIMARY_COLOR , textShadow: `0 0 5px ${colors.card}, 0 0 15px ${colors.card}, 0 0 30px ${PRIMARY_COLOR}90`}}>Flatmates?</Text>
                    </Text>
                    
                    <Text style={[
                        localStyles.heroTextSubtitle, 
                        { 
                            color: colors.card, 
                            fontSize: getDynamicSize(22, 12),
                            textAlign: isMobile ? 'center' : 'left',
                            marginBottom: getDynamicSize(30, 20),
                            lineHeight: getDynamicSize(32, 18),
                            marginHorizontal: isMobile ? 10 : 0, 
                        },
                        getAnimatedStyle(0.4)
                    ]}>
                        <Icon name="shield-checkmark" size={getDynamicSize(22, 12)} color={VIBRANT_ACCENT} /> **Zero Brokerage, Verified Homes.** We connect you directly with owners and flatmates, cutting out the middleman and saving you money.
                        {`\n\n`}
                        <Icon name="people" size={getDynamicSize(22, 12)} color={VIBRANT_ACCENT} /> **Smart Matching Algorithm.** Find flatmates based on lifestyle compatibility, not just location.
                    </Text>
                    
                    {/* 🌟 Primary CTA Button - HIGH VISIBILITY + PULSING GLOW */}
                    <TouchableOpacity
                        style={[
                            localStyles.primaryCtaButton, 
                            localStyles.pulsingCtaShadow, 
                            { 
                                backgroundColor: VIBRANT_ACCENT, 
                                ...DEEP_3D_SHADOW,
                                paddingHorizontal: getDynamicSize(40, 20),
                                paddingVertical: getDynamicSize(18, 10),
                                alignSelf: 'center', // Always centered for consistency
                            },
                            getAnimatedStyle(0.6)
                        ]}
                        onPress={handleLogin} 
                    >
                        <Text style={[localStyles.primaryCtaText, { color: PRIMARY_COLOR, fontSize: getDynamicSize(20, 14) }]}>
                            Start Your Search Now!
                        </Text>
                    </TouchableOpacity>
                </View>
                
                {/* Column 2: 🏡 MAGICAL HOME SHAPE CARD */}
                {!isMobile && (
                    <View style={localStyles.heroDecorativeColumn}>
                        
                        {/* 🛑 WRAPPER: Handles the combined transform and animation for the whole home shape */}
                        <View style={[localStyles.homeShapeWrapper, getAnimatedStyle(0.8)]}>
                        
                            {/* 1. ROOF (TRIANGLE) - positioned at the top of the wrapper */}
                            <View style={[localStyles.homeRoof, { borderBottomColor: PRIMARY_COLOR + 'E0' }]}>
                                 <Icon 
                                    name="sparkles" 
                                    size={18} 
                                    color={VIBRANT_ACCENT} 
                                    style={localStyles.roofPeakSparkle}
                                />
                            </View>
                            
                            {/* 2. CARD BODY - pushed down by the roof height */}
                            <View 
                                style={[
                                    localStyles.heroMockupCard, 
                                    { 
                                        backgroundColor: PRIMARY_COLOR + 'E0', 
                                        borderWidth: 3, 
                                        borderColor: VIBRANT_ACCENT, 
                                        ...DEEP_3D_SHADOW 
                                    }
                                ]}
                            >
                                {/* ENHANCEMENT: Inner Glow effect on the card */}
                                <View style={localStyles.cardInnerGlow}/> 
                                
                                <Icon name="key-outline" size={70} color={VIBRANT_ACCENT} style={localStyles.compassSpinningIcon} /> 
                                
                                <Text style={{ 
                                    color: VIBRANT_ACCENT, 
                                    fontWeight: '900', 
                                    fontSize: 22, 
                                    marginTop: 5, 
                                    marginBottom: 2, 
                                    textAlign: 'center'
                                }}>
                                    Your New Home Key
                                </Text>
                          
                                
                                {/* 5. DUMMY FILTER TAGS */}
                                <View style={localStyles.dummyFiltersContainer}>
                                    {dummyFilters.map((filter, index) => (
                                        <View key={index} style={[localStyles.dummyFilterPill, { backgroundColor: VIBRANT_ACCENT + '20' }]}>
                                            <Text style={{ color: colors.card, fontSize: 12, fontWeight: '600' }}>
                                                {filter}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            
                        </View>
                    </View>
                )}

            </View>
        </View>
    );
};

// -----------------------------------------------------------------
// 🎨 STYLES (यह सिर्फ HeroSection के लिए आवश्यक स्टाइल हैं)
// -----------------------------------------------------------------
const getStyles = ({ PRIMARY_COLOR, VIBRANT_ACCENT, DEEP_3D_SHADOW, GENEROUS_RADIUS, MAX_WEB_WIDTH, BUTTON_RADIUS, colors }, isMobile) => {

    // 🌟 FLOATING ANIMATION KEYFRAMES (Web only)
    const floatingKeyframes = {
        '0%': { transform: [{ translateY: 0 }, { rotate: '12deg' }, { scale: 1.1 }] },
        '50%': { transform: [{ translateY: -10 }, { rotate: '14deg' }, { scale: 1.1 }] },
        '100%': { transform: [{ translateY: 0 }, { rotate: '12deg' }, { scale: 1.1 }] },
    };
    
    // 🌟 PULSING CTA KEYFRAMES (Web only)
    const pulsatingKeyframes = {
        '0%': { boxShadow: `0 0 0 ${VIBRANT_ACCENT}00` },
        '50%': { boxShadow: `0 0 15px 5px ${VIBRANT_ACCENT}B0` },
        '100%': { boxShadow: `0 0 0 ${VIBRANT_ACCENT}00` },
    };
    
    // 🌟 ICON SPIN KEYFRAMES (Web only)
    const spinKeyframes = {
        '0%': { transform: [{ rotate: '0deg' }] },
        '100%': { transform: [{ rotate: '360deg' }] },
    };


    return StyleSheet.create({
        // 🏰 --- HERO SECTION STYLES (Parallax) ---
        heroContainer: {
            position: 'relative',
            marginTop: isMobile ? 10 : 15, 
            overflow: 'hidden',
            borderRadius: GENEROUS_RADIUS * 2,
            zIndex: 5,
            alignSelf: 'center',
            maxWidth: MAX_WEB_WIDTH,
            width: '100%',
            transformPerspective: 1000, 
        },
        heroImageParallaxOverlay: { 
            position: 'absolute',
            width: '100%',
            height: '100%',
        },
        heroContentEnhanced: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            zIndex: 10, // Ensure content is above the image
        },
        heroTextColumn: {
            flex: isMobile ? 1 : 0.6, 
            justifyContent: 'center',
        },
        heroDecorativeColumn: {
            flex: 0.4, 
            justifyContent: 'center',
            alignItems: 'center',
        },
        heroTextTitle: {
            fontWeight: '900',
            textAlign: 'center',
            marginBottom: 15,
            textShadow: `0 0 5px ${PRIMARY_COLOR}, 0 0 15px ${PRIMARY_COLOR}, 0 0 30px ${VIBRANT_ACCENT}90`, 
            letterSpacing: 1.5, 
        },
        heroTextSubtitle: {
            fontWeight: '500',
            textAlign: 'center',
            marginBottom: 40, 
            textShadow: '1px 1px 4px rgba(0,0,0,1)',
        },
        
        // 🛑 NEW WRAPPER: Handles the combined transform and animation for the whole home shape
        homeShapeWrapper: {
            width: 300, // 🛑 FIX: Set width to 300px for square shape
            position: 'relative',
            transition: 'all 0.4s ease',
            // Apply all transforms and animations here once
            transform: [{ rotate: '12deg' }, { scale: 1.1 }],
            ...Platform.select({
                web: {
                    animationKeyframes: floatingKeyframes,
                    animationDuration: '4s',
                    animationIterationCount: 'infinite',
                    animationTimingFunction: 'ease-in-out',
                }
            }),
            ':hover': {
                // Apply hover effect to wrapper
                transform: [{ rotate: '0deg' }, { scale: 1.15 }, { translateY: -10 }], 
                boxShadow: `0 30px 60px 0px rgba(16, 42, 67, 0.9)`,
            },
        },


        // 🏡 Home Roof (Triangular Shape)
        homeRoof: {
            position: 'absolute', // Absolute relative to homeShapeWrapper
            top: 0, 
            left: 0, 
            width: 0,
            height: 0,
            borderLeftWidth: 150, // 🛑 FIX: Matched to new card width / 2 (300/2)
            borderRightWidth: 150, // 🛑 FIX: Matched to new card width / 2 (300/2)
            borderBottomWidth: 100, // Roof height
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            zIndex: 15, // Above the card
        },
        roofPeakSparkle: {
            position: 'absolute',
            top: -95, 
            left: -9, // Adjusted for better centering of the 18px icon on 300px base
        },
        
        // Hero Mockup Card Style (The body of the house - now square: 300x300)
        heroMockupCard: {
            width: '100%', 
            height: 300, // Matches wrapper width of 300px
            marginTop: 100, // Pushed down by exactly the roof height (100px)
            borderRadius: GENEROUS_RADIUS,
            borderTopLeftRadius: 0, 
            borderTopRightRadius: 0,
            justifyContent: 'space-evenly', 
            alignItems: 'center',
            padding: 25, 
            paddingTop: 10, 
            position: 'relative', 
        },
        
        // 🛑 Key Spinning Icon
        compassSpinningIcon: Platform.select({
            web: {
                animationKeyframes: spinKeyframes,
                animationDuration: '8s', 
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear',
                marginBottom: 0, 
            },
            default: {
                marginBottom: 0,
            }
        }),

        // 🛑 Card Inner Glow Overlay
        cardInnerGlow: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: GENEROUS_RADIUS,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            zIndex: -1,
            boxShadow: `inset 0 0 20px 5px ${VIBRANT_ACCENT}50`, 
        },
        
        // Dummy Filter Tag Styles
        dummyFiltersContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: '100%',
            paddingHorizontal: 1, 
            marginTop: 1, 
        },
        dummyFilterPill: {
            paddingHorizontal: 2, 
            paddingVertical: 3,   
            borderRadius: 15,
            margin: 3,              
            borderWidth: 1,
            borderColor: VIBRANT_ACCENT + '50',
        },


        // CTA Button Style
        primaryCtaButton: {
            borderRadius: BUTTON_RADIUS,
            transition: 'all 0.3s ease',
            marginTop: 10,
            alignSelf: 'center',
        },
        pulsingCtaShadow: Platform.select({
            web: {
                animationKeyframes: pulsatingKeyframes,
                animationDuration: '2s',
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out',
            },
            default: {}
        }),
        primaryCtaText: {
            fontWeight: '900',
            letterSpacing: 0.5,
        },
    });
};

export default HeroSection;