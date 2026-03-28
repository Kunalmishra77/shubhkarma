<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SamagriProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'samagri_category_id',
        'price',
        'original_price',
        'description',
        'puja_tags',
        'weight',
        'image',
        'images',
        'in_stock',
        'rating',
        'reviews_count',
        'featured',
    ];

    protected $casts = [
        'puja_tags'      => 'array',
        'images'         => 'array',
        'price'          => 'decimal:2',
        'original_price' => 'decimal:2',
        'rating'         => 'decimal:1',
        'in_stock'       => 'boolean',
        'featured'       => 'boolean',
    ];

    /* ── Relationships ───────────────────────── */

    public function samagriCategory()
    {
        return $this->belongsTo(SamagriCategory::class);
    }

    /* ── Accessors ───────────────────────────── */

    public function getDiscountPercentAttribute(): int
    {
        if (!$this->original_price || $this->original_price <= $this->price) {
            return 0;
        }
        return (int) round((($this->original_price - $this->price) / $this->original_price) * 100);
    }

    /* ── Scopes ──────────────────────────────── */

    public function scopeInStock($query)
    {
        return $query->where('in_stock', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }
}
