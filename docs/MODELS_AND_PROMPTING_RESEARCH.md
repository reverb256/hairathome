# Research Summary: Models & Prompting for Illustrative Service Images

## Currently Installed Models

1. **HassakuXL Illustrious v34** (6.5GB)
   - Type: SDXL Anime/Illustration model
   - Best for: Stylized, anime-inspired illustrations
   - Strengths: Clean lines, vibrant colors, artistic style
   - This is our BEST option for flat, minimalist illustrations

2. **Flux.2 Klein 9B Base** (17GB)
   - Type: Flux diffusion model
   - Status: Full model downloaded but needs separate text encoders (CLIP-L and T5-XXL)
   - Not recommended: Too complex to set up for illustration style

## Missing Models We Should Consider

For flat, minimalist vector illustration style, we need either:

### Option 1: Use HassakuXL (Best Choice)
**Pros:**
- Already installed and working
- Trained for illustration/anime style
- Good at clean lines and flat colors
- Can be steered toward minimalist design with proper prompting

**Recommended Prompting Strategy for HassakuXL:**
```
Positive: [subject], flat illustration, vector art style, minimalist design,
clean lines, solid colors, simple shapes, 2D, no shading, no depth,
warm color palette, copper and gold tones, professional iconography

Negative: photorealistic, photo, realistic, 3d render, cgi, blurry,
low quality, complex, detailed, shaded, gradient background,
text, watermark, signature
```

**Settings:**
- Resolution: 1024x1024 or 1200x900 (4:3 for cards)
- Steps: 25-30
- CFG: 6-8
- Sampler: DPM++ 2M Karras
- Denoise (img2img): 0.7-0.85 (lower for cleaner, flatter look)
- Seed: Vary for each service

### Option 2: Juggernaut XL (Download Recommended)
**File:** `juggernautXL_v9Rerun.safetensors` or similar
**Size:** ~6.9GB
**Why:** Good all-rounder, can do illustration style with proper prompting
**Civitai:** https://civitai.com/models/67280/juggernaut-xl-v9

**Pros:**
- Excellent prompt adherence
- Can be pushed toward illustration style
- High quality output

**Cons:**
- Needs to be downloaded (not currently installed)
- Naturally leans photorealistic (needs strong negative prompts)

### Option 3: Flat Illustration LORAs
These can be combined with base SDXL models:

**Recommended LORAs to research:**
- "Corporate Flat Vector Style" - Vector art LORA
- "Flat Illustration" LORA variants
- "Memphis Design" style LORAs (geometric, minimalist)
- "Vector Art" style LORAs

## Prompting Research Summary

Based on research findings for SDXL illustration prompting:

### Effective Style Keywords

**For Flat/Vector Style:**
- `flat illustration`
- `vector art style`
- `minimalist`
- `simple shapes`
- `clean lines`
- `solid colors`
- `2D`
- `no shading`
- `no depth`
- `geometric`
- `abstract`
- `symbolic`
- `iconography`

### Color Palette Prompting

**For Copper/Gold Warm Palette:**
```
warm color palette, copper and gold tones, earthy colors,
#A66B48, #C9A86C, #D4AF37, terracotta, honey, amber,
bronze and gold, metallic warm tones, autumn colors
```

### Negative Prompts (Critical)

**To Avoid Photorealism:**
```
photorealistic, photo, photograph, camera, 35mm film, dslr,
realistic, realism, 3d render, cgi, depth of field, bokeh,
shadows, heavy shading, gradient, texture, noise, grain,
blurry, low quality, complex, detailed, text, watermark, signature
```

### Quality Boosters

**Add to positive prompt:**
```
award-winning, professional, highly detailed, sharp focus,
8k uhd, masterpiece, best quality, vector graphics,
adobe illustrator style, flat design iconography
```

## Recommended Workflow

### Using HassakuXL (Our Current Best Option):

1. **Create simple input images** (plain colored backgrounds)
   - Cream background: `#FBF8F3` to `#F5EDE0` gradient
   - Different colors for each service to set mood

2. **Img2img Settings:**
   - Model: HassakuXL Illustrious v34
   - Denoise: 0.75-0.85 (lower = flatter, cleaner)
   - Steps: 25-30
   - CFG: 6-7
   - Sampler: DPM++ 2M Karras
   - Seed: Different for each service

3. **Prompt Structure:**
```
Positive: [service-specific concept], flat vector illustration,
minimalist design, clean geometric lines, warm color palette
of copper and gold, professional iconography, simple shapes,
2D, no shading, no depth, solid colors

Negative: photorealistic, photo, realistic, 3d render, cgi,
blurry, low quality, distorted, ugly, bad anatomy, messy,
chaotic, complex, detailed, text, watermark, signature,
gradient background, heavy shadows
```

4. **Generate Variations:**
   - Start with 3-4 variations per service
   - Adjust denoise (0.7 for flatter, 0.85 for more detail)
   - Tweak prompt keywords based on results
   - Save best candidates

## Alternative: Download Specialized Model

If HassakuXL doesn't give good results, consider downloading:

**Juggernaut XL V9** (6.9GB)
- Civitai: https://civitai.com/models/67280/juggernaut-xl-v9
- Good all-rounder, better prompt adherence
- Use stronger negative prompts against photorealism

**FlatPix SDXL** (if available)
- Specialized for flat/pixel art
- Search Civitai for "flat illustration sdxl"

## Next Steps Recommendation

1. **Test HassakuXL first** - Already installed, try with proper prompts
2. **Create 4 prompt variations** per service to test
3. **Review results** and adjust prompting strategy
4. **If unsatisfied**, download Juggernaut XL V9
5. **Consider LORAs** if fine-tuning needed for specific flat style

## Specific Prompt Examples for Each Service

### Haircuts:
```
scissors icon with flowing hair, flat vector illustration,
minimalist design, clean geometric lines, warm color palette
of copper and gold, professional salon iconography, simple
shapes, 2D, no shading, solid colors

Negative: photorealistic, photo, realistic, 3d render, cgi,
blurry, low quality, complex, detailed
```

### Color:
```
hair silhouette with color spectrum, flat vector illustration,
minimalist design, artistic color mixing, warm color palette
of copper honey rose blush, professional salon iconography,
abstract, 2D, soft gradients

Negative: photorealistic, photo, realistic, 3d render, cgi,
blurry, low quality, complex, detailed
```

### Blowout:
```
voluminous hair with wind lines, flat vector illustration,
minimalist design, flowing movement, airy lightness, warm
color palette of copper and gold, professional salon
iconography, soft curves, 2D, ethereal

Negative: photorealistic, photo, realistic, 3d render, cgi,
blurry, low quality, complex, detailed
```

### Men's Cuts:
```
geometric scissors icon, flat vector illustration, minimalist
design, bold angular shapes, strong masculine lines, warm
color palette of copper and charcoal, professional salon
iconography, modern, 2D, sharp edges

Negative: photorealistic, photo, realistic, 3d render, cgi,
blurry, low quality, complex, detailed
```

### Updos:
```
elegant bun with braiding patterns, flat vector illustration,
minimalist design, sophisticated curves, intertwined lines,
warm color palette of copper and gold rose, professional salon
iconography, graceful, 2D, ornamental but simple

Negative: photorealistic, photo, realistic, 3d render, cgi,
blurry, low quality, complex, detailed
```

### Treatments:
```
water droplets with organic circles, flat vector illustration,
minimalist design, nurturing patterns, natural textures, warm
color palette of champagne and sand, professional salon
iconography, caring aesthetic, 2D, soft

Negative: photorealistic, photo, realistic, 3d render, cgi,
blurry, low quality, complex, detailed
```
