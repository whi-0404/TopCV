import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
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
import JobRecommendationPage from './pages/JobRecommendationPage';
import UserDashboard from './pages/user/UserDashboard';
import ApplicationsPage from './pages/user/ApplicationsPage';
import FavoritesPage from './pages/user/FavoritesPage';
import ProfilePage from './pages/user/ProfilePage';
import SettingsPage from './pages/user/SettingsPage';
import HelpPage from './pages/user/HelpPage';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import CompanyProfilePage from './pages/employer/CompanyProfilePage';
import CandidatesPage from './pages/employer/CandidatesPage';
import JobsManagementPage from './pages/employer/JobsPage';
import CreateJobPage from './pages/employer/CreateJobPage';
import EditJobPage from './pages/employer/EditJobPage';
import EmployerJobDetailPage from './pages/employer/JobDetailPage';
import EmployerSettingsPage from './pages/employer/SettingsPage';
import EmployerHelpPage from './pages/employer/EmployerHelpPage';
import CandidateDetailPage from './pages/employer/CandidateDetailPage';
import TestApiPage from './pages/TestApiPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagementPage from './pages/admin/UsersManagementPage';
import CompaniesManagementPage from './pages/admin/CompaniesManagementPage';
import JobPostsManagementPage from './pages/admin/JobPostsManagementPage';
import ApplicationsManagementPage from './pages/admin/ApplicationsManagementPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';


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
        
        {/* AI Job Recommendation */}
        <Route path="/ai-recommendations" element={
          <ProtectedRoute allowedRoles={['USER']}>
            <JobRecommendationPage />
          </ProtectedRoute>
        } />
        
        {/* User Dashboard Routes */}
        <Route path="/user/dashboard" element={
          <ProtectedRoute allowedRoles={['USER']}>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/user/applications" element={
          <ProtectedRoute allowedRoles={['USER']}>
            <ApplicationsPage />
          </ProtectedRoute>
        } />
        <Route path="/user/favorites" element={
          <ProtectedRoute allowedRoles={['USER']}>
            <FavoritesPage />
          </ProtectedRoute>
        } />
        <Route path="/user/profile" element={
          <ProtectedRoute allowedRoles={['USER']}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/user/settings" element={
          <ProtectedRoute allowedRoles={['USER']}>
            <SettingsPage />
          </ProtectedRoute>
        } />
        <Route path="/user/help" element={
          <ProtectedRoute allowedRoles={['USER']}>
            <HelpPage />
          </ProtectedRoute>
        } />
        
        {/* Employer Dashboard Routes */}
        <Route path="/employer/dashboard" element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/employer/company" element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <CompanyProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/employer/candidates" element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <CandidatesPage />
          </ProtectedRoute>
        } />
        <Route path="/employer/candidates/:applicationId" element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <CandidateDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/employer/jobs" element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <JobsManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/employer/jobs/create" element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <CreateJobPage />
          </ProtectedRoute>
        } />
        <Route path="/employer/jobs/:id" element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerJobDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/employer/jobs/:jobId/edit" element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EditJobPage />
          </ProtectedRoute>
        } />
        <Route path="/employer/settings" element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerSettingsPage />
          </ProtectedRoute>
        } />
        <Route path="/employer/help" element={
          <ProtectedRoute allowedRoles={['EMPLOYER']}>
            <EmployerHelpPage />
          </ProtectedRoute>
        } />
        
        {/* Admin Dashboard Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UsersManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/companies" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <CompaniesManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/job-posts" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <JobPostsManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/applications" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ApplicationsManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AnalyticsPage />
          </ProtectedRoute>
        } />
        
        {/* Test API Route */}
        <Route path="/test-api" element={<TestApiPage />} />
      </Routes>
    </div>
  );
}

export default App;
