// src/components/PropertyDetail/PropertyProximityPoints.jsx

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform, LayoutAnimation, UIManager } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Helper function to extract numerical distance and unit for comparison
const parseDistance = (distanceString) => {
    if (typeof distanceString !== 'string') return { value: Infinity, unit: '' };
    const parts = distanceString.match(/(\d+\.?\d*)\s*(\w+)/);
    if (parts) {
        return { value: parseFloat(parts[1]), unit: parts[2] };
    }
    return { value: Infinity, unit: '' };
};

/**
 * PropertyProximityPoints Component
 * Displays nearby points using a tabbed interface (WhatsApp Style) with nested dropdowns.
 */
const PropertyProximityPoints = ({ proximityPoints = {}, listingGoalColor, dynamicStyles, colors }) => {
    
    const [activeTab, setActiveTab] = useState('Transit'); 
    const [activePOIType, setActivePOIType] = useState(null); 
    
    // --- ICON MAPPING (Kept same for consistency) ---
    const getIconForLabel = (label) => {
        // ... (Icon logic remains the same) ...
        // Transit Icons
        if (label.includes('Bus Stop')) return 'bus';
        if (label.includes('Auto Stand')) return 'car-sport';
        if (label.includes('Metro Station')) return 'train';
        if (label.includes('Railway Station')) return 'train-outline';
        if (label.includes('Airport')) return 'airplane';
        
        // Essential Icons
        if (label.includes('Hospital') || label.includes('Pharmacy') || label.includes('Medkit')) return 'medkit';
        if (label.includes('School')) return 'school';
        if (label.includes('Food Point') || label.includes('Restaurant') || label.includes('Cafe')) return 'restaurant';
        if (label.includes('Kirana Stall') || label.includes('Super Market')) return 'storefront';
        if (label.includes('Milk Dairy')) return 'pint';
        if (label.includes('Salon') || label.includes('Barber')) return 'cut';
        
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

    const proximityCategories = useMemo(() => ([
        // ... (Category data remains the same) ...
        { 
            key: 'Transit', title: 'Transit', icon: 'bus-outline', pointsKey: 'transitPoints',
            poiTypes: ['Railway Station', 'Airport', 'Bus Stop', 'Metro Station', 'Auto Stand'],
            displayNames: { 'Railway Station': 'Nearest Railway Station', 'Airport': 'Nearest Airport', 'Bus Stop': 'Nearest Bus Stop', 'Metro Station': 'Nearest Metro Station', 'Auto Stand': 'Nearest Auto Stand' }
        },
        { 
            key: 'Essential', title: 'Essential', icon: 'bandage-outline', pointsKey: 'essentialPoints',
            poiTypes: ['Hospital', 'School', 'Food Point', 'Kirana Stall', 'Milk Dairy', 'Salon/Barber Shop', 'Pharmacy'],
            displayNames: { 'Hospital': 'Nearest Hospital', 'School': 'Nearest School', 'Food Point': 'Nearest Food Point', 'Kirana Stall': 'Nearest Kirana Stall', 'Milk Dairy': 'Nearest Milk Dairy', 'Salon/Barber Shop': 'Nearest Salon/Barber Shop', 'Pharmacy': 'Nearest Pharmacy' }
        },
        { 
            key: 'Utility', title: 'Utility', icon: 'basket-outline', pointsKey: 'utilityPoints',
            poiTypes: ['Movie Theatre', 'Club/Bar', 'Mall/Mart/Super Market', 'Market', 'ATM', 'Park', 'Police Station', 'Fire Station'],
             displayNames: { 'Movie Theatre': 'Nearest Movie Theatre', 'Club/Bar': 'Nearest Club/Bar', 'Mall/Mart/Super Market': 'Nearest Mall/Mart/Super Market', 'Market': 'Nearest Market', 'ATM': 'Nearest ATM', 'Park': 'Nearest Park', 'Police Station': 'Nearest Police Station', 'Fire Station': 'Nearest Fire Station', }
        },
    ]), []);

    const currentCategory = proximityCategories.find(d => d.key === activeTab);
    
    const handleTabChange = useCallback((newTabKey) => {
        // ✅ ADD ANIMATION: Smooth transition when switching tabs
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveTab(newTabKey);
        setActivePOIType(null); 
    }, []);

    // ----------------------------------------------------
    // Grouping, Sorting, and Summarizing Logic (Unchanged)
    // ----------------------------------------------------
    const groupedPoints = useMemo(() => {
        if (!currentCategory) return [];

        const rawPoints = proximityPoints[currentCategory.pointsKey] || [];
        const groups = {};
        
        rawPoints.forEach(point => {
            if (point.type && point.distance) {
                 if (!groups[point.type]) {
                    groups[point.type] = [];
                }
                groups[point.type].push(point);
            }
        });

        const summarizedList = [];
        
        currentCategory.poiTypes.forEach(poiType => {
            const pointsOfType = groups[poiType];
            
            if (pointsOfType && pointsOfType.length > 0) {
                let nearestPoint = pointsOfType[0];
                let minDistance = parseDistance(nearestPoint.distance).value;
                
                pointsOfType.forEach(point => {
                    const currentDistance = parseDistance(point.distance).value;
                    if (currentDistance < minDistance) {
                        minDistance = currentDistance;
                        nearestPoint = point;
                    }
                });

                summarizedList.push({
                    poiType: poiType, 
                    displayName: currentCategory.displayNames[poiType] || poiType, 
                    icon: getIconForLabel(poiType),
                    bestDistance: nearestPoint.distance, 
                    allPoints: pointsOfType.sort((a, b) => {
                         return parseDistance(a.distance).value - parseDistance(b.distance).value;
                    }),
                });
            }
        });
        
        return summarizedList;

    }, [activeTab, proximityPoints, proximityCategories]);

    
    const handleTogglePOIType = useCallback((poiType) => {
        // ✅ ADD ANIMATION: Smooth transition when opening/closing dropdown
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActivePOIType(prev => prev === poiType ? null : poiType);
    }, []);


    const renderSubCategoryList = () => {
        
        if (groupedPoints.length === 0) {
            return (
                <View style={dynamicStyles.noDataContainer}>
                    <Text style={[dynamicStyles.descriptionText, { color: colors.text + '60', fontStyle: 'italic', textAlign: 'center', padding: 20 }]}>
                        No proximity points entered for the {currentCategory.title} category.
                    </Text>
                </View>
            );
        }

        return (
            <FlatList
                data={groupedPoints}
                keyExtractor={(item) => item.poiType}
                scrollEnabled={true} 
                renderItem={({ item }) => {
                    const isActive = activePOIType === item.poiType;
                    
                    // ✅ SHADOWS AND COLORS applied to the main button
                    const buttonStyles = [
                        dynamicStyles.subCategoryButton,
                        styles.attractiveButton, // Added for base visual enhancement
                        { 
                            backgroundColor: isActive ? listingGoalColor + '10' : colors.card, // Lighter background for inactive
                            borderColor: isActive ? listingGoalColor : colors.border,
                            borderWidth: 1,
                        }
                    ];

                    return (
                        <View style={dynamicStyles.subCategoryWrapper}>
                            <TouchableOpacity
                                onPress={() => handleTogglePOIType(item.poiType)} // Use the new handler
                                style={buttonStyles}
                            >
                                {/* 1. Icon with vibrant color */}
                                <Icon 
                                    name={item.icon} 
                                    size={dynamicStyles.infoDetailIconSize + 2} 
                                    color={listingGoalColor} 
                                    style={dynamicStyles.subCategoryIcon}
                                />
                                
                                {/* 2. Label */}
                                <Text style={[dynamicStyles.pointLabel, dynamicStyles.subCategoryText, styles.labelText, { color: colors.text }]}>
                                    {item.displayName}
                                </Text>
                                
                                {/* 3. Value (Nearest Distance - Bold) */}
                                <Text 
                                    style={[
                                        dynamicStyles.pointValue, 
                                        dynamicStyles.subCategoryValue, 
                                        { 
                                            color: listingGoalColor, 
                                            marginRight: 8, 
                                            fontWeight: '800'
                                        }
                                    ]}
                                >
                                    {item.bestDistance}
                                </Text>
                                
                                {/* 4. Dropdown Indicator */}
                                <Icon 
                                    name={isActive ? "chevron-up-outline" : "chevron-down-outline"} 
                                    size={dynamicStyles.infoDetailIconSize * 0.9} 
                                    color={listingGoalColor} 
                                />
                            </TouchableOpacity>
                            
                            {/* DROPDOWN CONTENT (Lists ALL entries for this POI type) */}
                            {isActive && (
                                <View style={[styles.subCategoryContentEnhanced, { 
                                    backgroundColor: colors.background,
                                    borderColor: listingGoalColor + '30'
                                }]}>
                                    <Text style={[dynamicStyles.descriptionText, { color: colors.text, fontWeight: 'bold', marginBottom: 10, fontSize: 16 }]}>
                                        All {item.displayName.replace('Nearest ', '')}s:
                                    </Text>
                                    
                                    {/* List all specific points with enhanced styles */}
                                    {item.allPoints.map((point, index) => (
                                        <View key={index} style={[styles.pointDetailRow, { 
                                            // Dynamic background based on theme color for attractiveness
                                            backgroundColor: colors.background + 'F0', 
                                            borderColor: colors.border
                                        }]}>
                                            <Icon name="navigate-circle" size={18} color={listingGoalColor} style={{ marginRight: 10 }} />
                                            
                                            {/* Point Name (The custom name entered by user) */}
                                            <Text style={[styles.pointName, { color: colors.text }]} numberOfLines={1}>
                                                {point.name || point.type}
                                            </Text>
                                            
                                            {/* Distance Pill (Attractive badge) */}
                                            <Text style={[styles.pointDistancePill, { backgroundColor: listingGoalColor }]}>
                                                {point.distance}
                                            </Text>
                                        </View>
                                    ))}
                                    
                                    <Text style={[dynamicStyles.descriptionText, { color: colors.text + '70', marginTop: 10, fontSize: 13, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 5 }]}>
                                        The closest point is listed first (top).
                                    </Text>
                                </View>
                            )}
                        </View>
                    );
                }}
            />
        );
    };

    // --- Main Component JSX ---
    return (
        <View style={[dynamicStyles.section, dynamicStyles.cardStyle, styles.mainCard, { backgroundColor: colors.card, ...dynamicStyles.getWebShadow(dynamicStyles.DEEP_SOFT_SHADOW) }]}>
            <Text style={[dynamicStyles.sectionTitle, dynamicStyles.infoSectionTitle, { color: colors.text }]}>Nearby Proximity Points 📍</Text>
            
            {/* 1. Tabs Navigation (WhatsApp Style Enhanced) */}
            <View style={dynamicStyles.proximityTabContainer}>
                {proximityCategories.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => handleTabChange(tab.key)} 
                        style={[
                            dynamicStyles.proximityTab,
                            styles.attractiveTab,
                            { 
                                borderBottomColor: activeTab === tab.key ? listingGoalColor : colors.border,
                                borderBottomWidth: activeTab === tab.key ? 3 : 1,
                            }
                        ]}
                    >
                        <Icon 
                            name={tab.icon} 
                            size={dynamicStyles.infoDetailIconSize + 2} 
                            color={activeTab === tab.key ? listingGoalColor : colors.text + '90'} 
                            style={{ marginBottom: 4 }}
                        />
                        <Text 
                            style={[
                                dynamicStyles.proximityTabText, 
                                { 
                                    color: activeTab === tab.key ? listingGoalColor : colors.text,
                                    fontWeight: activeTab === tab.key ? '900' : '600'
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
                borderRadius: 15,
                marginTop: 10,
            }]}>
                {renderSubCategoryList()}
            </View>

        </View>
    );
};

// ----------------------------------------------------
// 🎨 ATTRACTIVE STYLES
// ----------------------------------------------------
const styles = StyleSheet.create({
    // Main Container Styling
    mainCard: {
        borderRadius: 20, // More rounded main card
    },
    // Tab Enhancements
    attractiveTab: {
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    // Main Dropdown Button Enhancements
    attractiveButton: {
        borderRadius: 15,
        padding: 15,
        marginVertical: 6,
        // Subtle Shadow for depth
        ...Platform.select({
             ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
             android: { elevation: 3 },
        })
    },
    labelText: {
        fontSize: 15,
        flex: 1, // Ensure text takes up space
        fontWeight: '600',
    },
    // Dropdown Content Container
    subCategoryContentEnhanced: {
        padding: 15,
        paddingTop: 10,
        borderRadius: 15,
        marginTop: -5, // Slightly overlap the button
        borderWidth: 1,
        borderTopWidth: 0,
        // Inset-like shadow effect
        ...Platform.select({
             ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 3 },
             android: { elevation: 1 },
        })
    },
    // Individual Point Row within Dropdown
    pointDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 3,
        borderRadius: 10,
        // Very light border for separation
        borderWidth: 1, 
    },
    pointName: {
        flex: 1, 
        fontSize: 14,
        fontWeight: '500',
        marginHorizontal: 10,
    },
    // Distance Pill / Badge
    pointDistancePill: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFF', // White text on vibrant background
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20, // Pill shape
        minWidth: 60,
        textAlign: 'center',
        overflow: 'hidden', // Ensures borderRadius works well
    }
});

export default PropertyProximityPoints;