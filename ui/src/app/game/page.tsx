"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Update the import to use 'next/navigation'
import Board from "@/components/Games/Board";

type BoardSize = "3x3" | "4x4";

export default function Game() {
  const searchParams = useSearchParams();

  const [gameInfo, setGameInfo] = useState({
    mode: "local",
    size: "3x3" as BoardSize,
    player: "guest",
  });

  useEffect(() => {
    // Extract query parameters from the searchParams object
    const mode = searchParams.get("mode");
    const size = searchParams.get("size") as BoardSize;
    const player = searchParams.get("player");

    if (mode && size && player) {
      setGameInfo({
        mode: mode,
        size: size,
        player: player,
      });
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center px-6">
      <h1 className="text-4xl font-bold mb-4">🌀 OZONE-REALM</h1>
      <p className="text-lg mb-2">
        🔹 Mode:{" "}
        <span className="font-semibold capitalize">{gameInfo.mode}</span>
      </p>
      <p className="text-lg mb-2">
        🔸 Board Size: <span className="font-semibold">{gameInfo.size}</span>
      </p>
      <p className="text-lg">
        🧑 Player Type:{" "}
        <span className="font-semibold capitalize">{gameInfo.player}</span>
      </p>
      <Board size={gameInfo.size} />
    </div>
  );
}
