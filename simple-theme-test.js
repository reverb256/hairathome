const { chromium } = require('playwright');

async function simpleThemeTest() {
  console.log('🧪 Simple Theme Toggle Test');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:1313');
    await page.waitForLoadState('networkidle');
    
    // Wait for JavaScript to initialize
    await page.waitForTimeout(1000);
    
    // Check initial state after JS runs
    const initialState = await page.evaluate(() => {
      const html = document.documentElement;
      const themeToggle = document.getElementById('theme-toggle');
      const icon = document.getElementById('theme-icon');
      const text = document.getElementById('theme-text');
      
      return {
        htmlTheme: html.getAttribute('data-theme'),
        localStorage: window.localStorage.getItem('theme'),
        iconClass: icon ? icon.className : null,
        textContent: text ? text.textContent : null
      };
    });
    
    console.log('Initial state after JS:', initialState);
    
    // Click the toggle
    await page.click('#theme-toggle');
    await page.waitForTimeout(500);
    
    // Check state after click
    const afterClickState = await page.evaluate(() => {
      const html = document.documentElement;
      const themeToggle = document.getElementById('theme-toggle');
      const icon = document.getElementById('theme-icon');
      const text = document.getElementById('theme-text');
      
      return {
        htmlTheme: html.getAttribute('data-theme'),
        localStorage: window.localStorage.getItem('theme'),
        iconClass: icon ? icon.className : null,
        textContent: text ? text.textContent : null
      };
    });
    
    console.log('State after click:', afterClickState);
    
    // Verify the logic
    if (initialState.htmlTheme === 'dark' && initialState.textContent === 'Light') {
      console.log('✅ Initial state correct: dark theme shows "Light" text');
    } else {
      console.log('❌ Initial state wrong: expected dark theme with "Light" text');
    }
    
    if (afterClickState.htmlTheme === 'light' && afterClickState.textContent === 'Dark') {
      console.log('✅ After click correct: light theme shows "Dark" text');
    } else {
      console.log('❌ After click wrong: expected light theme with "Dark" text');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

simpleThemeTest();