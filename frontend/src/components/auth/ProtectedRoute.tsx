import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType 
}) => {
  const { isLoggedIn, currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isLoggedIn) {
    // Redirect to login if not logged in
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If requiredUserType is specified, check if the user has the required type
  if (requiredUserType && currentUser) {
    const userType = currentUser.userType;
    const requiredTypes = Array.isArray(requiredUserType) ? requiredUserType : [requiredUserType];
    
    if (!requiredTypes.includes(userType)) {
      // Redirect to home if user doesn't have the required type
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 