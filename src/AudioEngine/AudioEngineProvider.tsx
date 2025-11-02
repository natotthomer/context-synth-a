import { useState } from 'react';
import type { ReactNode } from 'react';
import { AudioEngineContext } from './AudioEngineContext';
import AudioEngine from './AudioEngine';

export const AudioEngineProvider = ({ children }: {
  children: ReactNode
}) => {
  const [audioEngine] = useState<AudioEngine>(() => {
    const audioEngine = new AudioEngine();

    return audioEngine;
  });

  return (
    <AudioEngineContext.Provider value={{ audioEngine }}>
      {children}
    </AudioEngineContext.Provider>
  );
};
