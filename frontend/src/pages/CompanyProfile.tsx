import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface CompanyDetail {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  description: string;
  industry: string;
  website: string;
  location: string;
  founded: string;
  size: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  overview: {
    title: string;
    content: string;
  }[];
  benefits: {
    title: string;
    description: string;
    icon: string;
  }[];
  openPositions: {
    id: string;
    title: string;
    location: string;
    type: string;
    department: string;
    postedDate: string;
  }[];
  photos: string[];
}

const mockCompanyDetail: CompanyDetail = {
  id: '1',
  name: 'Stripe',
  logo: '/company-logos/stripe.png',
  coverImage: '/company-photos/stripe-cover.jpg',
  description: `Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size—from new startups to public companies—use our software to accept payments and manage their businesses online.`,
  industry: 'Financial Technology',
  website: 'https://stripe.com',
  location: 'San Francisco, CA',
  founded: '2010',
  size: '5000+ employees',
  socialLinks: {
    linkedin: 'https://linkedin.com/company/stripe',
    twitter: 'https://twitter.com/stripe',
    facebook: 'https://facebook.com/stripe'
  },
  overview: [
    {
      title: 'About Us',
      content: `Stripe is a technology company that builds economic infrastructure for the internet. Our software helps companies of every size better serve their customers. We process hundreds of billions of dollars each year for all types of businesses, from small startups to Fortune 500 companies.`
    },
    {
      title: 'Our Mission',
      content: `Our mission is to increase the GDP of the internet. We believe that enabling more commerce online is a problem rooted in code and design, not finance. We also believe that there are far too many barriers to doing business on the internet.`
    },
    {
      title: 'Culture & Values',
      content: `We believe that our culture is one of our most valuable assets. We're committed to building an inclusive environment where all employees can thrive. Our values guide everything we do.`
    }
  ],
  benefits: [
    {
      title: 'Healthcare & Wellness',
      description: `Comprehensive health, dental, and vision coverage for you and your dependents.`,
      icon: 'healthcare'
    },
    {
      title: 'Flexible Time Off',
      description: `Take time off when you need it. We trust you to manage your own time.`,
      icon: 'vacation'
    },
    {
      title: 'Learning & Development',
      description: `We invest in your growth with learning stipends and development programs.`,
      icon: 'education'
    },
    {
      title: 'Equity',
      description: `Every employee gets equity because we want you to be an owner in our success.`,
      icon: 'equity'
    }
  ],
  openPositions: [
    {
      id: '1',
      title: 'Social Media Assistant',
      location: 'Paris, France',
      type: 'Full-Time',
      department: 'Marketing',
      postedDate: 'July 31, 2021'
    },
    {
      id: '2',
      title: 'Senior Software Engineer',
      location: 'Remote',
      type: 'Full-Time',
      department: 'Engineering',
      postedDate: 'July 30, 2021'
    },
    {
      id: '3',
      title: 'Product Designer',
      location: 'New York, NY',
      type: 'Full-Time',
      department: 'Design',
      postedDate: 'July 29, 2021'
    }
  ],
  photos: [
    '/company-photos/stripe-office-1.jpg',
    '/company-photos/stripe-office-2.jpg',
    '/company-photos/stripe-office-3.jpg',
    '/company-photos/stripe-office-4.jpg'
  ]
};

const CompanyProfile = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Cover Image */}
      <div className="h-64 w-full bg-gray-300">
        <img
          src={mockCompanyDetail.coverImage}
          alt={`${mockCompanyDetail.name} office`}
          className="w-full h-full object-cover"
        />
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Company Header */}
        <div className="bg-white rounded-lg p-6 mb-8 -mt-20 relative">
          <div className="flex items-start gap-6">
            <img
              src={mockCompanyDetail.logo}
              alt={mockCompanyDetail.name}
              className="w-24 h-24 rounded-lg bg-white border-4 border-white"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{mockCompanyDetail.name}</h1>
                  <p className="text-gray-600 mb-4">{mockCompanyDetail.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{mockCompanyDetail.industry}</span>
                    <span>•</span>
                    <span>{mockCompanyDetail.location}</span>
                    <span>•</span>
                    <span>{mockCompanyDetail.size}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  {mockCompanyDetail.socialLinks.linkedin && (
                    <a
                      href={mockCompanyDetail.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  )}
                  {mockCompanyDetail.socialLinks.twitter && (
                    <a
                      href={mockCompanyDetail.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-8">
            {/* Overview Sections */}
            {mockCompanyDetail.overview.map((section, index) => (
              <div key={index} className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">{section.title}</h2>
                <p className="text-gray-600">{section.content}</p>
              </div>
            ))}

            {/* Office Photos */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Life at {mockCompanyDetail.name}</h2>
              <div className="grid grid-cols-2 gap-4">
                {mockCompanyDetail.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`${mockCompanyDetail.name} office`}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Company Info</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Website</h3>
                  <a
                    href={mockCompanyDetail.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    {mockCompanyDetail.website.replace('https://', '')}
                  </a>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Industry</h3>
                  <p className="font-medium">{mockCompanyDetail.industry}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Company size</h3>
                  <p className="font-medium">{mockCompanyDetail.size}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Founded</h3>
                  <p className="font-medium">{mockCompanyDetail.founded}</p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Benefits & Perks</h2>
              <div className="space-y-4">
                {mockCompanyDetail.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 text-xl">
                        {benefit.icon === 'healthcare' && '🏥'}
                        {benefit.icon === 'vacation' && '🌴'}
                        {benefit.icon === 'education' && '📚'}
                        {benefit.icon === 'equity' && '💰'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Positions */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Open Positions</h2>
                <span className="text-sm text-gray-500">{mockCompanyDetail.openPositions.length} jobs</span>
              </div>
              <div className="space-y-4">
                {mockCompanyDetail.openPositions.map((position) => (
                  <a
                    key={position.id}
                    href={`/jobs/${position.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-600"
                  >
                    <h3 className="font-semibold mb-2">{position.title}</h3>
                    <div className="text-sm text-gray-500">
                      <p>{position.location}</p>
                      <p>{position.department} • {position.type}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyProfile; 