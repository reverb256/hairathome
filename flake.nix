{
  description = "Hair@Home - Hugo site with AI image generation workflow";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    devshell.url = "github:numtide/devshell";
  };

  outputs = { self, nixpkgs, flake-utils, devshell, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ devshell.overlays.default ];
        };
      in
      {
        devShells.default = pkgs.devshell.mkShell {
          name = "hairathome-dev";

          motd = ''
            {202}🌟 Hair@Home Development Environment{reset}

            {200}Available commands:{reset}
              nix run .#build      - Build Hugo site
              nix run .#serve      - Start Hugo dev server
              nix run .#optimize   - Optimize images
              nix run .#convert    - Convert images to WebP
              nix run .#generate   - Generate AI images (requires ComfyUI)

            {200}Project:{reset} Hair@Home mobile hair services
            {200}Stack:{reset} Hugo + ComfyUI + AI image generation
          '';

          packages = with pkgs; [
            # Hugo and site building
            hugo

            # Image processing
            python314
            python314.pillow
            python314.pillow-heif
            libwebp
            image_optim

            # Graphics tools
            upscayl  # AI image upscaler
            ffmpeg   # Video/image processing

            # Development tools
            git
            jq       # JSON processing
            curl     # HTTP requests
            nodejs   # For postcss/minification

            # Python packages for image workflow
            (python314.withPackages (ps: with ps; [
              pillow
              pillow-heif
              requests
              numpy
            ]))
          ];

          env = [
            {
              name = "HUGO_VERSION";
              value = "0.155.3";
            }
            {
              name = "COMFYUI_HOST";
              value = "http://127.0.0.1:8188";
            }
            {
              name = "PROJECT_ROOT";
              eval = "$PWD";
            }
          ];

          commands = [
            {
              name = "build";
              help = "Build the Hugo site";
              command = "hugo --minify";
            }
            {
              name = "serve";
              help = "Start Hugo development server";
              command = "hugo server --buildDrafts --buildFuture";
            }
            {
              name = "optimize";
              help = "Optimize images in static/images/";
              command = ''
                #!/usr/bin/env bash
                echo "🖼️  Optimizing images..."
                find static/images -name "*.png" -o -name "*.jpg" | while read img; do
                  echo "  Optimizing $img"
                  ${pkgs.image_optim}/bin/image_optim "$img"
                done
                echo "✅ Optimization complete"
              '';
            }
            {
              name = "convert";
              help = "Convert images to WebP format";
              command = ''
                #!/usr/bin/env bash
                echo "🔄 Converting images to WebP..."
                mkdir -p static/images/webp
                find static/images \( -name "*.png" -o -name "*.jpg" \) -not -path "*/webp/*" | while read img; do
                  out="static/images/webp/$(basename "$img" | sed 's/\.[^.]*$/.webp/')"
                  echo "  Converting $img -> $out"
                  ${pkgs.libwebp}/bin/cwebp -q 85 "$img" -o "$out" 2>/dev/null || true
                done
                echo "✅ Conversion complete"
              '';
            }
            {
              name = "generate";
              help = "Generate AI images via ComfyUI API";
              command = ''
                #!/usr/bin/env bash
                set -e

                COMFYUI=''${COMFYUI_HOST:-http://127.0.0.1:8188}
                PROMPTS_FILE="$PROJECT_ROOT/docs/IMPROVED_SERVICE_PROMPTS.md"

                echo "🎨 AI Image Generation for Hair@Home"
                echo "   ComfyUI: $COMFYUI"

                # Check ComfyUI is running
                if ! curl -sf "$COMFYUI/system_stats" > /dev/null; then
                  echo "❌ ComfyUI not running at $COMFYUI"
                  echo "   Start ComfyUI first"
                  exit 1
                fi

                echo "✅ ComfyUI is running"
                echo ""
                echo "   To generate images, use the ComfyUI MCP tools or"
                echo "   run the scripts in scripts/ directory"
                echo ""
                echo "   Available scripts:"
                echo "   - scripts/submit_workflows.sh"
                echo "   - scripts/generate_realistic.sh"
              '';
            }
            {
              name = "check-links";
              help = "Check for broken links in the built site";
              command = ''
                #!/usr/bin/env bash
                echo "🔍 Checking for broken links..."
                nix run nixpkgs#markdown-link-check -- docs/**/*.md || true
                echo "✅ Link check complete"
              '';
            }
          ];
        };
      });
}
