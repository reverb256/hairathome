/** @type {import('tailwindcss')} */
import colors from 'tailwindcss/palette';

/** @type {import('tailwindcss')} */
import defaultTheme from 'tailwindcss/defaultTheme';
import forms from 'tailwindcss/forms';
import typography from 'tailwindcss/typography';

/** @type {import('tailwindcss')} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './themes/hairathome/layouts/**/*.html',
    './themes/hairathome/content/**/*.md',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: '#FBF8F3',
          vanilla: '#F5E6D3',
          sand: '#E8D4C0',
          copper: '#D97742',
          terracotta: '#C16650',
          honey: '#F5D061',
          charcoal: '#2D2520',
          espresso: '#2D2520',
          mocha: '#8B6B78',
          cocoa: '#5D4037',
          gold: '#FFD700',
          champagne: '#F5DEB3',
          amber: '#F59E0B',
          rose: '#E11D48',
          blush: '#FDA4AF',
          slate: '#6B7280',
          stone: '#9CA3AF',
          stoneDark: '#64748B',
          creamDark: '#E8D4C0',
        },
        fontFamily: {
          display: ['Inter', 'sans-serif'],
          body: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [
      defaultTheme,
      forms,
      typography,
      plugin(({ addUtilities, matchUtilities }) => {
        // Custom utilities for Hair@Home website
        addUtilities({
          '.animate-float': {
            animation: 'float 6s ease-in-out infinite',
          },
          '.animate-float-slow': {
            animation: 'float 8s ease-in-out infinite',
          },
          '.animate-pulse-soft': {
            animation: 'pulse-soft 3s ease-in-out infinite',
          },
          '.animate-slide-up': {
            animation: 'slide-up 0.5s ease-out',
          },
          '.animate-fade-in': {
            animation: 'fade-in 0.6s ease-out',
          },
          '.animate-underglow': {
            boxShadow: '0 0 20px -5px rgba(217, 119, 6, 0.3)',
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          '@keyframes float-slow': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          '@keyframes pulse-soft': {
            '0%, 100%': { opacity: '0.4' },
            '50%': { opacity: '0.8' },
          },
          '@keyframes slide-up': {
            'from': { opacity: '0', transform: 'translateY(20px)' },
            'to': { opacity: '1', transform: 'translateY(0)' },
          },
          '@keyframes fade-in': {
            'from': { opacity: '0' },
            'to': { opacity: '1' },
          },
        }),
      }),
    ],
    darkMode: 'class',
  };
