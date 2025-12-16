// src/components/PropertyListing.web.jsx

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Dimensions, 
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../../../theme/theme'; 
// 🛑 REMOVED: import { API_BASE_URL } from '@env'; 

// 🚀 NEW: Import the client-side listing service function
import { getAllListingsClient } from '../../../../../services/listingService';

// =================================================================
// 🚨 FIX: MISSING CONFIGURATION CONSTANTS DEFINITIONS (Line 20)
// =================================================================
// 🛑 REMOVED: const BASE_API_URL = API_BASE_URL;
// 🛑 REMOVED: const ALL_LISTINGS_ENDPOINT = `${BASE_API_URL}/flatmate/listing/all`; 

// 💡 NEW BREAKPOINTS for better responsiveness
const MOBILE_BREAKPOINT = 500;
const TABLET_BREAKPOINT = 1024; 
const BREAKPOINT = MOBILE_BREAKPOINT; 

// -----------------------------------------------------------------
// 🎨 ENHANCED DISNEY-ESQUE STYLES & CONSTANTS (No Change)
// -----------------------------------------------------------------
const BASE_SHADOW_COLOR = '#102A43'; 
const VIBRANT_ACCENT = '#FFC700'; // Gold/Yellow accent (for price/star)

const DEEP_SOFT_SHADOW = {
    boxShadow: `0 15px 35px 0px rgba(16, 42, 67, 0.5)`, 
    shadowColor: BASE_SHADOW_COLOR, 
    shadowOffset: { width: 0, height: 15 }, 
    shadowOpacity: 0.35, 
    shadowRadius: 25, 
    elevation: 15,
};

const SUBTLE_SHADOW = { 
    boxShadow: `0 5px 12px 0px rgba(16, 42, 67, 0.15)`,
    shadowColor: BASE_SHADOW_COLOR,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
}
const GENEROUS_RADIUS = 30; 


// --- Property Listing Card Component (No Change) ---
const PropertyListingCard = ({ item, colors, navigation }) => {
    // ... (Existing Card Component Logic) ...
    const primary = colors.primary || '#FF3366';
    const accent = colors.accent || VIBRANT_ACCENT;
    const card = colors.card || '#FFFFFF';
    const text = colors.text || '#121212';
    const border = colors.border || '#E0E0E0';
    
    const handlePress = () => {
        const propertyIdToNavigate = item.listingId || item.id;

        if (!propertyIdToNavigate) {
            console.error('Data Integrity Error: Listing item is missing both listingId and id.', item);
            Alert.alert(
                'Data Error', 
                'Listing ID is corrupted or missing for this property. Cannot fetch details.'
            );
            return;
        }

        navigation.navigate('PropertyDetail', { 
            propertyId: propertyIdToNavigate
        });
    };

    return (
        <TouchableOpacity 
            style={[styles.cardContainer, { backgroundColor: card }, DEEP_SOFT_SHADOW]}
            onPress={handlePress}
        >
            <Image 
                source={{ uri: item.image || 'https://via.placeholder.com/400x200?text=Placeholder+Image' }} 
                style={styles.cardImage} 
                resizeMode="cover"
            />
            
            <View style={[
                styles.cardHeader, 
                { 
                    backgroundColor: primary, 
                    boxShadow: `0 4px 15px 0px ${primary + 'DD'}`,
                }
            ]}>
                <Text style={styles.cardHeaderTitle}>{item.listingGoal || 'Property Listing'}</Text>
            </View>

            <View style={styles.cardContent}>
                
                <View style={styles.priceRow}>
                    <Text style={[styles.cardPrice, { color: accent }]}>{`₹ ${item.price ? item.price.toLocaleString('en-IN') : 'N/A'}`}</Text> 
                </View>

                <View style={styles.locationAndRatingRow}>
                    <View style={styles.locationRow}>
                        <Icon name="locate" size={18} color={primary} />
                        <Text style={[styles.cardLocation, { color: text, fontWeight: '600' }]}>{item.location || 'Unknown Location'}</Text>
                    </View>
                    <View style={styles.ratingAndVerifiedGroup}>
                        {item.isNoBrokerage && 
                            <View style={[styles.verifiedPill, { backgroundColor: '#4CAF50', ...SUBTLE_SHADOW }]}>
                                <Icon name="shield-checkmark" size={18} color="#FFF" />
                            </View>
                        }
                        <View style={[styles.ratingBox, { backgroundColor: accent + '20', ...SUBTLE_SHADOW }]}>
                            <Icon name="star" size={18} color={accent} />
                            <Text style={[styles.ratingText, { color: text }]}>{item.rating || 'N/A'}</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.specsRowEnhanced, { borderTopColor: border }]}>
                    <View style={[styles.specPillEnhanced, { backgroundColor: primary + '10', ...SUBTLE_SHADOW }]}>
                        <Icon name="bed-outline" size={26} color={primary} />
                        <Text style={[styles.specTextEnhanced, { color: primary }]}>{item.bhkOrRooms || 'N/A'}</Text>
                    </View>
                    <View style={[styles.specPillEnhanced, { backgroundColor: colors.secondary + '10' /* Cyan */, ...SUBTLE_SHADOW }]}>
                        <Icon name="expand-outline" size={26} color={colors.secondary || '#00BCD4'} />
                        <Text style={[styles.specTextEnhanced, { color: colors.secondary || '#00BCD4' }]}>{item.totalCarpetAreaSqft || 'N/A'} Sqft</Text>
                    </View>
                    <View style={[styles.specPillEnhanced, { backgroundColor: '#8BC34A' + '10' /* Lime */, ...SUBTLE_SHADOW }]}>
                        <Icon name="home-outline" size={26} color="#8BC34A" />
                        <Text style={[styles.specTextEnhanced, { color: '#8BC34A' }]}>{item.propertyType || 'House'}</Text>
                    </View>
                    <View style={[styles.specPillEnhanced, { backgroundColor: '#673AB7' + '10' /* Purple */, ...SUBTLE_SHADOW }]}>
                        <Icon name="calendar-outline" size={26} color="#673AB7" />
                        <Text style={[styles.specTextEnhanced, { color: '#673AB7' }]}>{item.finalAvailableDate || 'Now'}</Text>
                    </View>
                </View>

            </View>
        </TouchableOpacity>
    );
};
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// 🏠 Main Component (MODIFIED)
// -----------------------------------------------------------------
const PropertyListing = ({ 
    navigation, 
    listingType, 
    currentLocation, 
    searchRangeKm,
    city, 
    bhkType, 
    status, 
    houseType, 
    searchText 
}) => { 
  const { colors } = useTheme();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  
  const isMobile = windowWidth <= MOBILE_BREAKPOINT;
  const isTablet = windowWidth > MOBILE_BREAKPOINT && windowWidth <= TABLET_BREAKPOINT;
  
  useEffect(() => {
    const handleResize = ({ window }) => setWindowWidth(window.width);
    const subscription = Dimensions.addEventListener('change', handleResize);
    return () => subscription?.remove();
  }, []);
  
  const numColumns = isMobile ? 1 : (isTablet ? 2 : 3);


  const fetchData = async () => {
    setIsLoading(true);

    // 🛑 Removed: const url = ALL_LISTINGS_ENDPOINT; 
    
    // Request body is now the filters object passed to the service function
    const filters = {
        type: listingType, 
        location: currentLocation, 
        radiusKm: searchRangeKm,   
        city: city, 
        bhkType: bhkType, 
        propertyStatus: status, 
        houseType: houseType, 
        searchQuery: searchText, 
    };


    try {
        console.log(`Fetching listings for type: ${listingType} with filters:`, filters);
        
        // 🛑 REMOVED OLD FETCH CALL (Backend API)
        
        // 🚀 NEW: Call the client-side service function
        const listingsResult = await getAllListingsClient(filters);

        if (!Array.isArray(listingsResult)) {
             // Validate that the service returned the expected data type
             throw new Error("Listing service did not return an array of listings.");
        }
        
        // Update state with the results from the service
        setListings(listingsResult); 
        
    } catch (error) {
        console.error('Listing service call or processing error:', error);
        // Display user-friendly error and fall back to dummy data
        Alert.alert('Data Error', 'Could not process listings. Using fallback data.');
        // 🚀 FIX: इस लाइन को कमेंट करें ताकि डमी डेटा न दिखे
        // setListings(dummyData); 
        // 🚀 NEW: इसके बजाय एक खाली array सेट करें ताकि "No listings found" UI दिखे
        setListings([]); 
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    listingType, 
    currentLocation, 
    searchRangeKm, 
    city, 
    bhkType, 
    status, 
    houseType, 
    searchText
  ]); 
  
  const columnWrapperStyle = numColumns > 1 ? styles.columnWrapper : null;

  if (isLoading) {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.text, marginTop: 10 }}>Loading {listingType} properties...</Text>
        </View>
    );
  }

  if (listings.length === 0) {
    return (
        <View style={styles.loadingContainer}>
            <Icon name="alert-circle-outline" size={30} color={colors.text} />
            <Text style={{ color: colors.text, marginTop: 10, fontSize: 16 }}>No {listingType} listings found. Try adjusting your filters!</Text>
        </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.listingId ? item.listingId.toString() : item.id.toString()}
        renderItem={({ item }) => (
          <PropertyListingCard 
            item={item} 
            colors={colors} 
            navigation={navigation}
          />
        )}
        key={numColumns} 
        numColumns={numColumns}
        columnWrapperStyle={columnWrapperStyle}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

// --- Styles (No Change) ---
const styles = StyleSheet.create({
// ... (Styles are unchanged)
    container: {
        flex: 1,
        paddingHorizontal: 0,
        paddingTop: 10,
    },
    flatListContent: {
        paddingBottom: 40,
        paddingHorizontal: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
    },
    cardContainer: {
        flex: 1,
        margin: 15, 
        borderRadius: GENEROUS_RADIUS, 
        overflow: 'hidden',
        borderWidth: 0, 
        minWidth: 280,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    cardImage: {
        width: '100%',
        height: 180, 
        backgroundColor: '#CCC',
        borderTopLeftRadius: GENEROUS_RADIUS - 5,
        borderTopRightRadius: GENEROUS_RADIUS - 5,
    },
    cardHeader: {
        position: 'absolute',
        top: 25, 
        right: 0,
        left: 0,
        zIndex: 1,
        alignSelf: 'center',
        width: '25%', 
        paddingVertical: 12,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15, 
    },
    cardHeaderTitle: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 20, 
        textShadowColor: 'rgba(0, 0, 0, 0.5)', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    cardContent: {
        padding: 25, 
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardPrice: {
        fontSize: 30, 
        fontWeight: '900', 
    },
    listingGoalPill: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    listingGoalText: {
        fontSize: 16, 
        fontWeight: '900',
    },
    locationAndRatingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 15,
        marginBottom: 15,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardLocation: {
        marginLeft: 10, 
        fontSize: 16,
    },
    ratingAndVerifiedGroup: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    verifiedPill: {
        padding: 5,
        borderRadius: 50,
        marginRight: 15,
        height: 35, width: 35, 
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFF', 
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 18, 
    },
    ratingText: {
        fontWeight: '900', 
        marginLeft: 8, 
        fontSize: 17, 
    },
    specsRowEnhanced: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 20,
      marginTop: 20,
      borderTopWidth: 1,
      flexWrap: 'wrap', 
    },
    specPillEnhanced: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 15, 
        borderRadius: 20, 
        width: '23%', 
        justifyContent: 'center',
    },
    specTextEnhanced: {
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 16, 
        fontSize: 14, 
        fontWeight: '900',
    },
    
});

export default PropertyListing;