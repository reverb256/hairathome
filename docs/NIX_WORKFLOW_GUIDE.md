# Nix-Based Workflow for Hair@Home

A complete Nix-based development environment for the Hair@Home project, integrating Hugo site building with AI image generation via ComfyUI.

## Overview

This workflow uses Nix flakes to provide a reproducible development environment with all necessary tools for:
- Building and serving the Hugo site
- Optimizing and converting images
- Generating AI images via ComfyUI
- Managing the complete project lifecycle

## Quick Start

### 1. Enter the Development Environment

```bash
# Using flake
nix develop

# Or using direnv (recommended)
direnv allow  # if you have .envrc configured
```

### 2. Available Commands

Once in the dev shell, you have access to:

```bash
# Site building
build           # Build Hugo site with minification
serve           # Start Hugo dev server (http://localhost:1313)

# Image processing
optimize        # Optimize PNG/JPG images
convert         # Convert images to WebP

# AI image generation
generate        # Interactive helper for AI generation
check-links     # Check for broken links
```

### 3. AI Image Generation Workflow

```bash
# Option 1: Using the Nix script
./scripts/nix-image-workflow check       # Verify ComfyUI is running
./scripts/nix-image-workflow all         # Full workflow
./scripts/nix-image-workflow all 1920x1080  # Generate hero images

# Option 2: Using individual commands
./scripts/nix-image-workflow generate haircut color
./scripts/nix-image-workflow monitor     # Watch progress
./scripts/nix-image-workflow install     # Copy to project
./scripts/nix-image-workflow optimize    # Convert to WebP
```

## Development Environment

### Packages Included

**Hugo & Web:**
- `hugo` - Static site generator
- `nodejs` - For postcss/minification

**Image Processing:**
- `python314` with `pillow` - Python image library
- `python314.pillow-heif` - HEIF format support
- `libwebp` - WebP conversion tools
- `image_optim` - Image optimization
- `upscayl` - AI image upscaling

**Utilities:**
- `jq` - JSON processing (for ComfyUI API)
- `curl` - HTTP requests
- `git` - Version control
- `ffmpeg` - Video/image processing

### Environment Variables

```bash
HUGO_VERSION=0.155.3          # Hugo version
COMFYUI_HOST=http://127.0.0.1:8188  # ComfyUI server
PROJECT_ROOT=$PWD             # Project root directory
```

## Nix Script Details

### `scripts/nix-image-workflow.sh`

A comprehensive bash script for managing AI image generation:

#### Commands

| Command | Description |
|---------|-------------|
| `check` | Verify ComfyUI is running and accessible |
| `generate [service...]` | Generate all or specific service images |
| `monitor [seconds]` | Watch ComfyUI queue progress |
| `install` | Copy generated images to project |
| `optimize` | Convert images to WebP format |
| `all [resolution]` | Complete workflow: generate → install → optimize |

#### Resolutions

| Resolution | Aspect Ratio | Use Case |
|------------|--------------|----------|
| `512x512` | 1:1 | Service cards (small) |
| `1024x1024` | 1:1 | Gallery images (default) |
| `1920x1080` | 16:9 | Hero images (wide) |

#### Examples

```bash
# Check prerequisites
./scripts/nix-image-workflow.sh check

# Generate specific services
./scripts/nix-image-workflow.sh generate haircut color blowout

# Generate hero images for all services
./scripts/nix-image-workflow.sh all 1920x1080

# Just monitor existing queue
./scripts/nix-image-workflow.sh monitor 600

# Install already-generated images
./scripts/nix-image-workflow.sh install

# Convert existing images to WebP
./scripts/nix-image-workflow.sh optimize
```

## Integration with Existing Tools

### ComfyUI Integration

The script communicates with ComfyUI via its REST API:

1. **Upload**: Copies source images to ComfyUI input directory
2. **Generate**: Submits workflows to ComfyUI queue
3. **Monitor**: Polls queue status until complete
4. **Install**: Copies outputs to project static directory
5. **Optimize**: Converts to WebP for better performance

### Workflow JSON Structure

The script builds ComfyUI workflows programmatically:

```json
{
  "1": "CheckpointLoaderSimple",  // Load Juggernaut XL
  "2": "EmptyLatentImage",        // Create latent
  "3": "CLIPTextEncode",          // Positive prompt
  "4": "CLIPTextEncode",          // Negative prompt
  "5": "KSampler",                // Generate
  "6": "VAEDecode",               // Decode to image
  "7": "SaveImage"                // Save to disk
}
```

### Prompt Integration

Reads prompts from `/docs/IMPROVED_SERVICE_PROMPTS.md`:

```markdown
### Haircuts
**Positive Prompt:**
professional hair salon macro photography, sharp scissors cutting hair...

**Negative Prompt:**
face, eyes, person, woman, man, people...

**Seed:** 211444581994552
```

## Image Optimization

### WebP Conversion

WebP provides better compression than PNG/JPG:

```bash
# Using the Nix script
./scripts/nix-image-workflow.sh optimize

# Or using the dev shell command
nix run .#convert
```

### Benefits

- **Smaller file sizes**: 25-35% reduction
- **Better quality**: Same visual quality at smaller size
- **Modern format**: Supported by all modern browsers
- **CDN friendly**: Faster loading times

### Output Structure

```
static/images/stock/
├── service-haircut_00001_.png          # Original
├── service-haircut-square_00001_.png   # Square variant
├── service-haircut-hero_00001_.png     # Hero variant
└── webp/
    ├── service-haircut_00001_.webp
    ├── service-haircut-square_00001_.webp
    └── service-haircut-hero_00001_.webp
```

## Reproducibility

### Flake Lock File

The `flake.lock` file ensures everyone gets the same package versions:

```bash
# Update dependencies (when needed)
nix flake update

# Build with specific version
nix build .#package --rebuild
```

### Version Pinning

Hugo version is pinned in the dev shell:

```bash
HUGO_VERSION=0.155.3
hugo version  # Shows 0.155.3
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: cachix/install-nix-action@v24
      - uses: cachix/cachix-action@v12

      - name: Build site
        run: nix build .#default

      - name: Deploy
        run: nix run .#deploy
```

### Local Testing

```bash
# Test build locally
nix build .#default

# Test serve locally
nix run .#serve
```

## Troubleshooting

### ComfyUI Not Running

```bash
# Check if ComfyUI is accessible
curl http://127.0.0.1:8188/system_stats

# Start ComfyUI manually
cd /data/StabilityMatrix/Packages/ComfyUI
python main.py --listen 127.0.0.1 --port 8188
```

### Package Not Found

```bash
# Rebuild shell
nix develop --rebuild

# Or clear cache
nix-collect-garbage -d
nix develop
```

### Permission Issues

```bash
# Make script executable
chmod +x scripts/nix-image-workflow.sh

# Fix permissions
chmod -R u+rwX static/images/
```

### Out of VRAM

```bash
# Generate images sequentially (default behavior)
./scripts/nix-image-workflow.sh generate  # One at a time

# Or reduce batch size in ComfyUI
```

## Advanced Usage

### Custom Resolutions

```bash
# Generate at custom resolution
WIDTH=800 HEIGHT=600 ./scripts/nix-image-workflow.sh generate
```

### Parallel Generation

Edit `scripts/nix-image-workflow.sh`:

```bash
# Submit all jobs first, then monitor
for service in "${services[@]}"; do
  generate_service_image "$service" "$resolution" &
done
wait
monitor_queue
```

### Custom Prompts

Edit `docs/IMPROVED_SERVICE_PROMPTS.md`:

```markdown
### Custom Service
**Positive Prompt:**
your custom prompt here

**Negative Prompt:**
unwanted elements

**Seed:** 123456789
```

## Directory Structure

```
hairathome/
├── flake.nix                    # Nix flake definition
├── scripts/
│   └── nix-image-workflow.sh    # Main workflow script
├── docs/
│   ├── NIX_WORKFLOW_GUIDE.md    # This file
│   └── IMPROVED_SERVICE_PROMPTS.md
├── static/images/stock/         # Generated images
└── themes/hairathome/           # Hugo theme
```

## Best Practices

1. **Always enter nix develop** before working
2. **Commit flake.lock** for reproducibility
3. **Use WebP** for production images
4. **Generate multiple resolutions** for responsive design
5. **Monitor VRAM** when generating many images
6. **Keep prompts in version control**
7. **Test locally** before deploying

## Next Steps

1. Set up direnv for automatic shell activation:
   ```bash
   echo "use flake" > .envrc
   direnv allow
   ```

2. Create a ComfyUI automation script:
   ```bash
   # scripts/start-comfyui.sh
   #!/usr/bin/env bash
   cd /data/StabilityMatrix/Packages/ComfyUI
   python main.py --listen 127.0.0.1 --port 8188
   ```

3. Add image optimization to build process:
   ```bash
   # In flake.nix, add to build command
   packages = [ ... ];
   commands = [
     {
       name = "build";
       command = "hugo --minify && ./scripts/nix-image-workflow.sh optimize";
     }
   ];
   ```

## Resources

- [Nix Manual](https://nixos.org/manual/nix/stable/)
- [Nix Pills](https://nixos.org/guides/nix-pills/)
- [Hugo Docs](https://gohugo.io/)
- [ComfyUI GitHub](https://github.com/comfyanonymous/ComfyUI)
- [Juggernaut XL](https://civitai.com/models/30537/juggernaut-xl)

## Contributing

When adding new tools or workflows:

1. Add to `flake.nix` packages
2. Add helper command to devshell
3. Update this documentation
4. Test with `nix develop --rebuild`
5. Commit `flake.lock` changes
