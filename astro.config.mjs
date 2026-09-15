import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import ogImages from './src/integrations/og-images.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://nicolas-queiroz.github.io',
  // Como o repositório se chama <username>.github.io, o site é servido em /
  // então NÃO é necessário definir "base".
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [sitemap(), ogImages()],
  vite: {
    plugins: [tailwindcss()],
  },
});
