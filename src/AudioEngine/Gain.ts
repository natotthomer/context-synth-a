import type Filter from "./Filter";
import type Oscillator from "./Oscillator";

type GainDestination = Gain | Filter | AudioNode;
type GainParent = Gain | Filter;
type GainChildren = Gain | Filter | Oscillator;

export default class Gain {
  audioContext: AudioContext;
  node: GainNode;
  value: number;
  parent?: GainParent;
  children?: GainChildren[];

  constructor(destination: GainDestination, audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.value = 0.01;
    this.node = this.buildNode(destination);
    this.parent = 'parent' in destination ? destination.parent : undefined;
    if (this.parent) {
      this.parent.children?.push(this);
    }
  }

  buildNode(destination: GainDestination): GainNode {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = this.value;
    const destinationNode = 'node' in destination ? destination.node : destination;
    gainNode.connect(destinationNode);
    return gainNode;
  }
}
