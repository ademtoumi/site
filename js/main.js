/* ==========================================================
   ADEM TOUMI — FLAGSHIP ENGINEERING PORTFOLIO
   main.js
   ========================================================== */

'use strict';

/* ----------------------------------------------------------
   DOM REFERENCES
   ---------------------------------------------------------- */
const header       = document.getElementById('header');
const navMenu      = document.getElementById('navMenu');
const hamburger    = document.getElementById('hamburger');
const themeBtn     = document.getElementById('themeToggle');
const backToTop    = document.getElementById('backToTop');
const typedEl      = document.getElementById('typedText');
const navLinks     = document.querySelectorAll('.nav-link');
const fadeEls      = document.querySelectorAll('.fade-in');
const contactForm  = document.getElementById('contactForm');
const formAlertOk  = document.getElementById('formAlertSuccess');
const formAlertErr = document.getElementById('formAlertError');

/* Modal DOM Elements */
const modalBackdrop = document.getElementById('modalBackdrop');
const modalTitle    = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const modalBody     = document.getElementById('modalBody');
const modalFooter   = document.getElementById('modalFooter');
const modalCloseBtn = document.getElementById('modalCloseBtn');


/* ----------------------------------------------------------
   THEME — persist across sessions, respect OS preference
   ---------------------------------------------------------- */
const THEME_KEY = 'at-theme';

(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const osPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', saved || osPref);
})();

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
  });
}


/* ----------------------------------------------------------
   MOBILE NAVIGATION
   ---------------------------------------------------------- */
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      closeMenu();
    }
  });
}

function closeMenu() {
  if (navMenu && hamburger) {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
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

  if (header) header.classList.toggle('scrolled', scrollY > 12);
  if (backToTop) backToTop.classList.toggle('visible', scrollY > 450);

  let current = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop - 120) {
      current = sec.id;
    }
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = href.replace('#', '');
      link.classList.toggle('active', target === current);
    }
  });

  ticking = false;
}

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ----------------------------------------------------------
   SCROLL-REVEAL (IntersectionObserver)
   ---------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
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
   CASE STUDY DATA & MODAL LOGIC
   Strictly grounded in all_works workspace files
   ---------------------------------------------------------- */
const CASE_STUDIES = {
  logAnomaly: {
    title: "Log-Based Anomaly Detection in Distributed Systems",
    subtitle: "Dual Graduation Thesis (State Engineer & M.Sc.) — ESI-SBA (2025–2026)",
    body: `
      <h4>1. Problem & Context</h4>
      <p>Distributed infrastructure across HDFS, BGL, and Spirit supercomputing clusters generates high-velocity log streams. Detecting system failures requires automated log parsing, real-time ingestion pipelines, and interpretable model predictions for system operators.</p>
      
      <h4>2. Pipeline Design & Engineering Implementation</h4>
      <ul>
        <li><strong>Log Parsing & Windowing:</strong> Raw log streams are parsed using the Drain log parser to extract structured templates. Log entries are grouped into sessions using BlockID grouping (HDFS) and sliding temporal windows (BGL/Spirit) with strict temporal train/test splitting to prevent data leakage.</li>
        <li><strong>Real-Time Data Streaming:</strong> Apache Kafka streams log vectors continuously to downstream classification pipelines.</li>
        <li><strong>Model Benchmark:</strong> Evaluated 11 machine learning and deep learning architectures, including Logistic Regression, SVM, Decision Tree, Random Forest, KNN, Naive Bayes, MLP, LSTM, BiLSTM, Attention-BiLSTM, Autoencoders, and LogBERT.</li>
        <li><strong>Explainable AI (XAI):</strong> Integrated SHAP and LIME post-hoc interpretability models to calculate token-level attribution scores for every flagged anomaly.</li>
        <li><strong>Analytics & Visualization:</strong> Log predictions and confidence metrics persist to PostgreSQL and render on an interactive Streamlit monitoring dashboard.</li>
      </ul>

      <h4>3. Key Benchmark Results</h4>
      <ul>
        <li><strong>HDFS Supervised Peak F1:</strong> 0.9958 (Attention-BiLSTM)</li>
        <li><strong>HDFS Unsupervised Peak F1:</strong> 0.9571 (BiLSTM Autoencoder)</li>
        <li><strong>BGL & Spirit Performance:</strong> 0.997–0.999 F1 score across classical ML baseline classifiers.</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/log-anomaly-detection",
    report: "https://github.com/ademtoumi/log-anomaly-detection/blob/main/Engineer_Thesis.pdf",
    masterReport: "https://github.com/ademtoumi/log-anomaly-detection/blob/main/Master_Thesis.pdf"
  },

  knowledgeHub: {
    title: "KnowledgeHub AI — Enterprise RAG Platform",
    subtitle: "Retrieval-Augmented Generation, Hybrid Search & Explainable AI — ESI-SBA (2026)",
    body: `
      <h4>1. Problem & Context</h4>
      <p>Enterprise documentation (.pdf, .md, .txt) is often difficult to search using keyword queries, while ungrounded LLMs produce inaccurate answers. KnowledgeHub AI provides accurate document search and citation-backed answer synthesis.</p>

      <h4>2. Technical Architecture & Tech Stack</h4>
      <ul>
        <li><strong>Document Ingestion:</strong> Ingests documents with PyMuPDF and recursively splits text into 500-token chunks with 50-token overlap.</li>
        <li><strong>Hybrid Retrieval Engine:</strong> Combines dense vector search (FAISS + all-MiniLM-L6-v2 embeddings) with sparse keyword matching (Okapi BM25) using score fusion ($\alpha=0.6$).</li>
        <li><strong>Cross-Encoder Reranking:</strong> Re-scores candidate passages using joint query-context self-attention (ms-marco-TinyBERT-L-2-v2) on CPU.</li>
        <li><strong>Grounded LLM Synthesis:</strong> Passes reranked passages to Google Gemini Flash with factual constraints enforcing answers derived strictly from retrieved context.</li>
        <li><strong>Stack:</strong> FastAPI REST API backend, React 18 + Vite frontend, TanStack Query, Docker Compose containerization.</li>
      </ul>

      <h4>3. Benchmark Performance</h4>
      <ul>
        <li><strong>Hit Rate @ K=4:</strong> 94.1%</li>
        <li><strong>Mean Reciprocal Rank (MRR):</strong> 0.9412</li>
        <li><strong>Average Latency:</strong> 621.4 ms</li>
        <li><strong>Test Coverage:</strong> 116 passing unit and integration tests</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/KnowledgeHub-AI"
  },

  uavDetection: {
    title: "Real-Time Multi-Object Detection & Tracking for UAV Surveillance",
    subtitle: "Research Internship — URD Laboratory (Feb. 2025 – Jun. 2025)",
    body: `
      <h4>1. Problem & Context</h4>
      <p>Aerial drone video streams involve camera platform motion, scale variations, and small target sizes. This project developed a real-time object detection and target tracking system for UAV surveillance.</p>

      <h4>2. System Design & Implementation</h4>
      <ul>
        <li><strong>Object Detection:</strong> Trained YOLOv11s and YOLOv8 models on VisDrone and custom vehicle datasets (mAP@0.5 ≈ 0.85).</li>
        <li><strong>Target Tracking:</strong> Integrated DeepSort for multi-object tracking and OpenCV CSRT for single-target tracking during occlusion.</li>
        <li><strong>Edge Hardware Acceleration:</strong> Deployed model inference on Raspberry Pi 5 hardware accelerated by an Intel Movidius Neural Compute Stick 2 (NCS 2).</li>
        <li><strong>UDP Streaming & Gimbal Control:</strong> Implemented a custom UDP video streaming protocol between drone hardware and Ground Control Station PC. Gimbal control logic calculates target pixel offsets from frame center to issue pan/tilt commands.</li>
        <li><strong>Operator Interface:</strong> Built a Tkinter Ground Control Station UI with live video feed, click-to-track target selection, and telemetry overlays.</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/UAV-Object-Detection-Tracking"
  },

  maliciousUrl: {
    title: "Multi-Class Malicious URL Detection via Hybrid Feature Engineering",
    subtitle: "Cybersecurity Machine Learning System — ESI-SBA (2024–2025)",
    body: `
      <h4>1. Problem & Context</h4>
      <p>Content-based security scanners execute web page content, creating security risks and performance overhead. This system classifies malicious URLs directly from string metrics without executing web content.</p>

      <h4>2. Pipeline & Model Evaluation</h4>
      <ul>
        <li><strong>Feature Engineering:</strong> Extracted character n-grams (TF-IDF) alongside 18 lexical and structural URL metrics (length, entropy, subdomains, special character ratios, IP presence).</li>
        <li><strong>Classifiers:</strong> Evaluated Random Forest, XGBoost, and LightGBM across 651,191 URLs (4 classes: benign, phishing, malware, defacement).</li>
        <li><strong>Results:</strong> Achieved 96.8% Macro F1 Score with sub-millisecond evaluation latency per URL.</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/Malicious-URL-Detection",
    report: "https://github.com/ademtoumi/Malicious-URL-Detection/blob/main/report.pdf"
  },

  paraphrase: {
    title: "Paraphrase Detection via Siamese Attention Deep Learning",
    subtitle: "NLP Semantic Similarity Model — ESI-SBA (2024–2025)",
    body: `
      <h4>1. Problem & Context</h4>
      <p>Lexical matching fails when sentence pairs express identical meaning using different vocabulary. This project built a deep learning model to evaluate sentence-level paraphrase similarity.</p>

      <h4>2. Architecture & Training</h4>
      <ul>
        <li><strong>Siamese Neural Network:</strong> Dual-branch Bi-LSTM architecture sharing weights to project sentence pairs into a shared semantic latent space.</li>
        <li><strong>Multi-Head Attention:</strong> 4-head attention mechanism highlights contextual token relationships.</li>
        <li><strong>Training:</strong> Optimized using Focal Loss on PAWS and QQP datasets (≈450,000 sentence pairs).</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/Paraphrase-Detection"
  },

  hajjPortal: {
    title: "HajjPortal — Trilingual Pilgrimage Management Platform",
    subtitle: "Full-Stack Web Platform — ESI-SBA (2023–2024)",
    body: `
      <h4>1. Problem & Context</h4>
      <p>Managing regional pilgrimage logistics requires multi-language accessibility, real-time lottery management, and administrative tracking.</p>

      <h4>2. Architecture & Tech Stack</h4>
      <ul>
        <li><strong>Frontend:</strong> Next.js 14 App Router, TypeScript, and Tailwind CSS.</li>
        <li><strong>Internationalization:</strong> Full Arabic, English, and French support with dynamic Right-to-Left (RTL) and Left-to-Right (LTR) layout switching.</li>
        <li><strong>Real-Time Updates:</strong> Socket.io WebSockets for live status updates and lottery drawings.</li>
        <li><strong>Validation:</strong> Input validation with Zod schemas and JWT authentication.</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/hajj-platform-frontend"
  },

  kidlink: {
    title: "KidLink — Cross-Platform School Communication App",
    subtitle: "Mobile Application — ESI-SBA (2022–2023)",
    body: `
      <h4>1. Problem & Context</h4>
      <p>Primary schools require a reliable mobile communication tool for announcements, attendance tracking, and parent-teacher messaging.</p>

      <h4>2. Architecture & Tech Stack</h4>
      <ul>
        <li><strong>Mobile App:</strong> Flutter & Dart using Provider for state management across Android and iOS.</li>
        <li><strong>Backend Services:</strong> Firebase Authentication, Cloud Firestore offline-first data synchronization, and Firebase Cloud Messaging (FCM) push notifications.</li>
        <li><strong>Workflows:</strong> 3 role-based user interfaces for parents, teachers, and administrators.</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/KidLink-App"
  }
};

function openCaseStudy(key) {
  const cs = CASE_STUDIES[key];
  if (!cs || !modalBackdrop) return;

  modalTitle.textContent = cs.title;
  modalSubtitle.textContent = cs.subtitle;
  modalBody.innerHTML = cs.body;

  let footerHTML = '';
  if (cs.github) {
    footerHTML += `<a href="${cs.github}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="padding:0.45rem 1rem;font-size:0.85rem;">GitHub Repo ↗</a>`;
  }
  if (cs.report) {
    footerHTML += `<a href="${cs.report}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding:0.45rem 1rem;font-size:0.85rem;">Engineering Thesis PDF ↗</a>`;
  }
  if (cs.masterReport) {
    footerHTML += `<a href="${cs.masterReport}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="padding:0.45rem 1rem;font-size:0.85rem;">Master's Thesis PDF ↗</a>`;
  }

  modalFooter.innerHTML = footerHTML || `<button onclick="closeCaseStudy()" class="btn btn-ghost">Close</button>`;

  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCaseStudy() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCaseStudy);
if (modalBackdrop) {
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeCaseStudy();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) {
    closeCaseStudy();
  }
});


/* ----------------------------------------------------------
   CONTACT FORM SUBMISSION HANDLER WITH ALERTS & FALLBACK
   ---------------------------------------------------------- */
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const nameVal    = document.getElementById('cName').value.trim();
    const emailVal   = document.getElementById('cEmail').value.trim();
    const subjectVal = document.getElementById('cSubject').value.trim() || 'Portfolio Contact';
    const msgVal     = document.getElementById('cMessage').value.trim();

    if (!nameVal || !emailVal || !msgVal) {
      showFormAlert('error', 'Please fill in all required fields (Name, Email, Message).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      showFormAlert('error', 'Please enter a valid email address.');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';

    try {
      const response = await fetch('https://formspree.io/f/xknlqbrb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: nameVal, email: emailVal, subject: subjectVal, message: msgVal })
      });

      if (response.ok) {
        showFormAlert('success', 'Thank you! Your message has been sent successfully. I will get back to you shortly.');
        contactForm.reset();
      } else {
        window.location.href = `mailto:a.toumi@esi-sba.dz?subject=${encodeURIComponent(subjectVal)}&body=${encodeURIComponent("From: " + nameVal + " (" + emailVal + ")\n\n" + msgVal)}`;
        showFormAlert('success', 'Opening your email client to send your message directly to a.toumi@esi-sba.dz');
      }
    } catch (err) {
      window.location.href = `mailto:a.toumi@esi-sba.dz?subject=${encodeURIComponent(subjectVal)}&body=${encodeURIComponent("From: " + nameVal + " (" + emailVal + ")\n\n" + msgVal)}`;
      showFormAlert('success', 'Opening your email client to send your message directly to a.toumi@esi-sba.dz');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

function showFormAlert(type, message) {
  if (formAlertOk) formAlertOk.style.display = 'none';
  if (formAlertErr) formAlertErr.style.display = 'none';

  if (type === 'success' && formAlertOk) {
    formAlertOk.querySelector('span').textContent = message;
    formAlertOk.style.display = 'flex';
  } else if (type === 'error' && formAlertErr) {
    formAlertErr.querySelector('span').textContent = message;
    formAlertErr.style.display = 'flex';
  }
}
