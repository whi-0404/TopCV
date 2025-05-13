import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const resumeTemplates = [
  {
    id: 1,
    name: 'Modern Clean',
    image: '/images/resume-template-1.jpg',
    description: 'Modern and professional CV template suitable for IT positions',
    category: 'Popular'
  },
  {
    id: 2,
    name: 'Creative Design',
    image: '/images/resume-template-2.jpg',
    description: 'Creative CV template designed for UI/UX Designers',
    category: 'Design'
  },
  {
    id: 3,
    name: 'Professional Tech',
    image: '/images/resume-template-3.jpg',
    description: 'Technical CV template for Developers',
    category: 'Tech'
  }
];

const Resume = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create an Impressive CV in 5 Minutes
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              With CV templates specially designed for IT industry
            </p>
            <button className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-lg font-medium">
              Create CV Now
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
              <p className="text-gray-600">User-friendly interface, easy to edit and update information</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Multiple Templates</h3>
              <p className="text-gray-600">Various CV templates designed for different job positions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Multiple Formats</h3>
              <p className="text-gray-600">Support exporting to PDF, Word and other formats</p>
            </div>
          </div>

          {/* Resume Templates */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured CV Templates</h2>
              <div className="flex gap-4">
                <button className="px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700">
                  Popular
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-emerald-600">
                  Design
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-emerald-600">
                  Tech
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {resumeTemplates.map((template) => (
                <div key={template.id} className="flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="relative pt-[66.67%]">
                    <img 
                      src={template.image} 
                      alt={template.name} 
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-grow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 flex-grow">{template.description}</p>
                    <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors mt-auto">
                      Use this template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Effective CV Writing Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">1. Optimize Keywords</h3>
                <p className="text-gray-600 mb-4">
                  Use relevant job and skill keywords in the IT industry to make your CV easily discoverable by recruiters.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">2. Highlight Achievements</h3>
                <p className="text-gray-600 mb-4">
                  Focus on specific achievements and results rather than just listing job duties.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">3. Regular Updates</h3>
                <p className="text-gray-600 mb-4">
                  Regularly update your CV with the latest skills and experiences in the IT field.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">4. Professional Format</h3>
                <p className="text-gray-600 mb-4">
                  Use readable fonts, clear layout and ensure there are no spelling errors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Resume; 