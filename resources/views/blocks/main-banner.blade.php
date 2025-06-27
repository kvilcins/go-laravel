<section class="main-banner">
    <div class="container main-banner__container">
        <div class="main-banner__text-wrap">
            <p class="main-banner__subtitle">{!! get_data($data, 'subtitle', '') !!}</p>
            <h1 class="main-banner__title">{!! get_data($data, 'title', '') !!}</h1>

            <div class="main-banner__advantages">
                @foreach(get_data($data, 'advantages', []) as $advantage)
                    <div class="main-banner__advantage">
                        <p class="main-banner__advantage-number {!! get_data($advantage, 'class', '') !!}">
                            {!! get_data($advantage, 'text') !!}
                        </p>
                        <p class="main-banner__advantage-text">{!! get_data($advantage, 'description') !!}</p>
                    </div>
                @endforeach
            </div>

            @if(has_data($data, 'button'))
                <a href="{!! get_data($data, 'button.url', '#booking') !!}" class="main-banner__link">
                    <button type="button" class="main-banner__button">
                        {!! get_data($data, 'button.text', 'Забронировать') !!}
                    </button>
                </a>
            @endif

            @if(has_data($data, 'scroll_link'))
                <a href="{!! get_data($data, 'scroll_link.url', '#entertainment') !!}" class="main-banner__scroll">
                    <svg width="97" height="97" viewBox="0 0 97 97" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="main-banner__scroll-icon">
                        <circle cx="48.5" cy="48.5" r="48" class="main-banner__scroll-circle"></circle>
                        <rect x="34.4255" y="43.9162" width="1.82001" height="20.0201" transform="rotate(-44.9975 34.4255 43.9162)" class="main-banner__scroll-rect"></rect>
                        <rect x="48.5807" y="58.0737" width="1.82001" height="20.0201" transform="rotate(-134.997 48.5807 58.0737)" class="main-banner__scroll-rect"></rect>
                    </svg>
                </a>
            @endif
        </div>
    </div>
</section>
