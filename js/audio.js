/**
 * Audio Engine para Kiddo: Sintetizador Web Audio API, Piano Virtual y Música Relajante
 */

class KiddoAudioEngine {
  constructor() {
    this.ctx = null;
    this.activeAmbientSound = null;
    this.ambientInterval = null;
    this.masterGain = null;

    // Frecuencias para notas musicales (C4 a C5)
    this.noteFrequencies = {
      'DO': 261.63,
      'RE': 293.66,
      'MI': 329.63,
      'FA': 349.23,
      'SOL': 392.00,
      'LA': 440.00,
      'SI': 493.88,
      'DO-HIGH': 523.25
    };
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Reproducir una nota del piano con timbre cálido y suave
  playPianoNote(noteKey, duration = 1.2) {
    this.init();
    const freq = this.noteFrequencies[noteKey] || 440;
    const now = this.ctx.currentTime;

    // Oscilador principal (onda triangular/senoidal cálida)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now); // Armónico dulce

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + duration);

    // Envolvente ADSR suave para evitar clics
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.5, now + 0.03); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // Decay / Release

    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.2, now);

    osc1.connect(filter);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // Sonido de click / burbuja suave para botones
  playBubbleSound() {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Sonido de campana celestial / logro
  playSuccessChime() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // Acorde mayor
    notes.forEach((f, i) => {
      setTimeout(() => {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.8);
      }, i * 90);
    });
  }

  // Reproducir música relajante generativa según el instrumento elegido
  playRelaxingTrack(trackId) {
    this.stopRelaxingTrack();
    this.init();
    this.activeAmbientSound = trackId;

    if (trackId === 'rel-piano') {
      // Melodía lenta y pacífica de piano
      const notes = [261.63, 329.63, 392.00, 440.00, 523.25, 392.00, 329.63];
      let step = 0;
      this.playPianoNote('DO', 2.0);
      this.ambientInterval = setInterval(() => {
        const freq = notes[step % notes.length];
        const key = Object.keys(this.noteFrequencies).find(k => Math.abs(this.noteFrequencies[k] - freq) < 1) || 'DO';
        this.playPianoNote(key, 2.5);
        step++;
      }, 1600);

    } else if (trackId === 'rel-harp') {
      // Arpegio brillante y sereno
      const scale = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 659.25, 523.25];
      let step = 0;
      this.ambientInterval = setInterval(() => {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(scale[step % scale.length], now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 1.2);
        step++;
      }, 500);

    } else if (trackId === 'rel-violin') {
      // Ondas suaves simulando violín
      const violinNotes = [329.63, 392.00, 440.00, 392.00];
      let step = 0;
      this.ambientInterval = setInterval(() => {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const vibrato = this.ctx.createOscillator();
        const vibratoGain = this.ctx.createGain();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(violinNotes[step % violinNotes.length], now);

        vibrato.frequency.setValueAtTime(5, now);
        vibratoGain.gain.setValueAtTime(4, now);
        vibrato.connect(osc.frequency);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        vibrato.start(now);
        osc.start(now);
        vibrato.stop(now + 3.0);
        osc.stop(now + 3.0);

        step++;
      }, 3200);

    } else if (trackId === 'rel-rain') {
      // Generador de lluvia suave mediante ruido blanco filtrado
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
      this.rainSource = noise;
    }
  }

  stopRelaxingTrack() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.rainSource) {
      try { this.rainSource.stop(); } catch(e) {}
      this.rainSource = null;
    }
    this.activeAmbientSound = null;
  }
}

window.kiddoAudio = new KiddoAudioEngine();
