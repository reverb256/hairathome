const { chromium } = require('playwright');

async function testThemeToggle() {
  console.log('🧪 Testing Theme Toggle Functionality');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigate to the site
    await page.goto('http://localhost:1313');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Page loaded successfully');
    
    // Check for single theme toggle button
    const themeToggles = await page.$$('#theme-toggle');
    console.log(`🔘 Found ${themeToggles.length} theme toggle buttons`);
    
    if (themeToggles.length !== 1) {
      throw new Error(`Expected 1 theme toggle, found ${themeToggles.length}`);
    }
    
    const themeToggle = themeToggles[0];
    
    // Check initial state
    const initialHtmlTheme = await page.getAttribute('html', 'data-theme');
    const initialLocalStorage = await page.evaluate(() => localStorage.getItem('theme'));
    const initialIcon = await page.$eval('#theme-icon', el => el.className);
    const initialText = await page.$eval('#theme-text', el => el.textContent);
    
    console.log(`🎨 Initial HTML theme: ${initialHtmlTheme}`);
    console.log(`💾 Initial localStorage: ${initialLocalStorage}`);
    console.log(`🌙 Initial icon: ${initialIcon}`);
    console.log(`📝 Initial text: ${initialText}`);
    
    // Verify initial state is dark
    if (initialHtmlTheme !== 'dark') {
      console.log('⚠️ Initial theme is not dark, setting it to dark');
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      });
    }
    
    // Test clicking the toggle
    console.log('🖱️ Clicking theme toggle...');
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Check state after first click
    const afterClickHtmlTheme = await page.getAttribute('html', 'data-theme');
    const afterClickLocalStorage = await page.evaluate(() => localStorage.getItem('theme'));
    const afterClickIcon = await page.$eval('#theme-icon', el => el.className);
    const afterClickText = await page.$eval('#theme-text', el => el.textContent);
    
    console.log(`🎨 Theme after click: ${afterClickHtmlTheme}`);
    console.log(`💾 localStorage after click: ${afterClickLocalStorage}`);
    console.log(`🌙 Icon after click: ${afterClickIcon}`);
    console.log(`📝 Text after click: ${afterClickText}`);
    
    // Verify theme switched to light
    if (afterClickHtmlTheme !== 'light') {
      throw new Error(`Expected light theme after click, got ${afterClickHtmlTheme}`);
    }
    
    if (afterClickLocalStorage !== 'light') {
      throw new Error(`Expected localStorage to be 'light', got ${afterClickLocalStorage}`);
    }
    
    if (!afterClickIcon.includes('fa-sun')) {
      throw new Error(`Expected sun icon, got ${afterClickIcon}`);
    }
    
    if (afterClickText !== 'Dark') {
      throw new Error(`Expected text 'Dark', got ${afterClickText}`);
    }
    
    // Test clicking again to switch back
    console.log('🖱️ Clicking theme toggle again...');
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Check state after second click
    const afterSecondClickHtmlTheme = await page.getAttribute('html', 'data-theme');
    const afterSecondClickLocalStorage = await page.evaluate(() => localStorage.getItem('theme'));
    const afterSecondClickIcon = await page.$eval('#theme-icon', el => el.className);
    const afterSecondClickText = await page.$eval('#theme-text', el => el.textContent);
    
    console.log(`🎨 Theme after second click: ${afterSecondClickHtmlTheme}`);
    console.log(`💾 localStorage after second click: ${afterSecondClickLocalStorage}`);
    console.log(`🌙 Icon after second click: ${afterSecondClickIcon}`);
    console.log(`📝 Text after second click: ${afterSecondClickText}`);
    
    // Verify theme switched back to dark
    if (afterSecondClickHtmlTheme !== 'dark') {
      throw new Error(`Expected dark theme after second click, got ${afterSecondClickHtmlTheme}`);
    }
    
    if (afterSecondClickLocalStorage !== 'dark') {
      throw new Error(`Expected localStorage to be 'dark', got ${afterSecondClickLocalStorage}`);
    }
    
    if (!afterSecondClickIcon.includes('fa-moon')) {
      throw new Error(`Expected moon icon, got ${afterSecondClickIcon}`);
    }
    
    if (afterSecondClickText !== 'Light') {
      throw new Error(`Expected text 'Light', got ${afterSecondClickText}`);
    }
    
    // Test persistence across page reload
    console.log('🔄 Testing persistence across page reload...');
    await themeToggle.click(); // Switch to light
    await page.waitForTimeout(300);
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const afterReloadHtmlTheme = await page.getAttribute('html', 'data-theme');
    const afterReloadLocalStorage = await page.evaluate(() => localStorage.getItem('theme'));
    
    console.log(`🎨 Theme after reload: ${afterReloadHtmlTheme}`);
    console.log(`💾 localStorage after reload: ${afterReloadLocalStorage}`);
    
    if (afterReloadHtmlTheme !== 'light') {
      throw new Error(`Expected light theme after reload, got ${afterReloadHtmlTheme}`);
    }
    
    if (afterReloadLocalStorage !== 'light') {
      throw new Error(`Expected localStorage to be 'light' after reload, got ${afterReloadLocalStorage}`);
    }
    
    // Test mobile responsiveness
    console.log(`📱 Testing mobile responsiveness...`);
    await page.setViewportSize({ width: 375, height: 667 });
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    const mobileTheme = await page.getAttribute('html', 'data-theme');
    if (mobileTheme !== 'dark') {
      throw new Error(`Expected dark theme on mobile, got ${mobileTheme}`);
    }
    
    console.log('✅ All theme toggle tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'theme-toggle-error.png', fullPage: true });
    console.log('📸 Screenshot saved as theme-toggle-error.png');
    
  } finally {
    await browser.close();
  }
}

testThemeToggle();