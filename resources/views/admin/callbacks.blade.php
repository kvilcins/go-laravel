@extends('layouts.admin')

@section('title', 'Callback Requests')

@section('content')
    @include('admin.components.header', [
        'title' => $title ?? 'Callback Requests',
        'subtitle' => $subtitle ?? 'Manage callback requests'
    ])

    @include('admin.components.callbacks-table', ['requests' => $requests])
@endsection
