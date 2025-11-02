import type { AudioDestination } from "./types";

export default class Gain {
  audioContext: AudioContext;
  node: GainNode;
  value: number;

  constructor(destination: AudioDestination, audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.value = 0.01;
    this.node = this.buildNode(destination);
  }

  buildNode(destination: AudioDestination): GainNode {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = this.value;
    gainNode.connect(destination);
    return gainNode;
  }
}