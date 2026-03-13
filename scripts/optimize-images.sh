#!/usr/bin/env bash
# Image optimization script for Hair@Home
# Converts PNG files to WebP format using ImageMagick or ffmpeg
# Works with both static/ (source) and docs/ (built) directories

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SOURCE_DIR="$PROJECT_DIR/static/images"
BUILD_DIR="$PROJECT_DIR/docs/images"

echo "🖼️  Hair@Home Image Optimization Script"
echo "=========================================="
echo ""

# Check for image conversion tools
CONVERT_CMD=""
if command -v cwebp &> /dev/null; then
    CONVERT_CMD="cwebp"
    echo "✅ Using cwebp for conversion"
elif command -v convert &> /dev/null; then
    CONVERT_CMD="convert"
    echo "✅ Using ImageMagick for conversion"
elif command -v magick &> /dev/null; then
    CONVERT_CMD="magick"
    echo "✅ Using ImageMagick (magick) for conversion"
elif command -v ffmpeg &> /dev/null; then
    CONVERT_CMD="ffmpeg"
    echo "✅ Using ffmpeg for conversion"
else
    echo "❌ Error: No image conversion tool found."
    echo "   Install with nix: nix-shell -p imagemagick"
    echo "   Or system package: apt install webp/imagemagick"
    exit 1
fi

# Function to convert images in a directory
convert_images() {
    local base_dir="$1"
    local dir_name="$2"

    if [ ! -d "$base_dir/stock" ]; then
        echo "⏭️  Skipping $dir_name (no stock/ directory)"
        return
    fi

    local webp_dir="$base_dir/stock/webp"
    mkdir -p "$webp_dir"

    # Count PNG files
    local png_count=$(find "$base_dir/stock" -name "*.png" -type f 2>/dev/null | wc -l)
    echo "📊 $dir_name: Found $png_count PNG files"

    if [ "$png_count" -eq 0 ]; then
        return
    fi

    # Convert PNG to WebP
    local converted=0
    local skipped=0
    local failed=0

    for png_file in $(find "$base_dir/stock" -name "*.png" -type f 2>/dev/null); do
        filename=$(basename "$png_file")
        webp_file="$webp_dir/${filename%.png}.webp"

        # Check if WebP already exists and is newer
        if [ -f "$webp_file" ] && [ "$webp_file" -nt "$png_file" ]; then
            SKIPPED=$((SKIPPED + 1))
        else
            echo "  🔄 $filename"

            case "$CONVERT_CMD" in
                cwebp)
                    cwebp -q 85 "$png_file" -o "$webp_file" > /dev/null 2>&1
                    ;;
                convert|magick)
                    $CONVERT_CMD "$png_file" -quality 85 "$webp_file" > /dev/null 2>&1
                    ;;
                ffmpeg)
                    ffmpeg -i "$png_file" -quality 85 -y "$webp_file" > /dev/null 2>&1
                    ;;
            esac

            if [ -f "$webp_file" ]; then
                converted=$((converted + 1))
            else
                failed=$((failed + 1))
            fi
        fi
    done

    echo "  ✅ Converted: $converted | Skipped: $skipped | Failed: $failed"
    CONVERTED_TOTAL=$((CONVERTED_TOTAL + converted))
    SKIPPED_TOTAL=$((SKIPPED_TOTAL + skipped))
    FAILED_TOTAL=$((FAILED_TOTAL + failed))
}

# Process both directories
CONVERTED_TOTAL=0
SKIPPED_TOTAL=0
FAILED_TOTAL=0

echo ""
echo "📁 Processing source images (static/)..."
convert_images "$SOURCE_DIR" "Source"

echo ""
echo "📁 Processing built images (docs/)..."
convert_images "$BUILD_DIR" "Build"

echo ""
echo "=========================================="
echo "✅ Total: $CONVERTED_TOTAL converted, $SKIPPED_TOTAL skipped"
if [ $FAILED_TOTAL -gt 0 ]; then
    echo "   ⚠️  $FAILED_TOTAL failed"
fi
echo ""
echo "💡 To use WebP images in Hugo templates:"
echo ""
cat <<'EOF'
1. Use the responsive-image partial:
   {{ partial "responsive-image.html" (dict "src" "images/stock/image.png" "alt" "Description") }}

2. Or use manual picture element:
   <picture>
     <source srcset="images/stock/webp/image.webp" type="image/webp">
     <img src="images/stock/image.png" alt="Description" loading="lazy">
   </picture>

3. Run after Hugo build: npm run build && bash scripts/optimize-images.sh
EOF
echo ""
