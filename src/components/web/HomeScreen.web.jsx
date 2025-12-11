// src/screens/HomeScreen.web.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
 SafeAreaView, ScrollView, View, Text, Image, Dimensions, Alert, Modal, FlatList, TouchableOpacity, StyleSheet, Platform
} from 'react-native'; 
import { useTheme } from '../../theme/theme.js'; 
import PropertyListing from './PropertyListing.web.jsx';
import WebFilterBar from './WebFilterBar.jsx';
import Icon from 'react-native-vector-icons/Ionicons'; 

const { width } = Dimensions.get('window');
const BREAKPOINT = 768;
const MAX_WEB_WIDTH = '98%'; 

// --- GENERIC UI CONSTANTS (Not color-specific) ---
const GENEROUS_RADIUS = 30; // Ultra-rounded corners
const BUTTON_RADIUS = 20; 
// -----------------------------------------------------------------

// Hero Slider Images (Path is relative to the file)
const heroImages = [
 require('../../../assets/hero_slide1.png'),
 require('../../../assets/hero_slide_2.png'),
 require('../../../assets/hero_slide_3.png'),
];


// Navigation options
const navOptions = ['Sale', 'Rent','Flatmate'];

// Dropdown options
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'];
const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];
const propertyStatus = ['Ready to Move', 'Under Construction', 'New Launch'];

const HomeScreen = ({ navigation }) => {
 const { colors } = useTheme();
 const [searchText, setSearchText] = useState('');
 const [currentSlide, setCurrentSlide] = useState(0);
 const [selectedNav, setSelectedNav] = useState('Sale'); 

 // Filters
 const [city, setCity] = useState('');
 const [bhkType, setBhkType] = useState([]);
 const [status, setStatus] = useState(''); 
 const [houseType, setHouseType] = useState(''); 

 // Dropdown modal
 const [modalVisible, setModalVisible] = useState({ type: '', visible: false });
 const [tempSelection, setTempSelection] = useState([]);

 const scrollRef = useRef();
 const [isWeb, setIsWeb] = useState(width > BREAKPOINT || Platform.OS === 'web'); 

 // --- Dynamic Theme Constants (Derived from useTheme) ---
 // Use colors.text for shadows (assuming it's dark)
 const SHADOW_BASE = colors.text; 
 // Keeping this specific gold color for the "sparkles" icon for high contrast
 const ICON_ACCENT_COLOR = '#FFD700'; 

 // Deeper, Softer, and Wider Shadow for grand elements (Floating Look)
 const DEEP_SOFT_SHADOW_DYNAMIC = {
    // Use a calculated opacity value for the boxShadow based on SHADOW_BASE
    boxShadow: `0 20px 40px 0px ${SHADOW_BASE}4D`, // ~30% opacity
    shadowColor: SHADOW_BASE, 
    shadowOffset: { width: 0, height: 20 }, 
    shadowOpacity: 0.35, 
    shadowRadius: 40, 
    elevation: 25,
 };

 // Subtle Shadow for internal/interactive elements (Soft Lift)
 const SUBTLE_SHADOW_DYNAMIC = { 
    // Use a calculated opacity value for the boxShadow based on SHADOW_BASE
    boxShadow: `0 8px 15px 0px ${SHADOW_BASE}40`, // ~25% opacity
    shadowColor: SHADOW_BASE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
 }
 // -----------------------------------------------------------------


 useEffect(() => {
  const handleResize = ({ window }) => setIsWeb(window.width > BREAKPOINT);
  const subscription = Dimensions.addEventListener('change', handleResize);
  return () => {
   subscription?.remove();
  };
 }, []);

 const handleScroll = (event) => {
  // Use current window width minus padding/margins
  const itemWidth = width - 40; 
  const slide = Math.round(event.nativeEvent.contentOffset.x / itemWidth);
  setCurrentSlide(slide);
 };

 const goToSlide = (index) => {
  const itemWidth = width - 40;
  scrollRef.current?.scrollTo({ x: index * itemWidth, animated: true });
 };

 const openDropdown = (type) => {
    if (type === 'bhk') setTempSelection([...bhkType]);
    else if (type === 'city') setTempSelection(city ? [city] : []);
    else if (type === 'status') setTempSelection(status ? [status] : []);

    setModalVisible({ type, visible: true });
  };
    
  const toggleTempSelection = (option) => {
    setTempSelection(prev => {
        if (modalVisible.type === 'bhk') {
            return prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option];
        } else {
            return prev.includes(option) ? [] : [option];
        }
    });
  };

  const applySelection = () => {
    const { type } = modalVisible;
    if (type === 'city') setCity(tempSelection[0] || '');
    else if (type === 'status') setStatus(tempSelection[0] || '');
    else if (type === 'bhk') setBhkType(tempSelection);
    
    setModalVisible({ type: '', visible: false });
    setTempSelection([]);
  };

 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
   <ScrollView contentContainerStyle={[styles.scrollContentWeb, { maxWidth: MAX_WEB_WIDTH }]}>

    {/* Hero Slider */}
     <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={[styles.heroSliderContainer,{ marginBottom: 20  ,maxHeight:(width - 32) * 0.55}]}
        contentContainerStyle={{ paddingHorizontal: 20 }}
       >
        {heroImages.map((img, index) => (
         <Image
          key={index}
          source={img}
          style={[
            styles.heroImageBase, 
            DEEP_SOFT_SHADOW_DYNAMIC, // Dynamic shadow applied here
            { 
                height: (width - 40) * 0.55, 
                maxHeight:width-100,
                width: width - 40, // Calculated width
                marginRight: 20, 
                backgroundColor: colors.border,
                // Soft Inner Glow for glossy look
                boxShadow: `inset 0 0 20px ${colors.white}40` // Use colors.white for inner glow
            }
          ]}
          resizeMode="cover"
         />
        ))}
       </ScrollView>
   
       {/* Dots - Enhanced Glow and Animation */}
       <View style={styles.dotsContainer}>
        {heroImages.map((_, index) => (
         <TouchableOpacity
          key={index}
          onPress={() => goToSlide(index)}
          style={[
            styles.dotStyle, 
            SUBTLE_SHADOW_DYNAMIC, // Dynamic subtle shadow applied to all dots
            { 
                backgroundColor: colors.primary, 
                opacity: index === currentSlide ? 1 : 0.35, 
                transform: [{ scale: index === currentSlide ? 1.5 : 1 }], 
                // Active Dot Glow Shadow
                boxShadow: index === currentSlide 
                    ? `0 0 15px 5px ${colors.primary + 'CC'}` 
                    : SUBTLE_SHADOW_DYNAMIC.boxShadow, // Use dynamic base shadow for inactive dots
            }
          ]}
         />
        ))}
       </View>
       
    {/* Filters (WebFilterBar) */}
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


    {/* Navigation Tabs (The Vibrant Crystal Panel) */}
    <View style={[
            styles.navTabsContainer, 
            { 
                backgroundColor: colors.card,
                ...DEEP_SOFT_SHADOW_DYNAMIC, // Dynamic deep soft shadow applied here
            },
            styles.navTabsWebOverride 
        ]}>
     {navOptions.map(option => (
      <TouchableOpacity
       key={option}
       onPress={() => setSelectedNav(option)} 
       activeOpacity={0.7} 
       style={[
                styles.navTabButton,
                { 
                    backgroundColor: selectedNav === option ? colors.primary : colors.card,
                    borderRightWidth: option !== navOptions[navOptions.length - 1] ? 1 : 0,
                    borderRightColor: colors.border + '50', 
                    
                    ...SUBTLE_SHADOW_DYNAMIC, // Dynamic subtle shadow applied here
                    shadowColor: selectedNav === option ? colors.primary : SHADOW_BASE, // Use dynamic shadow base
                    
                    transform: [{ scale: selectedNav === option ? 1.05 : 1 }],
                    transition: 'all 0.3s cubic-bezier(.4, 0, .2, 1)',
                }
       ]}
      >
       <Text style={{ 
                    color: selectedNav === option ? colors.white : colors.text, // Use colors.white and colors.text
                    fontWeight: '900', 
                    fontSize: 18,
                    // Text glow
                    textShadowColor: selectedNav === option ? `${colors.white}66` : 'transparent', // Use colors.white for text glow
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 2,
                }}
            >
                {option}
            </Text>
      </TouchableOpacity>
     ))}
    </View>

    {/* Property Listing (Using Web Optimized Component) */}
    <PropertyListing 
        colors={colors} 
        navigation={navigation} 
        listingType={selectedNav} 
        city={city} 
        bhkType={bhkType} 
        status={status} 
        houseType={houseType} 
        searchText={searchText} 
    /> 

   </ScrollView>

   {/* Dropdown Modal (The Soft Pop-Up Card) */}
   <Modal transparent visible={modalVisible.visible} animationType="fade">
    <TouchableOpacity 
            style={styles.modalOverlay} 
            onPress={() => setModalVisible({ type: '', visible: false })} 
            activeOpacity={1}
        />
    <View style={[
        styles.modalContent, 
        DEEP_SOFT_SHADOW_DYNAMIC, // Dynamic deep soft shadow applied here
        { 
            backgroundColor: colors.card, 
            borderColor: colors.border 
        }
    ]}>
            {/* Modal Title */}
            <Text style={[styles.modalTitle, { color: colors.text }]}>
                {modalVisible.type === 'city' ? 'Select Grand City' : modalVisible.type === 'bhk' ? 'Select Enchanted Rooms' : 'Select Property Status'}
            </Text>
            <View style={{ height: 1, backgroundColor: colors.border + '50', marginVertical: 15 }} />

     <FlatList
      data={
       modalVisible.type === 'city' ? cities :
       modalVisible.type === 'bhk' ? bhkOptions :
       modalVisible.type === 'status' ? propertyStatus : []
      }
      keyExtractor={(item, idx) => item.toString()}
      renderItem={({ item }) => {
                const isSelected = tempSelection.includes(item);
                return (
       <TouchableOpacity
        style={[
            styles.modalItem, 
            { 
                backgroundColor: isSelected ? colors.primary + '10' : colors.background,
                ...SUBTLE_SHADOW_DYNAMIC, // Dynamic subtle shadow applied here
                shadowColor: isSelected ? colors.primary : SHADOW_BASE, // Use dynamic shadow base
                transform: [{ scale: isSelected ? 1.02 : 1 }],
            }
        ]}
        onPress={() => toggleTempSelection(item)}
        activeOpacity={0.8}
       >
        <Text style={{ color: colors.text, fontWeight: isSelected ? '900' : '600', fontSize: 16 }}>{item}</Text>
        {isSelected && <Icon name="sparkles" size={24} color={ICON_ACCENT_COLOR} />} {/* Use ICON_ACCENT_COLOR */}
       </TouchableOpacity>
            )}}
     />
        
            {/* Apply Button Footer */}
            <View style={styles.modalFooter}>
                <TouchableOpacity 
                    style={[
                        styles.applyButton, 
                        { 
                            backgroundColor: colors.primary,
                            // High-Impact Glow
                            boxShadow: `0 10px 20px 0px ${colors.primary + 'CC'}`,
                            shadowColor: colors.primary,
                            ...DEEP_SOFT_SHADOW_DYNAMIC // Dynamic deep soft shadow applied here
                        }
                    ]}
                    onPress={applySelection}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.applyButtonText, { color: colors.white }]}>Apply Magical Filters ({tempSelection.length} Selected)</Text> {/* Use colors.white */}
                </TouchableOpacity>
            </View>

    </View>
   </Modal>

  </SafeAreaView>
 );
};

// --- Web Optimized Styles (Vibrant 3D Aesthetics) ---
const styles = StyleSheet.create({
    // --- Scroll Content Wrapper ---
    scrollContentWeb: {
        flexGrow: 0,
        alignSelf: 'center', 
        paddingHorizontal: 20, 
        paddingTop: 30,
        paddingBottom: 50, 
        width: '100%',
    },

    // --- Hero Slider ---
    heroImageBase: {
        borderRadius: GENEROUS_RADIUS, 
    },
    heroSliderContainer: {
        marginBottom: 10,
        overflow: 'visible',
    },
    
    // --- Dots ---
    dotsContainer: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginBottom: 30,
    },
    dotStyle: {
        width: 12, 
        height: 12, 
        borderRadius: 6, 
        marginHorizontal: 8, 
        transition: 'all 0.3s ease',
        // SUBTLE_SHADOW removed from stylesheet, now applied inline
    },

    // --- Filter Bar Wrapper (Web Only) ---
    webFilterBarWrapper: {
        width: '100%', 
        marginBottom: 40 
    },

    // --- Navigation Tabs Styles (The Vibrant Crystal Panel) ---
    navTabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40, 
        borderWidth: 0,
        overflow: 'hidden',
        padding: 5, 
    },
    navTabButton: {
        flex: 1,
        paddingVertical: 18, 
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft:'8px',
        marginRight:'8px',
        marginHorizontal: 5,
        borderRadius: BUTTON_RADIUS, 
        transition: 'all 0.3s cubic-bezier(.4, 0, .2, 1)',
    },
    navTabsWebOverride: {
        width: '70%', 
        alignSelf: 'center', 
        borderRadius: GENEROUS_RADIUS, 
    },

    // --- Modal Styles (The Soft Pop-Up Card) ---
    modalOverlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    },
    modalContent: { 
        position: 'absolute', 
        top: '15%', 
        left: '50%', 
        transform: [{ translateX: -175 }], 
        width: 350, 
        borderRadius: GENEROUS_RADIUS, 
        maxHeight: '75%', 
        padding: 30, 
        borderWidth: 0,
        // DEEP_SOFT_SHADOW removed from stylesheet, now applied inline
    },
    modalTitle: {
        fontSize: 26, 
        fontWeight: '900',
    },
    modalItem: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18, 
        paddingHorizontal: 15,
        borderRadius: BUTTON_RADIUS,
        borderWidth: 1, 
        borderColor: '#00000010', 
        transition: 'all 0.2s ease-out',
        marginBottom: 10,
    },
    modalFooter: {
        paddingTop: 20,
    },
    applyButton: {
        paddingVertical: 18,
        borderRadius: GENEROUS_RADIUS, 
        alignItems: 'center',
        marginTop: 15,
        transition: 'all 0.3s ease',
    },
    applyButtonText: {
        // color: '#FFF' removed, now applied inline
        fontWeight: '900', 
        fontSize: 20, 
    }
});

export default HomeScreen;