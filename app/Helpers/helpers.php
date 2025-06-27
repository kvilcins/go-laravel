<?php

/**
 * Universal function for getting data from array or object with dot notation support
 *
 * Usage examples:
 * {{ get_data($item, 'title') }}
 * {{ get_data($user, 'name', 'Guest') }}
 * {{ get_data($product, 'price', 0) }}
 * {{ get_data($room, 'features.area') }} // for nested data
 * {{ get_data($data, 'quote.author.name') }} // deep nesting
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
 *     <a href="tel:{{ get_data($user, 'phone') }}">Call</a>
 * @endif
 *
 * @if(has_data($product, 'discount'))
 *     <span class="sale">-{{ get_data($product, 'discount') }}%</span>
 * @endif
 *
 * @if(has_data($data, 'quote.author.name'))
 *     {{ get_data($data, 'quote.author.name') }}
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
 * <div style="background-image: url('{{ img_url($item, 'bg') }}')"></div>
 * <meta property="og:image" content="{{ img_url($post, 'featured_image') }}">
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
