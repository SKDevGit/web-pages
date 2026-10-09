# Teaching site: design reference

A static website of short, hands-on lessons for MBA students. One instructor teaches from it on a projector. Students read it later on their own. Author: Srikanth KS.

This file records how the site is built and the rules to follow when adding to it. If a rule here and the code disagree, fix whichever is wrong and update this file.

## 1. What it has to do

The same pages serve two uses.

- **In class.** The instructor projects a step, talks through it, and runs the exercise live with the room. Each screen has to be readable from the back of the room and fit on one screen.
- **After class.** A student reads the lesson like any website, opens the extra reading when curious, and tries the quiz.

The site must behave like a normal website first. Classroom features are additions, never replacements.

## 2. Guiding rules

1. **Simple for MBAs.** Plain words, short sentences, no jargon without a definition. No coding or maths needed to follow.
2. **One idea per step**, and the main content of a step fits one screen.
3. **Calm reading column.** One narrow column, quiet colours, generous space. Graphics and interaction only where they help.
4. **No time mentions.** Never write durations such as "10 minutes" in the content.
5. **No speaker notes and no slide-specific references** in the content.
6. **Navigating to a new page starts at the top.**
7. **Copyright line** on every page: `© 2026 Srikanth KS. All rights reserved.` (added automatically by the pager).
8. **Parts of a course are called Lessons**, not Parts.
9. Content is original wording. Cite sources in Go deeper where facts come from outside, and mark secondary sources.
10. Empty parts of a step are hidden, never shown as "no content".

## 3. Structure

```
Library (index.html)
└── Course        courses/<course>/index.html          e.g. AI for Marketing: Powered by Agents
    └── Module    modules/<module>/index.html          e.g. Introduction to AI, Inside the LLM
        └── Lesson   modules/<module>/<lesson>.html    e.g. What we mean by AI
            └── Step    (a section inside a lesson page)
                ├── Main         always present
                ├── Try it       optional, an interactive exercise
                ├── Go deeper    optional, collapsed
                └── Check yourself   optional, collapsed
```

A module can be placed in more than one course. Course pages link into modules with `?from=<course-id>`, which gives the module a "back to course" link in its header.

### Repository layout

```
index.html                       library home
assets/css/site.css              all shared styling
assets/js/site.js                shared behaviour: lesson renderer, sidebar, present mode
courses/<course>/index.html      one landing page per course
modules/<module>/index.html      module home with the lesson map
modules/<module>/<lesson>.html   one page per lesson
modules/<module>/js/<name>.js    module helpers: lesson list and reusable exercises
README.md
DESIGN.md                        this file
```

## 4. The four parts of a step

| Part | Shown as | Present when | In present mode |
|---|---|---|---|
| **Main** | the step itself, no label | always | its own screen |
| **Try it** | block labelled "Try it" | step has an exercise | its own screen |
| **Go deeper** | collapsed panel | it has content | not shown |
| **Check yourself** | collapsed panel | it has content | not shown |

- **Main** carries the teaching: short text, a picture, a table or a visualization. It never needs scrolling at projector size.
- **Try it** is the exercise the room does together: a vote, a sorter, a matcher, a checklist, a click-to-reveal. It gets its own full screen so the room can see it.
- **Go deeper** is for students: the nuance, the source, the caveat. Anything that would crowd Main goes here.
- **Check yourself** is for students: a short quiz or a reflection prompt with feedback.

The names are defined once, in `LABELS` at the top of the lesson renderer in `site.js`. Change them there.

```js
const LABELS = { main: "Learn", try: "Try it", deep: "Go deeper", quiz: "Check yourself" };
```

"Learn" appears only in the present-mode counter. The page itself shows no label for Main.

## 5. Writing a lesson

A lesson page is a thin shell plus a block of data. The shell is the same for every lesson:

```html
<header id="site-head"></header>
<main class="col" id="lesson"></main>
<nav id="pager"></nav>
<script src="../../assets/js/site.js"></script><script src="js/ait.js"></script>
<script>
lesson({ ... });
chrome(2);          // zero-based index of this lesson in PAGES
</script>
```

`lesson()` must run before `chrome()`.

### The data

```js
lesson({
  title: "What AI can do",
  lede: "One or two sentences that set up the lesson.",
  learn: "<b>By the end you can</b> ...",      // optional outcomes box
  steps: [
    {
      title: "Six abilities",
      main: "<p>HTML, or a function(host), or a DOM node.</p>",
      interactive: host => { /* build the exercise inside host */ },
      deep: "<p>Extra reading.</p>",
      quiz: [["Question?", ["Right", "Wrong", "Wrong"], 0, "Why the answer is right."]]
    }
  ]
});
```

- `main`, `interactive`, `deep` and `quiz` each accept an HTML string, a function that fills a host element, or a DOM node.
- `quiz` also accepts a list of `[question, options, answerIndex, explanation]`. Put the right answer anywhere in `options`; the helper shuffles nothing, so place it deliberately and vary the position.
- Leave a key out and that part does not appear.

### Reusable exercises (`modules/introduction-to-ai/js/ait.js`)

| Helper | Use |
|---|---|
| `votes(host)` | the five-item Yes / No / Unsure vote, saved in the browser |
| `nester(host, items)` | nested layers; click one to read its meaning |
| `flipRows(host, rows)` | rows that flip between "then" and "now" |
| `chooser(host, items, labelA, labelB)` | chips that reveal two boxes |
| `matcher(host, tasks, labels)` | one task at a time matched to a label, with a score |
| `oneByOne(host, items)` | one multiple-choice question at a time with a score and Start again |
| `checklist(host, items, goodMsg, badMsg)` | select-all with feedback |
| `sorter(host, items, labels)` | sort several items into labelled buckets, feedback per row, Clear answers (now in `site.js`) |
| `disc(text)` | a "Discuss" prompt box (now in `site.js`) |
| `quick(q, options, answer, why)` | one multiple-choice question with feedback (shared) |

Add new helpers to the module's helper file. Each takes a host element and builds into it, so any lesson can use it as `interactive: host => helper(host, ...)`.

### Rules for one step

- Main and Try it each have to fit one projected screen on their own. If a step does not, split it into two steps or move detail to Go deeper.
- Try it must work without the instructor, so students can use it too.
- Do not put the answer to an exercise in Main.
- Keep Check yourself honest: three options, one clearly right, the explanation teaches.

## 6. Present mode (classroom)

Each step's Main and Try it are "slides". The icon at the top right of a step, or of its Try it block, opens that slide full screen. Pressing **F** opens the first slide visible on the page.

| Key | Action |
|---|---|
| **→**, Page Down, clicker forward | next slide |
| **←**, Page Up, clicker back | previous slide |
| **Esc** or **F** | leave present mode |

- The order is Step 1 Main, Step 1 Try it, Step 2 Main, and so on. A step with no Try it has one slide.
- At the last slide of a lesson, → opens the next lesson's first slide. At the first slide, ← opens the previous lesson's last slide. At the end of the final lesson, → leaves present mode.
- The slide is scaled up to fill the screen (never below half size, never above 2.6 times). A step that is already crowded shrinks to fit, which is the signal to trim it.
- A small bar at the bottom shows the position, for example `Lesson 2 · Step 3 · Try it`, with previous, next and close buttons.
- Present mode shows the step label, the step title and the slide only. Go deeper and Check yourself are never part of it.
- Keys do nothing while focus is in a form field. Outside present mode the arrow keys scroll as in any website.

### How lesson-to-lesson movement works

When served over HTTP, the next lesson is fetched and swapped into the same page, so the browser stays in full screen. When the pages are opened straight from a file, the browser blocks that fetch, so a normal page load is used and the position is carried in the address (`#present-first` or `#present-last`). The browser always leaves its own full screen on a page load, and it returns on the next key press or click.

**For class:** serve the site, do not open files.

```
cd "<project folder>"
python3 -m http.server 8000      # then open http://localhost:8000
```

Or press the browser's own full-screen shortcut first (F11, or Ctrl+Cmd+F on a Mac).

## 7. Page chrome

Built by `chrome(i)` in `site.js`:

- **Header:** optional "back to course" link, "Lesson n of N", and an Open all / Close all toggle for the collapsed panels.
- **Left sidebar:** the module name, an "All courses" link, the lessons grouped by section, and, for the current lesson, its steps (taken from the `h2` titles, highlighted as you scroll).
- **Pager:** previous and next lesson, and the copyright line.
- **Home page:** `chrome(-1)` on the module's `index.html`.

### Module helper file

Each module has a helper file loaded after `site.js`. It must define, before `chrome()` runs:

```js
const COURSE_TITLE = "Introduction to AI";
const PAGES = [ ["file.html", "Lesson title", "Section name"], ... ];
const NPARTS = PAGES.length;
```

The third item in each entry groups lessons in the sidebar and the module map.

### Course registry

`COURSES` at the top of `site.js` maps a course id to its title. A module opened with `?from=<id>` remembers the course for the visit and shows a back link.

## 8. Look and feel

- **Fonts:** Source Serif 4 for headings and quotes, IBM Plex Sans for text, IBM Plex Mono for small labels. Loaded from Google Fonts.
- **Colour:** CSS variables in `site.css` (`--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--accent`, `--good`, `--bad` and their soft variants), with a dark-mode set. Use the variables; do not hard-code colours.
- **Accent** marks the step label and the Check yourself panel. **Green** marks Go deeper and correct answers. **Red tint** marks wrong answers.
- **Layout:** a single reading column; a left sidebar on wide screens that collapses on narrow ones.
- The normal page uses ordinary text sizes. Only present mode enlarges content, by scaling.

## 9. Saved data

Stored in the browser only (`localStorage`), never sent anywhere.

| Key | What |
|---|---|
| `intro-ai-votes-v1` | the Lesson 1 vote, read again in the wrap-up |

Course memory for the back link uses `sessionStorage`. All reads and writes are wrapped so the site still works if storage is blocked.

## 10. Adding things

**A lesson.** Copy an existing converted lesson, change the title and steps, add it to `PAGES` in the module helper file, and set the `chrome(n)` index to its position. Update the module `index.html` description list so the module map has a line for it.

**An exercise.** Write a helper that takes a host and builds into it. Test it inside present mode as well as on the page.

**A module.** New folder under `modules/` with an `index.html`, a helper file with `COURSE_TITLE`, `PAGES` and `NPARTS`, and its lessons. Link it from a course page.

**A course.** New folder under `courses/` with an `index.html`. Add its id and title to `COURSES`. Link modules with `?from=<id>`.

## 11. Checks before saving a lesson

1. Opens with no errors in the browser console.
2. Every Main and Try it screen fits one screen in present mode at 1280×720 and at 1920×1080, and none shrinks below normal size.
3. → and ← walk every slide in order, across lesson boundaries, and Esc leaves cleanly with nothing left over the page.
4. Every Try it works from a fresh load, and again after reloading.
5. Parts with no content do not appear. Go deeper and Check yourself open and close, and Open all works.
6. Wording follows section 2: no times, no speaker notes, "Lesson" not "Part", copyright line present.
7. Looks right at phone width and in dark mode.

## 12. Status

| Area | State |
|---|---|
| Introduction to AI, Lessons 1 to 8 | all converted to the four-part step layout, with present mode |
| Inside the LLM, Lesson 3 "Model development" (`training.html`) | converted: 13 steps in three stages (build the base model; fine-tune and polish; package as a product), with present mode |
| Inside the LLM, Lesson 4 "Model usage" (`inference.html`) | converted: 13 steps in three stages (prepare the input; the model generates; deliver the output), with present mode |
| Inside the LLM, Lesson 5 "Context" (`context-attention.html`) | converted: 8 steps, with the context picture (layers colour-coded by who supplies them) and present mode |
| Inside the LLM, Lesson 6 "What LLMs are used for" (`llm-uses.html`) | converted: 11 steps in four stages (one skill; work on text; answer and create; reason and act), then matching checking to the task and a wrap-up. Each use has a Try it demo, with its token-odds panel in Go deeper |
| Inside the LLM, Lesson 7 "Limits and risks" (`limits-risks.html`) | converted: 7 steps in three stages (wrong answers; unfair and exposed; using it safely), including a new step on prompt injection and agents; present mode |
| Inside the LLM, other lessons | earlier layout; share `site.js`, so they show "Lesson" in the header and sidebar, but have no present mode |
| AI for Marketing course page | live; lists Inside the LLM |

### Notes added with the Model development lesson

- A step can carry a `stage` field. It prefixes the step label ("Stage 1 · Step 3 of 13") and the present-mode label.
- Every exercise that records an answer has a way back: Clear answers, Try again or Start again.
- Review history and settled facts are in `FACTCHECK.md`; read it before a content review.

## 13. Decided later

- **Hosting.** GitHub Pages or S3 with CloudFront; custom domain.
- **Class access.** A static site cannot truly hide pages. A hard-to-guess class code in the address gives light separation; real restriction needs a server-side check at the edge (for example a CloudFront Function). The repository is currently public.
- **A move to React or Vite** would not hide the content: bundled code is readable by anyone who can load the page.
- Optional: a text-size control for projectors, and an authoring outline page that shows which parts each step has.
