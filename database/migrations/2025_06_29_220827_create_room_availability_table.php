<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('room_availability', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained('rooms')->onDelete('cascade');
            $table->foreignId('date_id')->constrained('available_dates')->onDelete('cascade');
            $table->foreignId('time_slot_id')->constrained('time_slots')->onDelete('cascade');
            $table->boolean('is_available')->default(true);
            $table->timestamps();

            $table->unique(['room_id', 'date_id', 'time_slot_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('room_availability');
    }
};
