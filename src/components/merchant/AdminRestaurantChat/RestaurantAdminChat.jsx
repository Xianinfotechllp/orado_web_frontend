import { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { connectSocket } from '../MerchantUtils/socket';
import { 
  getRestaurantAdminChat,
  sendRestaurantMessageToAdmin 
} from '../../../apis/chatApi';
import { useSelector } from 'react-redux';

const RestaurantAdminChat = () => {
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isAdminTyping, setIsAdminTyping] = useState(false);

  // Get auth state from Redux
  const auth = useSelector(state => state.auth);
  const restaurantId = auth.user?.id;
  const token = auth.token;

  useEffect(() => {
    if (!restaurantId || !token) {
      console.log('No restaurantId or token, skipping socket setup');
      return;
    }

    console.log('Initializing socket connection...');
    const socketInstance = connectSocket(token);
    setSocket(socketInstance);

    const fetchChat = async () => {
      try {
        console.log('Fetching restaurant admin chat...');
        setLoading(true);
        const response = await getRestaurantAdminChat();
        console.log('API response:', response);
        const data = response.data;
        
        const processedChat = {
          ...data,
          messages: data.messages?.map(msg => ({
            ...msg,
            sender: {
              ...msg.sender,
              modelType: msg.senderModel || 
                        (msg.sender.id === restaurantId ? 'restaurant' : 'admin')
            }
          })) || []
        };

        setChat(processedChat);
        console.log('Chat data processed and set:', processedChat);

        if (data._id) {
          console.log('Marking messages as read for chat:', data._id);
          socketInstance.emit('markMessagesRead', {
            chatId: data._id,
            userId: restaurantId,
            userType: 'restaurant'
          });
        }
      } catch (err) {
        console.error('Error fetching chat:', err);
        if (err.response?.status === 404) {
          console.log('No chat found, creating empty chat');
          setChat({
            _id: null,
            messages: [],
            participants: [
              { id: restaurantId, modelType: 'restaurant' },
              { id: null, modelType: 'admin' }
            ]
          });
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChat();

    console.log('Joining socket room for restaurant:', restaurantId);
    socketInstance.emit('join-room', { userId: restaurantId, userType: 'restaurant' });

    const handleNewMessage = (data) => {
      console.log('Received new message:', data);
      setChat(prev => {
        if (!prev) {
          console.log('Creating new chat with first message');
          return {
            _id: data.chatId,
            messages: [{
              ...data.message,
              sender: {
                ...data.message.sender,
                modelType: data.message.senderModel || 
                          (data.message.sender.id === restaurantId ? 'restaurant' : 'admin')
              }
            }],
            participants: [
              { id: restaurantId, modelType: 'restaurant' },
              { id: null, modelType: 'admin' }
            ]
          };
        }

        const messageExists = prev.messages.some(msg => 
          msg._id === data.message._id || 
          (msg.temp && msg.content === data.message.content)
        );
        
        if (messageExists) {
          console.log('Message already exists, skipping');
          return prev;
        }
        
        console.log('Adding new message to existing chat');
        return {
          ...prev,
          _id: data.chatId || prev._id,
          messages: [...prev.messages, {
            ...data.message,
            sender: {
              ...data.message.sender,
              modelType: data.message.senderModel || 
                        (data.message.sender.id === restaurantId ? 'restaurant' : 'admin')
            }
          }]
        };
      });
    };

    const handleMessageSent = (data) => {
      console.log('Message sent confirmation received:', data);
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
    };

    const handleTypingIndicator = (data) => {
      console.log('Typing indicator received:', data);
      setIsAdminTyping(data.isTyping);
    };

    socketInstance.on('messageSent', handleMessageSent);
    socketInstance.on('newMessage', handleNewMessage);
    socketInstance.on('typingIndicator', handleTypingIndicator);

    // Log socket connection status
    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      console.log('Cleaning up socket listeners');
      socketInstance.off('messageSent', handleMessageSent);
      socketInstance.off('newMessage', handleNewMessage);
      socketInstance.off('typingIndicator', handleTypingIndicator);
    };
  }, [restaurantId, token]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    console.log('Send button clicked');
    if (!newMessage.trim()) {
      console.log('Message is empty, not sending');
      return;
    }
    if (!restaurantId) {
      console.log('No restaurantId, cannot send message');
      return;
    }
    if (!socket) {
      console.log('Socket not connected, cannot send message');
      return;
    }
    if (!token) {
      console.log('No auth token, cannot send message');
      return;
    }

    console.log('Creating temporary message');
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

    setChat(prev => {
      const newChat = {
        _id: prev?._id || null,
        messages: [...(prev?.messages || []), tempMessage],
        participants: prev?.participants || [
          { id: restaurantId, modelType: 'restaurant' },
          { id: null, modelType: 'admin' }
        ]
      };
      console.log('Updating chat with temporary message:', newChat);
      return newChat;
    });

    setNewMessage('');
    console.log('Message input cleared');

    try {
      console.log('Sending message to API...');
      console.log('msg', tempMessage)
      const response = await sendRestaurantMessageToAdmin(tempMessage.content);
      console.log('Message sent successfully:', response);
    } catch (err) {
      console.error('Error sending message:', err);
      setChat(prev => ({
        ...prev,
        messages: prev?.messages?.filter(msg => msg._id !== tempId) || []
      }));
    }

    console.log('Sending typing stop event');
    socket.emit('typingStop', {
      senderId: restaurantId,
      senderModel: 'restaurant',
      receiverId: null,
      receiverModel: 'admin',
      chatId: chat?._id || null,
    });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socket || !restaurantId) return;

    const isTypingNow = e.target.value.trim().length > 0;
    setIsTyping(isTypingNow);
    
    socket.emit(isTypingNow ? 'typingStart' : 'typingStop', {
      senderId: restaurantId,
      senderModel: 'restaurant',
      receiverId: null,
      receiverModel: 'admin',
      chatId: chat?._id || null,
    });
  };

  const formatMessageTime = (msg) => {
    const time = msg?.createdAt || msg?.timestamp;
    return time ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-white h-full">
        <div className="sticky top-0 z-10 bg-orange-500 text-white p-4 shadow-md">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle size={24} />
            Support Chat
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center bg-orange-50">
          <p>Loading chat...</p>
        </div>
        {/* Show input even during loading */}
        <div className="sticky bottom-0 p-4 bg-white border-t border-orange-200">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || loading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col bg-white h-full">
        <div className="sticky top-0 z-10 bg-orange-500 text-white p-4 shadow-md">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle size={24} />
            Support Chat
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center bg-orange-50 text-red-500">
          <p>{error}</p>
        </div>
        {/* Show input even with error */}
        <div className="sticky bottom-0 p-4 bg-white border-t border-orange-200">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={!!error}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || !!error}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-orange-500 text-white p-4 shadow-md">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageCircle size={24} />
          Support Chat
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-orange-50" style={{ paddingTop: '0.5rem' }}>
        {(!chat || chat.messages?.length === 0) ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
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
        {(isAdminTyping || isTyping) && (
          <div className="flex justify-start">
            <div className="max-w-xs px-4 py-2 rounded-lg rounded-bl-none bg-white text-gray-800 border border-orange-200">
              <p className="text-sm italic">typing...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Message Input - Always visible */}
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

export default RestaurantAdminChat;