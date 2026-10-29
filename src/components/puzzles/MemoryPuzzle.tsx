"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { sounds } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";

const ARCHIVAL_SYMBOLS = ["❦", "✦", "☽", "𐇲", "♥", "☼"];

export function MemoryPuzzle({ onComplete }: { onComplete: () => void }) {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const selected = ARCHIVAL_SYMBOLS.slice(0, 4);
    const deck = [...selected, ...selected].sort(() => Math.random() - 0.5);
    setCards(deck);
  }, []);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    sounds.playPop();
    const nextFlipped = [...flipped, index];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setAttempts((a) => a + 1);
      const [first, second] = nextFlipped;
      if (cards[first] === cards[second]) {
        setTimeout(() => {
          sounds.playChime();
          const nextMatched = [...matched, first, second];
          setMatched(nextMatched);
          setFlipped([]);

          if (nextMatched.length === cards.length) {
            sounds.playVictoryFanfare();
            triggerConfetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.65 },
              colors: ["#C49B45", "#9C4E3D", "#8C6824", "#3F5E46"],
            });
            setTimeout(onComplete, 1400);
          }
        }, 350);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 850);
      }
    }
  };

  const pairsFound = matched.length / 2;
  const totalPairs = cards.length / 2;

  return (
    <div className="p-7 sm:p-9 bg-white rounded-2xl border border-stone-200/90 shadow-editorial-lg flex flex-col items-center max-w-sm w-full mx-4 relative z-10">
      <div className="text-center space-y-1 mb-6">
        <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-400 font-sans-clean">
          Authentication Key
        </span>
        <h2 className="text-xl sm:text-2xl font-serif-editorial font-medium text-stone-900">
          Match the Archival Pairs
        </h2>
        <p className="text-xs text-stone-500 font-serif-editorial italic">
          Pair corresponding emblems to unfold the letter
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full mb-6">
        {cards.map((symbol, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          const isMatched = matched.includes(i);

          return (
            <motion.button
              key={i}
              whileHover={{ scale: isMatched ? 1 : 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCardClick(i)}
              className={`h-16 sm:h-20 rounded-xl flex items-center justify-center transition-all duration-200 relative select-none border ${
                isMatched
                  ? "bg-stone-50 border-stone-300/80 text-stone-800"
                  : isFlipped
                  ? "bg-white border-stone-800 text-stone-900 shadow-editorial-sm"
                  : "bg-[#F7F4EE] hover:bg-[#F0EBE0] border-stone-200/90 text-stone-400"
              }`}
            >
              {isFlipped ? (
                <span className="text-2xl font-serif-editorial drop-shadow-xs select-none">
                  {symbol}
                </span>
              ) : (
                <span className="text-xs tracking-widest text-stone-300 font-serif-editorial">
                  ✦
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="flex justify-between items-center w-full px-1 text-[11px] tracking-wide text-stone-500 font-sans-clean border-t border-stone-100 pt-3">
        <span>{pairsFound} of {totalPairs} matched</span>
        <span>{attempts} {attempts === 1 ? "attempt" : "attempts"}</span>
      </div>
    </div>
  );
}
