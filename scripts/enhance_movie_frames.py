#!/usr/bin/env python3
"""
Enhance top 20 movie frames using img2img workflow.
Applies consistent quality enhancement and copper/gold color grading.
"""

import requests
import json
import os
import sys
from pathlib import Path

# ComfyUI API endpoint
COMFYUI_URL = "http://127.0.0.1:8188"

# Top 20 frames from analysis
TOP_FRAMES = [
    "frame-0026.jpg",  # 236KB
    "frame-0029.jpg",  # 225KB
    "frame-0025.jpg",  # 214KB
    "frame-0028.jpg",  # 206KB
    "frame-0027.jpg",  # 204KB
    "frame-0034.jpg",  # 201KB
    "frame-0033.jpg",  # 200KB
    "frame-0031.jpg",  # 192KB
    "frame-0030.jpg",  # 187KB
    "frame-0032.jpg",  # 184KB
    "frame-0039.jpg",  # 170KB
    "frame-0038.jpg",  # 166KB
    "frame-0023.jpg",  # 164KB
    "frame-0024.jpg",  # 161KB
    "frame-0022.jpg",  # 159KB
    "frame-0037.jpg",  # 154KB
    "frame-0021.jpg",  # 153KB
    "frame-0020.jpg",  # 147KB
    "frame-0040.jpg",  # 144KB
    "frame-0044.jpg",  # 142KB
]

# Paths
PROJECT_ROOT = Path("/data/@projects/hairathome")
FRAMES_DIR = PROJECT_ROOT / "static/images/movie-frames"
OUTPUT_DIR = PROJECT_ROOT / "static/images/movie-frames-enhanced"

def load_workflow():
    """Load the img2img enhancement workflow."""
    workflow_path = PROJECT_ROOT / "scripts/img2img_enhance_workflow.json"
    with open(workflow_path) as f:
        return json.load(f)

def upload_image(image_path):
    """Upload image to ComfyUI input directory."""
    filename = os.path.basename(image_path)

    # First copy to ComfyUI input directory
    comfy_input = Path("/home/j_kro/.stabilitymatrix/Packages/ComfyUI/input")
    import shutil
    shutil.copy(image_path, comfy_input / filename)

    return filename

def queue_workflow(workflow, image_name):
    """Submit workflow to ComfyUI queue."""
    # Update workflow with the image filename
    workflow["2"]["inputs"]["image"] = image_name

    # Randomize seed for variety
    import random
    workflow["6"]["inputs"]["seed"] = random.randint(1, 999999999)

    # Submit to queue
    response = requests.post(
        f"{COMFYUI_URL}/prompt",
        json={"prompt": workflow}
    )

    if response.status_code != 200:
        print(f"Error queuing workflow: {response.text}")
        return None

    return response.json().get("prompt_id")

def check_queue_status():
    """Check current queue status."""
    response = requests.get(f"{COMFYUI_URL}/queue")
    if response.status_code == 200:
        data = response.json()
        queue_running = data.get("queue_running", [])
        queue_pending = data.get("queue_pending", [])
        return len(queue_running), len(queue_pending)
    return 0, 0

def main():
    """Main enhancement process."""
    print("=" * 60)
    print("Movie Frame Enhancement Script")
    print("=" * 60)

    # Create output directory
    OUTPUT_DIR.mkdir(exist_ok=True)

    # Load workflow
    workflow = load_workflow()
    print(f"\n✓ Loaded img2img workflow")

    # Process each frame
    print(f"\nProcessing {len(TOP_FRAMES)} frames...")

    for i, frame in enumerate(TOP_FRAMES, 1):
        frame_path = FRAMES_DIR / frame

        if not frame_path.exists():
            print(f"✗ {frame} not found, skipping")
            continue

        print(f"\n[{i}/{len(TOP_FRAMES)}] Processing {frame}...")

        # Upload to ComfyUI
        image_name = upload_image(str(frame_path))
        print(f"  Uploaded: {image_name}")

        # Queue the workflow
        prompt_id = queue_workflow(workflow, image_name)

        if prompt_id:
            print(f"  Queued: {prompt_id}")

            # Check queue depth
            running, pending = check_queue_status()
            print(f"  Queue: {pending} pending, {running} running")

            if pending > 3:
                print(f"  Waiting for queue to clear...")
                import time
                time.sleep(30)
        else:
            print(f"  Failed to queue")

    print("\n" + "=" * 60)
    print("All frames queued for enhancement!")
    print(f"Output will be saved to: {OUTPUT_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()
