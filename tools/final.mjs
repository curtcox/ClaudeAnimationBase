// final.mjs: a chapter's final-quality video (out/chNN.mp4), kept as pieces so that a fix repaints only what it changed.
//   node tools/final.mjs --chapter=7              make chapter 7's final video, repainting only what's out of date
//   --shots=D,E                                   repaint the pieces those shots touch, whatever the checks say
//   --at=41.5:52                                  repaint the pieces touching that stretch (seconds into the chapter)
//   --check-all                                   check every piece, even ones whose prints say they're current
//   --every=6                                     how often a piece being checked is sampled (every Nth frame, and its last)
//   --workers=4                                   Chrome pages drawing at once
//   --dry                                         only say what would be repainted, and why (--verbose: every sample)
// Then node tools/assemble.mjs --final joins the chapters into the film (a copy, and the sound leveled: minutes).
//
// The pieces live in out/final/chNN/: about ten seconds of video each, and manifest.json, which says what each covers
// (its first frame and how many) and what drew it (the engine's print and each shot's, from render.mjs --prints). The
// chapter's video is the pieces joined without re-encoding, with the chapter's sound.
//   A piece whose prints still match is current. One whose prints changed (a shared file, the chapter's timing, a shot's
//   code) is checked: every Nth frame of it is drawn again and compared with the piece, both at a quarter size, where a
//   frame drawn twice differs by at most a few levels and any real change by far more. If every sample matches, the
//   piece is kept and takes the new prints; if any differs, the whole piece is repainted and encoded again. So a change
//   to a shared file costs a sample of the film instead of all of it. (A change that shows on fewer than N frames in a
//   row can slip between samples: --shots or --at repaints it.)
//   The first time, a chapter's existing out/chNN.mp4 is cut into pieces at its keyframes, with no re-encode, and every
//   piece is checked. With no video yet, the pieces are painted from scratch, split at shot starts.
//   A chapter that got longer gets new pieces at its end; one that got shorter loses them. Frames are drawn into
//   out/final/chNN/work and deleted once their piece is made, so a disk needs room for one batch of frames (about 2 GB).
import { spawnSync, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync, statSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';
import { pad } from './script_lib.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
if (!args.chapter) { console.error('which chapter? --chapter=N'); process.exit(1); }
const N = +args.chapter, CH = pad(N), FPS = 24, EVERY = +(args.every || 6), WORKERS = String(args.workers || 4);
const DIR = `out/final/ch${CH}`, SEG = `${DIR}/pieces`, WORK = `${DIR}/work`, MF = `${DIR}/manifest.json`, VIDEO = `out/ch${CH}.mp4`;
const PIECE = 240;                  // frames in a new piece: ten seconds
// The comparison, at quarter size: brightness, and colour averaged over 2 × 2 of those pixels (the video's colour is
// coarser than its brightness). Measured over chapter 13, a frame drawn again differed from the video by at most 17 levels
// of 255 in brightness (at a few fine lines) and 10 in colour; the next frame differs by 80 or more, and a word changed in
// small type by about 100. Past either limit, the frame has changed.
const W = 480, H = 270, FRAME = W * H * 3, LUMA = 32, COLOUR = 24;
function difference(a, b) {
  let luma = 0, colour = 0, over = 0;
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) {
    const c = [0, 0, 0];
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
      const j = ((y + dy) * W + x + dx) * 3, r = a[j] - b[j], g = a[j + 1] - b[j + 1], bl = a[j + 2] - b[j + 2];
      const l = Math.abs(.299 * r + .587 * g + .114 * bl); if (l > luma) luma = l; if (l > 8) over++;
      c[0] += r; c[1] += g; c[2] += bl;
    }
    for (const v of c) if (Math.abs(v / 4) > colour) colour = Math.abs(v / 4);
  }
  return { luma: Math.round(luma), colour: Math.round(colour), over, changed: luma > LUMA || colour > COLOUR };
}
mkdirSync(SEG, { recursive: true });
const f5 = i => String(i).padStart(5, '0'), clock = f => { const s = f / FPS; return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`; };
const span = s => `${clock(s.f0)}–${clock(s.f0 + s.n)}`;

const render = extra => {
  const r = spawnSync(process.execPath, ['render.mjs', `--chapter=${N}`, ...extra], { stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8', maxBuffer: 1 << 26 });
  const out = r.stdout.split('\n').filter(l => l && !/^frame \d/.test(l)); if (out.length) console.log(out.join('\n'));
  if (r.status !== 0) { console.error(`render.mjs ${extra.join(' ')} failed (exit ${r.status})`); process.exit(1); }
};
const drawFrames = list => {
  const todo = list.filter(i => !existsSync(`${WORK}/f${f5(i)}.jpg`)); if (!todo.length) return;
  mkdirSync(WORK, { recursive: true }); writeFileSync(`${WORK}/only.json`, JSON.stringify(todo));
  render(['--frames', `--frames-dir=${WORK}`, `--only=${WORK}/only.json`, `--workers=${WORKERS}`]);
};
const probeFrames = f => +execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=nb_frames', '-of', 'default=nw=1:nk=1', f]).toString().trim();
// frames at quarter size, as raw RGB: a piece's (all of them) or a list of images
const small = input => execFileSync('ffmpeg', ['-v', 'error', ...input, '-fps_mode', 'passthrough', '-vf', `scale=${W}:${H}:flags=area,format=rgb24`, '-f', 'rawvideo', '-'], { maxBuffer: 1 << 30 });

// ---- what draws the chapter now ----
rmSync(WORK, { recursive: true, force: true });
render(['--prints', `--out=${DIR}/prints.json`]);
const P = JSON.parse(readFileSync(`${DIR}/prints.json`, 'utf8')), TOTAL = P.frames;
const touching = s => P.shots.filter(x => x.f0 < s.f0 + s.n && x.f1 > s.f0);
const printsFor = s => Object.fromEntries(touching(s).map(x => [x.name, x.print]));

// ---- the pieces ----
// (written only when it changes: its time says when the pieces last did, which decides whether the chapter is joined again)
const save = m => { const t = JSON.stringify(m, null, 1) + '\n'; if (existsSync(MF) && readFileSync(MF, 'utf8') === t) return; writeFileSync(MF + '.tmp', t); renameSync(MF + '.tmp', MF); };
let M = existsSync(MF) ? JSON.parse(readFileSync(MF, 'utf8')) : null;
if (!M) {
  M = { chapter: N, fps: FPS, pieces: [] };
  const v = existsSync(VIDEO) && JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,r_frame_rate', '-of', 'json', VIDEO])).streams[0];
  if (v && v.width === 1920 && v.r_frame_rate === `${FPS}/1`) {
    // cut the existing video at its keyframes (no re-encode); every piece is then checked, since nothing says what drew it
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', VIDEO, '-map', '0:v', '-c', 'copy', '-f', 'segment', '-segment_time', '10', '-reset_timestamps', '1', `${SEG}/cut%03d.mp4`]);
    let f0 = 0;
    for (const file of readdirSync(SEG).filter(f => /^cut\d+\.mp4$/.test(f)).sort()) {
      const n = probeFrames(`${SEG}/${file}`); M.pieces.push({ file, f0, n, engine: null, shots: {} }); f0 += n;
    }
    console.log(`cut ${VIDEO} into ${M.pieces.length} pieces, to be checked`);
  }
  save(M);
}
// fit the pieces to the chapter's length now: drop what's past its end, repaint a piece that runs over it, add new ones
const plan = [];
for (const s of M.pieces) {
  if (s.f0 >= TOTAL) continue;
  if (s.f0 + s.n > TOTAL) plan.push({ ...s, n: TOTAL - s.f0, why: 'the chapter got shorter' });
  else plan.push({ ...s });
}
let end = plan.length ? plan.at(-1).f0 + plan.at(-1).n : 0;
const cuts = [...new Set(P.shots.map(x => x.f0))];
while (end < TOTAL) {
  let n = Math.min(PIECE, TOTAL - end); const next = cuts.find(c => c > end && c < end + n); if (next) n = next - end;
  plan.push({ file: null, f0: end, n, why: 'new' }); end += n;
}

// ---- which pieces need a look ----
const forced = s => {
  if (args.shots && touching(s).some(x => String(args.shots).split(',').includes(x.name))) return `--shots=${args.shots}`;
  if (args.at) { const [a, b] = String(args.at).split(':').map(Number); if (s.f0 < b * FPS && s.f0 + s.n > a * FPS) return `--at=${args.at}`; }
  return null;
};
const current = s => s.engine === P.engine && JSON.stringify(s.shots) === JSON.stringify(printsFor(s));
for (const s of plan) {
  if (s.why) s.repaint = true;
  else if ((s.why = forced(s))) s.repaint = true;
  else if (args['check-all'] || !current(s)) s.check = true;
}

// ---- check: draw a sample of each piece again, and compare ----
const checks = plan.filter(s => s.check);
if (checks.length) {
  const samples = s => { const out = []; for (let k = 0; k < s.n; k += EVERY) out.push(s.f0 + k); if (out.at(-1) !== s.f0 + s.n - 1) out.push(s.f0 + s.n - 1); return out; };
  const all = checks.flatMap(samples);
  console.log(`checking ${checks.length} of ${plan.length} pieces: drawing ${all.length} sample frames`);
  drawFrames(all);
  const worst = { luma: 0, colour: 0 };
  for (const s of checks) {
    const list = samples(s), old = small(['-i', `${SEG}/${s.file}`]);
    writeFileSync(`${WORK}/list.txt`, list.map(i => `file '${resolve(`${WORK}/f${f5(i)}.jpg`)}'`).join('\n') + '\n');
    const now = small(['-f', 'concat', '-safe', '0', '-i', `${WORK}/list.txt`]);
    if (old.length !== s.n * FRAME || now.length !== list.length * FRAME) { s.repaint = true; s.why = 'its video isn\'t the length the manifest says'; continue; }
    let differ = 0, first = null, most = { luma: 0, colour: 0 };
    list.forEach((i, k) => {
      const d = difference(old.subarray((i - s.f0) * FRAME, (i - s.f0 + 1) * FRAME), now.subarray(k * FRAME, (k + 1) * FRAME));
      if (d.changed) { differ++; first ??= { i, ...d }; } else for (const m of ['luma', 'colour']) most[m] = Math.max(most[m], d[m]);
      if (args.verbose) console.log(`  ${clock(i)} (frame ${i}): brightness ${d.luma} (${d.over} over 8), colour ${d.colour}${d.changed ? '  changed' : ''}`);
    });
    for (const m of ['luma', 'colour']) worst[m] = Math.max(worst[m], most[m]);
    if (differ) { s.repaint = true; s.why = `${differ} of ${list.length} samples differ, the first at ${clock(first.i)} (brightness ${first.luma}, colour ${first.colour})`; }
    else Object.assign(s, { engine: P.engine, shots: printsFor(s) });
  }
  console.log(`checked: ${checks.filter(s => !s.repaint).length} pieces unchanged, ${checks.filter(s => s.repaint).length} changed; the largest difference among unchanged frames: brightness ${worst.luma}, colour ${worst.colour} (limits ${LUMA}, ${COLOUR})`);
}
if (args.dry) {
  for (const s of plan.filter(s => s.repaint)) console.log(`would repaint ${span(s)}: ${s.why}`);
  console.log(`${plan.filter(s => s.repaint).length} of ${plan.length} pieces would be repainted`);
  rmSync(WORK, { recursive: true, force: true }); process.exit(0);
}
// (a piece waiting to be repainted keeps its old video but no prints, so a run that stops first checks it again)
M.pieces = plan.filter(s => s.file).map(s => ({ file: s.file, f0: s.f0, n: s.n, engine: s.repaint ? null : s.engine, shots: s.repaint ? {} : s.shots }));
save(M);

// ---- repaint: every frame of each changed piece, in batches, encoded as a piece of its own ----
const redo = plan.filter(s => s.repaint);
for (const s of redo) console.log(`repaint ${span(s)}: ${s.why}`);
for (let i = 0; i < redo.length;) {
  const batch = []; let frames = 0;
  while (i < redo.length && (!batch.length || frames + redo[i].n <= 2400)) { batch.push(redo[i]); frames += redo[i++].n; }
  drawFrames(batch.flatMap(s => Array.from({ length: s.n }, (_, k) => s.f0 + k)));
  for (const s of batch) {
    // its frames in a folder of their own, numbered from 0 (the encoder reads a numbered sequence to its end)
    const file = `p${f5(s.f0)}_${s.n}_${Date.now().toString(36)}.mp4`, own = `${WORK}/piece`;
    rmSync(own, { recursive: true, force: true }); mkdirSync(own);
    for (let k = 0; k < s.n; k++) renameSync(`${WORK}/f${f5(s.f0 + k)}.jpg`, `${own}/f${f5(k)}.jpg`);
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(FPS), '-i', `${own}/f%05d.jpg`,
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', `${SEG}/${file}`]);
    rmSync(own, { recursive: true, force: true });
    if (probeFrames(`${SEG}/${file}`) !== s.n) { console.error(`the piece ${span(s)} came out the wrong length`); process.exit(1); }
    M.pieces = M.pieces.filter(p => p.f0 !== s.f0).concat({ file, f0: s.f0, n: s.n, engine: P.engine, shots: printsFor(s) }).sort((a, b) => a.f0 - b.f0);
    save(M);
  }
  console.log(`repainted ${Math.min(i, redo.length)} of ${redo.length} pieces`);
}
rmSync(WORK, { recursive: true, force: true });
const used = new Set(M.pieces.map(p => p.file));
for (const f of readdirSync(SEG)) if (!used.has(f)) rmSync(`${SEG}/${f}`);

// ---- the chapter: the pieces joined (a copy), with its sound ----
let at = 0; for (const p of M.pieces) { if (p.f0 !== at) { console.error(`the pieces don't meet at frame ${at}`); process.exit(1); } at += p.n; }
if (at !== TOTAL) { console.error(`the pieces cover ${at} frames, not ${TOTAL}`); process.exit(1); }
const voice = `audio/ch${CH}.wav`, full = `audio/ch${CH}_full.wav`;
const audio = !existsSync(voice) ? null : existsSync(full) && statSync(full).mtimeMs >= statSync(voice).mtimeMs ? full : voice;
if (audio === voice) console.log(`note: ${existsSync(full) ? `${full} is older than the voice` : `no ${full}`}, so this has the voice without its sounds (node tools/sfx.mjs mixes them)`);
const newest = Math.max(statSync(MF).mtimeMs, audio ? statSync(audio).mtimeMs : 0);
if (!args.force && !redo.length && existsSync(VIDEO) && statSync(VIDEO).mtimeMs > newest && Math.abs(probeFrames(VIDEO) - TOTAL) <= 2) { console.log(`${VIDEO} is current`); process.exit(0); }
writeFileSync(`${DIR}/join.txt`, M.pieces.map(p => `file '${resolve(`${SEG}/${p.file}`)}'`).join('\n') + '\n');
execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', `${DIR}/join.txt`,
  ...(audio ? ['-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest'] : []), '-c:v', 'copy', '-movflags', '+faststart', `${VIDEO}.part.mp4`]);
const got = probeFrames(`${VIDEO}.part.mp4`);
if (Math.abs(got - TOTAL) > 2) { console.error(`the joined chapter has ${got} frames, not ${TOTAL}`); process.exit(1); }
renameSync(`${VIDEO}.part.mp4`, VIDEO);
console.log(`wrote ${VIDEO}: ${M.pieces.length} pieces, ${redo.length} repainted${audio ? ', with ' + audio : ''}`);
