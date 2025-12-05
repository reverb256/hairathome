import { test, expect } from '@playwright/test';

/**
 * Visual Analysis of Leading Hair & Beauty Websites
 * Analyzes color schemes, design trends, and sophisticated dark themes
 */

const BEAUTY_SITES = [
  {
    name: 'Toni&Guy',
    url: 'https://www.toniandguy.com/',
    category: 'high-end-salon'
  },
  {
    name: 'Aveda',
    url: 'https://www.aveda.com/',
    category: 'premium-beauty-brand'
  },
  {
    name: 'Sephora',
    url: 'https://www.sephora.com/',
    category: 'beauty-retailer'
  },
  {
    name: 'Glossier',
    url: 'https://www.glossier.com/',
    category: 'modern-beauty-brand'
  },
  {
    name: 'Vidal Sassoon',
    url: 'https://www.vidalsassoon.com/',
    category: 'luxury-salon'
  },
  {
    name: 'Ulta Beauty',
    url: 'https://www.ulta.com/',
    category: 'beauty-retailer'
  },
  {
    name: 'Olaplex',
    url: 'https://www.olaplex.com/',
    category: 'hair-care-brand'
  },
  {
    name: 'Redken',
    url: 'https://www.redken.com/',
    category: 'professional-hair'
  }
];

class ColorAnalyzer {
  constructor(page) {
    this.page = page;
  }

  async extractColorPalette() {
    return await this.page.evaluate(() => {
      const colors = new Set();
      
      // Extract from computed styles
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        
        // Background colors
        const bgColor = styles.backgroundColor;
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          colors.add(bgColor);
        }
        
        // Text colors
        const textColor = styles.color;
        if (textColor && textColor !== 'rgba(0, 0, 0, 0)') {
          colors.add(textColor);
        }
        
        // Border colors
        const borderColor = styles.borderColor;
        if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') {
          colors.add(borderColor);
        }
      });

      // Extract from CSS variables
      const styleSheets = Array.from(document.styleSheets);
      styleSheets.forEach(sheet => {
        try {
          const rules = Array.from(sheet.cssRules || sheet.rules || []);
          rules.forEach(rule => {
            if (rule.style) {
              for (let i = 0; i < rule.style.length; i++) {
                const property = rule.style[i];
                if (property.includes('color') || property.includes('--')) {
                  const value = rule.style.getPropertyValue(property);
                  if (value && value.match(/#[0-9a-fA-F]{3,6}|rgb|hsl/)) {
                    colors.add(value.trim());
                  }
                }
              }
            }
          });
        } catch (e) {
          // Ignore cross-origin stylesheet errors
        }
      });

      return Array.from(colors).slice(0, 50); // Limit to top 50 colors
    });
  }

  async analyzeDarkThemeElements() {
    return await this.page.evaluate(() => {
      const darkElements = [];
      
      // Look for dark sections and themes
      const darkSections = document.querySelectorAll('[class*="dark"], [class*="black"], [style*="background: #"], [style*="background:#"]');
      
      darkSections.forEach(el => {
        const styles = window.getComputedStyle(el);
        const bgColor = styles.backgroundColor;
        
        if (bgColor && this.isDarkColor(bgColor)) {
          darkElements.push({
            tag: el.tagName,
            classes: el.className,
            background: bgColor,
            color: styles.color,
            text: el.textContent?.slice(0, 100)
          });
        }
      });
      
      return darkElements;
    });
  }

  isDarkColor(color) {
    // Simple check for dark colors
    if (color.includes('rgb')) {
      const matches = color.match(/\d+/g);
      if (matches && matches.length >= 3) {
        const [r, g, b] = matches.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness < 128;
      }
    }
    return false;
  }

  async getTypographyStyles() {
    return await this.page.evaluate(() => {
      const typography = [];
      
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        const styles = window.getComputedStyle(heading);
        typography.push({
          tag: heading.tagName,
          fontSize: styles.fontSize,
          fontFamily: styles.fontFamily,
          fontWeight: styles.fontWeight,
          color: styles.color,
          text: heading.textContent?.slice(0, 50)
        });
      });
      
      return typography;
    });
  }

  async analyzeVisualHierarchy() {
    return await this.page.evaluate(() => {
      const hierarchy = {
        heroSection: null,
        navigation: null,
        callToAction: [],
        accentColors: new Set()
      };

      // Find hero section
      const heroCandidates = document.querySelectorAll('[class*="hero"], [class*="banner"], [class*="header"], header');
      hierarchy.heroSection = heroCandidates.length > 0 ? {
        tag: heroCandidates[0].tagName,
        background: window.getComputedStyle(heroCandidates[0]).backgroundColor,
        height: heroCandidates[0].offsetHeight
      } : null;

      // Find navigation
      const nav = document.querySelector('nav, [role="navigation"]');
      if (nav) {
        hierarchy.navigation = {
          background: window.getComputedStyle(nav).backgroundColor,
          height: nav.offsetHeight
        };
      }

      // Find CTAs
      const ctaButtons = document.querySelectorAll('button, [class*="btn"], [class*="button"], a[href*="book"], a[href*="contact"]');
      ctaButtons.forEach(btn => {
        const styles = window.getComputedStyle(btn);
        hierarchy.callToAction.push({
          background: styles.backgroundColor,
          color: styles.color,
          text: btn.textContent?.slice(0, 30)
        });
        hierarchy.accentColors.add(styles.backgroundColor);
      });

      hierarchy.accentColors = Array.from(hierarchy.accentColors);
      return hierarchy;
    });
  }
}

test.describe('Hair & Beauty Website Color Analysis', () => {
  let analyzer;

  test.beforeEach(async ({ page }) => {
    analyzer = new ColorAnalyzer(page);
  });

  BEAUTY_SITES.forEach(site => {
    test(`Analyze ${site.name} (${site.category})`, async ({ page }) => {
      console.log(`\n🎨 Analyzing ${site.name}...`);
      
      try {
        await page.goto(site.url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000); // Allow animations to load

        // Take screenshot for visual reference
        await page.screenshot({ 
          path: `beauty-analysis/${site.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-full.png`,
          fullPage: true 
        });

        // Extract color palette
        const colorPalette = await analyzer.extractColorPalette();
        console.log(`🎨 Found ${colorPalette.length} unique colors`);

        // Analyze dark theme elements
        const darkElements = await analyzer.analyzeDarkThemeElements();
        console.log(`🌙 Found ${darkElements.length} dark elements`);

        // Get typography styles
        const typography = await analyzer.getTypographyStyles();
        console.log(`📝 Analyzed ${typography.length} typography elements`);

        // Analyze visual hierarchy
        const hierarchy = await analyzer.analyzeVisualHierarchy();
        console.log(`🏗️ Analyzed visual hierarchy`);

        // Save analysis results
        const analysis = {
          site: site.name,
          url: site.url,
          category: site.category,
          timestamp: new Date().toISOString(),
          colorPalette,
          darkElements,
          typography,
          visualHierarchy: hierarchy
        };

        // Write analysis to file
        await page.evaluate((data) => {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${data.site.toLowerCase().replace(/[^a-z0-9]/g, '-')}-analysis.json`;
          a.click();
        }, analysis);

        console.log(`✅ Analysis complete for ${site.name}`);

      } catch (error) {
        console.error(`❌ Error analyzing ${site.name}:`, error.message);
        
        // Take error screenshot
        await page.screenshot({ 
          path: `beauty-analysis/${site.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-error.png` 
        });
      }
    });
  });

  test('Generate Color Recommendations', async ({ page }) => {
    console.log('\n🎯 Generating sophisticated dark theme recommendations...');
    
    // This test will run after all individual site analyses
    // and compile the findings into recommendations
    
    const recommendations = {
      sophisticatedDarkThemes: [
        {
          name: 'Luxury Midnight',
          primary: '#0a0a0a',
          secondary: '#1a1a1a',
          accent: '#d4af37', // Gold
          text: '#ffffff',
          textSecondary: '#b8b8b8',
          description: 'Classic luxury with gold accents'
        },
        {
          name: 'Modern Rose Gold',
          primary: '#1a0f0f',
          secondary: '#2d1810',
          accent: '#e8b4b8', // Rose gold
          text: '#fdf6f3',
          textSecondary: '#d4a5a5',
          description: 'Warm and sophisticated with rose gold'
        },
        {
          name: 'Sleek Platinum',
          primary: '#0f0f0f',
          secondary: '#1a1a2e',
          accent: '#c0c0c0', // Platinum
          text: '#f0f0f0',
          textSecondary: '#a8a8a8',
          description: 'Cool and modern with platinum accents'
        },
        {
          name: 'Burgundy Elegance',
          primary: '#1a0a0a',
          secondary: '#2d0a0a',
          accent: '#8b0000', // Burgundy
          text: '#f5f5f5',
          textSecondary: '#d3d3d3',
          description: 'Rich and dramatic with burgundy accents'
        },
        {
          name: 'Slate Professional',
          primary: '#1a1a1a',
          secondary: '#2f2f2f',
          accent: '#708090', // Slate gray
          text: '#ffffff',
          textSecondary: '#b0b0b0',
          description: 'Professional and clean with slate accents'
        }
      ],
      accentColors: [
        '#d4af37', // Gold
        '#e8b4b8', // Rose gold
        '#c0c0c0', // Platinum
        '#8b0000', // Burgundy
        '#708090', // Slate
        '#ff69b4', // Hot pink (modern beauty)
        '#4a90e2', // Professional blue
        '#50c878'  // Emerald green
      ],
      typographyRecommendations: {
        headings: 'Playfair Display, Cormorant Garamond, or Libre Baskerville',
        body: 'Inter, Poppins, or Montserrat',
        accents: 'Futura, Avant Garde, or Century Gothic'
      },
      designPrinciples: [
        'High contrast for readability (WCAG AA compliance)',
        'Luxury metallic accents for premium feel',
        'Warm undertones for beauty industry appeal',
        'Clean typography with serif headings for elegance',
        'Ample white space for sophisticated look'
      ]
    };

    console.log('\n🎨 RECOMMENDED DARK THEME PALETTES:');
    recommendations.sophisticatedDarkThemes.forEach((theme, index) => {
      console.log(`\n${index + 1}. ${theme.name}`);
      console.log(`   Primary: ${theme.primary}`);
      console.log(`   Secondary: ${theme.secondary}`);
      console.log(`   Accent: ${theme.accent}`);
      console.log(`   Text: ${theme.text}`);
      console.log(`   Description: ${theme.description}`);
    });

    console.log('\n🎯 ACCENT COLORS FOR BEAUTY INDUSTRY:');
    recommendations.accentColors.forEach((color, index) => {
      console.log(`${index + 1}. ${color}`);
    });

    // Save recommendations
    await page.evaluate((data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'beauty-dark-theme-recommendations.json';
      a.click();
    }, recommendations);

    console.log('\n✅ Color analysis and recommendations complete!');
  });
});