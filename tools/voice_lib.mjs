// voice_lib.mjs: what the scratch voice (scratch_voice.mjs) and the real one (voice.mjs) share. Given one clip per spoken
// line, it measures them into audio/durations.json, retimes every chapter (timeline.mjs), then mixes each chapter's clips
// at their line starts into audio/chNN.wav (rewritten only when it changes, so an unchanged chapter isn't encoded again).
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { PATHS, readYaml, pad } from './script_lib.mjs';

const SR = 44100;
// a clip's integrated loudness (LUFS), by ffmpeg's EBU R128 meter
export function lufs(f) {
  const out = spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;   // it reports on stderr
  return +JSON.parse(out.match(/\{[^{}]*"input_i"[^{}]*\}/)[0]).input_i;
}
const seconds = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();

// clips: { lineId: file }; only: a chapter number, or null for all; gains: { lineId: linear gain } to even out the voices.
// Lines missing from clips keep their old duration.
export function finishVoice(clips, only = null, gains = {}) {
  const durations = existsSync('audio/durations.json') ? JSON.parse(readFileSync('audio/durations.json', 'utf8')) : {};
  for (const [id, f] of Object.entries(clips)) durations[id] = +seconds(f).toFixed(3);
  writeFileSync('audio/durations.json', JSON.stringify(durations, null, 1) + '\n');
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
