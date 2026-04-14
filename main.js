/* Design Bytes Media — main.js */

/* ── Theme toggle ─────────────────────────────────────────── */
(function () {
  const html = document.documentElement;
  const btn = document.getElementById('themeToggle');

  // Resolve initial theme: stored preference → system preference
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored ?? (prefersDark ? 'dark' : 'light');

  html.setAttribute('data-theme', initial);
  if (btn) btn.setAttribute('aria-pressed', initial === 'dark');

  if (btn) {
    btn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      btn.setAttribute('aria-pressed', next === 'dark');
      localStorage.setItem('theme', next);
    });
  }
})();

/* ── Footer year ──────────────────────────────────────────── */
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Newsletter signup ────────────────────────────────────── */
(function () {
  const GHOST_URL = 'https://design-bytes.com';

  const form = document.getElementById('newsletterForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');

  function showStatus(message, state) {
    statusEl.textContent = message;
    statusEl.dataset.state = state;
    statusEl.hidden = false;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = form.email.value.trim();
    if (!email) return;

    const firstName = form.first_name.value.trim();
    const lastName = form.last_name.value.trim();
    const nameParts = [firstName, lastName].filter(Boolean);
    const name = nameParts.length ? nameParts.join(' ') : undefined;

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    statusEl.hidden = true;

    try {
      const res = await fetch(`${GHOST_URL}/members/api/send-magic-link/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          ...(name && { name }),
          emailType: 'signup',
        }),
      });

      if (res.ok) {
        showStatus('Thanks! Check your inbox for a confirmation link.', 'success');
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = data?.errors?.[0]?.message || 'Something went wrong. Please try again.';
        showStatus(msg, 'error');
      }
    } catch {
      showStatus('Could not reach the server. Please try again later.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
