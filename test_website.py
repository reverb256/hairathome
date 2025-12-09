#!/usr/bin/env python3
"""
Playwright test script for Hair@Home website
Tests the main functionality and theme toggle of the website.
"""

import asyncio
from playwright.async_api import async_playwright

async def test_hairathome_website():
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=True)  # Use headless for testing
        page = await browser.new_page()
        
        # Navigate to the site
        print("Testing: https://reverb256.github.io/hairathome/")
        await page.goto("https://reverb256.github.io/hairathome/")
        
        # Check that page loads successfully
        title = await page.title()
        print(f"Page title: {title}")
        assert "Hair@Home" in title, f"Expected 'Hair@Home' in title, got: {title}"
        
        # Check if the main elements are present
        print("Checking if main elements are present...")
        
        # Check for header elements
        header_selector = "nav a"
        await page.wait_for_selector(header_selector)
        print("- Header navigation found")
        
        # Check for hero section
        hero_selector = "section:first-child h1"
        await page.wait_for_selector(hero_selector)
        hero_text = await page.text_content(hero_selector)
        print(f"- Hero section found: '{hero_text.strip()}'")
        
        # Check for theme toggle button
        theme_toggle = page.locator("#theme-toggle")
        await theme_toggle.wait_for(state="visible")
        print("- Theme toggle button found")
        
        # Test theme toggle functionality
        print("Testing theme toggle functionality...")
        
        # Check initial body class (should not have 'dark' initially if default is light)
        initial_classes = await page.evaluate("document.body.className")
        print(f"- Initial body classes: {initial_classes}")
        
        # Click the theme toggle
        await theme_toggle.click()
        
        # Wait for the dark class to be applied
        await page.wait_for_function("document.documentElement.classList.contains('dark')")
        
        # Verify dark mode is activated
        has_dark_class = await page.evaluate("document.documentElement.classList.contains('dark')")
        print(f"- Dark mode activated: {has_dark_class}")
        assert has_dark_class, "Dark mode was not activated after clicking theme toggle"
        
        # Click again to revert to light mode
        await theme_toggle.click()
        await page.wait_for_function("!(document.documentElement.classList.contains('dark'))")
        
        has_dark_class = await page.evaluate("document.documentElement.classList.contains('dark')")
        print(f"- Dark mode after second click: {has_dark_class}")
        assert not has_dark_class, "Dark mode was not deactivated after second click"
        
        # Check for service sections
        services_selector = "[id='services']"
        await page.wait_for_selector(services_selector)
        print("- Services section found")
        
        # Check for contact/booking section
        contact_selector = "[id='contact']"
        await page.wait_for_selector(contact_selector)
        print("- Contact section found")
        
        # Check for mobile menu (on smaller screens)
        mobile_menu_btn = page.locator("#mobile-menu-btn")
        await mobile_menu_btn.wait_for(state="visible")
        print("- Mobile menu button found")
        
        # Test mobile menu functionality
        await mobile_menu_btn.click()
        mobile_menu = page.locator("#mobile-menu")
        await mobile_menu.wait_for(state="visible")
        print("- Mobile menu opens correctly")
        
        # Close mobile menu
        await mobile_menu_btn.click()
        await mobile_menu.wait_for(state="hidden")
        print("- Mobile menu closes correctly")
        
        # Check for footer
        footer = page.locator("footer")
        await footer.wait_for(state="visible")
        print("- Footer found")
        
        # Check for WhatsApp button
        whatsapp_btn = page.locator("a[href*='wa.me']")
        await whatsapp_btn.wait_for(state="visible")
        print("- WhatsApp contact button found")
        
        print("\n✓ All tests passed! The Hair@Home website is working correctly.")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_hairathome_website())