<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Food;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    public function index()
    {
        $order=Order::with('items.food')->where('status', 'pending')->where('user_id', Auth::id())->first();
        return response()->json($order?->items??[]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'food_id' => 'required|exists:foods,id',
            'quantity' => 'required|integer|min:1',
            'additional_notes' => 'nullable|string',
        ]);
        $order = Order::firstOrCreate(
            [
                'user_id' => Auth::id(),
                'status' => 'pending'
            ],
            [
                'total_amount' => 0
            ]
        );

        $food = Food::findOrFail($request->food_id);
        if ($food->stock_quantity !== null && $food->stock_quantity < $request->quantity) {
            return response()->json(['message' => 'Insufficient stock'], 400);
        }
        $item = $order->items()->where('food_id', $food->id)->first();
        if ($item) {
            $newQty = $item->quantity + $request->quantity;

            if ($food->stock_quantity !== null && $food->stock_quantity < $newQty) {
                return response()->json(['message' => 'Insufficient stock'], 400);
            }

            $item->update(['quantity' => $newQty]);
        } else {
            $item = $order->items()->create([
                'food_id' => $food->id,
                'quantity' => $request->quantity,
                'additional_notes' => $request->additional_notes,
            ]);
        }
        $order->total_amount = $order->calculateTotalAmount();
        $order->save();
        return response()->json($item, 201);
    }

    public function update(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);
        $item = OrderItem::where('id', $itemId)
            ->whereHas('order', function ($q) {
                $q->where('user_id', Auth::id())
                  ->where('status', 'pending');
            })->firstOrFail();

        $food = $item->food;

        if ($food->stock_quantity !== null && $food->stock_quantity < $request->quantity) {
            return response()->json(['message' => 'Insufficient stock'], 400);
        }

        $item->update(['quantity' => $request->quantity]);

        $order = $item->order;
        $order->total_amount = $order->calculateTotalAmount();
        $order->save();

        return response()->json($item);
    }

    public function destroy($itemId)
    {
        $item = OrderItem::where('id', $itemId)
            ->whereHas('order', function ($q) {
                $q->where('user_id', Auth::id())
                  ->where('status', 'pending');
            })
            ->firstOrFail();

        $order = $item->order;

        $item->delete();

        $order->total_amount = $order->calculateTotalAmount();
        $order->save();

        return response()->json(['message' => 'Item removed']);
    }

}
