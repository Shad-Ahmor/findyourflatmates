// src/components/PropertyDetail/PropertyAmenities.jsx

import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PropertyAmenities = ({ 
    propertyDetails = {}, 
    listingGoalColor, 
    dynamicStyles,
    colors
}) => {
    
    const amenitiesToDisplay = propertyDetails.selectedAmenities && propertyDetails.selectedAmenities.length > 0 
        ? propertyDetails.selectedAmenities 
        : ["24/7 Water", "Power Backup", "Lift", "Parking"];

    return (
        <View style={dynamicStyles.section}>
            <Text style={[dynamicStyles.sectionTitle, { color: colors.text }]}>Amenities ✨</Text>
             <View style={dynamicStyles.amenitiesGrid}>
                {amenitiesToDisplay.map((amenity, index) => ( 
                    <View key={index} style={[dynamicStyles.amenityItem, { backgroundColor: listingGoalColor + '20', borderWidth: 2, borderColor: listingGoalColor + '50' }]}>
                        <Icon name="checkmark-circle" size={dynamicStyles.amenityIconSize} color={listingGoalColor} style={{ marginRight: 10 }}/>
                        <Text style={[dynamicStyles.amenityText, { color: colors.text }]}>{amenity}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default PropertyAmenities;