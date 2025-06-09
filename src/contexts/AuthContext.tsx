import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';
import companyService from '../services/companyService';

interface User {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  userType: 'jobseeker' | 'company';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }, type: 'user' | 'company') => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshAuth = async () => {
    try {
      setIsLoading(true);
      
      // Try to get a valid token (with auto-refresh)
      const token = await authService.getValidToken();
      
      if (!token) {
        // No valid token available, clear state
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Get user profile with the valid token
      const profile = await userService.getMyProfile();
      const storedUserType = localStorage.getItem('user_type');
      
      // Map stored user_type to expected userType
      let userType: 'jobseeker' | 'company' = 'jobseeker';
      if (storedUserType === 'employer') {
        userType = 'company';
      } else if (storedUserType === 'user') {
        userType = 'jobseeker';
      }
      
      setUser({
        id: profile.id,
        name: profile.fullname || profile.userName,
        email: profile.email,
        avatar: profile.avt,
        userType
      });
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Failed to fetch user profile:', err);
      // Clear invalid state
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_type');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }, type: 'user' | 'company') => {
    try {
      if (type === 'user') {
        await authService.loginUser(credentials);
      } else {
        await authService.loginCompany(credentials);
      }
      
      // Refresh auth state after successful login
      await refreshAuth();
    } catch (error) {
      throw error; // Re-throw so components can handle the error
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear state even if API call fails
      setUser(null);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 