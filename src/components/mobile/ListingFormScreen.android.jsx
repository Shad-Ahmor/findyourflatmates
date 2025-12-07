// src/screens/ListingFormScreen.jsx

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Using FontAwesome5 for better icons

// --- STATIC DATA ---
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
const preferredOccupations = ['IT Professional', 'Student', 'Working Professional', 'Business'];
// --- END STATIC DATA ---

// --- Reusable Input Component (MODIFIED for stability and suffix) ---
const FormInput = ({ label, placeholder, keyboardType = 'default', value, onChangeText, multiline = false, style = {}, readOnly = false, suffix = '', helperText = '' }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View 
        style={[
            styles.inputWithSuffixContainer, 
            multiline && styles.textAreaContainer // Apply new style for multiline container
        ]}
    >
      <TextInput
        style={[
          styles.input, 
          multiline && styles.textArea, // Apply textarea specific input style
          readOnly && styles.readOnlyInput, 
          style, 
          suffix && styles.inputWithSuffix
        ]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        editable={!readOnly}
        autoCapitalize={keyboardType === 'url' ? 'none' : 'sentences'}
        autoCorrect={keyboardType === 'url' ? false : true}
      />
      {suffix && <Text style={styles.suffixText}>{suffix}</Text>}
    </View>
    {helperText && <Text style={styles.helperTextBottom}>{helperText}</Text>}
  </View>
);
// --- End Reusable Input Component ---

// --- Reusable Section Wrapper ---
const FormSection = ({ title, iconName, children, isFlatmate = false, sectionNumber }) => (
    <View style={[styles.card, isFlatmate && styles.flatmateCard]}>
        <View style={styles.sectionTitleContainer}>
            <Icon 
                name={iconName} 
                size={20} 
                color={isFlatmate ? '#28a745' : '#007AFF'} 
                style={{ marginRight: 10 }}
            />
            <Text style={[styles.sectionTitle, isFlatmate && styles.flatmateSectionTitle]}>{sectionNumber}. {title}</Text>
        </View>
        <View style={styles.sectionContent}>
            {children}
        </View>
    </View>
);
// --- End Reusable Section Wrapper ---


const ListingFormScreen = () => {
  const [listingDetails, setListingDetails] = useState({
    // Core Details
    listing_goal: 'Rent', 
    type: 'Flat', 
    location: '',
    
    // Specifications
    bhk: '', 
    bathrooms: '',
    area: '', 
    furnishing_status: 'Fully Furnished', 
    furnishing_details: [], 
    
    // Budget
    price: '', 
    deposit: '',
    negotiation_margin_percent: '', // NEW FIELD FOR NEGOTIATION PERCENTAGE
    
    // Availability
    available_from: 'Now', 
    available_date: '', 
    
    // Requirements & Amenities
    description: '', 
    selectedAmenities: [],
    
    // Flatmate Specific Fields (Conditional)
    is_flatmate_listing: false,
    current_occupants: '', 
    preferred_gender: preferredGenders[0], 
    preferred_occupation: preferredOccupations[0], 
    preferred_work_location: '', 
    
    // Other Settings
    is_no_brokerage: false, 
    imageLinks: ['', '', ''], 
  });

  // --- EFFECT: Reset Type/Deposit/Negotiation when Goal changes ---
  useEffect(() => {
    const newGoal = listingDetails.listing_goal;
    const isFlatmate = newGoal === 'Flatmate';
    
    const newType = propertyTypeData[newGoal][0];
    
    let newDeposit = listingDetails.deposit;
    if (newGoal === 'Sale') {
      newDeposit = 'N/A';
    } else if (listingDetails.deposit === 'N/A') {
      newDeposit = '';
    }
    
    setListingDetails(prevDetails => ({
      ...prevDetails,
      is_flatmate_listing: isFlatmate,
      type: newType,
      deposit: newDeposit,
      // Reset negotiation for flatmate listings
      negotiation_margin_percent: isFlatmate ? '' : prevDetails.negotiation_margin_percent, 
    }));
  }, [listingDetails.listing_goal]);

  // --- EFFECT: Reset Furnishing Details when Status changes ---
  useEffect(() => {
      setListingDetails(prevDetails => ({
          ...prevDetails,
          furnishing_details: [],
      }));
  }, [listingDetails.furnishing_status]);


  const updateDetail = (key, value) => {
    setListingDetails({ ...listingDetails, [key]: value });
  };
  
  const handleToggleAmenity = (amenity) => {
    const { selectedAmenities } = listingDetails;
    if (selectedAmenities.includes(amenity)) {
      updateDetail('selectedAmenities', selectedAmenities.filter(a => a !== amenity));
    } else {
      updateDetail('selectedAmenities', [...selectedAmenities, amenity]);
    }
  };

  const handleToggleFurnishingItem = (item) => {
    const { furnishing_details } = listingDetails;
    if (furnishing_details.includes(item)) {
      updateDetail('furnishing_details', furnishing_details.filter(i => i !== item));
    } else {
      updateDetail('furnishing_details', [...furnishing_details, item]);
    }
  };

  const addImageLinkField = () => {
    updateDetail('imageLinks', [...listingDetails.imageLinks, '']);
  };

  const handleSubmit = () => {
    const { location, price, bhk, area, imageLinks, listing_goal, is_flatmate_listing, available_from, available_date, negotiation_margin_percent } = listingDetails;
    const validImageLinks = imageLinks.filter(link => link.trim() !== '');

    // General Validation
    if (!location || !price || (!is_flatmate_listing && (!bhk || !area))) {
      Alert.alert("Missing Details", `Please fill in Location, ${listing_goal === 'Sale' ? 'Sale Price' : 'Rent/Price'}, and ${is_flatmate_listing ? 'Flatmate' : 'BHK/Area'} details.`);
      return;
    }
    
    // Availability Date Validation
    if (available_from === 'Specify Date' && !available_date) {
        Alert.alert("Missing Date", "Please specify the exact availability date.");
        return;
    }
    
    // Negotiation Margin Validation (Max 10%)
    const margin = parseInt(negotiation_margin_percent, 10);
    if (negotiation_margin_percent && (isNaN(margin) || margin < 0 || margin > 10)) {
        Alert.alert("Invalid Negotiation Margin", "Negotiation margin must be a number between 0 and 10%.");
        return;
    }

    // Flatmate specific validation
    if (is_flatmate_listing && (!listingDetails.current_occupants || !listingDetails.preferred_work_location)) {
         Alert.alert("Flatmate Details Missing", "Please specify current occupants and preferred work location for the flatmate listing.");
        return;
    }

    // Photo Validation
    if (validImageLinks.length < 3) {
      Alert.alert(
        "Missing Photos", 
        `Please provide at least 3 public image links. You have added ${validImageLinks.length}.`
      );
      return;
    }

    // --- Final Submission Logic ---
    const finalListing = {
        ...listingDetails,
        imageLinks: validImageLinks, 
        final_available_date: available_from === 'Specify Date' ? available_date : available_from,
        negotiation_margin_percent: negotiation_margin_percent ? margin : 0,
        // Calculate the lowest acceptable price based on margin
        max_negotiable_price: negotiation_margin_percent ? (parseFloat(price) * (1 - (margin / 100))).toFixed(0) : price,
    };
    
    console.log('Submitting Listing:', finalListing);
    Alert.alert("Success", `Your property has been listed for ${listing_goal} and sent for review!`);
  };

  // कॉम्पोनेंट: इमेज लिंक इनपुट
  const ImageLinkInput = ({ index }) => (
    <View style={styles.imageInputContainer}>
      <Icon name="link" size={18} color="#007AFF" style={{ marginRight: 10 }} solid />
      <TextInput
        style={[styles.input, styles.imageLinkInput]}
        placeholder={`Public Image Link ${index + 1} (Min 3 required)`}
        placeholderTextColor="#999"
        value={listingDetails.imageLinks[index]}
        onChangeText={(text) => updateDetail('imageLinks', [...listingDetails.imageLinks.slice(0, index), text, ...listingDetails.imageLinks.slice(index + 1)])}
        autoCapitalize="none"
        keyboardType="url"
      />
    </View>
  );

  const renderSelectionPills = (data, selectedValue, key, isAmenity = false) => (
    <View style={styles.pillContainer}>
      {data.map(item => {
        const isActive = isAmenity ? listingDetails.selectedAmenities.includes(item) : selectedValue === item;
        return (
          <TouchableOpacity
            key={item}
            style={[
              styles.pillButton,
              isAmenity && styles.amenityPill,
              (isAmenity ? isActive && styles.amenityPillActive : isActive && styles.pillButtonActive)
            ]}
            onPress={() => isAmenity ? handleToggleAmenity(item) : updateDetail(key, item)}
            // Flatmate type lock
            disabled={listingDetails.listing_goal === 'Flatmate' && key === 'type'} 
          >
            <Text style={[
              styles.pillButtonText,
              (isAmenity ? isActive && styles.amenityTextActive : isActive && styles.pillButtonTextActive)
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderFurnishingCheckboxes = () => {
    const status = listingDetails.furnishing_status;
    const items = furnishingItems[status] || [];

    if (status === 'Unfurnished') {
        return (
            <View style={styles.furnishingHelpTextContainer}>
                <Icon name="info-circle" size={14} color="#856404" style={{ marginRight: 5 }} solid />
                <Text style={styles.furnishingHelpText}>
                    Unfurnished properties only include basic electrical/plumbing fixtures. No furniture/appliances are provided.
                </Text>
            </View>
        );
    }
    
    return (
        <View style={styles.furnishingCheckboxesContainer}>
            <Text style={styles.label}>What is included in this listing?</Text>
            <View style={styles.pillContainer}>
                {items.map(item => {
                    const isIncluded = listingDetails.furnishing_details.includes(item);
                    return (
                        <TouchableOpacity
                            key={item}
                            style={[styles.furnishingPill, isIncluded && styles.furnishingPillActive]}
                            onPress={() => handleToggleFurnishingItem(item)}
                        >
                            <Icon 
                                name={isIncluded ? "check-square" : "square"} 
                                size={16} 
                                color={isIncluded ? '#FFF' : '#333'} 
                                solid
                                style={{ marginRight: 5 }}
                            />
                            <Text style={[styles.furnishingText, isIncluded && styles.furnishingTextActive]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>🏠 List Your Property</Text>
        <Text style={styles.subHeader}>Provide comprehensive details to attract the right interest.</Text>

        {/* 1. Listing Goal & Type */}
        <FormSection title="Listing Goal & Property Type" iconName="tag" sectionNumber="1">
        
          {/* Listing Goal (Rent/Sale/Flatmate) */}
          <Text style={styles.label}>Listing Goal</Text>
          {renderSelectionPills(listingGoals, listingDetails.listing_goal, 'listing_goal')}
          
          {/* Property Type (Dynamic based on Goal) */}
          <Text style={styles.label}>Property Type</Text>
          {renderSelectionPills(
              propertyTypeData[listingDetails.listing_goal], 
              listingDetails.type, 
              'type'
          )}
        </FormSection>

        {/* 2. Property Specifications */}
        <FormSection title="Specifications & Furnishing" iconName="cogs" sectionNumber="2">
        
          {/* BHK, Bathroom, Area (Hide if Flatmate listing) */}
          {!listingDetails.is_flatmate_listing && (
              <View style={styles.row}>
                  <View style={styles.thirdInput}>
                      <FormInput 
                          label={listingDetails.type === 'Plot' ? 'Area (sqft)' : 'BHK/Rooms'}
                          placeholder={listingDetails.type === 'Plot' ? '2400' : '2'}
                          value={listingDetails.bhk}
                          onChangeText={(text) => updateDetail('bhk', text)}
                          keyboardType={listingDetails.type === 'Plot' ? 'numeric' : 'default'}
                          helperText={listingDetails.type === 'Plot' ? '' : 'e.g., 2 BHK'}
                      />
                  </View>
                  {listingDetails.type !== 'Plot' && (
                      <>
                          <View style={styles.thirdInput}>
                              <FormInput 
                                  label="Bathrooms"
                                  placeholder="2"
                                  keyboardType="numeric"
                                  value={listingDetails.bathrooms}
                                  onChangeText={(text) => updateDetail('bathrooms', text.replace(/[^0-9]/g, ''))}
                                  helperText="Total number"
                              />
                          </View>
                          <View style={styles.thirdInput}>
                              <FormInput 
                                  label="Carpet Area (sqft)"
                                  placeholder="1200"
                                  keyboardType="numeric"
                                  value={listingDetails.area}
                                  onChangeText={(text) => updateDetail('area', text.replace(/[^0-9]/g, ''))}
                                  helperText="Total usable area"
                              />
                          </View>
                      </>
                  )}
              </View>
          )}
          
          {/* Furnishing Status (Hide if Plot or Flatmate) */}
          {listingDetails.type !== 'Plot' && !listingDetails.is_flatmate_listing && (
              <>
                  <Text style={styles.label}>Furnishing Status</Text>
                  {renderSelectionPills(['Fully Furnished', 'Semi-Furnished', 'Unfurnished'], listingDetails.furnishing_status, 'furnishing_status')}
                  
                  {/* Furnishing Details Checkboxes */}
                  {renderFurnishingCheckboxes()}
              </>
          )}
          
          {/* No Brokerage */}
          <View style={styles.checkboxContainer}>
              <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => updateDetail('is_no_brokerage', !listingDetails.is_no_brokerage)}
              >
                  <Icon 
                      name={listingDetails.is_no_brokerage ? "check-square" : "square"} 
                      size={20} 
                      color={listingDetails.is_no_brokerage ? '#28a745' : '#777'} 
                      solid
                  />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Direct from Owner/Tenant (No Brokerage)</Text>
          </View>
        </FormSection>


        {/* 3. Location & Budget */}
        <FormSection title="Location & Pricing" iconName="map-marker-alt" sectionNumber="3">
          <FormInput 
            label="Exact Location/Address"
            placeholder="e.g., Andheri West, near XYZ Metro"
            value={listingDetails.location}
            onChangeText={(text) => updateDetail('location', text)}
            helperText="Enter the full address or landmark for better visibility."
          />
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <FormInput 
                label={listingDetails.listing_goal === 'Sale' ? "Sale Price (₹)" : "Monthly Rent (₹)"}
                placeholder={listingDetails.listing_goal === 'Sale' ? "25000000" : "20000"}
                keyboardType="numeric"
                value={listingDetails.price}
                onChangeText={(text) => updateDetail('price', text.replace(/[^0-9]/g, ''))}
              />
            </View>
            <View style={styles.halfInput}>
              <FormInput 
                label="Security Deposit (₹)"
                placeholder={listingDetails.listing_goal === 'Sale' ? "N/A" : "40000"}
                keyboardType={listingDetails.listing_goal === 'Sale' ? 'default' : 'numeric'}
                value={listingDetails.listing_goal === 'Sale' ? 'N/A' : listingDetails.deposit}
                onChangeText={(text) => listingDetails.listing_goal !== 'Sale' && updateDetail('deposit', text.replace(/[^0-9]/g, ''))}
                readOnly={listingDetails.listing_goal === 'Sale'}
              />
            </View>
          </View>
          
          {/* --- NEGOTIATION MARGIN FIELD --- */}
          {!listingDetails.is_flatmate_listing && (
              <FormInput 
                  label="Negotiation Margin (Optional)"
                  placeholder="e.g., 5 (Max 10)"
                  keyboardType="numeric"
                  value={listingDetails.negotiation_margin_percent}
                  onChangeText={(text) => updateDetail('negotiation_margin_percent', text.replace(/[^0-9]/g, '').substring(0, 2))}
                  suffix="%"
                  helperText="Maximum percentage (0-10%) you are willing to negotiate. This activates quick negotiation for buyers."
              />
          )}
          {/* --- END NEGOTIATION MARGIN FIELD --- */}
          
          {/* Available From (Date Picker Simulation) */}
          <Text style={styles.label}>Available From</Text>
          {renderSelectionPills(['Now', 'Next Month', 'Specify Date'], listingDetails.available_from, 'available_from')}
          
          {listingDetails.available_from === 'Specify Date' && (
              <FormInput 
                  label="Available Date (YYYY-MM-DD)"
                  placeholder="e.g., 2025-12-01"
                  value={listingDetails.available_date}
                  onChangeText={(text) => updateDetail('available_date', text)}
                  style={{ marginBottom: 15 }}
                  helperText="Use YYYY-MM-DD format."
              />
          )}
        </FormSection>

        
        {/* 4. FLATIMATE REQUIREMENTS (Conditional Section) */}
        {listingDetails.is_flatmate_listing && (
          <FormSection title="Flatmate Requirements" iconName="user-friends" isFlatmate={true} sectionNumber="4">
            
            <View style={styles.row}>
                 <View style={styles.halfInput}>
                    <FormInput 
                        label="Current Occupants"
                        placeholder="1"
                        keyboardType="numeric"
                        value={listingDetails.current_occupants}
                        onChangeText={(text) => updateDetail('current_occupants', text.replace(/[^0-9]/g, ''))}
                        helperText="Excluding the new person"
                    />
                </View>
                <View style={styles.halfInput}>
                    <FormInput 
                        label="Preferred Work/Study Location"
                        placeholder="e.g., BKC or nearby University"
                        value={listingDetails.preferred_work_location}
                        onChangeText={(text) => updateDetail('preferred_work_location', text)}
                        helperText="Helps in matching based on commute."
                    />
                </View>
            </View>
            
            <Text style={styles.label}>Preferred Gender</Text>
            {renderSelectionPills(preferredGenders, listingDetails.preferred_gender, 'preferred_gender')}

            <Text style={styles.label}>Preferred Occupation</Text>
            {renderSelectionPills(preferredOccupations, listingDetails.preferred_occupation, 'preferred_occupation')}

            <FormInput 
              label="Flatmate Specific Description"
              placeholder="Mention shared utilities, house rules, personality preferences, etc."
              multiline={true}
              value={listingDetails.description}
              onChangeText={(text) => updateDetail('description', text)}
              helperText="Describe the living situation, rules, and ideal flatmate persona."
            />
          </FormSection>
        )}
        
        {/* 5. Amenities & Description */}
        <FormSection 
            title="Amenities & Details" 
            iconName="list-ul"
            sectionNumber={listingDetails.is_flatmate_listing ? '5' : '4'} // Dynamic section number
        >
          <Text style={styles.label}>What amenities are available?</Text>
          {renderSelectionPills(amenities, listingDetails.selectedAmenities, 'selectedAmenities', true)}
          
          {/* General Property Description (only if not a dedicated Flatmate description) */}
          {!listingDetails.is_flatmate_listing && (
              <>
                  <FormInput 
                    label="Detailed Property Description"
                    placeholder="Describe society, locality, furniture details, and suitability (family/bachelor)."
                    multiline={true}
                    value={listingDetails.description}
                    onChangeText={(text) => updateDetail('description', text)}
                    helperText="A detailed description increases listing credibility."
                  />
              </>
          )}
        </FormSection>

        
        {/* 6. Photos (Link Inputs) */}
        <FormSection title="Property Photos" iconName="image" sectionNumber={listingDetails.is_flatmate_listing ? '6' : '5'}>
          <Text style={styles.uploadHelperText}>
              Add links to photos (Min 3 required). Make sure links are **public** and direct.
          </Text>
          
          {listingDetails.imageLinks.map((_, index) => (
              <ImageLinkInput key={index} index={index} />
          ))}
          
          {/* Button to add more links */}
          <TouchableOpacity style={styles.addButton} onPress={addImageLinkField}>
              <Icon name="plus-circle" size={20} color="#FF9500" solid />
              <Text style={styles.addButtonText}>Add Another Photo Link</Text>
          </TouchableOpacity>
        </FormSection>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Listing</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f2f5' }, // Lighter background
  container: { paddingHorizontal: 16, paddingVertical: 20 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subHeader: { fontSize: 16, color: '#777', marginBottom: 20 },
  
  // --- CARD & SECTION STYLES ---
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2, 

  },
  flatmateCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#28a745',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#007AFF', marginLeft: 5 },
  flatmateSectionTitle: { color: '#28a745' },
  sectionContent: { marginTop: 5 },
  // --- END CARD STYLES ---

  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 5, color: '#333', fontWeight: '600', textTransform: 'uppercase' },
  
  // --- Input Fixes for Multiline ---
  inputWithSuffixContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      backgroundColor: '#fff',
      height: 48, // Default fixed height
  },
  textAreaContainer: {
      height: 'auto', // Override fixed height
      minHeight: 100,
      alignItems: 'flex-start', // Align content to top
      paddingVertical: 0,
  },
  input: { 
    backgroundColor: 'transparent', 
    height: 48, 
    paddingHorizontal: 15, 
    fontSize: 16, 
    borderWidth: 0,
    color: '#333',
    paddingVertical: 0, // Ensure no extra padding
  },
  textArea: { 
    height: 'auto', 
    minHeight: 100, 
    paddingTop: 10, 
    paddingBottom: 10,
    textAlignVertical: 'top', // Crucial for Android text alignment
  },
  inputWithSuffix: {
      flex: 1,
      paddingRight: 5, 
      height: '100%', // Take full container height
  },
  suffixText: {
      fontSize: 16,
      color: '#555',
      paddingRight: 15,
      fontWeight: '600',
  },
  // --- End Input Fixes ---
  
  readOnlyInput: { backgroundColor: '#f0f0f0', color: '#999' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 0 },
  halfInput: { width: '48%' },
  thirdInput: { width: '31%' },
  helperTextBottom: { fontSize: 12, color: '#999', marginTop: 4, marginLeft: 2 },
  
  // Pill Selector Styles (Generic)
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15, marginTop: 5 },
  pillButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#007AFF50', marginRight: 10, marginBottom: 10, backgroundColor: '#f4faff' },
  pillButtonActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  pillButtonText: { color: '#007AFF', fontWeight: '600', fontSize: 14 },
  pillButtonTextActive: { color: '#FFF' },
  
  // Amenities Specific
  amenityPill: { borderColor: '#ccc', backgroundColor: '#f8f8f8' },
  amenityPillActive: { backgroundColor: '#28a745', borderColor: '#28a745' }, 
  amenityText: { color: '#333' },
  amenityTextActive: { color: '#FFF' },
  
  // Furnishing Checkbox Styles
  furnishingCheckboxesContainer: { marginTop: 10, marginBottom: 15, padding: 10, borderWidth: 1, borderColor: '#007AFF30', borderRadius: 8, backgroundColor: '#fafcff' },
  furnishingPill: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      paddingHorizontal: 10, 
      paddingVertical: 5, 
      borderRadius: 15, 
      borderWidth: 1, 
      borderColor: '#ddd',
      marginRight: 8, 
      marginBottom: 8,
      backgroundColor: '#fff',
  },
  furnishingPillActive: { 
      backgroundColor: '#007AFF', 
      borderColor: '#007AFF', 
  },
  furnishingText: { fontSize: 14, color: '#333' },
  furnishingTextActive: { color: '#FFF' },
  furnishingHelpTextContainer: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      padding: 10, 
      backgroundColor: '#FFF3CD', 
      borderRadius: 8, 
      marginBottom: 10 
  },
  furnishingHelpText: { fontSize: 13, color: '#856404', flexShrink: 1 },

  // Checkbox (No Brokerage)
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 15 },
  checkbox: { paddingRight: 10 },
  checkboxLabel: { fontSize: 15, color: '#333', fontWeight: '600' },

  // Image Link Input
  uploadHelperText: { fontSize: 13, color: '#999', marginBottom: 10, fontWeight: '500' },
  imageInputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: '#f9f9f9', borderRadius: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: '#ddd' },
  imageLinkInput: { flex: 1, height: 48, backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 0 },
  addButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, alignSelf: 'flex-start' },
  addButtonText: { color: '#FF9500', fontSize: 16, fontWeight: 'bold', marginLeft: 5 },
  
  // Submit Button
  submitButton: { 
    backgroundColor: '#007AFF', 
    borderRadius: 10, 
    paddingVertical: 16, 
    alignItems: 'center', 
    marginTop: 30, 
    elevation: 5,
 
  },
  submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

export default ListingFormScreen;