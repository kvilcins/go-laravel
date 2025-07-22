<section class="about-us" data-scroll-target="about-us">
    <div class="container">
        <h2 class="about-us__title h2">{!! get_data($data, 'title', 'About us') !!}</h2>
        <div class="about-us__content">
            <div class="about-us__gallery">
                @foreach(get_data($data, 'gallery', []) as $index => $item)
                    <div class="about-us__gallery-item about-us__gallery-item--{!! get_data($item, 'class') !!}"
                         data-modal-open="gallery-{!! $index !!}">
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

@foreach(get_data($data, 'gallery', []) as $index => $item)
    @include('modals.info', [
        'modalId' => 'gallery-' . $index,
        'title' => get_data($item, 'modal_title', get_data($item, 'alt', 'Gallery Image')),
        'description' => get_data($item, 'modal_description', 'Experience our gaming atmosphere.'),
        'image' => asset('img/about-us/' . get_data($item, 'image'))
    ])
@endforeach
