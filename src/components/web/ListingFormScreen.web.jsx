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
  // Added LayoutAnimation for smooth step transitions on mobile/RN platforms
  LayoutAnimation, 
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { useTheme } from '../../theme/theme'; 

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


// -----------------------------------------------------------------
// 🚨 CONFIGURATION: API Endpoint (Replace with your actual server URL)
// -----------------------------------------------------------------
const LISTING_ENDPOINT = `http://localhost:5000/flatmate/listing`; 
// -----------------------------------------------------------------

// -----------------------------------------------------------------
// 🎨 ENHANCED VIBRANT 3D ANIMATION UI CONSTANTS (Deep Sapphire & Vibrant Coral Theme)
// -----------------------------------------------------------------

// --- VIBRANT COLORS (Deep Sapphire & Vibrant Coral Theme) ---
const COLORS = {
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

const GENEROUS_RADIUS = 30; // Ultra-rounded corners for cards and buttons
const ANIMATION_DURATION = '0.3s'; // Global transition speed for smooth UI

// --- COLORFUL 3D SHADOW EFFECTS (Updated with new colors) ---
const DEEP_SOFT_SHADOW = {
    // Web (boxShadow) equivalent for a deep, soft lift (Stronger and deeper)
    boxShadow: `0 20px 40px rgba(30, 41, 59, 0.3), 0 0 20px 8px ${COLORS.secondaryTeal}60`, 
    shadowColor: COLORS.textDark,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
};

const SUBTLE_SHADOW = { 
    // Web (boxShadow) equivalent for pills/selectors
    boxShadow: `0 5px 10px rgba(30, 41, 59, 0.15), 0 0 5px 2px ${COLORS.headerBlue}30`,
    shadowColor: COLORS.textDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
}

const CTA_SHADOW = {
    // Web (boxShadow) equivalent for CTA pop (Coral saturation)
    boxShadow: `0 10px 20px ${COLORS.primaryCTA}70, 0 0 15px 4px ${COLORS.primaryCTA}50`,
    shadowColor: COLORS.primaryCTA,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
}
// -----------------------------------------------------------------


// --- FORM STEPS DEFINITION (Retained) ---
const STEPS = [
    { id: 1, title: "Goal & Property Type", icon: 'home-outline' },
    { id: 2, title: "Location & Pricing", icon: 'pin-outline' },
    { id: 3, title: "Furnishing & Amenities", icon: 'tv-outline' },
    { id: 4, title: "Description & Requirements", icon: 'document-text-outline' },
    { id: 5, title: "Property Images", icon: 'image-outline' },
];


// --- STATIC DATA (Retained) ---
const listingGoals = ['Rent', 'Sale', 'Flatmate'];
const propertyTypeData = {
    Rent: ['Flat', 'PG', 'Hostel', 'House'],
    Sale: ['Flat', 'House', 'Plot'],
    Flatmate: ['Shared Flatmate'],
};
const furnishingItems = {
    'Fully Furnished': ['Beds', 'Sofa/Seating', 'TV', 'Refrigerator', 'Washing Machine', 'Microwave', 'AC'],
    'Semi-Furnished': ['Wardrobes', 'Kitchen Cabinets', 'Basic Lights/Fans', 'Geyser'],
    'Unfurnished': ['Only basic fixtures (lights, fans)'],
};
const amenities = ['Wifi', 'Parking', 'Gym', 'Balcony', 'AC', 'Security', 'Lift', '24x7 Water'];
const preferredGenders = ['Male', 'Female', 'Any'];
const preferredOccupations = ['IT Professional', 'Student', 'Working Professional', 'Other'];
const availableDates = ['Now', 'Next Week', 'Next Month', 'Custom Date'];
const propertySizes = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK']; 
const negotiationMargins = ['0', '5', '10', '15', '20']; 


// -----------------------------------------------------------------
// 🎨 Stepper Component (ENHANCED for Active Glow with new color)
// -----------------------------------------------------------------
const Stepper = ({ currentStep, steps, onStepPress }) => (
    <View style={styles.stepperContainer}>
        {steps.map((step, index) => (
            <React.Fragment key={step.id}>
                <TouchableOpacity 
                    style={[
                        styles.stepPill,
                        // Active pill gets the pulsating glow effect
                        step.id === currentStep && styles.stepPillActiveGlow, 
                        step.id < currentStep && styles.stepPillCompleted,
                        SUBTLE_SHADOW // Subtle lift for each pill
                    ]}
                    onPress={() => onStepPress(step.id)} 
                    disabled={step.id > currentStep} 
                >
                    <Icon 
                        name={step.icon} 
                        size={18} 
                        color={step.id <= currentStep ? COLORS.cardBackground : COLORS.headerBlue} 
                    />
                    <Text style={[
                        styles.stepTitle, 
                        step.id <= currentStep && styles.stepTitleActive
                    ]}>
                        {step.title}
                    </Text>
                </TouchableOpacity>
                {index < steps.length - 1 && (
                    <View style={[
                        styles.stepLine,
                        step.id < currentStep && styles.stepLineCompleted,
                    ]} />
                )}
            </React.Fragment>
        ))}
    </View>
);
// -----------------------------------------------------------------


// =================================================================
// 🎯 MAIN COMPONENT: ListingFormScreen
// =================================================================
const ListingFormScreen = ({ listingId, onClose }) => {
    const { colors } = useTheme(); 
    const scrollViewRef = useRef(null);
    
    // --- Stepper State ---
    const [currentStep, setCurrentStep] = useState(1);
    const isLastStep = currentStep === STEPS.length;
    
    // -------------------
    // 🚩 STATE MANAGEMENT 
    // -------------------
    const [isLoading, setIsLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState(null); 
    
    // Core Property Details
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
    
    // Availability & Occupancy
    const [availableDate, setAvailableDate] = useState(availableDates[0]);
    const [currentOccupants, setCurrentOccupants] = useState('');

    // Furnishing & Amenities
    const [furnishingType, setFurnishingType] = useState('Unfurnished');
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    
    // Negotiation Details
    const [maxNegotiablePrice, setMaxNegotiablePrice] = useState(''); 
    const [negotiationMargin, setNegotiationMargin] = useState(negotiationMargins[1]);
    
    // Requirements 
    const [preferredGender, setPreferredGender] = useState(preferredGenders[2]);
    const [preferredOccupation, setPreferredOccupation] = useState(preferredOccupations[0]);
    const [preferredWorkLocation, setPreferredWorkLocation] = useState('');

    // Image Handling
    const [currentImageLink, setCurrentImageLink] = useState('');
    const [imageLinks, setImageLinks] = useState([]);
    
    const isEditing = !!listingId; 

    // --- Navigation Handlers (ENHANCED with LayoutAnimation) ---
    const handleNext = () => {
        // Basic validation before moving to next step
        if (currentStep === 1 && (!goal || !propertyType)) {
            showToast("Please select Goal and Property Type.", 'error');
            return;
        }
        if (currentStep === 2 && (!city || !area || !rent || !deposit || !bedrooms || !bathrooms)) {
            showToast("Please fill all Location and Pricing details.", 'error');
            return;
        }
        
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
    const showToast = (message, type = 'success') => {
        setToastMessage({ message, type });
        setTimeout(() => setToastMessage(null), 4000);
    };

    const handleGoalChange = (newGoal) => {
        setGoal(newGoal);
        setPropertyType(propertyTypeData[newGoal][0]);
    };
    
    const handleAmenityToggle = (amenity) => {
        setSelectedAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity] );
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

    const handleSubmit = async () => {
        if (imageLinks.length < 3) {
            Alert.alert("Incomplete Form", "Please upload at least 3 property images.");
            return;
        }

        setIsLoading(true);
        setToastMessage(null);

        // ... API Submission Logic ... 
        const payload = {
            listing_goal: goal,
            // ... other fields
        };
        // Mock success response
        setTimeout(() => {
            setIsLoading(false);
            showToast(`✅ Listing ${isEditing ? 'updated' : 'submitted'} successfully!`, 'success');
            if (onClose) onClose(); 
        }, 2000);
    };

    // --- Render Helpers (Modified for Interactive Animation) ---

    const renderGoalSelector = () => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Listing Goal</Text>
            <View style={styles.selectorContainer}>
                {listingGoals.map(g => (
                    <TouchableOpacity 
                        key={g} 
                        style={[
                            styles.selectorButton, 
                            g === goal && styles.selectorButtonActive,
                            SUBTLE_SHADOW 
                        ]} 
                        onPress={() => handleGoalChange(g)}
                        disabled={isLoading}
                    >
                        <Text style={g === goal ? styles.selectorTextActive : styles.selectorText}>{g}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderPropertyTypeSelector = () => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Property Type</Text>
            <View style={styles.selectorContainer}>
                {propertyTypeData[goal].map(type => (
                    <TouchableOpacity 
                        key={type} 
                        style={[
                            styles.selectorButton, 
                            propertyType === type && styles.selectorButtonActive,
                            SUBTLE_SHADOW
                        ]} 
                        onPress={() => setPropertyType(type)}
                        disabled={isLoading}
                    >
                        <Text style={propertyType === type ? styles.selectorTextActive : styles.selectorText}>{type}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderPropertyDetails = () => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>BHK Type & Bathrooms</Text>
            <View style={styles.inputRow}>
                {/* Bedrooms (BHK Type) */}
                <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.labelSmall}>BHK Type</Text>
                    <View style={styles.selectorContainerSmall}>
                        {propertySizes.map(size => (
                            <TouchableOpacity 
                                key={size} 
                                style={[
                                    styles.selectorButtonTiny, 
                                    bedrooms === size && styles.selectorButtonActive,
                                    SUBTLE_SHADOW
                                ]} 
                                onPress={() => setBedrooms(size)}
                                disabled={isLoading}
                            >
                                <Text style={bedrooms === size ? styles.selectorTextActive : styles.selectorText}>{size}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                {/* Bathrooms */}
                <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.labelSmall}>Bathrooms</Text>
                    <TextInput 
                        style={styles.textInput} 
                        value={bathrooms}
                        onChangeText={setBathrooms}
                        keyboardType="numeric"
                        placeholder="e.g., 2"
                        editable={!isLoading}
                    />
                </View>
            </View>
        </View>
    );

    const renderFurnishingSelector = () => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Furnishing Status</Text>
            <View style={styles.selectorContainer}>
                {Object.keys(furnishingItems).map(key => (
                    <TouchableOpacity 
                        key={key} 
                        style={[
                            styles.selectorButton, 
                            furnishingType === key && styles.selectorButtonActive,
                            SUBTLE_SHADOW
                        ]} 
                        onPress={() => setFurnishingType(key)}
                        disabled={isLoading}
                    >
                        <Text style={furnishingType === key ? styles.selectorTextActive : styles.selectorText}>{key}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.helperText}>
                Includes: {furnishingItems[furnishingType].join(', ')}
            </Text>
        </View>
    );

    const renderAmenities = () => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Key Amenities</Text>
            <View style={styles.amenityContainer}>
                {amenities.map(amenity => (
                    <TouchableOpacity
                        key={amenity}
                        style={[
                            styles.toggleButton,
                            selectedAmenities.includes(amenity) && styles.toggleButtonActive,
                            SUBTLE_SHADOW
                        ]}
                        onPress={() => handleAmenityToggle(amenity)}
                        disabled={isLoading}
                    >
                        <Icon 
                            name={selectedAmenities.includes(amenity) ? 'checkmark-circle' : 'add-circle-outline'} 
                            size={18} 
                            color={selectedAmenities.includes(amenity) ? COLORS.cardBackground : COLORS.textDark} 
                            style={{ marginRight: 5 }}
                        />
                        <Text style={selectedAmenities.includes(amenity) ? styles.toggleTextActive : styles.toggleText}>
                            {amenity}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderNegotiationMargin = () => (
        <View style={styles.inputGroup}>
            <Text style={styles.labelSmall}>Negotiation Margin (%)</Text>
            <View style={styles.selectorContainerSmall}>
                {negotiationMargins.map(margin => (
                    <TouchableOpacity 
                        key={margin} 
                        style={[
                            styles.selectorButtonTiny, 
                            negotiationMargin === margin && styles.selectorButtonActive,
                            SUBTLE_SHADOW
                        ]} 
                        onPress={() => setNegotiationMargin(margin)}
                        disabled={isLoading}
                    >
                        <Text style={negotiationMargin === margin ? styles.selectorTextActive : styles.selectorText}>{margin}%</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderOccupationSelector = () => (
        <View style={styles.selectorContainerSmall}>
            {preferredOccupations.map(occ => (
                <TouchableOpacity 
                    key={occ} 
                    style={[
                        styles.selectorButtonSmall, 
                        preferredOccupation === occ && styles.selectorButtonActive,
                        SUBTLE_SHADOW
                    ]} 
                    onPress={() => setPreferredOccupation(occ)}
                    disabled={isLoading}
                >
                    <Text style={preferredOccupation === occ ? styles.selectorTextActive : styles.selectorText}>{occ}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderImages = () => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Property Images</Text>
            <Text style={styles.uploadHelperText}>
                 Add image URLs (up to 5). (Minimum 3 required) 
            </Text>
            <View style={styles.imageInputContainer}>
                <TextInput 
                    style={styles.imageLinkInput} 
                    placeholder="Paste Image URL here (e.g., imgur.com/xyz.jpg)"
                    value={currentImageLink}
                    onChangeText={setCurrentImageLink}
                    editable={!isLoading && imageLinks.length < 5} 
                />
                <TouchableOpacity 
                    style={[styles.addButton, SUBTLE_SHADOW]} 
                    onPress={handleAddImage}
                    disabled={isLoading || imageLinks.length >= 5}
                >
                    <Icon name="add" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
            </View>
            
            <View style={styles.imagePreviewContainer}>
                {imageLinks.map((url, index) => (
                    <View key={index} style={[styles.imagePill, SUBTLE_SHADOW]}>
                        <Text style={styles.imageText} numberOfLines={1}>
                            Image {index + 1}
                        </Text>
                        <TouchableOpacity onPress={() => handleRemoveImage(url)}>
                            <Icon name="close-circle" size={20} color={COLORS.errorRed} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );


    // -----------------------------------------------------------------
    // 🏠 RENDER STEP CONTENT (Conditional Rendering for Stepper)
    // -----------------------------------------------------------------
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <Text style={styles.sectionTitle}>1. Listing Goal & Property Type</Text>
                        {renderGoalSelector()}
                        {renderPropertyTypeSelector()}
                    </>
                );
            case 2:
                return (
                    <>
                        <Text style={styles.sectionTitle}>2. Location & Pricing</Text>
                        
                        <View style={styles.inputRow}>
                            <View style={[styles.inputGroup, styles.inputHalf]}>
                                <Text style={styles.label}>City</Text>
                                <TextInput style={styles.textInput} placeholder="e.g., Mumbai" value={city} onChangeText={setCity} editable={!isLoading} />
                            </View>
                            <View style={[styles.inputGroup, styles.inputHalf]}>
                                <Text style={styles.label}>Area/Locality</Text>
                                <TextInput style={styles.textInput} placeholder="e.g., Bandra West" value={area} onChangeText={setArea} editable={!isLoading} />
                            </View>
                        </View>
                        
                        <View style={styles.inputRow}>
                            <View style={[styles.inputGroup, styles.inputHalf]}>
                                <Text style={styles.label}>{goal === 'Sale' ? 'Sale Price (₹)' : 'Monthly Rent (₹)'}</Text>
                                <TextInput style={styles.textInput} placeholder="e.g., 45000" value={rent} onChangeText={setRent} keyboardType="numeric" editable={!isLoading} />
                            </View>
                            <View style={[styles.inputGroup, styles.inputHalf]}>
                                <Text style={styles.label}>Security Deposit (₹)</Text>
                                <TextInput style={styles.textInput} placeholder="e.g., 150000" value={deposit} onChangeText={setDeposit} keyboardType="numeric" editable={!isLoading} />
                            </View>
                        </View>
                        {renderPropertyDetails()}
                    </>
                );
            case 3:
                return (
                    <>
                        <Text style={styles.sectionTitle}>3. Furnishing & Key Amenities</Text>
                        {renderFurnishingSelector()}
                        
                        <View style={styles.inputRow}>
                            <View style={[styles.inputGroup, styles.inputHalf]}>
                                <Text style={styles.label}>Availability Date</Text>
                                <View style={styles.selectorContainerSmall}>
                                    {availableDates.map(date => (
                                        <TouchableOpacity 
                                            key={date} 
                                            style={[styles.selectorButtonTiny, availableDate === date && styles.selectorButtonActive, SUBTLE_SHADOW]} 
                                            onPress={() => setAvailableDate(date)}
                                            disabled={isLoading}
                                        >
                                            <Text style={availableDate === date ? styles.selectorTextActive : styles.selectorText}>{date}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View style={[styles.inputGroup, styles.inputHalf]}>
                                <Text style={styles.label}>Current Occupants</Text>
                                <TextInput style={styles.textInput} placeholder="e.g., 2 (for flatmate search)" value={currentOccupants} onChangeText={setCurrentOccupants} keyboardType="numeric" editable={!isLoading} />
                            </View>
                        </View>
                        {renderAmenities()}
                    </>
                );
            case 4:
                return (
                    <>
                        <Text style={styles.sectionTitle}>4. Description & Tenant Requirements</Text>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Property Description</Text>
                            <TextInput style={[styles.textInput, styles.textArea]} placeholder="Provide a detailed description of the property..." value={description} onChangeText={setDescription} multiline numberOfLines={4} editable={!isLoading} />
                        </View>
                        
                        <View style={styles.inputRow}>
                            <View style={[styles.inputGroup, styles.inputHalf]}>
                                <Text style={styles.labelSmall}>Brokerage Free?</Text>
                                <TouchableOpacity
                                    style={[styles.toggleButtonFull, isBrokerageFree && styles.toggleButtonActive, CTA_SHADOW]} 
                                    onPress={() => setIsBrokerageFree(prev => !prev)}
                                    disabled={isLoading}
                                >
                                    <Icon name={isBrokerageFree ? 'shield-checkmark' : 'close-circle-outline'} size={20} color={isBrokerageFree ? COLORS.cardBackground : COLORS.textDark} style={{ marginRight: 8 }} />
                                    <Text style={isBrokerageFree ? styles.toggleTextActive : styles.toggleText}>
                                        {isBrokerageFree ? 'Yes, Brokerage Free' : 'No, Brokerage Applies'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.inputGroup, styles.inputHalf]}>
                                {renderNegotiationMargin()}
                            </View>
                        </View>
                        
                        {/* Requirements (Conditional for Flatmate) */}
                        {goal === 'Flatmate' && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Preferred Flatmate Requirements</Text>
                                <View style={styles.inputRow}>
                                    <View style={[styles.inputGroup, styles.inputHalf]}>
                                        <Text style={styles.labelSmall}>Gender</Text>
                                        <View style={styles.selectorContainerSmall}>
                                            {preferredGenders.map(gender => (
                                                <TouchableOpacity key={gender} style={[styles.selectorButtonTiny, preferredGender === gender && styles.selectorButtonActive, SUBTLE_SHADOW]} onPress={() => setPreferredGender(gender)} disabled={isLoading}>
                                                    <Text style={preferredGender === gender ? styles.selectorTextActive : styles.selectorText}>{gender}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                    <View style={[styles.inputGroup, styles.inputHalf]}>
                                        <Text style={styles.labelSmall}>Occupation</Text>
                                        {renderOccupationSelector()}
                                    </View>
                                </View>
                                <Text style={styles.labelSmall}>Preferred Work Location</Text>
                                <TextInput style={styles.textInput} placeholder="e.g., Andheri, Powai" value={preferredWorkLocation} onChangeText={setPreferredWorkLocation} editable={!isLoading} />
                            </View>
                        )}
                    </>
                );
            case 5:
                return (
                    <>
                        <Text style={styles.sectionTitle}>5. Property Images (Final Step)</Text>
                        {renderImages()}
                        {imageLinks.length < 3 && (
                            <Text style={styles.errorText}>
                                🚨 Minimum 3 images are required for submission. Currently: {imageLinks.length}
                            </Text>
                        )}
                    </>
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
                
                {/* Stepper Progress Bar (NEW) */}
                <Stepper 
                    currentStep={currentStep} 
                    steps={STEPS} 
                    onStepPress={handleGoToStep} 
                />
                
                {/* Form Content (Current Step Card) - Key added for smoother transition */}
                <View key={currentStep} style={[styles.section, DEEP_SOFT_SHADOW]}>
                    {renderStepContent()}
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
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.backgroundSoft },
    scrollContent: { 
        flexGrow: 1, 
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    mainHeader: { fontSize: 32, fontWeight: '900', color: COLORS.headerBlue, marginBottom: 5, textAlign: 'center' },
    subHeader: { fontSize: 16, color: COLORS.textLight, marginBottom: 30, textAlign: 'center' },
    
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
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', color: COLORS.textDark, marginBottom: 8 },
    labelSmall: { fontSize: 14, fontWeight: '600', color: COLORS.textDark, marginBottom: 8 },
    inputRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
    inputHalf: { width: '48%', marginBottom: 0 },
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
    selectorTextActive: { color: COLORS.textDark, fontWeight: '800', fontSize: 14 },
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
    toastText: { color: COLORS.textDark, fontWeight: 'bold' },
});

export default ListingFormScreen;