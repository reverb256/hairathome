// Modern animations for Hair@Home
// Includes: Magnetic buttons, parallax tilt, counters, scroll progress, page transitions, etc.

(function() {
    'use strict';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Skip all animations if user prefers reduced motion
    if (prefersReducedMotion) {
        document.body.classList.add('reduced-motion');
        return;
    }

    // ============================================
    // 1. MAGNETIC BUTTONS
    // ============================================
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.magnetic-btn, a[href^="tel:"], button:not(.mobile-menu-btn):not(#theme-toggle)');

        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                if (isTouch) return;

                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }

    // ============================================
    // 2. PARALLAX TILT CARDS
    // ============================================
    function initParallaxTilt() {
        const cards = document.querySelectorAll('.card-service, .gallery-image');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (isTouch) return;

                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ============================================
    // 3. STAGGERED CHILDREN ANIMATIONS
    // ============================================
    function initStaggeredAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        child.style.animationDelay = `${index * 0.1}s`;
                        child.classList.add('animate-fade-in');
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.stagger-children, .grid').forEach(el => {
            observer.observe(el);
        });
    }

    // ============================================
    // 4. SCROLL PROGRESS BAR
    // ============================================
    function initScrollProgress() {
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #D97742, #F5D061);
            z-index: 9999;
            transition: width 0.1s ease-out;
            transform-origin: left;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        });
    }

    // ============================================
    // 5. NUMBER COUNTERS
    // ============================================
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const countTo = parseInt(target.getAttribute('data-count'));
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCount(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Easing function
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        const current = Math.floor(countTo * easeOutQuart);

                        target.textContent = current;

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            target.textContent = countTo;
                        }
                    }

                    requestAnimationFrame(updateCount);
                    observer.unobserve(target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    // ============================================
    // 6. TEXT GRADIENT SHIMMER
    // ============================================
    function initTextShimmer() {
        const shimmerElements = document.querySelectorAll('.text-shimmer');

        shimmerElements.forEach(el => {
            el.style.background = 'linear-gradient(120deg, #D97742 0%, #F5D061 25%, #D97742 50%, #F5D061 75%, #D97742 100%)';
            el.style.backgroundSize = '200% auto';
            el.style.backgroundClip = 'text';
            el.style.webkitBackgroundClip = 'text';
            el.style.webkitTextFillColor = 'transparent';
            el.style.animation = 'shimmer 3s linear infinite';
        });
    }

    // ============================================
    // 7. MOUSE SPOTLIGHT EFFECT
    // ============================================
    function initSpotlight() {
        if (isTouch) return;

        const spotlight = document.createElement('div');
        spotlight.className = 'spotlight';
        spotlight.style.cssText = `
            position: fixed;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(245, 208, 97, 0.08) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            mix-blend-mode: screen;
        `;
        document.body.appendChild(spotlight);

        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                spotlight.style.left = `${e.clientX}px`;
                spotlight.style.top = `${e.clientY}px`;
            });
        });
    }

    // ============================================
    // 8. HOLOGRAPHIC CARD GLOW
    // ============================================
    function initHolographicGlow() {
        const cards = document.querySelectorAll('.card-service');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (isTouch) return;

                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                card.style.background = `
                    radial-gradient(
                        circle at ${x}% ${y}%,
                        rgba(217, 119, 66, 0.1) 0%,
                        transparent 50%
                    )
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.background = '';
            });
        });
    }

    // ============================================
    // 9. SMOOTH PAGE TRANSITIONS
    // ============================================
    function initPageTransitions() {
        // Fade in on load
        document.body.style.opacity = '0';
        window.addEventListener('load', () => {
            document.body.style.transition = 'opacity 0.3s ease-in';
            document.body.style.opacity = '1';
        });

        // Fade out on navigation
        document.querySelectorAll('a[href^="/"], a[href^="."]').forEach(link => {
            link.addEventListener('click', (e) => {
                // Skip if it's an anchor link or has target="_blank"
                const href = link.getAttribute('href');
                if (href.startsWith('#') || link.target === '_blank' || link.hasAttribute('download')) {
                    return;
                }

                e.preventDefault();
                document.body.style.opacity = '0';

                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        });
    }

    // ============================================
    // 10. SKELETON LOADING STATES
    // ============================================
    function initSkeletonLoading() {
        // Create skeleton loader for images
        const images = document.querySelectorAll('img[loading="lazy"]');

        images.forEach(img => {
            // Create skeleton placeholder
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-loading';
            skeleton.style.cssText = `
                position: absolute;
                inset: 0;
                background: linear-gradient(
                    90deg,
                    rgba(0,0,0,0.05) 25%,
                    rgba(0,0,0,0.1) 50%,
                    rgba(0,0,0,0.05) 75%
                );
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s infinite;
                border-radius: inherit;
                z-index: 0;
            `;

            // Add animation keyframes if not exists
            if (!document.getElementById('skeleton-styles')) {
                const style = document.createElement('style');
                style.id = 'skeleton-styles';
                style.textContent = `
                    @keyframes skeleton-loading {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                `;
                document.head.appendChild(style);
            }

            // Wrap image in container
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
            wrapper.appendChild(skeleton);

            img.addEventListener('load', () => {
                skeleton.remove();
            });
        });
    }

    // ============================================
    // 11. PARALLAX BACKGROUND LAYERS
    // ============================================
    function initParallaxLayers() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        window.addEventListener('scroll', () => {
            if (isTouch) return;

            const scrollY = window.scrollY;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
                el.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });
    }

    // ============================================
    // 12. MAGNETIC HOVER ATTRACTION
    // ============================================
    function initMagneticHover() {
        const magneticElements = document.querySelectorAll('.magnetic');

        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                if (isTouch) return;

                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Move element towards cursor
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    // ============================================
    // 13. TEXT SCRAMBLE EFFECT
    // ============================================
    function initTextScramble() {
        const scrambleElements = document.querySelectorAll('.scramble-text');

        const chars = '!<>-_\\/[]{}—=+*^?#________';

        scrambleElements.forEach(el => {
            const originalText = el.textContent;

            el.addEventListener('mouseenter', () => {
                let iteration = 0;
                const interval = setInterval(() => {
                    el.textContent = originalText
                        .split('')
                        .map((letter, index) => {
                            if (index < iteration) {
                                return originalText[index];
                            }
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join('');

                    if (iteration >= originalText.length) {
                        clearInterval(interval);
                    }

                    iteration += 1 / 3;
                }, 30);
            });
        });
    }

    // ============================================
    // 14. HERO FLOATING ELEMENTS WITH PARALLAX
    // ============================================
    function initHeroParallax() {
        const heroSection = document.querySelector('section');
        if (!heroSection) return;

        const floatingElements = heroSection.querySelectorAll('.animate-float, .animate-float-slow');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = heroSection.offsetHeight;

            if (scrollY > heroHeight) return;

            const progress = scrollY / heroHeight;

            floatingElements.forEach((el, index) => {
                const speed = (index + 1) * 20;
                el.style.transform = `translateY(${-scrollY * speed * 0.1}px)`;
            });
        });
    }

    // ============================================
    // 15. RIPPLE EFFECT ON BUTTONS
    // ============================================
    function initRippleEffect() {
        const buttons = document.querySelectorAll('.ripple-btn');

        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple-effect 0.6s ease-out;
                    pointer-events: none;
                `;

                // Add keyframes if not exists
                if (!document.getElementById('ripple-styles')) {
                    const style = document.createElement('style');
                    style.id = 'ripple-styles';
                    style.textContent = `
                        @keyframes ripple-effect {
                            to {
                                transform: scale(4);
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // ============================================
    // INITIALIZE ALL EFFECTS
    // ============================================
    function init() {
        // Core effects
        initScrollProgress();
        initPageTransitions();

        // Interactive effects (skip on touch devices)
        if (!isTouch) {
            initMagneticButtons();
            initParallaxTilt();
            initSpotlight();
            initHolographicGlow();
            initMagneticHover();
            initHeroParallax();
            initRippleEffect();
        }

        // Always active
        initStaggeredAnimations();
        initCounters();
        initTextShimmer();
        initSkeletonLoading();
        initParallaxLayers();
        initTextScramble();

        console.log('✨ Modern animations initialized');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
