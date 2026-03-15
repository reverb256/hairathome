/**
 * Generate Open Graph images for all pages
 * Run during build to create static OG images
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import @vercel/og - note: requires Node.js environment
// For static builds, we'll create a simpler approach using sharp directly

// Since @vercel/og requires specific runtime, let's use a simpler approach
// that works in any Node.js environment - we'll create SVG-based OG images

// Brand colors and config
const BRAND = {
  cream: '#FBF8F3',
  espresso: '#2D2520',
  copper: '#d4a598',
  gold: '#dab0a0',
  honey: '#E8B447',
  slate: '#6b6b6b',
  stone: '#8b8179',
};

// Pages to generate OG images for
const pages = [
  {
    path: 'index',
    title: 'Hair@Home',
    description: 'Mobile Hair Stylist Winnipeg',
  },
  {
    path: 'services',
    title: 'Our Services',
    description: 'Professional Hair Services at Your Convenience',
  },
  {
    path: 'about',
    title: 'About Us',
    description: 'Winnipeg\'s Premier Mobile Hair Stylist',
  },
  {
    path: 'booking',
    title: 'Book Now',
    description: 'Schedule Your Appointment Today',
  },
  {
    path: 'faq',
    title: 'FAQ',
    description: 'Frequently Asked Questions',
  },
];

// Service pages
const services = [
  { slug: 'haircut', title: 'Haircut & Style', price: '$35' },
  { slug: 'color', title: 'Color Services', price: '$65+' },
  { slug: 'blowout', title: 'Blowout & Style', price: '$30' },
  { slug: 'beard', title: 'Beard Grooming', price: '$20' },
  { slug: 'treatments', title: 'Hair Treatments', price: '$45+' },
  { slug: 'special-occasion', title: 'Special Occasion', price: '$75+' },
];

for (const service of services) {
  pages.push({
    path: `services/${service.slug}`,
    title: service.title,
    description: `${service.title} - ${service.price}`,
  });
}

/**
 * Create SVG for OG image
 */
function createOGImage(title, description) {
  const width = 1200;
  const height = 630;

  // Escape strings for SVG
  const escape = (str) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#C9A86C"/>
      <stop offset="50%" style="stop-color:#D4AF37"/>
      <stop offset="100%" style="stop-color:#B87A56"/>
    </linearGradient>
    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${BRAND.copper}"/>
      <stop offset="50%" style="stop-color:${BRAND.honey}"/>
      <stop offset="100%" style="stop-color:${BRAND.copper}"/>
    </linearGradient>
    <filter id="blur1">
      <feGaussianBlur in="SourceGraphic" stdDeviation="60" />
    </filter>
    <filter id="blur2">
      <feGaussianBlur in="SourceGraphic" stdDeviation="80" />
    </filter>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&amp;display=swap');
      .title { font-family: 'Playfair Display', Georgia, serif; font-size: 48px; font-weight: 500; fill: ${BRAND.espresso}; }
      .subtitle { font-family: 'Playfair Display', Georgia, serif; font-size: 28px; fill: ${BRAND.slate}; }
      .footer { font-family: 'Playfair Display', Georgia, serif; font-size: 16px; fill: ${BRAND.stone}; }
      .phone { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 600; fill: ${BRAND.espresso}; }
      .badge { font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-weight: 500; fill: ${BRAND.espresso}; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${BRAND.cream}"/>

  <!-- Decorative gradient circles -->
  <circle cx="1300" cy="100" r="200" fill="rgba(212,165,152,0.15)" filter="url(#blur1)"/>
  <circle cx="-100" cy="750" r="250" fill="rgba(218,176,160,0.12)" filter="url(#blur2)"/>

  <!-- Logo (simplified SVG) -->
  <g transform="translate(510, 80) scale(0.8)">
    <!-- House shape -->
    <path d="M200 40 L340 130 L340 320 L60 320 L60 130 Z"
          fill="none" stroke="url(#goldGradient)" stroke-width="4" stroke-linejoin="round"/>
    <!-- Roof accent -->
    <path d="M200 40 L340 130" stroke="url(#goldGradient)" stroke-width="4" stroke-linecap="round"/>
    <!-- HAIR -->
    <text x="200" y="175" font-family="Georgia, serif" font-size="42" font-weight="500"
          fill="url(#goldGradient)" text-anchor="middle" letter-spacing="8">HAIR</text>
    <!-- @ -->
    <text x="200" y="215" font-family="Georgia, serif" font-size="24"
          fill="url(#goldGradient)" text-anchor="middle">@</text>
    <!-- HOME -->
    <text x="200" y="260" font-family="Georgia, serif" font-size="42" font-weight="500"
          fill="url(#goldGradient)" text-anchor="middle" letter-spacing="5">HOME</text>
    <!-- Scissors -->
    <g transform="translate(200, 320) scale(0.8)">
      <ellipse cx="-20" cy="0" rx="14" ry="10" fill="none" stroke="url(#goldGradient)" stroke-width="2.5"/>
      <ellipse cx="20" cy="0" rx="14" ry="10" fill="none" stroke="url(#goldGradient)" stroke-width="2.5"/>
      <line x1="-10" y1="0" x2="0" y2="-25" stroke="url(#goldGradient)" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="10" y1="0" x2="0" y2="-25" stroke="url(#goldGradient)" stroke-width="2.5" stroke-linecap="round"/>
    </g>
  </g>

  <!-- Title -->
  <text x="600" y="340" text-anchor="middle" class="title">${escape(title)}</text>

  <!-- Decorative line -->
  <rect x="540" y="365" width="120" height="3" fill="url(#lineGradient)" rx="2"/>

  <!-- Subtitle -->
  <text x="600" y="410" text-anchor="middle" class="subtitle">${escape(description)}</text>

  <!-- Phone badge -->
  <g transform="translate(400, 450)">
    <rect width="400" height="72" rx="36" fill="rgba(218,176,160,0.15)" stroke="rgba(212,165,152,0.3)" stroke-width="2"/>
    <circle cx="50" cy="36" r="20" fill="${BRAND.copper}"/>
    <text x="50" y="45" text-anchor="middle" font-size="20">📞</text>
    <text x="230" y="48" text-anchor="middle" class="phone">(204) 557-2287</text>
  </g>

  <!-- Service badges -->
  <g transform="translate(380, 540)">
    <!-- Haircuts -->
    <rect x="0" y="0" width="100" height="40" rx="20" fill="rgba(232,180,71,0.2)" stroke="rgba(232,180,71,0.4)" stroke-width="1"/>
    <text x="50" y="26" text-anchor="middle" class="badge">Haircuts</text>

    <!-- Color -->
    <rect x="120" y="0" width="80" height="40" rx="20" fill="rgba(232,180,71,0.2)" stroke="rgba(232,180,71,0.4)" stroke-width="1"/>
    <text x="160" y="26" text-anchor="middle" class="badge">Color</text>

    <!-- Styling -->
    <rect x="220" y="0" width="90" height="40" rx="20" fill="rgba(232,180,71,0.2)" stroke="rgba(232,180,71,0.4)" stroke-width="1"/>
    <text x="265" y="26" text-anchor="middle" class="badge">Styling</text>
  </g>

  <!-- Footer -->
  <text x="600" y="600" text-anchor="middle" class="footer">Available 7 days a week • All Winnipeg areas</text>
</svg>`;
}

/**
 * Generate all OG images
 */
async function generateOGImages() {
  const outputDir = path.resolve(process.cwd(), 'public', 'og-images');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Generating OG images...');

  for (const page of pages) {
    const svg = createOGImage(page.title, page.description);
    const outputPath = path.join(outputDir, `${page.path}.svg`);

    // Ensure subdirectories exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, svg, 'utf-8');
    console.log(`  ✓ ${page.path}.svg`);
  }

  // Also create a default one
  const defaultSvg = createOGImage('Hair@Home', 'Mobile Hair Stylist Winnipeg');
  fs.writeFileSync(path.join(outputDir, 'default.svg'), defaultSvg, 'utf-8');
  console.log('  ✓ default.svg');

  console.log(`\nGenerated ${pages.length + 1} OG images in ${outputDir}`);
}

// Run the generator
generateOGImages().catch(console.error);
