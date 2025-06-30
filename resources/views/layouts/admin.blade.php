<!DOCTYPE html>
<html lang="en">
<meta name="csrf-token" content="{{ csrf_token() }}">

@include('components.partials.head')

<body>

    <div class="admin-layout">
        <aside class="admin-sidebar">
            <div class="admin-sidebar__title">
                Go Games Admin
            </div>
            <nav class="admin-nav">
                <a href="{{ route('admin.dashboard') }}" class="admin-nav__item {{ request()->routeIs('admin.dashboard') ? 'admin-nav__item--active' : '' }}">
                    📊 Дашборд
                </a>
                <a href="{{ route('admin.callback-requests') }}" class="admin-nav__item {{ request()->routeIs('admin.callback-requests') ? 'admin-nav__item--active' : '' }}">
                    📞 Заявки на звонок
                </a>
                <a href="{{ route('admin.bookings') }}" class="admin-nav__item {{ request()->routeIs('admin.bookings') ? 'admin-nav__item--active' : '' }}">
                    🎮 Бронирования
                </a>
                <a href="{{ route('admin.available-dates') }}" class="admin-nav__item {{ request()->routeIs('admin.available-dates') ? 'admin-nav__item--active' : '' }}">
                    📅 Доступные даты
                </a>
                <a href="{{ route('admin.room-availability') }}" class="admin-nav__item {{ request()->routeIs('admin.room-availability') ? 'admin-nav__item--active' : '' }}">
                    🏠 Доступность комнат
                </a>
                <a href="{{ route('home') }}" class="admin-nav__item">
                    🌐 На сайт
                </a>
            </nav>
        </aside>

        <main class="admin-content">
            <div class="admin-header">
                <h1 class="admin-header__title">@yield('title', 'Админ-панель')</h1>
                <div class="admin-header__subtitle">@yield('subtitle', 'Управление контентом')</div>
            </div>

            @if(session('success'))
                <div class="alert alert--success">
                    {{ session('success') }}
                </div>
            @endif

            @yield('content')
    </main>
</div>

</body>
</html>
