<div class="admin-card admin-card--spaced">
    <div class="admin-card__header">
        <h2 class="admin-card__title">Add New Availability Slot</h2>
    </div>
    <div class="admin-card__content">
        <form action="{!! route('admin.store-room-availability') !!}" method="POST" class="availability-form">
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
                    <label class="form-label">Time</label>
                    <select name="time_slot_id" class="form-select" required>
                        <option value="">Select Time</option>
                        @foreach($timeSlots as $id => $label)
                            <option value="{!! $id !!}">{!! $label !!}</option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label form-label--checkbox">
                        <input type="checkbox" name="is_available" value="1" checked> Available for Booking
                    </label>
                </div>

                <div class="form-group form-group--actions">
                    <button type="submit" class="btn btn--success">Add Slot</button>
                </div>
            </div>
        </form>
    </div>
</div>
