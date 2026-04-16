type VisualizerState = {
  isPlaying: boolean;
  level: number;
  bins: number[];
};

let sharedAudio: HTMLAudioElement | null = null;
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let sourceNode: MediaElementAudioSourceNode | null = null;
let freqData: Uint8Array | null = null;
let smoothedLevel = 0;
let binsCache = Array.from({ length: 48 }, () => 0);

function ensureAudioGraph(audio: HTMLAudioElement) {
  if (typeof window === "undefined") return;
  if (analyser && sourceNode && freqData) return;

  const Ctx =
    window.AudioContext ||
    (
      window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!Ctx) return;

  audioContext ??= new Ctx();
  analyser ??= audioContext.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.76;

  if (!sourceNode) {
    sourceNode = audioContext.createMediaElementSource(audio);
    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);
  }

  freqData ??= new Uint8Array(analyser.frequencyBinCount);
}

export function getSharedGpmTunesAudio() {
  if (typeof window === "undefined") return null;

  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = "metadata";
  }

  ensureAudioGraph(sharedAudio);
  return sharedAudio;
}

export async function resumeGpmTunesAudioContext() {
  if (!audioContext) return;
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
}

export function getGpmTunesVisualizerState(): VisualizerState {
  const audio = sharedAudio;
  const activeAnalyser = analyser;
  const data = freqData;

  if (!audio || !activeAnalyser || !data) {
    smoothedLevel *= 0.92;
    binsCache = binsCache.map((value) => value * 0.9);
    return {
      isPlaying: false,
      level: smoothedLevel,
      bins: binsCache,
    };
  }

  activeAnalyser.getByteFrequencyData(data as Uint8Array<ArrayBuffer>);

  const binCount = binsCache.length;
  const stride = Math.max(1, Math.floor(data.length / binCount));
  let total = 0;

  const nextBins = Array.from({ length: binCount }, (_, index) => {
    const start = index * stride;
    const end = Math.min(data.length, start + stride);
    let sum = 0;
    let count = 0;

    for (let cursor = start; cursor < end; cursor += 1) {
      sum += data[cursor];
      count += 1;
    }

    const normalized = count ? sum / count / 255 : 0;
    total += normalized;
    return normalized;
  });

  const avg = total / binCount;
  const isPlaying = !audio.paused && !audio.ended && audio.currentTime > 0;
  const targetLevel = isPlaying ? avg : 0;
  smoothedLevel += (targetLevel - smoothedLevel) * 0.22;
  binsCache = nextBins.map(
    (value, index) => binsCache[index] * 0.62 + value * 0.38,
  );

  return {
    isPlaying,
    level: smoothedLevel,
    bins: binsCache,
  };
}
