<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use App\Mail\CallbackRequestMail;
use App\Mail\CallbackConfirmationMail;

class MailService
{
    public function sendCallbackRequest($data)
    {
        Mail::to(config('mail.admin_email'))->send(new CallbackRequestMail($data));

        if (!empty($data['email'])) {
            Mail::to($data['email'])->send(new CallbackConfirmationMail($data));
        }

        return true;
    }

    public function sendBookingRequest($data)
    {
        Mail::to(config('mail.admin_email'))->send(new BookingRequestMail($data));

        if (!empty($data['email'])) {
            Mail::to($data['email'])->send(new BookingConfirmationMail($data));
        }

        return true;
    }
}
