import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BellIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowPathIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CogIcon,
  EnvelopeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface Notification {
  id: number;
  user_id?: number;
  title: string;
  message: string;
  type: 'system' | 'user' | 'company' | 'job' | 'application' | 'security' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  is_global: boolean;
  target_audience: 'all' | 'users' | 'companies' | 'admins';
  action_url?: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  sender_name?: string;
  recipient_count?: number;
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'System Maintenance Scheduled',
      message: 'Platform will undergo scheduled maintenance tonight from 2:00 AM to 4:00 AM. All services will be temporarily unavailable.',
      type: 'maintenance',
      priority: 'high',
      is_read: false,
      is_global: true,
      target_audience: 'all',
      action_url: '/admin/settings',
      created_at: '2024-01-25 10:30:00',
      updated_at: '2024-01-25 10:30:00',
      expires_at: '2024-01-26 04:00:00',
      sender_name: 'System Administrator',
      recipient_count: 1250
    },
    {
      id: 2,
      user_id: 123,
      title: 'New Company Registration',
      message: 'Tech Innovations Ltd has registered and is pending approval.',
      type: 'company',
      priority: 'medium',
      is_read: false,
      is_global: false,
      target_audience: 'admins',
      action_url: '/admin/companies',
      created_at: '2024-01-25 09:15:00',
      updated_at: '2024-01-25 09:15:00',
      sender_name: 'Registration System',
      recipient_count: 3
    },
    {
      id: 3,
      title: 'High Application Volume Alert',
      message: 'Senior React Developer position has received over 50 applications in the last 24 hours.',
      type: 'job',
      priority: 'medium',
      is_read: true,
      is_global: false,
      target_audience: 'admins',
      action_url: '/admin/jobs',
      created_at: '2024-01-25 08:45:00',
      updated_at: '2024-01-25 09:00:00',
      sender_name: 'Job Alert System',
      recipient_count: 3
    },
    {
      id: 4,
      title: 'Security Alert: Multiple Failed Login Attempts',
      message: 'User account john.doe@email.com has 5 failed login attempts in the last hour.',
      type: 'security',
      priority: 'urgent',
      is_read: false,
      is_global: false,
      target_audience: 'admins',
      action_url: '/admin/users',
      created_at: '2024-01-25 07:30:00',
      updated_at: '2024-01-25 07:30:00',
      sender_name: 'Security Monitor',
      recipient_count: 3
    },
    {
      id: 5,
      title: 'Welcome to TopJob Platform',
      message: 'Thank you for joining TopJob! Complete your profile to get better job recommendations.',
      type: 'user',
      priority: 'low',
      is_read: true,
      is_global: false,
      target_audience: 'users',
      created_at: '2024-01-24 15:20:00',
      updated_at: '2024-01-24 15:20:00',
      sender_name: 'Welcome Bot',
      recipient_count: 856
    },
    {
      id: 6,
      title: 'Database Backup Completed',
      message: 'Daily automated backup completed successfully. All data is secure.',
      type: 'system',
      priority: 'low',
      is_read: true,
      is_global: false,
      target_audience: 'admins',
      created_at: '2024-01-25 03:00:00',
      updated_at: '2024-01-25 03:00:00',
      sender_name: 'Backup System',
      recipient_count: 3
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Admin authentication check
  useEffect(() => {
    const checkAdminAuth = () => {
      const user = localStorage.getItem('user');
      const adminSession = localStorage.getItem('adminSession');
      
      if (!user || !adminSession) {
        navigate('/admin/login', { replace: true });
        return;
      }

      try {
        const userData = JSON.parse(user);
        if (userData.userType !== 'admin') {
          navigate('/admin/login', { replace: true });
          return;
        }
      } catch (error) {
        navigate('/admin/login', { replace: true });
        return;
      }
    };

    checkAdminAuth();
  }, [navigate]);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notification.sender_name && notification.sender_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'read' && notification.is_read) ||
      (filterStatus === 'unread' && !notification.is_read);
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const handleSelectNotification = (notificationId: number) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    setSelectedNotifications(
      selectedNotifications.length === filteredNotifications.length 
        ? [] 
        : filteredNotifications.map(notification => notification.id)
    );
  };

  const handleBulkMarkAsRead = () => {
    setNotifications(prev => prev.map(notification => 
      selectedNotifications.includes(notification.id) ? { ...notification, is_read: true } : notification
    ));
    setSelectedNotifications([]);
  };

  const handleBulkDelete = () => {
    setNotifications(prev => prev.filter(notification => !selectedNotifications.includes(notification.id)));
    setSelectedNotifications([]);
  };

  // Action handlers
  const handleViewNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowViewModal(true);
    // Mark as read when viewed
    if (!notification.is_read) {
      setNotifications(prev => prev.map(n => 
        n.id === notification.id ? { ...n, is_read: true } : n
      ));
    }
  };

  const handleEditNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowEditModal(true);
  };

  const handleDeleteNotification = (notificationId: number) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }
  };

  const closeModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowCreateModal(false);
    setSelectedNotification(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <CogIcon className="w-5 h-5" />;
      case 'user':
        return <UserIcon className="w-5 h-5" />;
      case 'company':
        return <BuildingOfficeIcon className="w-5 h-5" />;
      case 'job':
        return <BriefcaseIcon className="w-5 h-5" />;
      case 'application':
        return <EnvelopeIcon className="w-5 h-5" />;
      case 'security':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'maintenance':
        return <ClockIcon className="w-5 h-5" />;
      default:
        return <InformationCircleIcon className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system':
        return 'bg-gray-100 text-gray-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      case 'company':
        return 'bg-teal-100 text-teal-800';
      case 'job':
        return 'bg-purple-100 text-purple-800';
      case 'application':
        return 'bg-orange-100 text-orange-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTargetAudienceColor = (audience: string) => {
    switch (audience) {
      case 'all':
        return 'bg-purple-100 text-purple-800';
      case 'users':
        return 'bg-blue-100 text-blue-800';
      case 'companies':
        return 'bg-teal-100 text-teal-800';
      case 'admins':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BellIcon className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notification Management</h1>
                <p className="text-sm text-gray-500">{notifications.length} total notifications</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Notification
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <BellIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => !n.is_read).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => n.priority === 'urgent').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => n.is_read).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="system">System</option>
              <option value="user">User</option>
              <option value="company">Company</option>
              <option value="job">Job</option>
              <option value="application">Application</option>
              <option value="security">Security</option>
              <option value="maintenance">Maintenance</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterPriority('all');
                setFilterStatus('all');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-800">
                {selectedNotifications.length} notification(s) selected
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkMarkAsRead}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mark as Read
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notifications Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target & Reach
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNotifications.map((notification, index) => (
                  <motion.tr
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:bg-gray-50 ${!notification.is_read ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => handleSelectNotification(notification.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(notification.priority)} mt-1`}></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className={`text-sm font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            {!notification.is_read && (
                              <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 max-w-md truncate">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            From: {notification.sender_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                          {getTypeIcon(notification.type)}
                          <span className="ml-1">{notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}</span>
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full text-white ${getPriorityColor(notification.priority)}`}>
                          {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getTargetAudienceColor(notification.target_audience)}`}>
                          {notification.target_audience.charAt(0).toUpperCase() + notification.target_audience.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {notification.recipient_count?.toLocaleString()} recipients
                      </div>
                      {notification.is_global && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 mt-1">
                          Global
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        notification.is_read 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {notification.is_read ? (
                          <>
                            <CheckCircleIcon className="w-3 h-3 mr-1" />
                            Read
                          </>
                        ) : (
                          <>
                            <ClockIcon className="w-3 h-3 mr-1" />
                            Unread
                          </>
                        )}
                      </span>
                      {notification.expires_at && (
                        <div className="text-xs text-gray-500 mt-1">
                          Expires: {new Date(notification.expires_at).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(notification.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="View Details" onClick={() => handleViewNotification(notification)}>
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-900" title="Edit" onClick={() => handleEditNotification(notification)}>
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Delete" onClick={() => handleDeleteNotification(notification.id)}>
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredNotifications.length}</span> of{' '}
              <span className="font-medium">{filteredNotifications.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Notification Modal */}
      {showViewModal && selectedNotification && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModals}></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Notification Details</h3>
                      <button
                        onClick={closeModals}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Close</span>
                        <XCircleIcon className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedNotification.title}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedNotification.message}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Type</label>
                          <span className={`mt-1 inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedNotification.type)}`}>
                            {getTypeIcon(selectedNotification.type)}
                            <span className="ml-1">{selectedNotification.type.charAt(0).toUpperCase() + selectedNotification.type.slice(1)}</span>
                          </span>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Priority</label>
                          <span className={`mt-1 inline-flex items-center px-2 py-1 text-xs font-medium rounded-full text-white ${getPriorityColor(selectedNotification.priority)}`}>
                            {selectedNotification.priority.charAt(0).toUpperCase() + selectedNotification.priority.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                          <span className={`mt-1 inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getTargetAudienceColor(selectedNotification.target_audience)}`}>
                            {selectedNotification.target_audience.charAt(0).toUpperCase() + selectedNotification.target_audience.slice(1)}
                          </span>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Recipients</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedNotification.recipient_count?.toLocaleString()} recipients</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Sender</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedNotification.sender_name}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <span className={`mt-1 inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedNotification.is_read 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {selectedNotification.is_read ? (
                              <>
                                <CheckCircleIcon className="w-3 h-3 mr-1" />
                                Read
                              </>
                            ) : (
                              <>
                                <ClockIcon className="w-3 h-3 mr-1" />
                                Unread
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Created At</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(selectedNotification.created_at).toLocaleString()}
                          </p>
                        </div>
                        
                        {selectedNotification.expires_at && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Expires At</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {new Date(selectedNotification.expires_at).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {selectedNotification.action_url && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Action URL</label>
                          <p className="mt-1 text-sm text-blue-600 hover:text-blue-800">
                            <a href={selectedNotification.action_url} target="_blank" rel="noopener noreferrer">
                              {selectedNotification.action_url}
                            </a>
                          </p>
                        </div>
                      )}
                      
                      {selectedNotification.is_global && (
                        <div>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            Global Notification
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleEditNotification(selectedNotification)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModals}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications; 