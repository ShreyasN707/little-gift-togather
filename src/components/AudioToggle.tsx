"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { sounds } from "@/lib/audio";

export function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggle = () => {
    sounds.playPop();
    const active = sounds.toggleBgm((playing) => {
      setIsPlaying(playing);
    });
    setIsPlaying(active);
  };

  return (
    <div className="fixed top-5 right-5 z-50">
      <button
        onClick={toggle}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide border transition-all duration-200 shadow-editorial-sm backdrop-blur-md ${
          isPlaying
            ? "bg-stone-900 text-stone-100 border-stone-900"
            : "bg-white/90 text-stone-700 border-stone-200/90 hover:border-stone-300 hover:text-stone-900"
        }`}
        title="Toggle subtle acoustic ambient audio"
      >
        {isPlaying ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Audio On</span>
            <Volume2 className="w-3.5 h-3.5" />
          </>
        ) : (
          <>
            <span>Sound</span>
            <VolumeX className="w-3.5 h-3.5 opacity-60" />
          </>
        )}
      </button>
    </div>
  );
}
