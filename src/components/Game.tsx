import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
import Board from './Board';
import { Trophy, RotateCcw, Copy, Users } from 'lucide-react';
import { socket, joinRoom, createRoom, makeMove } from '../services/socket';
import { useGameStore } from '../store/gameStore';

const Game: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [showJoin, setShowJoin] = useState(true);
  const [joinInput, setJoinInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [playMove] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
  const [playWin] = useSound('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');

  const { roomCode, playerSymbol, isMyTurn, setRoomCode, setPlayerSymbol, setIsMyTurn } = useGameStore();

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnecting(false);
    });

    socket.on('connect_error', () => {
      setIsConnecting(false);
      alert('Failed to connect to game server. Please try again.');
    });

    socket.on('roomCreated', (code: string) => {
      setRoomCode(code);
      setPlayerSymbol('X');
      setIsMyTurn(true);
      setShowJoin(false);
      setIsConnecting(false);
    });

    socket.on('joinedRoom', (symbol: 'X' | 'O') => {
      setPlayerSymbol(symbol);
      setIsMyTurn(symbol === 'X');
      setShowJoin(false);
      setIsConnecting(false);
    });

    socket.on('gameUpdate', ({ board, winner, winningLine }) => {
      setBoard(board);
      if (winner) {
        setWinner(winner);
        setWinningLine(winningLine);
        playWin();
      }
      setIsMyTurn(!isMyTurn);
    });

    socket.on('invalidRoom', () => {
      setIsConnecting(false);
      alert('Invalid room code or room is full');
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('roomCreated');
      socket.off('joinedRoom');
      socket.off('gameUpdate');
      socket.off('invalidRoom');
    };
  }, [isMyTurn]);

  const handleCreateRoom = () => {
    setIsConnecting(true);
    createRoom();
  };

  const handleJoinRoom = () => {
    if (joinInput.trim()) {
      setIsConnecting(true);
      joinRoom(joinInput.trim());
    }
  };

  const handleClick = (position: number) => {
    if (!isMyTurn || board[position] || winner) return;
    
    if (roomCode) {
      makeMove(roomCode, position);
      playMove();
    }
  };

  const copyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      alert('Room code copied to clipboard!');
    }
  };

  const resetGame = () => {
    window.location.reload();
  };

  let status;
  if (winner) {
    status = (
      <div className="flex items-center gap-2 text-green-600">
        <Trophy className="w-6 h-6" />
        <span>Winner: {winner}</span>
      </div>
    );
  } else if (board.every(square => square !== null)) {
    status = "Game is a draw!";
  } else if (roomCode && playerSymbol) {
    status = isMyTurn ? "Your turn" : "Opponent's turn";
  } else {
    status = "Waiting for game to start...";
  }

  if (showJoin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Multiplayer Tic Tac Toe
          </h1>
          
          <div className="space-y-4">
            <button
              onClick={handleCreateRoom}
              disabled={isConnecting}
              className={`w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg
                flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all duration-200
                ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Users className="w-5 h-5" />
              {isConnecting ? 'Connecting...' : 'Create New Game'}
            </button>
            
            <div className="relative">
              <input
                type="text"
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value)}
                placeholder="Enter Room Code"
                disabled={isConnecting}
                className={`w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none
                  ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <button
                onClick={handleJoinRoom}
                disabled={isConnecting}
                className={`mt-2 w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200
                  ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isConnecting ? 'Connecting...' : 'Join Game'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tic Tac Toe
          </h1>
          {roomCode && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-gray-600">Room Code:</span>
              <code className="bg-gray-100 px-2 py-1 rounded">{roomCode}</code>
              <button
                onClick={copyRoomCode}
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="text-sm text-gray-600">
            You are: {playerSymbol || 'Spectator'}
          </div>
        </div>
        
        <div className="text-lg font-semibold text-center text-gray-700">
          {status}
        </div>

        <Board
          squares={board}
          onClick={handleClick}
          winningLine={winningLine}
        />

        <button
          onClick={resetGame}
          className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg
            flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          New Game
        </button>
      </div>
    </div>
  );
};

export default Game;