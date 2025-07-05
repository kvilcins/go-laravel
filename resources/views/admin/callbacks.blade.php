@extends('layouts.admin')

@section('title', 'Заявки на звонок')

@section('content')
    @include('admin.components.header', [
        'title' => $title ?? 'Заявки на звонок',
        'subtitle' => $subtitle ?? 'Управление заявками на обратный звонок'
    ])

    @include('admin.components.callbacks-table', ['requests' => $requests])
@endsection
