#!/usr/bin/env bash
# Nix-based AI image generation workflow for Hair@Home
# This script provides a complete workflow using Nix-managed tools

set -euo pipefail

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}ℹ${NC} $*"; }
log_success() { echo -e "${GREEN}✓${NC} $*"; }
log_warn() { echo -e "${YELLOW}⚠${NC} $*"; }
log_error() { echo -e "${RED}✗${NC} $*"; }

# Configuration
COMFYUI_HOST="${COMFYUI_HOST:-http://127.0.0.1:8188}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/static/images/stock"
COMFYUI_OUTPUT="/data/StabilityMatrix/Packages/ComfyUI/output"

# Check prerequisites
check_prerequisites() {
  log_info "Checking prerequisites..."

  # Check for required commands
  local missing=()
  for cmd in jq curl python3; do
    if ! command -v "$cmd" &>/dev/null; then
      missing+=("$cmd")
    fi
  done

  if [[ ${#missing[@]} -gt 0 ]]; then
    log_error "Missing required commands: ${missing[*]}"
    log_info "Enter nix dev shell with: nix develop"
    exit 1
  fi

  # Check ComfyUI
  if ! curl -sf "$COMFYUI_HOST/system_stats" >/dev/null 2>&1; then
    log_error "ComfyUI not running at $COMFYUI_HOST"
    return 1
  fi

  log_success "All prerequisites met"
  return 0
}

# Upload image to ComfyUI
upload_image() {
  local src="$1"
  local filename="$(basename "$src")"
  local dest="/data/StabilityMatrix/Packages/ComfyUI/input/$filename"

  log_info "Uploading $filename..."

  if [[ "$src" == "$dest" ]]; then
    log_warn "Source is already in ComfyUI input directory"
    return 0
  fi

  cp "$src" "$dest"
  log_success "Uploaded $filename"
}

# Generate single service image
generate_service_image() {
  local service="$1"
  local resolution="${2:-1024x1024}"
  local prompt_file="$PROJECT_ROOT/docs/IMPROVED_SERVICE_PROMPTS.md"

  log_info "Generating $service at $resolution"

  # Parse prompt from markdown file
  local positive_prompt=$(awk "/### $service/,/####/" "$prompt_file" | grep -A1 "Positive Prompt:" | tail -1 | sed 's/```\(.*\)```\?/\1/' | xargs)
  local negative_prompt=$(awk "/### $service/,/####/" "$prompt_file" | grep -A1 "Negative Prompt:" | tail -1 | sed 's/```\(.*\)```\?/\1/' | xargs)
  local seed=$(awk "/### $service/,/####/" "$prompt_file" | grep "Seed:" | awk '{print $2}')

  if [[ -z "$positive_prompt" ]]; then
    log_error "Could not find prompt for $service"
    return 1
  fi

  # Build workflow JSON
  local width="${resolution%x*}"
  local height="${resolution#*x}"

  local workflow=$(cat <<EOF
{
  "1": {
    "class_type": "CheckpointLoaderSimple",
    "inputs": {"ckpt_name": "juggernautXL_v9.safetensors"}
  },
  "2": {
    "class_type": "EmptyLatentImage",
    "inputs": {"width": $width, "height": $height, "batch_size": 1}
  },
  "3": {
    "class_type": "CLIPTextEncode",
    "inputs": {
      "text": $(echo "$positive_prompt" | jq -Rs .),
      "clip": ["1", 1]
    }
  },
  "4": {
    "class_type": "CLIPTextEncode",
    "inputs": {
      "text": $(echo "$negative_prompt" | jq -Rs .),
      "clip": ["1", 1]
    }
  },
  "5": {
    "class_type": "KSampler",
    "inputs": {
      "model": ["1", 0],
      "positive": ["3", 0],
      "negative": ["4", 0],
      "latent_image": ["2", 0],
      "seed": ${seed:-$(shuf -i 100000000000000-900000000000000 -n 1)},
      "steps": 35,
      "cfg": 6.0,
      "sampler_name": "dpmpp_2m",
      "scheduler": "karras",
      "denoise": 1.0
    }
  },
  "6": {
    "class_type": "VAEDecode",
    "inputs": {"samples": ["5", 0], "vae": ["1", 2]}
  },
  "7": {
    "class_type": "SaveImage",
    "inputs": {"images": ["6", 0], "filename_prefix": "service-$service-generated"}
  }
}
EOF
)

  # Submit to ComfyUI
  local response=$(curl -s -X POST "$COMFYUI_HOST/prompt" \
    -H "Content-Type: application/json" \
    -d "{\"prompt\": $workflow}")

  local prompt_id=$(echo "$response" | jq -r '.prompt_id // empty')

  if [[ -z "$prompt_id" ]]; then
    log_error "Failed to submit $service generation"
    log_error "Response: $response"
    return 1
  fi

  log_success "Enqueued $service (ID: $prompt_id)"
  echo "$prompt_id"
}

# Monitor queue
monitor_queue() {
  local timeout="${1:-300}"  # 5 minutes default
  local elapsed=0

  log_info "Monitoring queue (timeout: ${timeout}s)..."

  while [[ $elapsed -lt $timeout ]]; do
    local queue_info=$(curl -s "$COMFYUI_HOST/queue")
    local queue_running=$(echo "$queue_info" | jq '.queue_running | length')
    local queue_pending=$(echo "$queue_info" | jq '.queue_pending | length')
    local total=$((queue_running + queue_pending))

    if [[ $total -eq 0 ]]; then
      log_success "All generations complete!"
      return 0
    fi

    echo -ne "\r\033[K${BLUE}⏳${NC} Running: $queue_running | Pending: $queue_pending | Elapsed: ${elapsed}s"
    sleep 5
    elapsed=$((elapsed + 5))
  done

  echo ""
  log_warn "Timeout reached, but generations may still be running"
  return 1
}

# Copy generated images to project
install_images() {
  log_info "Installing generated images..."

  mkdir -p "$OUTPUT_DIR"

  local copied=0
  for img in "$COMFYUI_OUTPUT"/*-generated_*.png; do
    if [[ -f "$img" ]]; then
      local basename=$(basename "$img" | sed 's/-generated//')
      local dest="$OUTPUT_DIR/$basename"

      cp "$img" "$dest"
      log_success "Installed $basename"
      ((copied++))
    fi
  done

  if [[ $copied -eq 0 ]]; then
    log_warn "No images found to install"
  else
    log_success "Installed $copied image(s)"
  fi
}

# Optimize images (convert to WebP)
optimize_images() {
  log_info "Optimizing images..."

  if ! command -v cwebp &>/dev/null; then
    log_warn "cwebp not found. Install with nix or use 'nix run .#convert'"
    return 1
  fi

  mkdir -p "$OUTPUT_DIR/webp"

  local converted=0
  for img in "$OUTPUT_DIR"/*.png "$OUTPUT_DIR"/*.jpg; do
    if [[ -f "$img" ]]; then
      local basename=$(basename "$img" | sed 's/\.[^.]*$/.webp/')
      local out="$OUTPUT_DIR/webp/$basename"

      cwebp -q 85 "$img" -o "$out" 2>/dev/null && {
        ((converted++))
        log_success "Converted $basename"
      }
    fi
  done

  log_success "Converted $converted image(s) to WebP"
}

# Complete workflow
generate_all() {
  local resolution="${1:-1024x1024}"

  log_info "Starting full generation workflow..."
  log_info "Resolution: $resolution"

  check_prerequisites || exit 1

  # Services to generate
  local services=("haircut" "color" "blowout" "mens" "updo" "treatments")

  log_info "Queueing ${#services[@]} service images..."

  for service in "${services[@]}"; do
    generate_service_image "$service" "$resolution"
  done

  log_info "All jobs queued. Waiting for completion..."
  monitor_queue 600  # 10 minute timeout

  log_info "Installing images..."
  install_images

  log_info "Optimizing images..."
  optimize_images

  log_success "Workflow complete!"
}

# CLI
case "${1:-help}" in
  check)
    check_prerequisites
    ;;
  generate)
    shift
    if [[ $# -eq 0 ]]; then
      generate_all
    else
      for service in "$@"; do
        generate_service_image "$service"
      done
      monitor_queue
      install_images
    fi
    ;;
  monitor)
    monitor_queue "${2:-300}"
    ;;
  install)
    install_images
    ;;
  optimize)
    optimize_images
    ;;
  all)
    generate_all "${2:-1024x1024}"
    ;;
  *)
    cat <<EOF
${GREEN}Hair@Home AI Image Generation Workflow${NC}

Usage: $0 <command> [options]

Commands:
  check           Check prerequisites
  generate [srv]  Generate images (all services or specific)
  monitor [sec]   Monitor queue (default: 300s timeout)
  install         Install generated images to project
  optimize        Optimize/convert images to WebP
  all [res]       Full workflow: generate + install + optimize
                  Resolution: 1024x1024 (default) or 1920x1080, 512x512

Examples:
  $0 check                    # Check if ComfyUI is running
  $0 generate                 # Generate all service images
  $0 generate haircut color   # Generate specific services
  $0 all 1920x1080            # Generate hero images
  $0 optimize                 # Convert to WebP

Environment:
  COMFYUI_HOST    ComfyUI URL (default: http://127.0.0.1:8188)

For best results, run inside nix dev shell:
  nix develop
  $0 all
EOF
    ;;
esac
