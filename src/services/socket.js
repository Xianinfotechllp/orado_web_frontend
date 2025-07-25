import { io } from "socket.io-client";

// Create socket connection with better configuration
const socket = io("https://orado-backend.onrender.com", { // or your production URL
  withCredentials: true,
  reconnectionAttempts: 5, // Number of reconnect attempts
  reconnectionDelay: 1000, // Initial delay before reconnecting (ms)
  transports: ["websocket"], // Force WebSocket transport
  autoConnect: false // Wait to connect manually
});

// Optional: Add connection status logging
socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
  if (reason === "io server disconnect") {
    // The disconnection was initiated by the server, you need to reconnect manually
    socket.connect();
  }
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

export default socket;