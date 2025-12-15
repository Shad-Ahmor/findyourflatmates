// src/components/PropertyDetail/PropertyFooterDetails.jsx

import React from 'react';
import { View, Text, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

/**
 * PropertyFooterDetails Component
 * Handles the display of Reviews, System Information, and Location Map sections
 * which typically appear at the bottom of the property detail screen.
 */
const PropertyFooterDetails = ({
// Style and Theme Props
dynamicStyles,
colors,
listingGoalColor,
// Utility Props
getWebShadow,
DEEP_SOFT_SHADOW,
SUBTLE_SHADOW,
formatTimestamp,
  
// Data Props
currentReviews,
systemInfo,
location,

// Handler Props
handleWriteReview,
// handleOpenInMaps prop is now removed as logic is implemented locally
}) => {
    
    // 💡 NEW LOGIC: Implement the map opening functionality locally
    const handleOpenInMapsLocal = () => {
        if (!location) {
            Alert.alert("Location Error", "Property location is not defined.");
            return;
        }

        // 1. डेस्टिनेशन (प्रॉपर्टी लोकेशन) को URL-सेफ एन्कोड करें
        const encodedDestination = encodeURIComponent(location);
        
        // 2. ओरिजिन के लिए 'Current Location' का उपयोग करें, जिससे मैप ऐप GPS का उपयोग करे
        const encodedOrigin = encodeURIComponent('Current Location'); 
        
        // 3. Google Maps Directions URL का निर्माण करें
        // यह URL सीधे Google Maps ऐप (यदि इंस्टॉल है) या वेब ब्राउज़र में खुलता है।
        const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${encodedDestination}`;

        // 4. URL को खोलने का प्रयास करें
        Linking.openURL(mapUrl).catch((err) => {
            console.error('Failed to open primary map URL:', err);
            
            // यदि primary URL विफल होता है, तो एक सामान्य वेब-सर्च URL पर फ़ॉलबैक करें
            const webSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedDestination}`;
            
            Linking.openURL(webSearchUrl).catch((err) => {
                 console.error('Failed to open fallback map URL:', err);
                 Alert.alert("Map Error", "Could not open map application. Please check your device settings.");
            });
        });
    };

    
return (
<>
{/* 11. Reviews Section (Unchanged) */}
<View style={[dynamicStyles.section, dynamicStyles.cardStyle, { backgroundColor: colors.card, ...getWebShadow(DEEP_SOFT_SHADOW) }]}>
<View style={dynamicStyles.reviewsHeader}>
<Text style={[dynamicStyles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
Customer Reviews ({currentReviews.length}) 💬
</Text>
{/* Rating Box */}
<View style={[dynamicStyles.ratingBox, { borderWidth: 2, borderColor: listingGoalColor, backgroundColor: colors.background, paddingVertical: dynamicStyles.ratingBoxPaddingVertical }]}>
<Text style={[dynamicStyles.ratingText, { color: colors.text, marginLeft: 8 }]}>
{(parseFloat(systemInfo.rating) || 0).toFixed(1)}/5
</Text>
</View>
</View>
  
 {/* Reviews List */}
 {currentReviews.map(review => (
<View key={review.id} style={[dynamicStyles.reviewCard, { backgroundColor: colors.background, ...dynamicStyles.getWebShadow(SUBTLE_SHADOW) }]}>
<View style={dynamicStyles.reviewUserRow}>
<Text style={[dynamicStyles.reviewUser, { color: colors.text }]}>{review.user}</Text>
<View style={{ flexDirection: 'row', alignItems: 'center' }}>
 <Text style={[dynamicStyles.reviewDate, { color: colors.text + '60', marginLeft: 10 }]}>{review.date}</Text>
</View>
</View>
<Text style={[dynamicStyles.reviewComment, { color: colors.text }]}>"{review.comment}"</Text>
</View>
 ))}
 
{/* Write Review Button */}
<TouchableOpacity 
onPress={handleWriteReview}
style={[dynamicStyles.reviewButton, { borderColor: listingGoalColor, borderWidth: 3 }]}
>
<Icon name="pencil" size={dynamicStyles.reviewButtonIconSize} color={listingGoalColor} style={{ marginRight: 8 }}/>
<Text style={[dynamicStyles.reviewButtonText, { color: listingGoalColor }]}>Write a Review</Text>
</TouchableOpacity>
</View>
  
{/* 12. Listing System Information (Unchanged) */}
<View style={[dynamicStyles.section, dynamicStyles.cardStyle, { backgroundColor: colors.card, ...getWebShadow(DEEP_SOFT_SHADOW) }]}>
<Text style={[dynamicStyles.sectionTitle, dynamicStyles.infoSectionTitle, { color: colors.text }]}>Listing Status & Owner ℹ️</Text>
  
<View style={dynamicStyles.infoPillContainer}>
 {/* Posted By */}
 <View style={[dynamicStyles.infoPillWrapper, { backgroundColor: colors.background, borderWidth: 1, borderColor: listingGoalColor + '50' }]}>
<Icon name="person-circle" size={dynamicStyles.infoPillIconSize} color={listingGoalColor} style={{ marginRight: 20 }}/>
<View>
<Text style={[dynamicStyles.infoPillTitle, { color: colors.text + '80' }]}>Posted By</Text>
<Text style={[dynamicStyles.infoPillValue, { color: colors.text }]}>{systemInfo.postedBy || 'Owner/Agent'}</Text>
</View>
</View>
{/* Created At */}
<View style={[dynamicStyles.infoPillWrapper, { backgroundColor: colors.background, borderWidth: 1, borderColor: listingGoalColor + '50' }]}>
<Icon name="time" size={dynamicStyles.infoPillIconSize} color={listingGoalColor} style={{ marginRight: 20 }}/>
<View>
<Text style={[dynamicStyles.infoPillTitle, { color: colors.text + '80' }]}>Created At</Text>
<Text style={[dynamicStyles.infoPillValue, { color: colors.text }]}>{formatTimestamp(systemInfo.createdAt)}</Text>
</View>
</View>
{/* Verification Status */}
<View style={[dynamicStyles.infoPillWrapper, { backgroundColor: colors.background, borderWidth: 1, borderColor: listingGoalColor + '50' }]}>
<Icon name="server" size={dynamicStyles.infoPillIconSize} color={listingGoalColor} style={{ marginRight: 20 }}/>
<View>
<Text style={[dynamicStyles.infoPillTitle, { color: colors.text + '80' }]}>Verification Status</Text>
<Text style={[dynamicStyles.infoPillValue, { color: systemInfo.status === 'Verified' ? '#34c759' : '#FF5733' }]}>{systemInfo.status || 'Pending'}</Text>
</View>
</View>
</View>
</View>

{/* 13. Map Section */}
<View style={dynamicStyles.section}>
<Text style={[dynamicStyles.sectionTitle, { color: colors.text }]}>Location 🗺️</Text>
<View style={[dynamicStyles.mapPlaceholder, dynamicStyles.cardStyle, { backgroundColor: colors.card, ...getWebShadow(DEEP_SOFT_SHADOW) }]}>
<Icon name="map" size={dynamicStyles.mapIconSize} color={listingGoalColor} style={{ marginBottom: 15 }} />
<Text style={[dynamicStyles.mapLocationText, { color: colors.text }]}>{location}</Text>
<TouchableOpacity 
onPress={handleOpenInMapsLocal} // <-- UPDATED
style={[dynamicStyles.mapButton, { backgroundColor: listingGoalColor, ...getWebShadow(DEEP_SOFT_SHADOW, listingGoalColor) }]}
>
<Icon name="navigate-circle-outline" size={dynamicStyles.mapButtonIconSize} color="#fff" style={{ marginRight: 8 }}/>
<Text style={dynamicStyles.mapButtonText}>Open in Google Maps</Text>
</TouchableOpacity>
</View>
</View>
  
{/* Buffer Height */}
<View style={{ height: dynamicStyles.footerBufferHeight }} /> 
</>
);
};

export default PropertyFooterDetails;