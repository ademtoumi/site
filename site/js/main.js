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
   ---------------------------------------------------------- */
const WORDS   = ['Engineer', 'System Architect', 'Data Scientist', 'AI Builder'];
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
   PROJECT CASE STUDY DATA & MODAL LOGIC
   ---------------------------------------------------------- */
const CASE_STUDIES = {
  logAnomaly: {
    title: "Log-Based Anomaly Detection in Distributed Systems",
    subtitle: "Engineering & Master's Graduation Thesis — ESI-SBA (2025–2026)",
    body: `
      <h4>Project Overview</h4>
      <p>Modern cloud infrastructure generates millions of log events per minute. Early failure detection requires a real-time streaming pipeline capable of processing unstructured log streams without data leakage, paired with interpretable models that help Site Reliability Engineers (SREs) understand why an anomaly was flagged.</p>
      
      <h4>Problem Statement</h4>
      <p>Existing log anomaly detection research often relies on static offline evaluation with temporal data leakage, lacks streaming ingestion pipelines, and acts as a black box without explainability metrics for SRE incident response.</p>
      
      <h4>System Architecture & Engineering Decisions</h4>
      <ul>
        <li><strong>Data Ingestion & Streaming:</strong> Apache Kafka streams log events continuously into real-time parsing queues.</li>
        <li><strong>Parser & Preprocessing:</strong> Drain parser extracts log templates and structures sessions via BlockId (HDFS) and sliding temporal windows (BGL/Spirit) with zero TF-IDF data leakage.</li>
        <li><strong>Multi-Model Benchmark Engine:</strong> Evaluated 11 machine learning and deep learning architectures (SVM, Random Forest, Isolation Forest, BiLSTM, Attention-BiLSTM, Autoencoders, LogBERT).</li>
        <li><strong>Explainable AI (XAI) Integration:</strong> Integrated SHAP (global feature attribution) and LIME (local surrogate explanations) to output token-level importance scores for every anomaly alert.</li>
        <li><strong>Production Dashboard:</strong> Streamlit frontend connected to cloud-deployed FastAPI services and PostgreSQL database.</li>
      </ul>

      <h4>Key Results</h4>
      <ul>
        <li><strong>HDFS Supervised Peak F1:</strong> 0.9958 (Attention-BiLSTM)</li>
        <li><strong>HDFS Unsupervised Peak F1:</strong> 0.9571 (Optimized BiLSTM-AE)</li>
        <li><strong>BGL & Spirit Performance:</strong> 0.997–0.999 F1 score across classical ML baseline classifiers.</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/log-anomaly-detection",
    report: "https://github.com/ademtoumi/log-anomaly-detection/blob/main/Engineer_Thesis.pdf",
    masterReport: "https://github.com/ademtoumi/log-anomaly-detection/blob/main/Master_Thesis.pdf"
  },

  knowledgeHub: {
    title: "KnowledgeHub AI — Enterprise RAG Platform",
    subtitle: "Flagship AI Engineering Project — RAG, Hybrid Search & XAI (2026)",
    body: `
      <h4>Project Overview</h4>
      <p>KnowledgeHub AI is a production-ready document intelligence platform designed to eliminate LLM hallucination in enterprise technical knowledge bases. Organizations upload technical documentation, query in natural language, and receive precise, verifiable answers with exact source citations.</p>

      <h4>Engineering Solution & Architecture</h4>
      <ul>
        <li><strong>Hybrid Retrieval Engine:</strong> Combines dense vector search (FAISS + Sentence Transformers) with sparse keyword search (BM25) via Reciprocal Rank Fusion (RRF) to maximize document recall.</li>
        <li><strong>Cross-Encoder Reranking:</strong> Re-scores top candidate chunks using deep cross-encoders to ensure top relevance context is passed to the LLM.</li>
        <li><strong>Explainable AI (XAI) Attribution:</strong> Highlights exact source chunks, confidence scores, and citation links for complete transparency.</li>
        <li><strong>Full-Stack Architecture:</strong> FastAPI REST backend, React 18 + Vite frontend, Tailwind CSS, TanStack Query, and containerized Docker Compose deployment.</li>
      </ul>

      <h4>Testing & Quality</h4>
      <p>Includes 116 passing automated unit and integration tests verifying retrieval precision, API contracts, and edge-case query handling.</p>
    `,
    github: "https://github.com/ademtoumi/KnowledgeHub-AI"
  },

  uavDetection: {
    title: "Real-Time Multi-Object Detection & Tracking for UAV Surveillance",
    subtitle: "Research Internship — URD Laboratory (Feb. 2025 – Jun. 2025)",
    body: `
      <h4>Project Overview</h4>
      <p>Developed a real-time aerial surveillance pipeline for unmanned aerial vehicles (UAVs) to identify and continuously track ground targets under drone camera motion and scale variations.</p>

      <h4>Engineering Implementation</h4>
      <ul>
        <li><strong>Object Detection:</strong> Fine-tuned YOLOv11s on VisDrone aerial datasets achieving mAP@0.5 ≈ 0.85 under varying altitude and light conditions.</li>
        <li><strong>Multi-Target Tracking:</strong> Integrated DeepSort and CSRT tracking algorithms across sequential video frames to maintain target identities under camera motion.</li>
        <li><strong>Edge AI Hardware Acceleration:</strong> Deployed and optimized model inference on Raspberry Pi 5 with Intel Movidius NCS 2 hardware acceleration.</li>
        <li><strong>Ground Control Station (GCS):</strong> Developed a Tkinter GCS interface decoding live video streams and telemetry over a custom UDP protocol with automatic target-centering gimbal control.</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/UAV-Object-Detection-Tracking"
  },

  maliciousUrl: {
    title: "Multi-Class Malicious URL Detection via Hybrid Feature Engineering",
    subtitle: "Cybersecurity Machine Learning Classifier — ESI-SBA (2024–2025)",
    body: `
      <h4>Project Overview</h4>
      <p>Built a multi-class cybersecurity machine learning classifier designed to identify phishing, malware, defacement, and benign web URLs without accessing or executing malicious web pages.</p>

      <h4>Feature Engineering & Model Performance</h4>
      <ul>
        <li><strong>Hybrid Features:</strong> Extracted character n-grams via TF-IDF alongside structural URL descriptors (URL length, entropy, digit counts, subdomains, special character ratios).</li>
        <li><strong>Model Evaluation:</strong> Evaluated Random Forest, XGBoost, and LSTM architectures across 651,191 URLs across 4 threat classes.</li>
        <li><strong>Results:</strong> Delivered 96.8% Macro F1 score with sub-millisecond per-URL evaluation latency.</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/Malicious-URL-Detection",
    report: "https://github.com/ademtoumi/Malicious-URL-Detection/blob/main/report.pdf"
  },

  paraphrase: {
    title: "Paraphrase Detection via Siamese Attention Deep Learning",
    subtitle: "NLP Semantic Similarity Architecture — ESI-SBA (2024–2025)",
    body: `
      <h4>Project Overview</h4>
      <p>Designed a sentence-level semantic similarity detection system using a deep learning Siamese neural network with shared weights to capture semantic equivalences regardless of structural variations.</p>

      <h4>Model Architecture</h4>
      <ul>
        <li><strong>Deep Neural Network:</strong> Dual-branch Bi-LSTM network with shared weight matrices.</li>
        <li><strong>Multi-Head Attention:</strong> Integrated 4-head attention mechanisms to weight contextual token importance across sentence pairs.</li>
        <li><strong>Training & Optimization:</strong> Optimized using Focal Loss (α=0.75, γ=2) on PAWS and QQP datasets (≈450K sentence pairs).</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/Paraphrase-Detection"
  },

  hajjPortal: {
    title: "HajjPortal — Trilingual Pilgrimage Management Platform",
    subtitle: "Full-Stack Web Software Engineering — ESI-SBA (2023–2024)",
    body: `
      <h4>Project Overview</h4>
      <p>Developed a full-stack, trilingual (Arabic, English, French) web platform for pilgrimage logistics, registration, lottery selection, and live administrative management.</p>

      <h4>Technical Architecture</h4>
      <ul>
        <li><strong>Frontend & Layout:</strong> Next.js 14 App Router with full RTL (Right-to-Left for Arabic) and LTR (Left-to-Right for English/French) layout parity.</li>
        <li><strong>Backend & Real-Time:</strong> Integrated Socket.io for live state synchronization between user applications and administrative dashboards.</li>
        <li><strong>Type Safety & State:</strong> Managed state with TanStack Query and enforced strict runtime validation using Zod schemas.</li>
      </ul>
    `,
    github: "https://github.com/ademtoumi/hajj-platform-frontend"
  },

  kidlink: {
    title: "KidLink — Cross-Platform School Communication App",
    subtitle: "Mobile Application Development — ESI-SBA (2022–2023)",
    body: `
      <h4>Project Overview</h4>
      <p>Built a cross-platform mobile application connecting parents, teachers, and school administrators to improve coordination and transparency in primary education.</p>

      <h4>Key Features</h4>
      <ul>
        <li><strong>Cross-Platform Mobile:</strong> Developed in Flutter & Dart using Provider state management for smooth 60 FPS UI performance.</li>
        <li><strong>Real-Time Push Notifications:</strong> Integrated Firebase Cloud Messaging (FCM) for low-latency alerts.</li>
        <li><strong>Offline Sync & Auth:</strong> Implemented Cloud Firestore offline persistence and Firebase Authentication across 3 role-based user workflows.</li>
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
      // Endpoint using Web3Forms / Formspree / FormSubmit for direct delivery to a.toumi@esi-sba.dz
      const response = await fetch('https://formspree.io/f/xknlqbrb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: nameVal, email: emailVal, subject: subjectVal, message: msgVal })
      });

      if (response.ok) {
        showFormAlert('success', 'Thank you! Your message has been sent successfully. I will get back to you shortly.');
        contactForm.reset();
      } else {
        // Fallback to mailto if endpoint is unconfigured or blocked
        window.location.href = `mailto:a.toumi@esi-sba.dz?subject=${encodeURIComponent(subjectVal)}&body=${encodeURIComponent("From: " + nameVal + " (" + emailVal + ")\n\n" + msgVal)}`;
        showFormAlert('success', 'Opening your email client to send your message directly to a.toumi@esi-sba.dz');
      }
    } catch (err) {
      // Client network error fallback
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
