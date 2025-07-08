<!DOCTYPE html>
<html lang="en">
<meta name="csrf-token" content="{!! csrf_token() !!}">

@include('components.partials.head')

<body>

@include('components.partials.header')

@yield('content')

@include('components.partials.footer')

@include('modals.callback')

</body>
</html>
