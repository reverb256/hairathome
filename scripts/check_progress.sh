#!/bin/bash
# Monitor movie frame enhancement progress

COMFYUI_OUTPUT="/data/StabilityMatrix/Packages/ComfyUI/output"
OUTPUT_DIR="/data/@projects/hairathome/static/images/movie-frames-enhanced"
EXPECTED=20

echo "=================================================="
echo "Movie Frame Enhancement Progress"
echo "=================================================="
echo ""

# Count enhanced frames in ComfyUI output
ENHANCED=$(ls "$COMFYUI_OUTPUT"/enhanced_frame*.png 2>/dev/null | wc -l)
echo "Enhanced frames in ComfyUI output: $ENHANCED / $EXPECTED"

# Count frames copied to project directory
COPIED=$(ls "$OUTPUT_DIR"/frame-*-enhanced.png 2>/dev/null | wc -l)
echo "Frames copied to project: $COPIED / $EXPECTED"

echo ""
echo "Latest enhanced frames:"
ls -lht "$COMFYUI_OUTPUT"/enhanced_frame*.png 2>/dev/null | head -5 | awk '{print "  " $9 " (" $5 ")"}'

echo ""
if [[ $ENHANCED -lt $EXPECTED ]]; then
    echo "Status: Processing... ($(($EXPECTED - ENHANCED)) remaining)"
else
    echo "Status: ✓ Complete! Ready to copy to project."
fi
echo "=================================================="
