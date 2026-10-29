"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Theme, waxSeals } from "@/lib/themes";
import { sounds } from "@/lib/audio";

interface EnvelopeCardProps {
  name: string;
  theme?: Theme;
  envelopeStyle?: string;
  waxSealId?: string;
  isOpen?: boolean;
  onOpen?: () => void;
  interactive?: boolean;
  previewMode?: boolean;
}

export function EnvelopeCard({
  name,
  theme,
  envelopeStyle = "vintage-airmail",
  waxSealId = "burgundy-monogram",
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

  // Determine styling based on envelopeStyle
  const isAirmail = envelopeStyle === "vintage-airmail";
  const isVictorian = envelopeStyle === "victorian-gilded";
  const isTwine = envelopeStyle === "parchment-twine";
  const isCelestial = envelopeStyle === "celestial-noir";
  const isBotanical = envelopeStyle === "botanical-herbarium";

  return (
    <div className="relative flex flex-col items-center justify-center p-3 select-none">
      {/* 3D Envelope Container */}
      <motion.div
        className="relative w-[340px] sm:w-[440px] h-[230px] sm:h-[285px] rounded-none overflow-visible cursor-pointer transition-transform duration-300"
        whileHover={interactive && !isOpen ? { y: -4, scale: 1.015 } : {}}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ perspective: 1200 }}
      >
        {/* Outer Frame Border according to style */}
        <div
          className={`absolute inset-0 rounded-none shadow-2xl ${
            isAirmail
              ? "airmail-chevron-border"
              : isVictorian
              ? "bg-[#2b080f] p-2 border-2 border-amber-500/60"
              : isCelestial
              ? "bg-[#0b101d] p-1.5 border border-cyan-400/40"
              : isBotanical
              ? "bg-[#25392b] p-1.5 border border-emerald-600/40"
              : "p-2 border-2 border-amber-900/40 bg-[#3a2213]"
          }`}
        >
          {/* Main Envelope Body */}
          <div
            className={`w-full h-full rounded-none relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 border ${
              isCelestial
                ? "bg-gradient-to-br from-[#121829] via-[#0d1322] to-[#070b14] text-[#f6eedb] border-cyan-500/30"
                : isVictorian
                ? "bg-gradient-to-br from-[#4a121c] via-[#3b0c14] to-[#24060b] text-[#fce8ce] border-amber-500/50"
                : isBotanical
                ? "bg-gradient-to-br from-[#dce8dd] via-[#cfded0] to-[#b8cdba] text-[#1c2c1f] border-emerald-800/30"
                : isTwine
                ? "bg-[#e8d5b5] text-[#2c190d] border-amber-950/40"
                : "aged-parchment text-[#2b170c] border-amber-900/30"
            }`}
          >
            {/* Subtle paper grain */}
            <div className="absolute inset-0 paper-texture pointer-events-none opacity-40" />

            {/* TWINE OVERLAY (if Twine style) */}
            {isTwine && (
              <>
                <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-amber-800/60 shadow-md pointer-events-none z-15" />
                <div className="absolute left-0 right-0 top-1/2 h-2 bg-amber-800/60 shadow-md pointer-events-none z-15" />
                <div className="absolute top-4 left-4 z-20 bg-amber-100 border border-amber-800 px-2 py-1 rounded-none shadow-xs rotate-3">
                  <span className="text-[8px] font-vintage-serif font-bold tracking-widest uppercase text-amber-950">
                    PARCEL NO. 74
                  </span>
                </div>
              </>
            )}

            {/* CELESTIAL STARS (if Celestial style) */}
            {isCelestial && (
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <span className="absolute top-4 left-6 text-amber-300 text-xs">✦</span>
                <span className="absolute top-12 left-20 text-cyan-200 text-[10px]">✧</span>
                <span className="absolute bottom-6 right-10 text-amber-300 text-sm">✦</span>
                <span className="absolute top-8 right-24 text-cyan-200 text-xs">✧</span>
                <span className="absolute bottom-10 left-14 text-amber-200 text-xs">☽</span>
              </div>
            )}

            {/* Inner Filigree / Frame */}
            <div
              className={`absolute inset-3 border pointer-events-none rounded-xs ${
                isVictorian
                  ? "border-amber-400/40"
                  : isCelestial
                  ? "border-cyan-400/20"
                  : isBotanical
                  ? "border-emerald-800/20"
                  : "border-amber-800/25"
              }`}
            >
              <div
                className={`absolute inset-0.5 border border-dashed pointer-events-none ${
                  isVictorian
                    ? "border-amber-400/20"
                    : isCelestial
                    ? "border-cyan-400/15"
                    : "border-amber-900/15"
                }`}
              />
              <span className="absolute -top-2 -left-2 text-xs opacity-50 select-none">
                {isBotanical ? "𐇲" : isCelestial ? "✧" : "❧"}
              </span>
              <span className="absolute -top-2 -right-2 text-xs opacity-50 select-none">
                {isBotanical ? "𐇲" : isCelestial ? "✧" : "☙"}
              </span>
              <span className="absolute -bottom-2 -left-2 text-xs opacity-50 select-none">
                {isBotanical ? "𐇲" : isCelestial ? "✧" : "❧"}
              </span>
              <span className="absolute -bottom-2 -right-2 text-xs opacity-50 select-none">
                {isBotanical ? "𐇲" : isCelestial ? "✧" : "☙"}
              </span>
            </div>

            {/* Postage Stamp & Cancellation (Top Right) */}
            <div className="absolute top-4 right-5 z-20 pointer-events-none">
              <div className="relative transform rotate-2">
                <div
                  className={`w-14 sm:w-16 h-18 sm:h-20 p-1 flex flex-col items-center justify-between rounded-xs border border-dashed shadow-sm ${
                    isCelestial
                      ? "bg-[#1f293d] border-amber-400/50 text-amber-200"
                      : isVictorian
                      ? "bg-[#5c1622] border-amber-400/60 text-amber-200"
                      : isBotanical
                      ? "bg-[#f4faf4] border-emerald-800/40 text-emerald-950"
                      : "bg-[#fbf6ec] border-[#b59b75] text-amber-950"
                  }`}
                >
                  <span className="text-[7px] tracking-[0.2em] font-vintage-serif uppercase font-bold opacity-80">
                    {isBotanical ? "JARDIN BOTANIQUE" : isCelestial ? "ROYAL OBS." : "ROYAL MAIL"}
                  </span>
                  <div className="w-9 h-11 border border-current/30 flex flex-col items-center justify-center">
                    <span className="text-xl">
                      {isBotanical ? "⚘" : isCelestial ? "☽" : isVictorian ? "👑" : "⚜"}
                    </span>
                    <span className="text-[8px] font-vintage-serif font-bold">1924</span>
                  </div>
                  <span className="text-[7px] font-vintage-serif uppercase tracking-widest font-bold opacity-80">
                    SPECIAL POST
                  </span>
                </div>

                {/* Circular Postmark */}
                <div
                  className={`absolute -bottom-3 -left-4 w-16 h-16 border-2 rounded-full flex flex-col items-center justify-center pointer-events-none -rotate-12 ${
                    isCelestial || isVictorian
                      ? "border-amber-300/40 text-amber-200/60"
                      : "border-stone-800/60 text-stone-800/70"
                  }`}
                >
                  <span className="text-[6px] tracking-widest uppercase font-bold">G.P.O. DESPATCH</span>
                  <span className="text-[7px] font-mono font-bold my-0.5">14 OCT 1924</span>
                  <span className="text-[6px] tracking-widest uppercase font-bold">FIRST CLASS</span>
                </div>
              </div>
            </div>

            {/* Courier Rubber Stamp (Top Left) */}
            <div className="absolute top-5 left-5 z-20 pointer-events-none opacity-60 transform -rotate-6">
              <div
                className={`border-2 px-2 py-0.5 rounded-xs ${
                  isCelestial || isVictorian ? "border-amber-400/60 text-amber-300" : "border-red-900/60 text-red-950"
                }`}
              >
                <span className="text-[8px] tracking-[0.25em] font-vintage-serif font-bold uppercase">
                  CONFIDENTIAL • BY COURIER
                </span>
              </div>
            </div>

            {/* Addressing */}
            <div className="relative z-20 mt-10 sm:mt-12 text-center space-y-0.5">
              <p
                className={`text-[10px] tracking-[0.3em] font-vintage-serif uppercase font-semibold ${
                  isCelestial || isVictorian ? "text-amber-300/70" : "text-amber-950/60"
                }`}
              >
                To the Esteemed Presence of
              </p>
              <h3
                className={`text-4xl sm:text-5xl font-vintage-calligraphy tracking-wide py-1 ${
                  isCelestial
                    ? "text-amber-200 drop-shadow-[0_2px_10px_rgba(240,210,130,0.3)]"
                    : isVictorian
                    ? "text-amber-100 drop-shadow-[0_2px_8px_rgba(240,200,120,0.4)]"
                    : isBotanical
                    ? "text-emerald-950"
                    : "text-amber-950"
                }`}
              >
                {name ? name : "Dearest Beloved"}
              </h3>
              <div className="flex items-center justify-center gap-2 opacity-50">
                <span className="h-[1px] w-12 bg-current" />
                <span className="text-xs font-vintage-serif">❦</span>
                <span className="h-[1px] w-12 bg-current" />
              </div>
              <p
                className={`text-[11px] font-vintage-body italic tracking-widest ${
                  isCelestial || isVictorian ? "text-amber-200/70" : "text-amber-900/70"
                }`}
              >
                Containing Private Words & Remembrance
              </p>
            </div>

            {/* Bottom Seal Notice */}
            <div
              className={`relative z-20 flex justify-center items-center opacity-40 text-[8px] tracking-[0.3em] uppercase font-vintage-serif ${
                isCelestial || isVictorian ? "text-amber-200" : "text-amber-950"
              }`}
            >
              ARCHIVAL DESPATCH NO. 1924-B
            </div>
          </div>
        </div>

        {/* Envelope Top Flap */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-36 rounded-none z-20 origin-top overflow-hidden border-t-2"
          animate={{
            rotateX: isOpen ? 180 : 0,
            zIndex: isOpen ? 5 : 25,
          }}
          transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
          style={{
            transformStyle: "preserve-3d",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            backgroundColor: isCelestial
              ? "#0c121e"
              : isVictorian
              ? "#540b15"
              : isBotanical
              ? "#1d3023"
              : "#2b1418",
            borderColor: isCelestial ? "#38bdf8" : "#c59b48",
            boxShadow: isOpen ? "none" : "0 6px 20px -2px rgba(0,0,0,0.5)",
          }}
        >
          <div className="w-full h-full relative">
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#c59b48_1.5px,transparent_1.5px)] [background-size:14px_14px]" />
            <div
              className="absolute inset-0 border-b-4 border-amber-500/50"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            />
          </div>
        </motion.div>

        {/* 3D Molten Wax Seal */}
        <motion.div
          className="absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: isOpen ? 0 : hovered && interactive ? 1.09 : 1,
            opacity: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="relative group cursor-pointer">
            <svg
              className="w-16 sm:w-20 h-16 sm:h-20 vintage-molten-seal filter drop-shadow-xl"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="waxGradDynamic" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#c5283d" />
                  <stop offset="50%" stopColor="#8b1e2d" />
                  <stop offset="85%" stopColor="#540b15" />
                  <stop offset="100%" stopColor="#2b0006" />
                </radialGradient>
                <linearGradient id="goldReliefDynamic" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffd875" />
                  <stop offset="50%" stopColor="#c59b48" />
                  <stop offset="100%" stopColor="#755219" />
                </linearGradient>
              </defs>

              <path
                d="M50 4 C68 3, 85 14, 91 30 C97 45, 96 64, 88 77 C80 90, 63 97, 47 96 C30 95, 12 87, 6 71 C0 55, 3 36, 12 23 C21 10, 36 5, 50 4 Z"
                fill="url(#waxGradDynamic)"
              />
              <circle cx="50" cy="50" r="32" stroke="#4a0710" strokeWidth="2.5" fill="#69121d" />
              <circle
                cx="50"
                cy="50"
                r="28"
                stroke="url(#goldReliefDynamic)"
                strokeWidth="1"
                strokeDasharray="3 2"
                fill="none"
                opacity="0.8"
              />
              <text
                x="50"
                y="58"
                textAnchor="middle"
                fontSize="24"
                fontFamily="Cinzel Decorative, serif"
                fill="url(#goldReliefDynamic)"
                style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.8))" }}
              >
                {seal.symbol}
              </text>
            </svg>

            {hovered && interactive && !isOpen && (
              <motion.div
                className="absolute -inset-1.5 rounded-full border border-amber-400/60 pointer-events-none"
                animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            )}
          </div>

          {interactive && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-950/95 border border-amber-600/40 text-amber-200 text-[10px] tracking-[0.2em] uppercase font-vintage-serif px-3 py-1 rounded-none shadow-xl pointer-events-none"
            >
              Break Wax Seal
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
