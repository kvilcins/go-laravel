<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

class BookingController extends Controller
{
    public function showForm()
    {
        $rooms = config('booking.rooms');
        $entertainments = config('booking.entertainment');

        return view('booking.form', compact('rooms', 'entertainments'));
    }

    public function availableSlots(Request $request)
    {
        try {
            \Log::info('availableSlots called', ['request_data' => $request->all()]);

            $request->validate([
                'room_id' => 'required|integer',
                'date' => ['required', 'date_format:Y-m-d'],
            ]);

            \Log::info('Validation passed');

            $selectedDate = Carbon::createFromFormat('Y-m-d', $request->date);
            $today = Carbon::today();
            $currentTime = Carbon::now();
            $currentHour = $currentTime->hour;
            $currentMinute = $currentTime->minute;

            $timeSlots = [];
            for ($hour = 12; $hour < 22; $hour++) {
                $timeSlots[] = ['value' => sprintf('%02d:00', $hour), 'label' => sprintf('%02d:00', $hour)];
                $timeSlots[] = ['value' => sprintf('%02d:30', $hour), 'label' => sprintf('%02d:30', $hour)];
            }

            if ($selectedDate->isSameDay($today)) {
                $timeSlots = array_filter($timeSlots, function($slot) use ($currentHour, $currentMinute) {
                    [$slotHour, $slotMinute] = explode(':', $slot['value']);
                    $slotHour = (int) $slotHour;
                    $slotMinute = (int) $slotMinute;

                    if ($slotHour > $currentHour) return true;
                    if ($slotHour === $currentHour && $slotMinute > $currentMinute) return true;
                    return false;
                });
                $timeSlots = array_values($timeSlots);
            }

            $bookedSlots = [];

            return response()->json([
                'available_times' => array_values($timeSlots),
                'booked_times' => $bookedSlots,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in availableSlots', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function checkAvailability(Request $request)
    {
        try {
            $request->validate([
                'room_id' => 'required|integer',
                'date' => ['required', 'date_format:Y-m-d'],
                'time' => 'required|string',
            ]);

            $exists = \DB::table('bookings')
                ->where('room_id', $request->room_id)
                ->where('date', $request->date)
                ->where('time', $request->time)
                ->exists();

            return response()->json(['available' => !$exists]);
        } catch (\Exception $e) {
            \Log::error('Error in checkAvailability', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function submitForm(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|integer',
            'date' => ['required', 'date_format:Y-m-d'],
            'time_slot_id' => 'required|string',
            'amount' => 'required|integer|min:1|max:20',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => ['required', 'regex:/^\+?[7-8]-?[0-9]{3}-?[0-9]{3}-?[0-9]{2}-?[0-9]{2}$/'],
            'email' => 'nullable|email|max:255',
            'console' => 'nullable|string',
            'games' => 'nullable|array',
            'additional' => 'nullable|array',
        ]);

        $exists = \DB::table('bookings')
            ->where('room_id', $validated['room_id'])
            ->where('date', $validated['date'])
            ->where('time', $validated['time_slot_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Выбранное время уже занято для этой комнаты'
            ]);
        }

        try {
            \DB::table('bookings')->insert([
                'room_id' => $validated['room_id'],
                'date' => $validated['date'],
                'time' => $validated['time_slot_id'],
                'amount' => $validated['amount'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'phone' => $validated['phone'],
                'email' => $validated['email'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Бронирование успешно создано!'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in submitForm: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при создании бронирования'
            ]);
        }
    }
}
