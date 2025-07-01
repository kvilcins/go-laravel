<section class="entertainment" data-scroll-target="entertainment">
    <div class="container">
        <h2 class="entertainment__title h2">{!! $title !!}</h2>
        <ul class="entertainment__list">
            @foreach($items as $item)
                <li class="entertainment__item entertainment__item--{!! get_data($item, 'class') !!}">
                    {!! get_img($item, 'image', 'entertainment__image') !!}
                    <p class="entertainment__description">{!! get_data($item, 'description') !!}</p>
                </li>
            @endforeach
        </ul>
    </div>
</section>
