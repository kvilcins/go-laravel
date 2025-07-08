<section class="room" data-scroll-target="rooms">
    <div class="container">
        <h2 class="room__title h2">{!! $title !!}</h2>

        <ul class="room__list">
            @foreach($items as $item)
                <li class="room__item room__item--{!! get_data($item, 'class') !!}">
                    {!! get_img($item, 'image', 'room__image') !!}
                    <p class="room__description">{!! get_data($item, 'description') !!}</p>
                </li>
            @endforeach
        </ul>

        <div class="room__slider">
            <div class="room__slider-wrapper">
                <div class="slider__track room__slider-track">
                    @foreach($items as $item)
                        <div class="slider__slide room__slider-slide">
                            <div class="room__slider-item room__slider-item--{!! get_data($item, 'class') !!}">
                                {!! get_img($item, 'image', 'room__slider-image') !!}
                                <p class="room__slider-description">{!! get_data($item, 'description') !!}</p>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            <div class="room__controls">
                <button class="slider__btn slider__btn--prev room__btn" type="button" aria-label="Previous room">
                    <svg class="slider__icon room__icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                    </svg>
                </button>
                <div class="slider__dots room__dots"></div>
                <button class="slider__btn slider__btn--next room__btn" type="button" aria-label="Next room">
                    <svg class="slider__icon room__icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</section>
