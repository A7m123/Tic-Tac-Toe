import { create } from 'zustand';

interface GameState {
  roomCode: string | null;
  playerSymbol: 'X' | 'O' | null;
  isMyTurn: boolean;
  setRoomCode: (code: string | null) => void;
  setPlayerSymbol: (symbol: 'X' | 'O' | null) => void;
  setIsMyTurn: (turn: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  roomCode: null,
  playerSymbol: null,
  isMyTurn: false,
  setRoomCode: (code) => set({ roomCode: code }),
  setPlayerSymbol: (symbol) => set({ playerSymbol: symbol }),
  setIsMyTurn: (turn) => set({ isMyTurn: turn }),
}));