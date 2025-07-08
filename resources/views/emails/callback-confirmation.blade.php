<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your request has been accepted</title>
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
        <h1>Thank you for contacting us!</h1>
    </div>
    <div class="email-body">
        <div class="success-message">
            <strong>Your request has been successfully accepted and will be reviewed shortly</strong>
        </div>

        <p>Hello, {!! get_data($data, 'name') !!}!</p>

        <p>We have received your callback request. Our manager will contact you during business hours.</p>

        <h3>Your request details:</h3>

        <div class="field">
            <div class="field-label">Name:</div>
            <div class="field-value">{!! get_data($data, 'name') !!}</div>
        </div>

        <div class="field">
            <div class="field-label">Phone:</div>
            <div class="field-value">{!! get_data($data, 'phone') !!}</div>
        </div>

        @if(has_data($data, 'message'))
            <div class="field">
                <div class="field-label">Your comment:</div>
                <div class="field-value">{!! get_data($data, 'message') !!}</div>
            </div>
        @endif

        <div class="field">
            <div class="field-label">Request date:</div>
            <div class="field-value">{!! now()->format('d.m.Y \a\t H:i') !!}</div>
        </div>

        <div class="contact-info">
            <h3 style="margin-top: 0;">Contact information:</h3>
            <p>If you have any questions, you can contact us:</p>
            <p><strong>Phone:</strong> +7 (XXX) XXX-XX-XX</p>
            <p><strong>Email:</strong> info@go-games.local</p>
        </div>
    </div>
    <div class="email-footer">
        Best regards, {!! config('app.name') !!} team
    </div>
</div>
</body>
</html>
