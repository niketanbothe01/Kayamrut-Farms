<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::query()
            ->with(['category', 'variants'])
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (Product $p) => [
                'id' => $p->id,
                'slug' => $p->slug,
                'name' => $p->name,
                'category' => $p->category?->name,
                'status' => $p->status,
                'price_from_inr' => $p->variants->min('price_inr'),
                'stock_total' => (int) $p->variants->sum('stock'),
                'updated_at' => optional($p->updated_at)?->toDateString(),
            ]);

        return response()->json(['data' => $products]);
    }

    public function show(Product $product): JsonResponse
    {
        $product->load(['category', 'variants']);

        return response()->json(['data' => $this->detail($product)]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $category = Category::query()->where('name', $data['category'])->firstOrFail();

        $product = Product::query()->create([
            'category_id' => $category->id,
            'name' => $data['name'],
            'slug' => $data['slug'] ?? Str::slug($data['name']),
            'tagline' => $data['tagline'] ?? null,
            'description' => $data['description'] ?? null,
            'status' => $data['status'],
            'accent' => $data['accent'] ?? null,
            'badges' => $data['badges'] ?? [],
        ]);

        foreach ($data['variants'] ?? [] as $variant) {
            $product->variants()->create($variant);
        }

        return response()->json(['data' => $this->detail($product->fresh(['category', 'variants']))], 201);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $data = $this->validated($request, updating: true);

        if (! empty($data['category'])) {
            $category = Category::query()->where('name', $data['category'])->firstOrFail();
            $product->category_id = $category->id;
        }

        $product->fill(collect($data)->only([
            'name', 'slug', 'tagline', 'description', 'status', 'accent', 'badges',
        ])->filter(fn ($v) => $v !== null)->all());
        $product->save();

        if (array_key_exists('variants', $data)) {
            foreach ($data['variants'] as $variant) {
                if (! empty($variant['id'])) {
                    $product->variants()->whereKey($variant['id'])->update(
                        collect($variant)->except('id')->all()
                    );
                } else {
                    $product->variants()->create($variant);
                }
            }
        }

        return response()->json(['data' => $this->detail($product->fresh(['category', 'variants']))]);
    }

    private function validated(Request $request, bool $updating = false): array
    {
        return $request->validate([
            'name' => [$updating ? 'sometimes' : 'required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'category' => [$updating ? 'sometimes' : 'required', 'string'],
            'tagline' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'status' => [$updating ? 'sometimes' : 'required', 'in:draft,active,archived'],
            'accent' => ['nullable', 'string'],
            'badges' => ['nullable', 'array'],
            'variants' => ['nullable', 'array'],
            'variants.*.id' => ['nullable', 'integer'],
            'variants.*.sku' => ['required_with:variants', 'string'],
            'variants.*.label' => ['required_with:variants', 'string'],
            'variants.*.price_inr' => ['required_with:variants', 'integer', 'min:0'],
            'variants.*.compare_at_inr' => ['nullable', 'integer', 'min:0'],
            'variants.*.stock' => ['required_with:variants', 'integer', 'min:0'],
        ]);
    }

    private function detail(Product $p): array
    {
        return [
            'id' => $p->id,
            'slug' => $p->slug,
            'name' => $p->name,
            'tagline' => $p->tagline,
            'description' => $p->description,
            'category' => $p->category?->name,
            'status' => $p->status,
            'accent' => $p->accent,
            'badges' => $p->badges ?? [],
            'price_from_inr' => $p->variants->min('price_inr'),
            'stock_total' => (int) $p->variants->sum('stock'),
            'variants' => $p->variants->map(fn ($v) => [
                'id' => $v->id,
                'sku' => $v->sku,
                'label' => $v->label,
                'price_inr' => $v->price_inr,
                'compare_at_inr' => $v->compare_at_inr,
                'stock' => $v->stock,
            ])->values(),
            'updated_at' => optional($p->updated_at)?->toDateString(),
        ];
    }
}
