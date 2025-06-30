<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Services\MailService;
use App\Mail\BookingRequestMail;
use App\Mail\BookingConfirmationMail;

class BookingController extends Controller
{
    protected $mailService;

    public function __construct(MailService $mailService)
    {
        $this->mailService = $mailService;
    }

    public function showForm()
    {
        $rooms = config('booking.rooms');
        $entertainments = config('booking.entertainment');

        return view('blocks.booking', compact('rooms', 'entertainments'));
    }

    public function getAvailableDates()
    {
        try {
            $connectionTest = DB::select('SELECT 1 as test');
            \Log::info('Database connection test successful', $connectionTest);

            $tableExists = DB::select("SHOW TABLES LIKE 'available_dates'");
            if (empty($tableExists)) {
                \Log::error('Table available_dates does not exist');
                return response()->json([
                    'error' => 'Таблица дат не найдена'
                ], 500);
            }

            $dates = DB::table('available_dates')
                ->where('is_active', true)
                ->where('date', '>=', Carbon::today())
                ->orderBy('date')
                ->get();

            \Log::info('Raw dates from DB:', ['count' => $dates->count()]);

            $formattedDates = $dates->map(function($date) {
                return [
                    'value' => $date->date,
                    'label' => $date->formatted_date . ' (' . $date->day_name . ')'
                ];
            });

            return response()->json([
                'dates' => $formattedDates
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in getAvailableDates', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Ошибка загрузки дат: ' . $e->getMessage()
            ], 500);
        }
    }

    private function retryDatabaseQuery($callback, $maxRetries = 3)
    {
        $attempt = 0;

        while ($attempt < $maxRetries) {
            try {
                return $callback();
            } catch (\Exception $e) {
                $attempt++;

                if ($attempt >= $maxRetries) {
                    throw $e;
                }

                \Log::warning("Database connection attempt {$attempt} failed, retrying...", [
                    'error' => $e->getMessage()
                ]);

                sleep(1);
            }
        }
    }

    public function getAvailableSlots(Request $request)
    {
        try {
            \Log::info('getAvailableSlots called', ['data' => $request->all()]);

            $request->validate([
                'room_id' => 'required|integer',
                'date' => 'required|date_format:Y-m-d',
            ]);

            $dateRecord = DB::table('available_dates')
                ->where('date', $request->date)
                ->where('is_active', true)
                ->first();

            if (!$dateRecord) {
                return response()->json([
                    'error' => 'Дата недоступна'
                ], 404);
            }

            $availableSlots = DB::table('room_availability')
                ->join('time_slots', 'room_availability.time_slot_id', '=', 'time_slots.id')
                ->where('room_availability.room_id', $request->room_id)
                ->where('room_availability.date_id', $dateRecord->id)
                ->where('room_availability.is_available', true)
                ->where('time_slots.is_active', true)
                ->select('time_slots.label as value', 'time_slots.label as label')
                ->get();

            $bookedSlots = DB::table('bookings')
                ->where('room_id', $request->room_id)
                ->where('date', $request->date)
                ->pluck('time')
                ->toArray();

            $finalSlots = $availableSlots->filter(function($slot) use ($bookedSlots) {
                return !in_array($slot->value, $bookedSlots);
            })->values();

            if (Carbon::parse($request->date)->isToday()) {
                $currentTime = Carbon::now();
                $finalSlots = $finalSlots->filter(function($slot) use ($currentTime) {
                    [$hour, $minute] = explode(':', $slot->value);
                    $slotTime = Carbon::today()->setTime($hour, $minute);
                    return $slotTime->gt($currentTime);
                });
            }

            \Log::info('getAvailableSlots success', [
                'available_count' => $finalSlots->count(),
                'booked_count' => count($bookedSlots)
            ]);

            return response()->json([
                'available_times' => $finalSlots->values(),
                'booked_times' => $bookedSlots,
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in getAvailableSlots', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Ошибка загрузки данных',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function prepareEmailData($validated)
    {
        $rooms = DB::table('rooms')->pluck('slug', 'id')->toArray();

        return [
            'hall' => $rooms[$validated['room_id']] ?? 'unknown',
            'date' => $validated['date'],
            'time' => $validated['time_slot_id'],
            'amount' => $validated['amount'],
            'people_count' => $validated['amount'],
            'first_name' => $validated['first_name'],
            'first-name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'last-name' => $validated['last_name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'] ?? null,
            'console' => $validated['console'] ?? null,
            'games' => $validated['games'] ?? [],
            'additional' => $validated['additional'] ?? [],
        ];
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

        try {
            $bookingId = DB::table('bookings')->insertGetId([
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

            $this->saveBookingEntertainment($bookingId, $validated);

            $emailData = $this->prepareEmailData($validated);
            try {
                $this->mailService->sendBookingRequest($emailData);
                \Log::info('Booking emails sent successfully', ['booking_id' => $bookingId]);
            } catch (\Exception $e) {
                \Log::error('Failed to send booking emails', [
                    'booking_id' => $bookingId,
                    'error' => $e->getMessage()
                ]);
            }

            return redirect()->route('booking.form')->with('success', 'Бронирование успешно создано! Мы свяжемся с вами для подтверждения.');

        } catch (\Exception $e) {
            \Log::error('Database error in submitForm: ' . $e->getMessage());

            $bookingData = [
                'id' => uniqid(),
                'room_id' => $validated['room_id'],
                'date' => $validated['date'],
                'time' => $validated['time_slot_id'],
                'amount' => $validated['amount'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'phone' => $validated['phone'],
                'email' => $validated['email'] ?? null,
                'console' => $validated['console'] ?? null,
                'games' => $validated['games'] ?? [],
                'additional' => $validated['additional'] ?? [],
                'created_at' => now()->toDateTimeString(),
            ];

            $filePath = storage_path('app/bookings.json');
            $bookings = [];

            if (file_exists($filePath)) {
                $bookings = json_decode(file_get_contents($filePath), true) ?? [];
            }

            $bookings[] = $bookingData;
            file_put_contents($filePath, json_encode($bookings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            return redirect()->route('booking.form')->with('success', 'Бронирование принято! Мы свяжемся с вами для подтверждения. (сохранено в резервное хранилище)');
        }
    }

    public function submitFormApi(Request $request)
    {
        \Log::info('API submitForm called', [
            'headers' => $request->headers->all(),
            'data' => $request->except('_token')
        ]);

        $validator = Validator::make($request->all(), [
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

        if ($validator->fails()) {
            \Log::info('API validation failed', ['errors' => $validator->errors()->toArray()]);
            return response()->json([
                'success' => false,
                'message' => 'Ошибка валидации: ' . $validator->errors()->first()
            ], 422);
        }

        $validated = $validator->validated();

        try {
            $bookingId = DB::table('bookings')->insertGetId([
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

            $this->saveBookingEntertainment($bookingId, $validated);

            $emailData = $this->prepareEmailData($validated);
            try {
                $this->mailService->sendBookingRequest($emailData);
                \Log::info('Booking emails sent successfully', ['booking_id' => $bookingId]);
            } catch (\Exception $e) {
                \Log::error('Failed to send booking emails', [
                    'booking_id' => $bookingId,
                    'error' => $e->getMessage()
                ]);
            }

            \Log::info('API booking saved successfully');

            return response()->json([
                'success' => true,
                'message' => 'Бронирование успешно создано! Мы свяжемся с вами для подтверждения.'
            ]);

        } catch (\Exception $e) {
            \Log::error('API database error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при сохранении бронирования. Попробуйте позже.'
            ], 500);
        }
    }

    private function saveBookingEntertainment($bookingId, $validated)
    {
        \Log::info('saveBookingEntertainment called', [
            'booking_id' => $bookingId,
            'console' => $validated['console'] ?? 'null',
            'games' => $validated['games'] ?? 'null',
            'additional' => $validated['additional'] ?? 'null'
        ]);

        $entertainmentIds = [];

        if (!empty($validated['console'])) {
            \Log::info('Looking for console', ['console' => $validated['console']]);

            $consoleId = DB::table('entertainments')
                ->join('entertainment_types', 'entertainments.entertainment_type_id', '=', 'entertainment_types.id')
                ->where('entertainment_types.name', 'console')
                ->where('entertainments.name', $validated['console'])
                ->value('entertainments.id');

            \Log::info('Console search result', ['console_id' => $consoleId]);

            if ($consoleId) {
                $entertainmentIds[] = $consoleId;
            }
        }

        if (!empty($validated['games'])) {
            \Log::info('Looking for games', ['games' => $validated['games']]);

            $gameIds = DB::table('entertainments')
                ->join('entertainment_types', 'entertainments.entertainment_type_id', '=', 'entertainment_types.id')
                ->where('entertainment_types.name', 'board_games')
                ->whereIn('entertainments.name', $validated['games'])
                ->pluck('entertainments.id')
                ->toArray();

            \Log::info('Games search result', ['game_ids' => $gameIds]);

            $entertainmentIds = array_merge($entertainmentIds, $gameIds);
        }

        if (!empty($validated['additional'])) {
            \Log::info('Looking for additional', ['additional' => $validated['additional']]);

            $additionalIds = DB::table('entertainments')
                ->join('entertainment_types', 'entertainments.entertainment_type_id', '=', 'entertainment_types.id')
                ->where('entertainment_types.name', 'additional')
                ->whereIn('entertainments.name', $validated['additional'])
                ->pluck('entertainments.id')
                ->toArray();

            \Log::info('Additional search result', ['additional_ids' => $additionalIds]);

            $entertainmentIds = array_merge($entertainmentIds, $additionalIds);
        }

        \Log::info('Final entertainment IDs to save', ['entertainment_ids' => $entertainmentIds]);

        foreach ($entertainmentIds as $entertainmentId) {
            DB::table('booking_entertainment')->insert([
                'booking_id' => $bookingId,
                'entertainment_id' => $entertainmentId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            \Log::info('Saved booking_entertainment', [
                'booking_id' => $bookingId,
                'entertainment_id' => $entertainmentId
            ]);
        }
    }
}
