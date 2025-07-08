@extends('layouts.admin')

@section('title', 'Bookings')

@section('content')
    @include('admin.components.header', [
        'title' => $title ?? 'Bookings',
        'subtitle' => $subtitle ?? 'Manage game room bookings'
    ])

    @include('admin.components.bookings-table', ['bookings' => $bookings, 'rooms' => $rooms])
@endsection
