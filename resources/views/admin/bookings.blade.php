@extends('layouts.admin')

@section('title', 'Бронирования')

@section('content')
    @include('admin.components.header', [
        'title' => $title ?? 'Бронирования',
        'subtitle' => $subtitle ?? 'Управление бронированиями игровых залов'
    ])

    @include('admin.components.bookings-table', ['bookings' => $bookings, 'rooms' => $rooms])
@endsection
