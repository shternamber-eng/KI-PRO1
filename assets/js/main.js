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
  let lockedScrollY = 0;

  const lockBodyScroll = () => {
    lockedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top    = `-${lockedScrollY}px`;
    document.body.style.width  = '100%';
  };

  const unlockBodyScroll = () => {
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.width    = '';
    window.scrollTo({ top: lockedScrollY, behavior: 'instant' });
  };

  const setMenuOpen = (open) => {
    navLinks.classList.toggle('open', open);
    const [s1, mid, s2] = navToggle.querySelectorAll('span');
    if (open) {
      s1.style.transform  = 'rotate(45deg) translate(5px, 5px)';
      mid.style.opacity   = '0';
      s2.style.transform  = 'rotate(-45deg) translate(5px, -5px)';
      lockBodyScroll();
    } else {
      s1.style.transform  = '';
      mid.style.opacity   = '';
      s2.style.transform  = '';
      unlockBodyScroll();
    }
  };

  navToggle.addEventListener('click', () => {
    setMenuOpen(!navLinks.classList.contains('open'));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
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

// --- Missing photo fallback: "Coming Soon" placeholder ---
const comingSoonSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
  <rect width="800" height="600" fill="#14090a"/>
  <rect x="16" y="16" width="768" height="568" fill="none" stroke="#c8a030" stroke-opacity="0.35"/>
  <text x="400" y="284" font-family="Georgia, serif" font-size="16" letter-spacing="12" fill="#c8a030" text-anchor="middle">&#9670;</text>
  <text x="400" y="330" font-family="Georgia, serif" font-size="28" letter-spacing="4" fill="#ecc85a" text-anchor="middle">COMING SOON</text>
</svg>`;
const comingSoonSrc = `data:image/svg+xml,${encodeURIComponent(comingSoonSVG)}`;

document.addEventListener('error', (e) => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = 'true';
  img.removeAttribute('srcset');
  img.src = comingSoonSrc;
}, true);

// --- Missing hero background-photo fallback ---
document.querySelectorAll('[style*="url("]').forEach(el => {
  const match = (el.getAttribute('style') || '').match(/url\((['"]?)([^'")]+)\1\)/);
  const url = match && match[2];
  if (!url || url.startsWith('data:')) return;

  const probe = new Image();
  probe.onerror = () => {
    const badge = document.createElement('span');
    badge.className = 'bg-photo-missing__badge';
    badge.textContent = 'Photo Coming Soon';
    el.appendChild(badge);
  };
  probe.src = url;
});

// --- Dormitory page image lightbox ---
if (document.body.classList.contains('dormitory-page')) {
  const galleryImages = document.querySelectorAll(
    '.dorm-photo-pair img, .dorm-feature-image img, .dorm-product-card img, .dorm-detail-gallery img, .finish-series__grid img'
  );

  if (galleryImages.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'dorm-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.innerHTML = `
      <div class="dorm-lightbox__panel">
        <button class="dorm-lightbox__close" type="button" aria-label="Close image">&times;</button>
        <img class="dorm-lightbox__img" src="" alt="">
        <div class="dorm-lightbox__caption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.dorm-lightbox__img');
    const lightboxCaption = lightbox.querySelector('.dorm-lightbox__caption');
    const closeBtn = lightbox.querySelector('.dorm-lightbox__close');

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    };

    galleryImages.forEach(img => {
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `Open larger image: ${img.alt || 'Dormitory furniture'}`);

      const openLightbox = () => {
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt || '';
        lightboxCaption.textContent = img.alt || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
      };

      img.addEventListener('click', openLightbox);
      img.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox();
        }
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }
}
