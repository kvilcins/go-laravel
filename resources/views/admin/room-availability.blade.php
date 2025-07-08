@extends('layouts.admin')

@section('title', 'Room Availability')

@section('content')
    @include('admin.components.header', [
        'title' => 'Room Availability',
        'subtitle' => 'Manage time slots for each room'
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
