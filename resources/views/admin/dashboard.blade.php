@extends('layouts.admin')

@section('title', 'Дашборд')
@section('subtitle', 'Общая статистика')

@section('content')
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-card__number">{{ $stats['callback_requests'] }}</div>
            <div class="stat-card__label">Всего заявок на звонок</div>
        </div>
        <div class="stat-card">
            <div class="stat-card__number">{{ $stats['bookings'] }}</div>
            <div class="stat-card__label">Всего бронирований</div>
        </div>
        <div class="stat-card">
            <div class="stat-card__number">{{ $stats['today_callbacks'] }}</div>
            <div class="stat-card__label">Заявок сегодня</div>
        </div>
        <div class="stat-card">
            <div class="stat-card__number">{{ $stats['today_bookings'] }}</div>
            <div class="stat-card__label">Бронирований сегодня</div>
        </div>
    </div>

    <div class="admin-card">
        <div class="admin-card__header">
            <h2 class="admin-card__title">Быстрые действия</h2>
        </div>
        <div class="admin-card__content">
            <a href="{{ route('admin.callback-requests') }}" class="btn btn--primary" style="margin-right: 10px;">
                Просмотреть заявки на звонок
            </a>
            <a href="{{ route('admin.bookings') }}" class="btn btn--primary" style="margin-right: 10px;">
                Просмотреть бронирования
            </a>
            <a href="{{ route('admin.store-date') }}" class="btn btn--success">
                Добавить новую дату
            </a>
        </div>
    </div>
@endsection
