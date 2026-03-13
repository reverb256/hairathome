#!/usr/bin/env bash
# HuggingFace Model Download Script with Token Authentication
# Usage: ./download_huggingface.sh <REPO_ID> <FILENAME> [OUTPUT_DIR]

set -e

# HuggingFace token - set via environment variable or replace with your own
# Get your token at: https://huggingface.co/settings/tokens
HF_TOKEN="${HF_TOKEN:-}"
COMFYUI_CHECKPOINT_DIR="/data/StabilityMatrix/Packages/ComfyUI/models/checkpoints"

if [[ -z "$1" ]] || [[ -z "$2" ]]; then
    echo "Usage: $0 <REPO_ID> <FILENAME> [OUTPUT_DIR]"
    echo ""
    echo "Example:"
    echo "  $0 stablediffusionapi/lob-realvisxl-v20 realvisxlV20_v20.safetensors"
    echo "  $0 runwayml/stable-diffusion-v1-5 v1-5-pruned.safetensors /custom/path"
    echo ""
    echo "To find REPO_ID and FILENAME:"
    echo "  1. Visit https://huggingface.co/models"
    echo "  2. Find your model"
    echo "  3. Copy from URL: https://huggingface.co/REPO_ID/..."
    echo "  4. Click 'Files and versions' to find exact filename"
    exit 1
fi

REPO_ID="$1"
FILENAME="$2"
OUTPUT_DIR="${3:-$COMFYUI_CHECKPOINT_DIR}"

mkdir -p "$OUTPUT_DIR"

echo "========================================"
echo "HuggingFace Model Downloader"
echo "========================================"
echo "Repo: $REPO_ID"
echo "File: $FILENAME"
echo "Output: $OUTPUT_DIR"
echo "Token: ${HF_TOKEN:0:10}..."
echo ""

# Use huggingface-cli if available
if command -v huggingface-cli &> /dev/null; then
    echo "Using huggingface-cli..."
    echo ""

    # Login with token
    echo "$HF_TOKEN" | huggingface-cli login --token

    # Download
    huggingface-cli download \
        "$REPO_ID" \
        "$FILENAME" \
        --local-dir "$OUTPUT_DIR" \
        --local-dir-use-symlinks False \
        --resume-download

    if [[ $? -eq 0 ]]; then
        echo ""
        echo "✓ Download complete!"
        ls -lh "$OUTPUT_DIR/$FILENAME"
    fi
else
    # Fallback to wget/curl
    echo "huggingface-cli not found, using direct download..."
    echo ""

    BASE_URL="https://huggingface.co/${REPO_ID}/resolve/main/${FILENAME}"
    OUTPUT_PATH="$OUTPUT_DIR/${FILENAME}"

    curl -L \
         -H "Authorization: Bearer $HF_TOKEN" \
         -o "$OUTPUT_PATH" \
         "$BASE_URL"

    if [[ $? -eq 0 ]]; then
        echo ""
        echo "✓ Download complete!"
        ls -lh "$OUTPUT_PATH"
    else
        echo ""
        echo "✗ Download failed!"
        echo ""
        echo "Install huggingface-cli for better results:"
        echo "  pip install 'huggingface_hub[cli]'"
        exit 1
    fi
fi
