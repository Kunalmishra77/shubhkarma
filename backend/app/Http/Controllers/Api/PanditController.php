<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pandit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PanditController extends Controller
{
    /**
     * GET /api/pandits
     */
    public function index(Request $request): JsonResponse
    {
        $query = Pandit::query();

        if ($request->boolean('featured')) {
            $query->featured();
        }
        if ($request->boolean('available')) {
            $query->available();
        }
        if ($request->filled('specialization')) {
            $query->whereJsonContains('specializations', $request->specialization);
        }

        $pandits = $query->orderByDesc('rating')->get();

        return response()->json($pandits);
    }

    /**
     * GET /api/pandits/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $pandit = Pandit::where('slug', $slug)
            ->orWhere('id', $slug)
            ->firstOrFail();

        $pujas = $pandit->pujas()
            ->active()
            ->get(['pujas.id', 'title', 'slug', 'image', 'rating', 'tiers', 'duration']);

        return response()->json([
            'pandit' => $pandit,
            'pujas'  => $pujas,
        ]);
    }
}
