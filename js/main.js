/* ============================================================
   Aditya Nivrutti Jadhav — Portfolio · main.js
   Vanilla JS: preloader, cursor, nav, typewriter, Three.js
   particles, scroll reveals, counters, skill bars, carousel,
   project filters, contact form, GSAP ScrollTrigger.
   ============================================================ */
"use strict";

/* ── utils ──────────────────────────────────────────────── */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const on = (el, ev, fn, opts) => el?.addEventListener(ev, fn, opts);
const raf = requestAnimationFrame;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;

/* ── preloader ──────────────────────────────────────────── */
(function initPreloader() {
  const pl = $('#preloader');
  const bar = $('.pl-bar span', pl);
  const txt = $('.pl-text', pl);
  if (!pl) return;

  const msgs = ['Initialising systems…', 'Loading assets…', 'Compiling experience…', 'Ready.'];
  let pct = 0, mi = 0;

  const tick = () => {
    pct = Math.min(pct + Math.random() * 9 + 3, 100);
    if (bar) bar.style.width = pct + '%';
    if (txt && mi < msgs.length && pct > mi * 28) { txt.textContent = msgs[mi++]; }
    if (pct < 100) setTimeout(tick, 60 + Math.random() * 60);
    else {
      setTimeout(() => {
        pl.classList.add('done');
        document.body.style.overflow = '';
        initAll();
      }, 380);
    }
  };
  document.body.style.overflow = 'hidden';
  setTimeout(tick, 200);
})();

/* ── theme ──────────────────────────────────────────────── */
(function initTheme() {
  const btn = $('#theme-toggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  const mq = window.matchMedia('(prefers-color-scheme: light)');

  const apply = (t) => {
    if (t === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    localStorage.setItem('theme', t);
  };

  apply(saved || (mq.matches ? 'light' : 'dark'));
  on(btn, 'click', () => {
    apply(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });
})();

/* ── main init (called after preloader) ─────────────────── */
function initAll() {
  initLenis();
  initNav();
  initHeroCanvas();
  initTypewriter();
  initParallax();
  initReveal();
  initSkillBars();
  initCounters();
  initTimeline();
  initProjectFilters();
  initCarousel();
  initContactForm();
  initProgress();
  initToTop();
  initCardSpotlight();
  initHero3D();
}

/* ── Lenis smooth scroll ────────────────────────────────── */
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, infinite: false });
  const raf2 = (t) => { lenis.raf(t); requestAnimationFrame(raf2); };
  requestAnimationFrame(raf2);
  window._lenis = lenis;

  // GSAP ScrollTrigger integration
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}

/* ── custom cursor ──────────────────────────────────────── */
function initCursor() {
  const dot = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  on(document, 'mousemove', e => { mx = e.clientX; my = e.clientY; });

  const loop = () => {
    rx = lerp(rx, mx, 0.17);
    ry = lerp(ry, my, 0.17);
    dot.style.transform = `translate(${mx - 3}px,${my - 3}px)`;
    ring.style.transform = `translate(${rx - 17}px,${ry - 17}px)`;
    raf(loop);
  };
  raf(loop);

  const hot = $$('a,button,[data-cursor]');
  hot.forEach(el => {
    on(el, 'mouseenter', () => ring.classList.add('hot'));
    on(el, 'mouseleave', () => ring.classList.remove('hot'));
  });
}

/* ── navigation ─────────────────────────────────────────── */
function initNav() {
  const nav = $('.nav');
  const toggle = $('#nav-toggle');
  const drawer = $('#drawer');
  if (!nav) return;

  // Sticky style
  const onScroll = () => {
    nav.classList.toggle('stuck', window.scrollY > 10);
  };
  on(window, 'scroll', onScroll, { passive: true });
  onScroll();

  // Mobile drawer
  on(toggle, 'click', () => {
    const open = drawer.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close drawer on link click
  $$('#drawer nav a').forEach(a => {
    on(a, 'click', () => {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active link tracking
  const sections = $$('section[id]');
  const links = $$('.nav-links a, #drawer nav a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => observer.observe(s));
}

/* ── Three.js particle field (hero bg) ─────────────────── */
function initHeroCanvas() {
  const canvas = $('#hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = window.innerWidth, H = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
  camera.position.z = 55;

  // Particles
  const N = 2400;
  const pos = new Float32Array(N * 3);
  const sizes = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 200;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 160;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    sizes[i] = Math.random() * 2.2 + 0.5;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    color: 0x22d3ee,
    size: 0.55,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });

  // Connection lines geometry (recomputed each frame for a subset)
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Subtle grid lines
  const gridMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, opacity: 0.07, transparent: true });
  for (let i = -7; i <= 7; i++) {
    const geoH = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-80, i * 10, -10), new THREE.Vector3(80, i * 10, -10)
    ]);
    const geoV = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(i * 11, -60, -10), new THREE.Vector3(i * 11, 60, -10)
    ]);
    scene.add(new THREE.Line(geoH, gridMat));
    scene.add(new THREE.Line(geoV, gridMat));
  }

  let mx = 0, my = 0;
  on(document, 'mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  on(window, 'resize', () => {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  let t = 0;
  const animate = () => {
    t += 0.003;
    particles.rotation.y = t * 0.12 + mx * 0.06;
    particles.rotation.x = t * 0.06 + my * 0.04;
    // Gentle float
    const positions = geo.attributes.position.array;
    for (let i = 0; i < N; i++) {
      positions[i * 3 + 1] += Math.sin(t + i * 0.3) * 0.003;
    }
    geo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
    raf(animate);
  };
  animate();
}

/* ── hero 3D tilt on portrait ───────────────────────────── */
function initHero3D() {
  const frame = $('.portrait-frame');
  const portrait = $('.hero-portrait');
  if (!portrait || !frame) return;

  on(portrait, 'mousemove', e => {
    const r = portrait.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    frame.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) scale(1.03)`;
  });
  on(portrait, 'mouseleave', () => {
    frame.style.transform = '';
  });
}

/* ── typewriter ─────────────────────────────────────────── */
function initTypewriter() {
  const el = $('.hero-role');
  if (!el) return;

  const roles = [
   'Java Software Developer'
     'Global xOTA Enginner',
    'Platform & Backend Engineer',
    'AI / LLM Integration Engineer',
    'Cloud-Native Developer · AWS',
  ];

  let ri = 0, ci = 0, deleting = false;
  const textSpan = $('.tw-text', el);
  if (!textSpan) return;

  const type = () => {
    const word = roles[ri % roles.length];
    if (deleting) {
      ci--;
      textSpan.textContent = word.slice(0, ci);
      if (ci <= 0) { deleting = false; ri++; setTimeout(type, 520); return; }
      setTimeout(type, 42);
    } else {
      ci++;
      textSpan.textContent = word.slice(0, ci);
      if (ci >= word.length) { deleting = true; setTimeout(type, 2200); return; }
      setTimeout(type, 68 + Math.random() * 40);
    }
  };
  setTimeout(type, 900);
}

/* ── parallax ───────────────────────────────────────────── */
function initParallax() {
  const auras = $$('.aura[data-speed]');
  if (!auras.length) return;
  let scrollY = 0;
  on(window, 'scroll', () => { scrollY = window.scrollY; }, { passive: true });
  const tick = () => {
    auras.forEach(a => {
      const speed = parseFloat(a.dataset.speed) || 0.2;
      a.style.transform = `translateY(${scrollY * speed}px)`;
    });
    raf(tick);
  };
  raf(tick);
}

/* ── scroll reveal ──────────────────────────────────────── */
function initReveal() {
  const els = $$('.reveal');
  if (!els.length) return;

  const revealEl = (el) => el.classList.add('in');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        revealEl(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

  els.forEach(el => io.observe(el));

  // Hard fallback: reveal everything 1.2 s after init in case the
  // observer never fires (Lenis timing, hidden tabs, reduced-motion, etc.)
  setTimeout(() => els.forEach(revealEl), 1200);
}

/* ── skill bars ─────────────────────────────────────────── */
function initSkillBars() {
  const bars = $$('.bar-fill');
  if (!bars.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target;
        fill.style.width = fill.dataset.pct + '%';
        io.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => io.observe(b));
}

/* ── counters ───────────────────────────────────────────── */
function initCounters() {
  const nums = $$('.counter .num[data-to]');
  if (!nums.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const to = parseFloat(el.dataset.to);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dec = el.dataset.dec ? parseInt(el.dataset.dec) : 0;
      const duration = 1800;
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (to * ease).toFixed(dec) + suffix;
        if (p < 1) raf(step);
      };
      raf(step);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  nums.forEach(n => io.observe(n));
}

/* ── XP timeline progress bar ───────────────────────────── */
function initTimeline() {
  const prog = $('.xp-progress');
  if (!prog) return;
  const xp = $('.xp');
  if (!xp) return;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      prog.style.height = (xp.scrollHeight - 24) + 'px';
    }
  }, { threshold: 0.05 });
  io.observe(xp);
}

/* ── project filters ────────────────────────────────────── */
function initProjectFilters() {
  const btns = $$('.filter');
  const cards = $$('.proj');
  if (!btns.length) return;

  btns.forEach(btn => {
    on(btn, 'click', () => {
      btns.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const tags = card.dataset.tags || '';
        const show = filter === 'all' || tags.includes(filter);
        card.classList.toggle('hide', !show);
      });
    });
  });
}

/* ── testimonial carousel ───────────────────────────────── */
function initCarousel() {
  const track = $('.carousel-track');
  const dots = $$('.carousel-dots button');
  const prev = $('#car-prev');
  const next = $('#car-next');
  if (!track) return;

  const cards = $$('.quote', track);
  let cur = 0;
  const total = cards.length;

  const cardW = () => cards[0]?.getBoundingClientRect().width + 18 || 0;

  const go = (i) => {
    cur = ((i % total) + total) % total;
    track.style.transform = `translateX(-${cur * cardW()}px)`;
    dots.forEach((d, j) => d.setAttribute('aria-current', j === cur ? 'true' : 'false'));
  };

  on(prev, 'click', () => go(cur - 1));
  on(next, 'click', () => go(cur + 1));
  dots.forEach((d, i) => on(d, 'click', () => go(i)));

  // Auto-advance
  let timer = setInterval(() => go(cur + 1), 5400);
  const pause = () => clearInterval(timer);
  const resume = () => { timer = setInterval(() => go(cur + 1), 5400); };
  on(track.parentElement, 'mouseenter', pause);
  on(track.parentElement, 'mouseleave', resume);

  // Touch swipe
  let tx = 0;
  on(track, 'touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  on(track, 'touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 44) go(dx < 0 ? cur + 1 : cur - 1);
  });

  on(window, 'resize', () => go(cur));
}

/* ── contact form ───────────────────────────────────────── */
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;
  const status = $('.form-status', form.parentElement) || $('.form-status');

  const validate = (field) => {
    const inp = field.querySelector('input,textarea');
    if (!inp) return true;
    const ok = inp.checkValidity() && inp.value.trim() !== '';
    field.classList.toggle('invalid', !ok);
    return ok;
  };

  on(form, 'submit', async (e) => {
    e.preventDefault();
    const fields = $$('.field[data-req]', form);
    const valid = fields.map(validate).every(Boolean);
    if (!valid) return;

    const btn = form.querySelector('[type=submit]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Sending…';
    btn.disabled = true;

    // Simulate send (replace with a real endpoint / Formspree / EmailJS)
    await new Promise(r => setTimeout(r, 1800));

    if (status) {
      status.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Message sent! I'll get back to you within 24 hours.`;
      status.classList.add('show');
    }
    form.reset();
    btn.innerHTML = orig;
    btn.disabled = false;
  });

  // Live validate on blur
  $$('.field[data-req] input, .field[data-req] textarea', form).forEach(inp => {
    on(inp, 'blur', () => validate(inp.closest('.field')));
    on(inp, 'input', () => inp.closest('.field').classList.remove('invalid'));
  });
}

/* ── scroll progress bar ────────────────────────────────── */
function initProgress() {
  const bar = $('#progress');
  if (!bar) return;
  on(window, 'scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${window.scrollY / max})`;
  }, { passive: true });
}

/* ── to-top button ──────────────────────────────────────── */
function initToTop() {
  const btn = $('#to-top');
  if (!btn) return;
  on(window, 'scroll', () => btn.classList.toggle('show', window.scrollY > 480), { passive: true });
  on(btn, 'click', () => {
    if (window._lenis) window._lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── card pointer spotlight ─────────────────────────────── */
function initCardSpotlight() {
  $$('.spot').forEach(card => {
    on(card, 'mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* ── GSAP entrance animations (if GSAP loaded) ──────────── */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  document.addEventListener('DOMContentLoaded', () => {
    gsap.from('.xp-card', {
      scrollTrigger: { trigger: '.xp', start: 'top 78%', scrub: 0.5 },
      x: -22, opacity: 0, stagger: 0.14, ease: 'power2.out',
    });
  });
}
