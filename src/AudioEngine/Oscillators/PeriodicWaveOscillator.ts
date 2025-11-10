import type { OscillatorDestination, OscillatorParent } from "./types";

export default class PeriodicWaveOscillator {
  audioContext: AudioContext;
  node: OscillatorNode;
  value: number;
  parent: OscillatorParent;

  constructor(destination: OscillatorDestination, audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.value = 440;
    this.node = this.buildNode(destination);
    this.parent = destination;
    this.parent.children?.push(this);
  }

  buildNode(destination: OscillatorDestination): OscillatorNode {
    // const real = new Float32Array(64);
    // const imag = new Float32Array(64);
    const duty = 0.01;
    const maxHarmonic = 64;

    // // Initialize all to zero (DC component and even harmonics should be 0)
    // real.fill(0);
    // imag.fill(0);

    // // Square wave Fourier series: f(t) = (4/π) * Σ(n=1,3,5,...) [sin(2πnft) / n]
    // // Only odd harmonics (1, 3, 5, 7, ...) contribute
    // // For harmonic n: amplitude = 1/n, sign alternates: +1, -1, +1, -1, ...
    // // Web Audio API will normalize automatically to prevent clipping
    
    // for (let i = 1; i <= maxHarmonic; i += 2) {
    //   // Harmonic n: coefficient = (-1)^((n-1)/2) / n
    //   // This gives: +1/1, -1/3, +1/5, -1/7, ... for harmonics 1, 3, 5, 7, ...
    //   // For i=1: sign = (-1)^0 = 1, imag[1] = 1/1 = 1.0
    //   // For i=3: sign = (-1)^1 = -1, imag[3] = -1/3 ≈ -0.333
    //   // For i=5: sign = (-1)^2 = 1, imag[5] = 1/5 = 0.2
    //   // For i=7: sign = (-1)^3 = -1, imag[7] = -1/7 ≈ -0.143
    //   imag[i] = 4/(Math.PI * i);
    //   // real[i] remains 0 (no cosine terms for square wave)
    // }

    const real = new Float32Array(maxHarmonic);
    const imag = new Float32Array(maxHarmonic);

    // DC offset (optional, ignored when normalization is enabled)
    real[0] = 2 * duty - 1;

    for (let n = 1; n <= maxHarmonic; n++) {
      const a = 2 * Math.PI * n * duty;

      real[n] = (2 / (Math.PI * n)) * Math.sin(a);
      imag[n] = (2 / (Math.PI * n)) * (1 - Math.cos(a));
    }

    // Let Web Audio API normalize automatically (default behavior)
    const wave = this.audioContext.createPeriodicWave(real, imag, { disableNormalization: true });
    const oscillatorNode = this.audioContext.createOscillator();
    oscillatorNode.frequency.value = this.value;
    oscillatorNode.setPeriodicWave(wave);
    oscillatorNode.start();
    oscillatorNode.connect(destination.node);
    return oscillatorNode;
  }

  setValueAtTime(newFrequencyValue: number, offset: number = 0) {
    this.node.frequency.setValueAtTime(newFrequencyValue, this.audioContext.currentTime + offset);
  }
}