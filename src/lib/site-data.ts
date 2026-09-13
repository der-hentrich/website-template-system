import hotelSchema from '../schemas/hotel';

// @ts-expect-error @siteData is resolved dynamically through SITE_TARGET in astro.config.mjs.
import data from '@siteData/data.json';

export const siteTarget = process.env.SITE_TARGET?.trim() || 'hotel/demo';

const targetParts = siteTarget.split('/');

if (targetParts.length !== 2 || targetParts.some((part: string) => !part || part === '.' || part === '..')) {
    throw new Error(`Invalid SITE_TARGET "${siteTarget}". Expected "<template>/<site>", for example "hotel/demo".`);
}

const template = targetParts[0];
const schemas = {
    hotel: hotelSchema
};
const schema = schemas[template as keyof typeof schemas];

if (!schema) {
    throw new Error(`No data schema found for template "${template}".`);
}

const result = schema.safeParse(data);

if (!result.success) {
    const details = result.error.issues.map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
        return `- ${path}: ${issue.message}`;
    }).join('\n');

    throw new Error(`Invalid site data for "${siteTarget}":\n${details}`);
}

export const siteData = result.data;