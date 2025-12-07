// src/theme/theme.js
import React, { createContext, useContext, useState } from 'react';

// ======================================================
// 📌 DISNEY-ESQUE UI CONSTANTS (Vibrant, 3D, High-Impact)
// ======================================================

// 🌟 Ultra-rounded corners for major components (GENEROUS_RADIUS: 30)
export const GENEROUS_RADIUS = 30; 

// Deep, soft shadow for major cards and headers (3D Lift Effect)
export const DEEP_SOFT_SHADOW = {
    shadowColor: '#102A43', 
    shadowOffset: { width: 0, height: 12 }, 
    shadowOpacity: 0.35, 
    shadowRadius: 20, 
    elevation: 15,
};

// Subtler shadow for inner elements, buttons (Depth)
export const SUBTLE_SHADOW = { 
    shadowColor: '#102A43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
}

// ------------------------------------------------------
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  // 🌟 High-Impact Color Palette for Light Mode
  const lightColors = {
    mode: 'light',
    // VIBRANT COLORS
    primary: '#1e90ff', // Striking Red-Pink (Main CTA, Active State)
    secondary: '#00C4CC', // Cyan/Teal (Secondary Action)
    accent: '#FFC700', // Gold/Yellow Accent (Stars, Warnings)
    success: '#34C759', 
    error: '#FF3B30', 
    
    // BACKGROUNDS & SURFACES (Allows 3D cards to float)
    background: '#F8F8FF', // Very light, off-white (Main screen background)
    card: '#FFFFFF', // Pure white for floating 3D cards
    backgroundLight: '#FFFFFF', // For floating/sticky elements
    
    // TYPOGRAPHY & BORDERS
    text: '#898787ff',
    textSecondary: '#ddddddff',
    border: '#E0E0E0', 
  };
  
  // 🌟 High-Impact Color Palette for Dark Mode
  const darkColors = {
    mode: 'dark',
    // VIBRANT COLORS (Slightly lighter to pop against dark background)
    primary: '#FF6699', 
    secondary: '#00E5FF', 
    accent: '#FFD966', 
    success: '#66FF88', 
    error: '#FF6666', 
    
    // BACKGROUNDS & SURFACES (Deep and contrasting for 3D effect)
    background: '#121212', // Deepest dark background
    card: '#2D2D30', // Lighter dark grey for cards
    backgroundLight: '#1C1C1E', // Slightly lighter background for floating/sticky elements
    
    // TYPOGRAPHY & BORDERS
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#404040', 
  };

  const colors = mode === 'light' ? lightColors : darkColors;

  const toggleTheme = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider 
      value={{ 
        mode, 
        colors, 
        toggleTheme, 
        // 3D Constants passed globally
        GENEROUS_RADIUS, 
        DEEP_SOFT_SHADOW, 
        SUBTLE_SHADOW 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};