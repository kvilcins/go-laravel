<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('entertainments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('entertainment_type_id')->constrained()->onDelete('cascade');
            $table->integer('stock')->default(config('booking.default_stock', 5));
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('entertainments');
    }
};
