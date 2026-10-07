# Web Pages

A growing library of interactive teaching pages. Everything is plain HTML, CSS and JavaScript, so it can be opened locally or published with GitHub Pages (or any static host).

## Layout

```
index.html                 Library home: lists every course
assets/
  css/site.css             Shared styles for all courses
  js/site.js               Shared helpers, sidebar and page chrome
courses/
  inside-the-llm/          Course 1: how LLMs work, for MBA students
    index.html             Course home and course map
    *.html                 One page per part
    js/                    Course-specific scripts
```

## Add a course

1. Copy `courses/inside-the-llm/` to `courses/your-course-name/`.
2. Edit `js/llm.js`: set `COURSE_TITLE` and `PAGES`.
3. Add a card for it in the root `index.html`.

## Run locally

Open `index.html` in a browser. No build step is needed.

## Notes

- The shared class-answers wall in Part 1 only works on the hosted Claude version. Elsewhere, each person sees their own answers only.
- Pages use relative links, so keep the folder structure as it is.
