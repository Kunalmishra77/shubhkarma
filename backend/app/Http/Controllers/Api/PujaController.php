<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Puja;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PujaController extends Controller
{
    /**
     * GET /api/pujas
     * Filterable by: category, tag, featured, sort
     */
    public function index(Request $request): JsonResponse
    {
        $query = Puja::active()->with('category:id,title,slug');

        // Filters
        if ($request->filled('category')) {
            $query->byCategory($request->category);
        }
        if ($request->filled('tag')) {
            $query->whereJsonContains('tags', $request->tag);
        }
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Budget filter
        if ($request->filled('budget')) {
            $query->where(function ($q) use ($request) {
                foreach ((array) $request->budget as $range) {
                    $q->orWhereRaw($this->budgetCondition($range));
                }
            });
        }

        // Sort
        $query->when($request->sort, function ($q, $sort) {
            match ($sort) {
                'price-low'  => $q->orderByRaw("JSON_EXTRACT(tiers, '$.basic.price') ASC"),
                'price-high' => $q->orderByRaw("JSON_EXTRACT(tiers, '$.basic.price') DESC"),
                'rating'     => $q->orderByDesc('rating'),
                default      => $q->orderByDesc('bookings_count'),
            };
        }, fn ($q) => $q->orderByDesc('bookings_count'));

        $pujas = $query->paginate($request->integer('per_page', 20));

        return response()->json($pujas);
    }

    /**
     * GET /api/pujas/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $puja = Puja::active()
            ->with(['category:id,title,slug', 'pandits', 'testimonials' => fn ($q) => $q->verified()->latest('published_at')->limit(5)])
            ->where('slug', $slug)
            ->orWhere('id', $slug)
            ->firstOrFail();

        // Related pujas (same category, exclude self)
        $related = Puja::active()
            ->where('category_id', $puja->category_id)
            ->where('id', '!=', $puja->id)
            ->limit(4)
            ->get(['id', 'title', 'slug', 'image', 'rating', 'tiers', 'tags', 'duration']);

        return response()->json([
            'puja'    => $puja,
            'related' => $related,
        ]);
    }

    private function budgetCondition(string $range): string
    {
        return match ($range) {
            'under-3k'  => "JSON_EXTRACT(tiers, '$.basic.price') < 3000",
            '3k-10k'    => "JSON_EXTRACT(tiers, '$.basic.price') BETWEEN 3000 AND 10000",
            '10k-50k'   => "JSON_EXTRACT(tiers, '$.basic.price') BETWEEN 10001 AND 50000",
            'above-50k' => "JSON_EXTRACT(tiers, '$.basic.price') > 50000",
            default      => '1=1',
        };
    }
}
