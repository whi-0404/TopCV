import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  TrashIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import { userApi, type UserResponse } from '../../services/api';

interface PageResponse<T> {
  data: T[];
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

const UsersManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const pageSize = 20;

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [user, currentPage, searchKeyword, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      
      if (searchKeyword.trim()) {
        response = await userApi.searchUsers(searchKeyword.trim(), currentPage, pageSize);
      } else {
        response = await userApi.getAllUsers(currentPage, pageSize);
      }

      let filteredUsers = response.result.data || [];

      // Apply filters
      if (roleFilter !== 'ALL') {
        filteredUsers = filteredUsers.filter(userData => userData.role === roleFilter);
      }

      setUsers(filteredUsers);
      setTotalPages(response.result.totalPages);
      setTotalElements(response.result.totalElements);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError('Không thể tải danh sách người dùng');
    }
    setLoading(false);
  };

  const handleActivateUser = async (userId: string) => {
    setActionLoading(`activate-${userId}`);
    try {
      await userApi.activateUser(userId);
      await fetchUsers(); // Refresh data
    } catch (error: any) {
      console.error('Error activating user:', error);
      setError('Không thể kích hoạt người dùng');
    }
    setActionLoading(null);
  };

  const handleDeactivateUser = async (userId: string) => {
    setActionLoading(`deactivate-${userId}`);
    try {
      await userApi.deactivateUser(userId);
      await fetchUsers(); // Refresh data
    } catch (error: any) {
      console.error('Error deactivating user:', error);
      setError('Không thể vô hiệu hóa người dùng');
    }
    setActionLoading(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác.')) {
      return;
    }
    
    setActionLoading(`delete-${userId}`);
    try {
      await userApi.deleteUser(userId);
      await fetchUsers(); // Refresh data
    } catch (error: any) {
      console.error('Error deleting user:', error);
      setError('Không thể xóa người dùng');
    }
    setActionLoading(null);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedUsers.length === 0) return;

    const confirmMessage = action === 'delete' 
      ? `Bạn có chắc chắn muốn xóa ${selectedUsers.length} người dùng đã chọn không?`
      : `Bạn có chắc chắn muốn ${action === 'activate' ? 'kích hoạt' : 'vô hiệu hóa'} ${selectedUsers.length} người dùng đã chọn không?`;

    if (!window.confirm(confirmMessage)) return;

    setActionLoading(`bulk-${action}`);
    try {
      for (const userId of selectedUsers) {
        if (action === 'activate') {
          await userApi.activateUser(userId);
        } else if (action === 'deactivate') {
          await userApi.deactivateUser(userId);
        } else if (action === 'delete') {
          await userApi.deleteUser(userId);
        }
      }
      setSelectedUsers([]);
      await fetchUsers();
    } catch (error: any) {
      console.error(`Error in bulk ${action}:`, error);
      setError(`Không thể thực hiện hành động hàng loạt`);
    }
    setActionLoading(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'EMPLOYER': return 'bg-purple-100 text-purple-800';
      case 'USER': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị viên';
      case 'EMPLOYER': return 'Nhà tuyển dụng';
      case 'USER': return 'Người dùng';
      default: return role;
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
            <p className="text-gray-600">Bạn không có quyền truy cập trang này.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
                <p className="text-gray-600 mt-1">
                  Tổng cộng {totalElements} người dùng
                </p>
              </div>
              {selectedUsers.length > 0 && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    disabled={actionLoading !== null}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Kích hoạt ({selectedUsers.length})
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    disabled={actionLoading !== null}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                  >
                    Vô hiệu hóa ({selectedUsers.length})
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    disabled={actionLoading !== null}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Xóa ({selectedUsers.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Tìm theo tên, email..."
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">Tất cả</option>
                  <option value="USER">Người dùng</option>
                  <option value="EMPLOYER">Nhà tuyển dụng</option>
                  <option value="ADMIN">Quản trị viên</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg mb-6">
              Đang tải danh sách người dùng...
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={users.length > 0 && selectedUsers.length === users.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userData) => (
                  <tr key={userData.id} className={selectedUsers.includes(userData.id) ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(userData.id)}
                        onChange={() => handleSelectUser(userData.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UsersIcon className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userData.fullname || userData.userName}
                          </div>
                          <div className="text-sm text-gray-500">ID: {userData.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getRoleBadgeColor(userData.role)}`}>
                        {getRoleDisplayName(userData.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{userData.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{userData.phone || 'N/A'}</div>
                      <div className="text-xs">{userData.address || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => window.open(`/admin/users/${userData.id}`, '_blank')}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        
                        {userData.isActive ? (
                          <button
                            onClick={() => handleDeactivateUser(userData.id)}
                            disabled={actionLoading === `deactivate-${userData.id}`}
                            className="text-yellow-600 hover:text-yellow-800 p-1 disabled:opacity-50"
                            title="Vô hiệu hóa"
                          >
                            <ShieldExclamationIcon className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateUser(userData.id)}
                            disabled={actionLoading === `activate-${userData.id}`}
                            className="text-green-600 hover:text-green-800 p-1 disabled:opacity-50"
                            title="Kích hoạt"
                          >
                            <ShieldCheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteUser(userData.id)}
                          disabled={actionLoading === `delete-${userData.id}`}
                          className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                          title="Xóa"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && users.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy người dùng</h3>
              <p className="text-gray-600">
                {searchKeyword || roleFilter !== 'ALL'
                  ? 'Không có người dùng nào phù hợp với bộ lọc hiện tại.'
                  : 'Chưa có người dùng nào trong hệ thống.'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow mt-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> đến{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pageSize, totalElements)}
                    </span>{' '}
                    trong tổng số <span className="font-medium">{totalElements}</span> kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, currentPage - 2) + i;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UsersManagementPage; 