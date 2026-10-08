# Web Pages

A growing library of interactive teaching pages. Everything is plain HTML, CSS and JavaScript, so it can be opened locally or published with GitHub Pages (or any static host).

## Layout

```
index.html                 Library home: lists every course
assets/
  css/site.css             Shared styles for all modules and courses
  js/site.js               Shared helpers, sidebar and page chrome
courses/
  ai-for-marketing/        A course: an ordered list of modules
    index.html             Course landing page
modules/
  introduction-to-ai/      Module 1: what AI is and how it works
  inside-the-llm/          Module 2: how LLMs work, for MBA students
    index.html             Module home and map
    *.html                 One page per part
    js/                    Module-specific scripts
```

A module is written once and can be used by several courses. A course is a landing page that links to its modules.

## Add a module

1. Copy `modules/inside-the-llm/` to `modules/your-module-name/`.
2. Edit `js/llm.js`: set `COURSE_TITLE` and `PAGES`.

## Add a course

1. Copy `courses/ai-for-marketing/` to `courses/your-course-name/` and edit its text and module links.
2. Link each module as `../../modules/<module>/index.html?from=<course-name>`.
3. Add the course to `COURSES` in `assets/js/site.js` so modules can link back to it.
4. Add a card for it in the root `index.html`.

## Run locally

Open `index.html` in a browser. No build step is needed.

## Notes

- The shared class-answers wall in Part 1 only works on the hosted Claude version. Elsewhere, each person sees their own answers only.
- Pages use relative links, so keep the folder structure as it is.
