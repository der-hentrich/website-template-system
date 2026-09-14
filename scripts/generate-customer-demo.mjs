import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const siteTarget = process.argv[2]?.trim();

if (!siteTarget) {
    throw new Error('Missing site target. Expected "<template>/<site>", for example "hotel/01a08308-ed0e-731a-9578-89feee09ddc7".');
}

const targetParts = siteTarget.split('/');

if (targetParts.length !== 2 || targetParts.some((part) => !part || part === '.' || part === '..')) {
    throw new Error(`Invalid site target "${siteTarget}". Expected "<template>/<site>".`);
}

const [template, site] = targetParts;

if (site === 'demo') {
    throw new Error('The base demo must not be generated from an override.');
}

const baseDir = resolve(root, 'src/data', template, 'demo');
const targetDir = resolve(root, 'src/data', template, site);
const baseDataFile = resolve(baseDir, 'data.json');
const overrideFile = resolve(targetDir, 'override.json');
const targetDataFile = resolve(targetDir, 'data.json');
const baseImagesDir = resolve(baseDir, 'images');
const targetImagesDir = resolve(targetDir, 'images');

if (!existsSync(baseDataFile)) {
    throw new Error(`Base demo data not found: ${baseDataFile}`);
}

if (!existsSync(overrideFile)) {
    throw new Error(`Override data not found: ${overrideFile}`);
}

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function merge(base, override) {
    if (Array.isArray(override)) {
        return structuredClone(override);
    }

    if (isPlainObject(base) && isPlainObject(override)) {
        const result = structuredClone(base);

        for (const [key, value] of Object.entries(override)) {
            result[key] = Object.hasOwn(base, key) ? merge(base[key], value) : structuredClone(value);
        }

        return result;
    }

    return structuredClone(override);
}

const baseData = JSON.parse(await readFile(baseDataFile, 'utf8'));
const overrideData = JSON.parse(await readFile(overrideFile, 'utf8'));
const resolvedData = merge(baseData, overrideData);
resolvedData.demo = true;

await mkdir(targetDir, { recursive: true });
await writeFile(targetDataFile, `${JSON.stringify(resolvedData, null, 2)}\n`, 'utf8');

if (existsSync(baseImagesDir)) {
    await mkdir(targetImagesDir, { recursive: true });
    await cp(baseImagesDir, targetImagesDir, { recursive: true, force: false, errorOnExist: false });
}

console.log(`Generated ${targetDataFile}`);