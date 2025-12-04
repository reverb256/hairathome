#!/usr/bin/env python3
"""
WCAG Contrast Ratio Validation for Hair@Home Website
Validates text contrast ratios against WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
"""

import re
import math
from typing import Dict, Tuple, List

def hex_to_rgb(hex_color: str):
    """Convert hex color to RGB values"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_luminance(r, g, b):
    """Calculate relative luminance from RGB values"""
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    r = r / 12.92 if r <= 0.03928 else ((r + 0.055) / 1.055) ** 2.4
    g = g / 12.92 if g <= 0.03928 else ((g + 0.055) / 1.055) ** 2.4
    b = b / 12.92 if b <= 0.03928 else ((b + 0.055) / 1.055) ** 2.4
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def calculate_contrast(color1: str, color2: str) -> float:
    """Calculate contrast ratio between two colors"""
    rgb1 = hex_to_rgb(color1)
    rgb2 = hex_to_rgb(color2)
    lum1 = rgb_to_luminance(*rgb1)
    lum2 = rgb_to_luminance(*rgb2)
    lighter = max(lum1, lum2)
    darker = min(lum1, lum2)
    return (lighter + 0.05) / (darker + 0.05)

def validate_wcag_aa(contrast_ratio: float, is_large_text: bool = False) -> bool:
    """Check if contrast ratio meets WCAG AA standards"""
    threshold = 3.0 if is_large_text else 4.5
    return contrast_ratio >= threshold

def analyze_css_contrasts() -> Dict[str, List[Dict]]:
    """Analyze CSS color combinations for contrast issues"""
    
    # Color definitions from the CSS
    colors = {
        'beauty-primary': '#f3e6d0',
        'beauty-primary-dark': '#e6d4b6', 
        'beauty-secondary': '#d4a998',
        'beauty-accent': '#e8c4a8',
        'beauty-accent-bright': '#f5d5c8',
        'beauty-text-dark': '#3d2e26',
        'beauty-text-medium': '#5a4a3f',
        'beauty-text-light': '#f9f5ee',
        'beauty-neutral-light': '#f9f5ee',
        'beauty-neutral-medium': '#e8dcc8',
        'beauty-neutral-dark': '#1e1916',
        'beauty-gold-accent': '#d4af37',
        'beauty-gold-light': '#e6c547',
        'beauty-rose-gold': '#c9a879',
        'white': '#ffffff',
        'black': '#000000'
    }
    
    # Background colors for each theme
    dark_theme_bg = {
        'primary': '#0a0a0a',
        'secondary': '#1a1a1a', 
        'tertiary': '#2a2a2a',
        'card': 'rgba(30, 25, 22, 0.95)'  # Approximate as #1e1916
    }
    
    light_theme_bg = {
        'primary': '#f9f5ee',
        'secondary': '#f0e6d9',
        'tertiary': '#e8dcc8', 
        'card': 'rgba(255, 255, 255, 0.9)'  # Approximate as #ffffff
    }
    
    results = {
        'dark_theme': [],
        'light_theme': [],
        'issues': []
    }
    
    # Test dark theme combinations
    print("=== DARK THEME CONTRAST ANALYSIS ===")
    for bg_name, bg_color in dark_theme_bg.items():
        # Convert rgba to hex approximation
        if bg_color.startswith('rgba'):
            bg_color = '#1e1916'  # Dark card background approximation
            
        for text_name, text_color in colors.items():
            if 'text' in text_name or text_name == 'white':
                contrast = calculate_contrast(text_color, bg_color)
                is_large = text_name == 'beauty-text-light'  # Usually used for headings
                passes = validate_wcag_aa(contrast, is_large)
                
                result = {
                    'background': f"{bg_name} ({bg_color})",
                    'text': f"{text_name} ({text_color})",
                    'contrast': round(contrast, 2),
                    'wcag_aa': passes,
                    'large_text': is_large
                }
                
                results['dark_theme'].append(result)
                
                status = "✅ PASS" if passes else "❌ FAIL"
                print(f"{status} {text_name} on {bg_name}: {contrast:.2f}:1")
                
                if not passes:
                    results['issues'].append(f"Dark theme: {text_name} on {bg_name} - {contrast:.2f}:1")
    
    print("\n=== LIGHT THEME CONTRAST ANALYSIS ===")
    # Test light theme combinations  
    for bg_name, bg_color in light_theme_bg.items():
        if bg_color.startswith('rgba'):
            bg_color = '#ffffff'  # White card approximation
            
        for text_name, text_color in colors.items():
            if 'text' in text_name or text_name == 'black':
                contrast = calculate_contrast(text_color, bg_color)
                is_large = text_name == 'beauty-text-dark'  # Usually used for headings
                passes = validate_wcag_aa(contrast, is_large)
                
                result = {
                    'background': f"{bg_name} ({bg_color})",
                    'text': f"{text_name} ({text_color})",
                    'contrast': round(contrast, 2),
                    'wcag_aa': passes,
                    'large_text': is_large
                }
                
                results['light_theme'].append(result)
                
                status = "✅ PASS" if passes else "❌ FAIL"
                print(f"{status} {text_name} on {bg_name}: {contrast:.2f}:1")
                
                if not passes:
                    results['issues'].append(f"Light theme: {text_name} on {bg_name} - {contrast:.2f}:1")
    
    return results

def generate_optimized_colors() -> Dict[str, str]:
    """Generate optimized color suggestions for better contrast"""
    
    optimized = {
        # Dark theme optimizations
        'dark_text_primary': '#ffffff',  # Pure white for maximum contrast
        'dark_text_secondary': '#e0e0e0',  # Light gray for secondary text
        'dark_text_muted': '#b0b0b0',  # Muted but still readable
        'dark_accent': '#e6c547',  # Lighter gold for better contrast
        
        # Light theme optimizations  
        'light_text_primary': '#1a1a1a',  # Darker than current for better contrast
        'light_text_secondary': '#4a4a4a',  # Medium dark
        'light_text_muted': '#666666',  # Muted but readable
        'light_accent': '#b8941f',  # Darker gold for better contrast
    }
    
    print("\n=== OPTIMIZED COLOR SUGGESTIONS ===")
    for name, color in optimized.items():
        print(f"{name}: {color}")
    
    return optimized

def main():
    """Main validation function"""
    print("Hair@Home WCAG Contrast Ratio Validation")
    print("=" * 50)
    
    results = analyze_css_contrasts()
    optimized = generate_optimized_colors()
    
    print(f"\n=== SUMMARY ===")
    print(f"Total contrast issues found: {len(results['issues'])}")
    
    if results['issues']:
        print("\nISSUES TO FIX:")
        for issue in results['issues']:
            print(f"  - {issue}")
    else:
        print("✅ All color combinations meet WCAG AA standards!")
    
    return results, optimized

if __name__ == "__main__":
    main()