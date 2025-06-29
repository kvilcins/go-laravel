<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ваша заявка принята</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
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
            border: 1px solid #4caf50;
            color: #2e7d32;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }
        .field {
            margin-bottom: 15px;
            padding: 12px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        .field-label {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .field-value {
            color: #666;
        }
        .contact-info {
            background-color: #CD06FF;
            color: white;
            padding: 20px;
            border-radius: 5px;
            margin-top: 20px;
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
        <h1>Спасибо за обращение!</h1>
    </div>
    <div class="email-body">
        <div class="success-message">
            <strong>Ваша заявка успешно принята и будет рассмотрена в ближайшее время</strong>
        </div>

        <p>Здравствуйте, {{ $data['name'] }}!</p>

        <p>Мы получили вашу заявку на обратный звонок. Наш менеджер свяжется с вами в течение рабочего дня.</p>

        <h3>Данные вашей заявки:</h3>

        <div class="field">
            <div class="field-label">Имя:</div>
            <div class="field-value">{{ $data['name'] }}</div>
        </div>

        <div class="field">
            <div class="field-label">Телефон:</div>
            <div class="field-value">{{ $data['phone'] }}</div>
        </div>

        @if(!empty($data['message']))
            <div class="field">
                <div class="field-label">Ваш комментарий:</div>
                <div class="field-value">{{ $data['message'] }}</div>
            </div>
        @endif

        <div class="field">
            <div class="field-label">Дата подачи заявки:</div>
            <div class="field-value">{{ now()->format('d.m.Y в H:i') }}</div>
        </div>

        <div class="contact-info">
            <h3 style="margin-top: 0;">Контактная информация:</h3>
            <p>Если у вас возникли вопросы, вы можете связаться с нами:</p>
            <p><strong>Телефон:</strong> +7 (XXX) XXX-XX-XX</p>
            <p><strong>Email:</strong> info@go-games.local</p>
        </div>
    </div>
    <div class="email-footer">
        С уважением, команда {{ config('app.name') }}
    </div>
</div>
</body>
</html>
