<div class="admin-card">
    <div class="admin-card__header">
        <h2 class="admin-card__title">Быстрые действия</h2>
    </div>
    <div class="admin-card__content">
        <a href="{{ route('admin.callback-requests') }}" class="btn btn--primary admin-card__btn">
            Просмотреть заявки на звонок
        </a>
        <a href="{{ route('admin.bookings') }}" class="btn btn--primary admin-card__btn">
            Просмотреть бронирования
        </a>
        <a href="{{ route('admin.store-date') }}" class="btn btn--success">
            Добавить новую дату
        </a>
    </div>
</div>
