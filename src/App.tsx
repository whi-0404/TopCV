import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout Components
import MainLayout from './components/layouts/MainLayout';
import UserLayout from './components/layouts/UserLayout';
import CompanyLayout from './components/layouts/CompanyLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Main Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import CompanyDetailPage from './pages/CompanyDetail';
import Companies from './pages/Companies';
import Blog from './pages/Blog';
import Contact from './pages/Contact';

// User Dashboard Pages
import UserDashboard from './pages/user/Dashboard';
import UserApplications from './pages/user/Applications';
import UserFavorites from './pages/user/Favorites';
import UserMessages from './pages/user/Messages';
import UserSettings from './pages/user/Settings';
import UserProfile from './pages/user/Profile';
import UserHelp from './pages/user/Help';

// Company Dashboard Pages
import CompanyDashboard from './pages/company/Dashboard';
import CompanyJobs from './pages/company/Jobs';
import CreateJob from './pages/company/CreateJob';
import CompanyCandidates from './pages/company/Candidates';
import CompanyMessages from './pages/company/Messages';
import CompanyProfile from './pages/company/Profile';
import CompanySettings from './pages/company/Settings';

// Auth Components
import RoleSelection from './pages/Auth/RoleSelection';
import JobSeekerLogin from './pages/Auth/JobSeeker/Login';
import JobSeekerRegister from './pages/Auth/JobSeeker/Register';
import CompanyLogin from './pages/Auth/Company/Login';
import CompanyRegister from './pages/Auth/Company/Register';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import OtpVerification from './pages/Auth/OtpVerification';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ChangePassword from './pages/Auth/ChangePassword';

// Admin Components
import AdminLogin from './pages/Auth/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminCompanies from './pages/Admin/Companies';
import AdminJobs from './pages/Admin/Jobs';
import AdminApplications from './pages/Admin/Applications';
import AdminAnalytics from './pages/Admin/Analytics';
import AdminSettings from './pages/Admin/Settings';
import AdminNotifications from './pages/Admin/Notifications';

import PageTransition from './components/layout/PageTransition';
import ScrollToTop from './components/layout/ScrollToTop';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isFromAuth = location.state?.from === '/login' || location.state?.from === '/register';

  return (
    <>
      <ScrollToTop />
      <Routes location={location} key={location.pathname}>
        {/* Main Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={
            isFromAuth ? (
              <AnimatePresence mode="wait">
                <PageTransition>
                  <Home />
                </PageTransition>
              </AnimatePresence>
            ) : (
              <Home />
            )
          } />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/companies/:id" element={<CompanyDetailPage />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* User Dashboard Routes */}
        <Route path="/user/*" element={
          <ProtectedRoute requiredRole="jobseeker">
            <UserLayout>
              <Routes>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="applications" element={<UserApplications />} />
                <Route path="favorites" element={<UserFavorites />} />
                <Route path="messages" element={<UserMessages />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="settings" element={<UserSettings />} />
                <Route path="help" element={<UserHelp />} />
              </Routes>
            </UserLayout>
          </ProtectedRoute>
        } />

        {/* Company Dashboard Routes */}
        <Route path="/company/*" element={
          <ProtectedRoute requiredRole="company">
            <CompanyLayout>
              <Routes>
                <Route path="dashboard" element={<CompanyDashboard />} />
                <Route path="jobs" element={<CompanyJobs />} />
                <Route path="jobs/new" element={<CreateJob />} />
                <Route path="candidates" element={<CompanyCandidates />} />
                <Route path="messages" element={<CompanyMessages />} />
                <Route path="profile" element={<CompanyProfile />} />
                <Route path="settings" element={<CompanySettings />} />
              </Routes>
            </CompanyLayout>
          </ProtectedRoute>
        } />
        
        {/* Auth Role Selection */}
        <Route path="/auth/login" element={<RoleSelection type="login" />} />
        <Route path="/auth/register" element={<RoleSelection type="register" />} />
        
        {/* Job Seeker Auth */}
        <Route path="/auth/jobseeker/login" element={<JobSeekerLogin />} />
        <Route path="/auth/jobseeker/register" element={<JobSeekerRegister />} />
        
        {/* Company Auth */}
        <Route path="/auth/company/login" element={<CompanyLogin />} />
        <Route path="/auth/company/register" element={<CompanyRegister />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/companies" element={<AdminCompanies />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        
        {/* Legacy Auth Routes (redirect to role selection) */}
        <Route path="/login" element={<RoleSelection type="login" />} />
        <Route path="/register" element={<RoleSelection type="register" />} />
        
        {/* Shared Auth Pages */}
        <Route path="/auth/otp-verification" element={<OtpVerification />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/change-password" element={<ChangePassword />} />

        {/* 404 Route */}
        <Route path="*" element={<div className="text-center py-8"><h1>404 - Không tìm thấy trang</h1></div>} />
      </Routes>
    </>
  );
}

export default App; 