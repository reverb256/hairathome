/**
 * Hair@Home Color System Implementation Script
 * Enterprise-grade color system with theme switching, accessibility, and performance optimization
 */

class HairAtHomeColorSystem {
  constructor(options = {}) {
    this.options = {
      defaultTheme: 'light',
      enableTransitions: true,
      enableOLED: true,
      enableAccessibility: true,
      enablePerformance: true,
      ...options
    };
    
    this.currentTheme = this.loadTheme();
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    console.log('🎨 Initializing Hair@Home Color System...');
    
    this.setupTheme();
    this.setupAccessibility();
    this.setupPerformance();
    this.setupEventListeners();
    this.setupThemeToggle();
    this.setupColorUtilities();
    
    this.isInitialized = true;
    console.log('✅ Hair@Home Color System initialized successfully');
    
    // Emit initialization event
    this.emitEvent('colorSystem:initialized', {
      theme: this.currentTheme,
      features: this.getEnabledFeatures()
    });
  }

  setupTheme() {
    // Apply saved theme or detect system preference
    if (!this.currentTheme) {
      this.currentTheme = this.detectSystemTheme();
    }
    
    // Apply theme
    this.applyTheme(this.currentTheme);
    
    // Setup system theme detection
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('hairathome-theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(newTheme);
      }
    });
    
    // OLED detection for mobile devices
    if (this.options.enableOLED && this.detectOLEDScreen()) {
      console.log('📱 OLED screen detected, enabling optimized theme');
      if (this.currentTheme === 'dark') {
        this.applyTheme('oled');
      }
    }
  }

  setupAccessibility() {
    if (!this.options.enableAccessibility) return;
    
    // High contrast mode detection
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    highContrastQuery.addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('hair-high-contrast');
      } else {
        document.body.classList.remove('hair-high-contrast');
      }
    });
    
    // Reduced motion detection
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotionQuery.matches) {
      document.body.classList.add('hair-reduced-motion');
    }
    
    reducedMotionQuery.addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('hair-reduced-motion');
      } else {
        document.body.classList.remove('hair-reduced-motion');
      }
    });
    
    // Focus visible enhancement
    this.setupFocusManagement();
  }

  setupPerformance() {
    if (!this.options.enablePerformance) return;
    
    // CSS containment for better performance
    this.addCSSContainment();
    
    // Lazy load color system if not critical
    this.optimizeColorSystemLoading();
    
    // Monitor performance
    this.setupPerformanceMonitoring();
  }

  setupEventListeners() {
    // Theme change events
    document.addEventListener('theme:change', (e) => {
      this.handleThemeChange(e.detail.theme);
    });
    
    // Color system events
    document.addEventListener('colorSystem:refresh', () => {
      this.refreshColorSystem();
    });
    
    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.refreshColorSystem();
      }
    });
  }

  setupThemeToggle() {
    // Create theme toggle button if not exists
    if (!document.getElementById('hair-theme-toggle')) {
      this.createThemeToggle();
    }
    
    // Keyboard shortcuts for theme switching
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Shift + T for theme toggle
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.toggleTheme();
      }
      
      // Ctrl/Cmd + Shift + L for light theme
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        this.setTheme('light');
      }
      
      // Ctrl/Cmd + Shift + D for dark theme
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.setTheme('dark');
      }
    });
  }

  setupColorUtilities() {
    // Add color utility functions to global scope
    window.hairColorUtils = {
      getContrastRatio: this.getContrastRatio.bind(this),
      getLuminance: this.getLuminance.bind(this),
      hexToRgb: this.hexToRgb.bind(this),
      getColorVariable: this.getColorVariable.bind(this),
      generateColorPalette: this.generateColorPalette.bind(this)
    };
  }

  // Theme Management
  setTheme(theme) {
    if (!['light', 'dark', 'oled'].includes(theme)) {
      console.warn(`Invalid theme: ${theme}. Use 'light', 'dark', or 'oled'`);
      return;
    }
    
    this.applyTheme(theme);
    this.saveTheme(theme);
    
    this.emitEvent('theme:change', { theme, previous: this.currentTheme });
    this.currentTheme = theme;
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Add transition class for smooth theme switching
    if (this.options.enableTransitions) {
      document.body.classList.add('hair-theme-transitioning');
      setTimeout(() => {
        document.body.classList.remove('hair-theme-transitioning');
      }, 300);
    }
    
    // Update theme toggle button
    this.updateThemeToggle(theme);
    
    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);
  }

  toggleTheme() {
    const themes = ['light', 'dark', 'oled'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  detectSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  detectOLEDScreen() {
    // Check for OLED screen capabilities
    return window.matchMedia('(color-gamut: p3)').matches && 
           window.matchMedia('(max-width: 768px)').matches;
  }

  // Storage Management
  saveTheme(theme) {
    try {
      localStorage.setItem('hairathome-theme', theme);
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  }

  loadTheme() {
    try {
      return localStorage.getItem('hairathome-theme');
    } catch (e) {
      console.warn('Could not load theme preference:', e);
      return null;
    }
  }

  // UI Components
  createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.id = 'hair-theme-toggle';
    toggle.className = 'hair-btn hair-btn-secondary hair-theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle color theme');
    toggle.innerHTML = `
      <span class="hair-theme-icon">🌙</span>
      <span class="hair-theme-text">Theme</span>
    `;
    
    toggle.addEventListener('click', () => this.toggleTheme());
    
    // Add to page (preferably in header)
    const header = document.querySelector('header') || document.body;
    header.appendChild(toggle);
    
    this.updateThemeToggle(this.currentTheme);
  }

  updateThemeToggle(theme) {
    const toggle = document.getElementById('hair-theme-toggle');
    if (!toggle) return;
    
    const icon = toggle.querySelector('.hair-theme-icon');
    const text = toggle.querySelector('.hair-theme-text');
    
    const themeConfig = {
      light: { icon: '☀️', text: 'Light' },
      dark: { icon: '🌙', text: 'Dark' },
      oled: { icon: '📱', text: 'OLED' }
    };
    
    const config = themeConfig[theme] || themeConfig.light;
    icon.textContent = config.icon;
    text.textContent = config.text;
  }

  updateMetaThemeColor(theme) {
    let themeColor = '#f3e6d0'; // Default light theme color
    
    switch (theme) {
      case 'dark':
        themeColor = '#0a0a0a';
        break;
      case 'oled':
        themeColor = '#000000';
        break;
    }
    
    // Update or create theme-color meta tag
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = themeColor;
  }

  // Accessibility Features
  setupFocusManagement() {
    // Enhanced focus styles
    const style = document.createElement('style');
    style.textContent = `
      .hair-focus-visible :focus-visible {
        outline: 3px solid var(--hair-primary-400);
        outline-offset: 2px;
        border-radius: var(--hair-radius-base);
      }
      
      .hair-high-contrast {
        --hair-primary-400: #b38a28;
        --hair-primary-500: #917022;
        --hair-rose-400: #b58370;
        --hair-coral-400: #ad7352;
        --border: rgba(212, 175, 55, 0.5);
        --border-strong: rgba(212, 175, 55, 0.7);
      }
      
      .hair-reduced-motion *,
      .hair-reduced-motion *::before,
      .hair-reduced-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      .hair-theme-transitioning * {
        transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
    `;
    document.head.appendChild(style);
    
    // Add focus-visible class to body
    document.body.classList.add('hair-focus-visible');
  }

  // Performance Optimization
  addCSSContainment() {
    const style = document.createElement('style');
    style.textContent = `
      .hair-card { contain: layout style paint; }
      .hair-btn { contain: layout style; }
      .hair-input { contain: layout style; }
    `;
    document.head.appendChild(style);
  }

  optimizeColorSystemLoading() {
    // Mark color system as non-critical for faster initial page load
    const colorSystemLink = document.querySelector('link[href*="hairathome-color-system"]');
    if (colorSystemLink) {
      colorSystemLink.rel = 'preload';
      colorSystemLink.as = 'style';
      colorSystemLink.onload = function() {
        this.onload = null;
        this.rel = 'stylesheet';
      };
    }
  }

  setupPerformanceMonitoring() {
    // Monitor color system performance
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('hairathome-color-system')) {
            console.log(`📊 Color system loaded in ${entry.duration.toFixed(2)}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  // Color Utilities
  getContrastRatio(color1, color2) {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  getLuminance(hexColor) {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return 0;
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  getColorVariable(variable) {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  }

  generateColorPalette(baseColor, steps = 9) {
    // Generate a color palette from a base color
    const rgb = this.hexToRgb(baseColor);
    if (!rgb) return {};
    
    const palette = {};
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    for (let i = 1; i <= steps; i++) {
      const lightness = (i / steps) * 100;
      const newColor = this.hslToHex(hsl.h, hsl.s, lightness);
      palette[Math.round(lightness * 10)] = newColor;
    }
    
    return palette;
  }

  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  hslToHex(h, s, l) {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // Event Management
  emitEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }

  handleThemeChange(theme) {
    console.log(`🎨 Theme changed to: ${theme}`);
    
    // Update any components that need to respond to theme changes
    this.updateComponentsForTheme(theme);
    
    // Re-run any color-dependent calculations
    this.refreshColorCalculations();
  }

  updateComponentsForTheme(theme) {
    // Update charts, graphs, or other visual components
    const charts = document.querySelectorAll('[data-chart]');
    charts.forEach(chart => {
      if (chart.updateTheme) {
        chart.updateTheme(theme);
      }
    });
    
    // Update any custom components
    const components = document.querySelectorAll('[data-theme-aware]');
    components.forEach(component => {
      component.setAttribute('data-current-theme', theme);
    });
  }

  refreshColorCalculations() {
    // Re-calculate any color-dependent values
    const colorElements = document.querySelectorAll('[data-contrast-check]');
    colorElements.forEach(element => {
      const color = window.getComputedStyle(element).color;
      const backgroundColor = window.getComputedStyle(element).backgroundColor;
      const ratio = this.getContrastRatio(color, backgroundColor);
      
      element.setAttribute('data-contrast-ratio', ratio.toFixed(2));
      
      if (ratio < 4.5) {
        console.warn(`Low contrast detected: ${ratio.toFixed(2)}:1`, element);
      }
    });
  }

  refreshColorSystem() {
    // Refresh all color system features
    this.applyTheme(this.currentTheme);
    this.updateMetaThemeColor(this.currentTheme);
    this.refreshColorCalculations();
  }

  // Utility Methods
  getEnabledFeatures() {
    return {
      themeSwitching: true,
      accessibility: this.options.enableAccessibility,
      oledOptimization: this.options.enableOLED,
      performance: this.options.enablePerformance,
      transitions: this.options.enableTransitions
    };
  }

  getSystemInfo() {
    return {
      currentTheme: this.currentTheme,
      systemTheme: this.detectSystemTheme(),
      isOLEDScreen: this.detectOLEDScreen(),
      prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      colorGamut: this.getColorGamut(),
      initialized: this.isInitialized
    };
  }

  getColorGamut() {
    if (window.matchMedia('(color-gamut: p3)').matches) return 'p3';
    if (window.matchMedia('(color-gamut: srgb)').matches) return 'srgb';
    return 'unknown';
  }

  // Public API
  getTheme() {
    return this.currentTheme;
  }

  getAvailableThemes() {
    return ['light', 'dark', 'oled'];
  }

  resetTheme() {
    localStorage.removeItem('hairathome-theme');
    const systemTheme = this.detectSystemTheme();
    this.setTheme(systemTheme);
  }

  destroy() {
    // Clean up event listeners and resources
    document.removeEventListener('theme:change', this.handleThemeChange);
    document.removeEventListener('colorSystem:refresh', this.refreshColorSystem);
    
    // Remove theme toggle if created by this instance
    const toggle = document.getElementById('hair-theme-toggle');
    if (toggle && toggle.dataset.createdBy === 'hairColorSystem') {
      toggle.remove();
    }
    
    this.isInitialized = false;
    console.log('🗑️ Hair@Home Color System destroyed');
  }
}

// Auto-initialize if not in module environment
if (typeof window !== 'undefined' && !window.hairColorSystem) {
  window.hairColorSystem = new HairAtHomeColorSystem({
    defaultTheme: 'light',
    enableTransitions: true,
    enableOLED: true,
    enableAccessibility: true,
    enablePerformance: true
  });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HairAtHomeColorSystem;
}