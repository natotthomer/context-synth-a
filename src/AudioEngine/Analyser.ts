import type Filter from "./Filter";
import type Gain from "./Gain";
import type Oscillator from "./Oscillators/Oscillator";

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
    analyserNode.fftSize = 512; // Higher fftSize gives more data points for smoother waveform and more cycles visible
    analyserNode.smoothingTimeConstant = 0.8; // Smoothing factor (0-1), 0.8 provides nice smoothing
    // analyserNode.connect(destination.node);
    const destinationNode = 'node' in destination ? destination.node : destination;
    analyserNode.connect(destinationNode);

    return analyserNode;
  }

  /**
   * Fill an existing Float32Array with time-domain waveform data
   * The array should have length equal to this.node.fftSize
   * Values range from -1.0 to 1.0
   * This is the preferred method for animation loops as it reuses the array
   */
  fillTimeDomainData(array: Float32Array<ArrayBuffer>): void {
    // TypeScript types are overly strict here - Web Audio API accepts any Float32Array
    this.node.getFloatTimeDomainData(array);
  }

  /**
   * Get the buffer length (fftSize) for time-domain analysis
   */
  getBufferLength(): number {
    return this.node.fftSize;
  }
}
