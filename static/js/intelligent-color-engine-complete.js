/**
 * ============================================================================
 * INTELLIGENT COLOR ENGINE - Hair@Home Complete System
 * Enterprise-Grade Color Intelligence for Beauty Industry
 * ============================================================================
 */

class IntelligentColorEngine {
    constructor() {
        this.version = '2.0.0';
        this.isInitialized = false;
        this.currentTheme = 'auto';
        this.colorPreferences = this.loadColorPreferences();
        this.colorPalettes = this.initializeColorPalettes();
        this.harmonyRules = this.initializeHarmonyRules();
        this.accessibilityChecker = new AccessibilityChecker();
        this.performanceMonitor = new PerformanceMonitor();
        this.aiColorMatcher = new AIColorMatcher();
        
        this.init();
    }

    // Initialize the color engine
    init() {
        this.setupEventListeners();
        this.initializeThemeSystem();
        this.startColorAdaptation();
        this.initializeAccessibilityFeatures();
        this.setupPerformanceOptimization();
        this.isInitialized = true;
        
        console.log(`🎨 Intelligent Color Engine v${this.version} initialized`);
        this.emitEvent('colorEngine:initialized');
    }

    // Load user color preferences
    loadColorPreferences() {
        const stored = localStorage.getItem('hairathome-color-preferences');
        return stored ? JSON.parse(stored) : {
            preferredTheme: 'auto',
            colorIntensity: 'normal',
            accessibilityMode: false,
            seasonalAdaptation: true,
            timeBasedAdaptation: true,
            customPalette: null,
            lastUpdated: new Date().toISOString()
        };
    }

    // Save color preferences
    saveColorPreferences() {
        this.colorPreferences.lastUpdated = new Date().toISOString();
        localStorage.setItem('hairathome-color-preferences', JSON.stringify(this.colorPreferences));
        this.emitEvent('colorPreferences:updated', this.colorPreferences);
    }

    // Initialize color palettes
    initializeColorPalettes() {
        return {
            beauty: {
                primary: '#f3e6d0',
                secondary: '#d4a998',
                accent: '#e8c4a8',
                gold: '#d4af37',
                textDark: '#3d2e26',
                textLight: '#f9f5ee',
                neutralLight: '#f9f5ee',
                neutralDark: '#1e1916'
            },
            seasonal: {
                spring: {
                    primary: '#f8f4e6',
                    secondary: '#f4d1d1',
                    accent: '#d4e8d4',
                    description: 'Fresh and vibrant spring colors'
                },
                summer: {
                    primary: '#f4e4bc',
                    secondary: '#a8c8ec',
                    accent: '#f8a5a5',
                    description: 'Bright and energetic summer palette'
                },
                autumn: {
                    primary: '#d4a574',
                    secondary: '#c67e5b',
                    accent: '#5a7a5a',
                    description: 'Warm and rich autumn tones'
                },
                winter: {
                    primary: '#f0f0f0',
                    secondary: '#2c5282',
                    accent: '#8b3a3a',
                    description: 'Cool and elegant winter colors'
                }
            },
            prairie: {
                gold: '#e6d4a8',
                sky: '#87ceeb',
                wildflower: '#9b7ebd',
                grass: '#7cb342',
                sunset: '#ff8c42',
                description: 'Manitoba prairie inspired palette'
            },
            timeBased: {
                morning: {
                    primary: '#f8f4e6',
                    accent: '#f4e4bc',
                    description: 'Soft morning light colors'
                },
                afternoon: {
                    primary: '#f3e6d0',
                    accent: '#d4af37',
                    description: 'Bright afternoon warmth'
                },
                evening: {
                    primary: '#e6d4b6',
                    accent: '#c67e5b',
                    description: 'Gentle evening glow'
                },
                night: {
                    primary: '#1e1916',
                    accent: '#d4af37',
                    description: 'Deep night elegance'
                }
            }
        };
    }

    // Initialize harmony rules
    initializeHarmonyRules() {
        return {
            complementary: (baseColor) => {
                const hsl = this.hexToHsl(baseColor);
                return [
                    baseColor,
                    this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)
                ];
            },
            triadic: (baseColor) => {
                const hsl = this.hexToHsl(baseColor);
                return [
                    baseColor,
                    this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
                    this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
                ];
            },
            analogous: (baseColor) => {
                const hsl = this.hexToHsl(baseColor);
                return [
                    this.hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
                    baseColor,
                    this.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)
                ];
            },
            splitComplementary: (baseColor) => {
                const hsl = this.hexToHsl(baseColor);
                return [
                    baseColor,
                    this.hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
                    this.hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l)
                ];
            },
            tetradic: (baseColor) => {
                const hsl = this.hexToHsl(baseColor);
                return [
                    baseColor,
                    this.hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
                    this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
                    this.hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)
                ];
            }
        };
    }

    // Setup event listeners
    setupEventListeners() {
        // Theme change events
        document.addEventListener('theme:change', (e) => {
            this.handleThemeChange(e.detail.theme);
        });

        // System preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (this.colorPreferences.preferredTheme === 'auto') {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });

        // Time-based adaptation
        this.startTimeBasedAdaptation();

        // Seasonal adaptation
        this.startSeasonalAdaptation();

        // Visibility change for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseColorAdaptation();
            } else {
                this.resumeColorAdaptation();
            }
        });
    }

    // Initialize theme system
    initializeThemeSystem() {
        const savedTheme = this.colorPreferences.preferredTheme;
        this.applyTheme(savedTheme);
    }

    // Apply theme
    applyTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'auto') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
        } else {
            root.setAttribute('data-theme', theme);
        }

        this.currentTheme = theme;
        this.emitEvent('theme:applied', { theme, root });
    }

    // Handle theme change
    handleThemeChange(theme) {
        this.colorPreferences.preferredTheme = theme;
        this.saveColorPreferences();
        this.applyTheme(theme);
    }

    // Start time-based adaptation
    startTimeBasedAdaptation() {
        if (!this.colorPreferences.timeBasedAdaptation) return;

        const updateTimeContext = () => {
            const hour = new Date().getHours();
            let timeContext;

            if (hour >= 5 && hour < 12) {
                timeContext = 'morning';
            } else if (hour >= 12 && hour < 17) {
                timeContext = 'afternoon';
            } else if (hour >= 17 && hour < 21) {
                timeContext = 'evening';
            } else {
                timeContext = 'night';
            }

            document.documentElement.setAttribute('data-time', timeContext);
            this.emitEvent('timeContext:updated', { timeContext, hour });
        };

        updateTimeContext();
        setInterval(updateTimeContext, 60000); // Update every minute
    }

    // Start seasonal adaptation
    startSeasonalAdaptation() {
        if (!this.colorPreferences.seasonalAdaptation) return;

        const updateSeasonContext = () => {
            const month = new Date().getMonth();
            let seasonContext;

            if (month >= 2 && month <= 4) {
                seasonContext = 'spring';
            } else if (month >= 5 && month <= 7) {
                seasonContext = 'summer';
            } else if (month >= 8 && month <= 10) {
                seasonContext = 'autumn';
            } else {
                seasonContext = 'winter';
            }

            document.documentElement.setAttribute('data-season', seasonContext);
            this.emitEvent('seasonContext:updated', { seasonContext, month });
        };

        updateSeasonContext();
        setInterval(updateSeasonContext, 3600000); // Update every hour
    }

    // Start color adaptation
    startColorAdaptation() {
        this.adaptationInterval = setInterval(() => {
            this.performColorAdaptation();
        }, 5000); // Adapt every 5 seconds
    }

    // Pause color adaptation
    pauseColorAdaptation() {
        if (this.adaptationInterval) {
            clearInterval(this.adaptationInterval);
            this.adaptationInterval = null;
        }
    }

    // Resume color adaptation
    resumeColorAdaptation() {
        if (!this.adaptationInterval) {
            this.startColorAdaptation();
        }
    }

    // Perform color adaptation
    performColorAdaptation() {
        // Check ambient light if available
        if ('AmbientLightSensor' in window) {
            this.adaptToAmbientLight();
        }

        // Check battery level for performance optimization
        if ('getBattery' in navigator) {
            this.adaptToBatteryLevel();
        }

        // Adapt to user interaction patterns
        this.adaptToUserBehavior();
    }

    // Adapt to ambient light
    async adaptToAmbientLight() {
        try {
            const sensor = new AmbientLightSensor();
            await sensor.read();
            
            if (sensor.illuminance < 50) {
                // Low light - use darker theme
                document.documentElement.setAttribute('data-ambient', 'dark');
            } else if (sensor.illuminance > 1000) {
                // Bright light - use lighter theme
                document.documentElement.setAttribute('data-ambient', 'bright');
            } else {
                // Normal light
                document.documentElement.setAttribute('data-ambient', 'normal');
            }
        } catch (error) {
            // Ambient light sensor not available
        }
    }

    // Adapt to battery level
    async adaptToBatteryLevel() {
        try {
            const battery = await navigator.getBattery();
            
            if (battery.level < 0.2) {
                // Low battery - reduce animations
                document.documentElement.setAttribute('data-performance', 'low');
            } else {
                document.documentElement.setAttribute('data-performance', 'normal');
            }
        } catch (error) {
            // Battery API not available
        }
    }

    // Adapt to user behavior
    adaptToUserBehavior() {
        // Track user interaction patterns
        const currentTime = new Date().getHours();
        const userActivity = this.getUserActivityPattern();
        
        // Adjust color intensity based on user activity
        if (userActivity === 'low') {
            document.documentElement.setAttribute('data-intensity', 'subtle');
        } else if (userActivity === 'high') {
            document.documentElement.setAttribute('data-intensity', 'vibrant');
        } else {
            document.documentElement.setAttribute('data-intensity', 'normal');
        }
    }

    // Get user activity pattern
    getUserActivityPattern() {
        // Simple heuristic based on time of day
        const hour = new Date().getHours();
        
        if (hour >= 22 || hour <= 6) {
            return 'low'; // Night time - less activity
        } else if (hour >= 12 && hour <= 14) {
            return 'high'; // Lunch time - high activity
        } else {
            return 'normal';
        }
    }

    // Initialize accessibility features
    initializeAccessibilityFeatures() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.setAttribute('data-reduced-motion', 'true');
        }

        // Check for high contrast preference
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.documentElement.setAttribute('data-high-contrast', 'true');
            this.enableHighContrastMode();
        }

        // Setup keyboard navigation
        this.setupKeyboardNavigation();
    }

    // Enable high contrast mode
    enableHighContrastMode() {
        const root = document.documentElement;
        root.style.setProperty('--beauty-text-dark', '#000000');
        root.style.setProperty('--beauty-text-light', '#ffffff');
        root.style.setProperty('--beauty-gold-accent', '#ffcc00');
    }

    // Setup keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Alt + T: Toggle theme
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                this.toggleTheme();
            }
            
            // Alt + C: Toggle color intensity
            if (e.altKey && e.key === 'c') {
                e.preventDefault();
                this.toggleColorIntensity();
            }
        });
    }

    // Toggle theme
    toggleTheme() {
        const themes = ['light', 'dark', 'auto'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        this.handleThemeChange(nextTheme);
    }

    // Toggle color intensity
    toggleColorIntensity() {
        const intensities = ['subtle', 'normal', 'vibrant'];
        const currentIntensity = document.documentElement.getAttribute('data-intensity') || 'normal';
        const currentIndex = intensities.indexOf(currentIntensity);
        const nextIntensity = intensities[(currentIndex + 1) % intensities.length];
        
        document.documentElement.setAttribute('data-intensity', nextIntensity);
        this.emitEvent('colorIntensity:changed', { intensity: nextIntensity });
    }

    // Setup performance optimization
    setupPerformanceOptimization() {
        // Use requestAnimationFrame for smooth animations
        this.setupOptimizedAnimations();
        
        // Implement lazy loading for color calculations
        this.setupLazyColorCalculations();
        
        // Monitor performance
        this.performanceMonitor.start();
    }

    // Setup optimized animations
    setupOptimizedAnimations() {
        // Use CSS transforms for better performance
        const style = document.createElement('style');
        style.textContent = `
            .color-optimized {
                will-change: background-color, color, border-color;
                transform: translateZ(0);
                backface-visibility: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    // Setup lazy color calculations
    setupLazyColorCalculations() {
        // Use Intersection Observer for lazy color adaptation
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.adaptElementColors(entry.target);
                    }
                });
            });

            document.querySelectorAll('[data-adapt-colors]').forEach(el => {
                observer.observe(el);
            });
        }
    }

    // Adapt element colors
    adaptElementColors(element) {
        // Implement element-specific color adaptation
        const elementTheme = element.getAttribute('data-theme') || this.currentTheme;
        element.setAttribute('data-applied-theme', elementTheme);
    }

    // Generate color harmony
    generateHarmony(baseColor, harmonyType) {
        if (!this.harmonyRules[harmonyType]) {
            throw new Error(`Unknown harmony type: ${harmonyType}`);
        }
        
        return this.harmonyRules[harmonyType](baseColor);
    }

    // Get optimal text color for background
    getOptimalTextColor(backgroundColor) {
        const rgb = this.hexToRgb(backgroundColor);
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    // Calculate contrast ratio
    calculateContrastRatio(color1, color2) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        const luminance1 = this.getLuminance(rgb1);
        const luminance2 = this.getLuminance(rgb2);
        
        const brightest = Math.max(luminance1, luminance2);
        const darkest = Math.min(luminance1, luminance2);
        
        return (brightest + 0.05) / (darkest + 0.05);
    }

    // Get luminance
    getLuminance(rgb) {
        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
            val = val / 255;
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    // Color conversion utilities
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    hexToHsl(hex) {
        const rgb = this.hexToRgb(hex);
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        
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
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
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

    // AI-powered color matching
    async getAIColorMatch(userProfile, context) {
        return this.aiColorMatcher.generatePersonalizedPalette(userProfile, context);
    }

    // Create color palette from image
    async extractPaletteFromImage(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const palette = this.extractColorsFromImageData(imageData);
                
                resolve(palette);
            };
            
            img.onerror = reject;
            img.src = imageUrl;
        });
    }

    // Extract colors from image data
    extractColorsFromImageData(imageData) {
        const data = imageData.data;
        const colorMap = {};
        
        // Sample every 10th pixel for performance
        for (let i = 0; i < data.length; i += 40) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            if (a > 128) { // Ignore transparent pixels
                const hex = this.rgbToHex(r, g, b);
                colorMap[hex] = (colorMap[hex] || 0) + 1;
            }
        }
        
        // Sort by frequency and return top colors
        const sortedColors = Object.entries(colorMap)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([hex]) => hex);
        
        return sortedColors;
    }

    // Emit custom events
    emitEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    // Get current color system status
    getStatus() {
        return {
            version: this.version,
            isInitialized: this.isInitialized,
            currentTheme: this.currentTheme,
            colorPreferences: this.colorPreferences,
            performanceMetrics: this.performanceMonitor.getMetrics(),
            accessibilityMode: this.colorPreferences.accessibilityMode
        };
    }

    // Destroy the color engine
    destroy() {
        this.pauseColorAdaptation();
        this.performanceMonitor.stop();
        this.isInitialized = false;
        
        // Remove event listeners
        document.removeEventListener('theme:change', this.handleThemeChange);
        
        console.log('🎨 Intelligent Color Engine destroyed');
    }
}

// Accessibility Checker Class
class AccessibilityChecker {
    constructor() {
        this.wcagLevels = {
            AA: { normal: 4.5, large: 3.0 },
            AAA: { normal: 7.0, large: 4.5 }
        };
    }

    checkContrast(foreground, background, isLargeText = false) {
        const ratio = this.calculateContrastRatio(foreground, background);
        
        return {
            ratio: ratio,
            aa: ratio >= (isLargeText ? this.wcagLevels.AA.large : this.wcagLevels.AA.normal),
            aaa: ratio >= (isLargeText ? this.wcagLevels.AAA.large : this.wcagLevels.AAA.normal),
            isLargeText
        };
    }

    calculateContrastRatio(color1, color2) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        const luminance1 = this.getLuminance(rgb1);
        const luminance2 = this.getLuminance(rgb2);
        
        const brightest = Math.max(luminance1, luminance2);
        const darkest = Math.min(luminance1, luminance2);
        
        return (brightest + 0.05) / (darkest + 0.05);
    }

    getLuminance(rgb) {
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
}

// Performance Monitor Class
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            colorChanges: 0,
            themeChanges: 0,
            adaptationCycles: 0,
            startTime: Date.now(),
            lastColorChange: null
        };
        this.isMonitoring = false;
    }

    start() {
        this.isMonitoring = true;
        this.metrics.startTime = Date.now();
    }

    stop() {
        this.isMonitoring = false;
    }

    trackColorChange() {
        if (!this.isMonitoring) return;
        
        this.metrics.colorChanges++;
        this.metrics.lastColorChange = Date.now();
    }

    trackThemeChange() {
        if (!this.isMonitoring) return;
        
        this.metrics.themeChanges++;
    }

    trackAdaptationCycle() {
        if (!this.isMonitoring) return;
        
        this.metrics.adaptationCycles++;
    }

    getMetrics() {
        const runtime = Date.now() - this.metrics.startTime;
        
        return {
            ...this.metrics,
            runtime: runtime,
            colorChangesPerMinute: (this.metrics.colorChanges / runtime) * 60000,
            adaptationCyclesPerMinute: (this.metrics.adaptationCycles / runtime) * 60000
        };
    }
}

// AI Color Matcher Class
class AIColorMatcher {
    constructor() {
        this.personalityProfiles = {
            elegant: {
                saturation: 0.3,
                brightness: 0.7,
                warmth: 0.6,
                description: 'Sophisticated and refined colors'
            },
            modern: {
                saturation: 0.8,
                brightness: 0.6,
                warmth: 0.4,
                description: 'Bold and contemporary colors'
            },
            natural: {
                saturation: 0.4,
                brightness: 0.8,
                warmth: 0.7,
                description: 'Earthy and organic colors'
            },
            luxury: {
                saturation: 0.6,
                brightness: 0.5,
                warmth: 0.8,
                description: 'Premium and opulent colors'
            }
        };
    }

    async generatePersonalizedPalette(userProfile, context) {
        const profile = this.personalityProfiles[userProfile.personality] || this.personalityProfiles.elegant;
        
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return {
            primary: this.generateColor(profile),
            secondary: this.generateColor({ ...profile, brightness: profile.brightness - 0.1 }),
            accent: this.generateColor({ ...profile, saturation: profile.saturation + 0.2 }),
            neutral: this.generateColor({ ...profile, saturation: 0.1 }),
            profile: profile.description,
            context: context,
            generatedAt: new Date().toISOString()
        };
    }

    generateColor(profile) {
        const hue = Math.random() * 360;
        const saturation = profile.saturation * 100;
        const lightness = profile.brightness * 100;
        
        return this.hslToHex(hue, saturation, lightness);
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
}

// Initialize the Intelligent Color Engine
let intelligentColorEngine;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        intelligentColorEngine = new IntelligentColorEngine();
    });
} else {
    intelligentColorEngine = new IntelligentColorEngine();
}

// Export for global access
window.IntelligentColorEngine = IntelligentColorEngine;
window.intelligentColorEngine = intelligentColorEngine;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntelligentColorEngine;
}