/* helpers specific to the Introduction to AI module. Needs assets/js/site.js loaded first. */
const COURSE_TITLE = "Introduction to AI";
const PAGES = [
  ["is-this-ai.html", "Is this AI?", "Getting started"],
  ["what-is-ai.html", "What we mean by AI", "What AI is"],
  ["what-ai-can-do.html", "What AI can do", "What AI is"],
  ["history-why-now.html", "A short history, and why now", "What AI is"],
  ["how-machines-learn.html", "How machines learn", "How it works"],
  ["models-data-mistakes.html", "Models, data and mistakes", "How it works"],
  ["ai-and-people.html", "AI and people", "AI at work"],
  ["wrap-up.html", "Wrap-up", "Wrap-up"]
];
const NPARTS = PAGES.length;

/* styles used only by this module */
(() => {
  const s = document.createElement("style");
  s.textContent = `
.stack{display:grid;gap:8px}
.sortrow{display:grid;gap:8px;padding:10px 0;border-bottom:1px solid var(--line)}
.sortrow .st{font-weight:500}
.btn.right{background:var(--good-soft);border-color:var(--good)}
.btn.wrong{background:var(--bad-soft);border-color:var(--bad)}
.btn.right:disabled,.btn.wrong:disabled{opacity:1}
.afb{font-size:.9rem;border-radius:8px;padding:8px 12px;background:var(--soft)}
.afb.good{background:var(--good-soft)}.afb.bad{background:var(--bad-soft)}
.disc{border-left:3px solid var(--good);background:var(--good-soft);border-radius:0 8px 8px 0;padding:10px 14px;font-size:.93rem}
.disc b{font:500 .72rem var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--good);display:block;margin-bottom:2px}
.nest{display:grid;gap:0;padding:10px}
.nest button{display:block;width:100%;text-align:left;border:1px solid var(--line);background:var(--surface);border-radius:10px;padding:8px 10px 10px;font:600 .95rem var(--f-body);color:var(--ink)}
.nest button.on{border-color:var(--accent);background:var(--accent-soft)}
.nest .in{margin-top:8px}
.quote{border-left:3px solid var(--accent);padding:4px 0 4px 16px;margin:6px 0;font-family:var(--f-serif);font-size:1.05rem}
.quote mark{background:var(--accent-soft);color:var(--ink);padding:0 3px;border-radius:3px;font-weight:600}
.flow{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.flow .bx{border:1px solid var(--line);background:var(--surface);border-radius:8px;padding:6px 12px;font-size:.9rem}
.flow .bx.out{background:var(--good-soft);border-color:var(--good)}
.flow .ar{color:var(--muted)}
.erap{display:inline-block;font:500 .7rem var(--f-mono);border-radius:999px;padding:1px 9px;background:var(--soft);color:var(--muted)}
.erap.learning{background:var(--good-soft);color:var(--good)}.erap.rules{background:var(--accent-soft);color:var(--accent)}.erap.winter{background:var(--bad-soft);color:var(--bad)}
.vote{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 14px;align-items:center;padding:8px 0;border-bottom:1px solid var(--line)}
.vote .st{font-weight:500}
.cmpwrap{overflow:auto}
.big2{font:600 1.6rem var(--f-serif)}
.tally{display:flex;flex-wrap:wrap;gap:6px 20px;font-size:.9rem;color:var(--muted)}
.tally b{font:600 1.2rem var(--f-serif);color:var(--ink);margin-right:4px}
.small{font-size:.85rem;color:var(--muted)}
ol.obj{margin:6px 0 0;padding-left:1.2rem}ol.obj li{margin:3px 0}
.srcs{display:grid;gap:10px}.srcs p{margin:0;font-size:.9rem}.srcs a{overflow-wrap:anywhere}
`;
  document.head.appendChild(s);
})();

/* saved votes: shared by Lesson 1 and the wrap-up */
const VOTE_KEY = "intro-ai-votes-v1";
const VOTE_ITEMS = [
  { t: "A spam filter", now: "Yes", why: "It learns from thousands of labeled emails, and it infers whether a new email is spam." },
  { t: "A spreadsheet forecast", now: "Depends", why: "A fixed formula is a written rule. A model fitted to past data, which then infers new values, fits the definition. Which one is it?" },
  { t: "Netflix recommendations", now: "Yes", why: "It learns patterns from viewing data and infers what you may want to watch." },
  { t: "A thermostat on a schedule", now: "No", why: "It follows a written rule: at this time, set this temperature. Nothing is inferred." },
  { t: "ChatGPT", now: "Yes", why: "A generative model, learned from very large amounts of text, that infers its outputs." }
];
function getJSON(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
function setJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }

/* five questions, asked in Lesson 1 and again in the wrap-up */
const QUIZ = [
  ["Once a task is solved and becomes routine, people often stop calling it AI. What is this called?", ["The AI effect", "An AI winter", "The Turing test"], 0, "It is the AI effect: once a task is solved it stops being called AI."],
  ["In machine learning, what does the machine find?", ["The data, from rules and answers", "The rules, from data and answers", "The answers, from rules and data"], 1, "In traditional software people write the rules. In machine learning, the machine finds them from data and answers."],
  ["Which is an example of analytical (predictive) AI?", ["Drafting a reply to a customer", "Scoring whether a customer is likely to cancel", "Creating an image from a description"], 1, "Analytical AI outputs a number, label or score. The other two create new content, which is generative."],
  ["A model is trained on ten years of résumés, mostly from men. What is most likely?", ["It ignores gender automatically", "It becomes fair with more of the same data", "It reflects that pattern in its scores"], 2, "A model learns whatever patterns the data contains, including bias. More of the same data does not fix it."],
  ["Models can now write a spreadsheet formula from a plain-language request. Which skill matters more as a result?", ["Specifying the goal and checking the result", "Learning every programming language", "Memorizing function names"], 0, "The scarce skill shifts to specifying the goal and checking the result."]
];


/* ---- reusable interactive pieces: each fills a host element ---- */

/* the five-item vote from Lesson 1 */
function votes(host) {
  const saved = getJSON(VOTE_KEY) || {}, OPT = ["Yes", "No", "Unsure"];
  const list = h("div"), msg = h("p", { class: "hint" }), dd = h("div");
  function note() {
    const n = Object.keys(saved).length;
    msg.textContent = n < VOTE_ITEMS.length ? n + " of " + VOTE_ITEMS.length + " voted." : "All five voted. You will see these again in the wrap-up.";
    if (n === VOTE_ITEMS.length && !dd.firstChild) dd.append(disc("What made you say yes or no on each item? Did anyone in your group vote differently, and why?"));
  }
  VOTE_ITEMS.forEach(it => {
    const sg = h("div", { class: "seg3" });
    OPT.forEach(o => sg.append(h("button", { class: saved[it.t] === o ? "on" : "", onclick: () => {
      saved[it.t] = o; setJSON(VOTE_KEY, saved); [...sg.children].forEach(b => b.classList.toggle("on", b.textContent === o)); note();
    } }, o)));
    list.append(h("div", { class: "vote" }, h("span", { class: "st", text: it.t }), sg));
  });
  const clr = h("button", { class: "btn sm", onclick: () => { Object.keys(saved).forEach(k => delete saved[k]); setJSON(VOTE_KEY, saved); list.querySelectorAll(".seg3 button").forEach(b => b.classList.remove("on")); clear(dd); note(); } }, "Clear my votes");
  host.append(h("div", { class: "widget" }, list, h("div", { class: "row" }, clr, msg)), dd); note();
}

/* nested layers: click one to read what it means. items = [[name, meaning], ...] */
function nester(host, items) {
  let sel = 0; const root = h("div", { class: "nest" }), msg = h("div", { class: "note" });
  function draw() {
    clear(root); let at = root;
    items.forEach((n, i) => {
      const b = h("button", { class: i === sel ? "on" : "", onclick: e => { e.stopPropagation(); sel = i; draw(); } }, n[0]);
      at.append(b); if (i < items.length - 1) { const inner = h("div", { class: "in" }); b.append(inner); at = inner; }
    });
    msg.textContent = items[sel][1];
  }
  draw(); host.append(h("div", { class: "widget" }, root, msg));
}

/* rows that flip between two readings. rows = [[label, thenText, nowText], ...] */
function flipRows(host, rows) {
  const box = h("div", { class: "stack" });
  rows.forEach(r => {
    let now = false;
    const out = h("span", { class: "small", text: "Then: " + r[1] });
    const b = h("button", { class: "btn", style: { textAlign: "left" }, onclick: () => { now = !now; b.classList.toggle("on", now); out.textContent = now ? "Now: " + r[2] : "Then: " + r[1]; } }, r[0]);
    box.append(h("div", { class: "aerow" }, b, out));
  });
  host.append(h("div", { class: "widget" }, box));
}

/* tabs that reveal two boxes. items = [[name, whatItDoes, example], ...] */
function chooser(host, items, labelA, labelB) {
  const chips = h("div", { class: "chips" }), out = h("div", { class: "mini" });
  function show(i) { clear(out).append(cell(labelA, items[i][1]), cell(labelB, items[i][2])); }
  items.forEach((a, i) => chips.append(h("button", { class: i === 0 ? "on" : "", onclick: e => { chips.querySelectorAll("button").forEach(b => b.classList.remove("on")); e.currentTarget.classList.add("on"); show(i); } }, a[0])));
  show(0); host.append(h("div", { class: "widget" }, chips, out));
}

/* one task at a time, matched to a label. tasks = [[text, answerIndex, why], ...] */
function matcher(host, tasks, labels) {
  let mi = 0, right = 0, locked = false;
  const task = h("p", { class: "mtask" }), chips = h("div", { class: "chips" }), fb = h("div", { class: "afb", style: { display: "none" } });
  const count = h("span", { class: "small" }), next = h("button", { class: "btn", style: { display: "none" } });
  const again = h("button", { class: "btn sm", style: { display: "none" }, onclick: () => { mi = 0; right = 0; again.style.display = "none"; draw(); } }, "Start again");
  function draw() {
    const t = tasks[mi]; locked = false; task.textContent = t[0];
    count.textContent = "Task " + (mi + 1) + " of " + tasks.length + " · right so far: " + right;
    fb.style.display = "none"; next.style.display = "none"; clear(chips);
    labels.forEach((l, i) => chips.append(h("button", { onclick: e => {
      if (locked) return; locked = true; again.style.display = "";
      const ok = i === t[1]; if (ok) right++;
      e.currentTarget.classList.add(ok ? "right" : "wrong"); chips.children[t[1]].classList.add("right");
      fb.style.display = ""; fb.className = "afb " + (ok ? "good" : "bad"); fb.textContent = (ok ? "Yes. " : "Not quite. ") + t[2];
      count.textContent = "Task " + (mi + 1) + " of " + tasks.length + " · right so far: " + right;
      next.style.display = ""; next.textContent = mi < tasks.length - 1 ? "Next task" : "Start again";
    } }, l)));
  }
  next.onclick = () => { if (mi < tasks.length - 1) mi++; else { mi = 0; right = 0; again.style.display = "none"; } draw(); };
  draw(); host.append(h("div", { class: "widget" }, task, chips, fb, h("div", { class: "row" }, next, again, count)));
}

/* select-all checklist. items = [[text, isRight], ...] */
function checklist(host, items, goodMsg, badMsg) {
  const picks = new Set(), box = h("div", { class: "stack" }), msg = h("div", { class: "note", style: { display: "none" } });
  items.forEach((c, i) => box.append(h("label", { style: { display: "flex", gap: "8px", alignItems: "center" } }, h("input", { type: "checkbox", onchange: e => { e.target.checked ? picks.add(i) : picks.delete(i); } }), c[0])));
  const go = h("button", { class: "btn primary", onclick: () => {
    const ok = items.every((c, i) => !!c[1] === picks.has(i)); msg.style.display = ""; msg.textContent = ok ? goodMsg : badMsg;
  } }, "Check my choices");
  const clr = h("button", { class: "btn sm", onclick: () => { picks.clear(); box.querySelectorAll("input").forEach(x => { x.checked = false; }); msg.style.display = "none"; } }, "Clear");
  host.append(h("div", { class: "widget" }, box, h("div", { class: "row" }, go, clr), msg));
}

/* one question at a time with any answer options. items = [[question, options, answerIndex, why], ...] */
function oneByOne(host, items) {
  let i = 0, right = 0, locked = false;
  const q = h("p", { class: "mtask" }), opts = h("div", { class: "stack" }), fb = h("div", { class: "afb", style: { display: "none" } });
  const count = h("span", { class: "small" }), next = h("button", { class: "btn", style: { display: "none" } });
  const again = h("button", { class: "btn sm", style: { display: "none" }, onclick: () => { i = 0; right = 0; again.style.display = "none"; draw(); } }, "Start again");
  function draw() {
    const t = items[i]; locked = false; q.textContent = t[0];
    count.textContent = "Question " + (i + 1) + " of " + items.length + " · right so far: " + right;
    fb.style.display = "none"; next.style.display = "none"; clear(opts);
    t[1].forEach((o, k) => opts.append(h("button", { class: "btn", style: { textAlign: "left" }, onclick: e => {
      if (locked) return; locked = true; again.style.display = "";
      const ok = k === t[2]; if (ok) right++;
      e.currentTarget.classList.add(ok ? "right" : "wrong"); opts.children[t[2]].classList.add("right");
      fb.style.display = ""; fb.className = "afb " + (ok ? "good" : "bad"); fb.textContent = (ok ? "Yes. " : "Not quite. ") + t[3];
      count.textContent = "Question " + (i + 1) + " of " + items.length + " · right so far: " + right;
      next.style.display = ""; next.textContent = i < items.length - 1 ? "Next" : "Start again";
    } }, o)));
  }
  next.onclick = () => { if (i < items.length - 1) i++; else { i = 0; right = 0; again.style.display = "none"; } draw(); };
  draw(); host.append(h("div", { class: "widget" }, q, opts, fb, h("div", { class: "row" }, next, again, count)));
}
