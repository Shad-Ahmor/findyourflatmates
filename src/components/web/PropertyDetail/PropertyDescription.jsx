// src/components/PropertyDetail/PropertyDescription.jsx

import React from 'react';
import { View, Text } from 'react-native';
import { DEEP_SOFT_SHADOW, getWebShadow } from './DetailUtilityComponents';

const PropertyDescription = ({ 
    description, 
    dynamicStyles, 
    colors 
}) => {
    return (
        <View style={[dynamicStyles.section, dynamicStyles.cardStyle, { 
            backgroundColor: colors.card, 
            ...getWebShadow(DEEP_SOFT_SHADOW) 
        }]}>
            <Text style={[dynamicStyles.sectionTitle, { color: colors.text }]}>Description 📜</Text>
            <Text style={[dynamicStyles.descriptionText, { color: colors.text + '90' }]}>
                {description || 'No description provided for this listing. This property offers a vibrant community and modern living spaces, perfect for young professionals or families.'}
            </Text>
        </View>
    );
};

export default PropertyDescription;