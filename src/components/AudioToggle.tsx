"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { sounds } from "@/lib/audio";

export function AudioToggle({ autoStartPrompt = false }: { autoStartPrompt?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const toggle = () => {
    sounds.playPop();
    const active = sounds.toggleBgm((playing) => {
      setIsPlaying(playing);
    });
    setIsPlaying(active);
    setHasInteracted(true);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <button
        onClick={toggle}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all duration-300 shadow-sm ${
          isPlaying
            ? "bg-pink-500/90 text-white border-pink-400 shadow-pink-200 animate-pulse-gentle"
            : "bg-white/80 text-pink-900 border-pink-200 hover:bg-white hover:border-pink-300"
        }`}
        title="Toggle Music Box Melody"
      >
        <Music className={`w-3.5 h-3.5 ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
        <span>{isPlaying ? "Music Box Playing 🎵" : "Play Music 🎶"}</span>
        {isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-60" />}
      </button>
    </div>
  );
}
