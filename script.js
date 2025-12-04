// Mobile Navigation Toggle with Accessibility
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Close mobile menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// FAQ Accordion with ARIA Support
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        toggleFAQ(question);
    });

    // Keyboard support
    question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFAQ(question);
        }
    });
});

function toggleFAQ(question) {
    const faqItem = question.parentElement;
    const answer = question.nextElementSibling;
    const isExpanded = question.getAttribute('aria-expanded') === 'true';

    // Close all other FAQs first
    faqQuestions.forEach(otherQuestion => {
        if (otherQuestion !== question) {
            otherQuestion.setAttribute('aria-expanded', 'false');
            otherQuestion.setAttribute('aria-selected', 'false');
            otherQuestion.nextElementSibling.setAttribute('aria-hidden', 'true');
        }
    });

    // Toggle current FAQ
    question.setAttribute('aria-expanded', !isExpanded);
    question.setAttribute('aria-selected', !isExpanded);
    answer.setAttribute('aria-hidden', isExpanded);
}

// Form Validation and Submission with Accessibility
const bookingForm = document.getElementById('booking-form');

if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear previous errors
        clearFormErrors();

        // Validate form
        const errors = validateForm(this);

        if (errors.length === 0) {
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-disabled', 'true');

            // Submit to Formspree
            fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Success message with WhatsApp option
                    showSuccessMessage();
                    this.reset();
                    // Focus on success message
                    setTimeout(() => {
                        const successMsg = document.querySelector('.success-message');
                        if (successMsg) successMsg.focus();
                    }, 100);
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                // Fallback to WhatsApp on error
                showWhatsAppFallback();
                // Focus on fallback message
                setTimeout(() => {
                    const fallbackMsg = document.querySelector('.fallback-message');
                    if (fallbackMsg) fallbackMsg.focus();
                }, 100);
            })
            .finally(() => {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.removeAttribute('aria-disabled');
                submitBtn.focus();
            });
        } else {
            // Show validation errors
            showFormErrors(errors);
            // Focus on first error field
            if (errors[0].field) {
                errors[0].field.focus();
            }
        }
    });
}

function validateForm(form) {
    const errors = [];
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            errors.push({
                field: field,
                message: `${field.previousElementSibling ? field.previousElementSibling.textContent.replace('*', '').trim() : 'This field'} is required.`
            });
        }
    });

    // Email validation
    const emailField = form.querySelector('#email');
    if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
            errors.push({
                field: emailField,
                message: 'Please enter a valid email address.'
            });
        }
    }

    // Phone validation
    const phoneField = form.querySelector('#phone');
    if (phoneField && phoneField.value.trim()) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phoneField.value.replace(/[\s\-\(\)]/g, ''))) {
            errors.push({
                field: phoneField,
                message: 'Please enter a valid phone number.'
            });
        }
    }

    return errors;
}

function clearFormErrors() {
    const form = document.getElementById('booking-form');
    form.querySelectorAll('.error-message').forEach(error => error.remove());
    form.querySelectorAll('[aria-invalid]').forEach(field => {
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    });
}

function showFormErrors(errors) {
    errors.forEach(error => {
        const field = error.field;
        field.setAttribute('aria-invalid', 'true');

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.setAttribute('aria-live', 'polite');
        errorDiv.textContent = error.message;

        // Insert after field
        field.parentNode.insertBefore(errorDiv, field.nextSibling);

        // Update aria-describedby
        const existingDescribedBy = field.getAttribute('aria-describedby');
        const errorId = 'error-' + Math.random().toString(36).substr(2, 9);
        errorDiv.id = errorId;

        if (existingDescribedBy) {
            field.setAttribute('aria-describedby', existingDescribedBy + ' ' + errorId);
        } else {
            field.setAttribute('aria-describedby', errorId);
        }
    });
}

function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.setAttribute('role', 'alert');
    message.setAttribute('aria-live', 'assertive');
    message.setAttribute('tabindex', '-1');
    message.innerHTML = `
        <h3>✅ Booking Request Received!</h3>
        <p>Thank you for your booking request! We'll contact you shortly to confirm your appointment.</p>
        <p>For immediate assistance, feel free to reach out via WhatsApp:</p>
        <a href="https://wa.me/12045550123?text=Hi!%20I'd%20like%20to%20book%20a%20mobile%20hair%20appointment%20in%20Winnipeg" target="_blank" rel="noopener" class="whatsapp-btn" aria-label="Contact via WhatsApp for immediate assistance">
            <i class="fab fa-whatsapp" aria-hidden="true"></i> Chat on WhatsApp
        </a>
    `;

    // Insert after form
    const form = document.getElementById('booking-form');
    form.parentNode.insertBefore(message, form.nextSibling);

    // Remove after 10 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 10000);
}

function showWhatsAppFallback() {
    const message = document.createElement('div');
    message.className = 'fallback-message';
    message.setAttribute('role', 'alert');
    message.setAttribute('aria-live', 'assertive');
    message.setAttribute('tabindex', '-1');
    message.innerHTML = `
        <h3>📱 Quick Booking Available</h3>
        <p>Our online form is experiencing technical difficulties. For immediate booking, please use WhatsApp:</p>
        <a href="https://wa.me/12045550123?text=Hi!%20I'd%20like%20to%20book%20a%20mobile%20hair%20appointment%20in%20Winnipeg" target="_blank" rel="noopener" class="whatsapp-btn" aria-label="Book via WhatsApp due to form issues">
            <i class="fab fa-whatsapp" aria-hidden="true"></i> Book via WhatsApp
        </a>
        <p>Or call us at <a href="tel:+12045550123" aria-label="Call (204) 555-0123">(204) 555-0123</a></p>
    `;

    // Insert after form
    const form = document.getElementById('booking-form');
    form.parentNode.insertBefore(message, form.nextSibling);

    // Remove after 15 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 15000);
}

function showWhatsAppFallback() {
    const message = document.createElement('div');
    message.className = 'fallback-message';
    message.innerHTML = `
        <h3>📱 Quick Booking Available</h3>
        <p>Our online form is experiencing technical difficulties. For immediate booking, please use WhatsApp:</p>
        <a href="https://wa.me/12045550123?text=Hi!%20I'd%20like%20to%20book%20a%20mobile%20hair%20appointment%20in%20Winnipeg" target="_blank" class="whatsapp-btn">
            <i class="fab fa-whatsapp"></i> Book via WhatsApp
        </a>
        <p>Or call us at (204) 555-0123</p>
    `;
    
    // Insert after form
    const form = document.getElementById('booking-form');
    form.parentNode.insertBefore(message, form.nextSibling);
    
    // Remove after 15 seconds
    setTimeout(() => {
        message.remove();
    }, 15000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date for booking form
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        dateInput.setAttribute('min', minDate);
    }

    // Add keyboard navigation for gallery
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach((img, index) => {
        img.setAttribute('tabindex', '0');
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Could add lightbox functionality here
                console.log('Gallery image clicked:', img.alt);
            }
        });
    });

    // Add proper heading hierarchy validation
    validateHeadingHierarchy();

    console.log('Hair@Home website loaded successfully with accessibility features!');
});

function validateHeadingHierarchy() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;

    headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level - lastLevel > 1) {
            console.warn(`Heading hierarchy issue: ${heading.tagName} follows H${lastLevel}, consider using H${lastLevel + 1}`);
        }
        lastLevel = level;
    });
}

// Add animation to elements when they come into view
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe elements that should have animations
document.querySelectorAll('.service-card, .testimonial-card, .area-card, .gallery-item').forEach(el => {
    observer.observe(el);
});

// Enhanced keyboard navigation
document.addEventListener('keydown', function(e) {
    // Tab navigation improvements
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// Remove keyboard navigation class on mouse usage
document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Focus trap for modals (if any future modals are added)
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="email"], input[type="tel"], input[type="date"], select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleTabKey(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }

    element.addEventListener('keydown', handleTabKey);
    return function() {
        element.removeEventListener('keydown', handleTabKey);
    };
}