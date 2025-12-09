#!/usr/bin/env python3
"""
Quick verification script for Hair@Home website
Checks if the main functionality is working without complex browser automation.
"""

import requests
from urllib.parse import urljoin

def verify_website():
    base_url = "https://reverb256.github.io/hairathome/"
    
    print(f"Verifying website: {base_url}")
    
    try:
        # Fetch the main page
        response = requests.get(base_url)
        response.raise_for_status()
        
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Content Length: {len(response.content)} bytes")
        
        # Check for key elements in the HTML
        content = response.text
        
        checks = [
            ("Title", "Hair@Home" in content),
            ("Theme Toggle", 'id="theme-toggle"' in content),
            ("Mobile Menu", 'id="mobile-menu-btn"' in content),
            ("Services Section", 'id="services"' in content),
            ("Contact Section", 'id="contact"' in content),
            ("Gray Colors", 'bg-gray-' in content),  # Confirming gray is used
            ("No Zinc Colors", 'bg-zinc-' not in content),  # Confirming zinc is not used
            ("Main JS", 'js/main.js' in content),
        ]
        
        print("\n✓ Verification Results:")
        all_passed = True
        for check_name, result in checks:
            status = "PASS" if result else "FAIL"
            print(f"  {check_name}: {status}")
            if not result:
                all_passed = False
        
        if all_passed:
            print(f"\n✓ All tests passed! The website is working correctly.")
            print(f"✓ Live at: {base_url}")
        else:
            print(f"\n! Some tests failed. Please review the implementation.")
        
        return all_passed
        
    except requests.RequestException as e:
        print(f"✗ Error accessing website: {e}")
        return False

if __name__ == "__main__":
    verify_website()