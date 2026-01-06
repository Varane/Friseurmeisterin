import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://varane.github.io',
  base: '/Friseurmeisterin',
  integrations: [tailwind()],
});
