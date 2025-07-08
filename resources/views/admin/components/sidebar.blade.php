<aside class="admin-sidebar">
    <div class="admin-sidebar__title">
        Go Games Admin
    </div>
    <nav class="admin-nav">
        @include('admin.components.nav-item', [
            'route' => 'admin.dashboard',
            'icon' => '📊',
            'text' => 'Dashboard'
        ])

        @include('admin.components.nav-item', [
            'route' => 'admin.callback-requests',
            'icon' => '📞',
            'text' => 'Callback Requests'
        ])

        @include('admin.components.nav-item', [
            'route' => 'admin.bookings',
            'icon' => '🎮',
            'text' => 'Bookings'
        ])

        @include('admin.components.nav-item', [
            'route' => 'admin.available-dates',
            'icon' => '📅',
            'text' => 'Available Dates'
        ])

        @include('admin.components.nav-item', [
            'route' => 'admin.room-availability',
            'icon' => '🏠',
            'text' => 'Room Availability'
        ])

        <a href="{!! route('home') !!}" class="admin-nav__item" target="_blank">
            🌐 To Website
        </a>
    </nav>
</aside>
