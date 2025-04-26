"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import CustomButton from "@/components/CustomButton";
import GameModeModal from "@/components/Games/GameModeModal";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const headingRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );
  }, []);

  const handleConfirm = (mode: string, size: string) => {
    // const playerType = isAuthenticated ? "auth" : "guest";
    const playerType = "guest";

    setIsModalOpen(false);
    router.push(`/game?mode=${mode}&size=${size}&player=${playerType}`);
  };

  return (
    <>
      <div className="relative overflow-x-hidden text-white">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ x: -50, y: 30, opacity: 0.2 }}
            animate={{ x: 0, y: 0 }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 6,
              ease: "easeInOut",
            }}
            className="text-[120px] text-white absolute top-1/3 left-10 rotate-12 opacity-20 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            X
          </motion.div>

          <motion.div
            initial={{ x: 50, y: -30, opacity: 0.2 }}
            animate={{ x: 0, y: 0 }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 7,
              ease: "easeInOut",
            }}
            className="text-[100px] text-indigo-500 absolute bottom-20 right-20 -rotate-12 opacity-20 drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          >
            O
          </motion.div>
        </div>

        <div className="pt-28 flex flex-col items-center justify-center min-h-screen text-center px-6">
          <motion.h1
            ref={headingRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
          >
            Welcome to <span className="text-indigo-500">OZONE-REALM</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg sm:text-xl max-w-xl mb-8"
          >
            Challenge your friends or the AI. Experience TicTacToe like never
            before — fast, reactive, and stylish.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold overflow-hidden transition group"
            >
              <span className="relative">Play Now</span>
              <span className="absolute inset-0 bg-white opacity-10 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full"></span>
            </button>

            <CustomButton text="Learn More" />
          </motion.div>
        </div>
        <section className="py-20 px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">How It Works</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[
              {
                title: "1. Choose Mode",
                desc: "Play against AI or invite a friend for real-time gameplay.",
              },
              {
                title: "2. Make Your Move",
                desc: "Clean, animated board. Intuitive clicks. Fast response.",
              },
              {
                title: "3. Win or Learn",
                desc: "Track your scores. Analyze patterns. Come back stronger!",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
        <section className="text-white text-center py-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Tic-Tac-Win?
          </h2>
          <p className="mb-8 text-gray-400 text-sm sm:text-base">
            Join the game and become the unbeatable legend.
          </p>
          <button className="relative px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold overflow-hidden transition group">
            <span className="relative z-10">Let&apos;s Play!</span>
            <span className="absolute inset-0 bg-white opacity-10 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full"></span>
          </button>
        </section>
      </div>

      <GameModeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
