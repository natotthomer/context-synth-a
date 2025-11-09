import type Filter from "./Filter";
import type Gain from "./Gain";

type OscillatorDestination = Filter | Gain;
type OscillatorParent = Filter | Gain;

export default class Oscillator {
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
    const oscillatorNode = this.audioContext.createOscillator();
    oscillatorNode.frequency.value = this.value;
    oscillatorNode.type = 'sawtooth';
    oscillatorNode.start();
    oscillatorNode.connect(destination.node);
    return oscillatorNode;
  }

  setValueAtTime(newFrequencyValue: number, offset: number = 0) {
    this.node.frequency.setValueAtTime(newFrequencyValue, this.audioContext.currentTime + offset);
  }
}
