// src/components/PropertyDetail/PropertyQuickSpecs.jsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SUBTLE_SHADOW, getWebShadow } from './DetailUtilityComponents';

const PropertyQuickSpecs = ({ 
    propertyDetails = {}, 
    systemInfo = {}, 
    listingGoalColor, 
    dynamicStyles,
    calculateDaysListed,
    formatDaysListed,
}) => {

    // 🌟 Quick Details Data Structure for Grid (High-Impact)
    const quickDetails = [
        { icon: "home", name: 'Type', value: propertyDetails.propertyType || 'N/A' },
        { icon: "bed", name: 'Bedrooms', value: propertyDetails.bhkOrRooms || 'N/A' },
        { icon: "water", name: 'Bathrooms', value: propertyDetails.bathrooms + ' Bath' },
        { 
            icon: "expand", 
            name: 'Carpet Area', 
            value: propertyDetails.totalCarpetAreaSqft && propertyDetails.totalCarpetAreaSqft !== 'N/A' ? `${propertyDetails.totalCarpetAreaSqft} sq.ft` : 'N/A', 
        },
        { icon: "color-fill", name: 'Furnishing', value: propertyDetails.furnishingStatus || 'Unfurnished' },
        { 
            icon: "time", 
            name: 'Listed Since', 
            value: formatDaysListed(calculateDaysListed(systemInfo.createdAt)),
        },
    ];

    return (
        <View style={[dynamicStyles.specsGridContainer]}> 
            {quickDetails.map((item, index) => (
                <TouchableOpacity 
                    key={index} 
                    activeOpacity={0.7}
                    style={[
                        dynamicStyles.specPillGridItem, 
                        { 
                            backgroundColor: dynamicStyles.colors.card, 
                            ...getWebShadow(SUBTLE_SHADOW) 
                        }
                    ]}
                >
                    <Icon name={item.icon} size={dynamicStyles.specIconSize} color={listingGoalColor} />
                    <Text style={[dynamicStyles.specTitleText, { color: dynamicStyles.colors.text + '80' }]}>{item.name}</Text>
                    <Text style={[dynamicStyles.specValueText, { color: dynamicStyles.colors.text }]}>{item.value}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default PropertyQuickSpecs;