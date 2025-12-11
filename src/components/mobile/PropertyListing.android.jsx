// src/components/PropertyListing.android.jsx

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Dimensions, 
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/theme'; 

const BREAKPOINT = 768; 

// Hero images
const heroImages = [
 require('../../../assets/hero_slide1.png'),
 require('../../../assets/hero_slide_2.png'),
 require('../../../assets/hero_slide_3.png'),
];

// --- EXTENDED DUMMY PROPERTIES ---
const properties = Array.from({ length: 20 }, (_, i) => ({
  id: (i + 1).toString(),
  type: ['Flat', 'PG', 'Flatmate', 'Hostel'][i % 4],
  location: ['Andheri W', 'Bandra E', 'Lower Parel', 'Dadar'][i % 4],
  price: ['₹20,000', '₹12,000', '₹15,000', '₹8,000'][i % 4],
  bhk: (i % 3) + 1, 
  bathrooms: (i % 2) + 1,
  size_sqft: (700 + (i * 50)).toString(), 
  rating: 3.5 + (i % 5) * 0.2,
  isFavorite: i % 5 === 0,
  is_verified: i % 3 === 0, 
  is_featured: i % 7 === 0, 
  days_listed: [5, 20, 45, 95, 180, 400, 700][i % 7],
  is_no_brokerage: i % 4 !== 0, // NEW: No Brokerage Tag
  furnishing_status: ['Fully Furnished', 'Semi Furnished', 'Unfurnished'][i % 3], // NEW: Furnishing
}));
// --- END EXTENDED DUMMY PROPERTIES ---

// --- HELPER FUNCTION: Format Days Listed (Unchanged) ---
const formatDaysListed = (days) => {
    if (days < 30) {
        return `${days}d`;
    }
    if (days < 365) {
        const months = Math.floor(days / 30);
        return `${months}m`;
    }
    const years = Math.floor(days / 365);
    return `${years}y`;
};
// --- END HELPER FUNCTION ---

// --- NEW HELPER COMPONENT: StarRating (Unchanged) ---
const StarRating = ({ rating, size = 12, color }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        stars.push(<Icon key={`full-${i}`} name="star" size={size} color={color} style={{ marginLeft: 2 }} />);
    }
    if (hasHalfStar) {
        stars.push(<Icon key="half" name="star-half" size={size} color={color} style={{ marginLeft: 2 }} />);
    }

    // Fill remaining space with empty stars 
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
     for (let i = 0; i < emptyStars; i++) {
        stars.push(<Icon key={`empty-${i}`} name="star-outline" size={size} color={color + '60'} style={{ marginLeft: 2 }} />);
    }

    return <View style={styles.starRatingContainer}>{stars}</View>;
};
// --- END StarRating ---

// --- PropertyCard component ---
const PropertyCard = ({ item, colors, cardWidth, navigation, isSingleColumn }) => { 
  const showImage = parseInt(item.id) <= heroImages.length; 
  const imageSource = heroImages[parseInt(item.id) - 1];
  const [isFavorite, setIsFavorite] = useState(item.isFavorite); 
  
  const handleCardPress = () => {
    navigation.navigate('PropertyDetail', { 
      propertyId: item.id,
      chatName: `Listing ${item.id} Owner`,
    });
  };

  const handleFavoriteToggle = () => {
      setIsFavorite(prev => !prev);
  };

  const starColor = '#FFC700'; 
  const dangerColor = '#ff3b30';
  const successColor = '#34c759'; 
  const featuredColor = '#ff9500'; 
  const secondaryTagColor = colors.secondary;


  // Conditional Style adjustment for single vs multi column layout
  const currentCardWidth = isSingleColumn ? 'auto' : cardWidth;
  const currentImageHeight = isSingleColumn ? 160 : 65; 
  const priceFontSize = isSingleColumn ? 20 : 16;
  const detailsFontSize = isSingleColumn ? 14 : 13;


  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        { 
          backgroundColor: colors.mode === 'light' ? '#fff' : colors.card,
          width: currentCardWidth,
          marginHorizontal: isSingleColumn ? 8 : 0, 
        }
      ]}
      onPress={handleCardPress}
    >
      
      {/* 1. Image and Overlay Icons (Unchanged) */}
      <View style={styles.imageWrapper}>
        {showImage ? (
          <Image
            source={imageSource}
            style={[styles.cardImagePlaceholder, { height: currentImageHeight }]}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.cardImagePlaceholder,
              { height: currentImageHeight, backgroundColor: colors.mode === 'light' ? '#e0e0e0' : colors.card },
            ]}
          >
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
        
        {/* Favorite/Wishlist Icon */}
        <TouchableOpacity style={styles.favoriteIcon} onPress={handleFavoriteToggle}>
            <Icon 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={20} 
                color={isFavorite ? dangerColor : '#fff'}
            />
        </TouchableOpacity>

        {/* Price Tag Overlay */}
        <View style={[styles.priceTag, { backgroundColor: colors.primary }]}>
            <Text style={[styles.priceTagText, { fontSize: priceFontSize }]}>{item.price}</Text>
        </View>

        {/* Featured Tag */}
        {item.is_featured && (
            <View style={[styles.featuredTag, { backgroundColor: featuredColor }]}>
                <Text style={styles.featuredTagText}>🔥 FEATURED</Text>
            </View>
        )}
      </View>

      {/* 2. Content Details */}
      <View style={styles.cardContent}>
        
        {/* ROW 1: Property Tags (Type, Brokerage, Furnishing) */}
        <View style={styles.tagsRow}>
            {/* 1. Property Type Pill */}
            <View style={[styles.tagPill, { backgroundColor: colors.primary + '10' }]}>
                <Text style={[styles.tagText, { color: colors.primary }]}>{item.type}</Text>
            </View>

            {/* 2. No Brokerage Tag */}
            {item.is_no_brokerage && (
                <View style={[styles.tagPill, { backgroundColor: successColor + '10' }]}>
                    <Icon name="cash-outline" size={detailsFontSize} color={successColor} style={{ marginRight: 2 }}/>
                    <Text style={[styles.tagText, { color: successColor }]}>No Brokerage</Text>
                </View>
            )}

             {/* 3. Furnishing Status Tag */}
            <View style={[styles.tagPill, { backgroundColor: secondaryTagColor + '10' }]}>
                <Icon name="key-outline" size={detailsFontSize} color={secondaryTagColor} style={{ marginRight: 2 }}/>
                <Text style={[styles.tagText, { color: secondaryTagColor }]}>
                    {item.furnishing_status.replace(' Furnished', '').replace('f', 'F')} 
                </Text>
            </View>

        </View>
        
        {/* ROW 2: Location and Rating (Space Between) (Unchanged) */}
        <View style={styles.locationRatingRow}>
             {/* Location */}
            <View style={styles.locationRow}>
                <Icon name="location-outline" size={detailsFontSize} color={colors.text + '80'} />
                <Text style={[styles.cardLocation, { color: colors.text + '80', fontSize: detailsFontSize }]}>{item.location}</Text>
            </View>

            {/* Rating and Verified Badge Group */}
            <View style={styles.ratingAndVerifiedGroup}>
                {/* Verified Badge */}
                {item.is_verified && (
                    <Icon 
                        name="checkmark-circle" 
                        size={detailsFontSize + 2} 
                        color={successColor} 
                        style={styles.verifiedIcon} 
                    />
                )}
                {/* Rating */}
                <View style={styles.ratingBox}>
                    <StarRating rating={item.rating} size={detailsFontSize} color={starColor} />
                    <Text style={[styles.ratingText, { color: colors.text + '90', fontSize: detailsFontSize }]}>
                        {item.rating.toFixed(1)}
                    </Text>
                </View>
            </View>
        </View>

        {/* ROW 3: Specs (BHK/Bath/Sq.ft/Time) (Unchanged) */}
        <View style={[styles.specsRow, { borderTopColor: colors.border + '50' }]}>
            {/* Specs (BHK) */}
            <View style={styles.specPill}>
                <Icon name="bed-outline" size={detailsFontSize} color={colors.primary} />
                <Text style={[styles.specText, { color: colors.text, fontSize: detailsFontSize }]}>{item.bhk} BHK</Text>
            </View>
            {/* Specs (Bath) */}
            <View style={styles.specPill}>
                <Icon name="water-outline" size={detailsFontSize} color={colors.primary} />
                <Text style={[styles.specText, { color: colors.text, fontSize: detailsFontSize }]}>{item.bathrooms} Bath</Text>
            </View>
            {/* Specs (Sq.ft) */}
            <View style={styles.specPill}>
                <Icon name="expand-outline" size={detailsFontSize} color={colors.primary} />
                <Text style={[styles.specText, { color: colors.text, fontSize: detailsFontSize }]}>{item.size_sqft} sq.ft</Text>
            </View>
            {/* Specs (Time Listed) */}
            <View style={styles.specPill}>
                <Icon name="time-outline" size={detailsFontSize} color={colors.primary} />
                <Text style={[styles.specText, { color: colors.text, fontSize: detailsFontSize }]}>
                    {formatDaysListed(item.days_listed)}
                </Text>
            </View>
        </View>

      </View>
      
    </TouchableOpacity>
  );
};

// --- PropertyListing component (Unchanged) ---
const PropertyListing = ({ navigation }) => { 
// ... (Component remains the same)
// ...
// ...
// ...
  const { colors } = useTheme(); 
  const [currentPage, setCurrentPage] = useState(1);
  
  const initialColumns = Dimensions.get('window').width <= BREAKPOINT ? 1 : 4;
  const [columns, setColumns] = useState(initialColumns);
  
  const horizontalPadding = 16; 
  const gap = 10; 
  
  const calculateWidth = (width, cols) => {
    if (cols === 1) {
        return 'auto'; 
    } else {
        return (width - (horizontalPadding * 2) - ((cols - 1) * gap)) / cols - 4; 
    }
  }

  const screenWidth = Dimensions.get('window').width;
  const [cardWidth, setCardWidth] = useState(calculateWidth(screenWidth, initialColumns));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const cols = window.width <= BREAKPOINT ? 1 : 4;
      setColumns(cols);
      
      const newCalculatedWidth = calculateWidth(window.width, cols); 
      setCardWidth(newCalculatedWidth);
    });

    return () => subscription?.remove(); 
  }, []);

  const loadMore = () => {
    if (currentPage * ITEMS_PER_PAGE < properties.length) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const ITEMS_PER_PAGE = 8;
  const paginatedData = properties.slice(0, currentPage * ITEMS_PER_PAGE); 

  const isSingleColumn = columns === 1;

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.heading, { color: colors.text }]}>Recent Listings</Text>
      <FlatList
        key={columns} 
        data={paginatedData} 
        renderItem={({ item }) => (
            <PropertyCard 
                item={item} 
                colors={colors} 
                cardWidth={cardWidth} 
                navigation={navigation}
                isSingleColumn={isSingleColumn}
            />
        )}
        keyExtractor={item => item.id}
        numColumns={columns}
        contentContainerStyle={!isSingleColumn ? styles.listContentContainer : null}
        columnWrapperStyle={!isSingleColumn ? { gap: gap, justifyContent: 'space-between' } : null}
        scrollEnabled={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
      {currentPage * ITEMS_PER_PAGE < properties.length && (
         <TouchableOpacity 
            onPress={loadMore} 
            style={[styles.loadMoreButton, { borderColor: colors.primary }]}
         >
            <Text style={[styles.loadMoreText, { color: colors.primary }]}>Load More</Text>
         </TouchableOpacity>
      )}
    </View>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  wrapper: { 
    paddingHorizontal: 0,
  },
  listContentContainer: {
    paddingHorizontal: 16,
  },
  heading: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    marginTop: 10,
    paddingHorizontal: 16, 
  },
  cardContainer: {
    borderRadius: 12,
    marginBottom: 15, 
    elevation: 5, 
    overflow: 'hidden',
  },
  
  // --- Image Styles (Unchanged) ---
  imageWrapper: {
    position: 'relative',
  },
  cardImagePlaceholder: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    padding: 5,
    zIndex: 10, 
  },
  priceTag: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopRightRadius: 12,
  },
  priceTagText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  featuredTag: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomRightRadius: 12,
  },
  featuredTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // --- Content Styles ---
  cardContent: {
      padding: 12, 
  },
  
  // --- ROW 1: Property Tags (NEW) ---
  tagsRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8, // Using gap for spacing between tags
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  tagText: {
      fontWeight: '700',
      fontSize: 12,
  },
  
  // --- ROW 2: Location and Rating (Unchanged) ---
  locationRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, 
  },
  locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  cardLocation: {
      marginLeft: 3, 
  },
  ratingAndVerifiedGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedIcon: {
    marginRight: 8,
  },
  ratingBox: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  starRatingContainer: {
      flexDirection: 'row',
  },
  ratingText: {
      fontWeight: '700', 
      marginLeft: 4,
  },

  // --- ROW 3: Specs (BHK/Bath/Sq.ft/Time) (Unchanged) ---
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    borderTopWidth: 1,
    paddingTop: 10, 
    marginTop: 5, 
  },
  specPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15, 
  },
  specText: {
    marginLeft: 4,
  },
  
  // --- Load More Button (Unchanged) ---
  loadMoreButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 16, 
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '600',
  }
});

export default PropertyListing;