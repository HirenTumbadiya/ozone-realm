"use client";
// import GameBoard from "@/components/Games/GameBoard";
import { useSocket } from "@/hooks/useSocket";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { type } = useParams();
  const [opponentConnected, setOpponentConnected] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !type) return;

    socket.emit("join_room", type);

    socket.on("opponent_joined", () => setOpponentConnected(true));
    socket.on("opponent_left", () => setOpponentConnected(false));

    return () => {
      socket.off("opponent_joined");
      socket.off("opponent_left");
    };
  }, [type, socket]);

  return (
    <section className="h-screen w-full grid grid-rows-[auto_1fr_auto] px-4 py-2">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-xl md:text-3xl font-bold text-indigo-800">
          OZONE-REALM
        </h1>
      </header>

      {/* Main Grid */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-items-center h-full">
        {/* Opponent Video */}
        <div className="w-full max-w-[200px] aspect-video bg-black rounded-md relative shadow-md">
          <span className="absolute bottom-1 left-2 text-white text-xs">
            {opponentConnected ? "Opponent Connected" : "Waiting..."}
          </span>
        </div>

        {/* Game Board */}
        <div className="w-full max-w-[250px] aspect-square flex items-center justify-center">
          {/* <GameBoard /> */}
        </div>

        {/* Your Video */}
        <div className="w-full max-w-[200px] aspect-video bg-gray-800 rounded-md relative shadow-md">
          <span className="absolute bottom-1 left-2 text-white text-xs">
            You
          </span>
        </div>
      </main>

      {/* Controls */}
      <footer className="flex justify-center gap-4 py-2">
        <button className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition">
          🎤 Voice
        </button>
        <button className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition">
          📞 End
        </button>
      </footer>
    </section>
  );
}
