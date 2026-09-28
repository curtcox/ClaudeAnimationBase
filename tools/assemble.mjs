// assemble.mjs: joins the chapters into one film, and writes what YouTube needs alongside it.
//   node tools/assemble.mjs            the drafts (out/chNN_draft.mp4) → out/film/film.mp4          (npm run film)
//   node tools/assemble.mjs --final    the final renders (out/chNN.mp4) → out/film/film.mp4
//   --force                            join again even if the film is newer than every chapter
// Stream copy, so it takes seconds, and it's skipped when nothing changed. Every chapter must have its video.
// Also writes, in out/film/:
//   film.json    which renders went in, and where each chapter starts in the film (the site's film page uses it)
//   youtube.md   the upload's title, description (chapter markers, the companion site) and tags, to paste in
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, writeFileSync, readFileSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';
import { PATHS, readYaml, pad } from './script_lib.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const FINAL = !!args.final, DIR = 'out/film', OUT = `${DIR}/film.mp4`;
const chapters = readYaml(PATHS.chapters), site = readYaml('script/site.yaml');
const videos = chapters.map(c => `out/ch${pad(c.n)}${FINAL ? '' : '_draft'}.mp4`);
const gone = chapters.filter((c, i) => !existsSync(videos[i]));
if (gone.length) { console.error(`no ${FINAL ? 'final render' : 'draft'} yet for chapter${gone.length > 1 ? 's' : ''} ${gone.map(c => c.n).join(', ')}; render ${gone.length > 1 ? 'them' : 'it'} first (npm run rebuild)`); process.exit(1); }
mkdirSync(DIR, { recursive: true });

const probe = f => JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height,r_frame_rate', '-of', 'json', f]).toString());
const info = videos.map(f => { const p = probe(f), v = p.streams.find(s => s.codec_type === 'video');
  return { file: f, secs: +p.format.duration, audio: p.streams.some(s => s.codec_type === 'audio'), shape: `${v.width}x${v.height}@${v.r_frame_rate}` }; });
// stream copy needs every chapter alike
for (const k of ['audio', 'shape']) if (new Set(info.map(x => x[k])).size > 1)
  { console.error(`the chapters differ in ${k === 'audio' ? 'whether they have a voice track' : 'size or frame rate'}: ${info.map((x, i) => `${chapters[i].n}: ${x[k]}`).join(', ')}. Render them again alike.`); process.exit(1); }

const start = []; info.reduce((t, x, i) => (start[i] = t) + x.secs, 0);
const total = start.at(-1) + info.at(-1).secs;
const fresh = existsSync(OUT) && existsSync(`${DIR}/film.json`) && JSON.parse(readFileSync(`${DIR}/film.json`, 'utf8')).final === FINAL
  && videos.every(f => statSync(f).mtimeMs < statSync(OUT).mtimeMs);
if (fresh && !args.force) console.log(`${OUT} is current (every chapter is older than it)`);
else {
  writeFileSync(`${DIR}/list.txt`, videos.map(f => `file '${resolve(f).replace(/'/g, "'\\''")}'`).join('\n') + '\n');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', `${DIR}/list.txt`, '-c', 'copy', '-movflags', '+faststart', OUT + '.part.mp4'], { stdio: 'inherit' });
  renameSync(OUT + '.part.mp4', OUT);
  console.log(`${OUT}: ${chapters.length} chapters, ${hms(total)}${info[0].audio ? '' : ' (no voice track)'}`);
}
writeFileSync(`${DIR}/film.json`, JSON.stringify({ final: FINAL, duration: +total.toFixed(3), chapters: chapters.map((c, i) => ({ n: c.n, title: c.title, video: videos[i], start: +start[i].toFixed(3), secs: +info[i].secs.toFixed(3) })) }, null, 1) + '\n');

// ---- the YouTube upload's words ----
function hms(s) { s = Math.floor(s); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return `${h ? h + ':' + pad(m) : m}:${pad(s % 60)}`; }
// YouTube's rules for chapter markers: the first at 0:00, at least three, each at least 10 s long; with a film over an hour,
// every stamp carries its hours so they line up
const stampOf = s => total >= 3600 ? (() => { s = Math.floor(s); return `${Math.floor(s / 3600)}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`; })() : hms(s);
const marks = chapters.map((c, i) => `${stampOf(start[i])} ${i === 0 ? 'Cold open' : c.title}`);
const short = info.filter(x => x.secs < 10).length;
const description = `An animated film of one long Saturday-morning conversation between Curt and Claude, an AI program, near word for word: from a MAD magazine parody of Planet of the Apes, through frogs, axolotls and mirror tests, to the July 2026 Hugging Face incident and P(foom).

Every reference in the film, by time, with plain-language explanations: ${site.base}
Each QR code on screen goes to its source or to an explainer there.

${marks.join('\n')}

Drawn in code by Claude (p5.js and p5.brush), from the conversation's transcript. Voices: ElevenLabs.
The comic page, the chart and the alignment compass are repainted for commentary; no logos, and the caricatures are affectionate. Fair use: commentary and parody.`;
const md = `# The YouTube upload

Written by tools/assemble.mjs from ${FINAL ? 'the final renders' : 'the drafts (upload only the final)'}. Paste these in when uploading ${OUT}.

## Title
Frog or Axolotl

## Description (${description.length} of YouTube's 5,000 characters)
\`\`\`
${description}
\`\`\`
${short ? `\n**Warning:** ${short} chapter(s) are under 10 s, so YouTube won't show the chapter markers.\n` : ''}
## Tags
AI, Claude, animation, AI safety, eval awareness, P(doom), mind space, Hugging Face incident, frog, axolotl

## After it's up
Put the video's id (the part after \`v=\`) in \`script/site.yaml\` as \`film: youtube:\`, commit and push: the site then embeds it.
`;
writeFileSync(`${DIR}/youtube.md`, md);
if (description.length > 5000) { console.error(`the description is ${description.length} characters; YouTube takes 5,000`); process.exit(1); }
console.log(`${DIR}/film.json, ${DIR}/youtube.md`);
