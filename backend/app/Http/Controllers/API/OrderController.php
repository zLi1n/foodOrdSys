<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Food;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function create()
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $order = Order::where('user_id', $user->id)->where('status', 'pending')->first();
        if (!$order) {
            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'total_amount' => 0, 
            ]);
        }
        return response()->json($order);
    }

    public function showOrderItems($orderId)
    {
        $order = Order::with('items.food')->where('id', $orderId)->where('user_id', Auth::id())->firstOrFail();
        return response()->json($order);
    }

    public function myOrders()
    {
        $orders = Order::with('items.food')->where('user_id', Auth::id())->where('status', '!=', 'pending')->latest()->get()->map(function ($order) {
            $order->total_amount = $order->calculateTotalAmount();
            return [
                'id' => $order->id,
                'status' => $order->status,
                'total_amount' => $order->total_amount,
                'created_at' => $order->created_at,
                'items' => $order->items->map(function ($item) {
                    return [
                        'food_name' => $item->food->name,
                        'quantity' => $item->quantity,
                        'price' => $item->food->price,
                        'image_url' => $item->food->image_url, 
                    ];
                }),
            ];
        });
        return response()->json($orders);
    }

    public function confirm($orderId)
    {
        $order = Order::with('items.food')
            ->where('id', $orderId)
            ->where('user_id', Auth::id())
            ->where('status', 'pending')
            ->firstOrFail();

        if ($order->items()->count() === 0) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        foreach ($order->items as $item) {
            $food = $item->food;

            if ($food->stock_quantity !== null && $food->stock_quantity < $item->quantity) {
                return response()->json([
                    'message' => "Insufficient stock for {$food->name}"
                ], 400);
            }
        }

        foreach ($order->items as $item) {
            $food = $item->food;

            if ($food->stock_quantity !== null) {
                $food->decrement('stock_quantity', $item->quantity);
            }
        }

        $order->total_amount = $order->calculateTotalAmount();
        $order->status = 'preparing';
        $order->save();

        return response()->json(['message' => 'Order confirmed', 'order' => $order]);
    }

     public function adminOrders()
    {
        $this->authorizeAdmin();
        $orders = Order::with('items.food', 'user')->latest()->get();
        return response()->json($orders);
    }

    public function updateStatus(Request $request, $orderId)
    {
        $this->authorizeAdmin();
        $request->validate([
            'status' => 'required|in:preparing,completed,canceled',
        ]);
        $order = Order::findOrFail($orderId);
        $order->status = $request->status;
        $order->save();
        return response()->json($order);
    }

    private function authorizeAdmin()
    {
        $user = Auth::user();

        /** @var User $user */
        if (!$user || !$user->isAdmin()) {
            abort(403, 'Unauthorized');
        }
    }
}
