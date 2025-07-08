<div class="admin-card">
    <div class="admin-card__header">
        <h2 class="admin-card__title">Available Dates</h2>
        <span class="badge badge--success">{!! $dates->total() !!} dates</span>
    </div>
    <div class="admin-card__content">
        @if($dates->count() > 0)
            <table class="admin-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Day of Week</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                @foreach($dates as $date)
                    <tr>
                        <td>{!! get_data($date, 'id') !!}</td>
                        <td>{!! get_data($date, 'formatted_date') !!}</td>
                        <td>{!! get_data($date, 'day_name') !!}</td>
                        <td>
                            @include('admin.components.status-badge', [
                                'active' => $date->is_active,
                                'activeText' => 'Active',
                                'inactiveText' => 'Inactive'
                            ])
                        </td>
                        <td>{!! \Carbon\Carbon::parse($date->created_at)->format('d.m.Y H:i') !!}</td>
                        <td>
                            @include('admin.components.action-buttons', [
                                'toggleRoute' => route('admin.toggle-date', $date->id),
                                'deleteRoute' => route('admin.delete-date', $date->id),
                                'toggleText' => $date->is_active ? 'Deactivate' : 'Activate',
                                'confirmText' => 'Delete this date? This action cannot be undone.'
                            ])
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>

            {!! $dates->links() !!}
        @else
            @include('admin.components.empty-state', [
                'message' => 'No available dates yet. Add new dates above.'
            ])
        @endif
    </div>
</div>
