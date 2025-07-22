<div class="admin-card">
    <div class="admin-card__header">
        <h2 class="admin-card__title">Room Availability by Time</h2>
    </div>
    <div class="admin-card__content">
        <div class="admin-tabs" data-tabs="availability-tabs">
            <div class="admin-tabs__header">
                <button class="admin-tabs__button admin-tabs__button--active" data-tab="available" type="button">
                    <span class="admin-tabs__text">Available Slots</span>
                    <span class="admin-tabs__count">{!! $activeAvailability->total() !!}</span>
                </button>
                <button class="admin-tabs__button" data-tab="unavailable" type="button">
                    <span class="admin-tabs__text">Hidden Slots</span>
                    <span class="admin-tabs__count">{!! $inactiveAvailability->total() !!}</span>
                </button>
            </div>

            <div class="admin-tabs__content">
                <div class="admin-tabs__panel admin-tabs__panel--active" data-tab-panel="available">
                    @if($activeAvailability->count() > 0)
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
                            @foreach($activeAvailability as $slot)
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

                        {!! $activeAvailability->links() !!}
                    @else
                        @include('admin.components.empty-availability-state')
                    @endif
                </div>

                <div class="admin-tabs__panel" data-tab-panel="unavailable">
                    @if($inactiveAvailability->count() > 0)
                        <div class="admin-hint">
                            <strong>Hint:</strong> These slots are hidden from clients.
                            You can make them available again by clicking the toggle button.
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
                            @foreach($inactiveAvailability as $slot)
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

                        {!! $inactiveAvailability->links() !!}
                    @else
                        @include('admin.components.empty-availability-state')
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
