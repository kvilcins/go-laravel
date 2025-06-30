@extends('layouts.admin')

@section('title', 'Заявки на звонок')
@section('subtitle', 'Управление заявками на обратный звонок')

@section('content')
    <div class="admin-card">
        <div class="admin-card__header">
            <h2 class="admin-card__title">Заявки на обратный звонок</h2>
            <span class="badge badge--success">{{ $requests->total() }} заявок</span>
        </div>
        <div class="admin-card__content">
            @if($requests->count() > 0)
                <table class="admin-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Телефон</th>
                        <th>Email</th>
                        <th>Сообщение</th>
                        <th>Дата создания</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach($requests as $request)
                        <tr>
                            <td>{{ $request->id }}</td>
                            <td>{{ $request->name }}</td>
                            <td>{{ $request->phone }}</td>
                            <td>{{ $request->email ?? '-' }}</td>
                            <td title="{{ $request->message }}">
                                {{ Str::limit($request->message ?? '-', 50) }}
                            </td>
                            <td>{{ \Carbon\Carbon::parse($request->created_at)->format('d.m.Y H:i') }}</td>
                            <td>
                                <form action="{{ route('admin.delete-callback', $request->id) }}"
                                      method="POST"
                                      style="display: inline;"
                                      data-confirm="Удалить эту заявку?">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn--danger btn--small">
                                        Удалить
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>

                {{ $requests->links() }}
            @else
                <p>Заявок на обратный звонок пока нет.</p>
            @endif
        </div>
    </div>
@endsection
