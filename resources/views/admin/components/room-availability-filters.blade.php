<div class="admin-card admin-card--spaced">
    <div class="admin-card__header">
        <h2 class="admin-card__title">Filters</h2>
        <button type="button" class="btn btn--secondary btn--small" id="clearFilters">
            Clear Filters
        </button>
    </div>
    <div class="admin-card__content">
        <form action="{!! route('admin.room-availability') !!}" method="GET" class="filters-form admin-filters-form">
            <div class="filters-row">
                <div class="form-group">
                    <label class="form-label">Room</label>
                    <select name="room_id" class="form-select admin-room-filter">
                        <option value="">All Rooms</option>
                        @foreach($rooms as $id => $label)
                            <option value="{!! $id !!}" {!! (get_data($filters, 'room_id', '') == $id) ? 'selected' : '' !!}>
                                {!! $label !!}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Date</label>
                    <select name="admin_date" class="form-select admin-date-filter">
                        <option value="">All Dates</option>
                        @foreach($availableDates as $date => $formatted)
                            <option value="{!! $date !!}" {!! (get_data($filters, 'date', '') == $date) ? 'selected' : '' !!}>
                                {!! $formatted !!}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Time</label>
                    <select name="admin_time_slot_id" class="form-select admin-time-filter" data-admin-filter="true">
                        <option value="">All Times</option>
                        @foreach($timeSlots as $id => $label)
                            <option value="{!! $id !!}" {!! (get_data($filters, 'time_slot_id', '') == $id) ? 'selected' : '' !!}>
                                {!! $label !!}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Availability</label>
                    <select name="availability" class="form-select admin-availability-filter">
                        <option value="">All</option>
                        <option value="1" {!! (get_data($filters, 'availability', '') === '1') ? 'selected' : '' !!}>Available</option>
                        <option value="0" {!! (get_data($filters, 'availability', '') === '0') ? 'selected' : '' !!}>Unavailable</option>
                    </select>
                </div>

                <div class="form-group form-group--actions">
                    <button type="submit" class="btn btn--primary">Apply Filters</button>
                </div>
            </div>
        </form>
    </div>
</div>
