// src/screens/HeroHeader.jsx (या src/components/web/HeroHeader.jsx)

import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// 🌐 Global Constants (Responsiveness & Style Foundation)
const { width } = Dimensions.get('window'); 
const BREAKPOINT = 768; 
const MAX_WEB_WIDTH = '98vw'; 
const GENEROUS_RADIUS = 30; 

const HeroHeader = ({
    appLogo, 
    PRIMARY_COLOR, 
    VIBRANT_ACCENT, 
    DEEP_3D_SHADOW, 
    SUBTLE_SHADOW, 
    FLOATING_HEADER_STYLE, 
    getDynamicSize,
    handleLogin, 
    colors 
}) => {
    
    // 🎨 Get Enhanced Styles
    const localStyles = getStyles({ PRIMARY_COLOR, VIBRANT_ACCENT, GENEROUS_RADIUS, MAX_WEB_WIDTH, BREAKPOINT });

    return (
        // 👑 ENHANCED STICKY HEADER BAR (3D TILT EFFECT)
        <View
            style={[
                localStyles.headerBar,
                localStyles.headerBar3DTilt, // 🛑 NEW: Subtle 3D tilt
                {
                    backgroundColor: colors.card,
                    // DEEP_3D_SHADOW for maximum floating effect
                    ...DEEP_3D_SHADOW, 
                    // FLOATING_HEADER_STYLE for sticky animation
                    ...FLOATING_HEADER_STYLE, 
                }
            ]}
        >
            {/* 🌟 LOGO & TITLE CONTAINER (Animated and Elegant Hover) */}
            <View 
                style={[
                    localStyles.headerLogoContainer,
                    localStyles.logoAreaHoverEffect
                ]}
            > 
                <Image
                    source={appLogo}
                    style={localStyles.headerLogo}
                    resizeMode="contain"
                />
                {/* DYNAMIC FONT SIZE */}
                <Text style={[localStyles.headerTitle, { 
                    color: PRIMARY_COLOR, 
                    fontSize: getDynamicSize(22, 12), 
                    // Subtle text shadow for a 3D/glow effect
                    textShadow: `1px 1px 2px ${PRIMARY_COLOR}50` 
                }]}>FYF</Text>
            </View>

            {/* 🚀 LOGIN BUTTON (Attractive, 3D Press Effect) */}
            <TouchableOpacity
                style={[
                    localStyles.loginButton, 
                    { 
                        backgroundColor: PRIMARY_COLOR, 
                        // SUBTLE_SHADOW for base lift
                        ...SUBTLE_SHADOW,
                        // Enhanced initial glow for eye-catching look
                        boxShadow: `0 0 12px 0px ${VIBRANT_ACCENT}A0, ${SUBTLE_SHADOW.boxShadow || ''}`
                    }
                ]}
                onPress={handleLogin}
            >
                {/* DYNAMIC ICON SIZE */}
                <Icon name="log-in-outline" size={getDynamicSize(16, 12)} color={VIBRANT_ACCENT} />
            </TouchableOpacity>
        </View>
    );
};


const getStyles = ({ PRIMARY_COLOR, VIBRANT_ACCENT, GENEROUS_RADIUS, MAX_WEB_WIDTH, BREAKPOINT }) => {
    
    // 🎨 Hover/Active styles defined as constants for cleaner use in StyleSheet.create
    const LOGO_HOVER_SHADOW = `0 10px 20px rgba(0, 0, 0, 0.15)`; // Deeper, soft hover for lift
    const BUTTON_HOVER_SHADOW = `0 0 25px ${VIBRANT_ACCENT}, 0 10px 20px rgba(0, 0, 0, 0.3)`; // Luminous and deep
    const BUTTON_ACTIVE_SHADOW = `0 0 5px ${VIBRANT_ACCENT}50`; // Press effect shadow

    return StyleSheet.create({
        // 👑 HEADER BAR STYLE (Elegant, Responsive Base)
        headerBar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: width > BREAKPOINT ? 15 : 10, 
            borderRadius: GENEROUS_RADIUS,
            marginHorizontal: '1%',
            marginTop: 10,
            marginBottom: 5,
            zIndex: 10, 
            alignSelf: 'center',
            width: MAX_WEB_WIDTH,
            overflow: 'visible',
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        },
        // 🛑 NEW: Subtle 3D tilt effect for the entire header bar
        headerBar3DTilt: {
            transformPerspective: 1000,
            transform: [
                { rotateX: '0deg' }, // Initial State
                { translateZ: 50 }
            ],
            // Optional: Hover to increase tilt/lift
            ':hover': {
                 transform: [
                    { rotateX: '1deg' }, 
                    { translateZ: 60 }
                ],
            }
        },
        // 👑 HEADER LOGO CONTAINER STYLE (Animated)
        headerLogoContainer: { 
            flexDirection: 'row',
            alignItems: 'center',
            padding: 5,
            borderRadius: 15, 
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
        },
        logoAreaHoverEffect: {
            // Subtle Scale and Soft Shadow on hover (Elegant 3D lift)
            ':hover': {
                transform: [{ scale: 1.05 }],
                boxShadow: LOGO_HOVER_SHADOW, 
            },
        },
        // 👑 HEADER LOGO STYLE (Modern)
        headerLogo: { 
            height: 30, 
            width: 30, 
            marginRight: 8,
        },
        // 👑 ENHANCED HEADER TITLE STYLE
        headerTitle: {
            fontWeight: '900', 
            letterSpacing: 1.5, 
        },
        // 👑 LOGIN BUTTON STYLE (Attractive, 3D Press Effect)
        loginButton: {
            width: 38, // Slightly bigger
            height: 38, // Slightly bigger
            borderRadius: 19, // Perfect circle
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Faster transition for button
            
            // 🚀 HOVER EFFECT (More attractive and luminous)
            ':hover': {
                transform: [{ scale: 1.3 }, { rotate: '5deg' }], // Stronger scale
                boxShadow: BUTTON_HOVER_SHADOW,
                cursor: 'pointer',
            },
            
            // 🚀 ACTIVE/PRESS EFFECT (Realistic 3D push down)
            ':active': {
                transform: [{ scale: 1.15 }, { translateY: 2 }, { rotate: '0deg' }], // Push down
                backgroundColor: PRIMARY_COLOR, // Keep color stable
                boxShadow: BUTTON_ACTIVE_SHADOW, // Shrink shadow for "pressed" look
            }
        },
    });
};

export default HeroHeader;