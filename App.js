// App.js
import * as React from 'react'; // React को इम्पोर्ट करना आवश्यक है क्योंकि हम एक कंपोनेंट रेंडर करेंगे
import { Platform } from 'react-native';

// पाथ को ठीक किया गया (पिछले निर्देशों के अनुसार, वे शायद src/ के अंदर हैं)
import MobileApp from './src/components/mobile/App.mobile.jsx'; 
import WebApp from './src/components/web/App.web.jsx';


// ======================================================
// ✅ फिक्स: एक सिंगल टॉप-लेवल डिफ़ॉल्ट एक्सपोर्ट
// ======================================================

const RootApp = () => {
  if (Platform.OS === 'web') {
    // यदि यह वेब है, तो WebApp कंपोनेंट को रेंडर करें
    return <WebApp />; // <--- यहाँ गलती है
  } else {
    // यदि यह मोबाइल (Android/iOS) है, तो MobileApp कंपोनेंट को रेंडर करें
    return <MobileApp />; // <--- यहाँ गलती है
  }
};
// अब हम केवल RootApp कंपोनेंट को डिफ़ॉल्ट रूप से एक्सपोर्ट करते हैं
export default RootApp;