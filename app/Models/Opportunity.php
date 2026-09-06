<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Opportunity extends Model
{
    use HasFactory; // Trait HasUuids dihapus

    protected $fillable = [
        'opportunity_name',
        'lead_id',
        'account_id',
        'contact_id',
        'business_pillar_id',
        'user_id',
        'potential_value',
        'probability',
        'estimated_gp',
        'stage',
        'expected_closing_date',
        'description',
    ];

    protected $casts = [
        'potential_value' => 'decimal:2',
        'estimated_gp' => 'decimal:2',
        'probability' => 'integer',
        'expected_closing_date' => 'date',
    ];

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

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

    public function activities(): MorphMany
    {
        return $this->morphMany(Activity::class, 'subject');
    }

    public function followUps(): MorphMany
    {
        return $this->morphMany(FollowUp::class, 'subject');
    }
}