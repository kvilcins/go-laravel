{{-- ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ В РАЗНЫХ БЛОКАХ: --}}

{{-- 1. ROOMS БЛОК --}}
@foreach($rooms as $room)
    <div class="room">
        {!! get_img($room, 'photo', 'room__image', 'img/rooms') !!}
        <h3>{{ get_data($room, 'name') }}</h3>
        <span class="price">{{ get_data($room, 'price', 'Цена по запросу') }} руб/ночь</span>

        @if(has_data($room, 'gallery'))
            <div class="room__gallery">
                @foreach(get_data($room, 'gallery') as $photo)
                    {!! get_img($photo, '', 'room__gallery-item', 'img/rooms') !!}
                @endforeach
            </div>
        @endif
    </div>
@endforeach

{{-- 2. TEAM БЛОК --}}
@foreach($team as $member)
    <div class="team__member">
        {!! get_img($member, 'avatar', 'team__photo', 'img/team') !!}
        <h4>{{ get_data($member, 'name') }}</h4>
        <p>{{ get_data($member, 'position') }}</p>

        @if(has_data($member, 'social'))
            {!! get_link($member, 'name', 'social', 'social-link') !!}
        @endif
    </div>
@endforeach

{{-- 3. GALLERY БЛОК --}}
@foreach($gallery as $item)
    <div class="gallery__item">
        {!! get_img($item, 'image', 'gallery__photo', 'gallery') !!}

        @if(has_data($item, 'caption'))
            <p class="gallery__caption">{{ get_data($item, 'caption') }}</p>
        @endif
    </div>
@endforeach

{{-- 4. PRODUCTS БЛОК --}}
@foreach($products as $product)
    <div class="product">
        {!! get_img($product, 'image', 'product__image', 'img/products') !!}
        <h3>{{ get_data($product, 'title') }}</h3>
        <p>{{ get_data($product, 'description') }}</p>

        @if(has_data($product, 'price'))
            <span class="price">{{ get_data($product, 'price') }} руб</span>
        @endif

        @if(has_data($product, 'url'))
            {!! get_link($product, 'title', 'url', 'btn product__btn') !!}
        @endif
    </div>
@endforeach

{{-- 5. NEWS/BLOG БЛОК --}}
@foreach($posts as $post)
    <article class="post">
        {!! get_img($post, 'featured_image', 'post__image', 'img/blog') !!}
        <h2>{{ get_data($post, 'title') }}</h2>
        <p>{{ get_data($post, 'excerpt') }}</p>
        <time>{{ get_data($post, 'date') }}</time>

        @if(has_data($post, 'author'))
            <span class="author">{{ get_data($post, 'author') }}</span>
        @endif
    </article>
@endforeach

{{-- 6. FEATURES/SERVICES БЛОК --}}
@foreach($features as $feature)
    <div class="feature">
        @if(has_data($feature, 'icon'))
            {!! get_img($feature, 'icon', 'feature__icon', 'img/icons') !!}
        @endif

        <h3>{{ get_data($feature, 'title') }}</h3>
        <p>{{ get_data($feature, 'description') }}</p>
    </div>
@endforeach
