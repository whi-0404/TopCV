import React, { useState } from 'react';

interface Message {
  id: number;
  candidateName: string;
  candidateAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  jobTitle: string;
  isFromCandidate: boolean;
}

interface Conversation {
  candidateId: number;
  candidateName: string;
  candidateAvatar: string;
  jobTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const Messages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');

  const conversations: Conversation[] = [
    {
      candidateId: 1,
      candidateName: 'Nguyễn Văn A',
      candidateAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      jobTitle: 'Frontend Developer',
      lastMessage: 'Cảm ơn anh đã phản hồi. Em có thể biết thêm về quy trình phỏng vấn không ạ?',
      lastMessageTime: '2025-01-20 10:30',
      unreadCount: 2,
      messages: [
        {
          id: 1,
          candidateName: 'Nguyễn Văn A',
          candidateAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          content: 'Chào anh! Em đã ứng tuyển vị trí Frontend Developer tại công ty. Em rất mong được trao đổi thêm về cơ hội này.',
          timestamp: '2025-01-19 14:00',
          isRead: true,
          jobTitle: 'Frontend Developer',
          isFromCandidate: true
        },
        {
          id: 2,
          candidateName: 'TechCorp HR',
          candidateAvatar: '',
          content: 'Chào bạn! Chúng tôi đã nhận được hồ sơ của bạn và rất ấn tượng với kinh nghiệm. Bạn có thể tham gia cuộc phỏng vấn vào thứ 5 tuần sau không?',
          timestamp: '2025-01-20 09:00',
          isRead: true,
          jobTitle: 'Frontend Developer',
          isFromCandidate: false
        },
        {
          id: 3,
          candidateName: 'Nguyễn Văn A',
          candidateAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          content: 'Cảm ơn anh đã phản hồi. Em có thể biết thêm về quy trình phỏng vấn không ạ?',
          timestamp: '2025-01-20 10:30',
          isRead: false,
          jobTitle: 'Frontend Developer',
          isFromCandidate: true
        }
      ]
    },
    {
      candidateId: 2,
      candidateName: 'Trần Thị B',
      candidateAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      jobTitle: 'Backend Developer',
      lastMessage: 'Em đã gửi thêm portfolio qua email. Mong anh xem xét ạ.',
      lastMessageTime: '2025-01-19 16:45',
      unreadCount: 0,
      messages: [
        {
          id: 4,
          candidateName: 'Trần Thị B',
          candidateAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          content: 'Chào anh! Em đã gửi thêm portfolio qua email. Mong anh xem xét ạ.',
          timestamp: '2025-01-19 16:45',
          isRead: true,
          jobTitle: 'Backend Developer',
          isFromCandidate: true
        }
      ]
    },
    {
      candidateId: 3,
      candidateName: 'Lê Văn C',
      candidateAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      jobTitle: 'UI/UX Designer',
      lastMessage: 'Xin chào! Em muốn hỏi về yêu cầu kinh nghiệm cho vị trí này.',
      lastMessageTime: '2025-01-18 11:20',
      unreadCount: 1,
      messages: [
        {
          id: 5,
          candidateName: 'Lê Văn C',
          candidateAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          content: 'Xin chào! Em muốn hỏi về yêu cầu kinh nghiệm cho vị trí này.',
          timestamp: '2025-01-18 11:20',
          isRead: false,
          jobTitle: 'UI/UX Designer',
          isFromCandidate: true
        }
      ]
    }
  ];

  const selectedConversationData = conversations.find(c => c.candidateId === selectedConversation);

  const sendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const markAsRead = (conversationId: number) => {
    console.log('Marking conversation as read:', conversationId);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tin nhắn ứng viên</h1>
        <p className="text-gray-600">Trao đổi với các ứng viên quan tâm</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex h-96">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm cuộc trò chuyện..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.candidateId}
                  onClick={() => {
                    setSelectedConversation(conversation.candidateId);
                    markAsRead(conversation.candidateId);
                  }}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedConversation === conversation.candidateId ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <img
                        src={conversation.candidateAvatar}
                        alt={conversation.candidateName}
                        className="w-10 h-10 rounded-full"
                      />
                      {conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                          {conversation.candidateName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(conversation.lastMessageTime).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{conversation.jobTitle}</p>
                      <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="flex-1 flex flex-col">
            {selectedConversationData ? (
              <>
                {/* Message Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedConversationData.candidateAvatar}
                        alt={selectedConversationData.candidateName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedConversationData.candidateName}</h3>
                        <p className="text-sm text-gray-500">
                          Ứng tuyển: {selectedConversationData.jobTitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {selectedConversationData.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromCandidate ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${message.isFromCandidate ? 'order-2' : 'order-1'}`}>
                          <div className={`rounded-lg p-3 ${
                            message.isFromCandidate 
                              ? 'bg-gray-100 text-gray-900' 
                              : 'bg-blue-600 text-white'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className={`text-xs mt-1 ${
                            message.isFromCandidate ? 'text-left' : 'text-right'
                          } text-gray-500`}>
                            {new Date(message.timestamp).toLocaleString('vi-VN')}
                          </p>
                        </div>
                        {message.isFromCandidate && (
                          <img
                            src={message.candidateAvatar}
                            alt={message.candidateName}
                            className="w-8 h-8 rounded-full order-1 mr-2"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Quick Replies */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => setNewMessage('Cảm ơn bạn đã ứng tuyển. Chúng tôi sẽ xem xét hồ sơ và phản hồi sớm nhất.')}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      Cảm ơn đã ứng tuyển
                    </button>
                    <button
                      onClick={() => setNewMessage('Bạn có thể tham gia phỏng vấn vào ngày... không?')}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      Mời phỏng vấn
                    </button>
                    <button
                      onClick={() => setNewMessage('Chúng tôi cần thêm thông tin về kinh nghiệm của bạn.')}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      Yêu cầu thông tin
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Chọn cuộc trò chuyện</h3>
                  <p className="mt-1 text-sm text-gray-500">Chọn một cuộc trò chuyện để bắt đầu trao đổi</p>
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