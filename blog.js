/**
 * AJADI STUDIO - Blog Controller
 * -------------------------------------------------------------
 * Provides lightweight live search, category filtering,
 * interactive geometric ambient canvas, and mobile menu sync.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearElem = document.getElementById('currentYear');
  if (yearElem) yearElem.textContent = new Date().getFullYear();

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // 3. Back to Top Button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Live Search and Category Filter Mechanism
  const searchInput = document.getElementById('blogSearchInput');
  const filterBtns = document.querySelectorAll('.blog-filter-bar .filter-btn');
  const articleCards = document.querySelectorAll('.articles-grid .article-card');
  const featuredContainer = document.getElementById('featuredContainer');
  const noResultsMsg = document.getElementById('noResultsMsg');

  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    articleCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const keywords = card.getAttribute('data-keywords') || '';
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      const summary = card.querySelector('.card-summary').textContent.toLowerCase();

      const matchesCategory = (activeCategory === 'all' || category.toLowerCase() === activeCategory.toLowerCase());
      const matchesSearch = !searchQuery || 
        title.includes(searchQuery) || 
        summary.includes(searchQuery) || 
        keywords.toLowerCase().includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Hide or show the featured section during search/filter
    if (featuredContainer) {
      if (activeCategory === 'all' && !searchQuery) {
        featuredContainer.style.display = 'block';
      } else {
        featuredContainer.style.display = 'none';
      }
    }

    // Toggle "no results" state
    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Filter button listeners
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      applyFilters();
    });
  });

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // 5. Hero Ambient Geometric 3D Particle Mesh (Lightweight 60 FPS Canvas)
  const canvas = document.getElementById('blogCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let points = [];
    const POINT_COUNT = 32;
    const CONNECT_DIST = 160;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
      initPoints();
    }

    function initPoints() {
      points = [];
      for (let i = 0; i < POINT_COUNT; i++) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 1
        });
      }
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const alpha = (1 - (dist / CONNECT_DIST)) * 0.22;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(render);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    render();
  }
});