// films.mjs: every translation's film, draft or final, unattended, one language after another (i18n/PLAN.md).
//   node i18n/tools/films.mjs                 each language's draft film → i18n/<lang>/stage/out/film/film.mp4
//   node i18n/tools/films.mjs --final         the final-quality film instead (tools/final.mjs): about 5.5 hours a language
//                                             the first time, then only what changed. On the faster Mac.
//   --langs=ja,zh                             only those languages (default: every one in i18n/)
//   --chapters=2,5                            only those chapters' videos; the film is joined when every chapter has one
//   --keep-frames                             (drafts) keep each chapter's frames, so a re-run repaints only the shots that
//                                             changed: about 10 GB a language. Without it, they're deleted once the
//                                             chapter's video is made, and a re-run paints it all again.
//   --prune                                   (finals) once a language's film is joined, delete its pieces
//                                             (out/final/chNN/), keeping the chapters' videos and the film
//   --dry                                     say what would run, and nothing else
// For each language, in the language's stage (i18n/<lang>/stage/, where the English tools run on the translation):
//   1. the stage, refreshed from the translation                                   (i18n/tools/stage.mjs)
//   2. the voice: the committed clips, mixed. A line not voiced yet stops the language: voicing needs the ElevenLabs
//      key, which a render shouldn't spend unasked (node tools/voice.mjs in the stage voices it).   (voice --dry, voice)
//   3. the timelines, and the sounds mixed under the voice (a sound not made yet is made: that needs the key) (timeline, sfx)
//   4. each chapter's draft (render.mjs --draft) or final (tools/final.mjs)
//   5. the film, joined, with its subtitles.srt and youtube.md beside it (out/film/)              (assemble)
// The stage again at the end, which moves any new sound into i18n/<lang>/sfx to be committed.
// A failure ends that language (each step that can fail by chance is tried twice) and the next one starts. It keeps the
// Mac awake, refuses to start while an English rebuild or another of these is running (they'd share the graphics card),
// stops before a language when the disk is nearly full, and writes out/i18n/<start time>.log (everything the steps
// printed) and out/i18n/last.json (each step, ok or not, how long). Exits 1 if any language failed.
import { spawn, spawnSync } from 'node:child_process';
import { createWriteStream, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, rmSync } from 'node:fs';
import { args, pad, readYaml } from './i18n_lib.mjs';

// keep the machine awake, as tools/rebuild.mjs does
if (process.platform === 'darwin' && !args.dry && !process.env.REBUILD_AWAKE && spawnSync('which', ['caffeinate']).status === 0) {
  const r = spawnSync('caffeinate', ['-i', '-s', process.execPath, ...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, REBUILD_AWAKE: '1' } });
  process.exit(r.status ?? 1);
}

const ROOT = process.cwd(), FINAL = !!args.final, DRY = !!args.dry;
if (!existsSync(`${ROOT}/i18n/tools/stage.mjs`)) { console.error('run this from the project\'s root: node i18n/tools/films.mjs'); process.exit(1); }
const every = readdirSync('i18n').filter(d => existsSync(`i18n/${d}/script`)).sort();
const langs = args.langs ? String(args.langs).split(',') : every;
const unknown = langs.filter(l => !every.includes(l));
if (unknown.length) { console.error(`no translation for ${unknown.join(', ')} (there are ${every.join(', ')})`); process.exit(1); }
// room for a language: a draft needs one chapter's frames at a time; a final, its pieces, its chapters and its film
const NEEDS_GB = FINAL ? 25 : 4;
const freeGB = () => +spawnSync('df', ['-k', ROOT], { encoding: 'utf8' }).stdout.trim().split('\n').pop().split(/\s+/)[3] / 2 ** 20;

const alive = lock => { if (!existsSync(lock)) return 0; const pid = +readFileSync(lock, 'utf8'); try { process.kill(pid, 0); return pid; } catch { return 0; } };
const DIR = 'out/i18n', LOCK = `${DIR}/lock`;
if (!DRY) {
  for (const [lock, what] of [['out/rebuild/lock', 'an English rebuild'], [LOCK, 'another films.mjs']]) {
    const pid = alive(lock); if (pid) { console.error(`${what} is running (pid ${pid}); stop it or wait`); process.exit(1); }
  }
  mkdirSync(DIR, { recursive: true }); writeFileSync(LOCK, String(process.pid));
  const release = () => { try { if (readFileSync(LOCK, 'utf8') === String(process.pid)) rmSync(LOCK); } catch { } };
  process.on('exit', release);
  for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { release(); process.exit(130); });
}

const started = new Date(), p2 = n => String(n).padStart(2, '0');
const stamp = `${started.getFullYear()}-${p2(started.getMonth() + 1)}-${p2(started.getDate())}_${p2(started.getHours())}${p2(started.getMinutes())}`;
const logPath = `${DIR}/${stamp}.log`, log = DRY ? null : createWriteStream(logPath);
const say = s => { const line = `[${new Date().toTimeString().slice(0, 8)}] ${s}`; console.log(line); log?.write(line + '\n'); };
const steps = [];
const report = done => DRY || writeFileSync(`${DIR}/last.json`, JSON.stringify({ started: started.toISOString(), finished: done ? new Date().toISOString() : null,
  final: FINAL, langs, log: logPath, steps, failed: [...new Set(steps.filter(s => !s.ok).map(s => s.lang))] }, null, 1) + '\n');

// one step: node running a script in a directory, its output to the log (the terminal gets one line), tried twice if asked;
// resolves to its output, or null if it failed
const node = process.execPath;
function run(lang, name, cwd, script, a = [], { retry = false } = {}) {
  if (DRY) { console.log(`  ${lang}: ${name}  (${cwd === ROOT ? '' : `in ${cwd.slice(ROOT.length + 1)}: `}node ${script} ${a.join(' ')})`); return Promise.resolve(''); }
  return new Promise(res => {
    const go = attempt => {
      const t0 = Date.now(); let out = '';
      log.write(`\n===== ${lang}: ${name}${attempt > 1 ? ` (attempt ${attempt})` : ''}: node ${script} ${a.join(' ')}\n`);
      const p = spawn(existsSync(node) ? node : 'node', [script, ...a], { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
      for (const s of [p.stdout, p.stderr]) s.on('data', d => { out += d; log.write(d); });
      p.on('error', e => log.write(String(e) + '\n'));
      p.on('close', code => {
        const secs = Math.round((Date.now() - t0) / 1000);
        if (code !== 0 && retry && attempt < 2) { say(`✗ ${lang}: ${name} failed (exit ${code}) after ${secs} s; trying once more`); return go(attempt + 1); }
        steps.push({ lang, name, ok: code === 0, exit: code, secs, attempts: attempt }); report(false);
        say(`${code === 0 ? '✓' : '✗'} ${lang}: ${name} (${secs >= 90 ? Math.round(secs / 60) + ' min' : secs + ' s'})`);
        res(code === 0 ? out : null);
      });
    };
    go(1);
  });
}
const fail = (lang, why) => { steps.push({ lang, name: why, ok: false, secs: 0, attempts: 0 }); report(false); say(`✗ ${lang}: ${why}`); };

const films = [];   // the languages whose film was joined
say(`${FINAL ? 'final' : 'draft'} films for ${langs.join(', ')}${DRY ? ' (dry run)' : `; log: ${logPath}`}`);
for (const lang of langs) {
  const S = `${ROOT}/i18n/${lang}/stage`;
  if (!DRY && freeGB() < NEEDS_GB) { fail(lang, `stopped: ${freeGB().toFixed(0)} GB free, and a ${FINAL ? 'final' : 'draft'} film needs about ${NEEDS_GB} GB`); break; }
  if (await run(lang, 'the stage', ROOT, 'i18n/tools/stage.mjs', [`--lang=${lang}`]) == null) continue;
  const dry = await run(lang, 'lines still to voice', S, 'tools/voice.mjs', ['--dry']);
  if (dry == null) continue;
  const left = +((dry.match(/(\d+) to voice/) || [])[1] || 0);
  if (left) { fail(lang, `${left} line(s) not voiced yet: voice them first (in i18n/${lang}/stage: node tools/voice.mjs)`); continue; }
  if (await run(lang, 'the voice, mixed', S, 'tools/voice.mjs', [], { retry: true }) == null) continue;
  if (await run(lang, 'timelines', S, 'tools/timeline.mjs') == null) continue;
  if (await run(lang, 'sounds, mixed under the voice', S, 'tools/sfx.mjs', [], { retry: true }) == null) continue;

  const all = readYaml(`${S}/script/chapters.yaml`).map(c => c.n);
  const chapters = args.chapters ? String(args.chapters).split(',').map(Number).filter(n => all.includes(n)) : all;
  let ok = true;
  for (const n of chapters) {
    const made = FINAL
      ? await run(lang, `chapter ${n} final`, S, 'tools/final.mjs', [`--chapter=${n}`], { retry: true })
      : await run(lang, `chapter ${n} draft`, S, 'render.mjs', [`--chapter=${n}`, '--draft'], { retry: true });
    if (made == null) { ok = false; continue; }
    // a draft's frames, once its video is made (out/frames/chNN_draft); a final deletes its own as it goes
    if (!FINAL && !args['keep-frames'] && !DRY) rmSync(`${S}/out/frames/ch${pad(n)}_draft`, { recursive: true, force: true });
  }
  if (!ok) fail(lang, 'the film not joined: a chapter failed');
  else if (!all.every(n => DRY || existsSync(`${S}/out/ch${pad(n)}${FINAL ? '' : '_draft'}.mp4`)))
    say(`- ${lang}: the film not joined: not every chapter has its ${FINAL ? 'final' : 'draft'} yet`);
  else if (await run(lang, 'the film, joined', S, 'tools/assemble.mjs', FINAL ? ['--final'] : []) != null) {
    films.push(lang);
    if (FINAL && args.prune && !DRY) for (const n of all) rmSync(`${S}/out/final/ch${pad(n)}`, { recursive: true, force: true });
  }
  await run(lang, 'the stage, keeping any new sound', ROOT, 'i18n/tools/stage.mjs', [`--lang=${lang}`]);
}

report(true);
const failed = [...new Set(steps.filter(s => !s.ok).map(s => s.lang))];
if (DRY) say('dry run done');
else {
  for (const l of films) say(`  ${l}: i18n/${l}/stage/out/film/film.mp4`);
  say(`finished: ${films.length ? `${films.length} film(s) joined` : 'no film joined'}${failed.length ? `; failed: ${failed.join(', ')}. Details in ${logPath}` : ''}`);
}
log?.end();
process.exitCode = failed.length ? 1 : 0;
