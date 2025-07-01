document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll('[data-scroll-to]');

    scrollElements.forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();

            const targetValue = element.getAttribute('data-scroll-to');

            if (targetValue) {
                const targetElement = document.querySelector(`[data-scroll-target="${targetValue}"]`);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
