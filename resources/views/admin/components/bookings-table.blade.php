<div class="admin-card">
    <div class="admin-card__header">
        <h2 class="admin-card__title">Bookings</h2>
        <span class="badge badge--success">{!! $bookings->total() !!} bookings</span>
    </div>
    <div class="admin-card__content">
        @if($bookings->count() > 0)
            <table class="admin-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Room</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Guests</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Entertainments</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                @foreach($bookings as $booking)
                    <tr>
                        <td>{!! get_data($booking, 'id') !!}</td>
                        <td>{!! get_data($rooms, $booking->room_id, 'Unknown') !!}</td>
                        <td>{!! \Carbon\Carbon::parse($booking->date)->format('d.m.Y') !!}</td>
                        <td>{!! get_data($booking, 'time') !!}</td>
                        <td>{!! get_data($booking, 'amount') !!}</td>
                        <td>{!! get_data($booking, 'first_name') !!} {!! get_data($booking, 'last_name') !!}</td>
                        <td>{!! get_data($booking, 'phone') !!}</td>
                        <td>{!! get_data($booking, 'email', '-') !!}</td>
                        <td class="admin-table__entertainment-cell">
                            @if(isset($bookingEntertainments[$booking->id]) && !empty($bookingEntertainments[$booking->id]))
                                @foreach($bookingEntertainments[$booking->id] as $entertainmentId)
                                    <span class="entertainment-tag">
                                        {!! get_data($entertainments, $entertainmentId, 'Unknown') !!}
                                    </span>
                                @endforeach
                            @else
                                <span class="entertainment-tag entertainment-tag--empty">No entertainment</span>
                            @endif
                        </td>
                        <td>{!! \Carbon\Carbon::parse($booking->created_at)->format('d.m.Y H:i') !!}</td>
                        <td>
                            @include('admin.components.delete-button', [
                                'route' => route('admin.delete-booking', $booking->id),
                                'confirmText' => 'Delete this booking?'
                            ])
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>

            {!! $bookings->links() !!}
        @else
            @include('admin.components.empty-state', [
                'message' => 'No bookings yet.'
            ])
        @endif
    </div>
</div>
