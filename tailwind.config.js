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
      plugin(({ addUtilities }) => {
        addUtilities({
          '.animate-float': {
            animation: 'float 6s ease-in-out infinite',
          },
          '.animate-float-slow': {
            animation: 'float-slow 8s ease-in-out infinite',
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
          '.animate-shimmer': {
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s infinite',
          },
          '.animate-scale-in': {
            animation: 'scale-in 0.5s ease-out',
          },
          '.animate-rotate-slow': {
            animation: 'rotate-slow 20s linear infinite',
          },
          '.animate-bounce-subtle': {
            animation: 'bounce-subtle 2s ease-in-out infinite',
          },
          '.animate-glow-pulse': {
            animation: 'glow-pulse 2s ease-in-out infinite',
          },
          '.animate-float-rotate': {
            animation: 'float-rotate 6s ease-in-out infinite',
          },
          '.stagger-1': { animationDelay: '0.1s' },
          '.stagger-2': { animationDelay: '0.2s' },
          '.stagger-3': { animationDelay: '0.3s' },
          '.stagger-4': { animationDelay: '0.4s' },
          '.stagger-5': { animationDelay: '0.5s' },
          '.stagger-6': { animationDelay: '0.6s' },
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
          '@keyframes shimmer': {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' },
          },
          '@keyframes scale-in': {
            'from': { opacity: '0', transform: 'scale(0.9)' },
            'to': { opacity: '1', transform: 'scale(1)' },
          },
          '@keyframes rotate-slow': {
            'from': { transform: 'rotate(0deg)' },
            'to': { transform: 'rotate(360deg)' },
          },
          '@keyframes bounce-subtle': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-5px)' },
          },
          '@keyframes glow-pulse': {
            '0%, 100%': { boxShadow: '0 0 20px -5px rgba(217, 119, 6, 0.3)' },
            '50%': { boxShadow: '0 0 30px -5px rgba(217, 119, 6, 0.5)' },
          },
          '@keyframes float-rotate': {
            '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
            '25%': { transform: 'translateY(-10px) rotate(2deg)' },
            '50%': { transform: 'translateY(-20px) rotate(0deg)' },
            '75%': { transform: 'translateY(-10px) rotate(-2deg)' },
          },
          '@keyframes wave': {
            '0%, 100%': { transform: 'rotate(0deg)' },
            '25%': { transform: 'rotate(20deg)' },
            '75%': { transform: 'rotate(-20deg)' },
          },
        });
      }),
    ],
    darkMode: 'class',
  },
  safelist: [
    'animate-slide-up',
    'animate-fade-in',
    'animate-scale-in',
    'animate-shimmer',
    'stagger-1',
    'stagger-2',
    'stagger-3',
    'stagger-4',
    'stagger-5',
    'stagger-6',
  ],
};
