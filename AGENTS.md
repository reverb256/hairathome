# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-07
**Commit:** main
**Branch:** main

## OVERVIEW
Hair@Home - Simple Hugo static site for Winnipeg-based mobile hair stylist service. Basic online business card with essential information.

## STRUCTURE
```
hairathome/
├── content/    # Hugo markdown content
├── static/     # CSS, JS, images, assets
├── themes/     # Custom Hugo theme
├── tests/      # Playwright E2E tests
├── config/     # Security policies
└── .github/    # CI/CD workflows
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| **Main Site** | `content/` + `themes/` | Hugo content and templates |
| **Styling** | `static/css/` | Simple CSS styling |
| **Testing** | `tests/` | Basic browser tests |
| **Deployment** | `.github/workflows/` | GitHub Pages deployment |
| **Assets** | `static/images/` | Basic business images |
| **Config** | `hugo.toml` | Site configuration |
| **Scripts** | `package.json` | Build and dev commands |

## CODE MAP

| Symbol | Type | Location | Refs | Role |
|--------|------|----------|------|------|
| Hugo | Static Generator | `hugo.toml` | 50+ | Site generation |
| CSS | Styling | `static/css/` | 20+ | Visual styling |
| Service Worker | PWA | `static/sw.js` | 5+ | Basic offline support |

## CONVENTIONS

- **Hugo Structure**: Standard Hugo pattern with custom theme
- **Simple Design**: Clean, professional appearance
- **Basic Performance**: Standard optimizations
- **Simple Testing**: Basic browser compatibility
- **Deployment**: GitHub Pages with automated build

## ANTI-PATTERNS (THIS PROJECT)

- **NO** custom JavaScript frameworks
- **NO** heavy dependencies  
- **NO** inline styles
- **NO** external APIs
- **NO** dynamic content generation
- 
## UNIQUE STYLES
- **Vibrant color palette** (indigo → cyan → amber gradients)
- **Modern gradient effects** with multi-hue transitions
- **Elegant animations** and hover states
- **Professional typography** with Inter font pairing
- **Mobile-first responsive** design with breakpoint optimization
- **Dark mode support** with complete theme variants
- **Accessibility-first** semantic HTML and ARIA support
- **Performance optimized** with lazy loading and minification
- **Modern development environment** using Nix flakes for reproducibility

## DEVELOPMENT STACK
- **Hugo 0.154.2** - Static site generator
- **Node.js 20 LTS** - JavaScript runtime
- **Nix Flakes** - Reproducible development environment
- **Playwright** - E2E testing framework
- **Lighthouse** - Performance testing
- **VS Code** - LSP integration with debug configs
- **Automated testing** - Comprehensive test suite
- **GitHub Actions** - CI/CD deployment

## COMMANDS
```bash
npm run serve              # Development server with livereload
npm run build              # Production build with minification  
npm run test               # Comprehensive browser tests
nix develop                 # Enter reproducible shell
nix run .#serve           # Start dev server via Nix
nix run .#build            # Build production site via Nix
```

## PROJECT STATUS
- ✅ **NIX DEVELOPMENT ENVIRONMENT**: Fully configured with flake.nix
- ✅ **VIBRANT COLOR SCHEME**: Implemented with multi-hue gradients
- ✅ **PLAYWRIGHT TESTING**: Set up for autonomous AI development
- ✅ **COMPREHENSIVE TESTING**: Full test suite with validation
- ✅ **PERFORMANCE OPTIMIZED**: Fast loading and Core Web Vitals compliance
- ✅ **ACCESSIBILITY READY**: WCAG 2.1 AA compliant
- ✅ **DEPLOYMENT READY**: GitHub Pages with automated CI/CD

## COMMANDS

```bash
npm run serve     # Development server
npm run build     # Production build
npm run test      # Basic browser tests
```

## NOTES

- Generated site deployed to `/docs` for GitHub Pages
- Simple static site with minimal complexity
- Basic business card functionality
- Clean, professional appearance