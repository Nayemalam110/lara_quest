// ==============================================================================
// 🔊 LaraQuest Synthesized Web Audio Sound Engine
// Crisp, zero-dependency browser synthesized audio chimes for gamified feedback
// ==============================================================================

const SOUND_STORAGE_KEY = 'laraquest_sound_enabled';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    try {
      const stored = localStorage.getItem(SOUND_STORAGE_KEY);
      this.enabled = stored !== null ? stored === 'true' : true;
    } catch {
      this.enabled = true;
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enable: boolean): void {
    this.enabled = enable;
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, String(enable));
    } catch {}
  }

  public toggle(): boolean {
    const next = !this.enabled;
    this.setEnabled(next);
    if (next) this.playClickTick();
    return next;
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  // 🎵 Pleasant harmonious chime (C5 - E5 - G5 - C6) for challenge completions
  public playSuccessChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const startTime = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.08);

      gain.gain.setValueAtTime(0, startTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, startTime + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + i * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + i * 0.08);
      osc.stop(startTime + i * 0.08 + 0.36);
    });
  }

  // 🎺 Triumphant ascending fanfare for level ups & certificates
  public playLevelUpFanfare(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const chords = [
      { freq: 440.0, time: 0.0 }, // A4
      { freq: 554.37, time: 0.1 }, // C#5
      { freq: 659.25, time: 0.2 }, // E5
      { freq: 880.0, time: 0.35 }, // A5
    ];

    const startTime = ctx.currentTime;

    chords.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + time);

      gain.gain.setValueAtTime(0, startTime + time);
      gain.gain.linearRampToValueAtTime(0.18, startTime + time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + time + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + time);
      osc.stop(startTime + time + 0.65);
    });
  }

  // 🎯 Sparkle chime for daily quest claims
  public playQuestCompleted(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [659.25, 880.0, 1174.66]; // E5, A5, D6
    const startTime = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.06);

      gain.gain.setValueAtTime(0.15, startTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + i * 0.06 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + i * 0.06);
      osc.stop(startTime + i * 0.06 + 0.42);
    });
  }

  // 🔘 Subtle mechanical tick for button taps
  public playClickTick(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, startTime);
    osc.frequency.exponentialRampToValueAtTime(200, startTime + 0.02);

    gain.gain.setValueAtTime(0.05, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.035);
  }
}

export const soundFx = new SoundEngine();
