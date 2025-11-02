import type { AudioDestination } from "./types";

export default class Oscillator {
  audioContext: AudioContext;
  node: OscillatorNode;
  value: number;

  constructor(destination: AudioDestination, audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.value = 440;
    this.node = this.buildNode(destination);
  }

  buildNode(destination: AudioDestination): OscillatorNode {
    const oscillatorNode = this.audioContext.createOscillator();
    oscillatorNode.frequency.value = this.value;
    oscillatorNode.type = 'sawtooth';
    oscillatorNode.start();
    oscillatorNode.connect(destination);
    return oscillatorNode;
  }

  setValueAtTime(newFrequencyValue: number, offset: number = 0) {
    this.node.frequency.setValueAtTime(newFrequencyValue, this.audioContext.currentTime + offset);
  }
}