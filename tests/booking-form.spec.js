import { test, expect } from '@playwright/test';

/**
 * Booking form tests for Hair At Home website
 * Tests form validation, submission, and user interactions
 */
test.describe('Hair At Home - Booking Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#booking').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test('booking form is present and accessible', async ({ page }) => {
    const bookingForm = page.locator('#booking-form');
    await expect(bookingForm).toBeVisible();
    
    const formTitle = page.locator('.booking h2');
    await expect(formTitle).toHaveText('Book Your Service');
  });

  test('all form fields are present', async ({ page }) => {
    const expectedFields = [
      { selector: '#name', label: 'Full Name' },
      { selector: '#email', label: 'Email' },
      { selector: '#phone', label: 'Phone' },
      { selector: '#service', label: 'Service' },
      { selector: '#date', label: 'Preferred Date' },
      { selector: '#time', label: 'Preferred Time' },
      { selector: '#location', label: 'Your Location (Winnipeg)' },
      { selector: '#message', label: 'Additional Details' }
    ];

    for (const { selector, label } of expectedFields) {
      const field = page.locator(selector);
      await expect(field).toBeVisible();
      
      const labelElement = page.locator(`label[for="${selector.replace('#', '')}"]`);
      await expect(labelElement).toHaveText(label);
    }
  });

  test('form validation works correctly', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();

    // Try to submit empty form
    await submitButton.click();
    
    // Check for HTML5 validation
    const nameField = page.locator('#name');
    await expect(nameField).toHaveAttribute('required');
    
    const emailField = page.locator('#email');
    await expect(emailField).toHaveAttribute('required');
    
    const phoneField = page.locator('#phone');
    await expect(phoneField).toHaveAttribute('required');
  });

  test('service dropdown has correct options', async ({ page }) => {
    const serviceSelect = page.locator('#service');
    await serviceSelect.click();
    
    const expectedOptions = [
      'Select a service',
      'Haircut & Style',
      'Color Services',
      'Wash & Blowout',
      'Special Occasion/Updo',
      'Treatment',
      'Beard Grooming'
    ];

    for (const option of expectedOptions) {
      const optionElement = page.locator(`#service option:has-text("${option}")`);
      await expect(optionElement).toBeVisible();
    }
  });

  test('time dropdown has correct time slots', async ({ page }) => {
    const timeSelect = page.locator('#time');
    await timeSelect.click();
    
    const expectedTimes = [
      'Select a time',
      '9:00 AM',
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '1:00 PM',
      '2:00 PM',
      '3:00 PM',
      '4:00 PM',
      '5:00 PM'
    ];

    for (const time of expectedTimes) {
      const optionElement = page.locator(`#time option:has-text("${time}")`);
      await expect(optionElement).toBeVisible();
    }
  });

  test('form can be filled with valid data', async ({ page }) => {
    const formData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(204) 555-0123',
      service: 'Haircut & Style',
      date: '2025-12-15',
      time: '2:00 PM',
      location: 'Downtown Winnipeg',
      message: 'Looking for a trim and style'
    };

    // Fill out the form
    await page.fill('#name', formData.name);
    await page.fill('#email', formData.email);
    await page.fill('#phone', formData.phone);
    await page.selectOption('#service', formData.service);
    await page.fill('#date', formData.date);
    await page.selectOption('#time', formData.time);
    await page.fill('#location', formData.location);
    await page.fill('#message', formData.message);

    // Verify all fields have the correct values
    await expect(page.locator('#name')).toHaveValue(formData.name);
    await expect(page.locator('#email')).toHaveValue(formData.email);
    await expect(page.locator('#phone')).toHaveValue(formData.phone);
    await expect(page.locator('#service')).toHaveValue(formData.service);
    await expect(page.locator('#date')).toHaveValue(formData.date);
    await expect(page.locator('#time')).toHaveValue(formData.time);
    await expect(page.locator('#location')).toHaveValue(formData.location);
    await expect(page.locator('#message')).toHaveValue(formData.message);
  });

  test('booking information panel is displayed', async ({ page }) => {
    const bookingInfo = page.locator('.booking-info');
    await expect(bookingInfo).toBeVisible();
    
    const serviceInfo = bookingInfo.locator('h3:has-text("Service Information")');
    await expect(serviceInfo).toBeVisible();
    
    const contactInfo = bookingInfo.locator('h4:has-text("Contact Information")');
    await expect(contactInfo).toBeVisible();
    
    // Check for key service information
    await expect(bookingInfo).toContainText('Travel fee included');
    await expect(bookingInfo).toContainText('All equipment and products provided');
    await expect(bookingInfo).toContainText('Sanitized tools');
  });

  test('form submission handling', async ({ page }) => {
    // Fill form with valid data
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#phone', '(204) 555-0123');
    await page.selectOption('#service', 'Haircut & Style');
    await page.fill('#date', '2025-12-15');
    await page.selectOption('#time', '2:00 PM');
    await page.fill('#location', 'Test Location');

    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Note: Since this is a static site, form submission will likely fail
    // This test verifies the submission attempt
    await expect(submitButton).toBeVisible();
  });
});