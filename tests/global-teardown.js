/**
 * Global teardown for Playwright tests with MCP integration
 * Cleans up test environment and runs MCP post-test hooks
 */
async function globalTeardown() {
  console.log('🧹 Cleaning up Playwright test environment...');
  
  // Run MCP post-test hooks if available
  if (process.env.MCP_ENABLED === 'true') {
    try {
      const { execSync } = require('child_process');
      
      // Run MCP post-test hooks
      execSync('npx claude-flow@alpha hooks post-task --task-id "playwright-test-suite"', {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      // Export test metrics
      execSync('npx claude-flow@alpha hooks session-end --export-metrics true', {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      console.log('✅ MCP teardown completed');
    } catch (error) {
      console.warn('⚠️ MCP teardown failed:', error.message);
    }
  }
  
  console.log('🎯 Global teardown completed');
}

export default globalTeardown;