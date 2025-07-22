<div class="admin-card admin-card--spaced">
    <div class="admin-card__header">
        <h2 class="admin-card__title">Generate Multiple Dates</h2>
        <p class="admin-card__subtitle">Automatically generate available dates for multiple months</p>
    </div>
    <div class="admin-card__content">
        <div class="form-row form-row--generate">
            <div class="form-group">
                <select id="months-select" class="form-input">
                    <option value="1" selected>1 month</option>
                    <option value="2">2 months</option>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                </select>
            </div>
            <button id="generate-dates-btn" class="btn btn--primary" type="button">
                <span class="btn__text">Generate Dates</span>
                <span class="btn__spinner">⏳</span>
            </button>
        </div>

        <div id="generate-result" class="form-result"></div>
    </div>
</div>
