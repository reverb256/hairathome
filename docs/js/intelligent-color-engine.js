/**
 * =================================================================
 * HAIR@HOME INTELLIGENT COLOR ENGINE v3.0
 * AI-Powered Dynamic Color Adaptation System
 * =================================================================
 * 
 * Features:
 * - Time-based color adaptation
 * - Seasonal color intelligence
 * - User behavior learning
 * - Contextual theme switching
 * - Performance optimization
 * - Accessibility enhancement
 * - Battery optimization
 */

class IntelligentColorEngine {
  constructor() {
    this.version = '3.0.0';
    this.isInitialized = false;
    this.userPreferences = this.loadUserPreferences();
    this.currentContext = this.analyzeContext();
    this.performanceMode = this.detectPerformanceMode();
    this.adaptationHistory = [];
    
    // Initialize the engine
    this.init();
  }

  /**
   * Initialize the intelligent color engine
   */
  async init() {
    console.log('🎨 Hair@Home Intelligent Color Engine v3.0 initializing...');
    
    // Set up initial theme
    this.applyInitialTheme();
    
    // Start contextual adaptation
    this.startContextualAdaptation();
    
    // Initialize user behavior tracking
    this.initializeBehaviorTracking();
    
    // Set up performance monitoring
    this.initializePerformanceMonitoring();
    
    // Initialize accessibility features
    this.initializeAccessibilityFeatures();
    
    this.isInitialized = true;
    console.log('✨ Intelligent Color Engine initialized successfully');
    
    // Emit initialization event
    this.emitEvent('colorEngine:initialized', {
      version: this.version,
      context: this.currentContext,
      preferences: this.userPreferences
    });
  }

  /**
   * Analyze current context for color adaptation
   */
  analyzeContext() {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth();
    
    // Time context
    let timeContext = 'afternoon';
    if (hour >= 5 && hour < 12) timeContext = 'morning';
    else if (hour >= 12 && hour < 17) timeContext = 'afternoon';
    else if (hour >= 17 && hour < 21) timeContext = 'evening';
    else timeContext = 'night';
    
    // Season context
    let seasonContext = 'summer';
    if (month >= 2 && month <= 4) seasonContext = 'spring';
    else if (month >= 5 && month <= 7) seasonContext = 'summer';
    else if (month >= 8 && month <= 10) seasonContext = 'autumn';
    else seasonContext = 'winter';
    
    // Device context
    const deviceContext = this.detectDeviceContext();
    
    // User state context
    const userState = this.detectUserState();
    
    return {
      time: timeContext,
      season: seasonContext,
      device: deviceContext,
      userState: userState,
      timestamp: now.getTime(),
      location: this.detectLocation()
    };
  }

  /**
   * Detect device context for optimization
   */
  detectDeviceContext() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent);
    const isOLED = this.detectOLEDScreen();
    
    return {
      type: isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop'),
      isOLED: isOLED,
      isTouch: 'ontouchstart' in window,
      isHighDPI: window.devicePixelRatio > 1,
      batteryLevel: this.getBatteryLevel(),
      performanceMode: this.detectPerformanceMode()
    };
  }

  /**
   * Detect OLED screen for battery optimization
   */
  detectOLEDScreen() {
    // Heuristic detection - in real implementation, would use more sophisticated detection
    const userAgent = navigator.userAgent.toLowerCase();
    return /samsung|galaxy.*s[0-9]|pixel.*[0-9]/i.test(userAgent);
  }

  /**
   * Get battery level for optimization
   */
  async getBatteryLevel() {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        return battery.level;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Detect performance mode
   */
  detectPerformanceMode() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
    
    if (isSlowConnection || isLowEndDevice) return 'low';
    if (connection && connection.effectiveType === '4g') return 'high';
    return 'medium';
  }

  /**
   * Detect user state based on behavior
   */
  detectUserState() {
    // Analyze current page and user behavior
    const path = window.location.pathname;
    const scrollDepth = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const timeOnPage = performance.now();
    
    if (path.includes('booking') || path.includes('contact')) return 'booking';
    if (path.includes('gallery') || scrollDepth > 0.7) return 'exploring';
    if (path.includes('about') || path.includes('services')) return 'learning';
    if (timeOnPage < 5000) return 'browsing';
    return 'relaxed';
  }

  /**
   * Detect user location for Winnipeg-specific adaptation
   */
  detectLocation() {
    // In production, would use geolocation API
    // For now, assume Winnipeg based on business location
    return {
      city: 'Winnipeg',
      province: 'MB',
      timezone: 'America/Winnipeg',
      isLocal: true
    };
  }

  /**
   * Apply initial theme based on context
   */
  applyInitialTheme() {
    const html = document.documentElement;
    
    // Base theme selection
    let theme = this.userPreferences.preferredTheme || 'light';
    
    // Auto-detect theme preference
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    
    // OLED optimization
    if (this.currentContext.device.isOLED && theme === 'dark') {
      theme = 'oled';
    }
    
    // Apply theme
    html.setAttribute('data-theme', theme);
    
    // Apply contextual adaptations
    html.setAttribute('data-time', this.currentContext.time);
    html.setAttribute('data-season', this.currentContext.season);
    html.setAttribute('data-user-state', this.currentContext.userState);
    
    // Winnipeg-specific adaptation
    if (this.currentContext.location.isLocal) {
      html.setAttribute('data-location', 'winnipeg');
    }
    
    // Performance mode
    html.setAttribute('data-performance', this.performanceMode);
    
    console.log(`🎨 Applied theme: ${theme} with context:`, this.currentContext);
  }

  /**
   * Start contextual adaptation monitoring
   */
  startContextualAdaptation() {
    // Time-based adaptation (check every 5 minutes)
    setInterval(() => {
      this.updateTimeContext();
    }, 5 * 60 * 1000);
    
    // User behavior adaptation (check every 30 seconds)
    setInterval(() => {
      this.updateUserState();
    }, 30 * 1000);
    
    // Battery level monitoring
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        battery.addEventListener('levelchange', () => {
          this.adaptToBatteryLevel(battery.level);
        });
      });
    }
    
    // Network quality adaptation
    if (navigator.connection) {
      navigator.connection.addEventListener('change', () => {
        this.adaptToNetworkQuality();
      });
    }
    
    // System theme change detection
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.userPreferences.preferredTheme === 'auto') {
        const newTheme = e.matches ? 'dark' : 'light';
        this.switchTheme(newTheme);
      }
    });
  }

  /**
   * Update time-based context
   */
  updateTimeContext() {
    const newContext = this.analyzeContext();
    if (newContext.time !== this.currentContext.time) {
      this.currentContext.time = newContext.time;
      document.documentElement.setAttribute('data-time', newContext.time);
      this.emitEvent('context:timeChanged', { time: newContext.time });
    }
  }

  /**
   * Update user state based on behavior
   */
  updateUserState() {
    const newUserState = this.detectUserState();
    if (newUserState !== this.currentContext.userState) {
      this.currentContext.userState = newUserState;
      document.documentElement.setAttribute('data-user-state', newUserState);
      this.emitEvent('context:userStateChanged', { userState: newUserState });
    }
  }

  /**
   * Adapt to battery level for optimization
   */
  adaptToBatteryLevel(level) {
    if (level < 0.2 && this.currentContext.device.isOLED) {
      // Switch to OLED theme for battery savings
      this.switchTheme('oled');
      this.reduceAnimations();
      this.emitEvent('adaptation:batteryLow', { level });
    } else if (level > 0.5) {
      // Restore normal operation
      this.restoreAnimations();
    }
  }

  /**
   * Adapt to network quality
   */
  adaptToNetworkQuality() {
    const connection = navigator.connection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        this.performanceMode = 'low';
        this.enableLowPerformanceMode();
      } else if (effectiveType === '4g') {
        this.performanceMode = 'high';
        this.enableHighPerformanceMode();
      }
      document.documentElement.setAttribute('data-performance', this.performanceMode);
    }
  }

  /**
   * Initialize user behavior tracking
   */
  initializeBehaviorTracking() {
    // Track interactions for learning
    document.addEventListener('click', (e) => {
      this.trackInteraction('click', e.target);
    });
    
    document.addEventListener('scroll', () => {
      this.trackScrolling();
    }, { passive: true });
    
    // Track theme preferences
    this.trackThemePreferences();
  }

  /**
   * Track user interactions
   */
  trackInteraction(type, element) {
    const interaction = {
      type,
      timestamp: Date.now(),
      element: element.tagName,
      className: element.className,
      theme: document.documentElement.getAttribute('data-theme'),
      context: this.currentContext
    };
    
    this.adaptationHistory.push(interaction);
    
    // Learn from interactions
    this.learnFromInteraction(interaction);
  }

  /**
   * Track scrolling behavior
   */
  trackScrolling() {
    const scrollDepth = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    
    if (scrollDepth > 0.8 && this.currentContext.userState !== 'exploring') {
      this.currentContext.userState = 'exploring';
      document.documentElement.setAttribute('data-user-state', 'exploring');
    }
  }

  /**
   * Track theme preferences
   */
  trackThemePreferences() {
    // Track manual theme switches
    const themeButtons = document.querySelectorAll('[data-theme-switch]');
    themeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const theme = e.target.getAttribute('data-theme-switch');
        this.userPreferences.preferredTheme = theme;
        this.saveUserPreferences();
        this.emitEvent('preference:themeChanged', { theme });
      });
    });
  }

  /**
   * Learn from user interactions
   */
  learnFromInteraction(interaction) {
    // Simple learning algorithm - in production would use ML
    const recentInteractions = this.adaptationHistory.slice(-10);
    const themeFrequency = {};
    
    recentInteractions.forEach(interaction => {
      const theme = interaction.theme;
      themeFrequency[theme] = (themeFrequency[theme] || 0) + 1;
    });
    
    // Adjust preferences based on interaction patterns
    const mostUsedTheme = Object.keys(themeFrequency).reduce((a, b) => 
      themeFrequency[a] > themeFrequency[b] ? a : b
    );
    
    if (themeFrequency[mostUsedTheme] > 5) {
      this.userPreferences.learnedTheme = mostUsedTheme;
    }
  }

  /**
   * Initialize performance monitoring
   */
  initializePerformanceMonitoring() {
    // Monitor frame rate
    this.monitorFrameRate();
    
    // Monitor color calculation performance
    this.monitorColorPerformance();
  }

  /**
   * Monitor frame rate for performance optimization
   */
  monitorFrameRate() {
    let lastTime = performance.now();
    let frames = 0;
    
    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        
        if (fps < 30) {
          this.enableLowPerformanceMode();
        } else if (fps > 55) {
          this.enableHighPerformanceMode();
        }
        
        frames = 0;
        lastTime = currentTime;
      }
      
      if (this.isInitialized) {
        requestAnimationFrame(measureFPS);
      }
    };
    
    requestAnimationFrame(measureFPS);
  }

  /**
   * Monitor color calculation performance
   */
  monitorColorPerformance() {
    // Measure color calculation time
    const startTime = performance.now();
    
    // Perform color calculations
    this.calculateOptimalColors();
    
    const endTime = performance.now();
    const calculationTime = endTime - startTime;
    
    if (calculationTime > 16) { // More than one frame
      this.enableLowPerformanceMode();
    }
  }

  /**
   * Calculate optimal colors based on context
   */
  calculateOptimalColors() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Extract current color values
    const colors = {
      primary: computedStyle.getPropertyValue('--primary').trim(),
      secondary: computedStyle.getPropertyValue('--secondary').trim(),
      accent: computedStyle.getPropertyValue('--accent').trim(),
      background: computedStyle.getPropertyValue('--bg-primary').trim()
    };
    
    return colors;
  }

  /**
   * Initialize accessibility features
   */
  initializeAccessibilityFeatures() {
    // Monitor for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.handleReducedMotion(prefersReducedMotion);
    prefersReducedMotion.addEventListener('change', this.handleReducedMotion);
    
    // Monitor for high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    this.handleHighContrast(prefersHighContrast);
    prefersHighContrast.addEventListener('change', this.handleHighContrast);
    
    // Initialize color blindness safety
    this.initializeColorBlindnessSupport();
  }

  /**
   * Handle reduced motion preference
   */
  handleReducedMotion(mediaQuery) {
    if (mediaQuery.matches) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
      this.reduceAnimations();
    } else {
      document.documentElement.removeAttribute('data-reduced-motion');
      this.restoreAnimations();
    }
  }

  /**
   * Handle high contrast preference
   */
  handleHighContrast(mediaQuery) {
    if (mediaQuery.matches) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
      this.enhanceContrast();
    } else {
      document.documentElement.removeAttribute('data-high-contrast');
      this.restoreNormalContrast();
    }
  }

  /**
   * Initialize color blindness support
   */
  initializeColorBlindnessSupport() {
    // Check for color blindness preferences
    const colorBlindMode = localStorage.getItem('hairathome-colorblind-mode');
    if (colorBlindMode) {
      document.documentElement.setAttribute('data-colorblind-mode', colorBlindMode);
    }
  }

  /**
   * Switch theme dynamically
   */
  switchTheme(theme) {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    
    if (currentTheme !== theme) {
      // Add transition class for smooth switching
      html.classList.add('theme-transitioning');
      
      // Switch theme
      html.setAttribute('data-theme', theme);
      
      // Remove transition class after animation
      setTimeout(() => {
        html.classList.remove('theme-transitioning');
      }, 300);
      
      this.emitEvent('theme:changed', { 
        from: currentTheme, 
        to: theme,
        context: this.currentContext 
      });
    }
  }

  /**
   * Enable low performance mode
   */
  enableLowPerformanceMode() {
    this.performanceMode = 'low';
    document.documentElement.setAttribute('data-performance', 'low');
    this.reduceAnimations();
    this.enableSimpleColors();
  }

  /**
   * Enable high performance mode
   */
  enableHighPerformanceMode() {
    this.performanceMode = 'high';
    document.documentElement.setAttribute('data-performance', 'high');
    this.restoreAnimations();
    this.enableAdvancedColors();
  }

  /**
   * Reduce animations for performance
   */
  reduceAnimations() {
    const style = document.createElement('style');
    style.id = 'performance-reduction';
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    
    if (!document.getElementById('performance-reduction')) {
      document.head.appendChild(style);
    }
  }

  /**
   * Restore animations
   */
  restoreAnimations() {
    const style = document.getElementById('performance-reduction');
    if (style) {
      style.remove();
    }
  }

  /**
   * Enable simple colors for performance
   */
  enableSimpleColors() {
    document.documentElement.setAttribute('data-color-mode', 'simple');
  }

  /**
   * Enable advanced colors
   */
  enableAdvancedColors() {
    document.documentElement.setAttribute('data-color-mode', 'advanced');
  }

  /**
   * Enhance contrast for accessibility
   */
  enhanceContrast() {
    document.documentElement.setAttribute('data-contrast-mode', 'high');
  }

  /**
   * Restore normal contrast
   */
  restoreNormalContrast() {
    document.documentElement.removeAttribute('data-contrast-mode');
  }

  /**
   * Load user preferences
   */
  loadUserPreferences() {
    const saved = localStorage.getItem('hairathome-color-preferences');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      preferredTheme: 'auto',
      learnedTheme: null,
      colorBlindMode: 'none',
      animationPreference: 'normal',
      adaptationLevel: 'full'
    };
  }

  /**
   * Save user preferences
   */
  saveUserPreferences() {
    localStorage.setItem('hairathome-color-preferences', JSON.stringify(this.userPreferences));
  }

  /**
   * Emit custom events
   */
  emitEvent(eventName, data) {
    const event = new CustomEvent(eventName, { 
      detail: data,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }

  /**
   * Public API methods
   */

  /**
   * Get current color context
   */
  getContext() {
    return { ...this.currentContext };
  }

  /**
   * Get user preferences
   */
  getUserPreferences() {
    return { ...this.userPreferences };
  }

  /**
   * Set user preference
   */
  setUserPreference(key, value) {
    this.userPreferences[key] = value;
    this.saveUserPreferences();
    this.emitEvent('preference:changed', { key, value });
  }

  /**
   * Force context update
   */
  updateContext() {
    this.currentContext = this.analyzeContext();
    this.applyInitialTheme();
    this.emitEvent('context:updated', this.currentContext);
  }

  /**
   * Get adaptation history
   */
  getAdaptationHistory() {
    return [...this.adaptationHistory];
  }

  /**
   * Reset to defaults
   */
  reset() {
    this.userPreferences = {
      preferredTheme: 'auto',
      learnedTheme: null,
      colorBlindMode: 'none',
      animationPreference: 'normal',
      adaptationLevel: 'full'
    };
    this.saveUserPreferences();
    this.applyInitialTheme();
    this.emitEvent('engine:reset');
  }

  /**
   * Destroy the engine
   */
  destroy() {
    this.isInitialized = false;
    this.restoreAnimations();
    this.emitEvent('engine:destroyed');
  }
}

// Auto-initialize the color engine
let colorEngine;

document.addEventListener('DOMContentLoaded', () => {
  colorEngine = new IntelligentColorEngine();
  
  // Make available globally for debugging and external access
  window.HairAtHomeColorEngine = colorEngine;
  
  // Add global event listeners for theme switching
  window.addEventListener('colorEngine:themeSwitch', (e) => {
    const { theme } = e.detail;
    colorEngine.switchTheme(theme);
  });
  
  window.addEventListener('colorEngine:updateContext', () => {
    colorEngine.updateContext();
  });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IntelligentColorEngine;
}