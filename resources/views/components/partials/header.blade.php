<header class="header">
    <div class="container header__container">
        <a class="header__burger burger" tabindex="0">
            <span class="burger__span"></span>
        </a>
        <a href="{{ url('/') }}" class="header__link">
            <img src="{{ asset('img/icons/logo.svg') }}" alt="logo" class="header__logo">
        </a>
        <nav class="header__navigation">
            <ul class="header__list menu-list">
                <li class="menu-list__item menu-item">
                    <a href="#" class="menu-item__link">Залы</a>
                </li>
                <li class="menu-list__item menu-item">
                    <a href="#" class="menu-item__link">О нас</a>
                </li>
                <li class="menu-list__item menu-item">
                    <a href="#" class="menu-item__link">Бронь</a>
                </li>
                <li class="menu-list__item menu-item">
                    <a href="#" class="menu-item__link">Отзывы</a>
                </li>
                <li class="menu-list__item menu-item">
                    <a href="#" class="menu-item__link">Контакты</a>
                </li>
            </ul>
        </nav>
        <button type="button" class="header__callback">Заказать звонок</button>
    </div>
</header>
