@extends('layouts.admin')

@section('title', 'Доступные даты')
@section('subtitle', 'Управление доступными для бронирования датами')

@section('content')
    @include('admin.components.header', [
        'title' => $title ?? 'Доступные даты',
        'subtitle' => $subtitle ?? 'Управление доступными для бронирования датами'
    ])

    @include('admin.components.add-date-form')

    @include('admin.components.dates-table', ['dates' => $dates])
@endsection
