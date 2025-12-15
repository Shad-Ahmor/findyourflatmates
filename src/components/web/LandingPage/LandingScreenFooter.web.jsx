import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Define the BREAKPOINT here
const BREAKPOINT = 768;

// UPDATED: Component now accepts 'navigation' prop
const LandingScreenFooter = ({ colors, dynamicWidth, MAX_WEB_WIDTH, VIBRANT_ACCENT, PRIMARY_COLOR, navigation }) => {

    // Dynamic checks based on passed dynamicWidth
    const isMobile = dynamicWidth <= BREAKPOINT;
    
    // UPDATED: Use 48% on mobile for side-by-side columns, 45% on web for space-around.
    const columnWidth = isMobile ? '48%' : '45%';

    return (
        <View style={[styles.footerContainer, { backgroundColor: colors.card + 'e0', borderTopColor: colors.border }]}>
            
            {/* --- 1. MAIN CONTENT (LINKS) --- */}
            <View 
                style={[
                    styles.footerContent, 
                    { 
                        // ALWAYS 'row' now for side-by-side view on all devices (as requested)
                        flexDirection: 'row', 
                        maxWidth: MAX_WEB_WIDTH,
                        width: '100%', 
                        // mobile: 'space-between' to push to edges (48% + margins)
                        // web: 'space-around' for better center distribution
                        justifyContent: isMobile ? 'space-between' : 'space-around', 
                    }
                ]}
            >

                {/* 3. Company */}
                <View style={[styles.footerSection, { width: columnWidth }]}> 
                    {/* Magical Heading */}
                    <Text style={[styles.footerHeading, { color: colors.text, borderBottomColor: VIBRANT_ACCENT }]}>
                        <Icon name="business-outline" size={20} color={VIBRANT_ACCENT} style={styles.headingIcon} />
                        Company
                    </Text>
                    {['About Us', 'Careers', 'Blog', 'Contact Support'].map((item, index) => (
                        <Text 
                            key={index} 
                            style={[styles.footerLink, { color: colors.text + 'a0', ':hover': { color: PRIMARY_COLOR, textDecorationLine: 'underline' } }]}
                        >
                            {item}
                        </Text>
                    ))}
                </View>

                {/* 4. Legal */}
                <View style={[styles.footerSection, { width: columnWidth }]}>
                    {/* Magical Heading */}
                    <Text style={[styles.footerHeading, { color: colors.text, borderBottomColor: VIBRANT_ACCENT }]}>
                        <Icon name="shield-outline" size={20} color={VIBRANT_ACCENT} style={styles.headingIcon} />
                        Legal
                    </Text>
                    {['Terms of Service', 'Privacy Policy', 'Sitemap', 'FAQ'].map((item, index) => {
                        
                        let targetScreen = null;
                        if (item === 'Terms of Service') {
                            targetScreen = 'Terms';
                        } else if (item === 'Privacy Policy') {
                            targetScreen = 'Privacy';
                        }

                        return (
                            <Text 
                                key={index} 
                                // Navigation Logic Added Here
                                onPress={targetScreen ? () => navigation.navigate(targetScreen) : undefined} 
                                style={[
                                    styles.footerLink, 
                                    { 
                                        color: colors.text + 'a0', 
                                        ':hover': { 
                                            color: PRIMARY_COLOR, 
                                            textDecorationLine: 'underline' 
                                        },
                                        // Set cursor to pointer only if it's a clickable link
                                        cursor: targetScreen ? 'pointer' : 'default',
                                    }
                                ]}
                            >
                                {item}
                            </Text>
                        );
                    })}
                </View>

            </View>

            {/* --- 2. DIVIDER --- */}
            <View style={[styles.footerDivider, { backgroundColor: colors.border, maxWidth: MAX_WEB_WIDTH }]} />
            
            {/* --- 3. BRANDING AND COPYRIGHT --- */}
            <View style={[styles.footerBrandingHeader, { maxWidth: MAX_WEB_WIDTH }]}>
                 
                 <Text style={[styles.footerCopyright, { color: colors.text + '60' }]}>
                    © {new Date().getFullYear()} GDLSofts. All rights reserved. Built with magic.
                </Text>
                <View style={styles.socialIcons}>
                    {/* Enhanced hover effect */}
                    <Icon name="logo-facebook" size={24} color={VIBRANT_ACCENT} style={[styles.socialIcon, styles.socialIconHover]} />
                    <Icon name="logo-instagram" size={24} color={VIBRANT_ACCENT} style={[styles.socialIcon, styles.socialIconHover]} />
                    <Icon name="logo-linkedin" size={24} color={VIBRANT_ACCENT} style={[styles.socialIcon, styles.socialIconHover]} />
                </View>
                  
            </View>
        </View>
    );
};

// --- STYLES (Cleaned up and enhanced for better layout and theme) ---
const styles = StyleSheet.create({
    footerContainer: {
        borderTopWidth: 1,
        marginTop: 60,
        textAlign: 'center',
        justifyContent: 'center'
    },
    
    // BRANDING SECTION HEADER (Copyright and Social Icons)
    footerBrandingHeader: {
        flexDirection: 'row',
        width: '100%',
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', // Ensures vertical alignment
        marginBottom: 20, 
        paddingHorizontal: 20, 
    },

    // MAIN CONTENT GRID (Links)
    footerContent: {
        alignSelf: 'center',
        marginBottom: 40,
        marginTop: 20,
        paddingHorizontal: 20,
        flexWrap: 'wrap', 
    },
    footerSection: {
        // Now using a calculated width (48%/45%) in JSX for responsiveness
        alignItems: 'flex-start', // Ensures all content in the column is left-aligned
    },
    footerHeading: {
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 15,
        borderBottomWidth: 3,
        paddingBottom: 5,
        width: 'fit-content', // Essential for left-aligning the underline
        flexDirection: 'row', // To align icon and text
        alignItems: 'center',
    },
    headingIcon: {
        marginRight: 8,
    },
    footerLink: {
        fontSize: 16,
        marginBottom: 8,
        transition: 'color 0.2s, text-decoration 0.2s',
    },
    socialIcons: {
        flexDirection: 'row',
        marginTop: 10,
    },
    socialIcon: {
        marginRight: 15,
        transition: 'transform 0.2s',
    },
    // Enhanced Hover for social icons
    socialIconHover: {
        ':hover': {
            transform: [{ scale: 1.3 }, { rotate: '-5deg' }], // Stronger scale and rotate for 'magic'
        },
    },
    footerDivider: {
        height: 1,
        alignSelf: 'center',
        width: '100%',
        marginBottom: 20,
    },
    footerCopyright: {
        fontSize: 14,
        textAlign: 'center',
    },
});

export default LandingScreenFooter;