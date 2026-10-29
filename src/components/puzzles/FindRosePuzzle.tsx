"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { sounds } from "@/lib/audio";

const FLOWER_VARIETIES = ["🌸", "🌷", "🌼", "🌺", "💐", "🌻", "🪻"];

export function FindRosePuzzle({ onComplete }: { onComplete: () => void }) {
  const [items] = useState(() => {
    const list = Array(11).fill(null).map((_, i) => FLOWER_VARIETIES[i % FLOWER_VARIETIES.length]);
    list.push("🌹");
    return list.sort(() => Math.random() - 0.5);
  });

  const [wrongIndices, setWrongIndices] = useState<number[]>([]);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);

  const handleSelect = (index: number, item: string) => {
    if (foundIndex !== null || wrongIndices.includes(index)) return;

    if (item === "🌹") {
      setFoundIndex(index);
      sounds.playVictoryFanfare();
      import("canvas-confetti").then((module) => {
        const confetti = module.default || module;
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#f43f5e", "#fb7185", "#fda4af", "#ffe4e6"],
        });
      });
      setTimeout(onComplete, 1600);
    } else {
      sounds.playPop();
      setWrongIndices((prev) => [...prev, index]);
    }
  };

  return (
    <div className="p-6 sm:p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-pink-200/80 flex flex-col items-center max-w-sm w-full mx-4 relative z-10 cute-shadow-lg">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-50 border border-pink-200 rounded-full text-xs font-bold text-pink-700 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-pink-500" />
        <span>Flower Garden Mystery</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-cute font-bold text-gray-800 text-center mb-1">
        Find the Hidden Red Rose 🌹
      </h2>
      <p className="text-xs text-pink-900/60 font-medium mb-5 text-center">
        Tap the garden blossoms to uncover the secret rose
      </p>

      {/* Grid of flowers */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full mb-4">
        {items.map((item, i) => {
          const isWrong = wrongIndices.includes(i);
          const isFound = foundIndex === i;

          return (
            <motion.button
              key={i}
              whileHover={!isWrong && !isFound ? { scale: 1.12, rotate: 6 } : {}}
              whileTap={!isWrong && !isFound ? { scale: 0.9 } : {}}
              onClick={() => handleSelect(i, item)}
              disabled={isWrong || foundIndex !== null}
              className={`h-16 sm:h-18 rounded-2xl flex items-center justify-center transition-all duration-300 relative select-none ${
                isFound
                  ? "bg-gradient-to-br from-red-100 to-rose-200 border-2 border-red-400 shadow-lg scale-110"
                  : isWrong
                  ? "bg-gray-100/80 border border-gray-200 opacity-40 grayscale"
                  : "bg-white hover:bg-pink-50/80 border-2 border-pink-200 shadow-sm hover:border-pink-300"
              }`}
            >
              <span className={`text-3xl sm:text-4xl filter drop-shadow-sm ${isFound ? "animate-bounce" : ""}`}>
                {item}
              </span>
              {isFound && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="absolute -top-2 -right-2 text-sm"
                >
                  ✨
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="text-xs font-semibold text-pink-800/60">
        {wrongIndices.length > 0 && foundIndex === null ? (
          <span>Keep looking! Hint: it has deep velvet red petals ❤️</span>
        ) : foundIndex !== null ? (
          <span className="text-rose-600 font-bold flex items-center gap-1">
            You found it! Opening your letter... <Heart className="w-3.5 h-3.5 fill-current" />
          </span>
        ) : (
          <span>12 blossoms in the garden</span>
        )}
      </div>
    </div>
  );
}
