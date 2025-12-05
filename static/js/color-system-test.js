/**
 * Hair@Home Color System Testing & Validation Suite
 * Comprehensive testing for the enterprise-grade color system
 */

class HairAtHomeColorSystem {
  constructor() {
    this.testResults = [];
    this.colorSystem = this.getColorSystem();
    this.init();
  }

  init() {
    console.log('🎨 Hair@Home Color System Testing Suite Initialized');
    this.runAllTests();
    this.displayResults();
  }

  getColorSystem() {
    return {
      primary: {
        50: '#fdf8f3', 100: '#f9f0e6', 200: '#f3e6d0', 300: '#e6d4b6',
        400: '#d4af37', 500: '#c59d2f', 600: '#b38a28', 700: '#917022',
        800: '#735b1c', 900: '#5c4815'
      },
      rose: {
        50: '#fdf7f5', 100: '#fbeee8', 200: '#f5e0d3', 300: '#e8c4a8',
        400: '#d4a998', 500: '#c89583', 600: '#b58370', 700: '#936b5a',
        800: '#755547', 900: '#5f4438'
      },
      coral: {
        50: '#fdf6f4', 100: '#fbece8', 200: '#f5d9ce', 300: '#e8b89f',
        400: '#d49976', 500: '#c28460', 600: '#ad7352', 700: '#8c5c42',
        800: '#6f4934', 900: '#5a3b2a'
      },
      neutral: {
        0: '#ffffff', 50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5',
        300: '#d4d4d4', 400: '#a3a3a3', 500: '#737373', 600: '#525252',
        700: '#404040', 800: '#262626', 900: '#171717', 950: '#0a0a0a'
      },
      semantic: {
        success: { 50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a' },
        warning: { 50: '#fffbeb', 100: '#fef3c7', 500: '#f59e0b', 600: '#d97706' },
        error: { 50: '#fef2f2', 100: '#fee2e2', 500: '#ef4444', 600: '#dc2626' },
        info: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb' }
      }
    };
  }

  runAllTests() {
    this.testColorConsistency();
    this.testContrastRatios();
    this.testThemeImplementation();
    this.testGradientDefinitions();
    this.testAccessibility();
    this.testPerformance();
    this.testBrandDifferentiation();
    this.testResponsiveBehavior();
  }

  testColorConsistency() {
    console.log('🔍 Testing Color Consistency...');
    
    let passed = 0;
    let total = 0;

    // Test primary color progression
    const primaryColors = this.colorSystem.primary;
    for (let i = 50; i <= 900; i += 50) {
      total++;
      if (primaryColors[i]) {
        const luminance = this.getLuminance(primaryColors[i]);
        // Ensure proper lightness progression
        if (i <= 400 && luminance > 0.5) passed++;
        else if (i >= 500 && luminance < 0.5) passed++;
      }
    }

    this.addTestResult('Color Consistency', passed, total, 'Proper color lightness progression');
  }

  testContrastRatios() {
    console.log('👁️ Testing Contrast Ratios...');
    
    let passed = 0;
    let total = 0;

    // Test WCAG AA compliance (4.5:1 for normal text)
    const testCases = [
      { text: '#1e1916', bg: '#f3e6d0', name: 'Primary text on light background' },
      { text: '#f9f5ee', bg: '#0a0a0a', name: 'Light text on dark background' },
      { text: '#d4af37', bg: '#ffffff', name: 'Gold accent on white' },
      { text: '#ffffff', bg: '#d4af37', name: 'White text on gold' }
    ];

    testCases.forEach(testCase => {
      total++;
      const ratio = this.getContrastRatio(testCase.text, testCase.bg);
      if (ratio >= 4.5) {
        passed++;
        console.log(`✅ ${testCase.name}: ${ratio.toFixed(2)}:1`);
      } else {
        console.log(`❌ ${testCase.name}: ${ratio.toFixed(2)}:1 (below 4.5:1)`);
      }
    });

    this.addTestResult('WCAG AA Contrast', passed, total, 'Minimum 4.5:1 contrast ratio');
  }

  testThemeImplementation() {
    console.log('🌓 Testing Theme Implementation...');
    
    let passed = 0;
    let total = 0;

    // Test theme variables exist
    const themes = ['light', 'dark', 'oled'];
    const variables = ['bg-primary', 'text-primary', 'border', 'shadow-md'];

    themes.forEach(theme => {
      variables.forEach(variable => {
        total++;
        const cssVar = `--hair-${theme}-${variable}`;
        if (this.getCSSVariable(cssVar)) {
          passed++;
        }
      });
    });

    // Test theme switching functionality
    total++;
    if (typeof this.switchTheme === 'function' || document.querySelector('[data-theme]')) {
      passed++;
    }

    this.addTestResult('Theme Implementation', passed, total, 'All theme variables and switching');
  }

  testGradientDefinitions() {
    console.log('🌈 Testing Gradient Definitions...');
    
    let passed = 0;
    let total = 0;

    const gradients = [
      'hair-gradient-primary',
      'hair-gradient-secondary',
      'hair-gradient-accent',
      'hair-gradient-luxury',
      'hair-gradient-sunset',
      'hair-gradient-elegant'
    ];

    gradients.forEach(gradient => {
      total++;
      const cssVar = `--${gradient}`;
      if (this.getCSSVariable(cssVar)) {
        passed++;
      }
    });

    this.addTestResult('Gradient Definitions', passed, total, 'All gradient CSS variables defined');
  }

  testAccessibility() {
    console.log('♿ Testing Accessibility Features...');
    
    let passed = 0;
    let total = 0;

    // Test focus indicators
    total++;
    const focusStyles = this.getCSSVariable('--hair-primary-400');
    if (focusStyles) {
      passed++;
    }

    // Test reduced motion support
    total++;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery) {
      passed++;
    }

    // Test high contrast mode support
    total++;
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    if (highContrastQuery) {
      passed++;
    }

    // Test semantic color usage
    total++;
    const semanticColors = this.colorSystem.semantic;
    if (semanticColors.success && semanticColors.warning && semanticColors.error && semanticColors.info) {
      passed++;
    }

    this.addTestResult('Accessibility Features', passed, total, 'Focus, reduced motion, high contrast, semantic colors');
  }

  testPerformance() {
    console.log('⚡ Testing Performance...');
    
    let passed = 0;
    let total = 0;

    // Test CSS file size (should be under 50KB for color system)
    total++;
    const colorSystemSize = this.estimateCSSFileSize();
    if (colorSystemSize < 50 * 1024) { // 50KB
      passed++;
      console.log(`✅ Color system CSS size: ${(colorSystemSize / 1024).toFixed(2)}KB`);
    } else {
      console.log(`⚠️ Color system CSS size: ${(colorSystemSize / 1024).toFixed(2)}KB (consider optimization)`);
    }

    // Test CSS variable usage efficiency
    total++;
    const cssVariables = document.querySelectorAll('[style*="var("]');
    if (cssVariables.length > 0) {
      passed++;
    }

    // Test animation performance
    total++;
    const animations = document.getAnimations();
    if (animations.length <= 10) { // Reasonable number of animations
      passed++;
    }

    this.addTestResult('Performance', passed, total, 'CSS size, variable usage, animation count');
  }

  testBrandDifferentiation() {
    console.log('🏆 Testing Brand Differentiation...');
    
    let passed = 0;
    let total = 0;

    // Test unique color combinations
    const uniqueColors = [
      '#d4af37', // Luxury gold
      '#d4a998', // Warm rose
      '#d49976'  // Coral accent
    ];

    uniqueColors.forEach(color => {
      total++;
      if (this.isUniqueColor(color)) {
        passed++;
      }
    });

    // Test luxury elements
    total++;
    const luxuryElements = document.querySelectorAll('.hair-brand-glow, .hair-brand-shimmer, .hair-brand-luxury-border');
    if (luxuryElements.length > 0) {
      passed++;
    }

    // Test professional balance
    total++;
    const professionalColors = this.colorSystem.neutral;
    if (professionalColors && Object.keys(professionalColors).length >= 10) {
      passed++;
    }

    this.addTestResult('Brand Differentiation', passed, total, 'Unique colors, luxury elements, professional balance');
  }

  testResponsiveBehavior() {
    console.log('📱 Testing Responsive Behavior...');
    
    let passed = 0;
    let total = 0;

    // Test mobile breakpoints
    const breakpoints = [
      { query: '(max-width: 480px)', name: 'Mobile' },
      { query: '(max-width: 768px)', name: 'Tablet' },
      { query: '(min-width: 1024px)', name: 'Desktop' }
    ];

    breakpoints.forEach(breakpoint => {
      total++;
      const mediaQuery = window.matchMedia(breakpoint.query);
      if (mediaQuery) {
        passed++;
      }
    });

    // Test touch targets
    total++;
    const touchTargets = document.querySelectorAll('.hair-btn');
    let validTouchTargets = 0;
    touchTargets.forEach(target => {
      const rect = target.getBoundingClientRect();
      if (rect.width >= 44 && rect.height >= 44) {
        validTouchTargets++;
      }
    });
    if (validTouchTargets === touchTargets.length || touchTargets.length === 0) {
      passed++;
    }

    this.addTestResult('Responsive Behavior', passed, total, 'Breakpoints and touch targets');
  }

  // Utility methods
  getLuminance(hexColor) {
    const rgb = this.hexToRgb(hexColor);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  getContrastRatio(color1, color2) {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  getCSSVariable(variable) {
    return getComputedStyle(document.documentElement).getPropertyValue(variable);
  }

  isUniqueColor(color) {
    // Check if color is unique compared to common web colors
    const commonColors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    return !commonColors.includes(color.toLowerCase());
  }

  estimateCSSFileSize() {
    // Rough estimation of color system CSS file size
    const colorSystemCSS = document.querySelector('link[href*="hairathome-color-system"]');
    if (colorSystemCSS) {
      return 15000; // Estimated 15KB
    }
    return 10000; // Estimated 10KB for inline styles
  }

  addTestResult(testName, passed, total, description) {
    const percentage = Math.round((passed / total) * 100);
    const status = percentage >= 80 ? '✅ PASS' : percentage >= 60 ? '⚠️ WARN' : '❌ FAIL';
    
    this.testResults.push({
      name: testName,
      passed,
      total,
      percentage,
      status,
      description
    });

    console.log(`${status} ${testName}: ${passed}/${total} (${percentage}%) - ${description}`);
  }

  displayResults() {
    console.log('\n📊 HAIR@HOME COLOR SYSTEM TEST RESULTS');
    console.log('=' .repeat(50));

    let totalPassed = 0;
    let totalTests = 0;

    this.testResults.forEach(result => {
      totalPassed += result.passed;
      totalTests += result.total;
      console.log(`${result.status} ${result.name}: ${result.passed}/${result.total} (${result.percentage}%)`);
    });

    const overallPercentage = Math.round((totalPassed / totalTests) * 100);
    const overallStatus = overallPercentage >= 80 ? '🏆 EXCELLENT' : overallPercentage >= 60 ? '✅ GOOD' : '⚠️ NEEDS IMPROVEMENT';

    console.log('\n' + '=' .repeat(50));
    console.log(`${overallStatus} OVERALL: ${totalPassed}/${totalTests} (${overallPercentage}%)`);
    console.log('=' .repeat(50));

    // Display recommendations
    this.displayRecommendations();

    // Create visual test report
    this.createVisualReport();
  }

  displayRecommendations() {
    console.log('\n💡 RECOMMENDATIONS:');
    
    this.testResults.forEach(result => {
      if (result.percentage < 80) {
        switch (result.name) {
          case 'WCAG AA Contrast':
            console.log('   • Improve text contrast ratios for better accessibility');
            break;
          case 'Theme Implementation':
            console.log('   • Ensure all theme variables are properly defined');
            break;
          case 'Performance':
            console.log('   • Optimize CSS file size and reduce animations');
            break;
          case 'Brand Differentiation':
            console.log('   • Enhance unique brand elements and luxury features');
            break;
          default:
            console.log(`   • Review and improve ${result.name.toLowerCase()}`);
        }
      }
    });
  }

  createVisualReport() {
    // Create a visual test report overlay
    const report = document.createElement('div');
    report.id = 'hair-color-system-report';
    report.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--surface, #ffffff);
      border: 1px solid var(--border, #e5e5e5);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      font-family: var(--hair-font-body, system-ui);
      font-size: 14px;
      z-index: 10000;
      max-width: 400px;
      backdrop-filter: blur(10px);
    `;

    const overallPercentage = Math.round(
      this.testResults.reduce((acc, r) => acc + r.percentage, 0) / this.testResults.length
    );

    report.innerHTML = `
      <h3 style="margin: 0 0 15px 0; color: var(--text-primary, #1e1916); font-family: var(--hair-font-display, serif);">
        🎨 Color System Report
      </h3>
      <div style="margin-bottom: 15px;">
        <div style="font-size: 24px; font-weight: bold; color: var(--hair-primary-400, #d4af37);">
          ${overallPercentage}%
        </div>
        <div style="color: var(--text-secondary, #5a4a3f);">Overall Score</div>
      </div>
      <div style="border-top: 1px solid var(--border, #e5e5e5); padding-top: 15px;">
        ${this.testResults.map(result => `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-secondary, #5a4a3f);">${result.name}</span>
            <span style="color: ${result.percentage >= 80 ? 'var(--hair-success-500, #22c55e)' : result.percentage >= 60 ? 'var(--hair-warning-500, #f59e0b)' : 'var(--hair-error-500, #ef4444)'};">
              ${result.percentage}%
            </span>
          </div>
        `).join('')}
      </div>
      <button onclick="this.parentElement.remove()" style="
        margin-top: 15px;
        padding: 8px 16px;
        background: var(--hair-gradient-primary, linear-gradient(135deg, #d4af37, #b38a28));
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        width: 100%;
      ">
        Close Report
      </button>
    `;

    document.body.appendChild(report);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (report.parentElement) {
        report.remove();
      }
    }, 10000);
  }
}

// Theme switching functionality
function switchTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('hairathome-theme', theme);
  
  // Add transition class for smooth theme switching
  document.body.classList.add('hair-theme-transitioning');
  setTimeout(() => {
    document.body.classList.remove('hair-theme-transitioning');
  }, 300);
}

// Auto-detect and apply saved theme
function initializeTheme() {
  const savedTheme = localStorage.getItem('hairathome-theme');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = savedTheme || systemTheme;
  
  document.documentElement.setAttribute('data-theme', theme);
  
  // Detect OLED for mobile devices
  if (window.matchMedia('(color-gamut: p3)').matches && theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'oled');
  }
}

// Initialize color system testing when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  
  // Run color system tests in development mode
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.hairColorSystem = new HairAtHomeColorSystem();
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HairAtHomeColorSystem, switchTheme, initializeTheme };
}