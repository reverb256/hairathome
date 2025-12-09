#!/usr/bin/env python3
"""
Visual inspection script to check the Hair@Home website for contrast issues
"""
import subprocess
import sys
import time

def inspect_website_contrast():
    """Use Playwright to inspect the live website for contrast issues"""
    
    # Use Playwright to launch a browser and navigate to the website
    print("🔍 Launching Playwright inspection of Hair@Home website...")
    print("📍 URL: https://reverb256.github.io/hairathome/")
    
    # Create a Playwright script to inspect the page
    pw_script = """
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
                const colorRGB = color.match(/rgb\\(?([^)]+)\\)?/);
                const bgRGB = backgroundColor.match(/rgb\\(?([^)]+)\\)?/);
                
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
"""
    
    # Write the script to a file
    with open('/mnt/sentry-nfs/projects/hairathome/playwright-inspect.js', 'w') as f:
        f.write(pw_script)
    
    print("📝 Playwright script created: playwright-inspect.js")
    print("🚀 Running visual inspection...")
    
    try:
        # Run the Playwright script
        result = subprocess.run(['node', 'playwright-inspect.js'], 
                              cwd='/mnt/sentry-nfs/projects/hairathome',
                              capture_output=True, text=True, timeout=60)
        print("Playwright output:", result.stdout)
        if result.stderr:
            print("Errors:", result.stderr)
    except subprocess.TimeoutExpired:
        print("⚠️  Playwright took too long, continuing with analysis...")
    except FileNotFoundError:
        print("⚠️  Node.js or Playwright not available, using alternative method...")
        
        # Alternative: direct curl to check website content
        print("\n📋 Using curl to get website content for analysis...")
        try:
            result = subprocess.run(['curl', '-s', 'https://reverb256.github.io/hairathome/'], 
                                  capture_output=True, text=True, timeout=30)
            
            content = result.stdout
            
            # Look for the hero section in the HTML
            print("\n🔍 Looking for hero section elements...")
            import re
            
            # Find the main heading
            h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.DOTALL | re.IGNORECASE)
            if h1_match:
                h1_content = h1_match.group(1)
                print(f"📄 H1 Found: {h1_content.strip()}")
            
            # Find hero section classes
            hero_classes = re.findall(r'class="([^"]*hero[^"]*)"', content, re.IGNORECASE)
            if hero_classes:
                print(f"🎨 Hero classes found: {set(hero_classes)}")
            
            # Look for contrast issues - text on light backgrounds
            text_on_light = re.findall(r'class="[^"]*(text-gray-(?:50|100|200|300|400)[^"]*).*?class="[^"]*bg-(?:white|gray-(?:50|100|200|300|400)[^"]*).*?>([^<]+)', content, re.IGNORECASE)
            if text_on_light:
                print("⚠️  Potential low contrast text found:")
                for contrast_issue in text_on_light[:5]:  # Show first 5 issues
                    print(f"   - Text with {contrast_issue[0]} on light background: '{contrast_issue[1][:50]}...'")
            
            # Look for any zinc classes that should be gray
            zinc_occurrences = re.findall(r'class="[^"]*zinc', content)
            if zinc_occurrences:
                print(f"⚠️  Found {len(set(zinc_occurrences))} unique zinc class occurrences")
            else:
                print("✅ No zinc classes found in HTML")
                
            # Look for common contrast problems
            contrast_problems = [
                r'text-gray-100[^"]*".*?bg-white',
                r'text-gray-200[^"]*".*?bg-white', 
                r'text-gray-300[^"]*".*?bg-white',
                r'text-gray-400[^"]*".*?bg-white',
                r'text-gray-50[^"]*".*?bg-gray-100',
                r'text-gray-100[^"]*".*?bg-gray-200',
                r'text-gray-200[^"]*".*?bg-gray-300',
                r'text-gray-300[^"]*".*?bg-gray-400'
            ]
            
            print("\n🔍 Checking for common contrast issues...")
            for problem_pattern in contrast_problems:
                matches = re.findall(problem_pattern, content, re.IGNORECASE)
                if matches:
                    print(f"⚠️  Potential contrast issue: {problem_pattern} ({len(matches)} occurrences)")

        except Exception as e:
            print(f"Error analyzing website: {e}")

if __name__ == "__main__":
    inspect_website_contrast()