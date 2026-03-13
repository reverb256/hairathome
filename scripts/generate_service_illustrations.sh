#!/usr/bin/env bash
# Generate illustrative service images with Juggernaut XL
set -e

MODEL="juggernautXL_ragnarokBy.safetensors"
OUTPUT_DIR="/data/@projects/hairathome/static/images/service-illustrative"
COMFYUI_API="http://localhost:8188/prompt"

mkdir -p "$OUTPUT_DIR"

# Service definitions
declare -A SERVICES
SERVICES[haircuts]="Haircuts|1024|1024|abstract scissors icon, clean geometric lines, copper and gold color palette, minimal flat design, vector art style, professional salon iconography"
SERVICES[color]="Color Service|2048|1024|vibrant color spectrum, gradients, paint dripping effects, warm copper and golden tones, artistic color mixing, colorful abstract background"
SERVICES[blowout]="Blowout Service|1024|2048|airflow patterns, wind lines, voluminous hair floating, ethereal soft movement, flowing particles, dreamy atmosphere, airy lightness"
SERVICES[mens]="Men's Cuts|1024|1024|bold geometric shapes, strong masculine lines, dark charcoal and copper contrast, angular patterns, modern barber aesthetic, sharp edges"
SERVICES[updos]="Updo Styles|1024|1024|elegant curved lines, intertwined braiding patterns, structured organic forms, sophisticated updo details, soft feminine curves, intricate styling"
SERVICES[treatments]="Hair Treatments|1024|1024|water drops, organic circles, nurturing patterns, natural textures, soft flowing movement, botanical elements, caring aesthetic"

echo "=================================================="
echo "Generating Illustrative Service Images"
echo "Using: Juggernaut XL Ragnarok"
echo "=================================================="
echo ""

count=0
for service in haircuts color blowout mens updos treatments; do
    IFS='|' read -r NAME WIDTH HEIGHT PROMPT <<< "${SERVICES[$service]}"

    count=$((count + 1))
    FILENAME="${NAME,,}_illustrative"

    echo "[$count/6] $NAME"
    echo "   Size: ${WIDTH}x$HEIGHT"
    echo "   Concept: $PROMPT"

    # Create workflow with Juggernaut XL (txt2img)
    cat > "/tmp/service_${service}.json" <<EOF
{
  "1": {
    "class_type": "CheckpointLoaderSimple",
    "inputs": {
      "ckpt_name": "$MODEL"
    }
  },
  "2": {
    "class_type": "CLIPTextEncode",
    "inputs": {
      "text": "$PROMPT, flat design, vector illustration, minimal aesthetic, professional iconography, 8k UHD, award-winning illustration",
      "clip": ["1", 1]
    }
  },
  "3": {
    "class_type": "CLIPTextEncode",
    "inputs": {
      "text": "photorealistic, photo, realistic, 3d render, cgi, blurry, low quality, distorted, ugly, bad anatomy, messy, chaotic",
      "clip": ["1", 1]
    }
  },
  "4": {
    "class_type": "EmptyLatentImage",
    "inputs": {
      "width": $WIDTH,
      "height": $HEIGHT,
      "batch_size": 1
    }
  },
  "5": {
    "class_type": "KSampler",
    "inputs": {
      "seed": $RANDOM,
      "steps": 25,
      "cfg": 7.5,
      "sampler_name": "dpmpp_2m",
      "scheduler": "karras",
      "denoise": 1.0,
      "model": ["1", 0],
      "positive": ["2", 0],
      "negative": ["3", 0],
      "latent_image": ["4", 0]
    }
  },
  "6": {
    "class_type": "VAEDecode",
    "inputs": {
      "samples": ["5", 0],
      "vae": ["1", 2]
    }
  },
  "7": {
    "class_type": "SaveImage",
    "inputs": {
      "images": ["6", 0],
      "filename_prefix": "$FILENAME"
    }
  }
}
EOF

    # Submit to ComfyUI
    wrapped_json=$(printf '{"prompt":')
    cat "/tmp/service_${service}.json" >> /tmp/wrapped.json
    printf '}' >> /tmp/wrapped.json

    response=$(curl -s -X POST "$COMFYUI_API" \
        -H "Content-Type: application/json" \
        -d @/tmp/wrapped.json)

    prompt_id=$(echo "$response" | grep -o '"prompt_id":"[^"]*"' | cut -d'"' -f4)

    if [[ -n "$prompt_id" ]]; then
        echo "   ✓ Queued: $prompt_id"
    else
        echo "   ✗ Failed: $response"
    fi

    echo ""
    sleep 1
done

echo "=================================================="
echo "All 6 illustrative service images queued!"
echo "Output: $OUTPUT_DIR"
echo "=================================================="
echo ""
echo "Monitor progress at: http://localhost:8188"
