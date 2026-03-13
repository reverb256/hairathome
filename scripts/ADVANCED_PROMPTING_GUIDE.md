# Advanced Photorealistic Prompting Guide

## Photography-Based Prompting Framework

### Core Concept
Think like a **professional photographer**, not an artist. Use technical camera terminology that AI models trained on real photographs understand.

---

## 1. Camera Equipment Specification

### Always include in prompts:
```
shot on Sony a7III, 50mm f/1.8 lens
```

### Alternative camera bodies:
- `Canon EOS R5`
- `Nikon Z7II`
- `Leica M11`

### Lens choices (affects framing/depth):
| Lens | Effect | Best For |
|------|--------|----------|
| `35mm` | Wide-angle, environmental | Room context |
| `50mm` | Natural perspective | Portraits |
| `85mm` | Shallow DOF, bokeh | Close-ups |
| `100mm` | Macro, extreme detail | Product shots |

---

## 2. Lighting & Composition

### Lighting keywords:
```
cinematic lighting, global illumination, soft shadows,
natural light, golden hour, studio lighting,
three-point lighting, rim lighting
```

### Composition/angle:
```
eye-level shot, low angle shot, high angle shot,
dutch angle, over-the-shoulder, establishing shot
```

---

## 3. Skin & Texture Control (CRITICAL)

### Positive prompt weights:
```
hyper realistic skin:1.2
skin texture:1.3
visible pores
natural imperfections
```

### Negative prompt (MUST INCLUDE):
```
plastic, imitation, fake, rendering, artificial,
silicone, waxy, over-smoothed, airbrushed,
cartoon, anime, manga, 3d render, cgi
```

---

## 4. Quality & Format

### Always add:
```
RAW photo, unretouched, 8k UHD, TIME cover quality,
award-winning photo, professional photography,
high resolution, fine art photography
```

---

## 5. Specific Use Cases

### Hair Styling - Environmental (Room Context)
```
professional mobile hair stylist service, at-home salon,
shot on Sony a7III, 35mm lens, f/2.8, wide angle shot,
environmental portraiture, showing entire room context,
warm natural lighting, soft shadows, cinematic lighting,
global illumination, hyper realistic skin:1.2, skin texture:1.3,
unretouched, RAW photo, 8k UHD, TIME cover quality
```

### Hair Styling - Close-up (Detail Focus)
```
professional hair styling session, detailed hair work,
shot on Sony a7III, 85mm macro lens, f/2.2,
shallow depth of field, bokeh, professional salon lighting,
hyper realistic skin:1.2, skin texture:1.3,
visible pores, natural imperfections, unretouched,
RAW photo, 8k UHD, TIME cover quality
```

### Hair Styling - Mid-range
```
mobile hair stylist with client, styling in progress,
shot on Sony a7III, 50mm lens, f/1.8, medium shot,
conversational framing, natural environment, soft lighting,
cinematic lighting, global illumination,
hyper realistic skin:1.2, skin texture:1.3,
unretouched, RAW photo, professional photography
```

---

## 6. Example: Complete Prompts

### Gallery Quality Shot:
```
professional mobile hair stylist working in client's living room,
shot on Sony a7III, 35mm lens, f/2.8, wide angle shot,
environmental portraiture, salon equipment visible,
warm natural lighting from large windows, soft shadows,
cinematic lighting, global illumination,
hyper realistic skin:1.2, skin texture:1.3,
visible pores, natural imperfections, unretouched,
RAW photo, 8k UHD, TIME cover quality,
professional photography, fine art photography
```

### Portrait Quality:
```
hair styling session in progress, detailed color work,
shot on Sony a7III, 100mm macro lens, f/2.2,
close-up photography, shallow depth of field, bokeh,
professional studio lighting, three-point lighting,
rim lighting, hair texture visible,
hyper realistic skin:1.2, skin texture:1.3,
visible pores, natural imperfections, unretouched,
RAW photo, 8k UHD, TIME cover quality
```

---

## 7. Parameter Settings (RealVisXL V20)

| Parameter | Value | Effect |
|-----------|-------|--------|
| **Sampler** | DPM++ 2M Karras | Best photorealism |
| **Steps** | 35-40 | Maximum detail |
| **CFG** | 5-7 | Lower = more natural |
| **Denoise** | 0.4-0.5 | Balance original/ enhancement |
| **Resolution** | 1024x1536+ | Higher = more detail |

---

## 8. ControlNet Options (Advanced)

### Depth Control (Framing control)
```
Download: https://huggingface.co/lllyasviel/sd-controlnet-depth
Purpose: 3D spatial relationships, distance control
```

### Normal Control (Surface detail)
```
Download: https://huggingface.co/lllyasviel/sd-controlnet-normal
Purpose: Surface details, concave/convex relationships
```

### Canny Control (Edges/lines)
```
Download: https://huggingface.co/lllyasviel/sd-controlnet-canny
Purpose: Sharp edges, architectural lines
```

---

## 9. Testing & Iteration

### Start with:
1. Low denoise (0.3) - Keep more of original
2. High quality JPEG from original
3. Professional prompt
4. Test results

### Adjust:
1. If too AI-looking: Lower CFG (5-6), increase steps (35+)
2. If too smooth: Add "skin imperfections", "visible pores"
3. If too sharp: Add "soft focus", "dreamy"
4. If framing wrong: Use ControlNet depth, adjust camera angle

---

## 10. Quick Reference: Negative Prompts

### For Hair/Skin:
```
(plastic, fake, rendering, artificial, silicone, waxy,
airbrushed, over-smooth, cartoon, anime, manga,
3d render, cgi, digital, blurry, distorted,
oily skin, greasy, shiny face, porcelain,
doll-like, mannequin, plastic skin)
```

### For Environmental:
```
(3d render, cgi, digital art, illustration,
painting, cartoon, anime, manga, studio backdrop,
fake room, artificial lighting, plastic plants,
stock photo, watermark, low resolution)
```

---

## Implementation Steps

1. **Install RealVisXL V20** (downloading now)
2. **Install ControlNet Depth** (for framing control)
3. **Create workflow** with ControlNet nodes
4. **Test prompts** on single frames
5. **Batch process** with optimal settings
6. **Review & iterate** based on results

---

**Key Insight:** Use photographer language, not artist language. The more technical camera terminology you use, the more photorealistic and natural your results will be.
