<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

return new class extends Migration
{
    public function up()
    {
        $dates = DB::table('available_dates')->get();

        foreach ($dates as $dateRecord) {
            $date = Carbon::parse($dateRecord->date);

            DB::table('available_dates')
                ->where('id', $dateRecord->id)
                ->update([
                    'formatted_date' => $date->format('m/d/Y'),
                    'updated_at' => now()
                ]);
        }
    }

    public function down()
    {
        $dates = DB::table('available_dates')->get();

        foreach ($dates as $dateRecord) {
            $date = Carbon::parse($dateRecord->date);

            DB::table('available_dates')
                ->where('id', $dateRecord->id)
                ->update([
                    'formatted_date' => $date->format('d.m'),
                    'updated_at' => now()
                ]);
        }
    }
};
