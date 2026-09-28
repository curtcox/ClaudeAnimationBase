// script_lib.mjs: parse script/conversation.md into blocks, and turn a block's markdown into what the voice says.
// Shared by build_script.mjs (writes script/script.yaml) and verbatim_check.mjs (proves it matches the transcript).
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import YAML from 'yaml';

export const PATHS = {
  conversation: 'script/conversation.md', chapters: 'script/chapters.yaml', pronounce: 'script/pronounce.yaml',
  overrides: 'script/overrides.yaml', script: 'script/script.yaml', report: 'script/verbatim_report.md',
  summary: 'script/summary.md',
};
export const readYaml = p => YAML.parse(readFileSync(p, 'utf8'));
export const sha256 = s => createHash('sha256').update(s, 'utf8').digest('hex');

// Timing guesses, until real TTS durations replace them.
export const PACE = {
  wpm: 160,          // ElevenLabs' natural conversational pace
  afterCurt: 0.9,    // the beat after each of Curt's prompts (the brevity is the joke)
  afterLine: 0.35,   // breath between Claude's paragraphs
  turnGap: 0.6,      // between one exchange and the next
  tool: 2.5,         // "Searched the web" beat
  image: 6,          // an attached image, shown
  tableBase: 2.5, tableRow: 0.8,   // a painted table, held long enough to read
};

const HEADER_RE = /^# Conversation transcript\n\nSource: (\S+)\n\n/;

// → { source, turns: [{ n, curt: [block], claude: [block] }] }, where a block is its exact markdown
export function parseConversation(md) {
  const h = md.match(HEADER_RE);
  if (!h) throw new Error('conversation.md: unexpected header');
  const body = md.slice(h[0].length);
  if (!body.endsWith('\n')) throw new Error('conversation.md: missing final newline');
  const chunks = body.slice(0, -1).split(/\n\n(?=## T\d\d\n)/);
  const turns = chunks.map((c, i) => {
    const m = c.match(/^## T(\d\d)\n\n### Curt\n\n([\s\S]*?)\n\n### Claude\n\n([\s\S]*)$/);
    if (!m || +m[1] !== i + 1) throw new Error(`conversation.md: can't parse turn ${i + 1}`);
    return { n: +m[1], curt: m[2].split('\n\n'), claude: m[3].split('\n\n') };
  });
  return { source: h[1], turns };
}

export function renderConversation({ source, turns }) {
  const t = turns.map(t => `## T${pad(t.n)}\n\n### Curt\n\n${t.curt.join('\n\n')}\n\n### Claude\n\n${t.claude.join('\n\n')}`);
  return `# Conversation transcript\n\nSource: ${source}\n\n${t.join('\n\n')}\n`;
}

export const pad = n => String(n).padStart(2, '0');
const IMAGE = '_[image attached — hidden in share]_';
const LIST_LINE = /^(- |\d+\. |[a-z]\) )/;

// One script line per paragraph, per list item, per table, per tool beat, per image, per "Sources" block.
// ids: T08.C.03 (turn 8, Claude, block 3), T08.C.03.2 (its second list item), T08.U.00 (Curt's attached image).
export function blocksToLines(conv) {
  const lines = [];
  for (const t of conv.turns) {
    for (const [who, key, blocks] of [['curt', 'U', t.curt], ['claude', 'C', t.claude]]) {
      let n = 0, inSources = false;
      for (const text of blocks) {
        const base = { turn: t.n, speaker: who };
        if (text === IMAGE) { lines.push({ ...base, id: `T${pad(t.n)}.${key}.00`, kind: 'image', text }); continue; }
        const id = `T${pad(t.n)}.${key}.${pad(++n)}`;
        const all = text.split('\n');
        let kind = 'para';
        if (/^> _\[tool: .*\]_$/.test(text)) kind = 'tool';
        else if (all.every(l => l.startsWith('|'))) kind = 'table';
        else if (text === 'Sources:') { kind = 'sources'; inSources = true; }
        else if (LIST_LINE.test(all[0])) kind = 'list';
        const itemKind = inSources && all.every(l => /^- \[.*\]\(https?:\/\/[^)]+\)$/.test(l)) ? 'source' : 'item';
        if (kind !== 'sources') inSources = false;
        if (kind !== 'list') { lines.push({ ...base, id, kind, text, block: text }); continue; }
        // a list block: one line per item; items may wrap onto indented continuation lines
        const items = [];
        for (const l of all) if (LIST_LINE.test(l) || !items.length) items.push(l); else items[items.length - 1] += '\n' + l;
        items.forEach((item, j) => lines.push({ ...base, id: `${id}.${j + 1}`, kind: itemKind, text: item, block: text, blockId: id }));
      }
    }
  }
  return lines;
}

// Everything with words is spoken. Tables are painted, tool beats and attached images are pictures.
export const SPOKEN_KINDS = new Set(['para', 'item', 'sources', 'source']);

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function compileRespellings(list) {
  return list.map(r => {
    const pre = /^\w/.test(r.match) ? '(?<![\\w])' : '', post = /\w$/.test(r.match) ? '(?![\\w])' : '';
    return { ...r, re: new RegExp(pre + esc(r.match) + post, 'g') };
  });
}

// Markdown → words for the voice. Returns { speech, used: [matches applied] }.
export function autoSpeech(text, respellings) {
  let s = text;
  // A link is never read as a URL: the voice says its title while its QR code is on screen. A citation chip's
  // title loses the UI's "+2" count and " - " separator, and gets its own full stop after the sentence it follows.
  s = s.replace(/(\S?)(\s*)\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (m, prev, sp, label) => {
    const title = label.replace(/\s*\+\d+$/, '').replace(/ - /g, ', ');
    return /[.!?:]/.test(prev) ? `${prev} ${title}.` : prev + sp + title;
  });
  s = s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/(^|[^\w*])\*(?!\s)(.+?)\*(?!\w)/g, '$1$2');
  s = s.replace(/^- /, '');
  const used = [];
  for (const r of respellings) {
    r.re.lastIndex = 0;
    if (r.re.test(s)) { used.push(r.match); s = s.replace(r.re, r.say); }
  }
  s = s.replace(/\s+/g, ' ').trim();
  return { speech: s, used };
}

export const words = s => (s.match(/\S+/g) || []).length;

// The script line a reference in refs.yaml appears under: `at` is a line id, or a phrase (the first spoken line in `ch`
// whose text contains it).
export function resolveAnchor(r, lines, byId = new Map(lines.map(l => [l.id, l]))) {
  if (/^T\d\d\.[UC]\.\d\d/.test(r.at)) return byId.get(r.at);
  return lines.find(l => l.ch === r.ch && l.spoken && l.text.includes(r.at));
}

// Every reference: script/refs.yaml, plus one per explainer note (site/notes/*.md → script/notes_refs.yaml, written by
// tools/build_site.mjs), which point at the companion site.
export function loadRefs() {
  const refs = readYaml('script/refs.yaml');
  try { return refs.concat(readYaml('script/notes_refs.yaml') || []); } catch { return refs; }
}

// when character i of s (a timeline line's speech or text) is said, as src/scene_kit.js's sayAt: the voice's own word
// starts when the line has them, else that far through the line
export function sayAt(l, s, i) {
  let w = null;
  if (l.words && s === l.speech) for (let k = 0; k < l.words.length && l.words[k] <= i; k += 2) w = l.words[k + 1];
  return w != null ? l.t0 + w : l.t0 + (l.t1 - l.t0) * i / s.length;
}
