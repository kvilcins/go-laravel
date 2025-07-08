<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New callback request</title>
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
        .field {
            margin-bottom: 20px;
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
        <h1>New callback request</h1>
    </div>
    <div class="email-body">
        <div class="field">
            <div class="field-label">Name:</div>
            <div class="field-value">{!! get_data($data, 'name') !!}</div>
        </div>

        <div class="field">
            <div class="field-label">Phone:</div>
            <div class="field-value">{!! get_data($data, 'phone') !!}</div>
        </div>

        @if(has_data($data, 'email'))
            <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value">{!! get_data($data, 'email') !!}</div>
            </div>
        @endif

        @if(has_data($data, 'message'))
            <div class="field">
                <div class="field-label">Comment:</div>
                <div class="field-value">{!! get_data($data, 'message') !!}</div>
            </div>
        @endif

        <div class="field">
            <div class="field-label">Date and time:</div>
            <div class="field-value">{!! now()->format('d.m.Y H:i') !!}</div>
        </div>
    </div>
    <div class="email-footer">
        Request sent from {!! config('app.name') !!} website
    </div>
</div>
</body>
</html>
