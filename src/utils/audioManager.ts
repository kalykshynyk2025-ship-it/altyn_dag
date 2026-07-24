/**
 * Audio Manager using Web Audio API Synthesizer
 * Produces authentic epic ethnic soundscapes (drones, throat singing tones, horse hooves, arrow release, coin pickup)
 */

class AudioManager {
  private ctx: AudioContext | null = null;
  private soundVolume: number = 0.8;
  private musicVolume: number = 0.6;
  private isMuted: boolean = false;
  private musicInterval: any = null;
  private isMusicPlaying: boolean = false;

  constructor() {
    // Lazy AudioContext initialization on first touch/click
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(sound: number, music: number) {
    this.soundVolume = sound;
    this.musicVolume = music;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopMusic();
    }
  }

  // Play sound FX for jump
  public playJumpSound() {
    if (this.isMuted || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(380, this.ctx.currentTime + 0.25);
    
    gain.gain.setValueAtTime(0.25 * this.soundVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.26);
  }

  // Play sound FX for slide
  public playSlideSound() {
    if (this.isMuted || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3 * this.soundVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  // Play sound FX for collecting gold token
  public playTokenSound() {
    if (this.isMuted || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.08); // A5

    gain.gain.setValueAtTime(0.2 * this.soundVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.21);
  }

  // Play Bow Shot
  public playBowShot() {
    if (this.isMuted || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.35 * this.soundVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  // Play Enemy Hit / Destruction
  public playHitSound() {
    if (this.isMuted || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.4 * this.soundVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.26);
  }

  // Play Powerup Grab
  public playPowerUpSound() {
    if (this.isMuted || this.soundVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880]; // A Major arpeggio
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0.2 * this.soundVolume, this.ctx!.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.06 + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + idx * 0.06);
      osc.stop(this.ctx!.currentTime + idx * 0.06 + 0.19);
    });
  }

  // Ethnic Steppe Ambient Music Synth (String Drone + Throat Harmonic simulation)
  public startAmbientMusic() {
    if (this.isMusicPlaying || this.isMuted || this.musicVolume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    this.isMusicPlaying = true;

    // Rhythmic pentatonic sequence simulating Tuvan folk melody
    const pentatonicScale = [146.83, 164.81, 196.00, 220.00, 261.63, 293.66]; // D3, E3, G3, A3, C4, D4
    let noteIndex = 0;

    this.musicInterval = setInterval(() => {
      if (!this.ctx || this.isMuted || this.musicVolume <= 0) return;

      // Base drone note (Ikhil / Morin Khuur simulation)
      const droneOsc = this.ctx.createOscillator();
      const droneGain = this.ctx.createGain();
      droneOsc.type = 'sawtooth';
      droneOsc.frequency.setValueAtTime(146.83 / 2, this.ctx.currentTime); // D2 Low Drone

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, this.ctx.currentTime);

      droneGain.gain.setValueAtTime(0.08 * this.musicVolume, this.ctx.currentTime);
      droneGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

      droneOsc.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(this.ctx.destination);

      droneOsc.start();
      droneOsc.stop(this.ctx.currentTime + 0.85);

      // Melody tone (Throat singing overtone simulation)
      if (Math.random() > 0.3) {
        const melFreq = pentatonicScale[noteIndex % pentatonicScale.length];
        noteIndex += Math.floor(Math.random() * 2) + 1;

        const melOsc = this.ctx.createOscillator();
        const melGain = this.ctx.createGain();
        melOsc.type = 'sine';
        melOsc.frequency.setValueAtTime(melFreq, this.ctx.currentTime);

        melGain.gain.setValueAtTime(0.12 * this.musicVolume, this.ctx.currentTime);
        melGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

        melOsc.connect(melGain);
        melGain.connect(this.ctx.destination);

        melOsc.start();
        melOsc.stop(this.ctx.currentTime + 0.46);
      }
    }, 450);
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isMusicPlaying = false;
  }
}

export const audioManager = new AudioManager();
