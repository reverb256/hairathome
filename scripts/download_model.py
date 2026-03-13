#!/usr/bin/env python3
"""
Download HuggingFace models for ComfyUI/StabilityMatrix
Uses the securely stored token from ~/.config/huggingface/token
"""
import os
import sys
from pathlib import Path

# Add StabilityMatrix Python to path
sys.path.insert(0, '/data/StabilityMatrix/Packages/ComfyUI/venv/lib/python3.12/site-packages')

from huggingface_hub import snapshot_download, login

# Model configurations
MODELS = {
    "FLUX-schnell": {
        "repo_id": "black-forest-labs/FLUX.1-schnell",
        "target_dir": "/data/StabilityMatrix/Models/Diffusers",
        "size_gb": 12,
        "description": "Fast text-to-image with text rendering"
    },
    "SDXL-Lightning": {
        "repo_id": "ByteDance/SDXL-Lightning",
        "target_dir": "/data/StabilityMatrix/Models/StableDiffusion",
        "size_gb": 2,
        "description": "4-step fast generation for previews"
    }
}

def main():
    # Check token
    token_path = Path.home() / '.config/huggingface/token'
    if not token_path.exists():
        print("❌ HuggingFace token not found. Please run setup first.")
        return 1

    token = token_path.read_text().strip()
    print(f"✓ Token found: {token[:10]}...{token[-4:]}")

    # Login
    try:
        login(token=token)
        print("✓ Logged in to HuggingFace")
    except Exception as e:
        print(f"❌ Login failed: {e}")
        return 1

    # List available models
    print("\nAvailable models to download:")
    for i, (name, info) in enumerate(MODELS.items(), 1):
        print(f"{i}. {name}")
        print(f"   Size: ~{info['size_gb']}GB")
        print(f"   {info['description']}")
        print(f"   Target: {info['target_dir']}")

    print("\nTo download, use:")
    print("  python3 scripts/download_model.py FLUX-schnell")
    print("  python3 scripts/download_model.py SDXL-Lightning")
    print("  python3 scripts/download_model.py all")

    # Download if model specified
    if len(sys.argv) > 1:
        model_name = sys.argv[1]

        if model_name == "all":
            for name in MODELS:
                download_model(name)
        elif model_name in MODELS:
            download_model(model_name)
        else:
            print(f"❌ Unknown model: {model_name}")
            return 1

    return 0

def download_model(name):
    """Download a specific model"""
    info = MODELS[name]
    print(f"\n📥 Downloading {name}...")

    try:
        snapshot_download(
            repo_id=info['repo_id'],
            local_dir=info['target_dir'],
            local_dir_use_symlinks=False,
            resume_download=True
        )
        print(f"✓ {name} downloaded successfully to {info['target_dir']}")
    except Exception as e:
        print(f"❌ Failed to download {name}: {e}")
        return 1

    return 0

if __name__ == "__main__":
    sys.exit(main())
