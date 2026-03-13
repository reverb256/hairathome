# Hugo to Astro Migration Design

**Date:** 2026-03-13  
**Status:** Approved  
**Author:** Claude Code  

## Overview

Migrate Hair@Home from Hugo to Astro using Content Collections, Tailwind CSS, and preserving the existing visual design while adding Astro-native enhancements (View Transitions, Image optimization).

**Motivation:**
- Better developer experience with TypeScript and component-based architecture
- Improved performance with Astro's image optimization
- Team familiarity with React/Astro ecosystem
- Future-proof for adding dynamic features (booking system, admin panel)

## Migration Approach

**Strategy:** Parallel migration — keep Hugo working while building Astro version

1. Create new Astro project alongside existing Hugo site
2. Copy `static/` → `public/` for images
3. Convert content markdown with adjusted frontmatter
4. Build components matching Hugo templates
5. Add View Transitions for smooth navigation
6. Deploy preview branch, validate, then switch main

## Project Structure

```
astro-hairathome/
├── src/
│   ├── content/
│   │   ├── config.ts           # Collection schemas (Zod)
│   │   ├── services/           # Markdown with frontmatter
│   │   ├── gallery/            # Markdown with frontmatter
│   │   └── pages/              # About, FAQ, Booking
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── Layout.astro
│   │   ├── service/
│   │   │   └── ServiceCard.astro
│   │   ├── gallery/
│   │   │   └── GalleryGrid.astro
│   │   └── ui/                 # Reusable UI components
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── services/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── gallery/
│   ├── styles/
│   │   └── global.css
│   └── env.d.ts
├── public/
│   └── images/                 # Copy from Hugo static/images/
├── astro.config.ts
├── tailwind.config.mjs
└── package.json
```

## Content Collections & Schemas

### Collection Definitions (src/content/config.ts)

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
    beforeImage: z.string(),
    afterImage: z.string().optional(),
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

### Frontmatter Migration

```yaml
# Hugo (old)
---
title: "Mobile Haircuts"
icon: "fas fa-scissors"
price: "$20-30"
---

# Astro (new)
---
title: "Mobile Haircuts"
icon: "lucide:scissors"
price: "$20-30"
duration: "30 mins"
description: "Professional mobile haircuts..."
slug: "haircut"
---
```

**Note:** Icon names change from `fas fa-*` to `lucide:*` for consistency.

## Styling Configuration

### Astro Config (astro.config.ts)

```typescript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://reverb256.github.io/hairathome/',
  integrations: [tailwind(), react(), sitemap()],
  output: 'static',
  build: { format: 'directory' }, // /about/index.html
});
```

### Global Styles (src/styles/global.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@theme {
  --color-brand-cream: #FBF8F3;
  --color-brand-copper: #D97742;
  --color-brand-honey: #F5D061;
  --color-brand-charcoal: #2D2520;
  --color-brand-espresso: #2D2520;
  --color-brand-vanilla: #F5E6D3;
  --color-brand-sand: #E8D4C0;
  --color-brand-terracotta: #C16650;
  --color-brand-mocha: #8B6B78;
}

/* Dark mode with View Transitions */
@view-transition {
  navigation: auto;
}

html.dark {
  color-scheme: dark;
}

html:not(.dark) {
  color-scheme: light;
}
```

## Component Architecture

### BaseLayout Pattern

```astro
---
interface Props {
  title: string;
  description?: string;
  image?: string;
}
const { title, description, image } = Astro.props;
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
import DarkModeToggle from '../components/ui/DarkModeToggle.astro';
import '../styles/global.css';
---
<!DOCTYPE html>
<html lang="en-ca" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title} | Hair@Home</title>
    <meta name="description" content={description} />
    <!-- Open Graph, Twitter Card, Schema.org -->
  </head>
  <body class="bg-brand-cream dark:bg-brand-espresso">
    <Header />
    <main id="main-content"><slot /></main>
    <Footer />
    <DarkModeToggle />
    <ViewTransitions />
  </body>
</html>
```

### Dynamic Route Pattern

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const services = await getCollection('services');
  return services.map(entry => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---
<BaseLayout title={entry.data.title}>
  <article>
    <h1>{entry.data.title}</h1>
    <p class="text-2xl">{entry.data.price}</p>
    <Content />
  </article>
</BaseLayout>
```

## Testing & Validation

### Validation Checklist

1. ✅ All pages render (home, services, gallery, about, faq, booking)
2. ✅ Dark mode toggle works and persists
3. ✅ View Transitions smooth navigation
4. ✅ All images load and are optimized
5. ✅ Mobile responsive (test breakpoints)
6. ✅ Schema.org markup present
7. ✅ Sitemap generated
8. ✅ Open Graph tags correct
9. ✅ Playwright tests pass
10. ✅ Lighthouse score >90

### Commands

```bash
npm run dev          # Dev server at localhost:4321
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Playwright E2E
npm run lint         # Biome lint & format check
```

## CI/CD Pipeline

```yaml
# .github/workflows/astro-ci.yml
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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build       # Astro build
      - run: npm run test         # Playwright E2E
      - run: npm run lint         # Biome lint

  deploy-preview:
    if: github.event_name == 'pull_request'
    # Comment PR with preview URL

  deploy-production:
    if: github.ref == 'refs/heads/main'
    # Push to docs/ for GitHub Pages
```

## Deployment

**Target:** GitHub Pages (unchanged)  
**Branch:** `feature/astro-migration` → `main` after validation  
**Output Directory:** `dist/` → `docs/` via GitHub Action

## Next Steps

After this design is approved, proceed to:
1. Create implementation plan with detailed steps
2. Set up Astro project
3. Migrate content
4. Build components
5. Test and validate
6. Deploy and switch main branch
