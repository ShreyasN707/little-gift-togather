"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCw } from "lucide-react";
import { sounds, RadioStation } from "@/lib/audio";
import { vintageBadges, VintageBadge, LetterStyle } from "@/lib/themes";

interface RetroRadioLetterProps {
  name: string;
  letterText: string;
  fontChoice?: string;
  message?: string;
  image?: string | null;
  letterStyle?: LetterStyle;
  envelopeStyle?: string;
  selectedBadgeIds?: string[];
  interactive?: boolean;
}

// Organic locations so small box stamps stick on random places across the sleek radio bar
const STAMP_RANDOM_POSITIONS = [
  { className: "left-[19%] sm:left-[22%] -top-3.5 rotate-[-3.5deg]" },
  { className: "left-[43%] sm:left-[46%] -top-3.5 rotate-[3.5deg]" },
  { className: "right-[26%] sm:right-[30%] -top-3.5 rotate-[-2.5deg]" },
  { className: "left-[32%] sm:left-[35%] -bottom-3.5 rotate-[2.5deg]" },
  { className: "right-[11%] sm:right-[14%] -bottom-3.5 rotate-[-3deg]" },
];

export function RetroRadioLetter({
  name,
  letterText,
  fontChoice = "calligraphy",
  message,
  image,
  letterStyle,
  envelopeStyle = "vintage-airmail",
  selectedBadgeIds = ["keeper-of-heart", "eternal-rose", "first-class-love"],
  interactive = true,
}: RetroRadioLetterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [station, setStation] = useState<RadioStation>(sounds.getCurrentStation());
  const [activeTooltip, setActiveTooltip] = useState<VintageBadge | null>(null);

  useEffect(() => {
    setIsPlaying(sounds.getIsPlaying());
    const unsubscribe = sounds.subscribeStation((playing, currStation) => {
      setIsPlaying(playing);
      setStation(currStation);
    });
    return unsubscribe;
  }, []);

  const handleTogglePlay = () => {
    const active = sounds.toggleRadio();
    setIsPlaying(active);
  };

  const handleNextStation = () => {
    sounds.nextStation();
    setStation(sounds.getCurrentStation());
  };

  const activeBadges = vintageBadges.filter((b) => selectedBadgeIds.includes(b.id));

  // Determine active theme configuration based on envelopeStyle & letterStyle
  const isVictorian = envelopeStyle === "victorian-gilded" || letterStyle?.id === "royal-decree";
  const isCelestial = envelopeStyle === "celestial-noir" || letterStyle?.id === "celestial-parchment";
  const isBotanical = envelopeStyle === "botanical-herbarium" || letterStyle?.id === "love-poem-folio";
  const isTypewriter = letterStyle?.id === "antique-typewriter";
  const isTwine = envelopeStyle === "parchment-twine" || letterStyle?.id === "aged-parchment";

  const theme = isVictorian
    ? {
        id: "victorian",
        name: "Victorian Royal Phonograph",
        chassisBg: "bg-gradient-to-r from-[#1c0409] via-[#330811] to-[#1c0409]",
        chassisBorder: "border-[#d4af37]",
        accentGlow: "rgba(212, 175, 55, 0.45)",
        dialBg: "bg-[#0f0205] border-[#d4af37]/60 text-[#fcedc7]",
        dialRuler: "text-amber-300/70 font-vintage-heading tracking-widest",
        needleColor: "#fbbf24",
        screwColor: "bg-gradient-to-br from-amber-300 to-yellow-600 border-amber-900",
        chassisPlate: "bg-[#25050c] border-[#d4af37]/70 text-[#f3e5ab] text-[7.5px] font-vintage-heading tracking-widest",
        chassisPlateText: "ROYAL OPERA BROADCAST • 1890",
        soundBtnBg:
          "bg-gradient-to-r from-[#8b1528] via-[#a81c34] to-[#781020] text-amber-100 border-[#f3e5ab]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]",
        soundBtnPlayLabel: "♫ PLAY WALTZ",
        soundBtnPauseLabel: "❚❚ SILENCE",
        stereoLed: "bg-amber-400 shadow-[0_0_8px_#fbbf24]",
        tunerBtnBg: "bg-[#180307] text-amber-200 border-amber-500/50 hover:bg-[#2b060e]",
      }
    : isCelestial
    ? {
        id: "celestial",
        name: "Midnight Observatory Shortwave",
        chassisBg: "bg-gradient-to-r from-[#050811] via-[#0c1322] to-[#050811]",
        chassisBorder: "border-cyan-400/60",
        accentGlow: "rgba(34, 211, 238, 0.45)",
        dialBg: "bg-[#02050b] border-cyan-500/50 text-cyan-200",
        dialRuler: "text-cyan-300/70 font-mono tracking-widest",
        needleColor: "#38bdf8",
        screwColor: "bg-gradient-to-br from-cyan-200 to-blue-400 border-cyan-800",
        chassisPlate: "bg-[#08101e] border-cyan-500/60 text-cyan-300 text-[7.5px] font-mono tracking-widest",
        chassisPlateText: "CELESTIAL TRANSIT • FREQ-98.4",
        soundBtnBg:
          "bg-gradient-to-r from-[#0369a1] via-[#0284c7] to-[#075985] text-cyan-50 border-cyan-300/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]",
        soundBtnPlayLabel: "✧ STELLAR RADIO",
        soundBtnPauseLabel: "❚❚ MUTED",
        stereoLed: "bg-cyan-400 shadow-[0_0_8px_#22d3ee]",
        tunerBtnBg: "bg-[#060c18] text-cyan-200 border-cyan-500/50 hover:bg-[#0c182f]",
      }
    : isBotanical
    ? {
        id: "botanical",
        name: "Botanical Conservatory Transceiver",
        chassisBg: "bg-gradient-to-r from-[#0b170f] via-[#16271c] to-[#0b170f]",
        chassisBorder: "border-[#4e825a]",
        accentGlow: "rgba(52, 211, 153, 0.4)",
        dialBg: "bg-[#060e09] border-emerald-600/50 text-emerald-200",
        dialRuler: "text-emerald-300/70 font-vintage-serif tracking-widest",
        needleColor: "#34d399",
        screwColor: "bg-gradient-to-br from-emerald-200 to-amber-700 border-emerald-950",
        chassisPlate: "bg-[#102016] border-emerald-600/60 text-emerald-200 text-[7.5px] font-vintage-serif tracking-widest",
        chassisPlateText: "ROYAL BOTANIC WIRELESS • 1912",
        soundBtnBg:
          "bg-gradient-to-r from-[#235836] via-[#2f6f46] to-[#1c482c] text-emerald-50 border-emerald-300/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]",
        soundBtnPlayLabel: "🌿 HERBARIUM FM",
        soundBtnPauseLabel: "❚❚ PAUSE",
        stereoLed: "bg-emerald-400 shadow-[0_0_8px_#34d399]",
        tunerBtnBg: "bg-[#08130d] text-emerald-200 border-emerald-500/50 hover:bg-[#122419]",
      }
    : isTypewriter
    ? {
        id: "typewriter",
        name: "1940s Field Dispatch Receiver",
        chassisBg: "bg-gradient-to-r from-[#171917] via-[#242622] to-[#171917]",
        chassisBorder: "border-stone-500",
        accentGlow: "rgba(249, 115, 22, 0.35)",
        dialBg: "bg-[#0e0f0d] border-stone-600/60 text-amber-100",
        dialRuler: "text-amber-400/70 font-mono tracking-widest",
        needleColor: "#f97316",
        screwColor: "bg-gradient-to-br from-stone-300 to-stone-500 border-stone-700",
        chassisPlate: "bg-[#141513] border-stone-400 text-stone-200 text-[7.5px] font-mono tracking-widest",
        chassisPlateText: "SIGNAL CORPS MODEL RT-42",
        soundBtnBg:
          "bg-gradient-to-r from-[#2b2b29] via-[#3d3d3a] to-[#242422] text-amber-200 border-stone-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]",
        soundBtnPlayLabel: "⌨ TRANSMIT ♫",
        soundBtnPauseLabel: "❚❚ STOP",
        stereoLed: "bg-amber-400 shadow-[0_0_8px_#fbbf24]",
        tunerBtnBg: "bg-[#0f100e] text-stone-300 border-stone-500/50 hover:bg-[#1c1d1a]",
      }
    : isTwine
    ? {
        id: "twine",
        name: "Rustic Walnut Shortwave Tuner",
        chassisBg: "bg-gradient-to-r from-[#201108] via-[#321a0d] to-[#201108]",
        chassisBorder: "border-[#966336]",
        accentGlow: "rgba(217, 119, 6, 0.4)",
        dialBg: "bg-[#110803] border-amber-700/60 text-amber-100",
        dialRuler: "text-amber-300/70 font-mono tracking-widest",
        needleColor: "#f59e0b",
        screwColor: "bg-gradient-to-br from-amber-300 to-yellow-700 border-amber-950",
        chassisPlate: "bg-[#220f06] border-amber-700/70 text-amber-300 text-[7.5px] font-vintage-serif tracking-widest",
        chassisPlateText: "WESTERN DISPATCH TELEGRAPH • 1884",
        soundBtnBg:
          "bg-gradient-to-r from-[#7c3d18] via-[#944a1e] to-[#693314] text-amber-100 border-amber-400/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]",
        soundBtnPlayLabel: "⚲ SHORTWAVE ♫",
        soundBtnPauseLabel: "❚❚ OFF",
        stereoLed: "bg-amber-400 shadow-[0_0_8px_#f59e0b]",
        tunerBtnBg: "bg-[#130904] text-amber-200 border-amber-700/50 hover:bg-[#201007]",
      }
    : {
        // 1924 Airmail Default
        id: "airmail",
        name: "1924 Transatlantic Aeromaritime Tuner",
        chassisBg: "bg-gradient-to-r from-[#171411] via-[#261f18] to-[#171411]",
        chassisBorder: "border-[#b8623b]",
        accentGlow: "rgba(234, 88, 12, 0.4)",
        dialBg: "bg-[#0e0c09] border-amber-700/60 text-amber-100",
        dialRuler: "text-amber-300/70 font-mono tracking-widest",
        needleColor: "#ea580c",
        screwColor: "bg-gradient-to-br from-amber-200 to-amber-500 border-amber-800",
        chassisPlate: "bg-[#1d1610] border-red-700/70 text-amber-200 text-[7.5px] font-mono tracking-widest",
        chassisPlateText: "IMPERIAL AIRWAYS • GPO WIRELESS 1924",
        soundBtnBg:
          "bg-gradient-to-r from-[#991b1b] via-[#b91c1c] to-[#7f1d1d] text-amber-50 border-amber-400/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]",
        soundBtnPlayLabel: "✈ AIRWAVE ♫",
        soundBtnPauseLabel: "❚❚ MUTE",
        stereoLed: "bg-amber-400 shadow-[0_0_8px_#f97316]",
        tunerBtnBg: "bg-[#120f0b] text-amber-200 border-amber-700/50 hover:bg-[#1e1913]",
      };

  return (
    <div className="w-full max-w-5xl mx-auto my-5 select-none flex flex-col items-center rounded-none relative">
      {/* ========================================================================= */}
      {/* 1. SLENDER, SLIM HORIZONTAL RADIO BAR (SINGLE SLEEK HARDWARE ROW)          */}
      {/* ========================================================================= */}
      <div className="w-full relative z-30">
        {/* Left Cast Metal End-Plate */}
        <div className="absolute top-0 bottom-0 -left-2 sm:-left-3.5 w-2 sm:w-3.5 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-900 border-y-2 border-l-2 border-black/80 flex flex-col justify-between py-1.5 items-center shadow-2xl pointer-events-none rounded-none">
          <div className="w-1.5 h-1.5 bg-amber-400 border border-amber-900 rounded-none shadow-xs" />
          <div className="w-0.5 sm:w-1 h-3 bg-black/80 rounded-none" />
          <div className="w-1.5 h-1.5 bg-amber-400 border border-amber-900 rounded-none shadow-xs" />
        </div>

        {/* Right Cast Metal End-Plate */}
        <div className="absolute top-0 bottom-0 -right-2 sm:-right-3.5 w-2 sm:w-3.5 bg-gradient-to-r from-stone-900 via-stone-700 to-stone-800 border-y-2 border-r-2 border-black/80 flex flex-col justify-between py-1.5 items-center shadow-2xl pointer-events-none rounded-none">
          <div className="w-1.5 h-1.5 bg-amber-400 border border-amber-900 rounded-none shadow-xs" />
          <div className="w-0.5 sm:w-1 h-3 bg-black/80 rounded-none" />
          <div className="w-1.5 h-1.5 bg-amber-400 border border-amber-900 rounded-none shadow-xs" />
        </div>

        {/* The Sleek, Slim Horizontal Radio Bar (Height ~36px) */}
        <div
          className={`w-full relative rounded-none border-2 ${theme.chassisBorder} ${theme.chassisBg} text-white px-3 sm:px-5 py-1.5 transition-colors duration-500`}
          style={{
            boxShadow: `0 20px 35px -8px rgba(0,0,0,0.92), 0 8px 16px -4px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.25), 0 0 20px ${theme.accentGlow}`,
          }}
        >
          {/* Telescoping Antenna Hint (Top Right Metallic Ridge) */}
          <div className="absolute -top-1.5 right-12 w-28 h-1 bg-gradient-to-r from-amber-400/60 via-amber-200/90 to-amber-500/60 border border-black/80 rounded-none shadow-xs pointer-events-none" />

          {/* Sharp Square Brass Rivet Screws in 4 Corners */}
          <div className={`absolute top-1 left-1.5 w-2 h-2 rounded-none border border-black/80 ${theme.screwColor} flex items-center justify-center shadow-xs`}>
            <div className="w-1.5 h-px bg-black/70" />
          </div>
          <div className={`absolute top-1 right-1.5 w-2 h-2 rounded-none border border-black/80 ${theme.screwColor} flex items-center justify-center shadow-xs`}>
            <div className="w-1.5 h-px bg-black/70" />
          </div>
          <div className={`absolute bottom-1 left-1.5 w-2 h-2 rounded-none border border-black/80 ${theme.screwColor} flex items-center justify-center shadow-xs`}>
            <div className="w-1.5 h-px bg-black/70" />
          </div>
          <div className={`absolute bottom-1 right-1.5 w-2 h-2 rounded-none border border-black/80 ${theme.screwColor} flex items-center justify-center shadow-xs`}>
            <div className="w-1.5 h-px bg-black/70" />
          </div>

          {/* =================================================================== */}
          {/* SINGLE SLENDER HORIZONTAL ROW: ALL CONTROLS & GLASS TUNING SCALE     */}
          {/* =================================================================== */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap lg:flex-nowrap">
            {/* LEFT: SOUND PLAY/PAUSE BUTTON & AUDIO EQUALIZER */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Tactile Theme Sound Button with Sharp Corners */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleTogglePlay}
                className={`h-7 sm:h-8 px-3 rounded-none flex items-center justify-center gap-1.5 font-vintage-serif text-[10px] sm:text-[11px] font-bold tracking-wider uppercase border shadow-md active:translate-y-0.5 transition-all cursor-pointer ${theme.soundBtnBg}`}
                title="Toggle Retro Radio Audio"
              >
                <span>{isPlaying ? theme.soundBtnPauseLabel : theme.soundBtnPlayLabel}</span>
              </motion.button>

              {/* Slender Phosphor Equalizer Bars (Sharp Corners) */}
              <div className="flex items-end gap-0.5 h-4 px-1.5 py-0.5 bg-black/70 rounded-none border border-white/10">
                {Array.from({ length: 7 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-1 rounded-none"
                    style={{ backgroundColor: theme.needleColor }}
                    animate={{
                      height: isPlaying
                        ? [2, 3 + Math.sin(i * 1.1) * 7 + Math.random() * 4, 2]
                        : 2,
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.3 + (i % 3) * 0.1,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Rotary Tune Button */}
              <button
                onClick={handleNextStation}
                className={`h-7 sm:h-8 px-2 rounded-none border text-[9.5px] font-mono uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${theme.tunerBtnBg}`}
                title="Tune to next radio frequency"
              >
                <RotateCw className="w-2.5 h-2.5" />
                <span className="hidden sm:inline">TUNE</span>
              </button>
            </div>

            {/* CENTER: SLENDER HORIZONTAL FREQUENCY SCALE (GLASS DIAL) */}
            <div
              className={`flex-1 min-w-[180px] h-7 sm:h-8 px-2.5 rounded-none border flex items-center justify-between gap-2 shadow-inner relative overflow-hidden ${theme.dialBg}`}
            >
              {/* Frequency readout */}
              <div className="flex items-center gap-1.5 text-[8.5px] font-mono tracking-wider shrink-0 z-10">
                <span className="px-1 py-0.2 rounded-none bg-black/80 border border-current font-bold text-amber-200">
                  {station.frequency}
                </span>
                <span className="font-vintage-serif font-bold text-[11px] truncate max-w-[110px] sm:max-w-[180px] text-stone-200">
                  {station.name}
                </span>
              </div>

              {/* Horizontal Radio Scale Ruler (Sharp ticks) */}
              <div className={`hidden sm:flex flex-1 items-center justify-around text-[7.5px] opacity-60 px-2 border-x border-current/25 ${theme.dialRuler}`}>
                <span>88</span>
                <span>•</span>
                <span>94</span>
                <span>•</span>
                <span className="font-bold underline">98</span>
                <span>•</span>
                <span>102</span>
                <span>•</span>
                <span>108</span>
              </div>

              {/* Sliding Illuminated Needle */}
              <motion.div
                className="absolute top-0 bottom-0 w-0.5 pointer-events-none"
                style={{
                  backgroundColor: theme.needleColor,
                  boxShadow: `0 0 8px ${theme.needleColor}`,
                }}
                animate={{
                  left: isPlaying ? ["25%", "68%", "45%", "80%", "30%"] : "50%",
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Active Stereo Signal Status with Sharp LED */}
              <div className="flex items-center gap-1 shrink-0 text-[7.5px] font-mono z-10">
                <span
                  className={`w-1.5 h-1.5 rounded-none ${
                    isPlaying ? theme.stereoLed : "bg-red-800"
                  }`}
                />
                <span className="hidden md:inline">{isPlaying ? "STEREO" : "OFF"}</span>
              </div>
            </div>

            {/* RIGHT: STAMPED MODEL PLATE & DETAILS */}
            <div className="hidden xl:flex items-center gap-2 shrink-0">
              <div className={`px-2 py-0.5 border rounded-none ${theme.chassisPlate}`}>
                {theme.chassisPlateText}
              </div>

              {/* Acoustic Grille Slits */}
              <div className="flex items-center gap-0.5 px-1 py-0.5 bg-black/50 border border-white/10 rounded-none">
                <span className="w-0.5 h-3 bg-black/80 border-l border-white/20" />
                <span className="w-0.5 h-3 bg-black/80 border-l border-white/20" />
                <span className="w-0.5 h-3 bg-black/80 border-l border-white/20" />
              </div>

              <div className="text-[7px] font-mono text-stone-400/70 tracking-tighter">
                VOL [▮▮▮▯]
              </div>
            </div>
          </div>

          {/* =================================================================== */}
          {/* SMALL BOX POSTAGE STAMPS STUCK ON RANDOM PLACES ON THE RADIO BAR    */}
          {/* =================================================================== */}
          {activeBadges.map((badge, idx) => {
            const pos = STAMP_RANDOM_POSITIONS[idx % STAMP_RANDOM_POSITIONS.length];
            const isSelected = activeTooltip?.id === badge.id;

            return (
              <div key={badge.id} className={`absolute z-40 ${pos.className}`}>
                <motion.button
                  whileHover={{ scale: 1.18, zIndex: 50, rotate: 0 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    sounds.playPop();
                    setActiveTooltip(isSelected ? null : badge);
                  }}
                  className={`w-7 sm:w-8 h-8 sm:h-9 rounded-none border border-dashed border-amber-200/90 bg-gradient-to-br ${badge.color} text-white flex flex-col items-center justify-between p-1 cursor-pointer select-none transition-transform`}
                  style={{
                    boxShadow: "0 3px 8px rgba(0,0,0,0.8), inset 0 0 2px rgba(255,255,255,0.4)",
                  }}
                  title={`Stamp: ${badge.name} • ${badge.title}`}
                >
                  {/* Stamp Denomination Header */}
                  <div className="w-full flex justify-between items-center text-[5px] font-mono tracking-tighter opacity-80 uppercase leading-none">
                    <span>POST</span>
                    <span>10¢</span>
                  </div>

                  {/* Stamp Emblem Symbol */}
                  <span className="text-xs sm:text-sm leading-none drop-shadow-xs my-auto">
                    {badge.symbol}
                  </span>

                  {/* Stamp Fine Label */}
                  <span className="text-[5px] sm:text-[5.5px] font-mono font-bold tracking-tighter uppercase truncate w-full text-center opacity-90 leading-none">
                    {badge.name.split(" ")[0]}
                  </span>
                </motion.button>

                {/* Sharp Box Tooltip */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-stone-950 border border-amber-500 text-[#f6eedb] rounded-none text-center shadow-2xl font-sans"
                    >
                      <span className="block text-[8px] font-vintage-serif uppercase tracking-wider text-amber-400 font-bold">
                        {badge.title}
                      </span>
                      <h6 className="text-xs font-bold text-white my-0.5">{badge.name}</h6>
                      <p className="text-[9.5px] text-stone-300 leading-tight">
                        {badge.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Recessed Paper Feed Channel on Underside of Radio */}
          <div className="absolute -bottom-1.5 left-0 right-0 h-1.5 bg-black border-t border-stone-900 pointer-events-none z-10 shadow-inner" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PHYSICAL SEPARATION GAP & HEAVY BRASS DOCUMENT CLAMPS                   */}
      {/* ========================================================================= */}
      <div className="w-full relative h-6 sm:h-7 pointer-events-none z-20">
        {/* Left Heavy Brass Document Suspension Clamp */}
        <div
          className="absolute -top-1.5 left-[16%] sm:left-[20%] w-7 sm:w-8 h-8 sm:h-9 rounded-none shadow-[0_6px_12px_rgba(0,0,0,0.85)] flex flex-col items-center justify-between py-0.5 pointer-events-auto cursor-pointer"
          style={{
            background: "linear-gradient(180deg, #ffd875 0%, #c59b48 50%, #6e4b1a 100%)",
            border: "2px solid #3d2305",
          }}
          title="Heavy Brass Document Clamp"
        >
          {/* Top Anchor Bolt on Radio */}
          <div className="w-2.5 h-2.5 bg-amber-200 border border-amber-950 rounded-none flex items-center justify-center shadow-xs">
            <div className="w-1.5 h-px bg-amber-950" />
          </div>

          {/* Lower Jaw Gripping Paper */}
          <div className="w-full h-1.5 bg-amber-950 border-t border-amber-300/80 shadow-xs" />
        </div>

        {/* Right Heavy Brass Document Suspension Clamp */}
        <div
          className="absolute -top-1.5 right-[16%] sm:right-[20%] w-7 sm:w-8 h-8 sm:h-9 rounded-none shadow-[0_6px_12px_rgba(0,0,0,0.85)] flex flex-col items-center justify-between py-0.5 pointer-events-auto cursor-pointer"
          style={{
            background: "linear-gradient(180deg, #ffd875 0%, #c59b48 50%, #6e4b1a 100%)",
            border: "2px solid #3d2305",
          }}
          title="Heavy Brass Document Clamp"
        >
          {/* Top Anchor Bolt on Radio */}
          <div className="w-2.5 h-2.5 bg-amber-200 border border-amber-950 rounded-none flex items-center justify-center shadow-xs">
            <div className="w-1.5 h-px bg-amber-950" />
          </div>

          {/* Lower Jaw Gripping Paper */}
          <div className="w-full h-1.5 bg-amber-950 border-t border-amber-300/80 shadow-xs" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ATTACHED WIDE PARCHMENT LETTER (SEPARATE SHEET HANGING UNDERNEATH)     */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className={`w-[95%] sm:w-[96%] mx-auto relative z-10 pt-8 pb-10 px-6 sm:px-12 md:px-16 rounded-none shadow-2xl border-2 overflow-visible ${
          letterStyle
            ? `${letterStyle.paperBg} ${letterStyle.paperClass}`
            : "aged-parchment border-amber-900/40 text-[#28160c]"
        }`}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 10px 20px -5px rgba(0, 0, 0, 0.35)",
        }}
      >
        {/* Reinforced Top Document Binder Strip */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-black/10 border-b border-dashed border-current/25 flex items-center justify-between px-16 sm:px-24 pointer-events-none">
          {/* Punched Eyelets where clamps grasp */}
          <div className="w-2 h-2 rounded-full border border-current/50 bg-black/30 shadow-inner" />
          <div className="w-2 h-2 rounded-full border border-current/50 bg-black/30 shadow-inner" />
        </div>

        {/* Ambient Drop Shadow falling from the Radio Bar onto the top margin of the paper */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/35 via-black/10 to-transparent pointer-events-none" />

        {/* Wide Landscape Header Banner */}
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-current/20 relative z-10 pt-2">
          <div className="flex items-center gap-2 opacity-75">
            <span className="text-lg">{letterStyle ? letterStyle.crest : "⚜"}</span>
            <span className="text-[8.5px] tracking-[0.25em] uppercase font-vintage-serif font-bold">
              EX CORDE • ARCHIVAL FOLIO NO. 1924-B
            </span>
          </div>

          <div className="text-[9.5px] font-vintage-body italic opacity-70">
            Penned & broadcast with affection for {name || "My Beloved"}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* CONTENT LAYOUT + PHOTO TAPED OVER THE GAP AND ONTO THE LETTER         */}
        {/* ===================================================================== */}
        <div className="relative z-10">
          {/* THE PHOTO: PHYSICALLY TAPED TO RADIO BAR AND OVERLAPPING LETTER */}
          {image && (
            <div className="float-none md:float-right md:ml-6 mb-4 md:-mt-16 flex flex-col items-center z-40 relative">
              <div
                className="relative p-2 pb-5 bg-[#faf8f3] border border-stone-400 rounded-none shadow-2xl max-w-[210px] sm:max-w-[230px] w-full transform -rotate-2 hover:rotate-0 transition-transform duration-300"
                style={{
                  boxShadow: "0 18px 36px rgba(0,0,0,0.45), 0 6px 12px rgba(0,0,0,0.25)",
                }}
              >
                {/* Authentic Translucent Masking Tape Strip Taped Over Radio Edge */}
                <div
                  className="vintage-tape-strip absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-5 rounded-none z-50 pointer-events-none -rotate-1"
                  title="Taped to Radio Chassis"
                />

                {/* 4 Antique Brass Photo Corners (Sharp Angles) */}
                <div className="antique-photo-corner-tl" />
                <div className="antique-photo-corner-tr" />
                <div className="antique-photo-corner-bl" />
                <div className="antique-photo-corner-br" />

                {/* The Photograph */}
                <div className="w-full aspect-[4/3] overflow-hidden bg-stone-100 rounded-none border border-stone-300">
                  <img
                    src={image}
                    alt="Keepsake photograph"
                    className="w-full h-full object-cover filter contrast-[1.05] sepia-[0.22] rounded-none"
                  />
                </div>

                {/* Handwritten Photo Caption */}
                <p className="mt-1.5 text-center font-vintage-calligraphy text-base sm:text-lg text-stone-800 leading-tight">
                  Preserved in memory • ❦
                </p>
              </div>
            </div>
          )}

          {/* MAIN LETTER TEXT (REFINED DECREASED TEXT SIZE) */}
          <div className="space-y-4">
            {/* Salutation - Refined font size */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-vintage-calligraphy drop-shadow-xs">
                Dearest {name || "Beloved"},
              </h3>
            </div>

            {/* Letter Body - Intimate handwriting on ruled lines */}
            {letterText && (
              <div className="antique-ruled-lines">
                <p
                  className={`whitespace-pre-wrap leading-relaxed ${
                    fontChoice === "serif"
                      ? "font-vintage-body italic text-sm sm:text-base leading-loose"
                      : fontChoice === "script"
                      ? "font-vintage-script text-base sm:text-lg leading-loose"
                      : "font-vintage-calligraphy text-lg sm:text-xl leading-loose"
                  }`}
                  style={{ color: letterStyle?.textColor || "#26150b" }}
                >
                  {letterText}
                </p>
              </div>
            )}

            {/* Valediction / P.S. */}
            {message && (
              <div className="pt-3 border-t border-current/20 clear-both">
                <p className="font-vintage-calligraphy text-xl sm:text-2xl">
                  {message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Clear any floats */}
        <div className="clear-both" />

        {/* Horizontally Long Footer Watermark */}
        <div className="mt-7 pt-3 flex justify-between items-end relative z-10 border-t border-dashed border-current/20">
          <div className="text-[8.5px] font-vintage-serif tracking-widest uppercase opacity-60">
            RADIO DISPATCH • SPECIAL COMMENDATION
          </div>
          <div className="flex items-center gap-2 opacity-85">
            <span className="text-[9px] font-vintage-serif uppercase tracking-widest">
              SEALED WITH MELODY
            </span>
            <div className="w-5 h-5 rounded-none bg-red-950 border border-amber-500/60 flex items-center justify-center text-amber-300 text-xs shadow-inner">
              ❦
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
