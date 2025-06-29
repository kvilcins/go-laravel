<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MainController;
use App\Http\Controllers\CallbackController;
use App\Http\Controllers\BookingController;


// Homepage
Route::get('/', [MainController::class, 'index'])->name('home');

// Email controller
Route::post('/callback', [CallbackController::class, 'send'])->name('callback.send');

// Booking controller
Route::get('/booking', [BookingController::class, 'showForm'])->name('booking.form');
Route::post('/booking', [BookingController::class, 'submitForm'])->name('booking.submit');

Route::post('/booking/available-slots', [BookingController::class, 'availableSlots']);
Route::post('/booking/check-availability', [BookingController::class, 'checkAvailability']);
