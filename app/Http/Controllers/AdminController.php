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

    public function roomAvailability(Request $request)
    {
        $query = DB::table('room_availability')
            ->join('available_dates', 'room_availability.date_id', '=', 'available_dates.id')
            ->join('time_slots', 'room_availability.time_slot_id', '=', 'time_slots.id')
            ->select('room_availability.*', 'available_dates.formatted_date', 'time_slots.label as time_label');

        if ($request->filled('room_id')) {
            $query->where('room_availability.room_id', $request->room_id);
        }

        if ($request->filled('admin_date')) {
            $query->where('available_dates.date', $request->admin_date);
        }

        if ($request->filled('admin_time_slot_id')) {
            $query->where('room_availability.time_slot_id', $request->admin_time_slot_id);
        }

        if ($request->filled('availability')) {
            $query->where('room_availability.is_available', $request->availability);
        }

        $availability = $query
            ->orderBy('available_dates.date', 'asc')
            ->orderBy('room_availability.room_id', 'asc')
            ->orderBy('time_slots.label', 'asc')
            ->paginate(30)
            ->appends($request->query());

        $rooms = DB::table('rooms')->pluck('label', 'id')->toArray();

        $availableDates = DB::table('available_dates')
            ->orderBy('date', 'asc')
            ->pluck('formatted_date', 'date')
            ->toArray();

        $availableDatesForForms = DB::table('available_dates')
            ->orderBy('date', 'asc')
            ->pluck('formatted_date', 'id')
            ->toArray();

        $timeSlots = DB::table('time_slots')->pluck('label', 'id')->toArray();

        $filters = [
            'room_id' => $request->get('room_id'),
            'date' => $request->get('admin_date'),
            'time_slot_id' => $request->get('admin_time_slot_id'),
            'availability' => $request->get('availability')
        ];

        return view('admin.room-availability', compact(
            'availability',
            'rooms',
            'timeSlots',
            'availableDates',
            'availableDatesForForms',
            'filters'
        ));
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

        return redirect()->route('admin.available-dates')->with('success', 'Date added successfully');
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

        return redirect()->route('admin.available-dates')->with('success', 'Date status changed');
    }

    public function storeRoomAvailability(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'date_id' => 'required|exists:available_dates,id',
            'time_slot_id' => 'required|exists:time_slots,id',
            'is_available' => 'boolean'
        ]);

        $exists = DB::table('room_availability')
            ->where('room_id', $validated['room_id'])
            ->where('date_id', $validated['date_id'])
            ->where('time_slot_id', $validated['time_slot_id'])
            ->exists();

        if ($exists) {
            return redirect()->back()->withErrors(['error' => 'This slot already exists']);
        }

        DB::table('room_availability')->insert([
            'room_id' => $validated['room_id'],
            'date_id' => $validated['date_id'],
            'time_slot_id' => $validated['time_slot_id'],
            'is_available' => $validated['is_available'] ?? true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Availability slot added successfully');
    }

    public function createBulkAvailability()
    {
        $rooms = DB::table('rooms')->pluck('label', 'id')->toArray();
        $availableDates = DB::table('available_dates')
            ->orderBy('date', 'asc')
            ->pluck('formatted_date', 'id')
            ->toArray();
        $timeSlots = DB::table('time_slots')->pluck('label', 'id')->toArray();

        return view('admin.components.create-bulk-availability', compact('rooms', 'availableDates', 'timeSlots'));
    }

    public function storeBulkAvailability(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'date_id' => 'required|exists:available_dates,id',
            'time_slot_ids' => 'required|array',
            'time_slot_ids.*' => 'exists:time_slots,id',
            'is_available' => 'boolean'
        ]);

        $inserted = 0;
        $skipped = 0;

        foreach ($validated['time_slot_ids'] as $timeSlotId) {
            $exists = DB::table('room_availability')
                ->where('room_id', $validated['room_id'])
                ->where('date_id', $validated['date_id'])
                ->where('time_slot_id', $timeSlotId)
                ->exists();

            if (!$exists) {
                DB::table('room_availability')->insert([
                    'room_id' => $validated['room_id'],
                    'date_id' => $validated['date_id'],
                    'time_slot_id' => $timeSlotId,
                    'is_available' => $validated['is_available'] ?? true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $inserted++;
            } else {
                $skipped++;
            }
        }

        $message = "Slots added: {$inserted}";
        if ($skipped > 0) {
            $message .= ", skipped (already exist): {$skipped}";
        }

        return redirect()->route('admin.room-availability')->with('success', $message);
    }

    public function deleteDate($id)
    {
        DB::table('available_dates')->where('id', $id)->delete();
        return redirect()->route('admin.available-dates')->with('success', 'Date deleted');
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

        return redirect()->back()->with('success', 'Availability changed');
    }

    public function deleteCallback($id)
    {
        DB::table('callback_requests')->where('id', $id)->delete();
        return redirect()->route('admin.callback-requests')->with('success', 'Request deleted');
    }

    public function deleteBooking($id)
    {
        DB::table('booking_entertainment')->where('booking_id', $id)->delete();
        DB::table('bookings')->where('id', $id)->delete();
        return redirect()->route('admin.bookings')->with('success', 'Booking deleted');
    }

    public function createDate()
    {
        return view('admin.components.create-date');
    }
}
