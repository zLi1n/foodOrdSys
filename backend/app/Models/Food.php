<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
    use HasFactory;
    
    protected $table = 'foods';
    protected $fillable = ['food_type_id', 'name', 'description', 'price', 'image', 'stock_quantity'];
    protected $appends = ['image_url'];
    
    public function foodType()
    {
        return $this->belongsTo(FoodType::class, 'food_type_id');
    }
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function getImageUrlAttribute()
    {
        return $this->image
            ? asset('storage/' . $this->image)
            : null;
    }

}
