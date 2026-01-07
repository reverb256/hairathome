# STATIC ASSETS KNOWLEDGE BASE

**Generated:** 2026-01-07
**Branch:** main

## OVERVIEW
Static assets directory containing CSS, JavaScript, images, and other assets for the Hair@Home Hugo static site.

## STRUCTURE
```
static/
├── css/              # Stylesheets and CSS assets
├── js/              # JavaScript files
├── images/          # Optimized image assets
├── sw.js           # Service worker for PWA
└── robots.txt      # SEO crawler instructions
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| **Main Styles** | `css/style.css` | Tailwind with beauty theme |
| **Custom CSS** | `css/custom.css` | Beauty industry customizations |
| **JavaScript** | `js/` | Gallery, theme, and PWA logic |
| **Service Worker** | `sw.js` | Offline caching and PWA features |
| **Images** | `images/` | Optimized beauty industry imagery |
| **Icons** | `images/icons/` | Brand and social media icons |

## CODE MAP

| File | Type | Purpose | Size | Key Features |
|------|------|---------|------|-------------|
| `css/style.css` | CSS | Main stylesheet | 89KB | Tailwind, beauty theme |
| `css/custom.css` | CSS | Custom overrides | 4KB | Brand styling |
| `js/gallery.js` | JS | Lightbox gallery | 2KB | Image interactions |
| `js/theme.js` | JS | Theme switching | 1KB | Dark mode toggle |
| `sw.js` | JS | Service worker | 3KB | PWA functionality |
| `images/team/*.jpg` | Images | Team photos | 50-150KB | WebP + fallbacks |

## CONVENTIONS

- **Image Optimization**: All images optimized for web delivery
- **Format Support**: WebP with JPEG/PNG fallbacks
- **CSS Architecture**: Tailwind base + custom beauty theme
- **JavaScript**: Vanilla JS, no frameworks
- **Service Worker**: PWA offline support
- **File Naming**: kebab-case for all assets

## ANTI-PATTERNS (THIS PROJECT)

- **NO** large unoptimized images
- **NO** inline styles in HTML
- **NO** heavy JavaScript frameworks
- **NO** unversioned assets
- **NO** hardcoded image paths

## UNIQUE STYLES

- **Beauty Theme Colors**: Champagne, gold, rose palette
- **Professional Imagery**: High-quality hair styling photos
- **Mobile Optimization**: Touch-friendly interactions
- **Performance Focus**: Lazy loading, critical CSS
- **Accessibility**: Alt text, semantic structure

## COMMANDS

```bash
npm run optimize    # Optimize all images
npm run build       # Process CSS and JS
```

## NOTES

- CSS uses Tailwind with custom beauty industry theme
- Images processed through Hugo image pipeline
- Service worker provides offline functionality
- All assets minified for production