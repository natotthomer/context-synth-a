import type Analyser from "./Analyser";
import type Filter from "./Filter";
import type Oscillator from "./Oscillators/Oscillator";

type GainDestination = Gain | Filter | Analyser | AudioNode;
type GainParent = Gain | Filter | Analyser;
type GainChildren = Gain | Filter | Oscillator | Analyser;
type GainOptions = {
  inverse?: boolean;
  initialGain?: number;
}

export default class Gain {
  audioContext: AudioContext;
  node: GainNode;
  value: number;
  parent?: GainParent;
  children?: GainChildren[];
  options?: GainOptions;

  constructor(destination: GainDestination, audioContext: AudioContext, options?: GainOptions) {
    this.audioContext = audioContext;
    const initialGain = options?.initialGain ?? 1;
    this.value = options?.inverse ? initialGain * -1 : initialGain;
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
