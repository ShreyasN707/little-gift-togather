"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Copy,
  Check,
  ExternalLink,
  Eye,
  RefreshCw,
  Radio as RadioIcon,
  Award,
} from "lucide-react";
import {
  themes,
  envelopeStyles,
  letterStyles,
  vintageBadges,
  waxSeals,
  puzzles,
} from "@/lib/themes";
import { EnvelopeCard } from "@/components/EnvelopeCard";
import { RetroRadioLetter } from "@/components/RetroRadioLetter";
import { sounds } from "@/lib/audio";

const OCCASIONS = [
  "1990s Mixtape Letter",
  "Love & Devotion",
  "A Distant Remembrance",
  "Milestone & Anniversary",
  "In Thought & Silence",
];

const VINTAGE_PRESETS = [
  {
    title: "1994 Cassette Mixtape",
    message:
      "I made this mixtape and penned these lines thinking of you.\n\nPress play on the radio above, let the music fill the room, and know that you are my favorite melody in this noisy world. Thank you for making ordinary days feel like a song worth remembering forever.",
    ending: "Yours with constant devotion and affection, always.",
    puzzleAnswer: "ALWAYS",
    puzzleQuestion: "The eternal promise between our hearts:",
  },
  {
    title: "To My Distant Star",
    message:
      "If words could bridge the miles tonight, these lines would carry the sound of my heartbeat to your doorstep.\n\nYou have given my days purpose and my evenings peace. Remember, whenever the night seems heavy, that under the same quiet stars someone loves you with all their being.",
    ending: "Ever faithfully and tenderly yours,",
    puzzleAnswer: "STARS",
    puzzleQuestion: "What we gaze upon from afar:",
  },
  {
    title: "A Timeless Keepsake",
    message:
      "Some things in this changing world remain unchanged, and among them is my profound gratitude for having you in my story.\n\nThank you for every laughter shared, every quiet understanding, and every grace you offer so effortlessly.",
    ending: "With all my fondness and respect,",
    puzzleAnswer: "FOREVER",
    puzzleQuestion: "How long this memory will endure:",
  },
];

export default function CreatePage() {
  const [name, setName] = useState("Eleanor");
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [envelopeStyle, setEnvelopeStyle] = useState("vintage-airmail");
  const [letterStyle, setLetterStyle] = useState("aged-parchment");
  const [waxSealId, setWaxSealId] = useState("burgundy-monogram");
  const [selectedBadges, setSelectedBadges] = useState<string[]>([
    "keeper-of-heart",
    "eternal-rose",
    "first-class-love",
  ]);
  const [puzzle, setPuzzle] = useState("memory");
  const [puzzleQuestion, setPuzzleQuestion] = useState("The eternal promise between our hearts:");
  const [puzzleAnswer, setPuzzleAnswer] = useState("ALWAYS");
  const [letterText, setLetterText] = useState(VINTAGE_PRESETS[0].message);
  const [fontChoice, setFontChoice] = useState<"calligraphy" | "script" | "serif">("calligraphy");
  const [message, setMessage] = useState(VINTAGE_PRESETS[0].ending);
  const [image, setImage] = useState<string | null>(null);

  const [activeStep, setActiveStep] = useState<
    "recipient" | "letter" | "envelope" | "badges" | "lock"
  >("recipient");
  const [previewTab, setPreviewTab] = useState<"envelope" | "letter">("letter");
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const currentEnvelope =
    envelopeStyles.find((e) => e.id === envelopeStyle) || envelopeStyles[0];
  const currentLetter = letterStyles.find((l) => l.id === letterStyle) || letterStyles[0];

  const handleApplyPreset = (preset: typeof VINTAGE_PRESETS[0]) => {
    sounds.playPop();
    setLetterText(preset.message);
    setMessage(preset.ending);
    if (preset.puzzleAnswer) setPuzzleAnswer(preset.puzzleAnswer);
    if (preset.puzzleQuestion) setPuzzleQuestion(preset.puzzleQuestion);
  };

  const handleToggleBadge = (badgeId: string) => {
    sounds.playPop();
    setSelectedBadges((prev) =>
      prev.includes(badgeId) ? prev.filter((id) => id !== badgeId) : [...prev, badgeId]
    );
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
      alert("Please enter the recipient's name.");
      return;
    }
    if (!letterText.trim() && !image) {
      alert("Please compose a letter or attach an archival photograph.");
      return;
    }

    sounds.playPop();
    setPublishing(true);

    const letterState = {
      name,
      occasion,
      theme: "linen-natural",
      envelopeStyle,
      letterStyle,
      waxSeal: waxSealId,
      selectedBadges,
      puzzle,
      puzzleQuestion: puzzle === "unscramble" ? puzzleQuestion : undefined,
      puzzleAnswer: puzzle === "unscramble" ? puzzleAnswer : undefined,
      letterText,
      fontChoice,
      message,
      image,
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("little_gift_preview", JSON.stringify(letterState));
      } catch (e) {
        console.warn("Could not save to localStorage", e);
      }
    }

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
    } catch (error) {
      console.warn("Bytebin upload failed, using URL hash fallback:", error);
      const url = `${window.location.origin}/to/preview#data=${fallbackHash}`;
      setPublishedUrl(url);
      sounds.playVictoryFanfare();
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
    <div className="min-h-screen dark-parchment-desk text-[#f6eedb] selection:bg-amber-800/40 p-4 sm:p-6 md:p-10 relative overflow-x-hidden font-sans-clean">
      {/* Antique paper texture */}
      <div className="fixed inset-0 paper-texture pointer-events-none opacity-25" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-amber-900/40">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl text-amber-400">📻</span>
              <h1 className="text-2xl sm:text-3xl font-vintage-heading tracking-widest text-amber-100 font-bold">
                KEEPSAKE
              </h1>
              <span className="text-[9px] tracking-[0.3em] uppercase font-vintage-serif text-amber-300/80 border border-amber-700/60 px-2 py-0.5 rounded-xs bg-amber-950/40">
                1990s ATELIER
              </span>
            </div>
            <p className="text-xs text-amber-200/60 mt-1 font-vintage-body italic tracking-wider">
              1990s Retro Radio Letters • Pinned Commemorative Badges • Antique Sealed Envelopes
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/to/demo"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xs text-xs font-vintage-serif tracking-wider uppercase border border-amber-500/40 bg-amber-950/50 text-amber-200 hover:bg-amber-900/60 hover:text-amber-100 transition-colors flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Inspect Sample Radio Letter</span>
            </a>
          </div>
        </header>

        {/* 2-Column Writing Desk Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: Writing Desk Controls */}
          <div className="lg:col-span-7 aged-parchment rounded-sm p-6 sm:p-8 border border-amber-900/40 shadow-2xl text-[#28160c] space-y-7">
            {/* Step Navigation */}
            <div className="flex items-center border-b border-amber-900/20 pb-3 text-xs tracking-widest uppercase font-vintage-serif font-bold text-amber-950/60 overflow-x-auto gap-5">
              {[
                { id: "recipient", label: "I. Recipient" },
                { id: "letter", label: "II. Letter" },
                { id: "envelope", label: "III. Envelope" },
                { id: "badges", label: "IV. Radio Badges" },
                { id: "lock", label: "V. Memory Lock" },
              ].map((step) => (
                <button
                  key={step.id}
                  onClick={() => {
                    sounds.playPop();
                    setActiveStep(step.id as any);
                  }}
                  className={`pb-1 transition-colors whitespace-nowrap cursor-pointer ${
                    activeStep === step.id
                      ? "text-amber-950 border-b-2 border-amber-900 font-extrabold"
                      : "hover:text-amber-800"
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>

            {/* STEP 1: RECIPIENT */}
            {activeStep === "recipient" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-widest font-vintage-serif font-bold text-amber-950">
                    Recipient Name (Penmanship on Envelope & Mixtape)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xs border border-amber-900/30 focus:border-amber-900 bg-[#fdfbf6] text-[#241309] font-vintage-calligraphy text-3xl outline-none transition-colors"
                    placeholder="e.g. Eleanor, Julian, My Beloved"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <p className="text-[11px] text-amber-900/60 font-vintage-body italic">
                    Rendered in authentic 1990s mixtape label and Spencerian calligraphy.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest font-vintage-serif font-bold text-amber-950">
                    Classification / Occasion
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {OCCASIONS.map((occ) => (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => {
                          sounds.playPop();
                          setOccasion(occ);
                        }}
                        className={`px-3 py-1.5 rounded-xs text-xs font-vintage-serif uppercase tracking-wider border transition-colors cursor-pointer ${
                          occasion === occ
                            ? "bg-amber-950 text-amber-100 border-amber-950 font-bold"
                            : "bg-[#fbf7ee] text-amber-950 border-amber-900/25 hover:border-amber-800"
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setActiveStep("letter");
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-900 to-amber-950 hover:from-amber-800 hover:to-amber-900 text-amber-50 rounded-xs text-xs uppercase tracking-[0.2em] font-vintage-serif font-bold shadow-md transition-colors cursor-pointer"
                >
                  Proceed to Letter Composition →
                </button>
              </motion.div>
            )}

            {/* STEP 2: THE LETTER & STATIONERY STYLE */}
            {activeStep === "letter" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Letter Stationery Style Picker */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest font-vintage-serif font-bold text-amber-950">
                    Parchment Stationery Style (5 Distinct Types)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {letterStyles.map((style) => {
                      const isSelected = letterStyle === style.id;
                      return (
                        <div
                          key={style.id}
                          onClick={() => {
                            sounds.playPop();
                            setLetterStyle(style.id);
                          }}
                          className={`p-3 rounded-xs border cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected
                              ? "border-amber-900 bg-amber-100/70 shadow-md font-bold"
                              : "border-amber-900/25 bg-[#fdfaf3] hover:border-amber-800"
                          }`}
                        >
                          <span className="text-2xl opacity-80">{style.crest}</span>
                          <div>
                            <h4 className="text-xs font-vintage-serif text-amber-950">{style.name}</h4>
                            <p className="text-[10px] text-amber-900/60 font-vintage-body italic line-clamp-1">
                              {style.tagline}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Presets */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-amber-900/15">
                  <label className="text-xs uppercase tracking-widest font-vintage-serif font-bold text-amber-950">
                    Letter Penmanship
                  </label>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-amber-900/60 font-vintage-body italic">Mixtape Presets:</span>
                    {VINTAGE_PRESETS.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="px-2 py-0.5 rounded-xs text-[11px] font-vintage-serif text-amber-900 border border-amber-900/30 hover:border-amber-900 bg-[#fdfaf3] transition-colors cursor-pointer"
                      >
                        {preset.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography choices */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-widest font-vintage-serif font-bold text-amber-950/60">
                    Script:
                  </span>
                  {[
                    { id: "calligraphy", label: "Pinyon Calligraphy" },
                    { id: "script", label: "Great Vibes Script" },
                    { id: "serif", label: "Cormorant Italic" },
                  ].map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setFontChoice(font.id as any);
                      }}
                      className={`px-3 py-1 rounded-xs text-xs font-vintage-serif border transition-colors cursor-pointer ${
                        fontChoice === font.id
                          ? "bg-amber-950 text-amber-100 border-amber-950 font-bold"
                          : "bg-[#fdfaf3] text-amber-900 border-amber-900/25 hover:border-amber-800"
                      }`}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <textarea
                    rows={7}
                    className={`w-full p-5 rounded-xs border border-amber-900/30 focus:border-amber-900 bg-[#fdfbf6] text-[#26150b] text-base outline-none transition-colors leading-relaxed antique-ruled-lines ${
                      fontChoice === "serif"
                        ? "font-vintage-body italic text-xl"
                        : fontChoice === "script"
                        ? "font-vintage-script text-2xl"
                        : "font-vintage-calligraphy text-3xl"
                    }`}
                    placeholder="In the stillness of this evening, I write to you..."
                    value={letterText}
                    onChange={(e) => setLetterText(e.target.value)}
                  />
                </div>

                {/* Photo Attachment */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest font-vintage-serif font-bold text-amber-950">
                    Attach Polaroid Photograph (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer px-4 py-2 rounded-xs border border-amber-900/40 hover:border-amber-900 bg-[#fdfaf3] text-xs font-vintage-serif font-bold uppercase tracking-wider text-amber-950 flex items-center gap-2 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-amber-800" />
                      <span>{image ? "Replace Photograph" : "Attach Album Photograph"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>

                    {image && (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xs overflow-hidden border border-amber-900/40 p-0.5 bg-white">
                          <img src={image} alt="Preview" className="w-full h-full object-cover sepia-[0.3]" />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playPop();
                            setImage(null);
                          }}
                          className="text-xs text-amber-900 underline font-vintage-serif"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Valediction / P.S. */}
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-widest font-vintage-serif font-bold text-amber-950">
                    Valediction / Postscript (P.S.)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xs border border-amber-900/30 focus:border-amber-900 bg-[#fdfbf6] text-[#241309] font-vintage-calligraphy text-3xl outline-none transition-colors"
                    placeholder="e.g. Yours with constant devotion and affection, always."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setActiveStep("envelope");
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-900 to-amber-950 hover:from-amber-800 hover:to-amber-900 text-amber-50 rounded-xs text-xs uppercase tracking-[0.2em] font-vintage-serif font-bold shadow-md transition-colors cursor-pointer"
                >
                  Choose Envelope Style →
                </button>
              </motion.div>
            )}

            {/* STEP 3: ENVELOPE STYLES */}
            {activeStep === "envelope" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest font-vintage-serif font-bold text-amber-950">
                    Select Vintage Envelope Architecture (5 Distinct Types)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {envelopeStyles.map((env) => {
                      const isSelected = envelopeStyle === env.id;
                      return (
                        <div
                          key={env.id}
                          onClick={() => {
                            sounds.playPop();
                            setEnvelopeStyle(env.id);
                          }}
                          className={`p-3.5 rounded-xs border cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? "border-amber-900 bg-amber-100/70 shadow-md font-bold scale-[1.01]"
                              : "border-amber-900/25 bg-[#fdfaf3] hover:border-amber-800"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-vintage-serif font-bold text-amber-950">
                              {env.name}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider text-amber-800 bg-amber-900/10 px-1.5 py-0.5 rounded-xs">
                              {env.era}
                            </span>
                          </div>
                          <p className="text-[10px] text-amber-900/70 font-vintage-body italic">
                            {env.tagline}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setActiveStep("badges");
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-900 to-amber-950 hover:from-amber-800 hover:to-amber-900 text-amber-50 rounded-xs text-xs uppercase tracking-[0.2em] font-vintage-serif font-bold shadow-md transition-colors cursor-pointer"
                >
                  Configure Radio Badges & Wax Seal →
                </button>
              </motion.div>
            )}

            {/* STEP 4: RADIO BADGES & WAX SEAL */}
            {activeStep === "badges" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Badges Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-widest font-vintage-serif font-bold text-amber-950">
                      Enamel Badges (Pinned to the Radio Bar)
                    </label>
                    <span className="text-[10px] text-amber-900/60 font-vintage-body italic">
                      Tap to select / deselect
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {vintageBadges.map((badge) => {
                      const isSelected = selectedBadges.includes(badge.id);
                      return (
                        <div
                          key={badge.id}
                          onClick={() => handleToggleBadge(badge.id)}
                          className={`p-3 rounded-xs border cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected
                              ? "border-amber-900 bg-amber-100/70 shadow-sm"
                              : "border-amber-900/20 bg-[#fdfaf3] opacity-60 hover:opacity-100"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-sm shadow-xs border`}
                          >
                            <span>{badge.symbol}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-vintage-serif text-amber-950 font-bold">
                                {badge.name}
                              </h4>
                              {isSelected && <span className="text-[10px] text-amber-800">✓</span>}
                            </div>
                            <p className="text-[10px] text-amber-900/70 font-vintage-body italic line-clamp-1">
                              {badge.title}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Wax Seal Selector */}
                <div className="space-y-2 pt-2 border-t border-amber-900/20">
                  <label className="block text-xs uppercase tracking-widest font-vintage-serif font-bold text-amber-950">
                    Molten Wax Signet (On Envelope)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {waxSeals.map((seal) => {
                      const isSelected = waxSealId === seal.id;
                      return (
                        <div
                          key={seal.id}
                          onClick={() => {
                            sounds.playPop();
                            setWaxSealId(seal.id);
                          }}
                          className={`p-3 rounded-xs border cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected
                              ? "border-amber-900 bg-amber-100/70 shadow-md font-bold"
                              : "border-amber-900/20 bg-[#fdfaf3] hover:border-amber-800"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${seal.color} flex items-center justify-center text-xs font-vintage-heading text-amber-200 border border-amber-900/40 shadow-xs`}
                          >
                            {seal.symbol}
                          </div>
                          <div>
                            <h4 className="text-xs font-vintage-serif text-amber-950">{seal.name}</h4>
                            <span className="text-[9px] text-amber-900/60 font-vintage-body italic">
                              Molten Seal
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setActiveStep("lock");
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-900 to-amber-950 hover:from-amber-800 hover:to-amber-900 text-amber-50 rounded-xs text-xs uppercase tracking-[0.2em] font-vintage-serif font-bold shadow-md transition-colors cursor-pointer"
                >
                  Configure Archival Lock →
                </button>
              </motion.div>
            )}

            {/* STEP 5: PUZZLE LOCK */}
            {activeStep === "lock" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest font-vintage-serif font-bold text-amber-950">
                    Archival Lock Mechanism
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
                          className={`p-4 rounded-xs border cursor-pointer transition-all flex flex-col gap-1.5 ${
                            isSelected
                              ? "border-amber-900 bg-amber-100/60 shadow-md font-bold"
                              : "border-amber-900/25 bg-[#fdfaf3] hover:border-amber-800"
                          }`}
                        >
                          <span className="text-[9px] tracking-widest uppercase font-vintage-serif text-amber-800">
                            {p.category}
                          </span>
                          <h4 className="text-xs font-vintage-serif text-amber-950">{p.name}</h4>
                          <p className="text-[10px] text-amber-900/70 font-vintage-body italic leading-snug">
                            {p.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {puzzle === "unscramble" && (
                  <div className="p-4 rounded-xs bg-[#fdfaf3] border border-amber-900/30 space-y-3">
                    <div className="space-y-1">
                      <label className="block text-xs uppercase tracking-widest font-vintage-serif font-bold text-amber-950">
                        Inscribed Clue Prompt
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-xs border border-amber-900/30 bg-white text-xs outline-none focus:border-amber-900"
                        placeholder="e.g. The eternal promise between our hearts:"
                        value={puzzleQuestion}
                        onChange={(e) => setPuzzleQuestion(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs uppercase tracking-widest font-vintage-serif font-bold text-amber-950">
                        Cipher Key Solution (A-Z)
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        className="w-full px-3 py-2 rounded-xs border border-amber-900/30 bg-white text-xs font-vintage-serif tracking-widest uppercase outline-none focus:border-amber-900 font-bold"
                        placeholder="e.g. ALWAYS"
                        value={puzzleAnswer}
                        onChange={(e) =>
                          setPuzzleAnswer(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Final Publish Button */}
                <div className="pt-2">
                  <button
                    disabled={publishing}
                    onClick={handlePublish}
                    className="w-full py-4 rounded-xs bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-amber-100 font-vintage-serif text-xs uppercase tracking-[0.25em] font-bold shadow-2xl border border-amber-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {publishing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
                        <span>Sealing in Molten Wax...</span>
                      </>
                    ) : (
                      <span>Seal Letter in Molten Wax & Deliver</span>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Generated Link Box */}
            {publishedUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xs bg-[#fdfaf3] border-2 border-amber-800 space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between text-xs font-vintage-serif uppercase tracking-wider font-bold text-amber-950">
                  <span>⚜ Letter Sealed & Recorded</span>
                  <span className="text-[10px] text-amber-800 font-normal">Ready for Courier</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publishedUrl}
                    className="flex-1 px-3 py-2 rounded-xs border border-amber-900/30 bg-white text-xs text-amber-950 font-mono outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 rounded-xs bg-amber-950 hover:bg-amber-900 text-amber-100 text-xs font-vintage-serif tracking-wider uppercase font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs font-vintage-serif">
                  <a
                    href={publishedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-900 hover:text-amber-950 underline flex items-center gap-1"
                  >
                    <span>Inspect Recipient Desk</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `A private correspondence has been sealed for your eyes: ${publishedUrl}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-800 hover:text-amber-950 font-bold"
                  >
                    Despatch via WhatsApp 💬
                  </a>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Live Desk Preview */}
          <div className="lg:col-span-5 sticky top-8 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] tracking-[0.25em] uppercase font-vintage-serif font-bold text-amber-300/70">
                Desk Live Preview
              </span>

              <div className="flex items-center gap-1 p-0.5 bg-amber-950/80 rounded-xs border border-amber-800/60 text-[11px] font-vintage-serif">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setPreviewTab("envelope");
                  }}
                  className={`px-3 py-1 rounded-xs transition-colors cursor-pointer uppercase tracking-wider ${
                    previewTab === "envelope"
                      ? "bg-amber-800 text-amber-100 font-bold"
                      : "text-amber-300/70 hover:text-amber-100"
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
                  className={`px-3 py-1 rounded-xs transition-colors cursor-pointer uppercase tracking-wider ${
                    previewTab === "letter"
                      ? "bg-amber-800 text-amber-100 font-bold"
                      : "text-amber-300/70 hover:text-amber-100"
                  }`}
                >
                  Radio Letter
                </button>
              </div>
            </div>

            {/* Preview Desk */}
            <div className="w-full rounded-sm p-4 sm:p-6 flex flex-col items-center justify-center min-h-[420px] border border-amber-900/40 shadow-2xl transition-colors duration-500 relative overflow-hidden dark-parchment-desk">
              <div className="absolute inset-0 paper-texture pointer-events-none opacity-30" />

              {previewTab === "envelope" ? (
                <div className="relative z-10 w-full flex flex-col items-center">
                  <EnvelopeCard
                    name={name}
                    envelopeStyle={envelopeStyle}
                    waxSealId={waxSealId}
                    isOpen={false}
                    interactive={false}
                    previewMode={true}
                  />
                  <div className="mt-4 text-center space-y-0.5">
                    <span className="text-[10px] uppercase font-vintage-serif tracking-widest text-amber-300 font-bold block">
                      {currentEnvelope.name}
                    </span>
                    <p className="text-xs text-amber-200/60 font-vintage-body italic">
                      {currentEnvelope.tagline}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 w-full">
                  <RetroRadioLetter
                    name={name}
                    letterText={letterText}
                    fontChoice={fontChoice}
                    message={message}
                    image={image}
                    letterStyle={currentLetter}
                    envelopeStyle={envelopeStyle}
                    selectedBadgeIds={selectedBadges}
                    interactive={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
