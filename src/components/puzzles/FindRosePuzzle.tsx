"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function FindRosePuzzle({ onComplete }: { onComplete: () => void }) {
  const [items, setItems] = useState(() => {
    const list = Array(11).fill("🌸");
    list.push("🌹");
    return list.sort(() => Math.random() - 0.5);
  });
  const [wrong, setWrong] = useState<number[]>([]);

  const handleSelect = (index: number, item: string) => {
    if (item === "🌹") {
      import("canvas-confetti").then((module) => {
        const confetti = module.default || module;
        confetti();
      });
      setTimeout(onComplete, 1500);
    } else {
      if (!wrong.includes(index)) {
        setWrong([...wrong, index]);
      }
    }
  };

  return (
    <div className="p-8 sm:p-12 bg-[#fdfbf7] craft-border flex flex-col items-center max-w-sm w-full mx-4 relative z-10">
      <h2 className="text-2xl font-serif text-[#2c1810] mb-8 text-center">Find the hidden Rose to open</h2>
      
      <div className="grid grid-cols-4 gap-4 w-full">
        {items.map((item, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: wrong.includes(i) ? 1 : 1.2, rotate: wrong.includes(i) ? 0 : 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(i, item)}
            className={`h-16 text-4xl flex items-center justify-center transition-all bg-white craft-border ${
              wrong.includes(i) ? "opacity-30 grayscale" : "hover:bg-[#f5e6e6]"
            }`}
          >
            {item}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
