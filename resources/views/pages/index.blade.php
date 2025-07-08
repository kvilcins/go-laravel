@extends('layouts.main')

@section('title', 'Homepage')

@section('content')
    <x-container class="main--home" container-class="container--main">
        @include('blocks.main-banner', [
            'data' => [
                'subtitle' => 'Game Over',
                'title' => 'New format of games and entertainment',
                'advantages' => [
                    [
                        'text' => '4',
                        'class' => 'main-banner__advantage-number--purple',
                        'description' => 'Themed rooms'
                    ],
                    [
                        'text' => 'new',
                        'class' => 'main-banner__advantage-number--small-caps',
                        'description' => 'Latest equipment'
                    ]
                ],
                'button' => [
                    'text' => 'Book now',
                    'url' => 'booking'
                ],
                'scroll_link' => [
                    'url' => 'entertainment'
                ]
            ]
        ])

        @include('blocks.entertainment', [
            'title' => 'We have everything for an awesome time with friends!',
            'items' => [
                [
                    'class' => 'vr',
                    'image' => 'entertainment/vr.jpg',
                    'description' => 'VR headsets'
                ],
                [
                    'class' => 'audio',
                    'image' => 'entertainment/audio.jpg',
                    'description' => '5.1 audio system with excellent sound'
                ],
                [
                    'class' => 'karaoke',
                    'image' => 'entertainment/karaoke.jpg',
                    'description' => 'Karaoke (4 microphones)'
                ],
                [
                    'class' => 'games',
                    'image' => 'entertainment/games.jpg',
                    'description' => 'Board games'
                ],
                [
                    'class' => 'movies',
                    'image' => 'entertainment/movies.jpg',
                    'description' => 'Movie services Netflix, IVI, MegoGo, КиноПоиск, Okko'
                ],
                [
                    'class' => 'ps',
                    'image' => 'entertainment/ps5.jpg',
                    'description' => 'PlayStation 5'
                ]
            ]
        ])

        @include('blocks.rooms', [
            'title' => 'Our rooms',
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
                'title' => 'About us',
                'gallery' => [
                    [
                        'class' => 'vr',
                        'image' => 'about-us-1.jpg',
                        'alt' => 'VR games'
                    ],
                    [
                        'class' => 'games',
                        'image' => 'about-us-2.jpg',
                        'alt' => 'Board games'
                    ],
                    [
                        'class' => 'fifa',
                        'image' => 'about-us-3.jpg',
                        'alt' => 'FIFA game'
                    ],
                    [
                        'class' => 'pad',
                        'image' => 'about-us-4.jpg',
                        'alt' => 'Game controller'
                    ],
                    [
                        'class' => 'controller',
                        'image' => 'about-us-5.jpg',
                        'alt' => 'Gamepad'
                    ],
                    [
                        'class' => 'karaoke',
                        'image' => 'about-us-6.jpg',
                        'alt' => 'Karaoke system'
                    ],
                    [
                        'class' => 'vr2',
                        'image' => 'about-us-7.jpg',
                        'alt' => 'VR headsets'
                    ]
                ],
                'descriptions' => [
                    'For our guests, we have created a conceptually new virtual reality gaming space in the central part of the city.',
                    'Every day we strive to create the best gaming atmosphere for you and delight you with top gaming developments from around the world.'
                ],
                'quote' => [
                    'highlight' => 'GAME OVER',
                    'text' => ' — is a place of unforgettable experiences',
                    'author' => [
                        'name' => 'Arkady Abakin',
                        'position' => 'creator of GAME OVER gaming territory',
                        'photo' => 'creators-icon.png'
                    ]
                ]
            ]
        ])

        @include('blocks.feedbacks', [
            'data' => [
                'title' => 'Customer reviews',
                'reviews' => [
                    [
                        'name' => 'Max Samoylov',
                        'photo' => 'maxim.png',
                        'text' => 'We celebrated a birthday here with a group of friends, everything was very cool! VR headsets are just amazing, I have never been in such complete gaming immersion. Service is top notch!',
                        'alt' => 'Photo Max Samoylov'
                    ],
                    [
                        'name' => 'Oksana Grigorieva',
                        'photo' => 'oksana.png',
                        'text' => 'We were in the Wild West room, sang karaoke to Shakira, it was a great corporate event! There are no similar establishments in our city',
                        'alt' => 'Photo Oksana Grigorieva'
                    ],
                    [
                        'name' => 'Nikita Yashchenko',
                        'photo' => 'nikita.png',
                        'text' => 'The VR headset game lagged a bit, but otherwise everything was fine. Cool design of the room in Star Wars style, got into the atmosphere of space',
                        'alt' => 'Photo Nikita Yashchenko'
                    ]
                ]
            ]
        ])

        @include('blocks.faq', [
            'data' => [
                'title' => 'Frequently asked questions',
                'questions' => [
                    [
                        'question' => 'Can I book a room online?',
                        'answer' => 'Yes, you can use our booking form.'
                    ],
                    [
                        'question' => 'Can I get a refund for my booking?',
                        'answer' => 'Yes, call us at 8 (950) 930 - 28 - 93 or email GameOver@gmail.com'
                    ],
                    [
                        'question' => 'Which room is the most popular?',
                        'answer' => 'The most popular room is StarWars, we have a lot of fans of this saga coming to us.'
                    ],
                    [
                        'question' => 'How to get a VIP card?',
                        'answer' => 'You can call us at 8 (950) 930 - 28 - 93 or email GameOver@gmail.com'
                    ],
                    [
                        'question' => 'How long does one booking session last?',
                        'answer' => 'One booking session is 3 hours, payment is made as a package regardless of the number of guests.'
                    ]
                ]
            ]
        ])
    </x-container>
@endsection
