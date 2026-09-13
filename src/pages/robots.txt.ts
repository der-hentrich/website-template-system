import type { APIRoute } from 'astro';
import { siteData as data } from '../site/data-loader';

export const GET: APIRoute = ({ site }) => {
    const isIndexable = data.demo !== true && Boolean(site);
    const lines = ['User-agent: *', 'Allow: /'];

    if (isIndexable && site) {
        lines.push('', `Sitemap: ${new URL('/sitemap.xml', site).href}`);
    }

    return new Response(`${lines.join('\n')}\n`, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
};
