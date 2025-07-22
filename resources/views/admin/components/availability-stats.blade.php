<div class="admin-card admin-card--spaced">
    <div class="admin-card__header">
        <h3 class="admin-card__title">Availability Statistics</h3>
    </div>
    <div class="admin-card__content">
        <div class="admin-stats-grid">
            <div class="admin-stat">
                <div class="admin-stat__number admin-stat__number--success">
                    {!! $activeAvailability->total() !!}
                </div>
                <div class="admin-stat__label">Available Slots</div>
            </div>
            <div class="admin-stat">
                <div class="admin-stat__number admin-stat__number--danger">
                    {!! $inactiveAvailability->total() !!}
                </div>
                <div class="admin-stat__label">Hidden Slots</div>
            </div>
            <div class="admin-stat">
                <div class="admin-stat__number admin-stat__number--primary">
                    {!! $activeAvailability->total() + $inactiveAvailability->total() !!}
                </div>
                <div class="admin-stat__label">Total Slots</div>
            </div>
        </div>
    </div>
</div>
