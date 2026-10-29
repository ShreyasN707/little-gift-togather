"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Sparkles,
  Send,
  Upload,
  Copy,
  Check,
  ExternalLink,
  Wand2,
  Image as ImageIcon,
  BookOpen,
  Eye,
  RefreshCw,
} from "lucide-react";
import { themes, waxSeals, puzzles, sampleLetterPresets, Theme } from "@/lib/themes";
import { EnvelopeCard } from "@/components/EnvelopeCard";
import { sounds } from "@/lib/audio";

const OCCASIONS = [
  "Anniversary 💕",
  "Birthday 🎂",
  "Thinking of You 🌸",
  "Valentine's 💘",
  "Just Because ✨",
  "Apology / Miss You 🥺",
];

export default function CreatePage() {
  const [name, setName] = useState("My Sweetheart");
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [themeId, setThemeId] = useState("sakura-garden");
  const [waxSealId, setWaxSealId] = useState("ruby-heart");
  const [puzzle, setPuzzle] = useState("memory");
  const [puzzleQuestion, setPuzzleQuestion] = useState("What lights up the room when you enter?");
  const [puzzleAnswer, setPuzzleAnswer] = useState("SMILE");
  const [letterText, setLetterText] = useState(
    "Every moment with you feels like a page from a storybook I never want to finish reading.\n\nThank you for filling ordinary days with magic, laughter, and so much warmth. You are my favorite person in the entire universe!"
  );
  const [fontChoice, setFontChoice] = useState<"handwriting" | "cursive" | "serif">("handwriting");
  const [message, setMessage] = useState("Forever and always yours ❤️");
  const [image, setImage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"details" | "letter" | "theme" | "puzzle">("details");
  const [previewTab, setPreviewTab] = useState<"envelope" | "letter">("envelope");
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedTheme = themes.find((t) => t.id === themeId) || themes[0];

  const handleApplyPreset = (preset: typeof sampleLetterPresets[0]) => {
    sounds.playPop();
    setLetterText(preset.message);
    setMessage(preset.ending);
    if (preset.puzzleAnswer) setPuzzleAnswer(preset.puzzleAnswer);
    if (preset.puzzleQuestion) setPuzzleQuestion(preset.puzzleQuestion);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sounds.playPop();
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 600;
          const scaleSize = Math.min(1, MAX_WIDTH / img.width);
          canvas.width = img.width * scaleSize;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
            setImage(compressedBase64);
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!name.trim()) {
      alert("Please enter the receiver's name 💕");
      return;
    }
    if (!letterText.trim() && !image) {
      alert("Please write a sweet letter or upload a photo/image!");
      return;
    }

    sounds.playPop();
    setPublishing(true);

    const letterState = {
      name,
      occasion,
      theme: themeId,
      waxSeal: waxSealId,
      puzzle,
      puzzleQuestion: puzzle === "unscramble" ? puzzleQuestion : undefined,
      puzzleAnswer: puzzle === "unscramble" ? puzzleAnswer : undefined,
      letterText,
      fontChoice,
      message,
      image,
    };

    // Save to localStorage for instant local preview
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("little_gift_preview", JSON.stringify(letterState));
      } catch (e) {
        console.warn("Could not save to localStorage", e);
      }
    }

    // Prepare resilient hash fallback
    let fallbackHash = "";
    try {
      const jsonStr = JSON.stringify(letterState);
      fallbackHash = btoa(encodeURIComponent(jsonStr));
    } catch {}

    try {
      const response = await fetch("https://bytebin.lucko.me/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(letterState),
      });

      if (!response.ok) throw new Error("Failed to post to bytebin");

      const data = await response.json();
      const url = `${window.location.origin}/to/${data.key}`;
      setPublishedUrl(url);

      sounds.playVictoryFanfare();
      import("canvas-confetti").then((module) => {
        const confetti = module.default || module;
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#f472b6", "#fb7185", "#ffd166", "#c084fc"],
        });
      });
    } catch (error) {
      console.warn("Bytebin upload failed, using robust URL hash fallback:", error);
      // Resilient fallback with URL hash
      const url = `${window.location.origin}/to/preview#data=${fallbackHash}`;
      setPublishedUrl(url);

      sounds.playVictoryFanfare();
      import("canvas-confetti").then((module) => {
        const confetti = module.default || module;
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#f472b6", "#fb7185", "#ffd166"],
        });
      });
    } finally {
      setPublishing(false);
    }
  };

  const copyToClipboard = () => {
    if (!publishedUrl) return;
    sounds.playPop();
    navigator.clipboard.writeText(publishedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fff5f6] text-[#4a2828] selection:bg-pink-200 p-4 sm:p-6 md:p-8 relative overflow-x-hidden">
      {/* Background paper texture & cute ambient glow */}
      <div className="fixed inset-0 paper-texture pointer-events-none opacity-40"></div>
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-pink-200/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-6">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-pink-200/80">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center text-2xl shadow-md shadow-pink-300/50">
              💌
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl sm:text-3xl font-cute font-extrabold text-gray-900 tracking-tight">
                  Little Gift Together
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 border border-pink-200">
                  Love Letters Studio 💕
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                Craft a magical interactive envelope & surprise letter with sweet mini-games
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/to/demo"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full text-xs font-bold bg-white/90 border border-pink-200 text-pink-700 hover:bg-pink-50 hover:border-pink-300 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>See Recipient Demo</span>
            </a>
          </div>
        </header>

        {/* Studio Layout: 2 Columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Creator Studio Panel */}
          <div className="lg:col-span-7 bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-200/80 space-y-6 cute-shadow-lg">
            {/* Step Tabs */}
            <div className="flex items-center justify-between p-1.5 bg-pink-50/80 rounded-2xl border border-pink-200/60 overflow-x-auto text-xs font-bold text-gray-600">
              <button
                onClick={() => {
                  sounds.playPop();
                  setActiveTab("details");
                }}
                className={`flex-1 py-2 px-3 rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  activeTab === "details"
                    ? "bg-white text-pink-700 shadow-sm border border-pink-200/50"
                    : "hover:text-pink-600"
                }`}
              >
                <span>1. For Who</span>
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setActiveTab("letter");
                }}
                className={`flex-1 py-2 px-3 rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  activeTab === "letter"
                    ? "bg-white text-pink-700 shadow-sm border border-pink-200/50"
                    : "hover:text-pink-600"
                }`}
              >
                <span>2. The Letter</span>
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setActiveTab("theme");
                }}
                className={`flex-1 py-2 px-3 rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  activeTab === "theme"
                    ? "bg-white text-pink-700 shadow-sm border border-pink-200/50"
                    : "hover:text-pink-600"
                }`}
              >
                <span>3. Envelope & Theme</span>
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setActiveTab("puzzle");
                }}
                className={`flex-1 py-2 px-3 rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  activeTab === "puzzle"
                    ? "bg-white text-pink-700 shadow-sm border border-pink-200/50"
                    : "hover:text-pink-600"
                }`}
              >
                <span>4. Mini Puzzle</span>
              </button>
            </div>

            {/* TAB 1: DETAILS */}
            {activeTab === "details" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-800">
                    Recipient&apos;s Name / Nickname 💕
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-2xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 bg-pink-50/30 text-gray-900 font-cute text-base outline-none transition-all"
                    placeholder="e.g. My Dearest Sarah, Baby, Sunshine"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <p className="text-[11px] text-gray-400">
                    This will appear in romantic calligraphy on the envelope!
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-800">Occasion Tag</label>
                  <div className="flex flex-wrap gap-2">
                    {OCCASIONS.map((occ) => (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => {
                          sounds.playPop();
                          setOccasion(occ);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          occasion === occ
                            ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                            : "bg-white text-gray-600 border-gray-200 hover:border-pink-300"
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-200/70 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-pink-800">
                    <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                    <span>Quick Romance Tip</span>
                  </div>
                  <p className="text-xs text-pink-900/70 leading-relaxed">
                    Personalized letters with cute memories, pet names, and inside jokes create the most unforgettable heartwarming smiles.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setActiveTab("letter");
                  }}
                  className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue to Write Letter</span>
                  <span>→</span>
                </button>
              </motion.div>
            )}

            {/* TAB 2: THE LETTER */}
            {activeTab === "letter" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* Preset selector */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-800">Heartfelt Message</label>
                  <div className="flex items-center gap-1 text-xs">
                    <Wand2 className="w-3.5 h-3.5 text-pink-500" />
                    <span className="text-gray-500 font-medium">Presets:</span>
                    {sampleLetterPresets.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="px-2 py-0.5 rounded-lg bg-pink-100/70 hover:bg-pink-200 text-pink-700 text-[11px] font-semibold transition-colors"
                        title={preset.title}
                      >
                        {i === 0 ? "Romantic" : i === 1 ? "Birthday" : "Warm Hug"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-bold">Handwriting Style:</span>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setFontChoice("handwriting");
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-handwriting text-lg border transition-all ${
                      fontChoice === "handwriting"
                        ? "bg-pink-100 border-pink-400 text-pink-800 font-bold"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    Caveat
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setFontChoice("cursive");
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-cursive border transition-all ${
                      fontChoice === "cursive"
                        ? "bg-pink-100 border-pink-400 text-pink-800 font-bold"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    Dancing Script
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setFontChoice("serif");
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-serif-romantic border transition-all ${
                      fontChoice === "serif"
                        ? "bg-pink-100 border-pink-400 text-pink-800 font-bold"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    Playfair Serif
                  </button>
                </div>

                <textarea
                  rows={6}
                  className={`w-full p-4 rounded-2xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 bg-[#fffdfa] text-gray-900 text-base outline-none transition-all leading-relaxed ${
                    fontChoice === "cursive"
                      ? "font-cursive text-xl"
                      : fontChoice === "serif"
                      ? "font-serif-romantic text-base"
                      : "font-handwriting text-2xl"
                  }`}
                  placeholder="Write your heartfelt letter here..."
                  value={letterText}
                  onChange={(e) => setLetterText(e.target.value)}
                />

                {/* Photo Upload with Polaroid Preview */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-800">
                    Attach Photo / Memory (Optional) 📸
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer px-4 py-2.5 rounded-xl border border-dashed border-pink-300 hover:border-pink-400 bg-pink-50/50 hover:bg-pink-100/50 text-xs font-bold text-pink-700 flex items-center gap-2 transition-all">
                      <Upload className="w-4 h-4" />
                      <span>{image ? "Change Photo" : "Upload Polaroid Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>

                    {image && (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-pink-200 shadow-sm">
                          <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playPop();
                            setImage(null);
                          }}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Secret Ending Message / P.S. */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-800">
                    Secret Ending Note / P.S. 💌
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-2xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 bg-pink-50/30 text-gray-900 font-handwriting text-xl outline-none transition-all"
                    placeholder="e.g. Forever and always yours ❤️"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setActiveTab("theme");
                  }}
                  className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Choose Theme & Wax Seal</span>
                  <span>→</span>
                </button>
              </motion.div>
            )}

            {/* TAB 3: THEME & ENVELOPE */}
            {activeTab === "theme" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Theme Cards */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-800">
                    Select Stationery Theme
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {themes.map((t) => {
                      const isSelected = themeId === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            sounds.playPop();
                            setThemeId(t.id);
                          }}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected
                              ? "border-pink-500 bg-pink-50/80 shadow-md scale-[1.02]"
                              : "border-gray-200 bg-white hover:border-pink-200"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl ${t.envelopeClass} flex items-center justify-center text-xl shadow-sm`}
                          >
                            {t.particleEmoji}
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                              <span>{t.name}</span>
                              {isSelected && <span className="text-pink-500">✓</span>}
                            </h4>
                            <p className="text-[10px] text-gray-500 truncate">{t.tagline}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Wax Seal Picker */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-800">
                    Wax Seal Stamp & Color
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {waxSeals.map((seal) => {
                      const isSelected = waxSealId === seal.id;
                      return (
                        <button
                          key={seal.id}
                          type="button"
                          onClick={() => {
                            sounds.playPop();
                            setWaxSealId(seal.id);
                          }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all ${
                            isSelected
                              ? "border-pink-500 bg-pink-50 shadow-md scale-105"
                              : "border-gray-200 bg-white hover:border-pink-200"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full bg-gradient-to-br ${seal.color} flex items-center justify-center text-sm shadow-sm`}
                          >
                            {seal.icon}
                          </div>
                          <span className="text-xs font-bold text-gray-700">{seal.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setActiveTab("puzzle");
                  }}
                  className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Select Love Puzzle</span>
                  <span>→</span>
                </button>
              </motion.div>
            )}

            {/* TAB 4: PUZZLE */}
            {activeTab === "puzzle" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-800">
                    Pick a Mini-Game to Unlock the Letter
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {puzzles.map((p) => {
                      const isSelected = puzzle === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            sounds.playPop();
                            setPuzzle(p.id);
                          }}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                            isSelected
                              ? "border-pink-500 bg-pink-50/80 shadow-md scale-[1.02]"
                              : "border-gray-200 bg-white hover:border-pink-200"
                          }`}
                        >
                          <span className="text-3xl">{p.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-gray-800">{p.name}</h4>
                            <p className="text-[10px] text-gray-500 mt-1 leading-snug">
                              {p.description}
                            </p>
                          </div>
                          <span className="text-[9px] font-semibold px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 mt-auto">
                            {p.difficulty}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional fields for unscramble */}
                {puzzle === "unscramble" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-amber-900">
                        Secret Question / Clue
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-xs outline-none"
                        placeholder="e.g. Where did we first meet?"
                        value={puzzleQuestion}
                        onChange={(e) => setPuzzleQuestion(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-amber-900">
                        Secret Answer Word (A-Z)
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-xs font-bold uppercase tracking-wider outline-none"
                        placeholder="e.g. PARIS"
                        value={puzzleAnswer}
                        onChange={(e) =>
                          setPuzzleAnswer(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))
                        }
                      />
                      <p className="text-[10px] text-amber-700">
                        Recipient will tap scrambled letter tiles to solve this word!
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Big Publish Button */}
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={publishing}
                    onClick={handlePublish}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white font-cute font-extrabold text-base shadow-lg shadow-pink-300/50 hover:shadow-xl hover:from-pink-600 hover:to-rose-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {publishing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Sealing with Love...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5 fill-current" />
                        <span>Create & Publish Magical Letter ✨</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Published Result Box */}
            {publishedUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300 space-y-3"
              >
                <div className="flex items-center gap-2 text-pink-800 font-bold text-sm">
                  <span>🎉 Your Letter is Ready to Share!</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publishedUrl}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs text-gray-700 outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <a
                    href={publishedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-pink-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Open in New Tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `I made a special surprise letter for you! Open it here: ${publishedUrl}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-600 font-bold hover:underline"
                  >
                    Share via WhatsApp 💬
                  </a>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Live Real-Time Interactive Preview */}
          <div className="lg:col-span-5 sticky top-8 space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>Live Recipient Preview</span>
              </span>

              <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-pink-200 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setPreviewTab("envelope");
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    previewTab === "envelope"
                      ? "bg-pink-100 text-pink-700"
                      : "text-gray-500 hover:text-pink-600"
                  }`}
                >
                  Envelope
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setPreviewTab("letter");
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    previewTab === "letter"
                      ? "bg-pink-100 text-pink-700"
                      : "text-gray-500 hover:text-pink-600"
                  }`}
                >
                  Letter
                </button>
              </div>
            </div>

            {/* Preview Stage Card */}
            <div
              className={`w-full rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center min-h-[380px] shadow-xl border border-pink-200/80 transition-colors duration-500 relative overflow-hidden ${selectedTheme.bgClass}`}
            >
              <div className="absolute inset-0 paper-texture pointer-events-none opacity-40"></div>

              {previewTab === "envelope" ? (
                <div className="relative z-10 w-full flex flex-col items-center">
                  <EnvelopeCard
                    name={name}
                    theme={selectedTheme}
                    waxSealId={waxSealId}
                    isOpen={false}
                    interactive={false}
                    previewMode={true}
                  />
                  <p className="mt-4 text-[11px] text-pink-900/60 font-medium">
                    This is how your sealed envelope will appear to {name || "your recipient"}!
                  </p>
                </div>
              ) : (
                <div className="relative z-10 w-full max-w-sm bg-[#fffefa] rounded-2xl p-5 shadow-lg border border-pink-100 space-y-3">
                  <div className="flex justify-between items-center border-b border-pink-100 pb-2">
                    <span className="font-handwriting text-xl font-bold text-pink-900">
                      Dearest {name || "Sweetheart"},
                    </span>
                    <span className="text-base">💌</span>
                  </div>

                  <p
                    className={`text-gray-800 leading-relaxed text-sm ${
                      fontChoice === "cursive"
                        ? "font-cursive text-base"
                        : fontChoice === "serif"
                        ? "font-serif-romantic text-xs"
                        : "font-handwriting text-lg"
                    }`}
                  >
                    {letterText}
                  </p>

                  {image && (
                    <div className="polaroid-frame rounded max-w-[180px] mx-auto shadow-sm">
                      <div className="aspect-[4/3] overflow-hidden rounded">
                        <img src={image} alt="Attached" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  {message && (
                    <p className="font-handwriting text-base text-pink-600 font-bold text-center pt-2 border-t border-pink-100">
                      {message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
