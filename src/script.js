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
    'Data Structures Specialist',
    'AI & Machine Learning Student'
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

    // Interactive developer simulation toast
    showToast('Success! Thank you for getting in touch. I will contact you shortly.', 'success');
    form.reset();
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
    }, 6000);
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
