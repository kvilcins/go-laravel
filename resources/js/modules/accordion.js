document.addEventListener('DOMContentLoaded', () => {
    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq__item');

        if (!faqItems.length) return;

        const closeAllExcept = (exceptItem) => {
            faqItems.forEach(item => {
                if (item !== exceptItem) {
                    item.classList.remove('faq__item--active');
                }
            });
        };

        const toggleItem = (item) => {
            const isActive = item.classList.contains('faq__item--active');

            if (isActive) {
                item.classList.remove('faq__item--active');
            } else {
                closeAllExcept(item);
                item.classList.add('faq__item--active');
            }
        };

        faqItems.forEach(item => {
            const button = item.querySelector('.faq__button');

            if (button) {
                button.addEventListener('click', () => {
                    toggleItem(item);
                });

                button.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleItem(item);
                    }
                });
            }
        });

        if (faqItems.length > 0) {
            faqItems[0].classList.add('faq__item--active');
        }
    };

    initFaqAccordion();
});
