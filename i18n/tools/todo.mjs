// todo.mjs: what's left to translate, and what a translator needs for it.
//   node i18n/tools/todo.mjs [--lang=es]              each chapter: lines translated, anchors given, lettering done
//   node i18n/tools/todo.mjs --chapter=4 [--all]      that chapter's untranslated lines (--all: every line), each with
//                                                     its English, and the phrases it must give anchors for
import { translations, englishAnchors, readYaml, optYaml, dirOf, langOf, args, pad } from './i18n_lib.mjs';

const lang = langOf(args), tr = translations(lang), uses = englishAnchors();
const lines = readYaml('script/script.yaml').lines;
const strings = optYaml(`${dirOf(lang)}/strings.yaml`, {});

if (args.chapter == null) {
  console.log(`${lang}: chapter, lines translated, anchors given (of those scenes, codes and sounds use)`);
  let a = 0, b = 0;
  for (const n of [...new Set(lines.map(l => l.ch))]) {
    const ls = lines.filter(l => l.ch === n), done = ls.filter(l => tr[l.id]?.text);
    const need = ls.flatMap(l => Object.keys(uses[l.id] || {}).map(p => [l.id, p])), got = need.filter(([id, p]) => tr[id]?.anchors?.[p]);
    a += done.length; b += ls.length;
    console.log(`  ${pad(n)}  ${done.length}/${ls.length} lines  ${got.length}/${need.length} anchors`);
  }
  console.log(`  all ${a}/${b} lines; lettering: ${Object.keys(strings).length} strings`);
  process.exit(0);
}

const n = +args.chapter;
for (const l of lines.filter(l => l.ch === n && (args.all || !tr[l.id]?.text))) {
  console.log(`\n${l.id} (${l.speaker}, ${l.kind}${l.spoken ? '' : ', not spoken'})\n  ${l.text.replace(/\n/g, '\n  ')}`);
  if (l.spoken && l.speech !== l.text) console.log(`  said: ${l.speech}`);
  for (const [p, where] of Object.entries(uses[l.id] || {})) console.log(`  anchor "${p}" (${[...where].join(', ')})`);
}
