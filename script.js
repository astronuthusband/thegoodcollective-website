/* ============================================================
   THE GOOD COLLECTIVE — script.js
   Premium Interactions & Animations
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. CUSTOM CURSOR
  ---------------------------------------------------------- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverTargets = document.querySelectorAll(
      'a, button, .service-card, .case-card, .why-card, .pillar, input, textarea'
    );

    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        follower.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
        follower.classList.remove('hovered');
      });
    });
  }

  /* ----------------------------------------------------------
     2. NAVBAR — Transparent → Blurred on scroll
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  function handleNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbar, { passive: true });
  handleNavbar();

  /* ----------------------------------------------------------
     3. HAMBURGER MOBILE MENU
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----------------------------------------------------------
     4. SMOOTH SCROLLING
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = navbar ? navbar.offsetHeight : 0;
      const targetY = target.getBoundingClientRect().top + window.pageYOffset - navH - 16;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     5. SCROLL REVEAL
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------
     6–14 (UNCHANGED)
  ---------------------------------------------------------- */
  // (Everything above remains exactly as you already had it)
  // ---------------------------------------------------------

  /* ----------------------------------------------------------
     10. CONTACT FORM — FIXED NETLIFY VERSION
  ---------------------------------------------------------- */

  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const btn  = this.querySelector('.form-btn');
      const span = btn?.querySelector('span');
      const svg  = btn?.querySelector('svg');

      if (!btn) return;

      // UI loading state
      btn.disabled = true;
      btn.style.opacity = '0.8';
      if (span) span.textContent = 'Sending…';

      const formData = new FormData(contactForm);

      try {
        // REAL Netlify submission
        await fetch('/', {
          method: 'POST',
          body: formData
        });

        // success UI
        if (span) span.textContent = 'Message Sent ✓';
        if (svg) svg.style.display = 'none';
        btn.style.background = '#4a7c5a';

        setTimeout(() => {
          contactForm.reset();

          if (span) span.textContent = 'Start Your Project';
          if (svg) svg.style.display = '';
          btn.disabled = false;
          btn.style.opacity = '';
          btn.style.background = '';
        }, 2000);

      } catch (err) {
        console.error('Form error:', err);

        if (span) span.textContent = 'Try Again';
        btn.disabled = false;
        btn.style.opacity = '';
      }
    });

    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.01)';
      });
      input.addEventListener('blur', () => {
        input.parentElement.style.transform = '';
      });
    });
  }

  /* ----------------------------------------------------------
     11–15 (UNCHANGED)
  ---------------------------------------------------------- */

  function applyStaggeredDelay() {
    const cards = document.querySelectorAll('.service-card, .why-card');
    cards.forEach((card, i) => {
      const existing = Array.from(card.classList)
        .find(c => c.startsWith('delay-'));
      if (!existing) {
        card.style.transitionDelay = (i * 0.08) + 's';
      }
    });
  }
  applyStaggeredDelay();

  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + (navbar?.offsetHeight || 80) + 40;
    sections.forEach(sec => {
      const top    = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const match = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size   = Math.max(rect.width, rect.height) * 2;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      ripple.style.cssText = `
        position:absolute;
        width:${size}px; height:${size}px;
        left:${x}px; top:${y}px;
        background:rgba(255,255,255,0.15);
        border-radius:50%;
        transform:scale(0);
        animation:rippleAnim 0.6s ease-out forwards;
        pointer-events:none;
      `;

      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(1); opacity: 0; }
    }
    .nav-links a.active { color: var(--cream) !important; }
  `;
  document.head.appendChild(style);

  window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    const heroRevealEls = document.querySelectorAll('.hero .reveal-up');
    heroRevealEls.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 200 + i * 140);
    });
  });

  console.log('%c The Good Collective ', 'background:#304b3a;color:#c9a96e;font-family:serif;font-size:18px;padding:8px 16px;border:1px solid #c9a96e;');

})();