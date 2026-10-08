# Fact-check log

A record of each content review: what was checked, what was fixed, and what is still open. Read this before a new review so settled points are not checked again. Add a new entry at the top for each review.

Content that changes quickly (model names, prices, context sizes, regulations, product features) should be rechecked before each new class, even if it is listed as verified here.

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
