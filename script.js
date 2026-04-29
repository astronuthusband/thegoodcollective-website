/* ============================================================
   THE GOOD COLLECTIVE — script.js
   Premium Interactions & Netlify Forms FIXED (JS version)
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
     2. NAVBAR
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  function handleNavbar() {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', handleNavbar, { passive: true });
  handleNavbar();

  /* ----------------------------------------------------------
     3. MOBILE MENU
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
     4. SMOOTH SCROLL
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const navH = navbar ? navbar.offsetHeight : 0;

      const targetY =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        navH -
        16;

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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------
     6. STAGGER
  ---------------------------------------------------------- */
  function applyStagger() {
    const cards = document.querySelectorAll('.service-card, .why-card');
    cards.forEach((card, i) => {
      if (!card.style.transitionDelay) {
        card.style.transitionDelay = (i * 0.08) + 's';
      }
    });
  }
  applyStagger();

  /* ----------------------------------------------------------
     7. MARQUEE PAUSE
  ---------------------------------------------------------- */
  const marquee = document.querySelector('.marquee-track');
  if (marquee) {
    marquee.addEventListener('mouseenter', () => {
      marquee.style.animationPlayState = 'paused';
    });
    marquee.addEventListener('mouseleave', () => {
      marquee.style.animationPlayState = 'running';
    });
  }

  /* ----------------------------------------------------------
     8. ACTIVE NAV
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateNav() {
    const pos = window.scrollY + (navbar?.offsetHeight || 80) + 40;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;

      if (pos >= top && pos < bottom) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const match = document.querySelector(
          `.nav-links a[href="#${sec.id}"]`
        );
        if (match) match.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateNav, { passive: true });

  /* ----------------------------------------------------------
     9. BUTTON RIPPLE
  ---------------------------------------------------------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;

      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position:absolute;
        width:${size}px;
        height:${size}px;
        left:${x}px;
        top:${y}px;
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

  /* ----------------------------------------------------------
     10. CONTACT FORM (FIXED NETLIFY + JS)
  ---------------------------------------------------------- */

  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('.form-btn');
      const text = btn?.querySelector('span');

      if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.7';
        if (text) text.textContent = 'Sending...';
      }

      const formData = new FormData(form);

      // IMPORTANT FIX: proper Netlify encoding
      const encoded = new URLSearchParams(formData).toString();

      try {
        await fetch('/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: encoded
        });

        if (text) text.textContent = 'Message Sent ✓';

        setTimeout(() => {
          form.reset();
          if (text) text.textContent = 'Send Message';
          if (btn) {
            btn.disabled = false;
            btn.style.opacity = '';
          }
        }, 2000);

      } catch (err) {
        console.error('Form error:', err);

        if (text) text.textContent = 'Try Again';
        if (btn) {
          btn.disabled = false;
          btn.style.opacity = '';
        }
      }
    });
  }

  /* ----------------------------------------------------------
     11. LOAD ANIMATION
  ---------------------------------------------------------- */
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    document.querySelectorAll('.hero .reveal-up')
      .forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), 200 + i * 140);
      });
  });

  console.log('%c The Good Collective ', 'background:#304b3a;color:#c9a96e;font-family:serif;font-size:18px;padding:8px 16px;border:1px solid #c9a96e;');

})();