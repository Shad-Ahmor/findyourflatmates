// src/screens/PropertyDetailScreen.web.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react'; 
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    Dimensions,
    ActivityIndicator, 
    Platform,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../../../theme/theme'; 
import { API_BASE_URL } from '@env'; 

// --- IMPORT CHILD SECTION COMPONENTS ---
// (All UI blocks are now imported children)
import PropertyProximityPoints from './PropertyProximityPoints';
import PropertyAddressDetails from './PropertyAddressDetails';
import PropertyPreferences from './PropertyPreferences';
import PropertyImageCarousel from './PropertyImageCarousel'; 
import PropertyHeader from './PropertyHeader'; 
import PropertyQuickSpecs from './PropertyQuickSpecs'; 
import PropertyAmenities from './PropertyAmenities'; 
import PropertyFinancialsAndActions from './PropertyFinancialsAndActions'; 
import PropertyDescription from './PropertyDescription'; // NEW: Section 4
import PropertyDetailedInfo from './PropertyDetailedInfo'; // NEW: Section 5
import PropertyFooterDetails from './PropertyFooterDetails';
// --- IMPORT MODALS ---
import { NegotiationModalComponent, ReviewModalComponent } from './PropertyModals'; // NEW: Modals
import {fetchSingleListingClient} from '../../../../../services/listingService'
// --- IMPORT UTILITIES ---
import { 
    getWebShadow, 
    DEEP_SOFT_SHADOW, 
    SUBTLE_SHADOW // Added SUBTLE_SHADOW for use in getDynamicStyles
} from './DetailUtilityComponents'; 
// -------------------------------------
import { useAuth } from '../../../../../context/AuthContext';

// =================================================================
// 🚨 RESPONSIVE CONFIGURATION & CONSTANTS
// =================================================================
const MOBILE_BREAKPOINT = 500; 
const TABLET_BREAKPOINT = 1024;
const IMAGE_ASPECT_RATIO = 0.65; 
// =================================================================


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
// --- DUMMY REVIEW DATA (Placeholder) ---
const dummyReviews = [
    { id: '1', user: 'Rohan S.', rating: 5, comment: 'Great location and excellent amenities.', date: '3w ago' },
];
// --- END DUMMY DATA ---


// -----------------------------------------------------------------
// 💡 SHARED UTILITY HELPERS (Kept here as they are data transformation/screen-level logic)
// -----------------------------------------------------------------
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
// -----------------------------------------------------------------


// --- PropertyDetailScreen component ---
const PropertyDetailScreen = ({ route, navigation }) => { 
    const { colors } = useTheme(); 
    const { propertyId, chatName } = route.params || {}; 
    const { user, isLoading: isAuthLoading } = useAuth(); // 'user' अब परिभाषित है
    // --- MAIN STATE ---
    const [property, setProperty] = useState(null); 
    const [isPropertyLoading, setIsPropertyLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0); 
    
    // --- MODAL STATES ---
    const [isNegotiationModalVisible, setIsNegotiationModalVisible] = useState(false);
    const [negotiationAmount, setNegotiationAmount] = useState('');
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [reviewRating, setReviewRating] = useState(5); 
    const [reviewComment, setReviewComment] = useState('');

    // =================================================================
    // 🚨 RESPONSIVE LOGIC 
    // =================================================================
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
    
    const isMobile = windowWidth <= MOBILE_BREAKPOINT;
    const isTablet = windowWidth > MOBILE_BREAKPOINT && windowWidth <= TABLET_BREAKPOINT;
    
    useEffect(() => {
      const handleResize = ({ window }) => setWindowWidth(window.width);
      const subscription = Dimensions.addEventListener('change', handleResize);
      return () => subscription?.remove();
    }, []);

    // Dynamic Dimensions Calculation
    const itemWidth = windowWidth - (isMobile ? 16 : (isTablet ? 25 : 30));
    const imageAspectRatio = isMobile ? 0.8 : IMAGE_ASPECT_RATIO;
    const imageHeight = (itemWidth * imageAspectRatio) / 1.5;
    // =================================================================
    
    // --- DATA FETCHING ---
const fetchPropertyDetails = useCallback(async (id) => {
        
        // 🚀 IMPROVEMENT 1: Fetching तभी शुरू करें जब Auth Loading पूरा हो जाए
        if (isAuthLoading) {
            console.warn("Authentication is still loading, skipping fetch.");
            return; 
        }

        // 💡 IMPROVEMENT 2: यदि Auth Loading पूरा हो गया है, और user null है (लॉग इन नहीं है)
        if (!user) {
            console.warn("User not authenticated for fetching single listing.");
            setError("Authentication required to view or edit this listing.");
            setIsPropertyLoading(false);
            return; 
        }

        if (!id) {
            setError("Property ID is missing. Cannot fetch details.");
            setIsPropertyLoading(false);
            return;
        }

        setIsPropertyLoading(true);
        setError(null);
        
        try {
            // 🛑 NOTE: Assuming fetchSingleListingClient's Backend is now tolerant of "Pending Review" status, 
            // or the single-fetch API does not enforce strict status checks for authenticated users.
            // 🚀 NEW SECURE CALL: user को पास किया गया
            const data = await fetchSingleListingClient(id, user); 
            
            setProperty(data);
            
        } catch (err) {
            console.error("Fetch Property Details Error:", err);
            setError(err.message || "Failed to load listing details from service.");
            
        } finally {
            setIsPropertyLoading(false);
        }
        
    // 💡 DEPENDENCY FIX: 'user' और 'isAuthLoading' दोनों को शामिल करें
    }, [user, isAuthLoading]);

  useEffect(() => {
        // 🚀 IMPROVEMENT 3: Fetching तभी शुरू करें जब propertyId उपलब्ध हो
        // और Auth Loading पूरा हो गया हो, ताकि fetchPropertyDetails को सही 'user' मिले।
        if (propertyId && !isAuthLoading) {
            fetchPropertyDetails(propertyId);
        }
        
        if (chatName) {
            navigation.setOptions({ 
                title: chatName,
                headerStyle: { backgroundColor: colors.headerBackground },
                headerTintColor: colors.headerText,
            });
        }
        
    // 💡 DEPENDENCY FIX: 'isAuthLoading' को dependencies में जोड़ें
    }, [propertyId, chatName, navigation, fetchPropertyDetails, colors.headerBackground, colors.headerText, isAuthLoading]);
    // --- CAROUSEL AUTO-SCROLL LOGIC ---
    useEffect(() => {
        if (!property?.imageLinks || property.imageLinks.length <= 1) {
            return;
        }
        
        const intervalId = setInterval(() => {
setActiveImageIndex(prevIndex => (prevIndex + 1) % property.imageLinks.length);
        }, 4000); 

        return () => clearInterval(intervalId);
    }, [property?.imageLinks]);


    // --- ACTION HANDLERS ---
    const handleOpenInMaps = () => {
        const address = property?.location; 
        if (address) {
            Alert.alert(
                "Open Map",
                `Maps to ${property.location} on Google Maps?`,
                [
                    { text: "Cancel", style: "cancel" },
                    // Fixed URL format for Google Maps query
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
    // ------------------------------------

    // Get dynamic styles based on screen size
    const dynamicStyles = getDynamicStyles({ 
        colors, 
        isMobile, 
        isTablet, 
        windowWidth, 
        itemWidth, 
        imageHeight 
    });


    // --- CONDITIONAL RENDERING (Loading/Error State) ---
    if (isPropertyLoading) {
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


    // --- DATA DESTRUCTURING & COLOR CALCULATION ---
    const { 
        propertyDetails = {}, 
        financials = {}, 
        availability = {}, 
        preferences = {}, 
        systemInfo = {},
        addressDetails = {}, 
        location,
        price,
        deposit, 
        description,
        imageLinks,
        listingGoal,
        proximityPoints = {}, 
    } = property;
    
    const listingGoalColor = getListingGoalColor(listingGoal);
    const currentReviews = dummyReviews;
    

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            
            {/* 0. Modals (Renders Modals on top level of screen) */}
            <NegotiationModalComponent
                isModalVisible={isNegotiationModalVisible}
                setIsModalVisible={setIsNegotiationModalVisible}
                property={property}
                negotiationAmount={negotiationAmount}
                setNegotiationAmount={setNegotiationAmount}
                listingGoalColor={listingGoalColor}
                dynamicStyles={dynamicStyles}
                colors={colors}
            />
            <ReviewModalComponent
                isModalVisible={isReviewModalVisible}
                setIsModalVisible={setIsReviewModalVisible}
                reviewRating={reviewRating}
                setReviewRating={setReviewRating}
                reviewComment={reviewComment}
                setReviewComment={setReviewComment}
                dynamicStyles={dynamicStyles}
                colors={colors}
            />
            
            <ScrollView style={dynamicStyles.container}>
                
                {/* 1. Images Slideshow */}
                <PropertyImageCarousel
                    imageLinks={imageLinks}
                    activeImageIndex={activeImageIndex}
                    setActiveImageIndex={setActiveImageIndex}
                    listingGoalColor={listingGoalColor}
                    dynamicStyles={dynamicStyles}
                    colors={colors}
                    itemWidth={itemWidth}
                    imageHeight={imageHeight}
                />
                
                <View style={dynamicStyles.contentArea}>

                    {/* 2. Price, Title & Verification Status */}
                    <PropertyHeader
                        price={price}
                        location={location}
                        listingGoal={listingGoal}
                        systemInfo={systemInfo}
                        listingGoalColor={listingGoalColor}
                        dynamicStyles={dynamicStyles}
                        colors={colors}
                    />

                    {/* 3. Specs / Quick Details Grid */}
                    <PropertyQuickSpecs
                        propertyDetails={propertyDetails}
                        systemInfo={systemInfo}
                        listingGoalColor={listingGoalColor}
                        dynamicStyles={{...dynamicStyles, colors}}
                        calculateDaysListed={calculateDaysListed}
                        formatDaysListed={formatDaysListed}
                    />


                    {/* 4. Description (New Child Component) */}
                    <PropertyDescription
                        description={description}
                        dynamicStyles={dynamicStyles}
                        colors={colors}
                    />
                    
                    {/* 5. Detailed Property Information (New Child Component) */}
                    <PropertyDetailedInfo
                        propertyDetails={propertyDetails}
                        listingGoalColor={listingGoalColor}
                        dynamicStyles={dynamicStyles}
                        colors={colors}
                    />

                    {/* 6. Financials, Availability and Actions */}
                    <PropertyFinancialsAndActions
                        deposit={deposit}
                        financials={financials}
                        availability={availability}
                        listingGoalColor={listingGoalColor}
                        dynamicStyles={dynamicStyles}
                        colors={colors}
                        handleNegotiate={handleNegotiate} // Handler passed down
                        navigation={navigation}
                        propertyId={propertyId}
                        location={location}
                    />
                    
                    {/* 7. Property Amenities */}
                    <PropertyAmenities
                        propertyDetails={propertyDetails}
                        listingGoalColor={listingGoalColor}
                        dynamicStyles={dynamicStyles}
                        colors={colors}
                    />
                    
                    {/* 8. User/Tenant Preferences */}
                    <PropertyPreferences 
                        preferences={preferences} 
                        listingGoalColor={listingGoalColor} 
                        dynamicStyles={dynamicStyles} 
                        colors={colors}
                    />
                    
                    {/* 9. Address Details */}
                    <PropertyAddressDetails
                        addressDetails={addressDetails}
                        listingGoalColor={listingGoalColor}
                        dynamicStyles={dynamicStyles}
                        colors={colors}
                    />

                    {/* 10. Proximity Points */}
                    <PropertyProximityPoints 
                        proximityPoints={proximityPoints} 
                        listingGoalColor={listingGoalColor} 
                        dynamicStyles={dynamicStyles} 
                        colors={colors}
                    />


                   <PropertyFooterDetails
    dynamicStyles={dynamicStyles}
    colors={colors}
    listingGoalColor={listingGoalColor}
    getWebShadow={getWebShadow}
    DEEP_SOFT_SHADOW={DEEP_SOFT_SHADOW}
    SUBTLE_SHADOW={SUBTLE_SHADOW}
    currentReviews={currentReviews}
    systemInfo={systemInfo}
    handleWriteReview={handleWriteReview}
    formatTimestamp={formatTimestamp}
    location={location}
    handleOpenInMaps={handleOpenInMaps}
/>
                    
                    <View style={{ height: dynamicStyles.footerBufferHeight }} /> 

                </View>
                
            </ScrollView>
        </SafeAreaView>
    );
};

// --- DYNAMIC STYLESHEET GENERATOR ---
const getDynamicStyles = ({ colors, isMobile, isTablet, windowWidth, itemWidth, imageHeight }) => {
    
    // Define Local Constants for Responsive Layout
    const HORIZONTAL_PADDING = isMobile ? 16 : (isTablet ? 25 : 30);
    const SECTION_MARGIN = isMobile ? 30 : (isTablet ? 40 : 50);
    const CARD_PADDING = isMobile ? 20 : (isTablet ? 30 : 40);
    
    const PRICE_FONT_SIZE = isMobile ? 36 : (isTablet ? 42 : 48);
    const PRICE_PER_FONT_SIZE = isMobile ? 18 : (isTablet ? 20 : 24);
    const SECTION_TITLE_SIZE = isMobile ? 24 : (isTablet ? 28 : 32);
    const GENERAL_TEXT_SIZE = isMobile ? 16 : 17;

    const INFO_ICON_SIZE = isMobile ? 22 : 28;
    const ACTION_BUTTON_ICON_SIZE = isMobile ? 20 : 24;
    const RATING_STAR_SIZE = isMobile ? 18 : 22;
    const VERIFIED_ICON_SIZE = isMobile ? 30 : 40;
    const MAP_ICON_SIZE = isMobile ? 50 : 60;
    
    const GENEROUS_RADIUS = 30; 

    const SPEC_PILL_WIDTH = isMobile ? '48%' : (isTablet ? '31%' : '15%'); 
    const PREFERENCE_PILL_WIDTH = isMobile ? '100%' : (isTablet ? '31%' : '31%'); 
    const DETAIL_TILE_WIDTH = isMobile ? '48%' : (isTablet ? '31%' : '23%'); 
    // -----------------------------------------------------

    return {
        // Passed Colors object for child components
        colors, 
        
        // --- Shared Constants/Helpers (Passed for component access) ---
        getWebShadow,
        DEEP_SOFT_SHADOW,
        SUBTLE_SHADOW: { // Re-defining for local access if DetailUtilityComponents is not imported correctly, but should rely on imported value for safety
            shadowColor: '#102A43',
            shadowOffset: { width: 0, height: 6 }, 
            shadowOpacity: 0.2, 
            shadowRadius: 10, 
            elevation: 6,
        },
        // -----------------------------------------------------------------

        // --- Base Container/Layout ---
        container: { flex: 1 },
        contentArea: { paddingHorizontal: HORIZONTAL_PADDING, paddingTop: isMobile ? 10 : 20 },
        section: { marginBottom: SECTION_MARGIN },
        sectionMargin: SECTION_MARGIN,
        footerBufferHeight: isMobile ? 50 : 80, 

        // --- Card Styles ---
        cardStyle: { padding: CARD_PADDING, borderRadius: GENEROUS_RADIUS },
        
        

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
            gap: isMobile ? 8 : (isTablet ? 15 : 20), 
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
        sectionSubtitle: { fontSize: isMobile ? 16 : 18, fontWeight: '700' }, 

        // --- Detailed Info Tiles ---
        detailTileGrid: { 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            gap: isMobile ? 10 : 15,
        },
        detailTileWrapper: { 
            width: DETAIL_TILE_WIDTH,
            flexDirection: 'column', 
            alignItems: 'flex-start', 
            padding: isMobile ? 12 : 15,
            borderRadius: GENEROUS_RADIUS - 15,
            minHeight: isMobile ? 80 : 90,
        },
        detailTileLabel: { fontSize: isMobile ? 13 : 14, marginTop: 5, fontWeight: '500' },
        detailTileValue: { fontSize: isMobile ? 16 : 18, fontWeight: '800', marginTop: 3, flexShrink: 1 },

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

        // --- Modal Styles (Used by PropertyModals.jsx) ---
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

        proximityTabContainer: { 
    flexDirection: 'row', // <-- 🔥 THIS IS THE FIX: Ensures horizontal layout
    justifyContent: 'space-around', // Distribute tabs evenly
    marginBottom: isMobile ? 10 : 15,
    borderBottomWidth: 1, 
    borderBottomColor: colors.border,
},
proximityTab: {
    flex: 1, // Ensures all 3 tabs take equal width
    padding: isMobile ? 12 : 15, 
    borderRadius: 0, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: 'border-bottom-width',
    transitionDuration: '0.2s',
    backgroundColor: 'transparent',
    borderWidth: 0,
},
subCategoryWrapper: {
    marginBottom: isMobile ? 8 : 10,
    overflow: 'hidden',
},
subCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isMobile ? 15 : 18,
    borderRadius: GENEROUS_RADIUS - 15,
    transitionDuration: '0.2s',
},
subCategoryIcon: {
    marginRight: 10,
    transitionDuration: '0.2s',
},
subCategoryText: {
    flex: 1, 
    fontSize: isMobile ? 15 : 17,
    fontWeight: '600',
},
subCategoryValue: {
    fontSize: isMobile ? 15 : 17,
    fontWeight: '800',
    marginLeft: 10,
},
subCategoryContent: {
    padding: isMobile ? 15 : 20,
    paddingLeft: isMobile ? 40 : 50, // Indent content
    borderBottomLeftRadius: GENEROUS_RADIUS - 15,
    borderBottomRightRadius: GENEROUS_RADIUS - 15,
},
    };
    
};


export default PropertyDetailScreen;