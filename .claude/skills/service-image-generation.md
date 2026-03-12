# Generate Improved Service Images

Generate high-quality, photorealistic service images for the Hair@Home website using ComfyUI and Juggernaut XL v9.

## Overview

This skill generates 6 service images (haircuts, color, blowout, men's cuts, updos, treatments) with improved framing and composition using macro photography techniques. It supports both img2img (refining existing images) and txt2img (generating from scratch) workflows.

## Prerequisites

- ComfyUI running on http://127.0.0.1:8188
- Juggernaut XL v9 model installed at `/data/StabilityMatrix/Packages/ComfyUI/models/checkpoints/juggernautXL_v9.safetensors`
- Existing service images in `/data/@projects/hairathome/static/images/stock/` (for img2img)
- ComfyUI MCP server connected

## Pre-Flight Checks

Before starting, verify:

```bash
# Check ComfyUI is running
curl -s http://127.0.0.1:8188/system_stats

# Check model exists
ls -lh /data/StabilityMatrix/Packages/ComfyUI/models/checkpoints/juggernautXL_v9.safetensors

# Check MCP server connection
# (Use get_system_stats tool)
```

## Workflow Mode: img2img (Recommended)

Use this mode to refine existing images with better prompts and composition.

### 1. Upload Source Images

Upload the 6 existing service images to ComfyUI's input directory:

```bash
# These images are used as base for img2img generation
service-01-haircut_00001_.png
service-02-color_00001_.png
service-03-blowout_00001_.png
service-04-mens_00001_.png
service-05-updo_00001_.png
service-06-treatments_00001_.png
```

### 2. Generate Images with Improved Prompts

For each service, create an img2img workflow with these settings:

**Common Settings:**
- Model: `juggernautXL_v9.safetensors`
- Sampler: `dpmpp_2m` (DPM++ 2M Karras)
- Scheduler: `karras`
- Steps: 35
- CFG Scale: 6
- Denoise: 0.65
- Resolution: 1200x900 (4:3 aspect ratio)
- Disable random seed: false (use specific seeds)

**Service-Specific Prompts:**

#### Haircuts (seed: 211444581994552)
```
Positive: professional hair salon macro photography, sharp scissors cutting hair, close-up of hair being trimmed, hair strands in focus, scissors positioned at edge of frame, warm copper lighting, clean composition, centered subject, professional tools, Interior Photography, high resolution, sharp focus, shallow depth of field, detailed hair texture, no face, no person, no eyes, only hair and hands

Negative: face, eyes, person, woman, man, people, portrait, head, blurry, low quality, cartoon, anime, illustration, painting, drawing, vector, flat, 2d, cropped, bad composition, poorly framed
```

#### Color (seed: 322355781994553)
```
Positive: professional hair salon macro photography, hair color being applied, brush applying hair dye to hair strands, close-up of hair sections with foil highlights, color palette of copper honey amber, hair swatches and color bottles in background, warm lighting, Interior Photography, high resolution, sharp focus, detailed hair texture, no face, no person, only hair being colored

Negative: face, eyes, person, woman, man, people, portrait, head, blurry, low quality, cartoon, anime, illustration, painting, drawing, vector, flat, 2d, cropped, bad composition
```

#### Blowout (seed: 433466891994554)
```
Positive: professional hair salon macro photography, round brush styling hair, hair dryer and voluminous hair being styled, hairbrush smoothing hair strands, close-up of shiny styled hair with volume, warm golden lighting, hair products and tools arranged aesthetically, Interior Photography, high resolution, sharp focus, glossy hair texture, no face, no person, only hair being styled

Negative: face, eyes, person, woman, man, people, portrait, head, blurry, low quality, cartoon, anime, illustration, painting, drawing, vector, flat, 2d, cropped, bad composition
```

#### Men's Cuts (seed: 544577901994555)
```
Positive: professional barbershop macro photography, hair clippers trimming hair, electric clippers with guard attached, scissors and comb on barber station, close-up of hair being faded, barber tools arranged neatly, warm lighting, Automotive Photography style product shot, high resolution, sharp focus, detailed hair texture, no face, no person, only hair and tools

Negative: face, eyes, person, woman, man, people, portrait, head, blurry, low quality, cartoon, anime, illustration, painting, drawing, vector, flat, 2d, cropped, bad composition
```

#### Updos (seed: 655688011994556)
```
Positive: professional hair salon macro photography, intricate braided updo bun, bobby pins and hair accessories, close-up of braided hair texture, ornate hair styling details, warm rose gold lighting, hair styling tools arranged aesthetically, Interior Photography, high resolution, sharp focus, detailed hair texture, elegant composition, no face, no person, only updo hairstyle

Negative: face, eyes, person, woman, man, people, portrait, head, blurry, low quality, cartoon, anime, illustration, painting, drawing, vector, flat, 2d, cropped, bad composition
```

#### Treatments (seed: 766799121994557)
```
Positive: professional hair salon macro photography, hair treatment products and bowls, application brush applying conditioning treatment to hair strands, close-up of healthy glossy hair, treatment bottles and salon products arranged aesthetically, warm sand lighting, Interior Photography, high resolution, sharp focus, detailed hair texture, nurturing composition, no face, no person, only hair products and hair

Negative: face, eyes, person, woman, man, people, portrait, head, blurry, low quality, cartoon, anime, illustration, painting, drawing, vector, flat, 2d, cropped, bad composition
```

### 3. Workflow JSON Structure

Each workflow follows the ComfyUI img2img pattern:
- Node 1: CheckpointLoaderSimple (loads model)
- Node 2: LoadImage (loads source image)
- Node 3: VAEEncode (encodes image to latent)
- Node 4: CLIPTextEncode (positive prompt)
- Node 5: CLIPTextEncode (negative prompt)
- Node 6: KSampler (sampling with settings)
- Node 7: VAEDecode (decodes latent to image)
- Node 8: SaveImage (saves with prefix)

### 4. Queue and Monitor

1. Upload all 6 source images using `mcp__comfyui-mcp__upload_image`
2. Create and enqueue all 6 workflows using `mcp__comfyui-mcp__enqueue_workflow`
3. Monitor progress using `mcp__comfyui-mcp__get_queue`
4. Each image takes approximately 30-60 seconds

### 5. Install Generated Images

Once generation is complete:
1. Copy images from `/data/StabilityMatrix/Packages/ComfyUI/output/`
2. Rename to match expected filenames in static directory
3. Place in `/data/@projects/hairathome/static/images/stock/`

## Key Improvements

This workflow addresses common AI image generation issues:

1. **Macro Photography Focus**: Uses "macro photography" keyword for tight, detailed framing
2. **Explicit Subject Focus**: "close-up of [specific detail]" ensures correct focus
3. **Composition Control**: "centered subject", "clean composition" for better framing
4. **No Faces/People**: Strong negative prompts prevent any face shots
5. **Tool/Product Emphasis**: Specific tools and products mentioned for each service
6. **Background Elements**: Aesthetic background elements for depth
7. **Texture Details**: Emphasizes hair texture and material details
8. **Brand Lighting**: Warm brand colors (copper, gold, rose, sand) maintained
9. **Aspect Ratio Flexibility**: Generate for multiple layout needs (see below)
10. **Design System Alignment**: Matches website visual language (see below)

## Aspect Ratio Considerations

Different aspect ratios require different composition strategies:

### Square Format (1:1) - for Cards and Gallery
**Resolution:** 1024x1024 or 512x512

**Prompt Additions:**
```
"square frame, centered subject, balanced composition, equal spacing,
rule of thirds, negative space around subject, symmetrical"
```

**Composition Tips:**
- Place subject dead center
- Leave equal margins on all sides
- Avoid edge-of-frame elements
- Use symmetrical arrangements

### Landscape Format (16:9) - for Hero Images
**Resolution:** 1920x1080 or 1600x900

**Prompt Additions:**
```
"wide angle, cinematic, environmental context, shallow depth of field,
foreground detail with blurred background, golden ratio composition,
horizontal format, panoramic view"
```

**Composition Tips:**
- Subject on left or right third
- Environmental context visible
- Background elements for depth
- Cinematic color grading

### Portrait Format (3:4 or 9:16) - for Mobile
**Resolution:** 900x1200 or 1080x1920

**Prompt Additions:**
```
"vertical format, tall composition, top-to-bottom flow,
vertical arrangement, standing orientation, mobile-optimized"
```

**Composition Tips:**
- Vertical flow of elements
- Top-heavy or bottom-heavy layout
- Narrow field of view
- Vertical tool arrangements

### Standard Format (4:3) - for General Use
**Resolution:** 1200x900 or 1024x768

**Prompt Additions:**
```
"balanced frame, traditional photography, standard composition,
well-framed subject, classic proportions"
```

**Composition Tips:**
- Slight horizontal bias
- Good for detail shots
- Versatile cropping options
- Natural field of view

## Output Filenames

### Standard Format (4:3)
- service-haircut-improved_00001_.png
- service-color-improved_00001_.png
- service-blowout-improved_00001_.png
- service-mens-improved_00001_.png
- service-updo-improved_00001_.png
- service-treatments-improved_00001_.png

### Additional Format Variants

For full website integration, generate multiple variants:

| Variant | Resolution | Aspect Ratio | Use Case | Naming |
|---------|------------|--------------|----------|--------|
| Card | 512x512 | 1:1 | Service listing cards | service-[name]-card.png |
| Gallery | 1024x1024 | 1:1 | Homepage gallery | service-[name]-gallery.png |
| Hero | 1920x1080 | 16:9 | Service page headers | service-[name]-hero.png |
| Thumbnail | 256x256 | 1:1 | Navigation/previews | service-[name]-thumb.png |

**Generate all variants** by adjusting resolution and prompt composition (see Aspect Ratio Considerations below).

## Troubleshooting

**Issue**: Faces appearing in images
- **Fix**: Strengthen negative prompt with "no face, no person, no eyes"
- **Alt**: Add "face, eyes, person" to negative prompt with higher weight like "(face:1.3)"

**Issue**: Poor composition/balance
- **Fix**: Add "centered subject", "clean composition" to positive prompt
- **Alt**: Try txt2img mode for complete control over composition

**Issue**: Wrong camera angle
- **Fix**: Specify "macro photography", "close-up of [detail]"
- **Alt**: Add camera angle keywords: "top-down view", "side view", "front view"

**Issue**: Awkward cropping
- **Fix**: Ensure source image has good composition, reduce denoise to 0.6
- **Alt**: Use different source image or switch to txt2img

**Issue**: Not enough detail
- **Fix**: Increase steps to 40, or reduce denoise to 0.7 for more prompt influence
- **Alt**: Add "highly detailed", "intricate details", "8k" to prompt

**Issue**: Images too similar to source
- **Fix**: Increase denoise to 0.75-0.8 for more transformation
- **Alt**: Use txt2img mode for completely new images

**Issue**: ComfyUI not responding
- **Fix**: Check if ComfyUI process is running: `ps aux | grep ComfyUI`
- **Fix**: Restart ComfyUI: navigate to install dir and run main.py
- **Fix**: Check port 8188: `netstat -tlnp | grep 8188`

**Issue**: Out of VRAM errors
- **Fix**: Close other GPU-intensive applications
- **Fix**: Reduce batch size to 1
- **Fix**: Use lower resolution (1024x768 instead of 1200x900)
- **Fix**: Clear VRAM: `mcp__comfyui-mcp__clear_vram`

## Quality Assurance Checklist

After generation, verify each image:

- [ ] No faces or people visible
- [ ] Subject is centered and well-composed
- [ ] Appropriate tools/products are visible for the service
- [ ] Lighting matches brand colors (warm/copper/gold tones)
- [ ] Hair texture is detailed and sharp
- [ ] Image is not cropped awkwardly
- [ ] Background elements add depth without distraction
- [ ] Overall quality is professional and photorealistic

If an image fails any check, regenerate with adjusted prompts or settings.

## Alternative Mode: txt2img

For complete creative control, generate from scratch without source images:

**Key Changes from img2img:**
- Use EmptyLatentImage instead of LoadImage node
- Set resolution: 1200x900 (4:3 aspect ratio)
- Increase denoise to 1.0 (full generation)
- Same prompts, seeds, and other settings

**When to use txt2img:**
- Source images are poor quality
- Want completely new composition
- img2img results are too similar to source
- Need specific camera angles not in source images

## Batch Generation Script

For automated batch processing, create workflows programmatically:

```python
import json
import requests

SERVICES = [
    {"name": "haircut", "seed": 211444581994552, "file": "service-01-haircut_00001_.png"},
    {"name": "color", "seed": 322355781994553, "file": "service-02-color_00001_.png"},
    # ... etc
]

def create_workflow(service):
    # Return workflow JSON for this service
    pass

for service in SERVICES:
    workflow = create_workflow(service)
    # Enqueue via ComfyUI API
    requests.post("http://127.0.0.1:8188/prompt", json={"prompt": workflow})
```

## Post-Processing Options

After generation, consider:

1. **Upscaling**: Use ComfyUI's ImageScale or UltimateSDUpscale for larger versions
2. **Enhancement**: Run through ADetailer or similar for face/detail enhancement (if needed)
3. **Format Conversion**: Convert PNG to WebP for better compression
4. **Color Correction**: Apply slight color grading if needed

## Integration with Hugo

The generated images connect to the website via:

1. **Service pages**: `/themes/hairathome/layouts/services/single.html`
2. **Service listing**: `/themes/hairathome/layouts/services/list.html`
3. **Homepage**: Service cards in `/themes/hairathome/layouts/index.html`

Image paths should be: `/images/stock/service-[name]-improved_00001_.png`

### Design System Integration

**Brand Color Palette:**
- Primary: `brand-copper` (#B87333), `brand-gold` (#FFD700)
- Backgrounds: `brand-cream` (#FFF8E7), `brand-vanilla` (#FFF5E1), `brand-sand` (#E8DCC4)
- Accents: `brand-terracotta`, `brand-rose`, `brand-blush`

**Design Tokens:**
```css
/* Spacing */
--spacing-gap: 0.75rem to 1rem;        /* gap-3 to gap-4 */
--spacing-padding: 1.5rem to 2rem;     /* p-6 to p-8 */

/* Border Radius */
--radius-sm: 0.75rem;                  /* rounded-xl */
--radius-lg: 1rem;                     /* rounded-2xl */

/* Shadows */
--shadow-subtle: shadow-lg;            /* For cards */
--shadow-hover: shadow-xl;             /* Hover state */
```

**Image Container Pattern:**
```html
<div class="gallery-image group relative aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-lg ring-1 ring-brand-copper/10 dark:ring-brand-gold/10">
    <img src="images/stock/service-[name]-gallery.png"
         alt="[Descriptive alt text]"
         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
         loading="lazy">
    <div class="absolute inset-0 bg-gradient-to-t from-brand-charcoal/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
</div>
```

### CSS Integration Tips

**Object Position for Cropping:**
```css
/* Focus on specific areas when aspect ratios differ */
.object-center      { object-position: center; }      /* Default */
.object-top        { object-position: top; }        /* For hair/tools */
.object-bottom     { object-position: bottom; }     /* For products */
```

**Responsive Image Loading:**
```html
<img src="images/stock/service-[name]-card.png"
     srcset="images/stock/service-[name]-card.png 512w,
             images/stock/service-[name]-gallery.png 1024w,
             images/stock/service-[name]-hero.png 1920w"
     sizes="(max-width: 768px) 512px,
            (max-width: 1024px) 1024px,
            1920px"
     alt="[Service name] professional service"
     class="w-full h-full object-cover"
     loading="lazy">
```

### Accessibility Requirements

All images must have:
1. **Descriptive alt text** - Describe the service and tools visible
2. **Semantic context** - Image supports adjacent content
3. **Loading strategy** - Lazy loading for below-fold images
4. **Fallback options** - Graceful degradation if images fail

**Alt Text Examples:**
```
service-haircut.png: "Professional hair cutting service with sharp scissors trimming hair strands"
service-color.png: "Hair color application with brush and foil highlights in warm copper tones"
service-blowout.png: "Hair styling service with round brush creating voluminous blowout"
service-mens.png: "Men's barber service with electric clippers and grooming tools"
service-updo.png: "Formal updo hairstyle with intricate braiding and hair accessories"
service-treatments.png: "Hair treatment service with conditioning products and application tools"
```

## Variations and Alternatives

### Generate Multiple Versions

To create variations, modify:
- **Seed**: Change to any large number for different results
- **Temperature**: Adjust CFG scale (3-9 range, 6 is balanced)
- **Denoise**: 0.6 (subtle) to 0.8 (dramatic change)
- **Resolution**: Try different aspect ratios (square, portrait, landscape)

### Alternative Models

If Juggernaut XL results aren't ideal, try:
- **Realistic Vision**: Excellent for photorealism
- **DreamShaper**: Good balance of realism and style
- **CyberRealistic**: Another strong photorealistic option

## Advanced Prompting Techniques

### Prompt Weighting

Emphasize important elements:
```
(close-up of hair:1.3), (scissors:1.2), macro photography
```

De-emphasize unwanted elements:
```
(face:0.5), (person:0.5)
```

### Composite Prompts

Combine multiple concepts:
```
best quality, professional photography AND macro shot AND (hair styling OR hair tools)
```

### Stepwise Refinement

Generate in stages:
1. Initial generation with basic prompt
2. img2img with detailed prompt using first output
3. Final polish with ADetailer or similar

## Performance Optimization

- **Queue Management**: Process images sequentially to avoid VRAM issues
- **Batch Size**: Keep at 1 for best quality
- **Resolution**: 1200x900 is good balance of quality and speed
- **Steps**: 35-40 is optimal; more steps don't always mean better quality
- **Clear VRAM**: Run between jobs if GPU memory is low

## Reference Files

- Prompts documented in: `/data/@projects/hairathome/docs/IMPROVED_SERVICE_PROMPTS.md`
- Juggernaut research: `/data/@projects/hairathome/docs/MODELS_AND_PROMPTING_RESEARCH.md`
- Model guide: `/data/@projects/hairathome/scripts/MODEL_DOWNLOAD_GUIDE.md`

## Version History

- v1.0: Initial img2img workflow with macro photography prompts
- v1.1: Added pre-flight checks, txt2img mode, QA checklist, troubleshooting
- v1.2: Added quick reference, usage example, performance tips
- v1.3: Added aspect ratio considerations, design system integration, multiple output formats

## Analysis-Based Improvements

Based on actual generation results and website design analysis (see `/data/@projects/hairathome/docs/SERVICE_IMAGE_ANALYSIS_AND_IMPROVEMENTS.md`):

### Key Learnings

1. **Aspect Ratio Mismatch**: Original 4:3 images don't match website's 1:1 gallery squares
   - **Solution**: Generate square variants (1024x1024) for gallery use
   - **Implementation**: Add "square frame, centered composition" to prompts

2. **Service Listing Enhancement**: Current design uses icons only
   - **Opportunity**: Add images to service cards for visual appeal
   - **Implementation**: Create 512x512 card images with consistent framing

3. **Missing Hero Images**: Service detail pages lack visual headers
   - **Opportunity**: Create immersive hero images for each service
   - **Implementation**: Generate 1920x1080 images with environmental context

4. **Responsive Needs**: Different breakpoints require different image sizes
   - **Solution**: Generate multiple variants per service
   - **Implementation**: Use srcset with card/gallery/hero variants

### Design System Alignment

**Color Consistency:**
- Match generated images to brand palette (copper, gold, sand)
- Use warm lighting prompts for consistency
- Ensure good contrast for accessibility

**Shape Consistency:**
- Square images for gallery (1:1)
- Landscape for heroes (16:9)
- Rounded corners in CSS (rounded-xl/2xl)

**Interaction Consistency:**
- Hover scale effects (scale-110)
- Subtle ring borders (ring-brand-copper/10)
- Smooth transitions (duration-500)

### Implementation Priority

**Phase 1: Square Gallery Images** (Immediate)
1. Regenerate all 6 services at 1024x1024
2. Add "square frame, centered composition" to prompts
3. Test on homepage gallery section

**Phase 2: Service Card Images** (Short-term)
1. Generate 512x512 card variants
2. Integrate into service listing page
3. Add hover effects and transitions

**Phase 3: Hero Images** (Long-term)
1. Generate 1920x1080 hero variants
2. Add to service detail pages
3. Implement parallax or overlay effects

## Quick Reference

**Fast Command Sequence:**
```bash
# 1. Verify ComfyUI
mcp__comfyui-mcp__get_system_stats

# 2. Upload images (for each service)
mcp__comfyui-mcp__upload_image (path to source)

# 3. Create workflows
mcp__comfyui-mcp__create_workflow (template=img2img, params=...)

# 4. Enqueue all 6
mcp__comfyui-mcp__enqueue_workflow (modified workflow)

# 5. Monitor
mcp__comfyui-mcp__get_queue

# 6. Check results
mcp__comfyui-mcp__list_output_images (limit=20)
```

**One-Liner Settings:**
```
Model: juggernautXL_v9.safetensors
Sampler: dpmpp_2m + karras
Steps: 35, CFG: 6, Denoise: 0.65
Res: 1200x900
```

**Prompt Formula:**
```
[photography style] + [subject] + [action] + [details] +
[lighting] + [composition] + [quality tokens] +
[brand colors] + [negative: face/person]
```

## Usage Example

Generate all 6 service images using MCP tools:

```python
# Pseudocode for the workflow
services = [
    ("haircut", 211444581994552, "service-01-haircut"),
    ("color", 322355781994553, "service-02-color"),
    ("blowout", 433466891994554, "service-03-blowout"),
    ("mens", 544577901994555, "service-04-mens"),
    ("updo", 655688011994556, "service-05-updo"),
    ("treatments", 766799121994557, "service-06-treatments"),
]

for name, seed, source_file in services:
    # 1. Upload source
    upload_image(f"/data/@projects/hairathome/static/images/stock/{source_file}_00001_.png")

    # 2. Create workflow with prompts
    workflow = create_img2img_workflow(
        model="juggernautXL_v9.safetensors",
        source=source_file,
        positive=get_positive_prompt(name),
        negative=get_negative_prompt(),
        seed=seed
    )

    # 3. Enqueue
    enqueue_workflow(workflow)

# Monitor queue until complete
while queue_has_jobs():
    sleep(5)
    check_queue()
```

Estimated time: 6-10 minutes for all 6 images (30-60 seconds each)

## Success Indicators

You'll know the generation succeeded when:
- All 6 prompt IDs show in queue as completed
- Output directory contains 6 new PNG files
- Each file is named `service-[name]-improved_00001_.png`
- File sizes are 2-5 MB each (high quality)
- Images show no faces/people when inspected
