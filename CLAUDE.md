# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Hair@Home** is a Hugo-based static website for a mobile hair stylist service in Winnipeg, MB. The site uses a custom Hugo theme with Tailwind CSS styling and integrates AI-generated images via ComfyUI workflows.

- **Static Site Generator**: Hugo (output to `docs/`)
- **Deployment**: GitHub Pages (automatic on push to `main`)
- **Theme**: Custom theme at `themes/hairathome/`
- **Styling**: Tailwind CSS 4.x with PostCSS
- **Image Generation**: ComfyUI workflows for AI-generated service images

## Development Commands

### Standard Development (npm)
```bash
npm run dev       # Build CSS and start dev server at localhost:1313
npm run serve     # Hugo dev server only (localhost:1313)
npm run build     # Production build with CSS minification → docs/
```

### Nix Development Environment
```bash
nix develop       # Enter reproducible dev shell
# Inside the shell:
build             # Build Hugo site with minification
serve             # Start Hugo dev server
optimize          # Optimize PNG/JPG images
convert           # Convert images to WebP
generate          # AI image generation helper
check-links       # Check for broken links
```

## Architecture

### Hugo Structure
- `content/` - Markdown content files (pages, services, gallery items)
- `themes/hairathome/layouts/` - Hugo templates
  - `layouts/_default/baseof.html` - Base template with dark mode support
  - `layouts/partials/` - Reusable header/footer components
  - `layouts/services/` - Service-specific templates
  - `layouts/gallery/` - Gallery templates
- `static/` - Static assets (CSS, JS, images)
- `docs/` - Built site (deployed to GitHub Pages)
- `publishDir = "docs"` in hugo.toml

### CSS Pipeline
1. Source: `input.css` (contains `@tailwind base;`)
2. Build: `npm run build:css` runs PostCSS with Tailwind
3. Output: `static/css/main.css` (minified)
4. Tailwind scans: `themes/hairathome/layouts/**/*.html`

### Theme Customization
The custom theme uses:
- **Brand colors** defined in `tailwind.config.js` (cream, vanilla, sand, copper, terracotta, honey, charcoal, etc.)
- **Custom animations**: float, pulse-soft, slide-up, fade-in, underglow
- **Dark mode**: Class-based (`darkMode: 'class'`)
- **Fonts**: Playfair Display (headings), Inter (body)

### Content Organization
- `content/services/_index.md` - Services landing page
- `content/services/*.md` - Individual service pages (haircut, color, blowout, beard, treatments, special-occasion)
- `content/gallery/_index.md` - Gallery landing
- `content/gallery/*.md` - Individual gallery items (transformations)
- `content/about.md`, `content/faq.md`, `content/booking.md` - Standard pages

### Image Workflows
AI-generated images use ComfyUI via MCP tools or shell scripts:

**Scripts:**
- `scripts/nix-image-workflow.sh` - Main Nix-integrated workflow
- `scripts/batch_generate_realistic.sh` - Batch realistic hair images
- `scripts/generate_service_illustrations.sh` - Service illustrations
- `scripts/submit_workflows.sh` - Submit ComfyUI workflows
- `scripts/download_huggingface.sh` / `scripts/download_civitai.sh` - Model management

**Workflow Files:**
- `scripts/realistic_workflow.json` - Juggernaut XL realistic workflow
- `scripts/hassaku_workflow.json` - Hassaku illustration workflow
- `scripts/flux2_workflow.json` - Flux.2 workflow

**Prompts:** Stored in `docs/IMPROVED_SERVICE_PROMPTS.md`

**Image Output:**
- `static/images/stock/` - Generated images
- `static/images/webp/` - WebP conversions
- `static/images/services/` - Service-specific images
- `static/images/gallery/` - Gallery transformation images

### Nix Integration
- `flake.nix` defines reproducible development environment
- Environment variables: `COMFYUI_HOST` (default: http://127.0.0.1:8188)
- Packages: Hugo, Python 3.14 + Pillow, libwebp, image_optim, upscayl, ffmpeg, jq, curl, nodejs

## Common Tasks

### Adding a New Service Page
1. Create `content/services/new-service.md`
2. Add frontmatter with title, description, images
3. Add corresponding image to `static/images/services/`
4. Theme's `services/single.html` template will render it

### Adding Gallery Items
1. Create `content/gallery/transformation-name.md`
2. Add frontmatter with title, before/after images
3. Theme's `gallery/list.html` displays as grid

### Modifying Styles
1. Edit `tailwind.config.js` for theme changes (colors, fonts, animations)
2. Edit `input.css` for custom CSS
3. Run `npm run build:css` to recompile

### Generating AI Images
Option 1 - Using ComfyUI MCP tools (recommended):
```bash
# ComfyUI must be running at http://127.0.0.1:8188
# Use the MCP tools directly (enqueue_workflow, etc.)
```

Option 2 - Using Nix script:
```bash
nix develop
./scripts/nix-image-workflow.sh all 1024x1024    # All services, square
./scripts/nix-image-workflow.sh all 1920x1080    # All services, hero
./scripts/nix-image-workflow.sh generate haircut color  # Specific services
```

### Image Optimization
```bash
# Convert to WebP
nix run .#convert

# Or use the script
./scripts/nix-image-workflow.sh optimize
```

## Important Details

### Build Output
- Hugo builds to `docs/` directory (configured in `hugo.toml`)
- `docs/` is deployed to GitHub Pages
- Do NOT edit files in `docs/` directly - they're generated

### Contact Info (for content)
- Phone: (204) 557-2287
- Email: info@hairathome.ca
- Location: Winnipeg, MB

### ComfyUI Setup
- Default host: `http://127.0.0.1:8188`
- Models: Juggernaut XL, Hassaku, Flux.2
- Prompts: `docs/IMPROVED_SERVICE_PROMPTS.md`

### Deployment
Push to `main` branch triggers GitHub Pages deployment automatically.

## Theme Architecture Notes

The Hugo theme uses a block system in `baseof.html`:
- `{{ block "main" . }}{{ end }}` - Main content area
- Partials: `header.html`, `footer.html`
- Each content type can have its own template (e.g., `services/single.html`)

Dark mode is implemented with:
- `<html>` class-based switching
- Tailwind `darkMode: 'class'`
- Meta theme-color for light/dark preferences
