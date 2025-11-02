import type { AudioDestination } from "./types";

export default class AudioCell {
  audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }
}
