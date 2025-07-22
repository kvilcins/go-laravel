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
        'activeAvailability' => $activeAvailability,
        'inactiveAvailability' => $inactiveAvailability,
        'rooms' => $rooms
    ])

    @if($activeAvailability->count() > 0 || $inactiveAvailability->count() > 0)
        @include('admin.components.availability-stats', ['availability' => $activeAvailability])
    @endif
@endsection
