firebase.js
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword } from "firebase/auth";
import Config from "react-native-config";
const API_BASE_URL = Config.VITE_API_BASE_URL;

const firebaseConfig = {
  apiKey: Config.VITE_FIREBASE_API_KEY,
  authDomain: Config.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: Config.VITE_FIREBASE_DATABASE_URL,
  projectId: Config.VITE_FIREBASE_PROJECT_ID,
  storageBucket: Config.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Config.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: Config.VITE_FIREBASE_APP_ID,
  measurementId: Config.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Export Auth
export { auth, firebaseSignInWithEmailAndPassword as signInWithEmailAndPassword };




