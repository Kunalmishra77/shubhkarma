<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    /**
     * GET /api/testimonials
     */
    public function index(Request $request): JsonResponse
    {
        $query = Testimonial::verified()->with('puja:id,title,slug');

        if ($request->filled('puja')) {
            $query->whereHas('puja', fn ($q) => $q->where('slug', $request->puja));
        }

        $testimonials = $query
            ->latest('published_at')
            ->paginate($request->integer('per_page', 12));

        return response()->json($testimonials);
    }
}
