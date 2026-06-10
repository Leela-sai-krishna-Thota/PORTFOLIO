/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialization of interactive modules
  initTheme();
  initCustomCursor();
  initParticleBackground();
  initMobileMenu();
  initStickyHeader();
  initTypingEffect();
  initNavHighlightAndReveal();
  initStatsCounter();
  initContactForm();
  initScrollToTop();
  initSkillBars();
  initResumeDownload();
});

/* ==========================================================
   1. Premium Theme System (Dark Mode First Default)
   ========================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  // Retrieve existing local style setting, defaulting to 'dark'
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    
    // Dispatch event or callback for canvas updates if necessary
    window.dispatchEvent(new CustomEvent('themechanged', { detail: nextTheme }));
  });
}

/* ==========================================================
   2. Custom Magnetic Trailing Cursor
   ========================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const dot = document.getElementById('custom-cursor-dot');
  if (!cursor || !dot) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Small dot follows mouse directly for responsive crisp feedback
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  // Smooth lagging trailer for standard organic feel
  function tick() {
    // Linear Interpolation: target_pos - cur_pos * smoothing_rate
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(tick);
  }
  tick();

  // Attach hover states to meaningful interactive elements
  const interactives = document.querySelectorAll('a, button, .scroll-to-top, .contact-card, .btn');
  interactives.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
    });
    elem.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
    });
  });
}

/* ==========================================================
   3. Interactive HTML5 Canvas Particle Network
   ========================================================== */
function initParticleBackground() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  const config = {
    count: Math.min(Math.floor(width / 15), 110),
    speed: 0.5,
    connectorDist: 105,
    particleColorTheme: {
      dark: 'rgba(59, 130, 246, ',
      light: 'rgba(37, 99, 235, '
    },
    lineColorTheme: {
      dark: 'rgba(99, 102, 241, ',
      light: 'rgba(124, 58, 237, '
    }
  };

  let activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';

  window.addEventListener('themechanged', (e) => {
    activeTheme = e.detail;
  });

  // Handle window resizing safely
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    setupParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * config.speed;
      this.vy = (Math.random() - 0.5) * config.speed;
      this.radius = Math.random() * 2 + 1.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Restrict wander coordinates to canvas boundaries
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Subtle interaction with floating mouse coordinates
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      const col = activeTheme === 'dark' ? config.particleColorTheme.dark : config.particleColorTheme.light;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${col}0.45)`;
      ctx.fill();
    }
  }

  function setupParticles() {
    particles = [];
    const count = Math.min(Math.floor(width / 16), 110);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    const colLine = activeTheme === 'dark' ? config.lineColorTheme.dark : config.lineColorTheme.light;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.connectorDist) {
          // Dynamic alpha calculations based on node proximity
          const alpha = (1 - dist / config.connectorDist) * 0.16;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `${colLine}${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections and individual nodes
    drawConnections();
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    requestAnimationFrame(animate);
  }

  setupParticles();
  animate();
}

/* ==========================================================
   4. Mobile Menu Navigation Logic
   ========================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Auto-close menu panels on mobile when individual tabs are selected
  const links = navLinks.querySelectorAll('.nav-link');
  links.forEach(l => {
    l.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

/* ==========================================================
   5. Dynamic Sticky Header Scrolled Class
   ========================================================== */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const threshold = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > threshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================
   6. Typographic Typing & Erasing Cycle
   ========================================================== */
function initTypingEffect() {
  const target = document.getElementById('typed-text');
  if (!target) return;

  const roles = [
    'Full-Stack Developer',
    'Software Engineer',
    'Data Structures Specialist'
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isErasing = false;
  let speed = 100;

  function type() {
    const currentWord = roles[wordIndex];
    
    if (isErasing) {
      // Shave off characters
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      speed = 50; // Quicker erasing speed
    } else {
      // Place next character
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      speed = 120; // Natural typing speed
    }

    if (!isErasing && charIndex === currentWord.length) {
      isErasing = true;
      speed = 2200; // Hold full sentence before erasing
    } else if (isErasing && charIndex === 0) {
      isErasing = false;
      wordIndex = (wordIndex + 1) % roles.length;
      speed = 500; // Breath buffer before starting next word
    }

    setTimeout(type, speed);
  }

  type();
}

/* ==========================================================
   7. IntersectionObservers: Reveal-On-Scroll & Nav Highlighter
   ========================================================== */
function initNavHighlightAndReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  // Multi-observer configs
  const revealOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once triggered to lock animation in and avoid rendering hits
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // Secondary Observer: Section Tracker for Menu Accents
  const sectionOptions = {
    threshold: 0.45,
    rootMargin: '-10% 0px -40% 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${targetId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, sectionOptions);

  sections.forEach(s => sectionObserver.observe(s));
}

/* ==========================================================
   8. Statistical Item Counters Animators
   ========================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-num');
  if (statNumbers.length === 0) return;

  const configOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const endVal = parseInt(target.getAttribute('data-value'), 10);
        animateCounter(target, endVal);
        observer.unobserve(target); // Only count once
      }
    });
  }, configOptions);

  statNumbers.forEach(num => countObserver.observe(num));

  function animateCounter(elem, endVal) {
    let current = 0;
    const duration = 2000; // Over 2 seconds
    const interval = 16; // Approximately 60fps
    const increment = endVal / (duration / interval);

    const timer = setInterval(() => {
      current += increment;
      if (current >= endVal) {
        elem.textContent = endVal + (elem.getAttribute('data-suffix') || '');
        clearInterval(timer);
      } else {
        elem.textContent = Math.floor(current) + (elem.getAttribute('data-suffix') || '');
      }
    }, interval);
  }
}

/* ==========================================================
   9. Trigger Skill Progression Bars Visually
   ========================================================== */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-inner');
  if (bars.length === 0) return;

  const barObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-width');
        bar.style.width = targetWidth;
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(b => barObserver.observe(b));
}

/* ==========================================================
   10. Compact Functional Contact Forms Validation
   ========================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('form-toast');
  if (!form || !toast) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Acquire DOM input values
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const msg = document.getElementById('form-message').value.trim();

    // Clean states
    toast.style.display = 'none';
    toast.className = 'toast-box';

    // Guard parameters
    if (!name || !email || !subject || !msg) {
      showToast('Please verify that all inputs have been filled out.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showToast('Please supply a valid email address.', 'error');
      return;
    }

    // Get submit button & display transmitting loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Transmitting...';
      submitBtn.style.opacity = '0.7';
      submitBtn.style.cursor = 'not-allowed';
    }

    // FormSubmit AJAX submission parameters
    const submissionData = {
      "Contact Name": name,
      "Email": email,
      "Subject Line": subject,
      "Inquiry Message": msg,
      "_subject": `⚡ Portfolio Inquiry: ${subject}`,
      "_replyto": email,
      "_captcha": "false"
    };

    // AJAX POST request to FormSubmit endpoint
    fetch('https://formsubmit.co/ajax/thotaleelasaikrishna@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(submissionData)
    })
    .then(async (response) => {
      if (response.ok) {
        showToast('Success! Your message was submitted.', 'success');
        form.reset();
      } else {
        const errDetail = await response.json().catch(() => ({}));
        const errText = errDetail.message || 'Form transmission failed. Please try again.';
        showToast(errText, 'error');
      }
    })
    .catch((err) => {
      console.error('Submission AJAX error:', err);
      showToast('Network error, please check connection and try again.', 'error');
    })
    .finally(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
      }
    });
  });

  function showToast(message, type) {
    toast.textContent = message;
    toast.style.display = 'block';
    if (type === 'success') {
      toast.classList.add('toast-success');
    } else {
      toast.classList.add('toast-error');
    }
    
    // Auto erase toast panels
    setTimeout(() => {
      toast.style.display = 'none';
    }, 8000);
  }

  function isValidEmail(email) {
    const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return rx.test(email);
  }
}

/* ==========================================================
   11. Smooth-Scroll Scroll-To-Top button
   ========================================================== */
function initScrollToTop() {
  const rTop = document.getElementById('scroll-to-top');
  if (!rTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      rTop.classList.add('visible');
    } else {
      rTop.classList.remove('visible');
    }
  });

  rTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================
   12. Professional PDF Resume Download Flow
   ========================================================== */
function initResumeDownload() {
  const downloadBtn = document.getElementById('download-resume-btn');
  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (typeof html2pdf === 'undefined') {
      alert('PDF download engine is loading, please wait a moment.');
      return;
    }

    const originalHTML = downloadBtn.innerHTML;
    downloadBtn.style.opacity = '0.7';
    downloadBtn.style.pointerEvents = 'none';
    downloadBtn.innerHTML = 'Preparing PDF...';

    const element = document.getElementById('resume-pdf-template');
    if (!element) {
      alert('Error: Resume template container not found.');
      downloadBtn.style.opacity = '1';
      downloadBtn.style.pointerEvents = 'auto';
      downloadBtn.innerHTML = originalHTML;
      return;
    }

    // Inject CSS keyframes programmatically to support rotating SVG spinner
    if (!document.getElementById('pdf-spin-keyframes')) {
      const style = document.createElement('style');
      style.id = 'pdf-spin-keyframes';
      style.innerHTML = `
        @keyframes pdf-spin-kf {
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    // Create high-fidelity professional full-screen layout generator loading overlay
    const overlay = document.createElement('div');
    overlay.id = 'pdf-loader-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(10, 11, 15, 0.96)';
    overlay.style.backdropFilter = 'blur(10px)';
    overlay.style.webkitBackdropFilter = 'blur(10px)';
    overlay.style.zIndex = '999999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.color = '#ffffff';
    overlay.style.fontFamily = "'Inter', Arial, sans-serif";
    overlay.style.transition = 'opacity 0.3s ease';

    // Create container inner markup
    const innerContainer = document.createElement('div');
    innerContainer.style.display = 'flex';
    innerContainer.style.flexDirection = 'column';
    innerContainer.style.alignItems = 'center';
    innerContainer.style.gap = '20px';
    innerContainer.innerHTML = `
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color: #6366f1; animation: pdf-spin-kf 0.8s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke="#1f2937" stroke-width="2.5"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#6366f1" stroke-width="3"></path>
      </svg>
      <div style="font-size: 18px; font-weight: 600; letter-spacing: 0.5px; text-align: center;">Exporting Resilient PDF Resume...</div>
      <div style="font-size: 12px; color: #a1a1aa; text-align: center; margin-top: -8px;">Applying micrographic margins & vector scales</div>
    `;

    overlay.appendChild(innerContainer);
    document.body.appendChild(overlay);

    // Robustly resolve relative standard URL path to ensure GitHub Pages and nested domain integrations
    const currentPath = window.location.pathname;
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    const pdfUrl = `${window.location.origin}${basePath}Thota_Leela_Sai_Krishna_Resume.pdf`;

    // Fetch the physical static A4 PDF compiled compiled via pdfkit
    fetch(pdfUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Static compiled PDF resume not found at: ' + pdfUrl);
        }
        return response.blob();
      })
      .then(blob => {
        // Provide user a brief, elegant high-end loader transition window (600ms)
        setTimeout(() => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'Thota_Leela_Sai_Krishna_Resume.pdf';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          cleanup();
        }, 700);
      })
      .catch(error => {
        console.warn('Unable to retrieve pre-compiled static resume, executing dynamic DOM on-the-fly rendering fallback as safeguard:', error);
        
        // Fallback Dynamic html2pdf render engine
        element.style.display = 'block';
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.left = '0';
        element.style.width = '794px';
        element.style.height = 'auto';
        element.style.opacity = '1';
        element.style.zIndex = '999998';
        element.style.pointerEvents = 'none';

        const originalScrollY = window.scrollY;
        const originalScrollX = window.scrollX;
        window.scrollTo(0, 0);

        setTimeout(() => {
          const opt = {
            margin:       [0.4, 0.4, 0.4, 0.4], 
            filename:     'Thota_Leela_Sai_Krishna_Resume.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
              scale: 2.2,
              useCORS: true,
              letterRendering: true,
              scrollX: 0,
              scrollY: 0,
              windowWidth: 794
            },
            jsPDF:        { 
              unit: 'in', 
              format: 'letter', 
              orientation: 'portrait' 
            }
          };

          html2pdf()
            .set(opt)
            .from(element)
            .save()
            .then(() => {
              window.scrollTo(originalScrollX, originalScrollY);
              cleanup();
            })
            .catch((err) => {
              console.error('Dynamic PDF Generation Failure:', err);
              alert('An unexpected error occurred while preparing your download.');
              window.scrollTo(originalScrollX, originalScrollY);
              cleanup();
            });
        }, 200);
      });

    // Helper cleanup function to restore document to pristine state
    function cleanup() {
      // Re-hide the fallback resume element
      element.style.display = 'none';
      element.style.position = '';
      element.style.top = '';
      element.style.left = '';
      element.style.width = '';
      element.style.height = '';
      element.style.zIndex = '';
      element.style.pointerEvents = '';

      // Fade out and remove loading overlay
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);

      // Restore download trigger button
      downloadBtn.style.opacity = '1';
      downloadBtn.style.pointerEvents = 'auto';
      downloadBtn.innerHTML = originalHTML;
    }
  });
}
