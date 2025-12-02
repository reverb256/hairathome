// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Form Validation
const bookingForm = document.getElementById('booking-form');

if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        let isValid = true;
        const requiredFields = this.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#e74c3c';
            } else {
                field.style.borderColor = '#ddd';
            }
        });
        
        if (isValid) {
            // In a real implementation, you would submit the form to a server
            // For this demo, we'll show a success message
            alert('Thank you for your booking request! We will contact you shortly to confirm your appointment.');
            bookingForm.reset();
        } else {
            alert('Please fill in all required fields.');
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Theme Management
class ThemeManager {
    constructor() {
        this.storageKey = 'hairathome-theme';
        this.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.init();
    }
    
    init() {
        // Set dark mode as default if no preference is stored
        const savedTheme = localStorage.getItem(this.storageKey);
        if (!savedTheme) {
            this.setTheme('dark');
        } else {
            this.setTheme(savedTheme);
        }
        
        // Listen for system theme changes
        this.darkModeMediaQuery.addListener((e) => {
            if (!localStorage.getItem(this.storageKey)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
        
        // Setup theme toggle
        this.setupThemeToggle();
    }
    
    setTheme(theme) {
        const html = document.documentElement;
        const themeIcon = document.getElementById('theme-icon');
        const themeText = document.getElementById('theme-text');
        
        if (theme === 'dark') {
            html.removeAttribute('data-theme');
            themeIcon.className = 'fas fa-moon';
            if (themeText) themeText.textContent = 'Dark';
        } else {
            html.setAttribute('data-theme', 'light');
            themeIcon.className = 'fas fa-sun';
            if (themeText) themeText.textContent = 'Light';
        }
        
        localStorage.setItem(this.storageKey, theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
    }
    
    setupThemeToggle() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                const currentTheme = localStorage.getItem(this.storageKey) || 'dark';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
            });
        }
    }
    
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = theme === 'dark' ? '#0a0a0a' : '#ffffff';
    }
    
    getCurrentTheme() {
        return localStorage.getItem(this.storageKey) || 'dark';
    }
}

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hair At Home website loaded successfully!');
    
    // Initialize theme manager
    window.themeManager = new ThemeManager();
    
    // Set minimum date for booking form to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        console.log(`Page load time: ${loadTime}ms`);
        
        // Log performance metrics
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log(`LCP: ${entry.startTime}ms`);
                    }
                });
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    });
}

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}