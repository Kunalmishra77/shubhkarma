<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\Puja;
use Illuminate\Http\JsonResponse;

class BookingController extends Controller
{
    /**
     * POST /api/bookings
     */
    public function store(StoreBookingRequest $request): JsonResponse
    {
        $puja = Puja::findOrFail($request->puja_id);
        $tier = $request->package_tier;

        // Resolve price from puja tiers
        $tierData = $puja->tiers[$tier] ?? $puja->tiers['basic'] ?? null;
        if (!$tierData) {
            return response()->json(['message' => 'Invalid package tier.'], 422);
        }

        $booking = Booking::create([
            ...$request->validated(),
            'amount' => $tierData['price'],
        ]);

        // Increment puja booking count
        $puja->increment('bookings_count');

        return response()->json([
            'message'        => 'Booking created successfully.',
            'booking_number' => $booking->booking_number,
            'booking'        => $booking->load('puja:id,title,slug,image'),
        ], 201);
    }

    /**
     * GET /api/bookings/{bookingNumber}
     */
    public function show(string $bookingNumber): JsonResponse
    {
        $booking = Booking::where('booking_number', $bookingNumber)
            ->with('puja:id,title,slug,image,tiers')
            ->firstOrFail();

        return response()->json($booking);
    }
}
