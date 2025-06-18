import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('USER' | 'EMPLOYER' | 'ADMIN')[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  redirectTo 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Hiển thị loading trong khi kiểm tra auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Nếu chưa đăng nhập
  if (!user) {
    // Xác định redirect path dựa vào current path
    let loginPath = '/auth';
    if (location.pathname.startsWith('/user')) {
      loginPath = '/auth/user/login';
    } else if (location.pathname.startsWith('/employer')) {
      loginPath = '/auth/employer/login';
    } else if (location.pathname.startsWith('/admin')) {
      loginPath = '/admin/login';
    }
    
    return <Navigate to={redirectTo || loginPath} state={{ from: location }} replace />;
  }

  // Nếu có yêu cầu về role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect về dashboard tương ứng với role
    let dashboardPath = '/';
    if (user.role === 'USER') {
      dashboardPath = '/user/dashboard';
    } else if (user.role === 'EMPLOYER') {
      dashboardPath = '/employer/dashboard';
    } else if (user.role === 'ADMIN') {
      dashboardPath = '/admin/dashboard';
    }
    
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 