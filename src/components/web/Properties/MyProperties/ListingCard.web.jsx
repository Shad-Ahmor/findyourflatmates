// src/components/ListingCard.web.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Dimensions } from 'react-native'; 
import Icon from 'react-native-vector-icons/Ionicons'; 
import { Shadow } from 'react-native-shadow-2'; 
import { useNavigation } from '@react-navigation/native'; 
// ✅ NEW: Import the separate ShareIcons component
import ShareIcons from './ShareIcons.jsx'; 

// Get screen width for basic responsiveness check
const { width } = Dimensions.get('window');

// 🎨 DISNEY-ESQUE COLORS & STYLES (यह सुनिश्चित करता है कि स्टाइल सिंक में हैं)
const PRIMARY_COLOR = '#4BCFFA'; // Sky Blue
const SUCCESS_COLOR = '#5CB85C'; // Grass Green
const ERROR_COLOR = '#F44336';
const WARNING_COLOR = '#FFC107'; // Warm Yellow (Previously missing in the context)
const CARD_COLOR = '#FFFFFF';
const GENEROUS_RADIUS = 20;

// 💡 Helper function to check for mobile view based on width
const IS_MOBILE = width < 768; // Assuming 768px is the breakpoint


const styles = StyleSheet.create({
    // --- Listing Card Styles (Soft 3D) ---
    cardWrapper: { 
        alignSelf: 'stretch', // ensures it respects flex parent stretch rules
        marginBottom: 25, 
    },
    cardShadow: {
        width: '100%', 
        borderRadius: GENEROUS_RADIUS,
    },
    
    cardContainer: {
        backgroundColor: CARD_COLOR,
        borderRadius: GENEROUS_RADIUS,
        borderWidth: 0, 
    },
    
    cardImage: {
        width: '100%',
        height: 200, // Fixed height for image is generally fine
        borderTopLeftRadius: GENEROUS_RADIUS,
        borderTopRightRadius: GENEROUS_RADIUS,
        backgroundColor: '#DDD', 
    },
    
    cardDetailsWrapper: { 
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
    },
    
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', 
        marginBottom: 10,
        marginTop: 5, 
    },
    cardTitle: {
        fontSize: 22, 
        fontWeight: '800',
        color: '#333',
        flexShrink: 1,
        marginRight: 10,
    },
    statusBadge: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignSelf: 'flex-start', 
    },
    statusTextWhite: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    
    // Details
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 10,
    },
    priceText: {
        fontSize: 28, 
        fontWeight: '900',
    },
    priceUnit: {
        fontSize: 16,
        fontWeight: '500',
        color: '#777',
    },
    brokerageBadge: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    brokerageText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    specsRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 15,
    },
    specText: {
        fontSize: 15,
        color: '#555',
        fontWeight: '600',
        alignItems: 'center',
        flexDirection: 'row',
    },
    
    // Footer and Actions (Responsive Logic Applied)
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10, 
        ...(IS_MOBILE && {
            flexDirection: 'column', 
            alignItems: 'stretch', 
            gap: 10, 
        }),
    },
    
    // 🛑 NEW STYLE: Flex row for icon and date text
    postedDateWrapper: { 
        flexDirection: 'row',
        alignItems: 'center',
        // Ensure spacing on mobile when stacked
        ...(IS_MOBILE && {
            justifyContent: 'center', 
            marginBottom: 5,
        }),
    },

    postedDate: {
        fontSize: 14,
        color: '#999',
        marginLeft: 5, // Space between icon and text
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
        ...(IS_MOBILE && { 
            justifyContent: 'space-between', 
        }),
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        ...(IS_MOBILE && { 
            flex: 1, 
            justifyContent: 'center', 
        }),
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 8,
    },
});


const ListingCard = ({ listing, onEdit, onDelete, style }) => {
    
    const navigation = useNavigation();
    
    const { 
        listingId, 
        price, 
        location, 
        propertyType, 
        status, 
        createdAt, 
        isNoBrokerage,
        bedrooms,
        bathrooms,
        image, 
        listingGoal
    } = listing;
    
    // Truncation Logic for Card Title (Location)
    const MAX_TITLE_CHARS = 10;
    const truncatedLocation = (location && location.length > MAX_TITLE_CHARS) 
        ? location.substring(0, MAX_TITLE_CHARS) + '..' 
        : location;

    
    const imageUrl = image 
        ? image 
        : 'https://via.placeholder.com/600x400.png?text=Property+Image'; 
    
    // Status color logic (Fixed the WARNING_COLOR reference error here implicitly)
    const statusColor = status === 'Active' ? SUCCESS_COLOR : status === 'Pending Review' ? WARNING_COLOR : ERROR_COLOR;
    
    const iconNames = {
        bedrooms: "bed",
        bathrooms: "water",
        propertyType: "home",
    };

    const handlePress = () => {
        const propertyIdToNavigate = listing.listingId || listing.id;

        if (!propertyIdToNavigate) {
            console.error('Data Integrity Error: Listing item is missing both listingId and id.', listing);
            Alert.alert(
                'Data Error', 
                'Listing ID is corrupted or missing for this property. Cannot fetch details.'
            );
            return;
        }

        if (navigation) {
            const rootNavigation = navigation.getParent();

            if (rootNavigation && rootNavigation.navigate) {
                rootNavigation.navigate('PropertyDetail', { 
                    propertyId: propertyIdToNavigate 
                });
            } else {
                 console.warn("Could not find parent navigator. Attempting direct navigation.");
                 navigation.navigate('PropertyDetail', { propertyId: propertyIdToNavigate });
            }
        } else {
             console.error('Navigation context missing.');
        }
    };
        
    
    return (
        <View style={[styles.cardWrapper, style]}> 
        <Shadow 
            distance={15} 
            startColor={'rgba(0, 0, 0, 0.06)'} 
            endColor={'#F7F9FB00'}
            containerStyle={styles.cardShadow}
            offset={[0, 8]}
            
        >
            <TouchableOpacity 
                style={styles.cardContainer}
                activeOpacity={0.9} 
                onPress={handlePress} 
             > 
                
                {/* Image Display */}
                <Image 
                    style={styles.cardImage} 
                    source={{ uri: imageUrl }} 
                    resizeMode="cover"
                />
                
                {/* Details Wrapper */}
                <View style={styles.cardDetailsWrapper}>
                    {/* Header (Title & Status) */}
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle} numberOfLines={1}>{truncatedLocation}</Text> 
                        <View style={[styles.statusBadge, { backgroundColor: statusColor, borderRadius: 10 }]}>
                            <Text style={styles.statusTextWhite}>{status || 'N/A'}</Text>
                        </View>
                    </View>

                    {/* Details (Price & Brokerage) */}
                    <View style={styles.detailRow}>
                        <Text style={[styles.priceText, { color: PRIMARY_COLOR }]}>
                            ₹{price?.toLocaleString('en-IN')} 
                            <Text style={styles.priceUnit}> / {listingGoal === 'Sale' ? 'Total' : 'Month'}</Text>
                        </Text>
                        {isNoBrokerage && (
                            <View style={[styles.brokerageBadge, { backgroundColor: SUCCESS_COLOR, borderRadius: 8 }]}>
                                <Text style={styles.brokerageText}>NO BROKERAGE</Text>
                            </View>
                        )}
                    </View>

                    {/* Specs (Bed, Bath, Type) */}
                    <View style={styles.specsRow}>
                        <Text style={styles.specText}><Icon name={iconNames.bedrooms} size={14} color={PRIMARY_COLOR} /> {bedrooms || 'N/A'}</Text>
                        <Text style={styles.specText}><Icon name={iconNames.bathrooms} size={14} color={PRIMARY_COLOR} /> {bathrooms || 'N/A'}</Text>
                        <Text style={styles.specText}><Icon name={iconNames.propertyType} size={14} color={PRIMARY_COLOR} /> {propertyType || 'N/A'}</Text>
                    </View>

                    {/* IMPORTED SHARE ROW */}
                    <ShareIcons listingId={listingId} location={location} />
                    
                    {/* Footer (Date & Actions - Now with Icon) */}
                    <View style={styles.cardFooter}>
                        
                        {/* 🛑 NEW: Icon + Date Text Wrapper */}
                        <View style={styles.postedDateWrapper}>
                            <Icon name="calendar-outline" size={16} color="#999" />
                            <Text style={styles.postedDate}>{new Date(createdAt).toLocaleDateString()}</Text>
                        </View>
                        
                        <View style={styles.actionButtons}>
                            <TouchableOpacity 
                                style={[styles.actionButton, { backgroundColor: PRIMARY_COLOR, borderRadius: 10 }]} 
                                onPress={(e) => { 
                                    if (e.stopPropagation) e.stopPropagation();
                                    onEdit(listingId);
                                }}
                            >
                                <Icon name="pencil" size={16} color="#FFF" />
                                <Text style={styles.actionButtonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.actionButton, { backgroundColor: ERROR_COLOR, borderRadius: 10 }]} 
                                onPress={(e) => {
                                    if (e.stopPropagation) e.stopPropagation();
                                    onDelete(listingId);
                                }}
                            >
                                <Icon name="trash" size={16} color="#FFF" />
                                <Text style={styles.actionButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Shadow>
        </View>
    );
};

export default ListingCard;