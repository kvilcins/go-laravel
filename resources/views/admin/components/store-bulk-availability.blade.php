<div class="admin-card admin-card--spaced">
    <div class="admin-card__header">
        <h2 class="admin-card__title">Bulk Add Slots</h2>
        <p class="admin-card__subtitle">Create all time slots for a room on selected date</p>
    </div>
    <div class="admin-card__content">
        <form action="{!! route('admin.store-bulk-availability') !!}" method="POST" class="bulk-availability-form">
            @csrf
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Room</label>
                    <select name="room_id" class="form-select" required>
                        <option value="">Select Room</option>
                        @foreach($rooms as $id => $label)
                            <option value="{!! $id !!}">{!! $label !!}</option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Date</label>
                    <select name="date_id" class="form-select" required>
                        <option value="">Select Date</option>
                        @foreach($availableDatesForForms as $id => $formatted)
                            <option value="{!! $id !!}">{!! $formatted !!}</option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label form-label--checkbox form-label--checkbox--success">
                        <input type="checkbox" name="is_available" value="1" checked> Available for Booking
                    </label>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Time Slots</label>
                <div class="checkbox-grid">
                    <label class="form-label form-label--checkbox">
                        <input type="checkbox" id="selectAllTimes"> Select All Time Slots
                    </label>
                    @foreach($timeSlots as $id => $label)
                        <label class="form-label form-label--checkbox">
                            <input type="checkbox" name="time_slot_ids[]" value="{!! $id !!}" class="time-slot-checkbox"> {!! $label !!}
                        </label>
                    @endforeach
                </div>
            </div>

            <div class="form-group form-group--actions">
                <button type="submit" class="btn btn--success">Create Selected Slots</button>
            </div>
        </form>
    </div>
</div>
