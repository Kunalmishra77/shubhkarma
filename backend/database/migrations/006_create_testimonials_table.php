<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('puja_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('location')->nullable();
            $table->text('text');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->string('image')->nullable();
            $table->boolean('verified')->default(false);
            $table->date('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
