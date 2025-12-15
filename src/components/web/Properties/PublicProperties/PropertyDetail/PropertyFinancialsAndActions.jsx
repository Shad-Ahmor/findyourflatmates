// src/components/PropertyDetail/PropertyFinancialsAndActions.jsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { InfoPill, DEEP_SOFT_SHADOW, getWebShadow } from './DetailUtilityComponents';

const PropertyFinancialsAndActions = ({ 
    deposit, 
    financials = {}, 
    availability = {}, 
    listingGoalColor, 
    dynamicStyles, 
    colors,
    handleNegotiate,
    navigation,
    propertyId,
    location
}) => {

    return (
        <View style={[dynamicStyles.section, dynamicStyles.cardStyle, { backgroundColor: colors.card, ...getWebShadow(DEEP_SOFT_SHADOW) }]}>
            <Text style={[dynamicStyles.sectionTitle, { color: colors.text, marginBottom: dynamicStyles.infoPillContainerMarginBottom / 6 }]}>Financial & Availability 💰</Text>
            
            <View style={dynamicStyles.infoPillContainer}>
                <InfoPill 
                    icon="key" 
                    title="Security Deposit" 
                    value={`₹${(deposit || 0).toLocaleString('en-IN')}`} 
                    colors={colors} 
                    valueColor={colors.text} 
                    accentColor={listingGoalColor}
                    dynamicStyles={dynamicStyles}
                />
                <InfoPill icon="calendar" title="Available From" value={availability.finalAvailableDate} colors={colors} accentColor={listingGoalColor} dynamicStyles={dynamicStyles}/>
                <InfoPill icon="people" title="Current Occupants" value={availability.currentOccupants?.toString() || '0'} colors={colors} accentColor={listingGoalColor} dynamicStyles={dynamicStyles}/>
                <InfoPill 
                    icon={financials.isNoBrokerage ? "wallet-sharp" : "alert-circle-sharp"} 
                    title="Brokerage" 
                    value={financials.isNoBrokerage ? "NO BROKERAGE" : "Brokerage Applicable"} 
                    colors={colors} 
                    valueColor={financials.isNoBrokerage ? '#34c759' : '#FF5733'} 
                    accentColor={listingGoalColor}
                    dynamicStyles={dynamicStyles}
                />
            </View>
            
            {/* Negotiation Info */}
            {financials.negotiationMarginPercent > 0 && ( 
                <Text style={[dynamicStyles.negotiationDiscount, { color: listingGoalColor, marginBottom: dynamicStyles.infoPillContainerMarginBottom / 1.5 }]}>
                    <Icon name="pricetags" size={dynamicStyles.negotiationDiscountIconSize} color={listingGoalColor} /> Price is negotiable by up to **{financials.negotiationMarginPercent}%**
                </Text>
            )}

            <TouchableOpacity 
                onPress={handleNegotiate} 
                style={[dynamicStyles.actionButton, { backgroundColor: listingGoalColor, ...getWebShadow(DEEP_SOFT_SHADOW, listingGoalColor) }]}
            >
                <Icon name="cash-outline" size={dynamicStyles.actionButtonIconSize} color="white" style={{ marginRight: 8 }}/>
                <Text style={dynamicStyles.actionButtonText}>NEGOTIATE PRICE</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => navigation.navigate('ChatScreen', { propertyId: propertyId, chatName: `Chat for ${location}` })}
                style={[dynamicStyles.actionButton, { backgroundColor: colors.secondary, marginTop: dynamicStyles.actionButtonMarginTop, ...getWebShadow(DEEP_SOFT_SHADOW, colors.secondary) }]}
            >
                <Icon name="chatbox-outline" size={dynamicStyles.actionButtonIconSize} color="white" style={{ marginRight: 8 }}/>
                <Text style={dynamicStyles.actionButtonText}>CONTACT OWNER/AGENT</Text>
            </TouchableOpacity>
            
        </View>
    );
};

export default PropertyFinancialsAndActions;