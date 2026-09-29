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
//   mouth  one digit per 1/MOUTH_HZ s from the clip's start, 0 (shut) to 9 (wide): the voice's own loudness, frame by
//          frame, against the clip's loud frames, so the mouth opens on stressed vowels and shuts on the pauses
//   words  [charIndex, seconds, …]: when each word of the line's speech starts, from ElevenLabs' character timings
//          (scene_kit.js's atWord); none if the timings don't spell out the speech exactly
export const MOUTH_HZ = 24;
export function syncOf(file, text, alignment) {
  const RATE = 24000, per = RATE / MOUTH_HZ;
  const pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 's16le', '-ac', '1', '-ar', String(RATE), '-'], { maxBuffer: 1 << 26 });
  const rms = [];
  for (let k = 0; (k + 1) * per * 2 <= pcm.length; k++) {
    let e = 0; for (let i = k * per; i < (k + 1) * per; i++) e += (pcm.readInt16LE(i * 2) / 32768) ** 2;
    rms.push(Math.sqrt(e / per));
  }
  const loud = [...rms].sort((x, y) => x - y)[Math.floor(rms.length * .9)] || 1;
  const mouth = rms.map(r => r < loud * .12 ? 0 : Math.min(9, Math.round(9 * Math.min(1, r / loud) ** .7))).join('');
  const { characters: C = [], character_start_times_seconds: S = [] } = alignment || {}, words = [];
  if (C.join('') === text) C.forEach((c, j) => { if (/\S/.test(c) && (j === 0 || /\s/.test(C[j - 1]))) words.push(j, +S[j].toFixed(2)); });
  return { mouth: mouth.replace(/0+$/, ''), words };
}
const seconds = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();

// clips: { lineId: file }; only: a chapter number, or null for all; gains: { lineId: linear gain } to even out the voices.
// Lines missing from clips keep their old duration.
// syncs: { lineId: syncOf(…) } for the clips that have timings; any other clip's old lip sync is dropped.
export function finishVoice(clips, only = null, gains = {}, syncs = {}) {
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
      const at = Math.round(l.t0 * SR), k = gains[l.id] ?? 1;
      for (let i = 0; i < pcm.length / 2 && at + i < n; i++) mix[at + i] += k * pcm.readInt16LE(i * 2) / 32768;
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
