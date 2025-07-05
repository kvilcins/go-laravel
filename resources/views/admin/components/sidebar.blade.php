<aside class="admin-sidebar">
    <div class="admin-sidebar__title">
        Go Games Admin
    </div>
    <nav class="admin-nav">
        @include('admin.components.nav-item', [
            'route' => 'admin.dashboard',
            'icon' => '📊',
            'text' => 'Дашборд'
        ])

        @include('admin.components.nav-item', [
            'route' => 'admin.callback-requests',
            'icon' => '📞',
            'text' => 'Заявки на звонок'
        ])

        @include('admin.components.nav-item', [
            'route' => 'admin.bookings',
            'icon' => '🎮',
            'text' => 'Бронирования'
        ])

        @include('admin.components.nav-item', [
            'route' => 'admin.available-dates',
            'icon' => '📅',
            'text' => 'Доступные даты'
        ])

        @include('admin.components.nav-item', [
            'route' => 'admin.room-availability',
            'icon' => '🏠',
            'text' => 'Доступность комнат'
        ])

        <a href="{{ route('home') }}" class="admin-nav__item" target="_blank">
            🌐 На сайт
        </a>
    </nav>
</aside>
