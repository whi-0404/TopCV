import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { 
  UserIcon, 
  BuildingOfficeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Tự động xác định action dựa vào URL hoặc state từ navigation
  const isRegister = location.pathname.includes('register') || location.state?.action === 'register';
  const action = isRegister ? 'register' : 'login';

  const roles = [
    {
      type: 'user',
      title: 'Ứng viên',
      description: 'Tìm kiếm việc làm IT',
      icon: UserIcon,
      loginPath: '/auth/user/login',
      registerPath: '/auth/user/register',
      color: 'emerald'
    },
    {
      type: 'employer',
      title: 'Nhà tuyển dụng',
      description: 'Đăng tin tuyển dụng',
      icon: BuildingOfficeIcon,
      loginPath: '/auth/employer/login',
      registerPath: '/auth/employer/register',
      color: 'blue'
    }
  ];

  const handleRoleSelect = (role: typeof roles[0]) => {
    const targetPath = action === 'login' ? role.loginPath : role.registerPath;
    navigate(targetPath);
  };

  const RoleCard: React.FC<{ role: typeof roles[0] }> = ({ role }) => {
    const colorClasses = {
      emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200 hover:border-emerald-300',
        icon: 'bg-emerald-100 text-emerald-600',
        hover: 'hover:bg-emerald-100'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200 hover:border-blue-300',
        icon: 'bg-blue-100 text-blue-600',
        hover: 'hover:bg-blue-100'
      }
    };

    const colors = colorClasses[role.color as keyof typeof colorClasses];

    return (
      <button
        onClick={() => handleRoleSelect(role)}
        className={`w-full ${colors.bg} ${colors.border} ${colors.hover} border-2 rounded-xl p-8 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer`}
      >
        <div className="text-center space-y-4">
          <div className={`w-16 h-16 ${colors.icon} rounded-full flex items-center justify-center mx-auto`}>
            <role.icon className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {role.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {role.description}
            </p>
          </div>
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <span>Nhấn để {action === 'login' ? 'đăng nhập' : 'đăng ký'}</span>
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </div>
        </div>
      </button>
    );
  };

  return (
    <Layout showHeader={false} showFooter={false}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">
                Top<span className="text-emerald-600">Job</span>
              </span>
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {action === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </h1>
            <p className="text-gray-600">
              Chọn loại tài khoản của bạn
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <RoleCard key={role.type} role={role} />
            ))}
          </div>

          {/* Admin Link */}
          <div className="text-center pt-6 border-t border-gray-200">
            <Link
              to="/admin/login"
              className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-700 font-medium text-sm"
            >
              <span>Đăng nhập Admin</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoleSelectionPage; 