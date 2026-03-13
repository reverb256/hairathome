# Hugo to Astro Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate Hair@Home from Hugo to Astro using Content Collections, Tailwind CSS, and View Transitions while preserving the existing visual design.

**Architecture:** 
- Create parallel Astro project using Content Collections with Zod schemas for type-safe content
- Use Astro components with Tailwind CSS for styling (no PostCSS config needed)
- Deploy to GitHub Pages from `dist/` → `docs/` via GitHub Action
- Keep Hugo site functional during development

**Tech Stack:** Astro 4.x, Tailwind CSS 4.x, React (optional), TypeScript, Playwright (E2E testing)

---

## Task 1: Initialize Astro Project

**Files:**
- Create: `astro.config.ts`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`

**Step 1: Create package.json**

```json
{
  "name": "hairathome",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test": "playwright test",
    "lint": "biome check .",
    "lint:fix": "biome check --write ."
  },
  "dependencies": {
    "@astrojs/react": "^4.0.0",
    "@astrojs/sitemap": "^3.0.0",
    "@astrojs/tailwind": "^6.0.0",
    "astro": "^5.0.0",
    "astro-icon": "^1.0.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.0",
    "@playwright/test": "^1.48.0",
    "typescript": "^5.7.0"
  }
}
```

**Step 2: Create astro.config.ts**

```typescript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://reverb256.github.io/hairathome/',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
  ],
  output: 'static',
  build: {
    format: 'directory',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
```

**Step 3: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

**Step 4: Create src/env.d.ts**

```typescript
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro-client" />
```

**Step 5: Initialize project**

```bash
npm install
```

Expected: All dependencies installed successfully

**Step 6: Commit**

```bash
git add package.json astro.config.ts tsconfig.json src/env.d.ts
git commit -m "feat: initialize Astro project with Tailwind and React"
```

---

## Task 2: Create Content Collections Configuration

**Files:**
- Create: `src/content/config.ts`

**Step 1: Write content collection schema**

```typescript
import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    icon: z.string().default('lucide:scissors'),
    price: z.string(),
    duration: z.string(),
    description: z.string(),
    slug: z.string(),
    image: z.string().optional(),
  }),
});

const gallery = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    beforeImage: z.string().optional(),
    afterImage: z.string().optional(),
    image: z.string().optional(),
    clientType: z.string().optional(),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { services, gallery, pages };
```

**Step 2: Verify TypeScript compiles**

```bash
npx astro check
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: define content collections with Zod schemas"
```

---

## Task 3: Setup Global Styles and Tailwind

**Files:**
- Create: `src/styles/global.css`
- Create: `tailwind.config.mjs`

**Step 1: Create global.css with brand colors and dark mode**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@theme {
  /* Brand Colors */
  --color-brand-cream: #FBF8F3;
  --color-brand-vanilla: #F5E6D3;
  --color-brand-sand: #E8D4C0;
  --color-brand-copper: #D97742;
  --color-brand-terracotta: #C16650;
  --color-brand-honey: #F5D061;
  --color-brand-charcoal: #2D2520;
  --color-brand-espresso: #2D2520;
  --color-brand-mocha: #8B6B78;
  --color-brand-cocoa: #5D4037;
  --color-brand-gold: #FFD700;
  --color-brand-champagne: #F5DEB3;
  --color-brand-amber: #F59E0B;
  --color-brand-rose: #E11D48;
  --color-brand-blush: #FDA4AF;
  --color-brand-slate: #6B7280;
  --color-brand-stone: #9CA3AF;
  --color-brand-stoneDark: #64748B;
  
  /* Custom animations */
  --animate-float: float 6s ease-in-out infinite;
  --animate-float-slow: float-slow 8s ease-in-out infinite;
  --animate-pulse-soft: pulse-soft 3s ease-in-out infinite;
  --animate-slide-up: slide-up 0.5s ease-out;
  --animate-fade-in: fade-in 0.6s ease-out;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse-soft {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* View Transitions */
@view-transition {
  navigation: auto;
}

/* Dark mode */
html.dark {
  color-scheme: dark;
}

html:not(.dark) {
  color-scheme: light;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: theme('colors.brand.cream');
}

::-webkit-scrollbar-thumb {
  background: theme('colors.brand.copper');
  border-radius: 4px;
}

html.dark ::-webkit-scrollbar-track {
  background: theme('colors.brand.espresso');
}
```

**Step 2: Create tailwind.config.mjs**

```javascript
import tailwindcss from '@tailwindcss/vite';

export default {
  content: ['./src/**/*.astro'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          cream: 'var(--color-brand-cream)',
          vanilla: 'var(--color-brand-vanilla)',
          sand: 'var(--color-brand-sand)',
          copper: 'var(--color-brand-copper)',
          terracotta: 'var(--color-brand-terracotta)',
          honey: 'var(--color-brand-honey)',
          charcoal: 'var(--color-brand-charcoal)',
          espresso: 'var(--color-brand-espresso)',
          mocha: 'var(--color-brand-mocha)',
          cocoa: 'var(--color-brand-cocoa)',
          gold: 'var(--color-brand-gold)',
          champagne: 'var(--color-brand-champagne)',
          amber: 'var(--color-brand-amber)',
          rose: 'var(--color-brand-rose)',
          blush: 'var(--color-brand-blush)',
          slate: 'var(--color-brand-slate)',
          stone: 'var(--color-brand-stone)',
          stoneDark: 'var(--color-brand-stoneDark)',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
      },
    },
  },
  plugins: [tailwindcss],
};
```

**Step 3: Test build works**

```bash
npm run build
```

Expected: Build succeeds with dist/ output

**Step 4: Commit**

```bash
git add src/styles/global.css tailwind.config.mjs
git commit -m "feat: setup global styles with Tailwind and brand colors"
```

---

## Task 4: Copy Static Assets

**Files:**
- Copy: `static/` → `public/`

**Step 1: Create public directory structure**

```bash
mkdir -p public/images/{stock,services,gallery,brand,movie-frames,movie-frames-enhanced,webp}
```

**Step 2: Copy image assets**

```bash
# Copy stock images
cp static/images/stock/*.png public/images/stock/ 2>/dev/null || true

# Copy service images
cp static/images/services/*.png public/images/services/ 2>/dev/null || true

# Copy gallery images
cp static/images/gallery/*.png public/images/gallery/ 2>/dev/null || true

# Copy brand assets
cp static/images/brand/* public/images/brand/ 2>/dev/null || true

# Copy movie frames
cp static/images/movie-frames/*.jpg public/images/movie-frames/ 2>/dev/null || true
cp static/images/movie-frames-enhanced/*.jpg public/images/movie-frames-enhanced/ 2>/dev/null || true

# Copy root level assets
cp static/favicon.* public/ 2>/dev/null || true
cp static/manifest.json public/ 2>/dev/null || true
cp static/robots.txt public/ 2>/dev/null || true
```

**Step 3: Verify assets copied**

```bash
ls -la public/images/
```

Expected: All directories exist with images

**Step 4: Commit**

```bash
git add public/
git commit -m "feat: copy static assets from Hugo to public/"
```

---

## Task 5: Create Base Layout Component

**Files:**
- Create: `src/layouts/BaseLayout.astro`

**Step 1: Write BaseLayout.astro**

```astro
---
interface Props {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

const {
  title,
  description = 'Professional mobile hair stylist in Winnipeg, MB. Quality haircuts, color & styling at your convenience.',
  image = '/images/stock/hero-02-happy-client_00001_.png',
  type = 'website',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const imageURL = new URL(image, Astro.site);

import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
import DarkModeToggle from '../components/ui/DarkModeToggle.astro';
import '../styles/global.css';
---

<!DOCTYPE html>
<html lang="en-ca" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#FBF8F3" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#2D2520" media="(prefers-color-scheme: dark)" />
    <meta name="color-scheme" content="light dark" />
    
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content={type} />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={imageURL} />
    <meta property="og:image:alt" content={title} />
    <meta property="og:locale" content="en_CA" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={canonicalURL} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={imageURL} />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/favicon.svg" />
    <link rel="manifest" href="/manifest.json" />

    <!-- Preload -->
    <link rel="preload" href="/images/brand/logo-hero.svg" as="image" type="image/svg+xml" />
    <link rel="preload" href="/images/brand/logo-hero-dark.svg" as="image" type="image/svg+xml" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

    <!-- Schema.org -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Hair@Home",
        "image": "https://reverb256.github.io/hairathome/images/logo.png",
        "telephone": "(204) 557-2287",
        "email": "info@hairathome.ca",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Winnipeg",
          "addressRegion": "MB",
          "addressCountry": "CA"
        },
        "areaServed": "Winnipeg",
        "serviceType": "Mobile Hair Styling",
        "description": "Professional mobile hair styling services in Winnipeg. Quality haircuts at your convenience.",
        "openingHours": "Mo,Tu,We,Th,Fr,Sa,Su 08:00-20:00",
        "priceRange": "$$"
      }
    </script>

    <ViewTransitions />
  </head>
  <body class="bg-brand-cream dark:bg-brand-espresso text-brand-charcoal dark:text-brand-cream font-body antialiased selection:bg-brand-copper/30 selection:text-brand-charcoal">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-charcoal dark:focus:bg-brand-gold focus:text-brand-cream dark:focus:text-brand-espresso focus:rounded-lg focus:font-medium focus:shadow-lg">
      Skip to main content
    </a>
    <Header />
    <main role="main" id="main-content">
      <slot />
    </main>
    <Footer />
    <DarkModeToggle />
  </body>
</html>

<style is:global>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  .focus\:not-sr-only:focus {
    position: static;
    width: auto;
    height: auto;
    padding: inherit;
    margin: inherit;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
</style>
```

**Step 2: Verify no TypeScript errors**

```bash
npx astro check
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: create BaseLayout with SEO and accessibility"
```

---

## Task 6: Create Header Component

**Files:**
- Create: `src/components/layout/Header.astro`

**Step 1: Write Header.astro**

```astro
---
const navItems = [
  { name: 'Services', href: '#services' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];
---

<header class="fixed top-0 left-0 right-0 z-50 bg-brand-cream/80 dark:bg-brand-espresso/80 backdrop-blur-md border-b border-brand-copper/10 dark:border-brand-gold/10">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 group">
        <img 
          src="/images/brand/logo-hero.svg" 
          alt="Hair@Home" 
          class="h-8 w-auto dark:hidden group-hover:scale-105 transition-transform"
          width="32"
          height="32"
        />
        <img 
          src="/images/brand/logo-hero-dark.svg" 
          alt="Hair@Home" 
          class="h-8 w-auto hidden dark:block group-hover:scale-105 transition-transform"
          width="32"
          height="32"
        />
        <span class="font-display font-semibold text-lg text-brand-charcoal dark:text-brand-cream">
          Hair@Home
        </span>
      </a>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <a 
            href={item.href} 
            class="text-sm font-medium text-brand-slate dark:text-brand-stoneDark hover:text-brand-copper dark:hover:text-brand-gold transition-colors"
          >
            {item.name}
          </a>
        ))}
      </div>

      <!-- Mobile Menu Button -->
      <button 
        id="mobile-menu-btn"
        class="md:hidden p-2 text-brand-charcoal dark:text-brand-cream"
        aria-label="Open menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div id="mobile-menu" class="hidden md:hidden pb-4">
      <div class="flex flex-col gap-2">
        {navItems.map((item) => (
          <a 
            href={item.href} 
            class="px-4 py-2 text-brand-charcoal dark:text-brand-cream hover:bg-brand-copper/10 dark:hover:bg-brand-gold/10 rounded-lg transition-colors"
          >
            {item.name}
          </a>
        ))}
      </div>
    </div>
  </nav>
</header>

<style>
  /* Add spacing for fixed header */
  main {
    padding-top: 4rem;
  }
</style>

<script>
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  
  menuBtn?.addEventListener('click', () => {
    menu?.classList.toggle('hidden');
  });

  // Close menu when clicking a link
  menu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu?.classList.add('hidden');
    });
  });
</script>
```

**Step 2: Test component builds**

```bash
npm run build
```

Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/layout/Header.astro
git commit -m "feat: create responsive Header component"
```

---

## Task 7: Create Footer Component

**Files:**
- Create: `src/components/layout/Footer.astro`

**Step 1: Write Footer.astro**

```astro
---
const currentYear = new Date().getFullYear();
---

<footer class="bg-brand-sand/50 dark:bg-brand-mocha border-t border-brand-copper/10 dark:border-brand-gold/10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
    <div class="grid md:grid-cols-3 gap-8">
      <!-- Brand -->
      <div>
        <div class="flex items-center gap-2 mb-4">
          <img 
            src="/images/brand/logo-hero.svg" 
            alt="Hair@Home" 
            class="h-8 w-auto dark:hidden"
            width="32"
            height="32"
          />
          <img 
            src="/images/brand/logo-hero-dark.svg" 
            alt="Hair@Home" 
            class="h-8 w-auto hidden dark:block"
            width="32"
            height="32"
          />
          <span class="font-display font-semibold text-lg text-brand-charcoal dark:text-brand-cream">
            Hair@Home
          </span>
        </div>
        <p class="text-sm text-brand-slate dark:text-brand-stoneDark">
          Professional mobile hair stylist in Winnipeg, MB. Quality service at your convenience.
        </p>
      </div>

      <!-- Contact -->
      <div>
        <h3 class="font-display font-semibold text-brand-charcoal dark:text-brand-cream mb-4">Contact</h3>
        <ul class="space-y-2 text-sm text-brand-slate dark:text-brand-stoneDark">
          <li>
            <a href="tel:+12045572287" class="hover:text-brand-copper dark:hover:text-brand-gold transition-colors">
              (204) 557-2287
            </a>
          </li>
          <li>
            <a href="mailto:info@hairathome.ca" class="hover:text-brand-copper dark:hover:text-brand-gold transition-colors">
              info@hairathome.ca
            </a>
          </li>
          <li>Winnipeg, MB, Canada</li>
        </ul>
      </div>

      <!-- Hours -->
      <div>
        <h3 class="font-display font-semibold text-brand-charcoal dark:text-brand-cream mb-4">Hours</h3>
        <p class="text-sm text-brand-slate dark:text-brand-stoneDark">
          Available 7 days a week<br />
          By appointment
        </p>
      </div>
    </div>

    <div class="mt-8 pt-8 border-t border-brand-copper/10 dark:border-brand-gold/10 text-center text-sm text-brand-stone dark:text-brand-stoneDark">
      <p>&copy; {currentYear} Hair@Home. All rights reserved.</p>
    </div>
  </div>
</footer>
```

**Step 2: Test build**

```bash
npm run build
```

Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/layout/Footer.astro
git commit -m "feat: create Footer component"
```

---

## Task 8: Create Dark Mode Toggle Component

**Files:**
- Create: `src/components/ui/DarkModeToggle.astro`

**Step 1: Write DarkModeToggle.astro**

```astro
---
---

<div class="fixed bottom-4 right-4 z-50">
  <button
    id="theme-toggle"
    class="p-3 rounded-full bg-brand-cream dark:bg-brand-mocha border border-brand-copper/20 dark:border-brand-gold/20 shadow-lg hover:scale-110 transition-transform"
    aria-label="Toggle dark mode"
  >
    <!-- Sun icon (shown in dark mode) -->
    <svg 
      id="sun-icon" 
      class="w-5 h-5 text-brand-gold hidden dark:block" 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path 
        fill-rule="evenodd" 
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
        clip-rule="evenodd" 
      />
    </svg>
    <!-- Moon icon (shown in light mode) -->
    <svg 
      id="moon-icon" 
      class="w-5 h-5 text-brand-charcoal dark:hidden" 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  </button>
</div>

<script define:vars={{ THEME_KEY: 'hairathome-theme' }}>
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Initialize theme from localStorage or system preference
  function initTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      html.classList.toggle('dark', stored === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.classList.toggle('dark', prefersDark);
    }
  }

  // Toggle theme
  function toggleTheme() {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }

  initTheme();
  toggle?.addEventListener('click', toggleTheme);
</script>
```

**Step 2: Test dark mode toggle**

```bash
npm run dev
```

Expected: Dev server starts, clicking toggle switches themes

**Step 3: Commit**

```bash
git add src/components/ui/DarkModeToggle.astro
git commit -m "feat: create dark mode toggle with localStorage persistence"
```

---

## Task 9: Migrate Service Content

**Files:**
- Create: `src/content/services/haircut.md`
- Create: `src/content/services/color.md`
- Create: `src/content/services/blowout.md`
- Create: `src/content/services/mens.md`
- Create: `src/content/services/updo.md`
- Create: `src/content/services/treatments.md`

**Step 1: Read Hugo content and convert to Astro format**

For each service in `content/services/*.md`, convert frontmatter to match schema:

```bash
# Example: haircut.md
```

```markdown
---
title: "Mobile Haircuts Winnipeg | $20-30 At-Home Haircuts"
icon: "lucide:scissors"
price: "$20-30"
duration: "30 mins"
description: "Professional mobile haircuts in Winnipeg starting at $20. Adults, seniors & kids. We come to you - home, office, anywhere. Book today: (204) 557-2287"
slug: "haircut"
image: "/images/stock/service-haircut-square_00001_.png"
---

Quality haircuts at straightforward prices. No surprises, no salon markup. I bring everything needed for a professional haircut experience right to your door.

## Pricing

- **Adults**: $30
- **Seniors (60+)**: $25
- **Kids (12 & under)**: $20
[... rest of content from Hugo file ...]
```

**Step 2: Convert all 6 services**

Create files for:
- haircut.md
- color.md
- blowout.md (as "blowout")
- mens.md (as "mens-cuts" or "mens")
- updo.md (as "updos-formal")
- treatments.md

**Step 3: Verify content collection validates**

```bash
npx astro check
```

Expected: No validation errors

**Step 4: Commit**

```bash
git add src/content/services/
git commit -m "feat: migrate service content to Astro collections"
```

---

## Task 10: Create Service Card Component

**Files:**
- Create: `src/components/service/ServiceCard.astro`

**Step 1: Write ServiceCard.astro**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  service: CollectionEntry<'services'>;
}

const { service } = Astro.props;
const { title, price, duration, icon, image } = service.data;
---

<div class="group relative bg-brand-cream/70 dark:bg-brand-mocha/50 rounded-xl md:rounded-2xl overflow-hidden border border-brand-copper/10 dark:border-brand-gold/10 transition-all duration-300 active:scale-[0.98] md:hover:-translate-y-2 md:hover:shadow-xl hover:shadow-brand-copper/20">
  <div class="aspect-[4/3] overflow-hidden relative">
    {image && (
      <img 
        src={image} 
        alt={`${title} - ${service.data.description}`}
        class="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    )}
    <div class="absolute inset-0 bg-gradient-to-t from-brand-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </div>
  
  <div class="p-4 md:p-6">
    <div class="flex items-start justify-between mb-2">
      <h3 class="text-lg md:text-xl font-display font-medium text-brand-charcoal dark:text-brand-cream">
        {title}
      </h3>
      {icon && (
        <iconify-icon 
          icon={icon} 
          class="text-brand-copper dark:text-brand-gold text-xl"
          width="24"
        />
      )}
    </div>
    
    <p class="text-xs md:text-sm text-brand-slate dark:text-brand-stoneDark line-clamp-2">
      {service.data.description}
    </p>
    
    <div class="flex items-center gap-3 mt-3">
      <span class="text-xl md:text-2xl font-display font-semibold bg-gradient-to-r from-brand-copper to-brand-terracotta bg-clip-text text-transparent dark:from-brand-gold dark:to-brand-champagne">
        {price}
      </span>
      <span class="text-xs md:text-sm text-brand-stone">{duration}</span>
    </div>
  </div>
</div>
```

**Step 2: Test build**

```bash
npm run build
```

Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/service/ServiceCard.astro
git commit -m "feat: create ServiceCard component"
```

---

## Task 11: Create Services Pages

**Files:**
- Create: `src/pages/services/index.astro`
- Create: `src/pages/services/[slug].astro`

**Step 1: Write services index page**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ServiceCard from '../../components/service/ServiceCard.astro';

const services = await getCollection('services');
---

<BaseLayout 
  title="Services | Hair@Home Winnipeg"
  description="Professional mobile hair services in Winnipeg. Haircuts, color, styling, and more at your convenience."
>
  <section class="py-16 md:py-24 bg-brand-vanilla/50 dark:bg-brand-espresso relative overflow-hidden min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="text-center mb-10 md:mb-16">
        <span class="text-sm font-medium text-brand-copper dark:text-brand-gold uppercase tracking-[0.15em] md:tracking-[0.2em]">
          Services
        </span>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-brand-charcoal dark:text-brand-cream mt-3 md:mt-4">
          What We Offer
        </h1>
        <p class="text-brand-slate dark:text-brand-stoneDark max-w-xl mx-auto mt-3 md:mt-4 text-sm md:text-base">
          Professional hair services for the whole family at straightforward prices.
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {services.map((service, index) => (
          <ServiceCard service={service} />
        ))}
      </div>
    </div>
  </section>
</BaseLayout>
```

**Step 2: Write service detail page**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export function getStaticPaths() {
  return (await getCollection('services')).map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
const { title, price, duration, description, icon } = entry.data;
---

<BaseLayout 
  title={title}
  description={description}
  type="article"
>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <article class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50 border border-zinc-300 dark:border-zinc-600 p-8 md:p-12">
      <header class="text-center mb-10">
        <div class="w-20 h-20 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 flex items-center justify-center text-zinc-900 dark:text-white text-2xl mx-auto mb-6">
          {icon && <iconify-icon icon={icon} width={32} />}
        </div>
        <h1 class="text-3xl md:text-4xl font-medium tracking-tight text-zinc-900 dark:text-white mb-4">
          {title}
        </h1>
        <div class="text-2xl font-medium text-zinc-900 dark:text-white mb-3">
          {price}
        </div>
        <p class="text-lg text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto">
          {description}
        </p>
        <div class="flex items-center justify-center gap-2 text-zinc-600 dark:text-zinc-400 mt-2">
          <iconify-icon icon="lucide:clock" width={16} />
          <span>{duration}</span>
        </div>
      </header>

      <div class="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300">
        <Content />
      </div>

      <div class="mt-12 text-center">
        <a 
          href="tel:+12045572287" 
          class="inline-flex justify-center items-center px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all text-base font-medium shadow-lg shadow-zinc-900/10 dark:shadow-white/10"
        >
          <iconify-icon icon="lucide:phone" class="mr-2" width={20} />
          Book This Service
        </a>
      </div>
    </article>

    <!-- Back to Services -->
    <div class="mt-8 text-center">
      <a 
        href="/services/" 
        class="inline-flex items-center text-brand-copper dark:text-brand-gold hover:underline"
      >
        <iconify-icon icon="lucide:arrow-left" class="mr-2" width={16} />
        Back to Services
      </a>
    </div>
  </div>

  <!-- Service Schema -->
  <script type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": title,
    "description": description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Hair@Home",
      "telephone": "(204) 557-2287",
      "email": "info@hairathome.ca",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Winnipeg",
        "addressRegion": "MB",
        "addressCountry": "CA"
      },
      "areaServed": "Winnipeg"
    },
    "areaServed": {
      "@type": "City",
      "name": "Winnipeg"
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "CAD",
      "availability": "https://schema.org/InStock"
    }
  })} />
</BaseLayout>

<style>
  :global(article h2) {
    @apply text-2xl font-display font-medium text-zinc-900 dark:text-white mt-8 mb-4;
  }
  :global(article h3) {
    @apply text-xl font-display font-medium text-zinc-900 dark:text-white mt-6 mb-3;
  }
  :global(article p) {
    @apply mb-4 leading-relaxed;
  }
  :global(article ul) {
    @apply mb-4 list-disc pl-6 space-y-2;
  }
  :global(article strong) {
    @apply font-semibold text-brand-copper dark:text-brand-gold;
  }
</style>
```

**Step 3: Verify routes work**

```bash
npm run build
ls dist/services/
```

Expected: index.html and one .html per service

**Step 4: Commit**

```bash
git add src/pages/services/
git commit -m "feat: create services listing and detail pages"
```

---

## Task 12: Create Homepage

**Files:**
- Create: `src/pages/index.astro`

**Step 1: Write homepage (sections: hero, services preview, about, gallery, contact)**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import ServiceCard from '../components/service/ServiceCard.astro';

const services = await getCollection('services');
const galleryImages = [
  '/images/movie-frames-enhanced/frame-0026-enhanced.jpg',
  '/images/movie-frames-enhanced/frame-0033-enhanced.jpg',
  '/images/movie-frames-enhanced/frame-0025-enhanced.jpg',
  '/images/movie-frames-enhanced/frame-0028-enhanced.jpg',
  '/images/movie-frames-enhanced/frame-0027-enhanced.jpg',
];
---

<BaseLayout 
  title="Mobile Hair Stylist Winnipeg | Hair@Home - At-Home Haircuts & Color"
  description="Professional mobile hair stylist in Winnipeg, MB. Quality haircuts, color & styling at your convenience. Serving all areas. Book today: (204) 557-2287"
>
  {services.slice(0, 3).map((service, index) => (
    <section id={(index === 0) ? 'about' : (index === 1) ? 'services' : 'contact'} class="relative min-h-screen flex items-center pt-20 pb-12 md:pt-24 md:pb-16 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-brand-cream via-brand-vanilla to-brand-sand/40 dark:from-brand-espresso dark:via-brand-mocha dark:to-brand-cocoa/30" />
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div class="text-center">
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-brand-charcoal dark:text-brand-cream">
            {service.data.title}
          </h2>
          <p class="text-brand-slate dark:text-brand-stoneDark mt-4 max-w-2xl mx-auto">
            {service.data.description}
          </p>
          <div class="text-2xl font-display font-semibold bg-gradient-to-r from-brand-copper to-brand-terracotta bg-clip-text text-transparent mt-4">
            {service.data.price}
          </div>
        </div>
      </div>
    </section>
  ))}

  <!-- Services Grid -->
  <section id="services-full" class="py-16 md:py-24 bg-brand-vanilla/50 dark:bg-brand-espresso">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="text-center mb-10 md:mb-16">
        <span class="text-sm font-medium text-brand-copper dark:text-brand-gold uppercase tracking-[0.15em]">
          Services
        </span>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-brand-charcoal dark:text-brand-cream mt-4">
          What We Offer
        </h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {services.map((service) => (
          <ServiceCard service={service} />
        ))}
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section id="contact" class="py-16 md:py-24 bg-brand-sand/50 dark:bg-brand-espresso">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
      <span class="text-sm font-medium text-brand-copper dark:text-brand-gold uppercase tracking-[0.15em]">
        Contact
      </span>
      <h2 class="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-brand-charcoal dark:text-brand-cream mt-4 mb-4">
        Ready to book?
      </h2>
      <p class="text-brand-slate dark:text-brand-stoneDark mb-8">
        Call or text to schedule your appointment.
      </p>
      <div class="grid sm:grid-cols-2 gap-4">
        <a 
          href="tel:+12045572287" 
          class="inline-flex justify-center items-center px-8 py-4 bg-brand-honey dark:bg-brand-gold text-brand-cream dark:text-brand-espresso rounded-xl font-medium shadow-lg"
        >
          <iconify-icon icon="lucide:phone" class="mr-2" width={20} />
          (204) 557-2287
        </a>
        <a 
          href="https://wa.me/12045572287" 
          target="_blank"
          class="inline-flex justify-center items-center px-8 py-4 border-2 border-brand-copper/30 dark:border-brand-gold/30 text-brand-charcoal dark:text-brand-cream rounded-xl font-medium"
        >
          <iconify-icon icon="lucide:message-circle" class="mr-2" width={20} />
          WhatsApp
        </a>
      </div>
    </div>
  </section>
</BaseLayout>
```

**Step 2: Test homepage**

```bash
npm run dev
```

Expected: Homepage loads with all sections

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: create homepage with hero, services, and contact sections"
```

---

## Task 13: Create About, FAQ, Booking Pages

**Files:**
- Create: `src/content/pages/about.md`
- Create: `src/content/pages/faq.md`
- Create: `src/content/pages/booking.md`
- Create: `src/pages/about.md`
- Create: `src/pages/faq.md`
- Create: `src/pages/booking.md`

**Step 1: Create page content files**

```bash
# Copy content from Hugo to Astro pages collection
# Adjust frontmatter to match pages schema
```

**Step 2: Create page routes**

```astro
---
// src/pages/about.astro
import { getEntry } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';

const entry = await getEntry('pages', 'about');
const { Content } = await entry.render();
---

<BaseLayout title={entry.data.title}>
  <section class="py-16 md:py-24">
    <div class="max-w-4xl mx-auto px-6">
      <article class="prose prose-zinc dark:prose-invert mx-auto">
        <Content />
      </article>
    </div>
  </section>
</BaseLayout>
```

Similar structure for `faq.astro` and `booking.astro`.

**Step 3: Commit**

```bash
git add src/content/pages/ src/pages/about.astro src/pages/faq.astro src/pages/booking.astro
git commit -m "feat: create about, FAQ, and booking pages"
```

---

## Task 14: Setup Playwright Tests

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/basic.spec.ts`

**Step 1: Install Playwright**

```bash
npx playwright install --with-deps
```

**Step 2: Create playwright.config.ts**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Step 3: Create basic test**

```typescript
// tests/basic.spec.ts
import { expect, test } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Hair@Home');
});

test('dark mode toggle works', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('#theme-toggle');
  await toggle.click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await toggle.click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});

test('navigation works', async ({ page }) => {
  await page.goto('/');
  await page.click('a[href="#services"]');
  await expect(page.locator('#services')).toBeInViewport();
});

test('service pages load', async ({ page }) => {
  await page.goto('/services/');
  await expect(page.locator('h1')).toContainText('What We Offer');
  
  await page.click('a[href="/services/haircut/"]');
  await expect(page.locator('h1')).toContainText('Haircuts');
});

test('mobile menu works', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  const menuBtn = page.locator('#mobile-menu-btn');
  await menuBtn.click();
  
  const menu = page.locator('#mobile-menu');
  await expect(menu).toBeVisible();
});
```

**Step 4: Run tests**

```bash
npm run test
```

Expected: All tests pass

**Step 5: Commit**

```bash
git add playwright.config.ts tests/
git commit -m "test: add Playwright E2E tests"
```

---

## Task 15: Create GitHub Actions CI/CD

**Files:**
- Create: `.github/workflows/astro-ci.yml`

**Step 1: Create CI workflow**

```yaml
name: Astro CI

on:
  push:
    branches: [main, 'feature/astro-migration']
  pull_request:
    branches: [main]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx astro check

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Upload build
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run tests
        run: npm run test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/

  deploy:
    needs: build-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/feature/astro-migration' && github.event_name == 'push'
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          destination_dir: ./astro-preview
```

**Step 2: Verify workflow syntax**

```bash
# Validate YAML (if yamllint available)
yamllint .github/workflows/astro-ci.yml
```

**Step 3: Commit**

```bash
git add .github/workflows/astro-ci.yml
git commit -m "ci: add GitHub Actions workflow for Astro"
```

---

## Task 16: Final Validation & Testing

**Step 1: Run full build**

```bash
npm run build
```

Expected: Clean build, no errors

**Step 2: Run tests**

```bash
npm run test
```

Expected: All tests pass

**Step 3: Run linter**

```bash
npm run lint
```

Expected: No lint errors

**Step 4: Manual testing checklist**

```bash
npm run dev
```

Test in browser:
- [ ] Homepage loads correctly
- [ ] All service pages load
- [ ] Dark mode toggle works and persists
- [ ] Mobile menu works
- [ ] All images load
- [ ] Links work correctly
- [ ] Scroll animations work

**Step 5: Run Lighthouse**

```bash
npm run build
npm run preview
# Open Chrome DevTools → Lighthouse on localhost:4321
```

Expected: Performance >90, Accessibility >90, Best Practices >90

**Step 6: Final commit**

```bash
git add .
git commit -m "feat: complete Hugo to Astro migration

- Migrate all content to Astro collections
- Create responsive components with Tailwind
- Add dark mode with View Transitions
- Implement E2E tests with Playwright
- Setup CI/CD with GitHub Actions"
```

**Step 7: Push and verify**

```bash
git push origin feature/astro-migration
```

Expected: CI passes, preview deploys

---

## Task 17: Merge to Main (After validation)

**Step 1: Create PR**

```bash
gh pr create --title "feat: migrate from Hugo to Astro" --body "See docs/plans/2026-03-13-astro-migration-design.md for design details."
```

**Step 2: After approval, merge**

```bash
git checkout main
git merge feature/astro-migration
git push origin main
```

**Step 3: Clean up Hugo files (optional, after verification)**

```bash
# Remove Hugo-specific files after Astro is verified working
git rm -r themes/ hugo.toml input.css postcss.config.*
git commit -m "chore: remove Hugo files after Astro migration"
```

---

## Migration Complete! 🎉

**Post-Migration Tasks:**
1. Monitor GitHub Pages deployment
2. Check all URLs work (may need redirects)
3. Update any hardcoded references to Hugo
4. Update documentation (CLAUDE.md, README.md)
5. Remove old Hugo theme directory if no longer needed
