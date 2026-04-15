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

/* ── Featured article from RSS ───────────────────────────── */
(function () {
  const RSS_URL = 'https://design-bytes.com/rss/';
  const PROXY = `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}`;
  const MEDIA_NS = 'http://search.yahoo.com/mrss/';

  function stripHtml(str) {
    const el = document.createElement('div');
    el.innerHTML = str;
    return el.textContent.trim();
  }

  async function loadFeaturedArticle() {
    const card = document.getElementById('featuredCard');
    if (!card) return;

    try {
      const res = await fetch(PROXY);
      if (!res.ok) return;

      const { contents } = await res.json();
      const doc = new DOMParser().parseFromString(contents, 'text/xml');
      const item = doc.querySelector('item');
      if (!item) return;

      const title       = stripHtml(item.querySelector('title')?.textContent || '');
      const description = stripHtml(item.querySelector('description')?.textContent || '');
      const siteTitle   = doc.querySelector('channel > title')?.textContent || 'Design Bytes';

      // Image: prefer media:content, fall back to enclosure
      const mediaEl  = item.getElementsByTagNameNS(MEDIA_NS, 'content')[0];
      const imageUrl = mediaEl?.getAttribute('url')
                       || item.querySelector('enclosure[type^="image"]')?.getAttribute('url')
                       || '';

      // Populate text fields
      card.querySelector('.pub-card__category').textContent = siteTitle;
      card.querySelector('.pub-card__title').textContent    = title;
      card.querySelector('.pub-card__desc').textContent     = description;

      const linkEl = card.querySelector('.pub-card__link');
      linkEl.href = 'https://design-bytes.com';
      linkEl.target = '_blank';
      linkEl.rel = 'noopener noreferrer';
      linkEl.innerHTML = 'Subscribe <span aria-hidden="true">→</span>';

      // Swap the decorative cover for the article image
      if (imageUrl) {
        const cover = card.querySelector('.pub-card__cover');
        cover.classList.remove('pub-card__cover--one');
        cover.classList.add('pub-card__cover--photo');
        cover.removeAttribute('aria-hidden');

        const img = document.createElement('img');
        img.src     = imageUrl;
        img.alt     = title;
        img.loading = 'lazy';
        img.decoding = 'async';

        cover.innerHTML = '';
        cover.appendChild(img);
      }
    } catch {
      // Fail silently — static fallback content remains visible
    }
  }

  loadFeaturedArticle();
})();

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
