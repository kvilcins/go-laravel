<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'room_id', 'date', 'time', 'amount', 'first_name', 'last_name', 'phone', 'email'
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function entertainments()
    {
        return $this->belongsToMany(Entertainment::class, 'booking_entertainment');
    }
}
