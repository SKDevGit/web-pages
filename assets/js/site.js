/* shared helpers for every course page. A course defines COURSE_TITLE, PAGES and NPARTS before calling chrome() */
/* shared helpers for every page */
/* courses that can link into a module; used for the "back to course" link */
const COURSES = { "ai-for-marketing": "AI for Marketing: Powered by Agents" };
const FROM = (() => { try { const q = new URLSearchParams(location.search).get("from"); if (q && COURSES[q]) { sessionStorage.setItem("from-course", q); return q; } const k = sessionStorage.getItem("from-course"); return k && COURSES[k] ? k : null; } catch (e) { return null; } })();
const $ = s => document.querySelector(s);
function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  if (props) for (const [k, v] of Object.entries(props)) {
    if (k === "class") e.className = v; else if (k === "text") e.textContent = v;
    else if (k === "style") Object.assign(e.style, v);
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) e.setAttribute(k, v === true ? "" : v);
  }
  for (const c of kids.flat()) { if (c == null || c === false) continue; e.append(c.nodeType ? c : document.createTextNode(c)); }
  return e;
}
const clear = el => { while (el.firstChild) el.removeChild(el.firstChild); return el; };
const pct = x => { const v = x * 100; return (v > 0 && v < 10 ? v.toFixed(1) : Math.round(v)) + "%"; };
const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

function bars(rows, opts = {}) {
  const wrap = h("div", { class: "bars" });
  const max = opts.max || Math.max(...rows.map(r => Math.max(r.p, r.ghost || 0)), 0.0001);
  rows.forEach(r => {
    const track = h("div", { class: "track" }, h("i", { style: { width: (r.p / max * 100).toFixed(1) + "%" } }));
    if (r.ghost != null) track.append(h("b", { class: "ghost", style: { left: Math.min(99, r.ghost / max * 100).toFixed(1) + "%" } }));
    wrap.append(h("div", { class: "brow" + (r.cls ? " " + r.cls : "") }, h("span", { class: "bl", text: r.label, title: r.label }), track, h("span", { class: "bv", text: pct(r.p) })));
  });
  return wrap;
}
function quick(q, opts, ans, why) {
  const box = h("div", { class: "quick" }, h("div", { class: "label", text: "Quick check" }), h("div", { text: q }));
  const list = h("div", { class: "opts" }), note = h("p", { class: "why" });
  const again = h("button", { class: "btn sm", style: { display: "none", marginTop: "8px" }, onclick: () => {
    [...list.children].forEach(b => { b.disabled = false; b.classList.remove("right", "wrong"); }); note.textContent = ""; again.style.display = "none";
  } }, "Try again");
  opts.forEach((o, i) => list.append(h("button", { onclick: e => {
    [...list.children].forEach((b, k) => { b.disabled = true; if (k === ans) b.classList.add("right"); });
    if (i !== ans) e.currentTarget.classList.add("wrong");
    note.textContent = (i === ans ? "Correct. " : "Not quite. ") + why; again.style.display = "";
  } }, o)));
  box.append(list, note, again); return box;
}
function sidebar(i) {
  const aside = h("aside", { class: "side", "aria-label": "Course navigation" });
  const list = h("nav", { class: "side-list" });
  const btn = h("button", { class: "side-btn", "aria-expanded": "false", onclick: () => { const o = list.classList.toggle("open"); btn.setAttribute("aria-expanded", o); } }, "Menu");
  aside.append(h("a", { class: "brand", href: "index.html", text: COURSE_TITLE }), h("a", { class: "all", href: "../../index.html", text: "All courses" }), btn, list);
  const subs = [];
  const addSubs = () => {
    const sub = h("div", { class: "sub" });
    document.querySelectorAll("main h2").forEach((hh, n) => { hh.id = hh.id || "sec" + n; const a = h("a", { href: "#" + hh.id, text: hh.textContent, onclick: e => { e.preventDefault(); hh.scrollIntoView({ behavior: "smooth", block: "start" }); list.classList.remove("open"); } }); subs.push([hh, a]); sub.append(a); });
    if (subs.length) list.append(sub);
  };
  list.append(h("a", { href: "index.html", class: "pg" + (i < 0 ? " cur" : "") }, h("small", { text: "Start" }), h("span", { text: "Home" })));
  if (i < 0) addSubs();
  PAGES.forEach((p, k) => {
    if (k === 0 || PAGES[k - 1][2] !== p[2]) list.append(h("div", { class: "grp", text: p[2] }));
    list.append(h("a", { href: p[0], class: "pg" + (k === i ? " cur" : "") }, h("small", { text: k < NPARTS ? "Lesson " + (k + 1) : "Reference" }), h("span", { text: p[1] })));
    if (k === i) addSubs();
  });
  document.body.prepend(aside); document.body.classList.add("has-side");
  if ("IntersectionObserver" in window && subs.length) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) subs.forEach(([hh, a]) => a.classList.toggle("on", hh === e.target)); }), { rootMargin: "-10% 0px -75% 0px" });
    subs.forEach(([hh]) => io.observe(hh));
  }
}
function chrome(i) {
  try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (e) { }
  window.scrollTo(0, 0); addEventListener("load", () => window.scrollTo(0, 0)); setTimeout(() => window.scrollTo(0, 0), 60);
  const hd = $("#site-head"); hd.className = "site-head";
  if (FROM) hd.append(h("a", { href: "../../courses/" + FROM + "/index.html", text: "\u2190 " + COURSES[FROM] }));
  hd.append(h("span", { text: i < 0 ? "Home" : i < NPARTS ? "Lesson " + (i + 1) + " of " + NPARTS : "Reference" }));
  if (document.querySelector(".slide")) { initPresent(i); }
  const layers = document.querySelectorAll("details.layer");
  if (layers.length) { const ob = h("button", { class: "openall", onclick: () => { const any = [...layers].some(d => !d.open); layers.forEach(d => { d.open = any; }); ob.textContent = any ? "Close all" : "Open all"; } }, "Open all"); hd.append(ob); }
  const pg = $("#pager"); pg.className = "pager";
  if (i === 0) pg.append(h("a", { href: "index.html" }, h("small", { text: "Previous" }), h("b", { text: "Home" })));
  if (i > 0) pg.append(h("a", { href: PAGES[i - 1][0] }, h("small", { text: "Previous" }), h("b", { text: PAGES[i - 1][1] })));
  if (i < PAGES.length - 1) pg.append(h("a", { class: "nx", href: PAGES[i + 1][0] }, h("small", { text: "Next" }), h("b", { text: PAGES[i + 1][1] })));
  pg.append(h("p", { class: "copy", text: "\u00a9 2026 Srikanth KS. All rights reserved." }));
  sidebar(i);
}

function seg(id, items, on, cb) { const el = $(id); items.forEach((x, i) => el.append(h("button", { class: i === on ? "on" : "", onclick: () => { el.querySelectorAll("button").forEach((b, j) => b.classList.toggle("on", j === i)); cb(i); } }, x))); cb(on); }
function cell(k, v) { return h("div", null, h("b", { text: k }), v); }


/* names for the four parts of every step. Change them here and they change everywhere. */
const LABELS = { main: "Learn", try: "Try it", deep: "Go deeper", quiz: "Check yourself" };

/* build a lesson from data. Each step has main (always) and optional interactive, deep and quiz.
   A part may be an HTML string, a function(host) that fills a host element, or a DOM node.
   quiz may also be a list of [question, options, answerIndex, explanation]. A part with no content is not shown. */
function put(host, v) {
  if (v == null || v === false) return;
  if (typeof v === "string") host.innerHTML = v; else if (typeof v === "function") v(host); else if (v.nodeType) host.append(v);
}
function lesson(cfg) {
  const root = $("#lesson"), n = cfg.steps.length;
  root.append(h("h1", { text: cfg.title }), h("p", { class: "meta", text: n + (n === 1 ? " step" : " steps") }));
  if (cfg.lede) root.append(h("p", { class: "lede", text: cfg.lede }));
  if (cfg.learn) { const l = h("div", { class: "learn" }); l.innerHTML = cfg.learn; root.append(l); }
  cfg.steps.forEach((s, k) => {
    const sec = h("section", { class: "stp" });
    sec.append(h("span", { class: "step", text: "Step " + (k + 1) + " of " + n }), h("h2", { text: s.title }));
    root.append(sec);
    const m = h("div", { class: "teach slide", "data-kind": "main", "data-step": k }); sec.append(m); put(m, s.main);
    if (s.interactive) {
      sec.append(h("span", { class: "anc" }));
      const t = h("div", { class: "try slide", "data-kind": "try", "data-step": k }, h("div", { class: "trylabel" }, h("span", { text: LABELS.try })));
      const body = h("div", { class: "trybody" }); t.append(body); sec.append(t); put(body, s.interactive);
    }
    const layer = (cls, label, v) => {
      if (!v || (Array.isArray(v) && !v.length)) return;
      const d = h("details", { class: "layer " + cls }, h("summary", { text: label })), b = h("div", { class: "lbody" });
      d.append(b); sec.append(d);
      if (Array.isArray(v)) v.forEach(q => b.append(quick(q[0], q[1], q[2], q[3]))); else put(b, v);
    };
    layer("deep", LABELS.deep, s.deep); layer("check", LABELS.quiz, s.quiz);
  });
}

/* full screen for the teaching layer of each step, plus arrow-key movement between steps */
function initPresent(lesson) {
  const teaches = [...document.querySelectorAll(".slide")], steps = [];
  let cur = -1, browserFs = false;
  const ro = window.ResizeObserver ? new ResizeObserver(() => fit()) : null;
  function fit() {
    if (cur < 0) return;
    const tin = teaches[cur].querySelector(".tin"), w = tin.offsetWidth, hh = tin.offsetHeight;
    const k = Math.max(0.5, Math.min(2.6, (innerWidth - 80) / w, (innerHeight - 140) / hh));
    tin.style.transform = "scale(" + k.toFixed(3) + ")";
  }
  function show(i) {
    if (cur >= 0) teaches[cur].querySelector(".tin").style.transform = "";
    if (cur >= 0) teaches[cur].classList.remove("fs");
    cur = i; teaches[i].classList.add("fs"); document.body.classList.add("fsmode");
    steps[i].scrollIntoView({ block: "start" });
    teaches[i].querySelector(".fscount").textContent = (typeof lesson === "number" ? "Lesson " + (lesson + 1) + " \u00b7 " : "") + "Step " + (+teaches[i].dataset.step + 1) + (teaches[i].dataset.both ? " \u00b7 " + LABELS[teaches[i].dataset.kind] : "");
    fit(); if (ro) { ro.disconnect(); ro.observe(teaches[i].querySelector(".tin")); }
  }
  function enter(i) {
    show(i);
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().then(() => { browserFs = true; }).catch(() => { });
  }
  function exit() {
    if (cur >= 0) teaches[cur].querySelector(".tin").style.transform = "";
    if (cur < 0) return;
    teaches[cur].classList.remove("fs"); cur = -1; document.body.classList.remove("fsmode"); if (ro) ro.disconnect();
    if (document.fullscreenElement && document.exitFullscreen) { browserFs = false; document.exitFullscreen().catch(() => { }); }
  }
  function go(href, where) {
    const hard = () => { location.href = href + "#present-" + where; };
    if (location.protocol === "file:" || !window.fetch) { hard(); return; }
    fetch(href).then(r => { if (!r.ok) throw 0; return r.text(); }).then(t => swapPage(t, href, where)).catch(hard);
  }
  function move(d) {
    const n = cur + d;
    if (n < 0) { if (typeof lesson === "number" && lesson > 0) go(PAGES[lesson - 1][0], "last"); return; }
    if (n >= teaches.length) {
      if (typeof lesson === "number" && lesson < NPARTS - 1) { go(PAGES[lesson + 1][0], "first"); return; }
      exit(); $("#pager").scrollIntoView({ block: "start" }); return;
    }
    show(n);
  }
  teaches.forEach((t, i) => {
    const sec = t.closest(".stp"), st = sec.querySelector(".step"), h2 = sec.querySelector("h2"), isTry = t.dataset.kind === "try";
    if (sec.querySelector(".try")) t.dataset.both = "1";
    steps.push(isTry ? t.previousElementSibling : st);
    const tin = h("div", { class: "tin" });
    while (t.firstChild) tin.append(t.firstChild);
    tin.prepend(h("div", { class: "fshead" }, h("div", { class: "fsstep", text: st.firstChild.textContent + (isTry ? " \u00b7 " + LABELS.try : "") }), h("div", { class: "fsh2", text: h2.textContent })));
    const bar = h("div", { class: "fsbar" }, h("button", { title: "Previous", onclick: () => move(-1) }, "\u25c0"), h("span", { class: "fscount" }), h("button", { title: "Next", onclick: () => move(1) }, "\u25b6"), h("button", { title: "Exit full screen (Esc)", onclick: exit }, "\u2715"));
    t.append(tin, bar);
    const fb = h("button", { class: "fsbtn", title: "Full screen (F)", "aria-label": "Show full screen", onclick: () => enter(i) }); fb.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
    (isTry ? tin.querySelector(".trylabel") : st).append(fb);
  });
  addEventListener("resize", fit);
  try {
    const arrive = window.__parrive || (/^#present-(first|last)$/.test(location.hash) ? location.hash.slice(9) : "");
    window.__parrive = ""; if (location.hash.indexOf("#present-") === 0) history.replaceState(null, "", location.pathname + location.search);
    if (arrive) {
      if (document.fullscreenElement) browserFs = true;
      show(arrive === "last" ? teaches.length - 1 : 0);
      const again = () => { removeEventListener("keydown", again, true); removeEventListener("click", again, true);
        if (cur >= 0 && !document.fullscreenElement && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().then(() => { browserFs = true; }).catch(() => { }); };
      if (!document.fullscreenElement) { addEventListener("keydown", again, true); addEventListener("click", again, true); }
    }
  } catch (e) { }
  const fsch = () => { if (!document.fullscreenElement && browserFs) { browserFs = false; if (cur >= 0) exit(); } };
  document.addEventListener("fullscreenchange", fsch);
  const kd = e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target && e.target.tagName; if (t === "INPUT" || t === "SELECT" || t === "TEXTAREA") return;
    const k = e.key, fwd = k === "ArrowRight" || k === "PageDown", back = k === "ArrowLeft" || k === "PageUp";
    if (cur >= 0) {
      if (k === "Escape" || k === "f" || k === "F") { e.preventDefault(); exit(); }
      else if (fwd) { e.preventDefault(); move(1); } else if (back) { e.preventDefault(); move(-1); }
      return;
    }
    if (k === "f" || k === "F") { e.preventDefault(); let i = teaches.findIndex(x => x.getBoundingClientRect().bottom > 120); if (i < 0) i = teaches.length - 1; enter(i); return; }
  };
  addEventListener("keydown", kd);
  if (window.__pcleanup) window.__pcleanup();
  window.__pcleanup = () => { removeEventListener("resize", fit); document.removeEventListener("fullscreenchange", fsch); removeEventListener("keydown", kd); if (ro) ro.disconnect(); };
}
/* load another lesson without reloading the page, so the browser stays full screen */
function swapPage(html, href, where) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const scripts = [...doc.querySelectorAll("body script")], code = scripts.filter(s => !s.src).map(s => s.textContent);
  scripts.forEach(s => s.remove());
  if (window.__pcleanup) window.__pcleanup();
  document.title = doc.title; document.body.className = "";
  document.body.replaceChildren(...doc.body.childNodes);
  history.pushState({}, "", href); window.__parrive = where;
  code.forEach(c => new Function(c)());
}
addEventListener("popstate", () => location.reload());

