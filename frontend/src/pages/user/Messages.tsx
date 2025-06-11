import React, { useState } from 'react';

interface Message {
  id: number;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  company?: string;
  jobTitle?: string;
}

const Messages: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(1);

  const messages: Message[] = [
    {
      id: 1,
      sender: 'Sarah Chen',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      content: 'Chào bạn! Chúng tôi đã xem CV của bạn và rất ấn tượng. Bạn có thể tham gia cuộc phỏng vấn vào thứ 5 tuần sau không?',
      timestamp: '2025-01-20 10:30',
      isRead: false,
      company: 'TechCorp',
      jobTitle: 'Frontend Developer'
    },
    {
      id: 2,
      sender: 'John Smith',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'Cảm ơn bạn đã ứng tuyển vị trí Backend Developer. Chúng tôi sẽ liên hệ lại trong vòng 3-5 ngày làm việc.',
      timestamp: '2025-01-19 14:20',
      isRead: true,
      company: 'StartupXYZ',
      jobTitle: 'Backend Developer'
    },
    {
      id: 3,
      sender: 'Lisa Wong',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      content: 'Xin chào! Chúng tôi muốn mời bạn tham gia vòng phỏng vấn technical cho vị trí Full Stack Developer.',
      timestamp: '2025-01-18 09:15',
      isRead: true,
      company: 'InnovateLab',
      jobTitle: 'Full Stack Developer'
    }
  ];

  const selectedMessageData = messages.find(m => m.id === selectedMessage);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tin nhắn</h1>
        <p className="text-gray-600">Quản lý tin nhắn từ các nhà tuyển dụng</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex h-96">
          {/* Messages List */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm tin nhắn..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedMessage === message.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={message.avatar}
                      alt={message.sender}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {message.sender}
                        </p>
                        {!message.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{message.company} • {message.jobTitle}</p>
                      <p className={`text-sm truncate ${!message.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                        {message.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="flex-1 flex flex-col">
            {selectedMessageData ? (
              <>
                {/* Message Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedMessageData.avatar}
                      alt={selectedMessageData.sender}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedMessageData.sender}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedMessageData.company} • {selectedMessageData.jobTitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 p-4">
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <p className="text-sm text-gray-900">{selectedMessageData.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(selectedMessageData.timestamp).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reply Box */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <textarea
                        placeholder="Nhập tin nhắn của bạn..."
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Chọn tin nhắn</h3>
                  <p className="mt-1 text-sm text-gray-500">Chọn một tin nhắn để xem chi tiết</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages; 