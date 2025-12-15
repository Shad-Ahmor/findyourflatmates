import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  useWindowDimensions, 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { Shadow } from 'react-native-shadow-2'; 

// --- Style Configuration (Consistency and Aesthetics) ---
const PRIMARY_COLOR = '#4BCFFA'; 
const ACCENT_COLOR = '#FF9500'; 
const ERROR_COLOR = '#F44336';
const BACKGROUND_COLOR = '#F0F8FF'; 
const CARD_COLOR = '#FFFFFF';
const TEXT_COLOR = '#333';
const SUBTLE_TEXT_COLOR = '#555';
const GENEROUS_RADIUS = 20;

// =================================================================
// 🎯 MAIN COMPONENT: TermsScreen (PROFESSIONAL LEGAL ENGLISH)
// =================================================================

const TermsScreen = () => {
    
    // ✅ Get window dimensions for responsiveness
    const { width } = useWindowDimensions();
    const BREAKPOINT = 768;
    const isSmallScreen = width < BREAKPOINT;

    // --- Reusable Components (Responsive) ---
    const P = ({ children, style = {} }) => <Text style={[styles.paragraph, isSmallScreen && styles.paragraphMobile, style]}>{children}</Text>;
    const Highlight = ({ children }) => <Text style={{ color: ACCENT_COLOR, fontWeight: '700' }}>{children}</Text>;
    const ListItem = ({ children }) => (
        <View style={styles.listItemContainer}>
            <Text style={[styles.listItem, { color: PRIMARY_COLOR }]}>•</Text>
            <Text style={[styles.listItemText, isSmallScreen && styles.listItemTextMobile]}>{children}</Text>
        </View>
    );
    const PolicySection = ({ title, children, iconName }) => (
        <Shadow 
            distance={15} startColor={'rgba(0, 0, 0, 0.08)'} endColor={'#F7F9FB00'}
            containerStyle={styles.shadowContainer} offset={[0, 8]}
        >
            <View style={[styles.sectionContainer, isSmallScreen && styles.sectionContainerMobile]}> 
                <View style={styles.sectionHeader}>
                    {iconName && <Icon name={iconName} size={isSmallScreen ? 24 : 28} color={PRIMARY_COLOR} style={styles.sectionIcon} />}
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
                <View style={[styles.mainContainer, { maxWidth: isSmallScreen ? '100%' : 900 }]}>
                    
                    {/* 1️⃣ Title */}
                    <Text style={[styles.mainHeader, { color: PRIMARY_COLOR, fontSize: isSmallScreen ? 34 : 42 }]}>
                        Terms and Conditions of Service
                    </Text>
                    <P style={[styles.subHeader, isSmallScreen && styles.subHeaderMobile]}>
                        The Governing Terms for the **Find Your Flatmate Application**.
                        <Text style={{ fontStyle: 'italic', color: SUBTLE_TEXT_COLOR }}> | Last Modified: December 15, 2025</Text>
                    </P>

                    {/* 2️⃣ Acceptance of Binding Terms (FORMALIZED) */}
                    <PolicySection title="Acceptance and Assent to Terms" iconName="scale-outline">
                        <P>By accessing, utilizing, or otherwise engaging with this application (the "Service"), you hereby unequivocally and irrevocably **assent to be bound** by these Terms and Conditions (the "Terms"). Should you disagree with any clause or provision contained herein, <Highlight>your immediate and compulsory cessation of Service usage is mandated</Highlight>.</P>
                        <P>These Terms constitute the **entire and binding legal instrument** governing the relationship between you and **Find Your Flatmate App**.</P>
                    </PolicySection>

                    {/* 3️⃣ User Eligibility and Capacity (FORMALIZED) */}
                    <PolicySection title="User Eligibility and Legal Capacity" iconName="person-circle-outline">
                        <P>Use of the Service is strictly **prohibited for natural persons under the age of 18 years**. Furthermore, you warrant that you possess the requisite **full legal capacity, right, and authority** to enter into and be bound by this Agreement.</P>
                    </PolicySection>

                    {/* 4️⃣ Account Provision and Due Diligence (EMAIL PURPOSE LEGALIZED) */}
                    <PolicySection title="Account Integrity and Email Utilization" iconName="key-outline">
                        <P>The security and integrity of your account credentials shall remain your exclusive responsibility. You shall be held wholly accountable for all activities executed under your account.</P>
                        <ListItem>Your email address is mandatorily collected to ensure **proper authentication, confidentiality, identity, and security**. We reserve the right to deploy this email for transmitting **essential Service-related notices and product updates**.</ListItem>
                        <ListItem>Immediate notification to the Company is compulsory upon the discovery of any breach of security or documented unauthorized account use.</ListItem>
                    </PolicySection>
                    
                    {/* 5️⃣ Stipulations on Platform Utilization (SCOPE LEGALIZED) */}
                    <PolicySection title="Scope of Permitted and Prohibited Use" iconName="contract-outline">
                        <P>You shall utilize the Service exclusively for **lawful purposes** and in strict adherence to all applicable international, national, and local laws and regulations.</P>
                        <P style={{ fontWeight: 'bold', marginTop: 10 }}>The Service provides a robust intermediary platform for listing and searching various properties including <Highlight>Residential Units (Rooms, Flats, Houses, Bungalows), Commercial Stays (Hotels, PGs, Hostels)</Highlight>, and facilitating flatmate connections, offering competitive features and superior UX at no direct subscription cost.</P>
                        <ListItem>The submission or posting of listings deemed fraudulent, deceptive, or intentionally misleading is **expressly and unequivocally prohibited**.</ListItem>
                        <ListItem>Engagement in acts of harassment, spamming, or the transmission of malware or harmful code is strictly forbidden.</ListItem>
                    </PolicySection>
                    
                    {/* 6️⃣ Proprietary Content and Warranties (URL STORAGE/DELETION LEGALIZED) */}
                    <PolicySection title="User Content and Perpetual Deletion Rights" iconName="document-text-outline">
                        <P style={{ fontWeight: 'bold' }}>You retain all intellectual property rights associated with the content you submit ("User Content"). The Company acknowledges your perpetual and irrevocable right to delete your content.</P>
                        <ListItem>The Company **does not store original image files** pertaining to property listings. Only the **Uniform Resource Locators (URLs)** linking to the said images are stored (these URLs constitute User Content).</ListItem>
                        <ListItem>Upon the User's initiation of a deletion request for any property listing, all associated data, including details and image URLs, shall be **completely and permanently expunged** from the Company's system.</ListItem>
                    </PolicySection>

                    {/* 7️⃣ Exclusionary Conduct (FORMALIZED) */}
                    <PolicySection title="Exclusionary Conduct" iconName="alert-circle-outline">
                        <P>The following conduct is explicitly designated as excluded from the permissible use of the Service:</P>
                        <ListItem>The **systematic data extraction (data scraping)** or unauthorized replication of data from the Service.</ListItem>
                        <ListItem>Any endeavor to compromise the Service's **security apparatus or authentication protocols**.</ListItem>
                        <ListItem>Utilization of the platform for the promotion or facilitation of **illegal or morally reprehensible activities**.</ListItem>
                    </PolicySection>
                    
                    {/* 8️⃣ Financial Remuneration and Fee Structure (POINT SYSTEM LEGALIZED) */}
                    <PolicySection title="Financial Framework: Virtual Points and Transactions" iconName="wallet-outline">
                        <P style={{ fontWeight: 'bold' }}>The Service operates on a **Non-Subscription, Virtual Point-Based Framework**.</P>
                        <P>While the posting of listings and basic application access are provided gratuitously, access to enhanced features and interactions is predicated upon the use of an in-app virtual currency (the "Points"):</P>
                        
                        <Text style={[styles.subSectionTitle, isSmallScreen && styles.subSectionTitleMobile]}>Acquisition of Points:</Text>
                        <ListItem>Points may be accrued by users through the voluntary viewing of **Rewarded Advertisements** or via other designated in-app promotional channels.</ListItem>

                        <Text style={[styles.subSectionTitle, isSmallScreen && styles.subSectionTitleMobile, { marginTop: 15 }]}>Point Expenditure (Scope of Service):</Text>
                        <ListItem>The expenditure of Points is requisite for **accessing Detailed Property Information** and/or initiating contact with the **Listing Owner**.</ListItem>
                        <ListItem>Future functionalities, including messaging services, shall require the utilization of Points for **per-chat or initial communication fees**.</ListItem>

                        <P style={{ fontStyle: 'italic', marginTop: 10 }}>Points possess **zero inherent cash value** outside the confines of the Service and are not convertible to real-world monetary equivalents.</P>
                    </PolicySection>

                    {/* 9️⃣ Reliance on External Dependencies (FORMALIZED) */}
                    <PolicySection title="Reliance on External Dependencies and Third-Party Services" iconName="hardware-chip-outline">
                        <P>The Service may integrate or provide hyperlinks to external **Third-Party Services** (e.g., Ad Networks, Analytics, Payment Gateways). The Company explicitly **disclaims any and all liability** concerning the content, operational efficacy, or data security practices of these external entities.</P>
                    </PolicySection>

                    {/* 🔟 Proprietary Rights and Ownership (FORMALIZED) */}
                    <PolicySection title="Proprietary Rights and Intellectual Property" iconName="finger-print-outline">
                        <P>All intellectual property rights, title, and interest in and to the Service, including, but not limited to, all source code, software, documentation, design elements, logos, and trademarks, are and shall remain the **exclusive property** of **Find Your Flatmate App**.</P>
                    </PolicySection>

                    {/* 1️⃣1️⃣ Immediate Termination Clause (FORMALIZED) */}
                    <PolicySection title="Immediate Termination and Suspension of Access" iconName="skull-outline">
                        <P>The Company reserves the absolute and unilateral right to **suspend or permanently terminate your access** to the Service, at its sole discretion and without liability, for any cause whatsoever, including, without limitation, a **material breach of these Terms**. This action may be executed **without prior notice or warning**.</P>
                    </PolicySection>

                    {/* 1️⃣2️⃣ Warranty and Fitness Disclaimer (LEGAL DISCLAIMER) */}
                    <PolicySection title="Warranty and Fitness Disclaimer (AS-IS Basis)" iconName="shield-half-outline">
                        <P style={{ fontWeight: 'bold' }}>THE SERVICE IS PROVIDED STRICTLY ON AN "AS IS" AND "AS AVAILABLE" BASIS, DEVOID OF WARRANTIES OR GUARANTEES OF ANY NATURE.</P>
                        <P>The Company explicitly disclaims all warranties, whether express or implied, including, but not limited to, the implied warranties of **merchantability, fitness for a particular purpose, and non-infringement**. The Company does not warrant that the Service shall be **secure, uninterrupted, or free from defects or errors**.</P>
                    </PolicySection>

                    {/* 1️⃣3️⃣ Limitation of Corporate Liability (LEGAL LIMITATION) */}
                    <PolicySection title="Limitation of Corporate Liability" iconName="hand-coin-outline">
                        <P>In no event shall **Find Your Flatmate App** be held liable for any **indirect, incidental, special, consequential, or punitive damages**—including, without limitation, damages for loss of profits, data, use, or goodwill—arising from your access to, use of, or inability to access or use the Service.</P>
                    </PolicySection>
                    
                    {/* 1️⃣4️⃣ MEDIATOR ROLE AND USER RESPONSIBILITY (CRUCIAL LEGAL DISCLAIMER) */}
                    <PolicySection title="Mediator Status and Mandatory User Due Diligence" iconName="alert-triangle-outline">
                        <P style={{ fontWeight: 'bold', color: ERROR_COLOR }}>THE COMPANY'S ROLE IS STRICTLY LIMITED TO THAT OF AN INTERMEDIARY.</P>
                        <P>The Service functions solely as a **mediator** between the Listing Owner and the prospective Tenant/Buyer. We do not, in any capacity, verify the **authenticity, veracity, or legal standing** of any listing or user identity.</P>
                        <ListItem>The Company **does not collect documents or conduct police verification** for any user or property listed on the Service.</ListItem>
                        <ListItem>The responsibility for conducting comprehensive **identity verification, police checks, and due diligence** prior to finalizing any agreement with a counterparty (Tenant, Owner, or Flatmate) rests **exclusively and solely upon the User**.</ListItem>
                        <P style={{ marginTop: 10, fontWeight: 'bold' }}>Should you fail to perform the necessary verification, and consequently suffer any financial loss, fraud, or damage, you shall be deemed **solely responsible**. The Company shall bear no liability or responsibility for such resultant issues.</P>
                        <P style={{ marginTop: 10 }}>By accepting these Terms, you acknowledge that failure to read and adhere to these provisions, resulting in fraud or loss, **precludes you from holding the Company liable**.</P>
                    </PolicySection>
                    
                    {/* 1️⃣5️⃣ Mandatory Indemnification (FORMALIZED & STRENGTHENED) */}
                    <PolicySection title="Mandatory Indemnification" iconName="receipt-outline">
                        <P>You hereby covenant to **defend, indemnify, and hold harmless** **Find Your Flatmate App** against any and all claims, damages, obligations, losses, liabilities, costs, or debts arising from: (i) your utilization of and access to the Service; **(ii) your failure to conduct mandatory verification or due diligence** as stipulated herein; or (iii) your **breach of any material term** of these Terms.</P>
                    </PolicySection>

                    {/* 1️⃣6️⃣ Governing Legal Framework (FORMALIZED) */}
                    <PolicySection title="Governing Legal Framework and Jurisdiction" iconName="globe-outline">
                        <P>These Terms shall be governed by and construed in accordance with the laws of **India**, without reference to its conflict of law provisions. You agree to submit to the **exclusive jurisdiction** of the competent courts located in [Your State, e.g., Maharashtra].</P>
                    </PolicySection>

                    {/* 1️⃣7️⃣ Modification of Stipulations (FORMALIZED) */}
                    <PolicySection title="Unilateral Modification of Terms" iconName="sync-outline">
                        <P>The Company retains the absolute, unilateral right to **modify, amend, or replace** these Terms at any time. Continued use of the Service subsequent to such amendments shall constitute **binding acceptance** of the revised terms.</P>
                    </PolicySection>

                    {/* 1️⃣8️⃣ Official Contact Protocol (FORMALIZED) */}
                    <PolicySection title="Official Contact and Notice Protocol" iconName="at-circle-outline">
                        <P>All formal inquiries or legally binding notices regarding these Terms must be directed to:</P>
                        <P style={[styles.contactInfo, isSmallScreen && styles.contactInfoMobile]}>
                            <Text style={{ fontWeight: 'bold', color: TEXT_COLOR }}>Email: </Text> support@findyourflatmate.com<br/>
                            <Text style={{ fontWeight: 'bold', color: TEXT_COLOR }}>Entity: </Text> Find Your Flatmate App Headquarters
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

export default TermsScreen;