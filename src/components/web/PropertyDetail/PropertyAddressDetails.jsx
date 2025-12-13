// src/components/PropertyDetail/PropertyAddressDetails.jsx

import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DetailTile } from './DetailUtilityComponents'; // Assume this component is defined elsewhere

/**
 * PropertyAddressDetails Component
 * Displays the granular address details in a grid format.
 */
const PropertyAddressDetails = ({ addressDetails, listingGoalColor, dynamicStyles, colors }) => {

    const DetailTileFallback = ({ icon, label, value, colors, accentColor, dynamicStyles }) => (
        <View style={[dynamicStyles.detailTileWrapper, { backgroundColor: colors.background, borderWidth: 1, borderColor: accentColor + '50' }]}>
            <Icon name={icon} size={dynamicStyles.infoPillIconSize} color={accentColor} />
            <Text style={[dynamicStyles.detailTileLabel, { color: colors.text + '80' }]}>{label}</Text>
            <Text style={[dynamicStyles.detailTileValue, { color: colors.text }]}>{value}</Text>
        </View>
    );

    const TileComponent = DetailTile || DetailTileFallback;

    // Data structure for rendering the address details
    const addressInfo = [
        { icon: "pin", label: 'Flat/Unit No.', value: addressDetails.flatNumber },
        { icon: "map", label: 'Area', value: addressDetails.area },
        { icon: "business", label: 'City', value: addressDetails.city },
        { icon: "send", label: 'Pincode', value: addressDetails.pincode },
        { icon: "location-outline", label: 'District', value: addressDetails.districtName },
        { icon: "earth", label: 'State', value: addressDetails.stateName },
    ].filter(item => item.value); // Only show fields that have a value

    if (addressInfo.length === 0) {
        return null;
    }

    return (
        <View style={[dynamicStyles.section, dynamicStyles.cardStyle, { backgroundColor: colors.card }]}>
            <Text style={[dynamicStyles.sectionTitle, dynamicStyles.infoSectionTitle, { color: colors.text }]}>Full Address Details 🏠</Text>
            
            <View style={dynamicStyles.detailTileGrid}> 
                {addressInfo.map((item, index) => (
                    <TileComponent 
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        value={item.value}
                        colors={colors}
                        accentColor={listingGoalColor}
                        dynamicStyles={dynamicStyles}
                    />
                ))}
            </View>
        </View>
    );
};

export default PropertyAddressDetails;