import { state, modal, toast } from '../state.js';
import { getIcon } from '../icons.js';
import { results } from '../data.js';

// Transcript View
export function transcriptView() {
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

export function setupTranscriptListeners() {
  const printBtn = document.querySelector('#btn-print-transcript');
  const downloadBtn = document.querySelector('#btn-download-transcript');

  if (printBtn) printBtn.onclick = () => window.print();
  if (downloadBtn) downloadBtn.onclick = () => toast('Transcript PDF download initiated. Check your browser downloads.');
}

// Generators for Official Printable Documents
export function generateAdmissionLetterHtml(s) {
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

export function generateCourseRegistrationFormHtml(s, courses) {
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

export function generateExamClearancePassHtml(s) {
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
              <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786619697/ChatGPT_Image_Aug_13_2026_12_14_39_PM_li0s0p.png" alt="Exam Barcode Pass" style="width:100%; height:55px; object-fit:fill; display:block;" referrerPolicy="no-referrer" />
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

export function generateTuitionReceiptHtml(s, selectedSemester = "1st Semester 2026/2027") {
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

export function generateLibraryPassHtml(s) {
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

          <div class="slip-barcode-box" style="padding:10px 16px;">
            <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786619697/ChatGPT_Image_Aug_13_2026_12_14_39_PM_li0s0p.png" alt="Library Barcode" style="height:65px; width:100%; object-fit:fill; margin:0 auto; display:block;" referrerPolicy="no-referrer" />
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

export function generateStudentIdSlipHtml(s) {
  return `
    <div class="slip-container">
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

      <div class="slip-card">
        <div class="slip-header" style="background:linear-gradient(135deg, #1e293b 0%, #0b2545 100%);">
          <div class="slip-header-title">STUDENT IDENTIFICATION SLIP (BACK & VERIFICATION)</div>
          <span style="font-size:9px; color:#94a3b8; font-weight:700;">SAU SECURITY UNIT</span>
        </div>

        <div class="slip-body" style="text-align:center;">
          <div style="display:flex; justify-content:space-around; align-items:center; margin-bottom:10px;">
            <div style="border:1px dashed #0f8b8d; padding:6px 12px; border-radius:6px; background:#ffffff; display:flex; flex-direction:column; align-items:center; justify-content:center; width:220px;">
              <img src="https://res.cloudinary.com/jinrrp4r/image/upload/v1786619697/ChatGPT_Image_Aug_13_2026_12_14_39_PM_li0s0p.png" alt="ID Card Barcode" style="height:44px; width:100%; object-fit:fill; display:block;" referrerPolicy="no-referrer" />
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

export function generateA4DocumentHtml(docTitle, selectedSemester) {
  const s = state.studentData;
  if (docTitle.includes('Admission')) return generateAdmissionLetterHtml(s);
  if (docTitle.includes('Course')) return generateCourseRegistrationFormHtml(s, state.registeredCourses);
  if (docTitle.includes('Clearance') || (docTitle.includes('Pass') && !docTitle.includes('Library'))) return generateExamClearancePassHtml(s);
  if (docTitle.includes('Receipt') || docTitle.includes('Tuition') || docTitle.includes('Fees')) return generateTuitionReceiptHtml(s, selectedSemester || "1st Semester 2026/2027");
  if (docTitle.includes('Library')) return generateLibraryPassHtml(s);
  if (docTitle.includes('Identification') || docTitle.includes('ID')) return generateStudentIdSlipHtml(s);

  return generateAdmissionLetterHtml(s);
}

// Documents View
export function documentsView() {
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

export function setupDocumentsListeners() {
  const app = document.querySelector('#app');
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

// Biodata View
export function biodataView() {
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

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:12px 16px; font-size:11px; color:#475569; margin-top:16px;">
            <b>Student Declaration:</b> I hereby declare that the information provided in this biodata profile is complete, correct and verified. Any false declaration invalidates student enrollment.
          </div>

          <div class="a4-signatures">
            <div class="a4-signature-box">
              <div class="a4-signature-line"><span style="font-family:'Playfair Display', serif; font-size:15px; font-weight:700; color:#0b2545;">Timothy Emmanuel</span></div>
              <span>Student Signature & Date</span>
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

export function setupBiodataListeners() {
  const btn = document.querySelector('#btn-print-biodata-page');
  if (btn) {
    btn.onclick = () => {
      window.print();
      toast('Student Biodata Form sent to printer.');
    };
  }
}
