document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 100 && currentScroll > lastScroll) {
            header.classList.add('header--fixed');
        } else if (currentScroll < 100) {
            header.classList.remove('header--fixed');
        }

        lastScroll = currentScroll;
    });
});
