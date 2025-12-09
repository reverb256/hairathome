
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to the site
  console.log('Navigating to Hair@Home website...');
  await page.goto('https://reverb256.github.io/hairathome/', { waitUntil: 'networkidle' });
  
  // Take a screenshot
  await page.screenshot({ path: '/mnt/sentry-nfs/projects/hairathome/website-screenshot.png', fullPage: true });
  console.log('Screenshot saved to website-screenshot.png');
  
  // Analyze contrast issues in the hero section
  const heroSection = await page.$('.hero-section');
  if (heroSection) {
    console.log('Hero section found, analyzing contrast...');
    
    // Get all text elements in the hero section
    const textElements = await heroSection.$$('.hero-section :not(svg) > *:not(div):not(button)');
    for (const element of textElements) {
      const tagName = await element.evaluate(el => el.tagName.toLowerCase());
      if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'p' || tagName === 'span') {
        const text = await element.textContent();
        const style = await element.evaluate(el => window.getComputedStyle(el));
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        console.log(`Element: ${tagName}, Text: "${text.substring(0, 50)}...", Color: ${color}, BG: ${backgroundColor}`);
      }
    }
  } else {
    // Try to find the hero section differently
    const heroSections = await page.$$('.hero, .hero-section, [class*="hero"], [class*="header"]');
    console.log(`Found ${heroSections.length} potential hero sections`);
    
    for (let i = 0; i < heroSections.length; i++) {
      console.log(`Analyzing hero section ${i + 1}...`);
      const textElements = await heroSections[i].$$(':not(svg) > *:not(div):not(button)');
      for (const element of textElements) {
        const tagName = await element.evaluate(el => el.tagName.toLowerCase());
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'strong', 'em'].includes(tagName)) {
          const text = await element.textContent();
          const style = await element.evaluate(el => window.getComputedStyle(el));
          const color = style.color;
          const backgroundColor = style.backgroundColor;
          
          if (text.trim().length > 0) {
            console.log(`  ${tagName.toUpperCase()}: "${text.trim().substring(0, 30)}..."`);
            console.log(`    Color: ${color}, Background: ${backgroundColor}`);
            
            // Try to calculate approximate contrast ratio
            if (color && backgroundColor) {
              try {
                // Parse RGB values
                const colorRGB = color.match(/rgb\(?([^)]+)\)?/);
                const bgRGB = backgroundColor.match(/rgb\(?([^)]+)\)?/);
                
                if (colorRGB && bgRGB) {
                  const [r1,g1,b1] = colorRGB[1].split(',').map(x => parseInt(x.trim()));
                  const [r2,g2,b2] = bgRGB[1].split(',').map(x => parseInt(x.trim()));
                  
                  const lum1 = 0.2126*(r1/255) + 0.7152*(g1/255) + 0.0722*(b1/255);
                  const lum2 = 0.2126*(r2/255) + 0.7152*(g2/255) + 0.0722*(b2/255);
                  const contrastRatio = lum1 > lum2 ? (lum1 + 0.05)/(lum2 + 0.05) : (lum2 + 0.05)/(lum1 + 0.05);

                  console.log(`    Contrast Ratio: ${contrastRatio.toFixed(2)}`);
                  if (contrastRatio < 3.0) {
                    console.log(`    ⚠️  LOW CONTRAST - Ratio ${contrastRatio.toFixed(2)} < 3.0`);
                  } else if (contrastRatio < 4.5) {
                    console.log(`    ⚠️  MODERATE - Ratio ${contrastRatio.toFixed(2)} < 4.5 (OK for large text)`);
                  } else {
                    console.log(`    ✅ GOOD - Ratio ${contrastRatio.toFixed(2)} >= 4.5`);
                  }
                }
              } catch(e) {
                console.log(`    ❓ Could not calculate contrast ratio: ${e.message}`);
              }
            }
          }
        }
      }
    }
  }
  
  // Log all headings to understand page structure
  const headings = await page.$$('.hero *, [class*="hero"] *, [id*="hero"] *, header *, .header *');
  console.log(`Found ${headings.length} elements in potential header/hero areas`);
  
  for (const heading of headings) {
    try {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        const text = await heading.textContent();
        const style = await heading.evaluate(el => window.getComputedStyle(el));
        const color = style.color;
        const display = style.display;
        
        if (display !== 'none' && text.trim().length > 0) {
          console.log(`${tagName.toUpperCase()}: "${text.trim()}", Color: ${color}`);
        }
      }
    } catch(e) {
      // Some elements may not be accessible
    }
  }
  
  await browser.close();
})();
