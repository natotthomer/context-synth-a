import { useEffect, useRef } from 'react';
import { useAudioEngine } from "../AudioEngine/useAudioEngine";

interface OscilloscopeProps {
  /**
   * Number of samples to display from the captured buffer.
   * Smaller values show a smaller time window (fewer cycles visible), effectively "zooming in".
   * The analyser still captures the full buffer (maintaining analysis quality),
   * but only this many samples are rendered to the canvas.
   * Defaults to showing the entire buffer (2048 samples).
   *
   * Example: windowSize={512} shows 1/4 of the captured time window,
   * displaying fewer cycles but with more pixels per cycle.
   *
   * Ignored if showSingleCycle is true.
   */
  windowSize?: number;
  /**
   * Starting sample index to display from the captured buffer.
   * Useful for scrolling through different portions of the buffer.
   * Defaults to 0 (start of buffer).
   *
   * Ignored if showSingleCycle is true (will auto-align to cycle start).
   */
  startIndex?: number;
  /**
   * If true, automatically detects the waveform period and displays exactly one cycle.
   * Uses zero-crossing detection to find the fundamental frequency.
   * Overrides windowSize and startIndex when enabled.
   */
  showSingleCycle?: boolean;
}

/**
 * Detect the period of a waveform using zero-crossing detection.
 * Returns the number of samples in one cycle, or null if detection fails.
 */
function detectPeriod(dataArray: Float32Array): number | null {
  const crossings: number[] = [];
  const threshold = 0.01; // Minimum amplitude to avoid noise near zero

  // Find zero crossings (negative to positive transitions)
  for (let i = 1; i < dataArray.length; i++) {
    const prev = dataArray[i - 1];
    const curr = dataArray[i];

    // Detect crossing from negative/zero to positive
    if (prev <= 0 && curr > threshold) {
      // Linear interpolation for more accurate crossing point
      const t = prev / (prev - curr);
      crossings.push(i - 1 + t);
    }
  }

  // Need at least 2 crossings to calculate a period
  if (crossings.length < 2) {
    return null;
  }

  // Calculate periods between consecutive crossings
  const periods: number[] = [];
  for (let i = 1; i < crossings.length; i++) {
    periods.push(crossings[i] - crossings[i - 1]);
  }

  // Use median period for stability (more robust than mean)
  periods.sort((a, b) => a - b);
  const medianPeriod = periods[Math.floor(periods.length / 2)];

  // Validate: period should be reasonable (not too short, not longer than buffer)
  if (medianPeriod < 2 || medianPeriod > dataArray.length / 2) {
    return null;
  }

  return Math.round(medianPeriod);
}

export function Oscilloscope({ windowSize, startIndex = 0, showSingleCycle = false }: OscilloscopeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const { audioEngine } = useAudioEngine();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = audioEngine.analyser;
    const bufferLength = analyser.getBufferLength();
    // Create the data array for the FULL buffer - we always capture all samples
    // to maintain full analysis quality, regardless of what we choose to display
    const dataArray = new Float32Array(bufferLength);

    function draw() {
      if (!canvas || !ctx) return;

      animationFrameRef.current = requestAnimationFrame(draw);

      // Get the latest waveform data - this captures the FULL buffer (all 2048 samples)
      // Analysis quality is maintained regardless of display window size
      analyser.fillTimeDomainData(dataArray);

      let displayLength: number;
      let clampedStartIndex: number;

      if (showSingleCycle) {
        // Detect the period and display exactly one cycle
        const period = detectPeriod(dataArray);

        if (period !== null && period > 0 && period < bufferLength) {
          displayLength = period;
          // Find a zero crossing near the start to align the cycle properly
          // Look for the first zero crossing within a reasonable range
          let cycleStart = 0;
          const searchRange = Math.min(bufferLength - period, Math.max(period, 200));
          for (let i = 1; i < searchRange; i++) {
            if (dataArray[i - 1] <= 0 && dataArray[i] > 0.01) {
              cycleStart = i;
              break;
            }
          }
          // Ensure we have enough samples for a full cycle
          clampedStartIndex = Math.max(0, Math.min(cycleStart, bufferLength - displayLength));
        } else {
          // Fallback: if detection fails, show a reasonable default
          displayLength = Math.min(512, bufferLength);
          clampedStartIndex = 0;
        }
      } else {
        // Determine how many samples to display (rendering only, doesn't affect capture quality)
        displayLength = windowSize !== undefined
          ? Math.min(windowSize, bufferLength)
          : bufferLength;

        // Clamp startIndex to valid range
        clampedStartIndex = Math.max(0, Math.min(startIndex, bufferLength - displayLength));
      }

      // Clear the canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#00ff00";
      ctx.beginPath();

      // Calculate pixel width per displayed sample
      // Smaller displayLength means more pixels per sample = more detail visible
      const sliceWidth = canvas.width / displayLength;
      let x = 0;

      // Render only the specified window of samples from the full captured buffer
      // This shows fewer cycles in the same canvas width, effectively "zooming in"
      for (let i = 0; i < displayLength; i++) {
        const dataIndex = clampedStartIndex + i;
        const v = dataArray[dataIndex] * 0.5 + 0.5; // Normalize from [-1, 1] to [0, 1]
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
  }, [audioEngine, windowSize, startIndex, showSingleCycle]);

  return (
    <canvas ref={canvasRef} style={{width: 800, height: 200}} width={800} height={200} id='oscilloscope'/>
  );
}
