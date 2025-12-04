#!/bin/bash

# Comprehensive image replacement script for Hair@Home
# Generates beauty industry aligned images to replace all placeholders

cd /mnt/sentry-nfs/projects/hairathome

echo "🎨 Generating beauty industry aligned placeholder images for Hair@Home..."

# Create images directory structure
mkdir -p static/images/services
mkdir -p static/images/gallery
mkdir -p static/images/team
mkdir -p static/images/icons

# Generate service images with beauty industry alignment
echo "Creating beauty-enhanced service images..."

# Create service icons as SVGs to ensure they're beauty-themed
cat > static/images/icons/scissors.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#f3e6d0" rx="20"/>
  <path d="M30 40 Q40 20, 50 40 T70 40" stroke="#3d2e26" stroke-width="6" fill="none"/>
  <path d="M30 60 Q40 80, 50 60 T70 60" stroke="#3d2e26" stroke-width="6" fill="none"/>
  <circle cx="40" cy="45" r="6" fill="#d4af37" stroke="#3d2e26" stroke-width="1"/>
  <circle cx="40" cy="55" r="6" fill="#d4af37" stroke="#3d2e26" stroke-width="1"/>
  <text x="50" y="90" text-anchor="middle" font-family="Arial" font-size="12" fill="#3d2e26">Scissors</text>
</svg>
EOF

cat > static/images/icons/brush.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#f3e6d0" rx="20"/>
  <circle cx="50" cy="50" r="35" fill="#e8c4a8" stroke="#3d2e26" stroke-width="3"/>
  <rect x="25" y="15" width="50" height="70" rx="5" fill="#d4af37" stroke="#3d2e26" stroke-width="2"/>
  <text x="50" y="90" text-anchor="middle" font-family="Arial" font-size="12" fill="#3d2e26">Brush</text>
</svg>
EOF

cat > static/images/icons/color.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#f3e6d0" rx="20"/>
  <circle cx="30" cy="30" r="15" fill="#d4af37"/>
  <circle cx="70" cy="30" r="15" fill="#e8c4a8"/>
  <circle cx="50" cy="70" r="15" fill="#d4a998"/>
  <text x="50" y="90" text-anchor="middle" font-family="Arial" font-size="12" fill="#3d2e26">Color</text>
</svg>
EOF

# Generate gallery placeholder images
echo "Creating beauty-enhanced gallery images..."

for i in {1..6}; do
  cat > "static/images/gallery/hair-$i.jpg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200">
  <rect width="800" height="1200" fill="#f3e6d0"/>
  <circle cx="400" cy="400" r="180" fill="#d4a998"/>
  <ellipse cx="400" cy="800" rx="250" ry="350" fill="#e8c4a8"/>
  <text x="400" y="1050" text-anchor="middle" font-family="Arial" font-size="24" fill="#3d2e26">Hair Transformation</text>
  <text x="400" y="1100" text-anchor="middle" font-family="Arial" font-size="18" fill="#d4af37">Professional Mobile Styling</text>
</svg>
EOF
done

# Create service-specific images
echo "Creating service-specific images..."

cat > static/images/services/haircut.jpg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#f9f5ee"/>
  <circle cx="400" cy="350" r="180" fill="#d4a998"/>
  <path d="M250 800 Q400 500, 550 800" stroke="#3d2e26" stroke-width="8" fill="#e8c4a8"/>
  <path d="M200 100 Q400 50, 600 100" stroke="#d4af37" stroke-width="12" fill="none"/>
  <text x="400" y="700" text-anchor="middle" font-family="Arial" font-size="32" fill="#3d2e26">Haircut & Style</text>
</svg>
EOF

cat > static/images/services/color.jpg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#f3e6d0"/>
  <circle cx="400" cy="350" r="180" fill="#d4a998"/>
  <rect x="150" y="550" width="500" height="150" fill="url(#colorGradient)"/>
  <defs>
    <linearGradient id="colorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#d4af37;stop-opacity:1" />
      <stop offset="33%" style="stop-color:#e8c4a8;stop-opacity:1" />
      <stop offset="66%" style="stop-color:#d4a998;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3d2e26;stop-opacity:1" />
    </linearGradient>
  </defs>
  <text x="400" y="650" text-anchor="middle" font-family="Arial" font-size="32" fill="#3d2e26">Hair Coloring</text>
</svg>
EOF

cat > static/images/services/special-occasion.jpg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#f9f5ee"/>
  <circle cx="400" cy="350" r="180" fill="#d4a998"/>
  <path d="M300 500 Q400 480, 500 500" stroke="#d4af37" stroke-width="6" fill="none"/>
  <path d="M250 550 Q400 600, 550 550" stroke="#e8c4a8" stroke-width="8" fill="none"/>  
  <circle cx="350" cy="300" r="15" fill="#d4af37"/>
  <circle cx="450" cy="300" r="15" fill="#d4af37"/>
  <text x="400" y="700" text-anchor="middle" font-family="Arial" font-size="32" fill="#3d2e26">Special Occasion</text>
</svg>
EOF

cat > static/images/services/beard.jpg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#f3e6d0"/>
  <circle cx="400" cy="300" r="150" fill="#3d2e26"/>
  <path d="M250 450 Q400 550, 550 450" stroke="#3d2e26" stroke-width="12" fill="#e8c4a8"/>
  <path d="M200 500 Q400 580, 600 500" stroke="#d4a998" stroke-width="10" fill="none"/>
  <text x="400" y="700" text-anchor="middle" font-family="Arial" font-size="32" fill="#3d2e26">Beard Grooming</text>
</svg>
EOF

cat > static/images/services/blowout.jpg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#f9f5ee"/>
  <circle cx="400" cy="350" r="180" fill="#d4a998"/>
  <path d="M200 600 Q400 400, 600 600" stroke="#d4af37" stroke-width="8" fill="none"/>
  <path d="M150 650 Q400 450, 650 650" stroke="#e8c4a8" stroke-width="6" fill="none"/>
  <path d="M100 700 Q400 500, 700 700" stroke="#d4a998" stroke-width="4" fill="none"/>
  <text x="400" y="750" text-anchor="middle" font-family="Arial" font-size="32" fill="#3d2e26">Blowout</text>
</svg>
EOF

cat > static/images/services/treatments.jpg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#f3e6d0"/>
  <circle cx="400" cy="350" r="180" fill="#d4a998"/>
  <rect x="200" y="550" width="400" height="100" fill="url(#treatmentGradient)"/>
  <defs>
    <linearGradient id="treatmentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#d4af37;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#e8c4a8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d4a998;stop-opacity:1" />
    </linearGradient>
  </defs>
  <text x="400" y="700" text-anchor="middle" font-family="Arial" font-size="32" fill="#3d2e26">Hair Treatments</text>
</svg>
EOF

# Create team/stylist image
echo "Creating team/stylist image..."

cat > static/images/team/stylist.jpg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#f9f5ee"/>
  <circle cx="400" cy="350" r="180" fill="#d4a998"/>
  <ellipse cx="400" cy="650" rx="180" ry="200" fill="#e8c4a8"/>
  <circle cx="350" cy="330" r="15" fill="#3d2e26"/>
  <circle cx="450" cy="330" r="15" fill="#3d2e26"/>
  <path d="M350 400 Q400 420, 450 400" stroke="#3d2e26" stroke-width="4" fill="none"/>
  <text x="400" y="750" text-anchor="middle" font-family="Arial" font-size="32" fill="#3d2e26">Mobile Stylist</text>
  <text x="400" y="790" text-anchor="middle" font-family="Arial" font-size="24" fill="#d4af37">Red Seal Certified</text>
</svg>
EOF

# Create hero image
echo "Creating hero section image..."

cat > static/images/hero-image.jpg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
  <rect width="1200" height="600" fill="#f3e6d0"/>
  <rect x="0" y="0" width="1200" height="600" fill="url(#heroGradient)"/>
  <defs>
    <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f9f5ee;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#f3e6d0;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e6d4b6;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="circleEffect" cx="60%" cy="40%" r="60%">
      <stop offset="0%" style="stop-color:rgba(212, 175, 55, 0.2);stop-opacity:1" />
      <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="1200" height="600" fill="url(#circleEffect)"/>
  <circle cx="900" cy="300" r="250" fill="url(#faceGradient)" opacity="0.9"/>
  <defs>
    <linearGradient id="faceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e8c4a8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d4a998;stop-opacity:1" />
    </linearGradient>
  </defs>
  <text x="200" y="200" font-family="Arial" font-size="48" fill="#3d2e26" font-weight="bold">Professional</text>
  <text x="200" y="260" font-family="Arial" font-size="48" fill="#3d2e26" font-weight="bold">Mobile</text>
  <text x="200" y="320" font-family="Arial" font-size="48" fill="#3d2e26" font-weight="bold">Hair Styling</text>
  <text x="200" y="400" font-family="Arial" font-size="24" fill="#d4af37">Salon-quality service delivered to your doorstep</text>
  <text x="200" y="440" font-family="Arial" font-size="20" fill="#e8c4a8">Serving Winnipeg • Red Seal Certified • 8+ Years Experience</text>
</svg>
EOF

# Create og-image for social sharing
echo "Creating og:image..."

cat > static/images/og-image.jpg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f3e6d0"/>
  <rect x="0" y="0" width="600" height="630" fill="url(#ogGradient)"/>
  <defs>
    <linearGradient id="ogGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f9f5ee;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f3e6d0;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="800" cy="300" r="180" fill="#d4a998"/>
  <text x="600" y="180" text-anchor="middle" font-family="Arial" font-size="48" fill="#3d2e26" font-weight="bold">Hair@Home</text>
  <text x="600" y="240" text-anchor="middle" font-family="Arial" font-size="28" fill="#d4af37">Mobile Hair Styling in Winnipeg</text>
  <text x="600" y="300" text-anchor="middle" font-family="Arial" font-size="24" fill="#e8c4a8">Professional mobile hair services at your doorstep</text>
  <g transform="translate(550,400)">
    <rect x="-150" y="0" width="300" height="120" fill="#0a0a0a" rx="10"/>
    <text x="0" y="50" text-anchor="middle" font-family="Arial" font-size="24" fill="#f3e6d0">Book Appointment</text>
    <text x="0" y="80" text-anchor="middle" font-family="Arial" font-size="20" fill="#d4af37">Red Seal Certified Stylist</text>
  </g>
</svg>
EOF

# Create favicon variations
echo "Creating beauty-themed favicons..."

cat > static/images/favicon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="#d4af37"/>
  <path d="M30 40 L70 40 L60 60 L40 60 Z" fill="#f3e6d0"/>
  <circle cx="40" cy="30" r="5" fill="#f3e6d0"/>
  <circle cx="60" cy="30" r="5" fill="#f3e6d0"/>
  <path d="M45 45 Q50 50, 55 45" stroke="#f3e6d0" stroke-width="2" fill="none"/>
</svg>
EOF

cat > static/images/app-icon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#f3e6d0" rx="20"/>
  <circle cx="50" cy="40" r="20" fill="#d4a998"/>
  <path d="M25 80 Q50 60, 75 80" stroke="#3d2e26" stroke-width="8" fill="#e8c4a8"/>
  <text x="50" y="90" text-anchor="middle" font-family="Arial" font-size="12" fill="#3d2e26">Hair</text>
</svg>
EOF

echo "✅ Beauty industry aligned placeholder images created:"
find static/images -type f | wc -l
echo "images created in static/images/"
echo ""
echo "📁 Directory structure:"
tree static/images/