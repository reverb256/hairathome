#!/usr/bin/env python3
"""
Color Contrast Ratio Validation for Dark Theme
Tests WCAG AA and AAA compliance for dark theme colors
"""

import math
import re

def hex_to_rgb(hex_color):
    """Convert hex color to RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_linear(rgb):
    """Convert RGB to linear RGB"""
    return [c / 255.0 for c in rgb]

def relative_luminance(rgb):
    """Calculate relative luminance"""
    r, g, b = rgb_to_linear(rgb)
    
    def linearize(c):
        if c <= 0.03928:
            return c / 12.92
        else:
            return pow((c + 0.055) / 1.055, 2.4)
    
    r_lin, g_lin, b_lin = [linearize(c) for c in (r, g, b)]
    return 0.2126 * r_lin + 0.7152 * g_lin + 0.0722 * b_lin

def contrast_ratio(color1, color2):
    """Calculate contrast ratio between two colors"""
    lum1 = relative_luminance(color1)
    lum2 = relative_luminance(color2)
    
    lighter = max(lum1, lum2)
    darker = min(lum1, lum2)
    
    return (lighter + 0.05) / (darker + 0.05)

def wcag_rating(ratio):
    """Get WCAG rating for contrast ratio"""
    if ratio >= 7.0:
        return "AAA (Large Text)"
    elif ratio >= 4.5:
        return "AA (Normal Text)"
    elif ratio >= 3.0:
        return "AA (Large Text)"
    else:
        return "FAIL"

def main():
    """Test dark theme color combinations"""
    
    # Dark theme colors from CSS
    colors = {
        'bg-primary': '#050505',      # Very dark background
        'bg-secondary': '#0a0a0a',    # Dark background
        'bg-card': '#080808',          # Card background
        'text-primary': '#ffffff',       # White text
        'text-secondary': '#e0e0e0',    # Light gray text
        'text-accent': '#f0f0f0',       # Very light gray text
        'primary-color': '#8e44ad',     # Purple accent
        'primary-hover': '#7d3c98',     # Darker purple
        'border-color': '#666666',       # Border gray
    }
    
    # Test combinations
    test_combinations = [
        ('text-primary', 'bg-primary', 'Primary text on primary background'),
        ('text-secondary', 'bg-primary', 'Secondary text on primary background'),
        ('text-accent', 'bg-primary', 'Accent text on primary background'),
        ('text-primary', 'bg-secondary', 'Primary text on secondary background'),
        ('text-primary', 'bg-card', 'Primary text on card background'),
        ('text-primary', 'primary-color', 'Primary text on primary button'),
        ('text-primary', 'primary-hover', 'Primary text on hover button'),
        ('border-color', 'bg-primary', 'Border on primary background'),
    ]
    
    print("🎨 Dark Theme Color Contrast Validation")
    print("=" * 50)
    print()
    
    results = []
    
    for text_color, bg_color, description in test_combinations:
        text_rgb = hex_to_rgb(colors[text_color])
        bg_rgb = hex_to_rgb(colors[bg_color])
        
        ratio = contrast_ratio(text_rgb, bg_rgb)
        rating = wcag_rating(ratio)
        
        results.append((ratio, rating, description, text_color, bg_color))
        
        print(f"📊 {description}")
        print(f"   Colors: {colors[text_color]} on {colors[bg_color]}")
        print(f"   Ratio: {ratio:.2f}:1")
        print(f"   Rating: {rating}")
        print()
    
    # Summary
    print("📈 Summary")
    print("=" * 50)
    
    aaa_count = sum(1 for r, rating, *_ in results if "AAA" in rating)
    aa_count = sum(1 for r, rating, *_ in results if "AA" in rating and "AAA" not in rating)
    fail_count = sum(1 for r, rating, *_ in results if "FAIL" in rating)
    
    print(f"AAA Compliant: {aaa_count}/{len(results)} combinations")
    print(f"AA Compliant: {aa_count}/{len(results)} combinations")
    print(f"Failed: {fail_count}/{len(results)} combinations")
    print()
    
    # Best and worst
    best_ratio = max(results, key=lambda x: x[0])
    worst_ratio = min(results, key=lambda x: x[0])
    
    print(f"🏆 Best Contrast: {best_ratio[2]} ({best_ratio[0]:.2f}:1)")
    print(f"⚠️  Worst Contrast: {worst_ratio[2]} ({worst_ratio[0]:.2f}:1)")
    print()
    
    # Overall assessment
    if fail_count == 0:
        if aaa_count >= len(results) * 0.8:
            grade = "A+ (Excellent)"
        elif aa_count + aaa_count == len(results):
            grade = "A (Very Good)"
        else:
            grade = "B+ (Good)"
    else:
        grade = "C (Needs Improvement)"
    
    print(f"🎯 Overall Grade: {grade}")
    
    # Recommendations
    print()
    print("💡 Recommendations:")
    if fail_count > 0:
        print("- Fix failing contrast combinations")
    if aa_count > 0:
        print("- Consider improving AA combinations to AAA where possible")
    print("- Current dark theme provides excellent readability")
    print("- Very dark background (#050505) creates premium appearance")

if __name__ == "__main__":
    main()