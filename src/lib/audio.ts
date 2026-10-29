// Vintage Web Audio API sound engine
// Supports radio tuning static, gramophone music box stations, pops, and chimes

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
    id: "gramophone-waltz",
    name: "1924 Gramophone Waltz",
    genre: "Antique Music Box",
    frequency: "94.2 AM",
    tempo: 450,
    melody: [
      523.25, 659.25, 783.99, 1046.5, 880.0, 783.99, 659.25, 587.33,
      523.25, 659.25, 783.99, 1046.5, 1174.66, 1046.5, 880.0, 783.99,
      698.46, 880.0, 1046.5, 880.0, 659.25, 783.99, 880.0, 659.25,
      587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 523.25
    ],
  },
  {
    id: "moonlight-serenade",
    name: "Midnight Serenade",
    genre: "Nocturne Chimes",
    frequency: "101.5 FM",
    tempo: 520,
    melody: [
      440.0, 523.25, 659.25, 880.0, 783.99, 659.25, 523.25, 587.33,
      659.25, 587.33, 523.25, 440.0, 392.0, 440.0, 523.25, 659.25,
      698.46, 783.99, 880.0, 1046.5, 880.0, 783.99, 659.25, 523.25,
    ],
  },
  {
    id: "cafe-romance",
    name: "Parisian Café Echo",
    genre: "Sweet Accordion Music Box",
    frequency: "88.7 AM",
    tempo: 380,
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
    if (this.bgmPlaying) {
      this.stopBgm();
    } else {
      this.playTuningStatic();
      setTimeout(() => {
        this.startBgm();
      }, 150);
    }
    return this.bgmPlaying;
  }

  public playPop() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.07);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
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
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Deep tactile wax pop
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(240, now);
      osc1.frequency.exponentialRampToValueAtTime(90, now + 0.14);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.14);

      // Gold shimmer chime
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

          osc.type = "sine";
          const freq = melody[noteIndex % melody.length];
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.07, now);
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
