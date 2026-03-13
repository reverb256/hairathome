# Model Download Guide - Working Methods 2026

## The Problem We Were Having

We kept failing to download models because:
1. **Wrong authentication methods** - Using git/HTTPS without proper headers
2. **Missing API keys in URLs** - Civitai requires `?token=KEY` parameter
3. **Not using huggingface-cli** - Direct wget doesn't handle authentication well

## The Solution

### Civitai Downloads - WORKING METHOD

**Method 1: Script (Recommended)**
```bash
cd /data/@projects/hairathome/scripts
./download_civitai.sh 139562
```

**Method 2: Manual wget**
```bash
# Replace MODEL_ID and API_KEY
wget --content-disposition \
  "https://civitai.com/api/download/models/MODEL_ID?type=Model&format=SafeTensor&size=pruned&fp=fp16&token=API_KEY"
```

**Example - Download RealVisXL V20:**
```bash
./download_civitai.sh 139562 realvisxl_v20.safetensors
```

**How to find MODEL_ID:**
1. Visit https://civitai.com/models/139562/realvisxl-v20
2. The number after `/models/` is the ID: `139562`

---

### HuggingFace Downloads - WORKING METHOD

**Method 1: huggingface-cli (Recommended)**
```bash
# Install first
pip install 'huggingface_hub[cli]'

# Login
huggingface-cli login --token hf_YOUR_TOKEN

# Download
huggingface-cli download \
  repo_id \
  filename.safetensors \
  --local-dir /path/to/output \
  --resume-download
```

**Method 2: Script (Easiest)**
```bash
cd /data/@projects/hairathome/scripts
./download_huggingface.sh stablediffusionapi/lob-realvisxl-v20 realvisxlV20_v20.safetensors
```

**Example - Download from HuggingFace:**
```bash
./download_huggingface.sh \
  runwayml/stable-diffusion-v1-5 \
  v1-5-pruned.safetensors
```

---

## Common Models to Download

### Photorealistic Models (2026)

| Model | Civitai ID | Size | Best For |
|-------|-----------|------|----------|
| **RealVisXL V20** | 139562 | 6.3GB | Best photorealism |
| **RealVisXL V5.0** | 139562 (v5) | 6.3GB | Natural look |
| **Juggernaut XL** | 62342 | 6.7GB | Already installed |
| **HassakuXL Illustrious** | - | 6.5GB | Already installed |

### Download Commands

```bash
# RealVisXL V20 (Civitai)
./download_civitai.sh 139562 realvisxl_v20.safetensors

# Or from HuggingFace mirror
./download_huggingface.sh stablediffusionapi/lob-realvisxl-v20 realvisxlV20_v20.safetensors
```

---

## Troubleshooting

### "401 Unauthorized" or "403 Forbidden"
**Cause:** Invalid or missing API key
**Fix:**
- Civitai: Get key from https://civitai.com/user/settings (scroll to bottom)
- HuggingFace: Get key from https://huggingface.co/settings/tokens

### "Model not found"
**Cause:** Wrong model ID or repo path
**Fix:**
- Verify the ID from the website URL
- Make sure the model is public or you have access

### "Connection timeout"
**Cause:** Network issues or file too large
**Fix:**
- Use `--continue` flag (included in scripts)
- Try different mirror (Civitai vs HuggingFace)

---

## API Key Security with NixOS (agenix)

The user mentioned using agenix to manage keys in `/etc/nixos`. Here's how:

### 1. Install agenix
```nix
# /etc/nixos/configuration.nix
environment.systemPackages = [ agenix ];
```

### 2. Create secrets file
```bash
# Edit secrets (will encrypt with your SSH key)
sudo编辑 /etc/nixos/secrets/civitai-api-key.age
```

Content:
```
cbaa7821ac06cfd2c89b50a51c03b417
```

### 3. Add to configuration
```nix
# /etc/nixos/configuration.nix
age.secrets.civitai-api-key = {
  file = /etc/nixos/secrets/civitai-api-key.age;
  mode = "440";
  owner = "your-user";
};
```

### 4. Use in scripts
```bash
# Read from agenix-managed file
CIVITAI_API_KEY=$(cat /run/agenix/civitai-api-key)
```

---

## Quick Start

```bash
# Download RealVisXL V20 right now
cd /data/@projects/hairathome/scripts
./download_civitai.sh 139562

# Or download any other model
./download_civitai.sh <MODEL_ID_FROM_URL>
```

---

**Key Takeaway:** The `--content-disposition` flag in wget and proper token in URL parameters are what make Civitai downloads work!
