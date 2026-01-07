# Nix Flake Development Environment

This project uses Nix flakes for reproducible development environments.

## Quick Start

```bash
# Enter development shell
nix develop

# Start development server
npm run serve

# Build for production
npm run build
```

## Available Commands

### Development Shell
```bash
nix develop                    # Enter development environment
nix develop --command bash     # Enter with bash shell
```

### Package Management
```bash
nix build                    # Build all packages
nix run .#hugo-server         # Run Hugo server
nix run .#serve              # Run serve command
```

### Development Tools
```bash
hugo                         # Hugo static site generator
npm                          # Node.js package manager
serve                        # Local development server
lighthouse                   # Performance testing
playwright                   # End-to-end testing
pa11y                        # Accessibility testing
```

## Project Structure

```
├── flake.nix                # Nix flake configuration
├── flake.lock              # Nix dependencies lock file
├── dev-setup.sh            # Development setup script
├── .vscode/                # VS Code configuration
│   ├── settings.json       # Editor settings
│   ├── extensions.json     # Recommended extensions
│   └── tasks.json          # Build tasks
└── README.md               # This file
```

## Performance Testing

### Lighthouse CI
```bash
npm run test:lighthouse
```

### Performance Monitoring
```bash
npm run test:performance
```

### Accessibility Testing
```bash
npm run test:accessibility
```

## Dependencies

### Core Tools
- **Hugo 0.130**: Static site generator with extended features
- **Node.js 20**: JavaScript runtime with package management
- **Chromium**: Browser for testing and performance analysis

### Development Tools
- **Git**: Version control
- **Curl/Wget**: HTTP tools
- **JQ**: JSON processing
- **Ripgrep**: Fast grep alternative
- **Bat**: Cat replacement with syntax highlighting
- **Tealdeer**: Fast tldr client

### Image Processing
- **ImageMagick**: Image manipulation
- **GraphicsMagick**: Alternative image processing
- **Imagemin plugins**: Image optimization tools

## Environment Variables

```bash
NIXPACKS_NODE_VERSION=20    # Node.js version
HUGO_ENV=development        # Hugo environment
```

## Custom Commands

### Performance Tools
```bash
perf-tools                  # List available performance tools
```

### Development Utilities
```bash
dev-utils                   # Development helper commands
```

## Troubleshooting

### Nix Not Found
```bash
# Install Nix
sh <(curl -L https://nixos.org/nix/install)
```

### Flakes Not Enabled
```bash
# Add to ~/.config/nix/nix.conf
echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
```

### Permission Issues
```bash
# Fix permissions
sudo chown -R $(whoami) .
```

## Integration

### VS Code
The project includes VS Code configuration for:
- LSP support for Hugo, CSS, JavaScript
- Recommended extensions
- Build tasks and debugging
- Formatter configuration

### CI/CD
Nix flakes can be used in CI/CD pipelines for:
- Reproducible builds
- Dependency management
- Environment consistency
- Testing environments

### Docker
```bash
# Build Docker image with Nix
docker build -f Dockerfile.nix .
```