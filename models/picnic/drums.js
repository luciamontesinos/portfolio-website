// Tiny Web-Audio drum machine for the picnic scene.
//   • one track per instrument (see TRACKS), 16 sixteenth-note steps = one bar at 120 BPM
//   • hit(id)  plays the instrument now and records a hit on the nearest 16th note of the loop
//   • clear()  wipes every track and stops the loop; the next hit starts a fresh one
// The sounds are synthesised, so there are no sample files to host. To use recordings instead,
// replace the functions in VOICES with ones that start an AudioBufferSourceNode at time `t`.

export const BPM = 120;
export const STEPS = 16;

export const TRACKS = [
  { id: 'kick1', name: 'Kick 1' },
  { id: 'kick2', name: 'Kick 2' },
  { id: 'snare', name: 'Snare' },
  { id: 'hat1',  name: 'Hi-Hat 1' },
  { id: 'hat2',  name: 'Hi-Hat 2' },
  { id: 'clap',  name: 'Clap' },
];

export function createDrumLoop({ bpm = BPM, steps = STEPS, onChange = () => {} } = {}) {
  const stepDur = 60 / bpm / 4;                 // seconds per 16th note
  const pattern = Object.fromEntries(TRACKS.map((t) => [t.id, new Array(steps).fill(false)]));
  const LOOKAHEAD = 0.12, TICK_MS = 25;

  let ctx = null, out = null, noise = null;
  let anchor = null;        // audio-clock time of absolute step 0
  let nextStep = 0;         // next absolute step the scheduler has not looked at yet
  let timer = 0;
  const tags = Object.fromEntries(TRACKS.map((t) => [t.id, new Array(steps).fill(null)]));   // which object made each hit
  let flashes = [];         // { id, tag, time } so the visuals can light up in time with the audio

  function ensureCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = ctx.createDynamicsCompressor();
      out = ctx.createGain();
      out.gain.value = 0.85;
      out.connect(comp);
      comp.connect(ctx.destination);
      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // ---------- voices ----------
  const env = (g, t, peak, decay) => {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  };
  function tone(t, type, f0, f1, sweep, peak, decay) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + sweep);
    env(g, t, peak, decay);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + decay + 0.05);
  }
  function hiss(t, filterType, freq, q, peak, decay, offset = 0) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise;
    f.type = filterType; f.frequency.value = freq; f.Q.value = q;
    env(g, t, peak, decay);
    s.connect(f); f.connect(g); g.connect(out);
    s.start(t, offset); s.stop(t + decay + 0.05);
  }

  const VOICES = {
    // Kick 1: a long, deep sub boom (about 40 Hz, rings for nearly a second, no click)
    kick1: (t) => { tone(t, 'sine', 95, 38, 0.3, 1.0, 1.0); tone(t, 'sine', 38, 36, 0.3, 0.5, 0.8); },
    // Kick 2: a short, high, knocking thud with a sharp beater click (about 120 Hz, gone in 0.2 s)
    kick2: (t) => { tone(t, 'triangle', 380, 120, 0.035, 0.9, 0.2); hiss(t, 'bandpass', 3500, 1.2, 0.5, 0.012); },
    snare: (t) => { tone(t, 'triangle', 200, 120, 0.08, 0.5, 0.16); hiss(t, 'bandpass', 1900, 0.7, 0.8, 0.2); },
    hat1:  (t) => hiss(t, 'highpass', 7500, 0.7, 0.45, 0.05, 0.1),                            // closed
    hat2:  (t) => { hiss(t, 'bandpass', 10500, 1.6, 0.5, 0.24, 0.3); hiss(t, 'highpass', 6000, 0.7, 0.18, 0.24, 0.5); }, // open, brighter
    clap:  (t) => { [0, 0.012, 0.024].forEach((d, i) => hiss(t + d, 'bandpass', 1500, 1.1, 0.7, i < 2 ? 0.02 : 0.2, 0.2 * i)); },
  };

  function trigger(id, t, tag = null) {
    VOICES[id](t);
    flashes.push({ id, tag, time: t });
  }

  // ---------- loop ----------
  function schedule() {
    while (anchor + nextStep * stepDur < ctx.currentTime + LOOKAHEAD) {
      const t = anchor + nextStep * stepDur, s = nextStep % steps;
      for (const id in pattern) if (pattern[id][s]) trigger(id, t, tags[id][s]);
      nextStep++;
    }
  }

  /** `tag` identifies the object that was clicked, so that same object lights up when the loop replays it */
  function hit(id, tag = null) {
    ensureCtx();
    const now = ctx.currentTime;
    if (anchor === null) {                      // the first hit of a fresh loop defines the downbeat
      anchor = now + 0.02;
      nextStep = 0;
      timer = setInterval(schedule, TICK_MS);
    }
    const k = Math.max(0, Math.round((now - anchor) / stepDur));   // nearest 16th note (absolute index)
    pattern[id][k % steps] = true;
    tags[id][k % steps] = tag;
    if (k < nextStep) trigger(id, Math.max(now, anchor + k * stepDur), tag);   // the scheduler already passed that step
    // otherwise the scheduler plays it exactly on the grid when it gets there
    onChange(pattern);
  }

  function clear() {
    for (const id in pattern) { pattern[id].fill(false); tags[id].fill(null); }
    clearInterval(timer);
    anchor = null;
    flashes = [];
    onChange(pattern);
  }

  return {
    hit, clear, pattern, steps,
    unlock: ensureCtx,
    /** index of the 16th note currently sounding, or -1 when the loop is stopped */
    currentStep() {
      if (anchor === null || !ctx) return -1;
      const k = Math.floor((ctx.currentTime - anchor) / stepDur);
      return k < 0 ? -1 : k % steps;
    },
    /** tags of the objects whose sound has just started, since the last call */
    drainFlashes() {
      if (!ctx || !flashes.length) return [];
      const due = flashes.filter((f) => f.time <= ctx.currentTime).map((f) => f.tag);
      flashes = flashes.filter((f) => f.time > ctx.currentTime);
      return due;
    },
  };
}
