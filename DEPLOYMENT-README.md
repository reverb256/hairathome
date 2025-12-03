# Deployment Instructions

## GitHub Pages

The site is configured to deploy to GitHub Pages via the GitHub Actions workflow in `.github/workflows/gh-pages.yml`. The workflow will:

1. Build the Hugo site to the `docs/` directory
2. Add a `.nojekyll` file to prevent Jekyll processing
3. Deploy the contents to the `gh-pages` branch

To enable GitHub Pages on your repository:
1. Go to repository Settings
2. Navigate to "Pages" section
3. Select "Deploy from a branch"
4. Choose "gh-pages" branch and "/ (root)" folder
5. Click "Save"

## Cloudflare Pages

To deploy to Cloudflare Pages:

1. Create a new project in Cloudflare Pages dashboard
2. Connect to your GitHub repository
3. Set build configuration:
   - Build command: `npm run build`
   - Build output directory: `public`
   - Root directory: `.` (root)
4. Add environment variables if needed:
   - NODE_VERSION: `18`
   - HUGO_VERSION: `0.152.2`

The site will automatically rebuild on pushes to the main branch.

## Local Build

To build the site locally:
```bash
npm run build
```

This will create a production-ready build in the `docs/` directory for GitHub Pages.