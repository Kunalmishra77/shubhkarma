<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pujas', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('short_description')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->json('gallery_images')->nullable();
            $table->decimal('rating', 2, 1)->default(0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->unsignedInteger('bookings_count')->default(0);
            $table->string('duration', 50)->nullable();
            $table->json('tags')->nullable();
            $table->json('benefits')->nullable();
            $table->json('tiers');                          // { basic, standard, premium }
            $table->json('samagri_list')->nullable();
            $table->boolean('featured')->default(false)->index();
            $table->boolean('active')->default(true)->index();
            $table->timestamps();
        });

        // Pivot: puja ↔ pandit
        Schema::create('puja_pandit', function (Blueprint $table) {
            $table->foreignId('puja_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pandit_id')->constrained()->cascadeOnDelete();
            $table->primary(['puja_id', 'pandit_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('puja_pandit');
        Schema::dropIfExists('pujas');
    }
};
