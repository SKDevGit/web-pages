/* ===== core logic (no DOM) ===== */
const COMMON = new Set(("the a an and or but if of to in on at by for with from as is are was were be been it its this that these those i you he she we they them his her their our my your not no yes do does did have has had will would can could should may might must customer customers product products order orders refund refunds return returned returns because arrived late damaged broken support team policy days day item items purchase bought buy sent send received receive request requested asked ask replacement exchange shipping delivery delivered package box size small large too very more most less than then when what which who how why where there here all any some one two three new old good bad great price cost paid pay money store online website service quality issue problem help please thank thanks email message ticket status account card payment credit full partial approved approve decline declined reason time week month year today after before about over under into out up down off only just also well like want need get got make made take took see saw know think say said tell told call called back same other another first last next each every both few many much own such so yet still even ever never always often again once working worked stopped start started stop open opened closed close used use unused wear worn fit fits fitted laptop jacket shoes shirt phone screen battery charger cable color wrong right expected described different quickly slowly happy unhappy angry upset rules rule free fee fees label prepaid inspect inspection condition defective defect faulty damage damages cracked arrived said says ").split(/\s+/).filter(Boolean));

const PRE = ["un", "re", "pre", "dis", "over", "non", "mis", "out"];
const SUF = ["ability", "ibility", "ations", "ation", "ments", "ment", "ingly", "ing", "ness", "ions", "ion", "able", "ible", "ally", "ful", "less", "ous", "ive", "ers", "est", "ed", "er", "ly", "es", "s", "al"];

function chunk(s, n) { const o = []; for (let i = 0; i < s.length; i += n) o.push(s.slice(i, i + n)); return o; }

function splitWord(w) {
  const lw = w.toLowerCase();
  if (COMMON.has(lw) || lw.length <= 3) return [w];
  if (w === w.toUpperCase() && w.length > 3) return chunk(w, 3);
  const parts = [];
  let rest = w, pre = "", suf = "";
  for (const p of PRE) { if (lw.startsWith(p) && lw.length - p.length >= 4) { pre = rest.slice(0, p.length); rest = rest.slice(p.length); break; } }
  const lr = () => rest.toLowerCase();
  const sorted = SUF.slice().sort((a, b) => b.length - a.length);
  for (const s of sorted) { if (lr().endsWith(s) && rest.length - s.length >= 3) { suf = rest.slice(rest.length - s.length); rest = rest.slice(0, rest.length - s.length); break; } }
  if (pre) parts.push(pre);
  if (COMMON.has(lr()) || rest.length <= 5) parts.push(rest); else parts.push(...chunk(rest, 4));
  if (suf) parts.push(suf);
  return parts;
}

function tokenize(text) {
  const re = /'(?:s|t|re|ve|m|ll|d)|\s?[A-Za-z]+|\s?\d{1,3}|\s?[^\sA-Za-z\d]+|\s+(?!\S)|\s+/g;
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const piece = m[0];
    if (/^\s?[A-Za-z]+$/.test(piece)) {
      const sp = piece[0] === " " || piece[0] === "\n" || piece[0] === "\t" ? piece[0] : "";
      const parts = splitWord(piece.slice(sp.length));
      parts.forEach((p, i) => out.push((i === 0 ? sp : "") + p));
    } else if (/[^\x00-\x7f]/.test(piece)) {
      const sp = /^\s/.test(piece) ? piece[0] : "";
      Array.from(piece.slice(sp.length)).forEach((c, i) => out.push((i === 0 ? sp : "") + c));
    } else out.push(piece);
  }
  return out;
}

function tokId(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) % 100000; }

/* ===== tiny language model ===== */
const CORPUS = [
  "the customer returned the product because it was damaged .",
  "the customer returned the product because it arrived late .",
  "the customer returned the product because it was too small .",
  "the customer returned the order because it stopped working .",
  "the customer returned the product because it was damaged .",
  "the customer requested a refund because it arrived late .",
  "the customer returned the product because it did not fit .",
  "the customer asked for a refund because it was damaged .",
  "the customer returned the order because it was too small .",
  "the customer returned the product because it stopped working .",
  "the customer returned the product because it was not as described .",
  "the customer was happy with the refund .",
  "the customer asked for a replacement because it was damaged .",
  "the support team approved the refund .",
  "the support team sent a replacement .",
  "the customer received a refund .",
  "the customer returned the product because it was damaged .",
  "the support team approved the refund ."
];
const VOCAB = ["<s>"];
CORPUS.forEach(s => s.split(" ").forEach(w => { if (!VOCAB.includes(w)) VOCAB.push(w); }));
const VI = Object.fromEntries(VOCAB.map((w, i) => [w, i]));
const V = VOCAB.length;
const PAIRS = [];
CORPUS.forEach((s, si) => { const w = ["<s>", ...s.split(" ")]; for (let p = 0; p < w.length - 1; p++) PAIRS.push({ s: si, pos: p, i: VI[w[p]], j: VI[w[p + 1]] }); });

function softmax(a) { let m = -Infinity; for (const x of a) if (x > m) m = x; const e = a.map(x => Math.exp(x - m)); let z = 0; for (const x of e) z += x; return e.map(x => x / z); }

function empiricalFloor() {
  const cnt = new Map(), tot = new Map();
  PAIRS.forEach(p => { const k = p.i + "_" + p.j; cnt.set(k, (cnt.get(k) || 0) + 1); tot.set(p.i, (tot.get(p.i) || 0) + 1); });
  let L = 0; PAIRS.forEach(p => { L += -Math.log(cnt.get(p.i + "_" + p.j) / tot.get(p.i)); });
  return L / PAIRS.length;
}

class Tiny {
  constructor() { this.reset(); }
  reset() { this.W = new Float64Array(V * V); for (let k = 0; k < this.W.length; k++) this.W[k] = (Math.random() - 0.5) * 0.02; this.steps = 0; this.losses = []; }
  row(i) { return Array.from(this.W.subarray(i * V, i * V + V)); }
  probs(i) { return softmax(this.row(i)); }
  draw() { return PAIRS[Math.floor(Math.random() * PAIRS.length)]; }
  apply(i, j, lr) {
    const p = this.probs(i); const loss = -Math.log(p[j]);
    const delta = [];
    for (let k = 0; k < V; k++) { const d = -lr * (p[k] - (k === j ? 1 : 0)); this.W[i * V + k] += d; delta.push(d); }
    this.steps++; this.losses.push(loss); return { loss, delta };
  }
  train(n, lr) { for (let t = 0; t < n; t++) { const d = this.draw(); this.apply(d.i, d.j, lr); } }
  avgLoss(n = 50) { const L = this.losses; if (!L.length) return null; const s = L.slice(-n); return s.reduce((a, b) => a + b, 0) / s.length; }
}

function applyTemp(p, T) {
  if (T < 0.05) { let b = 0; p.forEach((x, k) => { if (x > p[b]) b = k; }); return p.map((x, k) => k === b ? 1 : 0); }
  const q = p.map(x => Math.pow(Math.max(x, 1e-12), 1 / T)); const z = q.reduce((a, b) => a + b, 0); return q.map(x => x / z);
}
function sampleFrom(p, r) { let c = 0; for (let k = 0; k < p.length; k++) { c += p[k]; if (r < c) return k; } return p.length - 1; }
function generate(model, words, T, maxLen = 18) {
  const out = words.slice();
  while (out.length < maxLen) {
    const last = out.length ? out[out.length - 1] : "<s>";
    if (last === ".") break;
    const p = applyTemp(model.probs(VI[last]), T);
    let k = sampleFrom(p, Math.random()); if (VOCAB[k] === "<s>") k = VI["."];
    out.push(VOCAB[k]);
  }
  return out;
}

/* ===== brief -> answer (scripted illustration) ===== */
const BRIEF_OPTS = {
  policy: { label: "Return policy", opts: { none: "Not stated", free30: "30-day free returns", fee14: "14-day returns, 15% restocking fee on opened items", final: "Final sale (customized item)" }, line: { free30: "Our policy allows free returns within 30 days.", fee14: "Our policy allows returns within 14 days with a 15% restocking fee on opened items.", final: "This item is a final-sale customized product." } },
  days: { label: "Time since purchase", opts: { none: "Not stated", d5: "5 days", d25: "25 days", d45: "45 days" }, line: { d5: "The customer bought it 5 days ago.", d25: "The customer bought it 25 days ago.", d45: "The customer bought it 45 days ago." } },
  cond: { label: "Item condition", opts: { none: "Not stated", unopened: "Unopened", used: "Used, minor wear", defective: "Defective on arrival" }, line: { unopened: "The item is unopened.", used: "The item has been used and shows minor wear.", defective: "The item was defective on arrival." } },
  cust: { label: "Customer", opts: { none: "Not stated", new: "New customer", vip: "VIP, 6 years, $18,000 lifetime spend" }, line: { new: "This is a first-time customer.", vip: "This is a VIP customer of 6 years with $18,000 in lifetime spend." } },
  value: { label: "Order value", opts: { none: "Not stated", low: "$40", high: "$1,200" }, line: { low: "The order was worth $40.", high: "The order was worth $1,200." } }
};
const BRIEF_Q = "Should we approve this customer’s refund request?";
function advise(f) {
  const used = new Set(), out = [];
  const win = { free30: 30, fee14: 14, final: 0 }[f.policy];
  const dn = { d5: 5, d25: 25, d45: 45 }[f.days];
  let verdict, tone;
  const stated = Object.values(f).filter(v => v !== "none").length;
  if (stated === 0) {
    return { verdict: "Needs context", tone: "info", text: "It depends. I don’t have your return policy, the purchase date, or the condition of the item, so I can only give general guidance: defective items are usually refunded or replaced, and other returns usually depend on the return window. Share the details and I can give a specific recommendation.", used: [] };
  }
  if (f.policy === "none") {
    used.add("policy");
    verdict = "Needs context"; tone = "info";
    out.push("I can’t give a firm yes or no because the brief doesn’t include your return policy.");
    if (f.cond === "defective") { used.add("cond"); out.push("Even so, a defective item is normally covered, so a refund or replacement is the safe default."); }
    else out.push("Tell me the return window and whether the item can be resold, and I can decide.");
  } else if (f.cond === "defective") {
    used.add("cond"); used.add("policy"); verdict = "Approve"; tone = "good";
    out.push("Approve a full refund or a replacement, and cover the return shipping.");
    out.push(f.policy === "final" ? "Final-sale terms don’t normally override a defect." : (dn && dn > win ? "The return window has passed, but defects are normally handled separately from it." : "The fault is on our side, so the return window isn’t the deciding factor."));
    if (dn) used.add("days");
  } else if (f.policy === "final") {
    used.add("policy"); verdict = "Decline, offer an alternative"; tone = "warn";
    out.push("Decline the refund. This was sold as final sale.");
    if (f.cust === "vip") { used.add("cust"); out.push("Because this is a long-standing customer, offer store credit as a goodwill gesture."); }
    else out.push("If your policy allows it, offer store credit.");
  } else if (!dn) {
    used.add("policy"); verdict = "Likely approve"; tone = "good";
    out.push("Probably yes, but I need the purchase date to confirm the order is inside the " + win + "-day window.");
  } else if (dn <= win) {
    used.add("policy"); used.add("days");
    if (f.cond === "unopened") { used.add("cond"); verdict = "Approve"; tone = "good"; out.push("Approve a full refund. It is " + dn + " days in, inside the " + win + "-day window, and the item is unopened."); }
    else if (f.policy === "fee14") { used.add("cond"); verdict = "Approve with conditions"; tone = "good"; out.push("Approve, and apply the 15% restocking fee because the item has been opened."); }
    else { if (f.cond === "used") used.add("cond"); verdict = "Approve"; tone = "good"; out.push("Approve a refund. It is " + dn + " days in, inside the " + win + "-day window" + (f.cond === "used" ? "; inspect the item when it comes back." : ".")); }
  } else {
    used.add("policy"); used.add("days");
    if (f.cust === "vip") { used.add("cust"); verdict = "Approve as an exception"; tone = "warn"; out.push("This is " + (dn - win) + " days past the " + win + "-day window, but this is a VIP customer. Approve as a one-time exception and note it on the account."); }
    else { verdict = "Decline, offer an alternative"; tone = "warn"; out.push("Decline the refund. It is " + (dn - win) + " days past the " + win + "-day window. Offer store credit or warranty support instead."); }
  }
  if (f.value === "high" && tone !== "info") { used.add("value"); out.push("Because the order is over $1,000, route it to a human reviewer before money moves."); }
  else if (f.value === "low" && tone === "good") { used.add("value"); out.push("At $40, it’s cheaper to approve than to investigate."); }
  if (f.cust === "new" && tone !== "info") { used.add("cust"); out.push("Keep the tone welcoming; a smooth return makes a second purchase more likely."); }
  if (f.cust === "vip" && !used.has("cust")) { used.add("cust"); out.push("Mention their account history in the reply."); }
  return { verdict, tone, text: out.join(" "), used: [...used] };
}

/* ===== attention illustration (hand-set weights) ===== */
const ATT_WORDS = ["The", "customer", "returned", "the", "laptop", "to", "the", "store", "because", "it", "was"];
function attention(words, q) {
  const last = words.length - 1;
  const fn = new Set(["the", "to", "because", "was"]);
  const mult = {};
  const wq = words[q].toLowerCase();
  if (q === last && (wq === "defective")) { mult[4] = 14; mult[1] = 1.8; mult[7] = 0.6; mult[9] = 1.5; }
  else if (q === last && wq === "closed") { mult[7] = 14; mult[4] = 0.5; mult[9] = 1.5; }
  else if (wq === "it") { mult[4] = 3.2; mult[7] = 3.2; mult[8] = 1.4; }
  else if (wq === "returned") { mult[1] = 4; }
  else if (wq === "laptop") { mult[2] = 3; mult[1] = 1.5; }
  else if (wq === "store") { mult[2] = 2.2; mult[5] = 2.5; }
  else if (wq === "was") { mult[9] = 3; }
  else if (wq === "because") { mult[2] = 2; }
  else if (wq === "customer") { mult[0] = 2; }
  const w = [];
  for (let j = 0; j <= q; j++) { let x = Math.exp(-0.35 * (q - j)) * (fn.has(words[j].toLowerCase()) ? 0.45 : 1); if (j === q) x *= 1.3; x *= (mult[j] || 1); w.push(x); }
  const z = w.reduce((a, b) => a + b, 0); return w.map(x => x / z);
}

if (typeof module !== "undefined") module.exports = { tokenize, tokId, Tiny, VOCAB, VI, V, PAIRS, empiricalFloor, applyTemp, generate, advise, attention, ATT_WORDS, softmax };
