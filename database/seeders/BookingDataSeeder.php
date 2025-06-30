<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BookingDataSeeder extends Seeder
{
    public function run(): void
    {
        $config = config('booking');

        foreach ($config['rooms'] as $room) {
            DB::table('rooms')->insert([
                'id' => $room['id'],
                'label' => $room['label'],
                'slug' => $room['slug'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        foreach ($config['entertainment'] as $type => $items) {
            $typeId = DB::table('entertainment_types')->insertGetId([
                'name' => $type,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($items as $item) {
                DB::table('entertainments')->insert([
                    'name' => strtolower($item),
                    'entertainment_type_id' => $typeId,
                    'stock' => $config['default_stock'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        for ($i = 0; $i < 30; $i++) {
            $date = Carbon::today()->addDays($i);

            DB::table('available_dates')->insert([
                'date' => $date->format('Y-m-d'),
                'formatted_date' => $date->format('d.m'),
                'day_name' => $date->translatedFormat('D'),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $timeSlots = [];
        for ($hour = 12; $hour < 22; $hour++) {
            $timeSlots[] = sprintf('%02d:00', $hour);
            $timeSlots[] = sprintf('%02d:30', $hour);
        }

        foreach ($timeSlots as $slot) {
            DB::table('time_slots')->insert([
                'time' => $slot . ':00',
                'label' => $slot,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $rooms = DB::table('rooms')->get();
        $dates = DB::table('available_dates')->get();
        $timeSlots = DB::table('time_slots')->get();

        foreach ($rooms as $room) {
            foreach ($dates as $date) {
                foreach ($timeSlots as $slot) {
                    DB::table('room_availability')->insert([
                        'room_id' => $room->id,
                        'date_id' => $date->id,
                        'time_slot_id' => $slot->id,
                        'is_available' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
