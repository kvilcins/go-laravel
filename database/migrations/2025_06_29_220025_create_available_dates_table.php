<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('available_dates', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('formatted_date');
            $table->string('day_name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique('date');
        });
    }

    public function down()
    {
        Schema::dropIfExists('available_dates');
    }
};
