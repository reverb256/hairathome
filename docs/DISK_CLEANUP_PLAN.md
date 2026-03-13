# Disk Space Analysis and Cleanup Plan

## Current Status
- **Disk**: /dev/nvme1n1p2
- **Size**: 922G
- **Used**: 904G (99%)
- **Available**: 18G

## Space Usage Breakdown

| Directory | Size | Percentage |
|-----------|------|------------|
| /data/@games | 460G | 51% |
| /data/StabilityMatrix | 333G | 37% |
| /data/@projects | 78G | 9% |

## Cleanup Opportunities (Ranked by Impact)

### 1. DELETE: Archived Project (59G) ⭐⭐⭐
**Path**: `/data/@projects/archive/DELETED-comprehensive-revenue-architecture-only`
**Size**: 59G
**Action**: Already marked DELETED, safe to remove
**Command**: `rm -rf /data/@projects/archive/DELETED-comprehensive-revenue-architecture-only`

### 2. REMOVE: Duplicate/Unused Models (100G+) ⭐⭐⭐

#### Wan2GP Duplicate Variants (~84G)
These appear to be duplicate models with only slight variations:
```
/data/StabilityMatrix/Packages/Wan2GP/ckpts/
├── wan2.2_text2video_14B_low_quanto_mbf16_int8.safetensors      (14G)
├── wan2.2_text2video_14B_high_quanto_mbf16_int8.safetensors     (14G)
├── wan2.2_image2video_14B_low_quanto_mbf16_int8.safetensors     (14G)
├── wan2.2_image2video_14B_high_quanto_mbf16_int8.safetensors    (14G)
├── wan22EnhancedLightning_v2I2VFP8LOW.safetensors              (14G)
├── wan22EnhancedLightning_v2I2VFP8HIGH.safetensors             (14G)
└── wan2.1_text2video_14B_quanto_mbf16_int8.safetensors         (14G)
```

**Recommendation**: Keep one version of each (low or high quanto), remove duplicates
**Potential savings**: 42-56G

#### Duplicate GGUF Models (7.8G)
```
/data/StabilityMatrix/Models/StableDiffusion/
├── nsfwWanUMT5XXLGGUF_q5AndQ4KM.gguf           (3.9G)
└── nsfwWanUMT5XXLGGUF_q5AndQ4KM (1).gguf        (3.9G) ← DUPLICATE
```

**Action**: Remove duplicate
**Command**: `rm "/data/StabilityMatrix/Models/StableDiffusion/nsfwWanUMT5XXLGGUF_q5AndQ4KM (1).gguf"`
**Savings**: 3.9G

#### Similar Model Versions (~40G)
Multiple versions of similar models:
```
novaFurryXL_ilV160.safetensors  (6.5G)
novaFurryXL_ilV155.safetensors  (6.5G) ← OLDER VERSION

novaAnimeXL_ilV160.safetensors  (6.5G)
(possibly other older versions)
```

**Recommendation**: Keep latest versions (v160), remove older (v155)
**Potential savings**: 6.5-13G

### 3. CLEAN: ComfyUI Package (16G) ⭐⭐

**Current breakdown**:
- ComfyUI installation: 16G total
- Models/checkpoints: 6.7G (juggernautXL_v9)
- Input files: 28M (51 source images)
- Output: 0 (auto-cleaned)

**Recommendation**: The ComfyUI directory is reasonable size. Only clean if unused.

### 4. ARCHIVE: Old Projects (~5G) ⭐

**Already archived projects** that could be deleted or moved:
```
/data/@projects/archive/
├── DELETED-Polybot-simulation-only    (287M) ← Already DELETED
├── mindframe                          (513M)
├── AstralDev                          (1.2G)
└── DELETED-QuantumRhythm...           (1.2G) ← Already DELETED
```

**Action**: Review and remove if no longer needed
**Potential savings**: 2-3G

### 5. CONSIDER: Moving @games (460G) ⭐⭐⭐
**Path**: `/data/@games`
**Size**: 460G
**Note**: This is 51% of disk usage

**Options**:
1. Move games to separate disk/partition
2. Use symlink to new location
3. External storage for less-played games

## Immediate Actions (Quick Wins)

### Step 1: Remove DELETED Project (59G)
```bash
rm -rf /data/@projects/archive/DELETED-comprehensive-revenue-architecture-only
```

### Step 2: Remove Duplicate GGUF Model (3.9G)
```bash
rm "/data/StabilityMatrix/Models/StableDiffusion/nsfwWanUMT5XXLGGUF_q5AndQ4KM (1).gguf"
```

### Step 3: Review and Remove Duplicate Wan2GP Models (42-56G)
```bash
# After confirming which versions are needed
cd /data/StabilityMatrix/Packages/Wan2GP/ckpts/

# Example: Keep low quanto, remove high quanto
rm wan2.2_text2video_14B_high_quanto_mbf16_int8.safetensors
rm wan2.2_image2video_14B_high_quanto_mbf16_int8.safetensors
# etc.
```

### Step 4: Remove Older Model Versions (6.5-13G)
```bash
rm /data/StabilityMatrix/Models/StableDiffusion/novaFurryXL_ilV155.safetensors
# Check for other older versions before removing
```

## Expected Space Recovery

| Action | Space Recovered | Risk |
|--------|-----------------|------|
| Remove DELETED project | 59G | None |
| Remove duplicate GGUF | 3.9G | None |
| Remove Wan2GP duplicates | 42-56G | Low (keep one variant) |
| Remove old model versions | 6.5-13G | Low (keep latest) |
| **Total Immediate** | **111-132G** | |

After cleanup: **~150G available** (16% free)

## Maintenance Commands

### Check disk usage
```bash
df -h /data
du -sh /data/* | sort -rh
```

### Find large files
```bash
find /data -type f -size +1G 2>/dev/null | xargs ls -lh
```

### Find duplicates (by size)
```bash
find /data -type f -size +1G 2>/dev/null -exec ls -lh {} \; | awk '{print $5, $9}' | sort | uniq -D -f1
```

## Long-term Recommendations

1. **Implement定期清理**: Schedule regular cleanup of old files
2. **Model management**: Remove unused/old model versions
3. **Archive rotation**: Move old projects to cold storage
4. **Separate storage**: Consider separate disk for games or large media files
5. **Compress archives**: Use tar.gz for long-term archives

## Before Running Cleanup

1. **Backup important data**
2. **Confirm model usage** with StabilityMatrix
3. **Test ComfyUI** after removing models
4. **Verify games** work after moving

## Cleanup Script

```bash
#!/bin/bash
set -e

echo "=== Disk Cleanup for /data ==="
echo "Current space:"
df -h /data

echo ""
echo "Step 1: Remove DELETED project (59G)..."
rm -rfv /data/@projects/archive/DELETED-comprehensive-revenue-architecture-only

echo ""
echo "Step 2: Remove duplicate GGUF model (3.9G)..."
rm -v "/data/StabilityMatrix/Models/StableDiffusion/nsfwWanUMT5XXLGGUF_q5AndQ4KM (1).gguf"

echo ""
echo "Step 3: Review Wan2GP models (MANUAL REVIEW NEEDED)..."
ls -lh /data/StabilityMatrix/Packages/Wan2GP/ckpts/*.safetensors

echo ""
echo "=== Cleanup complete ==="
echo "New space:"
df -h /data
```

Save as `/data/cleanup-disk.sh` and run with:
```bash
chmod +x /data/cleanup-disk.sh
sudo /data/cleanup-disk.sh
```
