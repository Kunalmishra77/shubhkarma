<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\PanditController;
use App\Http\Controllers\Api\PujaController;
use App\Http\Controllers\Api\SamagriController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Pujas
Route::get('/pujas', [PujaController::class, 'index']);
Route::get('/pujas/{slug}', [PujaController::class, 'show']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

// Pandits
Route::get('/pandits', [PanditController::class, 'index']);
Route::get('/pandits/{slug}', [PanditController::class, 'show']);

// Bookings
Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings/{bookingNumber}', [BookingController::class, 'show']);

// Samagri Store
Route::get('/samagri/categories', [SamagriController::class, 'categories']);
Route::get('/samagri/products', [SamagriController::class, 'products']);
Route::get('/samagri/products/{slug}', [SamagriController::class, 'showProduct']);

// Testimonials
Route::get('/testimonials', [TestimonialController::class, 'index']);

// Contact
Route::post('/contact', [ContactController::class, 'store']);
