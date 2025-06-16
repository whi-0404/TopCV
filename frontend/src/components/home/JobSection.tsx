import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { JobPost } from '../../types';

const JobSection: React.FC = () => {
  // Mock data - sẽ thay thế bằng API call thực tế
  const featuredJobs: JobPost[] = [
    {
      id: '1',
      title: 'Java Developer (Java/Java Core/SpringBoot) Lương $1000 - $2500',
      description: 'Chịu trách nhiệm nghiên cứu & phát triển backend sử dụng ngôn ngữ/công nghệ: Java, MySQL, Redis, Memcached...',
      requirements: 'Thành thạo Java. Nắm rất vững lập trình hướng đối tượng, Design Pattern.',
      benefits: 'Lương từ $1000 - $2500 phụ thuộc vào năng lực và kinh nghiệm',
      workingTime: '8h30 – 17h45 từ thứ 2 đến thứ 6',
      salary: '$1000 - $2500',
      experienceRequired: 'Ít nhất 2 năm kinh nghiệm ở vị trí tương tự',
      deadline: '25/06/2025',
      hiringQuota: 1,
      jobTypeId: '1',
      jobLevelId: '1',
      skillIds: ['1', '2'],
      companyId: '1',
      company: {
        id: '1',
        name: 'FPT Software',
        description: 'Công ty phần mềm hàng đầu Việt Nam',
        logo: 'https://via.placeholder.com/60x60?text=FPT',
        website: 'https://fpt-software.com',
        employeeRange: '1000-2000',
        address: 'Hà Nội, Việt Nam',
        categoryIds: [1],
        employerId: '1',
        isApproved: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      isApproved: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      title: 'React Frontend Developer - Up to $2000',
      description: 'Phát triển giao diện người dùng sử dụng React, TypeScript, và các công nghệ frontend hiện đại',
      requirements: 'Thành thạo React, TypeScript, HTML/CSS. Kinh nghiệm với Redux, Next.js',
      benefits: 'Lương cạnh tranh, bảo hiểm sức khỏe, thưởng theo hiệu quả',
      workingTime: '8h00 – 17h00 từ thứ 2 đến thứ 6',
      salary: '$1200 - $2000',
      experienceRequired: '1-3 năm kinh nghiệm',
      deadline: '30/06/2025',
      hiringQuota: 2,
      jobTypeId: '1',
      jobLevelId: '2',
      skillIds: ['3', '4'],
      companyId: '2',
      company: {
        id: '2',
        name: 'VinGroup',
        description: 'Tập đoàn đa ngành hàng đầu Việt Nam',
        logo: 'https://via.placeholder.com/60x60?text=VIN',
        website: 'https://vingroup.net',
        employeeRange: '5000+',
        address: 'Hồ Chí Minh, Việt Nam',
        categoryIds: [1],
        employerId: '2',
        isApproved: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      isApproved: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '3',
      title: 'DevOps Engineer - AWS/Docker/Kubernetes',
      description: 'Quản lý hạ tầng cloud, CI/CD pipeline, monitoring và deployment automation',
      requirements: 'Kinh nghiệm với AWS, Docker, Kubernetes, Jenkins, Git',
      benefits: 'Lương $1500-$3000, remote flexible, training certification',
      workingTime: 'Linh hoạt, có thể remote',
      salary: '$1500 - $3000',
      experienceRequired: '2-5 năm kinh nghiệm',
      deadline: '15/07/2025',
      hiringQuota: 1,
      jobTypeId: '2',
      jobLevelId: '3',
      skillIds: ['5', '6'],
      companyId: '3',
      company: {
        id: '3',
        name: 'Grab Vietnam',
        description: 'Nền tảng super app hàng đầu Đông Nam Á',
        logo: 'https://via.placeholder.com/60x60?text=GRAB',
        website: 'https://grab.com',
        employeeRange: '500-1000',
        address: 'Hồ Chí Minh, Việt Nam',
        categoryIds: [1],
        employerId: '3',
        isApproved: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      isApproved: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  const JobCard: React.FC<{ job: JobPost }> = ({ job }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border">
      <div className="flex items-start space-x-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <img
            src={job.company?.logo}
            alt={job.company?.name}
            className="w-12 h-12 rounded-lg object-cover bg-gray-100"
          />
        </div>

        {/* Job Info */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-emerald-600 cursor-pointer line-clamp-2">
              <Link to={`/jobs/${job.id}`}>
                {job.title}
              </Link>
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {job.company?.name}
            </p>
          </div>

          <p className="text-sm text-gray-700 line-clamp-2">
            {job.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <CurrencyDollarIcon className="h-4 w-4 text-emerald-500" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPinIcon className="h-4 w-4 text-gray-400" />
              <span>{job.company?.address}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-4 w-4 text-gray-400" />
              <span>{job.experienceRequired}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                Full-time
              </span>
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                Senior
              </span>
            </div>
            <Link
              to={`/jobs/${job.id}`}
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center space-x-1"
            >
              <span>Xem chi tiết</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Công việc IT
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá những cơ hội việc làm IT hấp dẫn từ các công ty hàng đầu
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium mt-4"
          >
            <span>Xem tất cả</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/jobs"
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2"
          >
            <span>Xem thêm việc làm</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobSection; 