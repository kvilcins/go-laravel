<div class="admin-card">
    <div class="admin-card__header">
        <h2 class="admin-card__title">Доступность комнат по времени</h2>
        <span class="badge badge--success">{{ $availability->total() }} временных слотов</span>
    </div>
    <div class="admin-card__content">
        @if($availability->count() > 0)
            <div class="admin-hint">
                <strong>Подсказка:</strong> Здесь вы можете скрывать/показывать временные слоты для бронирования.
                Скрытые слоты не будут доступны клиентам для выбора.
            </div>

            <table class="admin-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Комната</th>
                    <th>Дата</th>
                    <th>Время</th>
                    <th>Доступность</th>
                    <th>Обновлено</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                @foreach($availability as $slot)
                    <tr>
                        <td>{{ $slot->id }}</td>
                        <td>
                            <strong>{{ $rooms[$slot->room_id] ?? 'Неизвестно' }}</strong>
                        </td>
                        <td>{{ $slot->formatted_date }}</td>
                        <td><strong>{{ $slot->time_label }}</strong></td>
                        <td>
                            @include('admin.components.availability-badge', ['available' => $slot->is_available])
                        </td>
                        <td>{{ \Carbon\Carbon::parse($slot->updated_at)->format('d.m.Y H:i') }}</td>
                        <td>
                            @include('admin.components.toggle-availability-button', ['slot' => $slot])
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>

            {{ $availability->links() }}
        @else
            @include('admin.components.empty-availability-state')
        @endif
    </div>
</div>
