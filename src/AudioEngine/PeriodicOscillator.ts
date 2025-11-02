import type { AudioDestination } from "./types";

export default class PeriodicOscillator {
  audioContext: AudioContext;
  node: OscillatorNode;
  value: number;

  constructor(destination: AudioDestination, audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.value = 440;
    this.node = this.buildNode(destination);
  }

  buildNode(destination: AudioDestination): OscillatorNode {
    const real = new Float32Array(64);
    const imag = new Float32Array(64);
    const harmonics = 64;

    for (let i = 1; i <= harmonics; i++) {
      real[i] = 0.0;
      imag[i] = ((i % 2 === 0) ? -1 : 1) / i; // (-1)^(n+1) / n
    }

    console.log(imag)
    const wave = this.audioContext.createPeriodicWave(real, imag);
    const oscillatorNode = this.audioContext.createOscillator();
    oscillatorNode.frequency.value = this.value;
    oscillatorNode.setPeriodicWave(wave);
    oscillatorNode.start();
    oscillatorNode.connect(destination);
    return oscillatorNode;
  }

  setValueAtTime(newFrequencyValue: number, offset: number = 0) {
    this.node.frequency.setValueAtTime(newFrequencyValue, this.audioContext.currentTime + offset);
  }
}