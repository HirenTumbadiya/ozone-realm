"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function GameModeModal({ isOpen, onClose, onConfirm }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mode: string, size: string) => void;
}) {
  const [mode, setMode] = useState("local");
  const [size, setSize] = useState("3x3");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 text-white p-8 rounded-xl max-w-md w-full shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Game Mode</h2>

            <div className="mb-4">
              <label className="block font-medium mb-2">Who do you want to play with?</label>
              <div className="flex flex-col gap-2 cursor-pointer">
                {["local", "computer", "random", "invite"].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mode"
                      value={option}
                      checked={mode === option}
                      onChange={() => setMode(option)}
                      className="cursor-pointer"
                    />
                    <span className="capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-2">Choose board size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded w-full"
              >
                <option value="3x3">3×3</option>
                <option value="4x4">4×4</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(mode, size)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
