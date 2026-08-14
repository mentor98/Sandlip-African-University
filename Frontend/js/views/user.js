import { state, modal, toast, metricCard, getTimeBasedGreeting } from '../state.js';
import { getIcon } from '../icons.js';
import { hostels } from '../data.js';

// Dashboard View
export function dashboardView() {
  const greeting = getTimeBasedGreeting();
  const firstName = state.studentData.name ? state.studentData.name.split(' ')[0] : 'Student';

  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">${greeting}, ${firstName}</h1>
        <p class="subtitle">${state.studentData.programme} • ${state.studentData.level} • ${state.studentData.session}</p>
      </div>

      <div style="display:flex; gap:10px;">
        <button class="secondary-btn" data-route="registration">+ Register Courses</button>
        <button class="primary-btn" data-route="fees">Pay Fees</button>
      </div>
    </div>

    <div class="grid metrics-grid">
      ${metricCard('award', 'Cumulative CGPA', state.studentData.cgpa, 'Out of 5.00 Maximum GPA')}
      ${metricCard('book', 'Registered Courses', state.studentData.registeredCount, '18 Credit Units Total')}
      ${metricCard('home', 'Hall & Room No', state.studentData.hostel, 'Block B • Room 104')}
      ${metricCard('credit-card', 'Outstanding Fees', state.studentData.outstandingFees, 'Due Next Semester')}
    </div>

    <div class="grid dashboard-grid">
      <section class="card">
        <h3>Quick Portal Shortcuts</h3>
        <p class="subtitle" style="margin-bottom:14px;">Frequently accessed portal services and tools.</p>
        
        <div class="quick-links">
          <button class="quick-btn" data-route="courses">
            <span class="quick-icon">${getIcon('book', 20)}</span>
            <b>Course Schedule</b>
            <small>Syllabus & Units</small>
          </button>

          <button class="quick-btn" data-route="results">
            <span class="quick-icon">${getIcon('chart', 20)}</span>
            <b>Results Portal</b>
            <small>Grades & CGPA</small>
          </button>

          <button class="quick-btn" data-route="transcript">
            <span class="quick-icon">${getIcon('scroll', 20)}</span>
            <b>Print Transcript</b>
            <small>A4 Official Copy</small>
          </button>

          <button class="quick-btn" data-route="fees">
            <span class="quick-icon">${getIcon('credit-card', 20)}</span>
            <b>Financial Dues</b>
            <small>Bursary Receipts</small>
          </button>

          <button class="quick-btn" data-route="documents">
            <span class="quick-icon">${getIcon('file-text', 20)}</span>
            <b>Print Documents</b>
            <small>Forms & Slips</small>
          </button>

          <button class="quick-btn" data-route="biodata">
            <span class="quick-icon">${getIcon('user', 20)}</span>
            <b>Biodata Form</b>
            <small>Student Profile</small>
          </button>
        </div>
      </section>

      <section class="card">
        <div class="section-head">
          <h3>Current Course Enrolment</h3>
          <button class="link-btn" data-route="courses">View All ›</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          ${state.registeredCourses.slice(0, 4).map(c => `
            <div class="list-row">
              <div class="row-content">
                <div style="display:flex; align-items:center; gap:8px;">
                  <strong class="course-code">${c.code}</strong>
                  <span class="tag green">${c.units} Units</span>
                </div>
                <b>${c.title}</b>
                <span>${c.time} • ${c.venue}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `;
}

// Profile View
export function profileView() {
  const s = state.studentData;
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Student Profile</h1>
        <p class="subtitle">Personal biodata, contact details and academic information.</p>
      </div>
      <button class="primary-btn" id="btn-edit-profile">Edit Profile Details</button>
    </div>

    <div class="grid" style="grid-template-columns: 300px 1fr; gap:20px;">
      <section class="card" style="text-align:center;">
        <div class="avatar xl" style="margin:0 auto 14px;">ET</div>
        <h2 style="font-size:20px; font-weight:800; margin-bottom:2px;">${s.name}</h2>
        <span style="color:var(--teal); font-weight:700; font-size:13px; display:block; margin-bottom:12px;">${s.id}</span>
        
        <span class="tag gold" style="font-size:12px;">${s.programme}</span>
        <div style="margin-top:16px; border-top:1px solid var(--line); padding-top:16px; text-align:left; font-size:13px; line-height:1.8;">
          <div><b>Faculty:</b> ${s.faculty}</div>
          <div><b>Department:</b> ${s.department}</div>
          <div><b>Level:</b> ${s.level}</div>
          <div><b>Session:</b> ${s.session}</div>
        </div>
      </section>

      <section class="card">
        <h3 style="margin-bottom:16px;">Contact & Personal Information</h3>
        <div class="grid" style="grid-template-columns: repeat(2, 1fr); gap:16px;">
          <div>
            <label class="form-label">Email Address</label>
            <input class="field" value="${s.email}" disabled />
          </div>

          <div>
            <label class="form-label">Phone Number</label>
            <input class="field" value="${s.phone}" disabled />
          </div>

          <div>
            <label class="form-label">Admission Date</label>
            <input class="field" value="${s.admissionDate}" disabled />
          </div>

          <div>
            <label class="form-label">Academic Status</label>
            <input class="field" value="Active (Good Standing)" disabled />
          </div>

          <div style="grid-column: span 2;">
            <label class="form-label">Residential Hostel Address</label>
            <input class="field" value="${s.hostel}" disabled />
          </div>
        </div>
      </section>
    </div>
  `;
}

export function setupProfileListeners() {
  const btn = document.querySelector('#btn-edit-profile');
  if (btn) {
    btn.onclick = () => {
      modal(
        'Update Profile Details',
        `
          <label class="form-label">Phone Number</label>
          <input class="field" id="edit-phone" value="${state.studentData.phone}" />

          <label class="form-label">Email Address</label>
          <input class="field" id="edit-email" value="${state.studentData.email}" />
        `,
        'Save Changes',
        () => {
          const phone = document.querySelector('#edit-phone')?.value;
          const email = document.querySelector('#edit-email')?.value;
          if (phone) state.studentData.phone = phone;
          if (email) state.studentData.email = email;
          toast('Profile contact details updated successfully!');
          if (window.appRender) window.appRender();
        }
      );
    };
  }
}

// Settings View
export function settingsView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Portal Preferences & Settings</h1>
        <p class="subtitle">Customize interface theme, notifications and portal display preferences.</p>
      </div>
    </div>

    <section class="card" style="max-width:600px;">
      <h3 style="margin-bottom:16px;">Interface Preferences</h3>

      <div class="list-row" style="padding:12px 0;">
        <div class="row-content">
          <strong>Dark Mode Appearance</strong>
          <span>Toggle high-contrast dark theme for night usage</span>
        </div>
        <input type="checkbox" id="toggle-dark-mode" ${state.dark ? 'checked' : ''} style="width:20px; height:20px; cursor:pointer;" />
      </div>

      <div class="list-row" style="padding:12px 0;">
        <div class="row-content">
          <strong>Email Notification Alerts</strong>
          <span>Receive email notices for new assignment grades and fee updates</span>
        </div>
        <input type="checkbox" checked style="width:20px; height:20px; cursor:pointer;" />
      </div>

      <div class="list-row" style="padding:12px 0;">
        <div class="row-content">
          <strong>SMS Exam Reminders</strong>
          <span>Receive SMS alerts 24 hours prior to exam timetables</span>
        </div>
        <input type="checkbox" checked style="width:20px; height:20px; cursor:pointer;" />
      </div>
    </section>
  `;
}

export function setupSettingsListeners() {
  const toggle = document.querySelector('#toggle-dark-mode');
  if (toggle) {
    toggle.onchange = (e) => {
      state.dark = e.target.checked;
      localStorage.sauTheme = state.dark ? 'dark' : 'light';
      document.body.classList.toggle('dark', state.dark);
      toast(`Theme set to ${state.dark ? 'Dark Mode' : 'Light Mode'}`);
    };
  }
}

// Accommodation View
export function accommodationView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Hostel Reservation Portal</h1>
        <p class="subtitle">Reserve and manage campus hostel accommodation for 2026/2027.</p>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
      ${hostels.map(h => `
        <article class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="tag gold">${h.type}</span>
            <span class="status-pill success">${h.available} Rooms Available</span>
          </div>
          <h3 style="font-size:17px; margin-bottom:4px;">${h.name}</h3>
          <p style="color:var(--muted); font-size:12px; margin-bottom:12px;">Fee: <b>${h.fee} / session</b></p>
          <button class="primary-btn" data-hostel="${h.name}">Reserve Room in ${h.name}</button>
        </article>
      `).join('')}
    </div>
  `;
}

export function setupAccommodationListeners() {
  const app = document.querySelector('#app');
  app.querySelectorAll('[data-hostel]').forEach(btn => {
    btn.onclick = () => {
      const hostelName = btn.dataset.hostel;
      modal(
        `Reserve Room — ${hostelName}`,
        `
          <p>You are reserving accommodation in <b>${hostelName}</b> for 2026/2027 Academic Session.</p>
          <label class="form-label">Select Preferred Room Block</label>
          <select class="field">
            <option>Block A — Ground Floor</option>
            <option>Block B — First Floor</option>
            <option>Block C — Second Floor</option>
          </select>
        `,
        'Confirm Hostel Reservation',
        () => {
          state.studentData.hostel = `${hostelName} • Block B - Room 104`;
          toast(`Room reserved in ${hostelName}! Allocation voucher generated.`);
          if (window.appRender) window.appRender();
        }
      );
    };
  });
}

// Password View
export function passwordView() {
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

export function setupPasswordListeners() {
  const form = document.querySelector('#form-change-password');
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const newP = document.querySelector('#new-pass').value;
      const confP = document.querySelector('#confirm-pass').value;

      if (newP.length < 8) {
        toast('New password must be at least 8 characters long.');
        return;
      }

      if (newP !== confP) {
        toast('New password and confirmation do not match.');
        return;
      }

      toast('Password changed successfully! Please use your new password next time you sign in.');
      form.reset();
    };
  }
}
