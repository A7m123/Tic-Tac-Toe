import { io } from 'socket.io-client';

const SOCKET_URL = 'wss://tictactoe-multiplayer-server.onrender.com';

export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  autoConnect: true,
  forceNew: true
});

socket.on('connect', () => {
  console.log('Connected to game server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

export const joinRoom = (roomCode: string) => {
  if (socket.connected) {
    socket.emit('joinRoom', roomCode);
  }
};

export const createRoom = () => {
  if (socket.connected) {
    socket.emit('createRoom');
  }
};

export const makeMove = (roomCode: string, position: number) => {
  if (socket.connected) {
    socket.emit('makeMove', { roomCode, position });
  }
};