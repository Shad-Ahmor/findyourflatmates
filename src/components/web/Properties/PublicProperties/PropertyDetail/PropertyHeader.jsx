// src/components/PropertyDetail/PropertyHeader.jsx

import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StarRating, DEEP_SOFT_SHADOW, SUBTLE_SHADOW, getWebShadow } from './DetailUtilityComponents';

const PropertyHeader = ({ 
    price, 
    location, 
    listingGoal, 
    systemInfo = {}, 
    listingGoalColor, 
    dynamicStyles, 
    colors 
}) => {
    
    const isFlatmateListing = (listingGoal === 'Flatmate');
    const isVerified = systemInfo.status === 'Verified'; 

    return (
        <View style={[dynamicStyles.priceRowContainer, dynamicStyles.cardStyle, { backgroundColor: colors.card, ...getWebShadow(DEEP_SOFT_SHADOW) }]}>
            <View style={dynamicStyles.priceRow}>
                <View style={dynamicStyles.priceTextBlock}>
                    {/* Listing Goal Tag */}
                    <View style={[dynamicStyles.goalTag, { backgroundColor: listingGoalColor + '20', borderColor: listingGoalColor, borderWidth: 2 }]}>
                        <Text style={[dynamicStyles.goalTagText, { color: listingGoalColor }]}>
                            {isFlatmateListing
                                ? 'FLATMATE LISTING' 
                                : (listingGoal || 'N/A').toUpperCase()
                            }
                        </Text>
                    </View>

                    <Text style={[dynamicStyles.priceText, { color: colors.text, marginTop: dynamicStyles.priceTextMarginTop }]}>
                        {`₹${(price || 0).toLocaleString('en-IN')}`}
                        <Text style={[dynamicStyles.pricePerText, { color: colors.text + '80' }]}>
                            {listingGoal === 'Rent' || isFlatmateListing ? '/month' : ''}
                        </Text>
                    </Text>
                    <View style={dynamicStyles.locationRow}>
                        <Icon name="location-sharp" size={dynamicStyles.locationIconSize} color={listingGoalColor} />
                        <Text style={[dynamicStyles.locationText, { color: colors.text + '90' }]}>
                            {location}
                        </Text>
                    </View>
                </View>
                
                {/* Rating and Verified Badge */}
                <View style={dynamicStyles.ratingAndVerifiedGroup}>
                    {isVerified && (
                        <Icon 
                            name="shield-checkmark" 
                            size={dynamicStyles.verifiedIconSize} 
                            color={'#34c759'} 
                            style={dynamicStyles.verifiedIcon} 
                        />
                    )}
                    <View style={[dynamicStyles.ratingBox, { backgroundColor: colors.background, borderColor: listingGoalColor, borderWidth: 2, ...getWebShadow(SUBTLE_SHADOW) }]}>
                        <StarRating rating={systemInfo.rating} size={dynamicStyles.ratingStarSize} color={'#FFC700'} /> 
                        <Text style={[dynamicStyles.ratingText, { color: colors.text, marginLeft: 8 }]}>
                            {(parseFloat(systemInfo.rating) || 0).toFixed(1)}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PropertyHeader;