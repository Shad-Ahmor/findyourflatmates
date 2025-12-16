// src/firebase.js

import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail, 
    signOut, 
} from "firebase/auth";
import { getDatabase } from "firebase/database"; 
import { decryptedData } from './encryptionUtils';

// 🛑 CRITICAL FIX: react-native-dotenv से VITE_ prefixed variables को सीधे इंपोर्ट करें
import {
    VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_DATABASE_URL,
    VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID,
    VITE_FIREBASE_MEASUREMENT_ID,
    VITE_API_BASE_URL,
} from '@env'; // 🛑 यह आपके Babel प्लगइन से जुड़ा हुआ है

// 🛑 FIX: API_BASE_URL अब @env से लिया गया है
const API_BASE_URL = VITE_API_BASE_URL || '';

const getEnvVar = (encryptedValue, keyName) => {
    if (!encryptedValue) {
        console.error(`ERROR: Environment variable ${keyName} is missing or empty. Check your .env file.`);
        return ''; 
    }
    
    try {
        return decryptedData(encryptedValue);
    } catch (e) {
        console.error(`ERROR: Failed to decrypt data for ${keyName}. Check encryption key/logic.`, e);
        return '';
    }
}

// 🛑 Firebase Configuration object: VITE_ prefixed imported values का उपयोग करें
const firebaseConfig = {
    // 💡 ध्यान दें: हम सीधे VITE_FIREBASE_API_KEY (जो @env से आया है) को पास कर रहे हैं।
    apiKey: getEnvVar(VITE_FIREBASE_API_KEY, 'VITE_FIREBASE_API_KEY'),
    authDomain: getEnvVar(VITE_FIREBASE_AUTH_DOMAIN, 'VITE_FIREBASE_AUTH_DOMAIN'),
    databaseURL: getEnvVar(VITE_FIREBASE_DATABASE_URL, 'VITE_FIREBASE_DATABASE_URL'),
    projectId: getEnvVar(VITE_FIREBASE_PROJECT_ID, 'VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnvVar(VITE_FIREBASE_STORAGE_BUCKET, 'VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVar(VITE_FIREBASE_MESSAGING_SENDER_ID, 'VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVar(VITE_FIREBASE_APP_ID, 'VITE_FIREBASE_APP_ID'),
    measurementId: getEnvVar(VITE_FIREBASE_MEASUREMENT_ID, 'VITE_FIREBASE_MEASUREMENT_ID')
};

// Initialize Firebase App (remaining code...)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app); 

export { 
    app, 
    auth, 
    db, 
    firebaseSignInWithEmailAndPassword as signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
};