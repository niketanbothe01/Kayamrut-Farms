<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function categories(): JsonResponse
    {
        $categories = Category::query()
            ->where('visible', true)
            ->orderBy('sort_order')
            ->withCount(['products' => fn ($q) => $q->where('status', 'active')])
            ->get()
            ->map(fn (Category $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'product_count' => $c->products_count,
            ]);

        return response()->json(['data' => $categories]);
    }

    public function products(Request $request): JsonResponse
    {
        $query = Product::query()
            ->with(['category', 'variants'])
            ->where('status', 'active');

        if ($slug = $request->string('category')->toString()) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }

        $products = $query->orderBy('name')->get()->map(fn (Product $p) => $this->productCard($p));

        return response()->json(['data' => $products]);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::query()
            ->with(['category', 'variants'])
            ->where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        return response()->json(['data' => $this->productDetail($product)]);
    }

    private function productCard(Product $p): array
    {
        $from = $p->variants->sortBy('price_inr')->first();

        return [
            'id' => $p->id,
            'slug' => $p->slug,
            'name' => $p->name,
            'tagline' => $p->tagline,
            'category' => $p->category?->name,
            'category_slug' => $p->category?->slug,
            'badges' => $p->badges ?? [],
            'accent' => $p->accent,
            'price_from_inr' => $from?->price_inr,
            'from_label' => $from?->label,
        ];
    }

    private function productDetail(Product $p): array
    {
        return [
            ...$this->productCard($p),
            'description' => $p->description,
            'variants' => $p->variants->map(fn ($v) => [
                'id' => $v->id,
                'sku' => $v->sku,
                'label' => $v->label,
                'price_inr' => $v->price_inr,
                'compare_at_inr' => $v->compare_at_inr,
                'stock' => $v->stock,
                'in_stock' => $v->stock > 0,
            ])->values(),
        ];
    }
}
