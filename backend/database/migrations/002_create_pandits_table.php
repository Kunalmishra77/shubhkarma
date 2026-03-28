<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pandits', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('title');
            $table->unsignedSmallInteger('experience')->default(0);
            $table->json('expertise')->nullable();
            $table->json('specializations')->nullable();
            $table->json('languages')->nullable();
            $table->decimal('rating', 2, 1)->default(0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->unsignedInteger('completed_pujas')->default(0);
            $table->string('location')->nullable();
            $table->boolean('available')->default(true)->index();
            $table->boolean('featured')->default(false)->index();
            $table->string('image')->nullable();
            $table->text('bio')->nullable();
            $table->json('certifications')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pandits');
    }
};
