# Aatish Chaudhary portfolio
Static site (HTML, CSS, vanilla JS) for GitHub Pages. No build step, no backend, no database. Upload every file, keeping the `assets/` folder next to the HTML pages. The custom domain is kept by the `CNAME` file.

## Files
- `assets/css/portfolio.css`: design system (black-and-white, separate light and dark themes, tokens at the top of the file).
- `assets/js/portfolio.js`: shared header/footer (edit `PAGES` to change the menu), theme toggle, Nepal clock, project filters, contact form.
- `assets/js/nepali-date.js`: Bikram Sambat (BS) date conversion data and function.
- `Aatish-Chaudhary-cv.pdf`: the CV linked from the home, résumé and contact pages. Replace the file (same name) to update the CV.
- `index-single-file.html`: the home page with CSS and JS inlined (convenience copy; regenerate it if you change the home page).

## Theme
Light/dark, saved in `localStorage` under `theme`, shared by every page, falls back to the system preference, and is applied by a tiny inline script in each `<head>` so the wrong theme does not flash.

## Nepal date and time (top bar)
- Time zone is `Asia/Kathmandu` (via `Intl.DateTimeFormat`), so it is correct whatever time zone the visitor's device uses. The clock re-reads the device clock every second; there are no network requests.
- The BS date is recomputed only when the Nepal calendar day changes. It uses a month-length lookup table, never a fixed year offset.
- Supported range: BS 2000-01-01 to 2086-12-30 (AD 1943-04-14 to 2030-04-13). Outside it the bar shows "उपलब्ध छैन" (unavailable) instead of a guessed date. The table agrees day by day with two independent MIT-licensed npm libraries (`nepali-date-converter`, `@remotemerge/nepali-date-converter`) in this range; for BS 2087 onward those libraries disagree with each other, so those dates are intentionally left out. Before AD 2030 extend `DATA`/`MAX_YEAR` from an official calendar source.
- If `nepali-date.js` fails to load, the time still works and the BS date shows as unavailable. No external library is loaded at run time.

## Projects
- Card data lives in `index.html` and `projects.html` (same markup). Filters on `projects.html` are built automatically from each card's `data-cat` and `data-tags`.
- To add a project: copy `project-aqi.html` (or `project-hotel-management-system.html`), edit the text, add a card in `index.html` and `projects.html`, and add the URL to `sitemap.xml` and `llms.txt`.
- **Hospital Management Software** has no verified details yet. When you have them (features, stack, screenshots, repo), fill `project-hospital-management-software.html` and its card, and replace the placeholder block with `<img class="proj" src="..." alt="...">`.
- **AQI** is based on the CV and the public repository `aatishchuadhary/indoor_air_quality_monitoring_system`. Add real screenshots the same way.
- Only list technologies and features you can stand behind; the "Documentation status" blocks say what is still missing.

## SEO
JSON-LD is in each page head; keep the FAQ on the home page in sync with its FAQPage JSON-LD. Update `lastmod` in `sitemap.xml` when pages change.

## Deploy (GitHub Pages)
Commit all files to the repository branch that Pages serves, keep `CNAME` (`aatishchaudhary.com.np`) in the root, and push. Optional external services: Google Fonts, Font Awesome (cdnjs), Google Analytics, Formspree (contact form) and the original Unsplash/raw.githubusercontent image URLs. The site still works if they are blocked.
