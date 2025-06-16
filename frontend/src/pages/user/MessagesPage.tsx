import React, { useState } from 'react';
import { 
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon as SearchIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  EllipsisHorizontalIcon,
  StarIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token/session từ localStorage hoặc sessionStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    sessionStorage.clear();
    
    // Chuyển hướng về trang chủ
    navigate('/');
  };
  const [selectedChat, setSelectedChat] = useState('1');
  const [messageText, setMessageText] = useState('');

  // Mock data
  const conversations = [
    {
      id: '1',
      name: 'Jan Mayer',
      title: 'Recruiter tại Nomad',
      avatar: 'https://via.placeholder.com/40x40?text=JM',
      lastMessage: 'We want to invite you for a qui...',
      time: 'Cách đây 12p',
      unread: true
    },
    {
      id: '2',
      name: 'Joe Bartmann',
      avatar: 'https://via.placeholder.com/40x40?text=JB',
      lastMessage: 'Hey thanks for your interview...',
      time: '3:40 PM',
      unread: false
    },
    {
      id: '3',
      name: 'Ally Wales',
      avatar: 'https://via.placeholder.com/40x40?text=AW',
      lastMessage: 'Hey thanks for your interview...',
      time: '3:40 PM',
      unread: false
    },
    {
      id: '4',
      name: 'James Gardner',
      avatar: 'https://via.placeholder.com/40x40?text=JG',
      lastMessage: 'Hey thanks for your interview...',
      time: '3:40 PM',
      unread: false
    },
    {
      id: '5',
      name: 'Allison Geidt',
      avatar: 'https://via.placeholder.com/40x40?text=AG',
      lastMessage: 'Hey thanks for your interview...',
      time: '3:40 PM',
      unread: false
    },
    {
      id: '6',
      name: 'Ruben Culhane',
      avatar: 'https://via.placeholder.com/40x40?text=RC',
      lastMessage: 'Hey thanks for your interview...',
      time: '3:40 PM',
      unread: false
    },
    {
      id: '7',
      name: 'Lydia Diaz',
      avatar: 'https://via.placeholder.com/40x40?text=LD',
      lastMessage: 'Hey thanks for your interview...',
      time: '3:40 PM',
      unread: false
    },
    {
      id: '8',
      name: 'James Dokidis',
      avatar: 'https://via.placeholder.com/40x40?text=JD',
      lastMessage: 'Hey thanks for your interview...',
      time: '3:40 PM',
      unread: false
    },
    {
      id: '9',
      name: 'Angelina Swann',
      avatar: 'https://via.placeholder.com/40x40?text=AS',
      lastMessage: 'Hey thanks for your interview...',
      time: '3:40 PM',
      unread: false
    }
  ];

  const messages = [
    {
      id: '1',
      senderId: '1',
      senderName: 'Jan Mayer',
      text: 'Hey Jake, I wanted to reach out because we saw your work contributions and were impressed by your work.',
      time: 'Hôm nay',
      isOwn: false
    },
    {
      id: '2',
      senderId: '1',
      senderName: 'Jan Mayer',
      text: 'We want to invite you for a quick interview',
      time: 'Cách đây 12 phút',
      isOwn: false
    },
    {
      id: '3',
      senderId: 'me',
      senderName: 'Bạn',
      text: 'Hi Jan, sure I would love to. Thanks for taking the time to see my work!',
      time: 'Cách đây 12 phút',
      isOwn: true
    }
  ];

  const sidebarItems = [
    { icon: HomeIcon, label: 'Tổng quan', active: false, href: '/user/dashboard' },
    { icon: UserIcon, label: 'Tin nhắn', badge: '1', active: true, href: '/user/messages' },
    { icon: BriefcaseIcon, label: 'Công việc đã ứng tuyển', href: '/user/applications' },
    { icon: HeartIcon, label: 'Công việc yêu thích', href: '/user/favorites' },
    { icon: UserCircleIcon, label: 'Trang cá nhân', href: '/user/profile' },
    { icon: Cog6ToothIcon, label: 'Cài đặt', href: '/user/settings' },
    { icon: QuestionMarkCircleIcon, label: 'Trợ giúp', href: '/user/help' }
  ];

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle sending message
      console.log('Sending message:', messageText);
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
                  {item.badge && (
                    <span className="bg-emerald-600 text-white text-xs rounded-full px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Settings Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            CÀI ĐẶT
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                to="/user/settings"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Cog6ToothIcon className="h-5 w-5" />
                <span>Cài đặt</span>
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
                <span>Trợ giúp</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* User Profile - Sticky at bottom */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src="https://via.placeholder.com/40x40?text=NH"
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
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Conversations List */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Tin nhắn</h1>
                             <Link
                 to="/"
                 className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
               >
                 Quay lại trang chủ
               </Link>
            </div>
            
            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tin nhắn"
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
                  selectedChat === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="w-12 h-12 rounded-full"
                    />
                    {conversation.unread && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-gray-500">{conversation.time}</span>
                    </div>
                    {conversation.title && (
                      <p className="text-xs text-gray-500 mb-1">{conversation.title}</p>
                    )}
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
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
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h2 className="font-semibold text-gray-900">{selectedConversation.name}</h2>
                      <p className="text-sm text-gray-600">{selectedConversation.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <ShareIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <StarIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="text-center">
                  <span className="text-sm text-gray-500">
                    Đây là tin nhắn đầu tiên bạn gửi với {selectedConversation.name}
                  </span>
                </div>

                <div className="flex items-center space-x-2 my-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm text-gray-500 bg-white px-3">Hôm nay</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isOwn 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}

                <div className="text-center">
                  <span className="text-xs text-gray-500">Cách đây 12 phút</span>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="flex items-end space-x-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <PaperClipIcon className="h-5 w-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Trả lời tin nhắn"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none pr-12"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                      <FaceSmileIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    className="p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;