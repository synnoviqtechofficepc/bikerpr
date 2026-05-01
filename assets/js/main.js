/**
 * VeloWorks Bike Shop — Main JavaScript
 * Handles: Navigation, Theme, Animations, Accordions, Tabs, Toasts
 * Version: 1.0.0 | © 2026 ASR. All Rights Reserved.
 */

'use strict';

/* ============================================================
   THEME MANAGER
   ============================================================ */
const ThemeManager = (() => {
  const STORAGE_KEY = 'veloworks-theme';
  const toggleBtn = document.getElementById('themeToggle');

  const getSystemPreference = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const getSavedTheme = () =>
    localStorage.getItem(STORAGE_KEY);

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleIcon(theme);
  };

  const updateToggleIcon = (theme) => {
    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector('.theme-icon');
    if (icon) {
      icon.innerHTML = theme === 'dark' ? '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"theme-icon-svg\"><circle cx=\"12\" cy=\"12\" r=\"5\"/><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"3\"/><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"23\"/><line x1=\"4.22\" y1=\"4.22\" x2=\"5.64\" y2=\"5.64\"/><line x1=\"18.36\" y1=\"18.36\" x2=\"19.78\" y2=\"19.78\"/><line x1=\"1\" y1=\"12\" x2=\"3\" y2=\"12\"/><line x1=\"21\" y1=\"12\" x2=\"23\" y2=\"12\"/><line x1=\"4.22\" y1=\"19.78\" x2=\"5.64\" y2=\"18.36\"/><line x1=\"18.36\" y1=\"5.64\" x2=\"19.78\" y2=\"4.22\"/></svg>' : '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"theme-icon-svg\"><path d=\"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z\"/></svg>';
    }
    toggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  };

  const init = () => {
    const saved = getSavedTheme();
    const theme = saved || getSystemPreference();
    applyTheme(theme);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    // Listen for system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!getSavedTheme()) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  };

  return { init };
})();

/* ============================================================
   HEADER & NAVIGATION
   ============================================================ */
const Navigation = (() => {
  const header = document.getElementById('siteHeader');
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  let lastScrollY = 0;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    lastScrollY = scrollY;
  };

  const initHamburger = () => {
    if (!hamburger || !mainNav) return;

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mainNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('open') &&
          !mainNav.contains(e.target) &&
          !hamburger.contains(e.target)) {
        closeNav();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        closeNav();
        hamburger.focus();
      }
    });
  };

  const closeNav = () => {
    hamburger.classList.remove('open');
    mainNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const initDropdowns = () => {
    const dropdownItems = document.querySelectorAll('.has-dropdown');

    dropdownItems.forEach(item => {
      const trigger = item.querySelector('.dropdown-trigger');
      const menu = item.querySelector('.dropdown-menu');
      if (!trigger || !menu) return;

      // Keyboard support
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.classList.toggle('open');
          trigger.setAttribute('aria-expanded', item.classList.contains('open'));
        }
        if (e.key === 'Escape') {
          item.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        }
      });

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!item.contains(e.target)) {
          item.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Arrow key navigation within dropdown
      menu.addEventListener('keydown', (e) => {
        const links = [...menu.querySelectorAll('.dropdown-link')];
        const idx = links.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          links[(idx + 1) % links.length]?.focus();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          links[(idx - 1 + links.length) % links.length]?.focus();
        }
        if (e.key === 'Escape') {
          item.classList.remove('open');
          trigger.focus();
        }
      });
    });
  };

  const setActiveLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'home-community.html';
    document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === currentPage || href.endsWith(currentPage)) {
        link.classList.add('active');
        const parentItem = link.closest('.has-dropdown');
        if (parentItem) {
          const trigger = parentItem.querySelector('.nav-link');
          if (trigger) trigger.classList.add('active');
        }
      }
    });
  };

  const init = () => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    initHamburger();
    initDropdowns();
    setActiveLink();

    // Close mobile nav when viewport widens past 1024px
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > 1024 && mainNav && mainNav.classList.contains('open')) {
        closeNav();
      }
    }, 150));
  };

  return { init, closeNav };
})();

/* ============================================================
   ACCORDION
   ============================================================ */
const Accordion = (() => {
  const init = () => {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const isOpen = item.classList.contains('open');

        // Close all others (optional: comment out for multi-open)
        document.querySelectorAll('.accordion-item.open').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
          }
        });

        item.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen);
      });

      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger.click();
        }
      });
    });
  };

  return { init };
})();

/* ============================================================
   TABS
   ============================================================ */
const Tabs = (() => {
  const init = (containerSelector = '[data-tabs]') => {
    document.querySelectorAll(containerSelector).forEach(container => {
      const buttons = container.querySelectorAll('.tab-btn');
      const panels = container.querySelectorAll('.tab-panel');

      buttons.forEach((btn, i) => {
        btn.addEventListener('click', () => activate(buttons, panels, i));

        btn.addEventListener('keydown', (e) => {
          let targetIdx = i;
          if (e.key === 'ArrowRight') targetIdx = (i + 1) % buttons.length;
          if (e.key === 'ArrowLeft') targetIdx = (i - 1 + buttons.length) % buttons.length;
          if (e.key === 'Home') targetIdx = 0;
          if (e.key === 'End') targetIdx = buttons.length - 1;

          if (targetIdx !== i) {
            e.preventDefault();
            activate(buttons, panels, targetIdx);
            buttons[targetIdx].focus();
          }
        });
      });
    });
  };

  const activate = (buttons, panels, idx) => {
    buttons.forEach((b, i) => {
      b.classList.toggle('active', i === idx);
      b.setAttribute('aria-selected', i === idx);
    });
    panels.forEach((p, i) => {
      p.classList.toggle('active', i === idx);
    });
  };

  return { init };
})();

/* ============================================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================================ */
const ScrollAnimations = (() => {
  const isMobile = () => window.innerWidth <= 640;

  const init = () => {
    if (!('IntersectionObserver' in window)) return;

    // ── Scroll fade-in animations (desktop only) ──
    // On mobile, skip opacity/transform so elements are always visible
    if (!isMobile()) {
      const elements = document.querySelectorAll(
        '.card, .service-card, .stat-card, .tier-card, .testimonial-card, .team-card, .process-step, .timeline__step, .animate-on-scroll'
      );

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
      });
    }

    // ── Stat counter animation (always runs on all screen sizes) ──
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(c => counterObserver.observe(c));
  };

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  };

  return { init };
})();

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
const Toast = (() => {
  let container;

  const getContainer = () => {
    if (!container) {
      container = document.querySelector('.toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'false');
        document.body.appendChild(container);
      }
    }
    return container;
  };

  const show = (message, type = 'success', duration = 4000) => {
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    const c = getContainer();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span style="font-size:18px">${icons[type] || icons.info}</span>
      <span>${message}</span>
      <button onclick="this.parentElement.remove()" style="margin-left:auto;background:none;border:none;cursor:pointer;color:inherit;font-size:18px;line-height:1;padding:0 0 0 8px;" aria-label="Dismiss">×</button>
    `;

    c.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  return { show };
})();

/* ============================================================
   IMAGE LAZY LOADING
   ============================================================ */
const LazyImages = (() => {
  const init = () => {
    if (!('IntersectionObserver' in window)) return;

    const images = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => observer.observe(img));
  };

  return { init };
})();

/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
const SmoothScroll = (() => {
  const init = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const headerHeight = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--header-height')
          ) || 72;
          const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      });
    });
  };

  return { init };
})();

/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
const Lightbox = (() => {
  let overlay, img, closeBtn;
  let isOpen = false;

  const create = () => {
    overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);
      display:flex;align-items:center;justify-content:center;cursor:zoom-out;
      opacity:0;transition:opacity 0.25s ease;
    `;

    img = document.createElement('img');
    img.style.cssText = `
      max-width:90vw;max-height:90vh;object-fit:contain;
      border-radius:8px;transform:scale(0.92);transition:transform 0.3s ease;
    `;

    closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close lightbox');
    closeBtn.style.cssText = `
      position:absolute;top:24px;right:24px;background:rgba(255,255,255,0.15);
      border:1px solid rgba(255,255,255,0.3);color:#fff;font-size:28px;
      width:48px;height:48px;border-radius:50%;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      transition:background 0.2s;
    `;
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.background = 'rgba(255,255,255,0.25)');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.background = 'rgba(255,255,255,0.15)');

    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) close(); });
  };

  const open = (src, alt = '') => {
    if (!overlay) create();
    img.src = src;
    img.alt = alt;
    overlay.style.display = 'flex';
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      img.style.transform = 'scale(1)';
    });
    document.body.style.overflow = 'hidden';
    isOpen = true;
    closeBtn.focus();
  };

  const close = () => {
    overlay.style.opacity = '0';
    img.style.transform = 'scale(0.92)';
    setTimeout(() => { overlay.style.display = 'none'; }, 250);
    document.body.style.overflow = '';
    isOpen = false;
  };

  const init = () => {
    document.querySelectorAll('.gallery-item[data-lightbox]').forEach(item => {
      item.style.cursor = 'zoom-in';
      item.addEventListener('click', () => {
        const src = item.querySelector('img')?.src;
        const alt = item.querySelector('img')?.alt;
        if (src) open(src, alt);
      });
    });
  };

  return { init, open };
})();

/* ============================================================
   REPAIR PROGRESS BARS
   ============================================================ */
const ProgressBars = (() => {
  const init = () => {
    if (!('IntersectionObserver' in window)) return;

    const bars = document.querySelectorAll('.repair-progress__bar[data-width]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-width');
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 200);
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => {
      bar.style.width = '0%';
      observer.observe(bar);
    });
  };

  return { init };
})();

/* ============================================================
   BACK TO TOP
   ============================================================ */
const BackToTop = (() => {
  const init = () => {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return { init };
})();

/* ============================================================
   UTILITY: Debounce
   ============================================================ */
const debounce = (fn, delay = 200) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/* ============================================================
   INIT — DOM Ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Navigation.init();
  Accordion.init();
  Tabs.init('[data-tabs]');
  ScrollAnimations.init();
  LazyImages.init();
  SmoothScroll.init();
  Lightbox.init();
  ProgressBars.init();
  BackToTop.init();

  // Add back to top button if not in HTML
  if (!document.getElementById('backToTop')) {
    const btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '↑';
    btn.style.cssText = `
      position:fixed;bottom:32px;right:32px;width:44px;height:44px;
      border-radius:50%;background:var(--clr-primary);color:#fff;
      border:none;cursor:pointer;font-size:20px;font-weight:700;
      display:none;align-items:center;justify-content:center;
      box-shadow:var(--shadow-primary);z-index:var(--z-toast);
      transition:all 0.2s ease;
    `;
    btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-3px)');
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
    document.body.appendChild(btn);
    BackToTop.init();
  }
});

// --- RTL PERSISTENCE LOGIC ---

const langBtn = document.getElementById('langToggle');

// Function to apply direction and save it
const applyDirection = (dir) => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    localStorage.setItem('velo-direction', dir); // Saves to browser memory
};

// Toggle event listener
langBtn.addEventListener('click', () => {
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    const newDir = isRtl ? 'ltr' : 'rtl';
    applyDirection(newDir);
});

// Check for saved preference as soon as page starts loading
(function() {
    const savedDir = localStorage.getItem('velo-direction');
    if (savedDir) {
        applyDirection(savedDir);
    }
})();

const closeMenuBtn = document.getElementById("closeMenu");
if (closeMenuBtn) {
  closeMenuBtn.addEventListener("click", () => {
    const nav = document.getElementById("mainNav");
    const hbg = document.getElementById("hamburger");
    if (nav) nav.classList.remove("open");
    if (hbg) {
      hbg.classList.remove("open");
      hbg.setAttribute("aria-expanded", "false");
    }
    document.body.style.overflow = "";
  });
}
// Expose globally for HTML onclick handlers
window.VeloWorks = { Toast, Lightbox, ThemeManager };
