"use client"
import { useState } from "react";

enum CellState {
  EMPTY = "",
  X = "X",
  O = "O",
}

export default function Page() {
  const [gameState, setGameState] = useState<CellState[][]>(
    Array.from({ length: 3 }, () => Array(3).fill(CellState.EMPTY))
  );
  const [isXTurn, setIsXTurn] = useState(true); // Track if it's X's turn or O's turn
  const [winner, setWinner] = useState<string | null>(null); // Store the winner, if any

  // Function to handle player moves
  const handleMove = (row: number, col: number) => {
    if (gameState[row][col] !== CellState.EMPTY || winner) return; // Ignore if the cell is already filled or game is over

    const newGameState = [...gameState];
    newGameState[row][col] = isXTurn ? CellState.X : CellState.O;
    setGameState(newGameState);

    // Check for winner
    if (checkWinner(newGameState)) {
      setWinner(isXTurn ? "X" : "O");
    } else {
      // Switch turn
      setIsXTurn(!isXTurn);
    }
  };

  // Function to check if there's a winner
  const checkWinner = (state: CellState[][]) => {
    // Check rows, columns, and diagonals for a winner
    for (let i = 0; i < 3; i++) {
      if (state[i][0] !== CellState.EMPTY && state[i][0] === state[i][1] && state[i][1] === state[i][2]) {
        return true;
      }
      if (state[0][i] !== CellState.EMPTY && state[0][i] === state[1][i] && state[1][i] === state[2][i]) {
        return true;
      }
    }

    // Check diagonals
    if (state[0][0] !== CellState.EMPTY && state[0][0] === state[1][1] && state[1][1] === state[2][2]) {
      return true;
    }
    if (state[0][2] !== CellState.EMPTY && state[0][2] === state[1][1] && state[1][1] === state[2][0]) {
      return true;
    }

    return false;
  };

  // Function to render the game board
  const renderCell = (row: number, col: number) => {
    return (
      <div
        className="flex justify-center items-center w-20 h-20 border-2 border-black cursor-pointer"
        onClick={() => handleMove(row, col)}
      >
        <span className="text-3xl">{gameState[row][col]}</span>
      </div>
    );
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">{winner ? `${winner} Wins!` : `Turn: ${isXTurn ? "X" : "O"}`}</h1>
      <div className="grid grid-cols-3 gap-2">
        {gameState.map((row, rowIndex) =>
          row.map((cell, colIndex) => renderCell(rowIndex, colIndex))
        )}
      </div>
      {winner && (
        <button
          onClick={() => {
            setGameState(Array.from({ length: 3 }, () => Array(3).fill(CellState.EMPTY)));
            setWinner(null);
            setIsXTurn(true);
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Restart Game
        </button>
      )}
    </section>
  );
}
