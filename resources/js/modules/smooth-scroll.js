document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll('[data-scroll-to]');

    if (scrollElements.length > 0) {
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
    }
});
