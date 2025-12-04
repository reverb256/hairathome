import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Hair@Home website testing
 * Optimized for Hugo static site with proper base URLs and server configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  globalSetup: './tests/global-setup.js',
  globalTeardown: './tests/global-teardown.js',
  
  webServer: {
    command: 'npm run build && npx serve docs -l 1313',
    port: 1313,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
  },

  use: {
    baseURL: 'http://localhost:1313/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  /* Run tests in files in parallel */
  fullyParallel: true,
});