# Who Gets Warned? — PLS419 website prototype

A responsive static research website for *Who Gets Warned? AI-Assisted Flood Warnings in Northern Kazakhstan*.

## View it

Open `index.html` in any browser, or use a local web server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish to GitHub Pages

1. Create a public GitHub repository, e.g., `who-gets-warned`.
2. Upload all files and folders from **inside** this folder to the repository root.
3. Go to **Settings → Pages**, select **Deploy from a branch**, **main** and **/(root)**, and save.
4. Open the URL supplied by GitHub Pages. Verify that sections, chart, buttons and references work on mobile and desktop.

An alternative for a quick preview is to drag the whole folder into a static-hosting provider that supports folder deployment.

## What is implemented

- Mobile-responsive editorial design, accessible navigation and reading-progress indicator.
- Four core rubric sections, research question, methods appendix and conditional policy verdict.
- Original interactive chart of five actual emergency-ministry reports, with data CSV and source links.
- Seven linked academic starting points; international case studies; five cost dimensions.
- Interactive *illustrative*, multilingual warning-channel comparison; explicitly not a real emergency alert.

## Important academic caveats

This is a **research prototype and substantive first draft**, not a fully verified final submission. The project needs the student's own intellectual review, professor's word-count check (target approximately 3,200–3,600 words in the four academic sections), and a properly justified Kazakhstan-specific cost estimate if reliable data can be obtained. The website intentionally does not claim there is measured unequal receipt of warnings in Petropavl. Its chart shows **national cumulative rescued-and-evacuated counts**, not flood-warning performance or Petropavl-specific evacuation totals.

The proposed ReachFirst KZ is conceptual: no model has been trained, no live forecasts are displayed, and no official alerts are issued. The interactive comparison illustrates features, not causal effects.

## Editing

- `index.html`: text, references, page sections.
- `styles.css`: layout, colors, typography and responsive design.
- `script.js`: line chart, language selection and scenario toggles.
- `data/official-flood-updates-april-2024.csv`: verified source values. Keep this in sync with chart values if edited.
- `assets/favicon.svg`: site icon.

No build process or JavaScript package installation is needed. Google Fonts requires internet but the page has system-font fallbacks.
