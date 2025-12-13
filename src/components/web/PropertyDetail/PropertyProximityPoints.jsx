// src/components/PropertyDetail/PropertyProximityPoints.jsx

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

/**
 * PropertyProximityPoints Component
 * Displays nearby points using a tabbed interface (WhatsApp Style) with nested dropdowns.
 */
const PropertyProximityPoints = ({ proximityPoints = {}, listingGoalColor, dynamicStyles, colors }) => {
    
    // State to manage the active main tab (Transit, Essential, Utility)
    const [activeTab, setActiveTab] = useState('Transit'); 
    
    // State to manage the active sub-category within the activeTab
    const [activeSubCategory, setActiveSubCategory] = useState(null); 
    
    // Helper function to map detailed names to specific Ionicons
    const getIconForLabel = (label) => {
        // Transit Icons
        if (label.includes('Bus Stop')) return 'bus';
        if (label.includes('Auto Stand')) return 'car-sport';
        if (label.includes('Metro Station')) return 'train';
        if (label.includes('Railway Station')) return 'train-outline';
        if (label.includes('Airport')) return 'airplane';
        
        // Essential Icons
        if (label.includes('Hospital')) return 'heart-circle';
        if (label.includes('School')) return 'school';
        if (label.includes('Food Point')) return 'restaurant';
        if (label.includes('Kirana Stall')) return 'cart';
        if (label.includes('Milk Dairy')) return 'pint';
        if (label.includes('Salon') || label.includes('Barber')) return 'cut';
        if (label.includes('Pharmacy')) return 'medkit';
        
        // Utility Icons
        if (label.includes('Movie Theatre')) return 'film';
        if (label.includes('Club/Bar')) return 'wine';
        if (label.includes('Mall') || label.includes('Super Market')) return 'storefront';
        if (label.includes('Market')) return 'basket';
        if (label.includes('ATM')) return 'card';
        if (label.includes('Park')) return 'leaf';
        if (label.includes('Police')) return 'shield-half';
        if (label.includes('Fire Station')) return 'flame';

        return 'location-outline'; // Default icon
    };


    // Reset active sub-category whenever main tab changes
    const handleTabChange = useCallback((newTabKey) => {
        setActiveTab(newTabKey);
        setActiveSubCategory(null); // Reset sub-category on main tab switch
    }, []);


    // Helper function to map detailed names to the index/key in the 'points' array
    const mapDetailsToPoints = (details, points) => {
        const safePoints = Array.isArray(points) ? points : []; 
        return details.map((label, index) => {
            
            // --- 🔥 FIX START: Extract the distance string from the object ---
            const pointData = safePoints[index];
            let displayValue = 'N/A';
            
            // 🚨 CRITICAL CHECK: If pointData is an object with a 'distance' key, extract the string value.
            if (pointData && typeof pointData === 'object' && pointData.distance) {
                 displayValue = pointData.distance;
            } else if (typeof pointData === 'string') {
                 // Fallback for cases where point is just a distance string
                 displayValue = pointData; 
            }
            // --- 🔥 FIX END ---

            return {
                label: label,
                value: displayValue, // Now guaranteed to be a string (e.g., '1.2km') or 'N/A'
                index: index,
                key: label.replace(/[^a-zA-Z0-9]/g, ''), 
                icon: getIconForLabel(label), // 🔥 ADDED specific icon
            };
        });
    };


    // Data structure for all proximity points 
    const proximityData = [
        { 
            key: 'Transit',
            title: 'Transit', 
            icon: 'bus-outline', 
            points: proximityPoints.transitPoints || [],
            details: [
                'Bus Stop', 
                'Auto Stand', 
                'Metro Station', 
                'Railway Station', 
                'Airport',
            
            ]
        },
        { 
            key: 'Essential',
            title: 'Essential', 
            icon: 'bandage-outline', 
            points: proximityPoints.essentialPoints || [],
            details: [
                'Hospital', 
                'School', 
                'Food Point (Restaurant/Cafe/Tapri)', 
                'Kirana Stall', 
                'Milk Dairy', 
                'Salon/Barber Shop', 
                'Pharmacy' 
            ]
        },
        { 
            key: 'Utility',
            title: 'Utility', 
            icon: 'basket-outline', 
            points: proximityPoints.utilityPoints || [],
            details: [
                'Movie Theatre', 
                'Club/Bar', 
                'Mall/Super Market', 
                'Market (Fruit/Veg/Cloth)', 
                'ATM', 
                'Park',
                'Police Station', 
                'Fire Station'    
            ]
        },
    ];

    const currentTabData = proximityData.find(d => d.key === activeTab);
    
    // allSubCategories now contains objects where 'value' is a string distance
    const allSubCategories = mapDetailsToPoints(currentTabData?.details || [], currentTabData?.points || []);

    const renderSubCategoryList = () => {
        
        if (!currentTabData || currentTabData.details.length === 0) {
            return (
                <View style={dynamicStyles.noDataContainer}>
                    <Text style={[dynamicStyles.descriptionText, { color: colors.text + '60', fontStyle: 'italic', textAlign: 'center' }]}>
                        No category structure defined.
                    </Text>
                </View>
            );
        }

        // --- SUB-CATEGORY LIST RENDERING ---
        return (
            <FlatList
                data={allSubCategories}
                keyExtractor={(item) => item.key}
                scrollEnabled={true} 
                renderItem={({ item }) => {
                    const isActive = activeSubCategory === item.key;
                    
                    return (
                        <View style={dynamicStyles.subCategoryWrapper}>
                            <TouchableOpacity
                                onPress={() => setActiveSubCategory(isActive ? null : item.key)}
                                style={[
                                    dynamicStyles.subCategoryButton,
                                    { 
                                        backgroundColor: isActive ? listingGoalColor + '10' : colors.background, 
                                        borderColor: isActive ? listingGoalColor : colors.border,
                                        borderWidth: 1,
                                    }
                                ]}
                            >
                                {/* 🔥 1. Specific Icon (e.g., bus, school) */}
                                <Icon 
                                    name={item.icon} 
                                    size={dynamicStyles.infoDetailIconSize} 
                                    color={listingGoalColor} 
                                    style={dynamicStyles.subCategoryIcon} // Already has marginRight: 10
                                />
                                
                                {/* 2. Label (e.g., Nearest Bus Stop) */}
                                <Text style={[dynamicStyles.pointLabel, dynamicStyles.subCategoryText, { color: colors.text }]}>
                                    {item.label}
                                </Text>
                                
                                {/* 3. Value (e.g., 2.5km) */}
                                <Text 
                                    style={[
                                        dynamicStyles.pointValue, 
                                        dynamicStyles.subCategoryValue, 
                                        { 
                                            // item.value is now a string ('2.5km' or 'N/A'), preventing the object error
                                            color: item.value === 'N/A' ? colors.secondary : colors.text, 
                                            marginRight: 8, 
                                        }
                                    ]}
                                >
                                    {item.value}
                                </Text>
                                
                                {/* 🔥 4. Dropdown Indicator (e.g., chevron-forward/down) */}
                                <Icon 
                                    name={isActive ? "chevron-down-outline" : "chevron-forward-outline"} 
                                    size={dynamicStyles.infoDetailIconSize * 0.8} 
                                    color={colors.text + '80'} 
                                />
                            </TouchableOpacity>
                            
                            {/* DROPDOWN CONTENT (Only shows when isActive is true) */}
                            {isActive && (
                                <View style={[dynamicStyles.subCategoryContent, { backgroundColor: colors.background }]}>
                                    <Text style={[dynamicStyles.descriptionText, { color: colors.text + '80', fontWeight: 'bold' }]}>
                                        Distance: {item.value}
                                    </Text>
                                    <Text style={[dynamicStyles.descriptionText, { color: colors.text + '60', marginTop: 5, fontSize: 13 }]}>
                                        This is the distance to the nearest available {item.label.toLowerCase().replace(/nearest /g, '')} point.
                                    </Text>
                                </View>
                            )}
                        </View>
                    );
                }}
            />
        );
    };

    return (
        <View style={[dynamicStyles.section, dynamicStyles.cardStyle, { backgroundColor: colors.card, ...dynamicStyles.getWebShadow(dynamicStyles.DEEP_SOFT_SHADOW) }]}>
            <Text style={[dynamicStyles.sectionTitle, dynamicStyles.infoSectionTitle, { color: colors.text }]}>Nearby Proximity Points 📍</Text>
            
            {/* 1. Tabs Navigation (WhatsApp Style) */}
            <View style={dynamicStyles.proximityTabContainer}>
                {proximityData.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => handleTabChange(tab.key)} 
                        style={[
                            dynamicStyles.proximityTab,
                            { 
                                borderBottomColor: activeTab === tab.key ? listingGoalColor : colors.border,
                                borderBottomWidth: activeTab === tab.key ? 3 : 1,
                            }
                        ]}
                    >
                        <Icon 
                            name={tab.icon} 
                            size={dynamicStyles.infoDetailIconSize} 
                            color={activeTab === tab.key ? listingGoalColor : colors.text + '80'} 
                        />
                        <Text 
                            style={[
                                dynamicStyles.proximityTabText, 
                                { 
                                    color: activeTab === tab.key ? listingGoalColor : colors.text,
                                    fontWeight: activeTab === tab.key ? '800' : '600'
                                }
                            ]}
                        >
                            {tab.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 2. Content Area - Renders the Sub-Category List */}
            <View style={[dynamicStyles.proximityContentArea, { 
                backgroundColor: colors.background, 
                borderColor: colors.border, 
                padding: dynamicStyles.cardStyle.padding || 20, 
            }]}>
                {renderSubCategoryList()}
            </View>

        </View>
    );
};

export default PropertyProximityPoints;