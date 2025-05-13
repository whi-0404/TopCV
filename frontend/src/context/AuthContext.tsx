import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService, { AuthResponse } from '../services/auth.service';
import { STORAGE_KEYS } from '../config';

interface AuthContextType {
  currentUser: AuthResponse | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setCurrentUser: (user: AuthResponse) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await AuthService.login({ email, password });
    setCurrentUser(response);
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoggedIn: !!currentUser,
    loading,
    login,
    logout,
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 