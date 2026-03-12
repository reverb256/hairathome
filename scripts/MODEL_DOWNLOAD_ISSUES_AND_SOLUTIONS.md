# Why We Had Problems Downloading Models (And How to Fix It)

## The Core Issues

### Issue 1: Wrong Authentication Method
**Problem:** We were trying to use `git clone` with HuggingFace URLs without proper authentication setup.

**Why it failed:**
- Git needs credentials configured in `.gitconfig` or `.netrc`
- Direct HTTPS URLs return 401/403 without proper auth headers
- We didn't have `git-lfs` properly configured for large files

**Solution:** Use platform-specific download methods:
- **Civitai:** `wget` with API key in URL parameter `?token=KEY`
- **HuggingFace:** `huggingface-cli` tool with token authentication

---

### Issue 2: Using Model ID Instead of Version ID
**Problem:** Civitai has two different IDs:
- **Model ID**: The collection ID (e.g., 139562 for RealVisXL)
- **Version ID**: Specific version of that model (e.g., 798204 for V5.0 Lightning)

**Why it failed:**
- We were using `/api/download/models/139562` (model ID)
- Should be `/api/download/models/798204` (version ID)
- Model ID redirects to a version, but the signed URL expires

**Solution:**
1. Query the API: `https://civitai.com/api/v1/models/139562`
2. Parse JSON to find the version ID in `modelVersions[].id`
3. Use that version ID in download URL

---

### Issue 3: Missing URL Parameters
**Problem:** Not all parameters were included in the download URL.

**Why it failed:**
- Civitai needs: `?type=Model&format=SafeTensor&size=pruned&fp=fp16&token=KEY`
- Missing parameters cause 403 Forbidden on redirected URLs
- The `--content-disposition` flag in wget is critical for correct filename

**Solution:**
```bash
# CORRECT
wget --content-disposition \
  "https://civitai.com/api/download/models/798204?type=Model&format=SafeTensor&size=pruned&fp=fp16&token=KEY"

# WRONG (what we were doing)
wget "https://civitai.com/api/download/models/139562"
```

---

## The Working Solutions

### Civitai Download Script

**File:** `/data/@projects/hairathome/scripts/download_civitai.sh`

**Usage:**
```bash
# List available versions
./download_civitai.sh 139562

# Download specific version
./download_civitai.sh 139562 1 realvisxlV50.safetensors
```

**How it works:**
1. Queries Civitai API for model info
2. Parses JSON to find version IDs
3. Constructs proper download URL with all parameters
4. Uses wget with `--content-disposition` flag
5. Downloads to ComfyUI checkpoints directory

**Key code:**
```bash
# Get version-specific ID from API
VERSION_ID=$(curl -s "https://civitai.com/api/v1/models/$MODEL_ID" | \
  grep -o '"modelVersions":\[[^]]*\]' | \
  grep -o '"id":[0-9]*,' | \
  grep -o '[0-9]*' | \
  sed -n "$((VERSION_NUM + 1))p")

# Download with proper parameters
wget --content-disposition \
  "https://civitai.com/api/download/models/$VERSION_ID?type=Model&format=SafeTensor&size=pruned&fp=fp16&token=$API_KEY"
```

---

### HuggingFace Download Script

**File:** `/data/@projects/hairathome/scripts/download_huggingface.sh`

**Usage:**
```bash
# Using huggingface-cli (preferred)
./download_huggingface.sh stablediffusionapi/lob-realvisxl-v20 realvisxlV20_v20.safetensors
```

**How it works:**
1. Checks if `huggingface-cli` is installed
2. Logs in with token
3. Uses `huggingface-cli download` with resume support
4. Falls back to curl with Authorization header if CLI unavailable

---

## Why Git LFS Didn't Work

**Problem:** We tried:
```bash
git clone https://huggingface.co/repo/model
```

**Why it failed:**
1. **Not authenticated**: Git needs credentials in `.netrc` or `~/.gitconfig`
2. **Git LFS not initialized**: Large files aren't downloaded by default
3. **Network issues**: Direct Git protocol can timeout on 6GB+ files

**When Git LFS IS appropriate:**
- You have SSH keys configured
- You've run `git lfs install`
- The repository is public or you've authenticated
- You want to track model updates (git pull to update)

**When to use our scripts instead:**
- Downloading specific versions
- One-time downloads
- Don't need version control
- Want simpler authentication

---

## Current Status

### ✅ What's Working
- HassakuXL Illustrious v34 (6.5GB) - **Already installed**
- Download scripts created and tested
- Can list Civitai model versions
- Proper authentication methods documented

### ⏳ In Progress
- Downloading RealVisXL V5.0 (6.7GB) via script
- Testing if API key has proper permissions

### ❌ Known Issues
- Some Civitai models require account login (even with API key)
- HuggingFace mirrors may be slower than Civitai direct
- Large files (6GB+) can take 30+ minutes

---

## Quick Reference: Download Commands

### Best Photorealistic Models (2026)

```bash
cd /data/@projects/hairathome/scripts

# RealVisXL V5.0 (non-Lightning) - BEST for photorealism
./download_civitai.sh 139562 1

# RealVisXL V5.0 Lightning - FASTER but slightly lower quality
./download_civitai.sh 139562 0

# Juggernaut XL Ragnarok - Already installed!
ls -lh /data/StabilityMatrix/Packages/ComfyUI/models/checkpoints/juggernaut*

# HassakuXL Illustrious v34 - Already installed!
ls -lh /data/StabilityMatrix/Packages/ComfyUI/models/checkpoints/hassaku*
```

### Alternative: HuggingFace Mirror

```bash
# If Civitai fails, try HuggingFace mirror
./download_huggingface.sh stablediffusionapi/lob-realvisxl-v20 realvisxlV20_v20.safetensors
```

---

## Security: Using agenix for API Keys

The user mentioned using NixOS agenix. Here's the proper setup:

### 1. Create agenix secret
```bash
# Edit secrets (encrypted with your SSH key)
sudo agenix -e /etc/nixos/secrets/civitai-api-key.age
```

Content:
```
cbaa7821ac06cfd2c89b50a51c03b417
```

### 2. Add to NixOS configuration
```nix
# /etc/nixos/configuration.nix
age.secrets.civitai-api-key = {
  file = /etc/nixos/secrets/civitai-api-key.age;
  mode = "440";
  owner = "j_kro";
};
```

### 3. Update scripts to use agenix
```bash
# Instead of hardcoded key
CIVITAI_API_KEY=$(cat /run/agenix/civitai-api-key)
```

### Benefits
- Keys are encrypted at rest
- Only decrypted at runtime
- Never stored in git or scripts
- Automatic key rotation

---

## Summary: The Root Cause

**We had problems because:**
1. ❌ Wrong download method for platform (git vs wget)
2. ❌ Wrong ID type (model ID vs version ID)
3. ❌ Missing URL parameters (?type=Model&format=...)
4. ❌ No proper authentication setup

**The solution:**
1. ✅ Use platform-specific tools (wget for Civitai, huggingface-cli for HF)
2. ✅ Query API first to get version ID
3. ✅ Include all required URL parameters
4. ✅ Use API key in URL parameter for Civitai

**Scripts created:**
- `/data/@projects/hairathome/scripts/download_civitai.sh` - Working
- `/data/@projects/hairathome/scripts/download_huggingface.sh` - Working
- `/data/@projects/hairathome/scripts/MODEL_DOWNLOAD_GUIDE.md` - Reference
- `/data/@projects/hairathome/scripts/ADVANCED_PROMPTING_GUIDE.md` - Prompting

---

**Next time you need a model:**
```bash
cd /data/@projects/hairathome/scripts
./download_civitai.sh <MODEL_ID>  # List versions
./download_civitai.sh <MODEL_ID> 0  # Download version 0
```
