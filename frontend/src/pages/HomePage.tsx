import React from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import JobSection from '../components/home/JobSection';
import CompanySection from '../components/home/CompanySection';
import BlogSection from '../components/home/BlogSection';
import ContactSection from '../components/home/ContactSection';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <JobSection />
      <CompanySection />
      <BlogSection />
      <ContactSection />
    </Layout>
  );
};

export default HomePage; 