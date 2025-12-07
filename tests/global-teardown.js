import { chromium } from '@playwright/test';

/**
 * Global teardown for Playwright tests
 * Cleans up test environment
 */
async function globalTeardown(config) {
  console.log('🧹 Cleaning up test environment...');
  
  // Cleanup any running processes if needed
  console.log('✅ Test environment cleaned up');
}

export default globalTeardown;