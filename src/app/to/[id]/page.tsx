"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { themes, letterStyles } from "@/lib/themes";
import { EnvelopeCard } from "@/components/EnvelopeCard";
import { MemoryPuzzle } from "@/components/puzzles/MemoryPuzzle";
import { UnscramblePuzzle } from "@/components/puzzles/UnscramblePuzzle";
import { FindRosePuzzle } from "@/components/puzzles/FindRosePuzzle";
import { RetroRadioLetter } from "@/components/RetroRadioLetter";
import { AudioToggle } from "@/components/AudioToggle";
import { sounds } from "@/lib/audio";

interface LetterState {
  name: string;
  theme: string;
  envelopeStyle?: string;
  letterStyle?: string;
  waxSeal?: string;
  selectedBadges?: string[];
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
  name: "Eleanor",
  theme: "linen-natural",
  envelopeStyle: "vintage-airmail",
  letterStyle: "aged-parchment",
  waxSeal: "burgundy-monogram",
  selectedBadges: ["keeper-of-heart", "eternal-rose", "first-class-love"],
  puzzle: "memory",
  puzzleQuestion: "Our favorite promise to keep:",
  puzzleAnswer: "ALWAYS",
  letterText:
    "I made this mixtape and penned these lines thinking of you.\n\nPress play on the radio above, let the music fill the quiet room, and know that you are my favorite melody in this noisy world. Thank you for making every ordinary day feel like a song worth remembering forever.",
  fontChoice: "calligraphy",
  message: "Yours with constant devotion and all my affection, always.",
  image: "/vintage_keepsake.jpg",
  occasion: "1990s Mixtape Letter",
};

export default function ViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams?.id;

  const [state, setState] = useState<LetterState | null>(null);
  const [scene, setScene] = useState<"intro" | "envelope" | "puzzle" | "reveal">("intro");
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [emberSparks, setEmberSparks] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      // 1. Check URL hash fallback
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

      // 2. Check local preview
      if (id === "preview") {
        const stored = localStorage.getItem("little_gift_preview");
        if (stored) {
          try {
            setState(JSON.parse(stored));
            return;
          } catch {}
        }
      }

      // 3. Fetch from bytebin or fallback to vintage demo
      if (id && id !== "demo") {
        fetch(`https://bytebin.lucko.me/${id}`)
          .then((res) => {
            if (!res.ok) throw new Error("Not found");
            return res.json();
          })
          .then((data) => setState(data))
          .catch((e) => {
            console.warn("Could not load from bytebin, loading vintage demo:", e);
            setState(DEFAULT_DEMO);
          });
      } else {
        setState(DEFAULT_DEMO);
      }
    }
  }, [id]);

  const currentTheme = themes.find((t) => t.id === state?.theme) || themes[0];
  const currentLetterStyle =
    letterStyles.find((ls) => ls.id === state?.letterStyle) || letterStyles[0];

  const handleEnvelopeOpen = () => {
    setEnvelopeOpen(true);
    setTimeout(() => {
      setScene("puzzle");
    }, 1150);
  };

  const handlePuzzleComplete = () => {
    setScene("reveal");
  };

  const handleSendWarmth = () => {
    sounds.playChime();
    const sparks = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: 35 + Math.random() * 30,
      y: 65 + Math.random() * 10,
    }));
    setEmberSparks((prev) => [...prev, ...sparks]);
    setTimeout(() => {
      setEmberSparks((prev) => prev.filter((s) => !sparks.some((ns) => ns.id === s.id)));
    }, 2200);
  };

  if (!state) {
    return (
      <div className="min-h-screen dark-parchment-desk flex flex-col items-center justify-center p-4">
        <p className="font-vintage-calligraphy text-amber-200/70 text-2xl tracking-wider">
          Unsealing 1990s mixtape & letter...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden flex flex-col items-center justify-center p-4 selection:bg-amber-800/40 selection:text-amber-100 transition-colors duration-700 dark-parchment-desk">
      {/* Subtle ambient desk grain */}
      <div className="fixed inset-0 paper-texture pointer-events-none z-0 opacity-25" />

      {/* Floating Audio Toggle in corner */}
      <AudioToggle />

      {/* Ambient floating golden dust sparks */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                y: "105vh",
                x: `${8 * i + 4}vw`,
                opacity: 0,
              }}
              animate={{
                y: "-10vh",
                opacity: [0, 0.7, 0.7, 0],
              }}
              transition={{
                duration: 12 + (i % 5) * 3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 1.2,
              }}
              className="absolute text-amber-400/80 select-none text-xs"
            >
              ✦
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Ember Sparks on reaction */}
      {emberSparks.map((s) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 1, scale: 0.9, x: `${s.x}vw`, y: `${s.y}vh` }}
          animate={{ opacity: 0, scale: 1.6, y: `${s.y - 35}vh`, x: `${s.x + (Math.random() * 8 - 4)}vw` }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="fixed z-50 text-2xl pointer-events-none text-amber-300 font-vintage-heading"
        >
          ⚜
        </motion.div>
      ))}

      {/* Main Container - Wide Landscape */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center my-auto py-6">
        <AnimatePresence mode="wait">
          {/* SCENE 1: INTRO */}
          {scene === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6 max-w-md mx-auto p-6"
            >
              <div className="inline-block p-3 rounded-full border border-amber-500/30 bg-amber-950/40 text-amber-400 shadow-xl">
                <span className="text-3xl">📻</span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.35em] uppercase font-bold text-amber-400/80 font-vintage-serif">
                  {state.occasion || "1990s Mixtape Letter"}
                </span>
                <h1 className="text-4xl sm:text-5xl font-vintage-calligraphy text-amber-100 tracking-wide">
                  A Letter for {state.name}
                </h1>
                <p className="text-sm text-amber-200/60 font-vintage-body italic leading-relaxed pt-1">
                  A sealed vintage envelope containing a sleek wireless radio and handwritten note.
                </p>
              </div>

              <div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    sounds.playPop();
                    setScene("envelope");
                  }}
                  className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-50 rounded-none font-vintage-serif text-xs tracking-[0.25em] uppercase font-bold shadow-2xl border border-amber-400/40 hover:from-amber-600 hover:to-amber-800 transition-all cursor-pointer"
                >
                  <span>Receive Envelope</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* SCENE 2: THE ENVELOPE */}
          {scene === "envelope" && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.55 }}
              className="flex flex-col items-center space-y-6 w-full"
            >
              <EnvelopeCard
                name={state.name}
                theme={currentTheme}
                envelopeStyle={state.envelopeStyle || "vintage-airmail"}
                waxSealId={state.waxSeal || "burgundy-monogram"}
                isOpen={envelopeOpen}
                onOpen={handleEnvelopeOpen}
                interactive={!envelopeOpen}
              />

              <div className="text-center space-y-1">
                <p className="text-xs font-vintage-serif tracking-widest uppercase text-amber-200/60">
                  Break the wax seal to inspect the radio letter
                </p>
              </div>
            </motion.div>
          )}

          {/* SCENE 3: THE PUZZLE */}
          {scene === "puzzle" && (
            <motion.div
              key="puzzle"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
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

          {/* SCENE 4: THE REVEAL - HORIZONTALLY LONG RADIO BAR ON TOP + ATTACHED WIDE LETTER */}
          {scene === "reveal" && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-6 py-4"
            >
              {/* THE HORIZONTALLY LONG RETRO RADIO BAR + ATTACHED WIDE LETTER */}
              <RetroRadioLetter
                name={state.name}
                letterText={state.letterText || ""}
                fontChoice={state.fontChoice}
                message={state.message}
                image={state.image}
                letterStyle={currentLetterStyle}
                envelopeStyle={state.envelopeStyle || "vintage-airmail"}
                selectedBadgeIds={state.selectedBadges}
                interactive={true}
              />

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                <button
                  onClick={handleSendWarmth}
                  className="px-6 py-3 rounded-none bg-amber-950/80 border border-amber-500/40 text-amber-200 font-vintage-serif text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-amber-900 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Send Remembrance</span>
                  <span className="text-amber-400">❦</span>
                </button>

                <a
                  href="/create"
                  className="px-6 py-3 rounded-none bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-50 font-vintage-serif text-xs uppercase tracking-[0.2em] shadow-xl border border-amber-400/40 hover:from-amber-600 hover:to-amber-800 transition-colors cursor-pointer"
                >
                  Write Your Own Letter
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-5 relative z-10 text-center text-[9px] tracking-[0.3em] uppercase font-vintage-serif text-amber-400/40">
        KEEPSAKE • 1990S MIXTAPE & ARCHIVAL CORRESPONDENCE
      </footer>
    </div>
  );
}
