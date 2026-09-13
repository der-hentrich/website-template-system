import type { APIRoute } from 'astro';
// @ts-ignore
import data from '@siteData/data.json';

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character] ?? character);

export const GET: APIRoute = ({ site }) => {
    const isIndexable = (data as { demo?: boolean }).demo !== true && Boolean(site);
    const urls = isIndexable && site ? [new URL('/', site).href, new URL('/en/', site).href] : [];
    const entries = urls.map((url) => `<url><loc>${escapeXml(url)}</loc></url>`).join('');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>\n`;

    return new Response(xml, {
        headers: { 'Content-Type': 'application/xml; charset=utf-8' }
    });
};