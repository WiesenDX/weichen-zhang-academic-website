# Weichen Zhang Academic Portfolio

Responsive academic portfolio for Weichen Zhang, built as a static website.

## Preview

From this directory, run:

```bash
python3 -m http.server 4173 --directory dist
```

Then open `http://127.0.0.1:4173`.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes the contents of `dist/` whenever the `main` branch is updated. In the repository settings, select **GitHub Actions** as the Pages source.

## Structure

- `dist/index.html` — semantic page and SEO metadata
- `dist/styles-studio.css` — active visual system and responsive layouts
- `dist/styles-apple.css` and `dist/styles.css` — earlier themes retained as rollback layers
- `dist/data.js` — structured projects, publications, experience, and honors
- `dist/app.js` — component rendering and lightweight interactions
- `dist/assets` — CV and approved project assets
- `notes/MVP-brief.md` — positioning, information architecture, copy options, asset inventory, and next phases

The portfolio includes separate pages for research, publications, software and hardware development, selected projects, biography, experience, education, honors, and contact information.
