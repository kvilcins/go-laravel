<div class="stats-grid">
    @include('admin.components.stat-card', [
        'number' => $stats['callback_requests'],
        'label' => 'Total Callback Requests'
    ])

    @include('admin.components.stat-card', [
        'number' => $stats['bookings'],
        'label' => 'Total Bookings'
    ])

    @include('admin.components.stat-card', [
        'number' => $stats['today_callbacks'],
        'label' => 'Requests Today'
    ])

    @include('admin.components.stat-card', [
        'number' => $stats['today_bookings'],
        'label' => 'Bookings Today'
    ])
</div>
