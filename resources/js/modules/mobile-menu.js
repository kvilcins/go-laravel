document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('mobile-menu-close');

    const openMenu = () => {
        mobileMenu.classList.remove('hidden');
        setTimeout(() => mobileMenu.classList.add('open'), 10);
        burger.classList.remove('burger-behind');
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        burger.classList.add('burger-behind');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
            burger.classList.remove('burger-behind');
        }, 300);
    };

    burger?.addEventListener('click', openMenu);
    closeBtn?.addEventListener('click', closeMenu);

    document.addEventListener('click', e => {
        if (
            mobileMenu.classList.contains('open') &&
            !mobileMenu.contains(e.target) &&
            !burger.contains(e.target)
        ) {
            closeMenu();
        }
    });
});
