<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Booking</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 700px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .email-header {
            background-color: #CD06FF;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
        }
        .email-body {
            padding: 30px;
        }
        .booking-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        .field {
            margin-bottom: 15px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
            border-left: 4px solid #CD06FF;
        }
        .field-label {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .field-value {
            color: #666;
            font-size: 16px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin: 25px 0 15px 0;
            border-bottom: 2px solid #CD06FF;
            padding-bottom: 5px;
        }
        .options-list {
            background-color: #f0f0f0;
            padding: 10px 15px;
            border-radius: 5px;
            margin-top: 5px;
        }
        .urgent {
            background-color: #ffebee;
            border: 2px solid #f44336;
            color: #d32f2f;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: bold;
        }
        .email-footer {
            background-color: #1B1A1B;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 14px;
        }
    </style>
</head>
<body>
<div class="email-container">
    <div class="email-header">
        <h1>New Booking</h1>
    </div>
    <div class="email-body">
        <div class="urgent">
            REQUIRES CONFIRMATION
        </div>

        <div class="booking-info">
            <div>
                <div class="field">
                    <div class="field-label">Room:</div>
                    <div class="field-value">
                        @php
                            $halls = [
                                '80s-vibes' => '80\'s Vibes',
                                'star-wars' => 'Star Wars',
                                'wild-west' => 'Wild West',
                                'neon-style' => 'Neon Style'
                            ];
                        @endphp
                        {!! get_data($halls, get_data($data, 'hall'), get_data($data, 'hall')) !!}
                    </div>
                </div>

                <div class="field">
                    <div class="field-label">Date:</div>
                    <div class="field-value">{!! get_data($data, 'date', 'Not specified') !!}</div>
                </div>

                <div class="field">
                    <div class="field-label">Time:</div>
                    <div class="field-value">{!! get_data($data, 'time', 'Not specified') !!}</div>
                </div>

                <div class="field">
                    <div class="field-label">Number of people:</div>
                    <div class="field-value">{!! get_data($data, 'amount', get_data($data, 'people_count', 'Not specified')) !!}</div>
                </div>
            </div>

            <div>
                <div class="field">
                    <div class="field-label">First Name:</div>
                    <div class="field-value">{!! get_data($data, 'first-name', get_data($data, 'first_name', 'Not specified')) !!}</div>
                </div>

                <div class="field">
                    <div class="field-label">Last Name:</div>
                    <div class="field-value">{!! get_data($data, 'last-name', get_data($data, 'last_name', 'Not specified')) !!}</div>
                </div>

                <div class="field">
                    <div class="field-label">Phone:</div>
                    <div class="field-value">{!! get_data($data, 'phone', 'Not specified') !!}</div>
                </div>

                @if(has_data($data, 'email'))
                    <div class="field">
                        <div class="field-label">Email:</div>
                        <div class="field-value">{!! get_data($data, 'email') !!}</div>
                    </div>
                @endif
            </div>
        </div>

        @if(has_data($data, 'console'))
            <div class="section-title">Selected Console</div>
            <div class="field">
                <div class="field-value">
                    @php
                        $consoles = [
                            'playstation' => 'PlayStation',
                            'sega' => 'Sega',
                            'xbox' => 'Xbox',
                            'dendy' => 'Dendy'
                        ];
                    @endphp
                    {!! get_data($consoles, get_data($data, 'console'), get_data($data, 'console')) !!}
                </div>
            </div>
        @endif

        @if(has_data($data, 'games') && count(get_data($data, 'games', [])) > 0)
            <div class="section-title">Board Games</div>
            <div class="options-list">
                @foreach(get_data($data, 'games', []) as $game)
                    @php
                        $games = [
                            'jenga' => 'Jenga',
                            'monopoly' => 'Monopoly',
                            'manchkin' => 'Munchkin',
                            'alias' => 'Alias'
                        ];
                    @endphp
                    • {!! get_data($games, $game, $game) !!}<br>
                @endforeach
            </div>
        @endif

        @if(has_data($data, 'additional') && count(get_data($data, 'additional', [])) > 0)
            <div class="section-title">Additional Services</div>
            <div class="options-list">
                @foreach(get_data($data, 'additional', []) as $item)
                    @php
                        $additional = [
                            'karaoke' => 'Karaoke',
                            'vr' => 'VR'
                        ];
                    @endphp
                    • {!! get_data($additional, $item, $item) !!}<br>
                @endforeach
            </div>
        @endif

        <div class="field">
            <div class="field-label">Request time:</div>
            <div class="field-value">{!! now()->format('d.m.Y \a\t H:i') !!}</div>
        </div>
    </div>
    <div class="email-footer">
        Booking from {!! config('app.name') !!} website
    </div>
</div>
</body>
</html>
