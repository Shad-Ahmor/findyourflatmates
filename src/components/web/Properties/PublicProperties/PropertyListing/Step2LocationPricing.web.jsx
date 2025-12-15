// src/components/Step2LocationPricing.web.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { propertySizes, SUBTLE_SHADOW, COLORS, TOP_INDIAN_CITIES } from './PropertyCreate.web'; 

// 💡 NEW: डेटा फ़ाइल से आयात करें (कृपया path को अपनी फ़ाइल संरचना के अनुसार सुनिश्चित करें)
import { INDIAN_STATES_AND_DISTRICTS, ALL_INDIAN_STATES } from '../../../../../data/indian_districts_data'; 
// यदि indian_districts_data.js, Step2LocationPricing.jsx के समान फोल्डर में है, तो:
// import { INDIAN_STATES_AND_DISTRICTS, ALL_INDIAN_STATES } from './indian_districts_data';


// --- MOCK DATA RETAINED (Only if needed for initial loading/placeholders) ---
// Note: Location detection mocks are removed.

const MOCK_LOCATION_PLACEHOLDERS = {
    flatNumber: "A-102",
    area: "Linking Road, Bandra (W)",
    city: "Mumbai",
    pincode: "400050",
    state: "Maharashtra",
    district: "Mumbai Suburban",
};


// --- Removed OpenStreetMapEmbed Component ---


const Step2LocationPricing = ({ 
    goal, city, setCity, area, setArea, 
    rent, setRent, deposit, setDeposit, 
    bedrooms, setBedrooms, bathrooms, setBathrooms, 
    isLoading, styles, showToast,
    // NEW PROPS ADDED:
    pincode, setPincode, 
    flatNumber, setFlatNumber, 
    stateName, setStateName, 
    districtName, setDistrictName
}) => {
    
    // 💡 UPDATED STATE FOR MODALS/DROPDOWNS
    const [isStateModalVisible, setIsStateModalVisible] = useState(false); 
    const [modalStateSearch, setModalStateSearch] = useState(''); 
    const [isDistrictModalVisible, setIsDistrictModalVisible] = useState(false); 
    const [modalDistrictSearch, setModalDistrictSearch] = useState(''); 
    
    // 💡 CITY MODAL STATE
    const [isCityModalVisible, setIsCityModalVisible] = useState(false); 
    const [modalCitySearch, setModalCitySearch] = useState(''); 
    
    const [bathroomError, setBathroomError] = useState('');


    const handleNumericChange = (text, setter, fieldName) => {
        const filteredText = text.replace(/[^0-9]/g, '');
        let numberValue = Number(filteredText);
        
        if (fieldName === 'bathrooms') {
            if (numberValue > 20) {
                setter('20'); 
                setBathroomError("Maximum 20 bathrooms are allowed.");
                return;
            } else {
                setBathroomError('');
            }
        }
        
        // Handle maximum length for Pincode
        if (fieldName === 'pincode' && filteredText.length > 6) {
            setter(filteredText.substring(0, 6));
            return;
        }

        setter(filteredText);
    };
    
    const handleLocateArea = () => {
        // Since auto-detection is removed, this function can just be a placeholder 
        // or trigger a toast if it's supposed to do something else (like searching).
        showToast("Locate Area feature is disabled for manual entry mode.", 'warning');
    };
    
    // 💡 State Selector: State चुनने पर District/City को रीसेट करता है और District Modal खोलता है।
    const handleSelectStateInModal = (selectedState) => {
        setStateName(selectedState);
        setDistrictName(''); 
        setCity(''); 
        setIsStateModalVisible(false);
        setModalStateSearch(''); 
        
        setTimeout(() => {
            setIsDistrictModalVisible(true);
            setModalDistrictSearch('');
        }, 300);
    };

    // 💡 District Selector: District चुनने पर City को रीसेट करता है और City Modal खोलता है।
    const handleSelectDistrictInModal = (selectedDistrict) => {
        setDistrictName(selectedDistrict);
        setCity(''); 
        setIsDistrictModalVisible(false);
        setModalDistrictSearch('');

        setTimeout(() => {
            setIsCityModalVisible(true);
            setModalCitySearch('');
        }, 300);
    };
    
    // 💡 City Selector: City चुनता है और Modal बंद करता है।
    const handleSelectCityInModal = (selectedCity) => {
        setCity(selectedCity);
        setIsCityModalVisible(false);
        setModalCitySearch('');
    };


    // =================================================================
    // 🎨 RENDER FUNCTIONS
    // =================================================================

    // ✅ RENDER STATE SELECTOR (Modal Opener)
    const renderStateSelector = () => (
        <View style={styles.inputGroup} >
            <Text style={styles.label}>State</Text>
            
            <TouchableOpacity 
                style={[
                    styles.textInput, 
                    { 
                        justifyContent: 'center', 
                        height: 55, 
                        paddingHorizontal: 15,
                        borderColor: stateName ? COLORS.primary : COLORS.borderLight, 
                        borderWidth: 1,
                    }
                ]} 
                onPress={() => {
                    if (!isLoading) {
                        setIsStateModalVisible(true);
                        setModalStateSearch(stateName || ''); 
                    }
                }}
                disabled={isLoading}
            >
                <Text style={{ 
                    color: stateName ? COLORS.textDark : COLORS.textLight,
                    fontSize: 16, 
                }}>
                    {stateName || "Select State (e.g., Maharashtra)"}
                </Text>
            </TouchableOpacity>

        </View>
    );

    // ✅ RENDER DISTRICT SELECTOR (Modal Opener)
    const renderDistrictSelector = () => (
        <View style={styles.inputGroup} >
            <Text style={styles.label}>District</Text>
            
            <TouchableOpacity 
                style={[
                    styles.textInput, 
                    { 
                        justifyContent: 'center', 
                        height: 55, 
                        paddingHorizontal: 15,
                        borderColor: districtName ? COLORS.primary : COLORS.borderLight,
                        borderWidth: 1,
                        backgroundColor: stateName ? COLORS.cardBackground : COLORS.backgroundLight,
                    }
                ]} 
                onPress={() => {
                    if (!isLoading && stateName) { 
                        setIsDistrictModalVisible(true);
                        setModalDistrictSearch(districtName || ''); 
                    } else if (!stateName) {
                        showToast("Please select a State first.", 'warning');
                    }
                }}
                disabled={isLoading || !stateName}
            >
                <Text style={{ 
                    color: districtName ? COLORS.textDark : (stateName ? COLORS.textLight : COLORS.textDark),
                    fontSize: 16, 
                    opacity: stateName ? 1 : 0.6
                }}>
                    {districtName || (stateName ? `Select District in ${stateName}` : "Select State first")}
                </Text>
            </TouchableOpacity>
        </View>
    );

    // ✅ RENDER CITY SELECTOR (Uses TouchableOpacity to open Modal)
    const renderCitySelector = () => (
        <View style={styles.inputGroup} >
            <Text style={styles.label}>City</Text>
            
            <TouchableOpacity 
                style={[
                    styles.textInput, 
                    { 
                        justifyContent: 'center', 
                        height: 55, 
                        paddingHorizontal: 15,
                        borderColor: city ? COLORS.primary : COLORS.borderLight, 
                        borderWidth: 1,
                        backgroundColor: districtName ? COLORS.cardBackground : COLORS.backgroundLight,
                    }
                ]} 
                onPress={() => {
                    if (!isLoading && districtName) {
                        setIsCityModalVisible(true);
                        setModalCitySearch(city || ''); 
                    } else if (!districtName) {
                        showToast("Please select a District first.", 'warning');
                    }
                }}
                disabled={isLoading || !districtName}
            >
                <Text style={{ 
                    color: city ? COLORS.textDark : (districtName ? COLORS.textLight : COLORS.textDark),
                    fontSize: 16, 
                    opacity: districtName ? 1 : 0.6
                }}>
                    {city || (districtName ? `Select City in ${districtName}` : "Select District first")}
                </Text>
            </TouchableOpacity>

        </View>
    );

    const renderAreaInput = () => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Area/Locality (Street & Nearby Location)</Text>
            <View style={styles.areaInputRow}> 
                <TextInput 
                    style={[styles.textInput, { flex: 1, height: 55 }]} 
                    placeholder="e.g., SV Road, Near National College" 
                    value={area} 
                    onChangeText={setArea} 
                    editable={!isLoading} 
                />
          
            </View>
            <Text style={styles.helperText}>Enter the full street name and nearby landmark/location.</Text>
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
                    <Text style={styles.labelSmall}>Bathrooms (Max 20)</Text>
                    <TextInput 
                        style={[styles.textInput, bathroomError && { borderColor: COLORS.errorRed, borderWidth: 2 }]} 
                        value={bathrooms}
                        onChangeText={(text) => handleNumericChange(text, setBathrooms, 'bathrooms')} 
                        keyboardType="numeric"
                        placeholder="e.g., 2"
                        maxLength={2}
                        editable={!isLoading}
                    />
                    {bathroomError ? (
                        <Text style={styles.errorText}>{bathroomError}</Text>
                    ) : (
                           <Text style={styles.helperText}>Enter the total number of bathrooms.</Text>
                    )}
                </View>
            </View>
        </View>
    );
    
    // ✅ RENDER STATE SELECTION MODAL
    const renderStateModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isStateModalVisible}
            onRequestClose={() => setIsStateModalVisible(false)}
        >
            <View style={styles.mapModalCenteredView}>
                <View style={[styles.mapModalView, { maxWidth: 450, maxHeight: '80%' }]}>
                    <Text style={styles.mapModalTitle}>Select State</Text>
                    
                    <TextInput
                        style={[styles.textInput, { marginBottom: 15, width: '100%', borderColor: COLORS.primary }]}
                        placeholder="Search State..."
                        value={modalStateSearch}
                        onChangeText={setModalStateSearch}
                        autoFocus={true}
                    />
                    
                    <ScrollView style={{ width: '100%', maxHeight: 300, paddingRight: 5, marginBottom: 15 }}>
                        {(ALL_INDIAN_STATES ?? [])
                            .filter(s => s.toLowerCase().includes(modalStateSearch.toLowerCase()))
                            .map(s => (
                                <TouchableOpacity
                                    key={s}
                                    style={[
                                        styles.cityDropdownItem, 
                                        s === stateName && { backgroundColor: COLORS.primaryLight + '30', borderColor: COLORS.primary, borderWidth: 1 }
                                    ]}
                                    onPress={() => handleSelectStateInModal(s)}
                                >
                                    <Text style={[styles.cityDropdownItemText, { fontWeight: s === stateName ? 'bold' : 'normal' }]}>{s}</Text>
                                    {s === stateName && <Icon name="checkmark-circle" size={20} color={COLORS.primary} />}
                                </TouchableOpacity>
                            ))}
                    </ScrollView>
                    
                    <TouchableOpacity
                        style={{ marginTop: 10 }}
                        onPress={() => setIsStateModalVisible(false)}
                    >
                        <Text style={{ color: COLORS.errorRed, fontWeight: '700' }}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    // ✅ RENDER DISTRICT SELECTION MODAL
    const renderDistrictModal = () => {
        const districtsArray = Object.keys(INDIAN_STATES_AND_DISTRICTS[stateName] || {});
        
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isDistrictModalVisible}
                onRequestClose={() => setIsDistrictModalVisible(false)}
            >
                <View style={styles.mapModalCenteredView}>
                    <View style={[styles.mapModalView, { maxWidth: 450, maxHeight: '80%' }]}>
                        <Text style={styles.mapModalTitle}>Select District in {stateName || 'State'}</Text>
                        
                        <TextInput
                            style={[styles.textInput, { marginBottom: 15, width: '100%', borderColor: COLORS.primary }]}
                            placeholder="Search District..."
                            value={modalDistrictSearch}
                            onChangeText={setModalDistrictSearch}
                            autoFocus={true}
                        />
                        
                        <ScrollView style={{ width: '100%', maxHeight: 300, paddingRight: 5, marginBottom: 15 }}>
                            {(districtsArray ?? [])
                                .filter(d => d.toLowerCase().includes(modalDistrictSearch.toLowerCase()))
                                .map(d => (
                                    <TouchableOpacity
                                        key={d}
                                        style={[
                                            styles.cityDropdownItem, 
                                            d === districtName && { backgroundColor: COLORS.primaryLight + '30', borderColor: COLORS.primary, borderWidth: 1 }
                                        ]}
                                        onPress={() => handleSelectDistrictInModal(d)}
                                    >
                                        <Text style={[styles.cityDropdownItemText, { fontWeight: d === districtName ? 'bold' : 'normal' }]}>{d}</Text>
                                        {d === districtName && <Icon name="checkmark-circle" size={20} color={COLORS.primary} />}
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>
                        
                        <TouchableOpacity
                            style={{ marginTop: 10 }}
                            onPress={() => setIsDistrictModalVisible(false)}
                        >
                            <Text style={{ color: COLORS.errorRed, fontWeight: '700' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };
    
    // ✅ RENDER CITY SELECTION MODAL
    const renderCityModal = () => {
        const districtsInState = INDIAN_STATES_AND_DISTRICTS[stateName] || {};
        const cities = districtsInState[districtName] || [];
        
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isCityModalVisible}
                onRequestClose={() => setIsCityModalVisible(false)}
            >
                <View style={styles.mapModalCenteredView}>
                    <View style={[styles.mapModalView, { maxWidth: 450, maxHeight: '80%' }]}>
                        <Text style={styles.mapModalTitle}>Select City in {districtName || 'District'}</Text>
                        
                        <TextInput
                            style={[styles.textInput, { marginBottom: 15, width: '100%', borderColor: COLORS.primary }]}
                            placeholder="Search City..."
                            value={modalCitySearch}
                            onChangeText={setModalCitySearch}
                            autoFocus={true}
                        />
                        
                        <ScrollView style={{ width: '100%', maxHeight: 300, paddingRight: 5, marginBottom: 15 }}>
                            {(cities ?? [])
                                .filter(c => c.toLowerCase().includes(modalCitySearch.toLowerCase()))
                                .map(c => (
                                    <TouchableOpacity
                                        key={c}
                                        style={[
                                            styles.cityDropdownItem, 
                                            c === city && { backgroundColor: COLORS.primaryLight + '30', borderColor: COLORS.primary, borderWidth: 1 }
                                        ]}
                                        onPress={() => handleSelectCityInModal(c)}
                                    >
                                        <Text style={[styles.cityDropdownItemText, { fontWeight: c === city ? 'bold' : 'normal' }]}>{c}</Text>
                                        {c === city && <Icon name="checkmark-circle" size={20} color={COLORS.primary} />}
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>
                        
                        <TouchableOpacity
                            style={{ marginTop: 10 }}
                            onPress={() => setIsCityModalVisible(false)}
                        >
                            <Text style={{ color: COLORS.errorRed, fontWeight: '700' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };


    // =================================================================
    // 🎨 MAIN RETURN
    // =================================================================
    return (
        <>
            <Text style={styles.sectionTitle}>2. Location & Pricing</Text>
            
            {/* Flat/House Number Input */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Flat / House Number</Text>
                <TextInput 
                    style={styles.textInput} 
                    placeholder="e.g., A-102" 
                    value={flatNumber} 
                    onChangeText={setFlatNumber} 
                    editable={!isLoading} 
                />
            </View>
            
            {/* Area/Locality Input (Modified) */}
            {renderAreaInput()} 
            
            <View style={styles.inputRow}>
                {/* State Selector */}
                <View style={[styles.inputHalf]}>
                    {renderStateSelector()} 
                </View>
                {/* District Selector */}
                <View style={[styles.inputHalf]}>
                    {renderDistrictSelector()} 
                </View>
            </View>

            <View style={styles.inputRow}>
                {/* City Selector */}
                <View style={[styles.inputHalf]}>
                    {renderCitySelector()} 
                </View>
                {/* Pincode Input (Modified) */}
                <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.label}>Pincode</Text>
                    
                    <TextInput 
                        style={[styles.textInput, { height: 55 }]} 
                        placeholder="e.g., 400050" 
                        value={pincode} 
                        onChangeText={(text) => handleNumericChange(text, setPincode, 'pincode')} 
                        keyboardType="numeric" 
                        maxLength={6}
                        editable={!isLoading} 
                    />
                    <Text style={styles.helperText}>Enter the Pincode manually.</Text>
                </View>
            </View>
            
            <View style={styles.inputRow}>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.label}>{goal === 'Sale' ? 'Sale Price (₹)' : 'Monthly Rent (₹)'}</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder="e.g., 45000" 
                        value={rent} 
                        onChangeText={(text) => handleNumericChange(text, setRent, 'rent')} 
                        keyboardType="numeric" 
                        editable={!isLoading} 
                    />
                </View>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.label}>Security Deposit (₹)</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder="e.g., 150000" 
                        value={deposit} 
                        onChangeText={(text) => handleNumericChange(text, setDeposit, 'deposit')} 
                        keyboardType="numeric" 
                        editable={!isLoading} 
                    />
                </View>
            </View>
            {renderPropertyDetails()}
            
            {/* Display the modals */}
            {/* ❌ Removed: renderMapModal() */}
            {renderStateModal()}
            {renderDistrictModal()}
            {renderCityModal()}
        </>
    );
};

export default Step2LocationPricing;