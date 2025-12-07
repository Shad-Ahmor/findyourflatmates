// src/components/web/navigation/WebHeader.web.jsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/theme';
import { useAuth } from '../../../context/AuthContext';

// Import Screens
import HomeScreen from '../HomeScreen.web.jsx';

// Glassmorphism Blur (web only)
const GLASS_STYLE = Platform.select({
  web: {
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  }
});

const WebAppHeader = () => {
  const navigation = useNavigation();
  const { colors, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const currentRouteName =
    navigation.getState().routes[navigation.getState().index].name;

  const screens = [
    { name: "Main", label: "Home", icon: "home-outline" },
    { name: "MessagingList", label: "Messages", icon: "chatbubble-ellipses-outline" },
    { name: "CreateListing", label: "Create Listing", icon: "add-circle-outline" },
    { name: "MyListings", label: "My Listings", icon: "list-outline" },
  ];

  const hS = getHeaderStyles(colors);

  // ===========================
  // 🔥 LOGOUT API CALL
  // ===========================
  const handleLogout = async () => {
    try {
      await fetch("/api/flatmate/logout", {
        method: "POST",
        credentials: "include"
      });

      logout(); // Remove auth context data
      navigation.navigate("Main");
    } catch (err) {
      console.log("Logout Error:", err);
    }
  };

  return (
    <View
      style={[
        hS.headerContainer,
        GLASS_STYLE,
        { backgroundColor: colors.card + "CC" } // transparency
      ]}
    >
      {/* 🔥 Left Logo */}
      <TouchableOpacity onPress={() => navigation.navigate("Main")}>
        <Text style={[hS.logoText, { color: colors.primary }]}>FlatMates</Text>
      </TouchableOpacity>

      {/* 🔥 Middle Navigation */}
      {Platform.OS === "web" && (
        <View style={hS.navButtons}>
          {screens.map((screen, index) => {
            const isActive = screen.name === currentRouteName;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(screen.name)}
                style={[
                  hS.navButton,
                  {
                    backgroundColor: isActive ? colors.primary : colors.card,
                    transform: [{ scale: isActive ? 1.07 : 1 }],
                    borderColor: isActive ? colors.primary : colors.border
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
            size={22}
            color={colors.primary}
          />
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          onPress={() => navigation.navigate("FlatmateSetup")}
          style={[hS.circleButton, { backgroundColor: colors.backgroundLight }]}
        >
          <Icon name="person-circle-outline" size={28} color={colors.primary} />
        </TouchableOpacity>

        {/* 🚀 LOGOUT BUTTON (With API Call) */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[hS.circleButton, { backgroundColor: colors.backgroundLight }]}
        >
          <Icon name="log-out-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};


// ================================
// MAIN SCREEN WRAPPER
// ================================
const WebHeader = ({ navigation, route }) => {
  const { colors } = useTheme();
  const mS = getMainStyles(colors);

  return (
    <View style={[mS.wrapper, { backgroundColor: colors.background }]}>
      <View style={mS.headerWrapper}>
        <WebAppHeader />
      </View>

      <ScrollView contentContainerStyle={mS.scrollContainer}>
        <HomeScreen navigation={navigation} route={route} />
      </ScrollView>
    </View>
  );
};


// ==================================================
// 🌈 STYLES (BEAUTIFIED UI)
// ==================================================
const getHeaderStyles = (colors) =>
  StyleSheet.create({
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      paddingHorizontal: 22,
      borderRadius: 24,
      marginHorizontal: 20,
      marginTop: 14,
      shadowColor: colors.shadow,
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
      elevation: 10,
    },

    logoText: {
      fontSize: 30,
      fontWeight: "900",
      letterSpacing: 0.5,
    },

    navButtons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },

    navButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 40,
      borderWidth: 1,
      transitionDuration: "0.3s",
      ...Platform.select({ web: { cursor: "pointer" } }),
    },

    navButtonText: {
      fontSize: 15,
      fontWeight: "700",
    },

    rightButtons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    circleButton: {
      width: 42,
      height: 42,
      borderRadius: 999,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 6,
      elevation: 6,
    },
  });


// ================================
// MAIN WRAPPER STYLES
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
    },
    scrollContainer: {
      flexGrow: 1,
      paddingTop: 10,
      width: "96%",
      alignSelf: "center",
    },
  });

export default WebHeader;
