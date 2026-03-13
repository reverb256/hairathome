# Suggested Commands for Hair@Home Development

## Development (npm - recommended)
```bash
npm run dev       # Build CSS and start Hugo dev server at localhost:1313
npm run serve     # Hugo dev server only (localhost:1313)
npm run build     # Production build with CSS minification → docs/
npm run build:css # Build CSS only (PostCSS + Tailwind)
npm run optimize  # Run image optimization script
```

## Development (Nix - reproducible environment)
```bash
nix develop       # Enter dev shell with all tools
build             # Build Hugo site with minification
serve             # Start Hugo dev server
optimize          # Optimize PNG/JPG images
convert           # Convert images to WebP
generate          # AI image generation helper
check-links       # Check for broken links
```

## Hugo Commands (when in dev shell)
```bash
hugo server -D --bind 0.0.0.0        # Start dev server
hugo --minify                         # Production build
hugo new content/services/new.md     # Create new content
```

## Git Commands (Linux/NixOS)
```bash
git status         # Check working tree status
git add .          # Stage changes
git commit -m "..." # Create commit
git push           # Push to remote
```

## Utility Commands
```bash
ls -la             # List all files (including hidden)
cd <dir>           # Change directory
grep -r "pattern"  # Search in files
find . -name "*.md" # Find markdown files
```

## Image Generation (ComfyUI)
```bash
# From scripts directory:
./nix-image-workflow.sh all 1024x1024    # All services, square
./nix-image-workflow.sh all 1920x1080    # All services, hero
./nix-image-workflow.sh generate haircut color  # Specific services
```

## Testing
```bash
npx playwright test    # Run Playwright E2E tests
```
