import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-gray-100' : '';
  };

  // Tạm thời dùng dữ liệu mock cho user
  const user = {
    name: 'Người dùng',
    email: 'user@example.com',
    avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <img 
              src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
              alt={user?.name} 
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="py-4">
          <div className="px-4 pb-2">
            <p className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
              Menu chính
            </p>
          </div>
          
          <Link 
            to="/user/dashboard" 
            className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isActive('/user/dashboard')}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Tổng quan
          </Link>
          
          <Link 
            to="/user/messages" 
            className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isActive('/user/messages')}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            Tin nhắn
            <span className="ml-auto bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">1</span>
          </Link>
          
          <Link 
            to="/user/applications" 
            className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isActive('/user/applications')}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Công việc đã ứng tuyển
          </Link>
          
          <Link 
            to="/user/favorites" 
            className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isActive('/user/favorites')}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Công việc yêu thích
          </Link>
          
          <Link 
            to="/user/profile" 
            className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isActive('/profile')}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
            Trang cá nhân
          </Link>
          
          <div className="pt-4 mt-4 border-t px-4 pb-2">
            <p className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
              Cài đặt
            </p>
          </div>
          
          <Link 
            to="/user/settings" 
            className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isActive('/user/settings')}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Cài đặt
          </Link>
          
          <Link 
            to="/user/help" 
            className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isActive('/user/help')}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Trợ giúp
          </Link>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-4 md:p-6">
        {children}
      </div>
    </div>
  );
};

export default UserLayout; 