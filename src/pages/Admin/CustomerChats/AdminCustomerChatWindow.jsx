import { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { connectSocket } from '../AdminUtils/socket';

const AdminChatWindow = ({ userId, chatId }) => {
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [adminId, setAdminId] = useState(null);

  // Decode and store adminId on mount
  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload?.userId) {
          setAdminId(payload.userId);
        }
      } catch (err) {
        console.error('Error decoding adminToken:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId || !adminId) return;

    const token = sessionStorage.getItem('adminToken');
    const socketInstance = connectSocket(token);
    setSocket(socketInstance);

    const fetchChat = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/chat/admin/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        console.log('chat data', data)
        if (!response.ok || !data?.success) {
          throw new Error(data?.message || 'Failed to fetch chat');
        }

        // Ensure messages have proper sender information
        const processedChat = {
          ...data.data,
          messages: data.data.messages.map(msg => ({
            ...msg,
            sender: {
              ...msg.sender,
              modelType: msg.senderModel || 
                        (msg.sender.id === adminId ? 'admin' : 'user')
            }
          }))
        };

        setChat(processedChat);

        if (data.data._id) {
          await fetch(`http://localhost:5000/chat/mark-read/${data.data._id}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();

    socketInstance.emit('join-room', { userId: adminId, userType: 'admin' });

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
                          (data.message.sender.id === adminId ? 'admin' : 'user')
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
                  modelType: data.message.senderModel || 'admin'
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
  }, [userId, adminId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat || !adminId || !socket) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      content: newMessage.trim(),
      sender: { 
        id: adminId,
        modelType: 'admin' 
      },
      timestamp: new Date(),
      readBy: [adminId],
      temp: true,
    };

    setChat(prev => ({
      ...prev,
      messages: [...prev.messages, tempMessage],
    }));

    setNewMessage('');

    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:5000/chat/admin/users/${userId}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: tempMessage.content }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to send message');

    } catch (err) {
      console.error('Error sending message:', err);
      setChat(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg._id !== tempId),
      }));
    }

    socket.emit('typingStop', {
      senderId: adminId,
      senderModel: 'admin',
      receiverId: userId,
      receiverModel: 'user',
      chatId: chat._id,
    });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socket || !adminId || !chat) return;

    const isTypingNow = e.target.value.trim().length > 0;
    socket.emit(isTypingNow ? 'typingStart' : 'typingStop', {
      senderId: adminId,
      senderModel: 'admin',
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

  const user = chat.participants?.find(p => p.modelType === 'user')?.id;

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header remains the same */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-orange-50">
        {chat.messages?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet</p>
          </div>
        ) : (
          chat.messages.map((msg) => {
            const isAdmin = msg.senderModel === 'admin' || msg.sender?.id === adminId;
            return (
              <div key={msg._id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                  isAdmin ? 'bg-orange-500 text-white rounded-br-none' 
                          : 'bg-white text-gray-800 rounded-bl-none border border-orange-200'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isAdmin ? 'text-orange-100' : 'text-gray-500'}`}>
                    {formatMessageTime(msg)}
                    {!isAdmin && msg.readBy?.includes(adminId) && <span className="ml-2">✓ Read</span>}
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
      <div className="p-4 bg-white border-t border-orange-200">
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

export default AdminChatWindow;