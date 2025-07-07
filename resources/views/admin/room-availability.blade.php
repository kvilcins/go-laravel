@extends('layouts.admin')

@section('title', 'Доступность комнат')

@section('content')
    @include('admin.components.header', [
        'title' => 'Доступность комнат',
        'subtitle' => 'Управление временными слотами для каждой комнаты'
    ])

    @include('admin.components.room-availability-filters', [
        'rooms' => $rooms,
        'timeSlots' => $timeSlots,
        'availableDates' => $availableDates,
        'filters' => $filters
    ])

    @include('admin.components.store-room-availability', [
        'rooms' => $rooms,
        'timeSlots' => $timeSlots,
        'availableDatesForForms' => $availableDatesForForms
    ])

    @include('admin.components.store-bulk-availability', [
        'rooms' => $rooms,
        'timeSlots' => $timeSlots,
        'availableDatesForForms' => $availableDatesForForms
    ])

    @include('admin.components.room-availability-table', [
        'availability' => $availability,
        'rooms' => $rooms
    ])

    @if($availability->count() > 0)
        @include('admin.components.availability-stats', ['availability' => $availability])
    @endif
@endsection
