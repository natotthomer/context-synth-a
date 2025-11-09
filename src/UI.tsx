import { useEffect, useRef, useState } from 'react';
import { useAudioEngine } from "./AudioEngine/useAudioEngine";

export function UI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const { audioEngine } = useAudioEngine();

  const [currentTime, setCurrentTime] = useState<number>(audioEngine.audioContext.currentTime);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = audioEngine.analyser;
    const bufferLength = analyser.getBufferLength();
    // Create the data array with proper typing
    const dataArray = new Float32Array(bufferLength);

    function draw() {
      if (!canvas || !ctx) return;
      
      animationFrameRef.current = requestAnimationFrame(draw);

      // Get the latest waveform data
      analyser.fillTimeDomainData(dataArray);

      // Clear the canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#00ff00";
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] * 0.5 + 0.5; // Normalize from [-1, 1] to [0, 1]
        const y = v * canvas.height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();
    }

    draw();

    // Cleanup function to cancel animation frame
    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioEngine]);

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
      <canvas ref={canvasRef} style={{width: 800, height: 200}} width={800} height={200} id='oscilloscope'/>
    </div>
  );
}
