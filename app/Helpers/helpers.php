<?php

/**
 * Universal function for getting data from array or object with dot notation support
 *
 * Usage examples:
 * {!! get_data($item, 'title') !!}
 * {!! get_data($user, 'name', 'Guest') !!}
 * {!! get_data($product, 'price', 0) !!}
 * {!! get_data($room, 'features.area') !!} // for nested data
 * {!! get_data($data, 'quote.author.name') !!} // deep nesting
 */
if (!function_exists('get_data')) {
    function get_data($item, $key, $default = '')
    {
        if (strpos($key, '.') !== false) {
            $keys = explode('.', $key);
            $value = $item;

            foreach ($keys as $nestedKey) {
                if (is_array($value) && isset($value[$nestedKey])) {
                    $value = $value[$nestedKey];
                } elseif (is_object($value) && isset($value->$nestedKey)) {
                    $value = $value->$nestedKey;
                } else {
                    return $default;
                }
            }

            return $value;
        }

        if (is_array($item)) {
            return $item[$key] ?? $default;
        }

        if (is_object($item)) {
            return $item->$key ?? $default;
        }

        return $default;
    }
}

/**
 * Universal function for creating img tag
 *
 * Usage examples:
 * {!! get_img($item, 'image', 'photo') !!}
 * {!! get_img('hero.jpg', '', 'banner__image') !!}
 * {!! get_img($product, 'photo', 'product__img', 'img/products') !!}
 * {!! get_img($user, 'avatar', 'user__photo', 'img/avatars') !!}
 * {!! get_img($gallery, 'thumbnail', 'gallery__thumb', 'gallery') !!}
 *
 * For array: {!! get_img(['image' => 'test.jpg', 'description' => 'Test']) !!}
 * For string: {!! get_img('banner.jpg', '', 'hero') !!}
 */
if (!function_exists('get_img')) {
    function get_img($item, $key = 'image', $class = '', $folder = 'img')
    {
        if (is_string($item)) {
            $path = $item;
            $alt = pathinfo($item, PATHINFO_FILENAME);
        } else {
            $path = get_data($item, $key);
            $alt = get_data($item, 'alt') ?: get_data($item, 'description') ?: get_data($item, 'title');
        }

        if (empty($path)) {
            return '';
        }

        $src = asset("{$folder}/{$path}");
        $classAttr = $class ? " class=\"{$class}\"" : '';

        return "<img src=\"{$src}\" alt=\"{$alt}\"{$classAttr}>";
    }
}

/**
 * Check if data exists in array or object with dot notation support
 *
 * Usage examples:
 * @if(has_data($item, 'image'))
 *     {!! get_img($item) !!}
 * @endif
 *
 * @if(has_data($user, 'phone'))
 *     <a href="tel:{!! get_data($user, 'phone') !!}">Call</a>
 * @endif
 *
 * @if(has_data($product, 'discount'))
 *     <span class="sale">-{!! get_data($product, 'discount') !!}%</span>
 * @endif
 *
 * @if(has_data($data, 'quote.author.name'))
 *     {!! get_data($data, 'quote.author.name') !!}
 * @endif
 */
if (!function_exists('has_data')) {
    function has_data($item, $key)
    {
        if (strpos($key, '.') !== false) {
            $keys = explode('.', $key);
            $value = $item;

            foreach ($keys as $nestedKey) {
                if (is_array($value) && isset($value[$nestedKey])) {
                    $value = $value[$nestedKey];
                } elseif (is_object($value) && isset($value->$nestedKey)) {
                    $value = $value->$nestedKey;
                } else {
                    return false;
                }
            }

            return !empty($value);
        }

        if (is_array($item)) {
            return isset($item[$key]) && !empty($item[$key]);
        }

        if (is_object($item)) {
            return isset($item->$key) && !empty($item->$key);
        }

        return false;
    }
}

/**
 * Get image URL without creating tag
 *
 * Usage examples:
 * <div style="background-image: url('{!! img_url($item, 'bg') !!}')"></div>
 * <meta property="og:image" content="{!! img_url($post, 'featured_image') !!}">
 */
if (!function_exists('img_url')) {
    function img_url($item, $key = 'image', $folder = 'img')
    {
        if (is_string($item)) {
            $path = $item;
        } else {
            $path = get_data($item, $key);
        }

        if (empty($path)) {
            return '';
        }

        return asset("{$folder}/{$path}");
    }
}

/**
 * Create link
 *
 * Usage examples:
 * {!! get_link($item, 'title', 'url', 'btn btn-primary') !!}
 * {!! get_link(['text' => 'Read more', 'url' => '/about'], 'text', 'url') !!}
 * {!! get_link('https://example.com') !!}
 */
if (!function_exists('get_link')) {
    function get_link($item, $textKey = 'text', $urlKey = 'url', $class = '')
    {
        if (is_string($item)) {
            return "<a href=\"{$item}\">{$item}</a>";
        }

        $url = get_data($item, $urlKey, '#');
        $text = get_data($item, $textKey) ?: get_data($item, 'title') ?: get_data($item, 'name') ?: $url;
        $classAttr = $class ? " class=\"{$class}\"" : '';

        return "<a href=\"{$url}\"{$classAttr}>{$text}</a>";
    }
}

/*
|--------------------------------------------------------------------------
| USAGE EXAMPLES IN DIFFERENT BLOCKS
|--------------------------------------------------------------------------
|
| Below are practical examples of how to use these helper functions
| in various common scenarios throughout your Laravel Blade templates.
|
*/

/*
// 1. ROOMS BLOCK
@foreach($rooms as $room)
    <div class="room">
        {!! get_img($room, 'photo', 'room__image', 'img/rooms') !!}
        <h3>{!! get_data($room, 'name') !!}</h3>
        <span class="price">{!! get_data($room, 'price', 'Price on request') !!} per night</span>

        @if(has_data($room, 'gallery'))
            <div class="room__gallery">
                @foreach(get_data($room, 'gallery', []) as $photo)
                    {!! get_img($photo, '', 'room__gallery-item', 'img/rooms') !!}
                @endforeach
            </div>
        @endif
    </div>
@endforeach

// 2. TEAM BLOCK
@foreach($team as $member)
    <div class="team__member">
        {!! get_img($member, 'avatar', 'team__photo', 'img/team') !!}
        <h4>{!! get_data($member, 'name') !!}</h4>
        <p>{!! get_data($member, 'position') !!}</p>

        @if(has_data($member, 'social'))
            {!! get_link($member, 'name', 'social', 'social-link') !!}
        @endif
    </div>
@endforeach

// 3. GALLERY BLOCK
@foreach($gallery as $item)
    <div class="gallery__item">
        {!! get_img($item, 'image', 'gallery__photo', 'gallery') !!}

        @if(has_data($item, 'caption'))
            <p class="gallery__caption">{!! get_data($item, 'caption') !!}</p>
        @endif
    </div>
@endforeach

// 4. PRODUCTS BLOCK
@foreach($products as $product)
    <div class="product">
        {!! get_img($product, 'image', 'product__image', 'img/products') !!}
        <h3>{!! get_data($product, 'title') !!}</h3>
        <p>{!! get_data($product, 'description') !!}</p>

        @if(has_data($product, 'price'))
            <span class="price">{!! get_data($product, 'price') !!} USD</span>
        @endif

        @if(has_data($product, 'url'))
            {!! get_link($product, 'title', 'url', 'btn product__btn') !!}
        @endif
    </div>
@endforeach

// 5. NEWS/BLOG BLOCK
@foreach($posts as $post)
    <article class="post">
        {!! get_img($post, 'featured_image', 'post__image', 'img/blog') !!}
        <h2>{!! get_data($post, 'title') !!}</h2>
        <p>{!! get_data($post, 'excerpt') !!}</p>
        <time>{!! get_data($post, 'date') !!}</time>

        @if(has_data($post, 'author'))
            <span class="author">{!! get_data($post, 'author') !!}</span>
        @endif
    </article>
@endforeach

// 6. FEATURES/SERVICES BLOCK
@foreach($features as $feature)
    <div class="feature">
        @if(has_data($feature, 'icon'))
            {!! get_img($feature, 'icon', 'feature__icon', 'img/icons') !!}
        @endif

        <h3>{!! get_data($feature, 'title') !!}</h3>
        <p>{!! get_data($feature, 'description') !!}</p>
    </div>
@endforeach

// 7. CONTACT INFORMATION BLOCK
<div class="contact">
    @if(has_data($contact, 'address.street'))
        <p>{!! get_data($contact, 'address.street') !!}, {!! get_data($contact, 'address.city') !!}</p>
    @endif

    @if(has_data($contact, 'phone'))
        <a href="tel:{!! get_data($contact, 'phone') !!}">{!! get_data($contact, 'phone') !!}</a>
    @endif

    @if(has_data($contact, 'email'))
        <a href="mailto:{!! get_data($contact, 'email') !!}">{!! get_data($contact, 'email') !!}</a>
    @endif
</div>

// 8. BACKGROUND IMAGES
<section class="hero" style="background-image: url('{!! img_url($hero, 'background', 'img/backgrounds') !!}')">
    <h1>{!! get_data($hero, 'title') !!}</h1>
    <p>{!! get_data($hero, 'subtitle') !!}</p>

    @if(has_data($hero, 'button'))
        {!! get_link($hero, 'button.text', 'button.url', 'btn btn--primary') !!}
    @endif
</section>

// 9. SOCIAL MEDIA LINKS
@if(has_data($data, 'social'))
    <div class="social">
        @foreach(get_data($data, 'social', []) as $social)
            <a href="{!! get_data($social, 'url') !!}"
               class="social__link social__link--{!! get_data($social, 'type') !!}"
               target="_blank">
                {!! get_data($social, 'name') !!}
            </a>
        @endforeach
    </div>
@endif

// 10. TESTIMONIALS/REVIEWS BLOCK
@foreach($testimonials as $testimonial)
    <div class="testimonial">
        {!! get_img($testimonial, 'avatar', 'testimonial__avatar', 'img/avatars') !!}
        <blockquote>{!! get_data($testimonial, 'text') !!}</blockquote>
        <cite>{!! get_data($testimonial, 'author') !!}</cite>

        @if(has_data($testimonial, 'rating'))
            <div class="rating">
                Rating: {!! get_data($testimonial, 'rating') !!}/5
            </div>
        @endif
    </div>
@endforeach
*/
