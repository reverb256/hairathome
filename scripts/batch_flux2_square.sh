#!/usr/bin/env bash
# Batch process with Flux.2 Klein - Square format for gallery
set -e

PROJECT_ROOT="/data/@projects/hairathome"
INPUT_DIR="$PROJECT_ROOT/static/images/movie-frames"

# Frames to process
FRAMES=(
    "frame-0026.jpg"
    "frame-0025.jpg"
    "frame-0028.jpg"
    "frame-0034.jpg"
    "frame-0033.jpg"
    "frame-0023.jpg"
    "frame-0031.jpg"
    "frame-0027.jpg"
    "frame-0024.jpg"
    "frame-0022.jpg"
    "frame-0021.jpg"
    "frame-0030.jpg"
    "frame-0029.jpg"
    "frame-0032.jpg"
    "frame-0036.jpg"
    "frame-0038.jpg"
    "frame-0040.jpg"
    "frame-0041.jpg"
    "frame-0043.jpg"
    "frame-0044.jpg"
)

echo "=================================================="
echo "Flux.2 Klein - Square Format Generation (1536x1536)"
echo "=================================================="
echo ""

count=0
for frame in "${FRAMES[@]}"; do
    INPUT_FILE="$INPUT_DIR/$frame"

    if [[ ! -f "$INPUT_FILE" ]]; then
        echo "⚠️  $frame not found, skipping"
        continue
    fi

    count=$((count + 1))
    FRAME_NAME="${frame%.jpg}"

    echo "[$count/${#FRAMES[@]}] Creating workflow: $frame"

    # Copy to ComfyUI
    cp "$INPUT_FILE" "/data/StabilityMatrix/Packages/ComfyUI/input/$frame"

    # Create workflow with 1536x1536 square output
    cat > "/tmp/flux2_${FRAME_NAME}.json" <<EOF
{
  "1": {
    "class_type": "CheckpointLoaderSimple",
    "inputs": {
      "ckpt_name": "fluxKleinFP8_flux2KleinBase9bFp8.safetensors"
    }
  },
  "2": {
    "class_type": "VAELoader",
    "inputs": {
      "vae_name": "ae.safetensors"
    }
  },
  "3": {
    "class_type": "LoadImage",
    "inputs": {
      "image": "$frame",
      "upload": "image"
    }
  },
  "4": {
    "class_type": "CLIPTextEncode",
    "inputs": {
      "text": "professional photography, shot on Sony a7III, 35mm f/2.8 lens, environmental portraiture, showing entire room context, warm natural lighting from large windows, soft shadows, cinematic lighting, global illumination, hyper realistic skin:1.2, skin texture:1.3, visible pores, natural imperfections, unretouched, RAW photo, 8k UHD, TIME cover quality, professional photography",
      "clip": ["1", 1]
    }
  },
  "5": {
    "class_type": "CLIPTextEncode",
    "inputs": {
      "text": "plastic, imitation, fake, rendering, artificial, silicone, waxy, over-smoothed, airbrushed, cartoon, anime, manga, 3d render, cgi, blurry, low quality, distorted, oversaturated, digital look, smooth skin, doll-like, mannequin, close-up, portrait, face shot",
      "clip": ["1", 1]
    }
  },
  "6": {
    "class_type": "VAEEncode",
    "inputs": {
      "pixels": ["3", 0],
      "vae": ["2", 0]
    }
  },
  "7": {
    "class_type": "KSampler",
    "inputs": {
      "seed": $RANDOM,
      "steps": 20,
      "cfg": 3.5,
      "sampler_name": "euler",
      "scheduler": "simple",
      "denoise": 0.40,
      "model": ["1", 0],
      "positive": ["4", 0],
      "negative": ["5", 0],
      "latent_image": ["6", 0]
    }
  },
  "8": {
    "class_type": "VAEDecode",
    "inputs": {
      "samples": ["7", 0],
      "vae": ["2", 0]
    }
  },
  "9": {
    "class_type": "ImageScale",
    "inputs": {
      "image": ["8", 0],
      "upscale_method": "lanczos",
      "width": 1536,
      "height": 1536,
      "crop": "center"
    }
  },
  "10": {
    "class_type": "SaveImage",
    "inputs": {
      "images": ["9", 0],
      "filename_prefix": "${FRAME_NAME}_flux2_square"
    }
  }
}
EOF
    echo "   Created: /tmp/flux2_${FRAME_NAME}.json"
    echo ""
done

echo "=================================================="
echo "Workflows created! Submitting to ComfyUI..."
echo "=================================================="
echo ""

# Submit all workflows
for workflow in /tmp/flux2_frame-*.json; do
    filename=$(basename "$workflow" .json)
    echo "Submitting: $filename"

    wrapped_json=$(cat "$workflow" | jq -n --argjson workflow "$(cat "$workflow")" '{"prompt": $workflow}')

    response=$(curl -s -X POST "http://localhost:8188/prompt" \
        -H "Content-Type: application/json" \
        -d "$wrapped_json")

    prompt_id=$(echo "$response" | grep -o '"prompt_id":"[^"]*"' | cut -d'"' -f4)

    if [[ -n "$prompt_id" ]]; then
        echo "   ✓ Queued: $prompt_id"
    else
        echo "   ✗ Failed"
    fi

    sleep 0.5
done

echo ""
echo "=================================================="
echo "All 20 frames queued for Flux.2 processing"
echo "Output size: 1536x1536 (square)"
echo "=================================================="
