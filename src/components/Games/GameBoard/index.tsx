"use client";
import { useState } from "react";
import { motion } from "motion/react";

enum CellState {
  EMPTY = "",
  X = "X",
  O = "O",
}

export default function GameBoard() {
  const [board, setBoard] = useState<CellState[][]>(
    Array.from({ length: 3 }, () => Array(3).fill(CellState.EMPTY))
  );
  const [currentPlayer, setCurrentPlayer] = useState<CellState>(CellState.X);
  const [winner, setWinner] = useState<CellState>(CellState.EMPTY);
  const [winningCells, setWinningCells] = useState<number[]>([]);

  const checkWinner = (board: CellState[][]) => {
    for (let i = 0; i < 3; i++) {
      // Row
      if (
        board[i][0] !== CellState.EMPTY &&
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2]
      ) {
        setWinner(board[i][0]);
        setWinningCells([i * 3, i * 3 + 1, i * 3 + 2]);
        return;
      }

      // Column
      if (
        board[0][i] !== CellState.EMPTY &&
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i]
      ) {
        setWinner(board[0][i]);
        setWinningCells([i, i + 3, i + 6]);
        return;
      }
    }

    // Diagonals
    if (
      board[0][0] !== CellState.EMPTY &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      setWinner(board[0][0]);
      setWinningCells([0, 4, 8]);
      return;
    }

    if (
      board[0][2] !== CellState.EMPTY &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      setWinner(board[0][2]);
      setWinningCells([2, 4, 6]);
      return;
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] === CellState.EMPTY && !winner) {
      const newBoard = board.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? currentPlayer : cell))
      );
      setBoard(newBoard);
      checkWinner(newBoard);
      setCurrentPlayer(
        currentPlayer === CellState.X ? CellState.O : CellState.X
      );
    }
  };

  const getLineStyle = () => {
    if (winningCells.length !== 3) return {};
    const [a, b, c] = winningCells;

    const base = {
      position: "absolute" as const,
      backgroundColor: "#00B5E2",
      transition: "all 0.4s ease",
    };

    // Horizontal
    if (a === 0 && b === 1 && c === 2)
      return {
        ...base,
        top: "13.66%",
        left: 0,
        height: "8px",
        borderRadius: "40px",
        width: "100%",
      };
    if (a === 3 && b === 4 && c === 5)
      return {
        ...base,
        top: "50%",
        left: 0,
        height: "8px",
        borderRadius: "40px",
        width: "100%",
      };
    if (a === 6 && b === 7 && c === 8)
      return {
        ...base,
        top: "83.33%",
        left: 0,
        height: "8px",
        borderRadius: "40px",
        width: "100%",
      };

    // Vertical
    if (a === 0 && b === 3 && c === 6)
      return {
        ...base,
        top: 0,
        left: "13.66%",
        width: "8px",
        borderRadius: "40px",
        height: "100%",
      };
    if (a === 1 && b === 4 && c === 7)
      return {
        ...base,
        top: 0,
        left: "50%",
        width: "8px",
        borderRadius: "40px",
        height: "100%",
      };
    if (a === 2 && b === 5 && c === 8)
      return {
        ...base,
        top: 0,
        left: "83.33%",
        width: "8px",
        borderRadius: "40px",
        height: "100%",
      };

    // Diagonals
    if (a === 0 && b === 4 && c === 8)
      return {
        ...base,
        top: "0%",
        left: "1%",
        height: "8px",
        borderRadius: "40px",
        width: "141%",
        transform: "rotate(45deg)",
        transformOrigin: "left center",
      };

    if (a === 2 && b === 4 && c === 6)
      return {
        ...base,
        bottom: "0%",
        right: "1%",
        left: "0%",
        height: "8px",
        borderRadius: "40px",
        width: "139%",
        transform: "rotate(-45deg)",
        transformOrigin: "left center",
      };

    return {};
  };

  return (
    <div className="relative w-full max-w-[300px] aspect-square">
      <div className="relative w-full h-full grid grid-cols-3 gap-2">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const idx = rowIndex * 3 + colIndex;
            const isWinning = winningCells.includes(idx);
            return (
              <div
                key={idx}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`aspect-square w-full h-full rounded-lg shadow-md flex items-center justify-center text-3xl md:text-5xl font-bold cursor-pointer transition-transform hover:scale-105 ${
                  isWinning
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-indigo-800"
                }`}
              >
                {cell}
              </div>
            );
          })
        )}
        {winner && <div style={getLineStyle()} />}
      </div>
    </div>
  );
}
