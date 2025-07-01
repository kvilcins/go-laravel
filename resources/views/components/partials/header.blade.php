<header class="header">
    <div class="container header__container">
        <a href="{!! url('/') !!}" class="header__link">
            <img src="{!! asset('img/icons/logo.svg') !!}" alt="logo" class="header__logo">
        </a>
        <nav class="header__navigation">
            <ul class="header__list">
                <li class="header__item" data-scroll-to="rooms">
                    Залы
                </li>
                <li class="header__item" data-scroll-to="about-us">
                    О нас
                </li>
                <li class="header__item" data-scroll-to="booking">
                    Бронь
                </li>
                <li class="header__item" data-scroll-to="feedbacks">
                    Отзывы
                </li>
                <li class="header__item" data-scroll-to="footer">
                    Контакты
                </li>
            </ul>
        </nav>
        <button type="button" class="header__callback" data-modal-open="callback">Заказать звонок</button>

        <button class="header__burger burger" id="burger-toggle" aria-label="Open menu">
            <span class="burger__line"></span>
            <span class="burger__line"></span>
            <span class="burger__line"></span>
        </button>

        <div class="header__mobile-menu mobile-menu hidden" id="mobile-menu">

            <button class="mobile-menu__close" id="mobile-menu-close" aria-label="Close menu">
                &times;
            </button>

            <nav class="header__navigation">
                <ul class="header__list">
                    <li class="header__item" data-scroll-to="rooms">
                        Залы
                    </li>
                    <li class="header__item" data-scroll-to="about-us">
                        О нас
                    </li>
                    <li class="header__item" data-scroll-to="booking">
                        Бронь
                    </li>
                    <li class="header__item" data-scroll-to="feedbacks">
                        Отзывы
                    </li>
                    <li class="header__item" data-scroll-to="footer">
                        Контакты
                    </li>
                </ul>
            </nav>

        </div>
    </div>
</header>
