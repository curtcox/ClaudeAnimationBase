// publish_preview.mjs: puts the local cut of the film (out/film/film.mp4, from npm run film) on the repo's releases page
// as a pre-release called "preview", and points the published site at it (script/site.yaml film.preview), until the
// finished film is on YouTube. This publishes: run it yourself, when you want the world to see the cut.
//   node tools/publish_preview.mjs          (npm run preview:publish)   needs the GitHub CLI (gh), signed in
// Then commit script/site.yaml and push; the site's workflow republishes it pointing at the preview.
// GitHub takes release files up to 2 GiB; a draft cut of the whole film is well under that.
import { execFileSync } from 'node:child_process';
import { existsSync, statSync, readFileSync, writeFileSync } from 'node:fs';

const FILE = 'out/film/film.mp4', TAG = 'preview', LIMIT = 2 * 1024 ** 3;
if (!existsSync(FILE)) { console.error(`no ${FILE}: make it first (npm run film)`); process.exit(1); }
if (statSync(FILE).size >= LIMIT) { console.error(`${FILE} is ${(statSync(FILE).size / 1024 ** 3).toFixed(2)} GiB; GitHub takes 2 GiB a file`); process.exit(1); }
const gh = (...a) => execFileSync('gh', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
const repo = gh('repo', 'view', '--json', 'nameWithOwner', '-q', '.nameWithOwner');
let exists = true; try { gh('release', 'view', TAG); } catch { exists = false; }
if (!exists) gh('release', 'create', TAG, '--prerelease', '--title', 'Frog or Axolotl: preview cut',
  '--notes', 'A cut of the film made from this repo, for watching until the finished film is on YouTube. It changes as the film does.');
console.log(`uploading ${FILE} (${(statSync(FILE).size / 1024 ** 2).toFixed(0)} MB) to ${repo}, release ${TAG}…`);
execFileSync('gh', ['release', 'upload', TAG, FILE, '--clobber'], { stdio: 'inherit' });
const url = `https://github.com/${repo}/releases/download/${TAG}/film.mp4`;
const yaml = readFileSync('script/site.yaml', 'utf8'), next = yaml.replace(/^(\s+preview:)[^#\n]*?(\s*#|$)/m, `$1 ${url}$2`);
if (next === yaml && !yaml.includes(url)) { console.error(`couldn't find film: preview: in script/site.yaml; set it to ${url}`); process.exit(1); }
writeFileSync('script/site.yaml', next);
console.log(`script/site.yaml film.preview → ${url}\nCommit it and push, and the published site plays the preview.`);
