import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import JobApplicationForm from '../components/job/JobApplicationForm';

interface JobDetail {
  id: string;
  title: string;
  company: {
    name: string;
    logo: string;
    location: string;
  };
  type: string;
  postedDate: string;
  salary: string;
  description: string;
  responsibilities: string[];
  whoYouAre: string[];
  niceToHave: string[];
  perks: {
    title: string;
    description: string;
  }[];
  categories: string[];
  requiredSkills: string[];
}

// Mock data for job detail
const mockJobDetail: JobDetail = {
  id: '1',
  title: 'Social Media Assistant',
  company: {
    name: 'Nomad',
    logo: '/company-logos/nomad.png',
    location: 'Paris, France'
  },
  type: 'Full Time',
  postedDate: 'Posted 2 days ago',
  salary: '$50,000 - $70,000',
  description: "We're looking for a Social Media Assistant to join our marketing team. You'll be responsible for creating and managing content across our social media channels, engaging with our community, and helping to grow our online presence.",
  responsibilities: [
    "Create and schedule social media content across platforms",
    "Engage with followers and respond to comments",
    "Monitor social media trends and analytics",
    "Collaborate with the design team on visual content",
    "Assist with social media campaigns and promotions"
  ],
  whoYouAre: [
    "You're detail-oriented and creative",
    "You're a growth marketer and know how to run campaigns",
    "You have experience with social media management tools",
    "You have excellent written and verbal communication skills",
    "You're passionate about social media and digital marketing"
  ],
  niceToHave: [
    "Experience with video content creation",
    "Knowledge of SEO best practices",
    "Experience with paid social media advertising",
    "Basic graphic design skills",
    "Experience with influencer marketing"
  ],
  perks: [
    {
      title: "Health Insurance",
      description: "Comprehensive health coverage for you and your family"
    },
    {
      title: "Unlimited Leave",
      description: "Take the time you need to rest and recharge"
    },
    {
      title: "Skill Development",
      description: "We're committed to helping you grow professionally"
    },
    {
      title: "Team Summits",
      description: "Regular team gatherings in exciting locations"
    },
    {
      title: "Commuter Benefits",
      description: "Coverage for your daily commute expenses"
    }
  ],
  categories: ['Marketing', 'Design', 'Social Media'],
  requiredSkills: ['Social Media', 'Content Creation', 'Marketing', 'Communication']
};

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const job = mockJobDetail; // In a real app, fetch job details using the ID
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-gray-600">
                  <span>{job.company.name}</span>
                  <span>•</span>
                  <span>{job.company.location}</span>
                  <span>•</span>
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{job.postedDate}</span>
                  <span>•</span>
                  <span>{job.salary}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowApplicationForm(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Apply Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <p className="text-gray-600">{job.description}</p>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </div>

            {/* Who You Are */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Who You Are</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {job.whoYouAre.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>

            {/* Nice to Have */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Nice to Have</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {job.niceToHave.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>

            {/* Perks */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Perks & Benefits</h2>
              <div className="grid grid-cols-2 gap-4">
                {job.perks.map((perk, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h3 className="font-medium">{perk.title}</h3>
                      <p className="text-sm text-gray-600">{perk.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Job Overview</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted Date</span>
                  <span className="font-medium">{job.postedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Job Type</span>
                  <span className="font-medium">{job.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salary</span>
                  <span className="font-medium">{job.salary}</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {job.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Required Skills */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showApplicationForm && (
        <JobApplicationForm
          jobTitle={job.title}
          companyName={job.company.name}
          companyLogo={job.company.logo}
          location={job.company.location}
          jobType={job.type}
          onClose={() => setShowApplicationForm(false)}
        />
      )}
    </div>
  );
};

export default JobDetail; 