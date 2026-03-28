<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SamagriCategory;
use App\Models\SamagriProduct;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SamagriController extends Controller
{
    /**
     * GET /api/samagri/categories
     */
    public function categories(): JsonResponse
    {
        $categories = SamagriCategory::withCount('products')->get();
        return response()->json($categories);
    }

    /**
     * GET /api/samagri/products
     * Filterable by: category, puja_tag, featured, sort
     */
    public function products(Request $request): JsonResponse
    {
        $query = SamagriProduct::with('samagriCategory:id,name,slug');

        if ($request->filled('category')) {
            $query->whereHas('samagriCategory', fn ($q) => $q->where('slug', $request->category));
        }
        if ($request->filled('puja_tag')) {
            $query->where(function ($q) use ($request) {
                $q->whereJsonContains('puja_tags', $request->puja_tag)
                  ->orWhereJsonContains('puja_tags', 'all');
            });
        }
        if ($request->boolean('featured')) {
            $query->featured();
        }
        if ($request->boolean('in_stock')) {
            $query->inStock();
        }

        $query->when($request->sort, function ($q, $sort) {
            match ($sort) {
                'price-low'  => $q->orderBy('price'),
                'price-high' => $q->orderByDesc('price'),
                'rating'     => $q->orderByDesc('rating'),
                default      => $q->orderByDesc('reviews_count'),
            };
        }, fn ($q) => $q->orderByDesc('reviews_count'));

        $products = $query->paginate($request->integer('per_page', 24));

        return response()->json($products);
    }

    /**
     * GET /api/samagri/products/{slug}
     */
    public function showProduct(string $slug): JsonResponse
    {
        $product = SamagriProduct::with('samagriCategory:id,name,slug')
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($product);
    }
}
