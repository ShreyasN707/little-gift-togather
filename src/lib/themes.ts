export interface Theme {
  id: string;
  name: string;
  tagline: string;
  particleType: "blossom" | "star" | "sparkle" | "leaf" | "heart";
  particleEmoji: string;
  bgGradient: string;
  bgClass: string;
  envelopeClass: string;
  envelopeLining: string;
  textColor: string;
  accentColor: string;
  badgeBg: string;
  paperStyle: string;
}

export const themes: Theme[] = [
  {
    id: "sakura-garden",
    name: "Sakura Blossom",
    tagline: "Romantic soft pink & floating cherry petals",
    particleType: "blossom",
    particleEmoji: "🌸",
    bgGradient: "from-[#ffebee] via-[#fff0f3] to-[#ffd1dc]",
    bgClass: "bg-gradient-to-br from-[#ffebee] via-[#fff0f3] to-[#ffd1dc]",
    envelopeClass: "bg-[#f4a7b9] border-[#e28498]",
    envelopeLining: "#ffe4e9",
    textColor: "text-[#5c2434]",
    accentColor: "#e07a90",
    badgeBg: "bg-pink-100 text-pink-700 border-pink-200",
    paperStyle: "bg-[#fffafa] border-pink-100",
  },
  {
    id: "starlight-sky",
    name: "Moonlit Starlight",
    tagline: "Celestial midnight blue with twinkling stars",
    particleType: "star",
    particleEmoji: "✨",
    bgGradient: "from-[#1a1b35] via-[#24294a] to-[#121426]",
    bgClass: "bg-gradient-to-br from-[#1a1b35] via-[#24294a] to-[#121426]",
    envelopeClass: "bg-[#f6d860] border-[#d8b835]",
    envelopeLining: "#343d68",
    textColor: "text-[#fefae0]",
    accentColor: "#ffd166",
    badgeBg: "bg-indigo-900/60 text-yellow-200 border-indigo-700",
    paperStyle: "bg-[#fdfbf7] border-amber-100",
  },
  {
    id: "strawberry-cream",
    name: "Strawberry Cream",
    tagline: "Sweet vanilla, strawberries & cozy warmth",
    particleType: "heart",
    particleEmoji: "💖",
    bgGradient: "from-[#fff5f5] via-[#ffe3e3] to-[#ffc9c9]",
    bgClass: "bg-gradient-to-br from-[#fff5f5] via-[#ffe3e3] to-[#ffc9c9]",
    envelopeClass: "bg-[#ff8787] border-[#fa5252]",
    envelopeLining: "#ffe3e3",
    textColor: "text-[#671d1d]",
    accentColor: "#fa5252",
    badgeBg: "bg-red-100 text-red-700 border-red-200",
    paperStyle: "bg-[#fffdfa] border-red-100",
  },
  {
    id: "enchanted-cottage",
    name: "Fairytale Forest",
    tagline: "Dreamy sage mint, wildflowers & cozy calm",
    particleType: "leaf",
    particleEmoji: "🍃",
    bgGradient: "from-[#ebfbee] via-[#d3f9d8] to-[#b2f2bb]",
    bgClass: "bg-gradient-to-br from-[#ebfbee] via-[#d3f9d8] to-[#b2f2bb]",
    envelopeClass: "bg-[#69db7c] border-[#40c057]",
    envelopeLining: "#d3f9d8",
    textColor: "text-[#1b4332]",
    accentColor: "#2b8a3e",
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
    paperStyle: "bg-[#fefefe] border-emerald-100",
  },
  {
    id: "lavender-dream",
    name: "Lavender Whispers",
    tagline: "Serene lilac hues & gentle fairy dust",
    particleType: "sparkle",
    particleEmoji: "💜",
    bgGradient: "from-[#f3f0ff] via-[#e5dbff] to-[#d0bfff]",
    bgClass: "bg-gradient-to-br from-[#f3f0ff] via-[#e5dbff] to-[#d0bfff]",
    envelopeClass: "bg-[#b197fc] border-[#9775fa]",
    envelopeLining: "#e5dbff",
    textColor: "text-[#3b2d54]",
    accentColor: "#845ef7",
    badgeBg: "bg-purple-100 text-purple-700 border-purple-200",
    paperStyle: "bg-[#fbfaff] border-purple-100",
  },
];

export interface WaxSeal {
  id: string;
  name: string;
  color: string;
  borderColor: string;
  textColor: string;
  icon: string;
}

export const waxSeals: WaxSeal[] = [
  { id: "ruby-heart", name: "Ruby Heart", color: "from-[#b91c1c] to-[#7f1d1d]", borderColor: "#991b1b", textColor: "#fca5a5", icon: "❤️" },
  { id: "rose-bow", name: "Rose Ribbon", color: "from-[#ec4899] to-[#be185d]", borderColor: "#9d174d", textColor: "#fbcfe8", icon: "🎀" },
  { id: "gold-star", name: "Imperial Gold", color: "from-[#eab308] to-[#a16207]", borderColor: "#854d0e", textColor: "#fef08a", icon: "⭐" },
  { id: "emerald-clover", name: "Lucky Clover", color: "from-[#10b981] to-[#047857]", borderColor: "#065f46", textColor: "#a7f3d0", icon: "🍀" },
  { id: "lilac-moon", name: "Twilight Moon", color: "from-[#8b5cf6] to-[#5b21b6]", borderColor: "#4c1d95", textColor: "#ddd6fe", icon: "🌙" },
];

export const puzzles = [
  { 
    id: "memory", 
    name: "Memory Match", 
    description: "Flip & match cute romantic pairs to unlock", 
    icon: "🧩",
    difficulty: "Easy & Fun"
  },
  { 
    id: "unscramble", 
    name: "Word Unscramble", 
    description: "Guess a secret keyword or answer a sweet trivia question", 
    icon: "🔤",
    difficulty: "Thoughtful"
  },
  { 
    id: "find-rose", 
    name: "Find the Rose", 
    description: "Uncover the secret blooming rose hidden in the bouquet", 
    icon: "🌹",
    difficulty: "Quick & Cute"
  }
];

export const sampleLetterPresets = [
  {
    title: "Always & Forever 💕",
    message: "To the person who makes every day brighter: thank you for being my favorite part of every morning and my sweetest dream every night. Here's a little reminder of how loved you are!",
    ending: "Yours always, with all my love ❤️",
    puzzleAnswer: "LOVE",
    puzzleQuestion: "What brings us together?",
  },
  {
    title: "Happy Birthday Sweetheart 🎂",
    message: "Wishing the sweetest, most wonderful human the happiest birthday! May this year bring you all the warmth, joy, and laughter that you give everyone around you.",
    ending: "P.S. Save me a slice of cake! 🍰✨",
    puzzleAnswer: "SMILE",
    puzzleQuestion: "What lights up the room when you enter?",
  },
  {
    title: "Thinking of You 🌸",
    message: "Just a gentle surprise to remind you to take a deep breath and smile today. You are doing amazing, and I am so grateful to have you in my life.",
    ending: "Sending you the biggest warm hug! 🧸",
    puzzleAnswer: "HUGS",
    puzzleQuestion: "What do I want to give you right now?",
  }
];
