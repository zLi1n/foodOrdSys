<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'total_amount', 'status'];
    public function items()    
    {    
        return $this->hasMany(OrderItem::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function calculateTotalAmount()
    {
        $items = $this->relationLoaded('items')
            ? $this->items
            : $this->items()->with('food')->get();

        return $items->sum(fn ($item) => $item->quantity * $item->food->price);
    }

}