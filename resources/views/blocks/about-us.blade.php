<section class="about-us" id="about-us">
    <div class="container">
        <h2 class="about-us__title h2">{!! get_data($data, 'title', 'О нас') !!}</h2>
        <div class="about-us__content">
            <div class="about-us__gallery">
                @foreach(get_data($data, 'gallery', []) as $item)
                    <div class="about-us__gallery-item about-us__gallery-item--{!! get_data($item, 'class') !!}">
                        {!! get_img($item, 'image', 'about-us__image', 'img/about-us') !!}
                    </div>
                @endforeach
            </div>

            <div class="about-us__text">
                @foreach(get_data($data, 'descriptions', []) as $description)
                    <p class="about-us__description">{!! $description !!}</p>
                @endforeach
            </div>

            @if(has_data($data, 'quote'))
                <blockquote class="about-us__quote">
                    <p class="about-us__quote-text">
                        <span class="about-us__quote-highlight">{!! get_data($data, 'quote.highlight') !!}</span>
                        {!! get_data($data, 'quote.text') !!}
                    </p>
                    <cite class="about-us__cite">
                        {!! get_img($data, 'quote.author.photo', 'about-us__author-photo', 'img/faces') !!}
                        <span class="about-us__author">{!! get_data($data, 'quote.author.name') !!}, {!! get_data($data, 'quote.author.position') !!}</span>
                    </cite>
                </blockquote>
            @endif
        </div>
    </div>
</section>
