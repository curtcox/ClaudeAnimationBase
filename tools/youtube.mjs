// youtube.mjs: the YouTube upload's words → out/film/youtube.md (title, description, tags), to paste in.
//   node tools/youtube.mjs     from out/film/film.json (tools/assemble.mjs writes it, then runs this)
// The description: what the film is, the code and the companion site, the chapter markers, then as many of the film's
// links as fit in YouTube's 5,000 characters, each at its time in the film. The most important go in first:
//   the feature cards (★ in VIDEO_PLAN §3), then the links in the conversation itself, then codes on cards, then the
//   explainer pages, then the rest, each tier in film order. A page-mode link (no code of its own) is left to its explainer.
// The list is then sorted by time. Each link is the address its code encodes (the shortest: script_lib's withQrTargets).
// A link's time is when its code goes up (out/watch/chNN.json), else its line's start; a link with neither is left out.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { readYaml, pad, loadRefs } from './script_lib.mjs';

const DIR = 'out/film', LIMIT = 5000;
if (!existsSync(`${DIR}/film.json`)) { console.error(`no ${DIR}/film.json yet: join the film first (npm run film)`); process.exit(1); }
const film = JSON.parse(readFileSync(`${DIR}/film.json`, 'utf8')), site = readYaml('script/site.yaml');
const total = film.duration, FINAL = film.final;

const hms = s => { s = Math.floor(s); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return `${h ? h + ':' + pad(m) : m}:${pad(s % 60)}`; };
// YouTube's rules for chapter markers: the first at 0:00, at least three, each at least 10 s long; with a film over an
// hour, every marker carries its hours so they line up
const stampOf = s => total >= 3600 ? (() => { s = Math.floor(s); return `${Math.floor(s / 3600)}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`; })() : hms(s);
const marks = film.chapters.map((c, i) => `${stampOf(c.start)} ${i === 0 ? 'Cold open' : c.title}`);
const short = film.chapters.filter(c => c.secs < 10).length;

// ---- when each code goes up in the film ----
const when = new Map(), lines = new Map();
film.chapters.forEach(c => {
  const f = `out/watch/ch${pad(c.n)}.json`;
  if (existsSync(f)) for (const x of JSON.parse(readFileSync(f, 'utf8')).times) if (!when.has(x.id)) when.set(x.id, c.start + x.t0);
  const g = {}, gen = `src/gen/ch${pad(c.n)}.js`;
  if (existsSync(gen)) { new Function('window', readFileSync(gen, 'utf8'))(g); lines.set(c.n, g.CHAPTER.lines.map(l => ({ ...l, t0: c.start + l.t0 }))); }
});
const refs = loadRefs(), conv = refs.find(r => r.id === 'the-conversation');
// `at` is a line id, or a phrase: the first spoken line in chapter `ch` that has it
const lineAt = r => [...lines.values()].flat().find(l => l.id === r.at) || (lines.get(r.ch) || []).find(l => l.spoken && l.text.includes(r.at));
const timeOf = r => when.get(r.id) ?? lineAt(r)?.t0;
const tier = r => r.mode === 'feature' ? 0 : r.origin === 'transcript' ? 1 : r.mode === 'card' ? 2 : r.origin === 'note' ? 3 : 4;
// YouTube refuses angle brackets in a description
const clean = s => String(s).replace(/[<>]/g, '').replace(/^Explained: /, '');
const lineOf = r => `${hms(timeOf(r))} ${r.origin === 'note' ? 'Explained: ' : ''}${clean(r.caption)} ${r.qr_url || r.url}`;
// a page-mode link has no code in the film: the explainer that stands for it is listed instead
const ranked = refs.filter(r => !['the-conversation', 'companion'].includes(r.id) && r.mode !== 'page' && timeOf(r) != null)
  .sort((a, b) => tier(a) - tier(b) || timeOf(a) - timeOf(b));

const head = `An animated film of one long Saturday-morning conversation between Curt and Claude, an AI program, near word for word: from a MAD magazine parody of Planet of the Apes, through frogs, axolotls and mirror tests, to the July 2026 Hugging Face incident and P(foom).

The conversation itself: ${conv.qr_url || conv.url}
Every link in the film (${refs.length - 1} of them), by time, with plain-language explanations: ${site.base}
The code that draws the film (you can make it yourself): ${site.film.repo}

Chapters
${marks.join('\n')}
`;
const foot = `
Drawn in code by Claude (p5.js and p5.brush), from the conversation's transcript. Voices: ElevenLabs.
The comic page, the chart and the alignment compass are repainted for commentary; no logos, and the caricatures are affectionate. Fair use: commentary and parody.`;
const linksHead = '\nSome of the links, by time (the rest are on the site)\n';
const describe = picked => head + linksHead + picked.slice().sort((a, b) => timeOf(a) - timeOf(b)).map(lineOf).join('\n') + '\n' + foot;
const picked = [];
for (const r of ranked) if (describe([...picked, r]).length <= LIMIT) picked.push(r);
const description = describe(picked);

const md = `# The YouTube upload

Written by tools/youtube.mjs from ${FINAL ? 'the final renders' : 'the drafts (upload only the final)'}. Paste these in when uploading ${DIR}/film.mp4.

## Title
Frog or Axolotl

## Description (${description.length} of YouTube's ${LIMIT.toLocaleString('en')} characters; ${picked.length} of the film's links)
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
if (description.length > LIMIT) { console.error(`the description is ${description.length} characters; YouTube takes ${LIMIT}`); process.exit(1); }
console.log(`${DIR}/youtube.md: ${description.length} characters, ${picked.length} links`);
