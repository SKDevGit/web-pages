/* helpers specific to the Inside the LLM course */
const COURSE_TITLE = "Inside the LLM";
const dispW = k => VOCAB[k] === "<s>" ? "(start)" : VOCAB[k];
function topRows(p, n = 6, extra, ghost, hitIdx) {
  const idx = p.map((x, k) => k).filter(k => k !== 0).sort((a, b) => p[b] - p[a]).slice(0, n);
  if (extra != null && !idx.includes(extra)) idx.push(extra);
  return idx.map(k => ({ label: dispW(k), p: p[k], ghost: ghost ? ghost[k] : undefined, cls: k === hitIdx ? "hit" : "" }));
}
function tokChips(items) { // items: [{t, id}] or strings
  const b = h("div", { class: "toks" });
  items.forEach(it => { const t = typeof it === "string" ? it : it.t; const lead = /^\s/.test(t);
    b.append(h("span", { class: "tok" }, h("span", null, lead ? h("span", { class: "sp", text: t[0] === "\n" ? "↵" : "·" }) : null, (lead ? t.slice(1) : t).replace(/\n/g, "↵")), it.id != null ? h("small", { text: it.id }) : null)); });
  return b;
}

/* the tiny model is saved in this browser so the training and inference pages share it */
const MODEL_KEY = "inside-llm-model-v1";
function loadModel(m) { try { const j = JSON.parse(localStorage.getItem(MODEL_KEY) || "null"); if (j && j.W && j.W.length === V * V) { m.W = Float64Array.from(j.W); m.steps = j.steps | 0; m.losses = j.losses || []; } } catch (e) { } return m; }
function saveModel(m) { try { localStorage.setItem(MODEL_KEY, JSON.stringify({ W: Array.from(m.W, x => +x.toFixed(4)), steps: m.steps, losses: m.losses.slice(-3000).map(x => +x.toFixed(3)) })); } catch (e) { } }
function resetSaved() { try { localStorage.removeItem(MODEL_KEY); } catch (e) { } }

function lossChart(M, floor) {
  const W = 560, H = 170, l = 30, r = 8, t = 10, b = 22, iw = W - l - r, ih = H - t - b, maxY = Math.log(V) + 0.2;
  const n = M.losses.length, X = k => l + (k / Math.max(59, n - 1)) * iw, Y = v => t + ih - Math.min(v, maxY) / maxY * ih;
  let s = '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Error score over training steps">';
  [0, 1, 2, 3].forEach(v => { s += '<line x1="' + l + '" x2="' + (W - r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="' + cssv("--line") + '"/><text x="' + (l - 6) + '" y="' + (Y(v) + 3) + '" text-anchor="end">' + v + "</text>"; });
  s += '<line x1="' + l + '" x2="' + (W - r) + '" y1="' + Y(floor) + '" y2="' + Y(floor) + '" stroke="' + cssv("--good") + '" stroke-dasharray="4 3"/><text x="' + (W - r - 14) + '" y="' + (Y(floor) - 4) + '" text-anchor="end">lowest this model can reach</text>';
  s += '<text x="' + l + '" y="' + (H - 6) + '">step 1</text><text x="' + (W - r) + '" y="' + (H - 6) + '" text-anchor="end">step ' + Math.max(60, n) + "</text>";
  if (n > 1) {
    const pts = [], q = []; let run = 0;
    for (let k = 0; k < n; k++) { q.push(M.losses[k]); run += M.losses[k]; if (q.length > 25) run -= q.shift(); pts.push(X(k).toFixed(1) + "," + Y(run / q.length).toFixed(1)); }
    s += '<polyline fill="none" stroke="' + cssv("--accent") + '" stroke-width="2.2" points="' + pts.join(" ") + '"/>';
    const lp = pts[pts.length - 1].split(","); s += '<circle cx="' + lp[0] + '" cy="' + lp[1] + '" r="4" fill="' + cssv("--accent") + '"/>';
  } else s += '<text x="' + (l + iw / 2) + '" y="' + (t + ih / 2) + '" text-anchor="middle">No steps yet. A pure guesser scores about ' + Math.log(V).toFixed(1) + ".</text>";
  return s + "</svg>";
}

const PAGES = [["prediction.html", "Start with a prediction", "How it works"], ["tokens.html", "What are tokens?", "How it works"], ["training.html", "Model development", "How it works"], ["inference.html", "Model usage", "How it works"], ["context-attention.html", "Context and attention", "How it works"], ["llm-uses.html", "What LLMs are used for", "What it does"], ["limits-risks.html", "Limits and risks", "What it does"], ["adapt-to-business.html", "Making it fit your business", "Using it at work"], ["cost-and-choice.html", "Cost, choice and where to start", "Using it at work"], ["put-it-together.html", "Put it all together", "Wrap-up"], ["key-terms.html", "Key terms", "Reference"]];
const NPARTS = PAGES.length - 1;

// Keep the clicked exercise where it is on screen when other parts of the page re-draw and change height.
let _lw = null;
document.addEventListener("click", e => { _lw = e.target.closest ? e.target.closest(".widget") : null; }, true);
function keepView(fn) {
  const el = _lw && _lw.isConnected ? _lw : null, t = el ? el.getBoundingClientRect().top : 0;
  fn();
  if (el) { const d = el.getBoundingClientRect().top - t; if (d) window.scrollBy(0, d); }
}
