<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your booking has been accepted</title>
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
            background-color: #6C0287;
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
            line-height: 1.6;
        }
        .success-message {
            background-color: #e8f5e8;
            border: 2px solid #4caf50;
            color: #2e7d32;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            text-align: center;
            font-weight: bold;
            font-size: 18px;
        }
        .booking-details {
            background-color: #f8f4ff;
            border: 2px solid #CD06FF;
            border-radius: 8px;
            padding: 25px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px dotted #ddd;
        }
        .detail-label {
            font-weight: bold;
            color: #333;
        }
        .detail-value {
            color: #666;
            text-align: right;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #6C0287;
            margin: 25px 0 15px 0;
            border-bottom: 2px solid #CD06FF;
            padding-bottom: 5px;
        }
        .options-list {
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .contact-info {
            background-color: #CD06FF;
            color: white;
            padding: 25px;
            border-radius: 8px;
            margin-top: 25px;
        }
        .contact-info h3 {
            margin-top: 0;
            margin-bottom: 15px;
        }
        .important-note {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
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
        <h1>Your booking has been accepted!</h1>
    </div>
    <div class="email-body">
        <div class="success-message">
            Thank you for choosing our gaming club!<br>
            Your booking request has been accepted and is awaiting confirmation
        </div>

        <p>Hello, {!! get_data($data, 'first-name', get_data($data, 'first_name')) !!}!</p>

        <p>We have received your booking request for a gaming room. Our administrator will contact you shortly for confirmation.</p>

        <div class="booking-details">
            <h3 style="margin-top: 0; color: #6C0287;">Your booking details:</h3>

            <div class="detail-row">
                <span class="detail-label">Room:</span>
                <span class="detail-value">
                        @php
                            $halls = [
                                '80s-vibes' => '80\'s Vibes',
                                'star-wars' => 'Star Wars',
                                'wild-west' => 'Wild West',
                                'neon-style' => 'Neon Style'
                            ];
                        @endphp
                    {!! get_data($halls, get_data($data, 'hall'), get_data($data, 'hall')) !!}
                    </span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">{!! get_data($data, 'date', 'Not specified') !!}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">{!! get_data($data, 'time', 'Not specified') !!}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Number of people:</span>
                <span class="detail-value">{!! get_data($data, 'amount', get_data($data, 'people_count', 'Not specified')) !!}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Contact phone:</span>
                <span class="detail-value">{!! get_data($data, 'phone', 'Not specified') !!}</span>
            </div>
        </div>

        @if(has_data($data, 'console'))
            <div class="section-title">Selected Console</div>
            <div class="options-list">
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

        <div class="important-note">
            <strong>Important:</strong> Your booking will be confirmed after our administrator contacts you. We recommend arriving 10-15 minutes before your session starts.
        </div>

        <div class="contact-info">
            <h3>Our contacts:</h3>
            <p><strong>Phone:</strong> +7 (XXX) XXX-XX-XX</p>
            <p><strong>Email:</strong> info@go-games.local</p>
            <p><strong>Address:</strong> City, Gaming Street, 1</p>
            <p><strong>Working hours:</strong> Daily from 10:00 to 23:00</p>
        </div>
    </div>
    <div class="email-footer">
        We look forward to seeing you at {!! config('app.name') !!}!
    </div>
</div>
</body>
</html>
