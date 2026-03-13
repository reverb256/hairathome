#!/bin/bash
# Batch enhance top 20 movie frames with img2img
# Applies consistent quality enhancement and copper/gold color grading

set -e

PROJECT_ROOT="/data/@projects/hairathome"
FRAMES_DIR="$PROJECT_ROOT/static/images/movie-frames"
OUTPUT_DIR="$PROJECT_ROOT/static/images/movie-frames-enhanced"
COMFYUI_OUTPUT="/data/StabilityMatrix/Packages/ComfyUI/output"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Top 20 frames from analysis (sorted by quality/file size)
FRAMES=(
    "frame-0026.jpg"
    "frame-0029.jpg"
    "frame-0025.jpg"
    "frame-0028.jpg"
    "frame-0027.jpg"
    "frame-0034.jpg"
    "frame-0033.jpg"
    "frame-0031.jpg"
    "frame-0030.jpg"
    "frame-0032.jpg"
    "frame-0039.jpg"
    "frame-0038.jpg"
    "frame-0023.jpg"
    "frame-0024.jpg"
    "frame-0022.jpg"
    "frame-0037.jpg"
    "frame-0021.jpg"
    "frame-0020.jpg"
    "frame-0040.jpg"
    "frame-0044.jpg"
)

echo "=================================================="
echo "Movie Frame Enhancement - Batch Processing"
echo "=================================================="
echo ""

# Copy frames to ComfyUI input directory
echo "Step 1: Copying frames to ComfyUI input..."
for i in "${!FRAMES[@]}"; do
    frame="${FRAMES[$i]}"
    src="$FRAMES_DIR/$frame"

    if [[ ! -f "$src" ]]; then
        echo "  ✗ $frame not found, skipping"
        continue
    fi

    cp "$src" "/data/StabilityMatrix/Packages/ComfyUI/input/$frame"
    echo "  [$((i+1))/${#FRAMES[@]}] Copied: $frame"
done

echo ""
echo "Step 2: Queuing enhancement jobs..."

# Submit each frame for enhancement
for i in "${!FRAMES[@]}"; do
    frame="${FRAMES[$i]}"

    # Generate random seed
    SEED=$RANDOM
    SEED=$((SEED * 1000 + RANDOM))

    # Create workflow JSON
    WORKFLOW=$(cat <<EOF
{
  "prompt": {
    "1": {
      "class_type": "CheckpointLoaderSimple",
      "inputs": {
        "ckpt_name": "juggernautXL_ragnarokBy.safetensors"
      }
    },
    "2": {
      "class_type": "LoadImage",
      "inputs": {
        "image": "$frame"
      }
    },
    "3": {
      "class_type": "VAEEncode",
      "inputs": {
        "pixels": ["2", 0],
        "vae": ["1", 2]
      }
    },
    "4": {
      "class_type": "CLIPTextEncode",
      "inputs": {
        "text": "professional hair stylist service, at-home salon experience, warm inviting atmosphere, photorealistic, cinematic lighting, high quality, sharp details, copper and gold color tones, premium photography, warm color grading",
        "clip": ["1", 1]
      }
    },
    "5": {
      "class_type": "CLIPTextEncode",
      "inputs": {
        "text": "blurry, low quality, distorted, unnatural colors, oversaturated, artifacts, watermark, cold colors, blue tint",
        "clip": ["1", 1]
      }
    },
    "6": {
      "class_type": "KSampler",
      "inputs": {
        "model": ["1", 0],
        "positive": ["4", 0],
        "negative": ["5", 0],
        "latent_image": ["3", 0],
        "seed": $SEED,
        "steps": 25,
        "cfg": 7.5,
        "sampler_name": "dpmpp_2m",
        "scheduler": "karras",
        "denoise": 0.3
      }
    },
    "7": {
      "class_type": "VAEDecode",
      "inputs": {
        "samples": ["6", 0],
        "vae": ["1", 2]
      }
    },
    "8": {
      "class_type": "SaveImage",
      "inputs": {
        "images": ["7", 0],
        "filename_prefix": "enhanced_${frame%.*}"
      }
    }
  }
}
EOF
)

    # Submit to ComfyUI
    RESPONSE=$(curl -s -X POST http://127.0.0.1:8188/prompt \
        -H "Content-Type: application/json" \
        -d "$WORKFLOW")

    PROMPT_ID=$(echo "$RESPONSE" | jq -r '.prompt_id // empty')

    if [[ -n "$PROMPT_ID" ]]; then
        echo "  [$((i+1))/${#FRAMES[@]}] Queued: $frame (ID: ${PROMPT_ID:0:8}...)"
    else
        echo "  [$((i+1))/${#FRAMES[@]}] ✗ Failed to queue: $frame"
        echo "    Response: $RESPONSE"
    fi

    # Small delay between submissions to avoid overwhelming
    sleep 0.5
done

echo ""
echo "=================================================="
echo "✓ All frames queued for enhancement!"
echo ""
echo "Monitor progress:"
echo "  - Check ComfyUI web UI at http://127.0.0.1:8188"
echo "  - Output will appear in: $COMFYUI_OUTPUT"
echo ""
echo "After completion, run:"
echo "  cp $COMFYUI_OUTPUT/enhanced_frame* $OUTPUT_DIR/"
echo "=================================================="
