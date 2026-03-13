#!/usr/bin/env bash
# Submit all HassakuXL workflows to ComfyUI

COMFYUI_API="http://localhost:8188/prompt"

echo "=================================================="
echo "Submitting workflows to ComfyUI"
echo "=================================================="
echo ""

count=0
for workflow in /tmp/hassaku_frame-*.json; do
    count=$((count + 1))
    filename=$(basename "$workflow" .json)
    echo "[$count/20] Submitting: $filename"

    # Wrap workflow in "prompt" key for ComfyUI API
    wrapped_json=$(cat "$workflow" | jq -n --argjson workflow "$(cat "$workflow")" '{"prompt": $workflow}')

    # Submit to ComfyUI API
    response=$(curl -s -X POST "$COMFYUI_API" \
        -H "Content-Type: application/json" \
        -d "$wrapped_json")

    # Extract prompt_id
    prompt_id=$(echo "$response" | grep -o '"prompt_id":"[^"]*"' | cut -d'"' -f4)

    if [[ -n "$prompt_id" ]]; then
        echo "   → Queue ID: $prompt_id"
    else
        echo "   ✗ Failed: $response"
    fi

    echo ""

    # Small delay to avoid overwhelming the queue
    sleep 0.5
done

echo "=================================================="
echo "All workflows submitted!"
echo "=================================================="
echo ""
echo "Monitor progress:"
echo "  - Open ComfyUI: http://localhost:8188"
echo "  - Check queue: View Queue Manager"
echo ""
echo "Output will be in:"
echo "  /data/StabilityMatrix/Packages/ComfyUI/output/"
echo ""
