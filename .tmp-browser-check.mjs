import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const [template, outputDirName] = process.argv.slice(2);
const outputDir = resolve(outputDirName);
await mkdir(outputDir, { recursive: true });

function rgb(value) {
    const channels = value.match(/[\d.]+/g)?.slice(0, 3).map(Number);
    return channels?.length === 3 ? channels : null;
}

function luminance(value) {
    const channels = rgb(value);
    if (!channels) return null;
    const normalized = channels.map((channel) => {
        const level = channel / 255;
        return level <= 0.04045 ? level / 12.92 : ((level + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * normalized[0] + 0.7152 * normalized[1] + 0.0722 * normalized[2];
}

function contrast(foreground, background) {
    const first = luminance(foreground);
    const second = luminance(background);
    if (first === null || second === null) return null;
    return Number(((Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)).toFixed(2));
}

async function inspect(viewport, label) {
    const browser = await chromium.launch({
        headless: true,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
    const page = await browser.newPage({ viewport });
    await page.goto('http://localhost:4321/es/', { waitUntil: 'networkidle' });

    const selector = '[class~="border-2"][class~="border-primary"]';
    const candidates = page.locator(selector);
    const buttons = [];

    for (let index = 0; index < await candidates.count(); index += 1) {
        const button = candidates.nth(index);
        if (!await button.isVisible()) continue;
        await button.scrollIntoViewIfNeeded();

        const text = (await button.innerText()).trim() || await button.getAttribute('aria-label') || '(icon)';
        const readState = async () => button.evaluate((element) => {
            const style = getComputedStyle(element);
            let parent = element.parentElement;
            let adjacentBackground = 'rgba(0, 0, 0, 0)';
            while (parent) {
                adjacentBackground = getComputedStyle(parent).backgroundColor;
                if (adjacentBackground !== 'rgba(0, 0, 0, 0)') break;
                parent = parent.parentElement;
            }
            return {
                color: style.color,
                background: style.backgroundColor,
                border: style.borderTopColor,
                borderWidth: style.borderTopWidth,
                boxShadow: style.boxShadow,
                adjacentBackground
            };
        });

        const base = await readState();
        await button.hover();
        await page.waitForTimeout(250);
        const hover = await readState();
        await page.mouse.move(0, 0);
        await page.waitForTimeout(250);
        const box = await button.boundingBox();
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.mouse.down();
            await page.waitForTimeout(250);
        }
        const active = await readState();
        if (box) await page.mouse.up();
        await page.mouse.move(0, 0);
        await page.waitForTimeout(250);
        await page.keyboard.press('Tab');
        await button.focus();
        await page.waitForTimeout(250);
        const focus = await readState();

        buttons.push({
            text,
            base: {
                ...base,
                textContrast: contrast(base.color, base.background),
                componentContrast: contrast(base.border, base.adjacentBackground)
            },
            hover: { ...hover, textContrast: contrast(hover.color, hover.background) },
            active: { ...active, textContrast: contrast(active.color, active.background) },
            focus
        });
    }

    await page.goto('http://localhost:4321/es/', { waitUntil: 'networkidle' });
    const representative = page.locator(selector).filter({ visible: true }).first();
    await representative.scrollIntoViewIfNeeded();
    await page.keyboard.press('Tab');
    await representative.focus();
    await page.waitForTimeout(250);
    await page.screenshot({ path: resolve(outputDir, `${template}-${label}.png`), type: 'png' });

    await browser.close();
    return { template, label, viewport, count: buttons.length, buttons };
}

const results = [
    await inspect({ width: 1440, height: 1000 }, 'desktop'),
    await inspect({ width: 390, height: 844 }, 'mobile')
];

console.log(JSON.stringify(results, null, 2));
