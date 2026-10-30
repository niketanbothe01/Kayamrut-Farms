<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'number',
        'user_id',
        'customer_name',
        'customer_email',
        'phone',
        'payment_status',
        'fulfillment_status',
        'total_inr',
        'address',
        'city',
        'pincode',
        'packing_notes',
        'carrier',
        'tracking_number',
        'tracking_url',
        'shipped_at',
        'estimated_delivery',
        'delivered_at',
    ];

    protected function casts(): array
    {
        return [
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
            'estimated_delivery' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(OrderEvent::class)->orderByDesc('occurred_at');
    }

    public function itemCount(): int
    {
        return (int) $this->items()->sum('qty');
    }

    public function recordEvent(string $label): void
    {
        $this->events()->create([
            'label' => $label,
            'occurred_at' => now(),
        ]);
    }
}
