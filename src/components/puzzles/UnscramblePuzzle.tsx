"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { sounds } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";

export function UnscramblePuzzle({
  onComplete,
  question,
  answer,
}: {
  onComplete: () => void;
  question?: string;
  answer?: string;
}) {
  const targetWord = (answer || "ALWAYS").toUpperCase().replace(/[^A-Z]/g, "") || "ALWAYS";

  const [scrambled] = useState(() => {
    const letters = targetWord.split("").map((char, index) => ({ id: `${char}-${index}`, char }));
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
        sounds.playVictoryFanfare();
        triggerConfetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.65 },
          colors: ["#C49B45", "#9C4E3D", "#8C6824"],
        });
        setTimeout(onComplete, 1400);
      } else {
        setIsWrong(true);
        setTimeout(() => {
          setSelectedIds([]);
          setIsWrong(false);
        }, 750);
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
    <div className="p-7 sm:p-9 bg-white rounded-none border border-stone-200/90 shadow-editorial-lg flex flex-col items-center max-w-sm sm:max-w-md w-full mx-4 relative z-10">
      <div className="text-center space-y-1 mb-6">
        <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-400 font-sans-clean">
          Keyword Decryption
        </span>
        <h2 className="text-xl sm:text-2xl font-serif-editorial font-medium text-stone-900">
          {question || "Solve the Private Keyword"}
        </h2>
        <p className="text-xs text-stone-500 font-serif-editorial italic">
          Select the letterforms in their original sequence
        </p>
      </div>

      {/* Answer Slots */}
      <motion.div
        animate={isWrong ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap justify-center gap-2 mb-7 min-h-[52px]"
      >
        {Array.from({ length: targetWord.length }).map((_, i) => {
          const char = currentGuess[i];
          return (
            <div
              key={i}
              onClick={handleDeselectLast}
              className={`w-10 sm:w-12 h-12 sm:h-14 rounded-none border flex items-center justify-center text-lg sm:text-xl font-medium font-serif-editorial cursor-pointer transition-all ${
                char
                  ? "bg-[#F7F4EE] border-stone-800 text-stone-900 shadow-editorial-sm"
                  : "bg-stone-50/50 border-dashed border-stone-200 text-stone-300"
              }`}
            >
              {char || ""}
            </div>
          );
        })}
      </motion.div>

      {/* Available Letter Tiles */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 mb-7">
        {scrambled.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <motion.button
              key={item.id}
              whileHover={!isSelected ? { y: -2 } : {}}
              whileTap={!isSelected ? { scale: 0.95 } : {}}
              onClick={() => handleSelect(item)}
              disabled={isSelected}
              className={`w-11 sm:w-12 h-11 sm:h-12 rounded-none text-base sm:text-lg font-serif-editorial font-medium transition-all duration-150 border ${
                isSelected
                  ? "bg-stone-50 text-stone-300 border-stone-100 cursor-not-allowed opacity-50"
                  : "bg-white text-stone-900 hover:bg-stone-50 border-stone-300 shadow-editorial-sm"
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
          className="text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-none border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 transition-colors font-sans-clean"
        >
          Backspace
        </button>
        <button
          onClick={handleReset}
          disabled={selectedIds.length === 0}
          className="text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-none border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 transition-colors font-sans-clean"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
