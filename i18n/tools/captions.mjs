// captions.mjs: the codes whose captions aren't translated yet, by chapter, as lines to paste into i18n/<lang>/refs.yaml
//   node i18n/tools/captions.mjs --chapter=N [--lang=es]
import { readYaml, optYaml, dirOf, langOf, args } from './i18n_lib.mjs';
import { resolveAnchor } from '../../tools/script_lib.mjs';
const lang = langOf(args), tr = optYaml(`${dirOf(lang)}/refs.yaml`, {}), wiki = optYaml(`${dirOf(lang)}/wiki.yaml`, {});
const lines = readYaml('script/script.yaml').lines, byId = new Map(lines.map(l => [l.id, l]));
const chOf = r => r.ch ?? byId.get(r.at)?.ch ?? resolveAnchor(r, lines, byId)?.ch;
for (const r of [...readYaml('script/refs.yaml'), ...readYaml('script/notes_refs.yaml')])
  if (tr[r.id] == null && (args.chapter == null || chOf(r) === +args.chapter))
    console.log(`${r.id}: ${JSON.stringify(r.caption)}   # ${wiki[r.id] ? 'wiki es ' : ''}${r.url}`);
