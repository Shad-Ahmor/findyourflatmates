// src/screens/MyListingsScreen.web.jsx
// यह फ़ाइल डेटा फ़ेचिंग, स्टेट मैनेजमेंट और UI लेआउट को नियंत्रित करती है।

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Dimensions,
  Alert // Alert is useful for error messages here too
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

// --- Imported Components and Utils ---
import ListingFormScreen from '../PublicProperties/PropertyListing/PropertyCreate.web'; 
import ListingCard from './ListingCard.web'; 
// handleDeleteListing अब बाहर से आता है और केवल API कॉल करता है।
import { handleDeleteListing } from './ListingActions'; 
import { API_BASE_URL } from '@env'; 
// -------------------------------------

const SCREEN_WIDTH = Dimensions.get('window').width;

// -----------------------------------------------------------------
// 🎨 DISNEY-ESQUE COLORS & STYLES (Consistency is key)
// -----------------------------------------------------------------
const PRIMARY_COLOR = '#4BCFFA'; // Sky Blue
const ACCENT_COLOR = '#FF9500'; // Warm Orange
const ERROR_COLOR = '#F44336';
const BACKGROUND_COLOR = '#F0F8FF'; // Soft Creamy White
const CARD_COLOR = '#FFFFFF';
const GENEROUS_RADIUS = 20;
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// 🚨 CONFIGURATION: API Endpoints
// -----------------------------------------------------------------
const MY_LISTINGS_ENDPOINT = `${API_BASE_URL}/flatmate/listing/my-listings`; 
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

  
    // --- Data Fetching ---
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
                // HTTP स्टेटस 401 या 403 को संभालें
                if (response.status === 401 || response.status === 403) {
                    Alert.alert("Authentication Required", "Your session has expired or you lack permission. Please log in.");
                    throw new Error("401: Unauthorized. Session expired.");
                }
                // अन्य त्रुटियों को संभालें
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
            // setError को केवल नेटवर्क/अज्ञात त्रुटियों के लिए सेट करें
            if (!err.message.includes("401")) {
                 setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyListings();
    }, []); 
    
    // --- Handlers (State Dependent) ---
    
    /** * एडिटिंग मॉडल को खोलता है।
     * यह फ़ंक्शन यहाँ रहना चाहिए क्योंकि यह 'selectedListingId' और 'isEditModalVisible' स्टेट पर निर्भर करता है।
     */
    const handleEditListing = (listingId) => {
        setSelectedListingId(listingId);
        setIsEditModalVisible(true); 
    };

    /** * मॉडल बंद करता है और लिस्टिंग को रीफ़्रेश करता है।
     */
    const handleModalClose = () => {
        setIsEditModalVisible(false);
        // ID को तुरंत साफ़ करें, लेकिन 300ms के बाद फ़्रेश करें ताकि UI ट्रांज़िशन समय मिल सके।
        setTimeout(() => setSelectedListingId(null), 300); 
        fetchMyListings(); 
    };

    /** * डिलीट होने पर लिस्टिंग स्टेट को अपडेट करता है (ListingActions.js से success callback)
     */
    const handleDeletionSuccess = (deletedId) => {
        setListings(prev => prev.filter(l => l.listingId !== deletedId));
    };


    const renderLoadingOrError = () => {
        // ... (Loading/Error/Empty State रेंडर लॉजिक)
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


    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.mainContainer}>
                    <Text style={[styles.header, { color: PRIMARY_COLOR }]}>Your Posted Properties ({listings.length})</Text>

                    {renderLoadingOrError()}

                    <View style={styles.listingsGrid}>
                        {listings.map(listing => (
                            <ListingCard 
                                key={listing.listingId} 
                                listing={listing} 
                               
                                // State-dependent handler
                                onEdit={handleEditListing} 
                                // API-dependent handler (uses imported function)
                                onDelete={(id) => handleDeleteListing(id, API_BASE_URL, handleDeletionSuccess)} 
                            />
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
                    
                    {/* जब selectedListingId मौजूद हो तभी ListingFormScreen लोड करें */}
                    {selectedListingId && (
                         <ListingFormScreen 
                            listingId={selectedListingId} 
                            onClose={handleModalClose} 
                            isEditing={true} // स्पष्टता के लिए prop
                        />
                    )}
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// =================================================================
// 🎨 STYLES (केवल मुख्य स्क्रीन स्टाइल्स)
// =================================================================
const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: BACKGROUND_COLOR, 
    },
    scrollContent: { 
        flexGrow: 1, 
        alignItems: 'center', 
        paddingVertical: 40, 
        paddingHorizontal: 20,
    },
    mainContainer: { 
        width: '100%',
        maxWidth: 1200, 
    },
    header: { 
        fontSize: 38, 
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
        borderRadius: 15, 
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
        borderRadius: 15, 
    },
    postNowButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18
    },


    // --- Listing Card Grid Style ---
    listingsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent:'space-evenly',
        alignItems: 'stretch', 
        paddingBottom: 25,
        maxWidth:'90%'
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