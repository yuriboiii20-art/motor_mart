import { carsData, categoriesList, bangaloreLocalities } from './data/cars.js';
import { dealersData } from './data/dealers.js';
import { faqsData } from './data/faqs.js';
import { brandsList } from './data/brands.js';

// Application State
const state = {
  currentRoute: window.location.hash.slice(1) || '/',
  selectedCategory: 'all',
  searchQuery: '',
  selectedLocality: 'All Localities',
  selectedFuel: [],
  selectedTrans: [],
  maxPrice: 6000000,
  sortBy: 'featured',
  activeCarModal: null,
  activeDealerModal: false,
  mobileNavOpen: false,
  mobileFilterOpen: false,
  // EMI Calculator defaults
  emiLoanAmount: 1500000, // ₹ 15 Lakh
  emiInterestRate: 9.5,   // 9.5%
  emiTenureYears: 5       // 5 Years (60 Months)
};

// Main DOM Container
const app = document.getElementById('app');

// Router Listener
window.addEventListener('hashchange', () => {
  state.currentRoute = window.location.hash.slice(1) || '/';
  state.mobileNavOpen = false;
  state.mobileFilterOpen = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderApp();
});

// Calculate EMI Formula
function calculateEMI(principal, annualRate, years) {
  const monthlyRate = annualRate / (12 * 100);
  const totalMonths = years * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayable = emi * totalMonths;
  const totalInterest = totalPayable - principal;

  return {
    monthlyEMI: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayable: Math.round(totalPayable)
  };
}

// Format Currency in INR (Lakhs & Thousand)
function formatINR(val) {
  if (val >= 10000000) {
    return `₹ ${(val / 10000000).toFixed(2)} Cr`;
  } else if (val >= 100000) {
    return `₹ ${(val / 100000).toFixed(2)} Lakh`;
  }
  return `₹ ${val.toLocaleString('en-IN')}`;
}

// Generate SVG Icons
const icons = {
  car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 3C2 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
  mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  fuel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 22h12M4 9h10M4 22V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>`,
  transmission: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  gauge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m14 14-4-4"/><path d="M12 6v2"/><path d="M6 12H4"/></svg>`,
  owner: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.01 8.49 7.01 9.71C7.01 10.93 7.9 12.11 8.02 12.28C8.15 12.44 9.77 14.94 12.25 16.01C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.7 16.03 16.91 15.44C17.12 14.86 17.12 14.36 17.06 14.25C17 14.15 16.83 14.09 16.58 13.97C16.33 13.84 15.1 13.23 14.87 13.15C14.65 13.06 14.48 13.02 14.31 13.27C14.15 13.52 13.67 14.09 13.52 14.25C13.38 14.42 13.23 14.44 12.98 14.32C12.73 14.19 11.93 13.93 10.98 13.08C10.24 12.42 9.74 11.61 9.6 11.36C9.45 11.11 9.58 10.98 9.71 10.85C9.82 10.74 9.96 10.56 10.08 10.41C10.21 10.27 10.25 10.16 10.33 10C10.42 9.83 10.37 9.69 10.31 9.56C10.25 9.44 9.76 8.23 9.55 7.74C9.35 7.26 9.15 7.33 8.99 7.32L8.53 7.33Z"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`
};

// ==========================================================================
// RENDER APP
// ==========================================================================
function renderApp() {
  app.innerHTML = `
    ${renderHeader()}
    ${renderMobileNavDrawer()}
    <main id="main-content">
      ${renderCurrentRoute()}
    </main>
    ${renderFooter()}
    ${renderCarModal()}
    ${renderDealerModal()}
  `;

  attachEventListeners();
}

// ==========================================================================
// HEADER COMPONENT
// ==========================================================================
function renderHeader() {
  const isRoute = (path) => (state.currentRoute === path ? 'active' : '');

  return `
    <header class="site-header">
      <div class="header-container">
        <!-- Logo -->
        <a href="#/" class="brand-logo" aria-label="KAARZO - Home">
          <img src="/src/assets/logo/kaarzo_logo.png" alt="KAARZO" class="brand-logo-img" />
        </a>

        <!-- Bangalore Locality Indicator -->
        <div class="location-selector" title="Focus Region: Bangalore, Karnataka">
          ${icons.mapPin}
          <span>Bengaluru, KA</span>
        </div>

        <!-- Navigation Links -->
        <nav>
          <ul class="nav-menu">
            <li><a href="#/" class="nav-link ${isRoute('/')}">Home</a></li>
            <li><a href="#/buy-cars" class="nav-link ${isRoute('/buy-cars')}">Buy Cars</a></li>
            <li><a href="#/search" class="nav-link ${isRoute('/search')}">Search</a></li>
            <li><a href="#/about" class="nav-link ${isRoute('/about')}">About Us</a></li>
            <li><a href="#/faq" class="nav-link ${isRoute('/faq')}">FAQ</a></li>
            <li><a href="#/privacy" class="nav-link ${isRoute('/privacy')}">Privacy</a></li>
          </ul>
        </nav>

        <!-- Actions -->
        <div class="header-actions">
          <button class="btn-dealer-portal" id="btn-open-dealer-modal">
            ${icons.shield}
            <span>List Dealership</span>
          </button>
          <a href="#/search" class="btn-primary-gold">
            ${icons.search}
            <span>Find Cars</span>
          </a>
          <button class="mobile-menu-btn" id="mobile-menu-toggle" aria-label="Toggle Navigation Drawer">
            ☰
          </button>
        </div>
      </div>
    </header>
  `;
}

// ==========================================================================
// MOBILE NAVIGATION DRAWER
// ==========================================================================
function renderMobileNavDrawer() {
  const isRoute = (path) => (state.currentRoute === path ? 'active' : '');

  return `
    <div class="mobile-nav-backdrop ${state.mobileNavOpen ? 'active' : ''}" id="mobile-nav-backdrop">
      <div class="mobile-nav-drawer">
        <div class="mobile-nav-header">
          <a href="#/" class="brand-logo" aria-label="KAARZO - Home">
            <img src="/src/assets/logo/kaarzo_logo.png" alt="KAARZO" class="brand-logo-img" style="height: 52px; max-width: 160px;" />
          </a>
          <button class="mobile-nav-close" id="mobile-nav-close-btn" aria-label="Close Navigation">✕</button>
        </div>

        <div style="display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.06); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--brand-gold); margin-bottom: 20px;">
          ${icons.mapPin}
          <span>Bengaluru, Karnataka Hub</span>
        </div>

        <ul class="mobile-nav-list">
          <li class="mobile-nav-item"><a href="#/" class="${isRoute('/')}">Home Showcase <span>→</span></a></li>
          <li class="mobile-nav-item"><a href="#/buy-cars" class="${isRoute('/buy-cars')}">Buy Certified Cars <span>→</span></a></li>
          <li class="mobile-nav-item"><a href="#/search" class="${isRoute('/search')}">Advanced Search <span>→</span></a></li>
          <li class="mobile-nav-item"><a href="#/about" class="${isRoute('/about')}">About KAARZO <span>→</span></a></li>
          <li class="mobile-nav-item"><a href="#/faq" class="${isRoute('/faq')}">FAQ & Documents <span>→</span></a></li>
          <li class="mobile-nav-item"><a href="#/privacy" class="${isRoute('/privacy')}">Privacy Policy <span>→</span></a></li>
        </ul>

        <div style="margin-top: auto; display: flex; flex-direction: column; gap: 10px;">
          <button class="btn-primary-gold" id="btn-mobile-dealer-modal" style="width: 100%; padding: 12px; font-size: 0.9rem;">
            ${icons.shield} Register Showroom
          </button>
          <a href="tel:+918049207000" style="display: flex; align-items: center; justify-content: center; gap: 8px; color: #CBD5E1; font-size: 0.85rem; padding: 10px; border: 1px solid var(--dark-border); border-radius: var(--radius-pill);">
            📞 Bangalore Support: +91 80 4920 7000
          </a>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// FOOTER COMPONENT
// ==========================================================================
function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Col 1: About Brand -->
          <div>
            <div style="margin-bottom: 18px;">
              <a href="#/" class="brand-logo" aria-label="KAARZO - Home">
                <img src="/src/assets/logo/kaarzo_logo.png" alt="KAARZO" class="brand-logo-img" style="height: 72px; max-width: 220px;" />
              </a>
            </div>
            <p style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 18px;">
              KAARZO is Bangalore’s premier automotive marketplace bridging car buyers directly with verified, certified local car dealerships across Karnataka. 100% RTO verified and 200-point inspected inventory.
            </p>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <span class="badge-tag badge-gold">KA RTO Verified</span>
              <span class="badge-tag badge-dark">200+ Point Inspection</span>
            </div>
          </div>

          <!-- Col 2: Top Bangalore Hubs -->
          <div>
            <h4 class="footer-col-title">Bangalore Hubs</h4>
            <ul class="footer-links">
              <li><a href="#/search" class="footer-link">Dealers in Indiranagar</a></li>
              <li><a href="#/search" class="footer-link">Dealers in Koramangala</a></li>
              <li><a href="#/search" class="footer-link">Dealers in Whitefield</a></li>
              <li><a href="#/search" class="footer-link">Dealers in HSR Layout</a></li>
              <li><a href="#/search" class="footer-link">Dealers in Jayanagar</a></li>
              <li><a href="#/search" class="footer-link">Dealers in Electronic City</a></li>
            </ul>
          </div>

          <!-- Col 3: Quick Navigation -->
          <div>
            <h4 class="footer-col-title">Navigation</h4>
            <ul class="footer-links">
              <li><a href="#/" class="footer-link">Home Showcase</a></li>
              <li><a href="#/buy-cars" class="footer-link">Buy Certified Cars</a></li>
              <li><a href="#/search" class="footer-link">Advanced Search & Filters</a></li>
              <li><a href="#/about" class="footer-link">About KAARZO</a></li>
              <li><a href="#/faq" class="footer-link">FAQ & Documentation</a></li>
              <li><a href="#/privacy" class="footer-link">Privacy Policy</a></li>
            </ul>
          </div>

          <!-- Col 4: Bangalore Office & Contact -->
          <div>
            <h4 class="footer-col-title">Bengaluru Headquarters</h4>
            <p style="font-size: 0.86rem; line-height: 1.5; margin-bottom: 12px;">
              KAARZO Mobility Technologies Pvt Ltd<br>
              #104, 100 Feet Road, HAL 2nd Stage,<br>
              Indiranagar, Bengaluru, Karnataka 560038
            </p>
            <p style="font-size: 0.86rem; color: #FFFFFF; font-weight: 600; margin-bottom: 6px;">
              📞 +91 80 4920 7000
            </p>
            <p style="font-size: 0.86rem; color: var(--brand-gold);">
              ✉️ support@kaarzo.in
            </p>
          </div>
        </div>

        <div class="footer-bottom">
          <div>
            © 2026 KAARZO Mobility Technologies. All rights reserved. Registered under Government of Karnataka.
          </div>
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <a href="#/privacy" class="footer-link">Privacy Policy</a>
            <a href="#/privacy" class="footer-link">Terms of Service</a>
            <a href="#/faq" class="footer-link">RTO Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// ==========================================================================
// ROUTE DISPATCHER
// ==========================================================================
function renderCurrentRoute() {
  switch (state.currentRoute) {
    case '/':
      return renderHomePage();
    case '/buy-cars':
      return renderBuyCarsPage();
    case '/search':
      return renderSearchPage();
    case '/about':
      return renderAboutPage();
    case '/faq':
      return renderFaqPage();
    case '/privacy':
      return renderPrivacyPage();
    default:
      return renderHomePage();
  }
}

// ==========================================================================
// CAR CARD GENERATOR (Weblium Reference Exact Style)
// ==========================================================================
function renderCarCard(car) {
  return `
    <article class="car-card" data-id="${car.id}">
      <!-- Media Showcase -->
      <div class="car-card-media">
        <img src="${car.image}" alt="${car.title}" class="car-card-image" loading="lazy" />
      </div>

      <!-- Card Body -->
      <div class="car-card-body">
        <div class="car-card-header">
          <div>
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
              ${car.year} • ${car.brand}
            </span>
            <h3 class="car-card-title">${car.title}</h3>
          </div>
          <div class="car-card-price-block">
            <div class="car-card-price">${car.priceFormatted}</div>
            <div class="car-card-emi">EMI ~${car.emiMonthly}</div>
          </div>
        </div>

        <!-- 4-Grid Specs Badge Block -->
        <div class="car-specs-grid">
          <div class="spec-item" title="Fuel Type">
            <span class="spec-icon">${icons.fuel}</span>
            <span>${car.fuelType}</span>
          </div>
          <div class="spec-item" title="Transmission">
            <span class="spec-icon">${icons.transmission}</span>
            <span>${car.transmission.split(' ')[0]}</span>
          </div>
          <div class="spec-item" title="KM Driven">
            <span class="spec-icon">${icons.gauge}</span>
            <span>${car.kmDriven}</span>
          </div>
          <div class="spec-item" title="Ownership History">
            <span class="spec-icon">${icons.owner}</span>
            <span>${car.ownership}</span>
          </div>
        </div>

        <!-- Dealer Mini Bar -->
        <div class="car-dealer-info">
          <div class="dealer-name">
            <span class="dealer-title">${car.dealer.name}</span>
            <span class="dealer-location">${car.rto.split(' ')[0]} • ${car.locality}</span>
          </div>
          <div class="dealer-rating">
            ${icons.star}
            <span>${car.dealer.rating} (${car.dealer.reviewsCount})</span>
          </div>
        </div>

        <!-- Actions Dual CTA -->
        <div class="car-card-actions">
          <button class="btn-card-details btn-view-car" data-id="${car.id}">
            View Details & Specs
          </button>
          <a href="https://wa.me/${car.dealer.whatsapp}?text=Hi%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(car.title)}%20(${car.priceFormatted})%20listed%20on%20KAARZO." 
             target="_blank" 
             rel="noopener noreferrer" 
             class="btn-card-whatsapp" 
             title="Chat with Dealer on WhatsApp">
            ${icons.whatsapp}
          </a>
        </div>
      </div>
    </article>
  `;
}

// ==========================================================================
// 1. HOMEPAGE
// ==========================================================================
function renderHomePage() {
  const filteredCars = state.selectedCategory === 'all' 
    ? carsData 
    : carsData.filter(c => c.category === state.selectedCategory);

  const emiCalc = calculateEMI(state.emiLoanAmount, state.emiInterestRate, state.emiTenureYears);

  return `
    <!-- HERO SECTION -->
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-content">
          <h1 class="hero-title">
            Buy Verified Indian Cars from <span class="highlight">Top Bangalore Dealers</span>
          </h1>
          <p class="hero-subtext">
            Discover 100% KA-RTO verified, 200-point inspected cars from certified dealerships in Indiranagar, Koramangala, Whitefield, HSR Layout, and across Karnataka.
          </p>

          <!-- Search Widget -->
          <div class="hero-search-box">
            <form id="hero-quick-search-form" class="search-form-grid">
              <div class="search-field">
                <label class="search-label">Make & Brand</label>
                <select class="search-select" id="hero-search-brand">
                  <option value="">All Brands</option>
                  <option value="Mahindra">Mahindra</option>
                  <option value="Tata">Tata Motors</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="BMW">BMW</option>
                  <option value="Honda">Honda</option>
                  <option value="Maruti Suzuki">Maruti Suzuki</option>
                </select>
              </div>

              <div class="search-field">
                <label class="search-label">Body Type</label>
                <select class="search-select" id="hero-search-type">
                  <option value="">All Body Types</option>
                  <option value="SUV">SUVs & 4x4s</option>
                  <option value="Luxury">Luxury / Executive</option>
                  <option value="Hybrid">Strong Hybrids</option>
                  <option value="Electric">Electric (EV)</option>
                  <option value="Sedan">Sedans</option>
                </select>
              </div>

              <div class="search-field">
                <label class="search-label">Budget (Max)</label>
                <select class="search-select" id="hero-search-budget">
                  <option value="">Any Budget</option>
                  <option value="1500000">Under ₹ 15 Lakh</option>
                  <option value="2000000">Under ₹ 20 Lakh</option>
                  <option value="3000000">Under ₹ 30 Lakh</option>
                  <option value="5000000">Under ₹ 50 Lakh</option>
                </select>
              </div>

              <div class="search-field">
                <label class="search-label">Bangalore Locality</label>
                <select class="search-select" id="hero-search-locality">
                  ${bangaloreLocalities.map(loc => `<option value="${loc}">${loc}</option>`).join('')}
                </select>
              </div>

              <button type="submit" class="btn-hero-search">
                ${icons.search} Search Cars
              </button>
            </form>
          </div>

          <!-- Stats Counter -->
          <div class="hero-stats-row">
            <div class="stat-item">
              <div class="stat-number">500+</div>
              <div class="stat-label">Verified Dealers</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">1,250+</div>
              <div class="stat-label">Inspected Cars</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">100%</div>
              <div class="stat-label">KA RTO Verified</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">4.9★</div>
              <div class="stat-label">Bangalore Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- EXPLORE CARS BY BRAND SECTION -->
    <section class="section-padding explore-brands-section">
      <div class="container">
        <div class="section-header-center">
          <span class="section-tag">Popular Makes</span>
          <h2 class="section-title">Explore Cars By Brand</h2>
          <p class="section-subtitle">
            Browse verified, certified pre-owned cars from India's most trusted and affordable automobile manufacturers in Bangalore.
          </p>
        </div>

        <div class="explore-brands-grid">
          ${brandsList.map(brand => `
            <div class="explore-brand-card" data-brand="${brand.name}" role="button" tabindex="0" title="Explore ${brand.name} cars in Bangalore">
              <div class="explore-brand-logo-box">
                <img src="${brand.image}" alt="${brand.name} logo" class="explore-brand-img" loading="lazy" />
              </div>
              <h3 class="explore-brand-title">${brand.name}</h3>
              <span class="explore-brand-count">${brand.count} Cars</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CAR SHOWCASE SECTION ("Cars of the Month") -->
    <section class="section-padding" style="background: var(--light-surface);">
      <div class="container">
        <div class="section-header-center">
          <span class="section-tag">Bangalore Showcase</span>
          <h2 class="section-title">Cars of the Month</h2>
          <p class="section-subtitle">
            Curated hand-picked vehicles from top certified dealer showrooms in Bengaluru with complete service history.
          </p>
        </div>

        <!-- Interactive Category Tabs (Swipeable on mobile) -->
        <div class="category-tabs-container">
          ${categoriesList.map(cat => `
            <button class="cat-tab-btn ${state.selectedCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
              <span>${cat.name}</span>
              <span class="cat-tab-count">${cat.count}</span>
            </button>
          `).join('')}
        </div>

        <!-- Cars Grid -->
        <div class="cars-grid">
          ${filteredCars.map(car => renderCarCard(car)).join('')}
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <a href="#/buy-cars" class="btn-primary-gold" style="padding: 14px 32px; font-size: 0.95rem;">
            Explore All ${carsData.length} Bangalore Cars →
          </a>
        </div>
      </div>
    </section>

    <!-- WHY KAARZO / TRUST FLOW -->
    <section class="section-padding" style="background: #FFFFFF;">
      <div class="container">
        <div class="section-header-center">
          <span class="section-tag">Why KAARZO</span>
          <h2 class="section-title">The Safest Way to Buy Dealer Cars in Karnataka</h2>
          <p class="section-subtitle">
            Every vehicle on KAARZO is verified through our strict 4-step dealer validation and technical certification process.
          </p>
        </div>

        <div class="about-grid">
          <div class="about-card">
            <div class="about-icon-box">${icons.shield}</div>
            <h3 class="about-card-title">200-Point Inspection</h3>
            <p class="about-card-desc">
              Detailed technical diagnostic of engine, gearbox, chassis, suspension, electronics, and authentic odometer verification.
            </p>
          </div>

          <div class="about-card">
            <div class="about-icon-box">${icons.car}</div>
            <h3 class="about-card-title">Karnataka RTO Transfer</h3>
            <p class="about-card-desc">
              End-to-end RC transfer support across KA-01, KA-03, KA-04, KA-05, KA-51, and KA-53 with official status tracking.
            </p>
          </div>

          <div class="about-card">
            <div class="about-icon-box">${icons.whatsapp}</div>
            <h3 class="about-card-title">Direct Dealer WhatsApp</h3>
            <p class="about-card-desc">
              Connect instantly with the showroom owner or manager. Schedule test drives and negotiate directly with zero middlemen.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- INTERACTIVE EMI LOAN CALCULATOR -->
    <section class="section-padding calculator-section">
      <div class="container">
        <div class="section-header-center">
          <span class="section-tag section-tag-dark">Instant Financing</span>
          <h2 class="section-title light-text">Used Car Loan EMI Calculator</h2>
          <p class="section-subtitle light-text">
            Plan your purchase with transparent loan estimates from top Indian banks (HDFC, ICICI, SBI, Axis).
          </p>
        </div>

        <div class="calc-box">
          <div class="calc-inputs">
            <!-- Loan Amount Slider -->
            <div class="calc-field">
              <div class="calc-field-header">
                <span>Loan Amount</span>
                <span class="calc-field-val" id="disp-calc-amount">${formatINR(state.emiLoanAmount)}</span>
              </div>
              <input type="range" class="calc-slider" id="calc-slider-amount" min="300000" max="6000000" step="50000" value="${state.emiLoanAmount}">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748B;">
                <span>₹ 3 Lakh</span>
                <span>₹ 60 Lakh</span>
              </div>
            </div>

            <!-- Interest Rate Slider -->
            <div class="calc-field">
              <div class="calc-field-header">
                <span>Annual Interest Rate</span>
                <span class="calc-field-val" id="disp-calc-rate">${state.emiInterestRate}% p.a.</span>
              </div>
              <input type="range" class="calc-slider" id="calc-slider-rate" min="8.0" max="16.0" step="0.25" value="${state.emiInterestRate}">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748B;">
                <span>8.0%</span>
                <span>16.0%</span>
              </div>
            </div>

            <!-- Loan Tenure Slider -->
            <div class="calc-field">
              <div class="calc-field-header">
                <span>Tenure Duration</span>
                <span class="calc-field-val" id="disp-calc-tenure">${state.emiTenureYears} Years (${state.emiTenureYears * 12} Months)</span>
              </div>
              <input type="range" class="calc-slider" id="calc-slider-tenure" min="1" max="7" step="1" value="${state.emiTenureYears}">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748B;">
                <span>1 Year</span>
                <span>7 Years</span>
              </div>
            </div>
          </div>

          <!-- Result Card -->
          <div class="calc-result-card">
            <div class="calc-result-title">Estimated Monthly Payment</div>
            <div class="calc-emi-number" id="disp-calc-monthly">₹ ${emiCalc.monthlyEMI.toLocaleString('en-IN')}<span style="font-size: 1rem; color: #94A3B8;"> /mo</span></div>

            <div class="calc-breakdown-row">
              <span>Principal Amount</span>
              <span class="val" id="disp-calc-principal">${formatINR(state.emiLoanAmount)}</span>
            </div>
            <div class="calc-breakdown-row">
              <span>Total Interest Payable</span>
              <span class="val" id="disp-calc-interest">${formatINR(emiCalc.totalInterest)}</span>
            </div>
            <div class="calc-breakdown-row">
              <span>Total Amount (P + I)</span>
              <span class="val" id="disp-calc-total">${formatINR(emiCalc.totalPayable)}</span>
            </div>

            <a href="#/search" class="btn-primary-gold" style="width: 100%; margin-top: 20px;">
              Apply with Bangalore Dealers
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED BANGALORE DEALERS -->
    <section class="section-padding" style="background: var(--light-surface);">
      <div class="container">
        <div class="section-header">
          <div>
            <span class="section-tag">Verified Showrooms</span>
            <h2 class="section-title">Top Dealerships in Bangalore</h2>
          </div>
          <button class="btn-dealer-portal" id="btn-home-dealer-cta" style="background: #0C0E12; color: #FFF; display: inline-flex;">
            + Register Showroom
          </button>
        </div>

        <div class="dealers-grid">
          ${dealersData.slice(0, 3).map(dealer => `
            <div class="dealer-card">
              <div class="dealer-card-top">
                <div>
                  <h3 class="dealer-card-title">${dealer.name}</h3>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
                    Verified Partner since ${dealer.verifiedSince}
                  </div>
                </div>
                <span class="dealer-locality-badge">${dealer.locality}</span>
              </div>

              <p class="dealer-tagline">${dealer.tagline}</p>

              <div class="dealer-address">
                ${icons.mapPin}
                <span>${dealer.address}</span>
              </div>

              <div class="dealer-tags">
                ${dealer.specialties.map(s => `<span class="dealer-tag">${s}</span>`).join('')}
              </div>

              <div class="dealer-card-footer">
                <div style="font-weight: 700; color: #D97706; display: flex; align-items: center; gap: 4px; font-size: 0.88rem;">
                  ${icons.star} ${dealer.rating} (${dealer.reviewsCount})
                </div>
                <a href="https://wa.me/${dealer.whatsapp}?text=Hi%2C%20I%20found%20your%20dealership%20${encodeURIComponent(dealer.name)}%20on%20KAARZO." 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="btn-primary-gold" 
                   style="padding: 6px 14px; font-size: 0.8rem;">
                  ${icons.whatsapp} Chat
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- DEALER ONBOARDING BANNER -->
    <section class="section-padding" style="background: #0C0E12; color: #FFFFFF; text-align: center;">
      <div class="container" style="max-width: 780px;">
        <span class="section-tag section-tag-dark">For Car Dealers</span>
        <h2 class="section-title light-text" style="margin-bottom: 16px;">
          Are You a Car Dealership in Bengaluru?
        </h2>
        <p class="section-subtitle light-text" style="margin-bottom: 28px;">
          Join over 500+ verified car showrooms on KAARZO. Get qualified buyer inquiries directly on WhatsApp and sell your inventory faster with zero listing commissions.
        </p>
        <button class="btn-primary-gold" id="btn-cta-dealer-onboard" style="padding: 14px 32px; font-size: 0.95rem;">
          Register Your Showroom Today →
        </button>
      </div>
    </section>
  `;
}

// ==========================================================================
// 2. BUY CARS PAGE (Inventory Catalog)
// ==========================================================================
function renderBuyCarsPage() {
  const cars = carsData;

  return `
    <section class="section-padding" style="background: var(--light-surface);">
      <div class="container">
        <div class="section-header-center">
          <span class="section-tag">Bangalore Inventory</span>
          <h1 class="section-title">Verified Pre-Owned Cars for Sale</h1>
          <p class="section-subtitle">
            Browse our complete inventory of inspected vehicles from certified showrooms in Indiranagar, Koramangala, Whitefield, HSR Layout, and Jayanagar.
          </p>
        </div>

        <!-- Quick Filter Chips (Swipeable on mobile) -->
        <div class="category-tabs-container">
          ${categoriesList.map(cat => `
            <button class="cat-tab-btn ${state.selectedCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
              <span>${cat.name}</span>
            </button>
          `).join('')}
        </div>

        <div class="search-results-top">
          <div style="font-weight: 700; color: var(--text-primary);">
            Showing <span style="color: var(--brand-gold);">${cars.length}</span> Verified Bangalore Cars
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">Sort:</label>
            <select class="sort-select" id="catalog-sort">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year-desc">Newest Model Year</option>
            </select>
          </div>
        </div>

        <!-- Catalog Grid -->
        <div class="cars-grid">
          ${cars.map(car => renderCarCard(car)).join('')}
        </div>
      </div>
    </section>
  `;
}

// ==========================================================================
// 3. SEARCH PAGE (Faceted Advanced Search with Mobile Drawer)
// ==========================================================================
function renderSearchPage() {
  // Filter logic
  let results = carsData.filter(car => {
    // Search query
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      const matchTitle = car.title.toLowerCase().includes(q);
      const matchBrand = car.brand.toLowerCase().includes(q);
      const matchLoc = car.locality.toLowerCase().includes(q);
      const matchFuel = car.fuelType.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchLoc && !matchFuel) return false;
    }

    // Locality
    if (state.selectedLocality !== 'All Localities' && car.locality !== state.selectedLocality) {
      return false;
    }

    // Max Price
    if (car.price > state.maxPrice) {
      return false;
    }

    // Fuel Type
    if (state.selectedFuel.length > 0 && !state.selectedFuel.includes(car.fuelType)) {
      return false;
    }

    // Transmission
    if (state.selectedTrans.length > 0) {
      const isAuto = car.transmission.toLowerCase().includes('auto') || car.transmission.toLowerCase().includes('dct') || car.transmission.toLowerCase().includes('cvt');
      const isManual = car.transmission.toLowerCase().includes('manual');
      if (state.selectedTrans.includes('Automatic') && !isAuto) return false;
      if (state.selectedTrans.includes('Manual') && !isManual) return false;
    }

    return true;
  });

  // Sorting
  if (state.sortBy === 'price-asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'year-desc') {
    results.sort((a, b) => b.year - a.year);
  }

  return `
    <div class="container">
      <!-- Mobile Filter Trigger Button -->
      <button class="mobile-filter-trigger" id="btn-toggle-mobile-filters" style="margin-top: 20px;">
        ${icons.filter} <span>Filters & Locality (${results.length} Cars)</span>
      </button>

      <div class="search-page-layout">
        <!-- Sidebar Filters (Drawer on Mobile) -->
        <aside class="search-sidebar ${state.mobileFilterOpen ? 'mobile-open' : ''}" id="search-filter-sidebar">
          <div class="sidebar-title">
            <span>Filter Inventory</span>
            <div style="display: flex; gap: 10px; align-items: center;">
              <button id="btn-reset-filters" style="font-size: 0.78rem; color: var(--brand-gold); font-weight: 700;">
                Reset All
              </button>
              ${state.mobileFilterOpen ? `<button id="btn-close-mobile-filters" style="font-size: 1.2rem; padding: 4px;">✕</button>` : ''}
            </div>
          </div>

          <!-- Keyword Search -->
          <div class="filter-group">
            <label class="filter-label">Search Keyword</label>
            <input type="text" class="search-input" id="search-input-query" placeholder="e.g. Thar, Creta, Hybrid, Petrol..." value="${state.searchQuery}">
          </div>

          <!-- Bangalore Locality -->
          <div class="filter-group">
            <label class="filter-label">Bangalore Locality</label>
            <select class="search-select" id="filter-locality-select" style="background: var(--light-surface); color: var(--text-primary);">
              ${bangaloreLocalities.map(loc => `
                <option value="${loc}" ${state.selectedLocality === loc ? 'selected' : ''}>${loc}</option>
              `).join('')}
            </select>
          </div>

          <!-- Price Budget Slider -->
          <div class="filter-group">
            <label class="filter-label">Max Budget: <span style="color: #0F172A;" id="disp-max-price">${formatINR(state.maxPrice)}</span></label>
            <input type="range" class="calc-slider" id="filter-price-slider" min="1000000" max="6000000" step="100000" value="${state.maxPrice}">
          </div>

          <!-- Fuel Type -->
          <div class="filter-group">
            <label class="filter-label">Fuel Type</label>
            <div class="filter-checkbox-list">
              ${['Diesel', 'Petrol', 'Hybrid', 'Electric'].map(fuel => `
                <label class="checkbox-label">
                  <input type="checkbox" class="filter-fuel-cb" value="${fuel}" ${state.selectedFuel.includes(fuel) ? 'checked' : ''}>
                  <span>${fuel}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Transmission -->
          <div class="filter-group">
            <label class="filter-label">Transmission</label>
            <div class="filter-checkbox-list">
              ${['Automatic', 'Manual'].map(trans => `
                <label class="checkbox-label">
                  <input type="checkbox" class="filter-trans-cb" value="${trans}" ${state.selectedTrans.includes(trans) ? 'checked' : ''}>
                  <span>${trans}</span>
                </label>
              `).join('')}
            </div>
          </div>

          ${state.mobileFilterOpen ? `
            <button class="btn-primary-gold" id="btn-apply-mobile-filters" style="width: 100%; margin-top: 20px; padding: 12px;">
              Apply Filters (${results.length} Cars)
            </button>
          ` : ''}
        </aside>

        <!-- Main Results Grid -->
        <main>
          <div class="search-results-top">
            <div style="font-weight: 700;">
              Found <span style="color: var(--brand-gold);">${results.length}</span> matching cars in Bangalore
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">Sort:</label>
              <select class="sort-select" id="search-sort-select">
                <option value="featured" ${state.sortBy === 'featured' ? 'selected' : ''}>Featured</option>
                <option value="price-asc" ${state.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price-desc" ${state.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
                <option value="year-desc" ${state.sortBy === 'year-desc' ? 'selected' : ''}>Newest Year</option>
              </select>
            </div>
          </div>

          ${results.length === 0 ? `
            <div style="text-align: center; padding: 60px 20px; background: #FFF; border-radius: var(--radius-lg); border: 1px solid var(--light-border);">
              <div style="font-size: 3rem; margin-bottom: 12px;">🚗</div>
              <h3 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 8px;">No cars match your exact filters</h3>
              <p style="color: var(--text-muted); margin-bottom: 20px;">Try adjusting your budget slider or clearing the locality filter.</p>
              <button class="btn-primary-gold" id="btn-reset-filters-empty">Reset All Filters</button>
            </div>
          ` : `
            <div class="cars-grid">
              ${results.map(car => renderCarCard(car)).join('')}
            </div>
          `}
        </main>
      </div>
    </div>
  `;
}

// ==========================================================================
// 4. ABOUT US PAGE
// ==========================================================================
function renderAboutPage() {
  return `
    <div class="about-hero">
      <div class="container" style="max-width: 820px;">
        <span class="section-tag section-tag-dark">Our Story</span>
        <h1 class="section-title light-text" style="font-size: 2.5rem; margin-bottom: 16px;">
          Empowering Bangalore’s Local Car Dealers & Discerning Buyers
        </h1>
        <p class="section-subtitle light-text" style="font-size: 1.05rem; line-height: 1.7;">
          KAARZO was founded with a singular mission: to bring institutional transparency, verified Karnataka RTO records, and seamless digital commerce to the trusted brick-and-mortar car dealerships of Bengaluru.
        </p>
      </div>
    </div>

    <section class="section-padding" style="background: #FFFFFF;">
      <div class="container">
        <div class="section-header-center">
          <span class="section-tag">Core Principles</span>
          <h2 class="section-title">The KAARZO Standard</h2>
          <p class="section-subtitle">
            Why thousands of car buyers across Bangalore trust our verified dealership network.
          </p>
        </div>

        <div class="about-grid">
          <div class="about-card">
            <div class="about-icon-box">${icons.shield}</div>
            <h3 class="about-card-title">Dealership Verification</h3>
            <p class="about-card-desc">
              Every dealership is verified through physical showroom audits, trade licenses, GST compliance, and historical reputation across Bangalore.
            </p>
          </div>

          <div class="about-card">
            <div class="about-icon-box">${icons.car}</div>
            <h3 class="about-card-title">Genuine Odometer & Non-Accidental</h3>
            <p class="about-card-desc">
              We cross-check OEM service records with Tata, Mahindra, Toyota, Hyundai, and German manufacturers to ensure zero odometer tampering.
            </p>
          </div>

          <div class="about-card">
            <div class="about-icon-box">${icons.whatsapp}</div>
            <h3 class="about-card-title">Direct Dealer Transparency</h3>
            <p class="about-card-desc">
              No hidden intermediary markups. Buyers communicate directly with showroom owners on WhatsApp, see real cars, and negotiate fairly.
            </p>
          </div>
        </div>

        <!-- Bangalore Presence -->
        <div style="margin-top: 60px; background: var(--light-surface); padding: 36px 24px; border-radius: var(--radius-xl); border: 1px solid var(--light-border);">
          <div style="max-width: 720px; margin: 0 auto; text-align: center;">
            <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; margin-bottom: 12px;">
              Our Bangalore Network
            </h3>
            <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">
              From the bustling tech corridors of Whitefield and Electronic City to the prime automotive showrooms in Indiranagar, Jayanagar, and Koramangala, KAARZO partners with over 500+ verified showrooms.
            </p>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;">
              ${bangaloreLocalities.filter(l => l !== 'All Localities').map(loc => `
                <span style="background: #FFFFFF; border: 1px solid var(--light-border); padding: 6px 14px; border-radius: var(--radius-pill); font-weight: 600; font-size: 0.82rem;">
                  📍 ${loc}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ==========================================================================
// 5. FAQ PAGE
// ==========================================================================
function renderFaqPage() {
  return `
    <section class="section-padding faq-section">
      <div class="container">
        <div class="section-header-center">
          <span class="section-tag">Help & Documentation</span>
          <h1 class="section-title">Frequently Asked Questions</h1>
          <p class="section-subtitle">
            Everything you need to know about buying, Karnataka RTO transfer, inspection, and dealership onboarding in Bangalore.
          </p>
        </div>

        <div class="faq-container">
          ${faqsData.map(cat => `
            <div class="faq-category-block">
              <h3 class="faq-category-title">${cat.category}</h3>
              ${cat.questions.map((item) => `
                <div class="faq-item">
                  <button class="faq-question">
                    <span>${item.q}</span>
                    <span class="faq-icon">+</span>
                  </button>
                  <div class="faq-answer">
                    <p>${item.a}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

// ==========================================================================
// 6. PRIVACY POLICY PAGE
// ==========================================================================
function renderPrivacyPage() {
  return `
    <section class="section-padding" style="background: #FFFFFF;">
      <div class="container" style="max-width: 860px;">
        <div style="margin-bottom: 36px;">
          <span class="section-tag">Legal & Compliance</span>
          <h1 class="section-title" style="margin-bottom: 10px;">Privacy Policy & User Terms</h1>
          <p style="font-size: 0.88rem; color: var(--text-muted);">Last Updated: October 2026 • Bengaluru, Karnataka Jurisdiction</p>
        </div>

        <div style="font-size: 0.95rem; line-height: 1.8; color: var(--text-secondary); display: flex; flex-direction: column; gap: 20px;">
          <p>
            Welcome to <strong>KAARZO</strong> ("we," "our," or "us"). KAARZO Mobility Technologies Pvt Ltd is committed to protecting the privacy of buyers, vehicle dealerships, and visitors across our website and digital services. This Privacy Policy explains our practices regarding data collection, vehicle inspection transparency, and communication flows.
          </p>

          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">
            1. Information We Collect
          </h3>
          <p>
            We collect information you provide directly, such as your name, contact phone number, email address, and preferred test drive schedule when you submit an inquiry for a vehicle listed on KAARZO. For dealerships, we collect verified trade documents, GST registration numbers, showroom location coordinates, and vehicle inventory specifications.
          </p>

          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">
            2. Dealer Communications & WhatsApp Integration
          </h3>
          <p>
            When you click "Chat on WhatsApp" or "Book Test Drive," you are connecting directly with the authorized verified dealership representative in Bangalore holding custody of the vehicle. We do not sell your personal contact numbers to third-party telemarketers.
          </p>

          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">
            3. Vehicle History & Karnataka RTO Records
          </h3>
          <p>
            Vehicle details such as RTO registration codes (e.g. KA-01, KA-03, KA-05), insurance validity, odometer readings, and inspection score summaries are displayed for buyer verification and public transparency as authorized by participating dealerships.
          </p>

          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">
            4. Security & Data Protection
          </h3>
          <p>
            We implement industry-standard SSL encryption and secured cloud servers located in Indian data regions compliant with the Information Technology Act, 2000 and Digital Personal Data Protection Act.
          </p>

          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--text-primary);">
            5. Contact Legal Team
          </h3>
          <p>
            For inquiries regarding privacy, data deletion, or dealer compliance, please contact our Legal Officer at <strong>legal@kaarzo.in</strong> or visit our Bangalore Headquarters at 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru - 560038.
          </p>
        </div>
      </div>
    </section>
  `;
}

// ==========================================================================
// 7. CAR DETAILS MODAL (Interactive Spec Sheet & Test Drive Form)
// ==========================================================================
function renderCarModal() {
  if (!state.activeCarModal) {
    return `<div id="car-modal-backdrop" class="modal-backdrop"></div>`;
  }

  const car = state.activeCarModal;

  return `
    <div id="car-modal-backdrop" class="modal-backdrop active">
      <div class="modal-container">
        <button class="modal-close-btn" id="btn-close-car-modal" aria-label="Close">✕</button>

        <div class="modal-car-hero">
          <img src="${car.image}" alt="${car.title}">
        </div>

        <div class="modal-car-content">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
            <div>
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                ${car.year} • ${car.brand} • ${car.category}
              </span>
              <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin-top: 4px; line-height: 1.2;">
                ${car.title}
              </h2>
              <div style="display: flex; gap: 10px; margin-top: 6px; font-size: 0.82rem; color: var(--text-secondary);">
                <span>📍 ${car.dealer.locality}</span>
                <span>•</span>
                <span>⭐ Inspection: <strong>${car.inspectionScore}</strong></span>
              </div>
            </div>

            <div style="text-align: right;">
              <div style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #0F172A;">
                ${car.priceFormatted}
              </div>
              <div style="font-size: 0.82rem; font-weight: 600; color: var(--brand-gold);">
                Estimated EMI: ${car.emiMonthly}
              </div>
            </div>
          </div>

          <p style="font-size: 0.92rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--light-border);">
            ${car.overview}
          </p>

          <!-- Key Technical Specs Table -->
          <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; margin-bottom: 10px;">
            Vehicle Specifications & Certification
          </h3>
          <table class="specs-table">
            <tbody>
              <tr>
                <td class="spec-title">Engine & Powertrain</td>
                <td class="spec-value">${car.engine}</td>
              </tr>
              <tr>
                <td class="spec-title">Fuel & Transmission</td>
                <td class="spec-value">${car.fuelType} • ${car.transmission}</td>
              </tr>
              <tr>
                <td class="spec-title">Odometer (KM Driven)</td>
                <td class="spec-value">${car.kmDriven} (Certified Genuine)</td>
              </tr>
              <tr>
                <td class="spec-title">Ownership & Registration</td>
                <td class="spec-value">${car.ownership} • ${car.rto}</td>
              </tr>
              <tr>
                <td class="spec-title">ARAI Mileage / Range</td>
                <td class="spec-value">${car.mileage}</td>
              </tr>
              <tr>
                <td class="spec-title">Seating & Clearance</td>
                <td class="spec-value">${car.seating} • ${car.groundClearance} Ground Clearance</td>
              </tr>
            </tbody>
          </table>

          <!-- Key Equipment Checklist -->
          <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; margin: 20px 0 10px;">
            Features & Highlights
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; margin-bottom: 24px;">
            ${car.features.map(f => `
              <div style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-secondary); background: var(--light-surface); padding: 8px 10px; border-radius: var(--radius-sm);">
                <span style="color: var(--brand-gold);">${icons.check}</span>
                <span>${f}</span>
              </div>
            `).join('')}
          </div>

          <!-- Dealer Card & Test Drive Booking -->
          <div style="background: var(--light-surface); border: 1px solid var(--light-border); border-radius: var(--radius-lg); padding: 20px; margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
              <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #8D6300; text-transform: uppercase;">Verified Showroom</span>
                <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; margin-top: 2px;">
                  ${car.dealer.name}
                </h4>
                <p style="font-size: 0.82rem; color: var(--text-muted);">${car.dealer.locality}</p>
              </div>

              <a href="https://wa.me/${car.dealer.whatsapp}?text=Hi%20${encodeURIComponent(car.dealer.name)}%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(car.title)}%20(${car.priceFormatted})%20on%20KAARZO.%20Is%20it%20available%20for%20a%20test%20drive%3F" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 class="btn-primary-gold" 
                 style="background: var(--whatsapp-green); color: #FFFFFF;">
                ${icons.whatsapp} Chat on WhatsApp
              </a>
            </div>

            <!-- Booking Form -->
            <form id="car-test-drive-form" style="border-top: 1px solid var(--light-border); padding-top: 16px;">
              <h5 style="font-size: 0.92rem; font-weight: 700; margin-bottom: 10px;">
                Request Doorstep or Showroom Test Drive
              </h5>
              <div class="modal-form-grid">
                <div class="form-group">
                  <label class="form-label">Your Full Name</label>
                  <input type="text" class="form-control" required placeholder="e.g. Rahul Sharma">
                </div>
                <div class="form-group">
                  <label class="form-label">Mobile Number</label>
                  <input type="tel" class="form-control" required placeholder="e.g. +91 98800 12345">
                </div>
                <div class="form-group full-width">
                  <label class="form-label">Preferred Date & Bangalore Location</label>
                  <input type="text" class="form-control" required placeholder="e.g. Saturday 4 PM at Indiranagar Showroom">
                </div>
              </div>
              <button type="submit" class="btn-primary-gold" style="width: 100%; margin-top: 14px; padding: 12px;">
                Confirm Test Drive Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// 8. DEALER ONBOARDING MODAL
// ==========================================================================
function renderDealerModal() {
  if (!state.activeDealerModal) {
    return `<div id="dealer-modal-backdrop" class="modal-backdrop"></div>`;
  }

  return `
    <div id="dealer-modal-backdrop" class="modal-backdrop active">
      <div class="modal-container" style="max-width: 620px;">
        <button class="modal-close-btn" id="btn-close-dealer-modal" aria-label="Close">✕</button>

        <div style="padding: 30px 24px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="/src/assets/logo/kaarzo_logo.png" alt="KAARZO" style="height: 62px; width: auto; object-fit: contain; margin-bottom: 12px; display: inline-block; filter: drop-shadow(0 3px 8px rgba(0,0,0,0.12));" />
            <h2 style="font-family: var(--font-heading); font-size: 1.55rem; font-weight: 800;">
              Register Your Dealership
            </h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
              Join KAARZO’s verified showroom network across Bangalore & Karnataka.
            </p>
          </div>

          <form id="dealer-onboarding-form">
            <div class="modal-form-grid">
              <div class="form-group">
                <label class="form-label">Showroom Name</label>
                <input type="text" class="form-control" required placeholder="e.g. Royal Auto Hub">
              </div>
              <div class="form-group">
                <label class="form-label">Dealer / Manager Name</label>
                <input type="text" class="form-control" required placeholder="e.g. Suresh Gowda">
              </div>
              <div class="form-group">
                <label class="form-label">Bangalore Locality</label>
                <select class="form-control" required>
                  ${bangaloreLocalities.filter(l => l !== 'All Localities').map(l => `<option value="${l}">${l}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">WhatsApp Number</label>
                <input type="tel" class="form-control" required placeholder="+91 98800 00000">
              </div>
              <div class="form-group full-width">
                <label class="form-label">Showroom Address</label>
                <input type="text" class="form-control" required placeholder="Plot, Street, Main Road, Pincode">
              </div>
              <div class="form-group full-width">
                <label class="form-label">Current Inventory Size</label>
                <select class="form-control">
                  <option>10 - 25 Cars</option>
                  <option>25 - 50 Cars</option>
                  <option>50+ Cars (Large Showroom)</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn-primary-gold" style="width: 100%; margin-top: 20px; padding: 12px; font-size: 0.95rem;">
              Submit for Verification →
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// EVENT LISTENERS & INTERACTION HANDLERS
// ==========================================================================
function attachEventListeners() {
  // Mobile Nav Drawer Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileCloseBtn = document.getElementById('mobile-nav-close-btn');
  const mobileBackdrop = document.getElementById('mobile-nav-backdrop');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      state.mobileNavOpen = true;
      renderApp();
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', () => {
      state.mobileNavOpen = false;
      renderApp();
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', (e) => {
      if (e.target === mobileBackdrop) {
        state.mobileNavOpen = false;
        renderApp();
      }
    });
  }

  const btnMobileDealer = document.getElementById('btn-mobile-dealer-modal');
  if (btnMobileDealer) {
    btnMobileDealer.addEventListener('click', () => {
      state.mobileNavOpen = false;
      state.activeDealerModal = true;
      renderApp();
    });
  }

  // Mobile Filter Drawer Toggle on Search Page
  const toggleMobileFilters = document.getElementById('btn-toggle-mobile-filters');
  const closeMobileFilters = document.getElementById('btn-close-mobile-filters');
  const applyMobileFilters = document.getElementById('btn-apply-mobile-filters');

  if (toggleMobileFilters) {
    toggleMobileFilters.addEventListener('click', () => {
      state.mobileFilterOpen = true;
      renderApp();
    });
  }

  if (closeMobileFilters) {
    closeMobileFilters.addEventListener('click', () => {
      state.mobileFilterOpen = false;
      renderApp();
    });
  }

  if (applyMobileFilters) {
    applyMobileFilters.addEventListener('click', () => {
      state.mobileFilterOpen = false;
      renderApp();
    });
  }

  // Category Tabs Filter
  document.querySelectorAll('.cat-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat');
      state.selectedCategory = cat;
      renderApp();
    });
  });

  // Brand Cards Click to Filter
  document.querySelectorAll('.explore-brand-card').forEach(card => {
    card.addEventListener('click', () => {
      const brandName = card.getAttribute('data-brand');
      if (brandName) {
        // Find matching cars by brand or set search query
        state.searchQuery = brandName === 'Tata Motors' ? 'Tata' : (brandName === 'Maruti Suzuki' ? 'Maruti' : brandName);
        window.location.hash = '#/buy-cars';
      }
    });
  });

  // Open Car Detail Modal
  document.querySelectorAll('.btn-view-car').forEach(btn => {
    btn.addEventListener('click', () => {
      const carId = btn.getAttribute('data-id');
      const foundCar = carsData.find(c => c.id === carId);
      if (foundCar) {
        state.activeCarModal = foundCar;
        renderApp();
      }
    });
  });

  // Close Car Modal
  const closeCarModalBtn = document.getElementById('btn-close-car-modal');
  if (closeCarModalBtn) {
    closeCarModalBtn.addEventListener('click', () => {
      state.activeCarModal = null;
      renderApp();
    });
  }

  // Close Modal on Backdrop Click
  const carBackdrop = document.getElementById('car-modal-backdrop');
  if (carBackdrop) {
    carBackdrop.addEventListener('click', (e) => {
      if (e.target === carBackdrop) {
        state.activeCarModal = null;
        renderApp();
      }
    });
  }

  // Open Dealer Modal
  const openDealerBtn = document.getElementById('btn-open-dealer-modal');
  if (openDealerBtn) {
    openDealerBtn.addEventListener('click', () => {
      state.activeDealerModal = true;
      renderApp();
    });
  }

  const ctaDealerBtn = document.getElementById('btn-cta-dealer-onboard');
  if (ctaDealerBtn) {
    ctaDealerBtn.addEventListener('click', () => {
      state.activeDealerModal = true;
      renderApp();
    });
  }

  const homeDealerCta = document.getElementById('btn-home-dealer-cta');
  if (homeDealerCta) {
    homeDealerCta.addEventListener('click', () => {
      state.activeDealerModal = true;
      renderApp();
    });
  }

  // Close Dealer Modal
  const closeDealerBtn = document.getElementById('btn-close-dealer-modal');
  if (closeDealerBtn) {
    closeDealerBtn.addEventListener('click', () => {
      state.activeDealerModal = false;
      renderApp();
    });
  }

  const dealerBackdrop = document.getElementById('dealer-modal-backdrop');
  if (dealerBackdrop) {
    dealerBackdrop.addEventListener('click', (e) => {
      if (e.target === dealerBackdrop) {
        state.activeDealerModal = false;
        renderApp();
      }
    });
  }

  // Hero Quick Search Form
  const heroForm = document.getElementById('hero-quick-search-form');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const brand = document.getElementById('hero-search-brand').value;
      const type = document.getElementById('hero-search-type').value;
      const budget = document.getElementById('hero-search-budget').value;
      const loc = document.getElementById('hero-search-locality').value;

      state.searchQuery = brand || '';
      state.selectedCategory = type || 'all';
      if (budget) state.maxPrice = Number(budget);
      if (loc && loc !== 'All Localities') state.selectedLocality = loc;

      window.location.hash = '#/search';
    });
  }

  // FAQ Accordion Toggle
  document.querySelectorAll('.faq-question').forEach(qBtn => {
    qBtn.addEventListener('click', () => {
      const parent = qBtn.closest('.faq-item');
      if (parent) {
        parent.classList.toggle('open');
      }
    });
  });

  // EMI Calculator Slider Listeners
  const sliderAmount = document.getElementById('calc-slider-amount');
  const sliderRate = document.getElementById('calc-slider-rate');
  const sliderTenure = document.getElementById('calc-slider-tenure');

  if (sliderAmount && sliderRate && sliderTenure) {
    const updateCalc = () => {
      state.emiLoanAmount = Number(sliderAmount.value);
      state.emiInterestRate = Number(sliderRate.value);
      state.emiTenureYears = Number(sliderTenure.value);

      const res = calculateEMI(state.emiLoanAmount, state.emiInterestRate, state.emiTenureYears);

      const dispAmount = document.getElementById('disp-calc-amount');
      const dispRate = document.getElementById('disp-calc-rate');
      const dispTenure = document.getElementById('disp-calc-tenure');
      const dispMonthly = document.getElementById('disp-calc-monthly');
      const dispPrincipal = document.getElementById('disp-calc-principal');
      const dispInterest = document.getElementById('disp-calc-interest');
      const dispTotal = document.getElementById('disp-calc-total');

      if (dispAmount) dispAmount.innerText = formatINR(state.emiLoanAmount);
      if (dispRate) dispRate.innerText = `${state.emiInterestRate}% p.a.`;
      if (dispTenure) dispTenure.innerText = `${state.emiTenureYears} Years (${state.emiTenureYears * 12} Months)`;
      if (dispMonthly) dispMonthly.innerHTML = `₹ ${res.monthlyEMI.toLocaleString('en-IN')}<span style="font-size: 1rem; color: #94A3B8;"> /mo</span>`;
      if (dispPrincipal) dispPrincipal.innerText = formatINR(state.emiLoanAmount);
      if (dispInterest) dispInterest.innerText = formatINR(res.totalInterest);
      if (dispTotal) dispTotal.innerText = formatINR(res.totalPayable);
    };

    sliderAmount.addEventListener('input', updateCalc);
    sliderRate.addEventListener('input', updateCalc);
    sliderTenure.addEventListener('input', updateCalc);
  }

  // Search Page Event Listeners
  const searchInput = document.getElementById('search-input-query');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderApp();
    });
  }

  const locSelect = document.getElementById('filter-locality-select');
  if (locSelect) {
    locSelect.addEventListener('change', (e) => {
      state.selectedLocality = e.target.value;
      renderApp();
    });
  }

  const priceSlider = document.getElementById('filter-price-slider');
  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      state.maxPrice = Number(e.target.value);
      const disp = document.getElementById('disp-max-price');
      if (disp) disp.innerText = formatINR(state.maxPrice);
    });
    priceSlider.addEventListener('change', () => {
      renderApp();
    });
  }

  document.querySelectorAll('.filter-fuel-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      const selected = Array.from(document.querySelectorAll('.filter-fuel-cb:checked')).map(c => c.value);
      state.selectedFuel = selected;
      renderApp();
    });
  });

  document.querySelectorAll('.filter-trans-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      const selected = Array.from(document.querySelectorAll('.filter-trans-cb:checked')).map(c => c.value);
      state.selectedTrans = selected;
      renderApp();
    });
  });

  const sortSelect = document.getElementById('search-sort-select') || document.getElementById('catalog-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderApp();
    });
  }

  const resetBtn = document.getElementById('btn-reset-filters') || document.getElementById('btn-reset-filters-empty');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.searchQuery = '';
      state.selectedLocality = 'All Localities';
      state.selectedFuel = [];
      state.selectedTrans = [];
      state.maxPrice = 6000000;
      state.sortBy = 'featured';
      state.mobileFilterOpen = false;
      renderApp();
    });
  }

  // Test Drive Form Submission
  const testDriveForm = document.getElementById('car-test-drive-form');
  if (testDriveForm) {
    testDriveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert(`🎉 Test Drive Request Confirmed!\n\nThe dealership (${state.activeCarModal.dealer.name}) in ${state.activeCarModal.dealer.locality} has received your request for the ${state.activeCarModal.title}.\n\nTheir team will contact you via WhatsApp / Phone shortly.`);
      state.activeCarModal = null;
      renderApp();
    });
  }

  // Dealer Onboarding Form Submission
  const dealerForm = document.getElementById('dealer-onboarding-form');
  if (dealerForm) {
    dealerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert(`✅ Showroom Verification Submitted!\n\nThank you for registering with KAARZO. Our Bangalore dealer onboarding team will verify your showroom details and activate your dealer dashboard within 24 hours.`);
      state.activeDealerModal = false;
      renderApp();
    });
  }
}

// Initial App Mount
renderApp();
