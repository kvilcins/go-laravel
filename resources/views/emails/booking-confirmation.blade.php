<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ваше бронирование принято</title>
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
        <h1>Ваше бронирование принято!</h1>
    </div>
    <div class="email-body">
        <div class="success-message">
            Спасибо за выбор нашего игрового клуба!<br>
            Ваша заявка на бронирование принята и ожидает подтверждения
        </div>

        <p>Здравствуйте, {{ $data['first-name'] ?? $data['first_name'] }}!</p>

        <p>Мы получили вашу заявку на бронирование игрового зала. Наш администратор свяжется с вами в ближайшее время для подтверждения.</p>

        <div class="booking-details">
            <h3 style="margin-top: 0; color: #6C0287;">Детали вашего бронирования:</h3>

            <div class="detail-row">
                <span class="detail-label">Зал:</span>
                <span class="detail-value">
                        @php
                            $halls = [
                                '80s-vibes' => '80\'s Vibes',
                                'star-wars' => 'Star Wars',
                                'wild-west' => 'Wild West',
                                'neon-style' => 'Neon Style'
                            ];
                        @endphp
                    {{ $halls[$data['hall']] ?? $data['hall'] }}
                    </span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Дата:</span>
                <span class="detail-value">{{ $data['date'] ?? 'Не указана' }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Время:</span>
                <span class="detail-value">{{ $data['time'] ?? 'Не указано' }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Количество человек:</span>
                <span class="detail-value">{{ $data['amount'] ?? $data['people_count'] ?? 'Не указано' }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Контактный телефон:</span>
                <span class="detail-value">{{ $data['phone'] ?? 'Не указан' }}</span>
            </div>
        </div>

        @if(!empty($data['console']))
            <div class="section-title">Выбранная приставка</div>
            <div class="options-list">
                @php
                    $consoles = [
                        'playstation' => 'PlayStation',
                        'sega' => 'Sega',
                        'xbox' => 'Xbox',
                        'dendy' => 'Dendy'
                    ];
                @endphp
                {{ $consoles[$data['console']] ?? $data['console'] }}
            </div>
        @endif

        @if(!empty($data['games']) && count($data['games']) > 0)
            <div class="section-title">Настольные игры</div>
            <div class="options-list">
                @foreach($data['games'] as $game)
                    @php
                        $games = [
                            'jenga' => 'Jenga',
                            'monopoly' => 'Monopoly',
                            'manchkin' => 'Munchkin',
                            'alias' => 'Alias'
                        ];
                    @endphp
                    • {{ $games[$game] ?? $game }}<br>
                @endforeach
            </div>
        @endif

        @if(!empty($data['additional']) && count($data['additional']) > 0)
            <div class="section-title">Дополнительные услуги</div>
            <div class="options-list">
                @foreach($data['additional'] as $item)
                    @php
                        $additional = [
                            'karaoke' => 'Karaoke',
                            'vr' => 'VR'
                        ];
                    @endphp
                    • {{ $additional[$item] ?? $item }}<br>
                @endforeach
            </div>
        @endif

        <div class="important-note">
            <strong>Важно:</strong> Ваше бронирование будет подтверждено после связи с администратором. Мы рекомендуем прибыть за 10-15 минут до начала сеанса.
        </div>

        <div class="contact-info">
            <h3>Наши контакты:</h3>
            <p><strong>Телефон:</strong> +7 (XXX) XXX-XX-XX</p>
            <p><strong>Email:</strong> info@go-games.local</p>
            <p><strong>Адрес:</strong> г. Город, ул. Игровая, 1</p>
            <p><strong>Режим работы:</strong> Ежедневно с 10:00 до 23:00</p>
        </div>
    </div>
    <div class="email-footer">
        С нетерпением ждем вас в {{ config('app.name') }}!
    </div>
</div>
</body>
</html>
