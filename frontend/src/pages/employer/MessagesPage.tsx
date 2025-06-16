import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  UsersIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  FaceSmileIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

const EmployerMessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState('1');
  const [messageText, setMessageText] = useState('');

  const handleLogout = () => {
    // Xóa token/session từ localStorage hoặc sessionStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    sessionStorage.clear();
    
    // Chuyển hướng về trang chủ
    navigate('/');
  };

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', active: false, href: '/employer/dashboard' },
    { icon: BriefcaseIcon, label: 'Tin nhắn', active: true, href: '/employer/messages' },
    { icon: BuildingOfficeIcon, label: 'Hồ sơ công ty', href: '/employer/company' },
    { icon: UsersIcon, label: 'Tất cả ứng viên', href: '/employer/candidates' },
    { icon: DocumentTextIcon, label: 'Danh sách công việc', href: '/employer/jobs' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/employer/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/employer/help' }
  ];

  // Mock data for conversations
  const conversations = [
    {
      id: '1',
      candidate: 'Jake Gyll',
      position: 'Social Media Assistant',
      avatar: 'https://via.placeholder.com/40x40?text=JG',
      lastMessage: 'Anh có thể cho em biết thêm về quy trình phỏng vấn không ạ?',
      time: '12:30 PM',
      unread: true,
      online: true
    },
    {
      id: '2',
      candidate: 'Maria Santos',
      position: 'Brand Designer',
      avatar: 'https://via.placeholder.com/40x40?text=MS',
      lastMessage: 'Cảm ơn anh đã phản hồi, em sẽ chuẩn bị tốt cho buổi phỏng vấn',
      time: '11:45 AM',
      unread: false,
      online: false
    },
    {
      id: '3',
      candidate: 'David Chen',
      position: 'Product Designer',
      avatar: 'https://via.placeholder.com/40x40?text=DC',
      lastMessage: 'Em có thể bắt đầu làm việc từ tuần sau được không ạ?',
      time: '10:20 AM',
      unread: false,
      online: true
    },
    {
      id: '4',
      candidate: 'Sarah Kim',
      position: 'Frontend Developer',
      avatar: 'https://via.placeholder.com/40x40?text=SK',
      lastMessage: 'Portfolio của em đã được cập nhật',
      time: 'Yesterday',
      unread: false,
      online: false
    }
  ];

  // Mock data for messages
  const messages = [
    {
      id: '1',
      sender: 'candidate',
      text: 'Chào anh, em đã nộp đơn ứng tuyển vị trí Social Media Assistant tại công ty. Em muốn hỏi thêm về yêu cầu công việc.',
      time: '10:00 AM',
      avatar: 'https://via.placeholder.com/32x32?text=JG'
    },
    {
      id: '2',
      sender: 'employer',
      text: 'Chào bạn! Cảm ơn bạn đã quan tâm đến vị trí này. Công việc chủ yếu là quản lý các kênh social media của công ty, tạo content và tương tác với khách hàng.',
      time: '10:15 AM',
      avatar: 'https://via.placeholder.com/32x32?text=HR'
    },
    {
      id: '3',
      sender: 'candidate',
      text: 'Em hiểu rồi ạ. Vậy công ty có training cho nhân viên mới không?',
      time: '10:20 AM',
      avatar: 'https://via.placeholder.com/32x32?text=JG'
    },
    {
      id: '4',
      sender: 'employer',
      text: 'Có nhé, chúng tôi có chương trình đào tạo 2 tuần đầu để bạn làm quen với quy trình và tools của công ty.',
      time: '10:25 AM',
      avatar: 'https://via.placeholder.com/32x32?text=HR'
    },
    {
      id: '5',
      sender: 'candidate',
      text: 'Anh có thể cho em biết thêm về quy trình phỏng vấn không ạ?',
      time: '12:30 PM',
      avatar: 'https://via.placeholder.com/32x32?text=JG'
    }
  ];

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle sending message logic here
      setMessageText('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TopJob</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile - Sticky at bottom */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span>Đăng xuất</span>
          </button>
          
          <div className="mt-3 flex items-center space-x-3">
            <img
              src="https://via.placeholder.com/40x40?text=NQ"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Nguyễn Quang Huy
              </p>
              <p className="text-xs text-gray-500 truncate">
                qhi@email.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Company</span>
                <span className="text-orange-600 font-medium">VNG</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Quay lại trang chủ
              </Link>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tin nhắn</h1>
            </div>
          </div>
        </header>

        {/* Messages Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm ứng viên..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat === conversation.id ? 'bg-emerald-50 border-r-2 border-emerald-600' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <img
                        src={conversation.avatar}
                        alt={conversation.candidate}
                        className="w-12 h-12 rounded-full"
                      />
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.candidate}
                        </h3>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{conversation.position}</p>
                      <p className={`text-sm truncate ${conversation.unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread && (
                        <div className="mt-1">
                          <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={selectedConversation.avatar}
                          alt={selectedConversation.candidate}
                          className="w-10 h-10 rounded-full"
                        />
                        {selectedConversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {selectedConversation.candidate}
                        </h3>
                        <p className="text-sm text-gray-600">{selectedConversation.position}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'employer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-xs lg:max-w-md ${message.sender === 'employer' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <img
                          src={message.avatar}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        <div className={`mx-3 ${message.sender === 'employer' ? 'text-right' : 'text-left'}`}>
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              message.sender === 'employer'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-4">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <PaperClipIcon className="h-5 w-5" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <FaceSmileIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chọn một cuộc trò chuyện
                  </h3>
                  <p className="text-gray-600">
                    Chọn ứng viên từ danh sách để bắt đầu trò chuyện
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerMessagesPage; 