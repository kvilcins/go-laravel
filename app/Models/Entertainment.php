<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entertainment extends Model
{
    protected $fillable = ['type', 'value', 'label'];

    public function bookings()
    {
        return $this->belongsToMany(Booking::class, 'booking_entertainment');
    }
}
