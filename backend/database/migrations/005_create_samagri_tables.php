<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('samagri_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon', 50)->nullable();
            $table->timestamps();
        });

        Schema::create('samagri_products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->foreignId('samagri_category_id')->constrained()->cascadeOnDelete();
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->text('description')->nullable();
            $table->json('puja_tags')->nullable();
            $table->string('weight', 30)->nullable();
            $table->string('image')->nullable();
            $table->json('images')->nullable();
            $table->boolean('in_stock')->default(true)->index();
            $table->decimal('rating', 2, 1)->default(0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->boolean('featured')->default(false)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('samagri_products');
        Schema::dropIfExists('samagri_categories');
    }
};
