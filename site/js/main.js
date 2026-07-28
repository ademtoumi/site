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
   TYPING EFFECT (hero subtitle)
   Task 5 Fix: Complementing "AI & Data Science" with non-overlapping titles
   ---------------------------------------------------------- */
const WORDS   = ['Engineer', 'Architect', 'Specialist', 'Innovator'];
let wordIdx   = 0;
let charIdx   = 0;
let deleting  = false;
let typingTimer;

function type() {
  if (!typedEl) return;
  const word = WORDS[wordIdx];

  if (!deleting) {
    typedEl.textContent = word.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === word.length) {
      typingTimer = setTimeout(() => { deleting = true; type(); }, 2400);
      return;
    }
  } else {
    typedEl.textContent = word.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      wordIdx  = (wordIdx + 1) % WORDS.length;
      typingTimer = setTimeout(type, 350);
      return;
    }
  }
  const speed = deleting ? 50 : 90;
  typingTimer = setTimeout(type, speed);
}
setTimeout(type, 1000);


/* ----------------------------------------------------------
   ACADEMIC & PROFESSIONAL CASE STUDY DATA & MODAL LOGIC
   Task 6.2: Academic & Technical Deep-Dives from Project Files
   ---------------------------------------------------------- */
const CASE_STUDIES = {
  logAnomaly: {
    title: "Log-Based Anomaly Detection in Distributed Systems",
    subtitle: "Dual Graduation Thesis (State Engineer & M.Sc.) — ESI-SBA (2025–2026)",
    body: `
      <h4>1. Executive Overview & Problem Statement</h4>
      <p>Modern enterprise cloud platforms generate millions of log events per minute. Unstructured log entries contain vital signals regarding system health, security threats, and performance degradation. However, manual inspection is impossible, and traditional heuristic monitoring fails on complex distributed failures across HDFS, BGL, and Spirit supercomputing clusters.</p>
      
      <h4>2. System Architecture & Pipeline Design</h4>
      <p>The proposed framework establishes a real-time, streaming end-to-end processing pipeline:</p>
      <ul>
        <li><strong>Ingestion & Parsing:</strong> Raw log streams ingest via <strong>Apache Kafka</strong>. Log messages are parsed into structured templates using the Drain log parser, extracting dynamic parameter fields while preserving sequence structure.</li>
        <li><strong>Windowing & Sessionization:</strong> Logs are windowed into discrete computational sessions (BlockID grouping for HDFS; sliding temporal windows for BGL and Spirit) under strict temporal train/test partitioning to prevent data leakage.</li>
        <li><strong>Inference Microservices:</strong> Deployed parallel microservices evaluate 11 benchmarked classification architectures (SVM, Random Forest, Isolation Forest, BiLSTM, Attention-BiLSTM, Autoencoders, and LogBERT).</li>
        <li><strong>Database & Streamlit Dashboard:</strong> Real-time alerts, confidence metrics, and sequence statistics persist to PostgreSQL and render live on a Streamlit monitoring interface.</li>
      </ul>

      <h4>3. Explainable AI (XAI) Integration</h4>
      <p>To enable Site Reliability Engineers (SREs) to inspect anomaly alerts, post-hoc interpretability models (SHAP and LIME) calculate token-level attribution scores for every flagged session, highlighting exact log tokens contributing to the anomaly score.</p>

      <h4>4. Key Empirical Benchmark Results</h4>
      <ul>
        <li><strong>HDFS Supervised Peak F1:</strong> 0.9958 (Attention-BiLSTM)</li>
        <li><strong>HDFS Unsupervised Peak F1:</strong> 0.9571 (Optimized BiLSTM Autoencoder)</li>
        <li><strong>BGL & Spirit Performance:</strong> 0.997–0.999 F1 score across classical ML baseline classifiers.</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/log-anomaly-detection",
    report: "https://github.com/ademtoumi/log-anomaly-detection/blob/main/Engineer_Thesis.pdf",
    masterReport: "https://github.com/ademtoumi/log-anomaly-detection/blob/main/Master_Thesis.pdf"
  },

  knowledgeHub: {
    title: "KnowledgeHub AI — Enterprise RAG Platform",
    subtitle: "Flagship AI Engineering System — RAG, Hybrid Search & XAI (2026)",
    body: `
      <h4>1. Executive Overview & Problem Statement</h4>
      <p>Enterprise knowledge bases suffer from data silos and unsearchable technical documentation. While Large Language Models (LLMs) provide natural language synthesis, ungrounded LLMs hallucinate inaccurate information. KnowledgeHub AI guarantees 100% factual accuracy through grounded retrieval-augmented generation.</p>

      <h4>2. Technical Architecture & Component Design</h4>
      <ul>
        <li><strong>Document Ingestion & Chunking:</strong> Ingests <code>.pdf</code>, <code>.md</code>, and <code>.txt</code> documents using PyMuPDF and recursive character text splitting with configurable chunk size (500 tokens) and overlap (50 tokens).</li>
        <li><strong>Hybrid Retrieval Engine (FAISS + BM25):</strong> Combines 384-dimensional dense semantic vectors (<code>all-MiniLM-L6-v2</code>) with sparse lexical keyword matching (Okapi BM25) using score fusion ($\alpha=0.6$).</li>
        <li><strong>Cross-Encoder Reranking:</strong> Re-scores top candidate passages using joint query-context self-attention (<code>ms-marco-TinyBERT-L-2-v2</code>) in &lt; 15 ms on CPU.</li>
        <li><strong>Anti-Hallucination LLM Synthesis:</strong> Passes reranked chunks into Google Gemini Flash with strict prompt constraints, falling back cleanly if context is insufficient.</li>
        <li><strong>Stack:</strong> FastAPI REST API backend, React 18 + Vite frontend, TanStack Query, Docker Compose containerization.</li>
      </ul>

      <h4>3. Benchmark Evaluation Results</h4>
      <p>Evaluated using an automated benchmark suite across 17 technical test queries against 15 enterprise reference documents (106 indexed vector passages):</p>
      <ul>
        <li><strong>Hit Rate @ K=4:</strong> 94.1%</li>
        <li><strong>Mean Reciprocal Rank (MRR):</strong> 0.9412</li>
        <li><strong>Average Query Latency:</strong> 621.4 ms</li>
        <li><strong>Automated Test Suite:</strong> 116 passing unit and integration tests</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/KnowledgeHub-AI"
  },

  uavDetection: {
    title: "Real-Time Multi-Object Detection & Tracking for UAV Surveillance",
    subtitle: "Research Internship — URD Laboratory (Feb. 2025 – Jun. 2025)",
    body: `
      <h4>1. Executive Overview & Problem Statement</h4>
      <p>Aerial drone video streams present unique computer vision challenges: camera platform motion, rapid scale variations, small target sizes, and strict edge latency constraints. This project engineered a physical hardware-software aerial surveillance system for real-time target identification and tracking.</p>

      <h4>2. Architecture & Hardware Integration</h4>
      <ul>
        <li><strong>Object Detection Models:</strong> Fine-tuned YOLOv11s and YOLOv8 on VisDrone and custom military vehicle datasets, achieving mAP@0.5 ≈ 0.85 and 90%+ detection accuracy.</li>
        <li><strong>Dual Tracking Pipeline:</strong> Integrated DeepSort for multi-object tracking and OpenCV CSRT for robust single-target tracking under occlusion and motion blur.</li>
        <li><strong>Edge AI Hardware Acceleration:</strong> Deployed inference on Raspberry Pi 5 hardware coupled with an Intel Movidius Neural Compute Stick 2 (NCS 2) accelerator.</li>
        <li><strong>Custom UDP Telemetry & Gimbal Control:</strong> Custom lightweight UDP video streaming protocol between drone payload and Ground Control Station PC. Gimbal control logic calculates target pixel offsets from frame center and issues real-time pan/tilt correction commands.</li>
        <li><strong>Ground Control Station UI:</strong> Dark-themed Tkinter GCS interface featuring live video feed, click-to-track target selection, and real-time telemetry overlays.</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/UAV-Object-Detection-Tracking"
  },

  maliciousUrl: {
    title: "Multi-Class Malicious URL Detection via Hybrid Feature Engineering",
    subtitle: "Cybersecurity Machine Learning System — ESI-SBA (2024–2025)",
    body: `
      <h4>1. Executive Overview & Problem Statement</h4>
      <p>Content-based web security scanners require downloading and executing web page content, exposing sandboxes to zero-day exploits. This system evaluates URL strings directly, classifying malicious links into benign, phishing, malware, and defacement threats without executing page content.</p>

      <h4>2. Feature Engineering & Machine Learning Pipeline</h4>
      <ul>
        <li><strong>Hybrid Feature Extraction:</strong> Extracted character-level n-grams (TF-IDF vectorization) paired with 18 lexical and structural URL metrics (length, entropy, subdomains, special character frequencies, IP presence).</li>
        <li><strong>Model Benchmark:</strong> Trained and benchmarked Random Forest, XGBoost, LightGBM, and Deep Neural Networks across 651,191 URLs.</li>
        <li><strong>Results:</strong> Random Forest and XGBoost classifiers achieved 96.8% Macro F1 Score with sub-millisecond per-URL evaluation latency.</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/Malicious-URL-Detection",
    report: "https://github.com/ademtoumi/Malicious-URL-Detection/blob/main/report.pdf"
  },

  paraphrase: {
    title: "Paraphrase Detection via Siamese Attention Deep Learning",
    subtitle: "NLP Semantic Similarity Architecture — ESI-SBA (2024–2025)",
    body: `
      <h4>1. Executive Overview & Problem Statement</h4>
      <p>Traditional lexical overlap algorithms fail when two sentences share zero common words yet express identical semantic intent. This system builds a deep learning model for sentence-level paraphrase detection.</p>

      <h4>2. Neural Architecture & Technical Details</h4>
      <ul>
        <li><strong>Siamese Neural Network:</strong> Dual-branch Bidirectional LSTM (Bi-LSTM) network sharing identical weight matrices to map sentence pairs into a shared semantic latent space.</li>
        <li><strong>Multi-Head Attention Mechanism:</strong> 4-head attention mechanism highlights contextual token dependencies across sentence boundaries.</li>
        <li><strong>Loss Function & Training:</strong> Optimized with Focal Loss ($\alpha=0.75, \gamma=2$) on PAWS and QQP corpora (≈450,000 sentence pairs) to resolve class imbalance in complex sentence pairs.</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/Paraphrase-Detection"
  },

  hajjPortal: {
    title: "HajjPortal — Trilingual Pilgrimage Management Platform",
    subtitle: "Full-Stack Web Software Engineering — ESI-SBA (2023–2024)",
    body: `
      <h4>1. Executive Overview & Problem Statement</h4>
      <p>Managing large-scale regional pilgrimage logistics requires robust multi-tenant web platforms supporting complex workflows, real-time lottery drawings, and multi-language accessibility.</p>

      <h4>2. Software Architecture</h4>
      <ul>
        <li><strong>Frontend Framework:</strong> Built with Next.js 14 App Router, TypeScript, and Tailwind CSS.</li>
        <li><strong>Trilingual & Layout Parity:</strong> Full internationalization (Arabic, English, French) with dynamic Right-to-Left (RTL) and Left-to-Right (LTR) layout switching.</li>
        <li><strong>Real-Time Synchronization:</strong> Integrated Socket.io for live administrative status updates, lottery announcements, and passenger list sync.</li>
        <li><strong>Validation & Security:</strong> Strict runtime input validation using Zod schemas and secure JWT authentication.</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/hajj-platform-frontend"
  },

  kidlink: {
    title: "KidLink — Cross-Platform School Communication App",
    subtitle: "Mobile Application Development — ESI-SBA (2022–2023)",
    body: `
      <h4>1. Executive Overview & Problem Statement</h4>
      <p>Primary schools require low-latency, role-based mobile communication channels connecting parents, teachers, and school administrators for announcements, attendance, and messaging.</p>

      <h4>2. Technical Implementation</h4>
      <ul>
        <li><strong>Cross-Platform Mobile:</strong> Developed in Flutter & Dart using Provider state management for smooth 60 FPS mobile rendering across Android and iOS.</li>
        <li><strong>Push Notifications & Real-Time Sync:</strong> Integrated Firebase Cloud Messaging (FCM) for push notifications and Cloud Firestore for offline-first data persistence.</li>
        <li><strong>Role-Based Security:</strong> Implemented 3 distinct user role workflows secured via Firebase Authentication rules.</li>
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
