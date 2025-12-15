// src/components/Step1GoalType.jsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { listingGoals, propertyTypeData, SUBTLE_SHADOW } from './PropertyCreate';

const Step1GoalType = ({ goal, setGoal, propertyType, setPropertyType, isLoading, styles }) => {
    
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
                        onPress={() => setGoal(g)}
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

    return (
        <>
            <Text style={styles.sectionTitle}>1. Listing Goal & Property Type</Text>
            {renderGoalSelector()}
            {renderPropertyTypeSelector()}
        </>
    );
};

export default Step1GoalType;