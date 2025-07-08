<!DOCTYPE html>
<html lang="en">
<meta name="csrf-token" content="{!! csrf_token() !!}">

@include('components.partials.head')

<body>
    <div class="admin-layout">
        @include('admin.components.sidebar')

        <main class="admin-content">

            @include('admin.components.alerts')

            @yield('content')
        </main>
    </div>
</body>
</html>
