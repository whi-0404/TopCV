import { Routes, Route, useLocation } from 'react-router-dom';
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
        <Route path="/resume" element={<Resume />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App; 