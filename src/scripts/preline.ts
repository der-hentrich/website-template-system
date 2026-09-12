import { HSStaticMethods } from 'preline/non-auto';

function initPreline(): void {
    HSStaticMethods.autoInit();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreline);
} else {
    initPreline();
}

document.addEventListener('astro:page-load', initPreline);