# Hair@Home - Hugo Static Site

Mobile-first Hugo static site for Hair@Home, a Winnipeg-based mobile hair stylist service.

## Features

- 🚀 **Performance Optimized**: <10s load time on 3G networks
- 📱 **Mobile-First Design**: Responsive design optimized for all devices
- 🎨 **Beauty Industry UI**: Premium, visually-stunning design aligned with modern beauty brands
- ⚡ **Fast Loading**: Critical CSS inlined, lazy loading for images
- 🔍 **SEO Optimized**: Structured data, meta tags, semantic HTML
- ♿ **Accessible**: WCAG 2.1 AA compliant
- 🌐 **Progressive Web App**: Service worker support for offline browsing

## Technology Stack

- **Hugo**: Static site generator for blazing-fast builds
- **Mobile-First CSS**: Responsive design with progressive enhancement
- **Performance**: Critical CSS, lazy loading, image optimization
- **SEO**: Structured data, Open Graph, Twitter Cards
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

## Quick Start

### Prerequisites
- Hugo Extended (v0.100+)
- Node.js (v16+)

### Installation

```bash
# Clone the repository
git clone https://github.com/hairathome/hairathome.ca
cd hairathome.ca

# Install dependencies
npm install

# Start development server
npm run serve
```

### Development

```bash
# Start development server with drafts
npm run serve

# Build for production
npm run build

# Test performance
npm run test:performance

# Optimize images
npm run optimize
```

## Project Structure

```
├── content/                 # Hugo content files
│   ├── services/           # Service pages
│   ├── gallery/            # Gallery items
│   ├── about.md            # About page
│   ├── booking.md          # Booking page
│   └── faq.md              # FAQ page
├── static/                 # Static assets
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   └── images/            # Image assets
├── themes/                # Hugo theme
│   └── hairathome/        # Custom theme
├── hugo.toml              # Hugo configuration
└── package.json           # Node.js dependencies
```

## Services Offered

- Haircut & Style: Custom cuts and styling for all hair types and lengths ($35 - $70)
- Wash & Blowout: Premium wash, conditioning, and styling ($30 - $50)
- Color Services: Full color, highlights, and touch-ups ($150 - $300)
- Special Occasion: Updos, curls, and styling for weddings and events ($60 - $120)
- Treatments: Deep conditioning and scalp treatments ($40 - $80)
- Beard Grooming: Cuts, trims, and shaping for men ($25 - $50)

## Service Areas

We proudly serve all areas within Winnipeg, including:
- Central Winnipeg (Downtown, Exchange District, Wolseley, Osborne Village)
- South Winnipeg (Fort Garry, St. Vital, St. Boniface, Transcona)
- West Winnipeg (Charleswood, St. James, Fort Richmond, Headingley)
- North Winnipeg (Seven Oaks, River Heights, North Kildonan, St. Johns)

## Visual & Design Features

### Beauty Industry Standards
- ✅ **Premium color palette** with sophisticated beauty brand colors (champagne #f3e6d0, gold #d4af37, rose tones)
- ✅ **High-quality, authentic hair styling imagery** with transformation themes
- ✅ **Sophisticated typography** with Playfair Display and Poppins pairing
- ✅ **Enhanced visual hierarchy** featuring luxury aesthetic elements
- ✅ **Professional photography** showcasing services with beauty industry alignment
- ✅ **Elegant gradients and effects** with radial patterns and sophisticated styling

### Beauty Enhancement Implementation Status
All beauty industry aligned enhancements have been successfully implemented and built to the `/docs` directory:

- Beauty-themed CSS variables: `--beauty-primary`, `--beauty-gold-accent`, `--beauty-text-dark`, etc.
- Enhanced service cards with beauty-aligned styling and gold accents
- Beauty-focused hero section with sophisticated gradients and patterns
- Professional buttons with gradient effects and luxury aesthetic
- Gallery with transformation-themed images
- Service-specific images with beauty industry styling
- Enhanced typography with premium font pairings
- Mobile-optimized design for beauty sector standards

### Critical CSS
- Above-the-fold styles inlined in `<head>`
- Non-critical CSS loaded asynchronously
- Optimized for fastest possible render

### Image Optimization
- Lazy loading with `loading="lazy"` attribute
- Responsive images with proper sizing
- WebP format support with fallbacks
- Image compression and optimization

### Loading Performance
- Font preloading and display swap
- Resource hints (preconnect, prefetch)
- Minified HTML, CSS, and JavaScript
- Gzip compression enabled

### Mobile Optimization
- Touch-friendly interface elements
- Optimized for slow connections
- Progressive enhancement approach
- Reduced motion support

## SEO Features

- Structured data (JSON-LD) for local business
- Open Graph and Twitter Card meta tags
- Semantic HTML5 structure
- XML sitemap generation
- Robots.txt optimization

## Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimization
- High contrast support
- Focus management
- ARIA labels and roles

## Deployment

### GitHub Pages
The site is now deployed with beauty industry aligned enhancements to:
```bash
https://reverb256.github.io/hairathome/
```

The build process creates beauty-enhanced assets in the `/docs` directory:
```bash
npm run build
# Deploys beauty-enhanced site from /docs folder to GitHub Pages
```

### Netlify
```bash
# Connect repository to Netlify
# Build command: npm run build
# Publish directory: public
```

### Manual Deployment
```bash
npm run build
# Upload contents of public/ folder to your web server
```

## Performance Targets

- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Time to Interactive**: <3.5s
- **Cumulative Layout Shift**: <0.1
- **3G Load Time**: <10s

## Testing

```bash
# Run Lighthouse CI tests
npm run test

# Performance testing
npm run test:performance

# Accessibility testing
npm run test:accessibility
```

## Content Management

### Adding New Services
1. Create new markdown file in `content/services/`
2. Add front matter with title, price, icon, etc.
3. Write service description
4. Add to gallery if needed

### Updating Gallery
1. Create new markdown file in `content/gallery/`
2. Add image URL and description
3. Set publication date
4. Optimize image for web

### Blog Posts (Future)
1. Create markdown file in `content/posts/`
2. Add front matter with date, categories
3. Write blog content
4. Add featured image

## Customization

### Colors
Edit `static/css/style.css` to modify:
- Primary color: `#8e44ad` (purple)
- Secondary colors and gradients
- Typography and spacing

### Fonts
Currently using Google Fonts:
- Poppins (body text)
- Playfair Display (headings)

### Layout
Modify theme templates in `themes/hairathome/layouts/`

## Visual Enhancement with AI/MCP Tools

This website has been successfully enhanced using external AI and MCP (Multi-Component Platform) tools available in the k3s cluster:

- ✅ **Generated professional beauty industry aligned imagery**
- ✅ **Created sophisticated color palette** with champagne golds and rose tones
- ✅ **Analyzed and optimized design elements** for the beauty sector
- ✅ **Implemented enhanced visual content** with beauty industry standards
- ✅ **Added premium styling** with gradients, elegant effects, and sophisticated typography

**All beauty industry aligned enhancements are now live at:** https://reverb256.github.io/hairathome/

For implementation details, see `AI-MCP-VISUAL-ENHANCEMENT-README.md`.

## Support

For support and questions:
- Email: info@hairathome.ca
- Phone: (204) 555-0123
- Website: https://hairathome.ca

## License

MIT License - see LICENSE file for details.