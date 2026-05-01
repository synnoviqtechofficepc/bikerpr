/**
 * VeloWorks — Dashboard JavaScript
 * Handles: Sidebar toggle, repair tracker, quick actions, widgets
 * Version: 1.0.0 | © 2026 ASR. All Rights Reserved.
 */

'use strict';

/* ============================================================
   SIDEBAR MANAGER (Mobile Optimized)
   ============================================================ */
const SidebarManager = (() => {
  const sidebar = document.querySelector('.dashboard-sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  const overlay = document.getElementById('sidebarOverlay');
  const BREAKPOINT = 1024;

  const isMobile = () => window.innerWidth <= BREAKPOINT;

  const open = () => {
    if (!sidebar || !isMobile()) return;

    sidebar.classList.add('open');
    overlay?.classList.add('active');
    document.body.classList.add('no-scroll');
  };

  const close = () => {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.classList.remove('no-scroll');
  };

  const toggle = () => {
    sidebar?.classList.contains('open') ? close() : open();
  };

  const handleResize = () => {
    if (!isMobile()) {
      close(); // reset when going desktop
    }
  };

  const init = () => {
    if (!sidebar) return;

    toggleBtn?.addEventListener('click', toggle);
    overlay?.addEventListener('click', close);

    // ESC closes sidebar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', handleResize);

    /* Auto-close when clicking a sidebar link (mobile UX) */
    sidebar.querySelectorAll('.sidebar-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (isMobile()) close();
      });
    });

    /* Highlight active page */
    const currentPage = window.location.pathname.split('/').pop();
    sidebar.querySelectorAll('.sidebar-nav-link').forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
  };

  return { init, open, close, toggle };
})();
/* ============================================================
   DASHBOARD TAB SWITCHER (Widget Tabs)
   ============================================================ */
const DashboardTabs = (() => {
  const init = () => {
    document.querySelectorAll('[data-dash-tabs]').forEach(container => {
      const buttons = container.querySelectorAll('.tab-btn');
      const panels = container.querySelectorAll('.tab-panel');

      buttons.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          panels[i]?.classList.add('active');
        });
      });
    });
  };

  return { init };
})();

/* ============================================================
   REPAIR STATUS TRACKER
   ============================================================ */
const RepairTracker = (() => {
  const statuses = {
    intake: { label: 'Intake', step: 0, pct: 10 },
    diagnosed: { label: 'Diagnosed', step: 1, pct: 30 },
    'in-progress': { label: 'In Progress', step: 2, pct: 60 },
    'parts-ordered': { label: 'Parts Ordered', step: 3, pct: 75 },
    ready: { label: 'Ready', step: 4, pct: 100 },
    collected: { label: 'Collected', step: 5, pct: 100 },
  };

  const updateTracker = (trackerId, currentStatus) => {
    const tracker = document.querySelector(`[data-tracker="${trackerId}"]`);
    if (!tracker) return;

    const status = statuses[currentStatus];
    if (!status) return;

    const steps = tracker.querySelectorAll('.timeline__step');
    steps.forEach((step, i) => {
      step.classList.remove('done', 'active');
      if (i < status.step) step.classList.add('done');
      if (i === status.step) step.classList.add('active');
    });

    const progressBar = tracker.querySelector('.repair-progress__bar');
    if (progressBar) {
      setTimeout(() => {
        progressBar.style.width = `${status.pct}%`;
      }, 300);
    }

    const statusLabel = tracker.querySelector('.current-status-label');
    if (statusLabel) statusLabel.textContent = status.label;
  };

  const init = () => {
    document.querySelectorAll('[data-tracker]').forEach(tracker => {
      const status = tracker.dataset.status || 'intake';
      const id = tracker.dataset.tracker;
      updateTracker(id, status);
    });
  };

  return { init, updateTracker };
})();

/* ============================================================
   BOOKING QUICK ACTIONS
   ============================================================ */
const QuickActions = (() => {
  const handleCancelBooking = (bookingId) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      const item = document.querySelector(`[data-booking-id="${bookingId}"]`);
      if (item) {
        item.style.opacity = '0.5';
        item.style.pointerEvents = 'none';
        const badge = item.querySelector('.badge');
        if (badge) {
          badge.className = 'badge badge--neutral';
          badge.textContent = 'Cancelled';
        }
        window.VeloWorks?.Toast?.show('Booking cancelled successfully.', 'success');
      }
    }
  };

  const handleRebookAction = (bikeModel) => {
    window.VeloWorks?.Toast?.show(`Redirecting to book ${bikeModel}...`, 'info');
    setTimeout(() => { window.location.href = 'bookings.html'; }, 1200);
  };

  const handleDownloadInvoice = (invoiceId) => {
    window.VeloWorks?.Toast?.show(`Downloading invoice #${invoiceId}...`, 'info');
  };

  const init = () => {
    document.querySelectorAll('[data-action="cancel-booking"]').forEach(btn => {
      btn.addEventListener('click', () => {
        handleCancelBooking(btn.dataset.id);
      });
    });

    document.querySelectorAll('[data-action="rebook"]').forEach(btn => {
      btn.addEventListener('click', () => {
        handleRebookAction(btn.dataset.bike || 'bike');
      });
    });

    document.querySelectorAll('[data-action="download-invoice"]').forEach(btn => {
      btn.addEventListener('click', () => {
        handleDownloadInvoice(btn.dataset.id);
      });
    });
  };

  return { init };
})();

/* ============================================================
   ACCOUNT SETTINGS FORM
   ============================================================ */
const AccountSettings = (() => {
  const init = () => {
    const form = document.getElementById('accountSettingsForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Saving…';
      btn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        btn.textContent = '✓ Saved';
        window.VeloWorks?.Toast?.show('Account settings updated successfully.', 'success');
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 2000);
      }, 1200);
    });

    // Notification toggles
    document.querySelectorAll('.notification-toggle').forEach(toggle => {
      toggle.addEventListener('change', () => {
        const label = toggle.dataset.label || 'Notification';
        const state = toggle.checked ? 'enabled' : 'disabled';
        window.VeloWorks?.Toast?.show(`${label} ${state}.`, 'info');
      });
    });
  };

  return { init };
})();

/* ============================================================
   MEMBERSHIP PROGRESS
   ============================================================ */
const MembershipWidget = (() => {
  const init = () => {
    const widget = document.querySelector('.membership-progress-widget');
    if (!widget) return;

    const bar = widget.querySelector('.repair-progress__bar');
    const ridesTaken = parseInt(widget.dataset.rides || 0);
    const ridesTotal = parseInt(widget.dataset.ridesTotal || 10);
    const pct = Math.min(100, (ridesTaken / ridesTotal) * 100);

    if (bar) {
      setTimeout(() => {
        bar.style.width = `${pct}%`;
        bar.setAttribute('data-width', `${pct}%`);
      }, 400);
    }
  };

  return { init };
})();

/* ============================================================
   SAVED BIKES CAROUSEL
   ============================================================ */
const SavedBikes = (() => {
  const init = () => {
    const container = document.querySelector('.saved-bikes-scroll');
    if (!container) return;

    const leftBtn = container.parentElement.querySelector('.scroll-left');
    const rightBtn = container.parentElement.querySelector('.scroll-right');

    leftBtn?.addEventListener('click', () => {
      container.scrollBy({ left: -280, behavior: 'smooth' });
    });

    rightBtn?.addEventListener('click', () => {
      container.scrollBy({ left: 280, behavior: 'smooth' });
    });

  };

  return { init };
})();

/* ============================================================
   MINI CHART (Pure CSS/JS SVG Chart)
   ============================================================ */
const MiniChart = (() => {
  const buildSparkline = (container, data, color = '#16A34A') => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = container.offsetWidth || 200;
    const h = 60;
    const padding = 4;

    const points = data.map((v, i) => {
      const x = padding + (i / (data.length - 1)) * (w - padding * 2);
      const y = h - padding - ((v - min) / range) * (h - padding * 2);
      return `${x},${y}`;
    }).join(' ');

    const svg = `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="${points}" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <polygon points="${points} ${w - padding},${h} ${padding},${h}" fill="${color}" opacity="0.08"/>
      </svg>
    `;

    container.innerHTML = svg;
  };

  const init = () => {
    document.querySelectorAll('[data-chart]').forEach(el => {
      const data = JSON.parse(el.dataset.chart || '[]');
      const color = el.dataset.chartColor || '#16A34A';
      if (data.length > 1) buildSparkline(el, data, color);
    });
  };

  return { init, buildSparkline };
})();

/* ============================================================
   LOGOUT CONFIRMATION
   ============================================================ */
const LogoutHandler = (() => {
  const init = () => {
    document.querySelectorAll('[data-action="logout"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to sign out?')) {
          window.VeloWorks?.Toast?.show('Signing you out...', 'info');
          setTimeout(() => {
            window.location.href = 'home-community.html';
          }, 1000);
        }
      });
    });
  };

  return { init };
})();

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  SidebarManager.init();
  DashboardTabs.init();
  RepairTracker.init();
  QuickActions.init();
  AccountSettings.init();
  MembershipWidget.init();
  SavedBikes.init();
  MiniChart.init();
  LogoutHandler.init();
});

window.VeloDash = { SidebarManager, RepairTracker, MiniChart };
