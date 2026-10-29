"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, HelpCircle } from "lucide-react";
import { sounds } from "@/lib/audio";

export function UnscramblePuzzle({
  onComplete,
  question,
  answer,
}: {
  onComplete: () => void;
  question?: string;
  answer?: string;
}) {
  const targetWord = (answer || "FOREVER").toUpperCase().replace(/[^A-Z]/g, "") || "LOVE";

  // Create scrambled array with stable keys
  const [scrambled] = useState(() => {
    const letters = targetWord.split("").map((char, index) => ({ id: `${char}-${index}`, char }));
    // Shuffle
    return letters.sort(() => Math.random() - 0.5);
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isWrong, setIsWrong] = useState(false);

  const currentGuess = selectedIds
    .map((id) => scrambled.find((item) => item.id === id)?.char || "")
    .join("");

  const handleSelect = (item: { id: string; char: string }) => {
    if (selectedIds.includes(item.id)) return;
    sounds.playPop();

    const nextSelected = [...selectedIds, item.id];
    setSelectedIds(nextSelected);

    const nextGuess = nextSelected
      .map((id) => scrambled.find((i) => i.id === id)?.char || "")
      .join("");

    if (nextGuess.length === targetWord.length) {
      if (nextGuess === targetWord) {
        // Solved!
        sounds.playVictoryFanfare();
        import("canvas-confetti").then((module) => {
          const confetti = module.default || module;
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#f472b6", "#fb7185", "#ffd166", "#c084fc"],
          });
        });
        setTimeout(onComplete, 1600);
      } else {
        // Wrong guess shake
        setIsWrong(true);
        setTimeout(() => {
          setSelectedIds([]);
          setIsWrong(false);
        }, 800);
      }
    }
  };

  const handleDeselectLast = () => {
    if (selectedIds.length === 0) return;
    sounds.playPop();
    setSelectedIds(selectedIds.slice(0, -1));
  };

  const handleReset = () => {
    sounds.playPop();
    setSelectedIds([]);
  };

  return (
    <div className="p-6 sm:p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-pink-200/80 flex flex-col items-center max-w-sm sm:max-w-md w-full mx-4 relative z-10 cute-shadow-lg">
      {/* Decorative tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-50 border border-pink-200 rounded-full text-xs font-bold text-pink-700 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-pink-500" />
        <span>Love Secret Code</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-cute font-bold text-gray-800 text-center mb-1">
        {question || "Unscramble the secret word"}
      </h2>
      <p className="text-xs text-pink-900/60 font-medium mb-5 text-center">
        Tap the letter tiles in the correct sequence
      </p>

      {/* Answer Slots */}
      <motion.div
        animate={isWrong ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap justify-center gap-2 mb-6 min-h-[52px]"
      >
        {Array.from({ length: targetWord.length }).map((_, i) => {
          const char = currentGuess[i];
          return (
            <motion.div
              key={i}
              initial={{ scale: 0.9 }}
              animate={{ scale: char ? 1.05 : 1 }}
              onClick={handleDeselectLast}
              className={`w-10 sm:w-12 h-12 sm:h-14 rounded-xl border-2 flex items-center justify-center text-xl sm:text-2xl font-bold font-cute cursor-pointer transition-all ${
                char
                  ? "bg-pink-100/80 border-pink-400 text-pink-700 shadow-sm"
                  : "bg-pink-50/50 border-dashed border-pink-300 text-gray-300"
              }`}
            >
              {char || ""}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Available Letter Tiles */}
      <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-6">
        {scrambled.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <motion.button
              key={item.id}
              whileHover={!isSelected ? { scale: 1.1, y: -2 } : {}}
              whileTap={!isSelected ? { scale: 0.92 } : {}}
              onClick={() => handleSelect(item)}
              disabled={isSelected}
              className={`w-11 sm:w-13 h-11 sm:h-13 rounded-2xl text-lg sm:text-xl font-bold font-cute transition-all duration-200 shadow-sm ${
                isSelected
                  ? "bg-gray-100 text-gray-300 border border-gray-200 cursor-not-allowed scale-90 opacity-60"
                  : "bg-gradient-to-br from-pink-400 to-rose-400 text-white hover:from-pink-500 hover:to-rose-500 border border-pink-300 shadow-md active:shadow-inner"
              }`}
            >
              {item.char}
            </motion.button>
          );
        })}
      </div>

      {/* Action helpers */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleDeselectLast}
          disabled={selectedIds.length === 0}
          className="text-xs px-3 py-1.5 rounded-lg border border-pink-200 text-pink-700 hover:bg-pink-50 disabled:opacity-40 transition-colors"
        >
          Backspace ⌫
        </button>
        <button
          onClick={handleReset}
          disabled={selectedIds.length === 0}
          className="text-xs px-3 py-1.5 rounded-lg border border-pink-200 text-pink-700 hover:bg-pink-50 disabled:opacity-40 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
