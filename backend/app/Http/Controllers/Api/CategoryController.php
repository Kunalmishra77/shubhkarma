<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * GET /api/categories
     */
    public function index(): JsonResponse
    {
        $categories = Category::ordered()
            ->withCount('pujas')
            ->get();

        return response()->json($categories);
    }

    /**
     * GET /api/categories/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)
            ->withCount('pujas')
            ->firstOrFail();

        return response()->json($category);
    }
}
