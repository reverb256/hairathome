import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for k3s cluster environment
 * Optimized for containerized testing with MCP integration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4, // Adjusted for k3s resources
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }],
    process.env.CI ? ['github'] : ['list']
  ],
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000, // Increased for k3s network latency
    navigationTimeout: 45000, // Increased for k3s network latency
    ignoreHTTPSErrors: true, // For k3s ingress configurations
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--remote-debugging-port=9222'
          ]
        }
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        launchOptions: {
          firefoxUserPrefs: {
            'security.csp.enable': false,
            'network.http.phishy-userpass-length': 255
          }
        }
      },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-dev-shm-usage'
          ]
        }
      },
    },
  ],

  webServer: {
    command: 'npx http-server . -p 3000 -s --cors',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 180000, // Increased for k3s startup
  },

  // Global setup for MCP integration
  globalSetup: require.resolve('./tests/global-setup.js'),
  globalTeardown: require.resolve('./tests/global-teardown.js'),

  // Test timeout configuration
  timeout: 45000,
  expect: {
    timeout: 10000,
  },

  // Output directory for k3s persistent storage
  outputDir: 'test-results/',
});