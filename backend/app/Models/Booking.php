<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_number',
        'puja_id',
        'package_tier',     // basic | standard | premium
        'customer_name',
        'customer_phone',
        'customer_email',
        'puja_date',
        'puja_time',
        'address',
        'city',
        'pincode',
        'notes',
        'amount',
        'status',           // pending | confirmed | completed | cancelled
        'payment_status',   // unpaid | partial | paid
    ];

    protected $casts = [
        'puja_date' => 'date',
        'amount'    => 'decimal:2',
    ];

    /* ── Relationships ───────────────────────── */

    public function puja()
    {
        return $this->belongsTo(Puja::class);
    }

    /* ── Boot ────────────────────────────────── */

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            $booking->booking_number = 'SK-' . strtoupper(uniqid());
            $booking->status         = $booking->status ?? 'pending';
            $booking->payment_status = $booking->payment_status ?? 'unpaid';
        });
    }

    /* ── Scopes ──────────────────────────────── */

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
