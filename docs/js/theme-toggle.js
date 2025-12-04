// Theme Toggle Implementation
(function() {
    'use strict';
    
    console.log('Theme toggle script starting...');
    window.themeToggleRan = true;
    
    // Wait for DOM to be ready
    function initThemeToggle() {
        console.log('Initializing theme toggle...');
        
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;
        
        if (!themeToggle || !html) {
            console.log('Theme toggle elements not found, retrying...');
            setTimeout(initThemeToggle, 100);
            return;
        }
        
        console.log('Theme toggle elements found:', !!themeToggle, !!html);
        
        // Set initial theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        localStorage.setItem('theme', savedTheme);
        
        console.log('Initial theme set to:', savedTheme);
        
        // Update button appearance
        function updateButton(theme) {
            const icon = document.getElementById('theme-icon');
            const text = document.getElementById('theme-text');
            
            if (icon && text) {
                if (theme === 'dark') {
                    icon.className = 'fas fa-moon';
                    text.textContent = 'Light';
                } else {
                    icon.className = 'fas fa-sun';
                    text.textContent = 'Dark';
                }
                console.log('Button updated for theme:', theme, icon.className, text.textContent);
            }
        }
        
        updateButton(savedTheme);
        
        // Add click handler
        function handleThemeToggle(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateButton(newTheme);
            
            console.log('Theme toggled from', currentTheme, 'to', newTheme);
        }
        
        // Remove existing listeners and add new one
        themeToggle.removeEventListener('click', handleThemeToggle);
        themeToggle.addEventListener('click', handleThemeToggle);
        
        // Mark as initialized
        themeToggle.setAttribute('data-initialized', 'true');
        
        console.log('Theme toggle initialized successfully');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeToggle);
    } else {
        initThemeToggle();
    }
})();