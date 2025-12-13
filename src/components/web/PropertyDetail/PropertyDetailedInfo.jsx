// src/components/PropertyDetail/PropertyDetailedInfo.jsx

import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DetailTile, DEEP_SOFT_SHADOW, getWebShadow } from './DetailUtilityComponents';

const PropertyDetailedInfo = ({ 
    propertyDetails = {}, 
    listingGoalColor, 
    dynamicStyles, 
    colors 
}) => {

    // 🆕 Data Structure for Detailed Information Section (Defined here)
    const detailedInfo = [
        { icon: "layers", label: 'Building Age', value: propertyDetails.buildingAge > 0 ? `${propertyDetails.buildingAge} years` : 'New/N/A' },
        { icon: "document", label: 'Ownership Type', value: propertyDetails.ownershipType || 'N/A' },
        { icon: "wallet", label: 'Maintenance Charges', value: propertyDetails.maintenanceCharges > 0 ? `₹${(propertyDetails.maintenanceCharges).toLocaleString('en-IN')}/m` : 'Included/N/A' },
        { icon: "compass", label: 'Facing', value: propertyDetails.facing || 'N/A' },
        { icon: "car", label: 'Parking', value: propertyDetails.parking || 'None' },
        { icon: "lock-closed", label: 'Gated Security', value: propertyDetails.gatedSecurity ? 'Yes' : 'No' },
        { icon: "grid", label: 'Flooring Type', value: Array.isArray(propertyDetails.flooringType) ? propertyDetails.flooringType.join(', ') : propertyDetails.flooringType || 'N/A' },
        { icon: "locate", label: 'Nearby Landmark', value: propertyDetails.nearbyLocation || 'None Specified' },
    ].filter(item => item.value !== 'N/A' && item.value !== 'None Specified' && item.value !== 'New/N/A'); 


    if (detailedInfo.length === 0) {
        return null;
    }

    return (
        <View style={[dynamicStyles.section, dynamicStyles.cardStyle, { 
            backgroundColor: colors.card, 
            ...getWebShadow(DEEP_SOFT_SHADOW) 
        }]}>
            <Text style={[dynamicStyles.sectionTitle, dynamicStyles.infoSectionTitle, { color: colors.text }]}>Detailed Information 🔍</Text>
            
            <View style={dynamicStyles.detailTileGrid}> 
                {detailedInfo.map((item, index) => (
                    <DetailTile 
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
            
            {/* Display Furnishing Extras if available */}
            {propertyDetails.furnishingDetails && Array.isArray(propertyDetails.furnishingDetails) && propertyDetails.furnishingDetails.length > 0 && (
                <Text style={[dynamicStyles.infoDetailText, { color: colors.text, marginTop: dynamicStyles.infoPillContainerMarginBottom / 2 }]}>
                    <Icon name="cube" size={dynamicStyles.infoDetailIconSize} color={listingGoalColor} /> **Furnishing Extras:** {propertyDetails.furnishingDetails.join(', ')}
                </Text>
            )}
        </View>
    );
};

export default PropertyDetailedInfo;