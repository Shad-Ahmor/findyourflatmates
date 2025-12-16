import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { logoutUser } from '../services/authService';

const AuthContext = createContext();

// Helper: fetch full profile from RTDB
const fetchUserProfile = async (uid) => {
  try {
    const userRef = ref(db, `flatmate/users/${uid}`);
    const snapshot = await get(userRef);
    const profileData = snapshot.val();
    if (profileData) {
      return {
        uid,
        role: profileData.role || 'DEFAULT',
        ...profileData,
      };
    }
  } catch (e) {
    console.error('Error fetching user profile from DB:', e);
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 🔹 1️⃣ Call backend trust-session (non-blocking)
          firebaseUser.getIdToken().then((token) => {
            fetch('/flatmate/trust-session', {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              credentials: 'include',
            }).catch(() => {});
          });

          // 🔹 2️⃣ Fetch full profile
          const fullUser = await fetchUserProfile(firebaseUser.uid);

          if (fullUser) {
            setUser(fullUser);
            localStorage.setItem('user_session_flatmate', JSON.stringify(fullUser));
          } else {
            console.warn('Profile missing in DB. Forcing sign out.');
            await auth.signOut();
            setUser(null);
            localStorage.removeItem('user_session_flatmate');
          }
        } catch (err) {
          console.error('AuthContext error:', err);
          setUser(null);
          localStorage.removeItem('user_session_flatmate');
        }
      } else {
        // Logged out
        setUser(null);
        localStorage.removeItem('user_session_flatmate');
      }

      // 🔹 3️⃣ End loading
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (sessionData) => {
    setUser(sessionData);
    localStorage.setItem('user_session_flatmate', JSON.stringify(sessionData));
  };

  const logout = async () => {
    try {
      await auth.signOut();
      await logoutUser();
    } catch (e) {
      console.error('Logout failed:', e);
    }
    setUser(null);
    localStorage.removeItem('user_session_flatmate');
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
