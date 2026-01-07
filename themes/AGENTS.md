# THEMES DIRECTORY KNOWLEDGE BASE

**Generated:** 2026-01-07
**Branch:** main

## OVERVIEW
Custom Hugo theme directory containing layouts, templates, and theme configuration for the Hair@Home beauty industry website.

## STRUCTURE
```
themes/hairathome/
├── layouts/         # Hugo template files
├── archetypes/      # Content type templates
├── theme.toml       # Theme configuration
└── static/          # Theme-specific assets
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| **Main Templates** | `layouts/_default/` | Base page layouts |
| **Service Pages** | `layouts/services/` | Service-specific templates |
| **Gallery** | `layouts/gallery/` | Image gallery layouts |
| **Partials** | `layouts/partials/` | Reusable components |
| **Theme Config** | `theme.toml` | Theme metadata and settings |

## CODE MAP

| File | Type | Purpose | Key Features |
|------|------|---------|-------------|
| `layouts/_default/baseof.html` | Template | Base HTML structure | Tailwind, SEO, PWA |
| `layouts/_default/single.html` | Template | Content pages | Front matter, metadata |
| `layouts/_default/list.html` | Template | Service lists | Grid layout, filtering |
| `layouts/partials/head.html` | Partial | Head section | Meta tags, structured data |
| `layouts/partials/header.html` | Partial | Navigation | Mobile menu, booking CTA |
| `layouts/partials/footer.html` | Partial | Footer | Contact, social, policies |

## CONVENTIONS

- **Hugo Standards**: Follow Hugo template best practices
- **Beauty Industry**: Professional, elegant design language
- **Mobile-First**: Responsive templates for all screen sizes
- **Performance**: Minimal JavaScript, optimized CSS
- **Accessibility**: Semantic HTML, ARIA labels
- **SEO**: Structured data, meta tags, Open Graph

## ANTI-PATTERNS (THIS PROJECT)

- **NO** hardcoded content in templates
- **NO** inline styles or JavaScript
- **NO** complex template logic
- **NO** missing accessibility attributes
- **NO** broken Hugo shortcodes

## UNIQUE STYLES

- **Beauty Theme**: Champagne golds, sophisticated typography
- **Hair Industry**: Service-focused page layouts
- **Mobile Stylist**: Field-friendly interface design
- **Gallery Integration**: Professional before/after displays
- **Booking Flow**: Streamlined appointment process

## COMMANDS

```bash
npm run serve     # Preview theme changes
hugo list all     # Validate template syntax
```

## NOTES

- Templates use Hugo's built-in functions and shortcodes
- Theme supports multiple content types (services, gallery, pages)
- All templates optimized for mobile devices
- Accessibility and SEO built into template structure