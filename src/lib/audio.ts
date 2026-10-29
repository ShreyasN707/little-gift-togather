// Cute synthesized sound effects and gentle music box using Web Audio API
// 100% self-contained, no external mp3 assets required!

class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmPlaying = false;
  private bgmTimer: any = null;
  private isMuted = false;

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

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.bgmPlaying) {
      this.stopBgm();
    }
    return this.isMuted;
  }

  // Soft, bubbly pop sound on click/tap
  public playPop() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio not permitted or supported
    }
  }

  // Cute bell chime on puzzle match / success
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

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // Audio error
    }
  }

  // Wax seal breaking pop with sparkle
  public playSealPop() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Pop base
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(260, now);
      osc1.frequency.exponentialRampToValueAtTime(120, now + 0.12);
      gain1.gain.setValueAtTime(0.4, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Sparkle chime
      [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const t = now + 0.06 + idx * 0.05;
        o.type = "triangle";
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t);
        o.stop(t + 0.3);
      });
    } catch {
      // Audio error
    }
  }

  // Celebratory sweet fanfare when puzzle completes
  public playVictoryFanfare() {
    if (this.isMuted) return;
    try {
      const notes = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.14 }, // G5
        { f: 1046.5, d: 0.35 }, // C6
        { f: 880.0, d: 0.12 },  // A5
        { f: 1046.5, d: 0.5 },  // C6
      ];
      let delay = 0;
      notes.forEach((n) => {
        setTimeout(() => this.playChime(n.f), delay * 1000);
        delay += n.d;
      });
    } catch {
      // Audio error
    }
  }

  // Gentle music box lullaby loop
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

  public isBgmActive(): boolean {
    return this.bgmPlaying;
  }

  public startBgm() {
    if (this.bgmPlaying) return;
    const ctx = this.initCtx();
    if (!ctx) return;
    this.bgmPlaying = true;

    // Sweet gentle music box arpeggio melody (Canon in D / Love theme inspired)
    const melody = [
      523.25, 659.25, 783.99, 1046.5,
      440.00, 554.37, 659.25, 880.00,
      392.00, 493.88, 587.33, 783.99,
      349.23, 440.00, 523.25, 698.46,
      392.00, 493.88, 587.33, 783.99,
      523.25, 659.25, 783.99, 1046.5,
    ];
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

          // Music box soft envelope
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

          osc.connect(gain);
          gain.connect(c.destination);

          osc.start(now);
          osc.stop(now + 0.45);

          noteIndex++;
        }
      } catch {
        // Audio error
      }
      this.bgmTimer = setTimeout(playNextNote, 400);
    };

    playNextNote();
  }

  public stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const sounds = new SoundManager();
