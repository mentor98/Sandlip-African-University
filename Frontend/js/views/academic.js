import { state, modal, toast, metricCard } from '../state.js';
import { getIcon } from '../icons.js';
import {
  timetable,
  results,
  semesterResults,
  exams,
  learningResources,
  libraryResources,
  lecturers
} from '../data.js';

// Courses View
export function coursesView() {
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

export function setupCoursesListeners() {
  const app = document.querySelector('#app');
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

// Registration View
export function registrationView() {
  const allCourses = [...state.registeredCourses, ...state.availableCourseCatalog];
  
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Course Registration</h1>
        <p class="subtitle">Select courses for ${state.studentData.semester}, ${state.studentData.session}</p>
      </div>
      <button class="primary-btn" id="btn-submit-registration">Submit Registration</button>
    </div>

    <div class="grid" style="grid-template-columns: 1.4fr 0.8fr;">
      <section class="card">
        <div class="section-head">
          <h3>Available Departmental Courses</h3>
          <span class="tag green">Min: 12 • Max: 24 Units</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          ${allCourses.map(c => `
            <label style="display:flex; justify-content:space-between; align-items:center; padding:14px; border:1px solid var(--line); border-radius:var(--radius-sm); cursor:pointer;">
              <div style="display:flex; align-items:center; gap:12px;">
                <input type="checkbox" class="course-checkbox" data-units="${c.units}" ${c.status === 'Registered' ? 'checked disabled' : ''} />
                <div>
                  <b class="course-code">${c.code}</b> — <b>${c.title}</b>
                  <div style="font-size:12px; color:var(--muted); margin-top:2px;">${c.units} Units • ${c.lecturer}</div>
                </div>
              </div>
              <span class="tag ${c.status === 'Registered' ? 'green' : 'gold'}">${c.status}</span>
            </label>
          `).join('')}
        </div>
      </section>

      <aside class="card">
        <h3>Registration Summary</h3>
        <p class="subtitle" style="margin:8px 0 16px;">Review your current credit load.</p>
        
        <div class="metric-value" id="reg-total-units">${state.studentData.unitsRegistered} Units</div>
        <div style="height:8px; background:var(--line); border-radius:10px; overflow:hidden; margin:12px 0;">
          <div id="reg-progress-bar" style="width:${(state.studentData.unitsRegistered / 24) * 100}%; height:100%; background:var(--teal);"></div>
        </div>
        <small style="color:var(--muted); display:block; margin-bottom:16px;">Minimum 12 units required for active semester standing.</small>
        
        <button class="primary-btn full" id="btn-review-reg">Review & Finalize</button>
      </aside>
    </div>
  `;
}

export function setupRegistrationListeners() {
  const submitBtn = document.querySelector('#btn-submit-registration');
  const reviewBtn = document.querySelector('#btn-review-reg');

  const onConfirmRegistration = () => {
    modal(
      'Confirm Course Registration',
      `
        <p>You are about to register <b>${state.studentData.unitsRegistered} Credit Units</b> for ${state.studentData.semester}.</p>
        <p style="margin-top:10px;">This submission will be transmitted to the Head of Department for board approval.</p>
      `,
      'Confirm & Register',
      () => toast('Course registration successfully submitted for departmental approval!')
    );
  };

  if (submitBtn) submitBtn.onclick = onConfirmRegistration;
  if (reviewBtn) reviewBtn.onclick = onConfirmRegistration;
}

// Results View
export function resultsView() {
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

export function setupResultsListeners() {
  const select = document.querySelector('#select-semester-results');
  if (select) {
    select.onchange = (e) => {
      state.selectedSemester = e.target.value;
      if (window.appRender) window.appRender();
    };
  }
}

// Timetable View
export function timetableView() {
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

// Assignments View
export function assignmentsView() {
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

export function setupAssignmentsListeners() {
  const app = document.querySelector('#app');
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
            if (window.appRender) window.appRender();
          }
        );
      }
    };
  });
}

// Exams View
export function examsView() {
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

// Resources View
export function resourcesView() {
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

// Library View
export function libraryView() {
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

export function setupLibraryListeners() {
  const select = document.querySelector('#library-category-select');
  if (select) {
    select.onchange = (e) => {
      state.libraryCategory = e.target.value;
      if (window.appRender) window.appRender();
    };
  }
}

// Lecturers View
export function lecturersView() {
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
