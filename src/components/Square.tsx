import React from 'react';

interface SquareProps {
  value: string | null;
  onClick: () => void;
  isWinning?: boolean;
  children?: React.ReactNode;
}

const Square: React.FC<SquareProps> = ({ onClick, isWinning, children }) => {
  return (
    <button
      className={`w-24 h-24 border-2 rounded-xl flex items-center justify-center transition-all duration-200 
        ${isWinning 
          ? 'bg-green-100 border-green-500 shadow-lg transform scale-105' 
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
        }`}
      onClick={onClick}
    >
      <div className="transform transition-transform duration-200 hover:scale-110">
        {children}
      </div>
    </button>
  );
};

export default Square;