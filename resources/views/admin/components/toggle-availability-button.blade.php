<form action="{{ route('admin.toggle-room-availability', $slot->id) }}" method="POST" class="admin-toggle-form">
    @csrf
    @method('PATCH')
    <button type="submit" class="btn {{ $slot->is_available ? 'btn--danger' : 'btn--success' }} btn--small">
        {{ $slot->is_available ? '🚫 Скрыть' : '✅ Показать' }}
    </button>
</form>
