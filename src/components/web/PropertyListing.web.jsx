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

// =================================================================
// 🚨 FIX: MISSING CONFIGURATION CONSTANTS DEFINITIONS (Line 20)
// =================================================================
const BASE_API_URL = API_BASE_URL;

const ALL_LISTINGS_ENDPOINT = `${BASE_API_URL}/flatmate/listing/all`; 

// 💡 NEW BREAKPOINTS for better responsiveness
const MOBILE_BREAKPOINT = 500;
const TABLET_BREAKPOINT = 1024; 

// -----------------------------------------------------------------
// 🎨 ENHANCED DISNEY-ESQUE STYLES & CONSTANTS (Game/Animated UI Look)
// -----------------------------------------------------------------
const BASE_SHADOW_COLOR = '#102A43'; 
const VIBRANT_ACCENT = '#FFC700'; // Gold/Yellow accent (for price/star)

// Enhanced Shadow for Main Card Lift (Web-Optimized to clear "shadow*" deprecation warning)
const DEEP_SOFT_SHADOW = {
    // Web (boxShadow) equivalent: Deeper, wider shadow for floating effect
    boxShadow: `0 15px 35px 0px rgba(16, 42, 67, 0.5)`, 
    elevation: 15, // RN/Android Fallback
};

// Subtle Shadow for internal elements (Web-Optimized)
const SUBTLE_SHADOW = { 
    // Web (boxShadow) equivalent
    boxShadow: `0 5px 12px 0px rgba(16, 42, 67, 0.15)`,
    elevation: 5, // RN/Android Fallback
}
const GENEROUS_RADIUS = 30; // Ultra-Rounded corners
// =================================================================


// --- Property Listing Card Component ---
const PropertyListingCard = ({ item, colors, navigation, isMobile }) => {
    
    const primary = colors.primary || '#FF3366';
    const accent = colors.accent || VIBRANT_ACCENT;
    const card = colors.card || '#FFFFFF';
    const text = colors.text || '#121212';
    const border = colors.border || '#E0E0E0';
    
    const specPillWidth = isMobile ? '48%' : '23%'; 
    
    const dynamicStyles = getDynamicCardStyles({ colors, isMobile });

    return (
        <TouchableOpacity 
            style={[dynamicStyles.cardContainer, { backgroundColor: card }, DEEP_SOFT_SHADOW]}
            onPress={() => navigation.navigate('PropertyDetail', { propertyId: item.listingId || item.id })}
        >
            {/* Property Image */}
            <Image 
                source={{ uri: item.image || 'https://via.placeholder.com/400x200?text=Placeholder+Image' }} 
                style={dynamicStyles.cardImage} 
                resizeMode="cover"
            />
            
            {/* Card Header - Elevated Vibrant Ribbon */}
            <View style={[
                dynamicStyles.cardHeader, 
                { 
                    backgroundColor: primary, 
                    boxShadow: `0 4px 15px 0px ${primary + 'DD'}`,
                }
            ]}>
                <Text style={dynamicStyles.cardHeaderTitle}>{item.listingGoal || 'Property Listing'}</Text>
            </View>


            {/* Card Content */}
            <View style={dynamicStyles.cardContent}>
                
                {/* Row 1: Price and Type (HIGH-IMPACT STATS) */}
                <View style={dynamicStyles.priceRow}>
                    <Text style={[dynamicStyles.cardPrice, { color: accent }]}>{`₹ ${item.price ? item.price.toLocaleString('en-IN') : 'N/A'}`}</Text> 
                </View>

                {/* Row 2: Location and Rating */}
                <View style={dynamicStyles.locationAndRatingRow}>
                    <View style={dynamicStyles.locationRow}>
                        <Icon name="locate" size={dynamicStyles.cardLocationIconSize} color={primary} />
                        <Text style={[dynamicStyles.cardLocation, { color: text, fontWeight: '600' }]}>{item.location || 'Unknown Location'}</Text>
                    </View>
                    <View style={dynamicStyles.ratingAndVerifiedGroup}>
                        {/* Verified Icon (Green Check) */}
                        {item.isNoBrokerage && 
                            <View style={[dynamicStyles.verifiedPill, { backgroundColor: '#4CAF50', ...SUBTLE_SHADOW }]}>
                                <Icon name="shield-checkmark" size={18} color="#FFF" />
                            </View>
                        }
                        {/* Rating Box - Game UI Stat Look (Gold Star) */}
                        <View style={[dynamicStyles.ratingBox, { backgroundColor: accent + '20', ...SUBTLE_SHADOW }]}>
                            <Icon name="star" size={18} color={accent} />
                            <Text style={[dynamicStyles.ratingText, { color: text }]}>{item.rating || 'N/A'}</Text>
                        </View>
                    </View>
                </View>

                {/* Row 3: Specs (ENHANCED COLORFUL OBJECTS) */}
                <View style={[dynamicStyles.specsRowEnhanced, { borderTopColor: border }]}>
                    
                    {/* Spec 1: BHK / Rooms - Pink/Red Theme (Always visible) */}
                    <View style={[dynamicStyles.specPillEnhanced, { backgroundColor: primary + '10', width: specPillWidth, ...SUBTLE_SHADOW }]}>
                        <Icon name="bed-outline" size={dynamicStyles.specIconSize} color={primary} />
                        <Text style={[dynamicStyles.specTextEnhanced, { color: primary }]}>{item.bhkOrRooms || 'N/A'}</Text>
                    </View>
                    
                    {/* Spec 2: Carpet Area - Cyan/Blue Theme (Always visible) */}
                    <View style={[dynamicStyles.specPillEnhanced, { backgroundColor: colors.secondary + '10' /* Cyan */, width: specPillWidth, ...SUBTLE_SHADOW }]}>
                        <Icon name="expand-outline" size={dynamicStyles.specIconSize} color={colors.secondary || '#00BCD4'} />
                        <Text style={[dynamicStyles.specTextEnhanced, { color: colors.secondary || '#00BCD4' }]}>{item.totalCarpetAreaSqft || 'N/A'} Sqft</Text>
                    </View>
                    
                    {/* Spec 3 & 4: (Hidden on Mobile to save space) */}
                    {!isMobile && (
                        <>
                            {/* Spec 3: Property Type - Lime/Green Theme */}
                            <View style={[dynamicStyles.specPillEnhanced, { backgroundColor: '#8BC34A' + '10' /* Lime */, width: specPillWidth, ...SUBTLE_SHADOW }]}>
                                <Icon name="home-outline" size={dynamicStyles.specIconSize} color="#8BC34A" />
                                <Text style={[dynamicStyles.specTextEnhanced, { color: '#8BC34A' }]}>{item.propertyType || 'House'}</Text>
                            </View>
                            {/* Spec 4: Availability - Purple/Calendar Theme */}
                            <View style={[dynamicStyles.specPillEnhanced, { backgroundColor: '#673AB7' + '10' /* Purple */, width: specPillWidth, ...SUBTLE_SHADOW }]}>
                                <Icon name="calendar-outline" size={dynamicStyles.specIconSize} color="#673AB7" />
                                <Text style={[dynamicStyles.specTextEnhanced, { color: '#673AB7' }]}>{item.finalAvailableDate || 'Now'}</Text>
                            </View>
                        </>
                    )}
                </View>

            </View>
        </TouchableOpacity>
    );
};
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// 🏠 Main Component
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
  
  // 💡 RESPONSIVE LOGIC
  const isMobile = windowWidth <= MOBILE_BREAKPOINT;
  const isTablet = windowWidth > MOBILE_BREAKPOINT && windowWidth <= TABLET_BREAKPOINT;
  
  // Update windowWidth on resize
  useEffect(() => {
    const handleResize = ({ window }) => setWindowWidth(window.width);
    const subscription = Dimensions.addEventListener('change', handleResize);
    return () => subscription?.remove();
  }, []);
  
  // Determine number of columns
  const numColumns = isMobile ? 1 : (isTablet ? 2 : 3);


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
        
        // --- LIVE API CALL ---
        const response = await fetch(url, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody), 
            credentials: 'include', 
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response.' }));
            Alert.alert('Error Fetching Data', `Could not fetch listings: ${errorData.message || response.statusText}`);
            setListings([]); 
            return;
        }

        const data = await response.json();
        setListings(data.listings || []); 
        
    } catch (error) {
        console.error('Network or parsing error:', error);
        Alert.alert('Network Error', 'Could not connect to the server or process data.');
        setListings([]); 
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    // Re-fetch data whenever any dependency changes
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
  
  // 🎨 Dynamic Stylesheet Generator
  const dynamicStyles = getDynamicStyles({ colors, isMobile, isTablet, windowWidth });


  if (isLoading) {
    return (
        <View style={dynamicStyles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.text, marginTop: 10 }}>Loading {listingType} properties...</Text>
        </View>
    );
  }

  if (listings.length === 0) {
    return (
        <View style={dynamicStyles.loadingContainer}>
            <Icon name="alert-circle-outline" size={30} color={colors.text} />
            <Text style={{ color: colors.text, marginTop: 10, fontSize: 16 }}>No {listingType} listings found. Try adjusting your filters!</Text>
        </View>
    );
  }

  return (
    <View style={[dynamicStyles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.listingId ? item.listingId.toString() : item.id.toString()}
        renderItem={({ item }) => (
          <PropertyListingCard 
            item={item} 
            colors={colors} 
            navigation={navigation}
            isMobile={isMobile} 
          />
        )}
        key={numColumns} 
        numColumns={numColumns}
        // columnWrapperStyle केवल तभी पास करें जब numColumns > 1 हो (Previous Fix)
        columnWrapperStyle={numColumns > 1 ? dynamicStyles.columnWrapper : null}
        contentContainerStyle={dynamicStyles.flatListContent}
      />
    </View>
  );
};

// 🎨 Dynamic Stylesheet Generator for Listing Component (Returns plain JS object)
const getDynamicStyles = ({ colors, isMobile, isTablet, windowWidth }) => {
    
    const MARGIN_SIZE = isMobile ? 10 : 15;
    
    return {
        container: {
            flex: 1,
            paddingHorizontal: isMobile ? 0 : 10,
            paddingTop: 10,
        },
        flatListContent: {
            paddingBottom: 40,
            paddingHorizontal: isMobile ? 5 : 10, 
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200,
        },
        // --- Card Grid / Wrapper Styles ---
        columnWrapper: {
            justifyContent: 'space-between',
            marginBottom: MARGIN_SIZE * 2,
            gap: MARGIN_SIZE, 
        },
    };
};

// 🎨 Dynamic Stylesheet Generator for Card Component (Returns plain JS object)
const getDynamicCardStyles = ({ colors, isMobile }) => {
    const PADDING = isMobile ? 18 : 25;
    const HEADER_TITLE_SIZE = isMobile ? 16 : 20;
    const ICON_SIZE = isMobile ? 22 : 26;

    return { 
        // --- Card Styles (The Floating Showcase) ---
        cardContainer: {
            flex: 1,
            margin: isMobile ? 8 : 15, 
            borderRadius: GENEROUS_RADIUS, 
            overflow: 'hidden',
            borderWidth: 0, 
            minWidth: 280,
        },
        cardImage: {
            width: '100%',
            height: isMobile ? 150 : 180, 
            backgroundColor: '#CCC',
            borderTopLeftRadius: GENEROUS_RADIUS - 5,
            borderTopRightRadius: GENEROUS_RADIUS - 5,
        },
        cardHeader: {
            position: 'absolute',
            top: isMobile ? 15 : 25, 
            right: 0,
            left: 0,
            zIndex: 1,
            alignSelf: 'center',
            width: isMobile ? '35%' : '25%', 
            paddingVertical: isMobile ? 8 : 12,
            paddingHorizontal: 15,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15, 
        },
        cardHeaderTitle: {
            color: '#FFF',
            fontWeight: '900',
            fontSize: HEADER_TITLE_SIZE, 
            // 💡 NOTE: RN Web prefers the three separate props, so keeping them 
            // despite the minor deprecation warning which can often be ignored in hybrid RN projects.
            textShadowColor: 'rgba(0, 0, 0, 0.5)', 
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
        },
        cardContent: {
            padding: PADDING, 
        },
        // ⭐ ROW 1: Price and Type
        priceRow: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: 15,
        },
        cardPrice: {
            fontSize: isMobile ? 24 : 30, 
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
            flexShrink: 1, 
        },
        cardLocationIconSize: isMobile ? 16 : 18,
        cardLocation: {
            marginLeft: 8, 
            fontSize: isMobile ? 14 : 16,
            flexShrink: 1,
        },
        ratingAndVerifiedGroup: {
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: 10,
        },
        verifiedPill: {
            padding: 5,
            borderRadius: 50,
            marginRight: 10, 
            height: 30, width: 30, 
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: '#FFF', 
        },
        ratingBox: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 12, 
            borderRadius: 18, 
        },
        ratingText: {
            fontWeight: '900', 
            marginLeft: 5, 
            fontSize: isMobile ? 15 : 17, 
        },

        // ⭐ ROW 3: Specs (ENHANCED COLORFUL OBJECTS)
        specsRowEnhanced: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: isMobile ? 15 : 20,
          marginTop: isMobile ? 15 : 20,
          borderTopWidth: 1,
          flexWrap: 'wrap', 
        },
        specPillEnhanced: {
            flexDirection: 'column',
            alignItems: 'center',
            paddingVertical: isMobile ? 10 : 15, 
            borderRadius: 20, 
            justifyContent: 'center',
            marginBottom: isMobile ? 10 : 0, 
        },
        specIconSize: ICON_SIZE,
        specTextEnhanced: {
            marginTop: 5,
            textAlign: 'center',
            lineHeight: 16, 
            fontSize: isMobile ? 11 : 14, 
            fontWeight: '900',
        },
    };
};

export default PropertyListing;