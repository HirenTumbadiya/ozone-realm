"use client";

import { GameMode } from "@/types/GamePiece";
import React from "react";

interface GameModalProps {
  onSelect: (mode: GameMode) => void;
  onClose: () => void;
}

const gameModes = [
  { label: "Play Locally", value: GameMode.LOCAL_PLAYER },
  // { label: "Vs Computer", value: GameMode.COMPUTER },
  // { label: "Random Opponent", value: GameMode.ONLINE_PLAYER },
  { label: "Invite a Friend", value: GameMode.INVITE_PLAYER },
];

interface GameModalProps {
  onSelect: (mode: GameMode) => void;
  onClose: () => void;
}

export default function GameModal({ onSelect, onClose }: GameModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#1e1e1e] rounded-lg shadow-lg p-6 w-full max-w-md text-white relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-orbitron mb-4 text-center">
          Select Game Mode
        </h2>

        <div className="grid gap-4">
          {gameModes.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onSelect(value)}
              className="bg-[#292929] hover:bg-[#444] py-3 px-5 rounded-lg text-lg transition-all font-semibold"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
