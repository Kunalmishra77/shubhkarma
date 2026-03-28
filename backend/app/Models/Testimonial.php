<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'puja_id',
        'name',
        'location',
        'text',
        'rating',
        'image',
        'verified',
        'published_at',
    ];

    protected $casts = [
        'rating'       => 'integer',
        'verified'     => 'boolean',
        'published_at' => 'date',
    ];

    public function puja()
    {
        return $this->belongsTo(Puja::class);
    }

    public function scopeVerified($query)
    {
        return $query->where('verified', true);
    }
}
