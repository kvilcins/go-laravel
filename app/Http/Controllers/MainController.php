<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MainController extends Controller
{
    public function index()
    {
        $rooms = config('booking.rooms');
        $entertainments = config('booking.entertainment');

        return view('pages.index', compact('rooms', 'entertainments'));
    }
}
