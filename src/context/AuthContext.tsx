import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export interface AuthContextType {
  userToken: string | null;
  userData: any;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check if token exists on first load
  useEffect(() => {
    const savedToken = localStorage.getItem('userToken');
    if (savedToken) {
      setUserToken(savedToken);
      try {
        setUserData(jwtDecode(savedToken));
      } catch (err) {
        localStorage.removeItem('userToken');
      }
    }
    setLoading(false);
  }, []);

  // Save token after successful login
  const login = (token: string) => {
    localStorage.setItem('userToken', token);
    setUserToken(token);
    try {
      setUserData(jwtDecode(token));
    } catch (err) {
      setUserData(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setUserToken(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, userData, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
