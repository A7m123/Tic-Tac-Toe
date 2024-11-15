import React from 'react';
import Square from './Square';
import { X, Circle } from 'lucide-react';

interface BoardProps {
  squares: (string | null)[];
  onClick: (i: number) => void;
  winningLine: number[] | null;
}

const Board: React.FC<BoardProps> = ({ squares, onClick, winningLine }) => {
  const renderSquare = (i: number) => {
    const isWinning = winningLine?.includes(i);
    return (
      <Square
        value={squares[i]}
        onClick={() => onClick(i)}
        isWinning={isWinning}
        key={i}
      >
        {squares[i] === 'X' && <X className="w-12 h-12 text-blue-500" />}
        {squares[i] === 'O' && <Circle className="w-12 h-12 text-red-500" />}
      </Square>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-2 w-72">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => renderSquare(i))}
    </div>
  );
};

export default Board;