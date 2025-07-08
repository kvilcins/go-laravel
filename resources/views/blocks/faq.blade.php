<section class="faq" data-scroll-target="faq">
    <div class="container">
        <h2 class="faq__title h2">{!! get_data($data, 'title', '') !!}</h2>
        <ul class="faq__list">
            @foreach(get_data($data, 'questions', []) as $index => $question)
                <li class="faq__item" data-faq-item="{!! $index !!}">
                    <button class="faq__button" type="button">
                        <span class="faq__question">{!! get_data($question, 'question') !!}</span>
                        <div class="faq__icon">
                            <svg class="faq__svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path class="faq__path" d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </button>
                    <div class="faq__content">
                        <p class="faq__answer">{!! get_data($question, 'answer') !!}</p>
                    </div>
                </li>
            @endforeach
        </ul>
    </div>
</section>
