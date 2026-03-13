#!/usr/bin/env bash
# Batch process movie frames with HassakuXL Illustrious v34
# Using advanced photography prompts for natural look

set -e

PROJECT_ROOT="/data/@projects/hairathome"
INPUT_DIR="$PROJECT_ROOT/static/images/movie-frames"
OUTPUT_DIR="$PROJECT_ROOT/static/images/movie-frames-hassaku"

mkdir -p "$OUTPUT_DIR"

# Best frames from analysis
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
echo "Batch Enhancement with HassakuXL Illustrious v34"
echo "=================================================="
echo ""
echo "Total frames: ${#FRAMES[@]}"
echo "Input: $INPUT_DIR"
echo "Output: $OUTPUT_DIR"
echo ""

# Photography prompt for environmental shots
POSITIVE_PROMPT="professional photography, shot on Sony a7III, 35mm f/2.8 lens, wide angle shot, environmental portraiture, showing entire room context, warm natural lighting from large windows, soft shadows, cinematic lighting, global illumination, hyper realistic skin:1.2, skin texture:1.3, visible pores, natural imperfections, unretouched, RAW photo, 8k UHD, TIME cover quality, professional photography, fine art photography"

NEGATIVE_PROMPT="plastic, imitation, fake, rendering, artificial, silicone, waxy, over-smoothed, airbrushed, cartoon, anime, manga, 3d render, cgi, blurry, low quality, distorted, oversaturated, digital look, smooth skin, doll-like, mannequin, close-up, portrait, face shot"

# Load workflow template
WORKFLOW_TEMPLATE="$PROJECT_ROOT/scripts/hassaku_workflow.json"

count=0
for frame in "${FRAMES[@]}"; do
    INPUT_FILE="$INPUT_DIR/$frame"

    if [[ ! -f "$INPUT_FILE" ]]; then
        echo "⚠️  $frame not found, skipping"
        continue
    fi

    count=$((count + 1))
    FRAME_NAME="${frame%.jpg}"

    echo "[$count/${#FRAMES[@]}] Processing: $frame"

    # Copy to ComfyUI input
    cp "$INPUT_FILE" "/data/StabilityMatrix/Packages/ComfyUI/input/$frame"

    # Create workflow JSON for this frame
    cat > "/tmp/hassaku_${FRAME_NAME}.json" <<EOF
{
  "1": {
    "class_type": "CheckpointLoaderSimple",
    "inputs": {
      "ckpt_name": "hassakuXLIllustrious_v34.safetensors"
    }
  },
  "2": {
    "class_type": "LoadImage",
    "inputs": {
      "image": "$frame",
      "upload": "image"
    }
  },
  "3": {
    "class_type": "CLIPTextEncode",
    "inputs": {
      "text": "$POSITIVE_PROMPT",
      "clip": ["1", 1]
    }
  },
  "4": {
    "class_type": "CLIPTextEncode",
    "inputs": {
      "text": "$NEGATIVE_PROMPT",
      "clip": ["1", 1]
    }
  },
  "5": {
    "class_type": "VAEEncode",
    "inputs": {
      "pixels": ["2", 0],
      "vae": ["1", 2]
    }
  },
  "6": {
    "class_type": "KSampler",
    "inputs": {
      "seed": $RANDOM,
      "steps": 40,
      "cfg": 6.0,
      "sampler_name": "dpmpp_2m",
      "scheduler": "karras",
      "denoise": 0.40,
      "model": ["1", 0],
      "positive": ["3", 0],
      "negative": ["4", 0],
      "latent_image": ["5", 0]
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
      "filename_prefix": "${FRAME_NAME}_hassaku"
    }
  }
}
EOF

    # Submit to ComfyUI
    echo "   → Submitting to ComfyUI queue..."

    # Use ComfyUI MCP to enqueue
    # For now, we'll document the workflow
    echo "   → Workflow: /tmp/hassaku_${FRAME_NAME}.json"
    echo ""
done

echo "=================================================="
echo "Next Steps:"
echo "=================================================="
echo ""
echo "All workflows created in /tmp/"
echo "To process, we need to submit them to ComfyUI"
echo ""
echo "Manual method:"
echo "1. Open ComfyUI web interface"
echo "2. Load each workflow JSON from /tmp/"
echo "3. Queue and execute"
echo ""
echo "Or use ComfyUI API:"
echo "curl -X POST http://localhost:8188/prompt \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d @/tmp/hassaku_frame-0026.json"
echo ""
