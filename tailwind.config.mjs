export default {
  content: ['./src/**/*.astro'],
  darkMode: 'class',
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
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
