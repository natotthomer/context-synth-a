import type AudioCell from "./AudioCell";
import Gain from "./Gain";
import type { AudioDestination } from "./types";

export default class Mixer extends AudioCell {
  audioContext: AudioContext;
  channels: AudioCell[];

  constructor(channels: AudioCell[], destination: AudioDestination, audioContext: AudioContext) {
    super(audioContext);
    this.audioContext = audioContext;
    this.channels = channels;
    this.channels.forEach(channel => channel.node.connect(destination));
  }

  buildChannels(numberOfChannels: number, destination: AudioDestination): Gain[] {
    const channels: Gain[] = [];
    for (let i = 0; i < numberOfChannels; i++) {
      const newGain = new Gain(destination, this.audioContext);
      channels.push(newGain);
    }
    return channels;
  }
}