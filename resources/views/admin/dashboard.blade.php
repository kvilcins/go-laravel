@extends('layouts.admin')

@section('title', 'Dashboard')

@section('content')
    @include('admin.components.header', [
        'title' => $title ?? 'Admin Panel',
        'subtitle' => $subtitle ?? 'Content Management'
    ])

    @include('admin.components.stats-grid', ['stats' => $stats])

    @include('admin.components.quick-actions')
@endsection
