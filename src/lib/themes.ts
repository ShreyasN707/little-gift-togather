export const themes = [
  {
    id: "sakura-garden",
    name: "Sakura Garden",
    colors: {
      background: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-100 via-rose-100 to-pink-200",
      envelope: "bg-gradient-to-br from-pink-300 to-rose-300 border border-white/40",
      text: "text-rose-950",
    },
    particleType: "blossom",
  },
  {
    id: "night-sky",
    name: "Moonlit Sky",
    colors: {
      background: "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-blue-950",
      envelope: "bg-gradient-to-br from-indigo-800 to-blue-900 border border-indigo-400/30",
      text: "text-indigo-100",
    },
    particleType: "star",
  },
  {
    id: "sunset-beach",
    name: "Sunset Beach",
    colors: {
      background: "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-300 via-rose-300 to-purple-400",
      envelope: "bg-gradient-to-br from-orange-400 to-red-400 border border-white/30",
      text: "text-orange-950",
    },
    particleType: "sparkle",
  },
  {
    id: "fairytale-forest",
    name: "Fairytale Forest",
    colors: {
      background: "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-100 via-emerald-100 to-teal-200",
      envelope: "bg-gradient-to-br from-emerald-600 to-teal-700 border border-emerald-300/40",
      text: "text-emerald-950",
    },
    particleType: "leaf",
  }
];

export const puzzles = [
  { id: "memory", name: "Memory Match" },
  { id: "unscramble", name: "Word Unscramble" },
  { id: "find-rose", name: "Find the Rose" }
];
