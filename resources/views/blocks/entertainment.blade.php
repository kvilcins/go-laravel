<section class="entertainment" data-scroll-target="entertainment">
    <div class="container">
        <h2 class="entertainment__title h2">{!! $title !!}</h2>
        <ul class="entertainment__list">
            @foreach($items as $index => $item)
                <li class="entertainment__item entertainment__item--{!! get_data($item, 'class') !!}"
                    data-modal-open="entertainment-{!! $index !!}">
                    {!! get_img($item, 'image', 'entertainment__image') !!}
                    <p class="entertainment__description">{!! get_data($item, 'description') !!}</p>
                </li>
            @endforeach
        </ul>
    </div>
</section>

@foreach($items as $index => $item)
    @include('modals.info', [
        'modalId' => 'entertainment-' . $index,
        'title' => get_data($item, 'modal_title', get_data($item, 'description')),
        'description' => get_data($item, 'modal_description', 'Learn more about this entertainment option.'),
        'image' => asset('img/' . get_data($item, 'image'))
    ])
@endforeach
