import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const siteTarget = process.env.SITE_TARGET ?? 'hotel/demo';
const template = siteTarget.split('/')[0];
const siteUrl = process.env.SITE_URL?.trim();

export default defineConfig({
  ...(siteUrl ? { site: siteUrl } : {}),
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@siteData': resolve(root, 'src/data', siteTarget),
        '@siteTemplate': resolve(root, 'src/templates', `${template}.astro`),
        '@siteTheme': resolve(root, 'src/themes', `${template}.css`)
      }
    },
    server: {
      watch: {
        usePolling: true,
        interval: 100
      }
    }
  }
});