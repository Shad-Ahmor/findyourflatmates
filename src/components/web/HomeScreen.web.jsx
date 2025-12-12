// src/screens/HomeScreen.web.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
 SafeAreaView, ScrollView, View, Text, Image, Dimensions, Alert, Modal, FlatList, TouchableOpacity, StyleSheet, Platform
} from 'react-native'; 
import { useTheme } from '../../theme/theme.js'; 
import PropertyListing from './PropertyListing.web.jsx';
import WebFilterBar from './WebFilterBar.jsx';
import Icon from 'react-native-vector-icons/Ionicons'; 

const { width: windowWidth } = Dimensions.get('window'); // width को windowWidth से बदला गया
const BREAKPOINT = 768;
const MAX_WEB_WIDTH_VALUE = 1200; // Web के लिए Max width
const MAX_WEB_WIDTH = `${MAX_WEB_WIDTH_VALUE}px`; 

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
  const { colors, SUBTLE_SHADOW } = useTheme(); // SUBTLE_SHADOW को useTheme से लिया गया
  
  // --- Responsive State ---
  const [isWebOrTablet, setIsWebOrTablet] = useState(windowWidth > BREAKPOINT); 
  const [currentContainerWidth, setCurrentContainerWidth] = useState(windowWidth);

  // --- UI States ---
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
  
  // --- Dynamic Theme Constants (Derived from useTheme) ---
  const SHADOW_BASE = colors.text; 
  const ICON_ACCENT_COLOR = '#FFD700'; 

  // Deeper, Softer, and Wider Shadow for grand elements (Floating Look)
  const DEEP_SOFT_SHADOW_DYNAMIC = {
      boxShadow: `0 20px 40px 0px ${SHADOW_BASE}4D`, 
      shadowColor: SHADOW_BASE, 
      shadowOffset: { width: 0, height: 20 }, 
      shadowOpacity: 0.35, 
      shadowRadius: 40, 
      elevation: 25,
  };

  // 💡 FIX: SUBTLE_SHADOW_DYNAMIC को local define करने के बजाय,
  // अगर useTheme() में SUBTLE_SHADOW है, तो उसी का उपयोग करें,
  // अन्यथा इसे यहाँ define करें (पिछले लॉजिक के आधार पर)
  const SUBTLE_SHADOW_DYNAMIC = SUBTLE_SHADOW ? SUBTLE_SHADOW : {
      boxShadow: `0 8px 15px 0px ${SHADOW_BASE}40`,
      shadowColor: SHADOW_BASE,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 15,
      elevation: 10,
  };
  // -----------------------------------------------------------------


  useEffect(() => {
    const handleResize = ({ window }) => {
        setIsWebOrTablet(window.width > BREAKPOINT);
        setCurrentContainerWidth(window.width);
    };
    const subscription = Dimensions.addEventListener('change', handleResize);
    return () => {
      subscription?.remove();
    };
  }, []);

  const handleScroll = (event) => {
    // 💡 FIX: Hero item width को डायनेमिकली कैलकुलेट करें (कंटेनर width - horizontal padding)
    const containerWidth = isWebOrTablet ? Math.min(windowWidth, MAX_WEB_WIDTH_VALUE) : windowWidth;
    const itemWidth = containerWidth - (isWebOrTablet ? 40 : 40); // 20px padding left + 20px padding right
    
    // सुनिश्चित करें कि itemWidth शून्य न हो
    if (itemWidth > 0) {
      const slide = Math.round(event.nativeEvent.contentOffset.x / itemWidth);
      setCurrentSlide(slide);
    }
  };

  const goToSlide = (index) => {
    const containerWidth = isWebOrTablet ? Math.min(windowWidth, MAX_WEB_WIDTH_VALUE) : windowWidth;
    const itemWidth = containerWidth - (isWebOrTablet ? 40 : 40); 
    
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: index * itemWidth, animated: true });
    }
  };
  
  // --- Dropdown Logic (Same as before) ---
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

  // 🎨 Dynamic Stylesheet Generator
  const dynamicStyles = getStyles({ 
      colors, 
      isWebOrTablet, 
      DEEP_SOFT_SHADOW_DYNAMIC, 
      SUBTLE_SHADOW_DYNAMIC, 
      currentContainerWidth 
  });

  // 💡 Hero Image Width/Height Calculation:
  // Container width (maximized to MAX_WEB_WIDTH on web, or windowWidth on mobile)
  const heroContainerWidth = isWebOrTablet 
      ? Math.min(windowWidth, MAX_WEB_WIDTH_VALUE) 
      : windowWidth; 
      
  // Actual image width (container width minus padding)
  const heroImageWidth = heroContainerWidth - 40; 
  // Aspect Ratio: Web: 2.2:1 (wide), Mobile: 1.5:1 (tall)
  const heroImageHeight = heroImageWidth / (isWebOrTablet ? 2.2 : 1.5);
  
  const modalData = 
    modalVisible.type === 'city' ? cities :
    modalVisible.type === 'bhk' ? bhkOptions :
    modalVisible.type === 'status' ? propertyStatus : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={dynamicStyles.scrollContentWeb}>

        {/* Hero Slider */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={[dynamicStyles.heroSliderContainer, { height: heroImageHeight,flexGrow:'0.1' }]} // Set dynamic height
          contentContainerStyle={dynamicStyles.heroSliderContent}
        >
          {heroImages.map((img, index) => (
            <Image
              key={index}
              source={img}
              style={[
                dynamicStyles.heroImageBase, 
                DEEP_SOFT_SHADOW_DYNAMIC,
                { 
                  width: heroImageWidth, // Set dynamic width
                  height: heroImageHeight, // Set dynamic height
                  marginRight: 20, 
                  backgroundColor: colors.border,
                  boxShadow: `inset 0 0 20px ${colors.white}40`
                }
              ]}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
    
        {/* Dots - Enhanced Glow and Animation */}
        <View style={dynamicStyles.dotsContainer}>
          {heroImages.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToSlide(index)}
              style={[
                dynamicStyles.dotStyle, 
                SUBTLE_SHADOW_DYNAMIC, 
                { 
                  backgroundColor: colors.primary, 
                  opacity: index === currentSlide ? 1 : 0.35, 
                  transform: [{ scale: index === currentSlide ? 1.5 : 1 }], 
                  boxShadow: index === currentSlide 
                    ? `0 0 15px 5px ${colors.primary + 'CC'}` 
                    : SUBTLE_SHADOW_DYNAMIC.boxShadow,
                }
              ]}
            />
          ))}
        </View>
        
        {/* Filters (WebFilterBar) */}
        {/* <View style={dynamicStyles.webFilterBarWrapper}>
            <WebFilterBar
                colors={colors}
                city={city} bhkType={bhkType} status={status} houseType={houseType}
                setHouseType={setHouseType}
                openDropdown={openDropdown}
                searchText={searchText}
                setSearchText={setSearchText}
            />
        </View> */}


        {/* Navigation Tabs (The Vibrant Crystal Panel) */}
        <View style={[
                dynamicStyles.navTabsContainer, 
                { 
                    backgroundColor: colors.card,
                    ...DEEP_SOFT_SHADOW_DYNAMIC, 
                }
            ]}>
          {navOptions.map(option => (
            <TouchableOpacity
              key={option}
              onPress={() => setSelectedNav(option)} 
              activeOpacity={0.7} 
              style={[
                        dynamicStyles.navTabButton,
                        { 
                            backgroundColor: selectedNav === option ? colors.primary : colors.card,
                            borderRightWidth: option !== navOptions[navOptions.length - 1] ? 1 : 0,
                            borderRightColor: colors.border + '50', 
                            
                            ...SUBTLE_SHADOW_DYNAMIC, 
                            shadowColor: selectedNav === option ? colors.primary : SHADOW_BASE, 
                            
                            transform: [{ scale: selectedNav === option ? 1.05 : 1 }],
                            transition: 'all 0.3s cubic-bezier(.4, 0, .2, 1)',
                        }
              ]}
            >
              <Text style={{ 
                        color: selectedNav === option ? colors.white : colors.text, 
                        fontWeight: '900', 
                        fontSize: isWebOrTablet ? 18 : 15, // Responsive Font Size
                        textShadowColor: selectedNav === option ? `${colors.white}66` : 'transparent',
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
      <Modal 
          transparent 
          visible={modalVisible.visible} 
          animationType={isWebOrTablet ? "fade" : "slide"} // Mobile: Slide from bottom
      >
        <TouchableOpacity 
            style={dynamicStyles.modalOverlay} 
            onPress={() => setModalVisible({ type: '', visible: false })} 
            activeOpacity={1}
        />
        <View style={[
            dynamicStyles.modalContent, 
            DEEP_SOFT_SHADOW_DYNAMIC, 
            { 
                backgroundColor: colors.card, 
                borderColor: colors.border 
            }
        ]}>
            {/* Modal Title */}
            <Text style={[dynamicStyles.modalTitle, { color: colors.text }]}>
                {modalVisible.type === 'city' ? 'Select Grand City' : modalVisible.type === 'bhk' ? 'Select Enchanted Rooms' : 'Select Property Status'}
            </Text>
            <View style={{ height: 1, backgroundColor: colors.border + '50', marginVertical: 15 }} />

          <FlatList
            data={modalData}
            keyExtractor={(item, idx) => item.toString()}
            renderItem={({ item }) => {
                      const isSelected = tempSelection.includes(item);
                      return (
            <TouchableOpacity
              style={[
                  dynamicStyles.modalItem, 
                  SUBTLE_SHADOW_DYNAMIC, 
                  { 
                      backgroundColor: isSelected ? colors.primary + '10' : colors.background,
                      shadowColor: isSelected ? colors.primary : SHADOW_BASE, 
                      transform: [{ scale: isSelected ? 1.02 : 1 }],
                  }
              ]}
              onPress={() => toggleTempSelection(item)}
              activeOpacity={0.8}
            >
              <Text style={{ color: colors.text, fontWeight: isSelected ? '900' : '600', fontSize: 16 }}>{item}</Text>
              {isSelected && <Icon name="sparkles" size={24} color={ICON_ACCENT_COLOR} />}
            </TouchableOpacity>
                      )}}
          />
          
              {/* Apply Button Footer */}
              <View style={dynamicStyles.modalFooter}>
                  <TouchableOpacity 
                      style={[
                          dynamicStyles.applyButton, 
                          { 
                              backgroundColor: colors.primary,
                              boxShadow: `0 10px 20px 0px ${colors.primary + 'CC'}`,
                              shadowColor: colors.primary,
                              ...DEEP_SOFT_SHADOW_DYNAMIC 
                          }
                      ]}
                      onPress={applySelection}
                      activeOpacity={0.7}
                  >
                      <Text style={[dynamicStyles.applyButtonText, { color: colors.white }]}>Apply Magical Filters ({tempSelection.length} Selected)</Text> 
                  </TouchableOpacity>
              </View>

        </View>
      </Modal>

    </SafeAreaView>
  );
};

// 🎨 Theme and Responsive Stylesheet Generator
const getStyles = ({ colors, isWebOrTablet, DEEP_SOFT_SHADOW_DYNAMIC, SUBTLE_SHADOW_DYNAMIC, currentContainerWidth }) => {
    
    // Responsive Constants
    const HORIZONTAL_PADDING = isWebOrTablet ? 40 : 20;
    const CONTAINER_WIDTH = isWebOrTablet ? MAX_WEB_WIDTH : '100%';
    const MODAL_WIDTH = isWebOrTablet ? 350 : '90%';
    const MODAL_LEFT_TRANSFORM = isWebOrTablet ? -175 : '-50%';
    
    // Calculate the actual width of the scroll view on web
    const webScrollWidth = Math.min(currentContainerWidth, MAX_WEB_WIDTH_VALUE);

    return StyleSheet.create({
        // --- Scroll Content Wrapper ---
        scrollContentWeb: {
            alignSelf: 'center', 
            paddingHorizontal: HORIZONTAL_PADDING, 
            paddingTop: 30,
            paddingBottom: 50, 
            width: CONTAINER_WIDTH,
            maxWidth: MAX_WEB_WIDTH,
        },

        // --- Hero Slider ---
        heroImageBase: {
            borderRadius: GENEROUS_RADIUS, 
        },
        heroSliderContainer: {
            marginBottom: 10,
            overflow: 'visible',
            // Mobile में पूरी चौड़ाई लेगा (padding scrollContentWeb से आएगा)
            // Web में, यह MAX_WEB_WIDTH के अंदर रहेगा
            width: isWebOrTablet ? webScrollWidth - HORIZONTAL_PADDING : 'auto', 
            alignSelf: 'center',
        },
        heroSliderContent: {
            // Mobile पर, images को किनारे पर जाने दें। Web पर, उन्हें center करें।
            paddingHorizontal: isWebOrTablet ? 0 : 0, 
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
        },

        // --- Filter Bar Wrapper (Web Only) ---
        webFilterBarWrapper: {
            width: '100%', 
            marginBottom: isWebOrTablet ? 40 : 20, // Mobile पर कम मार्जिन
        },

        // --- Navigation Tabs Styles (The Vibrant Crystal Panel) ---
        navTabsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: isWebOrTablet ? 40 : 20, 
            overflow: 'hidden',
            padding: 5, 
            // 💡 FIX: Responsive Width and Alignment
            width: isWebOrTablet ? '50%' : '95%',
            maxWidth: 500, // Tablet/Web पर मैक्स 500px तक सीमित करें
            alignSelf: 'center', 
            borderRadius: GENEROUS_RADIUS, 
        },
        navTabButton: {
            flex: 1,
            paddingVertical: isWebOrTablet ? 18 : 14, // Mobile पर कम पैडिंग
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 5,
            borderRadius: BUTTON_RADIUS, 
            transition: 'all 0.3s cubic-bezier(.4, 0, .2, 1)',
        },

        // --- Modal Styles (The Soft Pop-Up Card) ---
        modalOverlay: { 
            flex: 1, 
            backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        },
        modalContent: { 
            position: isWebOrTablet ? 'absolute' : 'flex', // Mobile पर flex position
            top: isWebOrTablet ? '15%' : 'auto', 
            bottom: isWebOrTablet ? 'auto' : 0, // Mobile पर bottom से स्नैप करें
            left: isWebOrTablet ? '50%' : '50%', 
            transform: [{ translateX: MODAL_LEFT_TRANSFORM }, { translateY: isWebOrTablet ? 0 : 0 }], // Web पर X ट्रांसलेट
            width: MODAL_WIDTH, 
            height: isWebOrTablet ? 'auto' : '50%', // Mobile पर 50% height
            borderRadius: GENEROUS_RADIUS, 
            borderBottomLeftRadius: isWebOrTablet ? GENEROUS_RADIUS : 0, // Mobile पर bottom corners फ्लैट
            borderBottomRightRadius: isWebOrTablet ? GENEROUS_RADIUS : 0,
            maxHeight: '75%', 
            padding: 30, 
            borderWidth: 0,
            overflow: 'hidden', // Ensure content stays inside
        },
        modalTitle: {
            fontSize: isWebOrTablet ? 26 : 22, 
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
            fontWeight: '900', 
            fontSize: isWebOrTablet ? 20 : 18, // Responsive Font Size
        }
    });
};

export default HomeScreen;