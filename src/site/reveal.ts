const sections = Array.from(document.querySelectorAll<HTMLElement>('main section')).slice(1);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reducedMotion || !('IntersectionObserver' in window)) {
    sections.forEach((section) => section.classList.add('reveal', 'is-visible'));
} else {
    sections.forEach((section) => section.classList.add('reveal'));

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

    sections.forEach((section) => observer.observe(section));
}