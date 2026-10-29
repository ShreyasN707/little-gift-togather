"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { sounds } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";

const BOTANICAL_SYMBOLS = ["✿", "✤", "𐇲", "✦", "❦", "❀"];

export function FindRosePuzzle({ onComplete }: { onComplete: () => void }) {
  const [items] = useState(() => {
    const list = Array(11).fill(null).map((_, i) => BOTANICAL_SYMBOLS[i % BOTANICAL_SYMBOLS.length]);
    list.push("⚘");
    return list.sort(() => Math.random() - 0.5);
  });

  const [wrongIndices, setWrongIndices] = useState<number[]>([]);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);

  const handleSelect = (index: number, item: string) => {
    if (foundIndex !== null || wrongIndices.includes(index)) return;

    if (item === "⚘") {
      setFoundIndex(index);
      sounds.playVictoryFanfare();
      triggerConfetti({
        particleCount: 50,
        spread: 75,
        origin: { y: 0.65 },
        colors: ["#9C4E3D", "#C49B45", "#801726"],
      });
      setTimeout(onComplete, 1400);
    } else {
      sounds.playPop();
      setWrongIndices((prev) => [...prev, index]);
    }
  };

  return (
    <div className="p-7 sm:p-9 bg-white rounded-2xl border border-stone-200/90 shadow-editorial-lg flex flex-col items-center max-w-sm w-full mx-4 relative z-10">
      <div className="text-center space-y-1 mb-6">
        <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-400 font-sans-clean">
          Botanical Discovery
        </span>
        <h2 className="text-xl sm:text-2xl font-serif-editorial font-medium text-stone-900">
          Locate the Crimson Blossom
        </h2>
        <p className="text-xs text-stone-500 font-serif-editorial italic">
          Select the unique wild blossom hidden among the botanical grid
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full mb-5">
        {items.map((item, i) => {
          const isWrong = wrongIndices.includes(i);
          const isFound = foundIndex === i;

          return (
            <motion.button
              key={i}
              whileHover={!isWrong && !isFound ? { y: -2 } : {}}
              whileTap={!isWrong && !isFound ? { scale: 0.96 } : {}}
              onClick={() => handleSelect(i, item)}
              disabled={isWrong || foundIndex !== null}
              className={`h-16 sm:h-18 rounded-xl flex items-center justify-center transition-all duration-200 relative select-none border ${
                isFound
                  ? "bg-[#FAF3F0] border-[#9C4E3D] text-[#9C4E3D] shadow-editorial-sm scale-105"
                  : isWrong
                  ? "bg-stone-50 border-stone-100 opacity-30 text-stone-300"
                  : "bg-[#FCFAF7] hover:bg-white border-stone-200 text-stone-600 shadow-editorial-sm"
              }`}
            >
              <span className={`text-2xl font-serif-editorial select-none ${isFound ? "font-bold text-3xl" : ""}`}>
                {item}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="text-[11px] text-stone-500 font-sans-clean tracking-wide">
        {wrongIndices.length > 0 && foundIndex === null ? (
          <span>Keep seeking the solitary crimson bloom...</span>
        ) : foundIndex !== null ? (
          <span className="text-[#9C4E3D] font-medium">Blossom discovered. Unfolding letter...</span>
        ) : (
          <span>12 botanical tiles</span>
        )}
      </div>
    </div>
  );
}
