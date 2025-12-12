// src/screens/HomeScreen.jsx

import React, { useState, useRef, useEffect } from 'react';
import {
 SafeAreaView, ScrollView, View, Text, Image, Dimensions, Alert, Modal, FlatList, TouchableOpacity, StyleSheet
} from 'react-native';
import { useTheme } from '../../theme/theme.js';
import PropertyListing from './PropertyListing.mobile.jsx';
import MobFilterBar from './MobFilterBar.jsx';
import WebFilterBar from '../web/WebFilterBar.jsx';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const BREAKPOINT = 768;

// Hero Slider Images
const heroImages = [
//  require('../../../assets/hero_slide1.png'),
//  require('../../../assets/hero_slide_2.png'),
//  require('../../../assets/hero_slide_3.png'),
];

// Navigation options
const navOptions = ['Buy', 'Rent', 'Commercial'];

// Dropdown options
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'];
const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK'];
const propertyStatus = ['Ready to Move', 'Under Construction'];

const HomeScreen = ({ navigation }) => { // navigation prop is received here
 const { colors } = useTheme();
 const [searchText, setSearchText] = useState('');
 const [currentSlide, setCurrentSlide] = useState(0);
 const [selectedNav, setSelectedNav] = useState('Buy');

 // Filters
 const [city, setCity] = useState('');
 const [bhkType, setBhkType] = useState([]);
 const [status, setStatus] = useState('');
 const [houseType, setHouseType] = useState('');

 // Dropdown modal
 const [modalVisible, setModalVisible] = useState({ type: '', visible: false });
    // State to temporarily hold selection while modal is open
    const [tempSelection, setTempSelection] = useState([]);


 const scrollRef = useRef();
 const [isWeb, setIsWeb] = useState(width > BREAKPOINT);

 // Handle screen resize for web/mobile
 useEffect(() => {
  const handleResize = ({ window }) => setIsWeb(window.width > BREAKPOINT);
  const subscription = Dimensions.addEventListener('change', handleResize);
  return () => {
   subscription?.remove();
  };
 }, []);

 const navigateToFilters = () => Alert.alert("Action", "Opening Filter Modal/Screen");

 const handleScroll = (event) => {
  const slide = Math.round(event.nativeEvent.contentOffset.x / (width - 32));
  setCurrentSlide(slide);
 };

 const goToSlide = (index) => {
  scrollRef.current?.scrollTo({ x: index * (width - 32), animated: true });
 };

 const openDropdown = (type) => {
    // Initialize temporary selection based on current state
    if (type === 'bhk') setTempSelection([...bhkType]);
    else if (type === 'city') setTempSelection(city ? [city] : []);
    else if (type === 'status') setTempSelection(status ? [status] : []);

    setModalVisible({ type, visible: true });
  };
    
  const toggleTempSelection = (option) => {
    setTempSelection(prev => {
        if (modalVisible.type === 'bhk') {
            // Multi-select logic for BHK
            return prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option];
        } else {
            // Single-select logic for City/Status
            return prev.includes(option) ? [] : [option];
        }
    });
  };

  const applySelection = () => {
    const { type } = modalVisible;
    if (type === 'city') setCity(tempSelection[0] || ''); // Single selection
    else if (type === 'status') setStatus(tempSelection[0] || ''); // Single selection
    else if (type === 'bhk') setBhkType(tempSelection); // Multi selection
    
    // Close and reset temporary state
    setModalVisible({ type: '', visible: false });
    setTempSelection([]);
  };

 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
   <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 }}>

    {/* Hero Slider */}
    <ScrollView
     ref={scrollRef}
     horizontal
     pagingEnabled
     showsHorizontalScrollIndicator={false}
     onScroll={handleScroll}
     scrollEventThrottle={16}
     style={{ marginBottom: 20 }}
     contentContainerStyle={{ paddingHorizontal: 16 }}
    >
     {heroImages.map((img, index) => (
      <Image
       key={index}
       source={img}
       style={{ width: width - 32, height: (width - 32) * 0.55, borderRadius: 12, marginRight: 16 }}
       resizeMode="cover"
      />
     ))}
    </ScrollView>

    {/* Dots */}
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
     {heroImages.map((_, index) => (
      <TouchableOpacity
       key={index}
       onPress={() => goToSlide(index)}
       style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#007AFF', marginHorizontal: 4, opacity: index === currentSlide ? 1 : 0.3 }}
      />
     ))}
    </View>

    {/* AI Recommendations (above navigation tabs) */}
    <View style={{
     borderRadius: 12,
     padding: 18,
     marginBottom: 20,
     borderLeftWidth: 6,
     borderLeftColor: colors.primary,
     backgroundColor: colors.mode === 'light' ? '#e6e6fa' : '#2a2a3a',
     elevation: 2
    }}>
     <Icon name="sparkles" size={24} color={colors.primary} />
     <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: colors.text }}>✨ AI Recommended for You</Text>
     <Text style={{ fontSize: 14, marginBottom: 10, color: colors.text }}>
      Based on your profile, we found 5 compatible listings nearby.
     </Text>
     <TouchableOpacity style={{ paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, alignSelf: 'flex-start', backgroundColor: colors.primary }}>
      <Text style={{ color: '#FFF', fontWeight: 'bold' }}>View Matches</Text>
     </TouchableOpacity>
    </View>


    {/* Filters */}
    {isWeb ? (
        <View style={styles.webFilterBarWrapper}>
            <WebFilterBar
                colors={colors}
                city={city} bhkType={bhkType} status={status} houseType={houseType}
                setHouseType={setHouseType}
                openDropdown={openDropdown}
                searchText={searchText}
                setSearchText={setSearchText}
            />
        </View>
    ) : (
        <MobFilterBar
            colors={colors}
            city={city} bhkType={bhkType} status={status} houseType={houseType}
            setHouseType={setHouseType}
            openDropdown={openDropdown}
            searchText={searchText}
            setSearchText={setSearchText}
        />
    )}


    {/* Navigation Tabs (Styled as Colorful Segmented Control) */}
    <View style={[
            styles.navTabsContainer, 
            { 
                borderColor: colors.border,
                backgroundColor: colors.card,
            },
            // --- WEB ONLY OVERRIDE ---
            isWeb && styles.navTabsWebOverride // Apply constrained width and centering only on web
        ]}>
     {navOptions.map(option => (
      <TouchableOpacity
       key={option}
       onPress={() => setSelectedNav(option)}
       style={[
                styles.navTabButton,
                { 
                    // Solid Primary background for selected state (Colorful!)
                    backgroundColor: selectedNav === option ? colors.primary : colors.card,
                    // Subtle separator line for unselected tabs
                    borderRightWidth: option !== navOptions[navOptions.length - 1] ? 1 : 0,
                    borderRightColor: colors.border,
                }
       ]}
      >
       <Text style={{ 
                    // White text for selected, standard text color for unselected
                    color: selectedNav === option ? colors.white : colors.text, 
                    fontWeight: 'bold',
                    fontSize: 15,
                }}
            >
                {option}
            </Text>
      </TouchableOpacity>
     ))}
    </View>

    {/* Property Listing */}
    {/* FIX: Pass the navigation prop down to PropertyListing */}
    <PropertyListing colors={colors} navigation={navigation} /> 

   </ScrollView>

   {/* Dropdown Modal (Using tempSelection and Apply button) */}
   <Modal transparent visible={modalVisible.visible} animationType="fade">
    <TouchableOpacity 
            style={styles.modalOverlay} 
            onPress={() => setModalVisible({ type: '', visible: false })} 
        />
    <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Modal Title */}
            <Text style={[styles.modalTitle, { color: colors.text }]}>
                {modalVisible.type === 'city' ? 'Select City' : modalVisible.type === 'bhk' ? 'Select BHK Type' : 'Select Property Status'}
            </Text>
            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 10 }} />

     <FlatList
      data={
       modalVisible.type === 'city' ? cities :
       modalVisible.type === 'bhk' ? bhkOptions :
       modalVisible.type === 'status' ? propertyStatus : []
      }
      keyExtractor={(item, idx) => idx.toString()}
      renderItem={({ item }) => {
                const isSelected = tempSelection.includes(item);
                return (
       <TouchableOpacity
        style={[styles.modalItem, { borderBottomColor: colors.border, backgroundColor: isSelected ? colors.primary + '15' : 'transparent' }]}
        onPress={() => toggleTempSelection(item)}
       >
        <Text style={{ color: colors.text, fontWeight: isSelected ? '600' : '400' }}>{item}</Text>
                {isSelected && <Icon name="checkmark-circle" size={20} color={colors.primary} />}
       </TouchableOpacity>
            )}}
     />
        
            {/* Apply Button Footer */}
            <View style={styles.modalFooter}>
                <TouchableOpacity 
                    style={[styles.applyButton, { backgroundColor: colors.primary }]}
                    onPress={applySelection}
                >
                    <Text style={styles.applyButtonText}>Apply ({tempSelection.length} Selected)</Text>
                </TouchableOpacity>
            </View>

    </View>
   </Modal>

  </SafeAreaView>
 );
};

// --- Updated and Consolidated Styles ---
const styles = StyleSheet.create({
    // --- Filter Bar Wrapper (Web Only) ---
    webFilterBarWrapper: {
        width: '90%', 
        alignSelf: 'center', 
        marginBottom: 20
    },

    // --- Navigation Tabs Styles (Mobile Default) ---
    navTabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderWidth: 1, // Outer border
        borderRadius: 30, // Default high curve for Mobile (Full width)
        overflow: 'hidden',
    },
    navTabButton: {
        flex: 1,
        paddingVertical: 8, // Reduced height for both
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0, 
        borderRadius: 0, 
    },
    // --- Navigation Tabs Web Override ---
    navTabsWebOverride: {
        width: '50%', 
        alignSelf: 'center', 
        borderRadius: 12, // Slightly less curve for a cleaner web look
    },

    // Modal Styles (Improved)
    modalOverlay: { 
        flex: 1, 
        backgroundColor: '#000000AA', 
    },
    modalContent: { 
        position: 'absolute', 
        top: '20%', 
        left: 20, 
        right: 20, 
        borderRadius: 12, 
        maxHeight: 350, 
        padding: 15, 
        borderWidth: 1,
        elevation: 10,
    
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    modalItem: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12, 
        borderBottomWidth: 1, 
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    modalFooter: {
        paddingTop: 10,
    },
    applyButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    applyButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default HomeScreen;