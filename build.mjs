import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rename, rm, rmdir, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const siteTarget = process.argv[2] ?? 'hotel/demo';
const siteUrl = process.argv[3]?.trim();
const targetParts = siteTarget.split('/');
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.ico']);
const scriptExtensions = new Set(['.js', '.mjs']);
const textExtensions = new Set(['.html', '.css', '.js', '.mjs', '.xml', '.txt', '.json', '.map']);

if (targetParts.length !== 2 || targetParts.some((part) => !part || part === '.' || part === '..')) {
    throw new Error(`Invalid site target "${siteTarget}". Expected "<template>/<site>", for example "hotel/demo".`);
}

const dataFile = resolve(root, 'src/data', ...targetParts, 'data.json');
const outDir = resolve(root, 'dist', ...targetParts);
const assetsDir = resolve(outDir, 'assets');

if (!existsSync(dataFile)) {
    throw new Error(`Site data not found: ${dataFile}`);
}

process.env.SITE_TARGET = siteTarget;

if (siteUrl) {
    process.env.SITE_URL = siteUrl;
} else {
    delete process.env.SITE_URL;
}

function toPosix(value) {
    return value.replaceAll('\\', '/');
}

async function collectFiles(directory) {
    if (!existsSync(directory)) return [];

    const files = [];
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
        const path = resolve(directory, entry.name);

        if (entry.isDirectory()) {
            files.push(...await collectFiles(path));
        } else {
            files.push(path);
        }
    }

    return files;
}

async function contentHash(file) {
    return createHash('sha256').update(await readFile(file)).digest('hex').slice(0, 12);
}

function assetType(file) {
    const extension = extname(file).toLowerCase();

    if (extension === '.css') return 'css';
    if (scriptExtensions.has(extension)) return 'js';
    if (imageExtensions.has(extension)) return 'image';

    return 'other';
}

async function referencedByHtml(relativePath) {
    const htmlFiles = (await collectFiles(outDir)).filter((file) => extname(file).toLowerCase() === '.html');
    const normalized = toPosix(relativePath);

    for (const htmlFile of htmlFiles) {
        const content = await readFile(htmlFile, 'utf8');

        if (content.includes(`/${normalized}`) || content.includes(normalized)) {
            return true;
        }
    }

    return false;
}

async function buildMappings() {
    const files = await collectFiles(assetsDir);
    const typedFiles = [];

    for (const file of files) {
        typedFiles.push({
            file,
            type: assetType(file),
            oldRelative: toPosix(relative(outDir, file))
        });
    }

    const jsFiles = typedFiles.filter((item) => item.type === 'js');
    const cssFiles = typedFiles.filter((item) => item.type === 'css');
    const mappings = [];

    for (const item of typedFiles) {
        const extension = extname(item.file).toLowerCase();
        let newRelative;

        if (item.type === 'js' || item.type === 'css') {
            const filesOfType = item.type === 'js' ? jsFiles : cssFiles;
            const isMain = filesOfType.length === 1 || await referencedByHtml(item.oldRelative);
            const name = isMain ? 'main' : 'chunk';
            const hash = await contentHash(item.file);
            const directory = item.type === 'js' ? 'js' : 'css';

            newRelative = `assets/${directory}/${name}.${hash}${extension}`;
        } else if (item.type === 'image') {
            newRelative = `assets/images/${basename(item.file)}`;
        } else {
            continue;
        }

        mappings.push({
            source: item.file,
            oldRelative: item.oldRelative,
            newRelative
        });
    }

    return mappings;
}

async function moveAssets(mappings) {
    for (const mapping of mappings) {
        const destination = resolve(outDir, mapping.newRelative);

        await mkdir(dirname(destination), { recursive: true });

        if (existsSync(destination)) {
            const sourceHash = await contentHash(mapping.source);
            const destinationHash = await contentHash(destination);

            if (sourceHash !== destinationHash) {
                throw new Error(`Duplicate generated asset target: ${mapping.newRelative}`);
            }

            await rm(mapping.source);
            continue;
        }

        await rename(mapping.source, destination);
    }
}

function relativeReference(from, to) {
    let value = toPosix(relative(dirname(from), to));

    if (!value.startsWith('.')) {
        value = `./${value}`;
    }

    return value;
}

async function rewriteReferences(mappings) {
    const files = await collectFiles(outDir);
    const reverseMappings = new Map(mappings.map((mapping) => [mapping.newRelative, mapping.oldRelative]));

    for (const file of files) {
        if (!textExtensions.has(extname(file).toLowerCase())) continue;

        const newCurrentRelative = toPosix(relative(outDir, file));
        const oldCurrentRelative = reverseMappings.get(newCurrentRelative) ?? newCurrentRelative;
        let content = await readFile(file, 'utf8');
        const original = content;

        for (const mapping of mappings) {
            content = content.replaceAll(`/${mapping.oldRelative}`, `/${mapping.newRelative}`);
            content = content.replaceAll(mapping.oldRelative, mapping.newRelative);

            const oldReference = relativeReference(oldCurrentRelative, mapping.oldRelative);
            const newReference = relativeReference(newCurrentRelative, mapping.newRelative);

            content = content.replaceAll(oldReference, newReference);
        }

        if (content !== original) {
            await writeFile(file, content, 'utf8');
        }
    }
}

async function removeEmptyDirectories(directory, keepRoot = false) {
    if (!existsSync(directory)) return;

    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isDirectory()) {
            await removeEmptyDirectories(resolve(directory, entry.name));
        }
    }

    if (!keepRoot && (await readdir(directory)).length === 0) {
        await rmdir(directory);
    }
}

async function validateOutput() {
    const files = await collectFiles(outDir);

    for (const file of files) {
        const relativePath = toPosix(relative(outDir, file));
        const extension = extname(file).toLowerCase();
        const fileName = basename(file);

        if (scriptExtensions.has(extension) && !relativePath.startsWith('assets/js/')) {
            throw new Error(`JavaScript file outside assets/js: ${relativePath}`);
        }

        if (extension === '.css' && !relativePath.startsWith('assets/css/')) {
            throw new Error(`CSS file outside assets/css: ${relativePath}`);
        }

        if (imageExtensions.has(extension) && relativePath.startsWith('assets/') && !relativePath.startsWith('assets/images/')) {
            throw new Error(`Generated image outside assets/images: ${relativePath}`);
        }

        if ((scriptExtensions.has(extension) || extension === '.css') && /astro/i.test(fileName)) {
            throw new Error(`Invalid generated bundle name: ${relativePath}`);
        }

        if (scriptExtensions.has(extension) && !/^(main|chunk)\.[a-f0-9]{12}\.(js|mjs)$/.test(fileName)) {
            throw new Error(`Invalid JavaScript bundle name: ${relativePath}`);
        }

        if (extension === '.css' && !/^(main|chunk)\.[a-f0-9]{12}\.css$/.test(fileName)) {
            throw new Error(`Invalid CSS bundle name: ${relativePath}`);
        }
    }
}

await rm(outDir, { recursive: true, force: true });

const { build } = await import('astro');

await build({ root });

const mappings = await buildMappings();

await moveAssets(mappings);
await rewriteReferences(mappings);
await removeEmptyDirectories(outDir, true);
await validateOutput();
