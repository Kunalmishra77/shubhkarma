<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_number', 30)->unique();
            $table->foreignId('puja_id')->constrained()->cascadeOnDelete();
            $table->enum('package_tier', ['basic', 'standard', 'premium']);
            $table->string('customer_name');
            $table->string('customer_phone', 15);
            $table->string('customer_email')->nullable();
            $table->date('puja_date');
            $table->string('puja_time', 10)->nullable();
            $table->text('address');
            $table->string('city', 100);
            $table->string('pincode', 10)->nullable();
            $table->text('notes')->nullable();
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending')->index();
            $table->enum('payment_status', ['unpaid', 'partial', 'paid'])->default('unpaid');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
