// src/components/Step5DescriptionRequirements.jsx

import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { negotiationMargins, preferredGenders, preferredOccupations, CTA_SHADOW, SUBTLE_SHADOW, COLORS } from './ListingFormScreen.web';

const Step5DescriptionRequirements = ({ goal, description, setDescription, isBrokerageFree, setIsBrokerageFree, negotiationMargin, setNegotiationMargin, preferredGender, setPreferredGender, preferredOccupation, setPreferredOccupation, preferredWorkLocation, setPreferredWorkLocation, isLoading, styles }) => {
    
    const renderNegotiationMargin = () => (
        <View style={styles.inputGroup}>
            <Text style={styles.labelSmall}>Negotiation Margin (%)</Text>
            <View style={styles.selectorContainerSmall}>
                {negotiationMargins.map(margin => (
                    <TouchableOpacity 
                        key={margin} 
                        style={[
                            styles.selectorButtonTiny, 
                            negotiationMargin === margin && styles.selectorButtonActive,
                            SUBTLE_SHADOW
                        ]} 
                        onPress={() => setNegotiationMargin(margin)}
                        disabled={isLoading}
                    >
                        <Text style={negotiationMargin === margin ? styles.selectorTextActive : styles.selectorText}>{margin}%</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderOccupationSelector = () => (
        <View style={styles.selectorContainerSmall}>
            {preferredOccupations.map(occ => (
                <TouchableOpacity 
                    key={occ} 
                    style={[
                        styles.selectorButtonSmall, 
                        preferredOccupation === occ && styles.selectorButtonActive,
                        SUBTLE_SHADOW
                    ]} 
                    onPress={() => setPreferredOccupation(occ)}
                    disabled={isLoading}
                >
                    <Text style={preferredOccupation === occ ? styles.selectorTextActive : styles.selectorText}>{occ}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <>
            <Text style={styles.sectionTitle}>5. Description & Tenant Requirements</Text>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Property Description</Text>
                <TextInput style={[styles.textInput, styles.textArea]} placeholder="Provide a detailed description of the property..." value={description} onChangeText={setDescription} multiline numberOfLines={4} editable={!isLoading} />
            </View>
            
            <View style={styles.inputRow}>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.labelSmall}>Brokerage Free?</Text>
                    <TouchableOpacity
                        style={[styles.toggleButtonFull, isBrokerageFree && styles.toggleButtonActive, CTA_SHADOW]} 
                        onPress={() => setIsBrokerageFree(prev => !prev)}
                        disabled={isLoading}
                    >
                        <Icon name={isBrokerageFree ? 'shield-checkmark' : 'close-circle-outline'} size={20} color={isBrokerageFree ? COLORS.cardBackground : COLORS.textDark} style={{ marginRight: 8 }} />
                        <Text style={isBrokerageFree ? styles.toggleTextActive : styles.toggleText}>
                            {isBrokerageFree ? 'Yes, Brokerage Free' : 'No, Brokerage Applies'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                    {renderNegotiationMargin()}
                </View>
            </View>
            
            {/* Requirements (Conditional for Flatmate) */}
            {goal === 'Flatmate' && (
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Preferred Flatmate Requirements</Text>
                    <View style={styles.inputRow}>
                        <View style={[styles.inputGroup, styles.inputHalf]}>
                            <Text style={styles.labelSmall}>Gender</Text>
                            <View style={styles.selectorContainerSmall}>
                                {preferredGenders.map(gender => (
                                    <TouchableOpacity key={gender} style={[styles.selectorButtonTiny, preferredGender === gender && styles.selectorButtonActive, SUBTLE_SHADOW]} onPress={() => setPreferredGender(gender)} disabled={isLoading}>
                                        <Text style={preferredGender === gender ? styles.selectorTextActive : styles.selectorText}>{gender}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <View style={[styles.inputGroup, styles.inputHalf]}>
                            <Text style={styles.labelSmall}>Occupation</Text>
                            {renderOccupationSelector()}
                        </View>
                    </View>
                    <Text style={styles.labelSmall}>Preferred Work Location</Text>
                    <TextInput style={styles.textInput} placeholder="e.g., Andheri, Powai" value={preferredWorkLocation} onChangeText={setPreferredWorkLocation} editable={!isLoading} />
                </View>
            )}
        </>
    );
};

export default Step5DescriptionRequirements;