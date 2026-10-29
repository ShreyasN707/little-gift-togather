"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Trophy, Heart } from "lucide-react";
import { sounds } from "@/lib/audio";

const EMOJI_PAIRS = ["❤️", "🌹", "🧸", "💌", "✨", "🎀"];

export function MemoryPuzzle({ onComplete }: { onComplete: () => void }) {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    // 4 pairs (8 cards) for a fun, sweet, stress-free mini-game
    const selected = EMOJI_PAIRS.slice(0, 4);
    const deck = [...selected, ...selected].sort(() => Math.random() - 0.5);
    setCards(deck);
  }, []);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    sounds.playPop();
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        // Matched!
        setTimeout(() => {
          sounds.playChime();
          const nextMatched = [...matched, first, second];
          setMatched(nextMatched);
          setFlipped([]);

          if (nextMatched.length === cards.length) {
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
          }
        }, 400);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 900);
      }
    }
  };

  const progressPercent = cards.length ? Math.round((matched.length / cards.length) * 100) : 0;

  return (
    <div className="p-6 sm:p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-pink-200/80 flex flex-col items-center max-w-sm w-full mx-4 relative z-10 cute-shadow-lg">
      {/* Decorative top ribbon */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-50 border border-pink-200 rounded-full text-xs font-bold text-pink-700 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-pink-500" />
        <span>Love Lock Puzzle</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-cute font-bold text-gray-800 text-center">
        Match the Sweet Pairs 💕
      </h2>
      <p className="text-xs text-pink-900/60 font-medium mb-4 text-center">
        Match all romantic icons to unlock your surprise letter
      </p>

      {/* Progress bar */}
      <div className="w-full bg-pink-100/70 h-2 rounded-full overflow-hidden mb-5">
        <motion.div
          className="bg-gradient-to-r from-pink-400 to-rose-400 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full mb-4">
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          const isMatched = matched.includes(i);

          return (
            <motion.button
              key={i}
              whileHover={{ scale: isMatched ? 1 : 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleCardClick(i)}
              className={`h-16 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-300 relative select-none shadow-sm ${
                isMatched
                  ? "bg-pink-100/90 border-2 border-pink-300 shadow-inner"
                  : isFlipped
                  ? "bg-white border-2 border-pink-400 shadow-md"
                  : "bg-gradient-to-br from-pink-400 to-rose-400 text-white hover:from-pink-500 hover:to-rose-500 border border-pink-300 shadow-md"
              }`}
            >
              {isFlipped ? (
                <motion.span
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="text-2xl sm:text-3xl filter drop-shadow"
                >
                  {card}
                </motion.span>
              ) : (
                <Heart className="w-5 h-5 text-pink-100 opacity-80" />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-between items-center w-full px-2 text-xs font-semibold text-gray-500">
        <span>{matched.length / 2} / {cards.length / 2} Pairs Found</span>
        <span>{moves} Taps</span>
      </div>
    </div>
  );
}
