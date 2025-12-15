// src/screens/Step9Utility.jsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { COLORS, SUBTLE_SHADOW } from './PropertyCreate.web'; 

// Utility function to merge styles
const mergeStyles = (baseStyles, newStyles) => {
    return Platform.select({
        web: { ...baseStyles, ...newStyles },
        default: { ...baseStyles, ...newStyles },
    });
};

/**
 * Reusable component for adding and displaying Points of Interest (POI)
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
const Step9Utility = ({
    utilityPoints,
    setUtilityPoints,
    isLoading,
    showToast,
    styles,
    distanceUnit,
}) => {

    return (
        <View>
            <Text style={styles.sectionTitle}>9. Proximity: Utility Points</Text>
            <Text style={styles.helperText}>Add the distance and name of nearby utility/leisure points. The distance unit is set in Step 7. (All fields are Optional).</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Utility</Text>
                <ProximityInput 
                    title="Nearest Movie Theatre" poiType="Movie Theatre" 
                    list={utilityPoints} setList={setUtilityPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading} isUtility
                    distanceUnit={distanceUnit}
                />
                <ProximityInput 
                    title="Nearest Club/Bar " poiType="Club/Bar" 
                    list={utilityPoints} setList={setUtilityPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading} isUtility
                    distanceUnit={distanceUnit}
                />
                <ProximityInput 
                    title="Nearest Mall/Mart/Super Market " poiType="Mall/Mart/Super Market" 
                    list={utilityPoints} setList={setUtilityPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading} isUtility
                    distanceUnit={distanceUnit}
                />
                <ProximityInput 
                    title="Nearest Market (Fruit/Vegitable/Cloth/Essential)" poiType="Market" 
                    list={utilityPoints} setList={setUtilityPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading} isUtility
                    distanceUnit={distanceUnit}
                />
                
                {/* 🆕 Additional Utility Points */}
                <ProximityInput 
                    title="Nearest ATM" poiType="ATM" 
                    list={utilityPoints} setList={setUtilityPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading} isUtility
                    distanceUnit={distanceUnit}
                />
                <ProximityInput 
                    title="Nearest Park" poiType="Park" 
                    list={utilityPoints} setList={setUtilityPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading} isUtility
                    distanceUnit={distanceUnit}
                />
                <ProximityInput 
                    title="Nearest Police Station" poiType="Police Station" 
                    list={utilityPoints} setList={setUtilityPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading} isUtility
                    distanceUnit={distanceUnit}
                />
                <ProximityInput 
                    title="Nearest Fire Station" poiType="Fire Station" 
                    list={utilityPoints} setList={setUtilityPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading} isUtility
                    distanceUnit={distanceUnit}
                />
            </View>
        </View>
    );
};

export default Step9Utility;
