import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RoleSelectionPage from './pages/Auth/RoleSelectionPage';
import UserLoginPage from './pages/Auth/UserLoginPage';
import EmployerLoginPage from './pages/Auth/EmployerLoginPage';
import AdminLoginPage from './pages/Auth/AdminLoginPage';
import UserRegisterPage from './pages/Auth/UserRegisterPage';
import EmployerRegisterPage from './pages/Auth/EmployerRegisterPage';
import OTPVerificationPage from './pages/Auth/OTPVerificationPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import JobsPage from './pages/JobsPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import JobDetailPage from './pages/JobDetailPage';
import BlogsPage from './pages/BlogsPage';
import ContactPage from './pages/ContactPage';
import UserDashboard from './pages/user/UserDashboard';
import MessagesPage from './pages/user/MessagesPage';
import ApplicationsPage from './pages/user/ApplicationsPage';
import FavoritesPage from './pages/user/FavoritesPage';
import ProfilePage from './pages/user/ProfilePage';
import SettingsPage from './pages/user/SettingsPage';
import HelpPage from './pages/user/HelpPage';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerMessagesPage from './pages/employer/MessagesPage';
import CompanyProfilePage from './pages/employer/CompanyProfilePage';
import CandidatesPage from './pages/employer/CandidatesPage';
import JobsManagementPage from './pages/employer/JobsPage';
import CreateJobPage from './pages/employer/CreateJobPage';
import EmployerSettingsPage from './pages/employer/SettingsPage';
import EmployerHelpPage from './pages/employer/EmployerHelpPage';
import TestApiPage from './pages/TestApiPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagementPage from './pages/admin/UsersManagementPage';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Role Selection */}
        <Route path="/auth" element={<RoleSelectionPage />} />
        
        {/* User Authentication */}
        <Route path="/auth/user/login" element={<UserLoginPage />} />
        <Route path="/auth/user/register" element={<UserRegisterPage />} />
        
        {/* Employer Authentication */}
        <Route path="/auth/employer/login" element={<EmployerLoginPage />} />
        <Route path="/auth/employer/register" element={<EmployerRegisterPage />} />
        
        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        {/* OTP and Password Reset */}
        <Route path="/auth/otp-verification" element={<OTPVerificationPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        
        {/* Legacy routes - redirect to role selection */}
        <Route path="/auth/login" element={<RoleSelectionPage />} />
        <Route path="/auth/register" element={<RoleSelectionPage />} />
        
        {/* Main Pages */}
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:id" element={<CompanyDetailPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* User Dashboard Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/messages" element={<MessagesPage />} />
        <Route path="/user/applications" element={<ApplicationsPage />} />
        <Route path="/user/favorites" element={<FavoritesPage />} />
        <Route path="/user/profile" element={<ProfilePage />} />
        <Route path="/user/settings" element={<SettingsPage />} />
        <Route path="/user/help" element={<HelpPage />} />
        
        {/* Employer Dashboard Routes */}
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/employer/messages" element={<EmployerMessagesPage />} />
        <Route path="/employer/company" element={<CompanyProfilePage />} />
        <Route path="/employer/candidates" element={<CandidatesPage />} />
        <Route path="/employer/jobs" element={<JobsManagementPage />} />
        <Route path="/employer/jobs/create" element={<CreateJobPage />} />
        <Route path="/employer/settings" element={<EmployerSettingsPage />} />
        <Route path="/employer/help" element={<EmployerHelpPage />} />
        
        {/* Admin Dashboard Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersManagementPage />} />
        
        {/* Test API Route */}
        <Route path="/test-api" element={<TestApiPage />} />
      </Routes>
    </div>
  );
}

export default App;
