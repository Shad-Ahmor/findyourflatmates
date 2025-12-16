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
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

// --- Imported Components and Utils ---
import ListingFormScreen from '../PublicProperties/PropertyListing/PropertyCreate.web'; 
import ListingCard from './ListingCard.web'; 
import { handleDeleteListing } from './ListingActions'; 

// 🛑 FIX 1: API_BASE_URL और MY_LISTINGS_ENDPOINT अब आवश्यक नहीं हैं
// import { API_BASE_URL } from '@env'; 

// ✅ FIX 2: क्लाइंट-साइड सर्विस फंक्शन को इंपोर्ट करें
import { fetchUserOwnListingProperties } from '../../../../services/listingService';
// -------------------------------------

const BREAKPOINT_MOBILE = 500;
const BREAKPOINT_TABLET = 850; 

// =================================================================
// 🚨 CUSTOM HOOK: Dynamic Width Tracking (Browser Resize/Orientation Change)
// =================================================================
const useResponsiveWidth = () => {
    const [width, setWidth] = useState(Dimensions.get('window').width);

    useEffect(() => {
        const updateWidth = () => setWidth(Dimensions.get('window').width);
        Dimensions.addEventListener('change', updateWidth);
        
        return () => Dimensions.removeEventListener('change', updateWidth);
    }, []);

    return width;
};
// =================================================================


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
// 🚨 CONFIGURATION: API Endpoints (अब यह केवल Node.js बैकएंड के लिए था, क्लाइंट-साइड में इसकी आवश्यकता नहीं)
// -----------------------------------------------------------------
// const MY_LISTINGS_ENDPOINT = `${API_BASE_URL}/flatmate/listing/my-listings`; 
// -----------------------------------------------------------------

// =================================================================
// 🎯 MAIN COMPONENT: MyListingsScreen
// =================================================================
const MyListingsScreen = () => {
    // Call the hook to track dynamic width
    const dynamicWidth = useResponsiveWidth(); 
    
    // --- State Management ---
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedListingId, setSelectedListingId] = useState(null); 
    
    // ✅ PAGINATION STATE
    const [currentPage, setCurrentPage] = useState(1);
    const [listingsPerPage] = useState(3); 

    // --- Data Fetching ---
    const fetchMyListings = async () => {
        setIsLoading(true);
        setError(null);
        setCurrentPage(1); // Reset to page 1 on fresh fetch
        
        try {
            // 🛑 FIX: Node.js API कॉल को क्लाइंट-साइड सर्विस फ़ंक्शन से बदलें
            const data = await fetchUserOwnListingProperties(); 
            // यदि fetchUserOwnListingProperties  सफल होता है, तो यह सीधे listings का array लौटाता है
            
            setListings(data); 

        } catch (err) {
            console.error("Fetch Error:", err.message);
            
            // fetchUserOwnListingProperties में, हमने Authentication Error के लिए 'User not authenticated' throw किया था।
            if (err.message.includes("not authenticated")) {
                Alert.alert("Authentication Required", "Your session has expired or you lack permission. Please log in.");
            }
            // अन्य त्रुटियों को संभालें
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyListings();
    }, []); 
    
    // --- Handlers (State Dependent) ---
    
    const handleEditListing = (listingId) => {
        setSelectedListingId(listingId);
        setIsEditModalVisible(true); 
    };

    const handleModalClose = () => {
        setIsEditModalVisible(false);
        // ID को तुरंत साफ़ करें, लेकिन 300ms के बाद फ़्रेश करें ताकि UI ट्रांज़िशन समय मिल सके।
        setTimeout(() => setSelectedListingId(null), 300); 
        fetchMyListings(); 
    };

    const handleDeletionSuccess = (deletedId) => {
        setListings(prev => prev.filter(l => l.listingId !== deletedId));
    };

    // =========================================================
    // ✅ Responsive Grid Logic
    // =========================================================
    let listingWidthStyle = {};
    let gridJustifyContent = 'space-between'; 

    if (dynamicWidth < BREAKPOINT_TABLET) {
        listingWidthStyle = { 
            width: '100%', 
            marginBottom: 25,
            marginRight: 0, 
        }; 
        gridJustifyContent = 'center'; 
    } else {
        listingWidthStyle = { 
            width: '32%', 
            marginBottom: 30 
        };
        gridJustifyContent = 'space-between'; 
    }
    // =========================================================

    // =========================================================
    // ✅ Pagination Logic and Controls
    // =========================================================
    const indexOfLastListing = currentPage * listingsPerPage;
    const indexOfFirstListing = indexOfLastListing - listingsPerPage;
    
    const currentListings = listings.slice(indexOfFirstListing, indexOfLastListing);
    
    const totalPages = Math.ceil(listings.length / listingsPerPage);
    
    const paginate = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        if (scrollViewRef.current && scrollViewRef.current.scrollTo) {
             scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    };
    
    const scrollViewRef = React.useRef(null);

    // Pagination Controls Component
    const PaginationControls = () => {
        if (totalPages <= 1) return null; 

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <View style={styles.paginationContainer}>
                {/* Previous Button */}
                <TouchableOpacity
                    onPress={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
                >
                    <Icon name="chevron-back" size={20} color={currentPage === 1 ? '#AAA' : PRIMARY_COLOR} />
                </TouchableOpacity>

                {/* Page Numbers */}
                {pageNumbers.map(number => (
                    <TouchableOpacity
                        key={number}
                        onPress={() => paginate(number)}
                        style={[
                            styles.pageButton, 
                            currentPage === number && styles.pageButtonActive
                        ]}
                    >
                        <Text style={[
                            styles.pageText, 
                            currentPage === number && styles.pageTextActive
                        ]}>
                            {number}
                        </Text>
                    </TouchableOpacity>
                ))}
                
                {/* Next Button */}
                <TouchableOpacity
                    onPress={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
                >
                    <Icon name="chevron-forward" size={20} color={currentPage === totalPages ? '#AAA' : PRIMARY_COLOR} />
                </TouchableOpacity>
            </View>
        );
    };
    // =========================================================


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


    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Attach ref for scrolling on page change */}
            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
                <View style={styles.mainContainer}>
                    <Text style={[styles.header, { 
                        color: PRIMARY_COLOR, 
                        // Smaller header on mobile
                        fontSize: dynamicWidth < BREAKPOINT_MOBILE ? 30 : 38
                    }]}>
                        My Properties ({listings.length})
                    </Text>

                    {renderLoadingOrError()}

                    {/* Render grid and pagination only if we have data to show */}
                    {listings.length > 0 && (
                        <>
                            <View style={[styles.listingsGrid, { justifyContent: gridJustifyContent }]}>
                                {/* Use currentListings for pagination */}
                                {currentListings.map(listing => (
                                    <ListingCard 
                                        key={listing.listingId} 
                                        listing={listing} 
                                        style={listingWidthStyle} // Dynamic Width Applied Here
                                        // State-dependent handler
                                        onEdit={handleEditListing} 
                                        // API-dependent handler: handleDeleteListing को अब केवल Firebase DB कॉल करनी चाहिए, API_BASE_URL नहीं
                                        onDelete={(id) => handleDeleteListing(id, handleDeletionSuccess)} 
                                    />
                                ))}
                            </View>
                            
                            <PaginationControls />
                        </>
                    )}
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
        width: '100%', 
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
        alignItems: 'stretch', 
        paddingBottom: 25,
        maxWidth:'100%' 
    },
    
    // ===================================
    // ✅ PAGINATION STYLES
    // ===================================
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
        width: '100%',
    },
    pageButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginHorizontal: 5,
        borderRadius: 8,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EEE',
        // Web Hover effect
        ':hover': {
            backgroundColor: '#F0F0F0',
            cursor: 'pointer',
        },
    },
    pageButtonActive: {
        backgroundColor: PRIMARY_COLOR,
        borderColor: PRIMARY_COLOR,
    },
    pageButtonDisabled: {
        opacity: 0.5,
        cursor: 'default',
    },
    pageText: {
        color: PRIMARY_COLOR,
        fontWeight: 'bold',
        fontSize: 16,
    },
    pageTextActive: {
        color: '#FFF',
    },
    // ===================================

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