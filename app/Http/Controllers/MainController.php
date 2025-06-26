<?php

namespace App\Http\Controllers;

use App\Http\Controllers\DataController;
use Illuminate\Http\Request;

class MainController extends Controller
{
    public function index()
    {

        return view('pages.index');
    }
}
