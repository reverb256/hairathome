# Hair@Home - Complete Nix Development Environment

## 🚀 Quick Start

```bash
# 1. Enter development environment
nix develop

# 2. Start development server
npm run serve

# 3. Open in browser
http://localhost:1313
```

## 📦 What's Included

### Core Development Tools
- **Hugo 0.130**: Static site generator with extended features
- **Node.js 20**: JavaScript runtime with npm/yarn/pnpm
- **Git**: Version control with git-crypt support
- **Image Processing**: ImageMagick, GraphicsMagick, Imagemin tools

### Performance & Testing
- **Lighthouse**: Web performance auditing
- **Playwright**: End-to-end browser testing
- **Axe Core**: Accessibility testing
- **Pa11y**: Automated accessibility checker
- **Chromium/Firefox**: Browser engines for testing

### Development Utilities
- **CLI Tools**: ripgrep, bat, fd, tree, jq, curl, wget
- **Shell Enhancements**: Custom shell hooks and utilities
- **Performance Monitoring**: Built-in performance testing tools

## 🛠️ Project Structure

```
hairathome/
├── flake.nix              # Nix flake configuration
├── dev-setup.sh          # Development setup script
├── .vscode/              # VS Code configuration with LSP
│   ├── settings.json     # Editor settings
│   ├── extensions.json   # Recommended extensions
│   ├── tasks.json        # Build and test tasks
│   └── launch.json       # Debug configurations
├── content/              # Hugo content files
├── static/               # Static assets
├── themes/               # Hugo theme
└── tests/                # Playwright tests
```

## 🎯 Performance Targets

- **First Contentful Paint (FCP)**: <1.5s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Time to Interactive (TTI)**: <3.5s
- **Cumulative Layout Shift (CLS)**: <0.1

## 🧪 Testing Commands

```bash
# All tests
npm run test

# Performance testing
npm run test:performance

# Lighthouse CI
npm run test:lighthouse

# Accessibility testing
npm run test:accessibility

# E2E tests
npx playwright test

# Development server
npm run serve
```

## 🔧 VS Code Integration

The project includes comprehensive VS Code configuration:

- **LSP Support**: Hugo, CSS, JavaScript, JSON language servers
- **Recommended Extensions**: Go, TypeScript, Playwright, Prettier
- **Build Tasks**: Integrated build and test commands
- **Debug Configurations**: Hugo server and Playwright debugging
- **Formatter**: Prettier for consistent code style

## 📋 Available Commands

### Nix Commands
```bash
nix develop                    # Enter development shell
nix build                     # Build all packages
nix run .#hugo-server         # Run Hugo server
nix run .#serve              # Run serve command
```

### Development Commands
```bash
npm run dev                  # Start development server
npm run build               # Build for production
npm run optimize           # Optimize images
npm run lint              # Lint code
```

### Testing Commands
```bash
npm run test              # Run all tests
npm run test:performance  # Performance testing
npm run test:lighthouse   # Lighthouse CI
npm run test:accessibility # Accessibility testing
```

## 🚀 Deployment

### GitHub Pages
```bash
npm run build
# Site builds to /docs directory for GitHub Pages
```

### Netlify
```bash
# Build command: npm run build
# Publish directory: public
```

### Manual Deployment
```bash
npm run build
rsync -avz --delete public/ user@server:/path/to/site/
```

## 🔧 Custom Tools

### Performance Tools
```bash
perf-tools  # List available performance testing tools
```

### Development Utilities
```bash
dev-utils   # Development helper commands
```

## 🛡️ Security & Privacy

- **Git-crypt**: Encrypt sensitive files
- **Environment Isolation**: Nix provides isolated environments
- **Dependency Pinning**: Flake.lock ensures reproducible builds
- **Security Testing**: Built-in security scanning tools

## 📚 Documentation

- [NIX-README.md](./NIX-README.md) - Complete Nix setup guide
- [README.md](./README.md) - Project overview and features
- [AI-MCP-VISUAL-ENHANCEMENT-README.md](./AI-MCP-VISUAL-ENHANCEMENT-README.md) - Visual enhancement guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Enter development environment: `nix develop`
4. Make your changes
5. Run tests: `npm run test`
6. Commit and push
7. Create pull request

## 🐛 Troubleshooting

### Common Issues

**Nix not found:**
```bash
# Install Nix
sh <(curl -L https://nixos.org/nix/install)
```

**Flakes not enabled:**
```bash
# Add to ~/.config/nix/nix.conf
echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
```

**Permission issues:**
```bash
sudo chown -R $(whoami) .
```

### Getting Help

- Check the [NIX-README.md](./NIX-README.md) for detailed setup instructions
- Review VS Code configuration in `.vscode/` directory
- Run `dev-setup.sh` for automated environment setup

## 🎨 Visual Features

This project includes sophisticated visual enhancements:

- **Vibrant Color Palette**: Multi-hue design with professional aesthetics
- **Beauty Industry Alignment**: Premium styling for hair styling services
- **Performance Optimized**: Fast loading with optimized assets
- **Mobile-First**: Responsive design for all devices
- **Accessibility**: WCAG 2.1 AA compliant

## 📈 Performance Monitoring

The development environment includes comprehensive performance monitoring:

- **Real-time Lighthouse**: Continuous performance auditing
- **Automated Testing**: Playwright E2E tests with performance metrics
- **Accessibility Scanning**: Automated accessibility compliance checking
- **Image Optimization**: Built-in image processing and optimization

## 🔄 Continuous Integration

The Nix flake setup supports CI/CD integration:

- **Reproducible Builds**: Consistent environments across all stages
- **Dependency Management**: Automated dependency resolution
- **Testing Integration**: Built-in testing frameworks
- **Deployment Ready**: Production-ready build configurations

This complete development environment provides everything needed to develop, test, and deploy the Hair@Home static site with modern development practices and tools.