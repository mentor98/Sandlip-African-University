import { nav } from './data.js';
import { getIcon } from './icons.js';
import { state, navigate } from './state.js';
import { logout } from './auth.js';

export function updateSidebarBadge() {
  const badge = document.querySelector('#nav-active-edge-badge');
  const sidebarEl = document.querySelector('#app-sidebar');
  const activeBtn = sidebarEl?.querySelector('.nav-item.active');

  if (!badge || !sidebarEl || !activeBtn) {
    if (badge) badge.style.opacity = '0';
    return;
  }

  const sidebarRect = sidebarEl.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();

  const targetTop = (btnRect.top - sidebarRect.top) + (btnRect.height / 2) - 15;

  badge.style.top = `${targetTop}px`;
  badge.style.opacity = '1';
}

export function sidebar() {
  return `
    <aside class="sidebar" id="app-sidebar">
      <div class="brand">
        <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786460835/SAU_logo_brwpc2.png" alt="SAU Logo" class="brand-logo-mark" style="height: 36px; width: auto; flex-shrink: 0;" referrerPolicy="no-referrer" />
        <div style="font-family: var(--bs-body-font-family); font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;">
          <span style="font-size: 13.5px; letter-spacing: -0.2px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">SANDLIP AFRICA UNIVERSITY</span>
          <small style="display: block; font-size: 10px; color: var(--teal-light); font-weight: 700; letter-spacing: 0.5px; white-space: nowrap;">STUDENT PORTAL</small>
        </div>
      </div>

      <nav style="flex: 1; display: flex; flex-direction: column; justify-content: space-evenly; position: relative;">
        ${nav.map(([name, icon, route]) => {
          if (!route) {
            return `<div class="nav-group">${name}</div>`;
          }
          const isActive = state.route === route;
          return `
            <button class="nav-item ${isActive ? 'active' : ''}" data-route="${route}">
              <span class="nav-icon">${getIcon(icon, 18)}</span>
              <span class="nav-label">${name}</span>
            </button>
          `;
        }).join('')}
      </nav>

      <div class="nav-active-edge-badge" id="nav-active-edge-badge" aria-hidden="true">
        <span class="nav-active-edge-icon">
          <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </span>
      </div>
    </aside>
  `;
}

export function topbar() {
  const titleMap = {
    dashboard: "Dashboard",
    courses: "My Course",
    registration: "Course Registration",
    results: "Results & Grades",
    accommodation: "Reserve Accomodation",
    timetable: "Timetable",
    fees: "Fees & Payments",
    documents: "Printable Documents",
    biodata: "Print Biodata Form",
    community: "Student Community",
    convocation: "Convocation Payment",
    profile: "My Profile",
    settings: "Settings",
    password: "Change Password"
  };

  const currentTitle = titleMap[state.route] || "Student Portal";

  return `
    <header class="topbar">
      <div style="display:flex; align-items:center; gap:14px;">
        <button class="mobile-menu-btn" id="btn-toggle-menu">${getIcon('menu', 20)}</button>
        <div class="crumb">
          SAU Portal <strong>› ${currentTitle}</strong>
        </div>
      </div>

      <div class="top-actions">
        <div class="profile-mini" data-route="profile" style="cursor:pointer;">
          <div class="avatar sm">ET</div>
          <div>
            <b>${state.studentData.name}</b>
            <span>${state.studentData.level} • ${state.studentData.programme.split(' ')[1]}</span>
          </div>
        </div>
      </div>
    </header>
  `;
}

export function mobileBottomNav() {
  return `
    <div class="mobile-bottom-nav">
      <button class="mobile-nav-btn ${state.route === 'dashboard' ? 'active' : ''}" data-route="dashboard">
        ${getIcon('home', 16)} Dashboard
      </button>
      <button class="mobile-nav-btn ${state.route === 'courses' ? 'active' : ''}" data-route="courses">
        ${getIcon('book', 16)} Courses
      </button>
      <button class="mobile-nav-btn ${state.route === 'results' ? 'active' : ''}" data-route="results">
        ${getIcon('chart', 16)} Results
      </button>
      <button class="mobile-nav-btn ${state.route === 'fees' ? 'active' : ''}" data-route="fees">
        ${getIcon('credit-card', 16)} Fees
      </button>
      <button class="mobile-nav-btn ${state.route === 'profile' ? 'active' : ''}" data-route="profile">
        ${getIcon('user', 16)} Profile
      </button>
    </div>
  `;
}

export function shell(viewHtml) {
  const app = document.querySelector('#app');
  const existingShell = app.querySelector('.shell');
  if (existingShell) {
    const contentEl = app.querySelector('.content');
    if (contentEl) contentEl.innerHTML = viewHtml;

    const mainEl = app.querySelector('.main');
    const oldTopbar = mainEl?.querySelector('.topbar');
    if (oldTopbar) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = topbar();
      const newTopbar = tempDiv.firstElementChild;
      if (newTopbar) {
        oldTopbar.replaceWith(newTopbar);
        newTopbar.querySelector('#btn-toggle-menu')?.addEventListener('click', () => {
          const sidebar = document.querySelector('#app-sidebar');
          sidebar?.classList.toggle('open');
          setTimeout(() => updateSidebarBadge(), 150);
        });
      }
    }

    app.querySelectorAll('.sidebar .nav-item').forEach(btn => {
      const isActive = btn.dataset.route === state.route;
      btn.classList.toggle('active', isActive);
    });

    app.querySelectorAll('.mobile-bottom-nav .mobile-nav-btn').forEach(btn => {
      const isActive = btn.dataset.route === state.route;
      btn.classList.toggle('active', isActive);
    });

    updateSidebarBadge();
    return;
  }

  app.innerHTML = `
    <div class="shell">
      ${sidebar()}
      <main class="main">
        ${topbar()}
        <section class="content">
          ${viewHtml}
        </section>
      </main>
      ${mobileBottomNav()}
    </div>
  `;

  app.querySelectorAll('[data-route]').forEach(btn => {
    btn.onclick = () => {
      const target = btn.dataset.route;
      document.querySelector('#app-sidebar')?.classList.remove('open');
      if (target === 'logout') {
        logout();
      } else {
        navigate(target);
      }
    };
  });

  document.querySelector('#sidebar-logout')?.addEventListener('click', logout);
  
  document.querySelector('#btn-toggle-menu')?.addEventListener('click', () => {
    const sidebarEl = document.querySelector('#app-sidebar');
    sidebarEl?.classList.toggle('open');
    setTimeout(() => updateSidebarBadge(), 150);
  });

  requestAnimationFrame(() => updateSidebarBadge());
  setTimeout(() => updateSidebarBadge(), 50);
}
