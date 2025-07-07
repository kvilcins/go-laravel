<div class="admin-card admin-card--spaced">
    <div class="admin-card__header">
        <h2 class="admin-card__title">Фильтры</h2>
        <button type="button" class="btn btn--secondary btn--small" id="clearFilters">
            Очистить фильтры
        </button>
    </div>
    <div class="admin-card__content">
        <form action="{{ route('admin.room-availability') }}" method="GET" class="filters-form admin-filters-form">
            <div class="filters-row">
                <div class="form-group">
                    <label class="form-label">Комната</label>
                    <select name="room_id" class="form-select admin-room-filter">
                        <option value="">Все комнаты</option>
                        @foreach($rooms as $id => $label)
                            <option value="{{ $id }}" {{ ($filters['room_id'] ?? '') == $id ? 'selected' : '' }}>
                                {{ $label }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Дата</label>
                    <select name="admin_date" class="form-select admin-date-filter">
                        <option value="">Все даты</option>
                        @foreach($availableDates as $date => $formatted)
                            <option value="{{ $date }}" {{ ($filters['date'] ?? '') == $date ? 'selected' : '' }}>
                                {{ $formatted }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Время</label>
                    <select name="admin_time_slot_id" class="form-select admin-time-filter" data-admin-filter="true">
                        <option value="">Все времена</option>
                        @foreach($timeSlots as $id => $label)
                            <option value="{{ $id }}" {{ ($filters['time_slot_id'] ?? '') == $id ? 'selected' : '' }}>
                                {{ $label }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Доступность</label>
                    <select name="availability" class="form-select admin-availability-filter">
                        <option value="">Все</option>
                        <option value="1" {{ ($filters['availability'] ?? '') === '1' ? 'selected' : '' }}>Доступно</option>
                        <option value="0" {{ ($filters['availability'] ?? '') === '0' ? 'selected' : '' }}>Недоступно</option>
                    </select>
                </div>

                <div class="form-group form-group--actions">
                    <button type="submit" class="btn btn--primary">Применить фильтры</button>
                </div>
            </div>
        </form>
    </div>
</div>
