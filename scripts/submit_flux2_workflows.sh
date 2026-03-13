#!/usr/bin/env bash
# Submit Flux.2 workflows using Python for better JSON handling

cat << 'PYTHON_SCRIPT' > /tmp/submit_flux2.py
import json
import requests
import glob
import time

COMFYUI_API = "http://localhost:8188/prompt"

workflows = sorted(glob.glob("/tmp/flux2_frame-*.json"))

print(f"Found {len(workflows)} workflows")
print()

for i, workflow_path in enumerate(workflows, 1):
    filename = workflow_path.split("/")[-1]

    # Load workflow
    with open(workflow_path) as f:
        workflow = json.load(f)

    # Wrap in prompt key
    payload = {"prompt": workflow}

    # Submit
    try:
        response = requests.post(COMFYUI_API, json=payload)
        data = response.json()

        if "prompt_id" in data:
            print(f"[{i}/{len(workflows)}] {filename}")
            print(f"   ✓ Queued: {data['prompt_id']}")
        else:
            print(f"[{i}/{len(workflows)}] {filename}")
            print(f"   ✗ Failed: {data}")
    except Exception as e:
        print(f"[{i}/{len(workflows)}] {filename}")
        print(f"   ✗ Error: {e}")

    time.sleep(0.5)

print()
print("All workflows submitted!")
PYTHON_SCRIPT

python3 /tmp/submit_flux2.py
