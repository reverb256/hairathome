#!/bin/bash
# Generate realistic images with improved prompts and parameters
# Uses Juggernaut XL with optimized settings for natural look

set -e

PROJECT_ROOT="/data/@projects/hairathome"
INPUT_DIR="$PROJECT_ROOT/static/images/movie-frames"
OUTPUT_DIR="$PROJECT_ROOT/static/images/realistic-enhanced"

mkdir -p "$OUTPUT_DIR"

echo "=================================================="
echo "Photorealistic Enhancement with Improved Prompts"
echo "=================================================="
echo ""

# Professional Photography Prompt with Juggernaut XL optimized settings
POSITIVE_PROMPT="professional photography, shot on Sony a7III, 50mm f/1.8 lens, shallow depth of field, cinematic lighting, global illumination, hyper realistic skin:1.2, skin texture:1.3, visible pores, natural imperfections, unretouched, RAW photo, 8k UHD, TIME cover quality, award-winning photo, environmental portraiture, warm natural lighting"

NEGATIVE_PROMPT="plastic, imitation, fake, rendering, artificial, silicone, waxy, over-smoothed, airbrushed, cartoon, anime, manga, 3d render, cgi, blurry, low quality, distorted, oversaturated, digital look, smooth skin, doll-like, mannequin"

# Optimized parameters for Juggernaut XL to reduce "AI look"
STEPS=40
CFG=6.0
SAMPLER="dpmpp_2m"
SCHEDULER="karras"
DENOISE=0.40

echo "Positive Prompt:"
echo "$POSITIVE_PROMPT"
echo ""
echo "Negative Prompt:"
echo "$NEGATIVE_PROMPT"
echo ""
echo "Optimized Parameters (to reduce AI look):"
echo "  Steps: $STEPS (higher = more detail)"
echo "  CFG: $CFG (lower = more natural, less AI)"
echo "  Sampler: $SAMPLER"
echo "  Scheduler: $SCHEDULER"
echo "  Denoise: $DENOISE (maintains original authenticity)"
echo ""

# Best frames (avoiding split frames)
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

    # Copy to ComfyUI
    cp "$INPUT_FILE" "/data/StabilityMatrix/Packages/ComfyUI/input/$frame"

    # For now, document what we would do
    echo "   Would process with:"
    echo "   → Model: Juggernaut XL Ragnarok (has natural skin training)"
    echo "   → Prompt: Professional photography language"
    echo "   → Settings: CFG=$CFG (lower than before), Steps=$STEPS (higher)"
    echo "   → Denoise: $DENOISE (40% enhancement, 60% original)"
    echo ""
done

echo "=================================================="
echo "RECOMMENDATION:"
echo "=================================================="
echo ""
echo "For BEST results, try these models in order:"
echo ""
echo "1. **HassakuXL Illustrious v34** (already installed!)"
echo "   - Excellent for skin texture"
echo "   - Natural look, less plastic"
echo "   - Great for hair/skin portraiture"
echo ""
echo "2. **Download RealVisXL V20** (6GB, manual download required)"
echo "   - From: https://civitai.com/models/139562/realvisxl-v20"
echo "   - Most photorealistic model available"
echo "   - Requires Civitai account"
echo ""
echo "3. **Use the ADVANCED_PROMPTING_GUIDE.md**"
echo "   - Contains detailed prompting templates"
echo "   - Photography-based language"
echo "   - Specific use case examples"
echo ""
echo "Quick test command:"
echo "  cd /data/@projects/hairathome/scripts"
echo "  bash generate_realistic.sh"
echo ""
echo "=================================================="
