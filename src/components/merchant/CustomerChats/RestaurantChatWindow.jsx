import { useState, useEffect } from 'react';
import { MessageCircle, Send, ChevronLeft } from 'lucide-react';
import { connectSocket } from '../MerchantUtils/socket';
import { useNavigate } from 'react-router-dom';
import { 
  getRestaurantCustomerChat,
  sendRestaurantMessageToCustomer 
} from '../../../apis/chatApi';
import { useSelector } from 'react-redux';

const RestaurantChatWindow = ({ userId, chatId, onBack }) => {
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // Get token and restaurantId from Redux store
  const auth = useSelector((state) => state.auth);
  const restaurantId = auth.user?.id;
  const token = auth.token;

  useEffect(() => {
    if (!userId || !restaurantId) return;

    const socketInstance = connectSocket(token);
    setSocket(socketInstance);

    const fetchChat = async () => {
      try {
        setLoading(true);
        const response = await getRestaurantCustomerChat(userId);

        const data = response.data;
        console.log('Restaurant chat data', data);

        // Ensure messages have proper sender information
        const processedChat = {
          ...data,
          messages: data.messages.map(msg => ({
            ...msg,
            sender: {
              ...msg.sender,
              modelType: msg.senderModel || 
                        (msg.sender.id === restaurantId ? 'restaurant' : 'user')
            }
          }))
        };

        setChat(processedChat);

        if (data._id) {
          // Mark messages as read
          socketInstance.emit('markMessagesRead', {
            chatId: data._id,
            userId: restaurantId,
            userType: 'restaurant'
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();

    socketInstance.emit('join-room', { userId: restaurantId, userType: 'restaurant' });

    const handleNewMessage = (data) => {
      if (data.chatId === chat?._id) {
        setChat(prev => {
          if (!prev) return prev;
          
          const messageExists = prev.messages.some(msg => 
            msg._id === data.message._id || 
            (msg.temp && msg.content === data.message.content)
          );
          
          if (messageExists) return prev;
          
          return {
            ...prev,
            messages: [...prev.messages, {
              ...data.message,
              sender: {
                ...data.message.sender,
                modelType: data.message.senderModel || 
                          (data.message.sender.id === restaurantId ? 'restaurant' : 'user')
              }
            }]
          };
        });
      }
    };

    const handleMessageSent = (data) => {
      if (data.chatId === chat?._id) {
        setChat(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            messages: prev.messages.map(msg => 
              msg.temp && msg.content === data.message.content ? {
                ...data.message,
                sender: {
                  ...data.message.sender,
                  modelType: data.message.senderModel || 'restaurant'
                }
              } : msg
            )
          };
        });
      }
    };

    const handleTypingIndicator = (data) => {
      if (data.chatId === chat?._id && data.senderModel === 'user') {
        setIsTyping(data.isTyping);
      }
    };

    socketInstance.on('messageSent', handleMessageSent);
    socketInstance.on('newMessage', handleNewMessage);
    socketInstance.on('typingIndicator', handleTypingIndicator);

    return () => {
      socketInstance.off('messageSent', handleMessageSent);
      socketInstance.off('newMessage', handleNewMessage);
      socketInstance.off('typingIndicator', handleTypingIndicator);
    };
  }, [userId, restaurantId, token]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat || !restaurantId || !socket) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      content: newMessage.trim(),
      sender: { 
        id: restaurantId,
        modelType: 'restaurant' 
      },
      timestamp: new Date(),
      readBy: [restaurantId],
      temp: true,
    };

    setChat(prev => ({
      ...prev,
      messages: [...prev.messages, tempMessage],
    }));

    setNewMessage('');

    try {
      await sendRestaurantMessageToCustomer(userId, tempMessage.content);
    } catch (err) {
      console.error('Error sending message:', err);
      setChat(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg._id !== tempId),
      }));
    }

    socket.emit('typingStop', {
      senderId: restaurantId,
      senderModel: 'restaurant',
      receiverId: userId,
      receiverModel: 'user',
      chatId: chat._id,
    });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socket || !restaurantId || !chat) return;

    const isTypingNow = e.target.value.trim().length > 0;
    socket.emit(isTypingNow ? 'typingStart' : 'typingStop', {
      senderId: restaurantId,
      senderModel: 'restaurant',
      receiverId: userId,
      receiverModel: 'user',
      chatId: chat._id,
    });
  };

  const formatMessageTime = (msg) => {
    const time = msg?.createdAt || msg?.timestamp;
    return time ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center bg-orange-50">Loading...</div>;
  }

  if (error) {
    return <div className="flex-1 flex items-center justify-center bg-orange-50 text-red-500">{error}</div>;
  }

  if (!chat) {
    return <div className="flex-1 flex items-center justify-center bg-orange-50">No chat found</div>;
  }

  const user = chat.participants?.find(p => p.modelType === 'user');
  const userName = user?.id.name || 'Unknown User';
  const userEmail = user?.id.email || 'No email provided';

  const goToUserOrders = () => {
    if (userId) {
      navigate(`/restaurant/dashboard/customer/${userId}/orders`);
    } else {
      console.warn("User ID not found, can't navigate");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      <div className="sticky top-0 z-10 bg-orange-500 text-white p-4 shadow-md">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="mr-2 p-1 rounded-full hover:bg-orange-500"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="bg-orange-400 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 
              onClick={goToUserOrders}
              className="font-bold text-lg truncate cursor-pointer hover:underline">
              {userName}
            </h2>
            <p className="text-orange-100 text-sm truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-orange-50" style={{ paddingTop: '0.5rem' }}>
        {chat.messages?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet</p>
          </div>
        ) : (
          chat.messages.map((msg) => {
            const isRestaurant = msg.senderModel === 'restaurant' || msg.sender?.id === restaurantId;
            return (
              <div key={msg._id} className={`flex ${isRestaurant ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                  isRestaurant ? 'bg-orange-500 text-white rounded-br-none' 
                          : 'bg-white text-gray-800 rounded-bl-none border border-orange-200'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isRestaurant ? 'text-orange-100' : 'text-gray-500'}`}>
                    {formatMessageTime(msg)}
                    {!isRestaurant && msg.readBy?.includes(restaurantId) && <span className="ml-2">✓ Read</span>}
                  </p>
                </div>
              </div>
            );
          })
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs px-4 py-2 rounded-lg rounded-bl-none bg-white text-gray-800 border border-orange-200">
              <p className="text-sm italic">typing...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="sticky bottom-0 p-4 bg-white border-t border-orange-200">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantChatWindow;