import { state, modal, toast } from '../state.js';
import { getIcon } from '../icons.js';
import {
  announcements,
  events,
  researchItems,
  achievements,
  messagesData
} from '../data.js';

// Announcements View
export function announcementsView() {
  const filtered = state.announcementCategory === 'All' 
    ? announcements 
    : announcements.filter(a => a.category === state.announcementCategory);

  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">University Announcements</h1>
        <p class="subtitle">Official notices from Academic Registry, Student Affairs, and Faculties.</p>
      </div>

      <select class="field" id="announcement-category-select" style="max-width:220px;">
        <option value="All">All Notice Categories</option>
        <option value="Academic">Academic Notices</option>
        <option value="Finance">Bursary & Fees</option>
        <option value="Examination">Examination</option>
        <option value="Events">Campus Events</option>
      </select>
    </div>

    <div class="grid" style="gap:16px;">
      ${filtered.map(a => `
        <article class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="tag gold">${a.category}</span>
            <span style="font-size:12px; color:var(--muted);">${a.date}</span>
          </div>
          <h3 style="font-size:17px; margin-bottom:8px; color:var(--navy);">${a.title}</h3>
          <p style="color:var(--text-color); font-size:13.5px; line-height:1.6;">${a.content}</p>
        </article>
      `).join('')}
    </div>
  `;
}

export function setupAnnouncementsListeners() {
  const select = document.querySelector('#announcement-category-select');
  if (select) {
    select.onchange = (e) => {
      state.announcementCategory = e.target.value;
      if (window.appRender) window.appRender();
    };
  }
}

// Events View
export function eventsView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Campus Events Calendar</h1>
        <p class="subtitle">Hackathons, workshops, guest lectures, and student union events.</p>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
      ${events.map(ev => `
        <article class="card" style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <span class="tag teal" style="margin-bottom:8px; display:inline-block;">${ev.dateDay} ${ev.dateMonth}</span>
            <h3 style="font-size:16px; margin-bottom:4px;">${ev.title}</h3>
            <p style="font-size:12px; color:var(--muted); margin-bottom:10px;">Location: <b>${ev.venue}</b> • Time: <b>${ev.time}</b></p>
            <span class="tag">${ev.category}</span>
          </div>
          <button class="primary-btn" onclick="alert('RSVP confirmed for ${ev.title}!')">RSVP</button>
        </article>
      `).join('')}
    </div>
  `;
}

// Community View
export function communityView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Student Community Forum</h1>
        <p class="subtitle">Connect with peers, share study materials, and discuss campus projects.</p>
      </div>
      <button class="primary-btn" id="btn-new-post">+ Create New Post</button>
    </div>

    <div class="grid" style="gap:16px;">
      ${state.userCommunityPosts.map(p => `
        <article class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div class="avatar sm">${p.avatar}</div>
              <div>
                <b>${p.author}</b>
                <span style="display:block; font-size:11px; color:var(--muted);">${p.time}</span>
              </div>
            </div>
            <span class="tag">${p.category}</span>
          </div>

          <h3 style="font-size:16px; margin-bottom:6px;">${p.title || 'Discussion Post'}</h3>
          <p style="font-size:13.5px; color:var(--text-color); line-height:1.6; margin-bottom:14px;">${p.content}</p>

          <div style="display:flex; gap:16px; border-top:1px solid var(--line); padding-top:10px; font-size:12px; color:var(--muted);">
            <button class="link-btn" style="padding:0;" onclick="this.innerHTML='❤️ ' + (${p.likes || 0} + 1)">❤️ ${p.likes || 0} Likes</button>
            <span>💬 ${p.comments ? p.comments.length : 0} Comments</span>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

export function setupCommunityListeners() {
  const btn = document.querySelector('#btn-new-post');
  if (btn) {
    btn.onclick = () => {
      modal(
        'Create New Community Discussion Post',
        `
          <label class="form-label">Discussion Title</label>
          <input class="field" id="post-title" placeholder="e.g. Study group for CSC 301 Data Structures" />

          <label class="form-label">Category</label>
          <select class="field" id="post-category">
            <option>Academic</option>
            <option>Software</option>
            <option>Hardware</option>
            <option>General</option>
          </select>

          <label class="form-label">Discussion Content</label>
          <textarea class="field" id="post-content" rows="4" placeholder="Share your thoughts or questions with the student community..."></textarea>
        `,
        'Publish Post',
        () => {
          const title = document.querySelector('#post-title')?.value || "Untitled Post";
          const category = document.querySelector('#post-category')?.value || "General";
          const content = document.querySelector('#post-content')?.value || "";

          state.userCommunityPosts.unshift({
            id: `p${Date.now()}`,
            author: state.studentData.name,
            avatar: "ET",
            time: "Just now",
            title,
            category,
            content,
            likes: 1,
            comments: []
          });

          toast('Community discussion post published successfully!');
          if (window.appRender) window.appRender();
        }
      );
    };
  }
}

// Innovation View
export function innovationView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">SAU Innovation Hub</h1>
        <p class="subtitle">Student software incubators, research projects, and tech ventures.</p>
      </div>
      <button class="primary-btn" id="btn-submit-project">+ Submit Innovation Project</button>
    </div>

    <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
      ${state.userInnovationProjects.map(proj => `
        <article class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="tag teal">${proj.name || proj.title}</span>
            <span class="tag gold">${proj.stage || 'Active'}</span>
          </div>
          <h3 style="font-size:16.5px; margin-bottom:6px;">${proj.name || proj.title}</h3>
          <p style="font-size:13px; color:var(--muted); line-height:1.5; margin-bottom:12px;">${proj.description || proj.desc}</p>
          <div style="font-size:12px; color:var(--teal); font-weight:700;">Team: ${proj.team || proj.lead}</div>
        </article>
      `).join('')}
    </div>
  `;
}

export function setupInnovationListeners() {
  const btn = document.querySelector('#btn-submit-project');
  if (btn) {
    btn.onclick = () => {
      modal(
        'Submit Innovation Project Proposal',
        `
          <label class="form-label">Project Title</label>
          <input class="field" id="proj-title" placeholder="e.g. AI Drone Crop Disease Scanner" />

          <label class="form-label">Domain / Category</label>
          <input class="field" id="proj-cat" placeholder="e.g. Agritech / Computer Vision" />

          <label class="form-label">Project Description</label>
          <textarea class="field" id="proj-desc" rows="4" placeholder="Describe the technology, problem solved, and implementation plan..."></textarea>
        `,
        'Submit Proposal',
        () => {
          const title = document.querySelector('#proj-title')?.value || "Untitled Innovation";
          const category = document.querySelector('#proj-cat')?.value || "General Tech";
          const desc = document.querySelector('#proj-desc')?.value || "";

          state.userInnovationProjects.unshift({
            id: `ip${Date.now()}`,
            name: title,
            category,
            stage: "Under Review",
            team: state.studentData.name,
            description: desc
          });

          toast('Innovation proposal submitted to the SAU Technology Sandbox Board!');
          if (window.appRender) window.appRender();
        }
      );
    };
  }
}

// Research View
export function researchView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">University Research Repository</h1>
        <p class="subtitle">Peer-reviewed faculty publications, final year undergraduate dissertations and papers.</p>
      </div>
    </div>

    <div class="grid" style="gap:16px;">
      ${researchItems.map(rp => `
        <article class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span class="tag gold">${rp.status}</span>
            <span style="font-size:12px; color:var(--muted);">${rp.grant}</span>
          </div>
          <h3 style="font-size:16px; margin-bottom:4px;">${rp.title}</h3>
          <p style="font-size:12px; color:var(--teal); font-weight:700; margin-bottom:8px;">Lead Researcher: ${rp.lead}</p>
          <p style="font-size:13px; color:var(--muted); line-height:1.5; margin-bottom:12px;">Open Positions: <b>${rp.openPositions}</b></p>
          <button class="secondary-btn" onclick="alert('Downloading Full Research Document...')">${getIcon('download', 14)} Read Full Project</button>
        </article>
      `).join('')}
    </div>
  `;
}

// Achievements View
export function achievementsView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Student Achievements & Honors</h1>
        <p class="subtitle">National competition wins, academic scholarships, and hackathon honors.</p>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
      ${achievements.map(ach => `
        <article class="card" style="display:flex; gap:16px; align-items:center;">
          <div style="font-size:36px;">🏆</div>
          <div>
            <span class="tag teal" style="margin-bottom:4px; display:inline-block">${ach.date}</span>
            <h3 style="font-size:15.5px; margin-bottom:2px;">${ach.title}</h3>
            <p style="font-size:12px; color:var(--muted); margin-top:4px;">${ach.desc}</p>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

// Notifications View
export function notificationsView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Notifications Center</h1>
        <p class="subtitle">Real-time alerts regarding grades, coursework, fees, and campus life.</p>
      </div>
      <button class="secondary-btn" id="btn-mark-all-read">Mark All as Read</button>
    </div>

    <div class="card">
      ${state.userNotifications.map(n => `
        <div class="list-row" style="${n.read ? 'opacity:0.75;' : ''}">
          <div class="row-content">
            <div style="display:flex; align-items:center; gap:8px;">
              <strong>${n.title}</strong>
              ${!n.read ? `<span class="status-pill warning">New Alert</span>` : ''}
            </div>
            <p style="margin:4px 0 0; color:var(--muted); font-size:13px;">${n.text || n.message}</p>
            <span style="font-size:11px; color:var(--muted); display:block; margin-top:2px;">${n.time}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

export function setupNotificationsListeners() {
  const btn = document.querySelector('#btn-mark-all-read');
  if (btn) {
    btn.onclick = () => {
      state.userNotifications.forEach(n => n.read = true);
      toast('All notifications marked as read.');
      if (window.appRender) window.appRender();
    };
  }
}

// Messages View
export function messagesView() {
  const activeChat = messagesData[0];
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Direct Messages & Advisor Chat</h1>
        <p class="subtitle">Direct communication channel with course lecturers and level advisers.</p>
      </div>
    </div>

    <div class="card" style="display:grid; grid-template-columns: 240px 1fr; gap:20px; min-height:450px;">
      <div style="border-right:1px solid var(--line); padding-right:16px;">
        <h4 style="margin-bottom:12px;">Contacts</h4>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${messagesData.map((contact, idx) => `
            <div class="list-row ${idx === 0 ? 'active' : ''}" style="padding:10px; border-radius:var(--radius-sm); ${idx === 0 ? 'background:var(--teal-light);' : ''} cursor:pointer;">
              <b>${contact.contact}</b><br /><small style="color:var(--muted);">${contact.role}</small>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display:flex; flex-direction:column; justify-content:space-between;">
        <div style="border-bottom:1px solid var(--line); padding-bottom:10px; margin-bottom:12px;">
          <h3 style="font-size:16px;">${activeChat.contact} (${activeChat.role})</h3>
          <span style="font-size:12px; color:var(--success);">● Active Online</span>
        </div>

        <div style="flex:1; display:flex; flex-direction:column; gap:12px; overflow-y:auto; padding:10px 0;">
          ${activeChat.messages.map(m => `
            <div style="align-self: ${m.sender === state.studentData.name ? 'flex-end' : 'flex-start'}; max-width:70%; background:${m.sender === state.studentData.name ? 'var(--teal)' : 'var(--bg)'}; color:${m.sender === state.studentData.name ? '#fff' : 'var(--ink)'}; padding:10px 14px; border-radius:var(--radius-sm);">
              <p style="margin:0; font-size:13px;">${m.text}</p>
              <small style="opacity:0.8; font-size:10px; display:block; margin-top:4px; text-align:right;">${m.time}</small>
            </div>
          `).join('')}
        </div>

        <div style="display:flex; gap:10px; margin-top:12px;">
          <input class="field" placeholder="Type a message to your adviser..." style="flex:1;" />
          <button class="primary-btn" onclick="toast('Message sent!')">Send</button>
        </div>
      </div>
    </div>
  `;
}

// Support View
export function supportView() {
  return `
    <div class="toolbar">
      <div>
        <h1 class="page-title">Help Desk & Technical Support</h1>
        <p class="subtitle">Submit support tickets for portal issues, course disputes or bursary questions.</p>
      </div>
      <button class="primary-btn" id="btn-create-ticket">+ Open New Ticket</button>
    </div>

    <div class="card">
      <h3 style="margin-bottom:14px;">My Support Tickets</h3>
      ${state.userSupportTickets.map(st => `
        <div class="list-row">
          <div class="row-content">
            <div style="display:flex; align-items:center; gap:10px;">
              <b>Ticket ID: ${st.ticketId || st.id}</b>
              <span class="tag gold">${st.category}</span>
            </div>
            <strong style="display:block; margin-top:4px;">${st.subject}</strong>
            <span style="font-size:12px; color:var(--muted);">${st.date}</span>
          </div>
          <span class="status-pill ${st.status === 'Resolved' ? 'success' : 'warning'}">${st.status}</span>
        </div>
      `).join('')}
    </div>
  `;
}

export function setupSupportListeners() {
  const btn = document.querySelector('#btn-create-ticket');
  if (btn) {
    btn.onclick = () => {
      modal(
        'Submit Support Ticket',
        `
          <label class="form-label">Category</label>
          <select class="field" id="ticket-cat">
            <option>Portal Technical Issue</option>
            <option>Course Registration Issue</option>
            <option>Bursary & Payment Dispute</option>
            <option>Grade Correction</option>
          </select>

          <label class="form-label">Subject</label>
          <input class="field" id="ticket-subject" placeholder="e.g. Unable to register CSC 309" />

          <label class="form-label">Detailed Description</label>
          <textarea class="field" id="ticket-desc" rows="4" placeholder="Explain the issue in detail..."></textarea>
        `,
        'Submit Ticket',
        () => {
          const category = document.querySelector('#ticket-cat')?.value || "General";
          const subject = document.querySelector('#ticket-subject')?.value || "Portal Help";

          state.userSupportTickets.unshift({
            ticketId: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
            category,
            subject,
            status: "In Progress",
            date: "Today"
          });

          toast('Support ticket submitted! ICT HelpDesk will respond within 24 hours.');
          if (window.appRender) window.appRender();
        }
      );
    };
  }
}
