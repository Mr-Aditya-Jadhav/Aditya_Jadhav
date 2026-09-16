# Aditya Nivrutti Jadhav — Portfolio

Premium personal portfolio website for a  Software & AI Engineer.

## 🚀 Live on GitHub Pages

Push to `main` → GitHub Pages serves `index.html` from the repo root.

**Steps to deploy:**
```bash
git add .
git commit -m "feat: add portfolio website"
git push origin main
```

Then go to **Settings → Pages → Source → Deploy from branch → main / (root)** and save.

Your site will be live at:
`https://<your-github-username>.github.io/<repo-name>/`

## 📁 Structure

```
My_site/
├── index.html              ← Main page (single file, no build step)
├── css/styles.css          ← Full design system
├── js/main.js              ← Interactions, canvas, typewriter, counters
├── images/
│   └── Aditya.jpeg.png     ← Your professional photo
├── assets/
│   └── Aditya_Nivrutti_Jadhav_Resume.pdf
├── manifest.json           ← PWA manifest
├── sw.js                   ← Service worker (offline support)
└── .nojekyll               ← Disables Jekyll processing on GitHub Pages
```

## ✨ Features

- **Zero build step** — pure HTML/CSS/JS, deploys by pushing
- Three.js particle field hero background
- Typewriter role animation
- Scroll-triggered reveals + GSAP animations
- Lenis smooth scrolling
- Custom cursor with pointer tracking
- Skill bars animated on scroll
- Counter animation on scroll
- Interactive project filtering (All / AI / OTA / Research)
- Testimonial carousel with auto-advance + touch swipe
- Contact form with validation
- Dark / Light theme toggle (persisted)
- PWA (offline support via service worker)
- SEO: meta, OG tags, JSON-LD structured data
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

## 📧 Contact Form

Currently simulates a send (2 s delay). To make it real, replace the `await new Promise(…)` block in `js/main.js → initContactForm()` with a call to:
- [Formspree](https://formspree.io) — free tier, 50 submissions/month
- [EmailJS](https://www.emailjs.com) — free tier, 200 emails/month
- Your own API endpoint
