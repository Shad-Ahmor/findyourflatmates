// src/components/mobile/MobFilterBar.jsx
import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// Note: ScrollView is added here only if you need the filter row to scroll, 
// but we will mainly focus on the structure. If you face errors, remove ScrollView import.

const MobFilterBar = ({
  colors,
  city, bhkType, status, houseType,
  setHouseType,
  openDropdown,
  searchText,
  setSearchText
}) => {

  // Helper function to format filter text
  const formatFilterText = (data, defaultText) => 
    data.length === 0 ? defaultText : 
    data.length === 1 ? data[0] : 
    `${data.length} ${defaultText.split(' ')[0]} Selected`;

  const dynamicColor = colors.mode === 'light' ? '#fff' : colors.card;
  const borderColor = colors.mode === 'light' ? '#E5E7EB' : colors.border;
  const secondaryTextColor = colors.mode === 'light' ? '#888' : colors.textSecondary;

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>

      {/* 1. First Row: City Dropdown & Search Input (Combined) */}
      <View style={styles.topRowSection}>
          
          {/* City Dropdown (Left side, takes less space) */}
          <TouchableOpacity 
              style={[styles.cityPill, { backgroundColor: dynamicColor, borderColor: borderColor }]} 
              onPress={() => openDropdown('city')}
          >
              <Icon name="location-outline" size={20} color={colors.primary} style={{ marginRight: 6 }} />
              <Text 
                  numberOfLines={1} 
                  style={[styles.cityText, { color: city.length ? colors.text : secondaryTextColor }]}
              >
                  {formatFilterText(city, 'City')}
              </Text>
              <Icon name="chevron-down-outline" size={16} color={secondaryTextColor} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
          
          {/* Search Input (Right side, takes most space) */}
          <View style={[styles.searchInputContainer, { backgroundColor: dynamicColor, borderColor: borderColor }]}>
              <Icon name="search-outline" size={20} color={secondaryTextColor} style={styles.searchIcon} />
              <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder="Location, Budget, or Type"
                  placeholderTextColor={secondaryTextColor}
                  value={searchText}
                  onChangeText={setSearchText}
              />
          </View>
      </View>

      {/* 2. Second Row: House Type Segmented Control (Radio Button) */}
      <View style={styles.houseTypeRow}>
          
          <View style={[styles.radioContainer, { borderColor: borderColor }]}>
              {['Full House', 'Land/Plot'].map(opt => (
                  <TouchableOpacity
                      key={opt}
                      style={[
                          styles.segmentedButton, 
                          houseType === opt && { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                      ]}
                      onPress={() => setHouseType(opt)}
                  >
                      <Text style={{ 
                          color: houseType === opt ? colors.primary : colors.text, 
                          fontWeight: houseType === opt ? '600' : '500' 
                      }}>
                          {opt}
                      </Text>
                  </TouchableOpacity>
              ))}
          </View>
          
          {/* Remaining Filters (BHK and Status) - Now side-by-side or scrollable chips */}
          
          {/* BHK Multi Checkbox - Pill Filter */}
          <TouchableOpacity 
              style={[styles.pillDropdown, { backgroundColor: dynamicColor, borderColor: borderColor }]} 
              onPress={() => openDropdown('bhk')}
          >
              <Text style={[styles.pillText, { color: bhkType.length ? colors.text : secondaryTextColor }]}>
                  {formatFilterText(bhkType, 'BHK')}
              </Text>
              <Icon name="chevron-down-outline" size={16} color={secondaryTextColor} style={{ marginLeft: 6 }} />
          </TouchableOpacity>

          {/* Property Status - Pill Filter */}
          <TouchableOpacity 
              style={[styles.pillDropdown, { backgroundColor: dynamicColor, borderColor: borderColor }]} 
              onPress={() => openDropdown('status')}
          >
              <Text style={[styles.pillText, { color: status.length ? colors.text : secondaryTextColor }]}>
                  {formatFilterText(status, 'Status')}
              </Text>
              <Icon name="chevron-down-outline" size={16} color={secondaryTextColor} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16, // Added padding bottom for overall spacing
  },

  // --- Row 1 Styles: City and Search ---
  topRowSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12, // Space between row 1 and row 2
      gap: 10, // Space between City and Search input
  },

  cityPill: { 
      flexDirection: 'row', 
      justifyContent: 'flex-start',
      alignItems: 'center', 
      paddingHorizontal: 10, // px-2.5
      height: 48, 
      borderRadius: 12, 
      elevation: 2, 
      borderWidth: 1, 
      flexShrink: 1, // Allow shrinking
  },
  cityText: { 
      fontSize: 14,
      fontWeight: '500',
      maxWidth: 65, // Restrict width so search bar gets enough space
  },

  searchInputContainer: { 
      flex: 1, // Takes remaining space
      flexDirection: 'row', 
      alignItems: 'center', 
      borderRadius: 12, 
      paddingHorizontal: 10, 
      height: 48, // Consistent height
      elevation: 2, 
      borderWidth: 1,
  },
  searchIcon: { 
      marginRight: 8,
      marginLeft: 4, // Adjust icon placement
  }, 
  searchInput: { 
      flex: 1, 
      height: '100%', 
      fontSize: 14, // Smaller font for dense row
  },

  // --- Row 2 Styles: House Type and Other Pills ---
  houseTypeRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, // Space between main sections
  },
  
  // House Type Segmented Control (Radio)
  radioContainer: { 
    flexDirection: 'row', 
    borderWidth: 1, 
    borderRadius: 50, 
    overflow: 'hidden',
    flexShrink: 0, 
  },
  segmentedButton: { 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    justifyContent: 'center',
  },

  // BHK & Status Pill Dropdowns (Now alongside House Type)
  pillDropdown: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    paddingVertical: 8,
    borderRadius: 50, 
    borderWidth: 1, 
    flex: 1, // Distribute remaining space among these two
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
  }
});

export default MobFilterBar;