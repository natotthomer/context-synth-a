import { useState } from 'react';
import { useAudioEngine } from "../AudioEngine/useAudioEngine";
import { Oscilloscope } from './Oscilloscope';

export function UI() {
  const { audioEngine } = useAudioEngine();

  const [currentTime, setCurrentTime] = useState<number>(audioEngine.audioContext.currentTime);

  const handleClick = () => {
    if (audioEngine.audioContext.state === 'suspended') {
      audioEngine.audioContext.resume();
    }
    setCurrentTime(audioEngine.audioContext.currentTime);
  };

  const handleFreq = () => {
    audioEngine.oscillator.setValueAtTime(1000, 1);
  };

  return (
    <div>
      hello {currentTime}

      <button onClick={handleClick}></button>
      <button onClick={handleFreq}>freq</button>
      <Oscilloscope />
      {/* <canvas ref={canvasRef} style={{width: 800, height: 200}} width={800} height={200} id='oscilloscope'/> */}
    </div>
  );
}
