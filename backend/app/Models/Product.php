<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'tagline',
        'description',
        'status',
        'accent',
        'image',
        'badges',
    ];

    protected function casts(): array
    {
        return [
            'badges' => 'array',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function priceFromInr(): ?int
    {
        return $this->variants()->orderBy('price_inr')->value('price_inr');
    }

    public function stockTotal(): int
    {
        return (int) $this->variants()->sum('stock');
    }
}
