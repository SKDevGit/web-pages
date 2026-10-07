/* shared helpers for every course page. A course defines COURSE_TITLE, PAGES and NPARTS before calling chrome() */
/* shared helpers for every page */
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
  opts.forEach((o, i) => list.append(h("button", { onclick: e => {
    [...list.children].forEach((b, k) => { b.disabled = true; if (k === ans) b.classList.add("right"); });
    if (i !== ans) e.currentTarget.classList.add("wrong");
    note.textContent = (i === ans ? "Correct. " : "Not quite. ") + why;
  } }, o)));
  box.append(list, note); return box;
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
    list.append(h("a", { href: p[0], class: "pg" + (k === i ? " cur" : "") }, h("small", { text: k < NPARTS ? "Part " + (k + 1) : "Reference" }), h("span", { text: p[1] })));
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
  hd.append(h("span", { text: i < 0 ? "Home" : i < NPARTS ? "Part " + (i + 1) + " of " + NPARTS : "Reference" }));
  const pg = $("#pager"); pg.className = "pager";
  if (i === 0) pg.append(h("a", { href: "index.html" }, h("small", { text: "Previous" }), h("b", { text: "Home" })));
  if (i > 0) pg.append(h("a", { href: PAGES[i - 1][0] }, h("small", { text: "Previous" }), h("b", { text: PAGES[i - 1][1] })));
  if (i < PAGES.length - 1) pg.append(h("a", { class: "nx", href: PAGES[i + 1][0] }, h("small", { text: "Next" }), h("b", { text: PAGES[i + 1][1] })));
  sidebar(i);
}

function seg(id, items, on, cb) { const el = $(id); items.forEach((x, i) => el.append(h("button", { class: i === on ? "on" : "", onclick: () => { el.querySelectorAll("button").forEach((b, j) => b.classList.toggle("on", j === i)); cb(i); } }, x))); cb(on); }
function cell(k, v) { return h("div", null, h("b", { text: k }), v); }

