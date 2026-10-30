<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    private const FULFILLMENT = [
        'awaiting_payment', 'to_pack', 'packing', 'ready_to_ship',
        'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned',
    ];

    public function index(Request $request): JsonResponse
    {
        $query = Order::query()->withCount('items')->orderByDesc('created_at');

        if ($request->filled('fulfillment_status')) {
            $query->where('fulfillment_status', $request->string('fulfillment_status'));
        }
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->string('payment_status'));
        }

        $orders = $query->get()->map(fn (Order $o) => $this->listItem($o));

        return response()->json(['data' => $orders]);
    }

    public function show(Order $order): JsonResponse
    {
        $order->load(['items', 'events']);

        return response()->json(['data' => $this->detail($order)]);
    }

    public function update(Request $request, Order $order): JsonResponse
    {
        $data = $request->validate([
            'fulfillment_status' => ['sometimes', Rule::in(self::FULFILLMENT)],
            'packing_notes' => ['nullable', 'string'],
            'payment_status' => ['sometimes', Rule::in(['unpaid', 'paid', 'refunded', 'failed'])],
        ]);

        if (isset($data['fulfillment_status']) && $data['fulfillment_status'] !== $order->fulfillment_status) {
            $order->fulfillment_status = $data['fulfillment_status'];
            $order->recordEvent('Status → '.$data['fulfillment_status']);
        }

        if (array_key_exists('packing_notes', $data)) {
            $order->packing_notes = $data['packing_notes'];
        }
        if (isset($data['payment_status'])) {
            $order->payment_status = $data['payment_status'];
        }

        $order->save();

        return response()->json(['data' => $this->detail($order->fresh(['items', 'events']))]);
    }

    public function updateShipment(Request $request, Order $order): JsonResponse
    {
        $data = $request->validate([
            'carrier' => ['required', 'string', 'max:255'],
            'tracking_number' => ['required', 'string', 'max:255'],
            'tracking_url' => ['nullable', 'url'],
            'estimated_delivery' => ['nullable', 'date'],
            'mark_shipped' => ['boolean'],
        ]);

        $order->fill([
            'carrier' => $data['carrier'],
            'tracking_number' => $data['tracking_number'],
            'tracking_url' => $data['tracking_url'] ?? null,
            'estimated_delivery' => $data['estimated_delivery'] ?? null,
        ]);

        if ($request->boolean('mark_shipped', true)) {
            $order->fulfillment_status = 'shipped';
            $order->shipped_at = $order->shipped_at ?? now();
        }

        $order->save();
        $order->recordEvent(sprintf(
            'Shipment updated · %s · %s',
            $data['carrier'],
            $data['tracking_number']
        ));

        return response()->json(['data' => $this->detail($order->fresh(['items', 'events']))]);
    }

    public function bulk(Request $request): JsonResponse
    {
        $data = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:orders,id'],
            'fulfillment_status' => ['required', Rule::in(self::FULFILLMENT)],
        ]);

        $updated = 0;

        DB::transaction(function () use ($data, &$updated) {
            $orders = Order::query()->whereIn('id', $data['ids'])->get();
            foreach ($orders as $order) {
                if ($order->payment_status !== 'paid' && $data['fulfillment_status'] !== 'cancelled') {
                    continue;
                }
                $order->fulfillment_status = $data['fulfillment_status'];
                if ($data['fulfillment_status'] === 'delivered') {
                    $order->delivered_at = now();
                }
                if ($data['fulfillment_status'] === 'shipped') {
                    $order->shipped_at = $order->shipped_at ?? now();
                }
                $order->save();
                $order->recordEvent('Bulk update → '.$data['fulfillment_status']);
                $updated++;
            }
        });

        return response()->json([
            'updated' => $updated,
            'fulfillment_status' => $data['fulfillment_status'],
        ]);
    }

    private function listItem(Order $o): array
    {
        return [
            'id' => $o->id,
            'number' => $o->number,
            'customer_name' => $o->customer_name,
            'customer_email' => $o->customer_email,
            'payment_status' => $o->payment_status,
            'fulfillment_status' => $o->fulfillment_status,
            'total_inr' => $o->total_inr,
            'item_count' => $o->items_count ?? $o->itemCount(),
            'city' => $o->city,
            'carrier' => $o->carrier,
            'tracking_number' => $o->tracking_number,
            'created_at' => optional($o->created_at)?->format('Y-m-d H:i'),
        ];
    }

    private function detail(Order $o): array
    {
        return [
            ...$this->listItem($o),
            'phone' => $o->phone,
            'address' => $o->address,
            'pincode' => $o->pincode,
            'packing_notes' => $o->packing_notes,
            'shipment' => [
                'carrier' => $o->carrier,
                'tracking_number' => $o->tracking_number,
                'tracking_url' => $o->tracking_url,
                'shipped_at' => optional($o->shipped_at)?->toDateString(),
                'estimated_delivery' => optional($o->estimated_delivery)?->toDateString(),
                'delivered_at' => optional($o->delivered_at)?->format('Y-m-d H:i'),
            ],
            'items' => $o->items->map(fn ($i) => [
                'id' => $i->id,
                'title' => $i->title,
                'sku' => $i->sku,
                'qty' => $i->qty,
                'unit_price_inr' => $i->unit_price_inr,
            ])->values(),
            'timeline' => $o->events->map(fn ($e) => [
                'at' => optional($e->occurred_at)?->format('Y-m-d H:i'),
                'label' => $e->label,
            ])->values(),
        ];
    }
}
