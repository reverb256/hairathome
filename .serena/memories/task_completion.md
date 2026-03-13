# Task Completion Checklist - Hair@Home

## After Making Code Changes

### 1. Build CSS (if styles changed)
```bash
npm run build:css
# or in Nix shell: postcss is included in build
```

### 2. Build Site
```bash
npm run build
# or in Nix shell: hugo --minify
```

### 3. Check Output
- Verify `docs/` directory contains updated files
- Check that CSS is minified in `docs/css/main.css`
- For images, ensure they're optimized if new ones were added

### 4. Test Locally
```bash
npm run dev    # Start dev server at localhost:1313
```
- Navigate to affected pages
- Test in both light and dark mode
- Check mobile responsiveness

### 5. Link Check (optional)
```bash
nix run .#check-links
```

### 6. Commit Changes
```bash
git add .
git commit -m "descriptive message"
git push
```

### 7. Verify Deployment
- GitHub Pages auto-deploys on push to `main`
- Check: https://reverb256.github.io/hairathome/

## Special Cases

### Content Changes Only
- No CSS rebuild needed
- Just `hugo --minify` or `npm run build`
- Check preview locally

### Theme/Template Changes
- Rebuild CSS if Tailwind classes were added
- Check responsive breakpoints
- Verify dark mode toggle
- Test accessibility (keyboard nav, screen readers)

### Image Changes
- Run optimization: `npm run optimize` or `nix run .#optimize`
- Consider WebP conversion: `nix run .#convert`
- Check page load impact

### Breaking Changes
- Consider creating a new branch first
- Test thoroughly before merging to main
- Update CLAUDE.md if architectural changes were made

## Common Issues
- **Tailwind classes not working**: Run `npm run build:css`
- **Changes not visible**: Clear browser cache or check `docs/` was rebuilt
- **Images not loading**: Check path relative to `static/` directory
- **Dark mode broken**: Verify `darkMode: 'class'` in tailwind.config.js
