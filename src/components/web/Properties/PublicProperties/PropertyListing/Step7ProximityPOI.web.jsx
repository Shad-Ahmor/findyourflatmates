import React, { useState, useEffect } from 'react'; // useEffect imported
import { View, Text, TextInput, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { COLORS, SUBTLE_SHADOW, DISTANCE_UNITS } from './PropertyCreate.web'; 
// 🚨 NOTE: DISTANCE_UNITS is now imported from ListingFormScreen.web.jsx

// Utility function to merge styles, ensuring web hover/transition properties work
const mergeStyles = (baseStyles, newStyles) => {
    return Platform.select({
        web: { ...baseStyles, ...newStyles },
        default: { ...baseStyles, ...newStyles },
    });
};

/**
 * Global component to select the standard distance unit for all POIs
 */
const DistanceUnitSelector = ({ distanceUnit, setDistanceUnit, styles, isLoading }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>
            Select Standard Distance Unit 
            <Text style={{ color: COLORS.primaryCTA, fontWeight: '900' }}> (Applies to all inputs below)</Text>
        </Text>
        <View style={styles.selectorContainer}>
            {DISTANCE_UNITS.map((unit) => (
                <TouchableOpacity
                    key={unit}
                    style={mergeStyles(
                        styles.selectorButton, 
                        distanceUnit === unit && styles.selectorButtonActive,
                        SUBTLE_SHADOW // Added shadow for better lift
                    )}
                    onPress={() => setDistanceUnit(unit)}
                    disabled={isLoading}
                >
                    <Text style={distanceUnit === unit ? styles.selectorTextActive : styles.selectorText}>
                        {unit}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    </View>
);


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
    isUtility, // Utility fields require Name
    distanceUnit // 🚨 NEW PROP: The globally selected distance unit
}) => {
    // State to manage the input fields specifically for this POI type
    const [name, setName] = useState('');
    const [distanceValue, setDistanceValue] = useState('');
    

    const handleAddPOI = () => {
        const finalName = name.trim();
        const finalDistanceValue = distanceValue.trim();
        
        if (!finalDistanceValue) {
            showToast(`Please enter the numerical Distance for ${title}.`, 'error');
            return;
        }

        // Utility fields require a name
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
        setName(''); // Clear input fields
        setDistanceValue('');
    };
    
    const handleRemovePOI = (pointToRemove) => {
        setList(prev => prev.filter(p => p !== pointToRemove));
    };

    return (
        <View style={styles.proximityInputGroup}>
            <Text style={styles.labelSmall}>{title} <Text style={{ color: COLORS.textLight }}>(Optional)</Text></Text>
            
            <View style={styles.proximityInputRow}>
                {/* POI Name Input */}
                <TextInput 
                    style={mergeStyles(styles.textInput, styles.proximityInputNameGlobalUnit)} 
                    placeholder={isUtility ? "Name (e.g., PVR Phoenix)" : "Name/Type (Optional)"}
                    value={name}
                    onChangeText={setName}
                    editable={!isLoading}
                />
                 {/* Distance Value Input */}
                 <TextInput 
                    style={mergeStyles(styles.textInput, styles.proximityInputDistanceValueGlobal)} 
                    placeholder={`Distance Value (in ${distanceUnit})`} // Display the global unit
                    value={distanceValue}
                    onChangeText={(text) => setDistanceValue(text.replace(/[^0-9.]/g, ''))} // Allow only numbers/dot
                    keyboardType="numeric" 
                    editable={!isLoading}
                />
                
                {/* Display the current unit as static text */}
                <View style={styles.proximityUnitStaticContainer}> 
                    <Text style={styles.proximityUnitStaticText}>{distanceUnit}</Text>
                </View>

                {/* Add Button */}
                <TouchableOpacity 
                    style={mergeStyles(styles.addButtonSmall, SUBTLE_SHADOW)}
                    onPress={handleAddPOI}
                    disabled={isLoading || !distanceValue}
                >
                    <Icon name="add" size={20} color={COLORS.cardBackground} />
                </TouchableOpacity>
            </View>
            
            <View style={styles.imagePreviewContainer}>
                {/* ✅ Filter logic relies on poiType matching the saved type property */}
                {list.filter(p => p.type === poiType).map((point, index) => (
                    // Display combined distance string (e.g., 2 km, 500 meter, 10 min walk)
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
const Step7ProximityPOI = ({
    transitPoints,
    setTransitPoints,
    essentialPoints,
    setEssentialPoints,
    utilityPoints,
    setUtilityPoints,
    isLoading,
    showToast,
    styles,
}) => {
    // 🚨 NEW STATE: Global Distance Unit
    const [distanceUnit, setDistanceUnit] = useState(DISTANCE_UNITS[0]);

    // ✅ NEW EFFECT: Check incoming data and initialize distanceUnit
    useEffect(() => {
        // --- डीबगिंग के लिए कंसोल लॉग: यहाँ आने वाले डेटा को चेक करें ---
        console.log("Step7 Load Status: Transit Points (Length):", transitPoints.length);
        console.log("Step7 Load Status: Essential Points (Length):", essentialPoints.length);
        console.log("Step7 Load Status: Utility Points (Length):", utilityPoints.length);
        
        // --- डिस्टेंस यूनिट को इनिशियलाइज़ करें ---
        const allPoints = [...transitPoints, ...essentialPoints, ...utilityPoints];
        
        if (allPoints.length > 0) {
            const firstDistance = allPoints[0].distance; 
            
            if (typeof firstDistance === 'string') {
                const parts = firstDistance.split(' ');
                // अगर "VALUE UNIT" फॉर्मेट में है और UNIT DISTANCE_UNITS में शामिल है
                if (parts.length === 2 && DISTANCE_UNITS.includes(parts[1])) {
                    setDistanceUnit(parts[1]);
                }
            }
        }
        // यह इफ़ेक्ट तब चलता है जब POI props अपडेट होते हैं
    }, [transitPoints, essentialPoints, utilityPoints]);


    return (
        <View>
            <Text style={styles.sectionTitle}>7. Proximity: Transit, Essentials & Utility</Text>
            <Text style={styles.helperText}>Add the distance and name of nearby points of interest. The distance unit selected below will be applied to all distance inputs. (All fields are Optional).</Text>

            {/* ---------------------------------------------------- */}
            {/* GLOBAL DISTANCE UNIT SELECTOR          */}
            {/* ---------------------------------------------------- */}
            <DistanceUnitSelector 
                distanceUnit={distanceUnit} 
                setDistanceUnit={setDistanceUnit} 
                styles={styles} 
                isLoading={isLoading} 
            />
            
            <View style={styles.divider} /> 

            {/* ---------------------------------------------------- */}
            {/* TRANSIT SECTION                        */}
            {/* ---------------------------------------------------- */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Transit</Text>
                <ProximityInput 
                    title="Nearest Railway Station Distance" poiType="Railway Station" 
                    list={transitPoints} setList={setTransitPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading}
                    distanceUnit={distanceUnit} // 🚨 PASSING GLOBAL UNIT
                />
                <ProximityInput 
                    title="Nearest Airport Distance" poiType="Airport" 
                    list={transitPoints} setList={setTransitPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading}
                    distanceUnit={distanceUnit}
                />
                <ProximityInput 
                    title="Nearest Bus Stop Distance" poiType="Bus Stop" 
                    list={transitPoints} setList={setTransitPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading}
                    distanceUnit={distanceUnit}
                />
                <ProximityInput 
                    title="Nearest Metro Station Distance" poiType="Metro Station" 
                    list={transitPoints} setList={setTransitPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading}
                    distanceUnit={distanceUnit}
                />
                <ProximityInput 
                    title="Nearest Auto Stand Distance" poiType="Auto Stand" 
                    list={transitPoints} setList={setTransitPoints} 
                    showToast={showToast} styles={styles} isLoading={isLoading}
                    distanceUnit={distanceUnit}
                />
            </View>

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
            
            <View style={styles.divider} />
            
            {/* ---------------------------------------------------- */}
            {/* UTILITY SECTION                         */}
            {/* ---------------------------------------------------- */}
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
            </View>
        </View>
    );
};

export default Step7ProximityPOI;