// src/screens/PropertyDetailScreen.jsx

import React, { useState } from 'react'; 
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    Image,
    Dimensions,
    ActivityIndicator, 
    Modal, 
    TextInput, 
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/theme'; 

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- DUMMY LINKING API (To simulate opening Google Maps) ---
const Linking = {
    openURL: (url) => {
        alert(`Simulating Opening Maps:\n\nURL: ${url}`);
    }
};
// --- END DUMMY LINKING API ---

// --- ASSET IMPORTS (Placeholder images) ---
const heroImages = {
    slide1: require('../../assets/hero_slide_1.jpg'),
    slide2: require('../../assets/hero_slide_2.jpg'),
    slide3: require('../../assets/hero_slide_3.jpg'),
};
// --- END ASSET IMPORTS ---

// Helper function to format days listed
const formatDaysListed = (days) => {
    if (days < 30) {
        return `${days}d ago`;
    }
    if (days < 365) {
        const months = Math.floor(days / 30);
        return `${months}m ago`;
    }
    const years = Math.floor(days / 365);
    return `${years}y ago`;
};

// Helper function for amenity icons
const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
        case 'wifi': return 'wifi';
        case 'parking': return 'car';
        case 'gym': return 'barbell';
        case 'balcony': return 'sunny';
        case 'ac': return 'snow';
        case 'security': return 'lock-closed';
        case 'lift': return 'elevator';
        default: return 'checkmark-circle';
    }
};

// DUMMY DETAILED PROPERTY DATA (INCLUDES ALL NEW FIELDS)
const getPropertyDetails = (id) => {
    // Example: Property 2 is Flatmate, Property 3 is Sale
    const isFlatmate = id === '2'; 
    const isSale = id === '3';
    
    return {
        id,
        name: isSale ? 'Luxury 3BHK for Sale' : (isFlatmate ? 'Seeking Male Flatmate for 2BHK' : 'Spacious 2BHK with Balcony'),
        type: isSale ? 'Flat' : (isFlatmate ? 'Flatmate' : 'Flat'),
        location: isSale ? 'Lower Parel, Mumbai' : (isFlatmate ? 'Bandra E, Mumbai' : 'Andheri W, Mumbai'),
        
        // --- CORE LISTING GOAL ---
        listing_goal: isSale ? 'Sale' : (isFlatmate ? 'Flatmate' : 'Rent'),
        is_flatmate_listing: isFlatmate, 
        
        // Price adjusted based on goal
        price: isSale ? '₹2.5 Cr' : (isFlatmate ? '₹12,000' : '₹20,000'), 
        deposit: isSale ? 'N/A' : '₹40,000',
        price_per_sqft: '₹20,833', // For Sale listings
        
        description: isSale ? "A premium sale listing with excellent views." : "Newly renovated flat in a secured society. Comes with dedicated parking and 24/7 water supply. Move-in ready immediately.",
        
        bhk: isSale ? '3 BHK' : (isFlatmate ? '2 BHK' : '2 BHK'),
        bathrooms: isSale ? 3 : (isFlatmate ? 2 : 2),
        area: isSale ? '1200 sqft' : (isFlatmate ? '1000 sqft' : '1200 sqft'),
        
        amenities: ['Wifi', 'Parking', 'Gym', 'Balcony', 'AC', 'Security', 'Lift'],
        imageUrls: [heroImages.slide1, heroImages.slide2, heroImages.slide3],
        
        is_verified: true,
        is_no_brokerage: !isFlatmate,
        furnishing_status: 'Fully Furnished',
        days_listed: isSale ? 120 : 5, 
        is_new_listing: isFlatmate, 
        days_to_close: isFlatmate ? 7 : (isSale ? 90 : 30), // Urgency
        
        occupancy_status: isFlatmate ? 'Occupied' : 'Vacant', 
        available_from: isFlatmate ? 'Now' : 'Now', 
        
        map_coordinates: { latitude: 19.1136, longitude: 72.8696 }, 

        // --- FLATIMATE REQUIREMENTS ---
        current_occupants: isFlatmate ? 1 : 0, 
        preferred_gender: isFlatmate ? 'Male' : null, 
        preferred_occupation: isFlatmate ? 'IT Professional/Engineer' : null,
        preferred_work_location: isFlatmate ? 'BKC/Andheri MIDC' : null,
        // --- END FLATMATE REQUIREMENTS ---

        postedBy: 'Ramesh Sharma',
        userType: isFlatmate ? 'Current Tenant' : 'Owner',
        userJoined: 'Joined 6 months ago',
        userImage: 'https://via.placeholder.com/150/007AFF/FFFFFF?text=User', 
        averageRating: 4.5,
        totalReviews: 125,
        reviews: [
            { id: 'r1', user: 'Amit K.', rating: 5, comment: 'Excellent location and well-maintained property.', date: '2 weeks ago' },
        ]
    };
};

// --- HELPER: Google Maps URL Generator ---
const getMapUrl = (latitude, longitude) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    // Fallback URL for web/general usage
    return `http://maps.google.com/maps?q=${latLng}`;
};
// --- END HELPER ---

// --- StarRating Component ---
const StarRating = ({ rating, size = 18, color, style }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
        stars.push(<Icon key={`full-${i}`} name="star" size={size} color={color} style={{ marginRight: 2 }} />);
    }
    if (hasHalfStar) {
        stars.push(<Icon key="half" name="star-half" size={size} color={color} style={{ marginRight: 2 }} />);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<Icon key={`empty-${i}`} name="star-outline" size={size} color={color} style={{ marginRight: 2 }} />);
    }

    return <View style={styles.starRatingContainer}>{stars}</View>;
};
// --- END StarRating ---

// Component for a single detail item (Pill)
const DetailPill = ({ icon, text, colors }) => (
    <View style={[styles.detailPill, { backgroundColor: colors.card, borderColor: colors.primary + '30' }]}>
        <Icon name={icon} size={16} color={colors.primary} style={{ marginRight: 5 }} />
        <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>{text}</Text>
    </View>
);

// Component for a simple tag
const InfoTag = ({ icon, text, colors, tagColor }) => (
    <View style={[styles.infoTag, { backgroundColor: tagColor + '10' }]}>
        <Icon name={icon} size={14} color={tagColor} style={{ marginRight: 4 }} />
        <Text style={[styles.infoTagText, { color: tagColor }]}>{text}</Text>
    </View>
);

// --- NEW HELPER COMPONENT: ReqDetail for Flatmate ---
const ReqDetail = ({ icon, label, value, colors }) => (
    <View style={styles.reqDetailItem}>
        <Icon name={icon} size={20} color={colors.primary} />
        <View style={styles.reqDetailTextWrapper}>
            <Text style={[styles.reqDetailLabel, { color: colors.text + '80' }]}>{label}</Text>
            <Text style={[styles.reqDetailValue, { color: colors.text, fontWeight: '700' }]}>{value}</Text>
        </View>
    </View>
);
// --- END ReqDetail ---

// --- ReviewModal Component ---
const ReviewModal = ({ visible, onClose, onSubmit, userRating, setUserRating, userComment, setUserComment, colors }) => {
    
    return (
         <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalCenteredView}>
                <View style={[styles.modalView, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Rate This Property</Text>
                    
                    <Text style={[styles.modalSubtitle, { color: colors.text + '90' }]}>
                        Select a star rating:
                    </Text>
                    <View style={styles.ratingInputContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
                                <Icon 
                                    name={star <= userRating ? "star" : "star-outline"} 
                                    size={35} 
                                    color={styles.starYellow} 
                                    style={{ marginHorizontal: 5 }} 
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    
                    <TextInput
                        style={[styles.reviewInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card, minHeight: 100 }]}
                        placeholder="Share your experience (Optional)"
                        placeholderTextColor={colors.text + '60'}
                        multiline
                        numberOfLines={4}
                        value={userComment}
                        onChangeText={setUserComment}
                    />

                    <View style={styles.modalButtonRow}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton, { borderColor: colors.text }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.submitButton, { backgroundColor: colors.primary }]}
                            onPress={onSubmit} // Calling the passed onSubmit prop
                            disabled={userRating === 0}
                        >
                            <Text style={styles.submitButtonText}>Submit Review</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
// --- END ReviewModal ---


// --- NegotiationModal Component (MODIFIED) ---
const NegotiationModal = ({ visible, onClose, onSubmit, currentPrice, listingGoal, colors }) => {
    const [negotiatedPrice, setNegotiatedPrice] = useState('');
    const [error, setError] = useState('');

    const getDiscountPercentage = () => {
        // Clean current price (Remove currency/text, keep numbers and dots)
        const currentPriceCleaned = currentPrice.replace(/[^0-9.]/g, ''); 
        const currentPriceValue = parseFloat(currentPriceCleaned);
        const inputPriceValue = parseFloat(negotiatedPrice.replace(/[^0-9.]/g, ''));

        if (isNaN(inputPriceValue) || inputPriceValue >= currentPriceValue || currentPriceValue === 0) {
            return null;
        }

        const discount = currentPriceValue - inputPriceValue;
        const percentage = ((discount / currentPriceValue) * 100).toFixed(1);
        return `You are asking for a ${percentage}% discount.`;
    };


    const handleSubmit = () => {
        // Clean current price (Remove currency/text, keep numbers and dots)
        const currentPriceCleaned = currentPrice.replace(/[^0-9.]/g, ''); 
        const currentPriceValue = parseFloat(currentPriceCleaned);
        const inputPriceValue = parseFloat(negotiatedPrice.replace(/[^0-9.]/g, ''));
        
        if (isNaN(inputPriceValue) || inputPriceValue <= 0) {
            setError('Please enter a valid amount.');
            return;
        }

        // Logic check: Offer cannot be higher than asking price (unless it's a flatmate listing where the price might be indicative)
        if (inputPriceValue > currentPriceValue && listingGoal !== 'Flatmate') {
             setError(`Proposed price cannot be higher than the asking price (${currentPrice}).`);
            return;
        }
        
        // Pass the cleaned, formatted price to the parent handler
        onSubmit(`₹${inputPriceValue.toLocaleString('en-IN')}`);
        setNegotiatedPrice('');
        setError('');
    };

    const negotiationType = listingGoal === 'Sale' ? 'Offer' : 'Proposed Price';
    const placeholderText = listingGoal === 'Sale' ? 'Enter your offer (e.g., 23000000)' : 'Enter proposed monthly rent (e.g., 18000)';
    const priceUnit = listingGoal === 'Sale' ? '' : '/month';

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalCenteredView}>
                <View style={[styles.modalView, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                        {listingGoal === 'Sale' ? 'Make a Purchase Offer' : 'Negotiate Rent Price'}
                    </Text>
                    
                    <Text style={[styles.negotiationCurrentPrice, { color: colors.text + '80' }]}>
                        Asking {listingGoal === 'Sale' ? 'Price' : 'Rent'}: 
                        <Text style={{ fontWeight: 'bold', color: colors.primary }}>{currentPrice} {priceUnit}</Text>
                    </Text>
                    
                    <TextInput
                        style={[styles.reviewInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card, minHeight: 50, height: 50, marginBottom: 10 }]}
                        placeholder={placeholderText}
                        placeholderTextColor={colors.text + '60'}
                        keyboardType="numeric"
                        value={negotiatedPrice}
                        onChangeText={text => {
                            setNegotiatedPrice(text.replace(/[^0-9.]/g, ''));
                            setError('');
                        }}
                    />
                    
                    {/* NEW: Discount Percentage Display */}
                    {negotiatedPrice && listingGoal === 'Rent' && getDiscountPercentage() && (
                        <Text style={[styles.negotiationDiscount, { color: colors.secondary }]}>
                            {getDiscountPercentage()}
                        </Text>
                    )}
                    {/* END NEW */}


                    {error ? (
                        <Text style={[styles.negotiationError, { color: '#ff3b30' }]}>{error}</Text>
                    ) : (
                        <Text style={[styles.negotiationTip, { color: colors.text + '60' }]}>
                            Tip: Submit a reasonable {negotiationType.toLowerCase()} for a faster response.
                        </Text>
                    )}

                    <View style={styles.modalButtonRow}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton, { borderColor: colors.text }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.submitButton, { backgroundColor: colors.secondary }]}
                            onPress={handleSubmit}
                            disabled={!negotiatedPrice}
                        >
                            <Text style={styles.submitButtonText}>Submit {negotiationType}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
// --- END NegotiationModal ---


const PropertyDetailScreen = ({ route, navigation }) => {
    const { propertyId, chatName } = route.params;
    const { colors } = useTheme();
    const property = getPropertyDetails(propertyId);
    
    const [isReviewModalVisible, setReviewModalVisible] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [isNegotiateModalVisible, setNegotiateModalVisible] = useState(false);


    if (!property) {
        return <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />;
    }

    const handleContact = () => {
        navigation.navigate('ActualChatWindow', { chatId: propertyId, chatName: chatName || property.postedBy });
    };
    
    const handleNegotiate = (negotiatedPrice) => {
        alert(`Negotiation Request Sent! Proposed Price: ${negotiatedPrice}. The seller will respond shortly.`);
        setNegotiateModalVisible(false);
    };

    const handleOpenMap = () => {
        const url = getMapUrl(property.map_coordinates.latitude, property.map_coordinates.longitude);
        Linking.openURL(url).catch(err => console.error('An error occurred opening the map:', err));
    };

    // --- FIX: DEFINING submitReview HERE ---
    const submitReview = () => {
        if (userRating === 0) {
            alert("Please select a star rating before submitting.");
            return;
        }
        
        // Dummy Submission Logic
        console.log(`Submitting review for Property ${propertyId}: Rating ${userRating}, Comment: ${userComment}`);
        alert(`Thank you for your ${userRating}-star review! (Dummy Submission)`);
        
        // Reset and close
        setUserRating(0);
        setUserComment('');
        setReviewModalVisible(false);
    };
    // --- END FIX ---


    // Custom colors for tags
    const successColor = '#34c759'; 
    const dangerColor = '#ff3b30'; 
    const warningColor = '#ff9500';
    const infoColor = '#007AFF'; 
    const listingGoalColor = property.listing_goal === 'Sale' ? dangerColor : colors.primary;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
            
            {/* Custom Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.card }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Icon name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
                    Property Details
                </Text>
                <TouchableOpacity style={styles.headerButton} onPress={() => alert("Report functionality is coming soon!")}>
                    <Icon name="alert-circle-outline" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                {/* 1. Image Carousel */}
                <ScrollView 
                    horizontal 
                    pagingEnabled 
                    showsHorizontalScrollIndicator={false}
                    style={styles.imageCarousel}
                >
                    {property.imageUrls.map((source, index) => (
                        <Image
                            key={index}
                            source={source} 
                            style={styles.propertyImage}
                            resizeMode="cover"
                        />
                    ))}
                </ScrollView>

                <View style={styles.contentPadding}>
                    
                    {/* 2. Price, Title & Verification Status */}
                    <View style={styles.priceRow}>
                        <View style={styles.priceTextBlock}>
                             {/* Listing Goal Tag */}
                            <View style={[styles.goalTag, { backgroundColor: listingGoalColor + '10', borderColor: listingGoalColor }]}>
                                <Text style={[styles.goalTagText, { color: listingGoalColor }]}>
                                    {property.is_flatmate_listing ? 'FLATMATE LISTING' : property.listing_goal.toUpperCase()}
                                </Text>
                            </View>

                            <Text style={[styles.priceText, { color: listingGoalColor, marginTop: 5 }]}>
                                {property.price}
                                <Text style={[styles.pricePerText, { color: colors.text + '80' }]}>
                                    {property.listing_goal === 'Rent' || property.is_flatmate_listing ? '/month' : ''}
                                </Text>
                            </Text>
                            <View style={styles.locationRow}>
                                <Icon name="location-outline" size={18} color={colors.text + '80'} />
                                <Text style={[styles.locationText, { color: colors.text + '90' }]}>
                                    {property.location}
                                </Text>
                            </View>
                        </View>
                        
                        {/* Verification Status Badge */}
                        {property.is_verified && (
                            <View style={styles.verifiedBadge}>
                                <Icon name="shield-checkmark" size={28} color={successColor} />
                                <Text style={[styles.verifiedText, { color: successColor }]}>Verified</Text>
                            </View>
                        )}
                    </View>
                    
                    {/* Title */}
                    <Text style={[styles.titleText, { color: colors.text }]}>{property.name}</Text>

                    {/* Furnishing, Brokerage, Tenant History Tags */}
                    <View style={styles.infoTagsContainer}>
                        {/* Furnishing Status */}
                        {!property.is_flatmate_listing && (
                            <InfoTag 
                                icon="build-outline" 
                                text={property.furnishing_status} 
                                colors={colors} 
                                tagColor={colors.secondary}
                            />
                        )}
                         {/* No Brokerage Tag */}
                        {property.is_no_brokerage && (
                            <InfoTag 
                                icon="person-remove-outline" 
                                text="No Brokerage" 
                                colors={colors} 
                                tagColor={successColor}
                            />
                        )}
                        {/* Tenant History Tag */}
                        {!property.is_flatmate_listing && (
                            <InfoTag 
                                icon={property.is_new_listing ? "key-outline" : "reload-outline"} 
                                text={property.is_new_listing ? "First Time Listed" : "Previously Occupied"} 
                                colors={colors} 
                                tagColor={property.is_new_listing ? infoColor : warningColor}
                            />
                        )}
                    </View>


                    {/* 3. Detailed Quick Facts */}
                    <View style={styles.quickDetailsContainer}>
                        <DetailPill icon="bed-outline" text={property.bhk} colors={colors} />
                        <DetailPill icon="water-outline" text={`${property.bathrooms} Bath`} colors={colors} />
                        <DetailPill icon="expand-outline" text={property.area} colors={colors} />
                        
                        {/* Deposit/Price per Sqft (Goal dependent) */}
                        {property.listing_goal === 'Sale' ? (
                            <DetailPill icon="analytics-outline" text={property.price_per_sqft + '/sqft'} colors={colors} />
                        ) : (
                            <DetailPill icon="cash-outline" text={`Deposit: ${property.deposit}`} colors={colors} />
                        )}
                        
                        {/* Availability Status */}
                        {property.occupancy_status === 'Vacant' ? (
                            <DetailPill icon="home-outline" text="Ready to Move" colors={colors} />
                        ) : (
                            <DetailPill 
                                icon="calendar-number-outline" 
                                text={`Available from ${property.available_from}`} 
                                colors={colors} 
                            />
                        )}

                        {/* Listing Urgency */}
                        <DetailPill 
                            icon="time-outline" 
                            text={`${property.days_to_close} Days to Close`} 
                            colors={colors} 
                        />
                    </View>
                    
                    {/* 4. FLATIMATE REQUIREMENTS SECTION (Conditional) */}
                    {property.is_flatmate_listing && (
                        <View style={[styles.section, { borderBottomColor: colors.card, backgroundColor: colors.card + '50', borderRadius: 12, paddingHorizontal: 15 }]}>
                            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 15 }]}>
                                🤝 Flatmate Requirements
                            </Text>
                            <View style={styles.flatmateReqContainer}>
                                <ReqDetail icon="people-outline" label="Current Occupants" value={`${property.current_occupants} person`} colors={colors} />
                                <ReqDetail icon="male-female-outline" label="Preferred Gender" value={property.preferred_gender || 'Any'} colors={colors} />
                                <ReqDetail icon="briefcase-outline" label="Preferred Occupation" value={property.preferred_occupation} colors={colors} />
                                <ReqDetail icon="business-outline" label="Preferred Work Location" value={property.preferred_work_location} colors={colors} />
                            </View>
                        </View>
                    )}
                    {/* --- END FLATIMATE SECTION --- */}


                    {/* 5. Description */}
                    <View style={[styles.section, { borderBottomColor: colors.card }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
                        <Text style={[styles.descriptionText, { color: colors.text + '90' }]}>
                            {property.description}
                        </Text>
                    </View>
                    
                    {/* 6. Functional Google Map Location */}
                    <View style={[styles.section, { borderBottomColor: colors.card }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Location Overview</Text>
                        <View style={[styles.mapPlaceholder, { backgroundColor: colors.card }]}>
                            <Icon name="map-outline" size={40} color={colors.primary} />
                            <Text style={[styles.mapPlaceholderText, { color: colors.text + '90' }]}>
                                {property.location} - Map View
                            </Text>
                            <TouchableOpacity 
                                style={[styles.openMapButton, { backgroundColor: colors.primary }]}
                                onPress={handleOpenMap}
                            >
                                <Icon name="navigate-outline" size={18} color={styles.white} style={{ marginRight: 5 }} />
                                <Text style={styles.openMapButtonText}>Open on Map (Click Here)</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* 7. Amenities */}
                    <View style={[styles.section, { borderBottomColor: colors.card }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Amenities</Text>
                        <View style={styles.amenitiesContainer}>
                            {property.amenities.map((amenity, index) => (
                                <View key={index} style={styles.amenityItem}>
                                    <Icon name={getAmenityIcon(amenity)} size={20} color={colors.primary} />
                                    <Text style={[styles.amenityText, { color: colors.text }]}>{amenity}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    
                    {/* 8. Ratings & Reviews Section */}
                    <View style={[styles.section, { borderBottomColor: colors.card }]}>
                        <View style={styles.reviewsHeader}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                Ratings ({property.averageRating})
                            </Text>
                            <StarRating 
                                rating={property.averageRating} 
                                color={styles.starYellow} 
                                size={22}
                            />
                        </View>
                        
                        <Text style={[styles.reviewCountText, { color: colors.text + '80' }]}>
                            Based on {property.totalReviews} reviews
                        </Text>

                        {/* Leave a Review Button */}
                        <TouchableOpacity 
                            style={[styles.reviewButton, { borderColor: colors.primary }]}
                            onPress={() => setReviewModalVisible(true)}
                        >
                            <Icon name="create-outline" size={18} color={colors.primary} style={{ marginRight: 8 }} />
                            <Text style={[styles.reviewButtonText, { color: colors.primary }]}>
                                Write a Review
                            </Text>
                        </TouchableOpacity>

                        {/* Display Reviews */}
                        <Text style={[styles.sectionSubtitle, { color: colors.text, marginTop: 15 }]}>
                            Recent Comments
                        </Text>
                        {property.reviews.slice(0, 2).map((review) => (
                            <View key={review.id} style={[styles.reviewCard, { backgroundColor: colors.card }]}>
                                <View style={styles.reviewUserRow}>
                                    <Text style={[styles.reviewUser, { color: colors.text }]}>{review.user}</Text>
                                    <StarRating rating={review.rating} size={14} color={styles.starYellow} />
                                </View>
                                <Text style={[styles.reviewComment, { color: colors.text + '90' }]}>
                                    {review.comment}
                                </Text>
                                <Text style={[styles.reviewDate, { color: colors.text + '60' }]}>
                                    {review.date}
                                </Text>
                            </View>
                        ))}
                        
                        {property.reviews.length > 2 && (
                            <TouchableOpacity style={styles.viewAllReviewsButton}>
                                <Text style={[styles.viewAllReviewsText, { color: colors.primary }]}>
                                    View All {property.totalReviews} Reviews
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    {/* 9. User Profile/Host Info & Contact */}
                    <View style={[styles.section, { borderBottomWidth: 0, marginTop: 10, marginBottom: 30 }]}> 
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Posted By: {property.userType}</Text>
                        <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Image
                                source={{ uri: property.userImage }}
                                style={styles.userImage}
                            />
                            <View style={styles.userInfo}>
                                <Text style={[styles.userName, { color: colors.text }]}>{property.postedBy}</Text>
                                <Text style={[styles.userTypeLabel, { color: colors.primary, backgroundColor: colors.primary + '10' }]}>
                                    {property.userType}
                                </Text>
                                {/* Property Age/Days Listed */}
                                <Text style={[styles.userJoined, { color: colors.text + '80' }]}>
                                    Listing added: {formatDaysListed(property.days_listed)}
                                </Text>
                            </View>
                        </View>

                        {/* --- Contact and Price Block (with Negotiate Button) --- */}
                        <View style={styles.contactContainer}>
                             {/* Negotiate Button */}
                             <TouchableOpacity 
                                style={[styles.negotiateButton, { borderColor: colors.secondary }]}
                                onPress={() => setNegotiateModalVisible(true)}
                                activeOpacity={0.7} 
                            >
                                <Icon 
                                    name={property.listing_goal === 'Sale' ? "pricetags-outline" : "trending-down-outline"} 
                                    size={18} 
                                    color={colors.secondary} 
                                />
                                <Text style={[styles.negotiateButtonText, { color: colors.secondary }]}>
                                    {property.listing_goal === 'Sale' ? 'Make Offer' : 'Negotiate Price'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.contactButton, { backgroundColor: colors.primary }]} 
                                onPress={handleContact}
                                activeOpacity={0.7} 
                            >
                                <Icon name="chatbubbles-outline" size={20} color={styles.white} />
                                <Text style={styles.contactButtonText}>Contact Seller</Text>
                            </TouchableOpacity>
                        </View>
                        {/* --- END CONTACT BLOCK --- */}

                    </View>
                </View>

            </ScrollView>

            {/* --- Review Submission Modal --- */}
            <ReviewModal 
                visible={isReviewModalVisible} 
                onClose={() => setReviewModalVisible(false)}
                onSubmit={submitReview}
                userRating={userRating}
                setUserRating={setUserRating}
                userComment={userComment}
                setUserComment={setUserComment}
                colors={colors}
            />

             <NegotiationModal 
                visible={isNegotiateModalVisible}
                onClose={() => setNegotiateModalVisible(false)}
                onSubmit={handleNegotiate}
                currentPrice={property.price}
                listingGoal={property.listing_goal}
                colors={colors}
             />
            {/* --- End Modals --- */}


        </SafeAreaView>
    );
};

// --- Custom Colors for Stars ---
const customColors = {
    starYellow: '#FFC700', 
    white: '#fff',
};

const styles = StyleSheet.create({
    // --- GENERAL & HEADER ---
    safeArea: { flex: 1 },
    scrollContainer: { paddingBottom: 20 }, 
    
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    headerButton: { padding: 5 },

    // --- PROPERTY CAROUSEL & CONTENT ---
    imageCarousel: { height: 250 },
    propertyImage: { width: SCREEN_WIDTH, height: 250 },
    
    contentPadding: { paddingHorizontal: 16 },

    // Price and Verification Row
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 15,
        marginBottom: 5,
    },
    priceTextBlock: {
        flexShrink: 1,
    },
    // New Goal Tag
    goalTag: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 6,
        paddingVertical: 3,
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    goalTagText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    
    priceText: { fontSize: 28, fontWeight: 'bold', },
    pricePerText: { fontSize: 18, fontWeight: '600', marginLeft: 5 },
    
    verifiedBadge: {
        alignItems: 'center',
        padding: 5,
    },
    verifiedText: {
        fontSize: 12,
        fontWeight: 'bold',
    },

    titleText: { fontSize: 22, fontWeight: '700', marginBottom: 5 },
    
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    locationText: { fontSize: 16, marginLeft: 5 },

    // --- INFO TAGS (Furnishing, Brokerage, Tenant History) ---
    infoTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
        gap: 8,
    },
    infoTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    infoTagText: {
        fontSize: 13,
        fontWeight: '600',
    },

    // --- QUICK DETAILS (Pills) ---
    quickDetailsContainer: { 
        flexDirection: 'row', 
        flexWrap: 'wrap',
        marginVertical: 15,
        gap: 10, 
    },
    detailPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },

    // --- FLATIMATE REQUIREMENTS SECTION ---
    flatmateReqContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 0,
    },
    reqDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%', 
        marginBottom: 15,
    },
    reqDetailTextWrapper: {
        marginLeft: 10,
    },
    reqDetailLabel: {
        fontSize: 12,
    },
    reqDetailValue: {
        fontSize: 14,
    },
    // --- END FLATIMATE REQUIREMENTS SECTION ---

    // --- SECTIONS & DESCRIPTION ---
    section: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    sectionSubtitle: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
    descriptionText: { fontSize: 16, lineHeight: 24 },
    
    // --- MAP PLACEHOLDER ---
    mapPlaceholder: {
        height: 180, 
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#00000010',
    },
    mapPlaceholderText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 15,
    },
    openMapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
    },
    openMapButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
    // --- END MAP ---

    // --- AMENITIES ---
    amenitiesContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    amenityItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        width: '50%', 
        marginBottom: 10, 
    },
    amenityText: { fontSize: 15, marginLeft: 8 },
    
    // --- USER CARD ---
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 20,
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        backgroundColor: '#CCC',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
    },
    userTypeLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    userJoined: {
        fontSize: 13,
        marginTop: 2,
    },

    // --- CONTACT BLOCK (Negotiate/Contact) ---
    contactContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
    },
    negotiateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12, 
        borderRadius: 10, 
        borderWidth: 1,
        flexGrow: 1,
        justifyContent: 'center',
        marginRight: 10,
    },
    negotiateButtonText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12, 
        borderRadius: 10, 
        elevation: 3,
        flexGrow: 1,
        justifyContent: 'center',
    },
    contactButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },

    // --- MODAL STYLES (General) ---
    modalCenteredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
    modalView: { width: '85%', borderRadius: 15, padding: 20, alignItems: 'center', borderWidth: 1,elevation: 5 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    modalSubtitle: { fontSize: 16, marginBottom: 10 },
    ratingInputContainer: { flexDirection: 'row', marginBottom: 20 },
    reviewInput: { width: '100%', borderWidth: 1, borderRadius: 10, padding: 10, minHeight: 100, textAlignVertical: 'top', fontSize: 15, marginBottom: 20 },
    modalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    modalButton: { flex: 1, padding: 12, borderRadius: 8, marginHorizontal: 5, alignItems: 'center' },
    cancelButton: { borderWidth: 1, backgroundColor: 'transparent' },
    cancelButtonText: { fontSize: 16, fontWeight: 'bold' },
    submitButton: { backgroundColor: '#007AFF' },
    submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    
    // --- NEGOTIATION MODAL STYLES (MODIFIED) ---
    negotiationCurrentPrice: {
        fontSize: 16,
        marginBottom: 15,
        fontWeight: '500',
    },
    negotiationTip: {
        fontSize: 12,
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    negotiationError: {
        fontSize: 12,
        marginBottom: 20,
        alignSelf: 'flex-start',
        fontWeight: 'bold',
    },
    // NEW STYLE FOR DISCOUNT PERCENTAGE
    negotiationDiscount: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 15, // Adjusted margin to fit above tip/error
        alignSelf: 'flex-start',
    },

    // --- REVIEWS (Unchanged) ---
    starRatingContainer: { flexDirection: 'row', alignItems: 'center' },
    reviewsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
    reviewCountText: { fontSize: 14, marginBottom: 10 },
    reviewButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 8, paddingVertical: 10, marginTop: 10 },
    reviewButtonText: { fontSize: 16, fontWeight: '600' },
    reviewCard: { padding: 12, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: 'transparent',elevation: 2 },
    reviewUserRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    reviewUser: { fontSize: 15, fontWeight: 'bold' },
    reviewComment: { fontSize: 14, marginBottom: 5 },
    reviewDate: { fontSize: 12, textAlign: 'right' },
    viewAllReviewsButton: { marginTop: 10, alignSelf: 'flex-start' },
    viewAllReviewsText: { fontSize: 15, fontWeight: '600' },
});

// Attach custom colors to styles object for consistent use in component
styles.starYellow = customColors.starYellow; 
styles.white = customColors.white;

export default PropertyDetailScreen;