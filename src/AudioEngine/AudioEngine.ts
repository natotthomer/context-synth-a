import Analyser from "./Analyser";
import Filter from "./Filter";
import Gain from "./Gain";
import Oscillator from "./Oscillators/Oscillator";
import PeriodicWaveOscillator from "./Oscillators/PeriodicWaveOscillator";
import type { AudioDestination } from "./types";

class AudioEngine {
  audioContext: AudioContext;
  mainVolume: Gain;
  filter: Filter;
  oscillator: Oscillator;
  analyser: Analyser;

  constructor () {
    this.audioContext = this._buildAudioContext();
    this.analyser = new Analyser(this.audioContext.destination, this.audioContext);
    this.mainVolume = new Gain(this.analyser, this.audioContext);
    this.filter = new Filter(this.mainVolume, this.audioContext);
    this.oscillator = new Oscillator(this.filter, this.audioContext);
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
