<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Food;
use App\Models\FoodType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class FoodController extends Controller
{

    public function index()
    {
        $now = now()->format('H:i:s');

        $foodTypes = FoodType::with(['foods' => function ($query) {
            $query->where(function ($q) {
                // stock: NULL = unlimited
                $q->whereNull('stock_quantity')
                  ->orWhere('stock_quantity', '>', 0);
            });
        }])
        ->orderBy('name')
        ->get();

        return response()->json($foodTypes);
    }

    public function byType($typeId)
    {
        $now = now()->format('H:i:s');

        $foods = Food::where('food_type_id', $typeId)
            ->where(function ($q) {
                $q->whereNull('stock_quantity')
                  ->orWhere('stock_quantity', '>', 0);
            })
            ->get();

        return response()->json($foods);
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin();

        $request->validate([
            'food_type_id' => 'required|exists:food_types,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('foods', 'public');
        }

        $food = Food::create([
            'food_type_id' => $request->food_type_id,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock_quantity' => $request->stock_quantity,
            'image' => $imagePath,
        ]);

        return response()->json($food, 201);
    }

    public function update(Request $request, $id)
    {
        $this->authorizeAdmin();

        $food = Food::findOrFail($id);

        $request->validate([
            'food_type_id' => 'required|exists:food_types,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            if ($food->image) {
                Storage::disk('public')->delete($food->image);
            }
            $imagePath = $request->file('image')->store('foods', 'public');
            $food->image = $imagePath;
            $food->save();
        }

        $food->update([
            'food_type_id' => $request->food_type_id,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock_quantity' => $request->stock_quantity,
        ]);

        return response()->json($food);
    }

    public function destroy($id)
    {
        $this->authorizeAdmin();

        $food = Food::findOrFail($id);

        if ($food->image) {
            Storage::disk('public')->delete($food->image);
        }

        Food::findOrFail($id)->delete();

        return response()->json(['message' => 'Food deleted']);
    }

    public function adminIndex()
    {
        $this->authorizeAdmin();
        return Food::with('foodType')->orderBy('created_at', 'desc')->get();
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
