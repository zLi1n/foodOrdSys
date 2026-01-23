<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FoodType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class FoodTypeController extends Controller
{
    public function index()
    {
        return response()->json(
            FoodType::orderBy('name')->get()
        );
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin();

        $request->validate([
            'name' => 'required|string|max:255|unique:food_types,name',
        ]);

        $type = FoodType::create($request->all());

        return response()->json($type, 201);
    }

    public function update(Request $request, $id)
    {
        $this->authorizeAdmin();

        $type = FoodType::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:food_types,name,' . $id,
        ]);

        $type->update($request->only([
            'name',
        ]));

        return response()->json($type);
    }

    public function destroy($id)
    {
        $this->authorizeAdmin();

        FoodType::findOrFail($id)->delete();

        return response()->json(['message' => 'Food type deleted']);
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
