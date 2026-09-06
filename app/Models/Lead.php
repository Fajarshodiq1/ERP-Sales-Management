<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'lead_name',
        'account_id',
        'contact_id',
        'business_pillar_id',
        'user_id',
        'sourceable_type',
        'sourceable_id',
        'lead_source',
        'status',
        'potential_need',
        'notes',
        'qualified_at',
    ];

    protected $casts = [
        'qualified_at' => 'datetime',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function businessPillar(): BelongsTo
    {
        return $this->belongsTo(BusinessPillar::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sourceable(): MorphTo
    {
        return $this->morphTo();
    }
}