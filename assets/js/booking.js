/**
 * VeloWorks — Booking JavaScript
 * Handles: Calendar, time slots, service selection, multi-step form
 * Version: 1.0.0 | © 2026 ASR. All Rights Reserved.
 */

'use strict';

/* ============================================================
   CALENDAR WIDGET
   ============================================================ */
const BookingCalendar = (() => {
  let currentDate = new Date();
  let selectedDate = null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Dates with availability (for demo)
  const availableDates = new Set();
  for (let i = 1; i <= 28; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    if (d.getDay() !== 0) availableDates.add(d.toDateString()); // no Sundays
  }

  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const render = (container) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    let html = `
      <div class="calendar-nav" style="display:flex;align-items:center;justify-content:space-between;padding:16px;border-bottom:1px solid var(--clr-border);">
        <button class="btn btn--ghost btn--sm cal-prev" aria-label="Previous month">&#8592;</button>
        <span style="font-weight:700;font-size:var(--fs-base)">${monthNames[month]} ${year}</span>
        <button class="btn btn--ghost btn--sm cal-next" aria-label="Next month">&#8594;</button>
      </div>
      <div class="calendar-header">
        ${dayNames.map(d => `<div class="calendar-header-cell">${d}</div>`).join('')}
      </div>
      <div class="calendar-grid">
    `;

    // Previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
      html += `<div class="calendar-cell other-month"><span class="calendar-cell__day">${daysInPrev - i}</span></div>`;
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0,0,0,0);
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today;
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isAvailable = availableDates.has(date.toDateString());

      let classes = 'calendar-cell';
      if (isToday) classes += ' today';
      if (isPast) classes += ' disabled';
      if (isSelected) classes += ' selected';

      const avail = !isPast && isAvailable ? `<span class="calendar-cell__avail">avail</span>` : '';

      html += `
        <div class="${classes}" data-date="${date.toISOString()}" ${isPast ? '' : 'tabindex="0"'} role="gridcell" aria-label="${monthNames[month]} ${day}, ${year}${isAvailable && !isPast ? ', available' : ''}${isPast ? ', unavailable' : ''}">
          <span class="calendar-cell__day">${day}</span>
          ${avail}
        </div>
      `;
    }

    // Fill remaining cells
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remaining = totalCells - (firstDay + daysInMonth);
    for (let i = 1; i <= remaining; i++) {
      html += `<div class="calendar-cell other-month"><span class="calendar-cell__day">${i}</span></div>`;
    }

    html += '</div>';
    container.innerHTML = html;

    // Bind navigation
    container.querySelector('.cal-prev').addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      render(container);
    });

    container.querySelector('.cal-next').addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      render(container);
    });

    // Bind date selection
    container.querySelectorAll('.calendar-cell:not(.disabled):not(.other-month)').forEach(cell => {
      cell.addEventListener('click', () => selectDate(cell, container));
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectDate(cell, container);
        }
      });
    });
  };

  const selectDate = (cell, container) => {
    container.querySelectorAll('.calendar-cell').forEach(c => c.classList.remove('selected'));
    cell.classList.add('selected');
    selectedDate = new Date(cell.dataset.date);
    updateSelectedDateDisplay(selectedDate);

    // Trigger time slot update
    document.dispatchEvent(new CustomEvent('dateSelected', {
      detail: { date: selectedDate }
    }));
  };

  const updateSelectedDateDisplay = (date) => {
    const displays = document.querySelectorAll('[data-selected-date]');
    displays.forEach(el => {
      el.textContent = date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    });
  };

  const getSelected = () => selectedDate;

  const init = () => {
    const container = document.querySelector('.booking-calendar');
    if (!container) return;
    render(container);
  };

  return { init, getSelected };
})();

/* ============================================================
   TIME SLOT PICKER
   ============================================================ */
const TimeSlots = (() => {
  let selectedSlot = null;

  const slots = [
    { time: '8:00 AM',  available: true },
    { time: '9:00 AM',  available: true },
    { time: '10:00 AM', available: false },
    { time: '11:00 AM', available: true },
    { time: '12:00 PM', available: false },
    { time: '1:00 PM',  available: true },
    { time: '2:00 PM',  available: true },
    { time: '3:00 PM',  available: false },
    { time: '4:00 PM',  available: true },
    { time: '5:00 PM',  available: true },
    { time: '6:00 PM',  available: true },
  ];

  const render = (container, availOverride = null) => {
    const slotsToRender = availOverride || slots;
    container.innerHTML = slotsToRender.map(slot => `
      <div class="time-slot ${!slot.available ? 'unavailable' : ''} ${selectedSlot === slot.time ? 'selected' : ''}"
           data-time="${slot.time}"
           role="option"
           aria-selected="${selectedSlot === slot.time}"
           ${slot.available ? 'tabindex="0"' : 'aria-disabled="true"'}>
        ${slot.time}
      </div>
    `).join('');

    if (slot.available) {
      container.querySelectorAll('.time-slot:not(.unavailable)').forEach(el => {
        el.addEventListener('click', () => selectSlot(el, container));
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectSlot(el, container);
          }
        });
      });
    }
  };

  const selectSlot = (el, container) => {
    container.querySelectorAll('.time-slot').forEach(s => {
      s.classList.remove('selected');
      s.setAttribute('aria-selected', 'false');
    });
    el.classList.add('selected');
    el.setAttribute('aria-selected', 'true');
    selectedSlot = el.dataset.time;

    const displays = document.querySelectorAll('[data-selected-time]');
    displays.forEach(d => d.textContent = selectedSlot);

    document.dispatchEvent(new CustomEvent('timeSelected', {
      detail: { time: selectedSlot }
    }));
  };

  const getSelected = () => selectedSlot;

  const init = () => {
    const container = document.querySelector('.time-slot-grid');
    if (!container) return;
    render(container);

    // Refresh on date selection
    document.addEventListener('dateSelected', () => {
      // Randomize availability for demo
      const shuffled = slots.map(s => ({
        ...s,
        available: Math.random() > 0.35
      }));
      selectedSlot = null;
      render(container, shuffled);
    });
  };

  return { init, getSelected };
})();

/* ============================================================
   SERVICE SELECTION
   ============================================================ */
const ServiceSelector = (() => {
  let selectedService = null;

  const init = () => {
    document.querySelectorAll('.service-select-card').forEach(card => {
      card.addEventListener('click', () => select(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select(card);
        }
      });
    });
  };

  const select = (card) => {
    document.querySelectorAll('.service-select-card').forEach(c => {
      c.classList.remove('selected');
      c.setAttribute('aria-checked', 'false');
    });
    card.classList.add('selected');
    card.setAttribute('aria-checked', 'true');
    selectedService = card.dataset.service;

    const displays = document.querySelectorAll('[data-selected-service]');
    displays.forEach(d => d.textContent = card.querySelector('h4')?.textContent || selectedService);

    document.dispatchEvent(new CustomEvent('serviceSelected', {
      detail: { service: selectedService }
    }));
  };

  const getSelected = () => selectedService;

  return { init, getSelected };
})();

/* ============================================================
   MULTI-STEP BOOKING FORM
   ============================================================ */
const MultiStepForm = (() => {
  let currentStep = 1;
  let totalSteps = 0;

  const init = () => {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    const steps = form.querySelectorAll('.booking-form-step');
    const nextBtns = form.querySelectorAll('[data-next-step]');
    const prevBtns = form.querySelectorAll('[data-prev-step]');
    const progressSteps = document.querySelectorAll('.booking-progress-step');
    totalSteps = steps.length;

    const showStep = (n) => {
      steps.forEach((s, i) => {
        s.style.display = i + 1 === n ? 'block' : 'none';
      });
      progressSteps.forEach((s, i) => {
        s.classList.remove('done', 'active');
        if (i + 1 < n) s.classList.add('done');
        if (i + 1 === n) s.classList.add('active');
      });
      updateSummary();
    };

    const validate = (step) => {
      const stepEl = form.querySelector(`.booking-form-step:nth-child(${step})`);
      if (!stepEl) return true;
      const required = stepEl.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('form-control--error');
          valid = false;
        } else {
          field.classList.remove('form-control--error');
        }
      });
      if (!valid) window.VeloWorks?.Toast?.show('Please fill in all required fields.', 'error');
      return valid;
    };

    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!validate(currentStep)) return;
        if (currentStep < totalSteps) {
          currentStep++;
          showStep(currentStep);
          window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
        }
      });
    });

    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          showStep(currentStep);
        }
      });
    });

    showStep(1);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSubmit(form);
    });
  };

  const updateSummary = () => {
    const date = BookingCalendar.getSelected();
    const time = TimeSlots.getSelected();
    const service = ServiceSelector.getSelected();

    const dateEl = document.querySelector('.summary-date');
    const timeEl = document.querySelector('.summary-time');
    const serviceEl = document.querySelector('.summary-service');

    if (dateEl && date) {
      dateEl.textContent = date.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
      });
    }
    if (timeEl && time) timeEl.textContent = time;
    if (serviceEl && service) serviceEl.textContent = service;
  };

  const handleSubmit = (form) => {
    const submitBtn = form.querySelector('[type="submit"]');
    if (!submitBtn) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Confirming…';

    setTimeout(() => {
      const confirmation = document.getElementById('bookingConfirmation');
      if (confirmation) {
        form.style.display = 'none';
        confirmation.style.display = 'block';
        confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.VeloWorks?.Toast?.show('Booking confirmed! Check your email for details.', 'success');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Book Now';
      }

      // Generate confirmation number
      const confNum = document.querySelector('[data-conf-num]');
      if (confNum) confNum.textContent = '#VW-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }, 1600);
  };

  return { init };
})();

/* ============================================================
   RENTAL AVAILABILITY GRID
   ============================================================ */
const RentalGrid = (() => {
  const bikes = [
    { id: 'mtb-trail', name: 'Trail Blazer MTB', type: 'Mountain', slots: [true,true,false,true,true,false,true] },
    { id: 'city-cruiser', name: 'City Cruiser', type: 'City', slots: [true,false,true,true,false,true,true] },
    { id: 'road-sprint', name: 'Road Sprint 500', type: 'Road', slots: [false,true,true,false,true,true,false] },
    { id: 'e-commuter', name: 'E-Commuter Pro', type: 'Electric', slots: [true,true,true,false,false,true,true] },
  ];

  const timeLabels = ['9am','10am','11am','12pm','1pm','2pm','3pm'];

  const render = (container) => {
    if (!container) return;

    let html = `
      <div style="display:grid;grid-template-columns:160px repeat(7,1fr);gap:2px;border:1px solid var(--clr-border);border-radius:var(--radius-md);overflow:hidden">
        <div style="padding:12px 16px;background:var(--clr-bg-muted);font-size:var(--fs-xs);font-weight:700;color:var(--clr-text-muted);text-transform:uppercase;letter-spacing:0.05em;">Bike Model</div>
        ${timeLabels.map(t => `<div style="padding:12px 8px;background:var(--clr-bg-muted);font-size:var(--fs-xs);font-weight:700;color:var(--clr-text-muted);text-align:center;text-transform:uppercase;letter-spacing:0.05em;">${t}</div>`).join('')}
    `;

    bikes.forEach(bike => {
      html += `
        <div style="padding:12px 16px;background:var(--clr-surface);border-top:1px solid var(--clr-border);">
          <div style="font-size:var(--fs-sm);font-weight:600;color:var(--clr-text)">${bike.name}</div>
          <div style="font-size:10px;color:var(--clr-text-muted);margin-top:2px">${bike.type}</div>
        </div>
        ${bike.slots.map((avail, i) => `
          <div style="padding:8px;background:var(--clr-surface);border-top:1px solid var(--clr-border);display:flex;align-items:center;justify-content:center;">
            <div
              style="width:28px;height:28px;border-radius:6px;background:${avail ? 'var(--clr-primary-light)' : 'var(--clr-bg-muted)'};
                     display:flex;align-items:center;justify-content:center;cursor:${avail ? 'pointer' : 'default'};
                     color:${avail ? 'var(--clr-primary)' : 'var(--clr-text-light)'};font-size:14px;
                     border:1px solid ${avail ? 'var(--clr-primary-light)' : 'transparent'};
                     transition:all 0.2s ease;"
              title="${avail ? `${bike.name} at ${timeLabels[i]} — Available` : 'Unavailable'}"
              ${avail ? `onclick="window.location='rental-details.html'" tabindex="0" role="button" aria-label="Book ${bike.name} at ${timeLabels[i]}"` : ''}
            >
              ${avail ? '✓' : '—'}
            </div>
          </div>
        `).join('')}
      `;
    });

    html += '</div>';
    container.innerHTML = html;
  };

  const init = () => {
    const container = document.querySelector('.rental-availability-grid');
    render(container);
  };

  return { init };
})();

/* ============================================================
   REPAIR REQUEST FORM
   ============================================================ */
const RepairForm = (() => {
  const init = () => {
    const form = document.getElementById('repairRequestForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Submitting…';

      setTimeout(() => {
        const conf = document.getElementById('repairConfirmation');
        if (conf) {
          form.style.display = 'none';
          conf.style.display = 'block';
          const ticketNum = '#TKT-' + Math.random().toString(36).substr(2, 5).toUpperCase();
          const ticketEl = conf.querySelector('[data-ticket-num]');
          if (ticketEl) ticketEl.textContent = ticketNum;
        } else {
          window.VeloWorks?.Toast?.show('Repair request submitted! Ticket #' + Math.random().toString(36).substr(2, 5).toUpperCase(), 'success');
        }
        btn.disabled = false;
        btn.textContent = 'Submit Request';
      }, 1400);
    });

    // Urgency level visual feedback
    const urgencySelect = form.querySelector('[name="urgency"]');
    const urgencyHint = form.querySelector('.urgency-hint');
    if (urgencySelect && urgencyHint) {
      const messages = {
        routine: 'Standard turnaround: 3–5 business days.',
        priority: 'Priority service: 1–2 business days.',
        emergency: 'Same-day service when available — call us.',
      };
      urgencySelect.addEventListener('change', () => {
        urgencyHint.textContent = messages[urgencySelect.value] || '';
      });
    }
  };

  return { init };
})();

/* ============================================================
   CONTACT FORM
   ============================================================ */
const ContactForm = (() => {
  const init = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      setTimeout(() => {
        window.VeloWorks?.Toast?.show('Message sent! We\'ll reply within 24 hours.', 'success');
        form.reset();
        btn.disabled = false;
        btn.textContent = 'Send Message';
      }, 1200);
    });
  };

  return { init };
})();

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  BookingCalendar.init();
  TimeSlots.init();
  ServiceSelector.init();
  MultiStepForm.init();
  RentalGrid.init();
  RepairForm.init();
  ContactForm.init();
});

window.VeloBook = { BookingCalendar, TimeSlots, ServiceSelector };
