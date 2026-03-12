# Disk Cleanup - Completed Report

**Date**: 2025-02-19
**Status**: ✅ Safe cleanup complete

## Results

### Disk Space Change
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Used | 904G | 840G | **-64G** |
| Free | 18G | 81G | **+63G** |
| Usage % | 99% | 92% | **-7%** |

## Actions Completed

### 1. Removed DELETED Projects (60.5G)
```
✅ DELETED-comprehensive-revenue-architecture-only  (59G)
✅ DELETED-QuantumRhythm-philosophical-narrative    (1.2G)
✅ DELETED-Polybot-simulation-only                  (287M)
✅ DELETED-AstralDev-thorchain                      (16K)
✅ DELETED-AstralDev-crypto-trading-ml              (12K)
```

### 2. Removed Duplicate Model (3.9G)
```
✅ nsfwWanUMT5XXLGGUF_q5AndQ4KM (1).gguf  (3.9G duplicate)
```

## Deduplication Analysis

### Exact Duplicates: 0 found
- No files with identical content
- Wan2GP high/low quanto models are different (different precision)
- All VAE files are unique

### Symlinks (Good - No Duplication)
ComfyUI properly uses symlinks to central model repository:
- `hassakuXLIllustrious_v34` → `/data/StabilityMatrix/Models/StableDiffusion/`
- `juggernautXL_ragnarokBy` → `/data/StabilityMatrix/Models/StableDiffusion/`
- `flux2Klein_9bBase` → `/data/StabilityMatrix/Models/StableDiffusion/`

## Additional Cleanup Opportunities

### High Priority (42G potential) - Requires Review

**Wan2GP Model Variants**
These are high/low precision variants. Could remove HIGH quanto versions:

```bash
# Keep low quanto (more efficient), remove high quanto
/data/StabilityMatrix/Packages/Wan2GP/ckpts/
├── wan2.2_text2video_14B_low_quanto    (14G) ← KEEP
├── wan2.2_text2video_14B_high_quanto   (14G) ← CAN REMOVE
├── wan2.2_image2video_14B_low_quanto   (14G) ← KEEP
├── wan2.2_image2video_14B_high_quanto  (14G) ← CAN REMOVE
├── wan22EnhancedLightning_v2I2VFP8LOW  (14G) ← KEEP
└── wan22EnhancedLightning_v2I2VFP8HIGH (14G) ← CAN REMOVE
```

**Note**: These are functional variants, not exact duplicates. Review usage before removing.

### Medium Priority (~3G) - Archive Review

```
/data/@projects/archive/
├── mindframe    (513M) - Review if needed
└── AstralDev    (1.2G) - Review if needed
```

## Current Status

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme1n1p2  922G  840G   81G  92% /data
```

**Status**: ✅ Critical (99%) → Moderate (92%)
**Available**: 81G free
**Recommended**: Keep above 50G free (5%)

## Recommendations

1. ✅ **Complete**: Safe cleanup done
2. ⚠️ **Review**: Wan2GP high/low variants (42G potential)
3. 📦 **Archive**: Old projects to external storage
4. 💾 **Long-term**: Move @games (460G) to separate disk

## Commands for Future Cleanup

To remove Wan2GP high-quanto variants (after confirming not needed):

```bash
# Backup first
mkdir -p /backup/wan2gp_high_quanto
mv /data/StabilityMatrix/Packages/Wan2GP/ckpts/*high_quanto*.safetensors /backup/wan2gp_high_quanto/
mv /data/StabilityMatrix/Packages/Wan2GP/ckpts/*HIGH.safetensors /backup/wan2gp_high_quanto/

# Test StabilityMatrix still works
# If OK after 1 week, remove backup:
# rm -rf /backup/wan2gp_high_quanto
```

## Monitoring

Check disk usage weekly:
```bash
df -h /data
du -sh /data/* | sort -rh | head -10
```
