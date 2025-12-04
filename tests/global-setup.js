import { chromium } from '@playwright/test';

/**
 * Global setup for Playwright tests with MCP integration
 * Initializes test environment and sets up MCP hooks
 */
async function globalSetup(config) {
  console.log('🚀 Setting up Playwright test environment...');
  
  // Initialize MCP hooks if available
  if (process.env.MCP_ENABLED === 'true') {
    try {
      const { execSync } = require('child_process');
      
      // Run MCP pre-test hooks
      execSync('npx claude-flow@alpha hooks pre-task --description "Playwright testing setup"', {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      console.log('✅ MCP hooks initialized');
    } catch (error) {
      console.warn('⚠️ MCP hooks initialization failed:', error.message);
    }
  }
  
  // Verify test server is accessible
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(config.webServer?.port ? `http://localhost:${config.webServer.port}` : 'http://localhost:1313');
    await page.waitForLoadState('networkidle');
    console.log('✅ Test server is accessible');
  } catch (error) {
    console.error('❌ Test server not accessible:', error.message);
    // Don't fail the setup - just log the error
    console.warn('⚠️ Continuing with tests despite server check failure');
  } finally {
    await browser.close();
  }
  
  console.log('🎯 Global setup completed');
}

export default globalSetup;