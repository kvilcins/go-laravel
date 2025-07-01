@extends('layouts.main')

@section('title', 'Homepage')

@section('content')
    <x-container class="main--home" container-class="container--main">
        @include('blocks.main-banner', [
            'data' => [
                'subtitle' => 'Game Over',
                'title' => 'Новый формат игр и отдыха',
                'advantages' => [
                    [
                        'text' => '4',
                        'class' => 'main-banner__advantage-number--purple',
                        'description' => 'Тематических зала'
                    ],
                    [
                        'text' => 'new',
                        'class' => 'main-banner__advantage-number--small-caps',
                        'description' => 'Новейшая аппаратура'
                    ]
                ],
                'button' => [
                    'text' => 'Забронировать',
                    'url' => 'booking'
                ],
                'scroll_link' => [
                    'url' => 'entertainment'
                ]
            ]
        ])

        @include('blocks.entertainment', [
            'title' => 'У нас есть все для классного отдыха с друзьями!',
            'items' => [
                [
                    'class' => 'vr',
                    'image' => 'entertainment/vr.jpg',
                    'description' => 'VR очки'
                ],
                [
                    'class' => 'audio',
                    'image' => 'entertainment/audio.jpg',
                    'description' => 'Аудио-система 5.1 с отличным звуком'
                ],
                [
                    'class' => 'karaoke',
                    'image' => 'entertainment/karaoke.jpg',
                    'description' => 'Караоке (4 микрофона)'
                ],
                [
                    'class' => 'games',
                    'image' => 'entertainment/games.jpg',
                    'description' => 'Настольные игры'
                ],
                [
                    'class' => 'movies',
                    'image' => 'entertainment/movies.jpg',
                    'description' => 'Кино-сервисы Netflix, IVI, MegoGo, КиноПоиск, Okko'
                ],
                [
                    'class' => 'ps',
                    'image' => 'entertainment/ps5.jpg',
                    'description' => 'PlayStation 5'
                ]
            ]
        ])

        @include('blocks.rooms', [
            'title' => 'Наши залы',
            'items' => [
                [
                    'class' => '80s',
                    'image' => 'rooms/80s-vibes.jpg',
                    'description' => "80's vibes"
                ],
                [
                    'class' => 'star-wars',
                    'image' => 'rooms/star-wars.jpg',
                    'description' => 'Star wars'
                ],
                [
                    'class' => 'wild-west',
                    'image' => 'rooms/wild-west.jpg',
                    'description' => 'Wild west'
                ],
                [
                    'class' => 'neon-style',
                    'image' => 'rooms/neon-style.jpg',
                    'description' => 'Neon style'
                ]
            ]
        ])

        @include('blocks.booking', ['rooms' => $rooms, 'entertainments' => $entertainments])

        @include('blocks.about-us', [
            'data' => [
                'title' => 'О нас',
                'gallery' => [
                    [
                        'class' => 'vr',
                        'image' => 'about-us-1.jpg',
                        'alt' => 'VR игры'
                    ],
                    [
                        'class' => 'games',
                        'image' => 'about-us-2.jpg',
                        'alt' => 'Настольные игры'
                    ],
                    [
                        'class' => 'fifa',
                        'image' => 'about-us-3.jpg',
                        'alt' => 'FIFA игра'
                    ],
                    [
                        'class' => 'pad',
                        'image' => 'about-us-4.jpg',
                        'alt' => 'Игровой контроллер'
                    ],
                    [
                        'class' => 'controller',
                        'image' => 'about-us-5.jpg',
                        'alt' => 'Геймпад'
                    ],
                    [
                        'class' => 'karaoke',
                        'image' => 'about-us-6.jpg',
                        'alt' => 'Караоке система'
                    ],
                    [
                        'class' => 'vr2',
                        'image' => 'about-us-7.jpg',
                        'alt' => 'VR очки'
                    ]
                ],
                'descriptions' => [
                    'Для наших гостей мы создали концептуально новое игровое пространство виртуальной реальности в центральной части города.',
                    'Каждый день мы стараемся создавать для вас самую лучшую игровую атмосферу и радовать Вас топовыми игровыми разработками со всего мира.'
                ],
                'quote' => [
                    'highlight' => 'GAME OVER',
                    'text' => ' — это место незабываемых впечатлений',
                    'author' => [
                        'name' => 'Аркадий Абакин',
                        'position' => 'создатель игровой территории GAME OVER',
                        'photo' => 'creators-icon.png'
                    ]
                ]
            ]
        ])

        @include('blocks.feedbacks', [
            'data' => [
                'title' => 'Отзывы посетителей',
                'reviews' => [
                    [
                        'name' => 'Макс Самойлов',
                        'photo' => 'maxim.png',
                        'text' => 'Отмечали здесь день рождения с компанией друзей, все было очень круто! VR очки это просто бомба, никогда еще я не был в таком полном игровом погружении. Сервис на высоте!',
                        'alt' => 'Фото Макс Самойлов'
                    ],
                    [
                        'name' => 'Оксана Григорьева',
                        'photo' => 'oksana.png',
                        'text' => 'Были в комнате Дикий Запад, пели в караоке под Шакиру, отличный получился корпоратив! У нас в городе больше нет подобных заведений',
                        'alt' => 'Фото Оксана Григорьева'
                    ],
                    [
                        'name' => 'Никита Ященко',
                        'photo' => 'nikita.png',
                        'text' => 'Немного подвисала игра в VR очках, а так все норм. Крутое оформление комнаты в стиле звездных войн, попал в атмосферу космоса',
                        'alt' => 'Фото Никита Ященко'
                    ]
                ]
            ]
        ])

        @include('blocks.faq', [
            'data' => [
                'title' => 'Частые вопросы',
                'questions' => [
                    [
                        'question' => 'Можно ли забронировать комнату онлайн?',
                        'answer' => 'Да, можно воспользоваться нашей формой бронирования.'
                    ],
                    [
                        'question' => 'Могут ли мне вернуть деньги за бронь?',
                        'answer' => 'Да, позвоните нам по номеру телефона 8 (950) 930 - 28 - 93 или напишите на почту GameOver@gmail.com'
                    ],
                    [
                        'question' => 'Какая комната самая популярная?',
                        'answer' => 'Самая популярная комната - StarWars, к нам приходит очень много фанатов этой саги.'
                    ],
                    [
                        'question' => 'Как получить VIP карту?',
                        'answer' => 'Вы можете позвонить нам по номеру телефона 8 (950) 930 - 28 - 93 или написать на почту GameOver@gmail.com'
                    ],
                    [
                        'question' => 'Сколько по времени занимает одна бронь?',
                        'answer' => 'Одна бронь - это 3 часа, оплата производится пакетом независимо от количества гостей.'
                    ]
                ]
            ]
        ])
    </x-container>
@endsection
