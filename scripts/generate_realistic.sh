#!/bin/bash
# Generate photorealistic images with advanced prompting
# Uses RealVisXL V20 with professional photography parameters

set -e

PROJECT_ROOT="/data/@projects/hairathome"
INPUT_DIR="$PROJECT_ROOT/static/images/movie-frames"
OUTPUT_DIR="$PROJECT_ROOT/static/images/realistic-enhanced"

mkdir -p "$OUTPUT_DIR"

# Better frames from original video (avoiding split frames)
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
)

echo "=================================================="
echo "Photorealistic Enhancement with RealVisXL V20"
echo "=================================================="
echo ""

# Professional Photography Prompt Template
POSITIVE_PROMPT="professional photography, shot on Sony a7III, 50mm f/1.8 lens, shallow depth of field, cinematic lighting, global illumination, hyper realistic skin:1.2, skin texture:1.3, visible pores, natural imperfections, unretouched, RAW photo, 8k UHD, TIME cover quality, award-winning photo, environmental portraiture, warm natural lighting, soft shadows"

NEGATIVE_PROMPT="plastic, imitation, fake, rendering, artificial, silicone, waxy, over-smoothed, airbrushed, cartoon, anime, manga, 3d render, cgi, blurry, low quality, distorted, oversaturated, digital look, smooth skin, doll-like"

# Enhanced parameters for RealVisXL
STEPS=35
CFG=6.5
SAMPLER="dpmpp_2m"
SCHEDULER="karras"
DENOISE=0.45

echo "Prompt Template:"
echo "$POSITIVE_PROMPT"
echo ""
echo "Parameters:"
echo "  Steps: $STEPS"
echo "  CFG: $CFG"
echo "  Sampler: $SAMPLER"
echo "  Scheduler: $SCHEDULER"
echo "  Denoise: $DENOISE"
echo ""

count=0
for frame in "${FRAMES[@]}"; do
    INPUT_FILE="$INPUT_DIR/$frame"

    if [[ ! -f "$INPUT_FILE" ]]; then
        echo "⚠️  $frame not found, skipping"
        continue
    fi

    count=$((count + 1))
    OUTPUT_NAME="${frame%.jpg}_realistic"

    echo "[$count/${#FRAMES[@]}] Processing: $frame"
    echo "   Input:  $INPUT_FILE"
    echo "   Output: $OUTPUT_DIR/${OUTPUT_NAME}.png"

    # Copy to ComfyUI input
    cp "$INPUT_FILE" "/data/StabilityMatrix/Packages/ComfyUI/input/$frame"

    # For now, show what we would do
    # Actual generation requires the workflow to be loaded
    echo "   → Would process with RealVisXL V20"
    echo "   → Apply ControlNet depth for framing control"
    echo ""
done

echo "=================================================="
echo "Next Steps:"
echo "=================================================="
echo ""
echo "1. RealVisXL V20 is downloading (6GB)"
echo "   Once complete, it will be available in ComfyUI"
echo ""
echo "2. Install ControlNet depth model:"
echo "   wget https://huggingface.co/lllyasviel/sd-controlnet-depth/resolve/main/diffusion_pytorch_control_net_depth.safetensors"
echo "   → ~/.stabilitymatrix/Packages/ComfyUI/models/controlnet/"
echo ""
echo "3. Advanced photography controls workflow:"
echo "   - Camera angle: 0-360° horizontal"
echo "   - Elevation: -30° to 90° vertical"
echo "   - Zoom/Distance: 0-10"
echo "   - Field of View (FOV): 0-360°"
echo ""
echo "4. Prompt customization examples:"
echo ""
echo "   Close-up portrait:"
echo "   \"$POSITIVE_PROMPT, close-up portraiture, 85mm lens, f/2.2 aperture\""
echo ""
echo "   Environmental shot:"
echo "   \"$POSITIVE_PROMPT, wide angle shot, 35mm lens, environmental portraiture, salon interior\""
echo ""
echo "   Mid-distance:"
echo "   \"$POSITIVE_PROMPT, medium shot, 50mm lens, conversational framing\""
echo ""
echo "=================================================="
