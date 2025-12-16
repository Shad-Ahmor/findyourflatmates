// encrypt_config.js

const CryptoJS = require('crypto-js');
// 🛑 सुनिश्चित करें कि 'crypto-js' NPM पैकेज इंस्टॉल है
// (npm install crypto-js)

// ====================================================================
// 🚨 इन दो मानों को अपनी वास्तविक .env फ़ाइल से बदलें 
// ====================================================================

// 1. आपका मास्टर सीक्रेट की (VITE_ENCRYPTION_SECRET_KEY का मान)
const SECRET_KEY = "1QUa97x7+RK30ydey7OINl+oFNPZASMvfn40bmRB/Zw="; 

// 2. वह सादा मान (Plain Value) जिसे आप एन्क्रिप्ट करना चाहते हैं (उदाहरण के लिए, आपका Firebase API Key)
const PLAIN_TEXT_TO_ENCRYPT = "gdlsoftware.firebasestorage.app"; 

// ====================================================================

// 🔐 ENCRYPT FUNCTION
const encryptedData = (data) => {
  try {
    const stringData = typeof data === "string" ? data : JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
    return encrypted;
  } catch (err) {
    console.error("Encryption failed:", err);
    return null;
  }
};


// एन्क्रिप्शन चलाएँ
const encryptedValue = encryptedData(PLAIN_TEXT_TO_ENCRYPT);

console.log("===================================");
console.log("✅ ENCRYPTION SUCCESSFUL");
console.log("===================================");
console.log("Plain Text (Original):", PLAIN_TEXT_TO_ENCRYPT);
console.log("Encrypted Value (Copy this):", encryptedValue);
console.log("===================================");