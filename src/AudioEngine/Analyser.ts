import type Filter from "./Filter";
import type Gain from "./Gain";
import type Oscillator from "./Oscillator";

type AnalyserDestination = Filter | Gain | AudioNode;
type AnalyserParent = Filter | Gain | Analyser;
type AnalyserChildren = Filter | Oscillator | Gain | Analyser;

export default class Analyser {
  audioContext: AudioContext;
  node: AnalyserNode;
  parent?: AnalyserParent; // No parent indicates that the parent is actually just the AudioContext AudioDestinationNode
  children?: AnalyserChildren[];

  constructor(destination: AnalyserDestination, audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.node = this.buildNode(destination);
    this.parent = 'parent' in destination ? destination.parent : undefined;
    if (this.parent) {
      this.parent.children?.push(this);
    }  
  }

  buildNode(destination: AnalyserDestination): AnalyserNode {
    const analyserNode = this.audioContext.createAnalyser();
    // Configure for time-domain analysis
    analyserNode.fftSize = 2048; // Higher fftSize gives more data points for smoother waveform
    analyserNode.smoothingTimeConstant = 0.8; // Smoothing factor (0-1), 0.8 provides nice smoothing
    // analyserNode.connect(destination.node);
    const destinationNode = 'node' in destination ? destination.node : destination;
    analyserNode.connect(destinationNode);

    return analyserNode;
  }
}
