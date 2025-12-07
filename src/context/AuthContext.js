import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ✅ Check session cookie on app start
    const checkSession = async () => {
      try {
        const res = await fetch('http://localhost:5000/flatmate/me', {
          method: 'GET',
          credentials: 'include', // cookie send
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (e) {
        console.error('Check session error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (sessionData) => {
    setUser(sessionData); // server cookie already set
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/flatmate/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
