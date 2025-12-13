// src/components/Stepper.jsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// Import constants and styles from the main file
import { SUBTLE_SHADOW, COLORS } from './ListingFormScreen.web';


const Stepper = ({ currentStep, steps, onStepPress, styles }) => (
    <View style={styles.stepperContainer}>
        {steps.map((step, index) => (
            <React.Fragment key={step.id}>
                <TouchableOpacity 
                    style={[
                        styles.stepPill,
                        // Active pill gets the pulsating glow effect
                        step.id === currentStep && styles.stepPillActiveGlow, 
                        step.id < currentStep && styles.stepPillCompleted,
                        SUBTLE_SHADOW // Subtle lift for each pill
                    ]}
                    onPress={() => onStepPress(step.id)} 
                    disabled={step.id > currentStep} 
                >
                    <Icon 
                        name={step.icon} 
                        size={18} 
                        color={step.id <= currentStep ? COLORS.cardBackground : COLORS.headerBlue} 
                    />
                    <Text style={[
                        styles.stepTitle, 
                        step.id <= currentStep && styles.stepTitleActive
                    ]}>
                        {step.title}
                    </Text>
                </TouchableOpacity>
                {index < steps.length - 1 && (
                    <View style={[
                        styles.stepLine,
                        step.id < currentStep && styles.stepLineCompleted,
                    ]} />
                )}
            </React.Fragment>
        ))}
    </View>
);

export default Stepper;