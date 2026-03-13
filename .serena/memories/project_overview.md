# Hair@Home Project Overview

## Purpose
Hair@Home is a Hugo-based static website for a mobile hair stylist service in Winnipeg, MB, Canada. The site showcases services, pricing, gallery transformations, and booking information for at-home hair styling services.

## Tech Stack
- **Static Site Generator**: Hugo (extended)
- **Styling**: Tailwind CSS 4.x with PostCSS
- **Theme**: Custom Hugo theme (`themes/hairathome/`)
- **Package Management**: npm (for CSS tooling) + Nix (reproducible dev environment)
- **Deployment**: GitHub Pages (auto-deploys from `docs/` on push to `main`)
- **Image Generation**: ComfyUI workflows for AI-generated service images
- **Testing**: Playwright (for E2E testing)

## Key Information
- **Contact**: (204) 557-2287 | info@hairathome.ca
- **Location**: Winnipeg, MB, Canada
- **Base URL**: https://reverb256.github.io/hairathome/
- **Build Output**: `docs/` directory (not to be edited directly)
- **PublishDir Config**: `publishDir = "docs"` in hugo.toml

## Project Type
This is a **content-focused static site** - not a traditional web application. Changes primarily involve:
- Content editing (Markdown files in `content/`)
- Theme/template updates (HTML in `themes/hairathome/layouts/`)
- Styling changes (Tailwind config and CSS)
- Image optimization and AI image generation
