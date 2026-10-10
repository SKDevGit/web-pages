# Fact-check log

A record of each content review: what was checked, what was fixed, and what is still open. Read this before a new review so settled points are not checked again. Add a new entry at the top for each review.

Content that changes quickly (model names, prices, context sizes, regulations, product features) should be rechecked before each new class, even if it is listed as verified here.

## Review 2 · 9 October 2026 (Inside the LLM, all 10 lessons)

**Method.** Every lesson read in full (all steps, Try it, Go deeper and quizzes). Claims checked against primary sources where they exist; toy arithmetic recomputed.

**Verified against sources:** Claude Code reads CLAUDE.md files at the start of each session, and also keeps auto-memory notes (Claude Code docs, memory page). Output tokens cost more than input tokens, cache reads cost a fraction of input, and batch processing is discounted 50% (Claude pricing page); thinking tokens are billed as output tokens (extended thinking docs). Function calling launched 13 June 2023 (OpenAI). Human feedback: labelers write demonstrations and rank outputs, rankings then tune the model (InstructGPT, arXiv 2203.02155). Fine-tuning is positioned for format, tone and behavior, while outside knowledge goes in the prompt (OpenAI model optimization guide). Detail buried in the middle of long input is used less reliably (Liu et al., Lost in the Middle, arXiv 2307.03172). OWASP LLM01:2025 prompt injection, least privilege and human-in-the-loop (rechecked, still current). Vocabulary sizes of roughly 32,000 to 256,000 tokens (GPT-4 about 100,000; Gemma 256,000). The refund working in Lesson 6 ($220.25), the cost calculator figures in Lessons 2 and 9, the 12 of 71 words in the summary demo, and the Lesson 1 odds (sum to 100%) all recompute correctly.

**Fixed:** Lesson 4 pointed to Lesson 8 for who approves risky actions; changed to Lessons 6 and 7. Lesson 4 quiz on temperature 0 now says "In this demo" and the feedback notes that real systems are close to repeatable but not always exact.

**Left as simplifications (not errors):** the base model "does not answer requests" (real base models can be coaxed with examples); fine-tuning "shapes behavior, not what is true today" (a fine-tuned model can pick up some facts, but it is the wrong tool for changing facts); toy-model numbers, scripted odds and example prices are labelled illustrative on each page.

**Not independently verified:** digit grouping in tokenizers ("numbers split into short groups") is hedged on the page; tiktoken could not be downloaded here to confirm exact splits.

## Content added after Review 1

- **Model development (Lesson 3) and Model usage (Lesson 4)**, written 9 October 2026. New claims to check at the next review: output tokens usually cost more than input tokens; real vocabularies hold tens of thousands to a few hundred thousand tokens; embeddings use hundreds to thousands of numbers; image generators often work by removing noise step by step; refund limits in the checks step are examples only.
- **Context (Lesson 5)**, 9 October 2026, with reference to the Claude Academy tutorial on parametric memory and context (https://academy.claude.com/tutorials/parametric-memory-and-context). Claims to recheck: Claude Code reads a CLAUDE.md file for saved notes; compaction can lose details; window sizes and token counts in the lesson are toy numbers; how well models use very long input varies by model.
- **What LLMs are used for (Lesson 6) and Limits and risks (Lesson 7)**, 9 October 2026. Verified: prompt injection definition and the least-privilege and human-approval mitigations (OWASP, https://genai.owasp.org/llm01/; "no foolproof prevention within the model"); US Copyright Office view that material made only by AI is not copyrightable while human creative input can be (Copyright and Artificial Intelligence, Part 2: Copyrightability, 2025; https://www.copyright.gov/ai/). Wording kept general because it changes quickly: that what you paste may be stored, reviewed or used to improve models depends on the tool and plan. Recheck before each class: copyright rules by country, provider data-use terms, and the scripted odds (illustrative only).
- **Making it fit your business (Lesson 8)**, 9 October 2026. General claims, no figures: prompting and retrieval change what the model reads and fine-tuning changes the model; fine-tuning is best for style and behavior, not changing facts; not every model can be fine-tuned and methods and cost vary by provider; retrieval reduces but does not remove invented answers, and search should respect who may see which documents. The example counts of fine-tuning examples (0, 10, 100, 1,000) are illustrative only.
- **Cost, choice and where to start (Lesson 9)**, 9 October 2026. The cost calculator uses made-up example rates (per million tokens: small $0.50 in and $2.50 out; medium $2.50 and $12.50; large $10 and $50) chosen to match the 1x, 5x and 20x ratios in the size table. They are not real prices. Claims to recheck: output tokens usually cost more than input tokens; reasoning tokens are typically billed as output; some providers discount cached or batched input. The history list (2017 transformer, 2020 larger models, 2022 chat assistants, 2023 images, sound and tools, 2024 to 2025 reasoning models) was kept from the earlier version. Model maturity labels (mature, maturing, growing, early) are rough and change quickly.
- **Start with a prediction (Lesson 1), What are tokens? (Lesson 2) and Put it all together (Lesson 10)**, 9 October 2026. Wording hedged: in many tokenizers a space belongs to the word that follows it; many vocabularies were built from English-dominated text, so other scripts often split into more pieces; output tokens are often priced higher than input tokens. The token counts come from a simplified tokenizer, and the prices in the Lesson 2 calculator ($1, $3 and $10 per million tokens) are placeholders, not quotes. The Lesson 1 odds are set by hand.

## Review 1 · 8 October 2026

**Scope.** Every page: the library home, the course page, Introduction to AI (Lessons 1 to 8) and Inside the LLM (index, 10 lessons, Key terms) with their helper scripts.

**Method.** Full read of every page. Dates, numbers, names and quotations looked up. Two independent readers covered Inside the LLM and ran its example code. Checked for factual errors, outdated claims, misleading simplifications, inappropriate content, internal contradictions (answer keys against feedback, numbers that do not add up), and the house rules in DESIGN.md.

### Checked and found correct (do not recheck unless the source changes)

| Claim | Where |
|---|---|
| OECD definition wording (2023 update; explanatory memorandum March 2024) | Lesson 2 |
| Turing test 1950; Searle's Chinese room | Lesson 2 |
| Dartmouth workshop 1956, organizers McCarthy, Minsky, Rochester, Shannon | Lesson 4 |
| Deep Blue beat Kasparov 3½ to 2½, May 1997; about 200 million positions a second | Lesson 4 |
| AlexNet, ImageNet 2012: 15.3% top-5 error, over 10 points better than runner-up; two Nvidia GPUs; 30 September 2012 | Lessons 4 |
| Transformer paper "Attention Is All You Need", submitted 12 June 2017 | Lesson 4 |
| ChatGPT launched 30 November 2022 on GPT-3.5 | Lesson 4 |
| Funding collapses mid-1970s and late 1980s; expert systems boom (DEC about $40M a year by 1986) | Lesson 4 |
| Fortran April 1957; SQL early 1970s (Chamberlin and Boyce); VisiCalc 17 October 1979; Xerox Alto 1973, Star 1981, Macintosh 1984 | Lesson 7 |
| Amazon recruiting tool: ten years of résumés, penalized "women's", scrapped 2017 (Reuters, 2018) | Lesson 6 |
| Cost and accuracy arithmetic: 98% accuracy for a model that flags nothing at 2% fraud; confusion matrix; 5,000 tickets × 800 tokens × $3 per million = $360 a month | Lesson 6, LLM tokens |
| All quiz answer keys agree with their feedback (re-verified after answer positions were varied) | All |
| Hindi text uses more tokens than English in common tokenizers (Petrov et al., NeurIPS 2023) | LLM tokens |
| Human feedback can push models toward pleasing answers (Sharma et al., ICLR 2024) | LLM training |

### Issues fixed

| Issue | Fix |
|---|---|
| "Part" used instead of "Lesson" across Inside the LLM (about 60 places, including Key terms links) | Changed to "Lesson" |
| Time or duration words: "a minute", "10-second", "overnight", "shortly", "in class" | Removed or reworded |
| "Short exercises / steps / paragraphs" | "Short" removed |
| Tokenization example said nine tokens; the demo gives seven | Changed to seven |
| Training page said the model "looks up" chances, contradicting its own quiz | Reworded to "reads off" |
| Return-policy demo asserted an item "has been opened" when no condition was given | Now asks for the condition |
| Fine-tuning scenario feedback marked fine-tuning right, then advised trying something else first | Reworded to agree with the key |
| Fine-tuning and human-feedback examples contained facts the model was never given ("shipped yesterday", "by Friday") | Facts added to the question, or examples made generic |
| "Cheaper elsewhere" reason grouped under "Not as expected" instead of "Price" | Pattern fixed |
| "Your classmates wrote different endings" stated before any answers existed | Reworded |
| "Contract may not fit in one window" outdated for current context sizes | Reworded; note added that real windows are far larger |
| "Every model predicts the next piece of its data" (not true of image generators) | Qualified |
| "Data goes to the vendor"; "does not learn from your chats" (depends on vendor terms) | Qualified |
| Specialized models "better on home turf" stated flatly | "Can be better … test against a general model" |
| Timeline omitted reasoning models; 2022 line overstated | Added 2024–25 entry; reworded |
| "Auditable" for analytical AI; ChatGPT "100M users" stated as fact | "Easier to audit"; "an estimated" |
| Lesson 7 exercise: unclear categories, answer and feedback disagreed | Categories defined (Automate, Assist, Person leads); feedback aligned |
| Every quiz had the right answer first | Positions varied |
| British and American spellings mixed | US spellings throughout |

### Open items (decided to leave, or need a decision)

| Item | Note |
|---|---|
| Embedding map shows two nearest words; the second is often unrelated (for example apple next to computer) | Design change needed; not done |
| Tokenizer demo: all-capitals word is not split as real tokenizers would; Hindi is split into single characters | Simplification; note on page says it is simplified |
| Maturity ratings (Multimodal, Images and video) are the author's judgment and may date quickly | Recheck before each class |
| Escalation thresholds differ across pages ($200 and $1,000) | Fine if treated as examples |
| Wrap-up sources list states the module was drafted with an AI assistant | Author's call to keep or remove |
| Library home, course page and README | Not flagged by the review; not read line by line |

### Rules learned (apply when writing new content)

- Never put facts in a model's "good" answer that the prompt did not supply.
- Date-specific or company-specific numbers need a source in Go deeper, and secondary sources are marked as such.
- Say "an estimate" for figures that come from third-party analysts.
- Keep exercise categories defined on the page before asking learners to sort into them.
- Vary the position of the right answer in every quiz.
- No "Part", no durations, no instructor or class references in learner-facing text.
- Before a class, recheck anything about current models, prices, context sizes, regulations and product features.
