"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function MemoryPuzzle({ onComplete }: { onComplete: () => void }) {
  const [cards, setCards] = useState([
    "❤️", "❤️", "🌹", "🌹", "✨", "✨", "🦋", "🦋"
  ].sort(() => Math.random() - 0.5));
  
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          import("canvas-confetti").then((module) => {
            const confetti = module.default || module;
            confetti();
          });
          setTimeout(onComplete, 1500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full">
      <h2 className="text-xl font-serif text-gray-800 mb-4 text-center">Match the pairs to unlock your letter</h2>
      <div className="grid grid-cols-4 gap-3 w-full">
        {cards.map((card, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(i)}
            className={`h-16 rounded-xl text-2xl flex items-center justify-center transition-all shadow-sm ${
              flipped.includes(i) || matched.includes(i) ? "bg-rose-100 rotate-y-180" : "bg-rose-500"
            }`}
          >
            {(flipped.includes(i) || matched.includes(i)) ? card : ""}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
