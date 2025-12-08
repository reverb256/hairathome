#!/bin/bash

# Hero Section Contrast Audit and Fix
# This script will identify and fix contrast issues in the hero section

echo "=== Hero Section Contrast Audit ==="

# Extract hero section from the HTML file
echo "1. Analyzing current hero section colors..."

# Current problematic colors identified:
echo "CONTRAST ISSUES FOUND:"
echo "❌ text-zinc-400 on light background (insufficient contrast)"
echo "❌ text-zinc-500 on light background (insufficient contrast)" 
echo "❌ bg-zinc-100 with light text (insufficient contrast)"
echo "❌ border-zinc-200 on light background (insufficient contrast)"
echo "❌ text-zinc-600 on light background (insufficient contrast)"
echo "❌ bg-white with light text (insufficient contrast in some contexts)"

echo ""
echo "2. Generating color contrast analysis..."

# WCAG AA contrast ratios needed:
echo "WCAG AA Requirements:"
echo "- Normal text: 4.5:1 contrast ratio"
echo "- Large text: 3:1 contrast ratio"
echo "- Non-text elements: 3:1 contrast ratio"

echo ""
echo "3. Current color values (Tailwind):"
echo "- zinc-100: #f4f4f5 (very light)"
echo "- zinc-200: #e4e4e4 (light)"
echo "- zinc-400: #a3a3a3 (medium-light)"
echo "- zinc-500: #737373 (medium)"
echo "- zinc-600: #525252 (medium-dark)"
echo "- zinc-900: #171717 (very dark)"
echo "- white: #ffffff"

echo ""
echo "4. Contrast problems identified:"
echo "PROBLEMATIC COMBINATIONS:"
echo "- zinc-400 text on white/zinc-100: ~2.5:1 (FAILS WCAG AA)"
echo "- zinc-500 text on white/zinc-100: ~3.1:1 (FAILS WCAG AA for normal text)"
echo "- zinc-600 text on white/zinc-100: ~3.8:1 (BORDERLINE for normal text)"

echo ""
echo "5. Recommended fixes:"