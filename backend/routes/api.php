<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\API\OrderController;

Route::middleware('auth:sanctum')->group(function () {

    // User
    Route::post('/orders', [OrderController::class, 'create']);
    Route::get('/orders/{id}', [OrderController::class, 'showOrderItems']);
    Route::get('/orders', [OrderController::class, 'myOrders']);
    Route::post('/orders/{id}/confirm', [OrderController::class, 'confirm']);

    // Admin
    Route::get('/admin/orders', [OrderController::class, 'adminOrders']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
});

use App\Http\Controllers\API\OrderItemController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart/items', [OrderItemController::class, 'index']);
    Route::post('/cart/items', [OrderItemController::class, 'store']);
    Route::put('/cart/items/{id}', [OrderItemController::class, 'update']);
    Route::delete('/cart/items/{id}', [OrderItemController::class, 'destroy']);
});

use App\Http\Controllers\API\FoodTypeController;

Route::get('/food-types', [FoodTypeController::class, 'index']);

Route::middleware('auth:sanctum')->prefix('/admin')->group(function () {
    Route::post('/food-types', [FoodTypeController::class, 'store']);
    Route::put('/food-types/{id}', [FoodTypeController::class, 'update']);
    Route::delete('/food-types/{id}', [FoodTypeController::class, 'destroy']);
});

use App\Http\Controllers\API\FoodController;

Route::get('/foods', [FoodController::class, 'index']);
Route::get('/foods/type/{id}', [FoodController::class, 'byType']);

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('/admin')->group(function () {
        Route::get('/foods', [FoodController::class, 'adminIndex']);
        Route::post('/foods', [FoodController::class, 'store']);
        Route::put('/foods/{id}', [FoodController::class, 'update']);
        Route::delete('/foods/{id}', [FoodController::class, 'destroy']);
    });
});

use App\Http\Controllers\API\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    Route::post('/admin/create', [AuthController::class, 'createAdmin']);
});
