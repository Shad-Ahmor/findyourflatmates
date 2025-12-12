// src/screens/PropertyDetailScreen.web.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react'; 
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, // Used for animated/interactive elements
    Image,
    Dimensions,
    ActivityIndicator, 
    Modal, 
    TextInput, 
    Platform,
    FlatList, // 💡 THIS IS THE CAROUSEL COMPONENT
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/theme'; 
import { API_BASE_URL } from '@env'; 

// =================================================================
// 🚨 RESPONSIVE CONFIGURATION (New Breakpoints)
// =================================================================
const MOBILE_BREAKPOINT = 500; // 500px तक मोबाइल माना जाएगा
const TABLET_BREAKPOINT = 1024; // 501px से 1024px तक टैबलेट
// =================================================================

// ⚠️ SCREEN_WIDTH को अब सीधे Dimensions.get('window').width से नहीं लेंगे, बल्कि state से लेंगे
const SCREEN_WIDTH = Dimensions.get('window').width; 


// -----------------------------------------------------------------
// 🎨 VIBRANT COLORS, ULTRA-ROUNDED CORNERS & HIGH-IMPACT 3D SHADOWS (Disney-esque)
// -----------------------------------------------------------------
const DEEP_SOFT_SHADOW = {
    shadowColor: '#102A43', 
    shadowOffset: { width: 0, height: 15 }, 
    shadowOpacity: 0.35, 
    shadowRadius: 25, 
    elevation: 18, 
};
const SUBTLE_SHADOW = { 
    shadowColor: '#102A43',
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 10, 
    elevation: 6,
}
const GENEROUS_RADIUS = 30; 

const GALLERY_PADDING = 20;
// ITEM_WIDTH और IMAGE_HEIGHT अब कंपोनेंट के अंदर गतिशील रूप से गणना किए जाएंगे
const IMAGE_ASPECT_RATIO = 0.65; // Default for Web/Desktop
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// 🚨 CONFIGURATION: API Endpoint 
// -----------------------------------------------------------------

const BASE_API_URL = API_BASE_URL; 
const SINGLE_LISTING_ENDPOINT = `${BASE_API_URL}/flatmate/listing`;
// -----------------------------------------------------------------

// --- DUMMY LINKING API (To simulate opening Google Maps) ---
const Linking = {
    openURL: (url) => {
        console.log(`Opening Maps URL: ${url}`);
    }
};
// --- END DUMMY LINKING API ---

// --- HELPER FUNCTIONS (No change needed) ---
const formatDaysListed = (days) => { 
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}m ago`;
};
const calculateDaysListed = (createdAt) => { 
    if (!createdAt) return 0;
    const today = new Date();
    const createdDate = new Date(createdAt);
    const diffTime = Math.abs(today - createdDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
}; 
const getListingGoalColor = (goal) => { 
    switch (goal) {
        case 'Rent':
        case 'Flatmate':
            return '#FF5733'; 
        case 'Sell':
            return '#1E90FF'; 
        default:
            return '#8E8E93'; 
    }
};
const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
const StarRating = ({ rating, size = 18, color }) => { 
    const stars = [];
    const numRating = parseFloat(rating) || 0; 
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
        let name = "star-outline";
        if (i < fullStars) {
            name = "star";
        } else if (i === fullStars && hasHalfStar) {
            name = "star-half-sharp";
        }
        stars.push(<Icon key={i} name={name} size={size} color={color} style={{ marginLeft: 2 }} />);
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
}; 
// --- END HELPER FUNCTIONS ---

// --- DUMMY REVIEW DATA (Placeholder) ---
const dummyReviews = [
    { id: '1', user: 'Rohan S.', rating: 5, comment: 'Great location and excellent amenities.', date: '3w ago' },
];
// --- END DUMMY REVIEW DATA ---

// --- HELPER COMPONENTS (Now receive dynamic styles) ---
const InfoPill = ({ icon, title, value, colors, valueColor, accentColor, dynamicStyles }) => (
    <View style={[dynamicStyles.infoPillWrapper, { backgroundColor: colors.background, borderWidth: 1, borderColor: accentColor + '50' }]}>
        <Icon name={icon} size={dynamicStyles.infoPillIconSize} color={accentColor} style={{ marginRight: 20 }}/>
        <View>
            <Text style={[dynamicStyles.infoPillTitle, { color: colors.text + '80' }]}>{title}</Text>
            <Text style={[dynamicStyles.infoPillValue, { color: valueColor || colors.text }]}>{value}</Text>
        </View>
    </View>
);

const PreferencePill = ({ icon, title, value, colors, accentColor, dynamicStyles }) => (
    <View style={[dynamicStyles.preferencePill, { backgroundColor: colors.card, borderColor: accentColor + '50', borderWidth: 2, ...getWebShadow(SUBTLE_SHADOW) }]}>
        <Icon name={icon} size={dynamicStyles.preferenceIconSize} color={accentColor} />
        <Text style={[dynamicStyles.preferenceTitle, { color: colors.text + '80' }]}>{title}</Text>
        <Text style={[dynamicStyles.preferenceValue, { color: colors.text }]}>{value}</Text>
    </View>
);
// --- END HELPER COMPONENTS ---


// --- PropertyDetailScreen component ---
const PropertyDetailScreen = ({ route, navigation }) => { 
    const { colors } = useTheme(); 
    const { propertyId, chatName } = route.params || {}; 
    
    const [property, setProperty] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0); 
    const flatListRef = useRef(null); // Ref for FlatList to control scrolling

    const [isNegotiationModalVisible, setIsNegotiationModalVisible] = useState(false);
    const [negotiationAmount, setNegotiationAmount] = useState('');
    
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [reviewRating, setReviewRating] = useState(5); 
    const [reviewComment, setReviewComment] = useState('');

    // =================================================================
    // 🚨 RESPONSIVE LOGIC (Step 1 & 2)
    // =================================================================
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
    
    const isMobile = windowWidth <= MOBILE_BREAKPOINT;
    const isTablet = windowWidth > MOBILE_BREAKPOINT && windowWidth <= TABLET_BREAKPOINT;
    
    // Update windowWidth on resize
    useEffect(() => {
      const handleResize = ({ window }) => setWindowWidth(window.width);
      const subscription = Dimensions.addEventListener('change', handleResize);
      return () => subscription?.remove();
    }, []);
    // =================================================================


    const fetchPropertyDetails = useCallback(async (id) => {
        if (!id) {
            setError("Property ID is missing. Cannot fetch details.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${SINGLE_LISTING_ENDPOINT}/${id}`); 
            
            if (!response.ok) {
                 let errorData;
                 try {
                     errorData = await response.json();
                 } catch (e) {
                     errorData = { message: `Server error, status: ${response.status}` };
                 }
                 
                 if (response.status === 404) {
                     throw new Error("Listing not found. Please verify the property ID.");
                 }
                 
                 throw new Error(errorData.message || `Failed to fetch property details: ${response.status}`);
            }
            
            const data = await response.json();
            setProperty(data);
            
        } catch (err) {
            console.error("Fetch Property Details Error:", err);
            setError(err.message || "Failed to load listing details from server.");
        } finally {
            setIsLoading(false);
        }
    }, []); 
    
    useEffect(() => {
        fetchPropertyDetails(propertyId);
        
        if (chatName) {
            navigation.setOptions({ 
                title: chatName,
                headerStyle: { backgroundColor: colors.headerBackground },
                headerTintColor: colors.headerText,
            });
        }
    }, [propertyId, chatName, navigation, fetchPropertyDetails, colors.headerBackground, colors.headerText]);

    // 💡 CAROUSEL LOGIC: Auto-Scroll using useEffect and setInterval
    useEffect(() => {
        if (!property?.imageLinks || property.imageLinks.length <= 1) {
            return;
        }
        
        const intervalId = setInterval(() => {
            setActiveImageIndex(prevIndex => {
                const newIndex = (prevIndex + 1) % property.imageLinks.length;
                
                if (flatListRef.current) {
                    // Use a timeout if immediate scrollToIndex fails on Web during unmount
                    setTimeout(() => {
                        flatListRef.current.scrollToIndex({
                            index: newIndex, 
                            animated: true,
                        });
                    }, 0);
                }
                
                return newIndex;
            });
        }, 4000); // Scrolls every 4 seconds

        return () => clearInterval(intervalId);
    }, [property?.imageLinks]);


    // --- Dynamic Dimensions Calculation ---
    // Recalculate dimensions based on current window width and responsiveness
    // Note: itemWidth here is the width of the image view within the gallery wrapper
    const itemWidth = windowWidth - GALLERY_PADDING;
    const imageAspectRatio = isMobile ? 0.8 : IMAGE_ASPECT_RATIO; // Taller image on mobile
    const imageHeight = itemWidth * imageAspectRatio;
    // ------------------------------------
    

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        if (itemWidth > 0) {
             const index = Math.round(contentOffsetX / itemWidth);
             setActiveImageIndex(index);
        }
    };
    
    const getItemLayout = useCallback((data, index) => ({
        length: itemWidth,
        offset: itemWidth * index,
        index,
    }), [itemWidth]);


    const handleOpenInMaps = () => {
        const address = property?.location; 
        if (address) {
            Alert.alert(
                "Open Map",
                `Maps to ${property.location} on Google Maps?`,
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Open", onPress: () => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`) }
                ]
            );
        } else {
            Alert.alert("Error", "Location details unavailable.");
        }
    };

    const handleNegotiate = () => {
        setIsNegotiationModalVisible(true);
    };
    
    const handleWriteReview = () => {
        setIsReviewModalVisible(true);
        setReviewComment(''); 
        setReviewRating(5); 
    };
    
    const submitReview = () => {
        if (!reviewComment.trim() || reviewRating === 0) {
            Alert.alert("Incomplete Review", "Please provide a rating and write a comment.");
            return;
        }

        Alert.alert(
            "Review Submitted! 🎉", 
            `Your ${reviewRating}-star review has been submitted. Comment: "${reviewComment.trim().substring(0, 50)}${reviewComment.trim().length > 50 ? '...' : ''}"`
        );
        setIsReviewModalVisible(false);
        setReviewComment('');
        setReviewRating(5);
        // NOTE: Here you would add the actual API call logic to submit the review
    };

    const submitNegotiation = () => {
        if (!negotiationAmount || isNaN(negotiationAmount) || parseFloat(negotiationAmount) <= 0) {
            Alert.alert("Invalid Offer", "Please enter a valid amount.");
            return;
        }

        Alert.alert("Negotiation Submitted", `Your offer of ₹${parseFloat(negotiationAmount).toLocaleString('en-IN')} has been submitted.`);
        setIsNegotiationModalVisible(false);
        setNegotiationAmount('');
    };

    // Get dynamic styles based on screen size
    const dynamicStyles = getDynamicStyles({ 
        colors, 
        isMobile, 
        isTablet, 
        windowWidth, 
        itemWidth, 
        imageHeight 
    });


    // --- Negotiation Modal (Using dynamic styles) ---
    const renderNegotiationModal = () => {
        const maxPriceText = property?.financials?.maxNegotiablePrice 
            ? `Owner is willing to accept a minimum of ₹${property.financials.maxNegotiablePrice.toLocaleString('en-IN')}.`
            : property?.financials?.negotiationMarginPercent > 0
            ? `Price is negotiable by up to ${property.financials.negotiationMarginPercent}% of the current price.`
            : `Negotiation margin is not specified by the owner.`;
        
        const listingGoalColor = getListingGoalColor(property?.listingGoal);

        return (
            <Modal
                animationType="fade" 
                transparent={true}
                visible={isNegotiationModalVisible}
                onRequestClose={() => setIsNegotiationModalVisible(false)}
            >
                <View style={dynamicStyles.modalOverlay}>
                    <View style={[dynamicStyles.modalContent, { 
                        backgroundColor: colors.card, 
                        borderColor: colors.border, 
                        ...getWebShadow(SUBTLE_SHADOW) // Apply web-optimized shadow
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
                            onPress={() => setIsNegotiationModalVisible(false)} 
                            style={[dynamicStyles.actionButton, { backgroundColor: colors.secondary, marginTop: dynamicStyles.actionButtonMarginTop, ...getWebShadow(DEEP_SOFT_SHADOW, colors.secondary) }]} 
                        >
                            <Text style={dynamicStyles.actionButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };
    
    // --- Review Write Modal (Using dynamic styles) ---
    const renderReviewModal = () => {
        return (
            <Modal
                animationType="slide" 
                transparent={true}
                visible={isReviewModalVisible}
                onRequestClose={() => setIsReviewModalVisible(false)}
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
                                        name={starValue <= reviewRating ? "star" : "star-outline"} 
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
                            onPress={() => setIsReviewModalVisible(false)} 
                            style={[dynamicStyles.actionButton, { backgroundColor: colors.secondary, marginTop: dynamicStyles.actionButtonMarginTop, ...getWebShadow(DEEP_SOFT_SHADOW, colors.secondary) }]} 
                        >
                            <Text style={dynamicStyles.actionButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };


    
    // --- CONDITIONAL RENDERING (Loading/Error State) ---
    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={dynamicStyles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[dynamicStyles.loadingText, { color: colors.text }]}>Loading property details...</Text>
                </View>
            </SafeAreaView>
        );
    }
    
    if (error || !property) {
        return (
             <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={[dynamicStyles.loadingContainer, dynamicStyles.cardStyle, { 
                    backgroundColor: colors.card, 
                    margin: dynamicStyles.sectionMargin, 
                    ...getWebShadow(DEEP_SOFT_SHADOW)
                }]}>
                    <Icon name="search-outline" size={dynamicStyles.loadingIconSize} color={error ? "#F44336" : colors.primary} />
                    <Text style={[dynamicStyles.loadingText, { color: error ? "#F44336" : colors.text, textAlign: 'center', fontWeight: 'bold' }]}>
                        {error || "Listing not found or invalid ID."}
                    </Text>
                    {error && (
                        <TouchableOpacity onPress={() => fetchPropertyDetails(propertyId)} style={[dynamicStyles.retryButton, { backgroundColor: colors.primary, marginTop: dynamicStyles.actionButtonMarginTop }]}>
                            <Text style={[dynamicStyles.retryButtonText, { color: 'white' }]}>Try Again</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        );
    }


    // --- DATA TRANSFORMATION FOR RENDERING ---
    const { 
        propertyDetails = {}, 
        financials = {}, 
        availability = {}, 
        preferences = {}, 
        systemInfo = {},
        location,
        price,
        description,
        imageLinks,
        listingGoal,
    } = property;
    
    const listingGoalColor = getListingGoalColor(listingGoal);
    const isFlatmateListing = property.is_flatmate_listing || (listingGoal === 'Flatmate'); 
    const isVerified = systemInfo.status === 'Verified'; 
    
    const currentReviews = dummyReviews;
    
    const amenitiesToDisplay = propertyDetails.selectedAmenities && propertyDetails.selectedAmenities.length > 0 
        ? propertyDetails.selectedAmenities 
        : ["24/7 Water", "Power Backup", "Lift", "Parking"];
    
    // 🌟 Quick Details Data Structure for Grid (High-Impact)
    const quickDetails = [
        { icon: "home", name: 'Type', value: propertyDetails.propertyType || 'N/A' },
        { icon: "bed", name: 'Bedrooms', value: propertyDetails.bhkOrRooms || 'N/A' },
        { icon: "water", name: 'Bathrooms', value: propertyDetails.bathrooms + ' Bath' },
        { 
            icon: "expand", 
            name: 'Carpet Area', 
            value: propertyDetails.totalCarpetAreaSqft ? `${propertyDetails.totalCarpetAreaSqft} sq.ft` : 'N/A',
        },
        { icon: "color-fill", name: 'Furnishing', value: propertyDetails.furnishing_status || 'Unfurnished' },
        { 
            icon: "time", 
            name: 'Listed Since', 
            value: formatDaysListed(calculateDaysListed(systemInfo.createdAt)),
        },
    ];


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            {renderNegotiationModal()}
            {renderReviewModal()}
            <ScrollView style={dynamicStyles.container}>
                
                {/* 1. Images Slideshow (Deep Soft 3D Image Card) */}
                <View style={[dynamicStyles.imageGalleryWrapper, { height: imageHeight + 20 }]}>
                    <View style={[dynamicStyles.imageGalleryContainer, { height: imageHeight, ...getWebShadow(DEEP_SOFT_SHADOW) }]}> 
                        {Array.isArray(imageLinks) && imageLinks.length > 0 ? (
                            <>
                                {/* 💡 CAROUSEL IMPLEMENTATION START */}
                                <FlatList
                                    ref={flatListRef} 
                                    data={imageLinks} 
                                    keyExtractor={(item, index) => index.toString()}
                                    horizontal={true} // Essential for horizontal sliding
                                    pagingEnabled={true} // Essential for snapping to the next image
                                    showsHorizontalScrollIndicator={false}
                                    onMomentumScrollEnd={handleScroll} // Updates activeImageIndex on manual scroll
                                    contentContainerStyle={{ height: imageHeight }} 
                                    getItemLayout={getItemLayout} // Performance optimization
                                    initialScrollIndex={activeImageIndex}
                                    renderItem={({ item: imageUrl }) => (
                                        <View style={{ width: itemWidth, height: imageHeight }}> 
                                            <Image
                                                source={{ uri: imageUrl }}
                                                style={dynamicStyles.fullImage} 
                                                resizeMode="cover"
                                            />
                                        </View>
                                    )}
                                />
                                {/* Image Paging Dots - FIXED FOR CLICK/PRESS INTERACTION */}
                                <View style={dynamicStyles.paginationContainer}>
                                    {imageLinks.map((_, index) => (
                                        <TouchableOpacity // 💡 FIX: Changed View to TouchableOpacity
                                            key={index}
                                            activeOpacity={0.8}
                                            onPress={() => { // 💡 FIX: Added onPress handler
                                                if (flatListRef.current) {
                                                    flatListRef.current.scrollToIndex({ index: index, animated: true });
                                                    setActiveImageIndex(index);
                                                }
                                            }}
                                            style={[
                                                dynamicStyles.pagingDot,
                                                { 
                                                    backgroundColor: index === activeImageIndex ? listingGoalColor : colors.text + '60', 
                                                    // Added scale and opacity for better visual feedback
                                                    transform: [{ scale: index === activeImageIndex ? 1.2 : 1 }], 
                                                    opacity: index === activeImageIndex ? 1 : 0.7,
                                                },
                                            ]}
                                        />
                                    ))}
                                </View>
                                {/* 💡 CAROUSEL IMPLEMENTATION END */}
                            </>
                        ) : (
                            <View style={dynamicStyles.noImagePlaceholder}>
                                <Icon name="image-outline" size={dynamicStyles.noImageIconSize} color={colors.text + '50'} />
                                <Text style={[dynamicStyles.noImageText, { color: colors.text + '80' }]}>Images Unavailable</Text>
                            </View>
                        )}
                    </View>
                </View>
                
                {/* 2. Main Content Area */}
                <View style={dynamicStyles.contentArea}>

                    {/* 3. Price, Title & Verification Status (Main Card) */}
                    <View style={[dynamicStyles.priceRowContainer, dynamicStyles.cardStyle, { backgroundColor: colors.card, ...getWebShadow(DEEP_SOFT_SHADOW) }]}>
                        <View style={dynamicStyles.priceRow}>
                            <View style={dynamicStyles.priceTextBlock}>
                                {/* Listing Goal Tag - High-Impact Pill */}
                                <View style={[dynamicStyles.goalTag, { backgroundColor: listingGoalColor + '20', borderColor: listingGoalColor, borderWidth: 2 }]}>
                                    <Text style={[dynamicStyles.goalTagText, { color: listingGoalColor }]}>
                                        {isFlatmateListing
                                            ? 'FLATMATE LISTING' 
                                            : (listingGoal || 'N/A').toUpperCase()
                                        }
                                    </Text>
                                </View>

                                <Text style={[dynamicStyles.priceText, { color: colors.text, marginTop: dynamicStyles.priceTextMarginTop }]}>
                                    {`₹${(price || 0).toLocaleString('en-IN')}`}
                                    <Text style={[dynamicStyles.pricePerText, { color: colors.text + '80' }]}>
                                        {listingGoal === 'Rent' || isFlatmateListing ? '/month' : ''}
                                    </Text>
                                </Text>
                                <View style={dynamicStyles.locationRow}>
                                    <Icon name="location-sharp" size={dynamicStyles.locationIconSize} color={listingGoalColor} />
                                    <Text style={[dynamicStyles.locationText, { color: colors.text + '90' }]}>
                                        {location}
                                    </Text>
                                </View>
                            </View>
                            
                            {/* Rating and Verified Badge */}
                            <View style={dynamicStyles.ratingAndVerifiedGroup}>
                                {isVerified && (
                                    <Icon 
                                        name="shield-checkmark" 
                                        size={dynamicStyles.verifiedIconSize} 
                                        color={'#34c759'} 
                                        style={dynamicStyles.verifiedIcon} 
                                    />
                                )}
                                {/* High-Impact Rating Box */}
                                <View style={[dynamicStyles.ratingBox, { backgroundColor: colors.background, borderColor: listingGoalColor, borderWidth: 2, ...getWebShadow(SUBTLE_SHADOW) }]}>
                                    <StarRating rating={systemInfo.rating} size={dynamicStyles.ratingStarSize} color={'#FFC700'} /> 
                                    <Text style={[dynamicStyles.ratingText, { color: colors.text, marginLeft: 8 }]}>
                                        {(parseFloat(systemInfo.rating) || 0).toFixed(1)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* 4. Specs / Quick Details Grid (Interactive Cards) */}
                    <View style={[dynamicStyles.specsGridContainer]}> 
                        {quickDetails.map((item, index) => (
                            <TouchableOpacity 
                                key={index} 
                                activeOpacity={0.7}
                                style={[
                                    dynamicStyles.specPillGridItem, 
                                    { 
                                        backgroundColor: colors.card, 
                                        ...getWebShadow(SUBTLE_SHADOW) 
                                    }
                                ]}
                            >
                                <Icon name={item.icon} size={dynamicStyles.specIconSize} color={listingGoalColor} />
                                <Text style={[dynamicStyles.specTitleText, { color: colors.text + '80' }]}>{item.name}</Text>
                                <Text style={[dynamicStyles.specValueText, { color: colors.text }]}>{item.value}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>


                    {/* 5. Description (Card) */}
                    <View style={[dynamicStyles.section, dynamicStyles.cardStyle, { backgroundColor: colors.card, ...getWebShadow(DEEP_SOFT_SHADOW) }]}>
                        <Text style={[dynamicStyles.sectionTitle, { color: colors.text }]}>Description 📜</Text>
                        <Text style={[dynamicStyles.descriptionText, { color: colors.text + '90' }]}>
                            {description || 'No description provided for this listing. This property offers a vibrant community and modern living spaces, perfect for young professionals or families.'}
                        </Text>
                    </View>
                    
                    {/* 5.5. Additional Property Details */}
                    {(propertyDetails.furnishing_details || propertyDetails.totalCarpetAreaSqft) && (
                        <View style={[dynamicStyles.section, dynamicStyles.cardStyle, { backgroundColor: colors.card, ...getWebShadow(DEEP_SOFT_SHADOW) }]}>
                            <Text style={[dynamicStyles.sectionTitle, dynamicStyles.infoSectionTitle, { color: colors.text }]}>Detailed Information 🔍</Text>
                            
                            {propertyDetails.totalCarpetAreaSqft && (
                                <Text style={[dynamicStyles.infoDetailText, { color: colors.text }]}>
                                    <Icon name="expand" size={dynamicStyles.infoDetailIconSize} color={listingGoalColor} /> **Carpet Area:** {propertyDetails.totalCarpetAreaSqft} sq.ft
                                </Text>
                            )}

                            {propertyDetails.furnishing_details && (
                                <Text style={[dynamicStyles.infoDetailText, { color: colors.text }]}>
                                    <Icon name="cube" size={dynamicStyles.infoDetailIconSize} color={listingGoalColor} /> **Furnishing Details:** {propertyDetails.furnishing_details}
                                </Text>
                            )}
                        </View>
                    )}


                    {/* 6. Financials, Availability and Brokerage Info (Card) */}
                    <View style={[dynamicStyles.section, dynamicStyles.cardStyle, { backgroundColor: colors.card, ...getWebShadow(DEEP_SOFT_SHADOW) }]}>
                        <Text style={[dynamicStyles.sectionTitle, { color: colors.text, marginBottom: dynamicStyles.infoPillContainerMarginBottom / 6 }]}>Financial & Availability 💰</Text>
                        
                        <View style={dynamicStyles.infoPillContainer}>
                            <InfoPill 
                                icon="key" 
                                title="Security Deposit" 
                                value={`₹${(financials.deposit || 0).toLocaleString('en-IN')}`} 
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
                    
                    {/* 7. Property Amenities (Vibrant Pill Style) */}
                    <View style={dynamicStyles.section}>
                        <Text style={[dynamicStyles.sectionTitle, { color: colors.text }]}>Amenities ✨</Text>
                         <View style={dynamicStyles.amenitiesGrid}>
                            {amenitiesToDisplay.map((amenity, index) => ( 
                                <View key={index} style={[dynamicStyles.amenityItem, { backgroundColor: listingGoalColor + '20', borderWidth: 2, borderColor: listingGoalColor + '50' }]}>
                                    <Icon name="checkmark-circle" size={dynamicStyles.amenityIconSize} color={listingGoalColor} style={{ marginRight: 10 }}/>
                                    <Text style={[dynamicStyles.amenityText, { color: colors.text }]}>{amenity}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    
                    {/* 8. User/Tenant Preferences (High-Impact Cards) */}
                    <View style={dynamicStyles.section}>
                        <Text style={[dynamicStyles.sectionTitle, { color: colors.text }]}>Flatmate/Tenant Preferences 👥</Text>
                        <View style={dynamicStyles.preferencesRow}>
                            <PreferencePill icon="male-female" title="Gender" value={preferences.preferredGender} colors={colors} accentColor={listingGoalColor} dynamicStyles={dynamicStyles} />
                            <PreferencePill icon="briefcase" title="Occupation" value={preferences.preferredOccupation || 'Any'} colors={colors} accentColor={listingGoalColor} dynamicStyles={dynamicStyles} />
                            <PreferencePill icon="pin" title="Work Location" value={preferences.preferredWorkLocation || 'Any Location'} colors={colors} accentColor={listingGoalColor} dynamicStyles={dynamicStyles} />
                        </View>
                    </View>

                    {/* 9. Reviews Section (Card) */}
                    <View style={[dynamicStyles.section, dynamicStyles.cardStyle, { backgroundColor: colors.card, ...getWebShadow(DEEP_SOFT_SHADOW) }]}>
                        <View style={dynamicStyles.reviewsHeader}>
                            <Text style={[dynamicStyles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
                                Customer Reviews ({currentReviews.length}) 💬
                            </Text>
                            <View style={[dynamicStyles.ratingBox, { borderWidth: 2, borderColor: listingGoalColor, backgroundColor: colors.background, paddingVertical: dynamicStyles.ratingBoxPaddingVertical }]}>
                                <StarRating rating={systemInfo.rating} size={dynamicStyles.ratingStarSize} color={'#FFC700'} /> 
                                <Text style={[dynamicStyles.ratingText, { color: colors.text, marginLeft: 8 }]}>
                                    {(parseFloat(systemInfo.rating) || 0).toFixed(1)}/5
                                </Text>
                            </View>
                        </View>
                        
                         {currentReviews.map(review => (
                            <View key={review.id} style={[dynamicStyles.reviewCard, { backgroundColor: colors.background, ...getWebShadow(SUBTLE_SHADOW) }]}>
                                <View style={dynamicStyles.reviewUserRow}>
                                    <Text style={[dynamicStyles.reviewUser, { color: colors.text }]}>{review.user}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                         <StarRating rating={review.rating} size={dynamicStyles.reviewStarSize} color={'#FFC700'} />
                                         <Text style={[dynamicStyles.reviewDate, { color: colors.text + '60', marginLeft: 10 }]}>{review.date}</Text>
                                    </View>
                                </View>
                                <Text style={[dynamicStyles.reviewComment, { color: colors.text }]}>"{review.comment}"</Text>
                            </View>
                         ))}
                         
                        <TouchableOpacity 
                            onPress={handleWriteReview}
                            style={[dynamicStyles.reviewButton, { borderColor: listingGoalColor, borderWidth: 3 }]}
                        >
                            <Icon name="pencil" size={dynamicStyles.reviewButtonIconSize} color={listingGoalColor} style={{ marginRight: 8 }}/>
                            <Text style={[dynamicStyles.reviewButtonText, { color: listingGoalColor }]}>Write a Review</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* 10. Listing System Information */}
                    <View style={[dynamicStyles.section, dynamicStyles.cardStyle, { backgroundColor: colors.card, ...getWebShadow(DEEP_SOFT_SHADOW) }]}>
                        <Text style={[dynamicStyles.sectionTitle, dynamicStyles.infoSectionTitle, { color: colors.text }]}>Listing Status & Owner ℹ️</Text>
                        
                        <View style={dynamicStyles.infoPillContainer}>
                             <InfoPill 
                                icon="person-circle" 
                                title="Posted By" 
                                value={systemInfo.postedBy || 'Owner/Agent'} 
                                colors={colors} 
                                valueColor={colors.text} 
                                accentColor={listingGoalColor}
                                dynamicStyles={dynamicStyles}
                            />
                            <InfoPill 
                                icon="time" 
                                title="Created At" 
                                value={formatTimestamp(systemInfo.createdAt)} 
                                colors={colors} 
                                valueColor={colors.text} 
                                accentColor={listingGoalColor}
                                dynamicStyles={dynamicStyles}
                            />
                            <InfoPill 
                                icon="refresh-circle" 
                                title="Last Updated" 
                                value={formatTimestamp(systemInfo.updatedAt)} 
                                colors={colors} 
                                valueColor={colors.text} 
                                accentColor={listingGoalColor}
                                dynamicStyles={dynamicStyles}
                            />
                            <InfoPill 
                                icon="server" 
                                title="Verification Status" 
                                value={systemInfo.status || 'Pending'} 
                                colors={colors} 
                                valueColor={isVerified ? '#34c759' : '#FF5733'} 
                                accentColor={listingGoalColor}
                                dynamicStyles={dynamicStyles}
                            />
                        </View>
                    </View>


                    {/* 11. Map Section (Card) */}
                    <View style={dynamicStyles.section}>
                        <Text style={[dynamicStyles.sectionTitle, { color: colors.text }]}>Location 🗺️</Text>
                        <View style={[dynamicStyles.mapPlaceholder, dynamicStyles.cardStyle, { backgroundColor: colors.card, ...getWebShadow(DEEP_SOFT_SHADOW) }]}>
                            <Icon name="map" size={dynamicStyles.mapIconSize} color={listingGoalColor} style={{ marginBottom: 15 }} />
                            <Text style={[dynamicStyles.mapLocationText, { color: colors.text }]}>{location}</Text>
                            <TouchableOpacity onPress={handleOpenInMaps} 
                                style={[dynamicStyles.mapButton, { backgroundColor: listingGoalColor, ...getWebShadow(DEEP_SOFT_SHADOW, listingGoalColor) }]}
                            >
                                <Icon name="navigate-circle-outline" size={dynamicStyles.mapButtonIconSize} color="#fff" style={{ marginRight: 8 }}/>
                                <Text style={dynamicStyles.mapButtonText}>Open in Google Maps</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={{ height: dynamicStyles.footerBufferHeight }} /> 

                </View>
                
            </ScrollView>
        </SafeAreaView>
    );
};

// --- DYNAMIC STYLESHEET GENERATOR ---

const getWebShadow = (rnShadow, color = '#102A43') => {
    // Converts RN shadow object to Web's BoxShadow string
    if (Platform.OS === 'web') {
        const opacity = rnShadow.shadowOpacity || 0.3;
        const radius = rnShadow.shadowRadius || 10;
        const offset = rnShadow.shadowOffset?.height || 0;
        
        // Convert hex/rgb color to rgba for dynamic opacity
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '16,42,67';
        };
        const baseRgb = hexToRgb(color);
        const shadowRgba = `rgba(${baseRgb}, ${opacity})`;

        return {
             boxShadow: `${rnShadow.shadowOffset?.width || 0}px ${offset}px ${radius}px ${shadowRgba}`,
             elevation: rnShadow.elevation, 
        };
    }
    return rnShadow; 
}


const getDynamicStyles = ({ colors, isMobile, isTablet, windowWidth, itemWidth, imageHeight }) => {
    
    // -----------------------------------------------------
    // 📐 DIMENSIONS & SIZES (Dynamically Calculated)
    // -----------------------------------------------------
    const HORIZONTAL_PADDING = isMobile ? 16 : (isTablet ? 25 : 30);
    const SECTION_MARGIN = isMobile ? 30 : (isTablet ? 40 : 50);
    const CARD_PADDING = isMobile ? 20 : (isTablet ? 30 : 40);
    
    // Font Sizes
    const PRICE_FONT_SIZE = isMobile ? 36 : (isTablet ? 42 : 48);
    const PRICE_PER_FONT_SIZE = isMobile ? 18 : (isTablet ? 20 : 24);
    const SECTION_TITLE_SIZE = isMobile ? 24 : (isTablet ? 28 : 32);
    const GENERAL_TEXT_SIZE = isMobile ? 16 : 17;

    // Icon/Element Sizes
    const INFO_ICON_SIZE = isMobile ? 22 : 28;
    const ACTION_BUTTON_ICON_SIZE = isMobile ? 20 : 24;
    const RATING_STAR_SIZE = isMobile ? 18 : 22;
    const VERIFIED_ICON_SIZE = isMobile ? 30 : 40;
    const MAP_ICON_SIZE = isMobile ? 50 : 60;
    
    // Layout Widths
    const SPEC_PILL_WIDTH = isMobile ? '48%' : (isTablet ? '31%' : '15%'); // 2 | 3 | 6 columns
    const PREFERENCE_PILL_WIDTH = isMobile ? '100%' : (isTablet ? '31%' : '31%'); // 1 | 3 | 3 columns

    return {
        // --- Base Container/Layout ---
        container: { flex: 1 },
        contentArea: { paddingHorizontal: HORIZONTAL_PADDING, paddingTop: isMobile ? 10 : 20 },
        section: { marginBottom: SECTION_MARGIN },
        sectionMargin: SECTION_MARGIN,
        footerBufferHeight: isMobile ? 50 : 80, 

        // --- Card Styles ---
        cardStyle: { padding: CARD_PADDING, borderRadius: GENEROUS_RADIUS },
        
        // --- Image Gallery Styles (Carousel) ---
        imageGalleryWrapper: { width: windowWidth, padding: 10 },
        imageGalleryContainer: { width: '100%', height: '100%', borderRadius: GENEROUS_RADIUS, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
        fullImage: { width: '100%', height: '100%', borderRadius: GENEROUS_RADIUS },
        noImagePlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
        noImageText: { marginTop: 15, fontSize: GENERAL_TEXT_SIZE },
        noImageIconSize: MAP_ICON_SIZE,
        paginationContainer: { position: 'absolute', bottom: isMobile ? 15 : 30, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
        pagingDot: { marginHorizontal: 5, width: isMobile ? 8 : 12, height: isMobile ? 8 : 12, borderRadius: isMobile ? 4 : 6, transitionProperty: 'background-color, transform, opacity', transitionDuration: '0.3s' }, // Added transition for smooth hover/active effect


        // --- Price/Title Block ---
        priceRowContainer: { marginBottom: SECTION_MARGIN / 1.5 },
        priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
        priceTextBlock: { flex: 1 },
        goalTag: { paddingHorizontal: isMobile ? 10 : 15, paddingVertical: isMobile ? 6 : 8, alignSelf: 'flex-start', borderRadius: GENEROUS_RADIUS - 15 },
        goalTagText: { fontSize: isMobile ? 12 : 15, fontWeight: '900' },
        priceText: { fontSize: PRICE_FONT_SIZE, fontWeight: '900', marginBottom: 5 },
        pricePerText: { fontSize: PRICE_PER_FONT_SIZE, fontWeight: '600' },
        priceTextMarginTop: isMobile ? 10 : 15,
        locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: isMobile ? 5 : 8 },
        locationIconSize: isMobile ? 18 : 22,
        locationText: { fontSize: GENERAL_TEXT_SIZE, marginLeft: 10, flexShrink: 1 },
        
        ratingAndVerifiedGroup: { flexDirection: 'column', alignItems: 'center', paddingTop: isMobile ? 0 : 5 },
        verifiedIcon: { marginBottom: isMobile ? 5 : 10 },
        ratingBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: isMobile ? 10 : 15, borderRadius: GENEROUS_RADIUS - 10 },
        ratingStarSize: RATING_STAR_SIZE,
        ratingText: { fontWeight: '800', fontSize: isMobile ? 16 : 18 },
        verifiedIconSize: VERIFIED_ICON_SIZE,


        // --- Specs Grid (Interactive Cards) ---
        specsGridContainer: { 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between', 
            marginBottom: SECTION_MARGIN / 1.5, 
            marginTop: 10,
            gap: isMobile ? 8 : (isTablet ? 15 : 20), // Added gap for better spacing
        },
        specPillGridItem: { 
            width: SPEC_PILL_WIDTH, 
            flexDirection: 'column', 
            alignItems: 'flex-start',
            marginBottom: isMobile ? 7 : 0, 
            padding: isMobile ? 15 : 20, 
            borderRadius: GENEROUS_RADIUS - 10, 
        },
        specIconSize: INFO_ICON_SIZE,
        specTitleText: { 
            marginTop: isMobile ? 6 : 8,
            fontSize: isMobile ? 14 : 16,
            fontWeight: '500',
        },
        specValueText: { 
            fontSize: isMobile ? 18 : 24,
            fontWeight: '900',
            marginTop: 2,
        },

        // --- Description/Info Section ---
        sectionTitle: { fontSize: SECTION_TITLE_SIZE, fontWeight: '900', marginBottom: isMobile ? 15 : 20 },
        infoSectionTitle: { fontSize: isMobile ? 20 : 24 },
        descriptionText: { fontSize: GENERAL_TEXT_SIZE, lineHeight: isMobile ? 24 : 28 },
        infoDetailText: { fontSize: GENERAL_TEXT_SIZE, marginBottom: isMobile ? 10 : 12, fontWeight: '600', }, 
        infoDetailIconSize: isMobile ? 18 : 20,

        // --- Info Pills ---
        infoPillContainerMarginBottom: isMobile ? 20 : 30,
        infoPillContainer: { flexDirection: 'column', gap: isMobile ? 15 : 20, marginBottom: isMobile ? 20 : 30 },
        infoPillWrapper: { 
            flexDirection: 'row', 
            alignItems: 'center', 
            padding: isMobile ? 15 : 18, 
            paddingHorizontal: isMobile ? 20 : 25,
            borderRadius: GENEROUS_RADIUS - 10,
        },
        infoPillIconSize: INFO_ICON_SIZE,
        infoPillTitle: { fontSize: isMobile ? 14 : 15 },
        infoPillValue: { fontSize: isMobile ? 18 : 22, fontWeight: '900', marginTop: 3 },
        
        negotiationDiscount: { fontWeight: '700', alignSelf: 'flex-start', fontSize: isMobile ? 15 : 17 },
        negotiationDiscountIconSize: isMobile ? 16 : 18,
        
        actionButton: { 
            padding: isMobile ? 18 : 22, 
            alignItems: 'center', 
            flexDirection: 'row', 
            justifyContent: 'center', 
            borderRadius: GENEROUS_RADIUS 
        },
        actionButtonText: { color: 'white', fontSize: isMobile ? 18 : 20, fontWeight: '900' },
        actionButtonIconSize: ACTION_BUTTON_ICON_SIZE,
        actionButtonMarginTop: isMobile ? 15 : 15,
        
        // --- Amenities Grid (Vibrant) ---
        amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: isMobile ? 10 : 15 },
        amenityItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: isMobile ? 15 : 20, paddingVertical: isMobile ? 10 : 12, borderRadius: GENEROUS_RADIUS - 10 },
        amenityIconSize: isMobile ? 18 : 20,
        amenityText: { fontWeight: '700', fontSize: isMobile ? 14 : 16 },
        
        // --- Preferences (Card Style) ---
        preferencesRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: isMobile ? 15 : 20 },
        preferencePill: { 
            width: PREFERENCE_PILL_WIDTH, 
            minWidth: 100, 
            padding: isMobile ? 18 : 25, 
            alignItems: 'center',
            borderRadius: GENEROUS_RADIUS - 10,
        },
        preferenceIconSize: isMobile ? 24 : 30,
        preferenceTitle: { marginTop: 8, fontSize: isMobile ? 13 : 14 },
        preferenceValue: { fontWeight: 'bold', fontSize: isMobile ? 16 : 17 },

        // --- Reviews ---
        reviewsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? 15 : 20 },
        reviewButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: isMobile ? 15 : 18, marginTop: isMobile ? 15 : 25, fontWeight: 'bold', borderRadius: GENEROUS_RADIUS },
        reviewButtonText: { fontSize: isMobile ? 16 : 18, fontWeight: '800' },
        reviewButtonIconSize: isMobile ? 18 : 20,
        reviewCard: { marginBottom: isMobile ? 10 : 15, padding: isMobile ? 15 : 20, borderRadius: GENEROUS_RADIUS - 10 },
        reviewUserRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? 5 : 8 },
        reviewUser: { fontSize: isMobile ? 16 : 18, fontWeight: 'bold' },
        reviewComment: { fontSize: isMobile ? 15 : 16, fontStyle: 'italic', lineHeight: isMobile ? 22 : 26 },
        reviewDate: { fontSize: isMobile ? 12 : 14 },
        ratingBoxPaddingVertical: isMobile ? 5 : 8,
        reviewStarSize: isMobile ? 14 : 16,
        
        // --- Map Styles ---
        mapPlaceholder: { height: isMobile ? 250 : 280, justifyContent: 'center', alignItems: 'center', borderRadius: GENEROUS_RADIUS },
        mapIconSize: MAP_ICON_SIZE,
        mapLocationText: { marginBottom: isMobile ? 15 : 20, fontWeight: '700', fontSize: isMobile ? 16 : 18 },
        mapButton: { flexDirection: 'row', alignItems: 'center', padding: isMobile ? 15 : 20, borderRadius: GENEROUS_RADIUS - 10 },
        mapButtonText: { color: '#fff', fontWeight: '800', fontSize: isMobile ? 16 : 18 },
        mapButtonIconSize: ACTION_BUTTON_ICON_SIZE,

        // --- Modal Styles ---
        modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(65, 64, 64, 0.8)' },
        modalContent: { 
            width: isMobile ? '95%' : (isTablet ? '70%' : '35%'), 
            maxWidth: 450, 
            padding: isMobile ? 30 : 40, 
            borderRadius: 35, 
        },
        modalInput: { padding: isMobile ? 15 : 18, marginBottom: isMobile ? 15 : 25, fontSize: isMobile ? 16 : 18, borderRadius: GENEROUS_RADIUS - 10 },
        modalVerticalMargin: isMobile ? 15 : 20,
        modalTextSize: isMobile ? 14 : 16,
        modalSubTextSize: isMobile ? 13 : 15,
        reviewInput: { height: 120, textAlignVertical: 'top', marginBottom: isMobile ? 10 : 15,},
        ratingSelectorContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 5, },
        ratingIconSize: isMobile ? 30 : 35,
        reviewStarText: { fontSize: isMobile ? 16 : 18, fontWeight: '900', textAlign: 'center' },
        
        // --- Loading/Error States ---
        loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: isMobile ? 30 : 50 },
        loadingText: { marginTop: 15, fontSize: isMobile ? 16 : 18 },
        loadingIconSize: MAP_ICON_SIZE,
        retryButton: { padding: 15, alignItems: 'center', borderRadius: GENEROUS_RADIUS - 10 },
        retryButtonText: { fontSize: isMobile ? 16 : 18, fontWeight: '900' },
    };
};


export default PropertyDetailScreen;