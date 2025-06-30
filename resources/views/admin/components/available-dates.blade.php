@extends('layouts.admin')

@section('title', 'Доступные даты')
@section('subtitle', 'Управление доступными для бронирования датами')

@section('content')
    <div class="admin-card" style="margin-bottom: 30px;">
        <div class="admin-card__header">
            <h2 class="admin-card__title">Добавить новую дату</h2>
        </div>
        <div class="admin-card__content">
            <form action="{{ route('admin.store-date') }}" method="POST">
                @csrf
                <div style="display: flex; gap: 15px; align-items: end; flex-wrap: wrap;">
                    <div class="form-group" style="margin-bottom: 0; min-width: 200px;">
                        <label class="form-label">Дата</label>
                        <input type="date" name="date" class="form-input" required min="{{ date('Y-m-d') }}">
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label" style="display: flex; align-items: center; gap: 5px;">
                            <input type="checkbox" name="is_active" value="1" checked> Активна
                        </label>
                    </div>
                    <button type="submit" class="btn btn--primary">Добавить дату</button>
                </div>
            </form>
        </div>
    </div>

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
                                @if($date->is_active)
                                    <span class="badge badge--success">Активна</span>
                                @else
                                    <span class="badge badge--danger">Неактивна</span>
                                @endif
                            </td>
                            <td>{{ \Carbon\Carbon::parse($date->created_at)->format('d.m.Y H:i') }}</td>
                            <td>
                                <form action="{{ route('admin.toggle-date', $date->id) }}"
                                      method="POST"
                                      style="display: inline; margin-right: 5px;">
                                    @csrf
                                    @method('PATCH')
                                    <button type="submit" class="btn btn--secondary btn--small">
                                        {{ $date->is_active ? 'Деактивировать' : 'Активировать' }}
                                    </button>
                                </form>
                                <form action="{{ route('admin.delete-date', $date->id) }}"
                                      method="POST"
                                      style="display: inline;"
                                      data-confirm="Удалить эту дату? Это действие нельзя отменить.">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn--danger btn--small">
                                        Удалить
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>

                {{ $dates->links() }}
            @else
                <p>Доступных дат пока нет. Добавьте новые даты выше.</p>
            @endif
        </div>
    </div>
@endsection
