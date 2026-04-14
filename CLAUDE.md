This file defines the conventions, architecture, and code generation rules for this project.
Read it fully before generating any code. It is the single source of truth for how this codebase is structured and how components should be built.

## Project Overview
A single page site for Design Bytes Media 

Design Bytes Media is my publishing imprint.

- Static HTML, CSS and JS
- Modern CSS with Cascade Layers (specificity management)
- Use [https://docs.modern-web-starter.com](https://docs.modern-web-starter.com) as a guide for CSS structure
- No Tailwind. No utility-class frameworks. Semantic modern CSS only.
- Light and Dark mode
- Modern design

Responsive Design
Use Container Queries as the primary responsive mechanism, not media queries.
Reserve media queries for global layout shifts (e.g., page-level column changes).