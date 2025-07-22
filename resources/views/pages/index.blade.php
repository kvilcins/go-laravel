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
                    'description' => 'VR headsets',
                    'modal_title' => 'Virtual Reality Experience',
                    'modal_description' => 'Immerse yourself in cutting-edge VR technology with our premium headsets. Experience games, virtual worlds, and interactive entertainment like never before. Our VR setup supports multiple players and offers a library of the latest VR games and experiences.'
                ],
                [
                    'class' => 'audio',
                    'image' => 'entertainment/audio.jpg',
                    'description' => '5.1 audio system with excellent sound',
                    'modal_title' => 'Premium Audio System',
                    'modal_description' => 'Our state-of-the-art 5.1 surround sound system delivers crystal-clear audio that will enhance every gaming session, movie night, or karaoke performance. Experience rich, immersive sound that puts you right in the action.'
                ],
                [
                    'class' => 'karaoke',
                    'image' => 'entertainment/karaoke.jpg',
                    'description' => 'Karaoke (4 microphones)',
                    'modal_title' => 'Karaoke Entertainment',
                    'modal_description' => 'Sing your heart out with our professional karaoke setup featuring 4 wireless microphones. With an extensive song library spanning multiple genres and languages, perfect for group entertainment and memorable moments with friends.'
                ],
                [
                    'class' => 'games',
                    'image' => 'entertainment/games.jpg',
                    'description' => 'Board games',
                    'modal_title' => 'Board Game Collection',
                    'modal_description' => 'Take a break from digital entertainment with our curated collection of popular board games. From strategy games to party games, we have something for every group size and preference. Perfect for socializing and friendly competition.'
                ],
                [
                    'class' => 'movies',
                    'image' => 'entertainment/movies.jpg',
                    'description' => 'Movie services Netflix, Disney+, Hulu, Amazon Prime, HBO Max',
                    'modal_title' => 'Streaming Services',
                    'modal_description' => 'Access to premium streaming platforms including Netflix, Disney+, Hulu, Amazon Prime, and HBO Max. Watch the latest movies, TV shows, and exclusive content on our large screens with premium sound quality.'
                ],
                [
                    'class' => 'ps',
                    'image' => 'entertainment/ps5.jpg',
                    'description' => 'PlayStation 5',
                    'modal_title' => 'PlayStation 5 Gaming',
                    'modal_description' => 'Experience next-generation gaming with the PlayStation 5. Enjoy lightning-fast loading times, stunning 4K graphics, and exclusive PS5 titles. Our gaming library includes the latest releases and multiplayer favorites.'
                ]
            ]
        ])

        @include('blocks.rooms', [
            'title' => 'Our rooms',
            'items' => [
                [
                    'class' => '80s',
                    'image' => 'rooms/80s-vibes.jpg',
                    'description' => "80's vibes",
                    'modal_title' => "80's Vibes Room",
                    'modal_description' => 'Step back in time to the neon-soaked decade of the 80s. This room features retro arcade games, vintage decorations, and a soundtrack that will transport you to the golden age of gaming. Perfect for nostalgic gaming sessions and themed parties.'
                ],
                [
                    'class' => 'star-wars',
                    'image' => 'rooms/star-wars.jpg',
                    'description' => 'Star wars',
                    'modal_title' => 'Star Wars Galaxy',
                    'modal_description' => 'Experience the Star Wars universe in our themed room complete with authentic decorations, lighting effects, and immersive atmosphere. Whether you\'re a Jedi or Sith, this room will make you feel like you\'re in a galaxy far, far away.'
                ],
                [
                    'class' => 'wild-west',
                    'image' => 'rooms/wild-west.jpg',
                    'description' => 'Wild west',
                    'modal_title' => 'Wild West Saloon',
                    'modal_description' => 'Saddle up for an adventure in our Wild West themed room. With rustic decorations, western music, and frontier atmosphere, you\'ll feel like a true cowboy. Perfect for western-themed games and experiencing the American frontier spirit.'
                ],
                [
                    'class' => 'neon-style',
                    'image' => 'rooms/neon-style.jpg',
                    'description' => 'Neon style',
                    'modal_title' => 'Neon Future',
                    'modal_description' => 'Enter a cyberpunk paradise with our Neon Style room. Featuring vibrant LED lighting, futuristic decorations, and a high-tech atmosphere that will immerse you in a world of tomorrow. Ideal for sci-fi gaming and modern entertainment experiences.'
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
                        'alt' => 'VR games',
                        'modal_title' => 'VR Gaming Setup',
                        'modal_description' => 'Our VR gaming area features the latest virtual reality technology, providing an immersive experience that transports you to other worlds. With spacious play areas and premium equipment, safety and fun are our top priorities.'
                    ],
                    [
                        'class' => 'games',
                        'image' => 'about-us-2.jpg',
                        'alt' => 'Board games',
                        'modal_title' => 'Board Game Corner',
                        'modal_description' => 'When you need a break from digital entertainment, our board game collection offers classic and modern games for all ages. A perfect way to bond with friends and family in a relaxed, social environment.'
                    ],
                    [
                        'class' => 'fifa',
                        'image' => 'about-us-3.jpg',
                        'alt' => 'FIFA game',
                        'modal_title' => 'FIFA Gaming Station',
                        'modal_description' => 'Experience the thrill of football with our FIFA gaming setup. Compete with friends in tournaments, practice your skills, or enjoy casual matches on our high-quality gaming systems with comfortable seating.'
                    ],
                    [
                        'class' => 'pad',
                        'image' => 'about-us-4.jpg',
                        'alt' => 'Game controller',
                        'modal_title' => 'Gaming Controllers',
                        'modal_description' => 'Our gaming stations are equipped with premium controllers for the ultimate gaming experience. Whether you prefer PlayStation, Xbox, or PC gaming, we have the right equipment for every gaming preference.'
                    ],
                    [
                        'class' => 'controller',
                        'image' => 'about-us-5.jpg',
                        'alt' => 'Gamepad',
                        'modal_title' => 'Multi-Platform Gaming',
                        'modal_description' => 'We support multiple gaming platforms to ensure everyone can enjoy their favorite games. From console exclusives to PC masterpieces, our diverse gaming setup caters to all gaming preferences and skill levels.'
                    ],
                    [
                        'class' => 'karaoke',
                        'image' => 'about-us-6.jpg',
                        'alt' => 'Karaoke system',
                        'modal_title' => 'Karaoke Entertainment',
                        'modal_description' => 'Our professional karaoke system features an extensive song library, multiple microphones, and excellent sound quality. Perfect for celebrations, team building, or just having fun with friends and family.'
                    ],
                    [
                        'class' => 'vr2',
                        'image' => 'about-us-7.jpg',
                        'alt' => 'VR headsets',
                        'modal_title' => 'Advanced VR Technology',
                        'modal_description' => 'Experience the future of entertainment with our cutting-edge VR headsets. From action-packed adventures to relaxing virtual experiences, our VR technology offers endless possibilities for fun and exploration.'
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
                        'name' => 'Michael Rodriguez',
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
                        'name' => 'Alex Thompson',
                        'photo' => 'maxim.png',
                        'text' => 'We celebrated a birthday here with a group of friends, everything was very cool! VR headsets are just amazing, I have never been in such complete gaming immersion. Service is top notch!',
                        'alt' => 'Photo Alex Thompson'
                    ],
                    [
                        'name' => 'Sarah Williams',
                        'photo' => 'oksana.png',
                        'text' => 'We were in the Wild West room, sang karaoke to Shakira, it was a great corporate event! There are no similar establishments in our city',
                        'alt' => 'Photo Sarah Williams'
                    ],
                    [
                        'name' => 'Jake Martinez',
                        'photo' => 'nikita.png',
                        'text' => 'The VR headset game lagged a bit, but otherwise everything was fine. Cool design of the room in Star Wars style, got into the atmosphere of space',
                        'alt' => 'Photo Jake Martinez'
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
                        'answer' => 'Yes, call us at (305) 555-1234 or email GameOver@gmail.com'
                    ],
                    [
                        'question' => 'Which room is the most popular?',
                        'answer' => 'The most popular room is StarWars, we have a lot of fans of this saga coming to us.'
                    ],
                    [
                        'question' => 'How to get a VIP card?',
                        'answer' => 'You can call us at (305) 555-1234 or email GameOver@gmail.com'
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
