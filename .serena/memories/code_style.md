# Code Style and Conventions - Hair@Home

## File Organization

### Content Files (Markdown)
- Located in `content/` directory
- Use Hugo frontmatter (YAML) at top of each .md file
- Common frontmatter fields: `title`, `icon`, `price`, `duration`, `description`, `slug`
- Use kebab-case for filenames and slugs
- Services: `content/services/*.md`
- Gallery: `content/gallery/*.md`
- Standard pages: `content/about.md`, `content/faq.md`, `content/booking.md`

### HTML Templates (Hugo)
- Located in `themes/hairathome/layouts/`
- Base template: `layouts/_default/baseof.html`
- Use Hugo template syntax: `{{ .Variable }}`, `{{ partial "name" . }}`
- Partials (reusable components): `layouts/partials/`
- Content type templates: `layouts/{type}/single.html` or `list.html`
- Use semantic HTML5 elements
- Include proper accessibility attributes (ARIA, skip links)

### CSS (Tailwind)
- **Source**: `input.css` (contains `@tailwind base;`)
- **Output**: `static/css/main.css` (minified, from PostCSS)
- **Config**: `tailwind.config.js` - brand colors, custom animations
- Use Tailwind utility classes for styling
- Custom animations defined in tailwind.config.js: `animate-float`, `animate-pulse-soft`, `animate-slide-up`, etc.
- Dark mode: class-based (`darkMode: 'class'`)

### Colors
Use brand color palette from tailwind.config.js:
- Primary: `brand-cream` (#FBF8F3), `brand-copper` (#D97742)
- Accents: `brand-honey`, `brand-gold`, `brand-terracotta`
- Dark mode: `brand-charcoal` (#2D2520), `brand-espresso`

### Fonts
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)

## Nix Conventions
- Flake-based dev environment in `flake.nix`
- Environment variables: `COMFYUI_HOST` (default: http://127.0.0.1:8188)
- Commands defined in flake: `build`, `serve`, `optimize`, `convert`, `generate`

## Image Conventions
- Generated images: `static/images/stock/`
- Service images: `static/images/services/`
- Gallery images: `static/images/gallery/`
- WebP conversions: `static/images/webp/`
- Brand assets: `static/images/brand/`

## Git Commit Style
- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`
- Examples from project:
  - `docs: add CODEOWNERS file`
  - `Build: Rebuild site with SEO optimizations`
