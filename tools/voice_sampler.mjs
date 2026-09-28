// voice_sampler.mjs: the casting sampler (VIDEO_PLAN.md §7, phase 3). A few of each speaker's lines, read by each
// candidate voice, on one page: http://localhost:8077/voices/ (npm run serve), from out/voices/.
//   node tools/voice_sampler.mjs      only clips not made yet are sent to ElevenLabs (cached by voice, model and words)
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { eleven } from './eleven.mjs';
import { PATHS, readYaml } from './script_lib.mjs';

const MODEL = 'eleven_v3', DIR = 'out/voices';
const CAST = {
  curt: { lines: ['T06.U.01', 'T19.U.01', 'T11.U.01', 'T54.U.01', 'T25.U.01'], voices: [
    ['v5jzrCIKG2KGXdOHcRHY', 'Curt Cox 1', 'your clone'], ['qCYgSspmts8E3GyY0tyz', 'Curt Cox 2', 'your clone'], ['fipaU0xq9ISjMgIbiAsW', 'Quick clone of Curt', 'your clone'],
    ['UgBBYS2sOqTuMpoF3BR0', 'Mark', 'stock: natural, conversational'], ['iP95p4xoKVk53GoZ742B', 'Chris', 'stock: down-to-earth'], ['onwK4e9ZLuTAKqWW03F9', 'Daniel', 'stock: British, steady']] },
  claude: { lines: ['T06.C.01', 'T19.C.01', 'T11.C.03.2', 'T17.C.01', 'T64.C.04', 'T78.C.02'], voices: [
    ['SAz9YHcvj6GT2YYXdXww', 'River', 'stock: neutral, calm'], ['cjVigY5qzO86Huf0OWal', 'Eric', 'stock: smooth, trustworthy'], ['XrExE9yKIg1WjnnlVkGX', 'Matilda', 'stock: knowledgeable, warm alto']] },
};
const script = readYaml(PATHS.script), byId = new Map(script.lines.map(l => [l.id, l]));
mkdirSync(DIR, { recursive: true });
let made = 0, chars = 0;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const sections = [];
for (const [who, { lines, voices }] of Object.entries(CAST)) {
  const rows = [];
  for (const [id, name, what] of voices) {
    const clips = [];
    for (const lid of lines) {
      const l = byId.get(lid); if (!l) throw new Error(`no line ${lid}`);
      const f = `${createHash('sha256').update(`${id}|${MODEL}|${l.speech}`).digest('hex').slice(0, 16)}.mp3`;
      if (!existsSync(`${DIR}/${f}`)) {
        writeFileSync(`${DIR}/${f}`, await eleven(`text-to-speech/${id}?output_format=mp3_44100_128`, { method: 'POST', body: { text: l.speech, model_id: MODEL }, raw: true }));
        made++; chars += l.speech.length;
      }
      clips.push(f);
    }
    // all of a voice's lines in a row, with a short gap, to hear it as a speaker
    const all = `${who}-${name.replace(/\W+/g, '_')}.mp3`;
    writeFileSync(`${DIR}/list.txt`, clips.map(c => `file '${c}'\nfile 'gap.mp3'`).join('\n') + '\n');
    if (!existsSync(`${DIR}/gap.mp3`)) execFileSync('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', '0.8', '-b:a', '128k', `${DIR}/gap.mp3`]);
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', `${DIR}/list.txt`, '-ar', '44100', '-ac', '1', '-b:a', '128k', `${DIR}/${all}`]);
    rows.push(`<tr><th>${esc(name)}<div class="small">${esc(what)}</div><audio controls preload="none" src="${all}"></audio></th>${clips.map(c => `<td><audio controls preload="none" src="${c}"></audio></td>`).join('')}</tr>`);
  }
  sections.push(`<h2>${who === 'curt' ? 'Curt' : 'Claude'}</h2><table><tr><th>voice (all its lines)</th>${lines.map(id => `<th class="line">${esc(byId.get(id).speech)}</th>`).join('')}</tr>${rows.join('')}</table>`);
}
writeFileSync(`${DIR}/index.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Voice sampler</title><style>
body{font:17px/1.4 Georgia,serif;background:#FBF8F0;color:#1E1A22;margin:1.5rem}table{border-collapse:collapse}td,th{border:1px solid #D9D2C4;padding:.4rem;vertical-align:top;text-align:left}
th.line{font-weight:normal;font-style:italic;font-size:.85rem;max-width:14rem}audio{width:12rem}.small{font:.75rem system-ui;color:#6A6470;margin-bottom:.3rem}</style></head><body>
<h1>Voice sampler</h1><p>Model ${MODEL}. Each voice reads the same lines. Tell Claude which voice you want for each speaker.</p>${sections.join('')}</body></html>\n`);
console.log(`${made} new clips (${chars} characters) → ${DIR}/index.html; http://localhost:8077/voices/`);
