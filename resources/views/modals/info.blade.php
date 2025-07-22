<div class="modal info-modal" data-modal="{!! $modalId !!}">
    <div class="modal__overlay" data-modal-close></div>
    <div class="modal__content">
        <button class="modal__close" data-modal-close>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>
        <div class="modal__header">
            <h2 class="modal__title">{!! $title !!}</h2>
        </div>
        <div class="modal__body">
            @if(isset($image) && $image)
                <div class="modal__image-wrapper">
                    <img src="{!! $image !!}" alt="{!! $title !!}" class="modal__image">
                </div>
            @endif
            <div class="modal__text">
                <p class="modal__description">{!! $description !!}</p>
            </div>
        </div>
    </div>
</div>
