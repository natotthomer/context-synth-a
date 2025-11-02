import { createContext } from 'react';
import AudioEngine from './AudioEngine';

export const AudioEngineContext = createContext({
  audioEngine: new AudioEngine()
});
