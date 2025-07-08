<div class="admin-card">
    <div class="admin-card__header">
        <h2 class="admin-card__title">Callback Requests</h2>
        <span class="badge badge--success">{!! $requests->total() !!} requests</span>
    </div>
    <div class="admin-card__content">
        @if($requests->count() > 0)
            <table class="admin-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                @foreach($requests as $request)
                    <tr>
                        <td>{!! get_data($request, 'id') !!}</td>
                        <td>{!! get_data($request, 'name') !!}</td>
                        <td>{!! get_data($request, 'phone') !!}</td>
                        <td>{!! get_data($request, 'email', '-') !!}</td>
                        <td title="{!! get_data($request, 'message') !!}">
                            {!! Str::limit(get_data($request, 'message', '-'), 50) !!}
                        </td>
                        <td>{!! \Carbon\Carbon::parse($request->created_at)->format('d.m.Y H:i') !!}</td>
                        <td>
                            @include('admin.components.delete-button', [
                                'route' => route('admin.delete-callback', $request->id),
                                'confirmText' => 'Delete this request?'
                            ])
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>

            {!! $requests->links() !!}
        @else
            @include('admin.components.empty-state', [
                'message' => 'No callback requests yet.'
            ])
        @endif
    </div>
</div>
