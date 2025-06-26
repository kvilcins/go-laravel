@extends('layouts.main')

@section('title', 'Homepage')

@section('content')
    <main class="main">
        <div class="container">
            @include('blocks.main-banner')
            @include('blocks.entertainment')
            @include('blocks.rooms')
            @include('blocks.booking')
            @include('blocks.about-us')
            @include('blocks.feedbacks')
            @include('blocks.faq')
        </div>
    </main>
@endsection
