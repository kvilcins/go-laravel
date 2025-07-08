<div class="admin-actions">
    @if(isset($toggleRoute))
        <form action="{!! $toggleRoute !!}" method="POST" class="admin-actions__form">
            @csrf
            @method('PATCH')
            <button type="submit" class="btn btn--secondary btn--small">
                {!! $toggleText !!}
            </button>
        </form>
    @endif

    @if(isset($deleteRoute))
        <form action="{!! $deleteRoute !!}" method="POST" class="admin-actions__form" data-confirm="{!! $confirmText !!}">
            @csrf
            @method('DELETE')
            <button type="submit" class="btn btn--danger btn--small">
                Delete
            </button>
        </form>
    @endif
</div>
