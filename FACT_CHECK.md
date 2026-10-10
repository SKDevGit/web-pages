# Fact-check guide

What to check before a class, where to check it, and how to record it. Use this with `FACTCHECK.md`, which is the log of what was checked and fixed in each review. Read the log first so settled points are not checked again.

## How to run a review

1. Read every page in full: Main, Try it, Go deeper, Check yourself, and the "What you've seen" step. Claims hide in Go deeper, quiz feedback and scripted demo text.
2. List each checkable claim (a number, date, name, rule, product feature, or "always/never/usually" statement).
3. Check each claim against a primary source from the table below. A blog post or a search snippet is not enough.
4. Recompute every number in the examples: totals, percentages, word counts, costs.
5. Check the internal consistency rules (section below).
6. Fix the page, or soften the wording. Then log it in `FACTCHECK.md` with the date, what was verified, what changed, and what was left.

## Check every time (fast-changing)

These change quickly, so recheck them before each class even if the log says verified.

| Topic | What to check | Where to check |
|---|---|---|
| Model names, versions, release dates | Any named model or product, and what it can do | The vendor's own announcement or docs page |
| Prices and billing | Output costs more than input; thinking tokens billed as output; discounts for cached and batched input | Vendor pricing pages (Claude, OpenAI, others named on a page) |
| Context window sizes | Statements about how large real windows are; how models handle very long input | Vendor model docs; research papers (for example "Lost in the Middle") |
| Product features | What Claude Code, chat apps and agents can do (memory files, skills, tools, retrieval) | Official product docs |
| Data use and privacy | What happens to pasted text: stored, reviewed, used for training, by plan | The vendor's current terms and settings pages |
| Law and regulation | Copyright and AI, any rule named on a page | Copyright Office, official government pages |
| Security guidance | Prompt injection definition and mitigations | OWASP Top 10 for LLM Applications (LLM01) |
| Maturity labels | The mature / maturing / growing / early labels on kinds of models | Author's judgment; reread against current products |
| Tokenizer facts | Vocabulary sizes; how numbers, other scripts and rare words split | Tokenizer docs and a real tokenizer run, when available |

## Settled facts (recheck only if the source changes)

| Topic | Fact | Source |
|---|---|---|
| Transformer | "Attention Is All You Need", submitted 12 June 2017 | arXiv 1706.03762 |
| Human feedback | Labelers write examples and rank outputs; rankings tune the model | InstructGPT, arXiv 2203.02155 |
| Long input | Relevant detail in the middle of a long input is used less reliably | Liu et al., arXiv 2307.03172 |
| Prompt injection | Definition, least privilege, human-in-the-loop, no foolproof prevention | OWASP LLM01:2025 |
| Copyright | Material made only by AI is not protected in the United States; human creative input can be | US Copyright Office, Copyright and AI, Part 2 |
| Other-script cost | Hindi and other scripts use more tokens in common tokenizers | Petrov et al., NeurIPS 2023 |
| Function calling | Launched 13 June 2023 | OpenAI announcement |
| Claude Code memory | Reads CLAUDE.md at the start of each session; also keeps auto-memory notes | Claude Code docs, memory page |
| ChatGPT launch | 30 November 2022 | OpenAI |

## Per-lesson hot spots

What to look at first in each Inside the LLM lesson.

| Lesson | Check |
|---|---|
| 1. Start with a prediction | Odds are set by hand and say so; the percentages sum to 100 |
| 2. What are tokens? | "In many tokenizers" wording; token counts come from a simplified tokenizer; placeholder prices; context window counts input plus reply |
| 3. Model development | Pre-training is the most expensive stage; fine-tuning is far cheaper; error score is minus the natural log of the chance; "base model does not answer requests" is a simplification; what cleaning removes |
| 4. Model usage | Embedding sizes (hundreds to thousands); vocabulary sizes (tens of thousands to a few hundred thousand); output tokens priced higher; temperature 0 is close to repeatable, not exact; image generators often remove noise step by step |
| 5. Context | Window sizes and token counts are toy numbers; compaction can lose details; CLAUDE.md claim; how well models use long input varies by model; cached input may cost less |
| 6. What LLMs are used for | Scripted odds; the refund arithmetic ($220.25); the word count in the summary demo; reasoning models get extra training that rewards correct working |
| 7. Limits and risks | Prompt injection and its mitigations; copyright statement; data-use wording kept general; bias is reduced but rarely removed |
| 8. Making it fit your business | Prompting, retrieval and fine-tuning each act where the page says; fine-tuning is for style and behavior, not changing facts; retrieval reduces but does not remove invented answers; example counts are illustrative |
| 9. Cost, choice and where to start | Example rates and the 1x / 5x / 20x ratios are not real prices; reasoning tokens billed as output; the history list; maturity labels |
| 10. Put it all together | Every Training / Inference / Both answer agrees with the earlier lessons; the takeaways match what was taught |

## Claim types and how to treat them

| Type | Rule |
|---|---|
| Date, number, name, quotation | Look it up. Cite the source in Go deeper when it is company-specific or date-specific. |
| Third-party estimates (user counts, market figures) | Say "an estimate". Do not state as fact. |
| "Always", "never", "all", "only" | Look for a counterexample. Soften to "usually", "often", "in many" when one exists. |
| Product behavior (what a tool does with your data) | Say it depends on the tool and plan, unless a current source settles it. |
| Toy and scripted examples | Label them as illustrative on the page. Never present scripted output as what a real model does. |
| Made-up prices and sizes | Label as examples, not quotes. |
| Simplifications | Allowed when they are stated or harmless. Log them as "left as simplifications". |

## Internal consistency checks

- Every quiz answer key agrees with its feedback sentence, and the right answer is not always in the same position.
- Numbers add up: totals, percentages, tokens, costs, counts shown on screen.
- Facts in an example answer were supplied in the prompt. A "good" model answer must never contain facts the prompt did not give.
- Categories are defined on the page before learners sort into them.
- Cross-references point to the right lesson ("Lesson 7 covers safeguards" really does).
- Terms match across lessons (assistant model, base model, context, working memory, parameters).
- The same fact is not stated two different ways in two lessons.
- The Try it text does not repeat the Main text.

## House rules to confirm while reading

- "Lesson", never "Part".
- No time or duration words, and no references to a class, instructor or slide.
- US spelling throughout.
- Simple language for MBA learners.
- Copyright line "© 2026 Srikanth KS. All rights reserved." appears on every page.
- No name or example that uses the crigloo domain.

## How to log a review

Add an entry at the top of `FACTCHECK.md` with:

1. Date and scope (which pages).
2. Method (what was read, what was looked up, what was recomputed).
3. Verified against sources (claim and source).
4. Fixed (issue and what changed).
5. Left as simplifications, and not verified (with the reason).
6. Anything that must be rechecked next time.

## Before every class

1. Run the "Check every time" table.
2. Open each lesson and run Try it once, to confirm the numbers on screen still match the text.
3. Skim `FACTCHECK.md` for anything marked "recheck".
