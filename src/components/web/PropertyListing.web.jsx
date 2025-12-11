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
import { useTheme } from '../../theme/theme'; 
import { API_BASE_URL } from '@env'; 
// -----------------------------------------------------------------
// 🚨 CONFIGURATION: API Endpoint
// -----------------------------------------------------------------
const BASE_API_URL = API_BASE_URL;

const ALL_LISTINGS_ENDPOINT = `${BASE_API_URL}/flatmate/listing/all`; 
const BREAKPOINT = 768; 

// -----------------------------------------------------------------
// 🎨 ENHANCED DISNEY-ESQUE STYLES & CONSTANTS (Game/Animated UI Look)
// -----------------------------------------------------------------
const BASE_SHADOW_COLOR = '#102A43'; 
const VIBRANT_ACCENT = '#FFC700'; // Gold/Yellow accent (for price/star)

// Enhanced Shadow for Main Card Lift (Grand Floating Effect)
const DEEP_SOFT_SHADOW = {
    // Web (boxShadow) equivalent: Deeper, wider shadow for floating effect
    boxShadow: `0 15px 35px 0px rgba(16, 42, 67, 0.5)`, 
    // RN (shadow/elevation) fallback
    shadowColor: BASE_SHADOW_COLOR, 
    shadowOffset: { width: 0, height: 15 }, 
    shadowOpacity: 0.35, 
    shadowRadius: 25, 
    elevation: 15, // Increased elevation
};

// Subtle Shadow for internal elements (Pills, Rating Box)
const SUBTLE_SHADOW = { 
    // Web (boxShadow) equivalent
    boxShadow: `0 5px 12px 0px rgba(16, 42, 67, 0.15)`,
    // RN (shadow/elevation) fallback
    shadowColor: BASE_SHADOW_COLOR,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
}
const GENEROUS_RADIUS = 30; // Ultra-Rounded corners
// -----------------------------------------------------------------


// --- Dummy Data (Used as fallback/structure definition) ---
const dummyData = [
  // Example structure (will be replaced by live data)
  {
    id: '1',
    title: 'Magical 3 BHK Dream Flat',
    price: '₹ 50,000/mo',
    listingGoal: 'Rent',
    location: 'Bandra West, Mumbai',
    image: 'https://via.placeholder.com/400x200?text=Vibrant+Dream+Home',
    rating: '4.8',
    bhkOrRooms: '3 BHK',
    totalCarpetAreaSqft: '1500',
    propertyType: 'Flat',
    finalAvailableDate: 'Now',
    isNoBrokerage: true,
  },
  {
    id: '2',
    title: 'The Enchanted Cottage',
    price: '₹ 2 Crore',
    listingGoal: 'Sale',
    location: 'Lonavala Hills, Pune',
    image: 'https://via.placeholder.com/400x200?text=Luxury+Mountain+View',
    rating: '4.2',
    bhkOrRooms: '4 BHK',
    totalCarpetAreaSqft: '5000',
    propertyType: 'House',
    finalAvailableDate: 'Feb 2026',
    isNoBrokerage: false,
  },
];

// --- Property Listing Card Component ---
const PropertyListingCard = ({ item, colors, navigation }) => {
    
    // Fallback colors for safety if useTheme is not providing them fully
    const primary = colors.primary || '#FF3366';
    const accent = colors.accent || VIBRANT_ACCENT;
    const card = colors.card || '#FFFFFF';
    const text = colors.text || '#121212';
    const border = colors.border || '#E0E0E0';


    return (
        <TouchableOpacity 
            style={[styles.cardContainer, { backgroundColor: card }, DEEP_SOFT_SHADOW]}
            onPress={() => navigation.navigate('PropertyDetail', { propertyId: item.listingId || item.id })}
        >
            {/* Property Image */}
            <Image 
                source={{ uri: item.image || 'https://via.placeholder.com/400x200?text=Placeholder+Image' }} 
                style={styles.cardImage} 
                resizeMode="cover"
            />
            
            {/* Card Header - Elevated Vibrant Ribbon */}
            <View style={[
                styles.cardHeader, 
                { 
                    backgroundColor: primary, 
                    // Enhanced shadow for the ribbon/title bar
                    boxShadow: `0 4px 15px 0px ${primary + 'DD'}`,
                }
            ]}>
                <Text style={styles.cardHeaderTitle}>{item.listingGoal || 'Property Listing'}</Text>
            </View>


            {/* Card Content */}
            <View style={styles.cardContent}>
                
                {/* Row 1: Price and Type (HIGH-IMPACT STATS) */}
                <View style={styles.priceRow}>
                    {/* Price is big, bold, and Gold */}
                    <Text style={[styles.cardPrice, { color: accent }]}>{item.price}</Text> 
                    
             
                </View>

                {/* Row 2: Location and Rating */}
                <View style={styles.locationAndRatingRow}>
                    <View style={styles.locationRow}>
                        <Icon name="locate" size={18} color={primary} />
                        <Text style={[styles.cardLocation, { color: text, fontWeight: '600' }]}>{item.location || 'Unknown Location'}</Text>
                    </View>
                    <View style={styles.ratingAndVerifiedGroup}>
                        {/* Verified Icon (Green Check) */}
                        {item.isNoBrokerage && 
                            <View style={[styles.verifiedPill, { backgroundColor: '#4CAF50', ...SUBTLE_SHADOW }]}>
                                <Icon name="shield-checkmark" size={18} color="#FFF" />
                            </View>
                        }
                        {/* Rating Box - Game UI Stat Look (Gold Star) */}
                        <View style={[styles.ratingBox, { backgroundColor: accent + '20', ...SUBTLE_SHADOW }]}>
                            <Icon name="star" size={18} color={accent} />
                            <Text style={[styles.ratingText, { color: text }]}>{item.rating || 'N/A'}</Text>
                        </View>
                    </View>
                </View>

                {/* Row 3: Specs (ENHANCED COLORFUL OBJECTS) */}
                <View style={[styles.specsRowEnhanced, { borderTopColor: border }]}>
                    {/* Spec 1: BHK / Rooms - Pink/Red Theme */}
                    <View style={[styles.specPillEnhanced, { backgroundColor: primary + '10', ...SUBTLE_SHADOW }]}>
                        <Icon name="bed-outline" size={26} color={primary} />
                        <Text style={[styles.specTextEnhanced, { color: primary }]}>{item.bhkOrRooms || 'N/A'}</Text>
                    </View>
                    {/* Spec 2: Carpet Area - Cyan/Blue Theme */}
                    <View style={[styles.specPillEnhanced, { backgroundColor: colors.secondary + '10' /* Cyan */, ...SUBTLE_SHADOW }]}>
                        <Icon name="expand-outline" size={26} color={colors.secondary || '#00BCD4'} />
                        <Text style={[styles.specTextEnhanced, { color: colors.secondary || '#00BCD4' }]}>{item.totalCarpetAreaSqft || 'N/A'} Sqft</Text>
                    </View>
                    {/* Spec 3: Property Type - Lime/Green Theme */}
                    <View style={[styles.specPillEnhanced, { backgroundColor: '#8BC34A' + '10' /* Lime */, ...SUBTLE_SHADOW }]}>
                        <Icon name="home-outline" size={26} color="#8BC34A" />
                        <Text style={[styles.specTextEnhanced, { color: '#8BC34A' }]}>{item.propertyType || 'House'}</Text>
                    </View>
                    {/* Spec 4: Availability - Purple/Calendar Theme */}
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
// 🏠 Main Component (Unchanged Logic)
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
  const { colors } = useTheme(); // Use the global theme
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWeb, setIsWeb] = useState(Dimensions.get('window').width > BREAKPOINT || Platform.OS === 'web');
  
  // Update web/mobile status on resize
  useEffect(() => {
    const handleResize = ({ window }) => setIsWeb(window.width > BREAKPOINT);
    const subscription = Dimensions.addEventListener('change', handleResize);
    return () => subscription?.remove();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);

    const url = ALL_LISTINGS_ENDPOINT; 
    
    const requestBody = {
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
        console.log(`Fetching listings for type: ${listingType} with filters:`, requestBody);
        
        const response = await fetch(url, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody), 
            credentials: 'include', 
        });

        if (!response.ok) {
            const errorData = await response.json();
            Alert.alert('Error Fetching Data', `Could not fetch listings: ${errorData.message || response.statusText}`);
            setListings([]);
            return;
        }

        const data = await response.json();
        setListings(data.listings || []); 
    } catch (error) {
        console.error('Network or parsing error:', error);
        Alert.alert('Network Error', 'Could not connect to the server or process data.');
        setListings(dummyData); // Fallback to dummy data on critical failure
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
  
  const numColumns = isWeb ? 3 : 1;
  const columnWrapperStyle = isWeb ? styles.columnWrapper : {};

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

// --- Styles (Updated for Disney Aesthetics) ---
const styles = StyleSheet.create({
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
    // --- Card Styles (The Floating Showcase) ---
    cardContainer: {
        flex: 1,
        margin: 15, 
        borderRadius: GENEROUS_RADIUS, 
        overflow: 'hidden',
        borderWidth: 0, 
        maxWidth: Dimensions.get('window').width > BREAKPOINT ? '30%' : '100%', 
        minWidth: 280,
        // Shadow applied inline
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 25, // Increased spacing between rows
    },
    cardImage: {
        width: '100%',
        height: 180, 
        backgroundColor: '#CCC',
        // Softer corner transition
        borderTopLeftRadius: GENEROUS_RADIUS - 5,
        borderTopRightRadius: GENEROUS_RADIUS - 5,
    },
    cardHeader: {
        position: 'absolute',
        top: 25, // Lowered ribbon
        right: 0,
        left: 0,
        zIndex: 1,
        alignSelf: 'center',
        width: '25%', // Wider, more prominent ribbon
        paddingVertical: 12,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15, 
    },
    cardHeaderTitle: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 20, // Very large title
        textShadowColor: 'rgba(0, 0, 0, 0.5)', // Text shadow for ribbon depth
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    cardContent: {
        padding: 25, // Increased content padding
    },
    // ⭐ ROW 1: Price and Type
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardPrice: {
        fontSize: 30, // Most prominent font
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
    
    // ⭐ ROW 2: Location and Rating
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
        height: 35, width: 35, // Larger size
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFF', // White border for pop
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 18, // Ultra-rounded box
    },
    ratingText: {
        fontWeight: '900', 
        marginLeft: 8, 
        fontSize: 17, // Larger font
    },

    // ⭐ ROW 3: Specs (ENHANCED COLORFUL OBJECTS)
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
        // Shadow and color applied inline
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