<div class="admin-card admin-card--spaced">
    <div class="admin-card__header">
        <h2 class="admin-card__title">Add New Date</h2>
    </div>
    <div class="admin-card__content">
        <form action="{!! route('admin.store-date') !!}" method="POST">
            @csrf
            <div class="form-row">
                <div class="form-group">
                    <input type="date" name="date" class="form-input" required min="{!! date('Y-m-d') !!}">
                </div>
                <div class="form-group">
                    <label class="form-label form-label--checkbox">
                        <input type="checkbox" name="is_active" value="1" checked> Active
                    </label>
                </div>
                <button type="submit" class="btn btn--primary">Add Date</button>
            </div>
        </form>
    </div>
</div>
