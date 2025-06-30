@extends('layouts.admin')

@section('title', 'Доступность комнат')
@section('subtitle', 'Управление временными слотами для каждой комнаты')

@section('content')
    <div class="admin-card">
        <div class="admin-card__header">
            <h2 class="admin-card__title">Доступность комнат по времени</h2>
            <span class="badge badge--success">{{ $availability->total() }} временных слотов</span>
        </div>
        <div class="admin-card__content">
            @if($availability->count() > 0)
                <div style="margin-bottom: 20px; font-size: 14px; color: #666;">
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
                                @if($slot->is_available)
                                    <span class="badge badge--success">✅ Доступно</span>
                                @else
                                    <span class="badge badge--danger">❌ Скрыто</span>
                                @endif
                            </td>
                            <td>{{ \Carbon\Carbon::parse($slot->updated_at)->format('d.m.Y H:i') }}</td>
                            <td>
                                <form action="{{ route('admin.toggle-room-availability', $slot->id) }}"
                                      method="POST"
                                      style="display: inline;">
                                    @csrf
                                    @method('PATCH')
                                    <button type="submit" class="btn {{ $slot->is_available ? 'btn--danger' : 'btn--success' }} btn--small">
                                        {{ $slot->is_available ? '🚫 Скрыть' : '✅ Показать' }}
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>

                {{ $availability->links() }}
            @else
                <div style="text-align: center; padding: 40px;">
                    <p style="margin-bottom: 15px;">Данных о доступности комнат нет.</p>
                    <p style="color: #666; font-size: 14px;">
                        Убедитесь, что добавлены доступные даты и настроены временные слоты в базе данных.
                    </p>
                </div>
            @endif
        </div>
    </div>

    @if($availability->count() > 0)
        <div class="admin-card" style="margin-top: 20px;">
            <div class="admin-card__header">
                <h3 class="admin-card__title">Статистика доступности</h3>
            </div>
            <div class="admin-card__content">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: #28a745;">
                            {{ $availability->where('is_available', true)->count() }}
                        </div>
                        <div style="font-size: 14px; color: #666;">Доступных слотов</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: #dc3545;">
                            {{ $availability->where('is_available', false)->count() }}
                        </div>
                        <div style="font-size: 14px; color: #666;">Скрытых слотов</div>
                    </div>
                </div>
            </div>
        </div>
    @endif
@endsection
