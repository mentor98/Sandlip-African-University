import { state, toast, navigate, modal } from './state.js';
import { supabase, isSupabaseConfigured } from './supabase.js';

export function loginView() {
  const app = document.querySelector('#app');
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
          <h1>Your future, organized in one intelligent platform.</h1>
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

  let currentSlide = 0;
  const slides = document.querySelectorAll('.login-bg-slider .bg-slide');
  if (slides.length > 0) {
    window.loginBgTimer = setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000);
  }

  const togglePassBtn = document.querySelector('#btn-toggle-pass');
  if (togglePassBtn) {
    togglePassBtn.onclick = (e) => {
      const input = document.querySelector('#login-pass');
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      e.target.textContent = isPass ? 'Hide' : 'Show';
    };
  }

  const loginForm = document.querySelector('#login-form');
  if (loginForm) {
    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email: state.studentData.email,
          password: document.querySelector('#login-pass').value
        });
        if (error) {
          toast(`Authentication error: ${error.message}`);
          return;
        }
      }

      localStorage.sauSession = 'true';
      state.loggedIn = true;
      toast(`Welcome back, ${state.studentData.name}!`);
      navigate('dashboard');
    };
  }

  const forgotBtn = document.querySelector('#btn-forgot-pass');
  if (forgotBtn) {
    forgotBtn.onclick = () => {
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
}

export function logout() {
  modal(
    'Confirm Logout',
    'Are you sure you want to sign out of the SAU Student Portal?',
    'Log out',
    () => {
      localStorage.removeItem('sauSession');
      state.loggedIn = false;
      toast('Signed out successfully.');
      navigate('login');
    }
  );
}
