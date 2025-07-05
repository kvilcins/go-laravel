<div class="admin-card admin-card--spaced">
    <div class="admin-card__header">
        <h3 class="admin-card__title">Статистика доступности</h3>
    </div>
    <div class="admin-card__content">
        <div class="admin-stats-grid">
            <div class="admin-stat">
                <div class="admin-stat__number admin-stat__number--success">
                    {{ $availability->where('is_available', true)->count() }}
                </div>
                <div class="admin-stat__label">Доступных слотов</div>
            </div>
            <div class="admin-stat">
                <div class="admin-stat__number admin-stat__number--danger">
                    {{ $availability->where('is_available', false)->count() }}
                </div>
                <div class="admin-stat__label">Скрытых слотов</div>
            </div>
        </div>
    </div>
</div>
