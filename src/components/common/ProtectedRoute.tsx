import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  // Tạm thời bypass authentication để test layout
  // TODO: Thêm logic authentication thật sau này
  const isAuthenticated = true; // Mock value
  
  // Mock role based on current URL for testing
  const currentPath = window.location.pathname;
  const userRole = currentPath.includes('/company/') ? 'company' : 'user';

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 