// src/components/PropertyDetail/DetailUtilityComponents.jsx

import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// --- SHADOW HELPERS ---
const getWebShadow = (rnShadow, color = '#102A43') => {
    // Converts RN shadow object to Web's BoxShadow string
    if (Platform.OS === 'web') {
        const opacity = rnShadow.shadowOpacity || 0.3;
        const radius = rnShadow.shadowRadius || 10;
        const offset = rnShadow.shadowOffset?.height || 0;
        
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '16,42,67';
        };
        const baseRgb = hexToRgb(color);
        const shadowRgba = `rgba(${baseRgb}, ${opacity})`;

        return {
             boxShadow: `${rnShadow.shadowOffset?.width || 0}px ${offset}px ${radius}px ${shadowRgba}`,
             elevation: rnShadow.elevation, 
        };
    }
    return rnShadow; 
}

const DEEP_SOFT_SHADOW = {
    shadowColor: '#102A43', 
    shadowOffset: { width: 0, height: 15 }, 
    shadowOpacity: 0.35, 
    shadowRadius: 25, 
    elevation: 18, 
};
const SUBTLE_SHADOW = { 
    shadowColor: '#102A43',
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 10, 
    elevation: 6,
}
// ----------------------


// --- RATING COMPONENT ---
const StarRating = ({ rating, size = 18, color }) => { 
    const stars = [];
    const numRating = parseFloat(rating) || 0; 
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
        let name = "star-outline";
        if (i < fullStars) {
            name = "star";
        } else if (i === fullStars && hasHalfStar) {
            name = "star-half-sharp";
        }
        stars.push(<Icon key={i} name={name} size={size} color={color} style={{ marginLeft: 2 }} />);
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
}; 
// ------------------------

// --- INFO PILL (Financials/System Info) ---
const InfoPill = ({ icon, title, value, colors, valueColor, accentColor, dynamicStyles }) => (
    <View style={[dynamicStyles.infoPillWrapper, { backgroundColor: colors.background, borderWidth: 1, borderColor: accentColor + '50' }]}>
        <Icon name={icon} size={dynamicStyles.infoPillIconSize} color={accentColor} style={{ marginRight: 20 }}/>
        <View>
            <Text style={[dynamicStyles.infoPillTitle, { color: colors.text + '80' }]}>{title}</Text>
            <Text style={[dynamicStyles.infoPillValue, { color: valueColor || colors.text }]}>{value}</Text>
        </View>
    </View>
);
// ------------------------

// --- PREFERENCE PILL (Used in PropertyPreferences) ---
const PreferencePill = ({ icon, title, value, colors, accentColor, dynamicStyles }) => (
    <View style={[dynamicStyles.preferencePill, { backgroundColor: colors.card, borderColor: accentColor + '50', borderWidth: 2, ...getWebShadow(SUBTLE_SHADOW) }]}>
        <Icon name={icon} size={dynamicStyles.preferenceIconSize} color={accentColor} />
        <Text style={[dynamicStyles.preferenceTitle, { color: colors.text + '80' }]}>{title}</Text>
        <Text style={[dynamicStyles.preferenceValue, { color: colors.text }]}>{value}</Text>
    </View>
);
// ------------------------

// --- DETAIL TILE (Used in PropertyAddressDetails/Detailed Info) ---
const DetailTile = ({ icon, label, value, colors, accentColor, dynamicStyles }) => (
    <View style={[dynamicStyles.detailTileWrapper, { backgroundColor: colors.background, borderWidth: 1, borderColor: accentColor + '50' }]}>
        <Icon name={icon} size={dynamicStyles.infoPillIconSize} color={accentColor} />
        <Text style={[dynamicStyles.detailTileLabel, { color: colors.text + '80' }]}>{label}</Text>
        <Text style={[dynamicStyles.detailTileValue, { color: colors.text }]}>{value}</Text>
    </View>
);
// ------------------------


export { 
    InfoPill, 
    PreferencePill, 
    DetailTile, 
    StarRating, 
    getWebShadow, 
    DEEP_SOFT_SHADOW, 
    SUBTLE_SHADOW 
};