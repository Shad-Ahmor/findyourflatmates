// src/components/PropertyDetail/PropertyModals.jsx

import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StarRating, getWebShadow, DEEP_SOFT_SHADOW, SUBTLE_SHADOW } from './DetailUtilityComponents';


// --- Negotiation Modal Component ---
const NegotiationModalComponent = ({
    isModalVisible,
    setIsModalVisible,
    property,
    negotiationAmount,
    setNegotiationAmount,
    listingGoalColor,
    dynamicStyles,
    colors
}) => {
    
    const submitNegotiation = () => {
        if (!negotiationAmount || isNaN(negotiationAmount) || parseFloat(negotiationAmount) <= 0) {
            Alert.alert("Invalid Offer", "Please enter a valid amount.");
            return;
        }

        // --- Actual Negotiation API Call would go here ---
        Alert.alert("Negotiation Submitted", `Your offer of ₹${parseFloat(negotiationAmount).toLocaleString('en-IN')} has been submitted.`);
        // -------------------------------------------------
        
        setIsModalVisible(false);
        setNegotiationAmount('');
    };
    
    const maxPriceText = property?.financials?.maxNegotiablePrice 
        ? `Owner is willing to accept a minimum of ₹${property.financials.maxNegotiablePrice.toLocaleString('en-IN')}.`
        : property?.financials?.negotiationMarginPercent > 0
        ? `Price is negotiable by up to ${property.financials.negotiationMarginPercent}% of the current price.`
        : `Negotiation margin is not specified by the owner.`;

    return (
        <Modal
            animationType="fade" 
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
        >
            <View style={dynamicStyles.modalOverlay}>
                <View style={[dynamicStyles.modalContent, { 
                    backgroundColor: colors.card, 
                    borderColor: colors.border, 
                    ...getWebShadow(SUBTLE_SHADOW)
                }]}>
                    <Text style={[dynamicStyles.sectionTitle, { color: colors.text }]}>Submit Your Offer 💰</Text>
                    <Text style={{ color: colors.text + '80', marginBottom: 5, fontSize: dynamicStyles.modalTextSize }}>
                        Current Price: **₹{(property?.price || 0).toLocaleString('en-IN')}**
                    </Text>
                    {property?.financials && (
                        <Text style={{ color: listingGoalColor, marginBottom: dynamicStyles.modalVerticalMargin, fontSize: dynamicStyles.modalSubTextSize, fontWeight: 'bold' }}>
                            {maxPriceText}
                        </Text>
                    )}
                    <TextInput
                        style={[dynamicStyles.modalInput, { borderColor: listingGoalColor, color: colors.text, backgroundColor: colors.background, borderWidth: 2 }]}
                        placeholder="Enter your negotiable amount (e.g., 22000)"
                        placeholderTextColor={colors.text + '60'}
                        keyboardType="numeric"
                        value={negotiationAmount}
                        onChangeText={setNegotiationAmount}
                    />
                    <TouchableOpacity 
                        onPress={submitNegotiation} 
                        style={[dynamicStyles.actionButton, { backgroundColor: listingGoalColor, ...getWebShadow(DEEP_SOFT_SHADOW, listingGoalColor) }]}
                    >
                        <Text style={dynamicStyles.actionButtonText}>Submit Offer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setIsModalVisible(false)} 
                        style={[dynamicStyles.actionButton, { backgroundColor: colors.secondary, marginTop: dynamicStyles.actionButtonMarginTop, ...getWebShadow(DEEP_SOFT_SHADOW, colors.secondary) }]} 
                    >
                        <Text style={dynamicStyles.actionButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};


// --- Review Modal Component ---
const ReviewModalComponent = ({
    isModalVisible,
    setIsModalVisible,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    dynamicStyles,
    colors
}) => {
    
    const submitReview = () => {
        if (!reviewComment.trim() || reviewRating === 0) {
            Alert.alert("Incomplete Review", "Please provide a rating and write a comment.");
            return;
        }

        // --- Actual Review API Call would go here ---
        Alert.alert(
            "Review Submitted! 🎉", 
            `Your ${reviewRating}-star review has been submitted. Comment: "${reviewComment.trim().substring(0, 50)}${reviewComment.trim().length > 50 ? '...' : ''}"`
        );
        // -------------------------------------------
        
        setIsModalVisible(false);
        setReviewComment('');
        setReviewRating(5);
    };
    
    return (
        <Modal
            animationType="slide" 
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
        >
            <View style={dynamicStyles.modalOverlay}>
                <View style={[dynamicStyles.modalContent, { 
                    backgroundColor: colors.card, 
                    borderColor: colors.primary + '50', 
                    borderWidth: 2, 
                    ...getWebShadow(SUBTLE_SHADOW) 
                }]}>
                    <Text style={[dynamicStyles.sectionTitle, { color: colors.text, marginBottom: dynamicStyles.modalVerticalMargin }]}>Write Your Review ✍️</Text>
                    
                    <Text style={{ color: colors.text + '80', marginBottom: 10, fontSize: dynamicStyles.modalTextSize, fontWeight: 'bold' }}>
                        Rate this property:
                    </Text>
                    
                    {/* Interactive Rating Component */}
                    <View style={dynamicStyles.ratingSelectorContainer}>
                        {[1, 2, 3, 4, 5].map((starValue) => (
                            <TouchableOpacity 
                                key={starValue} 
                                onPress={() => setReviewRating(starValue)}
                                style={{ marginHorizontal: 5 }}
                            >
                                <Icon 
                                    name={starValue <= reviewRating ? "star" : "star"} // Note: Changed star-outline to star for consistency
                                    size={dynamicStyles.ratingIconSize} 
                                    color={'#FFC700'} 
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={[dynamicStyles.reviewStarText, { color: colors.primary, marginBottom: dynamicStyles.modalVerticalMargin }]}>
                        {reviewRating} Star{reviewRating !== 1 ? 's' : ''}
                    </Text>
                    

                    <TextInput
                        style={[
                            dynamicStyles.modalInput, 
                            dynamicStyles.reviewInput, 
                            { 
                                borderColor: colors.primary, 
                                color: colors.text, 
                                backgroundColor: colors.background, 
                                borderWidth: 2 
                            }
                        ]}
                        placeholder="Share your experience (min 10 characters)"
                        placeholderTextColor={colors.text + '60'}
                        keyboardType="default"
                        multiline={true}
                        numberOfLines={4}
                        value={reviewComment}
                        onChangeText={setReviewComment}
                    />
                    <TouchableOpacity 
                        onPress={submitReview} 
                        style={[dynamicStyles.actionButton, { backgroundColor: colors.primary, ...getWebShadow(DEEP_SOFT_SHADOW, colors.primary), marginTop: dynamicStyles.actionButtonMarginTop }]}
                    >
                        <Text style={dynamicStyles.actionButtonText}>Submit Review</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setIsModalVisible(false)} 
                        style={[dynamicStyles.actionButton, { backgroundColor: colors.secondary, marginTop: dynamicStyles.actionButtonMarginTop, ...getWebShadow(DEEP_SOFT_SHADOW, colors.secondary) }]} 
                    >
                        <Text style={dynamicStyles.actionButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

// Exporting both components
export { NegotiationModalComponent, ReviewModalComponent };