'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const winSequence = [
  { i: 0, value: 'X' },
  { i: 1, value: 'O' },
  { i: 2, value: 'X' },
  { i: 4, value: 'O' },
  { i: 3, value: 'X' },
  { i: 7, value: 'O' },
  { i: 6, value: 'X' },
];

export default function TicTacToeAnimation() {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBoard((prev) => {
        const newBoard = [...prev];
        if (step < winSequence.length) {
          const { i, value } = winSequence[step];
          newBoard[i] = value;
        }
        return newBoard;
      });
      setStep((prev) => (prev + 1) % (winSequence.length + 2));
      if (step === winSequence.length + 1) {
        setBoard(Array(9).fill(''));
        setStep(0);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [step]);

  const renderCell = (val: string, i: number) => {
    const isWin = [0, 3, 6].includes(i) && board[6] === 'X';
    return (
      <motion.div
        key={i}
        className={`w-20 h-20 border border-gray-500 text-3xl flex items-center justify-center font-bold ${
          isWin ? 'bg-green-500/20 text-green-400' : ''
        }`}
        initial={{ scale: 0 }}
        animate={{ scale: val ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {val}
      </motion.div>
    );
  };

  return (
    <div className='z-10'>
      <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden shadow-md w-fit">
        {board.map((val, i) => renderCell(val, i))}
      </div>
    </div>
  );
}
