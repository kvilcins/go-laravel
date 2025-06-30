@extends('layouts.admin')

@section('title', 'Бронирования')
@section('subtitle', 'Управление бронированиями игровых залов')

@section('content')
    <div class="admin-card">
        <div class="admin-card__header">
            <h2 class="admin-card__title">Бронирования</h2>
            <span class="badge badge--success">{{ $bookings->total() }} бронирований</span>
        </div>
        <div class="admin-card__content">
            @if($bookings->count() > 0)
                <table class="admin-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Комната</th>
                        <th>Дата</th>
                        <th>Время</th>
                        <th>Гостей</th>
                        <th>Имя</th>
                        <th>Телефон</th>
                        <th>Email</th>
                        <th>Создано</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach($bookings as $booking)
                        <tr>
                            <td>{{ $booking->id }}</td>
                            <td>{{ $rooms[$booking->room_id] ?? 'Неизвестно' }}</td>
                            <td>{{ \Carbon\Carbon::parse($booking->date)->format('d.m.Y') }}</td>
                            <td>{{ $booking->time }}</td>
                            <td>{{ $booking->amount }}</td>
                            <td>{{ $booking->first_name }} {{ $booking->last_name }}</td>
                            <td>{{ $booking->phone }}</td>
                            <td>{{ $booking->email ?? '-' }}</td>
                            <td>{{ \Carbon\Carbon::parse($booking->created_at)->format('d.m.Y H:i') }}</td>
                            <td>
                                <form action="{{ route('admin.delete-booking', $booking->id) }}"
                                      method="POST"
                                      style="display: inline;"
                                      data-confirm="Удалить это бронирование?">
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

                {{ $bookings->links() }}
            @else
                <p>Бронирований пока нет.</p>
            @endif
        </div>
    </div>
@endsection
