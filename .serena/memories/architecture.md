# Architecture - Hair@Home

## Directory Structure

```
hairathome/
├── content/                    # Markdown content files
│   ├── services/              # Individual service pages
│   │   ├── haircut.md
│   │   ├── color.md
│   │   └── ...
│   ├── gallery/               # Transformation gallery items
│   ├── about.md               # About page
│   ├── faq.md                 # FAQ page
│   └── booking.md             # Booking information
├── themes/hairathome/         # Custom Hugo theme
│   ├── layouts/               # HTML templates
│   │   ├── _default/          # Default templates
│   │   │   └── baseof.html    # Base template with <html>, <head>
│   │   ├── partials/          # Reusable components
│   │   │   ├── header.html
│   │   │   └── footer.html
│   │   ├── services/          # Service-specific templates
│   │   ├── gallery/           # Gallery templates
│   │   └── index.html         # Homepage
│   └── assets/                # Theme assets
├── static/                    # Static assets (served as-is)
│   ├── css/                   # Generated CSS
│   ├── js/                    # JavaScript files
│   ├── images/                # Images
│   │   ├── stock/             # AI-generated images
│   │   ├── services/          # Service-specific images
│   │   ├── gallery/           # Before/after images
│   │   ├── brand/             # Logo, brand assets
│   │   └── webp/              # WebP conversions
│   └── favicon.ico, manifest.json
├── scripts/                   # Utility scripts
│   ├── nix-image-workflow.sh  # Main image generation
│   ├── submit_workflows.sh    # Submit to ComfyUI
│   └── optimize-images.sh     # Image optimization
├── docs/                      # Built site (deployed to GitHub Pages)
├── flake.nix                  # Nix dev environment
├── hugo.toml                  # Hugo configuration
├── package.json               # npm dependencies
├── tailwind.config.js         # Tailwind configuration
└── input.css                  # CSS source (@tailwind base;)
```

## Hugo Template System

### Block System
- `baseof.html` defines the skeleton with `{{ block "main" . }}{{ end }}`
- Each content type can override the "main" block
- Partials are included with `{{ partial "name" . }}`

### Content Types & Templates
| Content Type | Template Location |
|--------------|-------------------|
| Home page | `layouts/index.html` |
| Services (list) | `layouts/services/list.html` or `_default/list.html` |
| Services (single) | `layouts/services/single.html` |
| Gallery (list) | `layouts/gallery/list.html` |
| Gallery (single) | `layouts/gallery/single.html` |

## CSS Pipeline
```
input.css → PostCSS → Tailwind → static/css/main.css
                                    ↓
                             minified (production)
```

## Image Generation Pipeline
```
Prompts (docs/IMPROVED_SERVICE_PROMPTS.md)
    ↓
ComfyUI Workflows (scripts/*.json)
    ↓
Python Scripts (scripts/submit_workflows.sh)
    ↓
ComfyUI API (http://127.0.0.1:8188)
    ↓
Output Images (static/images/stock/)
    ↓
Optimization (scripts/optimize-images.sh)
    ↓
WebP Conversion (nix run .#convert)
```

## Deployment Pipeline
```
git push to main
    ↓
GitHub Actions (if configured)
    ↓
Build: npm run build
    ↓
Output: docs/
    ↓
GitHub Pages
    ↓
https://reverb256.github.io/hairathome/
```

## Key Integration Points
- **ComfyUI**: Must be running at `http://127.0.0.1:8188` for image generation
- **GitHub Pages**: Serves from `docs/` directory
- **Tailwind CDN**: Used for rapid prototyping, but production uses built CSS
- **Dark Mode**: Class-based toggle, persisted in localStorage
