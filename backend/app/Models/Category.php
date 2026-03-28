<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'icon',
        'image',
        'featured',
        'order',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'order'    => 'integer',
    ];

    /* ── Relationships ───────────────────────── */

    public function pujas()
    {
        return $this->hasMany(Puja::class);
    }

    /* ── Scopes ──────────────────────────────── */

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
