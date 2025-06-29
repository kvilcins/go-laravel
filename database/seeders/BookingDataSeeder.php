<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookingDataSeeder extends Seeder
{
    public function run(): void
    {
        $config = config('booking');

        foreach ($config['rooms'] as $room) {
            DB::table('rooms')->insert([
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
                    'name' => $item,
                    'entertainment_type_id' => $typeId,
                    'stock' => $config['default_stock'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
