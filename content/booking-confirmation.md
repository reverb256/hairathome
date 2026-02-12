---
title: "Booking Confirmation"
subtitle: "Your appointment request has been received"
description: "Confirmation page for successful booking submissions"
date: 2025-01-01T00:00:00-06:00
---

<div class="confirmation-container">
    <div class="success-animation">
        <div class="checkmark-circle">
            <div class="checkmark"></div>
        </div>
    </div>
    
    <h1 class="confirmation-title">Booking Request Received!</h1>
    <p class="confirmation-message">
        Thank you for choosing Hair@Home! We've received your appointment request and will contact you within 24 hours to confirm your booking.
    </p>
    
    <div class="next-steps">
        <h2>What Happens Next?</h2>
        <div class="steps">
            <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <h3>Confirmation Call</h3>
                    <p>We'll call or text you within 24 hours to confirm your appointment time and discuss any specific requirements.</p>
                </div>
            </div>
            <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <h3>Preparation</h3>
                    <p>We'll arrive 15 minutes early to set up our mobile service station at your location.</p>
                </div>
            </div>
            <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <h3>Service Day</h3>
                    <p>Enjoy professional hair services in the comfort of your home!</p>
                </div>
            </div>
        </div>
    </div>
    
    <div class="payment-info">
        <h2>Payment Information</h2>
        <p>As requested, we accept:</p>
        <ul>
            <li><strong>Interac e-Transfer:</strong> Send to info@hairathome.ca</li>
            <li><strong>Cash:</strong> Pay directly on service day</li>
        </ul>
    </div>
    
    <div class="contact-info">
        <h2>Need to Make Changes?</h2>
        <p>If you need to modify or cancel your booking, please contact us:</p>
        <div class="contact-methods">
            <div class="contact-item">
                <strong>Phone:</strong> <a href="tel:2045550123">(204) 555-0123</a>
            </div>
            <div class="contact-item">
                <strong>Email:</strong> <a href="mailto:info@hairathome.ca">info@hairathome.ca</a>
            </div>
        </div>
    </div>
    
    <div class="actions">
        <a href="/" class="btn btn-primary">Return to Home</a>
        <a href="/services/" class="btn btn-secondary">Browse Services</a>
    </div>
</div>

<style>
.confirmation-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
}

.success-animation {
    margin-bottom: 2rem;
}

.checkmark-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #10b981;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    animation: scaleIn 0.3s ease;
}

.checkmark {
    width: 24px;
    height: 48px;
    border-right: 4px solid white;
    border-bottom: 4px solid white;
    transform: rotate(45deg);
    margin-top: -8px;
}

@keyframes scaleIn {
    from {
        transform: scale(0);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

.confirmation-title {
    font-size: 2.5rem;
    color: #1f2937;
    margin-bottom: 1rem;
}

.confirmation-message {
    font-size: 1.125rem;
    color: #4b5563;
    margin-bottom: 3rem;
    line-height: 1.6;
}

.next-steps, .payment-info, .contact-info {
    background: #f9fafb;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
    text-align: left;
}

.next-steps h2, .payment-info h2, .contact-info h2 {
    color: #1f2937;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
}

.steps {
    display: grid;
    gap: 1.5rem;
}

.step {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.step-number {
    background: #6366f1;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
}

.step-content h3 {
    margin-bottom: 0.5rem;
    color: #1f2937;
}

.step-content p {
    color: #6b7280;
    line-height: 1.5;
}

.payment-info ul {
    list-style: none;
    padding: 0;
}

.payment-info li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e7eb;
}

.payment-info li:last-child {
    border-bottom: none;
}

.contact-methods {
    display: grid;
    gap: 1rem;
    margin-top: 1rem;
}

.contact-item {
    padding: 1rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
}

.contact-item a {
    color: #6366f1;
    text-decoration: none;
}

.contact-item a:hover {
    text-decoration: underline;
}

.actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 3rem;
}

.btn {
    padding: 0.75rem 2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    display: inline-block;
}

.btn-primary {
    background: #1f2937;
    color: white;
}

.btn-primary:hover {
    background: #374151;
}

.btn-secondary {
    background: #f3f4f6;
    color: #1f2937;
    border: 1px solid #d1d5db;
}

.btn-secondary:hover {
    background: #e5e7eb;
}

@media (max-width: 768px) {
    .confirmation-container {
        padding: 1rem;
    }
    
    .confirmation-title {
        font-size: 2rem;
    }
    
    .actions {
        flex-direction: column;
        align-items: center;
    }
    
    .btn {
        width: 100%;
        max-width: 300px;
    }
}
</style>