import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, MoreVertical, Phone, Utensils } from 'lucide-react';
import { 
  getCustomerRestruantChat, 
  sendCustomerToRestaurantMessage,
  getCustomerAdminChat,
  sendCustomerToAdminMessage
} from '../../../apis/chatApi';
import io from 'socket.io-client';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import store from "../../../store/store";

const ChatPage = ({ orderId, onBack, chatType = 'admin', user, restaurantId }) => {  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const chatInfo = {
    admin: {
      title: 'Customer Support',
      icon: 'CS',
      color: 'orange',
      api: {
        getChat: getCustomerAdminChat,
        sendMessage: sendCustomerToAdminMessage
      },
      receiverId: null,
      receiverModel: 'admin'
    },
    restaurant: {
      title: 'Restaurant Support',
      icon: 'RS',
      color: 'orange',
      api: {
        getChat: getCustomerRestruantChat,
        sendMessage: sendCustomerToRestaurantMessage
      },
      receiverId: chatType === 'restaurant' && restaurantId ? restaurantId._id : null,
      receiverModel: 'restaurant'
    }
  };

  const currentChat = chatInfo[chatType] || chatInfo.admin;

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom on initial load and when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to bottom when component mounts
  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    const token = store.getState().auth.token;
    if (!token) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
    const socketInstance = io(socketUrl, {
      withCredentials: true,
      auth: { token },
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket || !user) return;

    const loadChat = async () => {
      try {
        const chatData = currentChat.receiverId
          ? await currentChat.api.getChat(currentChat.receiverId)
          : await currentChat.api.getChat();
        
        setMessages(chatData.data.messages.map(msg => ({
          id: msg._id,
          text: msg.content,
          sender: msg.senderModel,
          timestamp: new Date(msg.createdAt),
          isRead: msg.readBy.includes(user._id)
        })));

        socket.emit('join-room', {
          userId: user._id,
          userType: 'user'
        });

        if (chatType === 'restaurant' && currentChat.receiverId) {
          socket.emit('join-room', {
            userId: restaurantId._id,
            userType: 'restaurant'
          });
        }

      } catch (error) {
        console.error('Failed to load chat:', error);
      }
    };

    loadChat();

    return () => {
      socket.off('newMessage');
      socket.off('typingIndicator');
    };
  }, [socket, user, chatType, currentChat.receiverId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !socket || !user) return;

    const tempId = Date.now().toString();
    const optimisticMessage = {
      id: tempId,
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      isRead: true
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    inputRef.current?.focus();

    socket.emit("sendMessage", {
      senderId: user._id,
      senderModel: 'user',
      receiverId: currentChat.receiverId,
      receiverModel: currentChat.receiverModel,
      content: optimisticMessage.text,
      attachments: []
    });

    try {
      const messageData = {
        content: optimisticMessage.text,
        attachments: []
      };

      let response;

      if (currentChat.receiverId) {
        response = await currentChat.api.sendMessage(currentChat.receiverId, messageData);
      } else {
        response = await currentChat.api.sendMessage(messageData);
      }

      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? {
          id: response.data._id,
          text: response.data.content,
          sender: response.data.senderModel,
          timestamp: new Date(response.data.createdAt),
          isRead: response.data.readBy.includes(user._id)
        } : msg
      ));
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  const handleTyping = (isTyping) => {
    if (!socket || !user) return;

    socket.emit(isTyping ? 'typingStart' : 'typingStop', {
      senderId: user._id,
      senderModel: 'user',
      receiverId: currentChat.receiverId,
      receiverModel: currentChat.receiverModel
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className={`bg-${currentChat.color}-600 text-white px-4 py-3 flex items-center justify-between shadow-lg`}>
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="hover:bg-opacity-20 hover:bg-orange-700 p-1 rounded">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 bg-${currentChat.color}-500 rounded-full flex items-center justify-center`}>
              {chatType === 'restaurant' ? (
                <Utensils size={16} />
              ) : (
                <span className="text-sm font-bold">{currentChat.icon}</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{currentChat.title}</h3>
              <p className="text-xs opacity-80">Order #{orderId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50"
      >
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <Message 
              key={message.id} 
              message={message} 
              isOwn={message.sender === 'user'} 
              color={currentChat.color}
            />
          ))}
          {isTyping && <TypingIndicator color={currentChat.color} />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-orange-600 focus-within:bg-white transition-all duration-200">
              <textarea
                ref={inputRef}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping(e.target.value.length > 0);
                }}
                onKeyPress={handleKeyPress}
                onBlur={() => handleTyping(false)}
                placeholder="Type your message..."
                className="w-full bg-transparent resize-none outline-none text-sm placeholder-gray-500 max-h-24"
                rows="1"
                style={{
                  height: 'auto',
                  minHeight: '20px'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                newMessage.trim()
                  ? `bg-${currentChat.color}-600 hover:bg-${currentChat.color}-700 text-white`
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2 mt-3 overflow-x-auto">
            {chatType === 'admin' ? (
              <>
                <button 
                  onClick={() => setNewMessage("Can you track my order?")}
                  className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs whitespace-nowrap border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
                >
                  Track Order
                </button>
                <button 
                  onClick={() => setNewMessage("I want to cancel my order")}
                  className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs whitespace-nowrap border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
                >
                  Cancel Order
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setNewMessage("What's the status of my order?")}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs whitespace-nowrap border border-gray-200 hover:bg-gray-200 transition-colors duration-200"
                >
                  Order Status
                </button>
                <button 
                  onClick={() => setNewMessage("I have a special request")}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs whitespace-nowrap border border-gray-200 hover:bg-gray-200 transition-colors duration-200"
                >
                  Special Request
                </button>
              </>
            )}
            <button 
              onClick={() => setNewMessage("There's an issue with my food")}
              className={`${chatType === 'admin' ? 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100' : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'} px-3 py-1 rounded-full text-xs whitespace-nowrap border transition-colors duration-200`}
            >
              Food Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;