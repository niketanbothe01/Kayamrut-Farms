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

        User::query()->updateOrCreate(
            ['email' => 'ananya@example.com'],
            [
                'name' => 'Ananya Shah',
                'password' => Hash::make('password'),
                'is_admin' => false,
                'phone' => '+91 98765 43210',
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
            'description' => 'Crafted from the milk of free-grazing Gir cows. Pure, wholesome, and made for daily cooking — from tadka to sweets.',
            'status' => 'active',
            'accent' => 'ghee',
            'image' => 'products/a2-gir-cow-ghee.jpg',
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
            'description' => 'Slow cold-pressed oil that keeps nutrients intact — ideal for everyday Indian cooking without the heaviness of refined oils.',
            'status' => 'active',
            'accent' => 'oil',
            'image' => 'products/cold-pressed-sunflower-oil.jpg',
            'variants' => [
                ['sku' => 'OIL-SF-500', 'label' => '500 ml', 'price_inr' => 275, 'stock' => 50],
                ['sku' => 'OIL-SF-1L', 'label' => '1 Litre', 'price_inr' => 499, 'stock' => 36],
            ],
        ]);

        $this->product($oils->id, [
            'name' => 'Cold Pressed Coconut Oil',
            'slug' => 'cold-pressed-coconut-oil',
            'tagline' => 'Pure coconut, nothing added.',
            'description' => 'Cold-pressed from fresh coconuts. Use for cooking, hair care, or a spoon of everyday nourishment.',
            'status' => 'active',
            'accent' => 'oil',
            'image' => 'products/cold-pressed-coconut-oil.jpg',
            'variants' => [
                ['sku' => 'OIL-CO-500', 'label' => '500 ml', 'price_inr' => 449, 'stock' => 12],
                ['sku' => 'OIL-CO-1L', 'label' => '1 Litre', 'price_inr' => 799, 'stock' => 0],
            ],
        ]);

        $this->product($powders->id, [
            'name' => 'Organic Moringa Powder',
            'slug' => 'organic-moringa-powder',
            'tagline' => 'Super greens for daily vitality.',
            'description' => 'Farm-grown moringa leaf powder — add to smoothies, warm water, or dosa batter for a simple nutrition lift.',
            'status' => 'active',
            'accent' => 'powder',
            'image' => 'products/organic-moringa-powder.jpg',
            'badges' => ['Popular'],
            'variants' => [
                ['sku' => 'PWD-MOR-100', 'label' => '100 g', 'price_inr' => 249, 'stock' => 40],
                ['sku' => 'PWD-MOR-200', 'label' => '200 g', 'price_inr' => 449, 'stock' => 24],
            ],
        ]);

        $this->product($powders->id, [
            'name' => 'Organic Ashwagandha Powder',
            'slug' => 'organic-ashwagandha-powder',
            'tagline' => 'Root powder for calm strength.',
            'description' => '100% pure ashwagandha root powder — traditionally used to support stress balance and everyday stamina.',
            'status' => 'active',
            'accent' => 'powder',
            'image' => 'products/organic-ashwagandha-powder.jpg',
            'variants' => [
                ['sku' => 'PWD-ASH-100', 'label' => '100 g', 'price_inr' => 299, 'stock' => 35],
            ],
        ]);

        $this->product($powders->id, [
            'name' => 'Organic Shatavari Powder',
            'slug' => 'organic-shatavari-powder',
            'tagline' => 'Queen of herbs for women’s wellness.',
            'description' => 'Pure shatavari powder for daily herbal routines — mix with warm milk or water.',
            'status' => 'active',
            'accent' => 'powder',
            'image' => 'products/organic-shatavari-powder.jpg',
            'variants' => [
                ['sku' => 'PWD-SHA-100', 'label' => '100 g', 'price_inr' => 329, 'stock' => 28],
            ],
        ]);

        $this->product($seeds->id, [
            'name' => 'Pumpkin Seeds',
            'slug' => 'pumpkin-seeds',
            'tagline' => 'Magnesium, zinc, and clean snacking.',
            'description' => 'Fresh, unprocessed pumpkin seeds — roast lightly or sprinkle on salads and breakfast bowls.',
            'status' => 'active',
            'accent' => 'seed',
            'image' => 'products/pumpkin-seeds.jpg',
            'variants' => [
                ['sku' => 'SEED-PUMP-200', 'label' => '200 g', 'price_inr' => 199, 'stock' => 30],
                ['sku' => 'SEED-PUMP-500', 'label' => '500 g', 'price_inr' => 449, 'stock' => 18],
            ],
        ]);

        $this->product($makhana->id, [
            'name' => 'Organic Makhana',
            'slug' => 'organic-makhana',
            'tagline' => 'Light, crunchy, farm-sourced.',
            'description' => 'Crisp fox nuts for mindful snacking — roast with ghee and rock salt for a classic treat.',
            'status' => 'active',
            'accent' => 'makhana',
            'image' => 'products/organic-makhana.jpg',
            'variants' => [
                ['sku' => 'MAK-200', 'label' => '200 g', 'price_inr' => 249, 'stock' => 22],
                ['sku' => 'MAK-500', 'label' => '500 g', 'price_inr' => 549, 'stock' => 18],
            ],
        ]);

        $this->seedOrders();
    }

    private function seedOrders(): void
    {
        $this->ensureOrder(
            [
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
            ],
            [
                ['title' => 'A2 Gir Cow Ghee · 1 Litre', 'sku' => 'GHEE-1L', 'qty' => 1, 'unit_price_inr' => 1899],
            ],
            ['Order placed', 'Payment confirmed', 'Queued for packing']
        );

        $this->ensureOrder(
            [
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
            ],
            [
                ['title' => 'Cold Pressed Sunflower Oil · 1 Litre', 'sku' => 'OIL-SF-1L', 'qty' => 1, 'unit_price_inr' => 499],
                ['title' => 'Organic Moringa Powder · 100 g', 'sku' => 'PWD-MOR-100', 'qty' => 2, 'unit_price_inr' => 249],
                ['title' => 'Organic Makhana · 200 g', 'sku' => 'MAK-200', 'qty' => 1, 'unit_price_inr' => 249],
            ],
            ['Order placed', 'Packing started']
        );

        $this->ensureOrder(
            [
                'number' => 'KF-1002',
                'customer_name' => 'Neha Iyer',
                'customer_email' => 'neha@example.com',
                'phone' => '+91 98111 44556',
                'payment_status' => 'paid',
                'fulfillment_status' => 'ready_to_ship',
                'total_inr' => 848,
                'address' => '22 Palm Grove, Indiranagar',
                'city' => 'Bengaluru',
                'pincode' => '560038',
                'packing_notes' => 'Gift wrap',
            ],
            [
                ['title' => 'Organic Ashwagandha Powder · 100 g', 'sku' => 'PWD-ASH-100', 'qty' => 1, 'unit_price_inr' => 299],
                ['title' => 'Organic Shatavari Powder · 100 g', 'sku' => 'PWD-SHA-100', 'qty' => 1, 'unit_price_inr' => 329],
                ['title' => 'Pumpkin Seeds · 200 g', 'sku' => 'SEED-PUMP-200', 'qty' => 1, 'unit_price_inr' => 199],
            ],
            ['Order placed', 'Packed', 'Ready to ship']
        );

        $this->ensureOrder(
            [
                'number' => 'KF-1001',
                'customer_name' => 'Vikram Desai',
                'customer_email' => 'vikram@example.com',
                'phone' => '+91 99000 77889',
                'payment_status' => 'unpaid',
                'fulfillment_status' => 'awaiting_payment',
                'total_inr' => 999,
                'address' => '5 Riverfront Heights',
                'city' => 'Surat',
                'pincode' => '395007',
            ],
            [
                ['title' => 'A2 Gir Cow Ghee · 500 ml', 'sku' => 'GHEE-500', 'qty' => 1, 'unit_price_inr' => 999],
            ],
            ['Order placed — awaiting payment']
        );
    }

    private function ensureOrder(array $orderData, array $items, array $events): void
    {
        $order = Order::query()->firstOrCreate(
            ['number' => $orderData['number']],
            $orderData
        );

        if ($order->items()->count() === 0) {
            $order->items()->createMany($items);
        }

        if ($order->events()->count() === 0) {
            foreach ($events as $label) {
                $order->recordEvent($label);
            }
        }
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
