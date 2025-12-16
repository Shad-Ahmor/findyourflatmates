// config/encryptionUtils.js

const CryptoJS = require('crypto-js');
// 🛑 CRITICAL: Secret Key को पर्यावरण चर (environment variable) से प्राप्त करें
const secretKey = process.env.VITE_ENCRYPTION_SECRET_KEY; // या जो भी नाम आप .env में उपयोग करते हैं

// =====================
// 🔐 ENCRYPT FUNCTION
// =====================
export const encryptedData = (data) => {
  try {
    const stringData = typeof data === "string" ? data : JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(stringData, secretKey).toString();
    return encrypted;
  } catch (err) {
    console.error("Encryption failed:", err);
    return null;
  }
};

// =====================
// 🔓 DECRYPT FUNCTION (Used by firebase.js)
// =====================
export const decryptedData = (encryptedData) => {
  try {
    if (!encryptedData || typeof encryptedData !== 'string') {
        return encryptedData; // Return if not a string or null/undefined
    }
    
    // 🛑 KEY CHANGE: JSON.parse() को हटा दें, क्योंकि हम केवल सादे स्ट्रिंग (Plain String) को डिक्रिप्ट कर रहे होंगे (API Key, App ID)
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      console.warn("Decryption failed: Empty string returned.");
      return null; 
    }

    return decryptedString; 
    
  } catch (err) {
    console.error("Decryption failed:", err);
    return encryptedData; // Return original in case of error (better than null for keys)
  }
};