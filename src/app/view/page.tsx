"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { themes } from "@/lib/themes";
import { MemoryPuzzle } from "@/components/puzzles/MemoryPuzzle";
import { UnscramblePuzzle } from "@/components/puzzles/UnscramblePuzzle";
import { FindRosePuzzle } from "@/components/puzzles/FindRosePuzzle";
import { Heart } from "lucide-react";

export default function ViewPage() {
  const [state, setState] = useState<any>(null);
  const [scene, setScene] = useState<"loading" | "envelope" | "puzzle" | "reveal">("loading");

  useEffect(() => {
    // Read state from URL hash
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      try {
        const decoded = JSON.parse(decodeURIComponent(hash));
        setState(decoded);
      } catch (e) {
        console.error("Invalid URL state", e);
      }
    } else {
      // Dummy state for testing if accessed directly
      setState({
        name: "My Love",
        theme: "sakura-garden",
        puzzle: "memory",
        message: "I hope this made you smile ❤️",
        image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop"
      });
    }

    // Scene 1: Loading
    const timer = setTimeout(() => {
      setScene("envelope");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!state) return <div className="min-h-screen bg-rose-50 flex items-center justify-center text-rose-400">Loading magical moments...</div>;

  const currentTheme = themes.find(t => t.id === state.theme) || themes[0];

  return (
    <div className={`min-h-screen overflow-hidden ${currentTheme.colors.background} flex items-center justify-center relative`}>
      <div className="absolute inset-0 paper-texture z-0 pointer-events-none"></div>
      
      {/* Background Particles Placeholder */}
      <div className="absolute inset-0 pointer-events-none opacity-50 flex flex-wrap justify-center overflow-hidden">
        {/* Simple CSS animation for particles based on theme could go here */}
        {[...Array(20)].map((_, i) => (
          <motion.div 
            key={i}
            initial={{ y: -50, x: Math.random() * window.innerWidth, opacity: 0 }}
            animate={{ 
              y: window.innerHeight + 50, 
              opacity: [0, 1, 0],
              rotate: 360
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
            className="absolute text-2xl sm:text-4xl drop-shadow-lg"
          >
            {currentTheme.particleType === 'blossom' && '🌸'}
            {currentTheme.particleType === 'star' && '✨'}
            {currentTheme.particleType === 'sparkle' && '💖'}
            {currentTheme.particleType === 'leaf' && '🍃'}
          </motion.div>
        ))}
      </div>

      {scene === "loading" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          className="text-center z-10 space-y-4"
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Heart className="w-16 h-16 mx-auto text-white fill-current opacity-80" />
          </motion.div>
          <h2 className="text-2xl font-serif text-white/90 tracking-widest">Preparing something special...</h2>
        </motion.div>
      )}

      {scene === "envelope" && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 flex flex-col items-center space-y-8"
        >
          <motion.div 
            whileHover={{ scale: 1.02, rotate: -2 }}
            className={`w-72 sm:w-80 h-52 sm:h-56 relative flex items-center justify-center z-10 ${currentTheme.colors.envelope}`}
          >
            {/* Wax Seal */}
            <div className="absolute w-16 h-16 bg-red-800 rounded-full shadow-inner flex items-center justify-center border-2 border-red-900 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <Heart className="w-6 h-6 text-red-300" />
            </div>
            {/* Flap lines */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-black/10 origin-top transform scale-y-110 shadow-md z-10" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}></div>
            </div>
          </motion.div>

          <div className={`text-center space-y-4 px-4 relative z-10 ${currentTheme.colors.text}`}>
            <h1 className="text-2xl sm:text-3xl font-serif">Hey my love, {state.name} ❤️</h1>
            <Button 
              onClick={() => setScene("puzzle")}
              className="bg-white text-gray-900 craft-border hover:bg-gray-100 rounded-none px-8 py-6 text-lg font-serif"
            >
              Open Letter
            </Button>
          </div>
        </motion.div>
      )}

      {scene === "puzzle" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-10 w-full flex justify-center"
        >
          {state.puzzle === "unscramble" ? (
            <UnscramblePuzzle onComplete={() => setScene("reveal")} />
          ) : state.puzzle === "find-rose" ? (
            <FindRosePuzzle onComplete={() => setScene("reveal")} />
          ) : (
            <MemoryPuzzle onComplete={() => setScene("reveal")} />
          )}
        </motion.div>
      )}

      {scene === "reveal" && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="z-20 w-full max-w-2xl mx-auto p-4 flex flex-col items-center"
        >
          <div className="bg-[#fdfbf7] p-4 md:p-8 transform rotate-1 w-full relative craft-border">
            <img 
              src={state.image} 
              alt="Love Letter" 
              className="w-full h-auto relative z-10 craft-border"
            />
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-8 text-center"
            >
              <p className="font-serif text-xl text-gray-800 italic">
                {state.message || "I hope this made you smile ❤️"}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
