import apiClient from "./apiClient/apiClient";

// create ticket
export const createTicket = async ({ subject, priority, message }) => {
  try {
    const response = await apiClient.post("/tickets/create", {
      subject,
      priority,
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

// get my ticket
export const    getMyTickets = async () => {
  try {
    const response = await apiClient.get("/tickets/my");
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

// add message to ticket
export const addMessageToTicket = async (ticketId, message) => {
  try {
    const response = await apiClient.post(`/tickets/${ticketId}/message`, {
      message,
    });
    console.log('add message', response.data)
    return response.data;
  } catch (error) {
    console.error(`Error adding message to ticket ${ticketId}:`, error);
    throw error;
  }
};
