// src/screens/ListingFormScreen.web.jsx

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  LayoutAnimation, 
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { useTheme } from '../../../../../theme/theme'; 
import { API_BASE_URL } from '@env'; 

// Stepper Components Import
import Stepper from './Stepper';
import Step1GoalType from './Step1GoalType';
import Step2LocationPricing from './Step2LocationPricing';
// 🚨 NEW STEP IMPORT
import Step3PropertyDetails from './Step3PropertyDetails'; 
// 🚨 RENAMED IMPORTS (Steps renumbered)
import Step4FurnishingAmenities from './Step4FurnishingAmenities'; 
import Step5DescriptionRequirements from './Step5DescriptionRequirements'; 
import Step6Images from './Step6Images'; 
// ✅ NEW STEP IMPORT
import Step7Transit from './Step7Transit'; 
import Step8Essential from './Step8Essential'; 
import Step9Utility from './Step9Utility';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutLayoutAnimationEnabledExperimental(true);
}


// -----------------------------------------------------------------
// 🚨 CONFIGURATION: API Endpoint (Replace with your actual server URL)
// -----------------------------------------------------------------
const BASE_API_URL = API_BASE_URL;
const LISTING_ENDPOINT = `${BASE_API_URL}/flatmate/listing`; 
// EDIT_LISTING_ENDPOINT को कंपोनेंट के अंदर listingId के साथ डायनेमिक रूप से सेट किया जाएगा
// -----------------------------------------------------------------

// -----------------------------------------------------------------
// 🎨 ENHANCED VIBRANT 3D ANIMATION UI CONSTANTS (Deep Sapphire & Vibrant Coral Theme)
// -----------------------------------------------------------------

// --- VIBRANT COLORS (Deep Sapphire & Vibrant Coral Theme) ---
// Exported for use in Step components
export const COLORS = { 
    primaryCTA: '#FF5733',        // Vibrant Coral/Red-Orange (CTA/Highlight)
    secondaryTeal: '#00A9A5',     // Deep Teal/Turquoise (Accent/Glow)
    headerBlue: '#1565C0',         // Deep Sapphire Blue (Titles/Main brand color)
    backgroundSoft: '#F0F8FF',     // Light Alice Blue (Soft Screen Background)
    cardBackground: '#FFFFFF',     // Pure White (Main Card)
    textDark: '#1E293B',           // Dark Slate
    textLight: '#6B7280',          // Medium Gray for subtext/placeholders
    starYellow: '#FFC107',         
    errorRed: '#EF4444',
    focusGlow: '#1565C040',        // Light Sapphire for input focus ring
};

export const GENEROUS_RADIUS = 30; // Ultra-rounded corners for cards and buttons
export const ANIMATION_DURATION = '0.3s'; // Global transition speed for smooth UI

// --- COLORFUL 3D SHADOW EFFECTS (Updated with new colors) ---
export const DEEP_SOFT_SHADOW = {
    // Web (boxShadow) equivalent for a deep, soft lift (Stronger and deeper)
    boxShadow: `0 20px 40px rgba(30, 41, 59, 0.3), 0 0 20px 8px ${COLORS.secondaryTeal}60`, 
    shadowColor: COLORS.textDark,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
};

export const SUBTLE_SHADOW = { 
    // Web (boxShadow) equivalent for pills/selectors
    boxShadow: `0 5px 10px rgba(30, 41, 59, 0.15), 0 0 5px 2px ${COLORS.headerBlue}30`,
    shadowColor: COLORS.textDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
}

export const CTA_SHADOW = {
    // Web (boxShadow) equivalent for CTA pop (Coral saturation)
    boxShadow: `0 10px 20px ${COLORS.primaryCTA}70, 0 0 15px 4px ${COLORS.primaryCTA}50`,
    shadowColor: COLORS.primaryCTA,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
}
// -----------------------------------------------------------------


// --- FORM STEPS DEFINITION (UPDATED: 6 -> 7 steps) ---
export const STEPS = [
{ id: 1, title: "Goal & Property Type", icon: 'home-outline' },
    { id: 2, title: "Location & Pricing", icon: 'pin-outline' },
    // 🚨 NEW STEP
    { id: 3, title: "Property Details", icon: 'build-outline' }, 
    // 🚨 RENUMBERED STEPS
    { id: 4, title: "Furnishing & Amenities", icon: 'tv-outline' },
    { id: 5, title: "Description & Requirements", icon: 'document-text-outline' },
    { id: 6, title: "Property Images", icon: 'image-outline' },
    // ✅ NEW STEP 7 (Transit)
    { id: 7, title: "Proximity: Transit Points", icon: 'bus-outline' }, 
    // ✅ NEW STEP 8 (Essential)
    { id: 8, title: "Proximity: Essential Points", icon: 'medical-outline' }, 
    // ✅ NEW STEP 9 (Utility/Leisure)
    { id: 9, title: "Proximity: Utility/Leisure", icon: 'storefront-outline' },
];


// --- STATIC DATA (Retained and Exported, NEW data added) ---
export const listingGoals = ['Rent', 'Sale', 'Flatmate'];
export const propertyTypeData = {
    Rent: ['Flat', 'PG', 'Hostel', 'House'],
    Sale: ['Flat', 'House', 'Plot'],
    Flatmate: ['Shared Flatmate'],
};
export const furnishingItems = {
    'Fully Furnished': ['Beds', 'Sofa/Seating', 'TV', 'Refrigerator', 'Washing Machine', 'Microwave', 'AC'],
    'Semi-Furnished': ['Wardrobes', 'Kitchen Cabinets', 'Basic Lights/Fans', 'Geyser'],
    'Unfurnished': ['Only basic fixtures (lights, fans)'],
};

// 🚨 UPDATED AMENITIES LIST
export const amenities = [
    'Wifi', 'Parking', 'Gym', 'Balcony', 
    'AC', 'Lift', 'Gas pipeline', 'Water connection', 'Security', '24x7 Water'
]; 
export const preferredGenders = ['Male', 'Female', 'Any'];
export const preferredOccupations = ['IT Professional', 'Student', 'Working Professional', 'Other'];
export const availableDates = ['Now', 'Next Week', 'Next Month', 'Custom Date'];
export const propertySizes = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK']; 
export const negotiationMargins = ['0', '5', '10', '15', '20']; 

// 🚨 NEW CONSTANTS FOR STEP 3
export const ownershipTypes = ['Freehold', 'Leasehold', 'Co-operative Society', 'Other'];
export const facingOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
export const parkingOptions = ['1 Car', '2 Cars', 'Bike Only', 'None'];
export const flooringTypes = ['Vitrified Tiles', 'Marble', 'Wooden Flooring', 'Ceramic Tiles', 'Mosaic', 'Concrete'];

// ✅ NEW CONSTANTS FOR STEP 7
export const DISTANCE_UNITS = ['km', 'meter', 'min walk'];

// =================================================================
// 🎯 MAIN COMPONENT: ListingFormScreen
// =================================================================
const ListingFormScreen = ({ listingId, onClose }) => {
    const { colors } = useTheme(); 
    const scrollViewRef = useRef(null);
    
    // 🚨 UPDATED: EDIT_LISTING_ENDPOINT को listingId के आधार पर सेट करें
    const EDIT_LISTING_ENDPOINT = listingId ? `${BASE_API_URL}/flatmate/listing/${listingId}` : null; 

    // --- Stepper State ---
    const [currentStep, setCurrentStep] = useState(1);
    const isLastStep = currentStep === STEPS.length;
    
    // -------------------
    // 🚩 STATE MANAGEMENT 
    // -------------------
    const [isLoading, setIsLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState(null); 
    
    // Core Property Details (Steps 1 & 2)
    const [goal, setGoal] = useState(listingGoals[0]);
    const [propertyType, setPropertyType] = useState(propertyTypeData[listingGoals[0]][0]);
    const [city, setCity] = useState('');
    const [area, setArea] = useState('');
    const [rent, setRent] = useState('');
    const [deposit, setDeposit] = useState('');
    const [description, setDescription] = useState('');
    const [bedrooms, setBedrooms] = useState(propertySizes[1]);
    const [bathrooms, setBathrooms] = useState('1'); 
    const [isBrokerageFree, setIsBrokerageFree] = useState(false);
    
    // 🚩 NEW ADDRESS FIELDS FOR STEP 2 (Pincode, Flat No., State)
    const [pincode, setPincode] = useState('');
    const [flatNumber, setFlatNumber] = useState('');
    const [stateName, setStateName] = useState('');
    const [districtName, setDistrictName] = useState('');
    // 🚨 NEW STATE FOR STEP 3
    const [buildingAge, setBuildingAge] = useState('');
    const [ownershipType, setOwnershipType] = useState(ownershipTypes[0]); 
    const [maintenanceCharges, setMaintenanceCharges] = useState('');
    const [facing, setFacing] = useState(facingOptions[0]); 
    const [parking, setParking] = useState(parkingOptions[0]); 
    const [gatedSecurity, setGatedSecurity] = useState(true); // Default Yes
    const [flooringType, setFlooringType] = useState([]); // Multiple choice
    const [nearbyLocation, setNearbyLocation] = useState(''); // Note: Area in Step 2 includes street/nearby location, this can be used for more specific details

    // Availability & Occupancy (Step 4)
    const [availableDate, setAvailableDate] = useState(availableDates[0]);
    const [currentOccupants, setCurrentOccupants] = useState('');

    // Furnishing & Amenities (Step 4)
    const [furnishingType, setFurnishingType] = useState('Unfurnished');
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    
    // Negotiation Details (Step 5)
    const [maxNegotiablePrice, setMaxNegotiablePrice] = useState(''); 
    const [negotiationMargin, setNegotiationMargin] = useState(negotiationMargins[1]);
    
    // Requirements (Step 5)
    const [preferredGender, setPreferredGender] = useState(preferredGenders[2]);
    const [preferredOccupation, setPreferredOccupation] = useState(preferredOccupations[0]);
    const [preferredWorkLocation, setPreferredWorkLocation] = useState('');

    // Image Handling (Step 6)
    const [currentImageLink, setCurrentImageLink] = useState('');
    const [imageLinks, setImageLinks] = useState([]);

    // ✅ NEW STATE FOR STEP 7 (Proximity & POI)
    const [transitPoints, setTransitPoints] = useState([]);
    const [essentialPoints, setEssentialPoints] = useState([]);
    const [utilityPoints, setUtilityPoints] = useState([]);
    
    const [distanceUnit, setDistanceUnit] = useState(DISTANCE_UNITS[0]);
    const isEditing = !!listingId; 

    // -----------------------------------------------------------------
    // 🚀 NEW: DATA FETCHING FOR EDIT MODE
    // -----------------------------------------------------------------
    const fetchListingData = async () => {
        if (!listingId || !EDIT_LISTING_ENDPOINT) return;

        setIsLoading(true);
        try {
            const response = await fetch(EDIT_LISTING_ENDPOINT, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (!response.ok) {
                 const errorText = await response.text();
                 throw new Error(`Failed to fetch listing data: ${response.status} - ${errorText.substring(0, 100)}`);
            }
            
            const data = await response.json();
            
            // 💡 Fetched data को State में Map करें
            // Core Property Details (Steps 1 & 2)
            setGoal(data.listingGoal);
            // सुनिश्चित करें कि propertyType, goal के लिए valid हो
            setPropertyType(data.propertyDetails.propertyType);
            setCity(data.addressDetails.city || '');
            setArea(data.addressDetails.area || '');
            // String में कनवर्ट करें क्योंकि TextInput string वैल्यू की अपेक्षा करता है
            setRent(String(data.price || ''));
            setDeposit(String(data.deposit || ''));
            setDescription(data.description || '');
            setBedrooms(data.propertyDetails.bedrooms || propertySizes[1]); // या String(data.bedrooms)
            setBathrooms(String(data.propertyDetails.bathrooms || '1')); 
            setIsBrokerageFree(data.financials.isNoBrokerage || false);
            
            // NEW ADDRESS FIELDS FOR STEP 2
            setPincode(data.addressDetails.pincode || '');
            setFlatNumber(data.addressDetails.flatNumber || '');
            setStateName(data.addressDetails.stateName || '');
            setDistrictName(data.addressDetails.districtName || '');
            
            // NEW STATE FOR STEP 3
            setBuildingAge(String(data.propertyDetails.buildingAge || ''));
            setOwnershipType(data.propertyDetails.ownershipType || ownershipTypes[0]); 
            setMaintenanceCharges(String(data.propertyDetails.maintenanceCharges || ''));
            setFacing(data.propertyDetails.facing || facingOptions[0]); 
            setParking(data.propertyDetails.parking || parkingOptions[0]); 
            setGatedSecurity(data.propertyDetails.gatedSecurity ?? true); 
            setFlooringType(data.propertyDetails.flooringType || []); 
            setNearbyLocation(data.propertyDetails.nearbyLocation || ''); 

            // Availability & Occupancy (Step 4)
            setAvailableDate(data.availability.finalAvailableDate || availableDates[0]);
            setCurrentOccupants(String(data.availability.currentOccupants || ''));

            // Furnishing & Amenities (Step 4)
            setFurnishingType(data.propertyDetails.furnishingStatus || 'Unfurnished');
            setSelectedAmenities(data.propertyDetails.selectedAmenities || []);
            
            // Negotiation Details (Step 5)
            setMaxNegotiablePrice(String(data.financials.maxNegotiablePrice || '')); 
            setNegotiationMargin(data.financials.negotiationMarginPercent);
            
            // Requirements (Step 5)
            setPreferredGender(data.preferences.preferredGender || preferredGenders[2]);
            setPreferredOccupation(data.preferences.preferredOccupation || preferredOccupations[0]);
            setPreferredWorkLocation(data.preferences.preferredWorkLocation || '');

            // Image Handling (Step 6)
            setImageLinks(data.imageLinks || []);

            // NEW STATE FOR STEP 7 (Proximity & POI)
            const normalizePOI = (points = []) =>
  points.map(p => ({
    id: p.id || Date.now() + Math.random(),
    type: p.type,
    name: p.name,
    distance: p.distance,
  }));

setTransitPoints(normalizePOI(data.proximityPoints.transitPoints));
setEssentialPoints(normalizePOI(data.proximityPoints.essentialPoints));
setUtilityPoints(normalizePOI(data.proximityPoints.utilityPoints));

        } catch (error) {
            console.error("Fetch Listing Error:", error.message);
            showToast(`❌ Error loading listing for edit: ${error.message}`, 'error');
            // यदि डेटा फ़ेच नहीं हो पाता है, तो फ़ॉर्म बंद करने का विचार करें
            // if (onClose) onClose(); 
        } finally {
            setIsLoading(false);
        }
    };
useEffect(() => {
    const allPoints = [
        ...transitPoints,
        ...essentialPoints,
        ...utilityPoints,
    ];

    if (allPoints.length > 0 && typeof allPoints[0].distance === 'string') {
        const parts = allPoints[0].distance.split(' ');
        if (parts.length === 2 && DISTANCE_UNITS.includes(parts[1])) {
            setDistanceUnit(parts[1]);
        }
    }
}, [transitPoints, essentialPoints, utilityPoints]);

  
    useEffect(() => {
        fetchListingData();
    }, [listingId]); // listingId बदलने पर डेटा फ़ेच करें
    
    // --- Navigation Handlers (ENHANCED with LayoutAnimation) ---
    const showToast = (message, type = 'success') => {
        setToastMessage({ message, type });
        setTimeout(() => setToastMessage(null), 4000);
    };
    
    const handleNext = () => {
        // Basic validation before moving to next step
        if (currentStep === 1 && (!goal || !propertyType)) {
            showToast("Please select Goal and Property Type.", 'error');
            return;
        }
        // 🚩 UPDATED VALIDATION FOR STEP 2
        if (currentStep === 2 && (!city || !area || !rent || !deposit || !bedrooms || !bathrooms || !pincode || !stateName || !flatNumber)) {
            showToast("Please fill all Location (Flat No., Pincode, State) and Pricing details.", 'error');
            return;
        }
        // 🚨 NEW VALIDATION FOR STEP 3
        if (currentStep === 3 && (!buildingAge || !ownershipType || !maintenanceCharges || !facing || !parking || flooringType.length === 0)) {
            showToast("Please fill all Property Details including Age and select at least one Flooring type.", 'error');
            return;
        }
        // 🚩 STEP 6 Validation (before moving to new final Step 7)
        if (currentStep === 6 && imageLinks.length < 3) {
            showToast("Please upload at least 3 property images.", 'error');
            return;
        }
        
        // Update check for the new last step (7)
        if (currentStep < STEPS.length) { 
            // Apply a simple transition for smoother step change
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setCurrentStep(prev => prev + 1);
            if (scrollViewRef.current) {
                 scrollViewRef.current.scrollTo({ y: 0, animated: true });
            }
        }
    };
    
    const handleBack = () => {
        if (currentStep > 1) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setCurrentStep(prev => prev - 1);
            if (scrollViewRef.current) {
                 scrollViewRef.current.scrollTo({ y: 0, animated: true });
            }
        }
    };
    
    const handleGoToStep = (stepId) => {
        if (stepId < currentStep || stepId === currentStep) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setCurrentStep(stepId);
            if (scrollViewRef.current) {
                 scrollViewRef.current.scrollTo({ y: 0, animated: true });
            }
        }
    };

    // --- Other Handlers (Simplified for brevity) ---
    const handleGoalChange = (newGoal) => {
        setGoal(newGoal);
        setPropertyType(propertyTypeData[newGoal][0]);
    };
    
    const handleAmenityToggle = (amenity) => {
        setSelectedAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity] );
    };

    // 🚨 NEW HANDLER for Flooring
    const handleFlooringToggle = (floor) => {
        setFlooringType(prev => prev.includes(floor) ? prev.filter(f => f !== floor) : [...prev, floor] );
    };
    
    const handleAddImage = () => {
        if (currentImageLink.trim() && imageLinks.length < 5) {
            setImageLinks(prev => [...prev, currentImageLink.trim()]);
            setCurrentImageLink('');
        } else if (imageLinks.length >= 5) {
            showToast("Maximum 5 images allowed.", 'error');
        } else {
            showToast("Please enter a valid image URL.", 'error');
        }
    };
    
    const handleRemoveImage = (urlToRemove) => {
        setImageLinks(prev => prev.filter(url => url !== urlToRemove));
    };

    // ✅ FIX: Implemented actual fetch API call
// ListingFormScreen.web.jsx में handleSubmit फ़ंक्शन

const handleSubmit = async () => {
        // FINAL VALIDATION (Check Step 6/Images)
        if (currentStep === 6 && imageLinks.length < 3) {
            Alert.alert("Incomplete Form", "Please upload at least 3 property images.");
            return;
        }


        const locationString = [
            flatNumber,
            area,
            city,
            districtName,
            stateName,
            pincode,
        ].filter(Boolean).join(', ');

        setIsLoading(true);
        setToastMessage(null);

        // ... (Payload creation remains the same) ...
        const payload = {
            listing_goal: goal,
            property_type: propertyType,
            location: locationString,
            city,
            area,
            rent: Number(rent) || 0,
            deposit: Number(deposit) || 0,
            description,
            bedrooms,
            bathrooms: Number(bathrooms) || 0,
            is_brokerage_free: isBrokerageFree,
            // ADDRESS FIELDS
            pincode,
            flat_number: flatNumber,
            state_name: stateName,
            districtName: districtName,
            // STEP 3 FIELDS
            building_age: Number(buildingAge) || 0,
            ownership_type: ownershipType,
            maintenance_charges: Number(maintenanceCharges) || 0,
            facing: facing,
            parking: parking,
            gated_security: gatedSecurity,
            flooring_type: flooringType,
            nearby_location: nearbyLocation,
            // STEP 4 FIELDS
            available_date: availableDate,
            current_occupants: Number(currentOccupants) || 0,
            furnishing_type: furnishingType,
            amenities: selectedAmenities,
            // STEP 5 FIELDS
            max_negotiable_price: Number(maxNegotiablePrice) || 0,
            negotiation_margin: negotiationMargin,
            preferred_gender: preferredGender,
            preferred_occupation: preferredOccupation,
            preferred_work_location: preferredWorkLocation,
            // STEP 6 FIELD
            image_links: imageLinks,
            // STEP 7/8/9 FIELDS
            transit_points: transitPoints,
            essential_points: essentialPoints,
            utility_points: utilityPoints,
        };
        
        console.log("Submitting Payload:", payload);

        const method = isEditing ? 'PUT' : 'POST';
        let endpoint;
        if (isEditing) {
            // यह मानकर कि 'listingId' प्रॉप्स या useState से उपलब्ध है
            endpoint = `${BASE_API_URL}/flatmate/listing/update/${listingId}`; 
        } else {
            endpoint = `${BASE_API_URL}/flatmate/listing`;
        }

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                credentials: 'include',
            });

            if (response.ok) {
                // ✅ SUCCESS: केवल OK स्टेटस पर JSON पार्स करें
                const data = await response.json();
                console.log("API Response Data:", data);
                
                showToast(`✅ Listing ${isEditing ? 'updated' : 'submitted'} successfully! Listing ID: ${data.id || listingId || 'N/A'}`, 'success');
                if (onClose) onClose(); 
            } else {
                // ❌ ERROR: Non-200 स्टेटस को हैंडल करें और JSON सिंटैक्स एरर से बचें
                let errorDetail = response.statusText || 'Unknown error occurred on server.';
                let errorBodyText = '';

                try {
                    // पहले JSON त्रुटि बॉडी पढ़ने की कोशिश करें
                    const errorData = await response.json();
                    errorDetail = errorData.message || errorData.error || errorDetail;
                    errorBodyText = JSON.stringify(errorData);
                } catch (e) {
                    // JSON पार्सिंग विफल होने पर (जैसे 404 HTML), टेक्स्ट के रूप में पढ़ें
                    errorBodyText = await response.text();
                    
                    // 404 के लिए विशेष त्रुटि संदेश
                    if (response.status === 404) {
                         errorDetail = `Backend PUT route not found (404) at URL: ${endpoint}`;
                    } else {
                        // यदि अन्य गैर-JSON त्रुटि है, तो बॉडी का एक छोटा हिस्सा लें
                        errorDetail = `Server returned non-JSON response (${response.status}): ${errorBodyText.substring(0, 100)}...`;
                    }
                }
                
                console.error("API Error Response Body:", errorBodyText);
                throw new Error(errorDetail); 
            }

        } catch (error) {
            console.error("API Submission Error:", error);
            // अब यह अधिक जानकारीपूर्ण त्रुटि संदेश दिखाएगा
            showToast(`❌ Error submitting form: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    // -----------------------------------------------------------------
    // 🏠 RENDER STEP CONTENT (Conditional Rendering for Stepper)
    // -----------------------------------------------------------------
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1GoalType
                        goal={goal}
                        setGoal={handleGoalChange}
                        propertyType={propertyType}
                        setPropertyType={setPropertyType}
                        isLoading={isLoading}
                        styles={styles} // Pass styles down
                    />
                );
            case 2:
                return (
                    <Step2LocationPricing
                        goal={goal}
                        city={city}
                        setCity={setCity}
                        area={area}
                        setArea={setArea}
                        rent={rent}
                        setRent={setRent}
                        deposit={deposit}
                        setDeposit={setDeposit}
                        bedrooms={bedrooms}
                        setBedrooms={setBedrooms}
                        bathrooms={bathrooms}
                        setBathrooms={setBathrooms}
                        isLoading={isLoading}
                        styles={styles}
                        // 🚩 NEW PROPS PASSED
                        pincode={pincode}
                        setPincode={setPincode}
                        flatNumber={flatNumber}
                        setFlatNumber={setFlatNumber}
                        stateName={stateName}
                        setStateName={setStateName}
                        districtName={districtName}
                        setDistrictName={setDistrictName}
                        
                        // Pass Toast utility function
                        showToast={showToast} 
                    />
                );
            // 🚨 NEW STEP 3
            case 3:
                return (
                    <Step3PropertyDetails
                        buildingAge={buildingAge}
                        setBuildingAge={setBuildingAge}
                        ownershipType={ownershipType}
                        setOwnershipType={setOwnershipType}
                        maintenanceCharges={maintenanceCharges}
                        setMaintenanceCharges={setMaintenanceCharges}
                        facing={facing}
                        setFacing={setFacing}
                        parking={parking}
                        setParking={setParking}
                        gatedSecurity={gatedSecurity}
                        setGatedSecurity={setGatedSecurity}
                        flooringType={flooringType}
                        handleFlooringToggle={handleFlooringToggle}
                        nearbyLocation={nearbyLocation}
                        setNearbyLocation={setNearbyLocation}
                        isLoading={isLoading}
                        styles={styles}
                    />
                );
            // 🚨 RENUMBERED STEP 4 (was 3)
            case 4:
                return (
                    <Step4FurnishingAmenities
                        furnishingType={furnishingType}
                        setFurnishingType={setFurnishingType}
                        availableDate={availableDate}
                        setAvailableDate={setAvailableDate}
                        currentOccupants={currentOccupants}
                        setCurrentOccupants={setCurrentOccupants}
                        selectedAmenities={selectedAmenities}
                        handleAmenityToggle={handleAmenityToggle}
                        isLoading={isLoading}
                        styles={styles}
                    />
                );
            // 🚨 RENUMBERED STEP 5 (was 4)
            case 5:
                return (
                    <Step5DescriptionRequirements
                        goal={goal}
                        description={description}
                        setDescription={setDescription}
                        isBrokerageFree={isBrokerageFree}
                        setIsBrokerageFree={setIsBrokerageFree}
                        negotiationMargin={negotiationMargin}
                        setNegotiationMargin={setNegotiationMargin}
                        preferredGender={preferredGender}
                        setPreferredGender={setPreferredGender}
                        preferredOccupation={preferredOccupation}
                        setPreferredOccupation={setPreferredOccupation}
                        preferredWorkLocation={preferredWorkLocation}
                        setPreferredWorkLocation={setPreferredWorkLocation}
                        isLoading={isLoading}
                        styles={styles}
                    />
                );
            // 🚨 RENUMBERED STEP 6 (was 5)
            case 6:
                return (
                    <Step6Images
                        currentImageLink={currentImageLink}
                        setCurrentImageLink={setCurrentImageLink}
                        imageLinks={imageLinks}
                        handleAddImage={handleAddImage}
                        handleRemoveImage={handleRemoveImage}
                        isLoading={isLoading}
                        styles={styles}
                    />
                );
            // ✅ NEW STEP 7 (FINAL STEP)
            case 7:
            return (
                <Step7Transit
                    transitPoints={transitPoints}
                    setTransitPoints={setTransitPoints}
                    isLoading={isLoading}
                    showToast={showToast}
                    styles={styles}
                    // Global Distance State
                    distanceUnit={distanceUnit}
                    setDistanceUnit={setDistanceUnit}
                />
            );
        // ✅ NEW STEP 8: Essential Points
        case 8:
            return (
                <Step8Essential
                    essentialPoints={essentialPoints}
                    setEssentialPoints={setEssentialPoints}
                    isLoading={isLoading}
                    showToast={showToast}
                    styles={styles}
                    // Global Distance Prop
                    distanceUnit={distanceUnit}
                />
            );
        // ✅ NEW STEP 9: Utility Points
        case 9:
            return (
                <Step9Utility
                    utilityPoints={utilityPoints}
                    setUtilityPoints={setUtilityPoints}
                    isLoading={isLoading}
                    showToast={showToast}
                    styles={styles}
                    // Global Distance Prop
                    distanceUnit={distanceUnit}
                />
            );
            default:
                return <Text style={styles.errorText}>Invalid Step</Text>;
        }
    };
    
    // --- Main Component JSX ---
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <Text style={styles.mainHeader}>{isEditing ? 'Edit Existing Listing' : 'Create New Listing'}</Text>
                <Text style={styles.subHeader}>Follow the steps to publish your property.</Text>
                
                {/* Stepper Progress Bar */}
                <Stepper 
                    currentStep={currentStep} 
                    steps={STEPS} 
                    onStepPress={handleGoToStep} 
                    styles={styles}
                />
                
                {/* Form Content (Current Step Card) - Key added for smoother transition */}
                <View key={currentStep} style={[styles.section, DEEP_SOFT_SHADOW]}>
                    {/* जब डेटा फ़ेच हो रहा हो तब फ़ॉर्म लोड नहीं करना है */}
                    {isLoading && isEditing ? (
                         <View style={styles.loadingContainer}>
                             <ActivityIndicator size="large" color={COLORS.headerBlue} />
                             <Text style={styles.loadingText}>Loading existing listing data...</Text>
                         </View>
                    ) : (
                         renderStepContent()
                    )}
                </View>

                {/* Navigation Buttons */}
                <View style={styles.actionButtonsContainer}>
                    {/* Back Button (Animated) */}
                    {currentStep > 1 && (
                        <TouchableOpacity 
                            style={[styles.backButton, SUBTLE_SHADOW, isLoading && styles.disabledButton]} 
                            onPress={handleBack}
                            disabled={isLoading}
                        >
                            <Icon name="chevron-back-outline" size={20} color={COLORS.textDark} />
                            <Text style={styles.backButtonText}>Previous Step</Text>
                        </TouchableOpacity>
                    )}
                    
                    {/* Next/Submit Button (Animated CTA Pop) */}
                    {isLastStep ? (
                        <TouchableOpacity 
                            // 🚩 UPDATED: Disabled if currentStep is 7 and imageLinks are < 3 (Final validation check)
                            style={[styles.submitButton, CTA_SHADOW, isLoading && styles.disabledButton, currentStep === 1 && styles.buttonFullWidth]} 
                            onPress={handleSubmit}
                            disabled={isLoading || imageLinks.length < 3}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.submitButtonText}>
                                    {isEditing ? 'Update Listing' : 'Submit Listing'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            style={[styles.nextButton, CTA_SHADOW, isLoading && styles.disabledButton, currentStep === 1 && styles.buttonFullWidth]} 
                            onPress={handleNext}
                            disabled={isLoading}
                        >
                            <Text style={styles.submitButtonText}>Next Step</Text>
                            <Icon name="chevron-forward-outline" size={20} color="#FFF" />
                        </TouchableOpacity>
                    )}
                </View>

            </ScrollView>
            
            {/* Custom Toast/Feedback */}
            {toastMessage && (
                <View style={[
                    styles.toastContainer, 
                    toastMessage.type === 'success' ? styles.toastSuccess : styles.toastError,
                    SUBTLE_SHADOW 
                ]}>
                    <Text style={styles.toastText}>{toastMessage.message}</Text>
                </View>
            )}

        </SafeAreaView>
    );
};

// -----------------------------------------------------------------
// 🎨 ACTION BUTTON BASE STYLES (Moved outside StyleSheet.create for correct inheritance)
// -----------------------------------------------------------------
const BASE_ACTION_BUTTON_WEB_STYLES = Platform.select({
     // Corrected hover animation applied using Platform.select
     web: { transition: `all ${ANIMATION_DURATION} cubic-bezier(.25,.8,.25,1)`, cursor: 'pointer', ':hover': { transform: 'translateY(-3px) scale(1.01)' } }
});

// =================================================================
// 🎨 STYLES (FIXED and UPDATED for new colors and animations)
// =================================================================
export const styles = StyleSheet.create({ // Exported styles for use in Step components
    safeArea: { flex: 1, backgroundColor: COLORS.backgroundSoft },
    scrollContent: { 
        flexGrow: 1, 
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    mainHeader: { fontSize: 32, fontWeight: '900', color: COLORS.headerBlue, marginBottom: 5, textAlign: 'center' },
    subHeader: { fontSize: 16, color: COLORS.textLight, marginBottom: 30, textAlign: 'center' },
    
    // 🚨 NEW STYLES for Loading state
    loadingContainer: {
        minHeight: 300, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textDark,
    },
    
    // --- Stepper Styles (Glow Effect) ---
    stepperContainer: {
        width: '100%',
        maxWidth: 800,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    stepPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 25,
        backgroundColor: COLORS.cardBackground,
        borderWidth: 1,
        borderColor: COLORS.textLight + '30',
        flexShrink: 1,
        minWidth: 40,
        justifyContent: 'center',
        ...Platform.select({
             web: { transition: `all ${ANIMATION_DURATION} ease-out`, cursor: 'pointer', ':hover': { transform: 'scale(1.05)', borderColor: COLORS.headerBlue } }
        })
    },
    stepPillActiveGlow: { // 💥 FIX: Animation properties simplified to CSS shorthand string
        backgroundColor: COLORS.primaryCTA, 
        borderColor: COLORS.primaryCTA, 
        ...Platform.select({
            web: { 
                animationKeyframes: { 
                    'pulse': { 
                        '0%': { boxShadow: `0 0 0 0px ${COLORS.primaryCTA}AA` },
                        '70%': { boxShadow: `0 0 0 10px transparent` },
                        '100%': { boxShadow: `0 0 0 0px transparent` }
                    }
                },
                // ✅ FIXED: Using CSS animation shorthand to resolve "animationName" error
                animation: 'pulse 2s infinite', 
            },
        }),
    },
    stepPillCompleted: {
        backgroundColor: COLORS.secondaryTeal, 
        borderColor: COLORS.secondaryTeal, 
    },
    stepTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.headerBlue,
        marginLeft: 5,
        ...Platform.select({ web: { display: 'none' }, default: {} }),
    },
    stepTitleActive: {
        color: COLORS.cardBackground,
        fontWeight: '700',
        ...Platform.select({ web: { display: 'flex' }, default: {} }),
    },
    stepLine: {
        flex: 1,
        height: 4,
        marginHorizontal: 5,
        backgroundColor: COLORS.textLight + '30',
        borderRadius: 2,
        transition: `background-color ${ANIMATION_DURATION} ease-in-out`,
    },
    stepLineCompleted: {
        backgroundColor: COLORS.secondaryTeal, 
    },
    
    // --- Card/Section Styles (Deep Lift) ---
    section: {
        width: '100%',
        maxWidth: 800,
        backgroundColor: COLORS.cardBackground,
        padding: 30,
        borderRadius: GENEROUS_RADIUS,
        marginBottom: 30,
        transition: `transform ${ANIMATION_DURATION} ease-out, box-shadow ${ANIMATION_DURATION} ease-out`,
        ...Platform.select({ web: { ':hover': { transform: 'scale(1.005)' } } }),
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.headerBlue,
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.secondaryTeal + '30', 
        paddingBottom: 10,
    },
    
    // --- Input & Label Styles (Animated Focus) ---
    inputGroup: { marginBottom: 20,position: 'relative' },
    label: { fontSize: 16, fontWeight: '600', color: COLORS.textDark, marginBottom: 8 },
    labelSmall: { fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: 8 },
    inputRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
    inputHalf: { width: '48%', marginBottom: 0 },
    inputFull: { width: '100%', marginBottom: 0 }, // 🚩 NEW: For State Dropdown to take full width
    textInput: {
        padding: 18, fontSize: 16, color: COLORS.textDark, backgroundColor: COLORS.backgroundSoft,
        borderRadius: 15, borderWidth: 1, borderColor: COLORS.textLight + '30', outlineStyle: 'none',
        transition: `all ${ANIMATION_DURATION} ease-in-out`, 
        ...Platform.select({
            web: { 
                boxShadow: `inset 0 3px 6px rgba(0,0,0,0.1)`,
                ':focus': { 
                    borderColor: COLORS.headerBlue,
                    boxShadow: `0 0 0 4px ${COLORS.focusGlow}` 
                }
            },
        })
    },
    textArea: { height: 120, textAlignVertical: 'top', paddingTop: 18 },
    
    // --- Selector Styles (Animated Hover) ---
    selectorContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
    selectorContainerSmall: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, justifyContent: 'space-between' },
    selectorButton: { 
        paddingVertical: 12, paddingHorizontal: 18, borderRadius: 25, backgroundColor: COLORS.backgroundSoft, marginRight: 10, marginBottom: 10, borderWidth: 1, borderColor: COLORS.backgroundSoft, 
        ...Platform.select({
             web: { transition: `all ${ANIMATION_DURATION} ease-out`, cursor: 'pointer', ':hover': { transform: 'scale(1.05)', backgroundColor: COLORS.backgroundSoft + 'cc' } }
        })
    },
    selectorButtonSmall: { 
        paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: COLORS.backgroundSoft, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: COLORS.backgroundSoft, 
        ...Platform.select({
             web: { transition: `all ${ANIMATION_DURATION} ease-out`, cursor: 'pointer', ':hover': { transform: 'scale(1.08)' } }
        })
    },
    selectorButtonTiny: { 
        paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: COLORS.backgroundSoft, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: COLORS.backgroundSoft, flexGrow: 1, justifyContent: 'center', alignItems: 'center',
         ...Platform.select({
             web: { transition: `all ${ANIMATION_DURATION} ease-out`, cursor: 'pointer', ':hover': { transform: 'scale(1.08)' } }
        })
    },
    selectorButtonActive: { 
        backgroundColor: COLORS.secondaryTeal, 
        borderColor: COLORS.secondaryTeal, 
        ...SUBTLE_SHADOW,
        ...Platform.select({
            web: { ':hover': { transform: 'scale(1.05)', backgroundColor: COLORS.secondaryTeal } } 
        })
    },
    selectorText: { color: COLORS.textDark, fontWeight: '600', fontSize: 14 },
    selectorTextActive: { color: COLORS.cardBackground, fontWeight: '800', fontSize: 14 },
    helperText: { fontSize: 14, color: COLORS.textLight, marginTop: 5, fontStyle: 'italic', paddingHorizontal: 5 },
    
    // --- Toggle Button Styles (Animated Hover) ---
    amenityContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginBottom: 10 },
    toggleButton: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardBackground, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 25, marginRight: 10, marginBottom: 10, borderWidth: 1, borderColor: COLORS.backgroundSoft,
        ...Platform.select({
             web: { transition: `all ${ANIMATION_DURATION} ease-out`, cursor: 'pointer', ':hover': { transform: 'scale(1.05)', borderColor: COLORS.textLight + '50' } }
        })
    },
    toggleButtonFull: { 
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.cardBackground, paddingVertical: 15, borderRadius: 25, borderWidth: 1, borderColor: COLORS.backgroundSoft, width: '100%',
        ...Platform.select({
             web: { transition: `all ${ANIMATION_DURATION} ease-out`, cursor: 'pointer', ':hover': { transform: 'scale(1.02)' } }
        })
    },
    toggleButtonActive: { 
        backgroundColor: COLORS.primaryCTA, 
        borderColor: COLORS.primaryCTA, 
        ...SUBTLE_SHADOW,
        ...Platform.select({
            web: { ':hover': { transform: 'scale(1.05)', backgroundColor: COLORS.primaryCTA } } 
        })
    },
    toggleText: { color: COLORS.textDark, fontWeight: '600', fontSize: 14 },
    toggleTextActive: { color: COLORS.cardBackground, fontWeight: '700', fontSize: 14 },

    // --- Image Upload Styles ---
    uploadHelperText: { fontSize: 14, color: COLORS.textLight, marginBottom: 15 },
    imageInputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    imageLinkInput: { 
        flex: 1, marginRight: 10, padding: 18, fontSize: 14, color: COLORS.textDark, backgroundColor: COLORS.backgroundSoft, borderRadius: 15, borderWidth: 1, borderColor: COLORS.textLight + '30', outlineStyle: 'none',
        transition: `all ${ANIMATION_DURATION} ease-in-out`,
        ...Platform.select({ 
            web: { 
                boxShadow: `inset 0 3px 6px rgba(0,0,0,0.1)`, 
                ':focus': { 
                    borderColor: COLORS.headerBlue,
                    boxShadow: `0 0 0 4px ${COLORS.focusGlow}` 
                } 
            } 
        }) 
    },
    addButton: { 
        backgroundColor: COLORS.secondaryTeal, 
        padding: 10, borderRadius: 15, alignItems: 'center', justifyContent: 'center', height: 55, width: 55,
        ...Platform.select({
             web: { transition: `all ${ANIMATION_DURATION} ease-out`, cursor: 'pointer', ':hover': { transform: 'scale(1.1)' } }
        })
    },
    imagePreviewContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    imagePill: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.backgroundSoft, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, marginRight: 10, marginBottom: 10, ...SUBTLE_SHADOW,
        ...Platform.select({
             web: { transition: `all ${ANIMATION_DURATION} ease-out`, ':hover': { transform: 'scale(1.05)' } }
        })
    },
    imageText: { marginRight: 8, fontSize: 14, color: COLORS.textDark, maxWidth: 100 },
    errorText: { color: COLORS.errorRed, fontWeight: '700', marginTop: 15, textAlign: 'center' },

    // --- Action Button Styles (FIXED INHERITANCE) ---
    actionButtonsContainer: {
        width: '100%',
        maxWidth: 800,
        paddingHorizontal: 20,
        marginBottom: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    
    // Applied BASE_ACTION_BUTTON_WEB_STYLES directly
    submitButton: {
        backgroundColor: COLORS.primaryCTA,
        padding: 20,
        borderRadius: GENEROUS_RADIUS,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1, 
        ...BASE_ACTION_BUTTON_WEB_STYLES,
    },
    nextButton: {
        backgroundColor: COLORS.primaryCTA,
        padding: 20,
        borderRadius: GENEROUS_RADIUS,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
        marginLeft: 10,
        ...BASE_ACTION_BUTTON_WEB_STYLES,
    },
    backButton: {
        backgroundColor: COLORS.cardBackground,
        padding: 18,
        borderRadius: GENEROUS_RADIUS,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.textLight + '20',
        flex: 1,
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        ...BASE_ACTION_BUTTON_WEB_STYLES,
    },
    buttonFullWidth: { // For step 1 when there's no back button
        flex: 1, 
        marginLeft: 0,
        marginRight: 0,
    },
    submitButtonText: { color: 'white', fontSize: 20, fontWeight: '900', marginLeft: 5 },
    backButtonText: { color: COLORS.textDark, fontSize: 18, fontWeight: '700', marginLeft: 5 },
    disabledButton: { opacity: 0.6, ...Platform.select({ web: { cursor: 'not-allowed', ':hover': { transform: 'none' } } }) },
    
    // Custom Toast/Feedback Styles
    toastContainer: {
        position: 'fixed', bottom: 30, right: 30, padding: 15, borderRadius: 15, zIndex: 1000, maxWidth: 350,
    },
    toastSuccess: { backgroundColor: COLORS.secondaryTeal, }, 
    toastError: { backgroundColor: COLORS.errorRed, },
    toastText: { color: COLORS.cardBackground, fontWeight: 'bold' },
    
    // 🚩 NEW STYLES FOR STEP 2 COMPONENT
    areaInputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    locateButton: { backgroundColor: COLORS.secondaryTeal, padding: 12, borderRadius: 15, alignItems: 'center', justifyContent: 'center', height: 55, width: 55, ...BASE_ACTION_BUTTON_WEB_STYLES },
    mapButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryCTA, padding: 10, borderRadius: 15, height: 55, paddingHorizontal: 15, ...BASE_ACTION_BUTTON_WEB_STYLES },
    mapButtonText: { color: COLORS.cardBackground, fontWeight: '700', marginLeft: 5 },
    cityDropdownListContainer: { 
        maxHeight: 200, 
        borderWidth: 1, 
        borderColor: COLORS.primaryLight, 
        borderRadius: 15, 
        position: 'absolute', 
        top: 90, // Adjusted for label + input height
        width: '100%', 
        backgroundColor: COLORS.cardBackground,
        zIndex: 10000, 
        elevation: 10,
        ...SUBTLE_SHADOW,
    },
    cityDropdownItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: COLORS.backgroundSoft },
    cityDropdownItemText: { color: COLORS.textDark, fontSize: 16 },
    
    // Map Modal Styles
    mapModalCenteredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
    mapModalView: {
        width: '90%', maxWidth: 600, margin: 20, backgroundColor: COLORS.cardBackground,
        borderRadius: GENEROUS_RADIUS, padding: 35, alignItems: 'center', ...DEEP_SOFT_SHADOW
    },
    mapModalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.headerBlue, marginBottom: 15 },
    embeddedMapContainer: { 
        width: '100%', aspectRatio: 1.5, backgroundColor: COLORS.backgroundSoft, borderRadius: 15, 
        borderWidth: 2, borderColor: COLORS.secondaryTeal + '50', justifyContent: 'center', alignItems: 'center',
        padding: 20 
    },
    embeddedMapText: { color: COLORS.textLight, fontSize: 16, textAlign: 'center' },
    
    // ✅ NEW STYLES FOR STEP 7 COMPONENT (Proximity/POI)
    proximityInputGroup: { marginBottom: 15, borderLeftWidth: 3, borderLeftColor: COLORS.secondaryTeal + '50', paddingLeft: 10 },
    proximityInputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'space-between' },
    proximityInputNameGlobalUnit: { flex: 4, marginRight: 10, padding: 10, height: 45, borderRadius: 10 },
    proximityInputDistanceValueGlobal: { flex: 2, marginRight: 10, padding: 10, height: 45, borderRadius: 10 },
    proximityUnitStaticContainer: { 
        flex: 1.5, marginRight: 10, padding: 10, height: 45, borderRadius: 10, 
        backgroundColor: COLORS.backgroundSoft, justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: COLORS.textLight + '30',
    },
    proximityUnitStaticText: { fontSize: 14, color: COLORS.textDark, fontWeight: '600' },
    addButtonSmall: { 
        backgroundColor: COLORS.secondaryTeal, 
        padding: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center', height: 45, width: 45,
        ...BASE_ACTION_BUTTON_WEB_STYLES 
    },
    divider: { height: 1, backgroundColor: COLORS.textLight + '20', marginVertical: 20, width: '100%' }, 
});

export default ListingFormScreen;