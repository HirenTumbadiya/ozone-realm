"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GameBoard from "@/components/Games/GameBoard";
import io from "socket.io-client";

import { Socket } from "socket.io-client";

let socket: Socket;

enum CellState {
  EMPTY = "",
  X = "X",
  O = "O",
}

export default function Page() {
  const { roomId } = useParams();
  const [opponentConnected, setOpponentConnected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  interface GameState {
    playerTurn: string;
    board: CellState[][];
    winner?: string;
  }

  const [gameState, setGameState] = useState<GameState>({
    board: Array.from({ length: 3 }, () => Array(3).fill(CellState.EMPTY)),
    playerTurn: "X",
    winner: undefined,
  });
  useEffect(() => {
    console.log("🧩 Current gameState:", gameState, roomId);
  }, [gameState, roomId]);

  useEffect(() => {
    if (roomId) {
      socket = io("http://localhost:8080");
      socket.emit("join_room", roomId);
      socket.on("opponent_connected", () => {
        console.log("Opponent connected event received ✅");
        setOpponentConnected(true);
      });

      socket.on("start_game", () => {
        setGameStarted(true);
      });

      socket.on("game_update", (newGameState) => {
        console.log("📦 Received game_update:", newGameState);
        setGameState(newGameState);
      });

      socket.on("game_over", (data) => {
        console.log("Game Over:", data);
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [roomId]);

  const handleStartGame = () => {
    if (socket && opponentConnected) {
      socket.emit("start_game", { roomId });
    }
  };

  return (
    <section className="h-screen w-full grid grid-rows-[auto_1fr_auto] px-4 py-2">
      <header className="text-center">
        <h1 className="text-xl md:text-3xl font-bold text-indigo-800">
          OZONE-REALM
        </h1>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-items-center h-full">
        <div className="w-full max-w-[200px] aspect-video bg-black rounded-md relative shadow-md">
          <span className="absolute bottom-1 left-2 text-white text-xs">
            {opponentConnected ? "Opponent Connected" : "Waiting..."}
          </span>
        </div>
        <div className="w-full max-w-[250px] aspect-square flex items-center justify-center">
          {gameState && (
            <GameBoard
              gameState={gameState}
              roomId={roomId as string}
              gameStarted={gameStarted}
            />
          )}
        </div>
        <div className="w-full max-w-[200px] aspect-video bg-gray-800 rounded-md relative shadow-md">
          <span className="absolute bottom-1 left-2 text-white text-xs">
            You
          </span>
        </div>
      </main>
      <footer className="flex justify-center gap-4 py-2">
        <button className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition">
          🎤 Voice
        </button>
        {!gameStarted && (
          <button
            onClick={handleStartGame}
            disabled={!opponentConnected}
            className={`px-4 py-2 rounded text-white transition ${
              opponentConnected
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Start Game
          </button>
        )}
        <button className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition">
          📞 End
        </button>
      </footer>
    </section>
  );
}
