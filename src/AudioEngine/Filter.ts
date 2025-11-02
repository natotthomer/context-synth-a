import type { AudioDestination } from "./types";

export default class Filter {
  audioContext: AudioContext;
  node: BiquadFilterNode;
  value: number;

  constructor(destination: AudioDestination, audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.value = 10000;
    this.node = this.buildNode(destination);
  }

  buildNode(destination: AudioDestination): BiquadFilterNode {
    const filterNode = this.audioContext.createBiquadFilter();
    filterNode.frequency.value = this.value;
    filterNode.connect(destination);
    return filterNode;
  }
}
