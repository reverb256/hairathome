{
  description = "Hair@Home - Hugo Static Site Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };

        # Development shell with all required tools
        developmentShell = pkgs.mkShell {
          # Core packages
          buildInputs = with pkgs; [
            # Node.js ecosystem
            nodejs_20
            nodePackages.npm
            
            # Hugo (standard version from nixpkgs)
            hugo
            
            # Image processing
            imagemagick
            graphicsmagick
            
            # Development utilities
            git
            curl
            wget
            jq
            tree
            ripgrep
            fd
            bat
            
            # Testing and performance tools
            chromium
            lighthouse
            
            # Additional useful tools
            tokei
            du-dust
            tealdeer
            dog
          ];

          # Node.js packages that should be available globally
          shellHook = ''
            echo "🎉 Welcome to Hair@Home development environment!"
            echo "✨ Setting up Node.js environment..."
            
            # Install Node.js dependencies if they don't exist
            if [ ! -d "node_modules" ]; then
              echo "📦 Installing Node.js dependencies..."
              npm ci
            fi
            
            # Make Node.js tools available
            export PATH="$PWD/node_modules/.bin:$PATH"
            
            # Environment variables
            export NODE_ENV="development"
            export HUGO_ENV="development"
            export NIXPACKS_NODE_VERSION="20"
            
            echo ""
            echo "🚀 Available tools:"
            echo "  - hugo: Static site generator"
            echo "  - npm: Node.js package manager"
            echo "  - node: Node.js runtime (v20)"
            echo "  - lighthouse: Performance testing"
            echo "  - chromium: Browser for testing"
            echo "  - imagemagick: Image processing"
            echo ""
            echo "📋 Quick start commands:"
            echo "  npm run serve     # Start development server"
            echo "  npm run build     # Build for production"
            echo "  npm run test      # Run performance tests"
            echo "  npm run optimize  # Optimize images"
            echo ""
            echo "📁 Project structure:"
            echo "  content/    - Hugo content files"
            echo "  static/     - Static assets (CSS, JS, images)"
            echo "  themes/     - Hugo theme"
            echo "  tests/      - Playwright tests"
            echo ""
            echo "🎯 Performance targets:"
            echo "  - FCP: <1.5s"
            echo "  - LCP: <2.5s"
            echo "  - TTI: <3.5s"
            echo "  - CLS: <0.1"
            echo ""
            echo "💡 Node.js packages are managed locally via npm"
            echo "   (not through Nix, which is the proper approach)"
            echo ""
          '';
        };

        # Package set for specific tools
        packages = {
          # Individual packages for reference
          hugo = pkgs.hugo;
          nodejs = pkgs.nodejs_20;
          chromium = pkgs.chromium;
          imagemagick = pkgs.imagemagick;
          lighthouse = pkgs.lighthouse;
          
          # Development tools collection
          devTools = pkgs.symlinkJoin {
            name = "hairathome-dev-tools";
            paths = with pkgs; [
              nodejs_20
              nodePackages.npm
              hugo
              git
              curl
              wget
              jq
              tree
              ripgrep
              fd
              bat
            ];
          };
          
          # Testing tools collection
          testTools = pkgs.symlinkJoin {
            name = "hairathome-test-tools";
            paths = with pkgs; [
              chromium
              lighthouse
              imagemagick
              graphicsmagick
            ];
          };
        };

        # Applications that can be run with `nix run`
        apps = {
          hugo-server = {
            type = "app";
            program = "${pkgs.hugo}/bin/hugo";
          };
          
          serve = {
            type = "app";
            program = toString (pkgs.writeShellScript "serve" ''
              ${pkgs.nodejs_20}/bin/node ${pkgs.nodePackages.npm}/bin/npm run serve
            '');
          };
          
          build = {
            type = "app";
            program = toString (pkgs.writeShellScript "build" ''
              ${pkgs.nodejs_20}/bin/node ${pkgs.nodePackages.npm}/bin/npm run build
            '');
          };
          
          test-performance = {
            type = "app";
            program = toString (pkgs.writeShellScript "test-performance" ''
              ${pkgs.nodejs_20}/bin/node ${pkgs.nodePackages.npm}/bin/npm run test:performance
            '');
          };
        };

        # Checks for CI/CD
        checks = {
          build-check = pkgs.runCommand "build-check" {
            buildInputs = with pkgs; [ nodejs_20 nodePackages.npm hugo ];
          } ''
            cp -r ${./.} ./source
            cd source
            
            # Install dependencies
            npm ci
            
            # Build the site
            npm run build
            
            # Check if build was successful
            if [ -d "public" ]; then
              echo "✅ Build successful"
              touch $out
            else
              echo "❌ Build failed"
              exit 1
            fi
          '';
        };
      in
      {
        # Development shells (modern format)
        devShells.default = developmentShell;
        
        # Exposed packages
        inherit packages;
        
        # Exposed apps
        inherit apps;
        
        # CI/CD checks
        inherit checks;
        
        # formatter for nix files
        formatter = pkgs.nixfmt;
      });
}
