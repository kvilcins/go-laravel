<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MainController;
use App\Http\Controllers\CallbackController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AdminController;

// Homepage
Route::get('/', [MainController::class, 'index'])->name('home');

// Email controller
Route::post('/callback', [CallbackController::class, 'send'])->name('callback.send');

// Booking controller
Route::get('/booking', [BookingController::class, 'showForm'])->name('booking.form');

// Validation
Route::post('/api/booking/submit', [BookingController::class, 'submitFormApi'])->name('booking.submit.api');
Route::post('/callback/send', [CallbackController::class, 'send'])->name('callback.send');

// AJAX API for booking
Route::post('/api/booking', [BookingController::class, 'submitFormApi'])->name('booking.api');
Route::get('/booking/available-dates', [BookingController::class, 'getAvailableDates']);
Route::post('/booking/available-slots', [BookingController::class, 'getAvailableSlots']);

// Fallback in case if JS doesn't work
Route::post('/booking', [BookingController::class, 'submitForm'])->name('booking.submit');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/callback-requests', [AdminController::class, 'callbackRequests'])->name('callback-requests');
    Route::get('/bookings', [AdminController::class, 'bookings'])->name('bookings');
    Route::get('/available-dates', [AdminController::class, 'availableDates'])->name('available-dates');
    Route::get('/available-dates/create', [AdminController::class, 'createDate'])->name('create-date');
    Route::get('/room-availability', [AdminController::class, 'roomAvailability'])->name('room-availability');

    Route::post('/room-availability', [AdminController::class, 'storeRoomAvailability'])->name('store-room-availability');
    Route::get('/room-availability/bulk', [AdminController::class, 'createBulkAvailability'])->name('create-bulk-availability');
    Route::post('/room-availability/bulk', [AdminController::class, 'storeBulkAvailability'])->name('store-bulk-availability');

    Route::post('/available-dates', [AdminController::class, 'storeDate'])->name('store-date');
    Route::patch('/available-dates/{id}/toggle', [AdminController::class, 'toggleDate'])->name('toggle-date');
    Route::delete('/available-dates/{id}', [AdminController::class, 'deleteDate'])->name('delete-date');
    Route::patch('/room-availability/{id}/toggle', [AdminController::class, 'toggleRoomAvailability'])->name('toggle-room-availability');
    Route::delete('/callback-requests/{id}', [AdminController::class, 'deleteCallback'])->name('delete-callback');
    Route::delete('/bookings/{id}', [AdminController::class, 'deleteBooking'])->name('delete-booking');
});
