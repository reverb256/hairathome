#!/bin/bash
# Optimize enhanced frames for web (convert PNG to JPEG)

set -e

ENHANCED_DIR="/data/@projects/hairathome/static/images/movie-frames-enhanced"

mkdir -p "$ENHANCED_DIR"
cd "$ENHANCED_DIR"

echo "=================================================="
echo "Converting Enhanced Frames to Web-Optimized JPEG"
echo "=================================================="
echo ""

count=0
for png_file in frame-*-enhanced.png; do
    if [[ ! -f "$png_file" ]]; then
        continue
    fi

    count=$((count + 1))
    jpg_file="${png_file%.png}.jpg"

    echo "[$count] Converting: $png_file"

    # Convert to JPEG with quality 85 and max 1200px
    ffmpeg -i "$png_file" \
        -q:v 85 \
        -vf "scale=1200:1200:force_original_aspect_ratio=decrease" \
        -y "$jpg_file" \
        -loglevel error 2>&1

    if [[ -f "$jpg_file" ]]; then
        original_size=$(stat -f%z "$png_file" 2>/dev/null || stat -c%s "$png_file" 2>/dev/null)
        optimized_size=$(stat -f%z "$jpg_file" 2>/dev/null || stat -c%s "$jpg_file" 2>/dev/null)

        echo "     PNG: $(numfmt --to=iec $original_size) → JPEG: $(numfmt --to=iec $optimized_size)"
    fi
done

echo ""
echo "=================================================="
echo "✓ Conversion complete!"
echo ""
echo "Location: $ENHANCED_DIR"
echo "=================================================="
