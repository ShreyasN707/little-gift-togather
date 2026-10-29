"use client";

import { useEffect, useState, use } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Send, Gift, Share2, Music, Volume2, ArrowRight } from "lucide-react";
import { themes, Theme } from "@/lib/themes";
import { EnvelopeCard } from "@/components/EnvelopeCard";
import { MemoryPuzzle } from "@/components/puzzles/MemoryPuzzle";
import { UnscramblePuzzle } from "@/components/puzzles/UnscramblePuzzle";
import { FindRosePuzzle } from "@/components/puzzles/FindRosePuzzle";
import { AudioToggle } from "@/components/AudioToggle";
import { sounds } from "@/lib/audio";

interface LetterState {
  name: string;
  theme: string;
  waxSeal?: string;
  puzzle: string;
  puzzleQuestion?: string;
  puzzleAnswer?: string;
  letterText?: string;
  fontChoice?: string;
  message?: string;
  image?: string | null;
  occasion?: string;
}

const DEFAULT_DEMO: LetterState = {
  name: "My Sweetheart",
  theme: "sakura-garden",
  waxSeal: "ruby-heart",
  puzzle: "memory",
  puzzleQuestion: "What lights up the room when you enter?",
  puzzleAnswer: "SMILE",
  letterText:
    "Every moment with you feels like a page from a storybook I never want to finish reading.\n\nThank you for filling ordinary days with magic, laughter, and so much warmth. You are my favorite person in the entire universe, and I am endlessly grateful for you.",
  fontChoice: "handwriting",
  message: "Forever and always yours ❤️",
  image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop",
  occasion: "Thinking of You",
};

export default function ViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams?.id;

  const [state, setState] = useState<LetterState | null>(null);
  const [scene, setScene] = useState<"intro" | "envelope" | "puzzle" | "reveal">("intro");
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [mounted, setMounted] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // 1. Check URL hash first (for instant offline / fallback data)
      if (window.location.hash.startsWith("#data=")) {
        try {
          const raw = window.location.hash.replace("#data=", "");
          const decoded = JSON.parse(decodeURIComponent(atob(raw)));
          setState(decoded);
          return;
        } catch (e) {
          console.error("Failed to parse hash state", e);
        }
      }

      // 2. Check local preview storage
      if (id === "preview") {
        const stored = localStorage.getItem("little_gift_preview");
        if (stored) {
          try {
            setState(JSON.parse(stored));
            return;
          } catch {}
        }
      }

      // 3. Fetch from bytebin or fallback to demo
      if (id && id !== "demo") {
        fetch(`https://bytebin.lucko.me/${id}`)
          .then((res) => {
            if (!res.ok) throw new Error("Not found");
            return res.json();
          })
          .then((data) => setState(data))
          .catch((e) => {
            console.warn("Could not load from bytebin, loading romantic demo fallback:", e);
            setState(DEFAULT_DEMO);
          });
      } else {
        setState(DEFAULT_DEMO);
      }
    }
  }, [id]);

  const currentTheme = themes.find((t) => t.id === state?.theme) || themes[0];

  const handleEnvelopeOpen = () => {
    setEnvelopeOpen(true);
    setTimeout(() => {
      setScene("puzzle");
    }, 1200);
  };

  const handlePuzzleComplete = () => {
    setScene("reveal");
  };

  const triggerHeartShower = () => {
    sounds.playPop();
    const newHearts = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: 10 + Math.random() * 80,
      y: 60 + Math.random() * 30,
    }));
    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 2500);
  };

  if (!state) {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-pink-400 mb-4"
        >
          <Heart className="w-12 h-12 fill-pink-300 text-pink-400" />
        </motion.div>
        <p className="font-cute text-pink-700 font-semibold text-lg animate-pulse">
          Unwrapping your surprise...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full relative overflow-x-hidden flex flex-col items-center justify-center p-4 selection:bg-pink-200 transition-colors duration-700 ${currentTheme.bgClass}`}
    >
      {/* Paper texture overlay */}
      <div className="fixed inset-0 paper-texture pointer-events-none z-0 opacity-40"></div>

      {/* Audio Controller */}
      <AudioToggle />

      {/* Floating Ambient Theme Particles */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                y: -60,
                x: (i * (windowDimensions.width / 16)) + (Math.random() * 40 - 20),
                opacity: 0,
                rotate: 0,
              }}
              animate={{
                y: windowDimensions.height + 60,
                opacity: [0, 0.7, 0.7, 0],
                rotate: 360,
              }}
              transition={{
                duration: 9 + (i % 5) * 2,
                repeat: Infinity,
                ease: "linear",
                delay: (i * 0.7) % 7,
              }}
              className="absolute text-xl sm:text-2xl drop-shadow-sm select-none"
            >
              {currentTheme.particleEmoji}
            </motion.div>
          ))}
        </div>
      )}

      {/* Shower Hearts */}
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 1, scale: 0.8, x: `${h.x}vw`, y: `${h.y}vh` }}
          animate={{ opacity: 0, scale: 1.8, y: `${h.y - 40}vh`, x: `${h.x + (Math.random() * 10 - 5)}vw` }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="fixed z-50 text-3xl pointer-events-none"
        >
          💖
        </motion.div>
      ))}

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center my-auto">
        <AnimatePresence mode="wait">
          {/* SCENE 1: INTRO */}
          {scene === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6 max-w-md mx-auto p-6"
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-full bg-pink-100/80 backdrop-blur-md border-2 border-pink-300 shadow-xl flex items-center justify-center mx-auto text-3xl"
                >
                  💌
                </motion.div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  className="absolute -top-1 -right-1 text-amber-400 text-lg"
                >
                  ✨
                </motion.div>
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-pink-200/60 text-pink-900 rounded-full text-xs font-bold uppercase tracking-wider">
                  {state.occasion || "Special Delivery"}
                </span>
                <h1 className="text-3xl sm:text-4xl font-serif-romantic font-bold text-gray-800 tracking-tight">
                  A Gift for You, {state.name}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-cute">
                  Someone who cares deeply about you crafted a little interactive love letter.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  sounds.playPop();
                  setScene("envelope");
                }}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-full font-bold text-base shadow-lg shadow-pink-300/50 hover:shadow-xl hover:from-pink-600 hover:to-rose-500 transition-all"
              >
                <span>Receive Letter</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {/* SCENE 2: THE ENVELOPE */}
          {scene === "envelope" && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center space-y-6 w-full"
            >
              <EnvelopeCard
                name={state.name}
                theme={currentTheme}
                waxSealId={state.waxSeal || "ruby-heart"}
                isOpen={envelopeOpen}
                onOpen={handleEnvelopeOpen}
                interactive={!envelopeOpen}
              />

              <div className="text-center space-y-2 max-w-sm">
                <p className="text-xs uppercase tracking-widest font-bold text-gray-500">
                  Step 1 of 2
                </p>
                <h2 className="text-xl font-cute font-bold text-gray-800">
                  Tap the wax seal to break it open
                </h2>
                <p className="text-xs text-gray-500">
                  A small puzzle awaits inside before the letter unfolds!
                </p>
              </div>
            </motion.div>
          )}

          {/* SCENE 3: THE PUZZLE */}
          {scene === "puzzle" && (
            <motion.div
              key="puzzle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center py-4"
            >
              {state.puzzle === "unscramble" ? (
                <UnscramblePuzzle
                  onComplete={handlePuzzleComplete}
                  question={state.puzzleQuestion}
                  answer={state.puzzleAnswer}
                />
              ) : state.puzzle === "find-rose" ? (
                <FindRosePuzzle onComplete={handlePuzzleComplete} />
              ) : (
                <MemoryPuzzle onComplete={handlePuzzleComplete} />
              )}
            </motion.div>
          )}

          {/* SCENE 4: THE REVEAL */}
          {scene === "reveal" && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-xl mx-auto flex flex-col items-center space-y-6 py-4"
            >
              {/* Romantic Stationery Letter Sheet */}
              <div
                className="w-full bg-[#fffefa] rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-pink-100/80 relative overflow-hidden cute-shadow-lg"
                style={{
                  boxShadow: "0 25px 50px -12px rgba(244, 114, 182, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)",
                }}
              >
                {/* Washi tape decoration at top */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-32 h-7 washi-tape rounded-sm shadow-sm rotate-1"></div>

                {/* Subtle paper texture */}
                <div className="absolute inset-0 paper-texture pointer-events-none opacity-30"></div>

                {/* Corner Floral watermark */}
                <div className="absolute -bottom-6 -right-6 text-7xl opacity-15 select-none pointer-events-none">
                  🌹
                </div>

                {/* Letter Header */}
                <div className="border-b border-pink-100 pb-4 mb-6 flex justify-between items-center relative z-10">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-pink-400">
                      From the Heart
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-handwriting font-bold text-pink-900">
                      Dearest {state.name},
                    </h3>
                  </div>
                  <div className="text-2xl">💌</div>
                </div>

                {/* Letter Body Text */}
                {state.letterText && (
                  <div className="mb-6 relative z-10">
                    <p
                      className={`text-gray-800 text-lg sm:text-xl leading-relaxed whitespace-pre-wrap ${
                        state.fontChoice === "cursive"
                          ? "font-cursive text-xl sm:text-2xl"
                          : state.fontChoice === "serif"
                          ? "font-serif-romantic text-base sm:text-lg"
                          : "font-handwriting text-2xl sm:text-3xl"
                      }`}
                    >
                      {state.letterText}
                    </p>
                  </div>
                )}

                {/* Attached Polaroid Photo / Image */}
                {state.image && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative z-10 my-6 flex justify-center"
                  >
                    <div className="polaroid-frame rounded-md max-w-sm w-full -rotate-1 hover:rotate-0 transition-transform duration-300">
                      <div className="w-full aspect-[4/3] rounded overflow-hidden bg-pink-50 relative">
                        <img
                          src={state.image}
                          alt="Special Memory"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="mt-3 text-center font-handwriting text-xl text-gray-700">
                        A memory to cherish forever ✨
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Secret ending message / P.S. */}
                {state.message && (
                  <div className="mt-6 pt-4 border-t border-pink-100/80 text-center relative z-10">
                    <p className="font-handwriting text-2xl sm:text-3xl text-pink-600 font-bold">
                      {state.message}
                    </p>
                  </div>
                )}

                {/* Signature seal */}
                <div className="mt-4 flex justify-end items-center gap-2 relative z-10">
                  <span className="text-xs font-cute text-gray-400">Sealed with love</span>
                  <div className="w-6 h-6 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center shadow-sm">
                    ❤️
                  </div>
                </div>
              </div>

              {/* Interactive Sweet Response Bar */}
              <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={triggerHeartShower}
                  className="px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-pink-300 text-pink-700 font-bold text-sm shadow-md hover:bg-pink-50 flex items-center gap-2"
                >
                  <span>Send Love Back</span>
                  <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                </motion.button>

                <a
                  href="/create"
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-md hover:from-pink-600 hover:to-rose-500 flex items-center gap-2"
                >
                  <span>Make Your Own Surprise</span>
                  <Sparkles className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <footer className="mt-auto py-4 relative z-10 text-center text-xs text-pink-900/50 font-medium">
        Made with tenderness • Little Gift Together
      </footer>
    </div>
  );
}
