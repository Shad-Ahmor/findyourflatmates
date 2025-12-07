// src/components/web/WebFilterBar.jsx

import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// 🌟 NOTE: Relying on the 'colors' prop passed from the parent component.

// -----------------------------------------------------------------
// 🎨 ENHANCED DISNEY-ESQUE STYLES & CONSTANTS (Theme-Independent Geometry)
// -----------------------------------------------------------------
const GENEROUS_RADIUS = 30; // Ultra-rounded corners
const BUTTON_RADIUS = 18; 
const ANIMATION_DURATION = '0.3s';
// -----------------------------------------------------------------

// Simplified web style for hover (Matching general web UI approach)
const BASE_ACTION_BUTTON_WEB_STYLES = Platform.select({
     web: { transition: `opacity ${ANIMATION_DURATION} ease-out`, cursor: 'pointer', ':hover': { opacity: 0.9 } }
});


// Helper to determine dropdown text
const getDropdownText = (type, value, bhkType) => {
    if (type === 'bhk') {
        return bhkType.length > 0 ? `${bhkType.length} Rooms Selected` : 'BHK / Rooms';
    }
    // Handles City, Status, House Type
    return value || (type.charAt(0).toUpperCase() + type.slice(1)); 
};

// 🌟 UPDATED: DistanceFilterSection Component (Now fully theme-aware)
const DistanceFilterSection = ({ colors, SUBTLE_SHADOW_DYNAMIC }) => {
    const [distance, setDistance] = useState(10); // Simulated distance state
    const MAX_DISTANCE = 50;
    
    // Function to update distance safely and with clear steps
    const changeDistance = (delta) => {
        setDistance(d => Math.min(MAX_DISTANCE, Math.max(5, d + delta)));
    };
    
    return (
        <View style={sliderStyles.container}>
            {/* 1. Display Label (Vibrant) */}
            <Text style={[sliderStyles.label, { color: colors.text }]}>
                Search Radius: 
                {/* ✅ Theme: Primary color for value highlight */}
                <Text style={{ color: colors.primary, fontWeight: '900', fontSize: 20 }}> {distance} km</Text>
            </Text>
            
            {/* 2. The Track (Visual Representation) */}
            {/* ✅ Theme: Track background uses border/backgroundLight, filled track uses primary */}
            <View style={[sliderStyles.trackContainer, { backgroundColor: colors.border }]}>
                {/* The Filled Track */}
                <View 
                    style={[
                        sliderStyles.filledTrack, 
                        { 
                            width: `${(distance / MAX_DISTANCE) * 100}%`,
                            backgroundColor: colors.primary, // Dynamic primary color
                        }
                    ]}
                />
            </View>

            {/* 3. Controls (Vibrant 3D Buttons) */}
            <View style={sliderStyles.controlsRow}>
                {/* Minus Button (-5km) */}
                <TouchableOpacity 
                    onPress={() => changeDistance(-5)} 
                    disabled={distance <= 5} // Disable when at minimum
                    style={[
                        sliderStyles.controlButton, 
                        { 
                            backgroundColor: colors.card, 
                            borderColor: colors.border, 
                            opacity: distance <= 5 ? 0.5 : 1, // Visual feedback for disabled
                            ...SUBTLE_SHADOW_DYNAMIC // Dynamic shadow
                        },
                        BASE_ACTION_BUTTON_WEB_STYLES
                    ]}
                >
                    {/* ✅ Theme: Secondary color for icon (or error for remove) */}
                    <Icon name="remove-circle-outline" size={24} color={colors.secondary || colors.error} />
                </TouchableOpacity>

                {/* Current Value Pill (The "Thumb" replacement) */}
                <View style={[
                    sliderStyles.valuePill, 
                    { 
                        backgroundColor: colors.accent, // Dynamic Accent Pill
                        ...SUBTLE_SHADOW_DYNAMIC,
                        shadowColor: colors.accent // Dynamic shadow color
                    }
                ]}>
                    {/* ✅ Theme: Icon color uses card (contrast on accent) */}
                    <Icon name="pin" size={16} color={colors.card} style={{ marginRight: 5 }} />
                    {/* ✅ Theme: Text color uses white/card (contrast on accent) */}
                    <Text style={[sliderStyles.valuePillText, { color: colors.card }]}>{distance} km</Text>
                </View>

                {/* Plus Button (+5km) */}
                <TouchableOpacity 
                    onPress={() => changeDistance(5)} 
                    disabled={distance >= MAX_DISTANCE} // Disable when at maximum
                    style={[
                        sliderStyles.controlButton, 
                        { 
                            backgroundColor: colors.card, 
                            borderColor: colors.border, 
                            opacity: distance >= MAX_DISTANCE ? 0.5 : 1, // Visual feedback for disabled
                            ...SUBTLE_SHADOW_DYNAMIC 
                        },
                        BASE_ACTION_BUTTON_WEB_STYLES
                    ]}
                >
                    {/* ✅ Theme: Primary color for icon */}
                    <Icon name="add-circle-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

// 🌟 MODIFICATION: WebFilterBar component
const WebFilterBar = ({
    colors, // Relying solely on this prop
    city,
    bhkType,
    status,
    houseType,
    setHouseType,
    openDropdown,
    searchText,
    setSearchText,
}) => {
    
    // Fallback Colors removed, assuming colors object is available.

    // --- Dynamic Shadow Setup ---
    // Use colors.text as the base shadow color for theme consistency
    const SHADOW_BASE = colors.text; 
    
    // Deep Shadow for the main bar container
    const DEEP_SOFT_SHADOW_DYNAMIC = {
        boxShadow: `0 15px 30px 0px ${SHADOW_BASE}40`, // ~25% opacity
        shadowColor: SHADOW_BASE,
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.35,
        shadowRadius: 30,
        elevation: 20,
    };

    // Subtle Shadow for interactive elements
    const SUBTLE_SHADOW_DYNAMIC = { 
        boxShadow: `0 4px 10px 0px ${SHADOW_BASE}20`, // ~12% opacity
        shadowColor: SHADOW_BASE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    };
    // ----------------------------

    const isBhkActive = bhkType && bhkType.length > 0;

    return (
        <View style={[styles.container, { backgroundColor: colors.card, ...DEEP_SOFT_SHADOW_DYNAMIC }]}> 
            
            {/* 1. Search Input - Polished Inset Look */}
            <View style={[
                styles.searchInputContainer, 
                { 
                    borderColor: colors.primary + '30', // ✅ Theme: Border uses primary color
                    backgroundColor: colors.background, // ✅ Theme: Background uses background color
                    // ✅ Theme: Box shadow uses a mix of colors (white for inner glow)
                    boxShadow: `inset 0 2px 4px ${SHADOW_BASE}15, 0 0 10px 0px ${colors.white}50`, 
                }
            ]}>
                {/* ✅ Theme: Icon color uses primary color */}
                <Icon name="search" size={24} color={colors.primary} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search Locality, Landmark, or Project..."
                    placeholderTextColor={colors.textSecondary} // ✅ Theme: Placeholder uses secondary text color
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            {/* 2. Dropdowns - Vibrant Elevated Buttons */}
            <View style={styles.dropdownsRow}>
                {/* City */}
                <TouchableOpacity
                    style={[
                        styles.dropdownButton, 
                        { 
                            backgroundColor: colors.card, 
                            borderColor: city ? colors.accent : colors.border, // ✅ Theme: Active border uses accent, inactive uses border
                            borderWidth: city ? 2 : 1, 
                            ...SUBTLE_SHADOW_DYNAMIC // ✅ Dynamic shadow
                        },
                        BASE_ACTION_BUTTON_WEB_STYLES
                    ]}
                    onPress={() => openDropdown('city')}
                >
                    {/* ✅ Theme: Icon color uses primary */}
                    <Icon name="business-outline" size={22} color={colors.primary} />
                    <Text style={[styles.dropdownText, { color: city ? colors.text : colors.textSecondary }]}>
                        {getDropdownText('City', city)}
                    </Text>
                </TouchableOpacity>

                {/* BHK / Rooms */}
                <TouchableOpacity
                    style={[
                        styles.dropdownButton, 
                        { 
                            backgroundColor: colors.card, 
                            borderColor: isBhkActive ? colors.accent : colors.border,
                            borderWidth: isBhkActive ? 2 : 1,
                            ...SUBTLE_SHADOW_DYNAMIC 
                        },
                        BASE_ACTION_BUTTON_WEB_STYLES
                    ]}
                    onPress={() => openDropdown('bhk')}
                >
                    <Icon name="bed-outline" size={22} color={colors.primary} />
                    <Text style={[styles.dropdownText, { color: isBhkActive ? colors.text : colors.textSecondary }]}>
                        {getDropdownText('bhk', null, bhkType)}
                    </Text>
                </TouchableOpacity>

                {/* Status */}
                <TouchableOpacity
                    style={[
                        styles.dropdownButton, 
                        { 
                            backgroundColor: colors.card, 
                            borderColor: status ? colors.accent : colors.border,
                            borderWidth: status ? 2 : 1,
                            ...SUBTLE_SHADOW_DYNAMIC 
                        },
                        BASE_ACTION_BUTTON_WEB_STYLES
                    ]}
                    onPress={() => openDropdown('status')}
                >
                    <Icon name="keypad-outline" size={22} color={colors.primary} />
                    <Text style={[styles.dropdownText, { color: status ? colors.text : colors.textSecondary }]}>
                        {getDropdownText('Status', status)}
                    </Text>
                </TouchableOpacity>

                {/* House Type */}
                <TouchableOpacity
                    style={[
                        styles.dropdownButton, 
                        { 
                            backgroundColor: colors.card, 
                            borderColor: houseType ? colors.accent : colors.border,
                            borderWidth: houseType ? 2 : 1,
                            ...SUBTLE_SHADOW_DYNAMIC 
                        },
                        BASE_ACTION_BUTTON_WEB_STYLES
                    ]}
                    onPress={() => openDropdown('houseType')}
                >
                    <Icon name="home-outline" size={22} color={colors.primary} />
                    <Text style={[styles.dropdownText, { color: houseType ? colors.text : colors.textSecondary }]}>
                        {getDropdownText('House Type', houseType)}
                    </Text>
                </TouchableOpacity>
            </View>
            
            {/* 3. Distance/Range Slider (Now a Button-Controlled Section) */}
            <View style={[styles.sliderWrapper, { borderTopColor: colors.border }]}> 
                <DistanceFilterSection colors={colors} SUBTLE_SHADOW_DYNAMIC={SUBTLE_SHADOW_DYNAMIC} /> 
            </View>
            
            {/* 4. Search Button - Grand Action Button */}
            <TouchableOpacity 
                style={[
                    styles.searchButton, 
                    { 
                        backgroundColor: colors.primary, // ✅ Theme: Background uses primary color
                        // ✅ Theme: Box shadow uses primary color for glow
                        boxShadow: `0 8px 20px 0px ${colors.primary + '80'}`, 
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 10 }, 
                        shadowOpacity: 0.7, 
                        shadowRadius: 15, 
                        elevation: 15,
                        transform: [{ scale: 1.02 }] 
                    },
                    BASE_ACTION_BUTTON_WEB_STYLES
                ]}
                onPress={() => console.log('Performing Search with Filters...')}
            >
                {/* ✅ Theme: Icon and Text color use white */}
                <Icon name="rocket-outline" size={26} color={colors.white} style={{ marginRight: 10 }} />
                <Text style={[styles.searchButtonText, { color: colors.white }]}>Launch Property Search</Text>
            </TouchableOpacity>

        </View>
    );
};

// --- Styles for WebFilterBar (mostly layout, colors handled inline) ---
const styles = StyleSheet.create({
    container: {
        padding: 30, 
        borderRadius: GENEROUS_RADIUS,
        width: '100%',
        marginBottom: 20,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15, 
        paddingHorizontal: 25,
        borderRadius: BUTTON_RADIUS,
        borderWidth: 1,
        marginBottom: 25, 
    },
    searchIcon: {
        marginRight: 15,
    },
    searchInput: {
        flex: 1,
        fontSize: 18, 
        padding: 0,
        outlineStyle: 'none', 
    },
    dropdownsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginBottom: 20,
        gap: 12, 
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20, 
        paddingVertical: 12,
        borderRadius: BUTTON_RADIUS,
        width: '24%', 
        justifyContent: 'center',
        minHeight: 55, 
        borderWidth: 1, // Retained border for visual separation
    },
    dropdownText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '700', 
        textAlign: 'center',
    },
    sliderWrapper: {
        paddingTop: 25, 
        marginTop: 25, 
        borderTopWidth: 1, 
        // borderTopColor handled inline
    },
    searchButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20, 
        borderRadius: BUTTON_RADIUS,
        marginTop: 35, 
        // Background and Shadow handled inline
    },
    searchButtonText: {
        // color: '#FFF' removed, now handled inline
        fontWeight: '900', 
        fontSize: 22, 
        marginLeft: 10,
    }
});

// --- Styles for the DistanceFilterSection (New Slider Styles - Layout Only) ---
const sliderStyles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 25,
        textAlign: 'center',
    },
    // The Track
    trackContainer: {
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
        position: 'relative',
        marginHorizontal: 15, // Space for controls
        marginBottom: 20,
        // background color handled inline
    },
    filledTrack: {
        height: '100%',
        // background color handled inline
    },
    // Controls Row
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    // Control Buttons
    controlButton: {
        padding: 10,
        borderRadius: 9999, // Circular button
        borderWidth: 1,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        // colors/shadows handled inline
    },
    // Gold Value Pill
    valuePill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        // colors/shadows handled inline
    },
    valuePillText: {
        // color: '#FFF' removed, now handled inline
        fontWeight: '900',
        fontSize: 18,
    }
});

export default WebFilterBar;