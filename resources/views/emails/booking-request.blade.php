<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Новое бронирование</title>
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
        <h1>Новое бронирование</h1>
    </div>
    <div class="email-body">
        <div class="urgent">
            ТРЕБУЕТ ПОДТВЕРЖДЕНИЯ
        </div>

        <div class="booking-info">
            <div>
                <div class="field">
                    <div class="field-label">Зал:</div>
                    <div class="field-value">
                        @php
                            $halls = [
                                '80s-vibes' => '80\'s Vibes',
                                'star-wars' => 'Star Wars',
                                'wild-west' => 'Wild West',
                                'neon-style' => 'Neon Style'
                            ];
                        @endphp
                        {{ $halls[$data['hall']] ?? $data['hall'] }}
                    </div>
                </div>

                <div class="field">
                    <div class="field-label">Дата:</div>
                    <div class="field-value">{{ $data['date'] ?? 'Не указана' }}</div>
                </div>

                <div class="field">
                    <div class="field-label">Время:</div>
                    <div class="field-value">{{ $data['time'] ?? 'Не указано' }}</div>
                </div>

                <div class="field">
                    <div class="field-label">Количество человек:</div>
                    <div class="field-value">{{ $data['amount'] ?? $data['people_count'] ?? 'Не указано' }}</div>
                </div>
            </div>

            <div>
                <div class="field">
                    <div class="field-label">Имя:</div>
                    <div class="field-value">{{ $data['first-name'] ?? $data['first_name'] ?? 'Не указано' }}</div>
                </div>

                <div class="field">
                    <div class="field-label">Фамилия:</div>
                    <div class="field-value">{{ $data['last-name'] ?? $data['last_name'] ?? 'Не указана' }}</div>
                </div>

                <div class="field">
                    <div class="field-label">Телефон:</div>
                    <div class="field-value">{{ $data['phone'] ?? 'Не указан' }}</div>
                </div>

                @if(!empty($data['email']))
                    <div class="field">
                        <div class="field-label">Email:</div>
                        <div class="field-value">{{ $data['email'] }}</div>
                    </div>
                @endif
            </div>
        </div>

        @if(!empty($data['console']))
            <div class="section-title">Выбранная приставка</div>
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
                    {{ $consoles[$data['console']] ?? $data['console'] }}
                </div>
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

        <div class="field">
            <div class="field-label">Время подачи заявки:</div>
            <div class="field-value">{{ now()->format('d.m.Y в H:i') }}</div>
        </div>
    </div>
    <div class="email-footer">
        Бронирование с сайта {{ config('app.name') }}
    </div>
</div>
</body>
</html>
