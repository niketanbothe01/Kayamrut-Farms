<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::query()
            ->withCount('products')
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Category $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'product_count' => $c->products_count,
                'visible' => $c->visible,
            ]);

        return response()->json(['data' => $categories]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'visible' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        $category = Category::query()->create([
            'name' => $data['name'],
            'slug' => $data['slug'] ?? Str::slug($data['name']),
            'visible' => $data['visible'] ?? true,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        return response()->json(['data' => $category], 201);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255'],
            'visible' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ]);

        $category->update($data);

        return response()->json(['data' => $category->fresh()]);
    }
}
