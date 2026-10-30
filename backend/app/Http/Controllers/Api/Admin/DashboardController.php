<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $activeProducts = Product::query()->where('status', 'active')->count();
        $openOrders = Order::query()
            ->whereIn('fulfillment_status', [
                'to_pack', 'packing', 'ready_to_ship', 'shipped', 'out_for_delivery',
            ])
            ->count();
        $lowStock = ProductVariant::query()->where('stock', '>', 0)->where('stock', '<', 20)->count();
        $gmv = (int) Order::query()->where('payment_status', 'paid')->sum('total_inr');

        return response()->json([
            'data' => [
                'active_products' => $activeProducts,
                'open_orders' => $openOrders,
                'low_stock_skus' => $lowStock,
                'paid_gmv_inr' => $gmv,
            ],
        ]);
    }
}
