<div class="stats-grid">
    @include('admin.components.stat-card', [
        'number' => $stats['callback_requests'],
        'label' => 'Всего заявок на звонок'
    ])

    @include('admin.components.stat-card', [
        'number' => $stats['bookings'],
        'label' => 'Всего бронирований'
    ])

    @include('admin.components.stat-card', [
        'number' => $stats['today_callbacks'],
        'label' => 'Заявок сегодня'
    ])

    @include('admin.components.stat-card', [
        'number' => $stats['today_bookings'],
        'label' => 'Бронирований сегодня'
    ])
</div>
