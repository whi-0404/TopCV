import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import CompanyProfile from './pages/CompanyProfile';
import Companies from './pages/Companies';
import CompaniesSearch from './pages/CompaniesSearch';
import Resume from './pages/Resume';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ApiTest from './pages/ApiTest';
import PageTransition from './components/layout/PageTransition';
import ScrollToTop from './components/layout/ScrollToTop';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isFromAuth = location.state?.from === '/login' || location.state?.from === '/register';
  const { isLoggedIn } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
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
        <Route path="/companies/:id" element={<CompanyProfile />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/search" element={<CompaniesSearch />} />
        <Route path="/resume" element={
          <ProtectedRoute requiredUserType="JOB_SEEKER">
            <Resume />
          </ProtectedRoute>
        } />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
        <Route path="/api-test" element={<ApiTest />} />
      </Routes>
    </>
  );
}

export default App; 