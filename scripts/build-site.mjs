import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rename, rm, rmdir, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const siteTarget = process.argv[2] ?? 'hotel/demo';
const siteUrl = process.argv[3]?.trim();
const targetParts = siteTarget.split('/');
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.ico']);
const textExtensions = new Set(['.html', '.css', '.js', '.mjs', '.xml', '.txt', '.json']);

if (targetParts.length !== 2 || targetParts.some((part) => !part || part === '.' || part === '..')) {
    throw new Error(`Invalid site target "${siteTarget}". Expected "<template>/<site>", for example "hotel/demo".`);
}

const dataFile = resolve(root, 'src/data', ...targetParts, 'data.json');
const outDir = resolve(root, 'dist', ...targetParts);
const rawAssetsDir = resolve(outDir, 'assets', 'raw');

if (!existsSync(dataFile)) {
    throw new Error(`Site data not found: ${dataFile}`);
}

process.env.SITE_TARGET = siteTarget;

if (siteUrl) {
    process.env.SITE_URL = siteUrl;
} else {
    delete process.env.SITE_URL;
}

function toPosix(path) {
    return path.replaceAll('\\', '/');
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

function getAssetType(fileName) {
    const extension = extname(fileName).toLowerCase();

    if (extension === '.css') return 'css';
    if (extension === '.js' || extension === '.mjs') return 'js';
    if (imageExtensions.has(extension)) return 'image';

    return 'other';
}

function normalizeGeneratedName(fileName, type) {
    if (type !== 'js' && type !== 'css') return fileName;

    const extension = extname(fileName);
    const stem = basename(fileName, extension);
    const hashSeparator = stem.lastIndexOf('.');

    let name = hashSeparator === -1 ? stem : stem.substring(0, hashSeparator);
    const hash = hashSeparator === -1 ? null : stem.substring(hashSeparator + 1);

    if (type === 'js' && /Layout\.astro_astro_type_script_index_0_lang/i.test(name)) {
        name = 'preline';
    } else {
        name = name
            .replace(/\.astro.*$/i, '')
            .replace(/astro/gi, '')
            .replace(/[^a-zA-Z0-9._-]+/g, '-')
            .replace(/^[-._]+|[-._]+$/g, '');
    }

    if (!name) name = type === 'js' ? 'script' : 'style';

    return hash ? `${name}.${hash}${extension}` : `${name}${extension}`;
}

async function reorganizeAssets() {
    const sourceFiles = await collectFiles(rawAssetsDir);
    const mappings = [];

    for (const sourcePath of sourceFiles) {
        const originalName = basename(sourcePath);
        const type = getAssetType(originalName);
        const targetName = normalizeGeneratedName(originalName, type);

        let targetRelative;

        if (type === 'image') {
            targetRelative = `assets/images/${targetName}`;
        } else if (type === 'css') {
            targetRelative = `assets/css/${targetName}`;
        } else if (type === 'js') {
            targetRelative = `assets/js/${targetName}`;
        } else {
            targetRelative = `assets/${targetName}`;
        }

        const oldRelative = toPosix(relative(outDir, sourcePath));
        const targetPath = resolve(outDir, targetRelative);

        await mkdir(dirname(targetPath), { recursive: true });

        if (existsSync(targetPath)) {
            throw new Error(`Duplicate generated asset target: ${targetRelative}`);
        }

        await rename(sourcePath, targetPath);

        mappings.push({
            oldRelative,
            newRelative: toPosix(targetRelative)
        });
    }

    await rm(rawAssetsDir, { recursive: true, force: true });

    const outputFiles = await collectFiles(outDir);

    for (const file of outputFiles) {
        if (!textExtensions.has(extname(file).toLowerCase())) continue;

        let content = await readFile(file, 'utf8');
        const originalContent = content;

        for (const mapping of mappings) {
            content = content.replaceAll(`/${mapping.oldRelative}`, `/${mapping.newRelative}`);
            content = content.replaceAll(mapping.oldRelative, mapping.newRelative);
        }

        if (content !== originalContent) {
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
    const outputFiles = await collectFiles(outDir);

    const invalidAsset = outputFiles.find((file) => {
        const relativePath = toPosix(relative(outDir, file));
        const extension = extname(file).toLowerCase();

        return relativePath.startsWith('assets/images/') && (extension === '.js' || extension === '.mjs' || extension === '.css');
    });

    if (invalidAsset) {
        throw new Error(`Invalid asset location: ${toPosix(relative(outDir, invalidAsset))}`);
    }

    const invalidName = outputFiles.find((file) => /_astro|astro_type_script/i.test(toPosix(relative(outDir, file))));

    if (invalidName) {
        throw new Error(`Invalid generated filename: ${toPosix(relative(outDir, invalidName))}`);
    }
}

await rm(outDir, { recursive: true, force: true });

const { build } = await import('astro');

await build({ root });
await reorganizeAssets();
await removeEmptyDirectories(outDir, true);
await validateOutput();