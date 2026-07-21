/* ==========================================================
   ADEM TOUMI — ACADEMIC PORTFOLIO
   main.js
   ========================================================== */

'use strict';

/* ----------------------------------------------------------
   DOM REFERENCES
   ---------------------------------------------------------- */
const header     = document.getElementById('header');
const navMenu    = document.getElementById('navMenu');
const hamburger  = document.getElementById('hamburger');
const themeBtn   = document.getElementById('themeToggle');
const backToTop  = document.getElementById('backToTop');
const typedEl    = document.getElementById('typedText');
const navLinks   = document.querySelectorAll('.nav-link');
const fadeEls    = document.querySelectorAll('.fade-in');


/* ----------------------------------------------------------
   THEME — persist across sessions, respect OS preference
   ---------------------------------------------------------- */
const THEME_KEY = 'at-theme';

(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const osPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', saved || osPref);
})();

themeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
});


/* ----------------------------------------------------------
   MOBILE NAVIGATION
   ---------------------------------------------------------- */
hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    closeMenu();
  }
});

function closeMenu() {
  navMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}


/* ----------------------------------------------------------
   SCROLL HANDLER — header border, nav active, back-to-top
   ---------------------------------------------------------- */
let ticking = false;
const sections = Array.from(document.querySelectorAll('section[id]'));

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
}, { passive: true });

function handleScroll() {
  const scrollY = window.scrollY;

  // Sticky header border
  header.classList.toggle('scrolled', scrollY > 12);

  // Back-to-top visibility
  backToTop.classList.toggle('visible', scrollY > 500);

  // Active nav link — find the deepest section the user has scrolled into
  let current = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop - 110) {
      current = sec.id;
    }
  });

  navLinks.forEach(link => {
    const target = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', target === current);
  });

  ticking = false;
}


/* ----------------------------------------------------------
   BACK TO TOP
   ---------------------------------------------------------- */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ----------------------------------------------------------
   SCROLL-REVEAL (IntersectionObserver)
   ---------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger items inside a grid so they cascade in
      const parent = entry.target.parentElement;
      if (parent && (parent.classList.contains('projects-grid') || parent.classList.contains('skills-grid') || parent.classList.contains('coursework-grid'))) {
        const siblings = Array.from(parent.querySelectorAll('.fade-in'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 75}ms`;
      }
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold:  0.08,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => revealObserver.observe(el));


/* ----------------------------------------------------------
   TYPING EFFECT (hero subtitle)
   ---------------------------------------------------------- */
const WORDS   = ['Engineer', 'Researcher', 'Builder'];
let wordIdx   = 0;
let charIdx   = 0;
let deleting  = false;
let typingTimer;

function type() {
  if (!typedEl) return;

  const word = WORDS[wordIdx];

  if (!deleting) {
    // Type forward
    typedEl.textContent = word.slice(0, charIdx + 1);
    charIdx++;

    if (charIdx === word.length) {
      // Pause before deleting
      typingTimer = setTimeout(() => {
        deleting = true;
        type();
      }, 2400);
      return;
    }
  } else {
    // Delete backward
    typedEl.textContent = word.slice(0, charIdx - 1);
    charIdx--;

    if (charIdx === 0) {
      deleting = false;
      wordIdx  = (wordIdx + 1) % WORDS.length;

      // Brief pause before typing next word
      typingTimer = setTimeout(type, 350);
      return;
    }
  }

  const speed = deleting ? 55 : 95;
  typingTimer = setTimeout(type, speed);
}

// Delay start until hero animation completes
setTimeout(type, 1100);


/* ----------------------------------------------------------
   SMOOTH SCROLL for anchor links (progressive enhancement)
   ---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id     = anchor.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});
