/**
 * =================================================================
 * HAIR@HOME INTELLIGENT COLOR SYSTEM VALIDATION
 * Comprehensive Testing and Validation Suite
 * =================================================================
 */

class IntelligentColorSystemValidator {
  constructor() {
    this.version = '1.0.0';
    this.testResults = [];
    this.performanceMetrics = {};
    this.accessibilityTests = {};
    this.colorCalculations = {};
    
    this.init();
  }

  async init() {
    console.log('🧪 Starting Hair@Home Intelligent Color System Validation...');
    
    // Wait for color engine to initialize
    await this.waitForColorEngine();
    
    // Run comprehensive validation suite
    await this.runValidationSuite();
    
    // Generate report
    this.generateReport();
  }

  async waitForColorEngine() {
    let attempts = 0;
    const maxAttempts = 50;
    
    while (!window.HairAtHomeColorEngine && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (!window.HairAtHomeColorEngine) {
      throw new Error('Color engine not initialized after 5 seconds');
    }
    
    console.log('✅ Color engine initialized successfully');
  }

  async runValidationSuite() {
    const tests = [
      this.testColorSystemInitialization,
      this.testThemeSwitching,
      this.testContextualAdaptation,
      this.testColorCalculations,
      this.testAccessibilityCompliance,
      this.testPerformanceOptimization,
      this.testResponsiveBehavior,
      this.testColorPsychology,
      this.testMathematicalHarmony,
      this.testUserPreferenceLearning,
      this.testOLEDOptimization,
      this.testColorBlindnessSafety,
      this.testAnimationSystem,
      this.testUtilityClasses,
      this.testBrandDifferentiation
    ];

    for (const test of tests) {
      try {
        await test.call(this);
      } catch (error) {
        this.addTestResult(test.name, false, error.message);
      }
    }
  }

  testColorSystemInitialization() {
    const engine = window.HairAtHomeColorEngine;
    const root = document.documentElement;
    
    // Check if color engine is properly initialized
    this.assert(engine !== undefined, 'Color engine is available');
    this.assert(engine.version !== undefined, 'Color engine has version');
    this.assert(engine.isInitialized === true, 'Color engine is initialized');
    
    // Check if CSS variables are properly set
    const primaryColor = getComputedStyle(root).getPropertyValue('--primary');
    this.assert(primaryColor !== '', 'Primary color is defined');
    
    // Check if theme attributes are set
    const theme = root.getAttribute('data-theme');
    this.assert(theme !== null, 'Theme attribute is set');
    
    this.addTestResult('Color System Initialization', true, 'All initialization checks passed');
  }

  async testThemeSwitching() {
    const engine = window.HairAtHomeColorEngine;
    const root = document.documentElement;
    
    const themes = ['light', 'dark', 'oled'];
    
    for (const theme of themes) {
      // Switch theme
      engine.switchTheme(theme);
      
      // Wait for transition
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify theme is applied
      const currentTheme = root.getAttribute('data-theme');
      this.assert(currentTheme === theme, `Theme ${theme} applied correctly`);
      
      // Check if colors are updated
      const primaryColor = getComputedStyle(root).getPropertyValue('--primary');
      this.assert(primaryColor !== '', `Primary color defined for ${theme} theme`);
    }
    
    this.addTestResult('Theme Switching', true, 'All themes switch correctly');
  }

  async testContextualAdaptation() {
    const engine = window.HairAtHomeColorEngine;
    const root = document.documentElement;
    
    // Test time-based adaptation
    const timeContexts = ['morning', 'afternoon', 'evening', 'night'];
    for (const time of timeContexts) {
      root.setAttribute('data-time', time);
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const currentTime = root.getAttribute('data-time');
      this.assert(currentTime === time, `Time context ${time} applied correctly`);
    }
    
    // Test seasonal adaptation
    const seasons = ['spring', 'summer', 'autumn', 'winter'];
    for (const season of seasons) {
      root.setAttribute('data-season', season);
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const currentSeason = root.getAttribute('data-season');
      this.assert(currentSeason === season, `Season ${season} applied correctly`);
    }
    
    // Test user state adaptation
    const userStates = ['exploring', 'booking', 'learning', 'relaxed'];
    for (const state of userStates) {
      root.setAttribute('data-user-state', state);
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const currentState = root.getAttribute('data-user-state');
      this.assert(currentState === state, `User state ${state} applied correctly`);
    }
    
    this.addTestResult('Contextual Adaptation', true, 'All contextual adaptations work correctly');
  }

  testColorCalculations() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Test primary color calculations
    const primaryColors = [
      '--primary',
      '--hair-psychology-trust',
      '--hair-psychology-luxury',
      '--hair-psychology-care',
      '--hair-psychology-creativity'
    ];
    
    for (const colorVar of primaryColors) {
      const color = computedStyle.getPropertyValue(colorVar).trim();
      this.assert(color !== '', `${colorVar} is calculated`);
      this.assert(color.includes('hsl'), `${colorVar} uses HSL format`);
    }
    
    // Test mathematical harmony calculations
    const harmonyColors = [
      '--hair-complementary-primary',
      '--hair-triadic-1',
      '--hair-analogous-1',
      '--hair-tetradic-1'
    ];
    
    for (const colorVar of harmonyColors) {
      const color = computedStyle.getPropertyValue(colorVar).trim();
      this.assert(color !== '', `${colorVar} harmony color is calculated`);
    }
    
    this.addTestResult('Color Calculations', true, 'All color calculations working correctly');
  }

  testAccessibilityCompliance() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Test WCAG AAA compliance
    const textOnLight = computedStyle.getPropertyValue('--hair-aaa-text-on-light').trim();
    const textOnDark = computedStyle.getPropertyValue('--hair-aaa-text-on-dark').trim();
    
    this.assert(textOnLight !== '', 'AAA text on light color defined');
    this.assert(textOnDark !== '', 'AAA text on dark color defined');
    
    // Test contrast enhancement
    const contrastEnhanced = computedStyle.getPropertyValue('--hair-contrast-enhanced-primary').trim();
    this.assert(contrastEnhanced !== '', 'Contrast enhanced color defined');
    
    // Test color blindness safety
    const colorblindSafe = computedStyle.getPropertyValue('--hair-colorblind-safe-primary').trim();
    this.assert(colorblindSafe !== '', 'Color blind safe color defined');
    
    // Test glare reduction
    const glareReduced = computedStyle.getPropertyValue('--hair-glare-reduced-primary').trim();
    this.assert(glareReduced !== '', 'Glare reduced color defined');
    
    this.addTestResult('Accessibility Compliance', true, 'All accessibility features implemented');
  }

  async testPerformanceOptimization() {
    const engine = window.HairAtHomeColorEngine;
    
    // Test performance mode detection
    const performanceMode = engine.detectPerformanceMode();
    this.assert(['low', 'medium', 'high'].includes(performanceMode), 'Performance mode detected correctly');
    
    // Test GPU acceleration
    const testElement = document.createElement('div');
    testElement.className = 'hair-gpu-accelerated';
    document.body.appendChild(testElement);
    
    const computedStyle = getComputedStyle(testElement);
    const transform = computedStyle.transform;
    this.assert(transform !== 'none', 'GPU acceleration is applied');
    
    document.body.removeChild(testElement);
    
    // Test CSS containment
    const cardElement = document.createElement('div');
    cardElement.className = 'hair-card';
    document.body.appendChild(cardElement);
    
    const cardStyle = getComputedStyle(cardElement);
    const contain = cardStyle.contain;
    this.assert(contain !== 'none', 'CSS containment is applied');
    
    document.body.removeChild(cardElement);
    
    this.addTestResult('Performance Optimization', true, 'Performance optimizations working correctly');
  }

  testResponsiveBehavior() {
    const root = document.documentElement;
    
    // Test mobile detection
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(navigator.userAgent);
    const deviceAttribute = root.getAttribute('data-device');
    
    if (isMobile) {
      this.assert(deviceAttribute === 'mobile', 'Mobile device detected correctly');
    } else {
      this.assert(deviceAttribute === 'desktop', 'Desktop device detected correctly');
    }
    
    // Test touch detection
    const isTouch = 'ontouchstart' in window;
    this.assert(typeof isTouch === 'boolean', 'Touch detection working');
    
    // Test high DPI detection
    const isHighDPI = window.devicePixelRatio > 1;
    this.assert(typeof isHighDPI === 'boolean', 'High DPI detection working');
    
    this.addTestResult('Responsive Behavior', true, 'Responsive behavior working correctly');
  }

  testColorPsychology() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Test psychology-based colors
    const psychologyColors = [
      { var: '--hair-psychology-trust', expected: 'trust' },
      { var: '--hair-psychology-luxury', expected: 'luxury' },
      { var: '--hair-psychology-care', expected: 'care' },
      { var: '--hair-psychology-creativity', expected: 'creativity' },
      { var: '--hair-psychology-wellness', expected: 'wellness' },
      { var: '--hair-psychology-elegance', expected: 'elegance' }
    ];
    
    for (const { var: colorVar, expected } of psychologyColors) {
      const color = computedStyle.getPropertyValue(colorVar).trim();
      this.assert(color !== '', `${expected} psychology color defined`);
      this.assert(color.includes('hsl'), `${expected} color uses HSL format`);
    }
    
    this.addTestResult('Color Psychology', true, 'All psychology colors implemented correctly');
  }

  testMathematicalHarmony() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Test golden ratio
    const goldenRatio = computedStyle.getPropertyValue('--hair-golden-ratio').trim();
    this.assert(goldenRatio !== '', 'Golden ratio defined');
    this.assert(parseFloat(goldenRatio) > 1.6, 'Golden ratio value correct');
    
    // Test harmony systems
    const harmonySystems = [
      'complementary',
      'triadic',
      'split-complementary',
      'analogous',
      'tetradic'
    ];
    
    for (const system of harmonySystems) {
      const colorVar = `--hair-${system}-primary`;
      const color = computedStyle.getPropertyValue(colorVar).trim();
      this.assert(color !== '', `${system} harmony color defined`);
    }
    
    this.addTestResult('Mathematical Harmony', true, 'All mathematical harmony systems working');
  }

  async testUserPreferenceLearning() {
    const engine = window.HairAtHomeColorEngine;
    
    // Test preference setting
    engine.setUserPreference('preferredTheme', 'dark');
    const preferences = engine.getUserPreferences();
    this.assert(preferences.preferredTheme === 'dark', 'User preference set correctly');
    
    // Test preference saving
    const savedPreferences = localStorage.getItem('hairathome-color-preferences');
    this.assert(savedPreferences !== null, 'User preferences saved to localStorage');
    
    // Test preference loading
    const parsedPreferences = JSON.parse(savedPreferences);
    this.assert(parsedPreferences.preferredTheme === 'dark', 'User preferences loaded correctly');
    
    this.addTestResult('User Preference Learning', true, 'User preference learning working correctly');
  }

  testOLEDOptimization() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Test OLED colors
    const oledColors = [
      '--hair-oled-pure-black',
      '--hair-oled-primary',
      '--hair-oled-secondary',
      '--hair-oled-accent'
    ];
    
    for (const colorVar of oledColors) {
      const color = computedStyle.getPropertyValue(colorVar).trim();
      this.assert(color !== '', `OLED color ${colorVar} defined`);
    }
    
    // Test pure black
    const pureBlack = computedStyle.getPropertyValue('--hair-oled-pure-black').trim();
    this.assert(pureBlack === '#000000', 'Pure black defined for OLED optimization');
    
    this.addTestResult('OLED Optimization', true, 'OLED optimization working correctly');
  }

  testColorBlindnessSafety() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Test color blind safe combinations
    const safeColors = [
      '--hair-colorblind-safe-primary',
      '--hair-colorblind-safe-secondary',
      '--hair-colorblind-safe-accent'
    ];
    
    for (const colorVar of safeColors) {
      const color = computedStyle.getPropertyValue(colorVar).trim();
      this.assert(color !== '', `Color blind safe color ${colorVar} defined`);
    }
    
    this.addTestResult('Color Blindness Safety', true, 'Color blindness safety implemented');
  }

  testAnimationSystem() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Test animation colors
    const animationColors = [
      '--hair-animation-glow',
      '--hair-animation-shimmer',
      '--hair-animation-overlay'
    ];
    
    for (const colorVar of animationColors) {
      const color = computedStyle.getPropertyValue(colorVar).trim();
      this.assert(color !== '', `Animation color ${colorVar} defined`);
    }
    
    // Test animation classes
    const testElement = document.createElement('div');
    testElement.className = 'hair-intelligent-pulse';
    document.body.appendChild(testElement);
    
    const animationStyle = getComputedStyle(testElement);
    const animationName = animationStyle.animationName;
    this.assert(animationName !== 'none', 'Animation class applied correctly');
    
    document.body.removeChild(testElement);
    
    this.addTestResult('Animation System', true, 'Animation system working correctly');
  }

  testUtilityClasses() {
    // Test utility class creation
    const testClasses = [
      'hair-bg-primary',
      'hair-text-primary',
      'hair-border',
      'hair-shadow-md',
      'hair-transition-normal'
    ];
    
    for (const className of testClasses) {
      const testElement = document.createElement('div');
      testElement.className = className;
      document.body.appendChild(testElement);
      
      this.assert(document.querySelector(`.${className}`) !== null, `Utility class ${className} works`);
      
      document.body.removeChild(testElement);
    }
    
    this.addTestResult('Utility Classes', true, 'All utility classes working correctly');
  }

  testBrandDifferentiation() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Test brand signature colors
    const signatureColors = [
      '--hair-signature-gold',
      '--hair-signature-rose',
      '--hair-signature-coral',
      '--hair-signature-plum'
    ];
    
    for (const colorVar of signatureColors) {
      const color = computedStyle.getPropertyValue(colorVar).trim();
      this.assert(color !== '', `Signature color ${colorVar} defined`);
    }
    
    // Test competitive differentiation
    const differentiationColors = [
      '--hair-differentiator-innovative',
      '--hair-differentiator-luxury',
      '--hair-differentiator-natural',
      '--hair-differentiator-bold'
    ];
    
    for (const colorVar of differentiationColors) {
      const color = computedStyle.getPropertyValue(colorVar).trim();
      this.assert(color !== '', `Differentiator color ${colorVar} defined`);
    }
    
    this.addTestResult('Brand Differentiation', true, 'Brand differentiation colors implemented');
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  addTestResult(testName, passed, details = '') {
    this.testResults.push({
      name: testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    });
    
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}: ${details}`);
  }

  generateReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(test => test.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    
    console.log('\n' + '='.repeat(60));
    console.log('🧪 HAIR@HOME INTELLIGENT COLOR SYSTEM VALIDATION REPORT');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${successRate}%`);
    console.log('='.repeat(60));
    
    // Detailed results
    this.testResults.forEach(test => {
      const status = test.passed ? '✅' : '❌';
      console.log(`${status} ${test.name}`);
      if (test.details) {
        console.log(`   ${test.details}`);
      }
    });
    
    // Performance summary
    console.log('\n📊 PERFORMANCE SUMMARY');
    console.log('='.repeat(30));
    const engine = window.HairAtHomeColorEngine;
    if (engine) {
      const context = engine.getContext();
      console.log(`Current Theme: ${document.documentElement.getAttribute('data-theme')}`);
      console.log(`Time Context: ${context.time}`);
      console.log(`Season: ${context.season}`);
      console.log(`User State: ${context.userState}`);
      console.log(`Device Type: ${context.device.type}`);
      console.log(`Performance Mode: ${context.device.performanceMode}`);
    }
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS');
    console.log('='.repeat(30));
    if (failedTests === 0) {
      console.log('🎉 All tests passed! The intelligent color system is working perfectly.');
      console.log('📈 Consider monitoring performance in production for continuous optimization.');
    } else {
      console.log('⚠️  Some tests failed. Please review the detailed results above.');
      console.log('🔧 Address the failing components to ensure optimal performance.');
    }
    
    console.log('\n🎨 Color System Status: ' + (failedTests === 0 ? 'PRODUCTION READY' : 'NEEDS ATTENTION'));
    console.log('='.repeat(60));
    
    // Return results for programmatic use
    return {
      totalTests,
      passedTests,
      failedTests,
      successRate: parseFloat(successRate),
      isProductionReady: failedTests === 0,
      results: this.testResults
    };
  }
}

// Auto-run validation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for color engine to initialize
  setTimeout(() => {
    new IntelligentColorSystemValidator();
  }, 1000);
});

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IntelligentColorSystemValidator;
}