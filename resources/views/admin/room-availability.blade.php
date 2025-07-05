@extends('layouts.admin')

@section('title', 'Доступность комнат')

@section('content')
    @include('admin.components.header', [
        'title' => $title ?? 'Доступность комнат',
        'subtitle' => $subtitle ?? 'Управление временными слотами для каждой комнаты'
    ])

    @include('admin.components.room-availability-table', ['availability' => $availability, 'rooms' => $rooms])

    @if($availability->count() > 0)
        @include('admin.components.availability-stats', ['availability' => $availability])
    @endif
@endsection
