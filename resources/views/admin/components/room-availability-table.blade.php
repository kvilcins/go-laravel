<div class="admin-card">
    <div class="admin-card__header">
        <h2 class="admin-card__title">Room Availability by Time</h2>
        <span class="badge badge--success">{!! $availability->total() !!} time slots</span>
    </div>
    <div class="admin-card__content">
        @if($availability->count() > 0)
            <div class="admin-hint">
                <strong>Hint:</strong> Here you can hide/show time slots for booking.
                Hidden slots will not be available for clients to select.
            </div>

            <table class="admin-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Room</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Availability</th>
                    <th>Updated</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                @foreach($availability as $slot)
                    <tr>
                        <td>{!! get_data($slot, 'id') !!}</td>
                        <td>
                            <strong>{!! get_data($rooms, $slot->room_id, 'Unknown') !!}</strong>
                        </td>
                        <td>{!! get_data($slot, 'formatted_date') !!}</td>
                        <td><strong>{!! get_data($slot, 'time_label') !!}</strong></td>
                        <td>
                            @include('admin.components.availability-badge', ['available' => $slot->is_available])
                        </td>
                        <td>{!! \Carbon\Carbon::parse($slot->updated_at)->format('d.m.Y H:i') !!}</td>
                        <td>
                            @include('admin.components.toggle-availability-button', ['slot' => $slot])
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>

            {!! $availability->links() !!}
        @else
            @include('admin.components.empty-availability-state')
        @endif
    </div>
</div>
