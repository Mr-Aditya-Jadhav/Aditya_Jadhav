# Aditya Nivrutti Jadhav — Portfolio

Personal portfolio site for an **Embedded Java Software Engineer** working on xOTA, ECU
flashing/reprogramming and UDS (ISO 14229) vehicle diagnostics for connected trucks and buses,
plus cloud delivery, release automation and private AI/LLM tooling.

Site content is kept in sync with the two source résumés in [assets/](assets/):

| File | Focus |
| --- | --- |
| `Aditya_s_Resume.Automotive.pdf` | xOTA, ECU flashing, UDS/diagnostics, SDV — drives the headline, skills and Daimler bullets |
| `Aditya_s_Resume General.pdf` | Broader Java / microservices / cloud / AI framing — drives the backend, cloud and AI sections |

The résumés are reference material only; they are **not** downloadable from the site.

## 📁 Structure

```text
My_site/
├── index.html              ← Main page (single file, no build step)
├── css/styles.css          ← Full design system
├── js/main.js              ← Interactions, canvas, typewriter, counters
├── images/
│   └── Aditya.jpeg.png     ← Professional photo
├── assets/                 ← Source résumés (reference only, not linked from the site)
│   ├── Aditya_s_Resume.Automotive.pdf
│   └── Aditya_s_Resume General.pdf
├── manifest.json           ← PWA manifest
├── sw.js                   ← Service worker (offline support)
└── .nojekyll               ← Disables Jekyll processing on GitHub Pages
```

## 📄 Page sections

`#hero` · `#about` · `#skills` · `#experience` · `#ai` · `#architecture` · `#certifications`
· `#achievements` · `#contact`

## ✨ Features

- **Zero build step** — pure HTML/CSS/JS, deploys by pushing
- Three.js particle field hero background
- Typewriter role animation
- Scroll-triggered reveals + GSAP animations
- Lenis smooth scrolling
- Skill bars animated on scroll
- Counter animation on scroll
- Hand-drawn SVG architecture diagrams (xOTA/FOTA flow, private RAG pipeline)
- Contact form with validation (submitted via a Cloudflare Worker)
- Dark / Light theme toggle (persisted)
- PWA (offline support via service worker)
- SEO: meta, OG tags, JSON-LD `Person` structured data
- Fully responsive (desktop → mobile)
- Keyboard accessible, ARIA labels throughout
- Scroll progress bar

## 🎨 Design Tokens (css/styles.css)

- **Accent cyan:** `#22d3ee`
- **Accent violet:** `#7c5cff`
- **Accent mint:** `#34d399`
- **Font Display:** Sora
- **Font Body:** Inter
- **Font Mono:** JetBrains Mono

## 🔄 Keeping the site in sync with the résumés

When either résumé changes, these are the places that carry résumé-derived content:

- `index.html` — `<title>`/meta/JSON-LD, nav brand, hero tagline, tech marquee, About copy +
  career timeline, skills cards, experience bullets + metrics, architecture captions,
  certifications/education, counters, footer tagline
- `js/main.js` — `initTypewriter()` role list
