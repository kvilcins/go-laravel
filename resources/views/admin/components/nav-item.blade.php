<a href="{{ route($route) }}"
   class="admin-nav__item {{ request()->routeIs($route) ? 'admin-nav__item--active' : '' }}">
    {{ $icon }} {{ $text }}
</a>
