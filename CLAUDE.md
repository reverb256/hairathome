# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Hair@Home** is an Astro-based static website for a mobile hair stylist service in Winnipeg, MB. The site uses modern web technologies with a component-based architecture, Tailwind CSS styling, and includes dark mode support.

- **Static Site Generator**: Astro 5.x (output to `dist/`)
- **Deployment**: GitHub Pages (automatic on push to `main`)
- **Styling**: Tailwind CSS 3.x with custom brand colors
- **Components**: Astro components with React integration for islands
- **Testing**: Playwright for E2E testing

## Development Commands

```bash
npm run dev       # Start dev server at http://localhost:4321
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run test      # Run Playwright E2E tests
npm run lint      # Run Biome linter
```

### Nix Development Environment
```bash
nix develop       # Enter reproducible dev shell
# Inside the shell, use standard npm commands
```

## Architecture

### Astro Structure
```
src/
├── components/           # Reusable components
│   ├── layout/          # Header.astro, Footer.astro
│   ├── service/         # ServiceCard.astro
│   └── ui/              # DarkModeToggle.astro
├── content/             # Content Collections (type-safe)
│   ├── config.ts        # Zod schemas for services, gallery, pages
│   ├── services/        # Service markdown files
│   └── gallery/         # Gallery transformation files
├── layouts/             # Page layouts
│   └── BaseLayout.astro # Base layout with SEO, dark mode
├── pages/               # Route pages (file-based routing)
│   ├── index.astro      # Homepage
│   ├── services/        # Service pages
│   ├── about.astro
│   ├── faq.astro
│   └── booking.astro
└── styles/
    └── global.css       # Global styles with Tailwind directives
```

### Content Collections

Astro Content Collections provide type-safe content management:

**Services** (`src/content/services/*.md`):
```yaml
---
title: "Haircut & Style"
icon: "lucide:scissors"
price: "$35"
duration: "30 min"
description: "Classic scissor or clipper cut..."
image: "/images/services/haircut.jpg"
---
```

**Gallery** (`src/content/gallery/*.md`):
```yaml
---
title: "Balayage Blonde"
beforeImage: "/images/gallery/before.jpg"
afterImage: "/images/gallery/after.jpg"
clientType: "women"
---
```

Schemas defined in `src/content/config.ts` with Zod validation.

### CSS Pipeline

1. **Source**: `src/styles/global.css` contains Tailwind directives
2. **Build**: Astro's Tailwind integration processes during build
3. **Output**: Bundled CSS in `dist/_astro/` with content hashing
4. **Tailwind scans**: `src/**/*.astro` files for class usage

### Theme Customization

Brand colors defined in `tailwind.config.mjs`:

```javascript
colors: {
  brand: {
    // Light mode
    cream: '#FBF8F3',
    vanilla: '#F5EDE4',
    sand: '#E8DED4',
    copper: '#d4a598',
    terracotta: '#c9967a',
    honey: '#E8B447',

    // Dark mode
    espresso: '#2D2520',
    mocha: '#3A3228',
    cocoa: '#2D2520',
    gold: '#dab0a0',
    amber: '#d9a898',
    champagne: '#e8c4b8',

    // Neutral
    charcoal: '#2D2520',
    slate: '#6b6b6b',
    stone: '#8b8179',
  }
}
```

**Custom animations** (defined in global.css):
- `animate-float` - Slow floating motion (6s)
- `animate-float-slow` - Very slow floating (8s)
- `animate-slide-up` - Entry animation
- `animate-fade-in` - Fade in effect
- `animate-pulse-soft` - Gentle pulsing

### Dark Mode Implementation

- **Detection**: System preference (`prefers-color-scheme`)
- **Toggle**: Manual toggle with localStorage persistence
- **Class-based**: `darkMode: 'class'` in Tailwind config
- **Meta tags**: Dynamic theme-color for light/dark modes
- **Component**: `src/components/ui/DarkModeToggle.astro`

## Common Tasks

### Adding a New Page

Create a new `.astro` file in `src/pages/`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Page Title"
  description="Page description for SEO"
>
  <h1>Page Title</h1>
  <p>Content here...</p>
</BaseLayout>
```

### Adding a Service

Create `src/content/services/new-service.md`:

```yaml
---
title: "Service Name"
icon: "lucide:scissors"  # or any lucide icon
price: "$50"
duration: "45 min"
description: "Full description of the service"
image: "/images/services/service-name.jpg"
---
```

The service automatically appears on:
- Services index page (`src/pages/services/index.astro`)
- Homepage services preview

### Adding a Gallery Item

Create `src/content/gallery/transformation-name.md`:

```yaml
---
title: "Transformation Name"
beforeImage: "/images/gallery/before.jpg"
afterImage: "/images/gallery/after.jpg"
clientType: "women"  # or "men", "kids"
---
```

### Modifying Styles

1. **Tailwind classes**: Edit component `.astro` files directly
2. **Custom CSS**: Edit `src/styles/global.css`
3. **Theme colors**: Edit `tailwind.config.mjs`
4. **Animations**: Add to `src/styles/global.css`

### Creating Components

Create a new component in `src/components/`:

```astro
---
// Component frontmatter (server-side code)
interface Props {
  title: string;
  subtitle?: string;
}

const { title, subtitle } = Astro.props;
---

<!-- Component template -->
<div class="my-component">
  <h2>{title}</h2>
  {subtitle && <p>{subtitle}</p>}
</div>

<!-- Scoped styles -->
<style>
  .my-component {
    /* component-specific styles */
  }
</style>
```

## Important Details

### Build Output
- Astro builds to `dist/` directory (configured in `astro.config.ts`)
- `dist/` is deployed to GitHub Pages
- Do NOT edit files in `dist/` directly - they're generated

### Contact Info (for content)
- Phone: (204) 557-2287
- Email: info@hairathome.ca
- Location: Winnipeg, MB
- Payment: Interac e-Transfer, Cash

### Deployment
Push to `main` branch triggers GitHub Pages deployment automatically via `.github/workflows/astro-ci.yml`

### Testing
- E2E tests in `tests/` directory using Playwright
- Run with `npm run test`
- Tests cover: navigation, dark mode, mobile menu, links

## Component Reference

### Layout Components

**BaseLayout.astro** - Base page layout
- Props: `title`, `description`, `image`, `type`
- Features: SEO meta tags, Open Graph, Schema.org, skip link

**Header.astro** - Site navigation
- Desktop: Horizontal nav with logo
- Mobile: Hamburger menu with slide-in drawer
- Active state highlighting

**Footer.astro** - Site footer
- Contact information
- Quick links
- Social links (if added)

### UI Components

**DarkModeToggle.astro** - Theme toggle button
- Fixed position (bottom-right)
- Sun/moon icon animation
- localStorage persistence

**ServiceCard.astro** - Service preview card
- Props: Service from content collection
- Features: Icon, price, duration, link to detail page

## Migration Notes (Hugo → Astro)

The site was migrated from Hugo in March 2026. Key differences:

| Hugo | Astro |
|------|-------|
| `content/` + `layouts/` | `src/pages/` + `src/content/` |
| Go templates | Astro components (TS-like) |
| Front matter only | Content Collections with Zod schemas |
| `hugo server` | `astro dev` |
| `public/` output | `dist/` output |

Legacy Hugo files remain for reference:
- `hugo.toml` - Old config
- `themes/hairathome/` - Old theme
- `content/` (root) - Superceded by `src/content/`

## Git Workflow

- **Main branch**: `main`
- **Deployment**: Automatic via GitHub Actions
- **CI/CD**: `.github/workflows/astro-ci.yml`
  - Runs tests on PR
  - Deploys on merge to main

## Performance Optimizations

1. **Zero JS by default**: Only View Transitions script loaded
2. **Image optimization**: Lazy loading with `loading="lazy"`
3. **CSS purging**: Tailwind removes unused classes
4. **Preloading**: Critical images preloaded in `<head>`
5. **Static generation**: All pages pre-rendered at build time
