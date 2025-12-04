#!/bin/bash

# Create a comprehensive set of beauty-industry appropriate images using SVG
# These are original beauty-themed SVG images that match the mobile hair styling service

cd /mnt/sentry-nfs/projects/hairathome

echo "Creating original beauty industry aligned SVG images..."

# Create the image directories
mkdir -p static/images
mkdir -p static/images/gallery
mkdir -p static/images/services
mkdir -p static/images/team
mkdir -p static/images/icons

# Create a sophisticated beauty hero image
cat > static/images/hero-beauty-stylist.svg << 'HEROEOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f9f5ee;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f0e6d9;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="spotlight" cx="60%" cy="40%" r="50%">
      <stop offset="0%" style="stop-color:rgba(212, 175, 55, 0.15);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgba(243, 230, 208, 0);stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <rect width="1200" height="800" fill="url(#heroGradient)" />
  <rect width="1200" height="800" fill="url(#spotlight)" />
  
  <!-- Professional stylist with mobile setup -->
  <g transform="translate(750, 250)">
    <!-- Stylist portrait -->
    <circle cx="0" cy="-100" r="90" fill="#d4a998" />
    <ellipse cx="0" cy="50" rx="70" ry="150" fill="#e8c4a8" />
    
    <!-- Hair styling -->
    <path d="M-70 -80 Q0 -140, 70 -80" fill="#333" stroke="#222" stroke-width="2" />
    <path d="M-60 -70 Q0 -130, 60 -70" fill="#444" stroke="#222" stroke-width="2" />
    
    <!-- Styling tools -->
    <g transform="translate(100, -120) rotate(-30)">
      <rect x="-5" y="-60" width="10" height="60" fill="#d4af37" rx="2" />
      <circle cx="0" cy="-65" r="15" fill="#8e44ad" />
      <text x="0" y="-90" text-anchor="middle" font-family="Arial" font-size="14" fill="#333">Scissors</text>
    </g>
    
    <!-- Mobile equipment case -->
    <rect x="-180" y="180" width="360" height="200" rx="20" fill="#0a0a0a" stroke="#d4af37" stroke-width="2"/>
    <rect x="-150" y="200" width="300" height="150" rx="10" fill="#1a1a1a"/>
    <text x="0" y="330" text-anchor="middle" font-family="Arial" font-size="20" fill="#f3e6d0">Professional Mobile Kit</text>
  </g>
  
  <!-- Decorative elements -->
  <circle cx="100" cy="100" r="30" fill="#d4af37" opacity="0.2"/>
  <circle cx="1000" cy="700" r="20" fill="#d4a998" opacity="0.2"/>
  <circle cx="150" cy="600" r="15" fill="#e8c4a8" opacity="0.3"/>
  
  <!-- Brand elements -->
  <text x="200" y="250" font-family="Playfair Display, serif" font-size="48" fill="#3d2e26" font-weight="bold">Hair At Home</text>
  <text x="200" y="310" font-family="Poppins, sans-serif" font-size="24" fill="#d4af37">Professional Mobile Styling</text>
  <text x="200" y="350" font-family="Poppins, sans-serif" font-size="20" fill="#3d2e26">Winnipeg's Premier Beauty Experience</text>
  
  <!-- Service indicators -->
  <g transform="translate(200, 450)">
    <rect x="0" y="0" width="250" height="60" rx="30" fill="#3d2e26" opacity="0.8"/>
    <text x="125" y="40" text-anchor="middle" font-family="Poppins, sans-serif" font-size="22" fill="#f3e6d0">Premium Mobile Service</text>
  </g>
  
  <g transform="translate(200, 530)">
    <rect x="0" y="0" width="250" height="60" rx="30" fill="#3d2e26" opacity="0.8"/>
    <text x="125" y="40" text-anchor="middle" font-family="Poppins, sans-serif" font-size="22" fill="#f3e6d0">Red Seal Certified</text>
  </g>
</svg>
HEROEOF

# Create team/stylist image
cat > static/images/team/stylist.jpg << 'TEAMEOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#f9f5ee" />
  <rect width="800" height="600" fill="url(#teamGradient)" />

  <defs>
    <linearGradient id="teamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f3e6d0;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e6d4b6;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Professional stylist portrait -->
  <circle cx="400" cy="250" r="120" fill="#d4a998" stroke="#d4af37" stroke-width="3" />
  
  <!-- Face details -->
  <circle cx="370" cy="230" r="10" fill="#3d2e26" />
  <circle cx="430" cy="230" r="10" fill="#3d2e26" />
  <path d="M370 270 Q400 290, 430 270" stroke="#3d2e26" stroke-width="3" fill="none"/>
  
  <!-- Hair styling -->
  <path d="M300 180 Q400 100, 500 180" fill="#333" stroke="#222" stroke-width="3" />
  <path d="M280 200 Q400 130, 520 200" fill="#444" stroke="#222" stroke-width="3" />
  
  <!-- Professional styling tools -->
  <g transform="translate(500, 150) rotate(15)">
    <rect x="-8" y="-80" width="16" height="80" fill="#d4af37" rx="5" />
    <circle cx="0" cy="-85" r="20" fill="#8e44ad" />
    <path d="M0 -100 L-15 -120 M0 -100 L15 -120" stroke="#333" stroke-width="4" />
  </g>
  
  <!-- Credentials badge -->
  <g transform="translate(300, 400)">
    <rect x="0" y="0" width="200" height="120" rx="15" fill="#0a0a0a" stroke="#d4af37" stroke-width="2"/>
    <circle cx="100" cy="35" r="25" fill="#d4af37" />
    <text x="100" y="40" text-anchor="middle" font-family="Arial" font-size="20" fill="#f9f5ee">RS</text>
    <text x="100" y="75" text-anchor="middle" font-family="Arial" font-size="16" fill="#f9f5ee">Red Seal</text>
    <text x="100" y="95" text-anchor="middle" font-family="Arial" font-size="14" fill="#e8c4a8">Certified</text>
  </g>
  
  <text x="400" y="550" text-anchor="middle" font-family="Poppins, sans-serif" font-size="24" fill="#3d2e26">Professional Mobile Stylist</text>
</svg>
TEAMEOF

# Create service icons with beauty industry themes
cat > static/images/icons/scissors.svg << 'ICONEOF'
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
  <circle cx="40" cy="40" r="38" fill="#f3e6d0" stroke="#d4af37" stroke-width="2"/>
  <path d="M25 30 Q35 15, 45 30 T65 30" stroke="#3d2e26" stroke-width="5" fill="none"/>
  <path d="M25 50 Q35 65, 45 50 T65 50" stroke="#3d2e26" stroke-width="5" fill="none"/>
  <circle cx="35" cy="35" r="4" fill="#d4af37" stroke="#3d2e26" stroke-width="1"/>
  <circle cx="35" cy="45" r="4" fill="#d4af37" stroke="#3d2e26" stroke-width="1"/>
  <text x="40" y="75" text-anchor="middle" font-family="Arial" font-size="12" fill="#3d2e26">Cut & Style</text>
</svg>
ICONEOF

cat > static/images/icons/color.svg << 'ICONEOF2'
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
  <circle cx="40" cy="40" r="38" fill="#f3e6d0" stroke="#d4af37" stroke-width="2"/>
  <circle cx="25" cy="25" r="12" fill="#d4af37"/>
  <circle cx="55" cy="25" r="12" fill="#e8c4a8"/>
  <circle cx="40" cy="50" r="12" fill="#d4a998"/>
  <text x="40" y="75" text-anchor="middle" font-family="Arial" font-size="12" fill="#3d2e26">Color</text>
</svg>
ICONEOF2

cat > static/images/icons/brush.svg << 'ICONEOF3'
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
  <circle cx="40" cy="40" r="38" fill="#f3e6d0" stroke="#d4af37" stroke-width="2"/>
  <rect x="30" y="10" width="20" height="60" rx="5" fill="#d4af37" stroke="#3d2e26" stroke-width="2"/>
  <rect x="15" y="30" width="50" height="10" fill="#3d2e26" opacity="0.7"/>
  <rect x="15" y="45" width="50" height="10" fill="#3d2e26" opacity="0.7"/>
  <text x="40" y="75" text-anchor="middle" font-family="Arial" font-size="12" fill="#3d2e26">Style</text>
</svg>
ICONEOF3

# Create gallery images with beauty transformations
for i in {1..6}; do
  cat > "static/images/gallery/transformation-$i.jpg" << 'GALLERYEOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#f9f5ee" />
  <circle cx="400" cy="250" r="120" fill="#d4a998" />
  <path d="M300 400 Q400 350, 500 400" stroke="#3d2e26" stroke-width="8" fill="#e8c4a8" />
  
  <!-- Hair styling examples -->
  <path d="M250 200 Q400 100, 550 200" stroke="#333" stroke-width="12" fill="none" />
  <path d="M280 220 Q400 140, 520 220" stroke="#444" stroke-width="8" fill="none" />
  <path d="M260 250 Q400 180, 540 250" stroke="#555" stroke-width="6" fill="none" />
  
  <!-- Before/after style elements -->
  <rect x="100" y="450" width="250" height="40" rx="20" fill="#0a0a0a" opacity="0.9"/>
  <text x="225" y="475" text-anchor="middle" font-family="Arial" font-size="18" fill="#f3e6d0">Before</text>
  <rect x="450" y="450" width="250" height="40" rx="20" fill="#d4af37" opacity="0.9"/>
  <text x="575" y="475" text-anchor="middle" font-family="Arial" font-size="18" fill="#f9f5ee">After</text>
  
  <text x="400" y="550" text-anchor="middle" font-family="Poppins, sans-serif" font-size="24" fill="#3d2e26">Premium Transformation</text>
</svg>
GALLERYEOF
done

# Create service-specific images
cat > static/images/services/haircut.jpg << 'SERVICEEOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <rect width="800" height="400" fill="#f3e6d0" />
  <circle cx="400" cy="180" r="120" fill="#d4a998" />
  
  <!-- Face/profile -->
  <ellipse cx="400" cy="300" rx="80" ry="100" fill="#e8c4a8" />
  
  <!-- Hair styling -->
  <path d="M300 150 Q400 100, 500 150" stroke="#333" stroke-width="12" fill="none" />
  <path d="M280 170 Q400 130, 520 170" stroke="#444" stroke-width="8" fill="none" />
  
  <!-- Scissors icon -->
  <g transform="translate(350, 280) rotate(-30)">
    <path d="M0 0 L20 -20 M0 0 L-20 -20" stroke="#3d2e26" stroke-width="6"/>
    <circle cx="0" cy="0" r="8" fill="#d4af37" stroke="#3d2e26" stroke-width="2"/>
  </g>
  
  <text x="400" y="370" text-anchor="middle" font-family="Poppins, sans-serif" font-size="24" fill="#3d2e26">Custom Haircut & Style</text>
</svg>
SERVICEEOF

cat > static/images/services/color.jpg << 'SERVICEEOF2'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <rect width="800" height="400" fill="#f3e6d0" />
  
  <!-- Beauty bowl with color -->
  <ellipse cx="400" cy="250" rx="100" ry="40" fill="#0a0a0a" stroke="#d4af37" stroke-width="3"/>
  <path d="M300 150 Q400 80, 500 150" fill="#d4a998" />
  <path d="M280 170 Q400 120, 520 170" fill="#e8c4a8" />
  
  <!-- Color brush application -->
  <rect x="375" y="180" width="10" height="70" fill="#d4af37" />
  <rect x="350" y="180" width="10" height="70" fill="#d4a998" />
  <rect x="400" y="180" width="10" height="70" fill="#e8c4a8" />
  
  <!-- Color drops -->
  <circle cx="300" cy="100" r="10" fill="#d4af37"/>
  <circle cx="400" cy="80" r="10" fill="#d4a998"/>
  <circle cx="500" cy="110" r="10" fill="#e8c4a8"/>
  
  <text x="400" y="350" text-anchor="middle" font-family="Poppins, sans-serif" font-size="24" fill="#3d2e26">Professional Color Services</text>
</svg>
SERVICEEOF2

cat > static/images/services/special-occasion.jpg << 'SERVICEEOF3'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <rect width="800" height="400" fill="#f3e6d0" />
  <circle cx="400" cy="180" r="120" fill="#d4a998" />
  
  <!-- Elaborate updo style -->
  <path d="M300 160 Q400 60, 500 160" stroke="#333" stroke-width="8" fill="#444" />
  <path d="M350 120 Q400 80, 450 120" stroke="#555" stroke-width="6" fill="#666" />
  
  <!-- Hair accessories -->
  <circle cx="350" cy="120" r="8" fill="#d4af37" />
  <circle cx="450" cy="120" r="8" fill="#d4af37" />
  <path d="M370 100 L375 80 L380 100" stroke="#d4af37" stroke-width="3" fill="none"/>
  <path d="M420 100 L425 80 L430 100" stroke="#d4af37" stroke-width="3" fill="none"/>
  
  <!-- Crown element -->
  <path d="M380 80 Q400 60, 420 80" stroke="#d4af37" stroke-width="5" fill="none"/>
  <circle cx="400" cy="70" r="5" fill="#e8c4a8" />
  
  <text x="400" y="350" text-anchor="middle" font-family="Poppins, sans-serif" font-size="24" fill="#3d2e26">Special Occasion Styling</text>
</svg>
SERVICEEOF3

cat > static/images/services/beard.jpg << 'SERVICEEOF4'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <rect width="800" height="400" fill="#f3e6d0" />
  
  <!-- Face outline -->
  <path d="M300 150 Q300 350, 400 380 Q500 350, 500 150" fill="#d4a998" stroke="#3d2e26" stroke-width="3"/>
  
  <!-- Beard styling -->
  <path d="M320 250 Q400 280, 480 250" fill="#333" stroke="#222" stroke-width="2"/>
  <path d="M320 280 Q400 310, 480 280" fill="#444" stroke="#333" stroke-width="2"/>
  <path d="M320 310 Q400 340, 480 310" fill="#555" stroke="#444" stroke-width="2"/>
  
  <!-- Scissors grooming -->
  <g transform="translate(250, 250) rotate(-45)">
    <path d="M0 0 L15 -15 M0 0 L-15 -15" stroke="#3d2e26" stroke-width="4"/>
    <circle cx="0" cy="0" r="6" fill="#d4af37" stroke="#3d2e26" stroke-width="1"/>
  </g>
  
  <text x="400" y="350" text-anchor="middle" font-family="Poppins, sans-serif" font-size="24" fill="#3d2e26">Beard Grooming & Shaping</text>
</svg>
SERVICEEOF4

cat > static/images/services/blowout.jpg << 'SERVICEEOF5'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <rect width="800" height="400" fill="#f3e6d0" />
  <circle cx="400" cy="150" r="120" fill="#d4a998" />
  
  <!-- Blowout styling - flowing hair -->
  <path d="M250 200 Q300 250, 320 240 Q360 280, 400 260 Q440 280, 480 240 Q520 250, 550 200" stroke="#333" stroke-width="8" fill="none" />
  <path d="M240 220 Q300 280, 330 270 Q380 310, 400 290 Q420 310, 470 270 Q520 280, 560 220" stroke="#444" stroke-width="6" fill="none" />
  
  <!-- Hair dryer icon -->
  <g transform="translate(300, 300) rotate(20)">
    <rect x="0" y="-20" width="40" height="40" rx="20" fill="#d4af37"/>
    <rect x="30" y="-5" width="20" height="10" rx="5" fill="#0a0a0a"/>
    <circle cx="5" cy="-15" r="3" fill="#0a0a0a"/>
  </g>
  
  <text x="400" y="350" text-anchor="middle" font-family="Poppins, sans-serif" font-size="24" fill="#3d2e26">Professional Wash & Blowout</text>
</svg>
SERVICEEOF5

cat > static/images/services/treatments.jpg << 'SERVICEEOF6'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <rect width="800" height="400" fill="#f3e6d0" />
  <circle cx="400" cy="150" r="120" fill="#d4a998" />
  
  <!-- Treatment elements -->
  <path d="M250 150 Q400 80, 550 150" fill="#e8c4a8" opacity="0.3" />
  <path d="M280 180 Q400 120, 520 180" fill="#d4af37" opacity="0.3" />
  
  <!-- Droplets representing treatment -->
  <circle cx="300" cy="220" r="12" fill="url(#treatmentDrop1)" />
  <circle cx="400" cy="250" r="15" fill="url(#treatmentDrop2)" />
  <circle cx="500" cy="230" r="10" fill="url(#treatmentDrop3)" />
  
  <defs>
    <radialGradient id="treatmentDrop1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#d4af37" />
      <stop offset="100%" stop-color="#d4a998" />
    </radialGradient>
    <radialGradient id="treatmentDrop2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#e8c4a8" />
      <stop offset="100%" stop-color="#d4af37" />
    </radialGradient>
    <radialGradient id="treatmentDrop3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#d4a998" />
      <stop offset="100%" stop-color="#e8c4a8" />
    </radialGradient>
  </defs>
  
  <!-- Scalp massage representation -->
  <circle cx="350" cy="120" r="5" fill="#3d2e26" opacity="0.7"/>
  <circle cx="400" cy="140" r="5" fill="#3d2e26" opacity="0.7"/>
  <circle cx="450" cy="130" r="5" fill="#3d2e26" opacity="0.7"/>
  
  <text x="400" y="350" text-anchor="middle" font-family="Poppins, sans-serif" font-size="24" fill="#3d2e26">Deep Conditioning Treatments</text>
</svg>
SERVICEEOF6

cat > static/images/og-image.jpg << 'OGEOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f9f5ee" />
  
  <!-- Background gradient -->
  <rect width="1200" height="630" fill="url(#ogGradient)" />
  
  <defs>
    <linearGradient id="ogGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f3e6d0;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#e6d4b6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d4a998;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Decorative elements -->
  <circle cx="1000" cy="100" r="60" fill="#d4af37" opacity="0.1"/>
  <circle cx="200" cy="530" r="40" fill="#e8c4a8" opacity="0.1"/>
  
  <!-- Logo representation -->
  <text x="600" y="250" text-anchor="middle" font-family="Playfair Display, serif" font-size="64" fill="#3d2e26">Hair At Home</text>
  <text x="600" y="320" text-anchor="middle" font-family="Poppins, sans-serif" font-size="32" fill="#d4af37">Winnipeg Mobile Hair Stylist</text>
  
  <!-- Service preview -->
  <g transform="translate(600, 450)">
    <circle cx="-200" cy="0" r="60" fill="#d4a998" />
    <circle cx="0" cy="0" r="60" fill="#d4a998" />
    <circle cx="200" cy="0" r="60" fill="#d4a998" />
    
    <!-- Service icons -->
    <g transform="translate(-200, -10)">
      <path d="M-10 -30 L10 -30 L10 30 L-10 30 Z" fill="#d4af37" opacity="0.8"/>
      <path d="M-20 -10 L-25 -25 M-20 -10 L-25 5" stroke="#fff" stroke-width="3"/>
    </g>
    <text x="-200" y="90" text-anchor="middle" font-family="Poppins, sans-serif" font-size="18" fill="#3d2e26">Cut & Style</text>
    
    <g transform="translate(0, -10)">
      <path d="M-10 -30 L10 -30 L10 30 L-10 30 Z" fill="#d4af37" opacity="0.8"/>
      <circle cx="-5" cy="-20" r="5" fill="#e8c4a8"/>
      <circle cx="5" cy="0" r="5" fill="#d4af37"/>
      <circle cx="0" cy="20" r="5" fill="#d4a998"/>
    </g>
    <text x="0" y="90" text-anchor="middle" font-family="Poppins, sans-serif" font-size="18" fill="#3d2e26">Color</text>
    
    <g transform="translate(200, -10)">
      <path d="M-10 -30 L10 -30 L10 30 L-10 30 Z" fill="#d4af37" opacity="0.8"/>
      <path d="M-15 -20 Q0 -35, 15 -20" stroke="#fff" stroke-width="3" fill="none"/>
      <path d="M-15 0 Q0 15, 15 0" stroke="#fff" stroke-width="3" fill="none"/>
    </g>
    <text x="200" y="90" text-anchor="middle" font-family="Poppins, sans-serif" font-size="18" fill="#3d2e26">Special</text>
  </g>
</svg>
OGEOF

echo "✅ Created beauty industry aligned SVG images:"
echo "- Hero image with mobile beauty service focus"
echo "- Team image with professional stylist representation"
echo "- Service icons with beauty industry styling"
echo "- Gallery images with hair transformation themes"
echo "- Service-specific images with beauty aesthetics"
echo "- OG image for social sharing"