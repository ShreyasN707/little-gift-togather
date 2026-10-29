export interface EnvelopeStyle {
  id: string;
  name: string;
  tagline: string;
  era: string;
  accent: string;
}

export const envelopeStyles: EnvelopeStyle[] = [
  {
    id: "vintage-airmail",
    name: "1924 Transatlantic Airmail",
    tagline: "Classic diagonal red & navy chevron border with London postmarks",
    era: "Circa 1924",
    accent: "#9E2A2B",
  },
  {
    id: "victorian-gilded",
    name: "Royal Victorian Gilded",
    tagline: "Deep antique crimson with ornate gold filigree floral scroll framing",
    era: "Circa 1890",
    accent: "#C59B48",
  },
  {
    id: "parchment-twine",
    name: "Rustic Parchment & Twine",
    tagline: "Aged deckled parchment envelope tied with vintage courier twine",
    era: "Circa 1850",
    accent: "#7A5230",
  },
  {
    id: "celestial-noir",
    name: "Midnight Constellation Folio",
    tagline: "Deep indigo parchment with gold foil astronomical stars and moon seal",
    era: "Astronomical",
    accent: "#E2C37A",
  },
  {
    id: "botanical-herbarium",
    name: "Botanical Herbarium",
    tagline: "Sage green antique paper with pressed fern and olive botanical stamps",
    era: "Victorian Garden",
    accent: "#3F5E46",
  },
  {
    id: "art-deco-noir",
    name: "1925 Art Deco Speakeasy",
    tagline: "Glossy obsidian foil with 24K geometric chevron gilding & Gatsby postmark",
    era: "Roaring 1920s",
    accent: "#E5C158",
  },
  {
    id: "retro-vinyl-gold",
    name: "1974 Golden Vinyl Hi-Fi",
    tagline: "Warm mustard-gold album sleeve with analog stereo record postmarks",
    era: "Analog 1970s",
    accent: "#D97706",
  },
  {
    id: "cyber-holo-foil",
    name: "2084 Orbital Holo-Foil",
    tagline: "Iridescent prism foil envelope with luminous cyan cyber glyphs",
    era: "Neo-Tokyo 2084",
    accent: "#06B6D4",
  },
];

export interface LetterStyle {
  id: string;
  name: string;
  tagline: string;
  paperBg: string;
  paperClass: string;
  textColor: string;
  crest: string;
}

export const letterStyles: LetterStyle[] = [
  {
    id: "aged-parchment",
    name: "Tea-Stained Aged Parchment",
    tagline: "Warm sepia tea-wash with subtle burnished edges and antique ruled lines",
    paperBg: "aged-parchment",
    paperClass: "border-amber-900/40 text-[#28160c]",
    textColor: "#26150b",
    crest: "⚜",
  },
  {
    id: "love-poem-folio",
    name: "Pressed Wildflower Folio",
    tagline: "Deckled ivory cotton paper with delicate pressed botanical rose margins",
    paperBg: "bg-[#FDF9F3]",
    paperClass: "border-rose-950/30 text-[#2d1b1f]",
    textColor: "#2c171d",
    crest: "⚘",
  },
  {
    id: "royal-decree",
    name: "Gilded Monogram Vellum",
    tagline: "Crisp vellum with royal gold leaf border and heraldic crest letterhead",
    paperBg: "bg-[#FAF7F0]",
    paperClass: "gold-embossed-border text-[#1f1712]",
    textColor: "#1f1712",
    crest: "👑",
  },
  {
    id: "celestial-parchment",
    name: "Midnight Stardust Sheet",
    tagline: "Deep navy parchment illuminated by stardust and gold calligraphy",
    paperBg: "bg-[#161B26]",
    paperClass: "border-amber-500/30 text-[#F5EEDB]",
    textColor: "#F5EEDB",
    crest: "✧",
  },
  {
    id: "antique-typewriter",
    name: "1940s Typewriter Dispatch",
    tagline: "Off-white typewriter bond paper with authentic ink ribbon stamp marks",
    paperBg: "bg-[#F5F2EB]",
    paperClass: "border-stone-400 text-stone-900",
    textColor: "#1c1b18",
    crest: "⌨",
  },
  {
    id: "art-deco-gold",
    name: "Speakeasy Velvet Vellum",
    tagline: "Crisp obsidian vellum with geometric gold fan border & jazz club watermark",
    paperBg: "bg-[#0d0f14]",
    paperClass: "border-amber-400/50 text-[#fcedc7]",
    textColor: "#fcedc7",
    crest: "🪶",
  },
  {
    id: "vintage-liner-notes",
    name: "1970s Vinyl Liner Notes",
    tagline: "Heavy cream album liner paper with warm retro typography & groove marks",
    paperBg: "bg-[#fdf8ee]",
    paperClass: "border-amber-800/40 text-[#2b180d]",
    textColor: "#26150b",
    crest: "♫",
  },
  {
    id: "cyber-datapad",
    name: "Holographic Cyber Datapad",
    tagline: "Matte carbon obsidian sheet with illuminated cyan circuits & monospace code",
    paperBg: "bg-[#060b13]",
    paperClass: "border-cyan-500/50 text-[#e0f2fe]",
    textColor: "#e0f2fe",
    crest: "⏣",
  },
];

export interface VintageBadge {
  id: string;
  name: string;
  title: string;
  symbol: string;
  color: string;
  description: string;
}

export const vintageBadges: VintageBadge[] = [
  {
    id: "keeper-of-heart",
    name: "Keeper of the Heart",
    title: "Order of Eternal Fondness",
    symbol: "⚜",
    color: "from-amber-600 via-yellow-500 to-amber-700 border-amber-400",
    description: "Awarded to the one who holds all affection and quiet trust.",
  },
  {
    id: "eternal-rose",
    name: "The Eternal Rose",
    title: "Medal of Timeless Devotion",
    symbol: "⚘",
    color: "from-rose-800 via-rose-700 to-red-950 border-rose-400",
    description: "For the bloom that never fades, through every passing season.",
  },
  {
    id: "guiding-star",
    name: "North Compass Star",
    title: "Navigational Honor",
    symbol: "✦",
    color: "from-indigo-900 via-blue-800 to-indigo-950 border-cyan-300",
    description: "Guiding light in the darkest skies, steadfast and true.",
  },
  {
    id: "secret-keeper",
    name: "Brass Skeleton Key",
    title: "Order of Sacred Confidence",
    symbol: "🗝",
    color: "from-amber-700 via-amber-600 to-amber-900 border-amber-300",
    description: "Granted to the sole guardian of all unspoken secrets.",
  },
  {
    id: "first-class-love",
    name: "Royal Airmail Post",
    title: "Imperial Dispatch Medal",
    symbol: "✉",
    color: "from-red-900 via-amber-700 to-blue-900 border-amber-300",
    description: "Carried across continents with first-class courier priority.",
  },
  {
    id: "jazz-age-feather",
    name: "Golden Quill of Gatsby",
    title: "Order of the Jazz Age",
    symbol: "🪶",
    color: "from-amber-400 via-yellow-500 to-amber-700 border-yellow-200",
    description: "Awarded for timeless elegance and high-society flair.",
  },
  {
    id: "golden-vinyl",
    name: "Analog Master Grooves",
    title: "Solid-State Hi-Fi Medal",
    symbol: "♫",
    color: "from-amber-700 via-orange-600 to-amber-900 border-amber-300",
    description: "Cut on 180g virgin vinyl with pure analog warmth.",
  },
  {
    id: "cyber-core",
    name: "Quantum Orbital Link",
    title: "Neo-Tokyo 2084 Core",
    symbol: "⏣",
    color: "from-cyan-600 via-blue-600 to-indigo-900 border-cyan-300",
    description: "Encrypted memory fragment transmitted across the neural net.",
  },
];

export interface WaxSeal {
  id: string;
  name: string;
  color: string;
  borderColor: string;
  textColor: string;
  symbol: string;
}

export const waxSeals: WaxSeal[] = [
  {
    id: "burgundy-monogram",
    name: "Burgundy Signet",
    color: "from-[#801726] to-[#500C17]",
    borderColor: "#420A13",
    textColor: "#F1B7BF",
    symbol: "⚜",
  },
  {
    id: "antique-gold",
    name: "Imperial Gold",
    color: "from-[#C49B45] to-[#8C6824]",
    borderColor: "#694C15",
    textColor: "#FFF0C4",
    symbol: "✦",
  },
  {
    id: "forest-botanical",
    name: "Forest Botanical",
    color: "from-[#294B37] to-[#173022]",
    borderColor: "#12251A",
    textColor: "#C0DEC8",
    symbol: "𐇲",
  },
  {
    id: "terracotta-wax",
    name: "Terracotta Clay",
    color: "from-[#B0523C] to-[#7B3222]",
    borderColor: "#5F2417",
    textColor: "#F5C2B6",
    symbol: "♥",
  },
  {
    id: "midnight-navy",
    name: "Midnight Navy",
    color: "from-[#1F2C3F] to-[#121B27]",
    borderColor: "#0B1119",
    textColor: "#BAC9E0",
    symbol: "☽",
  },
  {
    id: "deco-emerald",
    name: "Art Deco Emerald",
    color: "from-[#064e3b] to-[#022c22]",
    borderColor: "#022c22",
    textColor: "#a7f3d0",
    symbol: "🪶",
  },
  {
    id: "amber-vinyl-wax",
    name: "1974 Golden Amber",
    color: "from-[#b45309] to-[#78350f]",
    borderColor: "#451a03",
    textColor: "#fde68a",
    symbol: "♫",
  },
  {
    id: "neon-cyber-core",
    name: "Holo Cyber Core",
    color: "from-[#0891b2] to-[#0e7490]",
    borderColor: "#164e63",
    textColor: "#cffafe",
    symbol: "⏣",
  },
];

export const puzzles = [
  {
    id: "memory",
    name: "Archival Memory Match",
    description: "Pair classic engraved symbols to break the seal",
    category: "Engraved Pairs",
  },
  {
    id: "unscramble",
    name: "Cipher Decryption",
    description: "Reorder letterforms to decipher a secret memory",
    category: "Letter Lock",
  },
  {
    id: "find-rose",
    name: "Botanical Discovery",
    description: "Find the single wild blossom in the herbarium",
    category: "Seek & Find",
  },
];

export interface Theme {
  id: string;
  name: string;
  bgClass: string;
  envelopeClass: string;
  envelopeBorder: string;
  envelopeLining: string;
  textColor: string;
  accentColor: string;
  paperBg: string;
  paperBorder: string;
  particleSymbol: string;
}

export const themes: Theme[] = [
  {
    id: "linen-natural",
    name: "Natural Linen",
    bgClass: "dark-parchment-desk",
    envelopeClass: "bg-[#EAE4D9]",
    envelopeBorder: "#D8CEBE",
    envelopeLining: "#F2ECE2",
    textColor: "text-[#2B2723]",
    accentColor: "#9C4E3D",
    paperBg: "aged-parchment",
    paperBorder: "border-[#E7E0D3]",
    particleSymbol: "✦",
  },
];

export const sampleLetterPresets = [
  {
    title: "Lamplight Devotion",
    message:
      "I sit by the lamplight tonight thinking of the distance between us, and the quiet comfort you bring to my thoughts.\n\nTime and again, you make the rush of the world fall still. There is no one in this life whose company I cherish more deeply, in conversation or in silence. Until the morning brings us together again, know that you are held in the highest and warmest corner of my heart.",
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
