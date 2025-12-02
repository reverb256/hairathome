// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        faqItem.classList.toggle('active');
    });
});

// Form Validation and Submission
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
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
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
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                // Fallback to WhatsApp on error
                showWhatsAppFallback();
            })
            .finally(() => {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        } else {
            alert('Please fill in all required fields.');
        }
    });
}

function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <h3>✅ Booking Request Received!</h3>
        <p>Thank you for your booking request! We'll contact you shortly to confirm your appointment.</p>
        <p>For immediate assistance, feel free to reach out via WhatsApp:</p>
        <a href="https://wa.me/12045550123?text=Hi!%20I%20just%20submitted%20a%20booking%20request%20and%20would%20like%20to%20confirm" target="_blank" class="whatsapp-btn">
            <i class="fab fa-whatsapp"></i> Chat on WhatsApp
        </a>
    `;
    
    // Insert after form
    const form = document.getElementById('booking-form');
    form.parentNode.insertBefore(message, form.nextSibling);
    
    // Remove after 10 seconds
    setTimeout(() => {
        message.remove();
    }, 10000);
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
    // Add any initialization code here
    console.log('Hair At Home website loaded successfully!');
});

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