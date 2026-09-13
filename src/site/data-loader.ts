// @ts-expect-error @siteSchema is resolved dynamically through SITE_TARGET in astro.config.mjs.
import schema from '@siteSchema';
// @ts-expect-error @siteData is resolved dynamically through SITE_TARGET in astro.config.mjs.
import data from '@siteData/data.json';

export const siteTarget = process.env.SITE_TARGET?.trim() || 'hotel/demo';

const targetParts = siteTarget.split('/');

if (targetParts.length !== 2 || targetParts.some((part: string) => !part || part === '.' || part === '..')) {
    throw new Error(`Invalid SITE_TARGET "${siteTarget}". Expected "<template>/<site>", for example "hotel/demo".`);
}

const result = schema.safeParse(data);

if (!result.success) {
    const details = result.error.issues.map((issue: { path: any[]; message: any; }) => {
        const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
        return `- ${path}: ${issue.message}`;
    }).join('\n');

    throw new Error(`Invalid site data for "${siteTarget}":\n${details}`);
}

export const siteData = result.data;
