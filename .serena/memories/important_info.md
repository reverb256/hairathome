# Important Information - Hair@Home

## Contact Information (for content)
- **Phone**: (204) 557-2287
- **Email**: info@hairathome.ca
- **Location**: Winnipeg, MB, Canada
- **Service Area**: All areas within Winnipeg (Downtown, St. Vital, St. Boniface, St. James, Charleswood, Transcona, etc.)

## Services (current)
- Haircut ($20-30)
- Color Services
- Blowout & Styling
- Beard Grooming
- Hair Treatments
- Special Occasion

## Key Technologies
- **Hugo**: Static site generator
- **Tailwind CSS 4.x**: Utility-first CSS framework
- **ComfyUI**: AI image generation
- **Nix**: Reproducible development environment

## Important Files
- `hugo.toml` - Hugo configuration (publishDir = "docs")
- `tailwind.config.js` - Brand colors, animations
- `CLAUDE.md` - Project-specific guidance
- `input.css` - CSS source (minimal - just @tailwind directives)

## Environment Variables
- `COMFYUI_HOST` - ComfyUI server URL (default: http://127.0.0.1:8188)
- `PROJECT_ROOT` - Auto-set to current directory in Nix shell

## Branches
- `main` - Production branch (auto-deploys to GitHub Pages)
- `feature/image-enhancement` - Current feature branch for image improvements

## Deployment
- Platform: GitHub Pages
- URL: https://reverb256.github.io/hairathome/
- Trigger: Push to `main` branch
- Output directory: `docs/`

## Design Principles
- Warm, earthy color palette (cream, copper, terracotta, honey)
- Professional but approachable tone
- Mobile-first responsive design
- Accessibility-first (skip links, semantic HTML, ARIA labels)
- Dark mode support with class-based toggle
