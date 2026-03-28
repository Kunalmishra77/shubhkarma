<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pandit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'title',
        'experience',
        'expertise',
        'specializations',
        'languages',
        'rating',
        'reviews_count',
        'completed_pujas',
        'location',
        'available',
        'featured',
        'image',
        'bio',
        'certifications',
    ];

    protected $casts = [
        'expertise'       => 'array',
        'specializations' => 'array',
        'languages'       => 'array',
        'certifications'  => 'array',
        'rating'          => 'decimal:1',
        'available'       => 'boolean',
        'featured'        => 'boolean',
    ];

    /* ── Relationships ───────────────────────── */

    public function pujas()
    {
        return $this->belongsToMany(Puja::class, 'puja_pandit');
    }

    /* ── Scopes ──────────────────────────────── */

    public function scopeAvailable($query)
    {
        return $query->where('available', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }
}
