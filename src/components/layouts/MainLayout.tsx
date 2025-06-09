import React, { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname.includes('/auth/') || 
                    location.pathname === '/login' || 
                    location.pathname === '/register' ||
                    location.pathname.includes('/admin/');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Header />}
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default MainLayout; 