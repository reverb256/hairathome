{
  description = "Hair@Home - Hugo Static Site Development Environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    nodejs_20.url = "github:serokell/flake-utils-plus";
  };

  outputs = { self, nixpkgs, flake-utils, nodejs_20 }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        # Node.js environment with all required packages
        nodeEnv = pkgs.nodejs_20.withPackages (ps: with ps; [
          # Core build tools
          npm
          yarn
          pnpm
          
          # Image optimization tools
          imagemin-mozjpeg
          imagemin-pngquant
          imagemin-webp
          
          # Testing tools
          "@axe-core/playwright"
          "@lhci/cli"
          "@playwright/test"
          axe-core
          pa11y-ci
          
          # Development tools
          serve
          lighthouse
        ]);

        # Hugo with extended features
        hugo = pkgs.hugo_0_130.override {
          inherit (pkgs) imagemagick;
        };

        # Additional CLI tools for development
        cliTools = with pkgs; [
          git
          curl
          wget
          jq
          tree
          ripgrep
          fd
          bat
          dust
          tealdeer
          dog
          tokei
        ];

        # Accessibility and performance testing tools
        testingTools = with pkgs; [
          chromium
          firefox
          imagemagick
          graphicsmagick
        ];

        # Development shell
        shell = pkgs.mkShell {
          buildInputs = [
            # Core development tools
            nodeEnv
            hugo
            cliTools
            testingTools
          ];

          # Environment variables
          NIXPACKS_NODE_VERSION = "20";
          HUGO_ENV = "development";
          
          # Shell hooks
          shellHook = ''
            echo "🎉 Welcome to Hair@Home development environment!"
            echo "✨ Available tools:"
            echo "  - hugo: Static site generator"
            echo "  - npm/yarn/pnpm: Package management"
            echo "  - serve: Local development server"
            echo "  - lighthouse: Performance testing"
            echo "  - playwright: End-to-end testing"
            echo ""
            echo "🚀 Quick start commands:"
            echo "  npm run serve     # Start development server"
            echo "  npm run build     # Build for production"
            echo "  npm run test      # Run all tests"
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
          '';
        };
      in
      {
        # Development shell
        devShell = shell;

        # Packages
        packages = {
          default = shell;
          hugo = hugo;
          nodejs = nodeEnv;
          cli-tools = pkgs.symlinkJoin {
            name = "cli-tools";
            paths = cliTools;
          };
          testing-tools = pkgs.symlinkJoin {
            name = "testing-tools";
            paths = testingTools;
          };
        };

        # Apps
        apps = {
          hugo-server = {
            type = "app";
            program = "${hugo}/bin/hugo";
          };
          serve = {
            type = "app";
            program = "${nodeEnv}/bin/serve";
          };
        };

        # Development overlay for additional tools
        overlays = [
          (self: super: {
            # Custom package overrides
            npm = super.npm.override {
              nodejs = pkgs.nodejs_20;
            };
            
            # Performance monitoring tools
            perf-tools = pkgs.writeShellScriptBin "perf-tools" ''
              echo "Performance testing tools available:"
              echo "  - lighthouse: Web performance auditing"
              echo "  - playwright: Browser automation"
              echo "  - pa11y: Accessibility testing"
              echo "  - axe-core: Automated accessibility"
              echo ""
              echo "Usage examples:"
              echo "  lighthouse http://localhost:1313 --output=json --output-path=report.json"
              echo "  npx playwright test"
              echo "  pa11y http://localhost:1313"
            '';
            
            # Development utilities
            dev-utils = pkgs.writeShellScriptBin "dev-utils" ''
              echo "Development utilities:"
              echo "  - hugo-check: Validate Hugo configuration"
              echo "  - build-check: Verify build process"
              echo "  - serve-check: Test development server"
              echo ""
              echo "Usage: dev-utils [command]"
            '';
          })
        ];
      });
}