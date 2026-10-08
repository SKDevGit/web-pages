// High-level pipelines for the training and inference pages
const TRAIN_STAGES = [
  { t: "Collect text", what: "Gather very large amounts of text from the web, books, code and licensed sources.", ex: "Support emails, policy pages, forum answers, product manuals.", biz: "What goes in decides what the model knows and how it sounds. Sources also raise data-rights questions.", risk: "Bias, copyright and privacy problems start here.", ctl: "Vendor’s choice. Yours is choosing which model to use.", own: false },
  { t: "Clean and filter", what: "Remove duplicates, broken text, low-quality pages, personal details and harmful material.", ex: "Drop the 500 copies of the same refund policy found on different sites.", biz: "Quality in, quality out. Cleaning shapes behavior, but it never makes the data perfect.", risk: "Gaps and leftovers remain, so errors and bias can survive.", ctl: "Vendor’s choice.", own: false },
  { t: "Tokenize", what: "Split the cleaned text into tokens and turn them into ID numbers (Lesson 2).", ex: "“refund” becomes one token. “4821” may become several.", biz: "Tokens are the unit of cost and of the context window.", risk: null, ctl: "Vendor’s choice.", own: false },
  { t: "Pre-train", what: "The model guesses the next token across all the text, again and again, and its parameters are adjusted (Stage 1 below).", ex: "Guess the word after “The customer returned the product because…”.", biz: "By far the most expensive stage, so few firms do it. General language ability, and the knowledge cutoff, come from here.", risk: "It learns patterns, not verified facts. That is a main source of hallucination, and its knowledge stops at the cutoff.", ctl: "Vendor’s choice.", own: false },
  { t: "Fine-tune on examples", what: "Further training on example requests paired with good answers, so the model follows instructions (Stage 2 below).", ex: "“Write a polite reply declining a late return”, paired with a good reply.", biz: "Much cheaper than pre-training. It shapes style and format, and firms can do it with their own examples.", risk: "Narrow examples can narrow or skew behavior.", ctl: "Possible for your firm, if you have enough good examples (Lesson 8).", own: true },
  { t: "Learn from feedback", what: "People rank answers, and the model is adjusted toward the ones they prefer.", ex: "Raters prefer the polite, accurate reply to the curt one.", biz: "Makes the tool helpful, polite and careful. It reflects its raters’ judgement.", risk: "Reflects what raters preferred, which can carry bias or lean toward pleasing the user.", ctl: "Vendor’s choice.", own: false },
  { t: "Test and release", what: "Check quality and safety, then freeze the parameters and publish a version.", ex: "Run thousands of test requests, including tricky and harmful ones.", biz: "The model is now a fixed file. It does not learn from your chats. New versions arrive when the vendor trains again.", risk: "Tests cannot catch everything, and the knowledge date is now fixed.", ctl: "Pick a version, and run your own tests on your tasks.", own: true, frozen: true },
  { t: "Package as a product", what: "Wrap the model with instructions, an interface, safety checks and sometimes tools.", ex: "A chat window with a system prompt, an editor plug-in, an agent with an order-lookup tool.", biz: "Much of what makes a tool useful at work is built around the model, not inside it.", risk: "Weak checks, or too many permissions, turn errors into actions.", ctl: "Yours when you build or configure a product: instructions, tools, approvals.", own: true }
];
const TRAIN_OUT = [
  ["Chat assistant", [4, 5], "General conversation and writing. Shaped most by the example conversations and the human feedback stages. The product adds a system prompt, a chat interface, conversation memory and safety checks."],
  ["Coding assistant", [0, 4], "Much more code in the collected text, and examples of programming tasks. The product adds access to your files, an editor, and often the ability to run tests."],
  ["Agent", [4, 7], "Extra examples of planning and calling tools. The product adds the tools themselves, the plan-and-act loop, and human approval for risky steps."]
];
const INFER_STAGES = [
  { t: "You type a request", what: "Your message, typed into a chat, an editor or an app.", ex: "“Should we refund order 4821?”", biz: "Clear wording and the right facts matter (Lesson 5).", risk: "Anything you type may leave your control (Lesson 7).", ctl: "Yours: clear wording, and no sensitive data in unapproved tools.", own: true },
  { t: "Product adds context", what: "The product adds its standing instructions, the earlier conversation and any documents it looked up.", ex: "“You are Northwind support…” plus the returns policy.", biz: "This is why the same model behaves differently in different products.", risk: "Missing or old documents give out-of-date answers.", ctl: "Yours: the instructions and documents you supply (Lesson 8).", own: true },
  { t: "Tokenize", what: "The whole text is split into tokens and ID numbers.", ex: "“Should we refund order 4821?” becomes about seven tokens.", biz: "Cost and speed are counted in tokens, including everything the product added.", risk: null, ctl: "Yours: how much text you send.", own: true, here: true },
  { t: "Model reads", what: "The frozen parameters are applied, and attention weighs which earlier tokens matter.", ex: "Reading “defective”, attention leans on “laptop”.", biz: "The model is not learning anything new from your request. It only reads it.", risk: "Details buried in a very long prompt can be overlooked.", ctl: "Yours: put the key facts clearly in the prompt.", own: true, here: true },
  { t: "Predict next token", what: "The model gives odds for every possible next token, and one is chosen by sampling.", ex: "“Yes” 34%, “Based” 16%, “I” 13%.", biz: "Sampling is why answers vary from run to run.", risk: "Likely-sounding is not the same as true: hallucination.", ctl: "Temperature, where the product exposes it.", own: true, here: true },
  { t: "Repeat until done", what: "The chosen token is added to the text, and the model predicts again until the reply is complete.", ex: "One token at a time, until “…send a prepaid return label.”", biz: "Longer replies cost more and take longer.", risk: null, ctl: "Yours: ask for shorter replies.", own: true, here: true },
  { t: "Checks and reply", what: "The product may check the text, then shows you the reply or takes an action.", ex: "A guardrail blocks a policy breach. An agent asks for approval before refunding.", biz: "This is where human review belongs.", risk: "With no review, errors reach customers.", ctl: "Yours: review rules and approvals.", own: true }
];
function pipeline(sel, kind) {
  const train = kind === "train", st = train ? TRAIN_STAGES : INFER_STAGES, root = $(sel);
  const S = { sel: train ? 3 : 4, ov: 0, out: -1 };
  const HERE = train ? [3, 4, 5, 6, 7] : null;
  function draw() {
    clear(root);
    const emph = S.out >= 0 ? TRAIN_OUT[S.out][1] : [];
    const grid = h("div", { class: "pgrid" });
    st.forEach((s, i) => {
      const here = train ? HERE.includes(i) : !!s.here;
      const badges = [];
      if (here) badges.push(h("span", { class: "pb here", text: train ? "Exercise below" : "Steps below" }));
      if (s.frozen) badges.push(h("span", { class: "pb frozen", text: "Model frozen" }));
      if (emph.includes(i)) badges.push(h("span", { class: "pb emph", text: "Shapes this most" }));
      if (S.ov === 1 && s.risk) badges.push(h("span", { class: "pb risk", text: "Risk" }));
      if (S.ov === 2) badges.push(h("span", { class: "pb " + (s.own ? "own" : "vendor"), text: s.own ? "You can influence" : "Vendor" }));
      grid.append(h("button", { class: "pcell" + (i === S.sel ? " sel" : "") + (emph.includes(i) ? " emph" : ""), onclick: () => { S.sel = i; S.out = -1; draw(); } }, h("small", { text: i + 1 }), h("b", { text: s.t }), h("span", { class: "pbs" }, ...badges)));
    });
    root.append(grid);
    const s = st[S.sel], d = h("div", { class: "mini", style: { marginTop: "10px" } }, cell("What happens", s.what), cell("Example", s.ex), cell("Why it matters", s.biz));
    if (S.ov === 1 && s.risk) d.append(cell("Where risk comes in", s.risk));
    if (S.ov === 2) d.append(cell("What you can change", s.ctl));
    root.append(h("div", { class: "label", style: { marginTop: "12px" }, text: "Stage " + (S.sel + 1) + ": " + s.t }), d);
    if (train) {
      const box = h("div", { class: "resbox" }, h("div", { class: "label", text: "The result is a useful product" }), h("p", { class: "hint", style: { margin: "2px 0 8px" }, text: "Choose a kind to see which stages shape it most." }));
      const g = h("div", { class: "resgrid" });
      TRAIN_OUT.forEach((o, k) => g.append(h("button", { class: "btn" + (S.out === k ? " on" : ""), onclick: () => { S.out = S.out === k ? -1 : k; draw(); } }, o[0])));
      box.append(g);
      if (S.out >= 0) box.append(h("div", { class: "note", style: { marginTop: "8px" } }, h("b", { text: TRAIN_OUT[S.out][0] + ": " }), TRAIN_OUT[S.out][2], " The stages that shape it most are marked above. ", h("button", { class: "btn", style: { marginLeft: "6px" }, onclick: () => { S.out = -1; draw(); } }, "Clear")));
      root.append(box);
    }
    const ov = h("div", { class: "row", style: { marginTop: "10px" } }, h("span", { class: "hint", text: "Show:" }), h("div", { class: "seg3" }, ...["Plain view", "Where risks come from", "What my business can change"].map((x, k) => h("button", { class: S.ov === k ? "on" : "", onclick: () => { S.ov = k; S.out = -1; draw(); } }, x))));
    root.insertBefore(ov, grid);
  }
  draw();
}
