// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '@env'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 💡 FIX: Replaced API call with Local Storage check for persistence.
    // WARNING: This is less secure than using HTTP-only cookies validated by a server API.
    
    const checkLocalSession = () => {
        try {
            const storedUser = localStorage.getItem('user_session_flatmate');
            if (storedUser) {
                // Parse user data from local storage
                setUser(JSON.parse(storedUser)); 
            }
        } catch (e) {
            console.error('Error reading session from local storage:', e);
            localStorage.removeItem('user_session_flatmate'); // Clear bad data
        } finally {
            setIsLoading(false);
        }
    };
    checkLocalSession();
  }, []);

  const login = async (sessionData) => {
    // 💡 FIX: Store user data in local storage upon successful login
    setUser(sessionData); 
    localStorage.setItem('user_session_flatmate', JSON.stringify(sessionData));
  };

  const logout = async () => {
    try {
      // Server-side logout (to clear cookie/session on server)
      await fetch(`${API_BASE_URL}/flatmate/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
        console.error('Logout error:', e);
    }
    // 💡 FIX: Clear client-side state
    setUser(null);
    localStorage.removeItem('user_session_flatmate');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);