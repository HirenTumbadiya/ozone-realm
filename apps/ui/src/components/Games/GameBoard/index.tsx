"use client";
import { useEffect, useState } from "react";

enum CellState {
  EMPTY = "",
  X = "X",
  O = "O",
}

interface GameState {
  playerTurn: string;
  board: CellState[][];
  winner?: string;
  players: {
    [socketId: string]: "X" | "O";
  };
}

type Props = {
  gameState: GameState;
  gameStarted: boolean;
  socketId: string | undefined;
  onMove: (row: number, col: number, socketId: string) => void;
};

const findWinningCells = (board: CellState[][]): number[] => {
  for (let i = 0; i < 3; i++) {
    // Rows
    if (
      board[i][0] !== CellState.EMPTY &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    ) {
      return [i * 3, i * 3 + 1, i * 3 + 2];
    }

    // Columns
    if (
      board[0][i] !== CellState.EMPTY &&
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i]
    ) {
      return [i, i + 3, i + 6];
    }
  }

  // Diagonal TL-BR
  if (
    board[0][0] !== CellState.EMPTY &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    return [0, 4, 8];
  }

  // Diagonal TR-BL
  if (
    board[0][2] !== CellState.EMPTY &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    return [2, 4, 6];
  }

  return [];
};

export default function GameBoard({
  gameState,
  gameStarted,
  onMove,
  socketId,
}: Props) {
  const [board, setBoard] = useState<CellState[][]>(
    Array.from({ length: 3 }, () => Array(3).fill(CellState.EMPTY))
  );
  const [winner, setWinner] = useState<CellState>(CellState.EMPTY);
  const [winningCells, setWinningCells] = useState<number[]>([]);

  useEffect(() => {
    setBoard(gameState.board);

    if (gameState.winner) {
      setWinner(gameState.winner as CellState);
      setWinningCells(findWinningCells(gameState.board));
    } else {
      setWinner(CellState.EMPTY);
      setWinningCells([]);
    }
  }, [gameState]);

  const handleCellClick = (row: number, col: number) => {
    if (
      gameStarted &&
      !winner &&
      board[row][col] === CellState.EMPTY &&
      socketId &&
      gameState.playerTurn === socketId
    ) {
      // Only emit the move — do NOT update board locally here.
      onMove(row, col, socketId);
    }
  };

  useEffect(() => {
    setBoard(gameState.board);
  }, [gameState]);

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
        width: "100%",
        borderRadius: "40px",
      };
    if (a === 3 && b === 4 && c === 5)
      return {
        ...base,
        top: "50%",
        left: 0,
        height: "8px",
        width: "100%",
        borderRadius: "40px",
      };
    if (a === 6 && b === 7 && c === 8)
      return {
        ...base,
        top: "83.33%",
        left: 0,
        height: "8px",
        width: "100%",
        borderRadius: "40px",
      };

    // Vertical
    if (a === 0 && b === 3 && c === 6)
      return {
        ...base,
        top: 0,
        left: "13.66%",
        width: "8px",
        height: "100%",
        borderRadius: "40px",
      };
    if (a === 1 && b === 4 && c === 7)
      return {
        ...base,
        top: 0,
        left: "50%",
        width: "8px",
        height: "100%",
        borderRadius: "40px",
      };
    if (a === 2 && b === 5 && c === 8)
      return {
        ...base,
        top: 0,
        left: "83.33%",
        width: "8px",
        height: "100%",
        borderRadius: "40px",
      };

    // Diagonals
    if (a === 0 && b === 4 && c === 8)
      return {
        ...base,
        top: "0%",
        left: "1%",
        height: "8px",
        width: "141%",
        borderRadius: "40px",
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
        width: "139%",
        borderRadius: "40px",
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
                  gameStarted
                    ? `${
                        isWinning
                          ? "bg-indigo-500 text-white"
                          : "bg-white text-indigo-800"
                      }`
                    : `bg-gray-400`
                } `}
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
