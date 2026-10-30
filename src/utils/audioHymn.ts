// Simple institutional march melodic synthesizer using Web Audio API

let audioCtx: AudioContext | null = null;
let isPlaying = false;
let timeoutIds: number[] = [];

// Melodic motif notes (frequencies in Hz) representing a bright march fanfare
// Sol, Do, Re, Mi, Fa, Sol, etc.
const NOTES: Record<string, number> = {
  G3: 196.00,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
};

// March fanfare pattern for SENA Anthem
const MELODY = [
  { note: 'C4', duration: 0.35 },
  { note: 'E4', duration: 0.35 },
  { note: 'G4', duration: 0.5 },
  { note: 'G4', duration: 0.3 },
  { note: 'A4', duration: 0.3 },
  { note: 'G4', duration: 0.4 },
  { note: 'E4', duration: 0.4 },
  { note: 'C4', duration: 0.5 },
  { note: 'D4', duration: 0.35 },
  { note: 'E4', duration: 0.35 },
  { note: 'F4', duration: 0.35 },
  { note: 'E4', duration: 0.35 },
  { note: 'D4', duration: 0.5 },
  { note: 'G4', duration: 0.6 },
  { note: 'C4', duration: 0.4 },
  { note: 'E4', duration: 0.4 },
  { note: 'G4', duration: 0.5 },
  { note: 'C5', duration: 0.7 },
  { note: 'B4', duration: 0.35 },
  { note: 'A4', duration: 0.35 },
  { note: 'G4', duration: 0.5 },
  { note: 'F4', duration: 0.35 },
  { note: 'E4', duration: 0.35 },
  { note: 'D4', duration: 0.4 },
  { note: 'C4', duration: 0.8 },
];

export function playSenaAnthemMelody(onProgress?: (progressIndex: number) => void, onEnded?: () => void) {
  stopSenaAnthemMelody();

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch (err) {
    console.warn('Web Audio not supported', err);
    return;
  }

  isPlaying = true;
  let accumulatedTime = 0;

  MELODY.forEach((item, index) => {
    const tId = window.setTimeout(() => {
      if (!isPlaying || !audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Brass-like fanfare timbre: triangle + slight overtone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(NOTES[item.note] || 440, audioCtx.currentTime);

      // Envelope: brisk attack, slight decay, sustain, smooth release
      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + item.duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + item.duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + item.duration);

      if (onProgress) {
        onProgress(Math.floor((index / MELODY.length) * 100));
      }
    }, accumulatedTime * 1000);

    timeoutIds.push(tId);
    accumulatedTime += item.duration;
  });

  const endId = window.setTimeout(() => {
    isPlaying = false;
    if (onEnded) onEnded();
  }, accumulatedTime * 1000 + 200);

  timeoutIds.push(endId);
}

export function stopSenaAnthemMelody() {
  isPlaying = false;
  timeoutIds.forEach((id) => clearTimeout(id));
  timeoutIds = [];
  if (audioCtx) {
    try {
      audioCtx.close();
    } catch {
      // ignore
    }
    audioCtx = null;
  }
}
