// AudioManager.js — Web Audio API-based audio management
import { GameState } from './GameState.js';

class AudioManagerClass {
  constructor() {
    this.ctx = null;
    this.bgGain = null;
    this.sfxGain = null;
    this.bgOscillator = null;
    this.isPlaying = false;
  }

  _initContext() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.bgGain = this.ctx.createGain();
      this.bgGain.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.connect(this.ctx.destination);
      this._updateVolumes();
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  _updateVolumes() {
    if (!this.ctx) return;
    const state = GameState.state.audio;
    this.bgGain.gain.value = (state.bgVolume / 100) * 0.15;
    this.sfxGain.gain.value = (state.sfxVolume / 100) * 0.5;
  }

  updateVolumes() {
    this._updateVolumes();
  }

  playClick() {
    this._initContext();
    if (!this.ctx) return;
    this._updateVolumes();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playSuccess() {
    this._initContext();
    if (!this.ctx) return;
    this._updateVolumes();

    [523, 659, 784].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.12 + 0.3);
      osc.start(this.ctx.currentTime + i * 0.12);
      osc.stop(this.ctx.currentTime + i * 0.12 + 0.3);
    });
  }

  playError() {
    this._initContext();
    if (!this.ctx) return;
    this._updateVolumes();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.3);
  }

  startBgMusic() {
    this._initContext();
    if (!this.ctx || this.isPlaying) return;
    this._updateVolumes();

    // Ambient space drone
    const createDrone = (freq, type = 'sine') => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      osc.type = type;
      osc.frequency.value = freq;
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      osc.connect(filter);
      filter.connect(this.bgGain);
      osc.start();
      return osc;
    };

    this._drones = [
      createDrone(55, 'sine'),
      createDrone(82.5, 'triangle'),
      createDrone(110, 'sine'),
    ];
    this.isPlaying = true;
  }

  stopBgMusic() {
    if (this._drones) {
      this._drones.forEach(d => {
        try { d.stop(); } catch(e) {}
      });
      this._drones = null;
    }
    this.isPlaying = false;
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
}

export const AudioManager = new AudioManagerClass();
