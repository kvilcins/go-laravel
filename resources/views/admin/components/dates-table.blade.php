<div class="admin-card">
    <div class="admin-card__header">
        <h2 class="admin-card__title">Available Dates</h2>
    </div>
    <div class="admin-card__content">
        <div class="admin-tabs" data-tabs="dates-tabs">
            <div class="admin-tabs__header">
                <button class="admin-tabs__button admin-tabs__button--active" data-tab="active" type="button">
                    <span class="admin-tabs__text">Active Dates</span>
                    <span class="admin-tabs__count">{!! $activeDatesCount !!}</span>
                </button>
                <button class="admin-tabs__button" data-tab="inactive" type="button">
                    <span class="admin-tabs__text">Past Dates</span>
                    <span class="admin-tabs__count">{!! $inactiveDatesCount !!}</span>
                </button>
            </div>

            <div class="admin-tabs__content">
                <div class="admin-tabs__panel admin-tabs__panel--active" data-tab-panel="active">
                    @if($activeDates->count() > 0)
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
                            @foreach($activeDates as $date)
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

                        {!! $activeDates->links() !!}
                    @else
                        @include('admin.components.empty-state', [
                            'message' => 'No active dates found.'
                        ])
                    @endif
                </div>

                <div class="admin-tabs__panel" data-tab-panel="inactive">
                    @if($inactiveDates->count() > 0)
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
                            @foreach($inactiveDates as $date)
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

                        {!! $inactiveDates->links() !!}
                    @else
                        @include('admin.components.empty-state', [
                            'message' => 'No past dates found.'
                        ])
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
