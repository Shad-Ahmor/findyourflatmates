// src/screens/ProfileScreen.jsx

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// Assuming useTheme is available via the path below (as suggested in previous files)
import { useTheme } from '../theme/theme'; 

// DUMMY PROFILE DATA
const demoProfile = {
  name: 'Shad',
  jobTitle: 'Software Engineer, RCP',
  isVerified: true,
  memberSince: 'Joined Oct 2023',
  bio: 'Quiet, organized professional seeking a peaceful 1BHK/Flatmate near the IT corridor. I work mostly remotely but value a clean and collaborative living space. Non-smoker, rarely hosts parties.',
  preferences: {
    budget: '₹18,000 - ₹25,000 / month',
    location: 'Hinjewadi / Kharadi, Pune',
    moveInDate: 'Flexible (Next 4 weeks)',
    lifestyle: 'Non-Smoker, No Pets',
    preferredGender: 'Female Flatmate',
  },
};

// Component for a single detail row
const DetailRow = ({ icon, label, value, colors }) => (
    <View style={styles.detailRow}>
        <Icon name={icon} size={20} color={colors.primary} style={styles.detailIcon} />
        <View style={styles.detailContent}>
            <Text style={[styles.detailLabel, { color: colors.text + '80' }]}>{label}</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
        </View>
    </View>
);

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();

  // Settings/Action Button Component
  const SettingsButton = ({ icon, text, onPress }) => (
      <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.card }]} 
          onPress={onPress}
      >
          <Icon name={icon} size={22} color={colors.primary} style={{ marginRight: 10 }} />
          <Text style={[styles.actionText, { color: colors.text }]}>{text}</Text>
          <Icon name="chevron-forward-outline" size={20} color={colors.text + '80'} />
      </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
      >
        
        {/* === 1. HEADER AND MAIN INFO === */}
        <View style={[styles.headerContainer, { borderBottomColor: colors.card }]}>
            
            {/* Avatar Placeholder */}
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>{demoProfile.name[0]}</Text>
            </View>
            
            <Text style={[styles.nameText, { color: colors.text }]}>{demoProfile.name}</Text>
            
            <View style={styles.titleRow}>
                <Text style={[styles.jobTitle, { color: colors.text + '90' }]}>{demoProfile.jobTitle}</Text>
                {demoProfile.isVerified && (
                    <Icon name="checkmark-circle" size={20} color="#34C759" style={{ marginLeft: 5 }} />
                )}
            </View>
            <Text style={[styles.memberSince, { color: colors.text + '60' }]}>
                {demoProfile.memberSince}
            </Text>

        </View>

        {/* === 2. BIOGRAPHY === */}
        <View style={[styles.section, { borderBottomColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About Me</Text>
            <Text style={[styles.bioText, { color: colors.text + '90' }]}>
                {demoProfile.bio}
            </Text>
        </View>

        {/* === 3. HOUSING PREFERENCES === */}
        <View style={[styles.section, { borderBottomColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Housing Preferences</Text>
            <DetailRow 
                icon="cash-outline" 
                label="Monthly Budget" 
                value={demoProfile.preferences.budget} 
                colors={colors}
            />
            <DetailRow 
                icon="pin-outline" 
                label="Preferred Location" 
                value={demoProfile.preferences.location} 
                colors={colors}
            />
            <DetailRow 
                icon="calendar-outline" 
                label="Target Move-in" 
                value={demoProfile.preferences.moveInDate} 
                colors={colors}
            />
             <DetailRow 
                icon="people-outline" 
                label="Flatmate Preference" 
                value={demoProfile.preferences.preferredGender} 
                colors={colors}
            />
            <DetailRow 
                icon="body-outline" 
                label="Lifestyle" 
                value={demoProfile.preferences.lifestyle} 
                colors={colors}
            />
        </View>
        
        {/* === 4. ACCOUNT ACTIONS === */}
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Account & Settings</Text>
            
            <SettingsButton 
                icon="create-outline" 
                text="Edit My Profile" 
                onPress={() => console.log('Edit Profile')} 
            />
            
            <SettingsButton 
                icon="bookmark-outline" 
                text="Saved Listings" 
                onPress={() => console.log('Saved Listings')} 
            />
            
             <SettingsButton 
                icon="log-out-outline" 
                text="Logout" 
                onPress={() => console.log('Logging Out')} 
            />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // --- Header ---
  headerContainer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  memberSince: {
    fontSize: 12,
    marginTop: 5,
  },

  // --- Sections ---
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 22,
  },

  // --- Details ---
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: Platform.OS === 'ios' ? 0.5 : 1, // iOS subtle border
    borderBottomColor: '#f0f0f0', // Light grey border (will be overridden by theme color in real app)
  },
  detailIcon: {
    width: 30,
    textAlign: 'center',
  },
  detailContent: {
    flex: 1,
    marginLeft: 10,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '400',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 2,
  },

  // --- Actions ---
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});