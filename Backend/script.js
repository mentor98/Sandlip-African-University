import {
  student,
  nav,
  courses,
  availableCourses,
  semesterResults,
  results,
  timetable,
  assignments,
  exams,
  feeBreakdown,
  feeTransactions,
  libraryResources,
  lecturers,
  announcements,
  events,
  communityPosts,
  innovationProjects,
  researchItems,
  achievements,
  leaderboard,
  learningResources,
  notificationsList,
  messagesData,
  supportFaqs,
  supportTickets
} from './data.js';

import { supabase, isSupabaseConfigured } from './supabase.js';
import { getIcon, getReactionIcon } from './icons.js';

// Global Application State
const state = {
  route: location.hash.slice(1) || 'dashboard',
  loggedIn: localStorage.sauSession === 'true',
  dark: localStorage.sauTheme === 'dark',
  studentData: { ...student, avatarUrl: localStorage.sauStudentAvatar || null },
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

const app = document.querySelector('#app');

function toast(message) {
  const region = document.querySelector('#toast-region');
  if (region) {
    region.innerHTML = `<div class="toast">${message}</div>`;
    setTimeout(() => { region.innerHTML = ''; }, 3000);
  }
}

function navigate(route) {
  state.route = route;
  location.hash = route;
  render();
  window.scrollTo(0, 0);
}

function payWithPaystack({ email, amountNaira, description, onSuccess, onClose }) {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_live_899819a7f656370713342dff8e587803a584a5c2';
  const rawNum = typeof amountNaira === 'number' ? amountNaira : Number(String(amountNaira).replace(/[^0-9.]/g, '')) || 145000;
  const amountInKobo = Math.round(rawNum * 100);
  const ref = `SAU-PAY-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const studentEmail = email || state.studentData.email || 'student@sau.edu.ng';

  if (window.PaystackPop && typeof window.PaystackPop.setup === 'function') {
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: studentEmail,
      amount: amountInKobo,
      currency: 'NGN',
      ref: ref,
      metadata: {
        custom_fields: [
          {
            display_name: "Student Name",
            variable_name: "student_name",
            value: state.studentData.name
          },
          {
            display_name: "Matriculation Number",
            variable_name: "matric_no",
            value: state.studentData.id
          },
          {
            display_name: "Payment Description",
            variable_name: "payment_description",
            value: description || "SAU Fee Payment"
          }
        ]
      },
      callback: function(response) {
        const verifiedRef = (response && response.reference) ? response.reference : ref;
        toast(`Paystack Payment Approved! Ref: ${verifiedRef}`);
        if (typeof onSuccess === 'function') {
          onSuccess(verifiedRef, rawNum);
        }
      },
      onClose: function() {
        toast('Paystack checkout window closed.');
        if (typeof onClose === 'function') onClose();
      }
    });
    handler.openIframe();
  } else {
    // Fallback handler
    toast('Initializing Paystack Payment Gateway...');
    setTimeout(() => {
      toast(`Paystack Payment Approved! Ref: ${ref}`);
      if (typeof onSuccess === 'function') {
        onSuccess(ref, rawNum);
      }
    }, 1000);
  }
}

function modal(title, contentHtml, primaryActionText, onConfirm, isWide) {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.remove());

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
        <button class="secondary-btn" data-close>${primaryActionText ? 'Cancel' : 'Close'}</button>
        ${primaryActionText ? `<button class="primary-btn" data-ok>${primaryActionText}</button>` : ''}
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);
  
  backdrop.querySelectorAll('[data-close]').forEach(btn => {
    btn.onclick = () => backdrop.remove();
  });

  const okBtn = backdrop.querySelector('[data-ok]');
  if (okBtn) {
    okBtn.onclick = () => {
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
      backdrop.remove();
    };
  }
}

function loginView() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.remove());
  if (window.loginBgTimer) clearInterval(window.loginBgTimer);

  app.innerHTML = `
    <main class="login-page">
      <div class="login-bg-slider">
        <div class="bg-slide active" style="background-image: url('https://res.cloudinary.com/jinrrp4r/image/upload/v1786461511/image_2_jp8efa.jpg'); transform: scaleX(-1);"></div>
        <div class="bg-slide" style="background-image: url('https://res.cloudinary.com/jinrrp4r/image/upload/v1786461511/image_3_rlafgh.jpg'); transform: scaleX(-1);"></div>
        <div class="bg-slide" style="background-image: url('https://res.cloudinary.com/jinrrp4r/image/upload/v1786461511/image_1_d0awml.jpg');"></div>
        <div class="bg-overlay"></div>
      </div>

      <section class="login-brand">
        <div class="brand">
          <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786460835/SAU_logo_brwpc2.png" alt="SAU Logo" class="brand-logo-mark" referrerPolicy="no-referrer" />
          <div style="font-family: var(--bs-body-font-family); font-weight: 800;">
            SANDLIP AFRICA UNIVERSITY
            <small style="font-family: var(--font);">TECHNOLOGY • INNOVATION • COMMUNITY</small>
          </div>
        </div>
        
        <div class="hero">
          <h1>Your future, organized in one technological Institution.</h1>
          <p>Access your academic journey, university life, financial records, and innovation network in one seamless experience.</p>
        </div>

        <small style="color: var(--navy); font-weight: 600; opacity: 0.8;">© 2026 Sandlip Africa University. All rights reserved.</small>
      </section>

      <section class="login-card">
        <div style="text-align: center; display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786460835/SAU_logo_brwpc2.png" alt="SAU Logo" class="brand-logo-mark" style="height: 52px; width: auto; margin-bottom: 12px; display: block;" referrerPolicy="no-referrer" />
          <h2 style="margin: 0 0 6px; font-size: 26px; font-weight: 700;">Welcome back</h2>
          <p style="margin: 0; color: var(--muted);">Sign in with your student credentials to access your portal.</p>
        </div>

        <form id="login-form">
          <label class="form-label">Student ID / Matric Number</label>
          <input id="login-id" class="field" value="${state.studentData.id}" required placeholder="SAU/CSC/2026/001" />

          <label class="form-label">Password</label>
          <div class="password-wrap">
            <input id="login-pass" class="field" type="password" value="student2026" required />
            <button type="button" class="toggle-password" id="btn-toggle-pass">Show</button>
          </div>

          <div class="form-row">
            <label class="check">
              <input type="checkbox" checked /> Remember me
            </label>
            <button type="button" class="link-btn" id="btn-forgot-pass">Forgot password?</button>
          </div>

          <button type="submit" class="primary-btn full">Sign in to portal</button>
        </form>
      </section>
    </main>
  `;

  // Start background slideshow timer (changes image every 5 seconds)
  let currentSlide = 0;
  const slides = document.querySelectorAll('.login-bg-slider .bg-slide');
  if (slides.length > 0) {
    window.loginBgTimer = setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000);
  }

  document.querySelector('#btn-toggle-pass').onclick = (e) => {
    const input = document.querySelector('#login-pass');
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    e.target.textContent = isPass ? 'Hide' : 'Show';
  };

  document.querySelector('#login-form').onsubmit = async (e) => {
    e.preventDefault();
    const loginId = document.querySelector('#login-id').value.trim();
    const loginPass = document.querySelector('#login-pass').value.trim();

    if (!loginId || !loginPass) {
      toast('Please enter your Student ID and Password.', 'error');
      return;
    }

    // Optional Supabase Auth attempt without blocking portal login
    if (isSupabaseConfigured && supabase && supabase.auth) {
      try {
        await supabase.auth.signInWithPassword({
          email: loginId.includes('@') ? loginId : state.studentData.email,
          password: loginPass
        });
      } catch (err) {
        console.log('Supabase Auth status:', err.message);
      }
    }

    localStorage.sauSession = 'true';
    state.loggedIn = true;
    toast(`Welcome back, ${state.studentData.name}!`);
    navigate('dashboard');
  };

  document.querySelector('#btn-forgot-pass').onclick = () => {
    modal(
      'Reset Portal Password',
      `
        <p>Enter your university email address below. We will send a password reset link to your inbox.</p>
        <input class="field" style="margin-top:12px" value="${state.studentData.email}" placeholder="student@sau.edu.ng" />
      `,
      'Send Reset Link',
      () => toast('A password reset link has been dispatched to your email address.')
    );
  };
}

function logout() {
  modal(
    'Confirm Logout',
    `
      <div style="padding: 4px 0;">
        <p style="margin: 0; font-size: 15px; font-weight: 600; color: var(--navy);">Are you sure you want to log out?</p>
      </div>
    `,
    'Yes, Log Out',
    () => {
      document.querySelectorAll('.modal-backdrop').forEach(m => m.remove());
      localStorage.removeItem('sauSession');
      state.loggedIn = false;
      state.route = 'login';
      location.hash = 'login';
      toast('Signed out successfully.');
      render();
    }
  );
}

function updateSidebarBadge() {
  const badge = document.querySelector('#nav-active-edge-badge');
  const sidebarEl = document.querySelector('#app-sidebar');
  const activeBtn = sidebarEl?.querySelector('.nav-item.active');

  if (!badge || !sidebarEl || !activeBtn) {
    if (badge) badge.style.opacity = '0';
    return;
  }

  const sidebarRect = sidebarEl.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();

  // Calculate target top relative to sidebar container
  const targetTop = (btnRect.top - sidebarRect.top) + (btnRect.height / 2) - 15;

  badge.style.top = `${targetTop}px`;
  badge.style.opacity = '1';
}

function sidebar() {
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

      <!-- Floating Side Edge Badge Icon on Active Navigation Item -->
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

function topbar() {
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

  const unreadCount = state.userNotifications.filter(n => n.unread).length;
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
          <div class="avatar sm" style="overflow:hidden; border-radius:50%;">
            ${state.studentData.avatarUrl ? `<img src="${state.studentData.avatarUrl}" style="width:100%; height:100%; object-fit:cover;" alt="Avatar" />` : 'ET'}
          </div>
          <div>
            <b>${state.studentData.name}</b>
            <span>${state.studentData.level} • ${state.studentData.programme.split(' ')[1]}</span>
          </div>
        </div>
      </div>
    </header>
  `;
}

function mobileBottomNav() {
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

function shell(viewHtml) {
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

    // Update active classes in sidebar
    app.querySelectorAll('.sidebar .nav-item').forEach(btn => {
      const isActive = btn.dataset.route === state.route;
      btn.classList.toggle('active', isActive);
    });

    // Update active classes in mobile bottom nav
    app.querySelectorAll('.mobile-bottom-nav .mobile-nav-btn').forEach(btn => {
      const isActive = btn.dataset.route === state.route;
      btn.classList.toggle('active', isActive);
    });

    // Smoothly slide badge to new active item
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

  // Attach Navigation Listeners
  app.querySelectorAll('[data-route]').forEach(btn => {
    btn.onclick = (e) => {
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
    const sidebar = document.querySelector('#app-sidebar');
    sidebar?.classList.toggle('open');
    setTimeout(() => updateSidebarBadge(), 150);
  });

  // Calculate and animate badge to active navigation item
  requestAnimationFrame(() => updateSidebarBadge());
  setTimeout(() => updateSidebarBadge(), 50);
}

function metricCard(icon, label, value, note, colorName = null) {
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

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';      // 12:00 AM - 11:59 AM
  if (hour < 15) return 'Good afternoon';    // 12:00 PM - 2:59 PM
  if (hour < 23) return 'Good evening';      // 3:00 PM - 10:59 PM
  return 'Good night';                        // 11:00 PM - 11:59 PM
}

// 1. Dashboard View
function dashboardView() {
  const pendingAssignment = state.userAssignments.find(a => a.status === 'Pending');
  const greeting = getTimeBasedGreeting();
  
  return `
    <h1 class="page-title">${greeting}, Timothy ${getIcon('sparkles', 22, '#D9A21B')}</h1>
    <p class="subtitle">${state.studentData.programme} • ${state.studentData.semester}, ${state.studentData.session}</p>

    <div class="grid metrics-grid">
      ${metricCard('book', 'Registered Courses', `${state.registeredCourses.length}`, `${state.studentData.unitsRegistered} Credit Units`)}
      ${metricCard('calendar', 'Current Semester', state.studentData.semester, 'Active Semester', 'teal')}
      ${metricCard('award', 'Current Session', state.studentData.session, 'Academic Session', 'gold')}
      ${metricCard('user', 'Student Level', state.studentData.level, 'Undergraduate Level', 'green')}
    </div>

    <div class="grid dashboard-grid">
      <div class="grid">
        <section class="card welcome-card">
          <h2 class="welcome-title">
            Welcome Timothy Emmanuel! ${getIcon('sparkles', 22, '#D9A21B')}
          </h2>
          <p class="welcome-text">
            Welcome to our student portal! Get ready to explore, learn, and thrive. Enjoy your educational journey with us!
          </p>
          <div class="info-badges-container">
            <span class="info-badge badge-matric">
              MATRIC NO.: ${state.studentData.id}
            </span>
            <span class="info-badge badge-course">
              COURSE: B.SC. COMPUTER SCIENCE
            </span>
            <span class="info-badge badge-dept">
              DEPARTMENT: DEPARTMENT OF COMPUTER SCIENCE
            </span>
            <span class="info-badge badge-faculty">
              FACULTY: FACULTY OF SCIENCES
            </span>
          </div>
        </section>

        <section class="card">
          <div class="section-head">
            <h3>Recent Announcements</h3>
            <button class="tiny-link" data-route="announcements">View all</button>
          </div>
          ${announcements.slice(0, 3).map(a => `
            <div class="list-row">
              <span class="tag">${a.category}</span>
              <div class="row-content">
                <strong>${a.title}</strong>
                <span>${a.date} • ${a.content.substring(0, 70)}...</span>
              </div>
            </div>
          `).join('')}
        </section>
      </div>

      <div class="grid">
        <section class="card">
          <div class="section-head">
            <h3>Quick Actions</h3>
          </div>
          <div class="quick-actions">
            <button class="quick-btn" data-route="registration"><b>${getIcon('registration', 18)}</b>Register</button>
            <button class="quick-btn" data-route="results"><b>${getIcon('chart', 18)}</b>Results</button>
            <button class="quick-btn" data-route="fees"><b>${getIcon('credit-card', 18)}</b>Pay Fees</button>
            <button class="quick-btn" data-route="transcript"><b>${getIcon('scroll', 18)}</b>Transcript</button>
            <button class="quick-btn" data-route="timetable"><b>${getIcon('calendar', 18)}</b>Timetable</button>
            <button class="quick-btn" data-route="assignments"><b>${getIcon('write', 18)}</b>Assignments</button>
          </div>
        </section>

        <section class="card">
          <div class="section-head">
            <h3>Upcoming Events</h3>
            <button class="tiny-link" data-route="events">View all</button>
          </div>
          ${events.slice(0, 2).map(e => `
            <div class="list-row">
              <div class="datebox">
                <b>${e.dateDay}</b>${e.dateMonth}
              </div>
              <div class="row-content">
                <strong>${e.title}</strong>
                <span>${e.time} • ${e.venue}</span>
              </div>
              <span class="tag gold">${e.category}</span>
            </div>
          `).join('')}
        </section>

        ${pendingAssignment ? `
          <div class="notice-box">
            ${getIcon('clock', 16, '#0F8B8D')} <b>Next Deadline:</b> ${pendingAssignment.title} (${pendingAssignment.course}) due on ${pendingAssignment.deadline}.
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// 2. My Courses View
function coursesView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">My Courses</h1>
        <p class="subtitle">${state.studentData.semester} • ${state.studentData.session}</p>
      </div>
      <button class="primary-btn" data-route="registration">+ Register New Courses</button>
    </div>

    <section class="card table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Title</th>
            <th>Units</th>
            <th>Lecturer</th>
            <th>Schedule</th>
            <th>Attendance</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${state.registeredCourses.map(c => `
            <tr>
              <td><span class="course-code">${c.code}</span></td>
              <td><b>${c.title}</b></td>
              <td>${c.units} Units</td>
              <td>${c.lecturer}</td>
              <td>${c.time}</td>
              <td><b style="color:var(--teal)">${c.attendance || '90%'}</b></td>
              <td><span class="status-pill success">● Registered</span></td>
              <td><button class="secondary-btn" data-course-code="${c.code}">View Syllabus</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>
  `;
}

function setupCoursesListeners() {
  app.querySelectorAll('[data-course-code]').forEach(btn => {
    btn.onclick = () => {
      const code = btn.dataset.courseCode;
      const c = state.registeredCourses.find(item => item.code === code);
      if (c) {
        modal(
          `${c.code} — ${c.title}`,
          `
            <p><b>Lecturer:</b> ${c.lecturer}</p>
            <p><b>Venue & Time:</b> ${c.venue} (${c.time})</p>
            <p style="margin:12px 0;"><b>Description:</b> ${c.description}</p>
            <h4>Course Syllabus Outline:</h4>
            <ul style="padding-left:20px; margin-top:8px;">
              ${c.syllabus.map(s => `<li style="margin-bottom:4px;">${s}</li>`).join('')}
            </ul>
          `,
          'Close'
        );
      }
    };
  });
}

// 3. Course Registration View
function registrationView() {
  const currentUnits = state.registeredCourses.reduce((sum, c) => sum + (Number(c.units) || 0), 0);
  state.studentData.unitsRegistered = currentUnits;

  const minUnits = Number(state.studentData.minUnitsAllowed) || 12;
  const maxUnits = Number(state.studentData.maxUnitsAllowed) || 24;
  const isValidStanding = currentUnits >= minUnits && currentUnits <= maxUnits;

  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Course Registration</h1>
        <p class="subtitle">Select, add, or drop departmental courses for ${state.studentData.semester}, ${state.studentData.session}</p>
      </div>
      <button class="primary-btn" id="btn-submit-registration">${getIcon('check', 16)} Finalize & Submit Registration</button>
    </div>

    <!-- Summary Metrics -->
    <div class="grid metrics-grid" style="margin-bottom:20px;">
      <div class="card metric-card">
        <div class="metric-head">
          <span class="metric-label">Units Registered</span>
          ${getIcon('book', 20, 'var(--teal)')}
        </div>
        <div class="metric-value">${currentUnits} <span style="font-size:14px; font-weight:500; color:var(--muted);">/ ${maxUnits} Max</span></div>
        <div style="height:6px; background:var(--line); border-radius:10px; overflow:hidden; margin-top:8px;">
          <div style="width:${Math.min(100, (currentUnits / maxUnits) * 100)}%; height:100%; background:var(--teal);"></div>
        </div>
      </div>

      <div class="card metric-card">
        <div class="metric-head">
          <span class="metric-label">Registered Courses</span>
          ${getIcon('award', 20, 'var(--navy)')}
        </div>
        <div class="metric-value">${state.registeredCourses.length}</div>
        <div class="metric-sub">Active course load</div>
      </div>

      <div class="card metric-card">
        <div class="metric-head">
          <span class="metric-label">Available to Add</span>
          ${getIcon('calendar', 20, 'var(--gold)')}
        </div>
        <div class="metric-value">${state.availableCourseCatalog.length}</div>
        <div class="metric-sub">Departmental electives/core</div>
      </div>

      <div class="card metric-card">
        <div class="metric-head">
          <span class="metric-label">Academic Standing</span>
          ${getIcon('check', 20, isValidStanding ? '#10B981' : '#F59E0B')}
        </div>
        <div class="metric-value" style="font-size:16px;">
          ${isValidStanding 
            ? `<span class="tag green" style="font-size:13px; padding:6px 12px;">✓ Valid (${minUnits}–${maxUnits} Units)</span>`
            : `<span class="tag gold" style="font-size:13px; padding:6px 12px;">⚠ Under Min (${currentUnits}/${minUnits})</span>`
          }
        </div>
        <div class="metric-sub">Requires minimum 12 units</div>
      </div>
    </div>

    <!-- Tabular Section 1: Registered Courses -->
    <div class="card table-wrap" style="margin-bottom:24px;">
      <div class="section-head" style="padding:16px 20px; border-bottom:1px solid var(--line); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="margin:0; font-size:16px; color:var(--navy); font-weight:700;">1. Currently Registered Courses (${state.registeredCourses.length})</h3>
          <p style="margin:2px 0 0; font-size:12px; color:var(--muted);">Courses currently recorded on your registration form for this semester.</p>
        </div>
        <span class="tag green">Total Load: ${currentUnits} Units</span>
      </div>

      ${state.registeredCourses.length === 0 ? `
        <div style="padding:30px; text-align:center; color:var(--muted);">
          <p style="margin:0 0 8px; font-size:14px; font-weight:600;">No courses currently registered.</p>
          <p style="margin:0; font-size:12px;">Browse available departmental courses below and click "Add Course" to begin.</p>
        </div>
      ` : `
        <table class="data-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Units</th>
              <th>Lecturer</th>
              <th>Status</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.registeredCourses.map(c => `
              <tr>
                <td>
                  <b class="course-code" data-course-code="${c.code}" style="cursor:pointer;" title="Click to view course outline">${c.code}</b>
                </td>
                <td><b style="color:var(--text);">${c.title}</b></td>
                <td><b>${c.units} Units</b></td>
                <td><span style="font-size:13px; color:var(--muted);">${c.lecturer || 'Faculty Staff'}</span></td>
                <td><span class="tag green">Registered</span></td>
                <td style="text-align:right;">
                  <button class="secondary-btn sm" data-drop-course="${c.code}" style="color:#e53e3e; border-color:#fca5a5; background:#fff5f5; padding:6px 12px; font-weight:600;" title="Drop ${c.code}">
                    Drop Course
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background:var(--bg); font-weight:700;">
              <td colspan="2" style="padding:12px 16px;">Total Registered Credit Load</td>
              <td colspan="4" style="padding:12px 16px; color:var(--teal); font-size:15px;">
                ${currentUnits} Credit Units ${currentUnits < minUnits ? `<span style="font-size:12px; font-weight:normal; color:#e53e3e; margin-left:8px;">(Need at least ${minUnits} Units)</span>` : ''}
              </td>
            </tr>
          </tfoot>
        </table>
      `}
    </div>

    <!-- Tabular Section 2: Available Courses to Add -->
    <div class="card table-wrap">
      <div class="section-head" style="padding:16px 20px; border-bottom:1px solid var(--line); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="margin:0; font-size:16px; color:var(--navy); font-weight:700;">2. Available Departmental Courses (${state.availableCourseCatalog.length})</h3>
          <p style="margin:2px 0 0; font-size:12px; color:var(--muted);">Select additional courses to add to your semester load.</p>
        </div>
        <span class="tag gold">Electives & Core</span>
      </div>

      ${state.availableCourseCatalog.length === 0 ? `
        <div style="padding:30px; text-align:center; color:var(--muted);">
          <p style="margin:0; font-size:13px;">All available departmental courses for this semester are currently registered in your form!</p>
        </div>
      ` : `
        <table class="data-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Units</th>
              <th>Lecturer</th>
              <th>Status</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.availableCourseCatalog.map(c => `
              <tr>
                <td>
                  <b class="course-code" data-course-code="${c.code}" style="cursor:pointer;" title="Click to view course outline">${c.code}</b>
                </td>
                <td><b style="color:var(--text);">${c.title}</b></td>
                <td><b>${c.units} Units</b></td>
                <td><span style="font-size:13px; color:var(--muted);">${c.lecturer || 'Faculty Staff'}</span></td>
                <td><span class="tag gold">Available</span></td>
                <td style="text-align:right;">
                  <button class="primary-btn sm" data-add-course="${c.code}" style="padding:6px 14px; font-weight:600;" title="Add ${c.code}">
                    + Add Course
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}

function setupRegistrationListeners() {
  // Add Course Handler
  app.querySelectorAll('[data-add-course]').forEach(btn => {
    btn.onclick = () => {
      const code = btn.dataset.addCourse;
      const index = state.availableCourseCatalog.findIndex(c => c.code === code);
      if (index === -1) return;

      const course = state.availableCourseCatalog[index];
      const currentUnits = state.registeredCourses.reduce((sum, c) => sum + (Number(c.units) || 0), 0);
      const maxUnits = Number(state.studentData.maxUnitsAllowed) || 24;

      if (currentUnits + Number(course.units) > maxUnits) {
        toast(`Cannot add ${course.code}. Credit limit of ${maxUnits} units would be exceeded!`, 'error');
        return;
      }

      // Move course from available to registered
      state.availableCourseCatalog.splice(index, 1);
      course.status = 'Registered';
      state.registeredCourses.push(course);

      // Recalculate
      state.studentData.unitsRegistered = state.registeredCourses.reduce((sum, c) => sum + (Number(c.units) || 0), 0);

      toast(`Successfully added ${course.code} (${course.units} Units) to your course registration!`);
      render();
    };
  });

  // Drop Course Handler
  app.querySelectorAll('[data-drop-course]').forEach(btn => {
    btn.onclick = () => {
      const code = btn.dataset.dropCourse;
      const index = state.registeredCourses.findIndex(c => c.code === code);
      if (index === -1) return;

      const course = state.registeredCourses[index];

      // Move course from registered to available
      state.registeredCourses.splice(index, 1);
      course.status = 'Available';
      state.availableCourseCatalog.push(course);

      // Recalculate
      state.studentData.unitsRegistered = state.registeredCourses.reduce((sum, c) => sum + (Number(c.units) || 0), 0);

      toast(`Dropped ${course.code} from your course registration.`);
      render();
    };
  });

  // Submit Registration Button
  const submitBtn = document.querySelector('#btn-submit-registration');
  if (submitBtn) {
    submitBtn.onclick = () => {
      const currentUnits = state.registeredCourses.reduce((sum, c) => sum + (Number(c.units) || 0), 0);
      const minUnits = Number(state.studentData.minUnitsAllowed) || 12;

      if (currentUnits < minUnits) {
        toast(`You must register at least ${minUnits} credit units. Currently registered: ${currentUnits} units.`, 'error');
        return;
      }

      const coursesListHtml = state.registeredCourses.map(c => `
        <li style="margin-bottom:6px;"><b>${c.code}</b> — ${c.title} (${c.units} Units)</li>
      `).join('');

      modal(
        'Confirm Course Registration Submission',
        `
          <p style="margin-bottom:12px;">You are submitting <b>${state.registeredCourses.length} courses</b> with a total of <b>${currentUnits} Credit Units</b> for ${state.studentData.semester}:</p>
          <ul style="padding-left:20px; max-height:180px; overflow-y:auto; margin-bottom:12px; font-size:13px; background:var(--bg); padding:10px 10px 10px 30px; border-radius:6px; border:1px solid var(--line);">
            ${coursesListHtml}
          </ul>
          <p style="font-size:12px; color:var(--muted);">This course form will be submitted for digital endorsement by your Head of Department.</p>
        `,
        'Confirm & Submit',
        () => toast('Course registration successfully submitted for departmental approval!')
      );
    };
  }
}

// 4. Results & Grades View
function resultsView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Results & Academic Performance</h1>
        <p class="subtitle">Official semester grade records and grade point breakdown.</p>
      </div>

      <select class="field" id="select-semester-results" style="max-width:260px;">
        ${Object.keys(semesterResults).map(sem => `
          <option value="${sem}" ${sem === state.selectedSemester ? 'selected' : ''}>${sem}</option>
        `).join('')}
      </select>
    </div>

    <div class="grid metrics-grid">
      ${metricCard('chart', 'Semester GPA', semesterResults[state.selectedSemester].gpa, 'Current Academic Standing')}
      ${metricCard('award', 'Cumulative CGPA', state.studentData.cgpa, 'Excellent Standing')}
      ${metricCard('chart', 'Total Units Passed', '78', 'No Failed Courses')}
      ${metricCard('trophy', 'Class Rank', 'Top 8%', 'Class of 2027')}
    </div>

    <div style="margin-top:20px;" class="card table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Units</th>
            <th>Grade</th>
            <th>Grade Point</th>
          </tr>
        </thead>
        <tbody>
          ${results.map(r => `
            <tr>
              <td><span class="course-code">${r[0]}</span> — ${r[1]}</td>
              <td>${r[2]} Units</td>
              <td><span class="status-pill success">${r[3]}</span></td>
              <td><b>${r[4]} / 5.0</b></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function setupResultsListeners() {
  const select = document.querySelector('#select-semester-results');
  if (select) {
    select.onchange = (e) => {
      state.selectedSemester = e.target.value;
      render();
    };
  }
}

// 5. Transcript View
function transcriptView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Academic Transcript</h1>
        <p class="subtitle">Official Academic Record • Sandlip Africa University</p>
      </div>

      <div style="display:flex; gap:10px;">
        <button class="secondary-btn" id="btn-print-transcript">${getIcon('printer', 16)} Print Transcript</button>
        <button class="primary-btn" id="btn-download-transcript">${getIcon('download', 16)} Download PDF</button>
      </div>
    </div>

    <div class="a4-container">
      <div class="a4-page">
        <div class="a4-watermark">SANDLIP AFRICA</div>
        
        <div class="a4-header">
          <div class="a4-header-left">
            <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786460835/SAU_logo_brwpc2.png" alt="SAU Logo" class="a4-logo" referrerPolicy="no-referrer" />
            <div class="a4-title-group">
              <h2>SANDLIP AFRICA UNIVERSITY</h2>
              <p>Office of the Academic Registrar • Records & Transcripts Division</p>
            </div>
          </div>
          <div class="a4-header-right">
            <span class="a4-doc-badge">OFFICIAL TRANSCRIPT</span>
            <small style="display:block; margin-top:4px; color:#64748b; font-size:10px;">Ref: SAU/TRN/2026/0412</small>
          </div>
        </div>

        <div class="a4-body">
          <div class="a4-meta-grid">
            <div class="a4-meta-item"><span>Student Name:</span><b>${state.studentData.name}</b></div>
            <div class="a4-meta-item"><span>Matriculation ID:</span><b>${state.studentData.id}</b></div>
            <div class="a4-meta-item"><span>Programme:</span><b>${state.studentData.programme}</b></div>
            <div class="a4-meta-item"><span>Faculty / Dept:</span><b>${state.studentData.faculty}</b></div>
            <div class="a4-meta-item"><span>Current Standing:</span><b>${state.studentData.level} (${state.studentData.session})</b></div>
            <div class="a4-meta-item"><span>Cumulative CGPA:</span><b style="color:#0f8b8d; font-size:13.5px;">${state.studentData.cgpa} / 5.00 (First Class Standing)</b></div>
          </div>

          <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; color:#0f8b8d; margin:18px 0 8px; letter-spacing:0.5px;">Academic Performance History</h3>
          
          <table class="a4-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Units</th>
                <th>Grade</th>
                <th>Grade Points</th>
              </tr>
            </thead>
            <tbody>
              ${results.map(r => `
                <tr>
                  <td><b>${r[0]}</b></td>
                  <td>${r[1]}</td>
                  <td>${r[2]} Credit Units</td>
                  <td><b>${r[3]}</b></td>
                  <td><b>${r[4]} / 5.0</b></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px 14px; margin-top:16px; font-size:11px; color:#475569; display:flex; justify-content:space-between; align-items:center;">
            <div><b>Grading System:</b> A = 5.0 (70-100%), B = 4.0 (60-69%), C = 3.0 (50-59%), D = 2.0 (45-49%), F = 0 (0-44%)</div>
            <div><b>Total Credits Passed:</b> 78 Units</div>
          </div>

          <div class="a4-signatures">
            <div class="a4-signature-box">
              <div class="a4-signature-line"><span style="font-family:'Playfair Display', serif; font-size:15px; font-weight:700; color:#0b2545;">O. A. Timothy</span></div>
              <span>Academic Records Officer</span>
            </div>
            
            <div style="text-align:center;">
              <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786617505/ChatGPT_Image_Aug_13_2026_11_35_20_AM_yjkapi.png" alt="Official Seal of Registrar" style="width:72px; height:72px; object-fit:contain; margin:0 auto; display:block;" referrerPolicy="no-referrer" />
            </div>

            <div class="a4-signature-box">
              <div class="a4-signature-line"><span style="font-family:'Playfair Display', serif; font-size:15px; font-weight:700; color:#0b2545;">Mr. John Okeke</span></div>
              <span>University Registrar</span>
            </div>
          </div>

          <div class="a4-footer">
            <span>Verified & Authenticated by SAU Digital Vault • QR Security Hash: #SAU-88942-TRN</span>
            <span>A4 Document Format • Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function triggerTranscriptPdfDownload() {
  const element = document.querySelector('.a4-page') || document.querySelector('.a4-container');
  if (!element) {
    toast('Transcript document view not found.', 'error');
    return;
  }

  toast('Generating Academic Transcript PDF file...');

  const filename = `Academic_Transcript_${state.studentData.name.replace(/\s+/g, '_')}_${state.studentData.id}.pdf`;

  if (typeof window.html2pdf !== 'undefined') {
    const opt = {
      margin:       0.2,
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(element).save().then(() => {
      toast('Academic Transcript PDF downloaded successfully!');
    }).catch(err => {
      console.error('PDF generation error:', err);
      fallbackPdfDownload(element);
    });
  } else {
    fallbackPdfDownload(element);
  }
}

function fallbackPdfDownload(element) {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Academic Transcript - ${state.studentData.name}</title>
  <style>
    body { font-family: sans-serif; padding: 20px; background: #f8fafc; }
    .a4-container { max-width: 800px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; font-size: 13px; }
    th { background-color: #f1f5f9; }
  </style>
</head>
<body>
  <div class="a4-container">
    ${element.innerHTML}
  </div>
  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Academic_Transcript_${state.studentData.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('Transcript document saved to downloads!');
}

function setupTranscriptListeners() {
  const printBtn = document.querySelector('#btn-print-transcript');
  const downloadBtn = document.querySelector('#btn-download-transcript');

  if (printBtn) {
    printBtn.onclick = (e) => {
      e.preventDefault();
      window.print();
      toast('Academic Transcript sent to system printer.');
    };
  }

  if (downloadBtn) {
    downloadBtn.onclick = (e) => {
      e.preventDefault();
      triggerTranscriptPdfDownload();
    };
  }
}

// 6. Timetable View
function timetableView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Academic Timetable</h1>
        <p class="subtitle">Lecture schedules and lecture venues for ${state.studentData.semester}</p>
      </div>
    </div>

    <div class="card table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Time Slot</th>
            <th>Course Code</th>
            <th>Course Title</th>
            <th>Venue</th>
            <th>Lecturer</th>
            <th>Session Type</th>
          </tr>
        </thead>
        <tbody>
          ${timetable.map(t => `
            <tr>
              <td><b>${t.day}</b></td>
              <td>${t.time}</td>
              <td><span class="course-code">${t.course}</span></td>
              <td>${t.title}</td>
              <td><span class="tag">${t.venue}</span></td>
              <td>${t.lecturer}</td>
              <td><span class="tag ${t.type === 'Lab' ? 'green' : 'gold'}">${t.type}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// 7. Assignments View
function assignmentsView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Assignments & Coursework</h1>
        <p class="subtitle">Track deadlines, access assignment briefs, and submit coursework.</p>
      </div>
    </div>

    <div class="grid" style="gap:16px;">
      ${state.userAssignments.map(a => `
        <article class="card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
              <span class="course-code">${a.course}</span>
              <span class="tag ${a.status === 'Submitted' ? 'green' : a.status === 'Graded' ? 'gold' : 'danger'}">${a.status}</span>
            </div>
            <h3 style="font-size:16px; margin-bottom:4px;">${a.title}</h3>
            <p style="color:var(--muted); font-size:12px;">Lecturer: ${a.lecturer} • <b>Deadline: ${a.deadline}</b></p>
          </div>

          <div style="display:flex; align-items:center; gap:12px;">
            ${a.grade !== '—' ? `<b>Grade: ${a.grade}</b>` : ''}
            <button class="primary-btn" data-asg-id="${a.id}">View Details & Submit</button>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function setupAssignmentsListeners() {
  app.querySelectorAll('[data-asg-id]').forEach(btn => {
    btn.onclick = () => {
      const asg = state.userAssignments.find(item => item.id === btn.dataset.asgId);
      if (asg) {
        modal(
          `${asg.course} — ${asg.title}`,
          `
            <p><b>Lecturer:</b> ${asg.lecturer}</p>
            <p><b>Deadline:</b> ${asg.deadline}</p>
            <p style="margin:12px 0;"><b>Instructions:</b> ${asg.instructions}</p>
            <p><b>Resource Attachment:</b> <a href="#">${asg.resources}</a></p>
            ${asg.feedback ? `<div class="notice-box" style="margin-top:12px;"><b>Lecturer Feedback:</b> ${asg.feedback}</div>` : ''}

            <div style="margin-top:20px; border-top:1px solid var(--line); padding-top:16px;">
              <label class="form-label">Upload Submission File (.pdf, .zip, .docx)</label>
              <input type="file" id="asg-file-input" class="field" />
            </div>
          `,
          'Upload Assignment',
          () => {
            asg.status = 'Submitted';
            toast('Assignment file uploaded and submitted successfully!');
            render();
          }
        );
      }
    };
  });
}

// 8. Examinations View
function examsView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Examinations & Seating Schedules</h1>
        <p class="subtitle">First Semester 2026/2027 Examination Timetable</p>
      </div>
    </div>

    <div class="card table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Title</th>
            <th>Date</th>
            <th>Time</th>
            <th>Examination Venue</th>
            <th>Allocated Seat</th>
          </tr>
        </thead>
        <tbody>
          ${exams.map(e => `
            <tr>
              <td><span class="course-code">${e.course}</span></td>
              <td><b>${e.title}</b></td>
              <td>${e.date}</td>
              <td>${e.time}</td>
              <td><span class="tag">${e.venue}</span></td>
              <td><b style="color:var(--teal)">${e.seat}</b></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// 9. Learning Resources View
function resourcesView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Learning Resources & Courseware</h1>
        <p class="subtitle">Lecture notes, past questions, video tutorials and study guides.</p>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
      ${learningResources.map(r => `
        <article class="card" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span class="tag gold" style="margin-bottom:6px; inline-block">${r.type}</span>
            <h3 style="font-size:15px; margin:4px 0;">${r.title}</h3>
            <p style="color:var(--muted); font-size:12px;">${r.course} • Author: ${r.author} (${r.size})</p>
          </div>
          <button class="secondary-btn" onclick="alert('Downloading ${r.title}...')">${getIcon('download', 16)} Download</button>
        </article>
      `).join('')}
    </div>
  `;
}

// 10. Fees & Payments View
function feesView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Fees & Financial Account</h1>
        <p class="subtitle">Student financial summary, fee breakdown and payment receipts.</p>
      </div>
      <button class="primary-btn" id="btn-pay-fees">${getIcon('credit-card', 16)} Pay Outstanding (${state.studentData.outstandingFees})</button>
    </div>

    <div class="grid metrics-grid">
      ${metricCard('credit-card', 'Total Session Fees', state.studentData.totalFees, '2026/2027 Session')}
      ${metricCard('check', 'Total Amount Paid', state.studentData.paidFees, 'Payment Recorded')}
      ${metricCard('alert', 'Outstanding Balance', state.studentData.outstandingFees, 'Due 30 August 2026')}
      ${metricCard('scroll', 'Payment Status', 'Instalment Plan Active', 'Clearance Verified')}
    </div>

    <div class="grid dashboard-grid">
      <section class="card">
        <h3>Fee Item Breakdown</h3>
        <table class="data-table" style="margin-top:14px;">
          <thead>
            <tr>
              <th>Fee Category</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${feeBreakdown.map(f => `
              <tr>
                <td><b>${f.item}</b></td>
                <td>${f.amount}</td>
                <td><span class="tag green">${f.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>

      <section class="card">
        <h3>Transaction History</h3>
        ${state.userFeeTransactions.map(t => `
          <div class="list-row">
            <div class="row-content">
              <strong>${t.description}</strong>
              <span>${t.date} • ID: ${t.id}</span>
            </div>
            <div>
              <b>${t.amount}</b>
              <span class="status-pill success" style="display:block; font-size:10px;">${t.status}</span>
            </div>
          </div>
        `).join('')}
      </section>
    </div>
  `;
}

function setupFeesListeners() {
  const payBtn = document.querySelector('#btn-pay-fees');
  if (payBtn) {
    payBtn.onclick = () => {
      modal(
        'Make Fee Payment — Paystack Gateway',
        `
          <div style="background:linear-gradient(135deg, #0ba4db15, #0a254010); padding:12px 16px; border-radius:8px; margin-bottom:16px; border:1px solid #0ba4db30;">
            <p style="margin:0; font-size:13px; color:#0a2540;"><b>Paystack Secure Live Gateway Connection Active</b></p>
            <p style="margin:4px 0 0 0; font-size:12px; color:var(--muted);">Verified Merchant: Sandlip Africa University Fees Portal</p>
          </div>
          <p>Outstanding Amount: <b style="color:var(--navy); font-size:16px;">${state.studentData.outstandingFees}</b></p>
          
          <label class="form-label">Payment Gateway</label>
          <select class="field" id="payment-method-select">
            <option value="paystack">Paystack Live Payment Gateway (Debit/Credit Card, Bank Transfer, USSD)</option>
          </select>

          <label class="form-label">Payment Amount (₦)</label>
          <input class="field" id="pay-amount-input" value="145000" type="number" />
        `,
        'Pay with Paystack Checkout',
        () => {
          const amtInput = document.querySelector('#pay-amount-input');
          const amt = amtInput ? Number(amtInput.value) : 145000;
          
          payWithPaystack({
            amountNaira: amt,
            description: "SAU Outstanding Tuition Fee Settlement",
            onSuccess: (ref, paidAmount) => {
              const formattedAmt = `₦${paidAmount.toLocaleString()}`;
              const prevPaidNum = Number(String(state.studentData.paidFees).replace(/[^0-9.]/g, '')) || 240000;
              const newPaidTotal = prevPaidNum + paidAmount;
              
              state.studentData.outstandingFees = "₦0";
              state.studentData.paidFees = `₦${newPaidTotal.toLocaleString()}`;
              state.userFeeTransactions.unshift({
                id: ref,
                date: "Today",
                description: "Paystack Fee Settlement",
                amount: formattedAmt,
                method: "Paystack Card / Transfer",
                status: "Successful"
              });
              toast(`Paystack payment of ${formattedAmt} received successfully! Receipt issued.`);
              render();
            }
          });
        }
      );
    };
  }
}

// 11. Digital Library View
function libraryView() {
  const filtered = state.libraryCategory === 'All' 
    ? libraryResources 
    : libraryResources.filter(r => r.category === state.libraryCategory);

  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Digital Library Repository</h1>
        <p class="subtitle">Access e-books, academic journals, research papers and course materials.</p>
      </div>

      <div style="display:flex; gap:10px;">
        <input class="field" placeholder="Search library repository..." style="max-width:240px;" />
        <select class="field" id="library-category-select" style="max-width:200px;">
          <option value="All">All Categories</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Artificial Intelligence">Artificial Intelligence</option>
          <option value="Engineering">Engineering</option>
          <option value="Business">Business</option>
        </select>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
      ${filtered.map(r => `
        <article class="card" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="display:flex; gap:8px; align-items:center; margin-bottom:4px;">
              <span class="tag gold">${r.format}</span>
              <span class="tag">${r.category}</span>
            </div>
            <h3 style="font-size:15px; margin:4px 0;">${r.title}</h3>
            <p style="color:var(--muted); font-size:12px;">Author: ${r.author} • Downloads: ${r.downloads}</p>
          </div>
          <button class="primary-btn" onclick="alert('Opening E-Book Reader for ${r.title}...')">Read</button>
        </article>
      `).join('')}
    </div>
  `;
}

function setupLibraryListeners() {
  const select = document.querySelector('#library-category-select');
  if (select) {
    select.onchange = (e) => {
      state.libraryCategory = e.target.value;
      render();
    };
  }
}

// 12. Lecturers View
function lecturersView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Lecturers Directory</h1>
        <p class="subtitle">Academic staff teaching your registered courses.</p>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
      ${lecturers.map(l => `
        <article class="card" style="display:flex; gap:16px; align-items:flex-start;">
          <div class="avatar lg">${l.avatar}</div>
          <div style="flex:1;">
            <h3 style="font-size:16px; margin-bottom:2px;">${l.name}</h3>
            <span style="color:var(--teal); font-weight:700; font-size:12px;">${l.title} • ${l.dept}</span>
            <p style="font-size:12px; color:var(--muted); margin:8px 0;">${l.bio}</p>
            <div style="font-size:12px; background:var(--bg); padding:8px 12px; border-radius:var(--radius-sm); margin-top:8px;">
              <b>Office:</b> ${l.office}<br />
              <b>Hours:</b> ${l.hours}<br />
              <b>Email:</b> <a href="mailto:${l.email}">${l.email}</a>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

// 13. Announcements View
function announcementsView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">University Announcements</h1>
        <p class="subtitle">Official communications from university divisions and academic boards.</p>
      </div>
      <button class="secondary-btn" id="btn-mark-announcements-read">Mark All as Read</button>
    </div>

    <div class="grid" style="gap:16px;">
      ${announcements.map(a => `
        <article class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="tag gold">${a.category}</span>
            <small style="color:var(--muted);">${a.date}</small>
          </div>
          <h3 style="font-size:16px; margin-bottom:6px;">${a.title}</h3>
          <p style="color:var(--muted); font-size:13.5px; line-height:1.6;">${a.content}</p>
        </article>
      `).join('')}
    </div>
  `;
}

function setupAnnouncementsListeners() {
  const btn = document.querySelector('#btn-mark-announcements-read');
  if (btn) {
    btn.onclick = () => toast('All announcements marked as read.');
  }
}

// 14. Events View
function eventsView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">University Events</h1>
        <p class="subtitle">Discover upcoming campus conferences, hackathons and workshops.</p>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
      ${events.map(e => `
        <article class="card" style="display:flex; gap:16px; align-items:center;">
          <div class="datebox">
            <b>${e.dateDay}</b>${e.dateMonth}
          </div>
          <div style="flex:1;">
            <span class="tag green">${e.category}</span>
            <h3 style="font-size:16px; margin:4px 0;">${e.title}</h3>
            <p style="font-size:12px; color:var(--muted);">${e.time} • ${e.venue}</p>
            <button class="secondary-btn" style="margin-top:10px;" onclick="alert('Registered for ${e.title}!')">Register for Event</button>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

// Helper function to show modal of students who reacted to a post
function showReactorsModal(post) {
  const labels = {
    like: 'Like',
    love: 'Love',
    haha: 'Haha',
    surprise: 'Surprise',
    angry: 'Angry'
  };

  const reactors = post.reactors || [];

  const listContent = reactors.length === 0
    ? `<p style="color:var(--muted); font-size:13px; text-align:center; padding:20px 0;">No reactions recorded yet for this post.</p>`
    : `
      <div style="max-height:340px; overflow-y:auto; display:flex; flex-direction:column; gap:8px; padding-right:4px;">
        ${reactors.map(r => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:var(--bg); border:1px solid var(--line); border-radius:8px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div class="avatar sm" style="width:34px; height:34px; font-size:12px; font-weight:700;">${r.name.split(' ').map(n=>n[0]).join('')}</div>
              <div>
                <b style="font-size:13px; color:var(--navy); display:block;">${r.name}</b>
                <span style="font-size:11px; color:var(--muted);">${r.role}</span>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:6px; background:#ffffff; border:1px solid var(--line); padding:4px 10px; border-radius:16px; font-size:12px; font-weight:600; color:var(--text);">
              ${getReactionIcon(r.type, 18)}
              <span>${labels[r.type] || 'Reaction'}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

  modal(
    `Students Who Reacted (${reactors.length})`,
    listContent,
    null
  );
}

// 15. Student Community View
function communityView() {
  if (!state.expandedComments) {
    state.expandedComments = {};
  }

  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Student Community Forum</h1>
        <p class="subtitle">Connect, collaborate, and share knowledge with fellow SAU students.</p>
      </div>
      <button class="primary-btn" id="btn-create-post">+ Create New Post</button>
    </div>

    <div class="grid" style="gap:20px;">
      ${state.userCommunityPosts.map(p => {
        if (!p.reactors) {
          p.reactors = [
            { name: 'Amina Bello', role: 'B.Sc. Computer Science • 300L', type: 'love' },
            { name: 'Chinedu Okeke', role: 'B.Sc. Computer Science • 300L', type: 'like' },
            { name: 'Kemi Adeleke', role: 'Software Engineering • 200L', type: 'haha' },
            { name: 'David Mark', role: 'Cyber Security • 400L', type: 'surprise' },
            { name: 'Dr. Sarah Williams', role: 'Senior Lecturer', type: 'like' }
          ];
        }
        if (!p.comments) {
          p.comments = [];
        }

        const counts = {
          like: p.reactors.filter(r => r.type === 'like').length,
          love: p.reactors.filter(r => r.type === 'love').length,
          haha: p.reactors.filter(r => r.type === 'haha').length,
          surprise: p.reactors.filter(r => r.type === 'surprise').length,
          angry: p.reactors.filter(r => r.type === 'angry').length
        };

        const totalReacts = p.reactors.length;
        const myReactionEntry = p.reactors.find(r => r.name === state.studentData.name);
        const myReaction = myReactionEntry ? myReactionEntry.type : null;
        const isCommentsOpen = !!state.expandedComments[p.id];

        return `
          <article class="card" style="padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <div style="display:flex; align-items:center; gap:12px;">
                <div class="avatar sm">${p.avatar || 'SAU'}</div>
                <div>
                  <b style="color:var(--navy);">${p.author}</b>
                  <span style="display:block; font-size:11px; color:var(--muted);">${p.authorRole} • ${p.time || 'Recently'}</span>
                </div>
              </div>
              <span class="tag gold">${p.category}</span>
            </div>

            <p style="font-size:14px; line-height:1.6; margin-bottom:16px; color:var(--text);">${p.content}</p>

            <!-- Reaction Buttons Bar (Without 'Reactions:' label) -->
            <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding:10px 0; margin-bottom:14px;">
              <button class="reaction-btn ${myReaction === 'like' ? 'active' : ''}" data-react-post="${p.id}" data-reaction="like" title="Like">
                ${getReactionIcon('like', 18)} <span>${counts.like}</span>
              </button>
              <button class="reaction-btn ${myReaction === 'love' ? 'active' : ''}" data-react-post="${p.id}" data-reaction="love" title="Love">
                ${getReactionIcon('love', 18)} <span>${counts.love}</span>
              </button>
              <button class="reaction-btn ${myReaction === 'haha' ? 'active' : ''}" data-react-post="${p.id}" data-reaction="haha" title="Haha">
                ${getReactionIcon('haha', 18)} <span>${counts.haha}</span>
              </button>
              <button class="reaction-btn ${myReaction === 'surprise' ? 'active' : ''}" data-react-post="${p.id}" data-reaction="surprise" title="Surprise">
                ${getReactionIcon('surprise', 18)} <span>${counts.surprise}</span>
              </button>
              <button class="reaction-btn ${myReaction === 'angry' ? 'active' : ''}" data-react-post="${p.id}" data-reaction="angry" title="Angry">
                ${getReactionIcon('angry', 18)} <span>${counts.angry}</span>
              </button>

              <!-- View Students Who Reacted Trigger -->
              <button class="link-btn" data-view-reactors="${p.id}" style="font-size:12px; color:var(--muted); font-weight:600; padding:4px 8px; border-radius:12px; background:var(--bg); border:1px solid var(--line); margin-left:4px;" title="See students who reacted">
                👥 ${totalReacts} ${totalReacts === 1 ? 'Reaction' : 'Reactions'}
              </button>

              <!-- View Comments Trigger Button (In front after reactions) -->
              <button class="${isCommentsOpen ? 'primary-btn sm' : 'secondary-btn sm'}" data-toggle-comments="${p.id}" style="margin-left:auto; display:inline-flex; align-items:center; gap:6px; padding:6px 14px; font-size:12px; border-radius:20px;">
                ${getIcon('message', 14)} <span>${isCommentsOpen ? 'Hide Comments' : 'View Comments'} (${p.comments.length})</span>
              </button>
            </div>

            <!-- Comments Section (Triggered by View Comments button) -->
            ${isCommentsOpen ? `
              <div class="comments-section" style="background:var(--bg); border-radius:var(--radius-sm); padding:14px; margin-top:10px;">
                <h4 style="margin:0 0 10px 0; font-size:13px; color:var(--navy); display:flex; align-items:center; gap:6px;">
                  ${getIcon('message', 14)} Comments (${p.comments.length})
                </h4>
                ${p.comments.length > 0 ? `
                  <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:12px; max-height:280px; overflow-y:auto; padding-right:2px;">
                    ${p.comments.map(c => `
                      <div style="background:var(--card-bg, #ffffff); padding:10px 12px; border-radius:8px; border:1px solid var(--line); font-size:13px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                          <b style="color:var(--navy); font-size:12px;">${c.author}</b>
                          <span style="font-size:10px; color:var(--muted);">${c.time || 'Recently'}</span>
                        </div>
                        <p style="margin:0; color:var(--text); line-height:1.4;">${c.text}</p>
                      </div>
                    `).join('')}
                  </div>
                ` : `
                  <p style="font-size:12px; color:var(--muted); margin:0 0 12px 0; font-style:italic;">No comments yet. Write a comment below to join the conversation!</p>
                `}

                <div style="display:flex; gap:8px; align-items:center;">
                  <input type="text" class="field" id="comment-input-${p.id}" placeholder="Write a comment..." style="flex:1; padding:8px 12px; font-size:13px; margin:0;" />
                  <button class="primary-btn sm" data-add-comment="${p.id}" style="padding:8px 16px; white-space:nowrap;">Comment</button>
                </div>
              </div>
            ` : ''}
          </article>
        `;
      }).join('')}
    </div>
  `;
}

function setupCommunityListeners() {
  const createBtn = document.querySelector('#btn-create-post');
  if (createBtn) {
    createBtn.onclick = () => {
      modal(
        'Create Community Post',
        `
          <label class="form-label">Topic Category</label>
          <select class="field" id="post-category">
            <option>AI & Robotics</option>
            <option>Technology</option>
            <option>African Innovation</option>
            <option>Developers</option>
          </select>
          
          <label class="form-label">Post Content</label>
          <textarea class="field" id="post-text" rows="4" placeholder="What would you like to share or ask the community?"></textarea>
        `,
        'Publish Post',
        () => {
          const text = document.querySelector('#post-text').value;
          if (text) {
            state.userCommunityPosts.unshift({
              id: `POST-${Date.now()}`,
              author: state.studentData.name,
              authorRole: `${state.studentData.programme} • ${state.studentData.level}`,
              avatar: "ET",
              time: "Just now",
              category: document.querySelector('#post-category').value,
              content: text,
              reactors: [
                { name: state.studentData.name, role: `${state.studentData.programme} • ${state.studentData.level}`, type: 'like' }
              ],
              comments: []
            });
            toast('Post published to SAU Student Community!');
            render();
          }
        }
      );
    };
  }

  // Toggle comments section visibility
  app.querySelectorAll('[data-toggle-comments]').forEach(btn => {
    btn.onclick = () => {
      const postId = btn.dataset.toggleComments;
      if (!state.expandedComments) state.expandedComments = {};
      state.expandedComments[postId] = !state.expandedComments[postId];
      render();
    };
  });

  // View students who reacted modal
  app.querySelectorAll('[data-view-reactors]').forEach(btn => {
    btn.onclick = () => {
      const postId = btn.dataset.viewReactors;
      const post = state.userCommunityPosts.find(item => item.id === postId);
      if (post) {
        showReactorsModal(post);
      }
    };
  });

  // Reaction click handlers
  app.querySelectorAll('[data-react-post]').forEach(btn => {
    btn.onclick = () => {
      const postId = btn.dataset.reactPost;
      const reactionType = btn.dataset.reaction;
      const post = state.userCommunityPosts.find(item => item.id === postId);
      if (!post) return;

      if (!post.reactors) post.reactors = [];

      const myIndex = post.reactors.findIndex(r => r.name === state.studentData.name);
      if (myIndex !== -1) {
        if (post.reactors[myIndex].type === reactionType) {
          post.reactors.splice(myIndex, 1); // toggle off
        } else {
          post.reactors[myIndex].type = reactionType; // switch reaction
        }
      } else {
        post.reactors.push({
          name: state.studentData.name,
          role: `${state.studentData.programme} • ${state.studentData.level}`,
          type: reactionType
        });
      }

      render();
    };
  });

  // Comment submission handlers
  app.querySelectorAll('[data-add-comment]').forEach(btn => {
    const postId = btn.dataset.addComment;
    const submitComment = () => {
      const input = document.querySelector(`#comment-input-${postId}`);
      if (!input) return;
      const text = input.value.trim();
      if (!text) {
        toast('Please enter a comment before posting.', 'error');
        return;
      }

      const post = state.userCommunityPosts.find(item => item.id === postId);
      if (post) {
        if (!post.comments) post.comments = [];
        post.comments.push({
          author: state.studentData.name,
          text: text,
          time: 'Just now'
        });
        toast('Comment added successfully!');
        render();
      }
    };

    btn.onclick = submitComment;

    const input = document.querySelector(`#comment-input-${postId}`);
    if (input) {
      input.onkeypress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitComment();
        }
      };
    }
  });
}


// 16. Innovation Hub View
function innovationView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Innovation Hub</h1>
        <p class="subtitle">Showcase student projects, discover hackathons, and find co-founders.</p>
      </div>
      <button class="primary-btn" id="btn-submit-project">+ Submit Innovation Project</button>
    </div>

    <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
      ${state.userInnovationProjects.map(prj => `
        <article class="card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <h3 style="font-size:18px; color:var(--teal);">${prj.name}</h3>
            <span class="tag gold">${getIcon('rocket', 14, '#D9A21B')} Innovation</span>
          </div>
          <p style="font-size:12px; color:var(--muted); margin-bottom:10px;">By ${prj.team}</p>
          <p style="font-size:13.5px; line-height:1.5; margin-bottom:14px;">${prj.description}</p>
          
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:14px;">
            ${prj.tech.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--line); padding-top:12px; font-size:12px;">
            <div>${getIcon('thumbs-up', 14)} <b>${prj.likes}</b> Likes • ${getIcon('eye', 14)} <b>${prj.views}</b> Views</div>
            <a href="${prj.github}" target="_blank" class="link-btn">GitHub Repo ↗</a>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function setupInnovationListeners() {
  const btn = document.querySelector('#btn-submit-project');
  if (btn) {
    btn.onclick = () => {
      modal(
        'Submit Project to Innovation Hub',
        `
          <label class="form-label">Project Name</label>
          <input class="field" id="prj-name" placeholder="e.g. SmartAgro SAU" />

          <label class="form-label">Description</label>
          <textarea class="field" id="prj-desc" rows="3" placeholder="Describe the technology and impact..."></textarea>

          <label class="form-label">Tech Stack (comma-separated)</label>
          <input class="field" id="prj-tech" placeholder="Python, React, Supabase" />
        `,
        'Publish Showcase Project',
        () => {
          const name = document.querySelector('#prj-name').value;
          if (name) {
            state.userInnovationProjects.unshift({
              id: `PRJ-${Date.now()}`,
              name: name,
              team: state.studentData.name,
              description: document.querySelector('#prj-desc').value || "Innovative tech project.",
              tech: (document.querySelector('#prj-tech').value || "JavaScript").split(','),
              likes: 5,
              views: 20,
              github: "https://github.com",
              demo: "https://demo.sau.app"
            });
            toast('Project published to Innovation Hub!');
            render();
          }
        }
      );
    };
  }
}

// 17. Research Center View
function researchView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Research Center</h1>
        <p class="subtitle">Explore active research projects, research grants, and publications.</p>
      </div>
      <button class="primary-btn" onclick="alert('Submit Research Proposal form opened.')">+ Submit Proposal</button>
    </div>

    <div class="grid" style="gap:16px;">
      ${researchItems.map(r => `
        <article class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="tag green">${r.status}</span>
            <b style="color:var(--gold);">${r.grant}</b>
          </div>
          <h3 style="font-size:16px; margin-bottom:4px;">${r.title}</h3>
          <p style="font-size:12px; color:var(--muted);">Lead Supervisor: ${r.lead}</p>
        </article>
      `).join('')}
    </div>
  `;
}

// 18. Achievements View
function achievementsView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Achievements & Leaderboard</h1>
        <p class="subtitle">Gamified milestones, certificates, and academic rankings.</p>
      </div>
    </div>

    <div class="grid metrics-grid">
      ${metricCard('trophy', 'Earned Badges', '4 Badges', 'Top 5% Student')}
      ${metricCard('star', 'Gamification Points', '2,640 pts', 'Rank #3 Overall')}
      ${metricCard('scroll', 'Certificates', '2 Verified', 'Ready for Export')}
      ${metricCard('handshake', 'Peer Rep', '50+ Helpful Replies', 'Community Champion')}
    </div>

    <div class="grid dashboard-grid" style="margin-top:20px;">
      <section class="card">
        <h3>Earned Badges & Certificates</h3>
        <div class="grid" style="grid-template-columns: repeat(2, 1fr); margin-top:14px;">
          ${achievements.map(a => `
            <div style="border:1px solid var(--line); border-radius:var(--radius-sm); padding:14px; text-align:center;">
              <div style="margin-bottom:8px;">${getIcon(a.badge, 32, 'var(--teal)')}</div>
              <b style="display:block; margin:6px 0 2px;">${a.title}</b>
              <small style="color:var(--muted); font-size:11px;">${a.desc}</small>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="card">
        <h3>Student Leaderboard</h3>
        <table class="data-table" style="margin-top:14px;">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            ${leaderboard.map(l => `
              <tr style="${l.current ? 'background:var(--teal-light); font-weight:700;' : ''}">
                <td>#${l.rank}</td>
                <td>${l.name} (${l.level})</td>
                <td><b>${l.points} pts</b></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>
    </div>
  `;
}

// 19. Notifications View
function notificationsView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Notification Center</h1>
        <p class="subtitle">Updates regarding assignments, results, fee reminders and events.</p>
      </div>
      <button class="secondary-btn" id="btn-read-notifications">Mark All as Read</button>
    </div>

    <div class="grid" style="gap:12px;">
      ${state.userNotifications.map(n => `
        <article class="card" style="display:flex; justify-content:space-between; align-items:center; ${n.unread ? 'border-left:4px solid var(--teal);' : ''}">
          <div>
            <h3 style="font-size:15px; margin-bottom:4px;">${n.title}</h3>
            <p style="color:var(--muted); font-size:13px;">${n.text}</p>
          </div>
          <small style="color:var(--muted);">${n.time}</small>
        </article>
      `).join('')}
    </div>
  `;
}

function setupNotificationsListeners() {
  const btn = document.querySelector('#btn-read-notifications');
  if (btn) {
    btn.onclick = () => {
      state.userNotifications.forEach(n => n.unread = false);
      toast('All notifications marked as read.');
      render();
    };
  }
}

// 20. Messages View
function messagesView() {
  const activeChat = messagesData[0];

  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Messages & Direct Messaging</h1>
        <p class="subtitle">Secure communication with lecturers and academic advisers.</p>
      </div>
      <button class="primary-btn" onclick="alert('New conversation dialog opened.')">+ New Message</button>
    </div>

    <div class="grid" style="grid-template-columns: 0.8fr 1.4fr;">
      <section class="card" style="padding:14px;">
        <h3>Conversations</h3>
        <div style="margin-top:14px;">
          ${messagesData.map(m => `
            <div style="padding:10px; border-radius:var(--radius-sm); background:var(--teal-light); cursor:pointer; margin-bottom:8px;">
              <b>${m.contact}</b>
              <small style="display:block; color:var(--muted);">${m.role}</small>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="card" style="display:flex; flex-direction:column; justify-content:space-between; min-height:400px;">
        <div>
          <div style="border-bottom:1px solid var(--line); padding-bottom:12px; margin-bottom:16px;">
            <h3>${activeChat.contact}</h3>
            <small style="color:var(--muted);">${activeChat.role}</small>
          </div>

          <div style="display:flex; flex-direction:column; gap:12px;">
            ${activeChat.messages.map(msg => `
              <div style="align-self: ${msg.sender === state.studentData.name ? 'flex-end' : 'flex-start'}; background: ${msg.sender === state.studentData.name ? 'var(--teal)' : 'var(--bg)'}; color: ${msg.sender === state.studentData.name ? '#fff' : 'var(--ink)'}; padding:10px 14px; border-radius:var(--radius-sm); max-width:80%;">
                <div style="font-size:13px;">${msg.text}</div>
                <small style="display:block; text-align:right; font-size:10px; opacity:0.8; margin-top:4px;">${msg.time}</small>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="margin-top:20px; display:flex; gap:10px;">
          <input class="field" placeholder="Type a message..." />
          <button class="primary-btn" onclick="toast('Message sent.')">Send</button>
        </div>
      </section>
    </div>
  `;
}

// 21. Help & Support View
function supportView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Help & Support Center</h1>
        <p class="subtitle">Frequently asked questions and student support ticket system.</p>
      </div>
      <button class="primary-btn" id="btn-open-ticket">+ Open Support Ticket</button>
    </div>

    <div class="grid dashboard-grid">
      <section class="card">
        <h3>Frequently Asked Questions (FAQ)</h3>
        <div style="margin-top:14px; display:flex; flex-direction:column; gap:12px;">
          ${supportFaqs.map(f => `
            <details style="padding:12px; border:1px solid var(--line); border-radius:var(--radius-sm); cursor:pointer;">
              <summary style="font-weight:700; color:var(--ink);">${f.q}</summary>
              <p style="margin-top:8px; color:var(--muted); font-size:13px; line-height:1.5;">${f.a}</p>
            </details>
          `).join('')}
        </div>
      </section>

      <section class="card">
        <h3>My Support Tickets</h3>
        <table class="data-table" style="margin-top:14px;">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Subject</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${state.userSupportTickets.map(t => `
              <tr>
                <td><b>${t.ticketId}</b></td>
                <td>${t.subject}</td>
                <td><span class="tag ${t.status === 'Resolved' ? 'green' : 'gold'}">${t.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>
    </div>
  `;
}

function setupSupportListeners() {
  const btn = document.querySelector('#btn-open-ticket');
  if (btn) {
    btn.onclick = () => {
      modal(
        'Submit Support Ticket',
        `
          <label class="form-label">Category</label>
          <select class="field" id="tkt-cat">
            <option>Academic & Registration</option>
            <option>Fees & Payments</option>
            <option>Portal Technical Support</option>
          </select>

          <label class="form-label">Subject</label>
          <input class="field" id="tkt-sub" placeholder="Brief subject line" />

          <label class="form-label">Description</label>
          <textarea class="field" id="tkt-desc" rows="3" placeholder="Detail your issue..."></textarea>
        `,
        'Submit Ticket',
        () => {
          state.userSupportTickets.unshift({
            ticketId: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
            subject: document.querySelector('#tkt-sub').value || "Support Query",
            category: document.querySelector('#tkt-cat').value,
            status: "In Progress",
            date: "Today"
          });
          toast('Support ticket submitted. Reference number generated.');
          render();
        }
      );
    };
  }
}

// 22. Profile View
function profileView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Student Profile</h1>
        <p class="subtitle">Personal and academic identification records.</p>
      </div>
      <button class="secondary-btn" id="btn-edit-profile">${getIcon('edit', 16)} Edit Profile</button>
    </div>

    <div class="grid" style="grid-template-columns: 0.8fr 1.4fr;">
      <section class="card" style="text-align:center; padding:32px;">
        <div class="avatar-hover-container">
          <label for="avatar-file-input" class="avatar-hover-label" title="Click to change profile picture (Max 50KB)">
            <div class="avatar lg" style="width:100%; height:100%; border-radius:50%; overflow:hidden; font-size:32px; margin:0 auto; display:flex; align-items:center; justify-content:center;">
              ${state.studentData.avatarUrl ? `<img src="${state.studentData.avatarUrl}" style="width:100%; height:100%; object-fit:cover;" alt="Profile Picture" />` : 'ET'}
            </div>
            <div class="avatar-hover-overlay">
              ${getIcon('camera', 22, '#ffffff')}
              <span style="font-size:10.5px; color:#ffffff; font-weight:700; margin-top:2px; letter-spacing:0.3px;">Change</span>
            </div>
          </label>
          <label for="avatar-file-input" class="avatar-hover-badge" title="Upload Profile Picture (Max 50KB)">
            ${getIcon('camera', 15, '#ffffff')}
          </label>
        </div>
        <input type="file" id="avatar-file-input" accept="image/png, image/jpeg, image/webp" style="display:none;" />
        
        <h2>${state.studentData.name}</h2>
        <p style="color:var(--muted); font-size:13px; margin:4px 0 14px;">${state.studentData.id}</p>
        <span class="tag green">● Active Student Standing</span>
        <div style="margin-top:16px; font-size:11px; background:var(--bg); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid #00000010; color:var(--muted); display:flex; align-items:center; justify-content:center; gap:6px;">
          ${getIcon('camera', 14, 'var(--teal)')} <span><b>Profile Picture Limit:</b> Max 50KB file size</span>
        </div>
      </section>

      <section class="card">
        <h3>Academic & Contact Details</h3>
        <div class="grid" style="grid-template-columns:1fr 1fr; gap:16px; margin-top:16px;">
          <div><span style="color:var(--muted); font-size:12px;">Programme:</span><br /><b>${state.studentData.programme}</b></div>
          <div><span style="color:var(--muted); font-size:12px;">Faculty:</span><br /><b>${state.studentData.faculty}</b></div>
          <div><span style="color:var(--muted); font-size:12px;">Level:</span><br /><b>${state.studentData.level}</b></div>
          <div><span style="color:var(--muted); font-size:12px;">Email:</span><br /><b>${state.studentData.email}</b></div>
          <div><span style="color:var(--muted); font-size:12px;">Phone:</span><br /><b>${state.studentData.phone}</b></div>
          <div><span style="color:var(--muted); font-size:12px;">Admission Date:</span><br /><b>${state.studentData.admissionDate}</b></div>
        </div>
      </section>
    </div>
  `;
}

function setupProfileListeners() {
  const btn = document.querySelector('#btn-edit-profile');
  if (btn) {
    btn.onclick = () => {
      modal(
        'Edit Student Contact Information',
        `
          <label class="form-label">Phone Number</label>
          <input class="field" id="edit-phone" value="${state.studentData.phone}" />

          <label class="form-label">Email Address</label>
          <input class="field" id="edit-email" value="${state.studentData.email}" />
        `,
        'Save Changes',
        () => {
          state.studentData.phone = document.querySelector('#edit-phone').value;
          state.studentData.email = document.querySelector('#edit-email').value;
          toast('Profile information updated successfully.');
          render();
        }
      );
    };
  }

  const avatarInput = document.querySelector('#avatar-file-input');
  if (avatarInput) {
    avatarInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const MAX_SIZE_BYTES = 50 * 1024; // 50 KB = 51,200 bytes
      if (file.size > MAX_SIZE_BYTES) {
        const sizeKb = (file.size / 1024).toFixed(1);
        toast(`Upload failed! Picture size is ${sizeKb}KB, which exceeds the maximum limit of 50KB. Please choose a smaller image.`, 'error');
        avatarInput.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = async (evt) => {
        const base64Url = evt.target.result;
        state.studentData.avatarUrl = base64Url;
        localStorage.sauStudentAvatar = base64Url;

        // Sync with Express backend and Supabase
        try {
          await fetch('/api/student/avatar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              avatarBase64: base64Url,
              matricNo: state.studentData.id,
              fileSize: file.size
            })
          });
        } catch (err) {
          console.log('Server avatar sync:', err);
        }

        toast(`Profile picture updated successfully! (${(file.size / 1024).toFixed(1)}KB)`);
        render();
      };
      reader.readAsDataURL(file);
    };
  }
}

// 23. Settings View
function settingsView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Portal Settings & Preferences</h1>
        <p class="subtitle">System preferences, security, dark mode and notification controls.</p>
      </div>
    </div>

    <section class="card" style="max-width:700px;">
      <h3 style="margin-bottom:16px;">Preferences</h3>

      <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 0; border-bottom:1px solid var(--line);">
        <div>
          <b>Dark Mode Theme</b>
          <span style="display:block; font-size:12px; color:var(--muted);">Switch between dark and light portal aesthetics</span>
        </div>
        <button class="primary-btn" id="btn-toggle-dark-settings">${state.dark ? 'Switch to Light' : 'Switch to Dark'}</button>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 0; border-bottom:1px solid var(--line);">
        <div>
          <b>Email Notification Reminders</b>
          <span style="display:block; font-size:12px; color:var(--muted);">Receive assignment deadlines & announcement alerts</span>
        </div>
        <input type="checkbox" checked />
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 0;">
        <div>
          <b>Two-Factor Authentication (2FA)</b>
          <span style="display:block; font-size:12px; color:var(--muted);">Enhance student account security</span>
        </div>
        <button class="secondary-btn" onclick="toast('2FA configuration link sent to your registered phone.')">Configure</button>
      </div>
    </section>
  `;
}

function setupSettingsListeners() {
  const btn = document.querySelector('#btn-toggle-dark-settings');
  if (btn) {
    btn.onclick = () => {
      state.dark = !state.dark;
      localStorage.sauTheme = state.dark ? 'dark' : 'light';
      document.body.classList.toggle('dark', state.dark);
      render();
    };
  }
}

// 24. Reserve Accomodation View
function accommodationView() {
  const hostels = [
    { name: "Nelson Mandela Executive Hall", gender: "Male", type: "2-Bed Executive Space", fee: "₦150,000", status: "Available", spaces: 14, amenities: ["24/7 Power", "Wi-Fi", "En-suite Bath", "AC Lounge"] },
    { name: "Kwame Nkrumah Hall", gender: "Male", type: "4-Bed Standard Space", fee: "₦90,000", status: "Available", spaces: 28, amenities: ["Constant Power", "Wi-Fi", "Shared Bath", "Reading Room"] },
    { name: "Queen Moremi Hall", gender: "Female", type: "2-Bed Executive Space", fee: "₦140,000", status: "Available", spaces: 8, amenities: ["24/7 Power", "Wi-Fi", "En-suite Bath", "Kitchenette"] },
    { name: "Queen Amina Hall", gender: "Female", type: "4-Bed Standard Space", fee: "₦85,000", status: "Available", spaces: 42, amenities: ["Constant Power", "Wi-Fi", "Laundry Room", "Study Center"] },
    { name: "Innovation Tech Lodge", gender: "Co-Ed", type: "Single En-Suite Room", fee: "₦210,000", status: "Reserved", spaces: 0, amenities: ["Solar Power", "High-Speed Fiber", "Private Bath", "Smart Keycard"] }
  ];

  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Reserve Accomodation</h1>
        <p class="subtitle">Hostel allocation and room space reservation for 2026/2027 academic session.</p>
      </div>
      <span class="tag green">Session: 2026/2027 Open</span>
    </div>

    <div class="grid metrics-grid" style="margin-bottom:24px;">
      ${metricCard('home', 'Accommodation Status', 'Pending Reservation', 'Action Required', 'teal')}
      ${metricCard('user', 'Current Level', state.studentData.level, 'Active Registration')}
      ${metricCard('calendar', 'Reservation Deadline', '28 Oct 2026', 'Session Window', 'gold')}
      ${metricCard('check', 'Approved Clearance', '100% Cleared', 'Verified for Allocation', 'green')}
    </div>

    <section class="card">
      <div class="section-head">
        <h3>Available University Hostels & Halls</h3>
        <span class="subtitle" style="margin-bottom:0;">Select a hostel block to reserve your bed space</span>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px; margin-top:16px;">
        ${hostels.map(h => `
          <div style="border:1px solid var(--line); border-radius:var(--radius); padding:20px; display:flex; flex-direction:column; justify-content:space-between; background:var(--bg-card);">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                <h4 style="font-size:16px; color:var(--navy);">${h.name}</h4>
                <span class="tag ${h.gender === 'Male' ? 'teal' : h.gender === 'Female' ? 'gold' : 'purple'}">${h.gender}</span>
              </div>
              <p style="font-size:13px; color:var(--muted); margin-bottom:12px;"><b>Type:</b> ${h.type}</p>
              
              <div style="font-size:20px; font-weight:700; color:var(--primary); margin-bottom:12px;">${h.fee} <span style="font-size:12px; font-weight:400; color:var(--muted);">/ session</span></div>
              
              <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px;">
                ${h.amenities.map(a => `<span class="tag" style="background:var(--bg); color:var(--text-color); font-size:11px;">${getIcon('check', 12, '#0F8B8D')} ${a}</span>`).join('')}
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--line); padding-top:14px; margin-top:10px;">
              <span style="font-size:12px; color:var(--muted);"><b>${h.spaces}</b> bed spaces available</span>
              <button class="${h.spaces > 0 ? 'primary-btn' : 'secondary-btn'}" data-reserve-hostel="${h.name}" ${h.spaces === 0 ? 'disabled' : ''}>
                ${h.spaces > 0 ? 'Reserve Space' : 'Fully Booked'}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function setupAccommodationListeners() {
  app.querySelectorAll('[data-reserve-hostel]').forEach(btn => {
    btn.onclick = () => {
      const hostelName = btn.dataset.reserveHostel;
      const hObj = hostels.find(h => h.name === hostelName);
      const feeVal = hObj ? hObj.fee : "₦85,000";
      
      modal(
        `Reserve Space in ${hostelName} — Paystack Gateway`,
        `
          <div style="background:linear-gradient(135deg, #0ba4db15, #0a254010); padding:12px 16px; border-radius:8px; margin-bottom:16px; border:1px solid #0ba4db30;">
            <p style="margin:0; font-size:13px; color:#0a2540;"><b>Paystack Live Payment Gateway Active</b></p>
            <p style="margin:4px 0 0 0; font-size:12px; color:var(--muted);">Merchant: Sandlip Africa University Student Housing</p>
          </div>
          <p>Please confirm your bed space reservation details below:</p>
          <div style="margin:16px 0; background:var(--bg); padding:16px; border-radius:var(--radius-sm); font-size:13px; line-height:1.6;">
            <p style="margin-bottom:4px;"><b>Student Name:</b> ${state.studentData.name}</p>
            <p style="margin-bottom:4px;"><b>Matric No:</b> ${state.studentData.id}</p>
            <p style="margin-bottom:4px;"><b>Hostel:</b> ${hostelName}</p>
            <p style="margin-bottom:4px;"><b>Bed Space Fee:</b> <b style="color:var(--navy); font-size:15px;">${feeVal}</b></p>
            <p style="margin:0;"><b>Assigned Unit:</b> Block B, Room 104 (Bed Space B-04)</p>
          </div>
          <label style="display:flex; align-items:center; gap:8px; font-size:13px; margin-bottom:12px; cursor:pointer;">
            <input type="checkbox" id="chk-hostel-terms" checked />
            I agree to SAU Hostel Code of Conduct & Regulations.
          </label>
        `,
        'Pay Bed Space Fee via Paystack',
        () => {
          payWithPaystack({
            amountNaira: feeVal,
            description: `SAU Hostel Bed Space Reservation (${hostelName})`,
            onSuccess: (ref, paidAmount) => {
              state.userFeeTransactions.unshift({
                id: ref,
                date: "Today",
                description: `Hostel Reservation Fee — ${hostelName}`,
                amount: `₦${paidAmount.toLocaleString()}`,
                method: "Paystack Gateway",
                status: "Successful"
              });
              toast(`Hostel bed space in ${hostelName} paid & reserved successfully via Paystack! Clearance slip generated.`);
              render();
            }
          });
        }
      );
    };
  });
}

// 25. Printable Documents View Generators
function generateAdmissionLetterHtml(s) {
  return `
    <div class="a4-container">
      <div class="a4-page">
        <div class="a4-watermark">SANDLIP AFRICA</div>
        <div class="a4-header">
          <div class="a4-header-left">
            <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786460835/SAU_logo_brwpc2.png" alt="SAU Logo" class="a4-logo" referrerPolicy="no-referrer" />
            <div class="a4-title-group">
              <h2>SANDLIP AFRICA UNIVERSITY</h2>
              <p>OFFICE OF THE ACADEMIC REGISTRAR • ADMISSIONS BOARD</p>
            </div>
          </div>
          <div style="border:1.5px solid #cbd5e1; width:85px; height:105px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#f8fafc; text-align:center; padding:2px; border-radius:4px; overflow:hidden;">
            ${(s.avatarUrl || state.studentData.avatarUrl)
              ? `<img src="${s.avatarUrl || state.studentData.avatarUrl}" style="width:100%; height:100%; object-fit:cover;" alt="Student Profile Picture" />`
              : `<div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg, #0b2545 0%, #0f8b8d 100%); color:#ffffff;">
                  <div style="font-size:26px; font-weight:800;">${s.name ? s.name.split(' ').map(n=>n[0]).join('').slice(0,2) : 'ET'}</div>
                  <span style="font-size:7px; color:rgba(255,255,255,0.8); font-weight:700; margin-top:2px;">STUDENT PHOTO</span>
                </div>`
            }
          </div>
        </div>

        <div class="a4-body">
          <div style="display:flex; justify-content:space-between; align-items:center; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:10px 14px; margin-bottom:16px; font-size:11px;">
            <span><b>Ref No:</b> SAU/ADM/2024/CS/1119</span>
            <span><b>Date Issued:</b> 15 October 2024</span>
            <span class="a4-doc-badge">OFFICIAL ADMISSION LETTER</span>
          </div>

          <div class="a4-meta-grid" style="margin-bottom:16px;">
            <div class="a4-meta-item"><span>Full Candidate Name:</span><b>${s.name}</b></div>
            <div class="a4-meta-item"><span>Application / Reg ID:</span><b>${s.id}</b></div>
            <div class="a4-meta-item"><span>Admitted Programme:</span><b>${s.programme}</b></div>
            <div class="a4-meta-item"><span>Faculty / Department:</span><b>${s.faculty} • ${s.department}</b></div>
            <div class="a4-meta-item"><span>Academic Session / Mode:</span><b>2024/2025 Session (Full-Time Direct Entry)</b></div>
            <div class="a4-meta-item"><span>Admission Offer Status:</span><b style="color:#059669;">PROVISIONAL OFFER APPROVED</b></div>
          </div>

          <div style="margin:16px 0; font-size:12px; line-height:1.7; color:#1e293b;">
            <p style="margin-bottom:10px;">Dear <b>${s.name}</b>,</p>
            <p style="margin-bottom:10px;">We are pleased to inform you that the Admissions Board of Sandlip Africa University has approved your provisional offer of admission into the <b>${s.programme}</b> programme in the <b>${s.department}</b>, <b>${s.faculty}</b> for the <b>2024/2025 Academic Session</b>.</p>
            <p style="margin-bottom:10px;">This offer is subject to the verification of your entry qualifications, submission of original educational certificates, medical fitness examination, and full compliance with university regulations.</p>
          </div>

          <h3 style="font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#0f8b8d; margin:14px 0 6px;">Mandatory Clearance & Enrollment Requirements</h3>
          <table class="a4-table" style="margin-bottom:14px;">
            <thead>
              <tr>
                <th>Requirement Description</th>
                <th>Compliance Status</th>
                <th>Deadline Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Acceptance Fee Payment</b></td>
                <td><span class="a4-doc-badge">Verified & Paid</span></td>
                <td>30 November 2024</td>
              </tr>
              <tr>
                <td><b>O'Level / A'Level Credential Verification</b></td>
                <td><span class="a4-doc-badge">Cleared & Passed</span></td>
                <td>15 December 2024</td>
              </tr>
              <tr>
                <td><b>Medical Certificate of Fitness</b></td>
                <td><span class="a4-doc-badge">Medical Center Cleared</span></td>
                <td>10 January 2025</td>
              </tr>
              <tr>
                <td><b>Departmental Physical Screening</b></td>
                <td><span class="a4-doc-badge">Approved</span></td>
                <td>20 January 2025</td>
              </tr>
            </tbody>
          </table>

          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:10px 14px; font-size:11px; color:#475569; margin-bottom:20px;">
            <b>Important Registry Notice:</b> Candidates are required to present this original admission letter alongside verified educational credentials during physical screening at the Academic Registry.
          </div>

          <div class="a4-signatures">
            <div class="a4-signature-box">
              <div class="a4-signature-line"><span style="font-family:'Playfair Display', serif; font-size:14px; font-weight:700; color:#0b2545;">${s.name}</span></div>
              <span>Candidate Acceptance Signature</span>
            </div>

            <div style="text-align:center;">
              <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786617505/ChatGPT_Image_Aug_13_2026_11_35_20_AM_yjkapi.png" alt="Official Seal of Registrar" style="width:72px; height:72px; object-fit:contain; margin:0 auto; display:block;" referrerPolicy="no-referrer" />
            </div>

            <div class="a4-signature-box">
              <div class="a4-signature-line"><span style="font-family:'Playfair Display', serif; font-size:14px; font-weight:700; color:#0b2545;">Mr. John Okeke</span></div>
              <span>Academic Registrar, SAU</span>
            </div>
          </div>

          <div class="a4-footer">
            <span>SAU Official Admission Document • Verification Ref: #SAU-ADM-2024-1119</span>
            <span>A4 Document Format • Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateCourseRegistrationFormHtml(s, courses) {
  const regCourses = courses && courses.length ? courses : state.registeredCourses;
  const totalUnits = regCourses.reduce((sum, c) => sum + (c.units || 3), 0);

  return `
    <div class="a4-container">
      <div class="a4-page">
        <div class="a4-watermark">SANDLIP AFRICA</div>
        <div class="a4-header">
          <div class="a4-header-left">
            <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786460835/SAU_logo_brwpc2.png" alt="SAU Logo" class="a4-logo" referrerPolicy="no-referrer" />
            <div class="a4-title-group">
              <h2>SANDLIP AFRICA UNIVERSITY</h2>
              <p>OFFICE OF THE ACADEMIC REGISTRAR • SEMESTER COURSE REGISTRATION FORM</p>
            </div>
          </div>
          <div style="border:1.5px solid #cbd5e1; width:85px; height:105px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#f8fafc; text-align:center; padding:2px; border-radius:4px; overflow:hidden;">
            ${(s.avatarUrl || state.studentData.avatarUrl)
              ? `<img src="${s.avatarUrl || state.studentData.avatarUrl}" style="width:100%; height:100%; object-fit:cover;" alt="Student Profile Picture" />`
              : `<div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg, #0b2545 0%, #0f8b8d 100%); color:#ffffff;">
                  <div style="font-size:26px; font-weight:800;">${s.name ? s.name.split(' ').map(n=>n[0]).join('').slice(0,2) : 'ET'}</div>
                  <span style="font-size:7px; color:rgba(255,255,255,0.8); font-weight:700; margin-top:2px;">STUDENT PHOTO</span>
                </div>`
            }
          </div>
        </div>

        <div class="a4-body">
          <div class="a4-meta-grid" style="margin-bottom:16px;">
            <div class="a4-meta-item"><span>Student Full Name:</span><b>${s.name}</b></div>
            <div class="a4-meta-item"><span>Matriculation Number:</span><b>${s.id}</b></div>
            <div class="a4-meta-item"><span>Programme / Level:</span><b>${s.programme} (${s.level})</b></div>
            <div class="a4-meta-item"><span>Department / Faculty:</span><b>${s.department} • ${s.faculty}</b></div>
            <div class="a4-meta-item"><span>Session / Semester:</span><b>${s.session} • ${s.semester}</b></div>
            <div class="a4-meta-item"><span>Academic Standing:</span><b style="color:#0f8b8d;">Good Standing (CGPA: ${s.cgpa} / 5.00)</b></div>
          </div>

          <h3 style="font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#0f8b8d; margin:14px 0 6px;">Approved Course Registration Schedule</h3>
          <table class="a4-table" style="margin-bottom:12px;">
            <thead>
              <tr>
                <th style="width:30px;">S/N</th>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Units</th>
                <th>Status</th>
                <th>Lecturer in Charge</th>
              </tr>
            </thead>
            <tbody>
              ${regCourses.map((c, idx) => `
                <tr>
                  <td><b>${idx + 1}</b></td>
                  <td><b>${c.code}</b></td>
                  <td>${c.title}</td>
                  <td>${c.units} Units</td>
                  <td><span class="a4-doc-badge">Approved Core</span></td>
                  <td>${c.lecturer || 'Course Lecturer'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:10px 14px; font-size:11.5px; color:#0f172a; display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <span><b>Total Registered Units:</b> ${totalUnits} Credit Units</span>
            <span style="color:#059669; font-weight:700;">✓ Registry Status: Officially Registered & Stamped</span>
          </div>

          <div class="a4-signatures" style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px; margin-top:28px; padding-top:16px;">
            <div class="a4-signature-box" style="width:auto;">
              <div class="a4-signature-line"><span style="font-family:'Playfair Display', serif; font-size:13px; font-weight:700; color:#0b2545;">${s.name}</span></div>
              <span>Student Signature & Date</span>
            </div>
            
            <div class="a4-signature-box" style="width:auto;">
              <div class="a4-signature-line"><span style="font-family:'Playfair Display', serif; font-size:13px; font-weight:700; color:#0b2545;">Dr. C. N. Eze</span></div>
              <span>Level Adviser Signature</span>
            </div>

            <div class="a4-signature-box" style="width:auto;">
              <div class="a4-signature-line"><span style="font-family:'Playfair Display', serif; font-size:13px; font-weight:700; color:#0b2545;">Dr. A. O. Adebayo</span></div>
              <span>Head of Dept (HOD) Signature</span>
            </div>

            <div class="a4-signature-box" style="width:auto;">
              <div class="a4-signature-line"><span style="font-family:'Playfair Display', serif; font-size:13px; font-weight:700; color:#0b2545;">Mr. John Okeke</span></div>
              <span>Academic Registrar Stamp</span>
            </div>
          </div>

          <div class="a4-footer" style="margin-top:20px;">
            <span>SAU Official Course Registration Form • Form Ref: #SAU-CRF-2026-8801</span>
            <span>A4 Document Format • Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateExamClearancePassHtml(s) {
  const ex = [
    { course: "CSC 301", title: "Data Structures & Algorithms", date: "24 Nov 2026", time: "09:00 AM", venue: "Lecture Theatre B", seat: "CS-302" },
    { course: "CSC 303", title: "Database Systems & Design", date: "26 Nov 2026", time: "02:00 PM", venue: "Computer Lab 1", seat: "CS-302" },
    { course: "CSC 305", title: "Operating Systems Principles", date: "28 Nov 2026", time: "09:00 AM", venue: "Lecture Theatre A", seat: "CS-302" },
    { course: "MTH 311", title: "Numerical Analysis I", date: "01 Dec 2026", time: "11:30 AM", venue: "Science Auditorium", seat: "CS-302" },
    { course: "CSC 309", title: "Software Engineering Principles", date: "03 Dec 2026", time: "09:00 AM", venue: "Lecture Theatre B", seat: "CS-302" }
  ];

  return `
    <div class="a4-container">
      <div class="a4-page">
        <div class="a4-watermark">SANDLIP AFRICA</div>
        <div class="a4-header">
          <div class="a4-header-left">
            <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786460835/SAU_logo_brwpc2.png" alt="SAU Logo" class="a4-logo" referrerPolicy="no-referrer" />
            <div class="a4-title-group">
              <h2>SANDLIP AFRICA UNIVERSITY</h2>
              <p>OFFICE OF THE CHIEF EXAMINATION OFFICER • EXAMINATION CLEARANCE DOCKET</p>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <div style="border:1.5px dashed #0f8b8d; width:85px; height:90px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#ffffff; text-align:center; padding:4px; border-radius:4px; overflow:hidden;">
              <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786619697/ChatGPT_Image_Aug_13_2026_12_14_39_PM_li0s0p.png" alt="Exam Barcode Pass" style="width:100%; height:45px; object-fit:contain;" referrerPolicy="no-referrer" />
              <span style="font-size:7px; color:#64748b; font-weight:700; margin-top:2px;">EXAM PASS BARCODE</span>
            </div>
            <div style="border:1.5px solid #cbd5e1; width:75px; height:90px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#f8fafc; text-align:center; padding:2px; border-radius:4px; overflow:hidden;">
              ${(s.avatarUrl || state.studentData.avatarUrl)
                ? `<img src="${s.avatarUrl || state.studentData.avatarUrl}" style="width:100%; height:100%; object-fit:cover;" alt="Student Profile Picture" />`
                : `<div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg, #0b2545 0%, #0f8b8d 100%); color:#ffffff;">
                    <div style="font-size:22px; font-weight:800;">${s.name ? s.name.split(' ').map(n=>n[0]).join('').slice(0,2) : 'ET'}</div>
                    <span style="font-size:6.5px; color:rgba(255,255,255,0.8); font-weight:700; margin-top:2px;">STUDENT PHOTO</span>
                  </div>`
              }
            </div>
          </div>
        </div>

        <div class="a4-body">
          <div class="a4-meta-grid" style="margin-bottom:14px;">
            <div class="a4-meta-item"><span>Candidate Full Name:</span><b>${s.name}</b></div>
            <div class="a4-meta-item"><span>Matriculation Number:</span><b>${s.id}</b></div>
            <div class="a4-meta-item"><span>Faculty / Department:</span><b>${s.faculty} • ${s.department}</b></div>
            <div class="a4-meta-item"><span>Examination Session:</span><b>${s.semester}, ${s.session}</b></div>
            <div class="a4-meta-item"><span>Allocated Exam Seat:</span><b style="color:#0f8b8d; font-size:13px;">SEAT #CS-302 (Block B - Main Exam Hall)</b></div>
            <div class="a4-meta-item"><span>Clearance Verification:</span><b style="color:#059669;">100% CLEARED FOR EXAMINATIONS</b></div>
          </div>

          <h3 style="font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#0f8b8d; margin:12px 0 6px;">Pre-Examination Clearance Verification Checklist</h3>
          <table class="a4-table" style="margin-bottom:14px;">
            <thead>
              <tr>
                <th>Verification Check Item</th>
                <th>Requirement Criteria</th>
                <th>Clearance Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Tuition & School Fees Settlement</b></td>
                <td>100% Fee Paid</td>
                <td><span class="a4-doc-badge">Bursary Verified</span></td>
              </tr>
              <tr>
                <td><b>Semester Course Registration</b></td>
                <td>Registry Stamped Form</td>
                <td><span class="a4-doc-badge">Registry Cleared</span></td>
              </tr>
              <tr>
                <td><b>Library Dues & Outstanding Books</b></td>
                <td>Zero Outstanding Loans</td>
                <td><span class="a4-doc-badge">Library Cleared</span></td>
              </tr>
              <tr>
                <td><b>Lecture Attendance Minimum</b></td>
                <td>75% Class Attendance</td>
                <td><span class="a4-doc-badge">88% Recorded (Passed)</span></td>
              </tr>
            </tbody>
          </table>

          <h3 style="font-size:11.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#0f8b8d; margin:12px 0 6px;">Authorized Examination Schedule</h3>
          <table class="a4-table" style="margin-bottom:12px;">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Date & Time</th>
                <th>Venue</th>
                <th>Seat No</th>
              </tr>
            </thead>
            <tbody>
              ${ex.map(e => `
                <tr>
                  <td><b>${e.course}</b></td>
                  <td>${e.title}</td>
                  <td>${e.date} (${e.time})</td>
                  <td>${e.venue}</td>
                  <td><b style="color:#0f8b8d;">${e.seat}</b></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="background:#fff1f2; border:1px solid #fecdd3; border-radius:6px; padding:10px 14px; font-size:11px; color:#9f1239; margin-bottom:20px;">
            <b>Examination Regulation Notice:</b> Candidates must present this original clearance docket along with a valid SAU Student ID Card at the examination hall entrance.
          </div>

          <div class="a4-signatures">
            <div class="a4-signature-box">
              <div class="a4-signature-line"><span style="font-family:'Playfair Display', serif; font-size:14px; font-weight:700; color:#0b2545;">${s.name}</span></div>
              <span>Candidate Signature</span>
            </div>

            <div class="a4-signature-box">
              <div class="a4-signature-line"><span style="font-family:'Playfair Display', serif; font-size:14px; font-weight:700; color:#0b2545;">Dr. M. I. Ibrahim</span></div>
              <span>Chief Examination Officer</span>
            </div>

            <div class="a4-signature-box">
              <div class="a4-signature-line"><span style="font-family:'Playfair Display', serif; font-size:14px; font-weight:700; color:#0b2545;">Mr. John Okeke</span></div>
              <span>Academic Registrar Stamp</span>
            </div>
          </div>

          <div class="a4-footer" style="margin-top:20px;">
            <span>SAU Exam Clearance Docket • Docket ID: #SAU-EXAM-2026-9921</span>
            <span>A4 Document Format • Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateTuitionReceiptHtml(s, selectedSemester = "1st Semester 2026/2027") {
  const isFullSession = selectedSemester.includes("Full Session");
  const feeItems = isFullSession ? [
    { item: "Tuition & Instructional Fees", cat: "Academic Dues", amount: "₦440,000" },
    { item: "ICT, Portal & E-Learning Fee", cat: "Technology Dues", amount: "₦70,000" },
    { item: "Library & Electronic Database Access", cat: "Resource Access", amount: "₦40,000" },
    { item: "Science Laboratory & Practical Facilities", cat: "Laboratory Facilities", amount: "₦90,000" },
    { item: "Sports, Student Health & Medical Insurance", cat: "Student Welfare", amount: "₦50,000" },
    { item: "Departmental & Student Union Dues", cat: "Union Dues", amount: "₦30,000" }
  ] : [
    { item: "Tuition & Instructional Fees", cat: "Academic Dues", amount: "₦220,000" },
    { item: "ICT, Portal & E-Learning Fee", cat: "Technology Dues", amount: "₦35,000" },
    { item: "Library & Electronic Database Access", cat: "Resource Access", amount: "₦20,000" },
    { item: "Science Laboratory & Practical Facilities", cat: "Laboratory Facilities", amount: "₦45,000" },
    { item: "Sports, Student Health & Medical Insurance", cat: "Student Welfare", amount: "₦25,000" },
    { item: "Departmental & Student Union Dues", cat: "Union Dues", amount: "₦15,000" }
  ];

  const totalAmount = isFullSession ? "₦720,000" : "₦360,000";

  return `
    <div style="margin-bottom:16px;" class="no-print">
      <div style="background:#f1f5f9; border:1px solid #cbd5e1; padding:12px 16px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; gap:16px;">
        <label style="font-weight:700; font-size:13px; color:#0b2545; display:flex; align-items:center; gap:8px;">
          ${getIcon('calendar', 18, '#0f8b8d')}
          Select Receipt Academic Semester / Session:
        </label>
        <select id="receipt-semester-select" class="select-input" style="width:260px; padding:6px 12px; font-weight:700; border-color:#0f8b8d;">
          <option value="1st Semester 2026/2027" ${selectedSemester === "1st Semester 2026/2027" ? "selected" : ""}>1st Semester 2026/2027</option>
          <option value="2nd Semester 2025/2026" ${selectedSemester === "2nd Semester 2025/2026" ? "selected" : ""}>2nd Semester 2025/2026</option>
          <option value="1st Semester 2025/2026" ${selectedSemester === "1st Semester 2025/2026" ? "selected" : ""}>1st Semester 2025/2026</option>
          <option value="Full Session 2026/2027" ${selectedSemester === "Full Session 2026/2027" ? "selected" : ""}>Full Session 2026/2027</option>
        </select>
      </div>
    </div>

    <div class="a4-container">
      <div class="half-a4-page">
        <div class="a4-watermark">SAU BURSARY</div>
        
        <div class="a4-header" style="border-bottom-color:#0f8b8d; margin-bottom:14px; padding-bottom:10px;">
          <div class="a4-header-left">
            <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786460835/SAU_logo_brwpc2.png" alt="SAU Logo" class="a4-logo" style="height:50px;" referrerPolicy="no-referrer" />
            <div class="a4-title-group">
              <h2 style="font-size:17px;">SANDLIP AFRICA UNIVERSITY</h2>
              <p>BURSARY DEPARTMENT • OFFICIAL TUITION & FEES RECEIPT</p>
            </div>
          </div>
          <div style="text-align:right;">
            <span class="a4-doc-badge" style="background:#ecfdf5; color:#047857; border-color:#a7f3d0;">OFFICIAL BURSARY VOUCHER</span>
            <small style="display:block; margin-top:3px; color:#64748b; font-size:9.5px; font-weight:700;">Voucher ID: #SAU-REC-2026-8842</small>
          </div>
        </div>

        <div class="a4-body">
          <div class="a4-meta-grid" style="grid-template-columns: repeat(3, 1fr); gap:8px 12px; padding:10px 14px; margin-bottom:12px; font-size:11px;">
            <div class="a4-meta-item"><span>Student Full Name:</span><b>${s.name}</b></div>
            <div class="a4-meta-item"><span>Matriculation ID:</span><b>${s.id}</b></div>
            <div class="a4-meta-item"><span>Selected Session / Semester:</span><b style="color:#0f8b8d;">${selectedSemester}</b></div>
            <div class="a4-meta-item"><span>Payment Date:</span><b>11 August 2026</b></div>
            <div class="a4-meta-item"><span>Payment Gateway:</span><b>Paystack Automated Card Gateway</b></div>
            <div class="a4-meta-item"><span>Account Status:</span><b style="color:#059669;">FULL PAYMENT CLEARED</b></div>
          </div>

          <h3 style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#0f8b8d; margin:10px 0 4px;">Itemized Financial Fee Breakdown</h3>
          <table class="a4-table" style="margin:4px 0 10px; font-size:11px;">
            <thead>
              <tr>
                <th>Fee Item Description</th>
                <th>Category</th>
                <th>Amount Paid</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              ${feeItems.map(f => `
                <tr>
                  <td><b>${f.item}</b></td>
                  <td>${f.cat}</td>
                  <td><b>${f.amount}</b></td>
                  <td><span class="a4-doc-badge" style="font-size:9px; padding:2px 6px;">Paid</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="background:#f8fafc; border:1.5px solid #0f8b8d; border-radius:6px; padding:10px 14px; font-size:12px; font-weight:800; color:#0b2545; display:flex; justify-content:space-between; align-items:center;">
            <span>TOTAL CUMULATIVE DUES PAID (${selectedSemester}):</span>
            <span style="font-size:16px; color:#0f8b8d;">${totalAmount}</span>
          </div>

          <!-- Centralized Bursar Signature Block -->
          <div style="text-align:center; margin:22px auto 0; width:220px;">
            <div class="a4-signature-line" style="justify-content:center; border-bottom:1.5px dashed #0b2545;">
              <span style="font-family:'Playfair Display', serif; font-size:14px; font-weight:700; color:#0b2545;">Mr. S. A. Adeleke</span>
            </div>
            <span style="font-size:10.5px; color:#475569; font-weight:700; display:block; margin-top:2px;">University Bursar & Chief Financial Officer</span>
            <div style="font-size:8.5px; color:#059669; font-weight:800; text-transform:uppercase; margin-top:2px; letter-spacing:0.5px;">✓ OFFICIAL BURSARY PAID STAMP</div>
          </div>

          <div class="a4-footer" style="margin-top:16px; padding-top:8px; font-size:9px;">
            <span>Sandlip Africa University Bursary Division • Ref: #SAU-REC-8842</span>
            <span>Half A4 Official Financial Voucher Format</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateLibraryPassHtml(s) {
  return `
    <div class="slip-container">
      <div class="slip-card">
        <div class="slip-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786460835/SAU_logo_brwpc2.png" alt="SAU Logo" style="height:32px;" referrerPolicy="no-referrer" />
            <div>
              <div class="slip-header-title">SANDLIP AFRICA UNIVERSITY</div>
              <div style="font-size:9px; color:#cbd5e1; font-weight:700; letter-spacing:0.5px;">DIGITAL LIBRARY MEMBERSHIP SLIP</div>
            </div>
          </div>
          <span class="a4-doc-badge" style="background:#f0fdf4; color:#166534; font-size:9px; padding:2px 8px;">ACTIVE PASS</span>
        </div>

        <div class="slip-body">
          <div style="display:flex; gap:16px; align-items:center; margin-bottom:12px;">
            <div style="border:1.5px solid #cbd5e1; width:70px; height:85px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#f8fafc; border-radius:6px; overflow:hidden;">
              ${(s.avatarUrl || state.studentData.avatarUrl)
                ? `<img src="${s.avatarUrl || state.studentData.avatarUrl}" style="width:100%; height:100%; object-fit:cover;" alt="Student Profile Picture" />`
                : `<div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg, #0b2545 0%, #0f8b8d 100%); color:#ffffff;">
                    <div style="font-size:20px; font-weight:800;">${s.name ? s.name.split(' ').map(n=>n[0]).join('').slice(0,2) : 'ET'}</div>
                    <span style="font-size:6.5px; color:rgba(255,255,255,0.8); font-weight:700; margin-top:2px;">STUDENT PHOTO</span>
                  </div>`
              }
            </div>
            <div style="flex:1;">
              <div style="font-size:15px; font-weight:800; color:#0b2545; margin-bottom:2px;">${s.name}</div>
              <div style="font-size:11px; color:#0f8b8d; font-weight:700; margin-bottom:6px;">Matric No: ${s.id}</div>
              <div class="slip-meta-grid" style="margin-top:0;">
                <div class="slip-meta-item"><span>Department:</span><b>${s.department}</b></div>
                <div class="slip-meta-item"><span>Faculty:</span><b>${s.faculty}</b></div>
                <div class="slip-meta-item"><span>Pass Category:</span><b>Undergraduate Research Pass</b></div>
                <div class="slip-meta-item"><span>Validity Period:</span><b style="color:#059669;">Valid thru 31 Oct 2027</b></div>
              </div>
            </div>
          </div>

          <div class="slip-barcode-box">
            <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786619697/ChatGPT_Image_Aug_13_2026_12_14_39_PM_li0s0p.png" alt="Library Barcode" style="height:54px; max-width:280px; width:100%; object-fit:contain; margin:0 auto; display:block;" referrerPolicy="no-referrer" />
            <div style="font-size:9.5px; color:#64748b; margin-top:4px; font-weight:700;">LIBRARY BARCODE ID: LIB-TSU-2026-9912 | RFID KEY: #88921-A</div>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:8px 12px; font-size:10px; color:#475569; margin-bottom:14px;">
            <b>Authorized Access Privileges:</b> Main Library Physical Stacks, IEEE Xplore Digital Repository, ScienceDirect Database, Quiet Research Pods, Printing & Scan Center.
          </div>

          <div class="a4-signatures" style="margin-top:12px; padding-top:8px;">
            <div class="a4-signature-box" style="width:140px;">
              <div class="a4-signature-line" style="height:28px;"><span style="font-family:'Playfair Display', serif; font-size:12px; font-weight:700; color:#0b2545;">${s.name}</span></div>
              <span style="font-size:9px;">Member Signature</span>
            </div>

            <div class="a4-signature-box" style="width:140px;">
              <div class="a4-signature-line" style="height:28px;"><span style="font-family:'Playfair Display', serif; font-size:12px; font-weight:700; color:#0b2545;">Dr. Mrs. E. B. Alabi</span></div>
              <span style="font-size:9px;">Chief University Librarian</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateStudentIdSlipHtml(s) {
  return `
    <div class="slip-container">
      <!-- FRONT OF ID SLIP -->
      <div class="slip-card">
        <div class="slip-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786460835/SAU_logo_brwpc2.png" alt="SAU Logo" style="height:32px;" referrerPolicy="no-referrer" />
            <div>
              <div class="slip-header-title">SANDLIP AFRICA UNIVERSITY</div>
              <div style="font-size:9px; color:#cbd5e1; font-weight:700; letter-spacing:0.5px;">STUDENT IDENTIFICATION SLIP (FRONT)</div>
            </div>
          </div>
          <div style="background:#d9a21b; color:#0b2545; font-size:8px; font-weight:800; padding:2px 6px; border-radius:4px;">OFFICIAL ID</div>
        </div>

        <div class="slip-body">
          <div style="display:flex; gap:16px; align-items:center;">
            <div style="border:2px solid #0b2545; width:80px; height:98px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#f8fafc; border-radius:6px; position:relative; overflow:hidden;">
              ${(s.avatarUrl || state.studentData.avatarUrl)
                ? `<img src="${s.avatarUrl || state.studentData.avatarUrl}" style="width:100%; height:100%; object-fit:cover;" alt="Student Profile Picture" />`
                : `<div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg, #0b2545 0%, #0f8b8d 100%); color:#ffffff;">
                    <div style="font-size:24px; font-weight:800;">${s.name ? s.name.split(' ').map(n=>n[0]).join('').slice(0,2) : 'ET'}</div>
                    <span style="font-size:6.5px; color:rgba(255,255,255,0.8); font-weight:700; margin-top:2px;">STUDENT PHOTO</span>
                  </div>`
              }
            </div>
            <div style="flex:1;">
              <div style="font-size:16px; font-weight:900; color:#0b2545; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:2px;">${s.name}</div>
              <div style="font-size:12px; color:#0f8b8d; font-weight:800; margin-bottom:6px;">MATRIC NO: ${s.id}</div>
              <div class="slip-meta-grid" style="margin-top:0;">
                <div class="slip-meta-item"><span>Level / Session:</span><b>${s.level} • ${s.session}</b></div>
                <div class="slip-meta-item"><span>Programme:</span><b>${s.programme}</b></div>
                <div class="slip-meta-item"><span>Department:</span><b>${s.department}</b></div>
                <div class="slip-meta-item"><span>Faculty:</span><b>${s.faculty}</b></div>
                <div class="slip-meta-item"><span>Date Issued:</span><b>15 Aug 2026</b></div>
                <div class="slip-meta-item"><span>Expiry Date:</span><b style="color:#059669;">31 Oct 2027</b></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BACK OF ID SLIP -->
      <div class="slip-card">
        <div class="slip-header" style="background:linear-gradient(135deg, #1e293b 0%, #0b2545 100%);">
          <div class="slip-header-title">STUDENT IDENTIFICATION SLIP (BACK & VERIFICATION)</div>
          <span style="font-size:9px; color:#94a3b8; font-weight:700;">SAU SECURITY UNIT</span>
        </div>

        <div class="slip-body" style="text-align:center;">
          <div style="display:flex; justify-content:space-around; align-items:center; margin-bottom:10px;">
            <div style="border:1px dashed #0f8b8d; padding:6px 12px; border-radius:6px; background:#ffffff; display:flex; flex-direction:column; align-items:center; justify-content:center;">
              <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786619697/ChatGPT_Image_Aug_13_2026_12_14_39_PM_li0s0p.png" alt="ID Card Barcode" style="height:36px; max-width:160px; width:100%; object-fit:contain; display:block;" referrerPolicy="no-referrer" />
              <div style="font-size:8px; color:#64748b; font-weight:700; margin-top:2px;">BARCODE: #SAU-ID-88210-VERIFIED</div>
            </div>

            <div style="border:1px solid #cbd5e1; width:50px; height:50px; display:grid; place-items:center; background:#ffffff; border-radius:4px;">
              <div style="font-size:8px; font-weight:800; color:#0b2545; font-family:monospace;">[QR VERIFY]</div>
            </div>
          </div>

          <p style="font-size:10px; color:#475569; line-height:1.4; margin-bottom:12px;">
            This card is the property of <b>Sandlip Africa University</b>. The holder whose photo and signature appear hereon is a recognized student. If found, please return to the Security Unit or Academic Registry. Emergency Tel: +234 801 234 5678.
          </p>

          <div class="a4-signatures" style="margin-top:10px; padding-top:6px; justify-content:space-around;">
            <div class="a4-signature-box" style="width:140px;">
              <div class="a4-signature-line" style="height:26px;"><span style="font-family:'Playfair Display', serif; font-size:12px; font-weight:700; color:#0b2545;">${s.name}</span></div>
              <span style="font-size:8.5px;">Student Signature</span>
            </div>

            <div class="a4-signature-box" style="width:140px;">
              <div class="a4-signature-line" style="height:26px;"><span style="font-family:'Playfair Display', serif; font-size:12px; font-weight:700; color:#0b2545;">Mr. John Okeke</span></div>
              <span style="font-size:8.5px;">Academic Registrar Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateA4DocumentHtml(docTitle, selectedSemester) {
  const s = state.studentData;
  if (docTitle.includes('Admission')) return generateAdmissionLetterHtml(s);
  if (docTitle.includes('Course')) return generateCourseRegistrationFormHtml(s, state.registeredCourses);
  if (docTitle.includes('Clearance') || (docTitle.includes('Pass') && !docTitle.includes('Library'))) return generateExamClearancePassHtml(s);
  if (docTitle.includes('Receipt') || docTitle.includes('Tuition') || docTitle.includes('Fees')) return generateTuitionReceiptHtml(s, selectedSemester || "1st Semester 2026/2027");
  if (docTitle.includes('Library')) return generateLibraryPassHtml(s);
  if (docTitle.includes('Identification') || docTitle.includes('ID')) return generateStudentIdSlipHtml(s);

  return generateAdmissionLetterHtml(s);
}

function documentsView() {
  const docs = [
    { id: "admission", title: "Official Admission Letter", desc: "Proof of provisional admission into Sandlip Africa University.", date: "15 Oct 2024", type: "PDF Document" },
    { id: "courseform", title: "Semester Course Registration Form", desc: "Stamped list of registered courses for current academic session.", date: "Current Session", type: "Printable Slip" },
    { id: "clearance", title: "Examination Clearance Pass", desc: "Official clearance slip required for entry into examination halls.", date: "First Semester", type: "Security Pass" },
    { id: "receipt", title: "Tuition & Fees Official Receipt", desc: "Verified payment receipt for university fees breakdown.", date: "Recent Transaction", type: "Financial Voucher" },
    { id: "librarypass", title: "Digital Library Membership Slip", desc: "Library ID barcode slip for physical & online library access.", date: "Valid 2026", type: "Access Pass" },
    { id: "idcard", title: "Student Identification Slip", desc: "Temporary printable student ID card with verification QR code.", date: "2026/2027", type: "Identity Pass" }
  ];

  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Printable Documents</h1>
        <p class="subtitle">Download and print official university clearance slips, forms, and letters.</p>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
      ${docs.map(d => `
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:24px;">${getIcon('file-text', 28, '#0F8B8D')}</span>
              <span class="tag teal">${d.type}</span>
            </div>
            <h3 style="font-size:16px; margin-bottom:6px; color:var(--navy);">${d.title}</h3>
            <p style="font-size:13px; color:var(--muted); line-height:1.5; margin-bottom:14px;">${d.desc}</p>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--line); padding-top:14px;">
            <span style="font-size:11px; color:var(--muted);"><b>Issued:</b> ${d.date}</span>
            <button class="primary-btn" data-print-doc="${d.title}">${getIcon('printer', 16)} Print / Preview</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function setupDocumentsListeners() {
  app.querySelectorAll('[data-print-doc]').forEach(btn => {
    btn.onclick = () => {
      const docTitle = btn.dataset.printDoc;
      let currentSemester = "1st Semester 2026/2027";

      const renderDocumentModal = () => {
        const docHtml = generateA4DocumentHtml(docTitle, currentSemester);
        modal(
          `${docTitle} (Official Printable Layout)`,
          docHtml,
          'Print Document',
          () => {
            window.print();
            toast(`${docTitle} sent to system printer.`);
          }
        );

        // Attach dynamic listener for tuition receipt semester dropdown if present
        const semSelect = document.querySelector('#receipt-semester-select');
        if (semSelect) {
          semSelect.onchange = (e) => {
            currentSemester = e.target.value;
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
            renderDocumentModal();
          };
        }
      };

      renderDocumentModal();
    };
  });
}

// 26. Print Biodata Form View
function biodataView() {
  const s = state.studentData;
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Print Biodata Form</h1>
        <p class="subtitle">Official Student Enrollment & Information Profile Record.</p>
      </div>
      <button class="primary-btn" id="btn-print-biodata-page">${getIcon('printer', 16)} Print Biodata Form</button>
    </div>

    <div class="a4-container">
      <div class="a4-page">
        <div class="a4-watermark">SANDLIP AFRICA</div>

        <!-- Form Header -->
        <div class="a4-header">
          <div class="a4-header-left">
            <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786460835/SAU_logo_brwpc2.png" alt="SAU Logo" class="a4-logo" referrerPolicy="no-referrer" />
            <div class="a4-title-group">
              <h2>SANDLIP AFRICA UNIVERSITY</h2>
              <p>OFFICE OF THE ACADEMIC REGISTRAR • STUDENT BIODATA RECORD</p>
            </div>
          </div>
          <div style="border:1.5px solid #cbd5e1; width:85px; height:105px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#f8fafc; text-align:center; padding:2px; border-radius:4px; overflow:hidden;">
            ${(s.avatarUrl || state.studentData.avatarUrl)
              ? `<img src="${s.avatarUrl || state.studentData.avatarUrl}" style="width:100%; height:100%; object-fit:cover;" alt="Student Profile Picture" />`
              : `<div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg, #0b2545 0%, #0f8b8d 100%); color:#ffffff;">
                  <div style="font-size:26px; font-weight:800;">${s.name ? s.name.split(' ').map(n=>n[0]).join('').slice(0,2) : 'ET'}</div>
                  <span style="font-size:7px; color:rgba(255,255,255,0.8); font-weight:700; margin-top:2px;">STUDENT PHOTO</span>
                </div>`
            }
          </div>
        </div>

        <div class="a4-body">
          <!-- Section 1: Personal Details -->
          <div style="margin-bottom:20px;">
            <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#0f8b8d; margin-bottom:10px; border-bottom:1.5px solid #e2e8f0; padding-bottom:4px;">1. Personal Details</h3>
            <div class="a4-meta-grid">
              <div class="a4-meta-item"><span>Full Name:</span><b>${s.name}</b></div>
              <div class="a4-meta-item"><span>Matriculation Number:</span><b>${s.id}</b></div>
              <div class="a4-meta-item"><span>Date of Birth:</span><b>18 August 2004</b></div>
              <div class="a4-meta-item"><span>Gender:</span><b>Male</b></div>
              <div class="a4-meta-item"><span>State of Origin:</span><b>Lagos State</b></div>
              <div class="a4-meta-item"><span>Nationality:</span><b>Nigerian</b></div>
              <div class="a4-meta-item"><span>Blood Group / Genotype:</span><b>O+ / AA</b></div>
              <div class="a4-meta-item"><span>Marital Status:</span><b>Single</b></div>
            </div>
          </div>

          <!-- Section 2: Academic Details -->
          <div style="margin-bottom:20px;">
            <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#0f8b8d; margin-bottom:10px; border-bottom:1.5px solid #e2e8f0; padding-bottom:4px;">2. Academic Enrollment</h3>
            <div class="a4-meta-grid">
              <div class="a4-meta-item"><span>Faculty:</span><b>${s.faculty}</b></div>
              <div class="a4-meta-item"><span>Department:</span><b>${s.department}</b></div>
              <div class="a4-meta-item"><span>Programme:</span><b>${s.programme}</b></div>
              <div class="a4-meta-item"><span>Current Level / Session:</span><b>${s.level} • ${s.session}</b></div>
              <div class="a4-meta-item"><span>Admission Date:</span><b>${s.admissionDate}</b></div>
              <div class="a4-meta-item"><span>Cumulative CGPA:</span><b>${s.cgpa} / 5.00</b></div>
            </div>
          </div>

          <!-- Section 3: Contact & Next of Kin -->
          <div style="margin-bottom:20px;">
            <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#0f8b8d; margin-bottom:10px; border-bottom:1.5px solid #e2e8f0; padding-bottom:4px;">3. Contact & Next of Kin Information</h3>
            <div class="a4-meta-grid">
              <div class="a4-meta-item"><span>Email Address:</span><b>${s.email}</b></div>
              <div class="a4-meta-item"><span>Phone Number:</span><b>${s.phone}</b></div>
              <div class="a4-meta-item"><span>Next of Kin Name:</span><b>Chief O. Timothy</b></div>
              <div class="a4-meta-item"><span>Next of Kin Relationship:</span><b>Father / Guardian</b></div>
              <div class="a4-meta-item"><span>Next of Kin Phone:</span><b>+234 803 987 6543</b></div>
              <div class="a4-meta-item"><span>Permanent Address:</span><b>12 University Boulevard, Victoria Island, Lagos</b></div>
            </div>
          </div>

          <!-- Section 4: Declaration -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:12px 16px; font-size:11px; color:#475569; margin-top:16px;">
            <b>Student Declaration:</b> I hereby declare that the information provided in this biodata profile is complete, correct and verified. Any false declaration invalidates student enrollment.
          </div>

          <div class="a4-signatures">
            <div class="a4-signature-box">
              <div class="a4-signature-line"><span style="font-family:'Playfair Display', serif; font-size:15px; font-weight:700; color:#0b2545;">Timothy Emmanuel</span></div>
              <span>Student Signature & Date</span>
            </div>

            <div style="text-align:center;">
              <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786617505/ChatGPT_Image_Aug_13_2026_11_35_20_AM_yjkapi.png" alt="Official Seal of Registrar" style="width:72px; height:72px; object-fit:contain; margin:0 auto; display:block;" referrerPolicy="no-referrer" />
            </div>
            
            <div class="a4-signature-box">
              <div class="a4-signature-line"><span style="font-family:'Playfair Display', serif; font-size:15px; font-weight:700; color:#0b2545;">Mr. John Okeke</span></div>
              <span>Academic Registrar Stamp & Date</span>
            </div>
          </div>

          <div class="a4-footer">
            <span>SAU Official Student Biodata Form • Serial ID: #SAU-BIO-2026-9041</span>
            <span>A4 Document Format • Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupBiodataListeners() {
  const btn = document.querySelector('#btn-print-biodata-page');
  if (btn) {
    btn.onclick = () => {
      window.print();
      toast('Student Biodata Form sent to printer.');
    };
  }
}

// 27. Convocation Payment View
function convocationView() {
  const convocationFee = "₦65,000";
  const breakdown = [
    { item: "Academic Gown Hire & Maintenance", cost: "₦25,000" },
    { item: "Degree Certificate & Scroll Printing", cost: "₦25,000" },
    { item: "Alumni Association Lifetime Membership", cost: "₦10,000" },
    { item: "Convocation Order of Proceedings Brochure", cost: "₦5,000" }
  ];

  const isPaid = state.convocationPaid || false;

  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Convocation Payment</h1>
        <p class="subtitle">Final year graduation clearance and convocation fee payment portal.</p>
      </div>
      <span class="tag ${isPaid ? 'green' : 'gold'}">${isPaid ? getIcon('check', 12) + ' Fee Paid & Cleared' : 'Payment Pending'}</span>
    </div>

    <div class="grid" style="grid-template-columns: 1.2fr 0.8fr; gap:20px;">
      <section class="card">
        <h3 style="margin-bottom:12px;">Convocation Fee Breakdown</h3>
        <p class="subtitle" style="margin-bottom:16px;">Required graduation dues for Class of 2026/2027.</p>

        <div style="border:1px solid var(--line); border-radius:var(--radius-sm); overflow:hidden; margin-bottom:20px;">
          ${breakdown.map(b => `
            <div style="display:flex; justify-content:space-between; padding:12px 16px; border-bottom:1px solid var(--line); font-size:14px;">
              <span>${b.item}</span>
              <b>${b.cost}</b>
            </div>
          `).join('')}
          <div style="display:flex; justify-content:space-between; padding:16px; background:var(--bg); font-size:16px; font-weight:700; color:var(--teal);">
            <span>Total Convocation Fee:</span>
            <span>${convocationFee}</span>
          </div>
        </div>

        <div style="margin-bottom:20px;">
          <label class="form-label">Select Academic Gown Size</label>
          <select class="field" id="gown-size">
            <option value="Medium (M)">Medium (M) — Recommended for 5'4" – 5'9"</option>
            <option value="Large (L)">Large (L) — Recommended for 5'10" – 6'2"</option>
            <option value="Extra Large (XL)">Extra Large (XL) — Recommended for 6'3"+</option>
            <option value="Small (S)">Small (S)</option>
          </select>
        </div>

        ${!isPaid ? `
          <button class="primary-btn" id="btn-pay-convocation" style="width:100%; padding:14px; font-size:15px;">
            ${getIcon('credit-card', 16)} Pay ${convocationFee} Convocation Fee Now
          </button>
        ` : `
          <div style="padding:16px; background:rgba(18,184,134,0.1); border:1px solid var(--green); border-radius:var(--radius-sm); color:var(--green); font-weight:600; text-align:center;">
            ${getIcon('check', 16, '#0F8B8D')} Your convocation payment has been confirmed! Gown collection clearance pass generated.
          </div>
        `}
      </section>

      <aside class="card">
        <h3>Graduation Clearance Requirements</h3>
        <ul style="padding-left:18px; margin-top:12px; font-size:13px; line-height:1.8; color:var(--text-color);">
          <li>${getIcon('check', 14, '#0F8B8D')} Final Academic Units Completed (120+ Credits)</li>
          <li>${getIcon('check', 14, '#0F8B8D')} Departmental & Faculty Dues Cleared</li>
          <li>${getIcon('check', 14, '#0F8B8D')} University Library Clearance Approved</li>
          <li>${getIcon('check', 14, '#0F8B8D')} Student Affairs & Hostel Clearance Passed</li>
          <li>${isPaid ? getIcon('check', 14, '#0F8B8D') : getIcon('clock', 14, '#D9A21B')} Convocation Fee Payment (${convocationFee})</li>
        </ul>

        <hr style="border:0; border-top:1px solid var(--line); margin:20px 0;" />
        <p style="font-size:12px; color:var(--muted); line-height:1.5;">
          <b>Gown Collection Notice:</b> Academic gowns will be issued at the SAU Multi-Purpose Hall upon presentation of your Convocation Payment Receipt.
        </p>
      </aside>
    </div>
  `;
}

function setupConvocationListeners() {
  const btn = document.querySelector('#btn-pay-convocation');
  if (btn) {
    btn.onclick = () => {
      const gownSize = document.querySelector('#gown-size')?.value || "Medium (M)";
      modal(
        'Confirm Convocation Payment — Paystack Gateway',
        `
          <div style="background:linear-gradient(135deg, #0ba4db15, #0a254010); padding:12px 16px; border-radius:8px; margin-bottom:16px; border:1px solid #0ba4db30;">
            <p style="margin:0; font-size:13px; color:#0a2540;"><b>Paystack Live Gateway Connection Active</b></p>
            <p style="margin:4px 0 0 0; font-size:12px; color:var(--muted);">Merchant: Sandlip Africa University Convocation Portal</p>
          </div>
          <p>You are about to pay <b style="color:var(--navy); font-size:16px;">₦65,000</b> for Convocation & Graduation Fees.</p>
          <div style="margin:12px 0; background:var(--bg); padding:12px; border-radius:var(--radius-sm); font-size:13px;">
            <p style="margin-bottom:4px;"><b>Gown Size:</b> ${gownSize}</p>
            <p style="margin:0;"><b>Payment Channel:</b> Paystack Secure Gateway (Card / Transfer / USSD)</p>
          </div>
        `,
        'Pay ₦65,000 via Paystack',
        () => {
          payWithPaystack({
            amountNaira: 65000,
            description: `SAU Convocation Fee & Academic Gown (${gownSize})`,
            onSuccess: (ref, paidAmount) => {
              state.convocationPaid = true;
              state.userFeeTransactions.unshift({
                id: ref,
                date: "Today",
                description: `Convocation & Academic Gown Fee (${gownSize})`,
                amount: `₦${paidAmount.toLocaleString()}`,
                method: "Paystack Gateway",
                status: "Successful"
              });
              toast('Convocation fee paid successfully via Paystack! Graduation clearance generated.');
              render();
            }
          });
        }
      );
    };
  }
}

// 28. Change Password View
function passwordView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Change Password</h1>
        <p class="subtitle">Update your student portal login credentials for security.</p>
      </div>
    </div>

    <section class="card" style="max-width:550px;">
      <h3 style="margin-bottom:16px;">Account Security</h3>
      
      <form id="form-change-password">
        <div style="margin-bottom:16px;">
          <label class="form-label">Current Password</label>
          <input type="password" class="field" id="curr-pass" placeholder="Enter current password" required />
        </div>

        <div style="margin-bottom:16px;">
          <label class="form-label">New Password</label>
          <input type="password" class="field" id="new-pass" placeholder="At least 8 characters" required />
        </div>

        <div style="margin-bottom:20px;">
          <label class="form-label">Confirm New Password</label>
          <input type="password" class="field" id="confirm-pass" placeholder="Re-enter new password" required />
        </div>

        <div style="background:var(--bg); padding:12px; border-radius:var(--radius-sm); margin-bottom:20px; font-size:12px; color:var(--muted);">
          <b>Password Requirements:</b>
          <ul style="padding-left:18px; margin-top:4px;">
            <li>Minimum 8 characters in length</li>
            <li>Contains at least one number (0-9) or special character</li>
            <li>Different from previously used passwords</li>
          </ul>
        </div>

        <button type="submit" class="primary-btn" style="width:100%; padding:12px;">Update Password</button>
      </form>
    </section>
  `;
}

function setupPasswordListeners() {
  const form = document.querySelector('#form-change-password');
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const newP = document.querySelector('#new-pass').value;
      const confP = document.querySelector('#confirm-pass').value;

      if (newP.length < 8) {
        toast('New password must be at least 8 characters long.', 'error');
        return;
      }

      if (newP !== confP) {
        toast('New password and confirmation do not match.', 'error');
        return;
      }

      toast('Password changed successfully! Please use your new password next time you sign in.');
      form.reset();
    };
  }
}

/* ==========================================================================
   MASTER RENDER DISPATCHER
   ========================================================================== */

function render() {
  document.body.classList.toggle('dark', state.dark);

  if (!state.loggedIn && state.route !== 'login') {
    loginView();
    return;
  }

  if (state.route === 'login') {
    loginView();
    return;
  }

  if (window.loginBgTimer) {
    clearInterval(window.loginBgTimer);
    window.loginBgTimer = null;
  }

  let contentHtml = '';

  switch (state.route) {
    case 'dashboard': contentHtml = dashboardView(); break;
    case 'courses': contentHtml = coursesView(); break;
    case 'registration': contentHtml = registrationView(); break;
    case 'results': contentHtml = resultsView(); break;
    case 'accommodation': contentHtml = accommodationView(); break;
    case 'timetable': contentHtml = timetableView(); break;
    case 'fees': contentHtml = feesView(); break;
    case 'documents': contentHtml = documentsView(); break;
    case 'biodata': contentHtml = biodataView(); break;
    case 'community': contentHtml = communityView(); break;
    case 'convocation': contentHtml = convocationView(); break;
    case 'profile': contentHtml = profileView(); break;
    case 'settings': contentHtml = settingsView(); break;
    case 'password': contentHtml = passwordView(); break;
    case 'transcript': contentHtml = transcriptView(); break;
    case 'exams': contentHtml = examsView(); break;
    case 'assignments': contentHtml = assignmentsView(); break;
    case 'resources': contentHtml = resourcesView(); break;
    case 'library': contentHtml = libraryView(); break;
    case 'lecturers': contentHtml = lecturersView(); break;
    case 'announcements': contentHtml = announcementsView(); break;
    case 'events': contentHtml = eventsView(); break;
    case 'innovation': contentHtml = innovationView(); break;
    case 'research': contentHtml = researchView(); break;
    case 'achievements': contentHtml = achievementsView(); break;
    case 'notifications': contentHtml = notificationsView(); break;
    case 'messages': contentHtml = messagesView(); break;
    case 'support': contentHtml = supportView(); break;
    default: contentHtml = dashboardView(); break;
  }

  shell(contentHtml);

  // Attach view-specific interactive event handlers
  if (state.route === 'courses') setupCoursesListeners();
  if (state.route === 'registration') setupRegistrationListeners();
  if (state.route === 'results') setupResultsListeners();
  if (state.route === 'accommodation') setupAccommodationListeners();
  if (state.route === 'documents') setupDocumentsListeners();
  if (state.route === 'biodata') setupBiodataListeners();
  if (state.route === 'convocation') setupConvocationListeners();
  if (state.route === 'password') setupPasswordListeners();
  if (state.route === 'transcript') setupTranscriptListeners();
  if (state.route === 'assignments') setupAssignmentsListeners();
  if (state.route === 'fees') setupFeesListeners();
  if (state.route === 'library') setupLibraryListeners();
  if (state.route === 'announcements') setupAnnouncementsListeners();
  if (state.route === 'community') setupCommunityListeners();
  if (state.route === 'innovation') setupInnovationListeners();
  if (state.route === 'notifications') setupNotificationsListeners();
  if (state.route === 'support') setupSupportListeners();
  if (state.route === 'profile') setupProfileListeners();
  if (state.route === 'settings') setupSettingsListeners();
}

// Router Event Listeners
window.addEventListener('hashchange', () => {
  state.route = location.hash.slice(1) || 'dashboard';
  render();
});

window.addEventListener('resize', updateSidebarBadge);

// Global Event Delegation for Navigation and Course Interactions
document.addEventListener('click', (e) => {
  // Print Transcript button
  const printTranscriptBtn = e.target.closest('#btn-print-transcript');
  if (printTranscriptBtn) {
    e.preventDefault();
    window.print();
    toast('Academic Transcript sent to system printer.');
    return;
  }

  // Download Transcript PDF button
  const downloadTranscriptBtn = e.target.closest('#btn-download-transcript');
  if (downloadTranscriptBtn) {
    e.preventDefault();
    triggerTranscriptPdfDownload();
    return;
  }

  // Print Biodata Form button
  const printBiodataBtn = e.target.closest('#btn-print-biodata-page');
  if (printBiodataBtn) {
    e.preventDefault();
    window.print();
    toast('Student Biodata Form sent to system printer.');
    return;
  }

  // 1. Route Navigation via [data-route]
  const routeBtn = e.target.closest('[data-route]');
  if (routeBtn) {
    const target = routeBtn.dataset.route;
    if (target) {
      e.preventDefault();
      document.querySelector('#app-sidebar')?.classList.remove('open');
      if (target === 'logout') {
        logout();
      } else {
        navigate(target);
      }
      return;
    }
  }

  // 2. View Syllabus / Course Details via [data-course-code]
  const courseBtn = e.target.closest('[data-course-code]');
  if (courseBtn) {
    e.preventDefault();
    const code = courseBtn.dataset.courseCode;
    const c = state.registeredCourses.find(item => item.code === code) || state.availableCourseCatalog.find(item => item.code === code);
    if (c) {
      modal(
        `${c.code} — ${c.title}`,
        `
          <p><b>Lecturer:</b> ${c.lecturer || 'Departmental Faculty'}</p>
          <p><b>Venue & Schedule:</b> ${c.time || 'TBA'} ${c.venue ? `(${c.venue})` : ''}</p>
          <p style="margin:12px 0;"><b>Description:</b> ${c.description || 'Comprehensive curriculum covering foundational and advanced concepts in ' + c.title + '.'}</p>
          <h4>Course Syllabus Outline:</h4>
          <ul style="padding-left:20px; margin-top:8px;">
            ${(c.syllabus || ['Module 1: Foundations and Principles', 'Module 2: Practical Applications and Methods', 'Module 3: Advanced Topics and Review']).map(s => `<li style="margin-bottom:4px;">${s}</li>`).join('')}
          </ul>
        `
      );
    }
  }
});

// Initialize Application
render();
