import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const siteTarget = process.env.SITE_TARGET ?? 'hotel/demo';
const template = siteTarget.split('/')[0];
const siteUrl = process.env.SITE_URL?.trim();
const sitePublicDir = resolve(root, 'src/data', siteTarget, 'public');
const outDir = resolve(root, 'dist', siteTarget);

let site;

if (siteUrl) {
  let parsedSite;

  try {
    parsedSite = new URL(siteUrl);
  } catch {
    throw new Error(`Invalid SITE_URL "${siteUrl}". Expected a complete URL, for example https://example.com.`);
  }

  if (parsedSite.protocol !== 'http:' && parsedSite.protocol !== 'https:') {
    throw new Error(`Invalid SITE_URL "${siteUrl}". Only http:// and https:// are supported.`);
  }

  site = parsedSite.href;
}

export default defineConfig({
  ...(site ? { site } : {}),
  outDir,
  publicDir: existsSync(sitePublicDir) ? sitePublicDir : resolve(root, 'public'),
  build: {
    assets: 'assets'
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@siteData': resolve(root, 'src/data', siteTarget),
        '@siteTemplate': resolve(root, 'src/templates', template, 'index.astro'),
        '@siteTheme': resolve(root, 'src/templates', template, 'theme.css'),
        '@siteSchema': resolve(root, 'src/templates', template, 'schema.ts')
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
