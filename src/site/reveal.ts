const main = document.querySelector<HTMLElement>('main');
const sections = Array.from(document.querySelectorAll<HTMLElement>('main section')).slice(1);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealElements = main?.dataset.revealProfile === 'nail-studio'
    ? collectNailStudioRevealElements(main)
    : sections;

function addRevealClass(elements: Iterable<HTMLElement>, variant: string) {
    Array.from(elements).forEach((element) => element.classList.add('reveal', variant));
}

function addStaggeredCards(container: ParentNode, selector: string) {
    container.querySelectorAll<HTMLElement>(selector).forEach((card, index) => {
        card.classList.add('reveal', 'reveal-card');
        card.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 70}ms`);
    });
}

function collectNailStudioRevealElements(container: HTMLElement) {
    addRevealClass(container.querySelectorAll<HTMLElement>('section header'), 'reveal-fade');
    addRevealClass(container.querySelectorAll<HTMLElement>('#nosotros > div > div:first-child, #contacto > div > .grid > div:last-child'), 'reveal-image');
    addRevealClass(container.querySelectorAll<HTMLElement>('#contacto > div > .grid > div:last-child'), 'reveal-image-right');
    addRevealClass(container.querySelectorAll<HTMLElement>('#nail-gallery-items .gallery-item'), 'reveal-zoom');

    addStaggeredCards(container, '#servicios article');
    addStaggeredCards(container, '#testimonios article');
    addStaggeredCards(container, '#nosotros .grid.grid-cols-1.gap-base > div');
    addStaggeredCards(container, '#contacto .grid.grid-cols-1.items-stretch > div');

    return Array.from(container.querySelectorAll<HTMLElement>('.reveal'));
}

if (reducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('reveal', 'is-visible'));
} else {
    revealElements.forEach((element) => element.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px'
    });

    revealElements.forEach((element) => observer.observe(element));
}
