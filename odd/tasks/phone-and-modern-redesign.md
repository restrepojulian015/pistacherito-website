# Feature: phone update + performance optimization + modern redesign

Branch: `feat/phone-and-modern-redesign`

## Objective
Update WhatsApp contact number, optimize site performance, and give the site a more modern visual style without changing content or business flow (quote via WhatsApp, advisory form).

## Constraints
- Static HTML/CSS/JS site deployed on Vercel (`npm run build` copies files to `public/`).
- Keep brand identity (green/yellow palette, pistachio theme), all copy, all pages and links, the `/api/send-advisory` form.
- No framework migration. No test runner exists: checks are structural (grep, HTML sanity, local serve).

## Tasks
- [x] T1 — Replace phone 3144707571 → 3132035072 everywhere (route: inline, mechanical). Evidence: 0 old occurrences, 16 new. Commit `5c6ac9f`.
- [x] T2 — Performance: compress/resize images (target < 300 KB each, WebP where possible with fallback), compress videos, `loading="lazy"` + width/height on images, `preload="none"`/poster on videos, merge font requests + `preconnect`, defer scripts, fix build to include favicons. (route: delegated writer — multi-file)
  Evidence: commit `71b2956`. `matrial_piscaheritos` 69M (70504 KB) → 32M (32904 KB); all JPEGs resized to ≤1600px long edge (no upscaling) and recompressed at q78 via `sips` (largest image now 641 KB). No cwebp/ffmpeg available → no WebP; avconvert presets only shrink by dropping resolution below 480p, so videos (~23 MB) were left as-is (open follow-up: re-encode with ffmpeg). Lazy/async + width/height on all images, hero `fetchpriority="high"`, videos `preload` metadata/none, single Google Fonts request + preconnect, FA 6.5.2, `defer` script, meta description + favicons on all pages, build copies `'favicon (1)'` (verified by running build copy into a scratch dir: 7 favicon files).
- [x] T3 — Modern redesign: refreshed design tokens, typography scale, spacing, cards, buttons, header/nav, hero, footer, subtle motion with `prefers-reduced-motion`, responsive polish across all 6 pages. (route: delegated writer — multi-file)
  Evidence: styles.css rewritten (1901 → ~1160 lines, dead rules for unused classes removed), Fraunces + Inter, sticky blurred header with accessible `<button>` hamburger, card grid with centered last row, alternating variant layout on detail pages, dark green advisory section, multi-column footer. Fixed broken div nesting in ancheta-vintage.html and regalos-gourmet.html (HTML balance check: 0 errors on all 6 pages). script.js: null-guarded form (subpages previously threw), WhatsApp card handler scoped to `.product-card` so detail-page wa.me links stay native, removed parallax/body-fade/dead gallery, reveal via IntersectionObserver honoring reduced motion. Visual check via headless Chrome at 1280px and 360px (iframe harness); all pages + assets served 200 locally. Commit: see `git log` (style commit).

## Acceptance
- No old phone number remains.
- All pages render, links/WhatsApp CTAs work, no broken asset paths.
- Media weight substantially reduced (report before/after).
