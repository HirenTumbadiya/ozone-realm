"use client";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
enum CellState {
  EMPTY = "",
  X = "X",
  O = "O",
}

interface GameState {
  playerTurn: string;
  board: CellState[][];
  winner?: string;
}

type Props = {
  gameState: GameState;
  roomId: string;
  gameStarted: boolean;
};

import io from "socket.io-client";
const socket: Socket = io(); // Initialize the socket connection

export default function GameBoard({ gameState, roomId, gameStarted }: Props) {
  const [board, setBoard] = useState<CellState[][]>(
    Array.from({ length: 3 }, () => Array(3).fill(CellState.EMPTY))
  );
  const [currentPlayer, setCurrentPlayer] = useState<CellState>(CellState.X);
  const [winner, setWinner] = useState<CellState>(CellState.EMPTY);
  const [winningCells, setWinningCells] = useState<number[]>([]);

  useEffect(() => {
    socket.on("game_update", (newGameState: GameState) => {
      // Update the local state with the new game state received from the server
      setBoard(newGameState.board);
      setCurrentPlayer(newGameState.playerTurn as CellState);
      setWinner((newGameState.winner as CellState) || CellState.EMPTY);
      setWinningCells([]);
    });

    return () => {
      // Cleanup the event listener when the component unmounts
      socket.off("game_update");
    };
  }, []);

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

  // const handleCellClick = (row: number, col: number) => {
  //   if (gameStarted && !winner) {
  //     if (board[row][col] === CellState.EMPTY && currentPlayer === gameState.playerTurn) {
  //       // Update the local board
  //       const newBoard = board.map((r, i) =>
  //         r.map((cell, j) => (i === row && j === col ? currentPlayer : cell))
  //       );
  //       setBoard(newBoard);
  //       checkWinner(newBoard);

  //       // Emit the move to the server
  //       // Send the updated board to the server through socket
  //       socket.emit("game_move", roomId, row * 3 + col);
  //     }
  //   } else {
  //     console.log("Game not started or already finished.");
  //   }
  // };

  const handleCellClick = (row: number, col: number) => {
    if (gameStarted && !winner && board[row][col] === CellState.EMPTY) {
      if (currentPlayer === gameState.playerTurn) {
        // Update the local board
        const newBoard = board.map((r, i) =>
          r.map((cell, j) => (i === row && j === col ? currentPlayer : cell))
        );
        setBoard(newBoard);
        checkWinner(newBoard);

        // Emit the move to the server
        socket.emit("game_move", roomId, { row, col, player: currentPlayer });
      }
    } else {
      console.log("Game not started or already finished.");
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
