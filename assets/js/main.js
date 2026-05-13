/* KI-PRO Synagogue Furniture — Main JavaScript */

// --- Navigation scroll effect ---
const nav        = document.getElementById('nav');
const navToggle  = document.getElementById('navToggle');
const navLinks   = document.getElementById('navLinks');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 80);
  });
}

// --- Mobile menu toggle ---
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    const [s1, , s2] = navToggle.querySelectorAll('span');
    const mid = navToggle.querySelectorAll('span')[1];
    if (open) {
      s1.style.transform  = 'rotate(45deg) translate(5px, 5px)';
      mid.style.opacity   = '0';
      s2.style.transform  = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      s1.style.transform  = '';
      mid.style.opacity   = '';
      s2.style.transform  = '';
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    });
  });
}

// --- Scroll reveal ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// --- Counter animation ---
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const text  = el.dataset.target || el.textContent;
    const num   = parseFloat(text.replace(/[^0-9.]/g, ''));
    const suffix = text.replace(/[0-9.]/g, '');

    if (!num || isNaN(num)) return;

    const duration  = 1400;
    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(num * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = text;
    };
    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stats__number').forEach(el => {
  el.dataset.target = el.textContent;
  counterObserver.observe(el);
});

// --- Contact form ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent  = '✓ Request Sent — We\'ll Be in Touch Within 24 Hours';
    btn.style.background    = '#1a7a3f';
    btn.style.borderColor   = '#1a7a3f';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent       = original;
      btn.style.background  = '';
      btn.style.borderColor = '';
      btn.disabled          = false;
      contactForm.reset();
    }, 6000);
  });
}

// --- Active nav link: current page ---
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
navLinks && navLinks.querySelectorAll('a:not(.nav__cta)').forEach(link => {
  const href = link.getAttribute('href') || '';
  const linkPage = href.split('/').pop().split('#')[0] || 'index.html';
  if (linkPage === currentPath) link.classList.add('active');
});

// --- Active nav link: scroll-spy for section anchors ---
const spyLinks = navLinks
  ? [...navLinks.querySelectorAll('a[href^="#"], a[href*="index.html#"]')]
  : [];

if (spyLinks.length) {
  const sectionIds = spyLinks
    .map(a => (a.getAttribute('href') || '').split('#')[1])
    .filter(Boolean);

  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const setActive = () => {
    const scrollY = window.scrollY + 120;
    let current = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });
    spyLinks.forEach(a => {
      const id = (a.getAttribute('href') || '').split('#')[1];
      a.classList.toggle('active', id === current && current !== '');
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
}

// --- File input label update ---
document.querySelectorAll('.form__file-area input[type="file"]').forEach(input => {
  input.addEventListener('change', () => {
    const label = input.nextElementSibling;
    if (label && input.files.length > 0) {
      label.textContent = '📎 ' + input.files[0].name;
    }
  });
});
