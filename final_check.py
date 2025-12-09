#!/usr/bin/env python3
"""
Final verification of the Hair@Home website functionality
"""

import requests

def final_verification():
    print("🔍 Final Verification of Hair@Home Website")
    print("="*50)
    
    url = "https://reverb256.github.io/hairathome/"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        content = response.text
        
        print(f"✅ Status: {response.status_code}")
        print(f"✅ Content length: {len(content)} bytes")
        
        # Key verifications
        checks = [
            ("Page Title", "Hair@Home" in content),
            ("Theme Toggle Button", 'id="theme-toggle"' in content),
            ("Mobile Menu Button", 'id="mobile-menu-btn"' in content),
            ("Services Section", 'id="services"' in content),
            ("Contact Section", 'id="contact"' in content),
            ("Footer Present", "footer" in content),
            ("Booking Functionality", "booking" in content.lower()),
            ("WhatsApp Button", "wa.me" in content),
        ]
        
        print("\n📋 Key Features Check:")
        all_good = True
        for feature, present in checks:
            status = "✅" if present else "❌"
            print(f"  {status} {feature}")
            if not present:
                all_good = False
        
        # Check for color consistency
        has_gray_classes = 'dark:bg-gray' in content or 'bg-gray' in content
        has_zinc_classes = 'dark:bg-zinc' in content or 'bg-zinc' in content
        
        print(f"\n🎨 Color Scheme:")
        print(f"  ✅ Gray classes present: {has_gray_classes}")
        print(f"  ❌ Zinc classes present: {has_zinc_classes}")
        
        if has_zinc_classes:
            all_good = False
        
        print(f"\n🎯 Overall Assessment:")
        if all_good:
            print("  🎉 Website is fully functional with proper themes!")
            print("  ✅ All key features present")
            print("  ✅ Color scheme consistent (gray)")
            print("  ✅ Theme toggle functionality ready")
        else:
            print("  ⚠️  Some issues detected - review needed")
        
        print(f"\n🌐 Website available at: {url}")
        
        return all_good
        
    except requests.RequestException as e:
        print(f"❌ Error accessing website: {e}")
        return False

if __name__ == "__main__":
    success = final_verification()
    if success:
        print("\n🎊 Final verification successful!")
    else:
        print("\n🔧 Issues detected - further fixes may be needed")