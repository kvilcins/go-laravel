<div class="admin-card">
    <div class="admin-card__header">
        <h2 class="admin-card__title">Доступные даты</h2>
        <span class="badge badge--success">{{ $dates->total() }} дат</span>
    </div>
    <div class="admin-card__content">
        @if($dates->count() > 0)
            <table class="admin-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Дата</th>
                    <th>День недели</th>
                    <th>Статус</th>
                    <th>Создана</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                @foreach($dates as $date)
                    <tr>
                        <td>{{ $date->id }}</td>
                        <td>{{ $date->formatted_date }}</td>
                        <td>{{ $date->day_name }}</td>
                        <td>
                            @include('admin.components.status-badge', [
                                'active' => $date->is_active,
                                'activeText' => 'Активна',
                                'inactiveText' => 'Неактивна'
                            ])
                        </td>
                        <td>{{ \Carbon\Carbon::parse($date->created_at)->format('d.m.Y H:i') }}</td>
                        <td>
                            @include('admin.components.action-buttons', [
                                'toggleRoute' => route('admin.toggle-date', $date->id),
                                'deleteRoute' => route('admin.delete-date', $date->id),
                                'toggleText' => $date->is_active ? 'Деактивировать' : 'Активировать',
                                'confirmText' => 'Удалить эту дату? Это действие нельзя отменить.'
                            ])
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>

            {{ $dates->links() }}
        @else
            @include('admin.components.empty-state', [
                'message' => 'Доступных дат пока нет. Добавьте новые даты выше.'
            ])
        @endif
    </div>
</div>
