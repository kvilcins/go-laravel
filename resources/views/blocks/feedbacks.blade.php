<section class="feedbacks" id="feedbacks">
    <div class="container">
        <h2 class="feedbacks__title h2">{!! get_data($data, 'title', 'Отзывы посетителей') !!}</h2>
        <div class="feedbacks__slider">
            <div class="feedbacks__wrapper">
                <div class="feedbacks__track">
                    @foreach(get_data($data, 'reviews', []) as $review)
                        <div class="feedbacks__slide">
                            <div class="feedbacks__item">
                                <figure class="feedbacks__photo">
                                    {!! get_img($review, 'photo', 'feedbacks__image', 'img/faces') !!}
                                    <figcaption class="feedbacks__name">{!! get_data($review, 'name') !!}</figcaption>
                                </figure>
                                <p class="feedbacks__text">{!! get_data($review, 'text') !!}</p>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            <div class="feedbacks__controls">
                <button class="feedbacks__btn feedbacks__btn--prev" type="button">
                    <svg class="feedbacks__icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                    </svg>
                </button>
                <div class="feedbacks__dots"></div>
                <button class="feedbacks__btn feedbacks__btn--next" type="button">
                    <svg class="feedbacks__icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</section>
