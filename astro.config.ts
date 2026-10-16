import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://reverb256.github.io/hairathome/',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  output: 'static',
  build: { format: 'directory' },
  vite: { build: { assetsInlineLimit: 0 } },
});
