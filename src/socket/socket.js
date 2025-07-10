import { io } from "socket.io-client";

// use the Vite environment variable here
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
});

export default socket;