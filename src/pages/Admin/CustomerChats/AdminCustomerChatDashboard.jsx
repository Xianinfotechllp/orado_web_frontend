import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import AdminChatList from './CustomerChatList';
import AdminChatWindow from './AdminCustomerChatWindow';

const AdminCustomerChatDashboard = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);

  const handleSelectChat = (userId, chatId) => {
    setSelectedUserId(userId);
    setSelectedChatId(chatId);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminChatList 
        onSelectChat={handleSelectChat} 
        selectedUserId={selectedUserId} 
      />
      {selectedUserId ? (
        <AdminChatWindow 
          userId={selectedUserId} 
          chatId={selectedChatId} 
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-orange-50">
          <div className="text-center">
            <MessageCircle size={64} className="text-orange-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Admin Chat</h3>
            <p className="text-gray-500">Select a customer chat to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomerChatDashboard;