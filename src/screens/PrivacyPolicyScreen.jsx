import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  useWindowDimensions, // Used for modern responsive layouts
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { Shadow } from 'react-native-shadow-2'; 

// --- Style Configuration (Consistency and Aesthetics) ---
const PRIMARY_COLOR = '#4BCFFA'; // Sky Blue
const ACCENT_COLOR = '#FF9500'; 
const ERROR_COLOR = '#F44336';
const BACKGROUND_COLOR = '#F0F8FF'; 
const CARD_COLOR = '#FFFFFF';
const TEXT_COLOR = '#333';
const SUBTLE_TEXT_COLOR = '#555';
const GENEROUS_RADIUS = 20;

// =================================================================
// 🎯 MAIN COMPONENT: PrivacyPolicyScreen (CLEAN & RESPONSIVE - MODIFIED)
// =================================================================

const PrivacyPolicyScreen = () => {
    
    // ✅ Get window dimensions for responsiveness
    const { width } = useWindowDimensions();
    
    // Determine the breakpoint for layout change (e.g., Tablet/Desktop vs Mobile)
    const BREAKPOINT = 768;
    const isSmallScreen = width < BREAKPOINT;

    // --- Reusable Component for Text Blocks ---
    const P = ({ children, style = {} }) => <Text style={[styles.paragraph, isSmallScreen && styles.paragraphMobile, style]}>{children}</Text>;
    
    // ✅ FOCUSED COMPONENT: Highlighting text
    const Highlight = ({ children }) => <Text style={{ color: ACCENT_COLOR, fontWeight: '700' }}>{children}</Text>;
    
    const ListItem = ({ children }) => (
        <View style={styles.listItemContainer}>
            <Text style={[styles.listItem, { color: PRIMARY_COLOR }]}>•</Text>
            {/* ✅ Responsive list text size */}
            <Text style={[styles.listItemText, isSmallScreen && styles.listItemTextMobile]}>{children}</Text>
        </View>
    );

    // --- Reusable Component for Policy Section (Card UI) ---
    const PolicySection = ({ title, children, iconName }) => (
        <Shadow 
            distance={15} 
            startColor={'rgba(0, 0, 0, 0.08)'} 
            endColor={'#F7F9FB00'}
            containerStyle={styles.shadowContainer}
            offset={[0, 8]}
        >
            <View style={[styles.sectionContainer, isSmallScreen && styles.sectionContainerMobile]}>
                <View style={styles.sectionHeader}>
                    <Icon 
                        name={iconName} 
                        size={isSmallScreen ? 24 : 28} // Responsive Icon Size
                        color={PRIMARY_COLOR} 
                        style={styles.sectionIcon} 
                    />
                    <Text style={[styles.sectionTitle, isSmallScreen && styles.sectionTitleMobile]}>{title}</Text>
                </View>
                <View style={styles.sectionContent}>
                    {children}
                </View>
            </View>
        </Shadow>
    );
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView 
                contentContainerStyle={[
                    styles.scrollContent, 
                    isSmallScreen && styles.scrollContentMobile
                ]}
            >
                {/* ✅ ADAPTIVE WIDTH: Limits width on large screen, uses full width on mobile */}
                <View style={[styles.mainContainer, { maxWidth: isSmallScreen ? '100%' : 900 }]}>
                    
                    {/* 1️⃣ Title */}
                    <Text style={[styles.mainHeader, { color: PRIMARY_COLOR, fontSize: isSmallScreen ? 34 : 42 }]}>
                        Privacy Policy
                    </Text>
                    <P style={[styles.subHeader, isSmallScreen && styles.subHeaderMobile]}>
                        The Governing Privacy Policy for the **Find Your Flatmate Application**.
                        <Text style={{ fontStyle: 'italic', color: SUBTLE_TEXT_COLOR }}> | Last Modified: December 15, 2025</Text>
                    </P>

                    {/* 2️⃣ Introduction / Overview (LEGAL ENGLISH) */}
                    <PolicySection title="Preamble and Scope" iconName="book-outline">
                        <P>This Privacy Policy (the "Policy") meticulously details the practices by which **Find Your Flatmate App** ("the Company," "we," "us," or "our") collects, utilizes, safeguards, and discloses your personal data ("Personal Information") when you access or utilize our Services. Your **trust and the security of your Personal Information** are paramount to our operations.</P>
                        <P>By using our Services, you explicitly consent to the data practices described in this Policy.</P>
                    </PolicySection>

                    {/* 3️⃣ Information We Collect (PROFESSIONAL DETAIL) */}
                    <PolicySection title="Data Collection Protocol" iconName="person-add-outline">
                        
                        <Text style={[styles.subSectionTitle, isSmallScreen && styles.subSectionTitleMobile]}>a) Directly Provided User Identification Data:</Text>
                        <P>This information is collected when you register, create a listing, or contact us directly.</P>
                        <ListItem>Name and Contact Credentials (Phone Number).</ListItem>
                        <ListItem>**Email Address**: Collected strictly for providing **proper authentication, identity verification, security, and confidentiality**. This data is not used for unauthorized purposes.</ListItem>
                        <ListItem>Hashed Password (We store only the cryptographic hash, not the plaintext password).</ListItem>

                        <Text style={[styles.subSectionTitle, isSmallScreen && styles.subSectionTitleMobile]}>b) Listing and Transactional Data (Property Content):</Text>
                        <ListItem>Property descriptions, location coordinates, rental/sale price, and listing metadata.</ListItem>
                        <ListItem>**Property Image Data**: The Company **does not store the original image files**. We only store the **URLs (Uniform Resource Locators)** linking to the images you provide.</ListItem>
                        <ListItem>Inter-User Communication Data (Messages/Chats conducted within the Service, subject to Point Fee structure).</ListItem>

                        <Text style={[styles.subSectionTitle, isSmallScreen && styles.subSectionTitleMobile]}>c) Automatically Collected Usage and Technical Data:</Text>
                        <P>Collected to enhance performance and ensure service stability.</P>
                        <ListItem>IP Address and approximate device Geolocation.</ListItem>
                        <ListItem>Usage data (pages viewed, session duration, clickstream data), device identifiers, and crash logs.</ListItem>
                    </PolicySection>
                    
                    {/* 4️⃣ How We Use Your Information (INTEGRATING POINTS/ADS MODEL) */}
                    <PolicySection title="Purposes of Data Utilization" iconName="rocket-outline">
                        <P>Your information is primarily used for the following essential functions:</P>
                        <ListItem>To maintain **account security, authentication, and personalized access** (using your Email).</ListItem>
                        <ListItem>To facilitate the core function of the service: Displaying listings and relevant connections (Mediator Role).</ListItem>
                        <ListItem>To enable and manage **secure, Point-Based Messaging and communication channels** between users.</ListItem>
                        <ListItem>To track **Rewarded Ad viewing history** for the accurate calculation and allocation of **Virtual Points**.</ListItem>
                        <ListItem>To analyze Service usage for continuous improvement of app performance, features, and the user interface.</ListItem>
                        <ListItem>To comply with legal mandates, regulatory requirements, and enforce our Terms and Conditions.</ListItem>
                    </PolicySection>
                    
                    {/* 5️⃣ Cookies & Tracking Technologies */}
                    <PolicySection title="Cookies and Tracking Technologies" iconName="layers-outline">
                        <P>We, and our integrated third-party partners (including Ad Networks), deploy cookies, web beacons, and local storage mechanisms to sustain service operation, personalize your experience, and deliver targeted advertising.</P>
                        <P>Users possess the prerogative to control or restrict the utilization of cookies via their device or browser settings, though this may impact the functionality of the Service.</P>
                    </PolicySection>

                    {/* 6️⃣ Third-Party Services (AD NETWORKS ADDED) */}
                    <PolicySection title="Third-Party Service Providers and Ad Networks" iconName="puzzle-outline">
                        <P>We engage specific categories of third-party vendors for critical functionalities:</P>
                        <ListItem><Highlight>Advertising and Revenue (Ad Networks):</Highlight> Providers facilitating **Rewarded Advertisements** and ad performance tracking.</ListItem>
                        <ListItem><Highlight>Analytics:</Highlight> Services like Google Analytics (for usage metrics).</ListItem>
                        <ListItem><Highlight>Cloud Storage:</Highlight> Services (e.g., Cloudinary) used to store the **Image URLs** of listings securely.</ListItem>
                        <ListItem><Highlight>Geolocation:</Highlight> APIs (e.g., Google Maps) for listing location display.</ListItem>
                        <P style={[styles.paragraph, isSmallScreen && styles.paragraphMobile, { fontStyle: 'italic', marginTop: 10 }]}>These providers operate under their respective privacy policies. We exercise due diligence in selecting reputable partners but bear no liability for their independent practices.</P>
                    </PolicySection>

                    {/* 7️⃣ Data Sharing & Disclosure (LEGAL ENGLISH) */}
                    <PolicySection title="Data Disclosure and External Sharing" iconName="shuffle-outline">
                        <P style={{ fontWeight: 'bold' }}>The Company shall not lease, sell, or otherwise monetize your Personal Information to any unauthorized third party.</P>
                        <ListItem>With Your Consent: Your contact details are disclosed to the counterparty (Owner or Tenant) **only when you initiate a communication** or express direct interest in a Point-Based transaction.</ListItem>
                        <ListItem>Business Transfers: In the event of a merger or acquisition, user data may be transferred to the acquiring entity.</ListItem>
                        <ListItem>Legal Compliance: Disclosure may occur strictly when mandated by a court order, subpoena, or applicable law enforcement agency.</ListItem>
                    </PolicySection>

                    {/* 8️⃣ Data Security */}
                    <PolicySection title="Data Security Protocols" iconName="lock-closed-outline">
                        <P>We employ robust technological and organizational measures, including **data encryption**, secure server architecture, and access controls, to protect your Personal Information against unauthorized access or destruction.</P>
                        <P style={[styles.paragraph, isSmallScreen && styles.paragraphMobile, { fontStyle: 'italic', color: ERROR_COLOR }]}>Notwithstanding these efforts, absolute security in electronic transmission and storage cannot be mathematically guaranteed.</P>
                    </PolicySection>

                    {/* 9️⃣ User Rights & Consent (DATA DELETION EMPHASIZED) */}
                    <PolicySection title="User Data Rights and Affirmation of Consent" iconName="shield-half-outline">
                        <ListItem>Right of Access and Rectification: You are entitled to access and update your profile data at any time.</ListItem>
                        <ListItem>**Right of Erasure (Complete Deletion):** You maintain the absolute right to request the deletion of your account and all associated Personal Information and content, including stored **Image URLs**. This deletion shall be complete and permanent.</ListItem>
                        <ListItem>Withdrawal of Consent: You may withdraw consent for data processing; however, this may necessitate the cessation of your access to certain or all Services.</ListItem>
                        <P style={[styles.paragraph, isSmallScreen && styles.paragraphMobile, { marginTop: 10, fontWeight: 'bold' }]}>By utilizing the Services, you **irrevocably affirm your consent** to the collection, processing, and disclosure of your data as delineated in this Policy.</P>
                    </PolicySection>

                    {/* 🔟 Data Retention */}
                    <PolicySection title="Data Retention Policy" iconName="time-outline">
                        <P>We shall retain your Personal Information for the duration your account remains active, and subsequently, for such periods as are strictly necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.</P>
                    </PolicySection>

                    {/* 1️⃣1️⃣ International Users */}
                    <PolicySection title="International Data Transfer" iconName="globe-outline">
                        <P>If you access the Services from outside of India, your data will be processed and stored on servers located in India or by third-party processors globally. By continuing to use the Service, you consent to the **transfer of your data outside your country of residence**.</P>
                    </PolicySection>
                    
                    {/* 1️⃣2️⃣ Children’s Privacy */}
                    <PolicySection title="Children’s Privacy Protection" iconName="accessibility-outline">
                        <P style={{ fontWeight: 'bold' }}>The Service is strictly **not directed at individuals under the age of 18 years**.</P>
                        <P>If we ascertain that we have inadvertently collected Personal Information from a minor under 18 years of age without parental consent, we shall take immediate steps to **expunge such data** from our records.</P>
                    </PolicySection>

                    {/* 1️⃣3️⃣ Changes to This Policy */}
                    <PolicySection title="Amendments to the Policy" iconName="sync-outline">
                        <P>The Company reserves the right to amend or revise this Policy periodically. In the event of **material revisions**, we shall notify you through the application or via the email address registered with your account.</P>
                    </PolicySection>

                    {/* 1️⃣4️⃣ Contact Us */}
                    <PolicySection title="Official Contact Protocol" iconName="at-circle-outline">
                        <P>For any inquiries or concerns pertaining to this Privacy Policy, please contact our Data Compliance Officer:</P>
                        <P style={[styles.contactInfo, isSmallScreen && styles.contactInfoMobile]}>
                            <Text style={{ fontWeight: 'bold', color: TEXT_COLOR }}>Email: </Text> support@findyourflatmate.com<br/>
                        </P>
                    </PolicySection>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// =================================================================
// 🎨 STYLES (Base Styles + Responsive Overrides)
// =================================================================
const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: BACKGROUND_COLOR, 
    },
    // Desktop/Tablet Styles
    scrollContent: { 
        flexGrow: 1, 
        alignItems: 'center', 
        paddingVertical: 40, 
        paddingHorizontal: 20,
    },
    mainContainer: { 
        width: '100%',
        // maxWidth is handled inline
    },
    mainHeader: { 
        fontWeight: '900', 
        marginBottom: 5,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subHeader: {
        fontSize: 16,
        color: SUBTLE_TEXT_COLOR,
        marginBottom: 40, 
        textAlign: 'center',
        lineHeight: 24,
    },
    
    // --- Section Card Styles ---
    shadowContainer: {
        width: '100%',
        marginBottom: 25, 
    },
    sectionContainer: {
        backgroundColor: CARD_COLOR,
        borderRadius: GENEROUS_RADIUS,
        padding: 30, 
        borderWidth: 1, 
        borderColor: '#EEE',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20, 
        paddingBottom: 5,
    },
    sectionIcon: {
        marginRight: 15,
        opacity: 0.9,
    },
    sectionTitle: {
        fontSize: 26, 
        fontWeight: '900', 
        color: TEXT_COLOR,
        flex: 1,
        borderBottomWidth: 2, 
        borderBottomColor: BACKGROUND_COLOR, 
        paddingBottom: 10,
    },
    sectionContent: {
        paddingHorizontal: 5,
        marginTop: 10, 
    },
    subSectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: PRIMARY_COLOR,
        marginTop: 15,
        marginBottom: 10,
    },

    // --- Text Styles ---
    paragraph: {
        fontSize: 16, 
        lineHeight: 28, 
        color: SUBTLE_TEXT_COLOR,
        marginBottom: 10,
    },
    listItemContainer: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    listItem: {
        fontSize: 16,
        marginRight: 10,
        fontWeight: 'bold',
        marginTop: 2, 
    },
    listItemText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 26,
        color: SUBTLE_TEXT_COLOR,
    },
    contactInfo: {
        fontSize: 17,
        lineHeight: 30,
        color: TEXT_COLOR,
        marginTop: 10,
    },

    // =================================================================
    // 📱 MOBILE / SMALL SCREEN OVERRIDES
    // =================================================================
    scrollContentMobile: {
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    subHeaderMobile: {
        marginBottom: 30,
    },
    sectionContainerMobile: {
        padding: 20, // Smaller padding on mobile
    },
    sectionTitleMobile: {
        fontSize: 20, // Smaller heading on mobile
    },
    subSectionTitleMobile: {
        fontSize: 16,
    },
    paragraphMobile: {
        fontSize: 15,
        lineHeight: 25,
    },
    listItemTextMobile: {
        fontSize: 15,
        lineHeight: 24,
    },
    contactInfoMobile: {
        fontSize: 16,
    }
});

export default PrivacyPolicyScreen;