"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Radio, RotateCw, Play, Pause, Disc } from "lucide-react";
import { sounds, RADIO_STATIONS, RadioStation } from "@/lib/audio";

export function VintageRadio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [station, setStation] = useState<RadioStation>(sounds.getCurrentStation());

  useEffect(() => {
    setIsPlaying(sounds.getIsPlaying());
    const unsubscribe = sounds.subscribeStation((playing, currStation) => {
      setIsPlaying(playing);
      setStation(currStation);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    sounds.playPop();
    const playing = sounds.toggleRadio();
    setIsPlaying(playing);
  };

  const handleNextStation = () => {
    sounds.nextStation();
    setStation(sounds.getCurrentStation());
  };

  return (
    <div className="w-full my-6 select-none">
      {/* 1930s Tabletop Radio Body */}
      <div className="relative rounded-lg p-4 sm:p-5 border-2 border-[#5c3a21] shadow-2xl overflow-hidden bg-gradient-to-b from-[#3a2213] via-[#2a170c] to-[#1a0e07]">
        {/* Wood grain overlay */}
        <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(90deg,#000_0px,#000_1px,transparent_1px,transparent_4px)] pointer-events-none" />

        {/* Brass corner brackets */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-500/80 pointer-events-none" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-500/80 pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-500/80 pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-500/80 pointer-events-none" />

        {/* Radio Header Label */}
        <div className="flex items-center justify-between border-b border-amber-900/50 pb-2 mb-3 text-amber-200/80">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-vintage-serif font-bold text-amber-300">
              PHILCO WIRELESS RECEIVER • MOD. 1928
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying ? "bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" : "bg-red-800"
              }`}
            />
            <span className="text-[9px] font-mono text-amber-400/90 tracking-wider">
              {isPlaying ? "RECEIVING" : "STANDBY"}
            </span>
          </div>
        </div>

        {/* Center Display: Glowing Warm Amber Frequency Dial & Speaker Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Glowing Tuning Dial */}
          <div className="sm:col-span-7 bg-[#120a05] border border-amber-700/60 rounded p-3 relative overflow-hidden shadow-inner">
            {/* Warm Amber Tube Glow */}
            <div
              className={`absolute inset-0 bg-radial from-amber-600/25 via-transparent to-transparent pointer-events-none transition-opacity duration-700 ${
                isPlaying ? "opacity-100" : "opacity-30"
              }`}
            />

            <div className="relative z-10 flex flex-col justify-between h-full space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono text-amber-400/90 border-b border-amber-900/60 pb-1">
                <span>FREQUENCY</span>
                <span className="font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-700/40">
                  {station.frequency}
                </span>
              </div>

              <div className="py-1">
                <h5 className="font-vintage-serif font-bold text-amber-100 text-sm tracking-wide">
                  {station.name}
                </h5>
                <p className="text-[10px] font-vintage-body italic text-amber-300/70">
                  {station.genre}
                </p>
              </div>

              {/* Tuning meter scale */}
              <div className="flex items-center justify-between text-[8px] font-mono text-amber-500/60 pt-1 border-t border-amber-900/40">
                <span>550</span>
                <span>•</span>
                <span>700</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">▲</span>
                <span>•</span>
                <span>1200</span>
                <span>•</span>
                <span>1600</span>
              </div>
            </div>
          </div>

          {/* Controls & Mechanical Dials */}
          <div className="sm:col-span-5 flex flex-col justify-between gap-2">
            {/* Brass Play/Stop Knob */}
            <button
              onClick={handleToggle}
              className={`w-full py-2.5 px-3 rounded flex items-center justify-center gap-2 border font-vintage-serif text-xs uppercase tracking-widest font-bold shadow-lg transition-all cursor-pointer ${
                isPlaying
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-amber-50 border-amber-400 shadow-amber-900/50"
                  : "bg-gradient-to-r from-amber-950 via-[#3a2012] to-amber-950 text-amber-300 border-amber-800/80 hover:border-amber-600"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-100 fill-current" />
                  <span>Mute Audio</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  <span>Play Radio ♫</span>
                </>
              )}
            </button>

            {/* Tuning Knob (Switch Station) */}
            <button
              onClick={handleNextStation}
              className="w-full py-2 px-3 rounded bg-[#1f120a] hover:bg-[#2b190e] border border-amber-800/60 text-amber-300/90 text-[10px] font-vintage-serif uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
              title="Tune to next vintage station"
            >
              <RotateCw className="w-3 h-3 text-amber-400" />
              <span>Tune Frequency</span>
            </button>
          </div>
        </div>

        {/* Speaker Acoustic Wave Display when playing */}
        {isPlaying && (
          <div className="mt-3 pt-2 border-t border-amber-900/40 flex items-center justify-center gap-1.5 opacity-70">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.span
                key={i}
                className="w-1 bg-amber-400/80 rounded-full"
                animate={{
                  height: [4, 8 + Math.sin(i * 0.8) * 10 + Math.random() * 8, 4],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6 + (i % 4) * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
