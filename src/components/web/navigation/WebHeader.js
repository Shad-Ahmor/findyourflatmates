// src/components/web/navigation/WebHeader.web.jsx

import React, { useState } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/theme';
import { useAuth } from '../../../context/AuthContext';
// 🚀 NEW: authService से client-side logout फ़ंक्शन इंपोर्ट करें
import { logoutUser } from '../../../services/authService'; 

// --- CONSTANTS & RESPONSIVENESS ---
const { width } = Dimensions.get('window');
const BREAKPOINT = 768;
const isMobile = width <= BREAKPOINT;

// Glassmorphism Blur (web only)
const GLASS_STYLE = Platform.select({
  web: {
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  }
});


// =================================================================
// 🚀 WebAppHeader (The actual Header Component)
// =================================================================
export const WebAppHeader = ({ activeScreenName, allowedScreenNames }) => {
  const navigation = useNavigation();
  const { colors, toggleTheme } = useTheme();
  const { logout } = useAuth(); // Auth context cleaner
  
  // 💡 NEW STATE: मोबाइल मेनू को नियंत्रित करने के लिए
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Dynamic check
  const isWebOrTablet = width > BREAKPOINT; 

  // 🚨 FIX: activeScreenName prop का उपयोग करें
  const currentRouteName = activeScreenName; 

  // Navigation Links - Master List
  const masterScreens = [
    { name: "Main", label: "Home", icon: "home-outline" },
    { name: "MessagingList", label: "Messages", icon: "chatbubble-ellipses-outline" },
    { name: "CreateListing", label: "Create Listing", icon: "add-circle-outline" },
    { name: "MyListings", label: "My Listings", icon: "list-outline" },
  ];
  
  // 🛑 KEY CHANGE 2: Master List को allowedScreenNames के आधार पर फ़िल्टर करें
  const screens = masterScreens.filter(screen => 
    !allowedScreenNames || allowedScreenNames.includes(screen.name)
  );

  // Dynamic Styles
  const hS = getHeaderStyles(colors, isWebOrTablet);

  // ===========================
  // 🔥 LOGOUT API CALL (MODIFIED)
  // ===========================
  const handleLogout = async () => {
    try {
      // 🛑 REMOVED: Backend fetch call: 
      // await fetch("/api/flatmate/logout", { method: "POST", credentials: "include" });

      // 🚀 NEW: Call the centralized Firebase Client SDK logout function
      await logoutUser(); 

      logout(); // Remove auth context data
      
      // 💡 FIX: Home पर नेविगेट करें
      navigation.navigate("Main", { screen: undefined }); 
      
    } catch (err) {
      console.log("Logout Error:", err);
      // Fallback logout for client-side state
      logout();
      navigation.navigate("Main", { screen: undefined });
    }
  };
  
  // 💡 NEW LOGIC: मोबाइल मेनू को टॉगल करें
  const handleMobileMenu = () => {
      setIsMenuOpen(prev => !prev);
  }

  // 💡 HELPER: नेविगेट करें और मेनू बंद करें
  const navigateAndCloseMenu = (screenName) => {
      navigation.navigate('Main', { screen: screenName === 'Main' ? undefined : screenName }); 
      setIsMenuOpen(false); // मेनू बंद करें
  }
  
  // 💡 HELPER: नेविगेट करें (External Stack screens के लिए, जैसे Profile)
  const navigateToExternalScreen = (screenName) => {
      navigation.navigate(screenName);
      setIsMenuOpen(false); 
  }
  
  // =================================================================
  // RENDER START
  // =================================================================
  return (
    <>
      <View
        style={[
          hS.headerContainer,
          GLASS_STYLE,
          { backgroundColor: colors.card + (isWebOrTablet ? "CC" : "") } 
        ]}
      >
        
        {/* 🔥 LEFT SIDE CONTAINER (Menu Button + Logo) */}
        <View style={hS.leftContainer}>
            {/* 🚨 MOVED: Mobile Menu Button (Visible only on Mobile, now on the far left) */}
            {!isWebOrTablet && (
                <TouchableOpacity
                    onPress={handleMobileMenu}
                    style={[hS.circleButton, { backgroundColor: colors.backgroundLight }]}
                >
                    {/* 💡 Icon change based on menu state */}
                    <Icon name={isMenuOpen ? "close-outline" : "menu-outline"} size={26} color={colors.primary} />
                </TouchableOpacity>
            )}

            {/* 🔥 Logo */}
            <TouchableOpacity onPress={() => navigateAndCloseMenu("Main")}>
                <Text style={[hS.logoText, { color: colors.primary }]}>FYF</Text>
            </TouchableOpacity>
        </View>


        {/* 🔥 Middle Navigation (Hidden on Mobile) */}
        {Platform.OS === "web" && isWebOrTablet && (
          <View style={hS.navButtons}>
            {/* 🛑 फ़िल्टर की गई 'screens' सूची का उपयोग करें */}
            {screens.map((screen, index) => {
              // 🚨 FIX: currentRouteName (activeScreenName) का उपयोग करें
              const isActive = screen.name === currentRouteName;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigateAndCloseMenu(screen.name)}
                  style={[
                    hS.navButton,
                    {
                      backgroundColor: isActive ? colors.primary : colors.card,
                      borderColor: isActive ? colors.primary : colors.border,
                    }
                  ]}
                >
                  <Icon
                    name={screen.icon}
                    size={20}
                    color={isActive ? colors.white : colors.text + "AA"}
                  />
                  <Text
                    style={[
                      hS.navButtonText,
                      { color: isActive ? colors.white : colors.text }
                    ]}
                  >
                    {screen.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* 🔥 Right Side Buttons */}
        <View style={hS.rightButtons}>
          
          {/* Theme Toggle */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={[hS.circleButton, { backgroundColor: colors.backgroundLight }]}
          >
            <Icon
              name={colors.mode === "dark" ? "moon" : "sunny"}
              size={isWebOrTablet ? 22 : 20}
              color={colors.primary}
            />
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity
            onPress={() => navigateToExternalScreen("FlatmateSetup")} // External screen, use simple navigation
            style={[hS.circleButton, { backgroundColor: colors.backgroundLight }]}
          >
            <Icon name="person-circle-outline" size={isWebOrTablet ? 28 : 26} color={colors.primary} />
          </TouchableOpacity>

          {/* LOGOUT BUTTON (Hidden on Mobile to save space, assuming it's in a profile menu) */}
          {isWebOrTablet && (
              <TouchableOpacity
                  onPress={handleLogout}
                  style={[hS.circleButton, { backgroundColor: colors.backgroundLight }]}
              >
                <Icon name="log-out-outline" size={isWebOrTablet ? 22 : 20} color={colors.text} />
              </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* =================================================== */}
      {/* 📱 MOBILE DROPDOWN MENU (Visible only on Mobile if isMenuOpen) */}
      {/* =================================================== */}
      {!isWebOrTablet && isMenuOpen && (
        <View style={[hS.mobileMenuContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* 🛑 फ़िल्टर की गई 'screens' सूची का उपयोग करें */}
          {screens.map((screen, index) => {
            const isActive = screen.name === currentRouteName;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => navigateAndCloseMenu(screen.name)}
                style={[
                  hS.mobileMenuButton,
                  { 
                      borderBottomWidth: index === screens.length - 1 ? 0 : 1, 
                      borderColor: colors.border 
                  }
                ]}
              >
                <Icon
                  name={screen.icon}
                  size={22}
                  color={isActive ? colors.primary : colors.text}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={[
                    hS.mobileMenuButtonText,
                    { color: isActive ? colors.primary : colors.text }
                  ]}
                >
                  {screen.label}
                </Text>
              </TouchableOpacity>
            );
          })}
          
          {/* Mobile Logout Button (optional, based on your UX needs) */}
          <TouchableOpacity
              onPress={handleLogout}
              style={[hS.mobileMenuButton, { borderTopWidth: 1, borderColor: colors.border, marginTop: 10 }]}
          >
              <Icon name="log-out-outline" size={22} color={colors.error} style={{ marginRight: 10 }} />
              <Text style={[hS.mobileMenuButtonText, { color: colors.error }]}>Log Out</Text>
          </TouchableOpacity>

        </View>
      )}
      {/* =================================================== */}
    </>
  );
};


// ================================
// MAIN SCREEN WRAPPER (WebHeader / WebMainScreen)
// ================================
const WebHeader = ({ navigation, route, screensMap }) => {
  const { colors } = useTheme();
  const mS = getMainStyles(colors);

  // 1. Determine the currently requested internal screen from route params
  const currentInternalScreenName = route.params?.screen || 'Main';
  
  // 2. Get the Component from the map
  const ContentComponent = screensMap?.[currentInternalScreenName];
  
  // 🛑 KEY CHANGE 3: screensMap से अनुमत स्क्रीन नामों की सूची प्राप्त करें
  const allowedScreenNames = Object.keys(screensMap || {});
  
  // 3. Dynamic content rendering function
  const renderContent = () => {
      if (!ContentComponent) {
          // Fallback message for an invalid screen name
          return (
            <View style={{ padding: 50, alignItems: 'center' }}>
                <Text style={{ color: colors.error, fontSize: 20, fontWeight: 'bold' }}>
                    Error: Screen "{currentInternalScreenName}" not found.
                </Text>
                <Text style={{ color: colors.text }}>Please navigate back to the home screen.</Text>
            </View>
          );
      }
      // 🚨 FIX: Pass standard navigation/route props to the dynamically loaded content component
      return <ContentComponent navigation={navigation} route={route} />;
  }


  return (
    <View style={[mS.wrapper, { backgroundColor: colors.background }]}>
      <View style={mS.headerWrapper}>
        {/* 🚨 FIX: Pass the active screen name down to WebAppHeader for correct highlighting */}
        {/* 🛑 KEY CHANGE 4: allowedScreenNames को WebAppHeader को पास करें */}
        <WebAppHeader 
            activeScreenName={currentInternalScreenName} 
            allowedScreenNames={allowedScreenNames} // Pass the filtered list
        />
      </View>

      <ScrollView contentContainerStyle={mS.scrollContainer}>
        {/* 🚨 FIX: Replaced fixed <HomeScreen /> with dynamic content renderer */}
        {renderContent()}
      </ScrollView>
    </View>
  );
};


// ==================================================
// 🌈 STYLES (Dynamic/Responsive) (No Change)
// ==================================================
const getHeaderStyles = (colors, isWebOrTablet) => {
    const PADDING_H = isWebOrTablet ? 22 : 16;
    const PADDING_V = isWebOrTablet ? 14 : 10;
    const LOGO_SIZE = isWebOrTablet ? 30 : 24;
    const BUTTON_SIZE = isWebOrTablet ? 42 : 38;
    const NAV_GAP = isWebOrTablet ? 14 : 8;
    const HEADER_MARGIN = isWebOrTablet ? 20 : 0; 
    const BORDER_RADIUS = isWebOrTablet ? 24 : 0; 
    const MOBILE_GAP = 12;

    return StyleSheet.create({
        headerContainer: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: isWebOrTablet ? "space-between" : "flex-start", 
          gap: isWebOrTablet ? 0 : MOBILE_GAP, 
          paddingVertical: PADDING_V,
          paddingHorizontal: PADDING_H,
          borderRadius: BORDER_RADIUS,
          marginHorizontal: HEADER_MARGIN,
          marginTop: isWebOrTablet ? 14 : 0, 
          shadowColor: colors.shadow,
          shadowOpacity: isWebOrTablet ? 0.25 : 0.1, 
          shadowOffset: { width: 0, height: isWebOrTablet ? 6 : 2 },
          shadowRadius: isWebOrTablet ? 12 : 4,
          elevation: isWebOrTablet ? 10 : 4,
          zIndex: 99,
          borderBottomWidth: isWebOrTablet ? 0 : 1, 
          borderColor: colors.border,
        },
        leftContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: MOBILE_GAP,
            flex: isWebOrTablet ? 0 : 1, 
        },
        logoText: {
          fontSize: LOGO_SIZE,
          fontWeight: "900",
          letterSpacing: 0.5,
        },
        navButtons: {
          flexDirection: "row",
          alignItems: "center",
          gap: NAV_GAP,
          flexGrow: 1, 
          justifyContent: 'center',
        },
        navButton: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingVertical: isWebOrTablet ? 10 : 8,
          paddingHorizontal: isWebOrTablet ? 18 : 14,
          borderRadius: 40,
          borderWidth: 1,
          transitionDuration: "0.3s",
          ...Platform.select({ web: { cursor: "pointer", ':hover': { transform: 'scale(1.07)' } } }),
        },
        navButtonText: {
          fontSize: isWebOrTablet ? 15 : 14,
          fontWeight: "700",
        },
        rightButtons: {
          flexDirection: "row",
          alignItems: "center",
          gap: NAV_GAP,
          marginLeft: 'auto', 
        },
        circleButton: {
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderRadius: 999,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: colors.shadow,
          shadowOpacity: 0.1, 
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 3,
          elevation: 3,
        },
        mobileMenuContainer: {
            position: 'absolute',
            top: 60, 
            left: 0,
            right: 0,
            zIndex: 90, 
            paddingHorizontal: PADDING_H,
            paddingVertical: 10,
            borderBottomWidth: 1, 
            shadowColor: colors.shadow,
            shadowOpacity: 0.2, 
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 5,
            elevation: 8,
        },
        mobileMenuButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15,
        },
        mobileMenuButtonText: {
            fontSize: 16,
            fontWeight: '600',
        },
  });
};


// ================================
// MAIN WRAPPER STYLES (No Change)
// ================================
const getMainStyles = (colors) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    headerWrapper: {
      position: "sticky",
      top: 0,
      zIndex: 20,
      backgroundColor: colors.background, 
      
      ...Platform.select({
          web: {
              width: isMobile ? '100%' : 'auto', 
          }
      })
    },
    scrollContainer: {
      flexGrow: 1,
      paddingTop: 10,
      width: isMobile ? "100%" : "96%",
      alignSelf: "center",
      paddingHorizontal: isMobile ? 10 : 0, 
    },
  });

export default WebHeader