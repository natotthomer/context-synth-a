import type Analyser from "./Analyser";
import type Gain from "./Gain";
import type Oscillator from "./Oscillator";

type FilterDestination = Filter | Gain;
type FilterParent = Filter | Gain | Analyser;
type FilterChildren = Filter | Oscillator | Gain | Analyser;

export default class Filter {
  audioContext: AudioContext;
  node: BiquadFilterNode;
  value: number;
  parent: FilterParent;
  children?: FilterChildren[];

  constructor(destination: FilterDestination, audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.value = 10000;
    this.node = this.buildNode(destination);
    this.parent = destination;
    this.parent.children?.push(this);
  }

  buildNode(destination: FilterDestination): BiquadFilterNode {
    const filterNode = this.audioContext.createBiquadFilter();
    filterNode.frequency.value = this.value;
    filterNode.connect(destination.node);
    return filterNode;
  }
}
