<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TargetAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'business_pillar_id',
        'assigned_sales_id',
        'priority',
        'status',
        'notes',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function businessPillar(): BelongsTo
    {
        return $this->belongsTo(BusinessPillar::class);
    }

    public function assignedSales(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_sales_id');
    }

    public function outreaches(): HasMany
    {
        return $this->hasMany(Outreach::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }

    // Local Scope: Restrict Sales Rep to their own Target Accounts
    public function scopeForUser(Builder $query, User $user): Builder
    {
        if ($user->hasRole('Sales Rep')) {
            return $query->where('assigned_sales_id', $user->id);
        }

        return $query;
    }
}