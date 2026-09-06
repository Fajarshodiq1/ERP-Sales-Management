<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Outreach extends Model
{
    use HasFactory;

    protected $fillable = [
        'target_account_id',
        'contact_id',
        'user_id',
        'channel',
        'outreach_date',
        'result',
        'notes',
    ];

    protected $casts = [
        'outreach_date' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function targetAccount(): BelongsTo
    {
        return $this->belongsTo(TargetAccount::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForUser(Builder $query, User $user): Builder
    {
        if ($user->hasRole('Sales Rep')) {
            return $query->where('user_id', $user->id);
        }

        return $query;
    }
}