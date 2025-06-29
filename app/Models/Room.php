<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = ['value', 'label'];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
