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
  isPoppedOut?: boolean;
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
  isPoppedOut = false,
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
  const isArtDeco = envelopeStyle === "art-deco-noir";
  const isVinyl = envelopeStyle === "retro-vinyl-gold";
  const isCyber = envelopeStyle === "cyber-holo-foil";

  // Dynamic seal colors according to seal ID and envelope theme
  const sealColors =
    seal.id === "deco-emerald" || isArtDeco
      ? {
          grad1: "#059669",
          grad2: "#047857",
          grad3: "#064e3b",
          grad4: "#022c22",
          inner: "#064e3b",
          symbol: isArtDeco ? "🪶" : seal.symbol,
          accent: "#fef08a",
        }
      : seal.id === "amber-vinyl-wax" || isVinyl
      ? {
          grad1: "#f59e0b",
          grad2: "#d97706",
          grad3: "#b45309",
          grad4: "#78350f",
          inner: "#92400e",
          symbol: isVinyl ? "♫" : seal.symbol,
          accent: "#fef3c7",
        }
      : seal.id === "neon-cyber-core" || isCyber
      ? {
          grad1: "#06b6d4",
          grad2: "#0891b2",
          grad3: "#0e7490",
          grad4: "#164e63",
          inner: "#155e75",
          symbol: isCyber ? "⏣" : seal.symbol,
          accent: "#67e8f9",
        }
      : seal.id === "forest-botanical" || isBotanical
      ? {
          grad1: "#2e6f40",
          grad2: "#1e4d2b",
          grad3: "#13351d",
          grad4: "#07170c",
          inner: "#173b22",
          symbol: isBotanical ? "⚘" : seal.symbol,
          accent: "#a7f3d0",
        }
      : seal.id === "midnight-navy" || isCelestial
      ? {
          grad1: "#1d4ed8",
          grad2: "#1e3a8a",
          grad3: "#0f172a",
          grad4: "#030712",
          inner: "#172554",
          symbol: isCelestial ? "✧" : seal.symbol,
          accent: "#bae6fd",
        }
      : seal.id === "antique-gold"
      ? {
          grad1: "#d97706",
          grad2: "#b45309",
          grad3: "#78350f",
          grad4: "#451a03",
          inner: "#92400e",
          symbol: seal.symbol,
          accent: "#fef3c7",
        }
      : seal.id === "terracotta-wax" || isTwine
      ? {
          grad1: "#c2410c",
          grad2: "#9a3412",
          grad3: "#662008",
          grad4: "#350e04",
          inner: "#7c2d12",
          symbol: isTwine ? "⚜" : seal.symbol,
          accent: "#fed7aa",
        }
      : {
          // Burgundy Royal default / Victorian
          grad1: "#be123c",
          grad2: "#881337",
          grad3: "#4c0519",
          grad4: "#22020a",
          inner: "#5f0a20",
          symbol: isVictorian ? "👑" : seal.symbol,
          accent: "#fde2e8",
        };

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
              ? "bg-[#2b080f] p-2 border-2 border-amber-500/70 shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
              : isArtDeco
              ? "bg-[#0b0c10] p-2 border-2 border-yellow-500/80 shadow-[0_15px_35px_rgba(0,0,0,0.95)]"
              : isVinyl
              ? "bg-[#2a1708] p-2 border-2 border-amber-600/70 shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
              : isCyber
              ? "bg-[#040915] p-1.5 border border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              : isCelestial
              ? "bg-[#070b14] p-1.5 border border-cyan-400/50 shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
              : isBotanical
              ? "bg-[#1c2c20] p-1.5 border border-emerald-600/50 shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
              : "p-2 border-2 border-amber-900/60 bg-[#351d10] shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
          }`}
        >
          {/* Main Envelope Body */}
          <div
            className={`w-full h-full rounded-none relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 border ${
              isArtDeco
                ? "bg-gradient-to-br from-[#16171e] via-[#0d0e13] to-[#050608] text-[#fef3c7] border-yellow-500/50"
                : isVinyl
                ? "bg-gradient-to-br from-[#f2ddba] via-[#e4c28f] to-[#d3a86c] text-[#241306] border-amber-800/40"
                : isCyber
                ? "bg-gradient-to-br from-[#061527] via-[#040b17] to-[#02050b] text-[#e0f2fe] border-cyan-400/60"
                : isCelestial
                ? "bg-gradient-to-br from-[#0c1322] via-[#080d19] to-[#04060c] text-[#f0f9ff] border-cyan-500/40"
                : isVictorian
                ? "bg-gradient-to-br from-[#4a121c] via-[#3b0c14] to-[#24060b] text-[#fce8ce] border-amber-500/50"
                : isBotanical
                ? "bg-gradient-to-br from-[#dce8dd] via-[#cfded0] to-[#b8cdba] text-[#1c2c1f] border-emerald-800/40"
                : isTwine
                ? "bg-gradient-to-br from-[#ebd8ba] via-[#dec6a2] to-[#cfb48c] text-[#2c190d] border-amber-950/40"
                : "aged-parchment text-[#2b170c] border-amber-900/30"
            }`}
          >
            {/* Subtle paper grain */}
            <div className="absolute inset-0 paper-texture pointer-events-none opacity-40" />

            {/* Internal Envelope Pocket Throat (Visible depth when open) */}
            <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

            {/* Peeking Game Parcel (Tucked inside envelope mouth before popcorn launch) */}
            {isOpen && !isPoppedOut && (
              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 2, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                className="absolute top-1 left-8 right-8 h-14 bg-[#fcf8ec] border border-amber-900/40 rounded-none shadow-lg z-15 flex items-center justify-center pointer-events-none"
              >
                <span className="text-[8px] font-vintage-serif tracking-widest uppercase text-amber-950 font-bold opacity-80">
                  ✦ KEEPSAKE CHALLENGE PARCEL ✦
                </span>
              </motion.div>
            )}

            {/* TWINE OVERLAY (if Twine style) */}
            {isTwine && (
              <>
                <div className="absolute top-0 bottom-0 left-1/3 w-2.5 bg-amber-900/70 shadow-md pointer-events-none z-15" />
                <div className="absolute left-0 right-0 top-1/2 h-2.5 bg-amber-900/70 shadow-md pointer-events-none z-15" />
                <div className="absolute top-4 left-4 z-20 bg-[#fbf5e8] border-2 border-amber-900 px-2.5 py-1 rounded-none shadow-md rotate-2">
                  <span className="text-[7.5px] font-vintage-serif font-bold tracking-widest uppercase text-amber-950">
                    OVERLAND WAYBILL NO. 74
                  </span>
                </div>
              </>
            )}

            {/* CELESTIAL STARS (if Celestial style) */}
            {isCelestial && (
              <div className="absolute inset-0 pointer-events-none opacity-60">
                <span className="absolute top-3 left-6 text-amber-300 text-xs">✦</span>
                <span className="absolute top-10 left-24 text-cyan-200 text-[11px]">✧</span>
                <span className="absolute bottom-6 right-12 text-amber-300 text-sm">✦</span>
                <span className="absolute top-7 right-28 text-cyan-200 text-xs">✧</span>
                <span className="absolute bottom-10 left-12 text-cyan-300 text-xs">☽</span>
                <div className="absolute top-8 left-16 w-32 h-32 border border-cyan-500/15 rounded-full pointer-events-none" />
              </div>
            )}

            {/* BOTANICAL LEAF FLORA (if Botanical style) */}
            {isBotanical && (
              <div className="absolute inset-0 pointer-events-none opacity-30">
                <span className="absolute top-3 left-4 text-emerald-900 text-sm">𐇲</span>
                <span className="absolute bottom-4 right-6 text-emerald-900 text-base">⚘</span>
                <span className="absolute bottom-4 left-8 text-emerald-800 text-xs">🌿</span>
              </div>
            )}

            {/* Inner Filigree / Frame */}
            <div
              className={`absolute inset-3 border pointer-events-none rounded-none ${
                isVictorian
                  ? "border-amber-400/50"
                  : isCelestial
                  ? "border-cyan-400/30"
                  : isBotanical
                  ? "border-emerald-800/30"
                  : "border-amber-800/25"
              }`}
            >
              <div
                className={`absolute inset-0.5 border border-dashed pointer-events-none ${
                  isVictorian
                    ? "border-amber-400/30"
                    : isCelestial
                    ? "border-cyan-400/20"
                    : "border-amber-900/20"
                }`}
              />
              <span className="absolute -top-2 -left-2 text-xs opacity-60 select-none">
                {isBotanical ? "𐇲" : isCelestial ? "✧" : isVictorian ? "👑" : "❧"}
              </span>
              <span className="absolute -top-2 -right-2 text-xs opacity-60 select-none">
                {isBotanical ? "𐇲" : isCelestial ? "✧" : isVictorian ? "👑" : "☙"}
              </span>
              <span className="absolute -bottom-2 -left-2 text-xs opacity-60 select-none">
                {isBotanical ? "𐇲" : isCelestial ? "✧" : isVictorian ? "👑" : "❧"}
              </span>
              <span className="absolute -bottom-2 -right-2 text-xs opacity-60 select-none">
                {isBotanical ? "𐇲" : isCelestial ? "✧" : isVictorian ? "👑" : "☙"}
              </span>
            </div>

            {/* Postage Stamp & Cancellation (Top Right) */}
            <div className="absolute top-4 right-5 z-20 pointer-events-none">
              <div className="relative transform rotate-2">
                <div
                  className={`w-14 sm:w-16 h-18 sm:h-20 p-1 flex flex-col items-center justify-between rounded-none border border-dashed shadow-sm ${
                    isCelestial
                      ? "bg-[#141e30] border-cyan-400/50 text-cyan-200"
                      : isVictorian
                      ? "bg-[#5c1622] border-amber-400/70 text-amber-200"
                      : isBotanical
                      ? "bg-[#f4faf4] border-emerald-800/40 text-emerald-950"
                      : isTwine
                      ? "bg-[#f5ebd9] border-amber-900/50 text-amber-950"
                      : "bg-[#fbf6ec] border-[#b59b75] text-amber-950"
                  }`}
                >
                  <span className="text-[6.5px] tracking-[0.2em] font-vintage-serif uppercase font-bold opacity-80 text-center">
                    {isBotanical
                      ? "KEW HERBARIUM"
                      : isCelestial
                      ? "OBS. ROYAL"
                      : isVictorian
                      ? "ROYAL DISPATCH"
                      : isTwine
                      ? "OVERLAND POST"
                      : "ROYAL AIRMAIL"}
                  </span>
                  <div className="w-9 h-11 border border-current/30 flex flex-col items-center justify-center">
                    <span className="text-xl">
                      {isBotanical ? "⚘" : isCelestial ? "☽" : isVictorian ? "👑" : isTwine ? "⚜" : "✉"}
                    </span>
                    <span className="text-[7.5px] font-vintage-serif font-bold">
                      {isVictorian ? "1890" : isCelestial ? "1888" : isBotanical ? "1912" : isTwine ? "1884" : "1924"}
                    </span>
                  </div>
                  <span className="text-[6.5px] font-vintage-serif uppercase tracking-widest font-bold opacity-80">
                    SPECIAL POST
                  </span>
                </div>

                {/* Circular Postmark */}
                <div
                  className={`absolute -bottom-3 -left-4 w-16 h-16 border-2 rounded-full flex flex-col items-center justify-center pointer-events-none -rotate-12 ${
                    isCelestial
                      ? "border-cyan-300/40 text-cyan-200/60"
                      : isVictorian
                      ? "border-amber-300/40 text-amber-200/60"
                      : "border-stone-800/60 text-stone-800/70"
                  }`}
                >
                  <span className="text-[5.5px] tracking-widest uppercase font-bold">
                    {isVictorian
                      ? "CHANCELLERY"
                      : isCelestial
                      ? "OBSERVATORY"
                      : isBotanical
                      ? "BOTANICAL POST"
                      : isTwine
                      ? "STAGECOACH"
                      : "G.P.O. DESPATCH"}
                  </span>
                  <span className="text-[6.5px] font-mono font-bold my-0.5">
                    {isVictorian
                      ? "28 NOV 1890"
                      : isCelestial
                      ? "21 MAR 1888"
                      : isBotanical
                      ? "18 JUN 1912"
                      : isTwine
                      ? "12 OCT 1884"
                      : "14 OCT 1924"}
                  </span>
                  <span className="text-[5.5px] tracking-widest uppercase font-bold">FIRST CLASS</span>
                </div>
              </div>
            </div>

            {/* Courier Rubber Stamp (Top Left) */}
            <div className="absolute top-5 left-5 z-20 pointer-events-none opacity-70 transform -rotate-6">
              <div
                className={`border-2 px-2 py-0.5 rounded-none ${
                  isCelestial
                    ? "border-cyan-400/60 text-cyan-300"
                    : isVictorian
                    ? "border-amber-400/60 text-amber-300"
                    : isBotanical
                    ? "border-emerald-800/70 text-emerald-900"
                    : "border-red-900/60 text-red-950"
                }`}
              >
                <span className="text-[7.5px] tracking-[0.25em] font-vintage-serif font-bold uppercase">
                  {isVictorian
                    ? "ROYAL PRIVILEGE • CONFIDENTIAL"
                    : isCelestial
                    ? "ASTRONOMICAL • FIRST MAGNITUDE"
                    : isBotanical
                    ? "CONSERVATORY SPECIMEN • BOTANICAL"
                    : isTwine
                    ? "OVERLAND PARCEL • REGISTERED"
                    : "CONFIDENTIAL • BY COURIER"}
                </span>
              </div>
            </div>

            {/* Addressing */}
            <div className="relative z-20 mt-10 sm:mt-12 text-center space-y-0.5">
              <p
                className={`text-[9.5px] tracking-[0.3em] font-vintage-serif uppercase font-semibold ${
                  isCelestial
                    ? "text-cyan-300/80"
                    : isVictorian
                    ? "text-amber-300/80"
                    : isBotanical
                    ? "text-emerald-900/70"
                    : "text-amber-950/70"
                }`}
              >
                {isVictorian
                  ? "To the Royal Presence of"
                  : isCelestial
                  ? "To the Starlight Presence of"
                  : isBotanical
                  ? "To the Cherished Presence of"
                  : isTwine
                  ? "In Trust to the Hands of"
                  : "To the Esteemed Presence of"}
              </p>
              <h3
                className={`text-4xl sm:text-5xl font-vintage-calligraphy tracking-wide py-1 ${
                  isCelestial
                    ? "text-cyan-100 drop-shadow-[0_2px_10px_rgba(56,189,248,0.35)]"
                    : isVictorian
                    ? "text-amber-100 drop-shadow-[0_2px_8px_rgba(240,200,120,0.4)]"
                    : isBotanical
                    ? "text-emerald-950"
                    : isTwine
                    ? "text-amber-950"
                    : "text-amber-950"
                }`}
              >
                {name ? name : "Dearest Beloved"}
              </h3>
              <div className="flex items-center justify-center gap-2 opacity-50">
                <span className="h-[1px] w-12 bg-current" />
                <span className="text-xs font-vintage-serif">
                  {isBotanical ? "⚘" : isCelestial ? "✧" : isVictorian ? "👑" : "❦"}
                </span>
                <span className="h-[1px] w-12 bg-current" />
              </div>
              <p
                className={`text-[11px] font-vintage-body italic tracking-widest ${
                  isCelestial
                    ? "text-cyan-200/75"
                    : isVictorian
                    ? "text-amber-200/75"
                    : isBotanical
                    ? "text-emerald-900/80"
                    : "text-amber-900/80"
                }`}
              >
                {isVictorian
                  ? "Bearing Imperial Words & Royal Remembrance"
                  : isCelestial
                  ? "Carrying Cosmic Words Across the Night"
                  : isBotanical
                  ? "Preserved with Wild Rose & Garden Memories"
                  : isTwine
                  ? "Inscribed on Frontier Parchment"
                  : "Containing Private Words & Remembrance"}
              </p>
            </div>

            {/* Bottom Seal Notice */}
            <div
              className={`relative z-20 flex justify-center items-center opacity-50 text-[7.5px] tracking-[0.3em] uppercase font-vintage-serif ${
                isCelestial
                  ? "text-cyan-200"
                  : isVictorian
                  ? "text-amber-200"
                  : isBotanical
                  ? "text-emerald-950"
                  : "text-amber-950"
              }`}
            >
              {isVictorian
                ? "ROYAL CHANCELLERY DESPATCH NO. 1890-R"
                : isCelestial
                ? "CELESTIAL FOLIO NO. 1888-ASTRO"
                : isBotanical
                ? "KEW HERBARIUM FOLIO NO. 1912-KB"
                : isTwine
                ? "OVERLAND WAYBILL NO. 1884-W"
                : "AEROMARITIME DESPATCH NO. 1924-A"}
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
            backgroundColor: isArtDeco
              ? "#12141a"
              : isVinyl
              ? "#602c0c"
              : isCyber
              ? "#041426"
              : isCelestial
              ? "#0c1424"
              : isVictorian
              ? "#450811"
              : isBotanical
              ? "#1d3324"
              : isTwine
              ? "#3a2012"
              : "#2b1418",
            borderColor: isArtDeco
              ? "#facc15"
              : isVinyl
              ? "#f59e0b"
              : isCyber
              ? "#06b6d4"
              : isCelestial
              ? "#38bdf8"
              : isVictorian
              ? "#fbbf24"
              : isBotanical
              ? "#34d399"
              : "#c59b48",
            boxShadow: isOpen ? "none" : "0 6px 20px -2px rgba(0,0,0,0.6)",
          }}
        >
          <div className="w-full h-full relative">
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: isCelestial
                  ? "radial-gradient(#38bdf8 1.5px, transparent 1.5px)"
                  : isVictorian
                  ? "radial-gradient(#ffd700 1.5px, transparent 1.5px)"
                  : isBotanical
                  ? "radial-gradient(#34d399 1.5px, transparent 1.5px)"
                  : "radial-gradient(#c59b48 1.5px, transparent 1.5px)",
                backgroundSize: "14px 14px",
              }}
            />
            <div
              className={`absolute inset-0 border-b-4 ${
                isCelestial
                  ? "border-cyan-400/60"
                  : isVictorian
                  ? "border-amber-400/70"
                  : isBotanical
                  ? "border-emerald-400/60"
                  : "border-amber-500/50"
              }`}
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
                <radialGradient id={`waxGrad-${seal.id}-${envelopeStyle}`} cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor={sealColors.grad1} />
                  <stop offset="50%" stopColor={sealColors.grad2} />
                  <stop offset="85%" stopColor={sealColors.grad3} />
                  <stop offset="100%" stopColor={sealColors.grad4} />
                </radialGradient>
                <linearGradient id={`goldRelief-${seal.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffd875" />
                  <stop offset="50%" stopColor="#c59b48" />
                  <stop offset="100%" stopColor="#755219" />
                </linearGradient>
              </defs>

              <path
                d="M50 4 C68 3, 85 14, 91 30 C97 45, 96 64, 88 77 C80 90, 63 97, 47 96 C30 95, 12 87, 6 71 C0 55, 3 36, 12 23 C21 10, 36 5, 50 4 Z"
                fill={`url(#waxGrad-${seal.id}-${envelopeStyle})`}
              />
              <circle cx="50" cy="50" r="32" stroke={sealColors.grad4} strokeWidth="2.5" fill={sealColors.inner} />
              <circle
                cx="50"
                cy="50"
                r="28"
                stroke={`url(#goldRelief-${seal.id})`}
                strokeWidth="1"
                strokeDasharray="3 2"
                fill="none"
                opacity="0.85"
              />
              <text
                x="50"
                y="58"
                textAnchor="middle"
                fontSize="24"
                fontFamily="Cinzel Decorative, serif"
                fill={`url(#goldRelief-${seal.id})`}
                style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.8))" }}
              >
                {sealColors.symbol}
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
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-950/95 border border-amber-600/40 text-amber-200 text-[9.5px] tracking-[0.2em] uppercase font-vintage-serif px-3 py-1 rounded-none shadow-xl pointer-events-none"
            >
              Break Wax Seal
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
