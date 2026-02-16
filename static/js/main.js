// Hair@Home - Main JavaScript
// Clean, professional functionality for mobile hair stylist service

document.addEventListener('DOMContentLoaded', function() {
    console.log('Hair@Home website loaded');

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Set default theme to light (more professional for a service business)
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        updateThemeToggle(savedTheme);
        
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeToggle(newTheme);
        });
    }
    
    function updateThemeToggle(theme) {
        const sunIcon = themeToggle.querySelector('.dark\\:hidden');
        const moonIcon = themeToggle.querySelector('.hidden.dark\\:block');
        
        if (theme === 'dark') {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }

    // Mobile navigation toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true' || false;
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Close mobile menu when clicking on a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form validation and submission for booking
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submit-btn');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span class="animate-pulse">Processing...</span>';
            submitBtn.disabled = true;

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            const paymentMethod = formData.get('paymentMethod');
            if (!paymentMethod) {
                showNotification('Please select a payment method.', 'error');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                return;
            }

            try {
                const formResponse = await fetch('https://formspree.io/f/xkgnggaw', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        ...data,
                        _subject: `New Booking Request - ${data.name}`,
                        _template: 'table'
                    })
                });

                if (formResponse.ok) {
                    const bookingId = 'HAIR-' + Date.now().toString(36).toUpperCase();
                    const paymentInstructions = getPaymentInstructions(data.paymentMethod);
                    
                    showPaymentConfirmation(bookingId, paymentInstructions);
                    this.reset();
                    showNotification('Booking request submitted successfully! We\'ll contact you within 24 hours.', 'success');
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Booking error:', error);
                showManualBookingInstructions(data);
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });

        // Add error styling to required fields
        const requiredFields = bookingForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                if (this.type === 'radio') {
                    const radioGroup = document.querySelectorAll(`input[name="${this.name}"]`);
                    const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                    if (!isChecked) {
                        radioGroup.forEach(radio => radio.closest('label')?.classList.add('error'));
                    } else {
                        radioGroup.forEach(radio => radio.closest('label')?.classList.remove('error'));
                    }
                } else if (!this.value.trim()) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            });
        });
    }

    // Set min date for booking form to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Initialize gallery lightbox if gallery exists
    initGalleryLightbox();
    
    // Initialize lazy loading for images
    initLazyLoading();
});

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styling via CSS classes
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        color: white;
        z-index: 10000;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;

    // Set background based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
    } else {
        notification.style.backgroundColor = '#007bff';
    }

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Payment confirmation modal
function showPaymentConfirmation(bookingId, instructions) {
    const existingModal = document.querySelector('.payment-confirmation-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'payment-confirmation-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closePaymentConfirmation()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closePaymentConfirmation()">&times;</button>
            <div class="modal-body">
                <div class="success-icon">✓</div>
                <h2>Booking Confirmed!</h2>
                <p class="booking-id">Booking ID: <strong>${bookingId}</strong></p>
                <div class="payment-instructions">
                    <h3>Payment Instructions</h3>
                    <p class="instructions-text">${instructions.replace(/\n/g, '<br>')}</p>
                </div>
                <div class="contact-info">
                    <p><strong>Questions? Call us at (204) 555-0123</strong></p>
                </div>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .payment-confirmation-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
        }
        .modal-content {
            position: relative;
            background: white;
            border-radius: 16px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            animation: modalSlideIn 0.3s ease;
        }
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 2rem;
            line-height: 1;
            color: #6b7280;
            cursor: pointer;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s;
        }
        .modal-close:hover {
            background: #f3f4f6;
            color: #374151;
        }
        .success-icon {
            width: 80px;
            height: 80px;
            background: #10b981;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            font-weight: bold;
            margin: 0 auto 1.5rem;
        }
        .modal-body h2 {
            text-align: center;
            color: #1f2937;
            font-size: 1.75rem;
            margin-bottom: 0.5rem;
        }
        .booking-id {
            text-align: center;
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
        }
        .payment-instructions {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 1.25rem;
            margin-bottom: 1.5rem;
        }
        .payment-instructions h3 {
            color: #1f2937;
            font-size: 1rem;
            margin-bottom: 0.75rem;
        }
        .instructions-text {
            color: #4b5563;
            font-size: 0.875rem;
            line-height: 1.6;
        }
        .contact-info {
            text-align: center;
            color: #1f2937;
            font-size: 0.875rem;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);

    window.closePaymentConfirmation = function() {
        const modal = document.querySelector('.payment-confirmation-modal');
        if (modal) modal.remove();
    };
}

// Gallery lightbox functionality
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                showLightbox(img.src, img.alt);
            }
        });
    });
}

function showLightbox(src, alt) {
    // Remove existing lightbox
    const existing = document.querySelector('.lightbox');
    if (existing) existing.remove();
    
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${src}" alt="${alt}">
        </div>
    `;
    
    // Add basic styling
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    lightbox.querySelector('.lightbox-content').style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
    `;
    
    lightbox.querySelector('img').style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        display: block;
        border-radius: 4px;
    `;
    
    lightbox.querySelector('.lightbox-close').style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        font-size: 30px;
        color: white;
        cursor: pointer;
        z-index: 10001;
    `;
    
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
        document.body.removeChild(lightbox);
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            document.body.removeChild(lightbox);
        }
    });
    
    document.body.appendChild(lightbox);
}

// Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

function getPaymentInstructions(paymentMethod) {
    switch (paymentMethod) {
        case 'interac':
            return `Interac e-Transfer Instructions:
1. Send payment to: info@hairathome.ca
2. Use booking ID as security question answer
3. Payment is due on service day
4. Most Canadian banks offer this service free`;
        
        case 'cash':
            return `Cash Payment Instructions:
1. Pay directly to the stylist on service day
2. Please have exact amount if possible
3. Receipt will be provided
4. No additional fees for cash payments`;
        
        default:
            return 'Payment will be discussed during confirmation call.';
    }
}

function showManualBookingInstructions(data) {
    const modal = document.createElement('div');
    modal.className = 'manual-booking-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeManualBooking()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeManualBooking()">&times;</button>
            <div class="modal-body">
                <h2>Complete Your Booking</h2>
                <p>Please call or text us to complete your booking:</p>
                <div class="contact-methods">
                    <div class="contact-method">
                        <strong>Phone:</strong> <a href="tel:2045550123">(204) 555-0123</a>
                    </div>
                    <div class="contact-method">
                        <strong>Email:</strong> <a href="mailto:info@hairathome.ca">info@hairathome.ca</a>
                    </div>
                </div>
                <div class="booking-details">
                    <h3>Your Booking Details:</h3>
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Service:</strong> ${data.service}</p>
                    <p><strong>Date:</strong> ${data.date}</p>
                    <p><strong>Time:</strong> ${data.time}</p>
                    <p><strong>Location:</strong> ${data.location}</p>
                    <p><strong>Payment Method:</strong> ${data.paymentMethod === 'interac' ? 'Interac e-Transfer' : 'Cash'}</p>
                </div>
                <p class="note">We'll respond within 24 hours to confirm your appointment.</p>
            </div>
        </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .manual-booking-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .manual-booking-modal .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
        }
        .manual-booking-modal .modal-content {
            position: relative;
            background: white;
            border-radius: 16px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .manual-booking-modal .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 2rem;
            line-height: 1;
            color: #6b7280;
            cursor: pointer;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s;
        }
        .manual-booking-modal .modal-close:hover {
            background: #f3f4f6;
            color: #374151;
        }
        .manual-booking-modal .modal-body h2 {
            text-align: center;
            color: #1f2937;
            font-size: 1.75rem;
            margin-bottom: 1rem;
        }
        .manual-booking-modal .contact-methods {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 1.25rem;
            margin: 1.5rem 0;
        }
        .manual-booking-modal .contact-method {
            margin-bottom: 0.75rem;
        }
        .manual-booking-modal .contact-method:last-child {
            margin-bottom: 0;
        }
        .manual-booking-modal .booking-details {
            background: #f0fdf4;
            border: 1px solid #86efac;
            border-radius: 8px;
            padding: 1.25rem;
            margin: 1.5rem 0;
        }
        .manual-booking-modal .booking-details h3 {
            color: #166534;
            font-size: 1rem;
            margin-bottom: 0.75rem;
        }
        .manual-booking-modal .booking-details p {
            color: #374151;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
        }
        .manual-booking-modal .note {
            text-align: center;
            color: #6b7280;
            font-size: 0.875rem;
            margin-top: 1.5rem;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);

    window.closeManualBooking = function() {
        const modal = document.querySelector('.manual-booking-modal');
        if (modal) modal.remove();
    };
}

if (!document.querySelector('#notification-animation')) {
    const style = document.createElement('style');
    style.id = 'notification-animation';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}