document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    initThemeToggle();
    initMobileMenu();
    initScrollReveal();
    initServiceWorker();
});

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    console.log('Theme toggle element:', themeToggle);
    
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    if (themeToggle) {
        console.log('Adding theme toggle click listener');
        themeToggle.addEventListener('click', () => {
            console.log('Theme toggle clicked');
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateMetaThemeColor(isDark);
        });
    } else {
        console.error('Theme toggle button not found!');
    }
    
    updateMetaThemeColor(html.classList.contains('dark'));

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
            updateMetaThemeColor(e.matches);
        }
    });
}

function updateMetaThemeColor(isDark) {
    const metaThemeLight = document.querySelector('meta[name="theme-color"][media*="light"]');
    const metaThemeDark = document.querySelector('meta[name="theme-color"][media*="dark"]');
    
    if (isDark) {
        document.querySelector('meta[name="theme-color"][content="#2D2520"]')?.setAttribute('content', '#2D2520');
    } else {
        document.querySelector('meta[name="theme-color"][content="#FBF8F3"]')?.setAttribute('content', '#FBF8F3');
    }
}

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    console.log('Mobile menu button:', mobileMenuBtn);
    console.log('Mobile menu:', mobileMenu);
    
    if (mobileMenuBtn && mobileMenu) {
        console.log('Adding mobile menu click listener');
        mobileMenuBtn.addEventListener('click', () => {
            console.log('Mobile menu button clicked');
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    } else {
        console.error('Mobile menu elements not found!');
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollReveal() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-stagger').forEach(el => {
            el.classList.add('revealed');
        });
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-stagger').forEach(el => {
        observer.observe(el);
    });
}

function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .then(registration => {
                    console.log('SW registered:', registration.scope);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        });
    }
}
