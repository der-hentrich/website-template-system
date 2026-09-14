// @ts-expect-error @siteSchema is resolved dynamically through SITE_TARGET in astro.config.mjs.
import schema from '@siteSchema';

export const siteTarget = process.env.SITE_TARGET?.trim() || 'hotel/demo';

const targetParts = siteTarget.split('/');

if (targetParts.length !== 2 || targetParts.some((part: string) => !part || part === '.' || part === '..')) {
    throw new Error(`Invalid SITE_TARGET "${siteTarget}". Expected "<template>/<site>", for example "hotel/demo".`);
}

const [, site] = targetParts;

type JsonLoader = () => Promise<unknown>;

const siteJsonModules = import.meta.glob('@siteData/*.json', {
    import: 'default'
}) as Record<string, JsonLoader>;

const demoJsonModules = import.meta.glob('@demoData/data.json', {
    import: 'default'
}) as Record<string, JsonLoader>;

function findJsonLoader(modules: Record<string, JsonLoader>, filename: string): JsonLoader | undefined {
    return Object.entries(modules).find(([path]) => path.endsWith(`/${filename}`))?.[1];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function mergeData(base: unknown, override: unknown): unknown {
    if (Array.isArray(override)) {
        return override;
    }

    if (isPlainObject(base) && isPlainObject(override)) {
        const result: Record<string, unknown> = { ...base };

        for (const [key, value] of Object.entries(override)) {
            result[key] = Object.hasOwn(base, key) ? mergeData(base[key], value) : value;
        }

        return result;
    }

    return override;
}

const liveDataLoader = findJsonLoader(siteJsonModules, 'data.json');
const demoOverrideLoader = findJsonLoader(siteJsonModules, 'demo.json');
const baseDemoDataLoader = findJsonLoader(demoJsonModules, 'data.json');

let data: unknown;

if (site === 'demo') {
    if (!liveDataLoader) {
        throw new Error(`Template demo data not found for "${siteTarget}". Expected data.json.`);
    }

    data = await liveDataLoader();
} else if (liveDataLoader) {
    data = await liveDataLoader();
} else if (demoOverrideLoader) {
    if (!baseDemoDataLoader) {
        throw new Error(`Template demo data not found for "${siteTarget}".`);
    }

    data = mergeData(await baseDemoDataLoader(), await demoOverrideLoader());
} else {
    throw new Error(`Site data not found for "${siteTarget}". Expected data.json or demo.json.`);
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