import { state, modal, toast, metricCard } from '../state.js';
import { getIcon } from '../icons.js';
import { feeBreakdown } from '../data.js';

// Fees View
export function feesView() {
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

export function setupFeesListeners() {
  const payBtn = document.querySelector('#btn-pay-fees');
  if (payBtn) {
    payBtn.onclick = () => {
      modal(
        'Make Fee Payment',
        `
          <p>Outstanding Amount: <b>${state.studentData.outstandingFees}</b></p>
          
          <label class="form-label">Select Payment Method</label>
          <select class="field" id="payment-method-select">
            <option>Debit / Credit Card (Paystack / Flutterwave)</option>
            <option>Bank Transfer (Instant Automated Account)</option>
          </select>

          <label class="form-label">Payment Amount (₦)</label>
          <input class="field" value="145000" />
        `,
        'Proceed to Checkout',
        () => {
          state.studentData.outstandingFees = "₦0";
          state.studentData.paidFees = "₦385,000";
          state.userFeeTransactions.unshift({
            id: `SAU-PAY-2026-${Math.floor(100 + Math.random() * 900)}`,
            date: "Today",
            description: "Outstanding Fee Settlement",
            amount: "₦145,000",
            method: "Card",
            status: "Successful"
          });
          toast('Payment processing completed! Receipt issued to student inbox.');
          if (window.appRender) window.appRender();
        }
      );
    };
  }
}

// Convocation View
export function convocationView() {
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

export function setupConvocationListeners() {
  const btn = document.querySelector('#btn-pay-convocation');
  if (btn) {
    btn.onclick = () => {
      const gownSize = document.querySelector('#gown-size')?.value || "Medium (M)";
      modal(
        'Confirm Convocation Payment',
        `
          <p>You are about to pay <b>₦65,000</b> for Convocation Fees.</p>
          <div style="margin:12px 0; background:var(--bg); padding:12px; border-radius:var(--radius-sm); font-size:13px;">
            <p><b>Gown Size:</b> ${gownSize}</p>
            <p><b>Payment Channel:</b> Secure University Gateway (Debit Card / Transfer)</p>
          </div>
        `,
        'Authorize Payment',
        () => {
          state.convocationPaid = true;
          toast('Convocation fee paid successfully! Graduation clearance receipt generated.');
          if (window.appRender) window.appRender();
        }
      );
    };
  }
}
