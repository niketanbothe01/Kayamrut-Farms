<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class KayamrutSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@kayamrut.local'],
            [
                'name' => 'Kayamrut Admin',
                'password' => Hash::make('password'),
                'is_admin' => true,
                'phone' => '+91 90000 00000',
            ]
        );

        $categories = [
            ['name' => 'A2 Ghee', 'slug' => 'a2-ghee', 'sort_order' => 1],
            ['name' => 'Cold Pressed', 'slug' => 'cold-pressed', 'sort_order' => 2],
            ['name' => 'Organic Powders', 'slug' => 'powders', 'sort_order' => 3],
            ['name' => 'Seeds', 'slug' => 'seeds', 'sort_order' => 4],
            ['name' => 'Makhana', 'slug' => 'makhana', 'sort_order' => 5],
        ];

        foreach ($categories as $c) {
            Category::query()->updateOrCreate(['slug' => $c['slug']], $c + ['visible' => true]);
        }

        $ghee = Category::query()->where('slug', 'a2-ghee')->first();
        $oils = Category::query()->where('slug', 'cold-pressed')->first();
        $powders = Category::query()->where('slug', 'powders')->first();
        $seeds = Category::query()->where('slug', 'seeds')->first();
        $makhana = Category::query()->where('slug', 'makhana')->first();

        $this->product($ghee->id, [
            'name' => 'A2 Gir Cow Ghee',
            'slug' => 'a2-gir-cow-ghee',
            'tagline' => 'Everyday ghee, traditionally prepared.',
            'description' => 'Crafted from the milk of free-grazing Gir cows.',
            'status' => 'active',
            'accent' => 'ghee',
            'badges' => ['Bestseller'],
            'variants' => [
                ['sku' => 'GHEE-250', 'label' => '250 ml', 'price_inr' => 549, 'compare_at_inr' => 649, 'stock' => 40],
                ['sku' => 'GHEE-500', 'label' => '500 ml', 'price_inr' => 999, 'compare_at_inr' => 1199, 'stock' => 48],
                ['sku' => 'GHEE-1L', 'label' => '1 Litre', 'price_inr' => 1899, 'compare_at_inr' => 2199, 'stock' => 40],
            ],
        ]);

        $this->product($oils->id, [
            'name' => 'Cold Pressed Sunflower Oil',
            'slug' => 'cold-pressed-sunflower-oil',
            'tagline' => 'Unrefined. Naturally rich in Vitamin E.',
            'description' => 'Slow cold-pressed oil for everyday cooking.',
            'status' => 'active',
            'accent' => 'oil',
            'variants' => [
                ['sku' => 'OIL-SF-500', 'label' => '500 ml', 'price_inr' => 275, 'stock' => 50],
                ['sku' => 'OIL-SF-1L', 'label' => '1 Litre', 'price_inr' => 499, 'stock' => 36],
            ],
        ]);

        $this->product($oils->id, [
            'name' => 'Cold Pressed Coconut Oil',
            'slug' => 'cold-pressed-coconut-oil',
            'tagline' => 'Pure coconut, nothing added.',
            'description' => 'Cold-pressed from fresh coconuts.',
            'status' => 'active',
            'accent' => 'oil',
            'variants' => [
                ['sku' => 'OIL-CO-500', 'label' => '500 ml', 'price_inr' => 449, 'stock' => 12],
                ['sku' => 'OIL-CO-1L', 'label' => '1 Litre', 'price_inr' => 799, 'stock' => 0],
            ],
        ]);

        $this->product($powders->id, [
            'name' => 'Organic Moringa Powder',
            'slug' => 'organic-moringa-powder',
            'tagline' => 'Super greens for daily vitality.',
            'description' => 'Farm-grown moringa leaf powder.',
            'status' => 'active',
            'accent' => 'powder',
            'badges' => ['Popular'],
            'variants' => [
                ['sku' => 'PWD-MOR-100', 'label' => '100 g', 'price_inr' => 249, 'stock' => 40],
                ['sku' => 'PWD-MOR-200', 'label' => '200 g', 'price_inr' => 449, 'stock' => 24],
            ],
        ]);

        $this->product($seeds->id, [
            'name' => 'Pumpkin Seeds',
            'slug' => 'pumpkin-seeds',
            'tagline' => 'Magnesium, zinc, and clean snacking.',
            'description' => 'Fresh, unprocessed pumpkin seeds.',
            'status' => 'active',
            'accent' => 'seed',
            'variants' => [
                ['sku' => 'SEED-PUMP-200', 'label' => '200 g', 'price_inr' => 199, 'stock' => 30],
                ['sku' => 'SEED-PUMP-500', 'label' => '500 g', 'price_inr' => 449, 'stock' => 18],
            ],
        ]);

        $this->product($makhana->id, [
            'name' => 'Organic Makhana',
            'slug' => 'organic-makhana',
            'tagline' => 'Light, crunchy, farm-sourced.',
            'description' => 'Crisp fox nuts for mindful snacking.',
            'status' => 'active',
            'accent' => 'makhana',
            'variants' => [
                ['sku' => 'MAK-200', 'label' => '200 g', 'price_inr' => 249, 'stock' => 22],
                ['sku' => 'MAK-500', 'label' => '500 g', 'price_inr' => 549, 'stock' => 18],
            ],
        ]);

        if (Order::query()->where('number', 'KF-1004')->exists()) {
            return;
        }

        $order = Order::query()->create([
            'number' => 'KF-1004',
            'customer_name' => 'Ananya Shah',
            'customer_email' => 'ananya@example.com',
            'phone' => '+91 98765 43210',
            'payment_status' => 'paid',
            'fulfillment_status' => 'to_pack',
            'total_inr' => 1899,
            'address' => '14 Heritage Park, Satellite',
            'city' => 'Ahmedabad',
            'pincode' => '380015',
            'packing_notes' => 'Include recipe card',
        ]);
        $order->items()->create([
            'title' => 'A2 Gir Cow Ghee · 1 Litre',
            'sku' => 'GHEE-1L',
            'qty' => 1,
            'unit_price_inr' => 1899,
        ]);
        $order->recordEvent('Order placed');
        $order->recordEvent('Payment confirmed');
        $order->recordEvent('Queued for packing');

        $order2 = Order::query()->create([
            'number' => 'KF-1003',
            'customer_name' => 'Rohit Mehta',
            'customer_email' => 'rohit@example.com',
            'phone' => '+91 98200 11223',
            'payment_status' => 'paid',
            'fulfillment_status' => 'packing',
            'total_inr' => 1248,
            'address' => '802 Lakeview, Baner',
            'city' => 'Pune',
            'pincode' => '411045',
        ]);
        $order2->items()->createMany([
            ['title' => 'Cold Pressed Sunflower Oil · 1 Litre', 'sku' => 'OIL-SF-1L', 'qty' => 1, 'unit_price_inr' => 499],
            ['title' => 'Organic Moringa Powder · 100 g', 'sku' => 'PWD-MOR-100', 'qty' => 2, 'unit_price_inr' => 249],
            ['title' => 'Organic Makhana · 200 g', 'sku' => 'MAK-200', 'qty' => 1, 'unit_price_inr' => 249],
        ]);
        $order2->recordEvent('Order placed');
        $order2->recordEvent('Packing started');
    }

    private function product(int $categoryId, array $data): void
    {
        $variants = $data['variants'];
        unset($data['variants']);

        $product = Product::query()->updateOrCreate(
            ['slug' => $data['slug']],
            ['category_id' => $categoryId] + $data
        );

        foreach ($variants as $variant) {
            $product->variants()->updateOrCreate(
                ['sku' => $variant['sku']],
                $variant
            );
        }
    }
}
