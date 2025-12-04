#!/bin/bash

# Script to create hair service placeholder images for the hairathome site
# This addresses the missing scissor/hair images issue

cd /mnt/sentry-nfs/projects/hairathome

# Create the images directory if it doesn't exist
mkdir -p static/images
mkdir -p static/images/services
mkdir -p static/images/gallery
mkdir -p static/images/team

# Create a simple SVG placeholder for hair scissors image
cat > static/images/scissors-icon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="45" fill="#f3e6d0" stroke="#d4af37" stroke-width="2"/>
  <path d="M30 40 Q40 20, 50 40 T70 40" stroke="#3d2e26" stroke-width="3" fill="none"/>
  <path d="M30 60 Q40 80, 50 60 T70 60" stroke="#3d2e26" stroke-width="3" fill="none"/>
  <circle cx="40" cy="45" r="3" fill="#d4af37"/>
  <circle cx="40" cy="55" r="3" fill="#d4af37"/>
</svg>
EOF

# Create a hair styling SVG icon
cat > static/images/hair-styling-icon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#f3e6d0" />
  <circle cx="50" cy="30" r="15" fill="#d4a998" />
  <path d="M25 45 Q50 60, 75 45" stroke="#3d2e26" stroke-width="2" fill="none"/>
  <path d="M20 50 Q50 70, 80 50" stroke="#3d2e26" stroke-width="2" fill="none"/>
  <path d="M15 55 Q50 80, 85 55" stroke="#3d2e26" stroke-width="2" fill="none"/>
</svg>
EOF

# Create a beauty-themed background SVG
cat > static/images/hero-bg.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <radialGradient id="grad1" cx="80%" cy="20%" r="100%">
      <stop offset="0%" stop-color="#f3e6d0" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="grad2" cx="20%" cy="80%" r="100%">
      <stop offset="0%" stop-color="#d4af37" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="600" fill="#0a0a0a"/>
  <rect width="800" height="600" fill="url(#grad1)"/>
  <rect width="800" height="600" fill="url(#grad2)"/>
  <circle cx="150" cy="150" r="5" fill="#d4af37" opacity="0.5"/>
  <circle cx="650" cy="200" r="7" fill="#f3e6d0" opacity="0.3"/>
  <circle cx="300" cy="450" r="4" fill="#d4a998" opacity="0.4"/>
</svg>
EOF

# Create a service icon for haircut
cat > static/images/services/haircut.jpg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#f3e6d0"/>
  <circle cx="200" cy="150" r="70" fill="#d4a998"/>
  <path d="M130 220 Q200 270, 270 220" stroke="#3d2e26" stroke-width="8" fill="none"/>
  <path d="M100 100 Q200 50, 300 100" stroke="#d4af37" stroke-width="10" fill="none"/>
  <text x="200" y="350" font-family="Arial" font-size="24" fill="#3d2e26" text-anchor="middle">Haircut & Style</text>
</svg>
EOF

# Create a service icon for color
cat > static/images/services/color.jpg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#f3e6d0"/>
  <circle cx="200" cy="150" r="70" fill="#d4a998"/>
  <rect x="150" y="220" width="100" height="100" rx="10" fill="url(#colorfulBrush)" />
  <defs>
    <linearGradient id="colorfulBrush" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e8c4a8"/>
      <stop offset="50%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#f3e6d0"/>
    </linearGradient>
  </defs>
  <path d="M100 100 Q200 50, 300 100" stroke="#d4af37" stroke-width="10" fill="none"/>
  <text x="200" y="350" font-family="Arial" font-size="24" fill="#3d2e26" text-anchor="middle">Hair Color</text>
</svg>
EOF

# Create a service icon for special occasion
cat > static/images/services/special-occasion.jpg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#f3e6d0"/>
  <circle cx="200" cy="150" r="70" fill="#d4a998"/>
  <path d="M200 220 Q150 280, 250 280 Z" fill="#e8c4a8"/>
  <path d="M180 180 Q200 160, 220 180" stroke="#d4af37" stroke-width="4" fill="none"/>
  <circle cx="180" cy="175" r="5" fill="#d4af37"/>
  <circle cx="220" cy="175" r="5" fill="#d4af37"/>
  <path d="M180 200 Q200 210, 220 200" stroke="#3d2e26" stroke-width="2" fill="none"/>
  <text x="200" y="350" font-family="Arial" font-size="24" fill="#3d2e26" text-anchor="middle">Special Occasion</text>
</svg>
EOF

# Create gallery images
for i in {1..6}; do
  cat > "static/images/gallery/hair-$i.jpg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="#$(printf '%02x%02x%02x' $((100 + RANDOM % 100)) $((100 + RANDOM % 100)) $((100 + RANDOM % 100)))"/>
  <circle cx="300" cy="300" r="150" fill="#$(printf '%02x%02x%02x' $((150 + RANDOM % 100)) $((150 + RANDOM % 100)) $((150 + RANDOM % 100)))"/>
  <text x="300" y="500" font-family="Arial" font-size="32" fill="#f3e6d0" text-anchor="middle">Hair Style</text>
  <text x="300" y="550" font-family="Arial" font-size="24" fill="#e8c4a8" text-anchor="middle">Portfolio Item [i]</text>
</svg>
EOF
done

# Replace [i] with actual number in each file
for i in {1..6}; do
  sed -i "s/\[i\]/$i/g" "static/images/gallery/hair-$i.jpg"
done

# Create team image
cat > static/images/team/stylist.jpg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
  <rect width="400" height="500" fill="#0a0a0a"/>
  <circle cx="200" cy="200" r="100" fill="#d4a998"/>
  <ellipse cx="200" cy="350" rx="80" ry="120" fill="#e8c4a8"/>
  <path d="M150 180 Q200 160, 250 180" stroke="#d4af37" stroke-width="4" fill="none"/>
  <circle cx="170" cy="175" r="8" fill="#3d2e26"/>
  <circle cx="230" cy="175" r="8" fill="#3d2e26"/>
  <path d="M170 210 Q200 220, 230 210" stroke="#3d2e26" stroke-width="3" fill="none"/>
  <text x="200" y="450" font-family="Arial" font-size="28" fill="#f3e6d0" text-anchor="middle">Professional</text>
  <text x="200" y="480" font-family="Arial" font-size="28" fill="#e8c4a8" text-anchor="middle">Stylist</text>
</svg>
EOF

# Create og image
cat > static/images/og-image.jpg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f3e6d0"/>
  <rect x="50" y="50" width="1100" height="530" rx="20" fill="#0a0a0a"/>
  <circle cx="600" cy="250" r="150" fill="#d4a998"/>
  <path d="M500 400 Q600 480, 700 400" stroke="#d4af37" stroke-width="12" fill="none"/>
  <text x="600" y="150" font-family="Arial" font-size="60" fill="#f3e6d0" text-anchor="middle">Hair@Home</text>
  <text x="600" y="550" font-family="Arial" font-size="40" fill="#e8c4a8" text-anchor="middle">Mobile Hair Styling Services Winnipeg</text>
</svg>
EOF

# Create placeholder images for specific services
echo '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200"><rect width="800" height="1200" fill="#f3e6d0"/><circle cx="400" cy="600" r="300" fill="#d4a998"/><text x="400" y="600" font-family="Arial" font-size="48" fill="#3d2e26" text-anchor="middle" dominant-baseline="middle">Balayage</text><text x="400" y="700" font-family="Arial" font-size="32" fill="#e8c4a8" text-anchor="middle">Blonde Styling</text></svg>' > static/images/gallery/balayage-blonde.jpg

echo '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200"><rect width="800" height="1200" fill="#f3e6d0"/><circle cx="400" cy="600" r="300" fill="#e8c4a8"/><text x="400" y="600" font-family="Arial" font-size="48" fill="#3d2e26" text-anchor="middle" dominant-baseline="middle">Beach Waves</text><text x="400" y="700" font-family="Arial" font-size="32" fill="#d4a998" text-anchor="middle">Textured Styling</text></svg>' > static/images/gallery/beach-waves.jpg

echo '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200"><rect width="800" height="1200" fill="#f3e6d0"/><circle cx="400" cy="600" r="300" fill="#d4af37"/><text x="400" y="600" font-family="Arial" font-size="48" fill="#3d2e26" text-anchor="middle" dominant-baseline="middle">Bridal Updo</text><text x="400" y="700" font-family="Arial" font-size="32" fill="#e8c4a8" text-anchor="middle">Wedding Preparation</text></svg>' > static/images/gallery/bridal-updo.jpg

echo '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200"><rect width="800" height="1200" fill="#f3e6d0"/><circle cx="400" cy="600" r="300" fill="#e8c4a8"/><text x="400" y="600" font-family="Arial" font-size="48" fill="#3d2e26" text-anchor="middle" dominant-baseline="middle">Classic Bob</text><text x="400" y="700" font-family="Arial" font-size="32" fill="#d4a998" text-anchor="middle">Structured Cut</text></svg>' > static/images/gallery/classic-bob.jpg

echo '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200"><rect width="800" height="1200" fill="#f3e6d0"/><circle cx="400" cy="600" r="300" fill="#d4af37"/><text x="400" y="600" font-family="Arial" font-size="48" fill="#3d2e26" text-anchor="middle" dominant-baseline="middle">Curly Specialist</text><text x="400" y="700" font-family="Arial" font-size="32" fill="#e8c4a8" text-anchor="middle">Texture Enhancement</text></svg>' > static/images/gallery/curly-specialist.jpg

echo '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200"><rect width="800" height="1200" fill="#f3e6d0"/><circle cx="400" cy="600" r="300" fill="#d4a998"/><text x="400" y="600" font-family="Arial" font-size="48" fill="#3d2e26" text-anchor="middle" dominant-baseline="middle">Elegant Brunette</text><text x="400" y="700" font-family="Arial" font-size="32" fill="#e8c4a8" text-anchor="middle">Rich Color Service</text></svg>' > static/images/gallery/elegant-brunette.jpg

echo "Created placeholder images for hairathome site"
echo "Images created in static/images/ directory:"
find static/images/ -type f | sort