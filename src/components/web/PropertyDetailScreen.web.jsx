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
    FlatList,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/theme'; 
import { API_BASE_URL } from '@env'; 
const SCREEN_WIDTH = Dimensions.get('window').width;

// -----------------------------------------------------------------
// 🎨 VIBRANT COLORS, ULTRA-ROUNDED CORNERS & HIGH-IMPACT 3D SHADOWS (Disney-esque)
// -----------------------------------------------------------------
const DEEP_SOFT_SHADOW = {
    shadowColor: '#102A43', 
    shadowOffset: { width: 0, height: 15 }, // Increased for deeper lift
    shadowOpacity: 0.35, // More pronounced shadow
    shadowRadius: 25, // Wider and softer
    elevation: 18, // Android lift
};
const SUBTLE_SHADOW = { 
    shadowColor: '#102A43',
    shadowOffset: { width: 0, height: 6 }, // Increased
    shadowOpacity: 0.2, // Increased
    shadowRadius: 10, // Increased
    elevation: 6,
}
const GENEROUS_RADIUS = 30; // 🌟 ULTRA-ROUNDED CORNERS (User Request)

const GALLERY_PADDING = 20;
const ITEM_WIDTH = SCREEN_WIDTH - GALLERY_PADDING;
const IMAGE_ASPECT_RATIO = 0.65;
const IMAGE_HEIGHT = ITEM_WIDTH * IMAGE_ASPECT_RATIO;
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// 🚨 CONFIGURATION: API Endpoint 
// -----------------------------------------------------------------

const BASE_API_URL = API_BASE_URL; // ⬅️ .env से प्राप्त BASE URL का उपयोग करें
const SINGLE_LISTING_ENDPOINT = `${BASE_API_URL}/flatmate/listing`;
// -----------------------------------------------------------------

// --- DUMMY LINKING API (To simulate opening Google Maps) ---
const Linking = {
    openURL: (url) => {
        console.log(`Opening Maps URL: ${url}`);
    }
};
// --- END DUMMY LINKING API ---

// --- HELPER FUNCTIONS ---
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
            return '#FF5733'; // 🌟 High-Impact Vibrant Red-Orange
        case 'Sell':
            return '#1E90FF'; // Vibrant Dodger Blue
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

// --- PropertyDetailScreen component ---
const PropertyDetailScreen = ({ route, navigation }) => { 
    const { colors } = useTheme(); 
    
    const { propertyId, chatName } = route.params || {}; 
    
    const [property, setProperty] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0); 
    const flatListRef = useRef(null); 

    const [isNegotiationModalVisible, setIsNegotiationModalVisible] = useState(false);
    const [negotiationAmount, setNegotiationAmount] = useState('');
    
    // ⭐ NEW STATES FOR REVIEW MODAL
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [reviewRating, setReviewRating] = useState(5); 
    const [reviewComment, setReviewComment] = useState('');


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


    // Auto-Scroll Logic
    useEffect(() => {
        if (!property?.imageLinks || property.imageLinks.length <= 1) {
            return;
        }
        
        const intervalId = setInterval(() => {
            setActiveImageIndex(prevIndex => {
                const newIndex = (prevIndex + 1) % property.imageLinks.length;
                
                if (flatListRef.current) {
                    flatListRef.current.scrollToIndex({
                        index: newIndex, 
                        animated: true,
                    });
                }
                
                return newIndex;
            });
        }, 4000); 

        return () => clearInterval(intervalId);
    }, [property?.imageLinks]);


    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        if (ITEM_WIDTH > 0) {
             const index = Math.round(contentOffsetX / ITEM_WIDTH);
             setActiveImageIndex(index);
        }
    };
    
    // FIX: Optimized way to inform FlatList about item dimensions
    const getItemLayout = useCallback((data, index) => ({
        length: ITEM_WIDTH,
        offset: ITEM_WIDTH * index,
        index,
    }), []);


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

    // --- Negotiation Modal ---
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
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { 
                        backgroundColor: colors.card, 
                        borderColor: colors.border, 
                        borderWidth: 1, 
                        ...SUBTLE_SHADOW 
                    }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Submit Your Offer 💰</Text>
                        <Text style={{ color: colors.text + '80', marginBottom: 5, fontSize: 14 }}>
                            Current Price: **₹{(property?.price || 0).toLocaleString('en-IN')}**
                        </Text>
                        {property?.financials && (
                            <Text style={{ color: listingGoalColor, marginBottom: 20, fontSize: 13, fontWeight: 'bold' }}>
                                {maxPriceText}
                            </Text>
                        )}
                        <TextInput
                            style={[styles.modalInput, { borderColor: listingGoalColor, color: colors.text, backgroundColor: colors.background, borderRadius: GENEROUS_RADIUS - 10, borderWidth: 2 }]}
                            placeholder="Enter your negotiable amount (e.g., 22000)"
                            placeholderTextColor={colors.text + '60'}
                            keyboardType="numeric"
                            value={negotiationAmount}
                            onChangeText={setNegotiationAmount}
                        />
                        <TouchableOpacity 
                            onPress={submitNegotiation} 
                            style={[styles.actionButton, { backgroundColor: listingGoalColor, borderRadius: GENEROUS_RADIUS, ...DEEP_SOFT_SHADOW, shadowOffset: { width: 0, height: 10 } }]}
                        >
                            <Text style={styles.actionButtonText}>Submit Offer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setIsNegotiationModalVisible(false)} 
                            style={[styles.actionButton, { backgroundColor: colors.secondary, marginTop: 15, borderRadius: GENEROUS_RADIUS, ...DEEP_SOFT_SHADOW, shadowOffset: { width: 0, height: 10 } }]} 
                        >
                            <Text style={styles.actionButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };
    
    // --- Review Write Modal ---
    const renderReviewModal = () => {
        return (
            <Modal
                animationType="slide" 
                transparent={true}
                visible={isReviewModalVisible}
                onRequestClose={() => setIsReviewModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { 
                        backgroundColor: colors.card, 
                        borderColor: colors.primary + '50', 
                        borderWidth: 2, 
                        ...SUBTLE_SHADOW 
                    }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 15 }]}>Write Your Review ✍️</Text>
                        
                        <Text style={{ color: colors.text + '80', marginBottom: 10, fontSize: 16, fontWeight: 'bold' }}>
                            Rate this property:
                        </Text>
                        
                        {/* Interactive Rating Component */}
                        <View style={styles.ratingSelectorContainer}>
                            {[1, 2, 3, 4, 5].map((starValue) => (
                                <TouchableOpacity 
                                    key={starValue} 
                                    onPress={() => setReviewRating(starValue)}
                                    style={{ marginHorizontal: 5 }}
                                >
                                    <Icon 
                                        name={starValue <= reviewRating ? "star" : "star-outline"} 
                                        size={35} 
                                        color={'#FFC700'} 
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={{ color: colors.primary, marginBottom: 20, fontSize: 18, fontWeight: '900', textAlign: 'center' }}>
                            {reviewRating} Star{reviewRating !== 1 ? 's' : ''}
                        </Text>
                        

                        <TextInput
                            style={[
                                styles.modalInput, 
                                styles.reviewInput, 
                                { 
                                    borderColor: colors.primary, 
                                    color: colors.text, 
                                    backgroundColor: colors.background, 
                                    borderRadius: GENEROUS_RADIUS - 10, // Apply Generous Radius
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
                            style={[styles.actionButton, { backgroundColor: colors.primary, borderRadius: GENEROUS_RADIUS, ...DEEP_SOFT_SHADOW, shadowOffset: { width: 0, height: 10 }, marginTop: 15 }]}
                        >
                            <Text style={styles.actionButtonText}>Submit Review</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setIsReviewModalVisible(false)} 
                            style={[styles.actionButton, { backgroundColor: colors.secondary, marginTop: 15, borderRadius: GENEROUS_RADIUS, ...DEEP_SOFT_SHADOW, shadowOffset: { width: 0, height: 10 } }]} 
                        >
                            <Text style={styles.actionButtonText}>Cancel</Text>
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
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.text }]}>Loading property details...</Text>
                </View>
            </SafeAreaView>
        );
    }
    
    if (error || !property) {
        return (
             <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <View style={[styles.loadingContainer, { backgroundColor: colors.card, borderRadius: GENEROUS_RADIUS, ...DEEP_SOFT_SHADOW, margin: 20 }]}>
                    <Icon name="search-outline" size={50} color={error ? "#F44336" : colors.primary} />
                    <Text style={[styles.loadingText, { color: error ? "#F44336" : colors.text, textAlign: 'center', fontWeight: 'bold' }]}>
                        {error || "Listing not found or invalid ID."}
                    </Text>
                    {error && (
                        <TouchableOpacity onPress={() => fetchPropertyDetails(propertyId)} style={[styles.retryButton, { backgroundColor: colors.primary, marginTop: 20, borderRadius: GENEROUS_RADIUS - 10 }]}>
                            <Text style={[styles.retryButtonText, { color: 'white' }]}>Try Again</Text>
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
            <ScrollView style={styles.container}>
                
                {/* 1. Images Slideshow (Deep Soft 3D Image Card) */}
                <View style={styles.imageGalleryWrapper}>
                    {/* Apply GENEROUS_RADIUS and Deep Shadow to the container */}
                    <View style={[styles.imageGalleryContainer, {borderRadius: GENEROUS_RADIUS, height: IMAGE_HEIGHT, ...DEEP_SOFT_SHADOW}]}> 
                        {Array.isArray(imageLinks) && imageLinks.length > 0 ? (
                            <>
                                <FlatList
                                    ref={flatListRef} 
                                    data={imageLinks} 
                                    keyExtractor={(item, index) => index.toString()}
                                    horizontal={true}
                                    pagingEnabled={true}
                                    showsHorizontalScrollIndicator={false}
                                    onMomentumScrollEnd={handleScroll} 
                                    contentContainerStyle={{ height: IMAGE_HEIGHT }} 
                                    getItemLayout={getItemLayout}
                                    initialScrollIndex={activeImageIndex}
                                    renderItem={({ item: imageUrl }) => (
                                        <View style={{ width: ITEM_WIDTH, height: IMAGE_HEIGHT }}> 
                                            <Image
                                                source={{ uri: imageUrl }}
                                                // Apply radius to image for a cleaner look
                                                style={[styles.fullImage, { borderRadius: GENEROUS_RADIUS }]} 
                                                resizeMode="cover"
                                            />
                                        </View>
                                    )}
                                />
                                {/* Image Paging Dots */}
                                <View style={styles.paginationContainer}>
                                    {imageLinks.map((_, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.pagingDot,
                                                { 
                                                    // Use vibrant color for the active dot
                                                    backgroundColor: index === activeImageIndex ? listingGoalColor : colors.text + '60', 
                                                    width: 12, height: 12, borderRadius: 6, 
                                                },
                                            ]}
                                        />
                                    ))}
                                </View>
                            </>
                        ) : (
                            <View style={styles.noImagePlaceholder}>
                                <Icon name="image-outline" size={60} color={colors.text + '50'} />
                                <Text style={{ color: colors.text + '80', marginTop: 15, fontSize: 18 }}>Images Unavailable</Text>
                            </View>
                        )}
                    </View>
                </View>
                
                {/* 2. Main Content Area */}
                <View style={styles.contentArea}>

                    {/* 3. Price, Title & Verification Status (Main Card) */}
                    <View style={[styles.priceRowContainer, styles.cardStyle, { backgroundColor: colors.card, ...DEEP_SOFT_SHADOW, borderRadius: GENEROUS_RADIUS }]}>
                        <View style={styles.priceRow}>
                            <View style={styles.priceTextBlock}>
                                {/* Listing Goal Tag - High-Impact Pill */}
                                <View style={[styles.goalTag, { backgroundColor: listingGoalColor + '20', borderColor: listingGoalColor, borderWidth: 2, borderRadius: GENEROUS_RADIUS - 15 }]}>
                                    <Text style={[styles.goalTagText, { color: listingGoalColor }]}>
                                        {isFlatmateListing
                                            ? 'FLATMATE LISTING' 
                                            : (listingGoal || 'N/A').toUpperCase()
                                        }
                                    </Text>
                                </View>

                                <Text style={[styles.priceText, { color: colors.text, marginTop: 15 }]}>
                                    {`₹${(price || 0).toLocaleString('en-IN')}`}
                                    <Text style={[styles.pricePerText, { color: colors.text + '80' }]}>
                                        {listingGoal === 'Rent' || isFlatmateListing ? '/month' : ''}
                                    </Text>
                                </Text>
                                <View style={styles.locationRow}>
                                    <Icon name="location-sharp" size={22} color={listingGoalColor} />
                                    <Text style={[styles.locationText, { color: colors.text + '90' }]}>
                                        {location}
                                    </Text>
                                </View>
                            </View>
                            
                            {/* Rating and Verified Badge */}
                            <View style={styles.ratingAndVerifiedGroup}>
                                {isVerified && (
                                    <Icon 
                                        name="shield-checkmark" 
                                        size={40} 
                                        color={'#34c759'} 
                                        style={styles.verifiedIcon} 
                                    />
                                )}
                                {/* High-Impact Rating Box */}
                                <View style={[styles.ratingBox, { backgroundColor: colors.background, borderColor: listingGoalColor, borderWidth: 2, borderRadius: GENEROUS_RADIUS - 10, ...SUBTLE_SHADOW }]}>
                                    <StarRating rating={systemInfo.rating} size={22} color={'#FFC700'} /> 
                                    <Text style={[styles.ratingText, { color: colors.text, marginLeft: 8 }]}>
                                        {(parseFloat(systemInfo.rating) || 0).toFixed(1)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* 4. Specs / Quick Details Grid (High-Impact Interactive Cards - Reverted to Grid) */}
                    <View style={[styles.specsGridContainer]}> 
                        {quickDetails.map((item, index) => (
                            <TouchableOpacity 
                                key={index} 
                                activeOpacity={0.7} // Interactive press feedback
                                style={[
                                    styles.specPillGridItem, 
                                    { 
                                        backgroundColor: colors.card, 
                                        borderRadius: GENEROUS_RADIUS - 10, // Slightly less rounded for inner cards
                                        padding: 20, 
                                        ...SUBTLE_SHADOW 
                                    }
                                ]}
                            >
                                <Icon name={item.icon} size={28} color={listingGoalColor} />
                                <Text style={[styles.specTitleText, { color: colors.text + '80' }]}>{item.name}</Text>
                                <Text style={[styles.specValueText, { color: colors.text }]}>{item.value}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>


                    {/* 5. Description (Card) */}
                    <View style={[styles.section, styles.cardStyle, { backgroundColor: colors.card, ...DEEP_SOFT_SHADOW, borderRadius: GENEROUS_RADIUS }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Description 📜</Text>
                        <Text style={[styles.descriptionText, { color: colors.text + '90' }]}>
                            {description || 'No description provided for this listing. This property offers a vibrant community and modern living spaces, perfect for young professionals or families.'}
                        </Text>
                    </View>
                    
                    {/* 5.5. Additional Property Details */}
                    {(propertyDetails.furnishing_details || propertyDetails.totalCarpetAreaSqft) && (
                        <View style={[styles.section, styles.cardStyle, { backgroundColor: colors.card, ...DEEP_SOFT_SHADOW, borderRadius: GENEROUS_RADIUS }]}>
                            <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 24 }]}>Detailed Information 🔍</Text>
                            
                            {propertyDetails.totalCarpetAreaSqft && (
                                <Text style={[styles.infoDetailText, { color: colors.text }]}>
                                    <Icon name="expand" size={20} color={listingGoalColor} /> **Carpet Area:** {propertyDetails.totalCarpetAreaSqft} sq.ft
                                </Text>
                            )}

                            {propertyDetails.furnishing_details && (
                                <Text style={[styles.infoDetailText, { color: colors.text }]}>
                                    <Icon name="cube" size={20} color={listingGoalColor} /> **Furnishing Details:** {propertyDetails.furnishing_details}
                                </Text>
                            )}
                        </View>
                    )}


                    {/* 6. Financials, Availability and Brokerage Info (Card) */}
                    <View style={[styles.section, styles.cardStyle, { backgroundColor: colors.card, ...DEEP_SOFT_SHADOW, borderRadius: GENEROUS_RADIUS }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 5 }]}>Financial & Availability 💰</Text>
                        
                        <View style={styles.infoPillContainer}>
                            {/* InfoPill now uses listingGoalColor as accentColor */}
                            <InfoPill 
                                icon="key" 
                                title="Security Deposit" 
                                value={`₹${(financials.deposit || 0).toLocaleString('en-IN')}`} 
                                colors={colors} 
                                valueColor={colors.text} 
                                accentColor={listingGoalColor}
                            />
                            <InfoPill icon="calendar" title="Available From" value={availability.finalAvailableDate} colors={colors} accentColor={listingGoalColor}/>
                            <InfoPill icon="people" title="Current Occupants" value={availability.currentOccupants?.toString() || '0'} colors={colors} accentColor={listingGoalColor}/>
                            <InfoPill 
                                icon={financials.isNoBrokerage ? "wallet-sharp" : "alert-circle-sharp"} 
                                title="Brokerage" 
                                value={financials.isNoBrokerage ? "NO BROKERAGE" : "Brokerage Applicable"} 
                                colors={colors} 
                                valueColor={financials.isNoBrokerage ? '#34c759' : '#FF5733'} 
                                accentColor={listingGoalColor}
                            />
                        </View>
                        
                        {/* Negotiation Info */}
                        {financials.negotiationMarginPercent > 0 && ( 
                            <Text style={[styles.negotiationDiscount, { color: listingGoalColor, marginBottom: 20, fontSize: 17 }]}>
                                <Icon name="pricetags" size={18} color={listingGoalColor} /> Price is negotiable by up to **{financials.negotiationMarginPercent}%**
                            </Text>
                        )}

                        <TouchableOpacity 
                            onPress={handleNegotiate} 
                            // Applied GENEROUS_RADIUS and DEEP_SOFT_SHADOW
                            style={[styles.actionButton, { backgroundColor: listingGoalColor, borderRadius: GENEROUS_RADIUS, ...DEEP_SOFT_SHADOW }]}
                        >
                            <Icon name="cash-outline" size={22} color="white" style={{ marginRight: 8 }}/>
                            <Text style={styles.actionButtonText}>NEGOTIATE PRICE</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => navigation.navigate('ChatScreen', { propertyId: propertyId, chatName: `Chat for ${location}` })}
                            // Applied GENEROUS_RADIUS and DEEP_SOFT_SHADOW
                            style={[styles.actionButton, { backgroundColor: colors.secondary, marginTop: 15, borderRadius: GENEROUS_RADIUS, ...DEEP_SOFT_SHADOW }]}
                        >
                            <Icon name="chatbox-outline" size={22} color="white" style={{ marginRight: 8 }}/>
                            <Text style={styles.actionButtonText}>CONTACT OWNER/AGENT</Text>
                        </TouchableOpacity>
                        
                    </View>
                    
                    {/* 7. Property Amenities (Vibrant Pill Style) */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Amenities ✨</Text>
                         <View style={styles.amenitiesGrid}>
                            {amenitiesToDisplay.map((amenity, index) => ( 
                                <View key={index} style={[styles.amenityItem, { backgroundColor: listingGoalColor + '20', borderWidth: 2, borderColor: listingGoalColor + '50', borderRadius: GENEROUS_RADIUS - 10 }]}>
                                    <Icon name="checkmark-circle" size={20} color={listingGoalColor} style={{ marginRight: 10 }}/>
                                    <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>{amenity}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    
                    {/* 8. User/Tenant Preferences (High-Impact Cards) */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Flatmate/Tenant Preferences 👥</Text>
                        <View style={styles.preferencesRow}>
                            {/* PreferencePill now uses listingGoalColor as accentColor */}
                            <PreferencePill icon="male-female" title="Gender" value={preferences.preferredGender} colors={colors} accentColor={listingGoalColor} />
                            <PreferencePill icon="briefcase" title="Occupation" value={preferences.preferredOccupation || 'Any'} colors={colors} accentColor={listingGoalColor} />
                            <PreferencePill icon="pin" title="Work Location" value={preferences.preferredWorkLocation || 'Any Location'} colors={colors} accentColor={listingGoalColor} />
                        </View>
                    </View>

                    {/* 9. Reviews Section (Card) */}
                    <View style={[styles.section, styles.cardStyle, { backgroundColor: colors.card, ...DEEP_SOFT_SHADOW, borderRadius: GENEROUS_RADIUS }]}>
                        <View style={styles.reviewsHeader}>
                            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
                                Customer Reviews ({currentReviews.length}) 💬
                            </Text>
                            <View style={[styles.ratingBox, { borderWidth: 2, borderColor: listingGoalColor, borderRadius: GENEROUS_RADIUS - 10, backgroundColor: colors.background, paddingVertical: 8 }]}>
                                <StarRating rating={systemInfo.rating} size={20} color={'#FFC700'} /> 
                                <Text style={[styles.ratingText, { color: colors.text, marginLeft: 8 }]}>
                                    {(parseFloat(systemInfo.rating) || 0).toFixed(1)}/5
                                </Text>
                            </View>
                        </View>
                        
                         {currentReviews.map(review => (
                            <View key={review.id} style={[styles.reviewCard, { backgroundColor: colors.background, borderRadius: GENEROUS_RADIUS - 10, padding: 20, ...SUBTLE_SHADOW }]}>
                                <View style={styles.reviewUserRow}>
                                    <Text style={[styles.reviewUser, { color: colors.text }]}>{review.user}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                         <StarRating rating={review.rating} size={16} color={'#FFC700'} />
                                         <Text style={[styles.reviewDate, { color: colors.text + '60', marginLeft: 10 }]}>{review.date}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.reviewComment, { color: colors.text, lineHeight: 26 }]}>"{review.comment}"</Text>
                            </View>
                         ))}
                         
                        <TouchableOpacity 
                            onPress={handleWriteReview}
                            // Applied GENEROUS_RADIUS
                            style={[styles.reviewButton, { borderColor: listingGoalColor, borderRadius: GENEROUS_RADIUS, borderWidth: 3 }]}
                        >
                            <Icon name="pencil" size={20} color={listingGoalColor} style={{ marginRight: 8 }}/>
                            <Text style={[styles.reviewButtonText, { color: listingGoalColor }]}>Write a Review</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* 10. Listing System Information */}
                    <View style={[styles.section, styles.cardStyle, { backgroundColor: colors.card, ...DEEP_SOFT_SHADOW, borderRadius: GENEROUS_RADIUS }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 24 }]}>Listing Status & Owner ℹ️</Text>
                        
                        <View style={styles.infoPillContainer}>
                             <InfoPill 
                                icon="person-circle" 
                                title="Posted By" 
                                value={systemInfo.postedBy || 'Owner/Agent'} 
                                colors={colors} 
                                valueColor={colors.text} 
                                accentColor={listingGoalColor}
                            />
                            <InfoPill 
                                icon="time" 
                                title="Created At" 
                                value={formatTimestamp(systemInfo.createdAt)} 
                                colors={colors} 
                                valueColor={colors.text} 
                                accentColor={listingGoalColor}
                            />
                            <InfoPill 
                                icon="refresh-circle" 
                                title="Last Updated" 
                                value={formatTimestamp(systemInfo.updatedAt)} 
                                colors={colors} 
                                valueColor={colors.text} 
                                accentColor={listingGoalColor}
                            />
                            <InfoPill 
                                icon="server" 
                                title="Verification Status" 
                                value={systemInfo.status || 'Pending'} 
                                colors={colors} 
                                valueColor={isVerified ? '#34c759' : '#FF5733'} 
                                accentColor={listingGoalColor}
                            />
                        </View>
                    </View>


                    {/* 11. Map Section (Card) */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Location 🗺️</Text>
                        <View style={[styles.mapPlaceholder, styles.cardStyle, { backgroundColor: colors.card, ...DEEP_SOFT_SHADOW, borderRadius: GENEROUS_RADIUS }]}>
                            <Icon name="map" size={60} color={listingGoalColor} style={{ marginBottom: 15 }} />
                            <Text style={{ color: colors.text, marginBottom: 20, fontWeight: '700', fontSize: 18 }}>{location}</Text>
                            <TouchableOpacity onPress={handleOpenInMaps} 
                                // Applied GENEROUS_RADIUS - 10 and DEEP_SOFT_SHADOW
                                style={[styles.mapButton, { backgroundColor: listingGoalColor, borderRadius: GENEROUS_RADIUS - 10, ...DEEP_SOFT_SHADOW }]}
                            >
                                <Icon name="navigate-circle-outline" size={24} color="#fff" style={{ marginRight: 8 }}/>
                                <Text style={styles.mapButtonText}>Open in Google Maps</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={{ height: 50 }} /> {/* Footer buffer */}

                </View>
                
            </ScrollView>
        </SafeAreaView>
    );
};

// --- HELPER COMPONENTS (Playful and 3D) ---
const InfoPill = ({ icon, title, value, colors, valueColor, accentColor }) => (
    <View style={[styles.infoPillWrapper, { backgroundColor: colors.background, borderRadius: GENEROUS_RADIUS - 10, ...SUBTLE_SHADOW, borderWidth: 1, borderColor: accentColor + '50' }]}>
        <Icon name={icon} size={28} color={accentColor} style={{ marginRight: 20 }}/>
        <View>
            <Text style={[styles.infoPillTitle, { color: colors.text + '80', fontSize: 15 }]}>{title}</Text>
            <Text style={[styles.infoPillValue, { color: valueColor || colors.text, fontSize: 22, fontWeight: '900', marginTop: 3 }]}>{value}</Text>
        </View>
    </View>
);

const PreferencePill = ({ icon, title, value, colors, accentColor }) => (
    <View style={[styles.preferencePill, { backgroundColor: colors.card, borderColor: accentColor + '50', borderWidth: 2, borderRadius: GENEROUS_RADIUS - 10, ...SUBTLE_SHADOW }]}>
        <Icon name={icon} size={30} color={accentColor} />
        <Text style={[styles.preferenceTitle, { color: colors.text + '80', marginTop: 8, fontSize: 14 }]}>{title}</Text>
        <Text style={[styles.preferenceValue, { color: colors.text, fontWeight: 'bold', fontSize: 17 }]}>{value}</Text>
    </View>
);
// --- END HELPER COMPONENTS ---


// --- STYLES (Soft 3D & Playful) ---
const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 50 },
    loadingText: { marginTop: 15, fontSize: 18 },
    retryButton: { padding: 15, alignItems: 'center' },
    retryButtonText: { fontSize: 18, fontWeight: '900' },
    
    // --- Image Gallery Styles ---
    imageGalleryWrapper: { width: SCREEN_WIDTH, height: IMAGE_HEIGHT + 20, padding: 10 },
    imageGalleryContainer: { width: '100%', height: '100%', backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
    fullImage: { width: '100%', height: '100%', }, // Radius is applied inline
    noImagePlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    paginationContainer: { position: 'absolute', bottom: 30, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    pagingDot: { marginHorizontal: 5 },

    // --- Content Styles ---
    contentArea: { paddingHorizontal: 16, paddingTop: 10 },
    priceRowContainer: { marginBottom: 35 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    priceTextBlock: { flex: 1 },
    goalTag: { paddingHorizontal: 15, paddingVertical: 8, alignSelf: 'flex-start' },
    goalTagText: { fontSize: 15, fontWeight: '900' },
    priceText: { fontSize: 42, fontWeight: '900', marginBottom: 5 },
    pricePerText: { fontSize: 24, fontWeight: '600' },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    locationText: { fontSize: 18, marginLeft: 10 },
    ratingAndVerifiedGroup: { flexDirection: 'column', alignItems: 'center', paddingTop: 5 },
    verifiedIcon: { marginBottom: 10 },
    ratingBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
    ratingText: { fontWeight: '800', fontSize: 18 },

    // --- Specs Grid (Interactive Cards) - NEW/RESTORED STYLES ---
    specsGridContainer: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        marginBottom: 40, 
        marginTop: 10 
    },
    specPillGridItem: { 
        width: '48%', // Two columns
        flexDirection: 'column', 
        alignItems: 'flex-start',
        marginBottom: 15, 
    },
    specTitleText: { 
        marginTop: 8,
        fontSize: 16,
        fontWeight: '500',
    },
    specValueText: { 
        fontSize: 24,
        fontWeight: '900',
        marginTop: 2,
    },
    
    // --- Section Styles ---
    section: { marginBottom: 40 },
    sectionTitle: { fontSize: 30, fontWeight: '900', marginBottom: 20 },
    descriptionText: { fontSize: 17, lineHeight: 28 },
    cardStyle: { padding: 30, borderWidth: 0 },
    infoDetailText: { fontSize: 17, marginBottom: 12, fontWeight: '600', }, 
    
    // --- Info Pills ---
    infoPillContainer: { flexDirection: 'column', gap: 25, marginBottom: 30, },
    infoPillWrapper: { flexDirection: 'row', alignItems: 'center', padding: 18, paddingHorizontal: 25 },
    
    negotiationDiscount: { fontWeight: '700', alignSelf: 'flex-start' },
    actionButton: { padding: 22, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
    actionButtonText: { color: 'white', fontSize: 20, fontWeight: '900' },
    
    // --- Amenities Grid (Vibrant) ---
    amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
    amenityItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
    
    // --- Preferences (Card Style) ---
    preferencesRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 15 },
    preferencePill: { flex: 1, minWidth: 100, padding: 25, alignItems: 'center' },

    // --- Reviews ---
    reviewsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    reviewButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, marginTop: 25, fontWeight: 'bold' },
    reviewButtonText: { fontSize: 18, fontWeight: '800' },
    reviewCard: { marginBottom: 15, borderBottomWidth: 0, borderWidth: 0 },
    reviewUserRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    reviewUser: { fontSize: 18, fontWeight: 'bold' },
    reviewComment: { fontSize: 16, fontStyle: 'italic', },
    reviewDate: { fontSize: 14 },
    
    // --- Map Styles ---
    mapPlaceholder: { height: 280, justifyContent: 'center', alignItems: 'center' },
    mapButton: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    mapButtonText: { color: '#fff', fontWeight: '800', fontSize: 18 },
    
    // --- Modal Styles ---
    modalOverlay: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(65, 64, 64, 0.8)', 
    },
    modalContent: { 
        width: '85%', 
        maxWidth: 450, 
        padding: 40, // Increased padding
        borderRadius: 35, // More rounded modal
        borderWidth: 0, 
        ...DEEP_SOFT_SHADOW 
    },
    modalInput: { padding: 18, marginBottom: 25, fontSize: 18 },
    
    // ⭐ Review Modal Styles
    reviewInput: { 
        height: 120, 
        textAlignVertical: 'top', 
        marginBottom: 10,
    },
    ratingSelectorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5,
    },
});

export default PropertyDetailScreen;