import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://reverb256.github.io/hairathome/',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap(),
  ],
  output: 'static',
  outDir: 'docs',
  build: { format: 'directory' },
  vite: { build: { assetsInlineLimit: 0 } },
});
