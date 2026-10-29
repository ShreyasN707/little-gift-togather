"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { vintageBadges, VintageBadge } from "@/lib/themes";
import { sounds } from "@/lib/audio";

interface VintageBadgesProps {
  selectedBadgeIds?: string[];
  interactive?: boolean;
  onToggleBadge?: (id: string) => void;
}

export function VintageBadges({
  selectedBadgeIds = ["keeper-of-heart", "eternal-rose"],
  interactive = false,
  onToggleBadge,
}: VintageBadgesProps) {
  const [activeTooltip, setActiveTooltip] = useState<VintageBadge | null>(null);

  const activeBadges = vintageBadges.filter((b) => selectedBadgeIds.includes(b.id));

  return (
    <div className="relative w-full my-4">
      {/* Badge Ribbon Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 p-3 bg-amber-950/20 border border-amber-900/30 rounded-xs">
        <div className="w-full text-center mb-1">
          <span className="text-[9px] tracking-[0.3em] font-vintage-serif uppercase font-bold text-amber-900/80">
            HONORARY COMMEMORATIVE MEDALLIONS
          </span>
        </div>

        {activeBadges.map((badge) => {
          const isInspected = activeTooltip?.id === badge.id;
          return (
            <div key={badge.id} className="relative group">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  sounds.playPop();
                  setActiveTooltip(isInspected ? null : badge);
                }}
                className={`relative w-11 sm:w-13 h-11 sm:h-13 rounded-full bg-gradient-to-br ${badge.color} border-2 shadow-lg flex items-center justify-center cursor-pointer`}
                style={{
                  boxShadow:
                    "0 4px 10px rgba(0,0,0,0.35), inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.4)",
                }}
                title={badge.name}
              >
                {/* Pin Head Clasp on Top */}
                <div className="absolute -top-1 w-2.5 h-1.5 bg-amber-300 rounded-xs border border-amber-700 shadow-xs" />

                {/* Inner relief circle */}
                <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full border border-dashed border-amber-200/60 flex items-center justify-center">
                  <span className="text-base sm:text-lg select-none drop-shadow">
                    {badge.symbol}
                  </span>
                </div>
              </motion.button>

              {/* Tooltip on Tap/Hover */}
              <AnimatePresence>
                {isInspected && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-amber-950/95 border border-amber-500/50 rounded-xs shadow-2xl text-center text-[#f6eedb]"
                  >
                    <span className="block text-[8px] tracking-[0.2em] font-vintage-serif uppercase font-bold text-amber-400">
                      {badge.title}
                    </span>
                    <h5 className="font-vintage-serif font-bold text-xs text-amber-100 my-0.5">
                      {badge.name}
                    </h5>
                    <p className="text-[10px] font-vintage-body italic text-amber-200/70 leading-tight">
                      {badge.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
