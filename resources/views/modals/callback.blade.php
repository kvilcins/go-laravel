<div class="modal callback" data-modal="callback">
    <div class="modal__overlay" data-modal-close></div>
    <div class="modal__content">
        <button class="modal__close" data-modal-close>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>
        <div class="modal__header">
            <h2 class="modal__title">Request a call</h2>
        </div>
        <div class="modal__body">
            <form class="modal__form" action="#" method="POST">
                @csrf
                <div class="modal__form-group">
                    <input type="text" class="modal__input" name="name" placeholder="Your name" required>
                </div>
                <div class="modal__form-group">
                    <input type="tel" class="modal__input" name="phone" placeholder="Phone number" required>
                </div>
                <div class="modal__form-group">
                    <input type="text" class="modal__input" name="email" placeholder="Your email">
                </div>
                <div class="modal__form-group">
                    <textarea class="modal__textarea" name="message" placeholder="Comment (optional)" rows="4"></textarea>
                </div>
                <button type="submit" class="modal__submit">Send</button>
            </form>
        </div>
    </div>
</div>
