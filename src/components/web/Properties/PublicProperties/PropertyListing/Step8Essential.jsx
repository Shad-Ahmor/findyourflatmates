// src/screens/Step8Essential.jsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { COLORS, SUBTLE_SHADOW } from './PropertyCreate.web'; 

// Utility function to merge styles, ensuring web hover/transition properties work
const mergeStyles = (baseStyles, newStyles) => {
    return Platform.select({
        web: { ...baseStyles, ...newStyles },
        default: { ...baseStyles, ...newStyles },
    });
};

/**
 * Reusable component for adding and displaying Points of Interest (POI)
 * (Copied from Step7Transit for self-containment)
 */
const ProximityInput = ({
    title,
    poiType,
    list,
    setList,
    showToast,
    styles,
    isLoading,
    isUtility, 
    distanceUnit 
}) => {
    const [name, setName] = useState('');
    const [distanceValue, setDistanceValue] = useState('');
    
    // 🔥 AUTO COMMIT FUNCTION
    const commitPOIIfValid = () => {
        const finalName = name.trim();
        const finalDistanceValue = distanceValue.trim();

        if (!finalDistanceValue && !finalName) return; // Don’t add empty

        if (!finalDistanceValue) {
            showToast(`Please enter the numerical Distance for ${title}.`, 'error');
            return;
        }

        if (isUtility && !finalName) {
            showToast(`Please enter the Name for ${title} (e.g., PVR Phoenix).`, 'error');
            return;
        }

        const newPoint = { 
            type: poiType, 
            name: finalName || (isUtility ? title : poiType), 
            distance: `${finalDistanceValue} ${distanceUnit}`, 
        };
        
        setList(prev => [...prev, newPoint]);
        setName('');
        setDistanceValue('');
    }

    const handleAddPOI = () => {
        commitPOIIfValid(); // Manual add button
    }
    
    const handleRemovePOI = (pointToRemove) => {
        setList(prev => prev.filter(p => p !== pointToRemove));
    };

    return (
        <View style={styles.proximityInputGroup}>
            <Text style={styles.labelSmall}>{title} <Text style={{ color: COLORS.textLight }}>(Optional)</Text></Text>
            
            <View style={styles.proximityInputRow}>
                <TextInput 
                    style={mergeStyles(styles.textInput, styles.proximityInputNameGlobalUnit)} 
                    placeholder={isUtility ? "Name (e.g., PVR Phoenix)" : "Name/Type (Optional)"}
                    value={name}
                    onChangeText={setName}
                    onBlur={commitPOIIfValid} // 🔥 AUTO ADD on blur
                    editable={!isLoading}
                />
                 <TextInput 
                    style={mergeStyles(styles.textInput, styles.proximityInputDistanceValueGlobal)} 
                    placeholder={`Distance Value (in ${distanceUnit})`}
                    value={distanceValue}
                    onChangeText={(text) => setDistanceValue(text.replace(/[^0-9.]/g, ''))}
                    keyboardType="numeric" 
                    onBlur={commitPOIIfValid} // 🔥 AUTO ADD on blur
                    editable={!isLoading}
                />
                
                <View style={styles.proximityUnitStaticContainer}> 
                    <Text style={styles.proximityUnitStaticText}>{distanceUnit}</Text>
                </View>

                <TouchableOpacity 
                    style={mergeStyles(styles.addButtonSmall, SUBTLE_SHADOW)}
                    onPress={handleAddPOI} // Manual add
                    disabled={isLoading || !distanceValue}
                >
                    <Icon name="add" size={20} color={COLORS.cardBackground} />
                </TouchableOpacity>
            </View>
            
            <View style={styles.imagePreviewContainer}>
                {list.filter(p => p.type === poiType).map((point, index) => (
                    <View key={index} style={mergeStyles(styles.imagePill, SUBTLE_SHADOW, { minWidth: 150, backgroundColor: COLORS.secondaryTeal + '10' })}>
                        <Text style={styles.imageText} numberOfLines={1}>
                            {point.name}: {point.distance} 
                        </Text>
                        <TouchableOpacity onPress={() => handleRemovePOI(point)}>
                            <Icon name="close-circle" size={20} color={COLORS.errorRed} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
}

// Main Step Component
const Step8Essential = ({
    essentialPoints,
    setEssentialPoints,
    isLoading,
    showToast,
    styles,
    // Global State Prop
    distanceUnit,
}) => {

    return (
        <View>
            <Text style={styles.sectionTitle}>8. Proximity: Essential Points</Text>
            <Text style={styles.helperText}>Add the distance and name of nearby essential services. The distance unit is set in the previous step. (All fields are Optional).</Text>
            
            <View style={styles.divider} /> 

            {/* ---------------------------------------------------- */}
            {/* ESSENTIALS SECTION                      */}
            {/* ---------------------------------------------------- */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Essentials</Text>
                <ProximityInput 
                    title="Nearest Hospital" poiType="Hospital" 
                    list={essentialPoints} setList={setEssentialPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading}
                    distanceUnit={distanceUnit}
                />
                <ProximityInput 
                    title="Nearest School" poiType="School" 
                    list={essentialPoints} setList={setEssentialPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading}
                    distanceUnit={distanceUnit}
                />
                <ProximityInput 
                    title="Nearest Food Point (Restaurant/Mess/Cafe/Tea tapri)" poiType="Food Point" 
                    list={essentialPoints} setList={setEssentialPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading}
                    distanceUnit={distanceUnit}
                />
                <ProximityInput 
                    title="Nearest Kirana Stall" poiType="Kirana Stall" 
                    list={essentialPoints} setList={setEssentialPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading}
                    distanceUnit={distanceUnit}
                />
                <ProximityInput 
                    title="Nearest Milk Dairy" poiType="Milk Dairy" 
                    list={essentialPoints} setList={setEssentialPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading}
                    distanceUnit={distanceUnit}
                />
                <ProximityInput 
                    title="Nearest Salon/Barber Shop" poiType="Salon/Barber Shop" 
                    list={essentialPoints} setList={setEssentialPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading}
                    distanceUnit={distanceUnit}
                />
            </View>
        </View>
    );
};

export default Step8Essential;
