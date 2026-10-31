<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
            'address' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:120'],
            'pincode' => ['required', 'string', 'max:12'],
            'payment_method' => ['required', 'in:cod,prepaid'],
            'packing_notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.variant_id' => ['required', 'integer', 'exists:product_variants,id'],
            'items.*.qty' => ['required', 'integer', 'min:1', 'max:20'],
        ]);

        $order = DB::transaction(function () use ($data) {
            $lines = [];
            $total = 0;

            foreach ($data['items'] as $item) {
                /** @var ProductVariant $variant */
                $variant = ProductVariant::query()
                    ->with('product')
                    ->lockForUpdate()
                    ->findOrFail($item['variant_id']);

                if ($variant->stock < $item['qty']) {
                    throw ValidationException::withMessages([
                        'items' => ["Insufficient stock for {$variant->label}."],
                    ]);
                }

                $title = trim(($variant->product?->name ?? 'Product').' · '.$variant->label);
                $lineTotal = $variant->price_inr * $item['qty'];
                $total += $lineTotal;

                $lines[] = [
                    'variant' => $variant,
                    'qty' => $item['qty'],
                    'title' => $title,
                    'sku' => $variant->sku,
                    'unit_price_inr' => $variant->price_inr,
                ];
            }

            $paymentMethod = $data['payment_method'];
            $paymentStatus = 'unpaid';
            $fulfillment = $paymentMethod === 'cod' ? 'to_pack' : 'awaiting_payment';

            $notes = $data['packing_notes'] ?? null;
            $methodNote = $paymentMethod === 'cod' ? 'Payment: Cash on delivery' : 'Payment: Prepaid (awaiting confirmation)';
            $notes = $notes ? $methodNote."\n".$notes : $methodNote;

            $order = Order::query()->create([
                'number' => $this->nextOrderNumber(),
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'],
                'phone' => $data['phone'],
                'payment_status' => $paymentStatus,
                'fulfillment_status' => $fulfillment,
                'total_inr' => $total,
                'address' => $data['address'],
                'city' => $data['city'],
                'pincode' => $data['pincode'],
                'packing_notes' => $notes,
            ]);

            foreach ($lines as $line) {
                $order->items()->create([
                    'product_variant_id' => $line['variant']->id,
                    'title' => $line['title'],
                    'sku' => $line['sku'],
                    'qty' => $line['qty'],
                    'unit_price_inr' => $line['unit_price_inr'],
                ]);
                $line['variant']->decrement('stock', $line['qty']);
            }

            $order->recordEvent('Order placed ('.$paymentMethod.')');

            return $order->load('items');
        });

        return response()->json([
            'data' => $this->serialize($order),
        ], 201);
    }

    public function show(Request $request, string $number): JsonResponse
    {
        $email = $request->validate([
            'email' => ['required', 'email'],
        ])['email'];

        $order = Order::query()
            ->with('items')
            ->where('number', $number)
            ->where('customer_email', $email)
            ->firstOrFail();

        return response()->json(['data' => $this->serialize($order)]);
    }

    private function nextOrderNumber(): string
    {
        $latest = Order::query()->orderByDesc('id')->value('number');
        $n = 1000;
        if (is_string($latest) && preg_match('/KF-(\d+)/', $latest, $m)) {
            $n = (int) $m[1];
        }

        return 'KF-'.($n + 1);
    }

    private function serialize(Order $order): array
    {
        return [
            'id' => $order->id,
            'number' => $order->number,
            'customer_name' => $order->customer_name,
            'customer_email' => $order->customer_email,
            'phone' => $order->phone,
            'payment_status' => $order->payment_status,
            'fulfillment_status' => $order->fulfillment_status,
            'total_inr' => $order->total_inr,
            'address' => $order->address,
            'city' => $order->city,
            'pincode' => $order->pincode,
            'items' => $order->items->map(fn ($i) => [
                'title' => $i->title,
                'sku' => $i->sku,
                'qty' => $i->qty,
                'unit_price_inr' => $i->unit_price_inr,
                'line_total_inr' => $i->qty * $i->unit_price_inr,
            ])->values(),
        ];
    }
}
