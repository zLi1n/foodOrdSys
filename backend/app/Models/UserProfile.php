<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'phone_number', 'date_of_birth', 'profile_picture'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
