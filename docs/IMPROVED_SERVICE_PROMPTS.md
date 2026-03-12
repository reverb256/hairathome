# Improved Service Image Generation Prompts

## Settings for Juggernaut XL v9
- **Model**: juggernautXL_v9.safetensors
- **Sampler**: DPM++ 2M Karras
- **Steps**: 35
- **CFG Scale**: 6
- **Denoise**: 0.65
- **Resolution**: 1200x900 (4:3 aspect ratio)

---

## Service-Specific Prompts

### 1. Haircuts
**Positive Prompt:**
```
professional hair salon macro photography, sharp scissors cutting hair, close-up of hair being trimmed, hair strands in focus, scissors positioned at edge of frame, warm copper lighting, clean composition, centered subject, professional tools, Interior Photography, high resolution, sharp focus, shallow depth of field, detailed hair texture, no face, no person, no eyes, only hair and hands
```

**Negative Prompt:**
```
face, eyes, person, woman, man, people, portrait, head, blurry, low quality, cartoon, anime, illustration, painting, drawing, vector, flat, 2d, cropped, bad composition, poorly framed
```

**Seed:** 211444581994552

---

### 2. Color Services
**Positive Prompt:**
```
professional hair salon macro photography, hair color being applied, brush applying hair dye to hair strands, close-up of hair sections with foil highlights, color palette of copper honey amber, hair swatches and color bottles in background, warm lighting, Interior Photography, high resolution, sharp focus, detailed hair texture, no face, no person, only hair being colored
```

**Negative Prompt:**
```
face, eyes, person, woman, man, people, portrait, head, blurry, low quality, cartoon, anime, illustration, painting, drawing, vector, flat, 2d, cropped, bad composition
```

**Seed:** 322355781994553

---

### 3. Blowout & Styling
**Positive Prompt:**
```
professional hair salon macro photography, round brush styling hair, hair dryer and voluminous hair being styled, hairbrush smoothing hair strands, close-up of shiny styled hair with volume, warm golden lighting, hair products and tools arranged aesthetically, Interior Photography, high resolution, sharp focus, glossy hair texture, no face, no person, only hair being styled
```

**Negative Prompt:**
```
face, eyes, person, woman, man, people, portrait, head, blurry, low quality, cartoon, anime, illustration, painting, drawing, vector, flat, 2d, cropped, bad composition
```

**Seed:** 433466891994554

---

### 4. Men's Cuts
**Positive Prompt:**
```
professional barbershop macro photography, hair clippers trimming hair, electric clippers with guard attached, scissors and comb on barber station, close-up of hair being faded, barber tools arranged neatly, warm lighting, Automotive Photography style product shot, high resolution, sharp focus, detailed hair texture, no face, no person, only hair and tools
```

**Negative Prompt:**
```
face, eyes, person, woman, man, people, portrait, head, blurry, low quality, cartoon, anime, illustration, painting, drawing, vector, flat, 2d, cropped, bad composition
```

**Seed:** 544577901994555

---

### 5. Updos & Formal
**Positive Prompt:**
```
professional hair salon macro photography, intricate braided updo bun, bobby pins and hair accessories, close-up of braided hair texture, ornate hair styling details, warm rose gold lighting, hair styling tools arranged aesthetically, Interior Photography, high resolution, sharp focus, detailed hair texture, elegant composition, no face, no person, only updo hairstyle
```

**Negative Prompt:**
```
face, eyes, person, woman, man, people, portrait, head, blurry, low quality, cartoon, anime, illustration, painting, drawing, vector, flat, 2d, cropped, bad composition
```

**Seed:** 655688011994556

---

### 6. Treatments
**Positive Prompt:**
```
professional hair salon macro photography, hair treatment products and bowls, application brush applying conditioning treatment to hair strands, close-up of healthy glossy hair, treatment bottles and salon products arranged aesthetically, warm sand lighting, Interior Photography, high resolution, sharp focus, detailed hair texture, nurturing composition, no face, no person, only hair products and hair
```

**Negative Prompt:**
```
face, eyes, person, woman, man, people, portrait, head, blurry, low quality, cartoon, anime, illustration, painting, drawing, vector, flat, 2d, cropped, bad composition
```

**Seed:** 766799121994557

---

## Key Improvements

1. **Macro Photography Focus**: All prompts now specify "macro photography" for tight, detailed framing
2. **Explicit Subject Focus**: "close-up of [specific detail]" ensures the camera focuses on the right elements
3. **Composition Control**: "centered subject", "clean composition" for better framing
4. **No Faces/People**: Strong negative prompts to prevent any face shots
5. **Tool/Product Emphasis**: Mentions specific tools and products for each service
6. **Background Elements**: Adds aesthetic background elements for depth
7. **Texture Details**: Emphasizes hair texture and material details
8. **Lighting Direction**: Warm brand colors (copper, gold, rose, sand) maintained

## Additional Variations

Once these primary images are generated, you can also create:
- **Background/Atmosphere Images**: Salon interior, product displays, artistic compositions
- **Detail/Texture Images**: Extreme close-ups of hair textures, product shots
- **Process Images**: Tools in action, styling steps, before/after concepts
