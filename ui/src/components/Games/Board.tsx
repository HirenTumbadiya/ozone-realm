"use client";

import { useState } from "react";

type Cell = "X" | "O" | null;

interface BoardProps {
  size: "3x3" | "4x4";
}

const Board: React.FC<BoardProps> = ({ size }) => {
  const boardSize = size === "3x3" ? 3 : 4;
  const [board, setBoard] = useState<Cell[]>(Array(boardSize * boardSize).fill(null));
  const [isXNext, setIsXNext] = useState(true); // Track whose turn it is

  const handleClick = (index: number) => {
    const newBoard = [...board];

    // If the cell is already occupied or the game is over, return
    if (newBoard[index] || checkWinner(newBoard)) return;

    // Place the current player's move in the cell
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext); // Toggle player turn
  };

  // Check if there's a winner
  const checkWinner = (board: Cell[]) => {
    const lines = getWinningLines(board.length);

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  // Get winning lines based on the board size
  const getWinningLines = (size: number) => {
    const lines = [];
    for (let i = 0; i < size; i++) {
      // Rows
      lines.push(Array.from({ length: size }, (_, j) => i * size + j));
      // Columns
      lines.push(Array.from({ length: size }, (_, j) => i + j * size));
    }
    // Diagonals
    lines.push(Array.from({ length: size }, (_, i) => i * (size + 1)));
    lines.push(Array.from({ length: size }, (_, i) => (i + 1) * (size - 1)));

    return lines;
  };

  const winner = checkWinner(board);

  return (
    <div className="flex flex-col items-center justify-center py-6">
      {winner && <p className="text-xl mb-6">{winner} wins!</p>}
      <div
        className={`grid ${size === "3x3" ? "grid-cols-3" : "grid-cols-4"} gap-4`}
      >
        {board.map((cell, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className="flex items-center justify-center w-20 h-20 bg-gray-800 rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 active:scale-95"
          >
            <span className="text-4xl font-bold">{cell}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => setBoard(Array(boardSize * boardSize).fill(null))}
        className="mt-6 px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
      >
        Reset Game
      </button>
    </div>
  );
};

export default Board;
