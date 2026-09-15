/**
 * AJADI STUDIO - Core Application Scripts
 * -------------------------------------------------------------
 * Contains header mechanics, verified social profile rendering,
 * portfolio filtering, high-resolution lightbox, lightweight ambient canvas,
 * and secure contact submission routing.
 */

// =============================================================
// 1. OFFICIAL SOCIAL LINKS & ICONS
// Only verified profiles are registered here.
// =============================================================
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/ajadistudio",
  behance: "https://www.behance.net/ajadistudio",
  artstation: "https://www.artstation.com/ajadistudio"
};

const SOCIAL_ICONS = {
  instagram: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
  behance: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.2 11.8c.8-.3 1.4-.9 1.4-1.9 0-1.8-1.4-2.4-3.1-2.4H1.5v8.9h5.1c2 0 3.5-.8 3.5-2.7 0-1.1-.7-1.7-1.9-1.9zm-3.8-2.6h2c.8 0 1.4.2 1.4.9 0 .8-.6 1-1.4 1h-2v-1.9zm2.2 5H4.4v-2.1h2.2c.9 0 1.6.2 1.6 1.1 0 .9-.7 1-1.6 1zm11.7-2.6c0-2.3-1.6-3.8-3.9-3.8-2.4 0-4.1 1.7-4.1 4s1.6 4.1 4.2 4.1c1.9 0 3.2-.9 3.7-2.2h-2.1c-.3.4-1 .7-1.6.7-1.1 0-1.8-.7-2-1.8h5.8zm-5.8-1.1c.2-.9.8-1.5 1.9-1.5s1.7.6 1.8 1.5h-3.7zM14 6.5h4v1.2h-4z"/></svg>`,
  artstation: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M0 17.723l2.027 3.504a2.41 2.41 0 0 0 2.086 1.205h12.186l-2.5-4.709H0zm8.016-5.467l3.99-6.906 3.99 6.906H8.016zm13.987 4.709a2.404 2.404 0 0 0-.256-1.218L16.03 5.485a2.41 2.41 0 0 0-2.086-1.205l5.72 10.368 2.339 3.076z"/></svg>`
};

function renderSocialLinks() {
  const contactContainer = document.getElementById('contactSocialContainer');
  const contactList = document.getElementById('contactSocialLinks');
  const footerList = document.getElementById('footerSocialLinks');

  const platforms = Object.entries(SOCIAL_LINKS).filter(([, url]) => typeof url === 'string' && url.trim() !== '');

  if (platforms.length === 0) {
    if (contactContainer) contactContainer.classList.remove('active');
    return;
  }

  // Clear existing children to prevent duplicate appends
  if (contactList) contactList.innerHTML = '';
  if (footerList) footerList.innerHTML = '';

  platforms.forEach(([platform, url]) => {
    const linkElem = document.createElement('a');
    linkElem.href = url.trim();
    linkElem.target = '_blank';
    linkElem.rel = 'noopener noreferrer';
    linkElem.className = 'social-icon-btn';
    
    // Capitalize platform name for accessible labeling
    const platformLabel = platform === 'artstation' ? 'ArtStation' : (platform.charAt(0).toUpperCase() + platform.slice(1));
    linkElem.setAttribute('aria-label', `AJADI STUDIO on ${platformLabel}`);
    linkElem.innerHTML = SOCIAL_ICONS[platform] || '';

    if (contactList) contactList.appendChild(linkElem.cloneNode(true));
    if (footerList) footerList.appendChild(linkElem);
  });

  if (contactContainer) {
    contactContainer.classList.add('active');
  }
}

// =============================================================
// 2. UI HELPERS & NAVIGATION
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Set current copyright year
  const yearElem = document.getElementById('currentYear');
  if (yearElem) yearElem.textContent = new Date().getFullYear();

  // Populate official social profiles
  renderSocialLinks();

  // Sticky Header on Scroll
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Back to Top button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// =============================================================
// 3. PORTFOLIO FILTERING
// =============================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filterVal = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filterVal === 'all' || category === filterVal) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// =============================================================
// 4. HIGH-RESOLUTION LIGHTBOX GALLERY
// =============================================================
const lightboxModal = document.getElementById('lightboxModal');
const lightboxActiveImg = document.getElementById('lightboxActiveImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');

let currentGallery = [];
let activeImageIndex = 0;

function openLightbox(gallery, index, title, desc) {
  currentGallery = gallery;
  activeImageIndex = index;
  lightboxTitle.textContent = title;
  lightboxDesc.textContent = desc;
  updateLightboxImage();
  lightboxModal.classList.add('active');
  lightboxModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function updateLightboxImage() {
  lightboxActiveImg.src = currentGallery[activeImageIndex];
  lightboxCounter.textContent = `${activeImageIndex + 1} / ${currentGallery.length}`;
  
  if (currentGallery.length <= 1) {
    lightboxPrev.style.display = 'none';
    lightboxNext.style.display = 'none';
  } else {
    lightboxPrev.style.display = 'flex';
    lightboxNext.style.display = 'flex';
  }
}

function closeLightbox() {
  lightboxModal.classList.remove('active');
  lightboxModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lightboxActiveImg.src = '';
}

projectCards.forEach(card => {
  card.addEventListener('click', () => {
    const gallery = JSON.parse(card.getAttribute('data-gallery'));
    const title = card.getAttribute('data-title');
    const desc = card.getAttribute('data-desc');
    openLightbox(gallery, 0, title, desc);
  });
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

if (lightboxPrev) {
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    activeImageIndex = (activeImageIndex - 1 + currentGallery.length) % currentGallery.length;
    updateLightboxImage();
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    activeImageIndex = (activeImageIndex + 1) % currentGallery.length;
    updateLightboxImage();
  });
}

if (lightboxModal) {
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });
}

document.addEventListener('keydown', (e) => {
  if (!lightboxModal.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft' && currentGallery.length > 1) {
    activeImageIndex = (activeImageIndex - 1 + currentGallery.length) % currentGallery.length;
    updateLightboxImage();
  }
  if (e.key === 'ArrowRight' && currentGallery.length > 1) {
    activeImageIndex = (activeImageIndex + 1) % currentGallery.length;
    updateLightboxImage();
  }
});

// =============================================================
// 5. REAL CONTACT INQUIRY SUBMISSION
// Secure, production-ready form submission to /api/contact
// =============================================================
const inquiryForm = document.getElementById('inquiryForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccessMsg = document.getElementById('formSuccessMsg');
const formErrorMsg = document.getElementById('formErrorMsg');
const formErrorText = document.getElementById('formErrorText');

if (inquiryForm) {
  inquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    formSuccessMsg.style.display = 'none';
    formErrorMsg.style.display = 'none';

    // Anti-spam honeypot verification
    const honeypot = document.getElementById('form_website_hp').value;
    if (honeypot) {
      console.warn('Bot submission rejected.');
      return;
    }

    const payload = {
      name: document.getElementById('userName').value.trim(),
      email: document.getElementById('userEmail').value.trim(),
      projectType: document.getElementById('projectType').value,
      description: document.getElementById('projectDesc').value.trim(),
      referenceUrl: document.getElementById('referenceUrl').value.trim(),
      deadline: document.getElementById('projectDeadline').value.trim(),
      budget: document.getElementById('projectBudget').value,
      additionalInfo: document.getElementById('additionalInfo').value.trim()
    };

    if (!payload.name || !payload.email || !payload.projectType || !payload.description) {
      showFormError('Please fill in all required fields (Name, Email, Category, and Scope).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      showFormError('Please enter a valid email address.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    const originalBtnText = submitBtn.querySelector('.btn-text').textContent;
    submitBtn.querySelector('.btn-text').textContent = 'Sending Inquiry...';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        formSuccessMsg.style.display = 'block';
        inquiryForm.reset();
        formSuccessMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        const errorDetail = result.message || 'We were unable to deliver your brief. Please try again or email us directly.';
        showFormError(errorDetail);
      }
    } catch (err) {
      console.error('Submission network failure:', err);
      showFormError('Network connection issue. Please verify your connection or email your requirements directly to ajadistudioo@gmail.com.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.querySelector('.btn-text').textContent = originalBtnText;
    }
  });
}

function showFormError(message) {
  if (formErrorMsg && formErrorText) {
    formErrorText.textContent = message;
    formErrorMsg.style.display = 'block';
    formErrorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// =============================================================
// 6. HERO AMBIENT GEOMETRIC CANVAS
// Lightweight vanilla network mesh running at 60 FPS
// =============================================================
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height, points = [];
  const POINT_COUNT = 38;
  const CONNECT_DISTANCE = 170;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initPoints();
  }

  function initPoints() {
    points = [];
    for (let i = 0; i < POINT_COUNT; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45
      });
    }
  }

  function renderCanvas() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DISTANCE) {
          const alpha = 1 - (dist / CONNECT_DISTANCE);
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(renderCanvas);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  renderCanvas();
}