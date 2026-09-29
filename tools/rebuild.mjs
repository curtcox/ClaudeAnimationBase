// rebuild.mjs: regenerates everything needed to watch and review the film on this computer, unattended (overnight).
//   npm run rebuild                         everything
//   npm run rebuild -- --chapters=2,5       just those chapters' voices, drafts and checks (the script, timelines, film and site are still rebuilt)
//   npm run rebuild -- --qr                 also prove every painted code scans (tools/qr_check.mjs; slow)
//   npm run rebuild -- --no-serve           don't start the review server at the end
//   npm run rebuild -- --final              final-quality renders (out/chNN.mp4) instead of drafts: many hours
// (npm start runs this after putting the site up; see tools/start.mjs.)
//
// In order, carrying on past failures (each is logged and retried once where a retry can help):
//   1. the script from the transcript, and the proof that it's still word for word  (build_script, verbatim_check)
//   2. the voice for every chapter, which retimes the timelines                        (voice or scratch_voice → timeline)
//      The real voice (script/voices.yaml, ElevenLabs) if it's cast, else the Mac's scratch voice.
//      Then the sound effects and music, made if new and mixed under it                  (sfx → audio/chNN_full.wav)
//   3. the references against the script, offline                                     (check_refs --offline)
//   4. each chapter's draft video and its watch page, which adds it to the site        (render --draft, watch)
//      Drafts are resumable: only shots whose code, timing or codes changed are repainted, and a chapter with nothing
//      new isn't encoded again.
//   5. the whole film, joined, and what YouTube needs                                   (assemble)
//   6. the companion site, the chapter checks, and the review digest                   (build_site, lint_chapter, review digest)
//   7. the review server, if it isn't already running                                  (serve → http://localhost:8077/review/)
// It keeps the Mac awake while it runs (caffeinate), refuses to start while another rebuild is running, and writes
// out/rebuild/<start time>.log (everything the steps printed) and out/rebuild/last.json (each step, ok or not, how
// long), which the review index shows. Exits 1 if any step failed.
import { spawn, spawnSync } from 'node:child_process';
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, openSync } from 'node:fs';
import { readYaml, PATHS } from './script_lib.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));

// keep the machine awake: run again under caffeinate (idle and system sleep held off until this process ends)
if (process.platform === 'darwin' && !process.env.REBUILD_AWAKE && spawnSync('which', ['caffeinate']).status === 0) {
  const r = spawnSync('caffeinate', ['-i', '-s', process.execPath, ...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, REBUILD_AWAKE: '1' } });
  process.exit(r.status ?? 1);
}

const DIR = 'out/rebuild', LOCK = `${DIR}/lock`;
mkdirSync(DIR, { recursive: true });
if (existsSync(LOCK)) {
  const pid = +readFileSync(LOCK, 'utf8');
  let alive = false; try { process.kill(pid, 0); alive = true; } catch { }
  if (alive) { console.error(`another rebuild is running (pid ${pid}); stop it or wait`); process.exit(1); }
}
writeFileSync(LOCK, String(process.pid));
const release = () => { try { if (readFileSync(LOCK, 'utf8') === String(process.pid)) rmSync(LOCK); } catch { } };
process.on('exit', release);
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { release(); process.exit(130); });

const started = new Date(), p2 = n => String(n).padStart(2, '0');
const stampName = `${started.getFullYear()}-${p2(started.getMonth() + 1)}-${p2(started.getDate())}_${p2(started.getHours())}${p2(started.getMinutes())}`;   // local time
const logPath = `${DIR}/${stampName}.log`, log = createWriteStream(logPath);
const say = s => { const line = `[${new Date().toTimeString().slice(0, 8)}] ${s}`; console.log(line); log.write(line + '\n'); };
const steps = [];
let planned = 0;   // how many steps this run will take, for the site's progress line
const report = done => writeFileSync(`${DIR}/last.json`, JSON.stringify({ started: started.toISOString(), finished: done ? new Date().toISOString() : null,
  log: logPath, planned, steps, failed: steps.filter(s => !s.ok).map(s => s.name) }, null, 1) + '\n');

// one step: a command, its output to the log only (the terminal gets one line per step), retried once if asked
function run(name, cmd, cmdArgs, { retry = false } = {}) {
  return new Promise(res => {
    const go = attempt => {
      const t0 = Date.now(); log.write(`\n===== ${name}${attempt > 1 ? ` (attempt ${attempt})` : ''}: ${cmd} ${cmdArgs.join(' ')}\n`);
      const p = spawn(cmd, cmdArgs, { stdio: ['ignore', 'pipe', 'pipe'] });
      p.stdout.pipe(log, { end: false }); p.stderr.pipe(log, { end: false });
      p.on('close', code => {
        const secs = Math.round((Date.now() - t0) / 1000);
        if (code !== 0 && retry && attempt < 2) { say(`✗ ${name} failed (exit ${code}) after ${secs} s; trying once more`); return go(attempt + 1); }
        steps.push({ name, ok: code === 0, exit: code, secs, attempts: attempt }); report(false);
        say(`${code === 0 ? '✓' : '✗'} ${name} (${secs >= 90 ? Math.round(secs / 60) + ' min' : secs + ' s'})`);
        res(code === 0);
      });
      p.on('error', e => { log.write(String(e) + '\n'); });
    };
    go(1);
  });
}

const node = (name, script, a = [], o) => run(name, process.execPath, [script, ...a], o);
const FINAL = !!args.final, all = readYaml(PATHS.chapters).map(c => c.n);
const chapters = args.chapters ? String(args.chapters).split(',').map(Number).filter(n => all.includes(n)) : all;
planned = 5 + chapters.length * (FINAL ? 3 : 2) + 3 + (args.chapters ? 2 * chapters.length : 2) + (args.qr ? 1 : 0);
say(`rebuild started; log: ${logPath}`);

// 1-3: script, voice, timelines, references
if (await node('script from the transcript', 'tools/build_script.mjs')) await node('word-for-word check', 'tools/verbatim_check.mjs');
// the voice: the real one (voice.mjs, ElevenLabs; its clips are committed, so no key is needed for lines already voiced),
// else the Mac's scratch voice. With --chapters, only those chapters' voices are made and mixed.
const VOICE = existsSync('script/voices.yaml') ? ['voice', 'tools/voice.mjs'] : process.platform === 'darwin' ? ['scratch voice', 'tools/scratch_voice.mjs'] : null;
if (!VOICE) { steps.push({ name: 'voice (skipped: needs macOS)', ok: true, secs: 0, attempts: 0 }); say('- voice skipped: the scratch voice needs the Mac\'s say'); }
else if (args.chapters) for (const n of chapters) await node(`${VOICE[0]} (chapter ${n})`, VOICE[1], [`--chapter=${n}`], { retry: true });
else await node(`${VOICE[0]} (all chapters)`, VOICE[1], [], { retry: true });
await node('timelines', 'tools/timeline.mjs');
await node('sounds, mixed under the voice', 'tools/sfx.mjs');
await node('references (offline)', 'tools/check_refs.mjs', ['--offline']);

// 4: each chapter's video and watch page (the watch step rebuilds the site, so the chapter shows up there straight away)
for (const n of chapters) {
  const made = FINAL
    ? await node(`chapter ${n} frames`, 'render.mjs', [`--chapter=${n}`, '--frames'], { retry: true }) && await node(`chapter ${n} encode`, 'render.mjs', [`--chapter=${n}`, '--encode'])
    : await node(`chapter ${n} draft`, 'render.mjs', [`--chapter=${n}`, '--draft'], { retry: true });
  if (made) await node(`chapter ${n} watch page`, 'tools/watch.mjs', [`--chapter=${n}`, ...(FINAL ? [`--video=out/ch${String(n).padStart(2, '0')}.mp4`] : [])], { retry: true });
}

// 5: the whole film
await node('the whole film', 'tools/assemble.mjs', FINAL ? ['--final'] : []);

// 6: site, checks, digest
await node('companion site', 'tools/build_site.mjs');
if (args.chapters) for (const n of chapters) await node(`chapter ${n} checks`, 'tools/lint_chapter.mjs', [`--chapter=${n}`]);
else await node('chapter checks', 'tools/lint_chapter.mjs');
if (args.qr) await node('QR codes scan', 'tools/qr_check.mjs');
await node('review digest', 'tools/review.mjs', ['digest']);

// 7: the review server
if (!args['no-serve']) {
  let up = false; try { up = (await fetch('http://localhost:8077/api/review', { signal: AbortSignal.timeout(3000) })).ok; } catch { }
  if (up) say('review server already running: http://localhost:8077/review/');
  else {
    const out = openSync(`${DIR}/serve.log`, 'a');
    spawn(process.execPath, ['tools/serve.mjs'], { detached: true, stdio: ['ignore', out, out] }).unref();
    say('started the review server: http://localhost:8077/review/');
  }
}

report(true);
const failed = steps.filter(s => !s.ok);
say(failed.length ? `finished with ${failed.length} failed step(s): ${failed.map(s => s.name).join(', ')}. Details in ${logPath}` : 'finished: everything rebuilt');
log.end();
process.exitCode = failed.length ? 1 : 0;
