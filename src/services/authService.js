// src/services/authService.js

import { 
    auth, 
    db,   
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail, 
    signOut, // 💡 ADDED: signOut function is required for logoutUser
} from '../config/firebase';


import { ref, get, set, child } from 'firebase/database';

// 🛑 UTILITY: Input Sanitization for Auth Fields
const sanitizeAuthInput = (input) => {
    if (typeof input !== 'string') return '';
    // XSS is not a primary risk here, but we enforce formatting and limit length for security.
    return input.trim().toLowerCase().substring(0, 100); 
};


// ======================================================
// 🚀 1. LOGIN SERVICE
// ======================================================
export const loginUser = async (email, password, latitude, longitude) => {
  // 1️⃣ Sanitize input
  const sanitizedEmail = sanitizeAuthInput(email);
  if (!sanitizedEmail || !password) {
    throw new Error('Invalid email or password.');
  }

  try {
    // 2️⃣ FAST Firebase login (client-side only)
    const userCredential = await signInWithEmailAndPassword(
      auth,
      sanitizedEmail,
      password
    );

    const user = userCredential.user;
    const uid = user.uid;

    // 3️⃣ Fetch role/profile from RTDB
    const userRef = ref(db, `flatmate/users/${uid}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val() || {};

    // 4️⃣ Update last login (non-blocking)
    set(child(userRef, 'lastLogin'), {
      latitude: latitude || null,
      longitude: longitude || null,
      timestamp: Date.now(),
    }).catch((err) => {
      console.warn('Failed to update last login:', err.message);
    });

    // 5️⃣ Background trust-session call (non-blocking)
    user.getIdToken().then((token) => {
      fetch('/flatmate/trust-session', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include', // ensures session cookie works
      }).catch((err) => {
        console.warn('Trust-session call failed:', err.message);
      });
    });

    // 6️⃣ Return clean session object
    return {
      uid,
      email: user.email,
      name: user.displayName || userData.name || '',
      role: userData.role || 'Tenant',
    };

  } catch (error) {
    console.error('Login failed:', error.code || '', error.message || error);
    throw new Error(
      error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'
        ? 'Invalid email or password.'
        : 'Login failed. Please try again later.'
    );
  }
};


export const logoutUser = async () => {
    try {
        // 🛑 DDOS/DOS (Logout): Low risk, standard Firebase SDK call
        await signOut(auth);
        console.log("User logged out successfully via Firebase Client SDK.");
    } catch (error) {
        console.error("Firebase Auth Service Logout Error:", error);
        throw error;
    }
};

// ======================================================
// 🚀 2. SIGNUP SERVICE 
// ======================================================

export const signupUser = async (email, password, role = 'Tenant') => {
    // 🛑 SECURITY FIX 4: Input Validation and Sanitization
    const sanitizedEmail = sanitizeAuthInput(email);
    const sanitizedRole = sanitizeAuthInput(role);

    if (!sanitizedEmail) {
        throw new Error("Invalid email format provided.");
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth, 
            sanitizedEmail, 
            password
        );
        
        const user = userCredential.user;
        const uid = user.uid;

        // 🛑 SECURITY FIX 5: Write initial user data to RTDB with default safe role
        const userRef = ref(db, `flatmate/users/${uid}`);
        await set(userRef, {
            email: sanitizedEmail,
            role: sanitizedRole === 'owner' ? 'Owner' : 'Tenant', // Enforce only allowed roles
            createdAt: Date.now(),
        });

        // 🛑 DDOS/DOS Protection: Handled by Firebase Auth Rate Limiting.

        return user;
    } catch (error) {
        console.error('Firebase Auth Service Signup Error:', error.code, error.message);
        throw error;
    }
};

// ======================================================
// 🚀 3. PASSWORD RESET SERVICE 
// ======================================================

export const resetPassword = async (email) => {
    // 🛑 SECURITY FIX 6: Input Sanitization
    const sanitizedEmail = sanitizeAuthInput(email);

    if (!sanitizedEmail) {
        throw new Error("Invalid email format provided.");
    }

    try {
        // 🛑 DDOS/DOS Protection: Firebase provides rate limiting on password reset emails.
        await sendPasswordResetEmail(auth, sanitizedEmail);
        return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
        console.error('Firebase Auth Service Password Reset Error:', error.code, error.message);
        throw error;
    }
};


// ======================================================
// 🚀 4. GET CURRENT USER SERVICE
// ======================================================

export const getCurrentLoggedInUser = async () => {
    const currentUser = auth.currentUser; 

    if (!currentUser) {
        return null; 
    }

    const uid = currentUser.uid;
    
    try {
        // 🛑 SECURITY FIX 7: Use UID (internal Auth key) for RTDB path, preventing injection.
        const userRef = ref(db, `flatmate/users/${uid}`);
        const userSnapshot = await get(userRef);

        const userData = userSnapshot.val() || {};
        const userRole = userData.role || 'Tenant'; 

        // 3. Consolidated user object
        return {
            uid: uid,
            email: currentUser.email,
            name: currentUser.displayName || userData.name || '', 
            role: userRole,
        };

    } catch (error) {
        console.error("Error fetching current user profile from RTDB:", error);
        // Fallback: Return essential data from Firebase Auth object
        return {
            uid: uid,
            email: currentUser.email,
            name: currentUser.displayName || '',
            role: 'Tenant', 
        };
    }
};

// (Other future functions like handleGoogleSignIn, etc., will go here)