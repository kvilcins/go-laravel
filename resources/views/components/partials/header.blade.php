<header class="header">
    <div class="container header__container">
        <a class="header__burger" tabindex="0">
            <span class="header__burger-span"></span>
        </a>
        <a href="{!! url('/') !!}" class="header__link">
            <img src="{!! asset('img/icons/logo.svg') !!}" alt="logo" class="header__logo">
        </a>
        <nav class="header__navigation">
            <ul class="header__list">
                <li class="header__item">
                    <a href="#" class="header__link-menu">Залы</a>
                </li>
                <li class="header__item">
                    <a href="#" class="header__link-menu">О нас</a>
                </li>
                <li class="header__item">
                    <a href="#" class="header__link-menu">Бронь</a>
                </li>
                <li class="header__item">
                    <a href="#" class="header__link-menu">Отзывы</a>
                </li>
                <li class="header__item">
                    <a href="#" class="header__link-menu">Контакты</a>
                </li>
            </ul>
        </nav>
        <button type="button" class="header__callback" data-modal-open="callback">Заказать звонок</button>
    </div>
</header>
