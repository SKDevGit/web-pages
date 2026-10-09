// High-level pipelines for the training and inference pages
const TRAIN_STAGES = [
  { t: "Collect text", what: "Gather very large amounts of text from the web, books, code and licensed sources.", ex: "Support emails, policy pages, forum answers, product manuals.", biz: "What goes in decides what the model knows and how it sounds. Sources also raise data-rights questions.", risk: "Bias, copyright and privacy problems start here.", ctl: "Vendor’s choice. Yours is choosing which model to use.", own: false },
  { t: "Clean and filter", what: "Remove duplicates, broken text, low-quality pages, personal details and harmful material.", ex: "Drop the 500 copies of the same refund policy found on different sites.", biz: "Quality in, quality out. Cleaning shapes behavior, but it never makes the data perfect.", risk: "Gaps and leftovers remain, so errors and bias can survive.", ctl: "Vendor’s choice.", own: false },
  { t: "Tokenize", what: "Split the cleaned text into tokens and turn them into ID numbers (Lesson 2).", ex: "“refund” becomes one token. “4821” may become several.", biz: "Tokens are the unit of cost and of the context window.", risk: null, ctl: "Vendor’s choice.", own: false },
  { t: "Pre-train", what: "The model guesses the next token across all the text, again and again, and its parameters are adjusted (see the Stage 1 steps).", ex: "Guess the word after “The customer returned the product because…”.", biz: "By far the most expensive stage, so few firms do it. General language ability, and the knowledge cutoff, come from here.", risk: "It learns patterns, not verified facts. That is a main source of hallucination, and its knowledge stops at the cutoff.", ctl: "Vendor’s choice.", own: false },
  { t: "Fine-tune on examples", what: "Further training on example requests paired with good answers, so the model follows instructions (see the Stage 2 steps).", ex: "“Write a polite reply declining a late return”, paired with a good reply.", biz: "Much cheaper than pre-training. It shapes style and format, and firms can do it with their own examples.", risk: "Narrow examples can narrow or skew behavior.", ctl: "Possible for your firm, if you have enough good examples (Lesson 8).", own: true },
  { t: "Learn from feedback", what: "People rank answers, and the model is adjusted toward the ones they prefer.", ex: "Raters prefer the polite, accurate reply to the curt one.", biz: "Makes the tool helpful, polite and careful. It reflects its raters’ judgement.", risk: "Reflects what raters preferred, which can carry bias or lean toward pleasing the user.", ctl: "Vendor’s choice.", own: false },
  { t: "Test and release", what: "Check quality and safety, then freeze the parameters and publish a version.", ex: "Run thousands of test requests, including tricky and harmful ones.", biz: "The model is now a fixed file. It does not learn from your chats. New versions arrive when the vendor trains again.", risk: "Tests cannot catch everything, and the knowledge date is now fixed.", ctl: "Pick a version, and run your own tests on your tasks.", own: true, frozen: true },
  { t: "Package as a product", what: "Wrap the model with instructions, an interface, safety checks and sometimes tools.", ex: "A chat window with a system prompt, an editor plug-in, an agent with an order-lookup tool.", biz: "Much of what makes a tool useful at work is built around the model, not inside it.", risk: "Weak checks, or too many permissions, turn errors into actions.", ctl: "Yours when you build or configure a product: instructions, tools, approvals.", own: true }
];
const TRAIN_GROUPS = [
  { name: "Stage 1 · Build the base model", idx: [0, 1, 2, 3], who: "Vendor", out: "Base model", outd: "A file of numbers that continues text. It does not answer requests." },
  { name: "Stage 2 · Fine-tune and polish", idx: [4, 5, 6], who: "Vendor, and sometimes you", out: "Assistant model", outd: "Frozen and ready to answer. This is the model that inference uses." },
  { name: "Stage 3 · Package as a product", idx: [7], who: "You, when you build or configure a tool", out: "A product", outd: "What people actually use at work." }
];
const TRAIN_OUT = [
  ["Chat assistant", [4, 5], "General conversation and writing. Shaped most by the example conversations and the human feedback stages. The product adds a system prompt, a chat interface, conversation memory and safety checks."],
  ["Coding assistant", [0, 4], "Much more code in the collected text, and examples of programming tasks. The product adds access to your files, an editor, and often the ability to run tests."],
  ["Agent", [4, 7], "Extra examples of planning and calling tools. The product adds the tools themselves, the plan-and-act loop, and human approval for risky steps."]
];
const INFER_STAGES = [
  { t: "You send a request", what: "Your message, typed into a chat, an editor or an app. It can also be an image, audio or a file.", ex: "“the customer returned the product because…”", biz: "Clear wording and the right facts matter (Lesson 5).", risk: "Anything you type may leave your control (Lesson 7).", ctl: "Yours: clear wording, and no sensitive data in unapproved tools.", own: true },
  { t: "Product adds context", what: "The product (the app or tool you use) adds its standing instructions, the earlier conversation and any documents it looked up.", ex: "“You are a support assistant…” plus the returns policy.", biz: "This is why the same model behaves differently in different products.", risk: "Missing or old documents give out-of-date answers.", ctl: "Yours: the instructions and documents you supply (Lesson 8).", own: true },
  { t: "Tokenize", what: "The whole text is cut into tokens, and each token gets an ID number, like a catalog number (Lesson 2).", ex: "“the customer returned the product because” becomes six tokens.", biz: "Cost and speed are counted in tokens, including everything the product added.", risk: null, ctl: "Yours: how much text you send.", own: true },
  { t: "Tokens to numbers", what: "Each ID is swapped for a list of numbers that captures how the token is used. The ID alone is just a label.", ex: "“customer” becomes a list such as [−0.13, 0.78, −0.31, 0.60, …].", biz: "From here on the model only does arithmetic on numbers. It never sees letters again.", risk: null, ctl: "Vendor’s choice.", own: false },
  { t: "Read the context", what: "The frozen parameters are applied, and attention weighs which earlier tokens matter.", ex: "Reading “because”, the model weighs the words before it.", biz: "The model is not learning anything new from your request. It only reads it.", risk: "Details buried in a very long prompt can be overlooked.", ctl: "Yours: put the key facts clearly in the prompt.", own: true },
  { t: "Score every next token", what: "The model gives every possible next token a percentage chance.", ex: "After “because”, the toy model gives “it” almost all the chance.", biz: "These odds come from the parameters that training set.", risk: "Likely-sounding is not the same as true: hallucination.", ctl: "Vendor’s choice.", own: false },
  { t: "Pick one token", what: "One token is chosen by weighted chance. Temperature sets how adventurous the choice is.", ex: "Usually “it”, and with a higher temperature, sometimes another token.", biz: "Choosing by chance is why answers vary from run to run.", risk: "A less likely token can send the reply in a different direction.", ctl: "Temperature, where the product exposes it.", own: true },
  { t: "Repeat until done", what: "The chosen token is added to the text, and the model goes around again until the reply is complete.", ex: "“…because it was damaged.” is built one token at a time.", biz: "Longer replies cost more and take longer.", risk: null, ctl: "Yours: ask for shorter replies.", own: true },
  { t: "Tokens back to output", what: "The chosen tokens are joined back into text. Image and audio models produce pixels or sound instead.", ex: "“it”, “was”, “damaged”, “.” becomes a sentence.", biz: "Output tokens are billed too, and usually at a higher rate than input tokens.", risk: null, ctl: "Yours: ask for shorter replies.", own: true },
  { t: "Checks and reply", what: "The product may check the text, then shows you the reply or takes an action.", ex: "A guardrail blocks a policy breach. An agent asks for approval before refunding.", biz: "This is where human review belongs.", risk: "With no review, errors reach customers.", ctl: "Yours: review rules and approvals.", own: true }
];
const INFER_GROUPS = [
  { name: "Stage 1 · Prepare the input", idx: [0, 1, 2, 3], who: "You and the product", out: "Numbers", outd: "A sequence of numbers the model can compute with." },
  { name: "Stage 2 · The model generates", idx: [4, 5, 6, 7], who: "The frozen assistant model", out: "Output tokens", outd: "The reply, one token at a time. Nothing in the model changes." },
  { name: "Stage 3 · Deliver the output", idx: [8, 9], who: "The product", out: "A reply or an action", outd: "What you see, or what the product does for you." }
];
function pipeline(sel, kind) {
  const train = kind === "train", st = train ? TRAIN_STAGES : INFER_STAGES, GR = train ? TRAIN_GROUPS : INFER_GROUPS, root = $(sel);
  const S = { sel: train ? 3 : 4, ov: 0, out: -1 };
  const HERE = train ? [3, 4, 5, 6, 7] : null;
  function draw() {
    clear(root);
    const emph = S.out >= 0 ? TRAIN_OUT[S.out][1] : [];
    const mk = (s, i) => {
      const here = train ? HERE.includes(i) : !!s.here;
      const badges = [];
            if (s.frozen) badges.push(h("span", { class: "pb frozen", text: "Model frozen" }));
      if (emph.includes(i)) badges.push(h("span", { class: "pb emph", text: "Shapes this most" }));
      if (S.ov === 1 && s.risk) badges.push(h("span", { class: "pb risk", text: "Risk" }));
      if (S.ov === 2) badges.push(h("span", { class: "pb " + (s.own ? "own" : "vendor"), text: s.own ? "You can influence" : "Vendor" }));
      return h("button", { class: "pcell" + (i === S.sel ? " sel" : "") + (emph.includes(i) ? " emph" : ""), onclick: () => { S.sel = i; S.out = -1; draw(); } }, h("small", { text: "" }), h("b", { text: s.t }), h("span", { class: "pbs" }, ...badges));
    };
    let grid;
    {
      grid = h("div", { class: "pbands" });
      GR.forEach((g, k) => {
        const pg = h("div", { class: "pgrid" }, ...g.idx.map(i => mk(st[i], i)));
        grid.append(h("div", { class: "pband b" + (k + 1) }, h("div", { class: "phead" }, h("b", { text: g.name }), h("span", { text: g.who })), pg, h("div", { class: "pres" }, h("span", { class: "parr", text: "→" }), h("b", { text: g.out + ": " }), g.outd)));
      });
    }
    root.append(grid);
    const s = st[S.sel], d = h("div", { class: "mini", style: { marginTop: "10px" } }, cell("What happens", s.what), cell("Example", s.ex), cell("Why it matters", s.biz));
    if (S.ov === 1 && s.risk) d.append(cell("Where risk comes in", s.risk));
    if (S.ov === 2) d.append(cell("What you can change", s.ctl));
    root.append(h("div", { class: "label", style: { marginTop: "12px" }, text: GR.find(g => g.idx.includes(S.sel)).name + " · " + s.t }), d);
    const ov = h("div", { class: "row", style: { marginTop: "10px" } }, h("span", { class: "hint", text: "Show:" }), h("div", { class: "seg3" }, ...["Plain view", "Where risks come from", "What my business can change"].map((x, k) => h("button", { class: S.ov === k ? "on" : "", onclick: () => { S.ov = k; S.out = -1; draw(); } }, x))));
    root.insertBefore(ov, grid);
  }
  draw();
}
