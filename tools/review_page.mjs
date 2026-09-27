// review_page.mjs: the review index, served only by tools/serve.mjs at /review/ (the published site has no such page).
// One page that says where to look next: Claude's questions waiting on Curt, chapters with a draft he hasn't watched
// to the end, and what's waiting on Claude. It reads /api/review (overview() in review_lib.mjs) and refreshes itself.
// Links go to the watch pages at the moment in question: #n=<note id> jumps to a note, #t=<seconds> to a time.
export const reviewPage = () => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Review</title><link rel="stylesheet" href="/style.css"><style>
body{font-size:17px}main{max-width:52rem}h2{margin-top:2rem}h2 .n{font:600 .9rem system-ui;color:#6A6470;margin-left:.4em}
.card{background:#fff;border:1px solid #E0D8C8;border-radius:10px;padding:.6rem .8rem;margin:.6rem 0;overflow-wrap:anywhere}
.card.claude{border-left:5px solid #A84D33}.card.curt{border-left:5px solid #3A6FC9}
.meta{font:.85rem system-ui;color:#6A6470}.meta a{font-weight:600}.who{font:700 .75rem system-ui;letter-spacing:.04em;margin-right:.4em}
.claude .who,.rep.claude .who{color:#A84D33}.curt .who,.rep.curt .who{color:#3A6FC9}.rep{margin:.3rem 0 0 1rem;font-size:.95rem}
button{font:600 .85rem system-ui;padding:.35rem .7rem;border-radius:6px;border:1px solid #B8AE9C;background:#FBF8F0;cursor:pointer;margin:.3rem .3rem 0 0}
button.go{background:#8A3A22;color:#fff;border-color:#8A3A22}textarea{width:100%;box-sizing:border-box;font:17px/1.4 Georgia,serif;padding:.4rem;border:1px solid #CFC6B4;border-radius:6px}
table{border-collapse:collapse;width:100%;font-size:.95rem}td,th{padding:.35rem .5rem;border-bottom:1px solid #E6DFD0;text-align:left;vertical-align:top}th{font:600 .8rem system-ui;color:#6A6470}
.bar{display:inline-block;position:relative;width:6rem;height:.55rem;background:#EDE6D6;border-radius:4px;vertical-align:middle;overflow:hidden}.bar i{position:absolute;top:0;height:100%;background:#3A6FC9}
.sum{font-size:1.2rem;background:#FFF1CE;border:1px solid #E3C28A;border-radius:10px;padding:.6rem .9rem}.none{color:#6A6470;font-style:italic}.small{font:.85rem system-ui;color:#6A6470}</style></head><body><main>
<p class="crumbs"><a href="/">Frog or Axolotl</a> · review</p><h1>What needs your review</h1>
<p class="small">Only on this computer (<code>npm run serve</code>). It updates by itself as notes and drafts change.</p>
<div id="app"><p class="none">Loading…</p></div></main><script>
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = n => String(n).padStart(2, '0'), clock = t => Math.floor(t / 60) + ':' + pad(Math.floor(t % 60));
const stamp = t => t == null ? 'the whole chapter' : clock(t);
const ago = iso => { const m = (Date.now() - Date.parse(iso)) / 6e4; return m < 1 ? 'just now' : m < 60 ? Math.round(m) + ' min ago' : m < 60 * 36 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' days ago'; };
const watch = (c, hash) => '/watch/ch' + pad(c.n) + '.html' + (hash ? '#' + hash : '');
const post = async body => { const r = await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); if (!r.ok) throw new Error((await r.json()).error); };
let data = [], busy = false;

function note(c, n, answer) {
  const reps = n.replies.map(r => '<div class="rep ' + r.by + '"><span class="who">' + (r.by === 'claude' ? 'CLAUDE' : 'YOU') + '</span>' + esc(r.text) + '</div>').join('');
  const opts = answer && n.options && n.options.length && !n.replies.some(r => r.by === 'curt')
    ? '<div>' + n.options.map((o, i) => '<button data-ch="' + c.n + '" data-id="' + n.id + '" data-opt="' + esc(o) + '">' + esc(o) + '</button>').join('') + '</div>' : '';
  const form = answer ? '<details><summary class="small">write a reply' + (n.by === 'curt' ? ' or mark it done' : '') + '</summary><textarea rows="2"></textarea>'
    + '<button class="go send" data-ch="' + c.n + '" data-id="' + n.id + '">Reply</button><button class="done" data-ch="' + c.n + '" data-id="' + n.id + '">Mark resolved</button></details>' : '';
  return '<div class="card ' + n.by + '"><div class="meta"><span class="who">' + (n.by === 'claude' ? 'CLAUDE ASKS' : 'YOUR NOTE') + '</span>'
    + '<a href="' + watch(c, 'n=' + n.id) + '">' + (n.t == null ? 'about the whole chapter' : 'at ' + stamp(n.t)) + ' ▶</a>'
    + (n.shot ? ' · shot ' + esc(n.shot) : '') + '</div><div>' + esc(n.text).replace(/\\n/g, '<br>') + '</div>' + reps + opts + form + '</div>';
}

function draw() {
  const forCurt = data.filter(c => c.forCurt.length), forClaude = data.filter(c => c.forClaude.length);
  const toWatch = data.filter(c => c.draft && !c.draft.watched), total = a => a.reduce((s, c) => s + c.forCurt.length, 0);
  const nc = total(forCurt), nw = toWatch.length;
  let h = '<p class="sum">' + (nc || nw ? 'For you: ' + [nc && '<a href="#you">' + nc + ' question' + (nc > 1 ? 's' : '') + ' or repl' + (nc > 1 ? 'ies' : 'y') + '</a>', nw && '<a href="#drafts">' + nw + ' draft' + (nw > 1 ? 's' : '') + ' to watch</a>'].filter(Boolean).join(' and ') + '.' : 'Nothing needs you right now.') + '</p>';
  h += '<h2 id="you">Questions and replies waiting on you<span class="n">' + total(forCurt) + '</span></h2>';
  h += forCurt.length ? forCurt.map(c => '<h3>' + c.n + '. ' + esc(c.title) + ' <a class="small" href="' + watch(c) + '">watch</a></h3>' + c.forCurt.map(n => note(c, n, true)).join('')).join('')
    : '<p class="none">Nothing. You\\'re all caught up.</p>';
  h += '<h2 id="drafts">New drafts you haven\\'t watched to the end<span class="n">' + toWatch.length + '</span></h2>';
  h += toWatch.length ? '<table><tr><th>chapter</th><th>draft made</th><th>you\\'ve watched</th><th></th></tr>' + toWatch.map(c => {
    const r = c.draft.resume, d = c.duration || 1, go = r > 5 ? 't=' + Math.max(0, r - 3).toFixed(1) : '';
    const bar = '<span class="bar">' + c.draft.spans.map(([a, b]) => '<i style="left:' + a / d * 100 + '%;width:' + (b - a) / d * 100 + '%"></i>').join('') + '</span> ';
    return '<tr><td>' + c.n + '. ' + esc(c.title) + '</td><td>' + ago(c.draft.rendered) + '</td><td>'
      + (c.draft.seen > 0 ? bar + clock(c.draft.seen) + ' of ' + clock(d) : c.draft.started ? 'some (you left notes)' : 'not yet')
      + '</td><td><a href="' + watch(c, go) + '">' + (r > 5 ? 'carry on from ' + clock(r) + ' ▶' : 'watch ▶') + '</a></td></tr>'; }).join('') + '</table>'
    : '<p class="none">You\\'ve seen every current draft.</p>';
  h += '<h2>Waiting on Claude<span class="n">' + forClaude.reduce((s, c) => s + c.forClaude.length, 0) + '</span></h2>';
  h += forClaude.length ? forClaude.map(c => '<h3>' + c.n + '. ' + esc(c.title) + '</h3>' + c.forClaude.map(n => note(c, n, false)).join('')).join('')
    : '<p class="none">Nothing: Claude has answered everything.</p>';
  h += '<h2>Every chapter</h2><table><tr><th>chapter</th><th>length</th><th>for you</th><th>for Claude</th><th>done</th><th></th></tr>' + data.map(c =>
    '<tr><td>' + c.n + '. ' + esc(c.title) + '</td><td>' + (c.duration ? clock(c.duration) : '') + '</td><td>' + (c.forCurt.length || '') + '</td><td>' + (c.forClaude.length || '') + '</td><td>' + (c.resolved || '')
    + '</td><td>' + (c.draft ? '<a href="' + watch(c) + '">watch</a> · ' : '') + '<a href="/ch' + pad(c.n) + '/">links</a></td></tr>').join('') + '</table>';
  const open = [...document.querySelectorAll('details[open] textarea')].map(t => [t.closest('details').querySelector('.send').dataset.id, t.value]);
  document.getElementById('app').innerHTML = h;
  for (const [id, v] of open) { const b = document.querySelector('.send[data-id="' + id + '"]'); if (b) { const d = b.closest('details'); d.open = true; d.querySelector('textarea').value = v; } }
  const act = async (b, body) => { busy = true; b.disabled = true; try { await post({ ch: +b.dataset.ch, id: b.dataset.id, ...body }); } catch (e) { alert('Not saved: ' + e.message); } busy = false; load(); };
  document.querySelectorAll('[data-opt]').forEach(b => b.onclick = () => act(b, { reply: b.dataset.opt }));
  document.querySelectorAll('.send').forEach(b => b.onclick = () => { const t = b.closest('details').querySelector('textarea').value.trim(); if (t) act(b, { reply: t }); });
  document.querySelectorAll('.done').forEach(b => b.onclick = () => act(b, { status: 'resolved' }));
}
async function load() {
  try { const r = await fetch('/api/review'); if (!r.ok) throw 0; data = await r.json(); }
  catch { document.getElementById('app').innerHTML = '<p class="none">The review server isn\\'t running. Start it with npm run serve.</p>'; return; }
  draw();
}
load();
// refresh while the page is open, but never while you're typing a reply
setInterval(() => { if (!busy && !document.hidden && !document.querySelector('details[open] textarea:focus')) load(); }, 15000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) load(); });
</script></body></html>
`;
