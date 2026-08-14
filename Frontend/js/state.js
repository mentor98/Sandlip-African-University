import {
  student,
  courses,
  availableCourses,
  assignments,
  notificationsList,
  communityPosts,
  innovationProjects,
  supportTickets,
  feeTransactions
} from './data.js';
import { getIcon } from './icons.js';

export const state = {
  route: location.hash.slice(1) || 'dashboard',
  loggedIn: localStorage.sauSession === 'true',
  dark: localStorage.sauTheme === 'dark',
  studentData: { ...student },
  registeredCourses: [...courses],
  availableCourseCatalog: [...availableCourses],
  userAssignments: [...assignments],
  userNotifications: [...notificationsList],
  userCommunityPosts: [...communityPosts],
  userInnovationProjects: [...innovationProjects],
  userSupportTickets: [...supportTickets],
  userFeeTransactions: [...feeTransactions],
  selectedSemester: "1st Semester 2026/2027",
  assignmentFilter: "All",
  libraryCategory: "All",
  announcementCategory: "All"
};

export function toast(message) {
  const region = document.querySelector('#toast-region');
  if (region) {
    region.innerHTML = `<div class="toast">${message}</div>`;
    setTimeout(() => { region.innerHTML = ''; }, 3000);
  }
}

export function navigate(route) {
  state.route = route;
  location.hash = route;
  if (window.appRender) {
    window.appRender();
  }
  window.scrollTo(0, 0);
}

export function modal(title, contentHtml, primaryActionText, onConfirm, isWide) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  const useWide = isWide || contentHtml.includes('a4-container') || contentHtml.includes('half-a4-page') || contentHtml.includes('slip-container');
  backdrop.innerHTML = `
    <div class="modal ${useWide ? 'modal-wide' : ''}">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;" class="no-print">
        <h3 style="margin:0; font-size:18px; color:var(--navy);">${title}</h3>
      </div>
      <div>${contentHtml}</div>
      <div class="modal-actions no-print">
        <button class="secondary-btn" data-close>Close</button>
        ${primaryActionText ? `<button class="primary-btn" data-ok>${primaryActionText}</button>` : ''}
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);
  
  backdrop.querySelectorAll('[data-close]').forEach(btn => btn.onclick = () => backdrop.remove());
  if (primaryActionText && onConfirm) {
    const okBtn = backdrop.querySelector('[data-ok]');
    if (okBtn) {
      okBtn.onclick = () => {
        onConfirm();
        backdrop.remove();
      };
    }
  }
}

export function metricCard(icon, label, value, note, colorName = null) {
  const isTextValue = typeof value === 'string' && (value.length > 10 || value.includes(' '));
  const valClass = isTextValue ? 'metric-value text-value' : 'metric-value';
  const colorStyle = colorName ? `style="color: var(--${colorName}, ${colorName});"` : '';
  const iconColor = colorName ? `var(--${colorName}, ${colorName})` : 'var(--teal)';
  const iconBg = colorName === 'gold' ? 'rgba(217, 162, 27, 0.12)' : colorName === 'green' ? 'rgba(16, 185, 129, 0.12)' : colorName === 'danger' ? 'rgba(239, 68, 68, 0.12)' : 'var(--teal-light)';

  return `
    <article class="card metric-card">
      ${icon ? `<span class="metric-icon" style="background:${iconBg}; color:${iconColor};">${getIcon(icon, 22, iconColor)}</span>` : ''}
      <div class="metric-label">${label}</div>
      <div class="${valClass}" ${colorStyle}>${value}</div>
      ${note ? `<div class="metric-note">${note}</div>` : ''}
    </article>
  `;
}

export function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';      // 12:00 AM - 11:59 AM
  if (hour < 15) return 'Good afternoon';    // 12:00 PM - 2:59 PM
  if (hour < 23) return 'Good evening';      // 3:00 PM - 10:59 PM
  return 'Good night';                        // 11:00 PM - 11:59 PM
}
