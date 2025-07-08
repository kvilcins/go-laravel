<form action="{!! $route !!}" method="POST" class="admin-delete-form" data-confirm="{!! $confirmText !!}">
    @csrf
    @method('DELETE')
    <button type="submit" class="btn btn--danger btn--small">
        Delete
    </button>
</form>
