<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => $this->summaries(),
        ]);
    }

    public function show(string $id): JsonResponse
    {
        if (str_starts_with($id, 'u-')) {
            $user = User::query()->where('is_admin', false)->findOrFail((int) substr($id, 2));
            $orders = Order::query()
                ->where('user_id', $user->id)
                ->orderByDesc('created_at')
                ->get();

            return response()->json([
                'data' => [
                    'id' => 'u-'.$user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'orders' => $orders->count(),
                    'spent_inr' => (int) $orders->where('payment_status', 'paid')->sum('total_inr'),
                    'addresses' => $orders
                        ->map(fn (Order $o) => [
                            'line' => $o->address,
                            'city' => $o->city,
                            'pincode' => $o->pincode,
                        ])
                        ->unique(fn ($a) => $a['line'].'|'.$a['pincode'])
                        ->values(),
                    'recent_orders' => $orders->take(20)->map(fn (Order $o) => $this->orderBrief($o))->values(),
                ],
            ]);
        }

        if (str_starts_with($id, 'g-')) {
            $hash = substr($id, 2);
            $orders = Order::query()
                ->whereNull('user_id')
                ->orderByDesc('created_at')
                ->get()
                ->filter(fn (Order $o) => md5($o->customer_email) === $hash)
                ->values();

            abort_if($orders->isEmpty(), 404);

            $first = $orders->first();

            return response()->json([
                'data' => [
                    'id' => 'g-'.md5($first->customer_email),
                    'name' => $first->customer_name,
                    'email' => $first->customer_email,
                    'phone' => $first->phone,
                    'orders' => $orders->count(),
                    'spent_inr' => (int) $orders->where('payment_status', 'paid')->sum('total_inr'),
                    'addresses' => $orders
                        ->map(fn (Order $o) => [
                            'line' => $o->address,
                            'city' => $o->city,
                            'pincode' => $o->pincode,
                        ])
                        ->unique(fn ($a) => $a['line'].'|'.$a['pincode'])
                        ->values(),
                    'recent_orders' => $orders->take(20)->map(fn (Order $o) => $this->orderBrief($o))->values(),
                ],
            ]);
        }

        abort(404);
    }

    /** @return \Illuminate\Support\Collection<int, array<string, mixed>> */
    private function summaries()
    {
        $fromUsers = User::query()
            ->where('is_admin', false)
            ->withCount('orders')
            ->get()
            ->map(fn (User $u) => [
                'id' => 'u-'.$u->id,
                'name' => $u->name,
                'email' => $u->email,
                'orders' => $u->orders_count,
                'spent_inr' => (int) Order::query()
                    ->where('user_id', $u->id)
                    ->where('payment_status', 'paid')
                    ->sum('total_inr'),
            ]);

        $guestEmails = Order::query()
            ->whereNull('user_id')
            ->select('customer_email', 'customer_name', DB::raw('COUNT(*) as orders'), DB::raw("SUM(CASE WHEN payment_status = 'paid' THEN total_inr ELSE 0 END) as spent_inr"))
            ->groupBy('customer_email', 'customer_name')
            ->get()
            ->map(fn ($row) => [
                'id' => 'g-'.md5($row->customer_email),
                'name' => $row->customer_name,
                'email' => $row->customer_email,
                'orders' => (int) $row->orders,
                'spent_inr' => (int) $row->spent_inr,
            ]);

        return $fromUsers->concat($guestEmails)->values();
    }

    private function orderBrief(Order $o): array
    {
        return [
            'id' => $o->id,
            'number' => $o->number,
            'payment_status' => $o->payment_status,
            'fulfillment_status' => $o->fulfillment_status,
            'total_inr' => $o->total_inr,
            'created_at' => optional($o->created_at)?->format('Y-m-d H:i'),
        ];
    }
}
