#!/usr/bin/env python3
"""
Simple ComfyUI Image Generator
"""
import json
import urllib.request
import urllib.parse
import urllib.error
import time
import sys
import os

COMFYUI_URL = "http://127.0.0.1:8188"

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
        print(f"Error: {e.code} - {e.read().decode()}")
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

def main():
    # Load workflow
    workflow_file = "/data/@projects/hairathome/scripts/comfy_workflow.json"
    with open(workflow_file, 'r') as f:
        workflow = json.load(f)

    print("Sending workflow to ComfyUI...")
    result = queue_prompt(workflow)

    if not result or 'prompt_id' not in result:
        print("Failed to queue prompt!")
        return 1

    prompt_id = result['prompt_id']
    print(f"Queued! Prompt ID: {prompt_id}")

    # Wait for completion
    print("Waiting for generation...")
    max_wait = 120  # seconds
    start = time.time()

    while time.time() - start < max_wait:
        queue_info = get_queue_info()
        if queue_info:
            running = queue_info.get('queue_running', [])
            pending = queue_info.get('queue_pending', [])

            # Check if our prompt is done (not in running or pending)
            our_prompt_running = any(item[1] == prompt_id for item in running)
            our_prompt_pending = any(item[1] == prompt_id for item in pending)

            if not our_prompt_running and not our_prompt_pending:
                print("Generation complete!")
                # Get history to find output image
                history = get_history(prompt_id)
                if history and prompt_id in history:
                    outputs = history[prompt_id].get('outputs', {})
                    for node_id, node_output in outputs.items():
                        if 'images' in node_output:
                            for img in node_output['images']:
                                img_path = f"/data/StabilityMatrix/Packages/ComfyUI/output/{img['filename']}"
                                print(f"Image saved to: {img_path}")
                                return 0
                break

        time.sleep(1)

    print("Timed out waiting for generation")
    return 1

if __name__ == "__main__":
    sys.exit(main())
