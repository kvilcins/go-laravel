@extends('layouts.admin')

@section('title', 'Дашборд')

@section('content')
    @include('admin.components.header', [
        'title' => $title ?? 'Админ-панель',
        'subtitle' => $subtitle ?? 'Управление контентом'
    ])

    @include('admin.components.stats-grid', ['stats' => $stats])

    @include('admin.components.quick-actions')
@endsection
