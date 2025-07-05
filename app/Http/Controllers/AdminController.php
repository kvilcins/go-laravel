<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'callback_requests' => DB::table('callback_requests')->count(),
            'bookings' => DB::table('bookings')->count(),
            'today_callbacks' => DB::table('callback_requests')->whereDate('created_at', today())->count(),
            'today_bookings' => DB::table('bookings')->whereDate('created_at', today())->count(),
        ];

        return view('admin.dashboard', compact('stats'));
    }

    public function callbackRequests()
    {
        $requests = DB::table('callback_requests')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return view('admin.callbacks', compact('requests'));
    }

    public function bookings()
    {
        $bookings = DB::table('bookings')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $rooms = DB::table('rooms')->pluck('label', 'id')->toArray();

        return view('admin.bookings', compact('bookings', 'rooms'));
    }

    public function availableDates()
    {
        $dates = DB::table('available_dates')
            ->orderBy('date', 'asc')
            ->paginate(20);

        return view('admin.available-dates', compact('dates'));
    }

    public function roomAvailability()
    {
        $availability = DB::table('room_availability')
            ->join('available_dates', 'room_availability.date_id', '=', 'available_dates.id')
            ->join('time_slots', 'room_availability.time_slot_id', '=', 'time_slots.id')
            ->select('room_availability.*', 'available_dates.formatted_date', 'time_slots.label as time_label')
            ->orderBy('available_dates.date', 'asc')
            ->orderBy('room_availability.room_id', 'asc')
            ->orderBy('time_slots.label', 'asc')
            ->paginate(30);

        $rooms = DB::table('rooms')->pluck('label', 'id')->toArray();

        return view('admin.room-availability', compact('availability', 'rooms'));
    }

    public function storeDate(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'is_active' => 'boolean'
        ]);

        $date = Carbon::parse($validated['date']);

        DB::table('available_dates')->updateOrInsert(
            ['date' => $date->format('Y-m-d')],
            [
                'date' => $date->format('Y-m-d'),
                'formatted_date' => $date->format('d.m.Y'),
                'day_name' => $date->translatedFormat('D'),
                'is_active' => $validated['is_active'] ?? true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        return redirect()->route('admin.available-dates')->with('success', 'Дата добавлена успешно');
    }

    public function toggleDate($id)
    {
        $date = DB::table('available_dates')->where('id', $id)->first();

        if ($date) {
            DB::table('available_dates')
                ->where('id', $id)
                ->update([
                    'is_active' => !$date->is_active,
                    'updated_at' => now()
                ]);
        }

        return redirect()->route('admin.available-dates')->with('success', 'Статус даты изменен');
    }

    public function deleteDate($id)
    {
        DB::table('available_dates')->where('id', $id)->delete();
        return redirect()->route('admin.available-dates')->with('success', 'Дата удалена');
    }

    public function toggleRoomAvailability($id)
    {
        $availability = DB::table('room_availability')->where('id', $id)->first();

        if ($availability) {
            DB::table('room_availability')
                ->where('id', $id)
                ->update([
                    'is_available' => !$availability->is_available,
                    'updated_at' => now()
                ]);
        }

        return redirect()->route('admin.room-availability')->with('success', 'Доступность изменена');
    }

    public function deleteCallback($id)
    {
        DB::table('callback_requests')->where('id', $id)->delete();
        return redirect()->route('admin.callback-requests')->with('success', 'Заявка удалена');
    }

    public function deleteBooking($id)
    {
        DB::table('booking_entertainment')->where('booking_id', $id)->delete();
        DB::table('bookings')->where('id', $id)->delete();
        return redirect()->route('admin.bookings')->with('success', 'Бронирование удалено');
    }

    public function createDate()
    {
        return view('admin.components.create-date');
    }
}
