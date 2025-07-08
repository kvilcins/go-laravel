@extends('layouts.admin')

@section('title', 'Available Dates')
@section('subtitle', 'Manage available dates for booking')

@section('content')
    @include('admin.components.header', [
        'title' => $title ?? 'Available Dates',
        'subtitle' => $subtitle ?? 'Manage available dates for booking'
    ])

    @include('admin.components.add-date-form')

    @include('admin.components.dates-table', ['dates' => $dates])
@endsection
