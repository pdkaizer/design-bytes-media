# Design Bytes Media

Single-page marketing site for Design Bytes Media, an independent publishing imprint at the intersection of design and digital culture.

## Stack

- Plain HTML, CSS, and JavaScript — no build step, no framework
- CSS Cascade Layers for specificity management (`reset → base → layout → components → utilities`)
- Container Queries as the primary responsive mechanism
- Light/Dark mode via `data-theme` attribute and `localStorage`
- Newsletter signup via Ghost's Members API (`/members/api/send-magic-link/`)
- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces) + [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts

## File Structure

```
design-bytes-media/
├── index.html
├── style.css              # Layer imports only
├── main.js                # Theme toggle, footer year, newsletter form
└── layers/
    ├── reset.css
    ├── base.css
    ├── layout.css
    ├── components.css
    └── utilities.css
```

## Local Development

No install required. Open `index.html` directly in a browser, or serve with any static file server:

```bash
npx serve .
# or
python3 -m http.server
```

## Newsletter Signup

The signup form POSTs to the Ghost instance at `https://design-bytes.com` using the public `send-magic-link` endpoint. No API key is required — Ghost handles member creation and sends a confirmation email to the subscriber.

To point the form at a different Ghost instance, update the `GHOST_URL` constant at the top of the newsletter section in `main.js`.
