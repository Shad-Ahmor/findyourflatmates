// src/components/Step4FurnishingAmenities.jsx

import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { furnishingItems, amenities, availableDates, SUBTLE_SHADOW, COLORS } from './PropertyCreate.web';

const Step4FurnishingAmenities = ({ furnishingType, setFurnishingType, availableDate, setAvailableDate, currentOccupants, setCurrentOccupants, selectedAmenities, handleAmenityToggle, isLoading, styles }) => {
    
    // ✅ NEW: Numeric handler to ensure only numbers are accepted
    const handleNumericChange = (text, setter) => {
        // Strip out all non-numeric characters
        const filteredText = text.replace(/[^0-9]/g, '');
        setter(filteredText);
    };

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
                {/* 🚨 UPDATED: List includes Lift, Gas pipeline, Water connection, Security */}
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
    
    return (
        <>
            <Text style={styles.sectionTitle}>4. Furnishing & Key Amenities</Text>
            
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
                    <TextInput 
                        style={styles.textInput} 
                        placeholder="e.g., 2 (for flatmate search)" 
                        value={currentOccupants} 
                        onChangeText={(text) => handleNumericChange(text, setCurrentOccupants)} // <-- UPDATED to use numeric handler
                        keyboardType="numeric" 
                        editable={!isLoading} 
                    />
                </View>
            </View>
            {renderAmenities()}
        </>
    );
};

export default Step4FurnishingAmenities;