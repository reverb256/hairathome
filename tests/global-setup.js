import { chromium } from '@playwright/test';

/**
 * Global setup for Playwright tests
 * Builds the Hugo site and starts the development server
 */
async function globalSetup(config) {
  console.log('🏗️  Setting up test environment...');
  
  // Build the Hugo site
  const { execSync } = require('child_process');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Hugo site built successfully');
  } catch (error) {
    console.error('❌ Failed to build Hugo site:', error);
    throw error;
  }
  
  console.log('🚀 Test environment ready');
}

export default globalSetup;