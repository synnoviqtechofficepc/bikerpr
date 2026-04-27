# VeloWorks Bike Shop — Frontend Template

**Expert Repairs. Premium Rentals. Local Passion.**

A fully responsive, production-ready frontend website template for a local bike repair & rental shop — built with pure HTML5, CSS3, and Vanilla JavaScript. No frameworks, no dependencies, no backend.

© 2026 ASR. All Rights Reserved.

---

## 🚀 Quick Start

1. Open the `pages/` folder
2. Launch `home-community.html` in your browser
3. Everything works locally — no server required

---

## 📁 Project Structure

```
VeloWorks/
├── assets/
│   ├── css/
│   │   ├── style.css          ← Main stylesheet (~1,800 lines, fully organized)
│   │   ├── dark-mode.css      ← Dark theme overrides (~350 lines)
│   │   └── rtl.css            ← RTL support (~280 lines)
│   ├── js/
│   │   ├── main.js            ← Navigation, theme, animations, tabs, accordions
│   │   ├── dashboard.js       ← Dashboard sidebar, repair tracker, quick actions
│   │   └── booking.js         ← Calendar, time slots, multi-step form, service selection
│   ├── images/                ← Place local image assets here
│   └── icons/
│       ├── bike-logo.svg      ← SVG logo (adapts to dark/light theme)
│       └── favicon.svg        ← SVG favicon (modern browser compatible)
├── pages/
│   ├── home-community.html    ← Home 1: Community / Trust / Brand
│   ├── home-services.html     ← Home 2: Services / How It Works / Rentals
│   ├── about.html             ← Our Story, Team, Values, Partners
│   ├── rentals.html           ← Full rental fleet with filter + availability grid
│   ├── rental-details.html    ← Individual bike detail with gallery + booking
│   ├── repairs.html           ← Service types, process, repair request form
│   ├── repair-status.html     ← Real-time repair tracker with mechanic's notes
│   ├── membership.html        ← Tier cards, comparison table, billing toggle
│   ├── dashboard-user.html    ← Full member dashboard with sidebar layout
│   ├── bookings.html          ← Multi-step booking: service → date → details → confirm
│   ├── contact.html           ← Contact form, map, hours, FAQ
│   ├── coming-soon.html       ← Countdown timer, email signup
│   └── 404.html               ← Friendly 404 with quick links
├── documentation/             ← Place additional docs here
└── README.md
```

---

## ✨ Features

### UI & UX
- **Two distinct Home pages** — Community-focused and Service-focused
- **Sticky header** with dropdown navigation, hamburger menu, and CTA buttons
- **Dark / Light mode** — toggle button + system preference detection
- **Full RTL support** — add `dir="rtl"` to `<html>` element
- **WCAG 2.1 AA** accessibility — keyboard navigation, ARIA labels, focus management
- **Smooth animations** — Intersection Observer-based scroll animations with stagger
- **No lorem ipsum** — all content is realistic bike service terminology

### Pages & Components
- Equal-height cards, uniform button sizing, consistent spacing
- Booking timeline with 4-step progress indicator
- Repair status tracker with 5-stage timeline (intake → diagnosed → in progress → QC → ready)
- Vertical mechanic notes timeline
- Service selection cards with radio-style interaction
- Monthly/annual billing toggle on membership page
- Calendar widget with date selection and live slot generation
- Live availability grid for rental time slots
- Filterable rental fleet grid
- Gallery with clickable thumbnails (rental-details.html)
- Collapsible FAQ accordions
- Stats counter animations

### Dashboard
- Sidebar navigation with active state detection
- Stat cards with trend indicators
- Active repair widget with progress bar + timeline
- Upcoming rentals list with cancel action
- Rental history with rebook action
- Membership overview with quarterly progress bar
- Saved bikes carousel
- Invoice table with PDF download simulation
- Account settings form with save state
- Notification preference toggles

### JavaScript Modules
| Module | File | Responsibilities |
|--------|------|-----------------|
| ThemeManager | main.js | Dark/light mode, localStorage, system preference |
| Navigation | main.js | Sticky header, hamburger, dropdowns, keyboard nav |
| Accordion | main.js | Expand/collapse with keyboard support |
| Tabs | main.js | Tab switching with arrow key navigation |
| ScrollAnimations | main.js | Intersection Observer scroll reveals |
| Lightbox | main.js | Image gallery overlay |
| Toast | main.js | Notification toasts |
| SidebarManager | dashboard.js | Mobile sidebar open/close |
| RepairTracker | dashboard.js | Real-time stage updates |
| QuickActions | dashboard.js | Cancel/rebook/invoice actions |
| BookingCalendar | booking.js | Full calendar renderer with navigation |
| TimeSlots | booking.js | Available time slot grid |
| ServiceSelector | booking.js | Service card radio selection |
| MultiStepForm | booking.js | 4-step validated form flow |
| RentalGrid | booking.js | Availability grid renderer |
| RepairForm | booking.js | Repair request submission |
| ContactForm | booking.js | Contact form submission |

---

## 🎨 Design System

### Color Palette (CSS Variables)
```css
--clr-primary:     #16A34A  /* Brand green */
--clr-secondary:   #F97316  /* Warm orange */
--clr-text:        #0F172A  /* Near-black */
--clr-bg:          #FFFFFF  /* White */
--clr-bg-alt:      #F8FAFC  /* Subtle grey */
--clr-border:      #E2E8F0  /* Dividers */
```

### Dark Mode Variables (auto-overridden)
```css
--clr-primary:     #4ade80  /* Lighter green */
--clr-bg:          #0D1117  /* Dark background */
--clr-surface:     #1E2634  /* Card surfaces */
```

### Typography
Font: **Inter** (Google Fonts) with system-ui fallback stack
Scale: 12px → 75px (9 steps via CSS variables)

### Spacing
4px base unit · 13 steps from `--sp-1` (4px) to `--sp-24` (96px)

---

## ♿ Accessibility

- Semantic HTML5 elements throughout
- ARIA labels on all interactive elements
- `role` and `aria-expanded` on dropdowns and accordions
- Skip-to-content link ready (add `id="main"` to `<main>`)
- Keyboard navigation for calendar, time slots, tabs, and dropdowns
- Focus-visible ring on all focusable elements
- `::selection` styled with sufficient contrast
- `prefers-color-scheme` detection before JS loads
- `prefers-reduced-motion` can be added to animations

---

## 🌍 Internationalization

RTL support is built into `rtl.css`. Activate with:
```html
<html lang="ar" dir="rtl">
```
All layout, padding, margin, and directional properties are flipped.

---

## 📱 Responsive Breakpoints

| Breakpoint | Description |
|-----------|-------------|
| Default | Mobile-first base styles |
| 480px | Small phone adjustments |
| 768px | Tablet — hamburger menu, stacked layout |
| 1024px | Desktop — full navigation, multi-column |
| 1280px | Wide — container max-width capped |

---

## 🖼️ Image Attribution

All images sourced from **Unsplash** (unsplash.com) under the Unsplash License.
Replace `?w=800&q=85&fit=crop` parameters with your own CDN URLs for production.

---

## 🔧 Customization Guide

### Change Brand Colors
Edit the `:root` block in `style.css`:
```css
:root {
  --clr-primary: #16A34A;      /* Change to your brand color */
  --clr-secondary: #F97316;    /* Accent color */
}
```

### Change Shop Details
Search and replace across all HTML files:
- `VeloWorks` → Your shop name
- `42 Spoke Lane, Portland, OR 97201` → Your address
- `(503) 555-1234` → Your phone number
- `hello@veloworks.com` → Your email

### Add Backend
Forms have `id` attributes for easy integration:
- `#contactForm` — Contact
- `#repairRequestForm` — Repair requests
- `#bookingForm` — Service bookings
- `#accountSettingsForm` — Account updates

Intercept `submit` events and replace the `setTimeout` simulations with `fetch()` API calls.

---

## 📦 Production Checklist

- [ ] Replace Unsplash URLs with optimized local images
- [ ] Convert `favicon.svg` to `favicon.ico` (use https://realfavicongenerator.net)
- [ ] Add `<link rel="canonical">` tags
- [ ] Add Open Graph meta tags for social sharing
- [ ] Add structured data (JSON-LD) for LocalBusiness schema
- [ ] Minify `style.css`, `main.js`, `dashboard.js`, `booking.js`
- [ ] Add Google Analytics or Plausible analytics script
- [ ] Set up proper 404 redirect in server config
- [ ] Test in Chrome, Firefox, Safari, and Edge
- [ ] Run Lighthouse audit — target 90+ on all metrics

---

## 📄 License

© 2026 ASR. All Rights Reserved.

This template is provided for commercial and personal use. Attribution appreciated but not required.

---

*Built with ❤️ for Portland's cycling community.*
