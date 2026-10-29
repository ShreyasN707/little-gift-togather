// 1990s Retro Audio Engine with Cassette Deck Mechanical Clunks, Tuning Static, and 90s Nostalgia Melodies

export interface RadioStation {
  id: string;
  name: string;
  genre: string;
  frequency: string;
  melody: number[];
  tempo: number;
}

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: "mixtape-lofi",
    name: "Mixtape Side A • 1994",
    genre: "90s Lofi Cassette Romance",
    frequency: "FM 98.5 MHz",
    tempo: 420,
    melody: [
      523.25, 659.25, 783.99, 1046.5, 880.0, 783.99, 659.25, 587.33,
      523.25, 659.25, 783.99, 1046.5, 1174.66, 1046.5, 880.0, 783.99,
      698.46, 880.0, 1046.5, 880.0, 659.25, 783.99, 880.0, 659.25,
      587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 523.25
    ],
  },
  {
    id: "city-pop",
    name: "Tokyo FM • Midnight Wave",
    genre: "1990s City Pop Nostalgia",
    frequency: "FM 103.2 MHz",
    tempo: 380,
    melody: [
      440.0, 523.25, 659.25, 880.0, 783.99, 659.25, 523.25, 587.33,
      659.25, 587.33, 523.25, 440.0, 392.0, 440.0, 523.25, 659.25,
      698.46, 783.99, 880.0, 1046.5, 880.0, 783.99, 659.25, 523.25,
    ],
  },
  {
    id: "slow-jam",
    name: "Golden Hour Radio • 1998",
    genre: "Sweet R&B Chime Ballad",
    frequency: "AM 880 kHz",
    tempo: 490,
    melody: [
      392.0, 493.88, 587.33, 783.99, 698.46, 587.33, 493.88, 587.33,
      659.25, 783.99, 880.0, 987.77, 880.0, 783.99, 659.25, 587.33,
      523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 523.25, 440.0,
    ],
  },
];

class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmPlaying = false;
  private currentStationIndex = 0;
  private bgmTimer: any = null;
  private isMuted = false;
  private stationCallbacks: ((playing: boolean, station: RadioStation) => void)[] = [];

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public subscribeStation(cb: (playing: boolean, station: RadioStation) => void) {
    this.stationCallbacks.push(cb);
    return () => {
      this.stationCallbacks = this.stationCallbacks.filter((c) => c !== cb);
    };
  }

  private notifyStation() {
    const station = RADIO_STATIONS[this.currentStationIndex];
    this.stationCallbacks.forEach((cb) => cb(this.bgmPlaying, station));
  }

  public getCurrentStation(): RadioStation {
    return RADIO_STATIONS[this.currentStationIndex];
  }

  public getIsPlaying(): boolean {
    return this.bgmPlaying;
  }

  // 1990s Mechanical Cassette Button Clunk / Click
  public playCassetteClunk() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Heavy plastic button mechanical snap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  // Radio static tuning noise
  public playTuningStatic() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const bufferSize = ctx.sampleRate * 0.18;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {}
  }

  public nextStation() {
    this.playCassetteClunk();
    this.playTuningStatic();
    this.currentStationIndex = (this.currentStationIndex + 1) % RADIO_STATIONS.length;
    if (this.bgmPlaying) {
      this.stopBgm();
      this.startBgm();
    } else {
      this.notifyStation();
    }
  }

  public toggleRadio() {
    this.playCassetteClunk();
    if (this.bgmPlaying) {
      this.stopBgm();
    } else {
      this.playTuningStatic();
      setTimeout(() => {
        this.startBgm();
      }, 120);
    }
    return this.bgmPlaying;
  }

  public playPop() {
    this.playCassetteClunk();
  }

  public playChime(freq = 659.25) {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {}
  }

  public playSealPop() {
    this.playCassetteClunk();
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const t = now + 0.05 + idx * 0.04;
        o.type = "triangle";
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t);
        o.stop(t + 0.3);
      });
    } catch {}
  }

  public playVictoryFanfare() {
    if (this.isMuted) return;
    try {
      const notes = [
        { f: 523.25, d: 0.14 },
        { f: 659.25, d: 0.14 },
        { f: 783.99, d: 0.16 },
        { f: 1046.5, d: 0.35 },
      ];
      let delay = 0;
      notes.forEach((n) => {
        setTimeout(() => this.playChime(n.f), delay * 1000);
        delay += n.d;
      });
    } catch {}
  }

  public toggleBgm(onStateChange?: (playing: boolean) => void) {
    if (this.bgmPlaying) {
      this.stopBgm();
      onStateChange?.(false);
      return false;
    } else {
      this.isMuted = false;
      this.startBgm();
      onStateChange?.(true);
      return true;
    }
  }

  public startBgm() {
    if (this.bgmPlaying) return;
    const ctx = this.initCtx();
    if (!ctx) return;
    this.bgmPlaying = true;
    this.notifyStation();

    const station = RADIO_STATIONS[this.currentStationIndex];
    const melody = station.melody;
    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.bgmPlaying || this.isMuted) return;
      try {
        const c = this.initCtx();
        if (c) {
          const osc = c.createOscillator();
          const gain = c.createGain();
          const now = c.currentTime;

          // Warm synthesizer chime tone
          osc.type = "sine";
          const freq = melody[noteIndex % melody.length];
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

          osc.connect(gain);
          gain.connect(c.destination);

          osc.start(now);
          osc.stop(now + 0.42);

          noteIndex++;
        }
      } catch {}
      this.bgmTimer = setTimeout(playNextNote, station.tempo);
    };

    playNextNote();
  }

  public stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.notifyStation();
  }
}

export const sounds = new SoundManager();
