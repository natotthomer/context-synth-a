import Filter from "./Filter";
import Gain from "./Gain";
import Oscillator from "./Oscillator";
import type { AudioDestination } from "./types";

class AudioEngine {
  audioContext: AudioContext;
  mainVolume: Gain;
  filter: Filter;
  oscillator: Oscillator;

  constructor () {
    this.audioContext = this._buildAudioContext();
    this.mainVolume = new Gain(this.audioContext.destination, this.audioContext);
    this.filter = new Filter(this.mainVolume.node, this.audioContext);
    this.oscillator = new Oscillator(this.filter.node, this.audioContext);
  }

  _buildAudioContext(): AudioContext {
    return new AudioContext();
  }

  buildGainNode(destination: AudioDestination): GainNode {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0.5;
    gainNode.connect(destination);
    return gainNode;
  }

  buildFilterNode(destination: AudioDestination): BiquadFilterNode {
    const filterNode = this.audioContext.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.connect(destination);
    return filterNode;
  }
}

export default AudioEngine;
