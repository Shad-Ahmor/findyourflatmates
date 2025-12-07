// src/screens/MyListingsScreen.web.jsx

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
// Note: Using Ionicons for consistency with the Disney-style UI (FontAwesome5 is fine too, but Ionicons offers more filled styles)
import Icon from 'react-native-vector-icons/Ionicons'; 
import { Shadow } from 'react-native-shadow-2'; // Shadow is crucial for 3D look
import ListingFormScreen from './ListingFormScreen.web.jsx'; 

const SCREEN_WIDTH = Dimensions.get('window').width;

// -----------------------------------------------------------------
// 🎨 DISNEY-ESQUE COLORS & STYLES (Soft & Playful)
// -----------------------------------------------------------------
const PRIMARY_COLOR = '#4BCFFA'; // Sky Blue
const ACCENT_COLOR = '#FF9500'; // Warm Orange
const SUCCESS_COLOR = '#5CB85C'; // Grass Green
const ERROR_COLOR = '#F44336';
const WARNING_COLOR = '#FFC107'; // Warm Yellow
const BACKGROUND_COLOR = '#F0F8FF'; // Soft Creamy White
const CARD_COLOR = '#FFFFFF';
const GENEROUS_RADIUS = 20;

const CARD_WIDTH = 380;
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// 🚨 CONFIGURATION: API Endpoints
// -----------------------------------------------------------------
const MY_LISTINGS_ENDPOINT = `http://localhost:5000/flatmate/listing/my-listings`; 
const BASE_LISTING_ENDPOINT = `http://localhost:5000/flatmate/listing`; 
// -----------------------------------------------------------------

// =================================================================
// 🎯 MAIN COMPONENT: MyListingsScreen
// =================================================================
const MyListingsScreen = () => {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedListingId, setSelectedListingId] = useState(null); 

    // --- Data Fetching (Unchanged) ---
    const fetchMyListings = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch(MY_LISTINGS_ENDPOINT, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
            });

            if (!response.ok) {
                const responseText = await response.text();
                if (response.status === 401 || response.status === 403) {
                    throw new Error("401: Unauthorized. Session expired. Please log in.");
                }
                try {
                    const errorData = JSON.parse(responseText);
                    throw new Error(errorData.message || `Failed to fetch listings. Status: ${response.status}`);
                } catch (parseError) {
                    throw new Error(`Non-JSON Error response (Status: ${response.status}): ${responseText.substring(0, 100)}...`);
                }
            }
            
            const data = await response.json();
            setListings(data); 

        } catch (err) {
            console.error("Fetch Error:", err.message);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyListings();
    }, []); 
    
    const handleModalClose = () => {
        setIsEditModalVisible(false);
        setTimeout(() => setSelectedListingId(null), 300); 
        fetchMyListings(); 
    };

    // --- Action Handlers (Unchanged) ---
    const handleEditListing = (listingId) => {
        setSelectedListingId(listingId);
        setIsEditModalVisible(true); 
        console.log(`Opening edit modal for Listing ID: ${listingId}`);
    };

    const handleDeleteListing = (listingId) => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this property listing permanently?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: () => confirmDelete(listingId) 
                },
            ]
        );
    };

    const confirmDelete = async (listingId) => {
         try {
            const response = await fetch(`${BASE_LISTING_ENDPOINT}/${listingId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                Alert.alert("Success", "Listing deleted successfully!");
                setListings(prev => prev.filter(l => l.listingId !== listingId));
            } else {
                if (response.status === 401 || response.status === 403) {
                    Alert.alert("Authentication Required", "Your session has expired or you lack permission.");
                    return;
                }
                
                const errorData = await response.json();
                Alert.alert("Deletion Failed", errorData.message || "Could not delete listing.");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            Alert.alert("Network Error", "Could not connect to server to delete listing.");
        }
    };

    // --- Render Components ---

    const renderLoadingOrError = () => {
        if (isLoading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    <Text style={styles.statusText}>Fetching your listings...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={[styles.centerContainer, styles.errorBox]}>
                    <Icon name="warning" size={30} color={ERROR_COLOR} style={{ marginBottom: 15 }} />
                    <Text style={styles.errorText}>Error: {error}</Text>
                    <TouchableOpacity onPress={fetchMyListings} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (listings.length === 0) {
            return (
                <View style={styles.centerContainer}>
                    <Icon name="file-tray-full" size={40} color="#CCC" style={{ marginBottom: 15 }} />
                    <Text style={styles.statusText}>You haven't posted any listings yet.</Text>
                    <TouchableOpacity style={[styles.postNowButton, { backgroundColor: ACCENT_COLOR }]}>
                        <Text style={styles.postNowButtonText}>Post a Property Now</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        
        return null;
    };

    const ListingCard = ({ listing }) => {
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
        
        const imageUrl = image 
            ? image 
            : 'https://via.placeholder.com/600x400.png?text=Property+Image'; 
        
        const statusColor = status === 'Active' ? SUCCESS_COLOR : status === 'Pending Review' ? WARNING_COLOR : ERROR_COLOR;
        
        // Define Icon names based on Ionicons for consistency
        const iconNames = {
            bedrooms: "bed",
            bathrooms: "water",
            propertyType: "home",
        };


        return (
            // Use Shadow with softer colors and greater distance for the 3D look
            <Shadow 
                distance={15} 
                startColor={'rgba(0, 0, 0, 0.06)'} 
                endColor={'#F7F9FB00'}
                containerStyle={styles.cardShadow}
                offset={[0, 8]}
            >
                <View style={styles.cardContainer}> 
                    
                    {/* Image Display */}
                    <Image 
                        style={styles.cardImage} 
                        source={{ uri: imageUrl }} 
                        resizeMode="cover"
                    />
                    
                    {/* Details Wrapper for horizontal padding */}
                    <View style={styles.cardDetailsWrapper}>
                        {/* Header */}
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle} numberOfLines={1}>{location}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: statusColor, borderRadius: 10 }]}>
                                <Text style={styles.statusTextWhite}>{status || 'N/A'}</Text>
                            </View>
                        </View>

                        {/* Details */}
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

                        <View style={styles.specsRow}>
                            <Text style={styles.specText}><Icon name={iconNames.bedrooms} size={14} color={PRIMARY_COLOR} /> {bedrooms || 'N/A'}</Text>
                            <Text style={styles.specText}><Icon name={iconNames.bathrooms} size={14} color={PRIMARY_COLOR} /> {bathrooms || 'N/A'}</Text>
                            <Text style={styles.specText}><Icon name={iconNames.propertyType} size={14} color={PRIMARY_COLOR} /> {propertyType || 'N/A'}</Text>
                        </View>
                        
                        {/* Footer */}
                        <View style={styles.cardFooter}>
                            <Text style={styles.postedDate}>Posted: {new Date(createdAt).toLocaleDateString()}</Text>
                            
                            <View style={styles.actionButtons}>
                                <TouchableOpacity style={[styles.actionButton, styles.editButton, { backgroundColor: PRIMARY_COLOR, borderRadius: 10 }]} onPress={() => handleEditListing(listingId)}>
                                    <Icon name="pencil" size={16} color="#FFF" />
                                    <Text style={styles.actionButtonText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.actionButton, styles.deleteButton, { backgroundColor: ERROR_COLOR, borderRadius: 10 }]} onPress={() => handleDeleteListing(listingId)}>
                                    <Icon name="trash" size={16} color="#FFF" />
                                    <Text style={styles.actionButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Shadow>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.mainContainer}>
                    <Text style={[styles.header, { color: PRIMARY_COLOR }]}>Your Posted Properties ({listings.length})</Text>

                    {renderLoadingOrError()}

                    <View style={styles.listingsGrid}>
                        {listings.map(listing => (
                            <ListingCard key={listing.listingId} listing={listing} />
                        ))}
                    </View>
                </View>
            </ScrollView>
            
            {/* UPDATED MODAL for EDITING */}
            <Modal
                animationType="slide"
                transparent={false} 
                visible={isEditModalVisible}
                onRequestClose={handleModalClose}
            >
                <View style={[styles.modalContent, { backgroundColor: BACKGROUND_COLOR }]}> 
                    <TouchableOpacity style={[styles.modalCloseButton, { padding: 10 }]} onPress={handleModalClose}>
                        <Icon name="close-circle" size={40} color="#333" />
                    </TouchableOpacity>
                    
                    {selectedListingId && (
                         <ListingFormScreen 
                            listingId={selectedListingId} 
                            onClose={handleModalClose} 
                        />
                    )}
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// =================================================================
// 🎨 STYLES 
// =================================================================
const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: BACKGROUND_COLOR, // Soft background
    },
    scrollContent: { 
        flexGrow: 1, 
        alignItems: 'center', 
        paddingVertical: 40, // Increased padding
        paddingHorizontal: 20,
    },
    mainContainer: { 
        width: '100%',
        maxWidth: 1200, 
    },
    header: { 
        fontSize: 38, // Larger header
        fontWeight: '900', 
        marginBottom: 15,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    
    // --- Center/Status Containers ---
    centerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
        backgroundColor: CARD_COLOR,
        borderRadius: GENEROUS_RADIUS,
        borderWidth: 1,
        borderColor: '#EEE',
        marginBottom: 30,
    },
    statusText: {
        marginTop: 15,
        fontSize: 18,
        color: '#555',
        fontWeight: '700'
    },
    errorBox: {
        borderColor: ERROR_COLOR,
        borderWidth: 3,
        backgroundColor: '#FFEEEE',
    },
    errorText: {
        color: ERROR_COLOR,
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 15, // Large radius
    },
    retryButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    },
    postNowButton: {
        marginTop: 20,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15, // Large radius
    },
    postNowButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18
    },


    // --- Listing Card Styles (Soft 3D) ---
    listingsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 25, // Increased gap
    },
    
    cardShadow: {
        width: CARD_WIDTH, 
        marginBottom: 25, // Increased margin for shadow visibility
        borderRadius: GENEROUS_RADIUS,
    },
    
    cardContainer: {
        backgroundColor: CARD_COLOR,
        borderRadius: GENEROUS_RADIUS,
        borderWidth: 0, // Rely on Shadow component
        overflow: 'hidden',
        height: 440, // Slightly increased height for better flow
    },
    
    cardImage: {
        width: '100%',
        height: 200, // Taller image
        // BorderRadius is handled by the parent container overflow, but sometimes needs to be applied here too
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
        fontSize: 22, // Larger title
        fontWeight: '800',
        color: '#333',
        flexShrink: 1,
        marginRight: 10,
    },
    statusBadge: {
        paddingVertical: 6,
        paddingHorizontal: 12,
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
        fontSize: 28, // Larger price
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
    
    // Footer and Actions
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    postedDate: {
        fontSize: 14,
        color: '#999',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 8,
    },

    // Modal Styles
    modalContent: {
        flex: 1, 
        alignItems: 'center',
        padding: 0, 
        width: '100%',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 25,
        right: 25,
        zIndex: 10, 
    },
});

export default MyListingsScreen;