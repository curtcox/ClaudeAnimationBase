// voice_lib.mjs: what the scratch voice (scratch_voice.mjs) and the real one (voice.mjs) share. Given one clip per spoken
// line, it measures them into audio/durations.json (and their lip sync into audio/sync.json), retimes every chapter
// (timeline.mjs), then mixes each chapter's clips at their line starts into audio/chNN.wav (rewritten only when it
// changes, so an unchanged chapter isn't encoded again).
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { PATHS, readYaml, pad } from './script_lib.mjs';

// a voiced line's clip in assets/vo, without its extension (.mp3 the audio, .json ElevenLabs' character timings): keyed
// by voice, model and the words, so a changed line or voice gets a new clip. cast is script/voices.yaml.
export const clipBase = (l, cast) => `assets/vo/${createHash('sha256').update(`${cast[l.speaker].voice}|${cast.model}|${l.speech}`).digest('hex').slice(0, 16)}`;

const SR = 44100;
// a clip's integrated loudness (LUFS), by ffmpeg's EBU R128 meter
export function lufs(f) {
  const out = spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;   // it reports on stderr
  return +JSON.parse(out.match(/\{[^{}]*"input_i"[^{}]*\}/)[0]).input_i;
}
// A clip's lip sync: { mouth, words }.
//   mouth  one digit per 1/MOUTH_HZ s from the clip's start, 0 (shut) to 9 (wide), read LEAD s ahead of the sound (a
//          mouth that moves a frame early looks in time; one a frame late looks dubbed). The voice's own loudness, in
//          the band where speech lives: against the clip's loud moments (so quiet words open less) and against the
//          loudest moment within 0.12 s (so the mouth closes between syllables, not only at pauses). And the lips
//          shut on an m, b or p as spelled (not ph, a word-initial ps or pn, or a final mb's b), at the quietest
//          moment near where ElevenLabs' timings put it.
//   words  [charIndex, seconds, …]: when each word of the line's speech starts, from ElevenLabs' character timings
//          (scene_kit.js's atWord); none if the timings don't spell out the speech exactly. Japanese and Chinese have
//          no spaces, so there each kanji, hanzi or kana starts a word: a cue on a phrase mid-sentence lands on it, not
//          on the sentence's start (English has none of these, so its timings are as before)
export const MOUTH_HZ = 24;
const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;
const LEAD = .04;
export function syncOf(file, text, alignment) {
  const RATE = 16000, HOP = 80, WIN = 320;   // loudness every 5 ms, over 20 ms
  const pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-af', 'highpass=f=200,lowpass=f=4000', '-f', 'f32le', '-ac', '1', '-ar', String(RATE), '-'], { maxBuffer: 1 << 27 });
  const a = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.length / 4), env = [];
  for (let s = 0; s + WIN <= a.length; s += HOP) { let e = 0; for (let i = s; i < s + WIN; i++) e += a[i] * a[i]; env.push(10 * Math.log10(e / WIN + 1e-12)); }
  const at = t => Math.round((t - WIN / RATE / 2) * RATE / HOP), timeOf = i => i * HOP / RATE + WIN / RATE / 2;
  const maxIn = (t0, t1) => { let m = -120; for (let i = Math.max(0, at(t0)); i <= Math.min(env.length - 1, at(t1)); i++) m = Math.max(m, env[i]); return m; };
  const speech = [...env].sort((x, y) => x - y)[Math.floor(env.length * .9)], clamp = x => Math.max(0, Math.min(1, x));
  const n = Math.ceil(a.length / RATE * MOUTH_HZ), open = [];
  for (let k = 0; k < n; k++) {
    const t = k / MOUTH_HZ + LEAD, L = maxIn(t - .02, t + .02);
    if (L < speech - 30) { open.push(0); continue; }
    open.push(Math.min(clamp((L - (speech - 24)) / 20) ** .7, clamp((L - (maxIn(t - .12, t + .12) - 12)) / 12)));
  }
  const { characters: C = [], character_start_times_seconds: S = [], character_end_times_seconds: E = [] } = alignment || {}, words = [];
  if (C.join('') === text) {
    C.forEach((c, j) => { if (/\S/.test(c) && (j === 0 || /\s/.test(C[j - 1]) || CJK.test(c))) words.push(j, +S[j].toFixed(2)); });
    const low = C.map(c => c.toLowerCase()), letter = c => /[a-z]/.test(c || ' ');
    low.forEach((c, j) => {
      if (!'mbp'.includes(c) || low[j - 1] === c) return;
      const nx = low[j + 1], pv = low[j - 1];
      if (c === 'p' && (nx === 'h' || (!letter(pv) && /[sn]/.test(nx || '')))) return;
      if (c === 'b' && pv === 'm' && !letter(nx)) return;
      let best = -1;
      for (let i = Math.max(0, at(S[j] - .05)); i <= Math.min(env.length - 1, at(E[j] + .05)); i++) if (best < 0 || env[i] < env[best]) best = i;
      const k = best < 0 ? -1 : Math.round((timeOf(best) - LEAD) * MOUTH_HZ);
      if (k >= 0 && k < n) open[k] = 0;
    });
  }
  const mouth = open.map(v => v < .12 ? 0 : Math.min(9, Math.max(1, Math.round(9 * v)))).join('');
  return { mouth: mouth.replace(/0+$/, ''), words };
}
// A clip's stray breaths: the voices often inhale after a line's last word (or before its first), which plays as an
// extra breath between lines (Curt, ch 2 review). Returns the stretches to silence, [[from, to], …] seconds into the
// clip: before the first word or after the last (ElevenLabs' character timings), past a silence of 40 ms or more, and
// only if nothing there is within 10 dB of the clip's speech (a word the timings missed stays). Silenced, not cut: the
// clip keeps its length, so no line moves.
export function breathsOf(file, alignment) {
  const { characters: C = [], character_start_times_seconds: S = [], character_end_times_seconds: E = [] } = alignment || {};
  const first = C.findIndex(c => /\S/.test(c)), last = C.findLastIndex(c => /\S/.test(c)); if (first < 0) return [];
  const RATE = 16000, W = RATE / 100, pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 'f32le', '-ac', '1', '-ar', String(RATE), '-'], { maxBuffer: 1 << 26 });
  const a = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.length / 4), db = [];   // 10 ms frames
  for (let s = 0; s + W <= a.length; s += W) { let e = 0; for (let i = s; i < s + W; i++) e += a[i] * a[i]; db.push(10 * Math.log10(e / W + 1e-12)); }
  const speech = [...db].sort((x, y) => x - y)[Math.floor(db.length * .9)], QUIET = -50, GAP = 4, n = db.length, out = [];
  const quietRun = (i, d) => { let k = 0; while (i >= 0 && i < n && db[i] < QUIET) { k++; i += d; } return k; };
  const faint = (i0, i1) => { let m = -Infinity; for (let i = i0; i < i1; i++) m = Math.max(m, db[i]); return m > QUIET && m < speech - 10; };
  // after the last word: the first silence (within 0.4 s of it), then whatever follows
  for (let i = Math.floor(E[last] * 100); i < Math.min(n, E[last] * 100 + 40); i++) if (quietRun(i, 1) >= GAP) { const j = i + 2; if (faint(j, n)) out.push([j / 100, n / 100]); break; }
  // before the first word: the last silence (within 0.4 s of it), and whatever comes before
  for (let i = Math.min(n - 1, Math.ceil(S[first] * 100)); i > Math.max(0, S[first] * 100 - 40); i--) if (quietRun(i, -1) >= GAP) { const j = i - 2; if (j > 0 && faint(0, j)) out.push([0, j / 100]); break; }
  return out;
}
const seconds = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();

// clips: { lineId: file }; only: a chapter number, or null for all; gains: { lineId: linear gain } to even out the voices;
// mutes: { lineId: breathsOf(…) }, stretches of a clip to silence (15 ms fades either side).
// Lines missing from clips keep their old duration.
// syncs: { lineId: syncOf(…) } for the clips that have timings; any other clip's old lip sync is dropped.
export function finishVoice(clips, only = null, gains = {}, syncs = {}, mutes = {}) {
  const durations = existsSync('audio/durations.json') ? JSON.parse(readFileSync('audio/durations.json', 'utf8')) : {};
  const sync = existsSync('audio/sync.json') ? JSON.parse(readFileSync('audio/sync.json', 'utf8')) : {};
  for (const [id, f] of Object.entries(clips)) {
    durations[id] = +seconds(f).toFixed(3);
    if (syncs[id]) sync[id] = syncs[id]; else delete sync[id];
  }
  writeFileSync('audio/durations.json', JSON.stringify(durations, null, 1) + '\n');
  writeFileSync('audio/sync.json', `{\n${Object.entries(sync).map(([id, v]) => ` ${JSON.stringify(id)}: ${JSON.stringify(v)}`).join(',\n')}\n}\n`);   // a line each, for diffs
  execFileSync('node', ['tools/timeline.mjs'], { stdio: 'inherit' });
  for (const c of readYaml(PATHS.chapters).filter(c => only == null || c.n === only)) {
    const g = {}; new Function('window', readFileSync(`src/gen/ch${pad(c.n)}.js`, 'utf8'))(g);
    const CH = g.CHAPTER, n = Math.ceil(CH.duration * SR), mix = new Float32Array(n);
    for (const l of CH.lines) {
      if (!clips[l.id]) continue;
      const pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', clips[l.id], '-f', 's16le', '-ac', '1', '-ar', String(SR), '-'], { maxBuffer: 1 << 28 });
      const at = Math.round(l.t0 * SR), k = gains[l.id] ?? 1, M = (mutes[l.id] || []).map(([p, q]) => [p * SR, q * SR]), F = .015 * SR;
      const keep = i => { let g = 1; for (const [p, q] of M) g = Math.min(g, i < p - F || i > q + F ? 1 : i < p ? (p - i) / F : i > q ? (i - q) / F : 0); return g; };
      for (let i = 0; i < pcm.length / 2 && at + i < n; i++) mix[at + i] += k * (M.length ? keep(i) : 1) * pcm.readInt16LE(i * 2) / 32768;
    }
    const buf = Buffer.alloc(44 + n * 2);
    buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
    buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
    for (let i = 0; i < n; i++) buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(mix[i] * 32767 * .9))), 44 + i * 2);
    const f = `audio/ch${pad(c.n)}.wav`, same = existsSync(f) && readFileSync(f).equals(buf);
    if (!same) writeFileSync(f, buf);
    console.log(`${f}  ${CH.duration.toFixed(1)} s${same ? ' (unchanged)' : ''}`);
  }
}
