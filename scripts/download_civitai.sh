#!/usr/bin/env bash
# Civitai Model Download Script with API Key Authentication
# Usage: ./download_civitai.sh <MODEL_ID> [VERSION_NUMBER] [OUTPUT_FILENAME]

set -e

CIVITAI_API_KEY="cbaa7821ac06cfd2c89b50a51c03b417"
COMFYUI_CHECKPOINT_DIR="/data/StabilityMatrix/Packages/ComfyUI/models/checkpoints"

if [[ -z "$1" ]]; then
    echo "Usage: $0 <MODEL_ID> [VERSION_NUMBER] [OUTPUT_FILENAME]"
    echo ""
    echo "Example:"
    echo "  $0 139562 0                    # Downloads RealVisXL V5.0 version 0"
    echo "  $0 139562 0 realvisxl.safetensors  # Custom filename"
    echo ""
    echo "To find MODEL_ID:"
    echo "  1. Visit https://civitai.com/"
    echo "  2. Find your model"
    echo "  3. Copy ID from URL: https://civitai.com/models/THIS_NUMBER/..."
    echo ""
    echo "To find VERSION_NUMBER:"
    echo "  Run without version to see list: $0 <MODEL_ID>"
    exit 1
fi

MODEL_ID="$1"
VERSION_NUM="${2:-0}"
OUTPUT_NAME="${3:-auto}"

echo "========================================"
echo "Civitai Model Downloader"
echo "========================================"
echo "Model ID: $MODEL_ID"
echo "API Key: ${CIVITAI_API_KEY:0:8}..."
echo ""

# Fetch model info
echo "Fetching model info..."
MODEL_INFO=$(curl -s "https://civitai.com/api/v1/models/$MODEL_ID")

if echo "$MODEL_INFO" | grep -q "error"; then
    echo "✗ Model not found or API error!"
    echo "Check the model ID: $MODEL_ID"
    exit 1
fi

# Parse model versions
VERSIONS=$(echo "$MODEL_INFO" | grep -o '"modelVersions":\[[^]]*\]' | sed 's/"modelVersions"://' | tr ']' '\n' | tr ',' '\n')

# Count versions
VERSION_COUNT=$(echo "$MODEL_INFO" | grep -o '"id":[0-9]*,' | grep -c version || echo "0")

echo "Available versions: $VERSION_COUNT"
echo ""

# List versions if no specific version requested or if requested
if [[ -z "$2" ]]; then
    echo "Available versions:"
    echo "$MODEL_INFO" | grep -o '"name":"[^"]*","baseModel":"[^"]*"' | head -10 | nl
    echo ""
    echo "Usage: $0 $MODEL_ID <VERSION_NUMBER>"
    echo ""
    echo "Example: $0 $MODEL_ID 0  (downloads first version)"
    exit 0
fi

# Get the specific version ID
echo "Downloading version: $VERSION_NUM"

# Extract version ID using json parsing
MODEL_VERSION_INFO=$(echo "$MODEL_INFO" | grep -o '"modelVersions":\[[^]]*\]' | sed 's/.*"id":\([0-9]*\).*/\1/' | head -1)

# Get the actual version ID by parsing the JSON properly
# This is a simplified approach - for production use jq
VERSION_ID=$(echo "$MODEL_INFO" | grep -o '"id":[0-9]*,' | grep -o '[0-9]*' | sed -n "$((VERSION_NUM + 1))p")

if [[ -z "$VERSION_ID" ]]; then
    echo "✗ Could not find version $VERSION_NUM"
    echo "Available versions: 0 to $((VERSION_COUNT - 1))"
    exit 1
fi

echo "Version ID: $VERSION_ID"
echo ""

# Construct download URL with VERSION ID not model ID
DOWNLOAD_URL="https://civitai.com/api/download/models/$VERSION_ID?type=Model&format=SafeTensor&size=pruned&fp=fp16&token=$CIVITAI_API_KEY"

# Get model name for filename
MODEL_NAME=$(echo "$MODEL_INFO" | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4 | sed 's/[\/:*?"<>|]/_/g')

if [[ "$OUTPUT_NAME" == "auto" ]]; then
    OUTPUT_NAME="${MODEL_NAME// /_}_v${VERSION_NUM}.safetensors"
fi

OUTPUT_PATH="$COMFYUI_CHECKPOINT_DIR/$OUTPUT_NAME"

echo "Model Name: $MODEL_NAME"
echo "Download URL: (hidden for security)"
echo "Output: $OUTPUT_PATH"
echo ""
echo "Starting download..."
echo ""

# Download with proper content-disposition
wget --content-disposition \
     --show-progress \
     --continue \
     -O "$OUTPUT_PATH" \
     "$DOWNLOAD_URL"

if [[ $? -eq 0 ]]; then
    echo ""
    echo "✓ Download complete!"
    ls -lh "$OUTPUT_PATH"
else
    echo ""
    echo "✗ Download failed!"
    echo ""
    echo "Common issues:"
    echo "  1. Invalid API key - Check Civitai account settings"
    echo "  2. Model requires account login - Some models need login"
    echo "  3. Wrong version ID - Try version 0"
    exit 1
fi
