import apiClient from "./apiClient/apiClient";

// Chat API for restaurant and customer interactions



// Get one chat between the restaurant and a specific customer
export const getCustomerRestruantChat = async (restaurantId) => {
  try {
    const response = await apiClient.get(`/chat/customer/chat/${restaurantId}`);
    console.log('chat', response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch chat with customer ${userId}:`, error);
    throw error;
  }
};

// Send a message from customer to restaurant
export const sendCustomerToRestaurantMessage = async (restaurantId, messageData) => {
  try {
    const response = await apiClient.post(`/chat/user/restaurant/${restaurantId}`, messageData);
    return response.data;
  } catch (error) {
    console.error(`Failed to send message to restaurant ${restaurantId}:`, error);
    throw error;
  }
};


// ====================== ADMIN-CUSTOMER CHAT ====================== //

// Get one chat between admin and a specific customer
export const getCustomerAdminChat = async (adminId) => {
  try {
    const response = await apiClient.get(`/chat/users/admin`);
    console.log('chat', response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch chat with admin ${adminId}:`, error);
    throw error;
  }
};


// Send a message from customer to a specific admin
export const sendCustomerToAdminMessage = async (messageData) => {
  try {
    const response = await apiClient.post(`/chat/user/admins/message`, messageData);
    return response.data;
  } catch (error) {
    console.error(`Failed to send message to admin ${adminId}:`, error);
    throw error;
  }
};

// Mark all messages in a chat as read
export const markMessagesAsRead = async (chatId) => {
  try {
    const response = await apiClient.put(`/chat/mark-read/${chatId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to mark messages as read for chat ${chatId}:`, error);
    throw error;
  }
};


// ====================== Restruant-CUSTOMER CHAT ====================== //

// 1. Get all restaurant-customer chats
export const getRestaurantCustomerChats = async () => {
  try {
    const response = await apiClient.get('/chat/restaurant/chats');
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurant-customer chats:', error);
    throw error;
  }
};

// 2. Get a specific chat from a customer to restaurant (restaurant POV)
export const getRestaurantCustomerChat = async (userId) => {
  try {
    const response = await apiClient.get(`/chat/restaurant/chat/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching chat with user ${userId}:`, error);
    throw error;
  }
};

// 3. Send a message from restaurant to customer
export const sendRestaurantMessageToCustomer = async (userId, content, attachments = []) => {
  try {
    const response = await apiClient.post(`/chat/restaurant/user/${userId}`, {
      content,
      attachments
    });
    return response.data;
  } catch (error) {
    console.error(`Error sending message to user ${userId}:`, error);
    throw error;
  }
};


// ====================== Restruant-admin CHAT ====================== //

export const getRestaurantAdminChat = async () => {
  try {
    const response = await apiClient.get('/chat/restaurants/admin');
    console.log('getrestchat', response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurant-admin chat:', error);
    throw error;
  }
};

export const sendRestaurantMessageToAdmin = async (content, attachments = []) => {
  try {
    const response = await apiClient.post('/chat/restaurant/admins/message', {
      content,
      attachments
    });
    console.log('sendMesg', response.data)
    return response.data;
  } catch (error) {
    console.error('Error sending message to admin:', error);
    throw error;
  }
};