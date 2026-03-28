<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Puja extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category_id',
        'short_description',
        'description',
        'image',
        'gallery_images',
        'rating',
        'reviews_count',
        'bookings_count',
        'duration',
        'tags',
        'benefits',
        'tiers',
        'samagri_list',
        'featured',
        'active',
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'tags'           => 'array',
        'benefits'       => 'array',
        'tiers'          => 'array',   // { basic: {}, standard: {}, premium: {} }
        'samagri_list'   => 'array',
        'rating'         => 'decimal:1',
        'featured'       => 'boolean',
        'active'         => 'boolean',
    ];

    /* ── Relationships ───────────────────────── */

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function pandits()
    {
        return $this->belongsToMany(Pandit::class, 'puja_pandit');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function testimonials()
    {
        return $this->hasMany(Testimonial::class);
    }

    /* ── Scopes ──────────────────────────────── */

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeByCategory($query, $categorySlug)
    {
        return $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
    }
}
