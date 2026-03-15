# Hair@Home

Mobile hair stylist website for Winnipeg, Manitoba. Built with Astro, featuring dark mode support, responsive design, and optimized performance.

**Live Site:** https://reverb256.github.io/hairathome/

## Table of Contents

- [About](#about)
- [Technology Stack](#technology-stack)
- [Development](#development)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Deployment](#deployment)
- [Migration Notes](#migration-notes)
- [Contact](#contact)

---

## About

Hair@Home is a professional mobile hair stylist service serving Winnipeg, MB. The website showcases services, gallery transformations, and provides easy booking contact options. The site is designed for accessibility, performance, and modern web standards.

### Business Contact
- **Phone:** (204) 557-2287
- **Email:** info@hairathome.ca
- **Payment:** Interac e-Transfer, Cash
- **Area:** Winnipeg, MB (all areas)
- **Hours:** 7 days a week

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **Astro 5.x** | Static site generator with content collections |
| **Tailwind CSS 3.x** | Utility-first CSS framework |
| **React 19** | Interactive UI components (optional islands) |
| **TypeScript** | Type-safe development |
| **Playwright** | End-to-end testing |
| **Biome** | Fast linting and formatting |

---

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at http://localhost:4321 |
| `npm run build` | Build production site to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro` | Run Astro CLI commands |
| `npm run test` | Run Playwright E2E tests |
| `npm run lint` | Check code with Biome |
| `npm run lint:fix` | Auto-fix linting issues |

### Nix Development Environment

For reproducible development on NixOS:

```bash
nix develop
# Then use standard commands:
npm run dev
npm run build
```

---

## Project Structure

```
hairathome/
├── src/
│   ├── components/        # Reusable Astro/React components
│   │   ├── layout/        # Header, Footer, layout components
│   │   ├── service/       # Service-related components
│   │   └── ui/            # UI components (DarkModeToggle, etc.)
│   ├── content/           # Content collections (type-safe)
│   │   ├── services/      # Service page content
│   │   ├── gallery/       # Gallery transformation content
│   │   └── config.ts      # Content schema definitions
│   ├── layouts/           # Page layouts
│   ├── pages/             # Route pages (index, about, etc.)
│   └── styles/            # Global styles and CSS
├── public/                # Static assets (images, fonts, favicon)
├── scripts/               # Utility scripts
├── tests/                 # Playwright E2E tests
├── astro.config.ts        # Astro configuration
├── tailwind.config.mjs    # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

---

## Key Features

### Design & UX
- **Responsive Design:** Mobile-first approach, works on all devices
- **Dark Mode:** System preference detection with manual toggle
- **Smooth Animations:** View Transitions API for instant page navigation
- **Accessibility:** WCAG 2.1 AA compliant with skip links and keyboard navigation
- **Touch-Friendly:** Optimized touch targets for mobile interactions

### Performance
- **Zero JavaScript by Default:** Only loads JS for interactive components
- **Image Optimization:** Lazy loading, WebP format where supported
- **Minimal Bundle Size:** CSS purging, tree-shaking
- **Static Generation:** Pre-rendered HTML for fastest delivery

### SEO & Social
- **Meta Tags:** Open Graph, Twitter Cards, canonical URLs
- **Schema.org:** LocalBusiness structured data
- **Sitemap:** Auto-generated for search engines
- **Favicon:** SVG favicon with theme-aware variants

---

## Deployment

### GitHub Pages (Current)

The site deploys automatically on push to `main` branch via GitHub Actions:

```yaml
# .github/workflows/astro-ci.yml
- Builds site with `npm run build`
- Deploys `dist/` to GitHub Pages
- Runs E2E tests before deployment
```

**Deployment URL:** https://reverb256.github.io/hairathome/

### Manual Deployment

```bash
# Build the site
npm run build

# Deploy dist/ folder to your hosting provider
# For GitHub Pages, the workflow handles this automatically
```

### Environment Variables

No environment variables required for basic deployment. For future features (analytics, forms), add to `.env`:

```env
# Public variables (accessible in browser)
PUBLIC_SITE_URL=https://hairathome.ca
PUBLIC_ANALYTICS_ID=your-analytics-id
```

---

## Migration Notes

### From Hugo to Astro (March 2026)

The site was migrated from Hugo to Astro for these reasons:

| Hugo | Astro |
|------|-------|
| Go templates (limited) | Component-based (familiar to React/Vue devs) |
| No TypeScript | Full TypeScript support |
| Manual content types | Content Collections with validation |
| Basic SEO | Built-in SEO optimizations |
| Separate build tools | Unified build system |

**Migration Results:**
- All 11 pages migrated with full feature parity
- Same visual design and user experience
- Improved developer experience and type safety
- Passing E2E tests with Playwright
- Faster build times and smaller output

### Legacy Hugo Files

The following files remain for reference but are no longer used:
- `hugo.toml` - Hugo configuration (kept for reference)
- `themes/hairathome/` - Old Hugo theme (deprecated)
- `content/` directory (Astro now uses `src/content/`)

---

## Adding Content

### Adding a Service

1. Create a new file in `src/content/services/new-service.md`:
```yaml
---
title: "New Service"
icon: "lucide:scissors"
price: "$50"
duration: "45 min"
description: "Service description here"
image: "/images/services/new-service.jpg"
---
```

2. The service will automatically appear on the Services page

### Adding Gallery Items

1. Create `src/content/gallery/transformation.md`:
```yaml
---
title: "Client Transformation"
beforeImage: "/images/gallery/before.jpg"
afterImage: "/images/gallery/after.jpg"
clientType: "women"
---
```

### Adding a Page

1. Create `src/pages/new-page.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="New Page">
  <h1>New Page</h1>
  <p>Content here</p>
</BaseLayout>
```

---

## Customization

### Colors

Edit `tailwind.config.mjs` to customize brand colors:

```javascript
theme: {
  extend: {
    colors: {
      brand: {
        copper: '#d4a598',    // Primary accent
        gold: '#dab0a0',      // Dark mode accent
        cream: '#FBF8F3',     // Light mode background
        espresso: '#2D2520',  // Dark mode background
        // ... more colors
      }
    }
  }
}
```

### Fonts

Fonts are defined in `src/layouts/BaseLayout.astro`:
- **Playfair Display** - Headings (serif, elegant)
- **Inter** - Body text (sans-serif, readable)

To change fonts, update the Google Fonts link and Tailwind config.

---

## Testing

```bash
# Run E2E tests with Playwright
npm run test

# Run tests in UI mode
npx playwright test --ui

# Run tests with headed browser
npx playwright test --headed
```

Test files are in `tests/` directory and cover:
- Navigation between pages
- Dark mode toggle
- Mobile menu functionality
- Service card links
- Contact links

---

## Future Enhancements

Planned improvements for future iterations:

- [ ] Online booking system with calendar
- [ ] Admin dashboard for appointment management
- [ ] SMS/email appointment reminders
- [ ] Gift card functionality
- [ ] Customer photo gallery submissions
- [ ] Blog/tips section
- [ ] Multilingual support (French)

---

## License

MIT License - See LICENSE file for details

---

## Support

For website issues or questions:
- **Email:** info@hairathome.ca
- **Phone:** (204) 557-2287
- **GitHub Issues:** https://github.com/reverb256/hairathome/issues

---

*Built with [Astro](https://astro.build) | Deployed on [GitHub Pages](https://pages.github.com)*
