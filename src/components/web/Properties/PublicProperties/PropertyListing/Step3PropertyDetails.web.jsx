// src/components/Step3PropertyDetails.jsx

import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { ownershipTypes, facingOptions, parkingOptions, flooringTypes, SUBTLE_SHADOW, COLORS } from './PropertyCreate.web';

const Step3PropertyDetails = ({ 
    buildingAge, setBuildingAge, 
    ownershipType, setOwnershipType, 
    maintenanceCharges, setMaintenanceCharges, 
    facing, setFacing, 
    parking, setParking, 
    gatedSecurity, setGatedSecurity, 
    flooringType, handleFlooringToggle, 
    nearbyLocation, setNearbyLocation, 
    isLoading, styles 
}) => {
    
    // ✅ NEW: Numeric handler to ensure only numbers are accepted
    const handleNumericChange = (text, setter) => {
        // Strip out all non-numeric characters
        const filteredText = text.replace(/[^0-9]/g, '');
        setter(filteredText);
    };

    const renderFlooringSelector = () => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Flooring Type (Select all applicable)</Text>
            <View style={styles.amenityContainer}>
                {flooringTypes.map(floor => (
                    <TouchableOpacity
                        key={floor}
                        style={[
                            styles.toggleButton,
                            // Flooring uses secondaryTeal for active state for variety
                            flooringType.includes(floor) ? {backgroundColor: COLORS.secondaryTeal, borderColor: COLORS.secondaryTeal, ...SUBTLE_SHADOW} : {},
                        ]}
                        onPress={() => handleFlooringToggle(floor)}
                        disabled={isLoading}
                    >
                        <Icon 
                            name={flooringType.includes(floor) ? 'checkmark-circle' : 'square-outline'} 
                            size={18} 
                            color={flooringType.includes(floor) ? COLORS.cardBackground : COLORS.textDark} 
                            style={{ marginRight: 5 }}
                        />
                        <Text style={flooringType.includes(floor) ? styles.toggleTextActive : styles.toggleText}>
                            {floor}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderOwnershipSelector = () => (
        <View style={styles.inputGroup}>
            <Text style={styles.labelSmall}>Ownership Type</Text>
            <View style={styles.selectorContainer}>
                {ownershipTypes.map(type => (
                    <TouchableOpacity 
                        key={type} 
                        style={[
                            styles.selectorButtonSmall, 
                            ownershipType === type && styles.selectorButtonActive,
                            SUBTLE_SHADOW
                        ]} 
                        onPress={() => setOwnershipType(type)}
                        disabled={isLoading}
                    >
                        <Text style={ownershipType === type ? styles.selectorTextActive : styles.selectorText}>{type}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
    
    return (
        <>
            <Text style={styles.sectionTitle}>3. Property Details</Text>
            
            <View style={styles.inputRow}>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.label}>Age of Building (Years)</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder="e.g., 5" 
                        value={buildingAge} 
                        onChangeText={(text) => handleNumericChange(text, setBuildingAge)} // <-- UPDATED to use numeric handler
                        keyboardType="numeric" 
                        editable={!isLoading} 
                    />
                </View>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.label}>Maintenance Charges (₹/Month)</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder="e.g., 2000 (0 if none)" 
                        value={maintenanceCharges} 
                        onChangeText={(text) => handleNumericChange(text, setMaintenanceCharges)} // <-- UPDATED to use numeric handler
                        keyboardType="numeric" 
                        editable={!isLoading} 
                    />
                </View>
            </View>
            
            {renderOwnershipSelector()}
            
            <View style={styles.inputRow}>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.labelSmall}>Facing (Property Direction)</Text>
                    <View style={styles.selectorContainerSmall}>
                        {facingOptions.map(f => (
                            <TouchableOpacity 
                                key={f} 
                                style={[styles.selectorButtonTiny, facing === f && styles.selectorButtonActive, SUBTLE_SHADOW]} 
                                onPress={() => setFacing(f)}
                                disabled={isLoading}
                            >
                                <Text style={facing === f ? styles.selectorTextActive : styles.selectorText}>{f}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.labelSmall}>Parking Availability</Text>
                    <View style={styles.selectorContainerSmall}>
                        {parkingOptions.map(p => (
                            <TouchableOpacity 
                                key={p} 
                                style={[styles.selectorButtonTiny, parking === p && styles.selectorButtonActive, SUBTLE_SHADOW]} 
                                onPress={() => setParking(p)}
                                disabled={isLoading}
                            >
                                <Text style={parking === p ? styles.selectorTextActive : styles.selectorText}>{p}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
            
            {/* Gated Security Toggle & Nearby Location */}
            <View style={styles.inputRow}>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.labelSmall}>Gated Security</Text>
                    <TouchableOpacity
                        style={[styles.toggleButtonFull, gatedSecurity && styles.toggleButtonActive, SUBTLE_SHADOW]} 
                        onPress={() => setGatedSecurity(prev => !prev)}
                        disabled={isLoading}
                    >
                        <Icon name={gatedSecurity ? 'lock-closed' : 'lock-open-outline'} size={20} color={gatedSecurity ? COLORS.cardBackground : COLORS.textDark} style={{ marginRight: 8 }} />
                        <Text style={gatedSecurity ? styles.toggleTextActive : styles.toggleText}>
                            {gatedSecurity ? 'Yes' : 'No'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.labelSmall}>Nearby Location (Landmark/Station)</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder="e.g., Metro Station, Hospital" 
                        value={nearbyLocation} 
                        onChangeText={setNearbyLocation} 
                        editable={!isLoading} 
                    />
                </View>
            </View>

            {renderFlooringSelector()}
        </>
    );
};

export default Step3PropertyDetails;