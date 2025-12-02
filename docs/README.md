# Hair At Home

Professional mobile hair styling services in Winnipeg, Manitoba. Bringing salon-quality hair services directly to your doorstep.

## 🚀 Deployment

This site is configured for automatic deployment to GitHub Pages. When you push to the `main` branch, the GitHub Actions workflow will:

1. Run tests using Playwright
2. Build the static site
3. Deploy to GitHub Pages

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### Available Scripts

- `npm run dev` - Start local development server on port 8000
- `npm run build` - Build the site for production
- `npm run serve` - Serve the built site from dist/ folder
- `npm run test` - Run Playwright tests
- `npm run test:headed` - Run tests with browser UI
- `npm run test:ui` - Run tests with Playwright Test UI
- `npm run lint` - Run ESLint on test files

## 📁 Project Structure

```
hairathome/
├── index.html          # Main HTML file
├── styles.css          # Stylesheets
├── script.js           # JavaScript functionality
├── package.json        # Dependencies and scripts
├── .github/workflows/  # GitHub Actions workflows
├── tests/              # Playwright tests
└── dist/               # Built site (generated)
```

## 🌐 GitHub Pages Configuration

The site is configured to deploy to GitHub Pages with:

- **Source**: `main` branch
- **Directory**: `/dist` (built files)
- **Custom domain**: Configure in repository settings if needed

### Manual Deployment

If you need to deploy manually:

```bash
# Build the site
npm run build

# Deploy using git subtree
npm run deploy
```

## 🧪 Testing

The project includes Playwright end-to-end tests to ensure the site works correctly:

- Navigation functionality
- Form submissions
- Mobile responsiveness
- Accessibility

Run tests locally:
```bash
npm run test
```

## 📱 Features

- **Responsive Design**: Works on all devices
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Booking Form**: Interactive appointment scheduling
- **Gallery**: Image showcase of work
- **FAQ Section**: Expandable questions and answers
- **Contact Information**: Multiple ways to get in touch

## 🔧 Configuration

### Update Repository Information

Edit `package.json` to update:
- `homepage`: Your GitHub Pages URL
- `repository.url`: Your repository URL

Replace `[USERNAME]` and `[REPO_NAME]` with your actual GitHub username and repository name.

### Custom Domain

To use a custom domain:
1. Add a `CNAME` file to the root directory
2. Configure the domain in your repository settings
3. Update DNS settings as required by GitHub

## 📄 License

MIT License - see LICENSE file for details.