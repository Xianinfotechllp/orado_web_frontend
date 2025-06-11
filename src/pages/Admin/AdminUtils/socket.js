import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const connectSocket = (token) => {
  if (!socket.connected) {
    socket.auth = { token };
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;