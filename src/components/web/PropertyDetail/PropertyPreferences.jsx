// src/components/PropertyDetail/PropertyPreferences.jsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PreferencePill } from './DetailUtilityComponents'; // Assume this component is defined elsewhere (or inline)

/**
 * PropertyPreferences Component
 * Displays the owner's preferred gender, occupation, and work location.
 */
const PropertyPreferences = ({ preferences, listingGoalColor, dynamicStyles, colors }) => {
    
    // Fallback for PreferencePill if DetailUtilityComponents is not imported/defined
    const PreferencePillFallback = ({ icon, title, value, colors, accentColor, dynamicStyles }) => (
        <View style={[dynamicStyles.preferencePill, { backgroundColor: colors.card, borderColor: accentColor + '50', borderWidth: 2 }]}>
            <Icon name={icon} size={dynamicStyles.preferenceIconSize} color={accentColor} />
            <Text style={[dynamicStyles.preferenceTitle, { color: colors.text + '80' }]}>{title}</Text>
            <Text style={[dynamicStyles.preferenceValue, { color: colors.text }]}>{value}</Text>
        </View>
    );

    const PillComponent = PreferencePill || PreferencePillFallback;
    
    return (
        <View style={dynamicStyles.section}>
            <Text style={[dynamicStyles.sectionTitle, { color: colors.text }]}>Flatmate/Tenant Preferences 👥</Text>
            <View style={dynamicStyles.preferencesRow}>
                <PillComponent 
                    icon="male-female" 
                    title="Gender" 
                    value={preferences.preferredGender || 'Any'} 
                    colors={colors} 
                    accentColor={listingGoalColor} 
                    dynamicStyles={dynamicStyles} 
                />
                <PillComponent 
                    icon="briefcase" 
                    title="Occupation" 
                    value={preferences.preferredOccupation || 'Any'} 
                    colors={colors} 
                    accentColor={listingGoalColor} 
                    dynamicStyles={dynamicStyles} 
                />
                <PillComponent 
                    icon="pin" 
                    title="Work Location" 
                    value={preferences.preferredWorkLocation || 'Any Location'} 
                    colors={colors} 
                    accentColor={listingGoalColor} 
                    dynamicStyles={dynamicStyles} 
                />
            </View>
        </View>
    );
};

export default PropertyPreferences;