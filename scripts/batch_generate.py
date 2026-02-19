#!/usr/bin/env python3
"""
Hair@Home ComfyUI Batch Image Generator

Requirements:
1. Install photorealistic SDXL models (Juggernaut XL, Realistic Vision, etc.)
2. ComfyUI running on http://127.0.0.1:8188
3. Update MODEL_NAME below with your installed photorealistic model
"""
import json
import urllib.request
import urllib.parse
import time
import sys
import os
from pathlib import Path

# ============ CONFIGURATION ============
COMFYUI_URL = "http://127.0.0.1:8188"
# UPDATE THIS with your photorealistic model filename
MODEL_NAME = "juggernautXL_ragnarokBy.safetensors"  # Change after installing
OUTPUT_DIR = "/data/@projects/hairathome/static/images/stock/"
COMFY_OUTPUT = "/data/StabilityMatrix/Packages/ComfyUI/output/"
# ========================================

# Generation settings
STEPS = 30
CFG = 7.5
SAMPLER = "dpmpp_2m"
SCHEDULER = "karras"
WIDTH = 1024
HEIGHT = 1024

def load_prompts():
    """Load image prompts from JSON file"""
    prompt_file = Path(__file__).parent / "image_prompts.json"
    with open(prompt_file, 'r') as f:
        return json.load(f)

def create_workflow(prompt, negative, seed):
    """Create ComfyUI workflow JSON"""
    return {
        "3": {
            "inputs": {
                "seed": seed,
                "steps": STEPS,
                "cfg": CFG,
                "sampler_name": SAMPLER,
                "scheduler": SCHEDULER,
                "denoise": 1,
                "model": ["4", 0],
                "positive": ["6", 0],
                "negative": ["7", 0],
                "latent_image": ["5", 0]
            },
            "class_type": "KSampler"
        },
        "4": {
            "inputs": {"ckpt_name": MODEL_NAME},
            "class_type": "CheckpointLoaderSimple"
        },
        "5": {
            "inputs": {
                "width": WIDTH,
                "height": HEIGHT,
                "batch_size": 1
            },
            "class_type": "EmptyLatentImage"
        },
        "6": {
            "inputs": {"text": prompt, "clip": ["4", 1]},
            "class_type": "CLIPTextEncode"
        },
        "7": {
            "inputs": {"text": negative, "clip": ["4", 1]},
            "class_type": "CLIPTextEncode"
        },
        "8": {
            "inputs": {"samples": ["3", 0], "vae": ["4", 2]},
            "class_type": "VAEDecode"
        },
        "9": {
            "inputs": {"filename_prefix": "hairathome_gen", "images": ["8", 0]},
            "class_type": "SaveImage"
        }
    }

def queue_prompt(workflow):
    """Send workflow to ComfyUI queue"""
    prompt_data = json.dumps({"prompt": workflow}).encode('utf-8')
    req = urllib.request.Request(
        f"{COMFYUI_URL}/prompt",
        data=prompt_data,
        headers={'Content-Type': 'application/json'}
    )
    try:
        response = urllib.request.urlopen(req)
        return json.loads(response.read())
    except urllib.error.HTTPError as e:
        print(f"  Error: {e.code} - {e.read().decode()}")
        return None

def get_queue_info():
    """Check queue status"""
    try:
        req = urllib.request.Request(f"{COMFYUI_URL}/queue")
        response = urllib.request.urlopen(req)
        return json.loads(response.read())
    except:
        return None

def get_history(prompt_id):
    """Get generation history"""
    try:
        req = urllib.request.Request(f"{COMFYUI_URL}/history/{prompt_id}")
        response = urllib.request.urlopen(req)
        return json.loads(response.read())
    except:
        return None

def wait_for_completion(prompt_id, timeout=180):
    """Wait for generation to complete"""
    start = time.time()
    while time.time() - start < timeout:
        queue_info = get_queue_info()
        if queue_info:
            running = queue_info.get('queue_running', [])
            pending = queue_info.get('queue_pending', [])

            our_prompt_running = any(item[1] == prompt_id for item in running)
            our_prompt_pending = any(item[1] == prompt_id for item in pending)

            if not our_prompt_running and not our_prompt_pending:
                # Get history to find output image
                history = get_history(prompt_id)
                if history and prompt_id in history:
                    outputs = history[prompt_id].get('outputs', {})
                    for node_id, node_output in outputs.items():
                        if 'images' in node_output:
                            for img in node_output['images']:
                                return img['filename']
                break

        time.sleep(2)
    return None

def generate_image(prompt_data, category, index, total):
    """Generate a single image"""
    filename = prompt_data['filename']
    positive = prompt_data['prompt']
    negative = prompt_data.get('negative', 'anime, cartoon, illustration, painting, low quality, blurry')
    seed = int(time.time() * 1000) % 2147483647

    print(f"[{index}/{total}] Generating: {filename}")
    print(f"  Category: {category}")
    print(f"  Prompt: {positive[:80]}...")

    workflow = create_workflow(positive, negative, seed)
    result = queue_prompt(workflow)

    if not result or 'prompt_id' not in result:
        print(f"  ✗ Failed to queue!")
        return False

    prompt_id = result['prompt_id']
    print(f"  Queued: {prompt_id}")

    output_file = wait_for_completion(prompt_id)
    if output_file:
        # Copy to target location
        src = Path(COMFY_OUTPUT) / output_file
        dst = Path(OUTPUT_DIR) / filename

        # Create backup if exists
        if dst.exists():
            backup = dst.with_suffix('.jpg.bak')
            dst.rename(backup)

        # Copy and convert to jpg if needed
        if src.suffix == '.png':
            from PIL import Image
            img = Image.open(src)
            rgb_img = img.convert('RGB')
            rgb_img.save(dst, 'JPEG', quality=95)
        else:
            import shutil
            shutil.copy(src, dst)

        print(f"  ✓ Saved to: {dst}")
        return True
    else:
        print(f"  ✗ Timeout or failed!")
        return False

def main():
    print("=" * 60)
    print("Hair@Home ComfyUI Batch Image Generator")
    print("=" * 60)

    # Check model exists
    model_path = Path("/data/StabilityMatrix/Models/StableDiffusion") / MODEL_NAME
    if not model_path.exists():
        print(f"\n✗ ERROR: Model not found: {MODEL_NAME}")
        print(f"  Expected at: {model_path}")
        print("\nPlease install a photorealistic SDXL model and update MODEL_NAME in this script.")
        print("\nRecommended models:")
        print("  - Juggernaut XL")
        print("  - Realistic Vision SDXL")
        print("  - Photon SDXL")
        return 1

    print(f"\nModel: {MODEL_NAME}")
    print(f"Output: {OUTPUT_DIR}\n")

    prompts = load_prompts()
    all_prompts = []

    # Flatten prompts into list with categories
    for category in ['service_cards', 'gallery', 'hero']:
        for item in prompts[category]:
            all_prompts.append((category, item))

    total = len(all_prompts)
    success = 0
    failed = 0

    print(f"Total images to generate: {total}")
    print("-" * 60)

    for i, (category, prompt_data) in enumerate(all_prompts, 1):
        if generate_image(prompt_data, category, i, total):
            success += 1
        else:
            failed += 1
        time.sleep(1)  # Brief pause between generations

    print("-" * 60)
    print(f"\nResults: {success} succeeded, {failed} failed out of {total} total")

    if failed > 0:
        print("\nTip: Check ComfyUI console for errors")
        return 1

    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\nInterrupted by user")
        sys.exit(1)
