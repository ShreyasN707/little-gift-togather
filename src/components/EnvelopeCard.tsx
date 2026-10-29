"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { Theme, waxSeals } from "@/lib/themes";
import { sounds } from "@/lib/audio";

interface EnvelopeCardProps {
  name: string;
  theme: Theme;
  waxSealId?: string;
  isOpen?: boolean;
  onOpen?: () => void;
  interactive?: boolean;
  previewMode?: boolean;
}

export function EnvelopeCard({
  name,
  theme,
  waxSealId = "ruby-heart",
  isOpen = false,
  onOpen,
  interactive = true,
  previewMode = false,
}: EnvelopeCardProps) {
  const [hovered, setHovered] = useState(false);
  const seal = waxSeals.find((s) => s.id === waxSealId) || waxSeals[0];

  const handleClick = () => {
    if (!interactive || isOpen) return;
    sounds.playSealPop();
    onOpen?.();
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-2 select-none">
      {/* 3D Envelope Container */}
      <motion.div
        className="relative w-80 sm:w-96 h-56 sm:h-64 rounded-2xl shadow-2xl overflow-visible cursor-pointer transition-transform duration-300"
        whileHover={interactive && !isOpen ? { scale: 1.02, rotate: -0.5 } : {}}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ perspective: 1000 }}
      >
        {/* Envelope Base Body */}
        <div
          className={`absolute inset-0 rounded-2xl ${theme.envelopeClass} shadow-xl border-2 overflow-hidden flex flex-col justify-between p-6 z-10`}
          style={{
            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.4)",
          }}
        >
          {/* Subtle paper texture overlay */}
          <div className="absolute inset-0 paper-texture pointer-events-none opacity-40"></div>

          {/* Cute washi tape strip in top left */}
          <div className="absolute -top-1.5 left-6 w-24 h-6 washi-tape -rotate-6 z-20 rounded-sm"></div>

          {/* Airmail Love Stamp in top right */}
          <div className="absolute top-4 right-5 z-20">
            <div className="relative bg-white/95 px-2.5 py-1.5 rounded border border-dashed border-pink-400 shadow-sm flex flex-col items-center rotate-3">
              <span className="text-[9px] uppercase tracking-wider font-bold text-pink-600">Air Mail</span>
              <span className="text-sm">💌</span>
              <span className="text-[8px] font-semibold text-pink-500">Love • 1st Class</span>
            </div>
          </div>

          {/* Envelope lower diagonal fold graphics */}
          <div
            className="absolute bottom-0 left-0 right-0 h-36 bg-black/5 pointer-events-none z-10"
            style={{ clipPath: "polygon(0 100%, 100% 100%, 50% 20%)" }}
          ></div>
          <div
            className="absolute bottom-0 left-0 w-1/2 h-full bg-black/[0.03] pointer-events-none z-10"
            style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
          ></div>
          <div
            className="absolute bottom-0 right-0 w-1/2 h-full bg-black/[0.03] pointer-events-none z-10"
            style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
          ></div>

          {/* Cute calligraphy addressing */}
          <div className="relative z-20 mt-8 text-center space-y-1">
            <p className="text-xs uppercase tracking-widest font-semibold opacity-75">
              Special Delivery For
            </p>
            <h3
              className="text-3xl sm:text-4xl font-handwriting font-bold tracking-wide drop-shadow-sm transition-all"
              style={{ color: "#2d161c" }}
            >
              {name ? name : "My Favorite Person 💕"}
            </h3>
            <p className="text-[11px] font-cursive text-pink-900/70 italic">
              Contains a surprise made with love
            </p>
          </div>

          {/* Bottom subtle note */}
          <div className="relative z-20 flex justify-center items-center gap-1.5 opacity-60 text-[10px] font-medium">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Fragile • Handle With Tender Care</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </div>
        </div>

        {/* Envelope Top Triangular Flap */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-32 rounded-t-2xl z-20 origin-top overflow-hidden"
          animate={{
            rotateX: isOpen ? 180 : 0,
            zIndex: isOpen ? 5 : 20,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            transformStyle: "preserve-3d",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            backgroundColor: theme.envelopeLining || "#f8a5c2",
            boxShadow: isOpen ? "none" : "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {/* Inner lining decorative pattern */}
          <div className="w-full h-full opacity-30 bg-repeat bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:12px_12px]"></div>
        </motion.div>

        {/* 3D Wax Seal Stamp */}
        <motion.div
          className="absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: isOpen ? 0 : hovered && interactive ? 1.15 : 1,
            opacity: isOpen ? 0 : 1,
            rotate: isOpen ? 45 : hovered && interactive ? [0, -3, 3, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${seal.color} wax-seal flex items-center justify-center relative cursor-pointer border-2`}
            style={{ borderColor: seal.borderColor }}
          >
            {/* Inner ring */}
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-dashed flex items-center justify-center opacity-85"
              style={{ borderColor: seal.textColor }}
            >
              <span className="text-xl sm:text-2xl drop-shadow">{seal.icon}</span>
            </div>

            {/* Glowing sparkle ring on hover */}
            {hovered && interactive && !isOpen && (
              <motion.div
                className="absolute -inset-2 rounded-full border border-pink-300 pointer-events-none"
                animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>

          {/* Interactive Hint */}
          {interactive && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 backdrop-blur-sm text-pink-900 text-[11px] font-bold px-3 py-1 rounded-full shadow-md border border-pink-200 flex items-center gap-1"
            >
              <span>Tap seal to open</span>
              <Heart className="w-3 h-3 fill-pink-500 text-pink-500 animate-pulse" />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
