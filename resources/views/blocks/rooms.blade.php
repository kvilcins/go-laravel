<section class="room" id="room">
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
    </div>
</section>
