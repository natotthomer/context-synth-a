import type Analyser from "./Analyser";
import type Filter from "./Filter";
import type Oscillator from "./Oscillator";

type GainDestination = Gain | Filter | Analyser | AudioNode;
type GainParent = Gain | Filter | Analyser;
type GainChildren = Gain | Filter | Oscillator | Analyser;

export default class Gain {
  audioContext: AudioContext;
  node: GainNode;
  value: number;
  parent?: GainParent;
  children?: GainChildren[];

  constructor(destination: GainDestination, audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.value = 1;
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
