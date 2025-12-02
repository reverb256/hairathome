#!/usr/bin/env node

/**
 * MCP Runner for Playwright Tests
 * Integrates Playwright testing with MCP tools and coordination
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class MCPTestRunner {
  constructor() {
    this.testResults = [];
    this.sessionId = `playwright-${Date.now()}`;
    this.mcpEnabled = process.env.MCP_ENABLED === 'true';
  }

  async runTests(testPattern = '') {
    console.log('🚀 Starting MCP-enhanced Playwright test run...');
    
    try {
      // Initialize MCP session
      if (this.mcpEnabled) {
        await this.initializeMCP();
      }

      // Run Playwright tests
      await this.runPlaywrightTests(testPattern);

      // Process results with MCP
      if (this.mcpEnabled) {
        await this.processResults();
      }

      console.log('✅ MCP-enhanced test run completed');
    } catch (error) {
      console.error('❌ Test run failed:', error.message);
      process.exit(1);
    }
  }

  async initializeMCP() {
    console.log('🔧 Initializing MCP session...');
    
    try {
      const { execSync } = require('child_process');
      
      // Pre-task hook
      execSync('npx claude-flow@alpha hooks pre-task --description "MCP-enhanced Playwright testing"', {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      // Session restore
      execSync(`npx claude-flow@alpha hooks session-restore --session-id "${this.sessionId}"`, {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      console.log('✅ MCP session initialized');
    } catch (error) {
      console.warn('⚠️ MCP initialization failed:', error.message);
    }
  }

  async runPlaywrightTests(testPattern) {
    console.log('🧪 Running Playwright tests...');
    
    return new Promise((resolve, reject) => {
      const args = ['test', '--reporter=json'];
      
      if (testPattern) {
        args.push(testPattern);
      }

      if (process.env.CI) {
        args.push('--reporter=html');
      }

      const playwright = spawn('npx', ['playwright', ...args], {
        stdio: ['inherit', 'pipe', 'pipe'],
        cwd: process.cwd()
      });

      let output = '';
      
      playwright.stdout.on('data', (data) => {
        output += data.toString();
      });

      playwright.on('close', (code) => {
        try {
          if (output) {
            const results = JSON.parse(output);
            this.testResults = results.suites || [];
          }
          
          console.log(`Playwright tests completed with code: ${code}`);
          resolve(); // Always resolve to continue with MCP processing
        } catch (error) {
          console.warn('⚠️ Could not parse Playwright JSON output');
          resolve(); // Continue even if JSON parsing fails
        }
      });

      playwright.on('error', (error) => {
        reject(error);
      });
    });
  }

  async processResults() {
    console.log('📊 Processing test results with MCP...');
    
    try {
      const { execSync } = require('child_process');
      
      // Store results in MCP memory
      const resultsData = {
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        totalTests: this.testResults.length,
        results: this.testResults
      };

      execSync(`npx claude-flow@alpha hooks post-edit --file "test-results.json" --memory-key "tests/${this.sessionId}" --data '${JSON.stringify(resultsData)}'`, {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      // Notify completion
      execSync(`npx claude-flow@alpha hooks notify --message "Test suite completed: ${resultsData.totalTests} tests executed"`, {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      // Train neural patterns
      execSync(`npx claude-flow@alpha hooks neural-train --pattern "test-results" --data '${JSON.stringify(resultsData)}'`, {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      console.log('✅ Results processed with MCP');
    } catch (error) {
      console.warn('⚠️ MCP processing failed:', error.message);
    }
  }

  async cleanup() {
    console.log('🧹 Cleaning up MCP session...');
    
    try {
      const { execSync } = require('child_process');
      
      // Post-task hook
      execSync('npx claude-flow@alpha hooks post-task --task-id "playwright-test-suite"', {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      // Session end with metrics
      execSync('npx claude-flow@alpha hooks session-end --export-metrics true', {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      console.log('✅ MCP session cleaned up');
    } catch (error) {
      console.warn('⚠️ MCP cleanup failed:', error.message);
    }
  }
}

// CLI interface
async function main() {
  const runner = new MCPTestRunner();
  const testPattern = process.argv[2] || '';
  
  try {
    await runner.runTests(testPattern);
    await runner.cleanup();
  } catch (error) {
    console.error('❌ MCP test runner failed:', error.message);
    await runner.cleanup();
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = MCPTestRunner;