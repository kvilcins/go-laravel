@if($active)
    <span class="badge badge--success">{{ $activeText }}</span>
@else
    <span class="badge badge--danger">{{ $inactiveText }}</span>
@endif
