# CONTENT DIRECTORY KNOWLEDGE BASE

**Generated:** 2026-01-07
**Branch:** main

## OVERVIEW
Hugo markdown content directory containing all page content, service descriptions, and gallery items for the Hair@Home mobile hair styling service.

## STRUCTURE
```
content/
├── services/           # Individual service pages
├── gallery/           # Before/after transformation images
├── about.md           # Business overview
├── booking.md         # Appointment scheduling
├── faq.md            # Common questions
└── _index.md         # Home page content
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| **Service Pages** | `services/*.md` | Individual service descriptions |
| **Gallery Content** | `gallery/*.md` | Before/after transformation images |
| **Main Pages** | `about.md`, `booking.md`, `faq.md` | Core business pages |
| **Home Page** | `_index.md` | Landing page content |
| **Service Metadata** | Front matter in service files | Pricing, duration, icons |

## CODE MAP

| File | Type | Purpose | Key Fields |
|------|------|---------|------------|
| `services/haircut-style.md` | Service | Haircut & styling | price, duration, icon |
| `services/wash-blowout.md` | Service | Wash & blowout | price, duration, icon |
| `services/color-services.md` | Service | Hair coloring | price, duration, icon |
| `services/special-occasion.md` | Service | Event styling | price, duration, icon |
| `gallery/*.md` | Gallery | Transformation images | image, description, tags |
| `about.md` | Page | Business story | text, credentials |
| `booking.md` | Page | Appointment process | steps, policies |

## CONVENTIONS

- **Front Matter Required**: All files must have YAML front matter with metadata
- **Service Pricing**: Use consistent currency format ($35 - $70)
- **Image Optimization**: Gallery images must be in `/static/images/gallery/`
- **Service Duration**: Use "30-45 minutes" format
- **SEO Fields**: Include meta descriptions for all pages
- **Accessibility**: Alt text required for all images

## ANTI-PATTERNS (THIS PROJECT)

- **NO** hardcoded URLs - use Hugo relative links
- **NO** duplicate service descriptions
- **NO** unoptimized images in content directory
- **NO** inconsistent pricing formats
- **NO** missing front matter metadata

## UNIQUE STYLES

- **Service Descriptions**: Professional yet approachable tone
- **Price Transparency**: Clear pricing ranges for each service
- **Location Coverage**: Winnipeg-area service boundaries
- **Before/After**: Transformation-focused gallery content
- **Mobile-Friendly**: Content optimized for mobile viewing

## COMMANDS

```bash
npm run serve     # Preview content changes
hugo list all     # List all content files
```

## NOTES

- Content supports markdown with Hugo shortcodes
- Front matter includes SEO metadata and service details
- Gallery images processed through Hugo image pipeline
- Content automatically deployed to GitHub Pages