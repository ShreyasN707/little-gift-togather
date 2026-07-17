"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function UnscramblePuzzle({ onComplete }: { onComplete: () => void }) {
  const targetWord = "FOREVER";
  const [scrambled, setScrambled] = useState("VREEOFR".split(""));
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");

  const handleSelect = (index: number, char: string) => {
    if (selectedIndices.includes(index)) return;
    const newSelected = [...selectedIndices, index];
    const newGuess = currentGuess + char;
    
    setSelectedIndices(newSelected);
    setCurrentGuess(newGuess);

    if (newGuess.length === targetWord.length) {
      if (newGuess === targetWord) {
        import("canvas-confetti").then((module) => {
          const confetti = module.default || module;
          confetti();
        });
        setTimeout(onComplete, 1500);
      } else {
        // Reset if wrong
        setTimeout(() => {
          setSelectedIndices([]);
          setCurrentGuess("");
        }, 800);
      }
    }
  };

  return (
    <div className="p-6 sm:p-10 bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      <h2 className="text-2xl font-serif text-gray-900 mb-6 text-center relative z-10">Unscramble the word to unlock</h2>
      
      <div className="flex gap-2 mb-8 relative z-10 h-14">
        {Array.from({ length: targetWord.length }).map((_, i) => (
          <div key={i} className="w-10 h-12 border-b-2 border-rose-500 flex items-center justify-center text-2xl font-serif font-bold text-gray-800">
            {currentGuess[i] || ""}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3 relative z-10">
        {scrambled.map((char, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(i, char)}
            disabled={selectedIndices.includes(i)}
            className={`w-12 h-12 rounded-xl text-xl font-serif font-bold shadow-lg transition-all ${
              selectedIndices.includes(i) ? "bg-gray-200 text-gray-400 scale-90" : "bg-gradient-to-br from-rose-400 to-pink-500 text-white hover:shadow-pink-500/50"
            }`}
          >
            {char}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
