<div class="admin-card admin-card--spaced">
    <div class="admin-card__header">
        <h2 class="admin-card__title">Массовое добавление слотов</h2>
        <p class="admin-card__subtitle">Создать все временные слоты для комнаты на выбранную дату</p>
    </div>
    <div class="admin-card__content">
        <form action="{{ route('admin.store-bulk-availability') }}" method="POST" class="bulk-availability-form">
            @csrf
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Комната</label>
                    <select name="room_id" class="form-select" required>
                        <option value="">Выберите комнату</option>
                        @foreach($rooms as $id => $label)
                            <option value="{{ $id }}">{{ $label }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Дата</label>
                    <select name="date_id" class="form-select" required>
                        <option value="">Выберите дату</option>
                        @foreach($availableDatesForForms as $id => $formatted)
                            <option value="{{ $id }}">{{ $formatted }}</option>
                        @endforeach
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Временные слоты</label>
                <div class="checkbox-grid">
                    <label class="form-label form-label--checkbox">
                        <input type="checkbox" id="selectAllTimes"> Выбрать все
                    </label>
                    @foreach($timeSlots as $id => $label)
                        <label class="form-label form-label--checkbox">
                            <input type="checkbox" name="time_slot_ids[]" value="{{ $id }}" class="time-slot-checkbox"> {{ $label }}
                        </label>
                    @endforeach
                </div>
            </div>

            <div class="form-group">
                <label class="form-label form-label--checkbox">
                    <input type="checkbox" name="is_available" value="1" checked> Доступно для бронирования
                </label>
            </div>

            <div class="form-group form-group--actions">
                <button type="submit" class="btn btn--success">Создать выбранные слоты</button>
            </div>
        </form>
    </div>
</div>
